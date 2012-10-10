///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
					//alert('connection made');
					return;
				}
			}
			//endregion

			
			//region All pages wide functions
			function checkStorage(changelocation)
			{
				//console.log(changelocation && window.location.href.indexOf("home.html")<0);
				var login      =  window.localStorage.getItem("login");
				var pass      = window.localStorage.getItem("password");
				var selectedOrg = window.localStorage.getItem("organization");
				var selectedInst = window.localStorage.getItem("instance");				
				
			
				if (!login || !pass)
					{
						if (window.location.href.indexOf("login.html")<0)
							{
								{
									window.location.replace("login.html");
									return false;
								}
							}
					}
				else
				{
					if (!selectedOrg || !selectedInst)
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
			