// JavaScript Document

api = new HelpDeskAPI();

function pageLoad(page_name, func)
{
    $( document ).delegate("#"+page_name+"_page", "pageshow", func);
}

function pageReady(func)
{
    $( document ).delegate('[data-role="page"]', "pagecreate", func);
}

function checkStorage()
{
    localStorage.length;
    var login      = localStorage.getItem("login");
    var pass      = localStorage.getItem("password");
    var selected_org = localStorage.getItem("organization");
    var selected_inst = localStorage.getItem("instance");

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
    localStorage.length;
    localStorage.clear();
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

pageLoad("organizations", function(){
    var selected_org, selected_inst;
    $("[name=radio-org-1]").change(function() {
        selected_org = $('input[name=radio-org-1]:checked').val();
        console.log('Selected: '+ selected_org);
        localStorage.setItem('organization', selected_org);
        $.mobile.changePage("org_inst.html#instances");
    });
    $("[name=instance-1]").change(function() {
        selected_inst = $('input[name=instance-1]:checked').val();
        console.log('Selected: '+ selected_inst);
        localStorage.setItem('instance', selected_inst);
        $.mobile.changePage("home.html");
    });
});

/*
 var result, selected_org, selected_inst;

 var t_orgs = Handlebars.compile( $('#organizations').html() );
 var t_insts = Handlebars.compile( $('#instances').html() );

 var parseorgs = function (data) {
 if (!data)
 {
 $.mobile.changePage("login.html");
 return;
 }

 result = data;

 var org_list = [];//declare array
 $.each(data, function (index, org) {
 org_list.push({key: org.Key, name: org.Name});
 });

 $('#orgs').append(t_orgs(org_list) );

 $("#orgs").show();
 $("#login").hide();
 }



 var parseinsts = function (org_key) {
 if (!result) {
 $("#login").show();
 return;
 }

 var org_index;
 $.each(result, function (index, org) {
 //Add after the default val
 if (org.Key == org_key)
 {
 org_index = index;
 return;
 }

 });
 console.log(org_index);
 var data = result[org_index].Instances;

 var inst_list = [];//declare array
 $.each(data, function (index, inst) {
 inst_list.push({key: inst.Key, name: inst.Name});
 });

 $('#insts').append(t_insts(inst_list) );

 $("#orgs").hide();
 $("#insts").show();
 }
 localStorage.length;
 selected_org = localStorage.getItem("organization");
 selected_inst = localStorage.getItem("instance");

 if (!selected_org || !selected_inst)
 {

 //console.log(api);
 api.organizations(parseorgs);
 if (!selected_org)
 {
 $("#orgs").show();
 }
 else if (!selected_inst)
 $("#insts").show();
 }
 else
 {
 $("#login").hide();
 $("#home").show();
 }


 $("#orgs").change(function () {
 $("#orgs option:selected").each(function () {
 var org_key = $(this).val();
 if (org_key != 0) {
 console.log(org_key);
 selected_org = org_key;
 localStorage.setItem('organization', selected_org);
 parseinsts(org_key)
 }
 });
 })
 .change();
 $("#insts").change(function () {
 $("#insts option:selected").each(function () {
 var inst_key = $(this).val();
 if (inst_key != 0) {
 selected_inst = inst_key;
 localStorage.setItem('instance', selected_inst);
 $("#insts").hide();
 $("#home").show();
 }
 });
 })
 .change();
 */

function doOnOrientationChange()
  {
    switch(window.orientation) 
    {  
      case -90:
      case 90:
	  if (!$('div:jqmData(role="page")').hasClass("landscape"))
	    $('div:jqmData(role="page")').addClass("landscape");
        break; 
      default:
        //document.body.setAttribute("class","portrait");
		$('div:jqmData(role="page")').removeClass("landscape");
        break; 
    }
  }
/*
  window.onorientationchange = function()
  {
    doOnOrientationChange();
  };

  // Initial execution
  doOnOrientationChange();
  */



