/**
 *  API wrapper for the HelpDeskAPI version 1.0. This object should not be
 * instantiated directly but by using the version wrapper {@link HelpDeskAPI}.
 *
 *  Available options are:
 *  - secure  Whether or not to use secure connections over HTTPS (true/false)
 *            Defaults to false.
 *
 * @param options Configuration options
 * @return Instance of {@link HelpDeskAPI}
 */

var HelpDeskAPI = function (options) {

    if (!options)
        var options = {};

    //if (!email || !pass)
    //    throw 'You have to provide an login and pass for this to work.';

    //this.key = getStorage('key');
    this.version = '1.0';
    //this.email = getStorage('login');
    //this.pass = getStorage('password');
    this.secure = true;//options.secure || false;
    this.packageInfo = options.packageInfo;
    //this.httpHost = 'app.bigwebapps.com/api';
    //this.httpHost = 'localhost:44305/api';
    this.httpHost = 'app.helpdesk.bigwebapps.com/api';
    this.httpUri = (this.secure) ? 'https://' + this.httpHost /*+ ':443'*/ : 'http://' + this.httpHost;
};

/**
 * Sends a given request as a JSON object to the  HelpDeskAPI and finally
 * calls the given callback function with the resulting JSON object. This
 * method should not be called directly but will be used internally by all HelpDeskAPI
 * methods defined.
 *
 * @param method  HelpDeskAPI method to call
 * @param availableParams Parameters available for the specified HelpDeskAPI method
 * @param givenParams Parameters to call the  HelpDeskAPI with
 * @param callback Callback function to call on success
 */
HelpDeskAPI.prototype.execute = function (method, availableParams, givenParams, callback) {

    var finalParams = {};//"";

    //finalParams = "{";
    for (var i = 0; i < availableParams.length; i++) {
        var currentParam = availableParams[i];
        if (typeof givenParams[currentParam] !== 'undefined') {
            finalParams[currentParam] = givenParams[currentParam];
            //finalParams += '"' + currentParam + '":"' + givenParams[i] + '", ';
        }
    }
    //finalParams += "}";

    var key = getStorage('key');
    if (key) {
        var basicUrl = key + ':' + 'x' + '@' + this.httpHost;
        this.httpUri = (this.secure) ? 'https://' + basicUrl /*+ ':443'*/ : 'http://' + basicUrl;
        console.log(this.httpUri);
    }

    var requestType = typeof finalParams.Method !== 'undefined' ? finalParams['Method'] : 'POST';
    delete finalParams['Method'];
    //console.log(requestType);
    //console.log(finalParams.length);
    //alert(this.httpUri + '/' + method);
    //console.log(this.login + ':' + this.pass + '=' + base64.encode(this.login + ':' + this.pass));
    //console.log(availableParams);
    //console.log(givenParams);
    //console.log(finalParams);

    var error_message;
    //
    var url = this.httpUri;

    $.ajax({
		/*beforeSend: function (xhr) {
									xhr.withCredentials = true;
                                    if (key)
                                        xhr.setRequestHeader('Authorization', 'Basic ' + btoa(key + ':' + 'x'));
									},
        */
        url:url + '/' + method + '?callback=?' + (key ? '&userkey='+ key : ''),
        //beforeSend:function(){$.mobile.showPageLoadingMsg();},
        type:requestType,
        cache:true,
        async:true,
        dataType:"text",
        data: $.isEmptyObject(finalParams) ? null : JSON.stringify(finalParams),
        contentType:"application/json; charset=utf-8",
        timeout:15000,
        success:function (data, status, xhr) {
            console.log('success');
            console.log(data);
            var textVal = data;
            textVal = textVal.substring(textVal.indexOf("(") + 1, textVal.lastIndexOf(")"));
            data = JSON.parse(textVal);
            console.log(data);
			if (typeof data.UserKey !== 'undefined')
			{
				setStorage('key', data.UserKey);
			}

            if (callback != null)
                callback(data);
        },
        error:function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR.status);
            if (jqXHR.status == 201 ) {
                console.log(201);
                var textVal = jqXHR.responseText;
                textVal = textVal.substring(textVal.indexOf("(") + 1, textVal.lastIndexOf(")"));
                var data = JSON.parse(textVal);
                console.log(data);
                if (typeof data.UserKey !== 'undefined')
                {
                    setStorage('key', data.UserKey);
                }

                if (callback != null)
                    callback(data);
            }
            else if (jqXHR.status == 401 || jqXHR.status == 403) {
                if (window.location.href.indexOf("login.html") >= 0) {
					tooltip("Incorrect Password", "error");
                }
                else
                    window.location.replace("login.html");
            }
            else
            if (errorThrown == 'timeout') {
                if (confirm('Connection timeout.\n\nDo you want to reload this page?'))
                    location.href = location.href;
            }
            else if (errorThrown == 'parsererror')
                error('Error parsing JSON answer from  HelpDeskAPI.');
            else if (jqXHR.status == 500)
                error(errorThrown);
            else if (jqXHR.status == 404)
            {
                error('Ticket Info not found. Back to home page.');
                $.mobile.changePage("home.html");
            }
			else if (jqXHR.status == 0)
            {
                error('Connection failed.<br/>Please check your Internet connection.');
            }
            else
            {
			//console.log(jqXHR.status);
			//console.log(textStatus);
			//console.log(errorThrown);
                error_message = errorThrown + ' ';
                //error('Unknown error ('+errorThrown+').\n\nPlease check your Internet connection.');
            }
            //callback({ 'error':'Unable to connect to the  HelpDeskAPI endpoint.', 'code':'xxx' });
            //clearStorage();
            //window.location.replace("login.html")
        },
        complete:function(){
            $.mobile.hidePageLoadingMsg();
            mainloaded = true;
            if (error_message != null)
            {
                //check Ping
                $.ajax({
                    url:url + '/ping',
                    type:'GET',
                    cache:false,
                    async:false,
                    dataType:"json",
                    contentType:"application/json; charset=utf-8",
                    timeout:15000,
                    success:function (data) {
                        if (data == "All works")
                            error('Unknown error ('+error_message+').<br/>Please check your Internet connection.');
                        else
                            error('Sorry, our service is temporarily unavailable at this time. <br/>Please check back later.');
                    },
                    error:function (jqXHR, textStatus, errorThrown) {
                        error('Sorry, our service is temporarily unavailable at this time. <br/>Please check back later.');
                    }
                });
            }
            else
            {
            if (givenParams.refresh  !== 'undefined')
            {
            $(givenParams.refresh).listview('refresh');
            }
            }
          }
    });
    //mainloaded = true;
    //$.mobile.hidePageLoadingMsg();
};

/*****************************************************************************/
/************************* Authentication Related Methods **************************/
/*****************************************************************************/

/**
 * Login user.
 *
 * @see http://developer.helpdesk.bigwebapps.com/
 */
HelpDeskAPI.prototype.login = function (params, callback) {
    if (typeof params == 'function') callback = params, params = {};
    clearStorage();
    this.email = params.UserName;
    this.pass = params.Password;
    setStorage("login", params.UserName);
    //console.log(getStorage("login"));
    setStorage("password", params.Password);
    //console.log(getStorage("password"));
    params["Method"] = "POST";
    this.execute('login', ["UserName", "Password", "RememberMe"
    ], params, callback);
};

/**
 * Get list of user organizations and instances.
 *
 * @see http://developer.helpdesk.bigwebapps.com/
 */
HelpDeskAPI.prototype.org_inst = function (params, callback) {
    params["Method"] = "GET";
    if (typeof params == 'function') {
        callback = params, params = {};
    }
    this.execute('login', ["Method"
    ], params, callback);
};

/**
 * Config of department
 *
 * @see http://developer.helpdesk.bigwebapps.com/
 *  https://app.bigwebapps.com/api/bamtzm/j9jnmg/config
 */
HelpDeskAPI.prototype.config = function (params, callback) {
    params["Method"] = "GET";
    //console.log(params);
    if (typeof params == 'function') callback = params, params = {};
    this.execute(params.OrganizationKey + '/' + params.InstanceKey + '/config', ["Method"
    ], params, callback);
};

/**
 * List of open tickets
 *
 * @see http://developer.helpdesk.bigwebapps.com/
 *  https://app.bigwebapps.com/api/bamtzm/j9jnmg/tickets
 */
HelpDeskAPI.prototype.ticket_list = function (params, callback) {
    params["Method"] = "GET";
    //console.log(params);
    if (typeof params == 'function') callback = params, params = {};
    this.execute(params.OrganizationKey + '/' + params.InstanceKey + '/tickets', ["Method"
    ], params, callback);
};

/**
 * List of technicians
 *
 * @see http://developer.helpdesk.bigwebapps.com/
 *  https://app.bigwebapps.com/api/bamtzm/j9jnmg/technicians
 */
HelpDeskAPI.prototype.technicians_list = function (params, callback) {
    params["Method"] = "GET";
    //console.log(params);
    if (typeof params == 'function') callback = params, params = {};
    this.execute(params.OrganizationKey + '/' + params.InstanceKey + '/technicians', ["Method"
    ], params, callback);
};

/**
 * List of task types
 *
 * @see http://developer.helpdesk.bigwebapps.com/
 *  https://app.bigwebapps.com/api/rn062f/jghbxs/tasktypes/tickets/5267924
 */
HelpDeskAPI.prototype.tasktypes_list = function (params, callback) {
    params["Method"] = "GET";
    //console.log(params);
    if (typeof params == 'function') callback = params, params = {};
    this.execute(params.OrganizationKey + '/' + params.InstanceKey + '/tasktypes/tickets/' + params.Id, ["Method"
    ], params, callback);
};

/**
 * List of classes
 *
 * @see http://developer.helpdesk.bigwebapps.com/
 *  https://app.bigwebapps.com/api/bamtzm/j9jnmg/classes
 */
HelpDeskAPI.prototype.classes_list = function (params, callback) {
    params["Method"] = "GET";
    //console.log(params);
    if (typeof params == 'function') callback = params, params = {};
    this.execute(params.OrganizationKey + '/' + params.InstanceKey + '/classes', ["Method"
    ], params, callback);
};

/**
 * List of users
 *
 * @see http://developer.helpdesk.bigwebapps.com/
 *  https://app.bigwebapps.com/api/bamtzm/j9jnmg/users/
 */
HelpDeskAPI.prototype.users_list = function (params, callback) {
    params["Method"] = "GET";
    //console.log(params);
    if (typeof params == 'function') callback = params, params = {};
    this.execute(params.OrganizationKey + '/' + params.InstanceKey + '/users/'+params.SearchText, ["Method"
    ], params, callback);
};

/**
 * List of accounts
 *
 * @see http://developer.helpdesk.bigwebapps.com/
 *  https://app.bigwebapps.com/api/bamtzm/j9jnmg/accounts/{UserId}
 */
HelpDeskAPI.prototype.accounts_list = function (params, callback) {
    params["Method"] = "GET";
    //console.log(params);
    if (typeof params == 'function') callback = params, params = {};
    this.execute(params.OrganizationKey + '/' + params.InstanceKey + '/accounts/'+params.UserId, ["Method"
    ], params, callback);
};

/**
 * Create ticket
 *
 * @see http://developer.helpdesk.bigwebapps.com/
 *  https://app.bigwebapps.com/api/bamtzm/j9jnmg/tickets/id
 */
HelpDeskAPI.prototype.ticket_create = function (params, callback) {
    params["Method"] = "POST";
    //console.log(params);
    if (typeof params == 'function') callback = params, params = {};
    this.execute(params.OrganizationKey + '/' + params.InstanceKey + '/tickets', ["Method", "Ticket"
    ], params, callback);
};

/**
 * Get ticket
 *
 * @see http://developer.helpdesk.bigwebapps.com/
 *  https://app.bigwebapps.com/api/bamtzm/j9jnmg/tickets/id
 */
HelpDeskAPI.prototype.ticket_detail = function (params, callback) {
    params["Method"] = "GET";
    //console.log(params);
    if (typeof params == 'function') callback = params, params = {};
    this.execute(params.OrganizationKey + '/' + params.InstanceKey + '/tickets/' + params.Id, ["Method"
    ], params, callback);
};

/**
 * Close ticket
 *
 * @see http://developer.helpdesk.bigwebapps.com/
 *  https://app.bigwebapps.com/api/bamtzm/j9jnmg/tickets/id
 *  {"Id":0,"Action":"Response","NoteText":"String","Hours":0,"HoursOffset":0,"TransferToTechId":0,"TransferToClassId":0,"OrganizationKey":"String","InstanceKey":"String"}
 */
HelpDeskAPI.prototype.close_ticket = function (params, callback) {
    params["Method"] = "PUT";
    params["Action"] = "Close";

    if (typeof params == 'function') callback = params, params = {};
    this.execute(params.OrganizationKey + '/' + params.InstanceKey + '/tickets/' + params.Id, ["Method",
    "Id","Action","NoteText","SendNotifications", "OrganizationKey","InstanceKey"
    ], params, callback);
};

/**
 * Add response to ticket
 *
 * @see http://developer.helpdesk.bigwebapps.com/
 *  https://app.bigwebapps.com/api/bamtzm/j9jnmg/tickets/id
 *  {"Id":0,"Action":"Response","NoteText":"String","Hours":0,"HoursOffset":0,"TransferToTechId":0,"TransferToClassId":0,"OrganizationKey":"String","InstanceKey":"String"}
 */
HelpDeskAPI.prototype.addresponse_ticket = function (params, callback) {
    params["Method"] = "PUT";
    params["Action"] = "Response";

    if (typeof params == 'function') callback = params, params = {};
    this.execute(params.OrganizationKey + '/' + params.InstanceKey + '/tickets/' + params.Id, ["Method",
        "Id","Action","NoteText","OrganizationKey","InstanceKey"
    ], params, callback);
};

/**
 * Pick up ticket
 *
 * @see http://developer.helpdesk.bigwebapps.com/
 *  https://app.bigwebapps.com/api/bamtzm/j9jnmg/tickets/id
 *  {"Id":0,"Action":"Response","NoteText":"String","Hours":0,"HoursOffset":0,"TransferToTechId":0,"TransferToClassId":0,"OrganizationKey":"String","InstanceKey":"String"}
 */
HelpDeskAPI.prototype.pickup_ticket = function (params, callback) {
    params["Method"] = "PUT";
    params["Action"] = "PickUp";

    if (typeof params == 'function') callback = params, params = {};
    this.execute(params.OrganizationKey + '/' + params.InstanceKey + '/tickets/' + params.Id, ["Method",
        "Id","Action","NoteText","OrganizationKey","InstanceKey"
    ], params, callback);
};

/**
 * Transfer to tech ticket
 *
 * @see http://developer.helpdesk.bigwebapps.com/
 *  https://app.bigwebapps.com/api/bamtzm/j9jnmg/tickets/id
 *  {"Id":0,"Action":"Response","NoteText":"String","Hours":0,"HoursOffset":0,"TransferToTechId":0,"TransferToClassId":0,"OrganizationKey":"String","InstanceKey":"String"}
 */
HelpDeskAPI.prototype.transfer2tech_ticket = function (params, callback, completed) {
    params["Method"] = "PUT";
    params["Action"] = "TransferToTech";

    if (typeof params == 'function') callback = params, params = {};
    this.execute(params.OrganizationKey + '/' + params.InstanceKey + '/tickets/' + params.Id, ["Method",
        "KeepAttached","Id","Action","NoteText","TransferToTechId","OrganizationKey","InstanceKey"
    ], params, callback, completed);
};

/**
 * Add time on ticket
 *
 * @see http://developer.helpdesk.bigwebapps.com/
 *  https://app.bigwebapps.com/api/bamtzm/j9jnmg/tickets/id
 *  {"TaskTypeId":2,"Id":0,"Action":"Response","NoteText":"String","Hours":0,"HoursOffset":0,"TransferToTechId":0,"TransferToClassId":0,"OrganizationKey":"String","InstanceKey":"String"}
 */
HelpDeskAPI.prototype.addtime_ticket = function (params, callback, completed) {
    params["Method"] = "PUT";
    params["Action"] = "InputTime";

    if (typeof params == 'function') callback = params, params = {};
    this.execute(params.OrganizationKey + '/' + params.InstanceKey + '/tickets/' + params.Id, ["Method",
        "TaskTypeId","Hours","HoursOffset","Id","Action","NoteText","OrganizationKey","InstanceKey"
    ], params, callback, completed);
};

/**
 * Attach tech as alternate on ticket
 *
 * @see http://developer.helpdesk.bigwebapps.com/
 *  https://app.bigwebapps.com/api/bamtzm/j9jnmg/tickets/id
 *  {"Id":0,"Action":"Response","NoteText":"String","Hours":0,"HoursOffset":0,"TransferToTechId":0,"TransferToClassId":0,"OrganizationKey":"String","InstanceKey":"String"}
 */
HelpDeskAPI.prototype.attachAltTech_ticket = function (params, callback) {
    params["Method"] = "PUT";
    params["Action"] = "AttachAltTech";

    if (typeof params == 'function') callback = params, params = {};
    this.execute(params.OrganizationKey + '/' + params.InstanceKey + '/tickets/' + params.Id, ["Method",
        "Id","Action","NoteText","TransferToTechId","OrganizationKey","InstanceKey"
    ], params, callback);
};
/**
 * List of tickets in queue
 *
 * @see http://developer.helpdesk.bigwebapps.com/
 *  https://app.bigwebapps.com/api/bamtzm/j9jnmg/tickets/queues/8695
 */
HelpDeskAPI.prototype.queue_ticket_list = function (params, callback) {
    params["Method"] = "GET";
    //console.log(params);
    if (typeof params == 'function') callback = params, params = {};
    this.execute(params.OrganizationKey + '/' + params.InstanceKey + '/tickets/queues/' + params.Id, ["Method"
    ], params, callback);
};
/**
 * List of unassigned queues
 *
 * @see http://developer.helpdesk.bigwebapps.com/
 *  https://app.bigwebapps.com/api/bamtzm/j9jnmg/queues
 */
HelpDeskAPI.prototype.ticket_q_list = function (params, callback) {
    params["Method"] = "GET";
    //console.log(params);
    if (typeof params == 'function') callback = params, params = {};
    this.execute(params.OrganizationKey + '/' + params.InstanceKey + '/queues', ["Method"
    ], params, callback);
};