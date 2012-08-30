//region Tips & Trics
//to hide use this
//$("a", alert_menu).closest('.ui-btn').hide();
//endregion Tips & Trics

//region Mobile transitions fix
$(document).one("mobileinit", function () {

    // Setting #container div as a jqm pageContainer
    $.mobile.pageContainer = $('#container');

    // Setting default page transition to slide
    $.mobile.defaultPageTransition = 'none';
    $.mobile.ajaxEnabled = false;

});
//endregion

api = new HelpDeskAPI();

//region Connection
function checkConnection() {
    var networkState = navigator.network.connection.type;

    var states = {};
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.NONE]     = 'No network connection';

    if(states[networkState]==states[Connection.NONE]){// || states[networkState]==states[Connection.UNKNOWN]){
        alert('A network connection is required to access this page.');
        //return false;
    } else {
        //alert(states[networkState]);
        //return true;
    }
}
//endregion

//region Storage Functions
function getStorage(key)
{
    localStorage.length;
    var value = localStorage.getItem(key);
    if (value && (value.indexOf("{") == 0 || value.indexOf("[") == 0))
    {
        return JSON.parse(value);
    }
    return value;
}

function setStorage(key, value)
{
    localStorage.length;
    localStorage.setItem(key, typeof value !== 'string' ? JSON.stringify(value) : value);
}

function clearStorage()
{
    localStorage.length;
    localStorage.clear();
}
//endregion Storage Functions

//region JQuery Mobile binding functions
function pageLoad(page_name, func)
{
    $( document ).delegate("#"+page_name+"_page", "pageshow", func);
}

function pageBeforeshow(page_name, func)
{
    $( document ).delegate("#"+page_name+"_page", "pagebeforeshow", func);
}

var mainloaded = false;

function pageReady(page_name, func)
{
    //Workaround to show page loading on initial page load
    $( document ).delegate("#"+page_name+"_page","pageshow", function(event) {
        if(!mainloaded) {
            $.mobile.showPageLoadingMsg();
        }
    });

    $( document ).delegate("#"+page_name+"_page", "pagecreate", func);
}

function pageInit(page_name, func)
{
    $( document ).delegate("#"+page_name+"_page", "pageinit", func);
}

//endregion JQuery Mobile binding functions

//region All pages wide functions
function checkStorage(changelocation)
{
    //console.log(changelocation && window.location.href.indexOf("home.html")<0);
    var login      = getStorage("login");
    var pass      = getStorage("password");
    var selected_org = getStorage("organization");
    var selected_inst = getStorage("instance");

    if (!login || !pass)
    {
        window.location.replace("login.html");
        return false;
    }
    else
    {
        if (!selected_org || !selected_inst)
        {
            if (window.location.href.indexOf("org_inst.html")<0)
            {
                window.location.replace("org_inst.html");
                return false;
            }
        }
        else
        {
            if (changelocation && window.location.href.indexOf("home.html")<0)
            {
                window.location.replace("home.html");
                return false;
            }
        }
    }
    return true;
}

function logout() {
    var login      = getStorage("login");
    //var pass      = getStorage("password");
    clearStorage();
    setStorage("login", login);
    //setStorage("password", pass);
    window.location.replace("login.html");
    return false;
}

//endregion All pages wide functions

//region Page specific functions
pageLoad("login", function() {
    {
        var form = $("#loginForm");
        $("#email", form).val(getStorage("login"));
        $("#password", form).val(getStorage("password"));
    }
});

pageReady("index", function() {
    {
        checkStorage(true);
    }
});

pageReady("ticketqlist", function(){

    checkStorage(false);
    var t_ticketqlist = Handlebars.compile( $('#ht_tickets_queue_list').html() );

    var parseticketsq = function (data) {
        //console.log(data);
        if (!data)
        {
            return;
        }
        $('ul#tickets_queue_list').empty().append(t_ticketqlist(data) );
    };

    api.ticket_q_list({refresh: "ul#tickets_queue_list","OrganizationKey": getStorage("organization"),"InstanceKey": getStorage("instance")},parseticketsq);

});

pageReady("ticketlist", function(){

    checkStorage(false);
    var parsetickets = function (data) {
        if (!data)
        {
            return;
        }

        //wrapper needed for this
        $('ul#tickets_list').handlebars('ht_tickets_list', {objects:data} );
    };

    var url = $.url(document.location);

    var queueid = url.param("id");

    if (queueid > 0)
        api.queue_ticket_list({"refresh": "ul#tickets_list", "OrganizationKey": getStorage("organization"),"InstanceKey": getStorage("instance"), "Id" : queueid},parsetickets);
    else
        api.ticket_list({"refresh": "ul#tickets_list","OrganizationKey": getStorage("organization"),"InstanceKey": getStorage("instance")},parsetickets);

});

pageReady("ticket_detail_main", function(){

    checkStorage(false);
    var parseticketdetail = function (data) {
        if (!data)
        {
            return;
        }

        //console.log("compile ticket_detail_main");
        if (data.AccountId == -1)
        {
            data.AccountName = data.LocationName;
        }

        $('div.ticket_detail_header').handlebars('ht_ticket_detail_header', data);
        $('div.ticket_short_header').handlebars('ht_ticket_short_header', data);
        $('div#ticket_detail_subject h3').html(data.Subject);
        $('#lb_transfer_remove_user b').html(data.TechnicianFirstName + " " + data.TechnicianLastName);
        $('ul#ticket_detail_response_list').handlebars('ht_ticket_detail_response_list', {objects: data.TicketLogs});

        if (data.CustomFieldsXML == "<root />")
            data.CustomFieldsXML = null;

        $('ul#ticket_info_list').handlebars('ht_ticket_info_list', data);

        $("#ticketId").val(data.Id);
        $("#ticketNumber").val(data.TicketNumber);
        $("#ticketTechnicianType").val(data.TechnicianType);
        //$("#ticketTechnicianName").val();
        $('div.res-gravatar').each(function(){
            var email = $.MD5($(this).data('gravatar'));
            $(this).find('img').attr('src', "http://www.gravatar.com/avatar/" + email+'?d=mm&s=25');
        });
    };

    var url = $.url(document.location);

    var ticketid = url.param("id");

    if (ticketid > 0)
        api.ticket_detail({refresh: "ul#ticket_detail_response_list","OrganizationKey": getStorage("organization"),"InstanceKey": getStorage("instance"), "Id" : ticketid},parseticketdetail);
    else
        history.back();

});

pageReady("ticket_transfer", function(){
    mainloaded = false;
    var t_tickettechnicians_options = Handlebars.compile( $('#ht_tech_list').html() );

    var parsetechnicians = function (data) {
        if (!data)
        {
            return;
        }

        $.each(data, function (index, tech) {
            if ((tech.FirstName + tech.LastName).trim().length == 0)
                data[index].FirstName = tech.Email;
        });

        $('select#tech_list').empty().append(t_tickettechnicians_options(data));
        $('select#tech_list').selectmenu("refresh");
    };
    api.technicians_list({"OrganizationKey": getStorage("organization"),"InstanceKey": getStorage("instance")},parsetechnicians);
});

pageReady("create_ticket", function(){
    mainloaded = false;
    var t_tickettechnicians_options = Handlebars.compile( $('#ht_tech_list').html() );
    var parsetechnicians = function (data) {
        if (!data)
        {
            return;
        }

        $.each(data, function (index, tech) {
            if ((tech.FirstName + tech.LastName).trim().length == 0)
                data[index].FirstName = tech.Email;
        });

        $('select#tech_list').empty();
        $('select#tech_list').append(t_tickettechnicians_options([{"Id":0, "FirstName":"Use System Routing (Default)"}]));
        $('select#tech_list').append(t_tickettechnicians_options(data));
        $("select#tech_list").selectmenu("refresh");
        //$("select#tech_list").val($("select#tech_list option:first").val());
        //$('select#tech_list').listview("refresh");
    };
    api.technicians_list({"OrganizationKey": getStorage("organization"),"InstanceKey": getStorage("instance")},parsetechnicians);
    mainloaded = false;
    var t_ticket_classes = Handlebars.compile( $('#ht_class_list').html() );
    var parseclasses = function (data) {
        if (!data)
        {
            return;
        }

        classes = data;

        $('select#class_list').empty();
        $('select#class_list').append('<option data-last-child="false" value="-1" data-placeholder="true">Choose a class</option>');
        $('select#class_list').append(t_ticket_classes(getParentClasses(classes, 0, '')));
        $("select#class_list").selectmenu("refresh");
        //$('select#tech_list').listview("refresh");
    };
    api.classes_list({"OrganizationKey": getStorage("organization"),"InstanceKey": getStorage("instance")},parseclasses);
});

function getParentClasses(data, parentId, prefix)
{
    if (prefix != '')
        prefix += " > "
    var parent = [];
    $.each(data, function (index, clas) {
        if (clas.ParentId == parentId)
            parent.push({Id: clas.Id, Name: prefix + clas.Name, IsLastChild:clas.IsLastChild});
    });
    return parent;
}

pageLoad("create_ticket", function(){
    mainloaded = false;
    var sugList = $("#select_customer_list");

    get_customer_name(getStorage("login"), true);

    $("#select_customer_name").on("input", function(e) {
        $.mobile.showPageLoadingMsg();
        var text = $(this).val();
        if(text.length < 1) {
            sugList.html("");
            sugList.listview("refresh");
            $('#select_customer_list').children('li').on('vclick', set_customer_name);
        } else {
            get_customer_name(text, false);
        }
    });

    function get_customer_name(text, force_selection)
    {
        mainloaded = false;
        api.users_list({"SearchText": text, "OrganizationKey": getStorage("organization"),"InstanceKey": getStorage("instance")}, function(res) {
        if (res)
        {
            $('#select_customer_list').show("fast");
            var str = "<li data-id='0'>Make Me the Customer</li>";
            $.each(res, function (index, tech) {
                str += "<li data-id='"+tech.Id+"'>";
                if (tech.LastName.trim().length > 0)
                    str +=  tech.LastName + ", ";
                if (tech.FirstName.trim().length > 0)
                    str += tech.FirstName + " - ";
                if (tech.Email.trim().length > 0)
                    str += tech.Email;
                str += "</li>";
            });
            sugList.html(str);
            sugList.listview("refresh");
            if (!force_selection)
                $('#select_customer_list').children('li').on('vclick', set_customer_name);
            else
            {
                if ($('#select_customer_list').children('li').length > 1)
                {
                    var default_opt = $($('#select_customer_list').children('li')[1]);
                    $('#select_customer_list').empty();
                    $("#select_customer_name").attr("placeholder",default_opt.text());
                    $('#ticketMakeMeUserName').val(default_opt.text());
                    $('#ticketMakeMeUserId').val(default_opt.attr('data-id'));
                    get_account_list(default_opt.attr('data-id'));
                }
            }
        }
    },"json");
    }

    function set_customer_name(){
            //alert('Selected Name=' + $(this).attr('data-name'));
            var ticketMakeMeUserId = 0;
            var ticketMakeMeUserName = "";
            $("#select_customer_name").val("");
            if ($(this).attr('data-id') == "0")
            {
                ticketMakeMeUserId = $('#ticketMakeMeUserId').val();
                ticketMakeMeUserName = $('#ticketMakeMeUserName').val();
            }
            else
            {
                ticketMakeMeUserId = $(this).attr('data-id');
                ticketMakeMeUserName = $(this).text();
            }

        //console.log(ticketMakeMeUserName);
        //console.log(ticketMakeMeUserId);
            $("#select_customer_name").attr("placeholder",ticketMakeMeUserName);
            $('#select_customer_list').hide("fast");
            get_account_list(ticketMakeMeUserId);
        };

    function get_account_list(userId)
    {
        mainloaded = false;
        $("#ticketUserId").val(userId);
        mainloaded = false;
        var t_account_list = Handlebars.compile( $('#ht_account_list').html() );
        var parseaccountlist = function (data) {
            if (!data)
            {
                return;
            }

            $('select#account_list').empty().append(t_account_list(data));
            $("select#account_list").selectmenu("refresh");
            //$("select#account_list").val($("select#account_list option:first").val());

            //$('select#account_list').listview("refresh");
        };
        api.accounts_list({"UserId": userId, "OrganizationKey": getStorage("organization"),"InstanceKey": getStorage("instance")},parseaccountlist);
    };
});
pageBeforeshow("alert_menu", function(){

    var alert_menu = $("#ticket-detail-more");
    //logic to show only correspondent actions: Transfer, PickUp and Cancel
    //console.log("data.TechnicianType = " + ticketInfo.TechnicianType);

    if ($("#ticketTechnicianType").val() == "Queue")
    {
        $("#ticket_response_action", alert_menu).closest('.ui-btn').hide();
        $("#ticket_addtime_action", alert_menu).closest('.ui-btn').hide();
        $("#ticket_close_action", alert_menu).closest('.ui-btn').hide();
    }
    else
    {
        if ($("#ticket_response_action", alert_menu).closest('.ui-btn').css("display")=="none")
            $("a", alert_menu).closest('.ui-btn').show();
        $("#ticket_pickup_action", alert_menu).closest('.ui-btn').hide();
    }
});

pageReady("organizations", function(){

    var parseorgs = function (data) {
        if (!data)
        {
            return;
        }

        setStorage("org_list", data);

        if (data.length == 1)
        {
            setStorage('organization', data[0].Key);
            if (data[0].Instances.length == 1)
            {
                setStorage('instance', data[0].Instances[0].Key);
                $.mobile.changePage("home.html");
                return;
            }
            $.mobile.changePage("org_inst.html#instances_page");
            return;
        }

        var org_list = [];//declare array
        $.each(data, function (index, org) {
            org_list.push({key: org.Key, name: org.Name});
        });

        var t_orgs = Handlebars.compile( $('#ht_organizations_list').html() );
        $('#organizations_list').empty().append(t_orgs(org_list) );
        $('#organizations_page').trigger('create');
    };

    api.org_inst({},parseorgs);

});

pageReady("instances", function(){

    var result = getStorage("org_list");

    var t_insts = Handlebars.compile( $('#ht_instances_list').html() );

    var parseinsts = function () {

        var org_key =  getStorage("organization");
        if (!org_key || !result) {
            $.mobile.changePage("#organizations_page");
            return;
        }
        //console.log('parseinsts');
        var org_index;
        $.each(result, function (index, org) {
            //Add after the default val
            if (org.Key == org_key)
            {
                org_index = index;
                return;
            }

        });

        if (!result[org_index])
            return;
        var data = result[org_index].Instances;

        var inst_list = [];//declare array
        $.each(data, function (index, inst) {
            inst_list.push({key: inst.Key, name: inst.Name});
        });

        $('#instances_list').empty().append(t_insts(inst_list) );
        $('#instances_page').trigger('create');
    };

    parseinsts();
});

pageLoad("organizations", function(){
    //console.log('pageLoad("organizations"');
    var selected_org;
    $("[name='radio-org-1']").live ("change", function() {
        //console.log("pageLoad radio-org-1 change");
        selected_org = $('input[name=radio-org-1]:checked').val();
        //console.log('Selected: '+ selected_org);
        setStorage('organization', selected_org);
        $.mobile.changePage("#instances_page");
    });
});

pageLoad("instances", function(){
    //console.log('pageLoad("instances"');
    var selected_inst;
    $("[name=instance-1]").live("change", function() {
        selected_inst = $('input[name=instance-1]:checked').val();
        //console.log('Selected: '+ selected_inst);
        setStorage('instance', selected_inst);
        $.mobile.changePage("home.html");
    });
});
//endregion Page specific functions

//region Helper functions



Handlebars.getTemplate = function(name) {
    if (Handlebars.templates === undefined || Handlebars.templates[name] === undefined) {
        $.ajax({
            url : 'js/' + name + '.handlebars',
            success : function(data) {
                if (Handlebars.templates === undefined) {
                    Handlebars.templates = {};
                }
                Handlebars.templates[name] = Handlebars.compile(data);
            },
            async : false
        });
    }
    return Handlebars.templates[name];
};


(function($) {
    var compiled = {};
    $.fn.handlebars = function(template, data) {
        if (template instanceof jQuery) {
            template = $(template).html();
        }

        compiled[template] = Handlebars.getTemplate(template);
        this.empty().append(compiled[template](data));
    };
})(jQuery);

(function($) {
    var compiled = {};
    $.fn.handlebart = function(template, data) {
        if (template instanceof jQuery) {
            template = $(template).html();
        }

        compiled[template] = Handlebars.compile(template);
        this.html(compiled[template](data));
    };
})(jQuery);

function tooltip(message)
{
     $("<div class='ui-popup ui-overlay-shadow ui-corner-all ui-body-c ui-content ui-loader' data-theme='c' data-position-to='origin'><h3 class='ui-title'>"+message+"</h3></div>").css({ "max-width" : "400px", "padding": "20px", "display": "block", "opacity": 0.96, "left": $(window).width() / 2 -100, "text-align": "center"})
     .appendTo( $.mobile.pageContainer )
     .delay( 1500 )
     .fadeOut(500, function(){
     $(this).remove();
     }
     );
};

// format an ISO date using Moment.js
// http://momentjs.com/
// moment syntax example: moment(Date("2011-07-18T15:50:52")).format("MMMM YYYY")
// usage: {{dateFormat creation_date format="MMMM YYYY"}}
Handlebars.registerHelper('dateFormat', function(context, block) {
    if (window.moment) {
        if (!context)
            return "";
        var f = block.hash.format || "MMM Do, YYYY";
        if (f == "calendar")
            return moment(context).calendar();
        else if (f == "utc")
        {
            var utc_string = moment(context).format("(UTCZZ)").replace(/0/g,"");
            return moment(context).format("MM/DD/YYYY, hh:mmA ") + utc_string;
        }
        else if (f.indexOf("fromNow") >= 0)
        {
            var positive = f.indexOf("+") > 0;
            var fromnow_string = "";
            context = moment(context);
            var minutes = context.diff(new Date(),"minutes");
            if (minutes < 5 && minutes > -5)
            {
                return "Just Now";
            }
            var days = context.diff(new Date(),"days");
            if (days != 0)
            {
                fromnow_string += days + 'd ';
                context = context.add("d",-1*days);
            }
            var hours = context.diff(new Date(),"hours");
            if (hours != 0)
            {
                fromnow_string += '-' + hours + 'h ';
                context = context.add("h", -1*hours);
            }
            minutes = context.diff(new Date(),"minutes");
            if (minutes != 0)
            {
                fromnow_string += '-' + minutes + 'm';
            }
            return !positive ? fromnow_string : fromnow_string.replace(/-/g, '');
        }else
            return moment(context).format(f);
    }else{
        return context; // moment plugin not available. return data as is.
    }
});

Handlebars.registerHelper('customFields', function(context) {
    if (window.moment) {
        var str = "";
        $(context).find("field").each(function (){
            str += $(this).text() + "<br/>";
        });
        return str.replace(/\?/g, '? &mdash; ');
    }else{
        return context; // moment plugin not available. return data as is.
    }
});

Handlebars.registerHelper('linebreaks', function(context) {
    return context.replace(/\n/g, "<br />");
});

Handlebars.registerHelper('assetsHelper', function(context) {
        var str = "";
        $.each($(context), function() {
	        $.each(this, function(key, value) {
				if (value != "") 
					{
						str += key + ': ' + value + '<br/>';
					} else {
						str += "";		
					}  	
	        })
        });
        return str;//.replace(/\?/g, '? &mdash; ');
});

Handlebars.registerHelper('reverselist', function(context, options) {
    var ret = "";

    for(var i=context.length -1; i>=0; i--) {
        ret = ret + options.fn(context[i]);
    }

    return ret;
});

function htmlEscape(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        //.replace(/\n/g, "<br />")
        ;
}

//endregion Helper functions

