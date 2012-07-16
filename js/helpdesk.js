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

function checkStorage()
{
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
            if (window.location.href.indexOf("home.html")<0)
            {
                window.location.replace("home.html");
                return false;
            }
        }
    }
    return true;
}

function logout() {
    clearStorage();
    window.location.replace("login.html");
    return false;
}


pageLoad("login", function() {
    {
        /*if (data)
        {
            $.mobile.changePage("index.html");
        }
        */
    }
});

pageLoad("index", function() {
    {
        checkStorage();
    }
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
        //$("#instances_page").page();
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
