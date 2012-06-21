// JavaScript Document

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

function pageLoad(func)
{
    $( document ).delegate('[data-role="page"]', "pageshow", func);
}
