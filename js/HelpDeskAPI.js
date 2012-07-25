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

    this.key = getStorage('key');
    this.version = '1.0';
    this.email = getStorage('login');
    this.pass = getStorage('password');
    this.secure = options.secure || false;
    this.packageInfo = options.packageInfo;
    this.httpHost = 'api.beta.helpdesk.bigwebapps.com';
    this.httpUri = (this.secure) ? 'https://' + this.httpHost + ':443' : 'http://' + this.httpHost;
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

    if (this.key) {
        var basicUrl = this.key + ':' + 'x' + '@' + this.httpHost;
        this.httpUri = (this.secure) ? 'https://' + basicUrl + ':443' : 'http://' + basicUrl;
    }

    var requestType = typeof finalParams.Method !== 'undefined' ? finalParams.Method : 'POST';

    //alert(this.httpUri + '/' + method);
    //console.log(this.login + ':' + this.pass + '=' + base64.encode(this.login + ':' + this.pass));

    $.mobile.showPageLoadingMsg();
    //console.log(availableParams);
    //console.log(givenParams);
    //console.log(finalParams);
    $.ajax({
        url:this.httpUri + '/' + method,
        type:requestType,
        cache:false,
        async:false,
        dataType:"json",
        data:JSON.stringify(finalParams), //'{"UserName":"jon.vickers@micajah.com", "Password":"vader"}', //finalParams,
        contentType:"application/json; charset=utf-8",
        timeout:6000,
        success:function (data) {
            //alert('success');
            if (typeof data.UserKey !== 'undefined')
                setStorage('key', data.UserKey);
            callback(data);
        },
        error:function (jqXHR, textStatus, errorThrown) {
            if (jqXHR.status == 401 || jqXHR.status == 403) {
                if (window.location.href.indexOf("login.html") >= 0) {
                    alert("Incorrect login or password!");
                }
                else
                    window.location.replace("login.html");
            }
            else
            if (errorThrown == 'timeout') {
                //alert('401');
                alert('timeout');
            }
            else if (errorThrown == 'parsererror')
                alert('Error parsing JSON answer from  HelpDeskAPI.');
            //callback({ 'error':'Error parsing JSON answer from  HelpDeskAPI.', 'code':'xxx' });
            else
                alert('Unable to connect to the  HelpDeskAPI endpoint.' + errorThrown);
            //callback({ 'error':'Unable to connect to the  HelpDeskAPI endpoint.', 'code':'xxx' });
            //clearStorage();
            //window.location.replace("login.html")
        }
    });

    $.mobile.hidePageLoadingMsg();
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
    console.log(getStorage("login"));
    setStorage("password", params.Password);
    console.log(getStorage("password"));
    this.execute('login', ["UserName", "Password"
    ], params, callback);
};

/**
 * Get list of user organizations and instances.
 *
 * @see http://developer.helpdesk.bigwebapps.com/
 */
HelpDeskAPI.prototype.org_inst = function (callback) {
    var params = {"Method":"GET"};
    if (typeof params == 'function') {
        callback = params, params = {};
    }
    this.execute('login', ["Method"
    ], params, callback);
};

/**
 * List of open tickets
 *
 * @see http://developer.helpdesk.bigwebapps.com/
 *  http://api.beta.helpdesk.bigwebapps.com/bamtzm/j9jnmg/tickets
 */
HelpDeskAPI.prototype.ticket_list = function (params, callback) {
    params["Method"] = "GET";
    //console.log(params);
    if (typeof params == 'function') callback = params, params = {};
    this.execute(params.OrganizationKey + '/' + params.InstanceKey + '/tickets', ["Method"
    ], params, callback);
};

/**
 * Get ticket
 *
 * @see http://developer.helpdesk.bigwebapps.com/
 *  http://api.beta.helpdesk.bigwebapps.com/bamtzm/j9jnmg/tickets/id
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
 *  http://api.beta.helpdesk.bigwebapps.com/bamtzm/j9jnmg/tickets/id
 *  {"Id":0,"Action":"Response","NoteText":"String","Hours":0,"HoursOffset":0,"TransferToTechId":0,"TransferToClassId":0,"OrganizationKey":"String","InstanceKey":"String"}
 */
HelpDeskAPI.prototype.close_ticket = function (params, callback) {
    params["Method"] = "PUT";
    params["Action"] = "Close";

    if (typeof params == 'function') callback = params, params = {};
    this.execute(params.OrganizationKey + '/' + params.InstanceKey + '/tickets/' + params.Id, ["Method",
    "Id","Action","NoteText","OrganizationKey","InstanceKey"
    ], params, callback);
};

/**
 * Add response to ticket
 *
 * @see http://developer.helpdesk.bigwebapps.com/
 *  http://api.beta.helpdesk.bigwebapps.com/bamtzm/j9jnmg/tickets/id
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
 * Change technician of ticket
 *
 * @see http://developer.helpdesk.bigwebapps.com/
 *  http://api.beta.helpdesk.bigwebapps.com/bamtzm/j9jnmg/tickets/id
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
 * List of tickets in queue
 *
 * @see http://developer.helpdesk.bigwebapps.com/
 *  http://api.beta.helpdesk.bigwebapps.com/bamtzm/j9jnmg/tickets/queues/8695
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
 *  http://api.beta.helpdesk.bigwebapps.com/bamtzm/j9jnmg/queues
 */
HelpDeskAPI.prototype.ticket_q_list = function (params, callback) {
    params["Method"] = "GET";
    //console.log(params);
    if (typeof params == 'function') callback = params, params = {};
    this.execute(params.OrganizationKey + '/' + params.InstanceKey + '/queues', ["Method"
    ], params, callback);
};
