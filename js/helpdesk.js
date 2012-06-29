// JavaScript Document

api = new HelpDeskAPI();

function pageLoad(page_name, func)
{
    $( document ).delegate("#"+page_name+"_page", "pageshow", func);
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
        var result, selected_org, selected_inst;

        var parseorgs = function (data) {
            if (!data)
            {
                $.mobile.changePage("login.html");
                return;
            }

            result = data;

            $.each(data, function (index, org) {
                //Add after the default val
                $("#orgs option:eq(0)").after("<option value='" + org.Key + "'>" + org.Name + "</option>");
                $("#orgs").show();
                $("#login").hide();

            });
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

            $.each(data, function (index, inst) {
                //Add after the default val
                $("#insts option:eq(0)").after("<option value='" + inst.Key + "'>" + inst.Name + "</option>");
                $("#orgs").hide();
                $("#insts").show();
            });
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
    }
});

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

function pageInit(func)
{
    $( document ).delegate('[data-role="page"]', "pageinit", func);
}


