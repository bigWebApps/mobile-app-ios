//region Tips & Trics
//to hide use this
//$("a", alert_menu).closest('.ui-btn').hide();
//endregion Tips & Trics

api = new HelpDeskAPI();

//region Storage Functions
function getStorage(key)
{
    localStorage.length;
    var value = localStorage.getItem(key);
    if (value && value.indexOf("{") == 0)
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

function pageReady(page_name, func)
{
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
    console.log(changelocation && window.location.href.indexOf("home.html")<0);
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
    var pass      = getStorage("password");
    clearStorage();
    setStorage("login", login);
    setStorage("password", pass);
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
        if (!data)
        {
            return;
        }

        $('ul#tickets_queue_list').empty().append(t_ticketqlist(data) );
    };

    api.ticket_q_list({"OrganizationKey": getStorage("organization"),"InstanceKey": getStorage("instance")},parseticketsq);

});

pageReady("ticketlist", function(){

    checkStorage(false);

    var parsetickets = function (data) {
        if (!data)
        {
            return;
        }

        $('ul#tickets_list').handlebars('ht_tickets_list',data);
    };

    var url = $.url(document.location);

    var queueid = url.param("id");

    if (queueid > 0)
        api.queue_ticket_list({"OrganizationKey": getStorage("organization"),"InstanceKey": getStorage("instance"), "Id" : queueid},parsetickets);
    else
        api.ticket_list({"OrganizationKey": getStorage("organization"),"InstanceKey": getStorage("instance")},parsetickets);

});

pageReady("ticket_detail_main", function(){

    checkStorage(false);
    var parseticketdetail = function (data) {
        if (!data)
        {
            return;
        }

        $('.ticket_detail_header').handlebars('ht_ticket_detail_header', data);
        $('ul#ticket_detail_response_list').handlebars('ht_ticket_detail_response_list', data);

        $("#ticketInfo").val(JSON.stringify(data));
    };

    var url = $.url(document.location);

    var ticketid = url.param("id");

    if (ticketid > 0)
        api.ticket_detail({"OrganizationKey": getStorage("organization"),"InstanceKey": getStorage("instance"), "Id" : ticketid},parseticketdetail);
    else
        history.back();

});

pageReady("ticket_transfer", function(){

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
    };
    api.technicians_list({"OrganizationKey": getStorage("organization"),"InstanceKey": getStorage("instance")},parsetechnicians);
});

pageBeforeshow("alert_menu", function(){

    var ticketInfo = JSON.parse($("#ticketInfo").val());
    var alert_menu = $("#ticket-detail-more");
    //logic to show only correspondent actions: Transfer, PickUp and Cancel
    console.log("data.TechnicianType = " + ticketInfo.TechnicianType);

    $("a", alert_menu).closest('.ui-btn').show();

    if (ticketInfo.TechnicianType == "Queue")
    {
        $("#ticket_response_action", alert_menu).closest('.ui-btn').hide();
        $("#ticket_addtime_action", alert_menu).closest('.ui-btn').hide();
        $("#ticket_close_action", alert_menu).closest('.ui-btn').hide();
    }
    else
    {
        $("#ticket_pickup_action", alert_menu).closest('.ui-btn').hide();
    }
});

pageReady("organizations", function(){

    var t_orgs = Handlebars.compile( $('#ht_organizations_list').html() );

    var parseorgs = function (data) {
        if (!data)
        {
            return;
        }

        setStorage("org_list", data);

        var org_list = [];//declare array
        $.each(data, function (index, org) {
            org_list.push({key: org.Key, name: org.Name});
        });

        $('#organizations_list').empty().append(t_orgs(org_list) );
    };

    api.org_inst(parseorgs);

});

pageReady("instances", function(){

    var result = getStorage("org_list");

    var t_insts = Handlebars.compile( $('#ht_instances_list').html() );

    var parseinsts = function () {

        var org_key =  getStorage("organization");
        if (!org_key || !result) {
            $.mobile.changePage("org_inst.html#organizations_page");
            return;
        }

        result = JSON.parse(result);

        var org_index;
        $.each(result, function (index, org) {
            //Add after the default val
            //console.log(org.Key);
            if (org.Key == org_key)
            {
                org_index = index;
                return;
            }

        });
        //console.log(org_index);
        var data = result[org_index].Instances;

        var inst_list = [];//declare array
        $.each(data, function (index, inst) {
            inst_list.push({key: inst.Key, name: inst.Name});
        });

        $('#instances_list').empty().append(t_insts(inst_list) );
    };

    parseinsts();
});

pageLoad("organizations", function(){
    var selected_org;
    $("[name=radio-org-1]").change(function() {
        selected_org = $('input[name=radio-org-1]:checked').val();
        console.log('Selected: '+ selected_org);
        setStorage('organization', selected_org);
        $.mobile.changePage("org_inst.html#instances_page");
    });
});

pageLoad("instances", function(){
    var selected_inst;
    $("[name=instance-1]").change(function() {
        selected_inst = $('input[name=instance-1]:checked').val();
        console.log('Selected: '+ selected_inst);
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

function tooltip(message)
{
    $("<div class='ui-loader ui-overlay-shadow ui-body-e ui-corner-all'><h2>"+message+"</h2></div>").css({ "padding": "20px", "display": "block", "opacity": 0.96, "top": $(window).scrollTop() + 100, "left": $(window).scrollLeft() + 20, "text-align": "center"})
        .appendTo( $.mobile.pageContainer )
        .delay( 2000 )
        .fadeOut( 400, function(){
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
        var f = block.hash.format || "MMM Do, YYYY";
        if (f == "calendar")
            return moment(context).calendar();
        else if (f == "utc")
        {
            var utc_string = moment(context).format("(UTCZZ)").replace(/0/g,"");
            return moment(context).format("MM/DD/YYYY, hh:mmA ") + utc_string;
        }
        else
            return moment(context).format(f);
    }else{
        return context; // moment plugin not available. return data as is.
    }
});

function htmlEscape(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\n/g, "<br />");
}

//endregion Helper functions

