// JavaScript Document

/*
 Storage Functions
 */

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

/*
End of  Storage Functions
 */

function clearStorage()
{
    localStorage.length;
    localStorage.clear();
}

api = new HelpDeskAPI();

function pageLoad(page_name, func)
{
    $( document ).delegate("#"+page_name+"_page", "pageshow", func);
}

function pageReady(page_name, func)
{
    $( document ).delegate("#"+page_name+"_page", "pagecreate", func);
}

function pageInit(page_name, func)
{
    $( document ).delegate("#"+page_name+"_page", "pageinit", func);
}

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
    var t_ticketqlist = Handlebars.compile( $('#ticketsq').html() );

    var parseticketsq = function (data) {
        if (!data)
        {
            return;
        }

        //setStorage("org_list", data);

        //var org_list = [];//declare array
        //$.each(data, function (index, org) {
        //    org_list.push({key: org.Key, name: org.Name});
        //});

        $('ul#ticketqList').append(t_ticketqlist(data) );
    };

    api.ticketsq({"OrganizationKey": getStorage("organization"),"InstanceKey": getStorage("instance")},parseticketsq);

});

pageReady("ticketlist", function(){

    checkStorage(false);
    var t_ticketlist = Handlebars.compile( $('#tickets').html() );

    var parsetickets = function (data) {
        if (!data)
        {
            return;
        }

        //setStorage("org_list", data);

        //var org_list = [];//declare array
        //$.each(data, function (index, org) {
        //    org_list.push({key: org.Key, name: org.Name});
        //});

        $('ul#ticketList').append(t_ticketlist(data) );
    };

    var url = $.url(document.location);

    var queueid = url.param("id");

    if (queueid > 0)
        api.ticketsqueue({"OrganizationKey": getStorage("organization"),"InstanceKey": getStorage("instance"), "Id" : queueid},parsetickets);
    else
        api.tickets({"OrganizationKey": getStorage("organization"),"InstanceKey": getStorage("instance")},parsetickets);

});

pageReady("organizations", function(){

    var t_orgs = Handlebars.compile( $('#organizations').html() );

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

        $('#orgs').append(t_orgs(org_list) );
    };

    api.organizations(parseorgs);

});

pageReady("instances", function(){

    var result = getStorage("org_list");

    var t_insts = Handlebars.compile( $('#instances').html() );

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

        $('#insts').append(t_insts(inst_list) );
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

function relative_time(time_value) {
    var values = time_value.split(" ");
    time_value = values[1] + " " + values[2] + ", " + values[5] + " " + values[3];
    var parsed_date = Date.parse(time_value);
    var relative_to = (arguments.length > 1) ? arguments[1] : new Date();
    var delta = parseInt((relative_to.getTime() - parsed_date) / 1000);
    delta = delta + (relative_to.getTimezoneOffset() * 60);
    var stime;

    if (delta < 120) {
        return '!secs ago';
    } else if(delta < (60*60)) {
        stime = (parseInt(delta / 60)).toString();
        if (stime.length == 1) {stime = "0" + stime;}
        return '#' + stime + ' mins ago';
    } else if(delta < (120*60)) {
        return '$01 hour ago';
    } else if(delta < (24*60*60)) {
        stime = (parseInt(delta / 3600)).toString();
        if (stime.length == 1) {stime = "0" + stime;}
        return '$' + stime + ' hours ago';
    } else if(delta < (48*60*60)) {
        return '%01 day ago';
    } else {
        stime = (parseInt(delta / 86400)).toString();
        if (stime.length == 1) {stime = "0" + stime;}
        return '%' + stime + ' days ago';
    }
}

function convertFBDate(fbDate)
{
    var splitDate = fbDate.split("-");
    var year = splitDate[0];
    var month = splitDate[1];
    var tmp = splitDate[2];
    var splitDate = tmp.split("T");
    var day = splitDate[0];
    var tmp =  splitDate[1];
    var splitDate = tmp.split("+");
    var fb_time = splitDate[0];

    var fbDate = "Mon " + convertMonth(month) + " " + day + " " + fb_time + " +" + splitDate[1] + " "  + year;
    return fbDate;
}

function convertMonth(nMonth)
{
    switch (nMonth)
    {
        case "1":
            return "Jan";
            break;

        case "2":
            return "Feb";
            break;
        case "3":
            return "Mar";
            break;
        case "4":
            return "Apr";
            break;
        case "5":
            return "May";
            break;
        case "6":
            return "Jun";
            break;
        case "7":
            return "Jul";
            break;
        case "8":
            return "Aug";
            break;
        case "9":
            return "Sep";
            break;
        case "01":
            return "Jan";
            break;
        case "02":
            return "Feb";
            break;
        case "03":
            return "Mar";
            break;
        case "04":
            return "Apr";
            break;
        case "05":
            return "May";
            break;
        case "06":
            return "Jun";
            break;
        case "07":
            return "Jul";
            break;
        case "08":
            return "Aug";
            break;
        case "09":
            return "Sep";
            break;
        case "10":
            return "Oct";
            break;
        case "11":
            return "Nov";
            break;
        case "12":
            return "Dec";
            break;
    }
}

// format an ISO date using Moment.js
// http://momentjs.com/
// moment syntax example: moment(Date("2011-07-18T15:50:52")).format("MMMM YYYY")
// usage: {{dateFormat creation_date format="MMMM YYYY"}}
Handlebars.registerHelper('dateFormat', function(context, block) {
    if (window.moment) {
        var f = block.hash.format || "MMM Do, YYYY";
        if (f == "calendar")
            return moment(context).calendar();
        return moment(context).format(f);
    }else{
        return context; // moment plugin not available. return data as is.
    }
});
