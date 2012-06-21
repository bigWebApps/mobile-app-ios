/**
 *  API wrapper for the HelpDeskAPI version 1.0. This object should not be
 * instantiated directly but by using the version wrapper {@link HelpDeskAPI}.
 *
 *  Available options are:
 *  - secure  Whether or not to use secure connections over HTTPS (true/false)
 *            Defaults to false.
 * 
 * @param login The Login to access the  HelpDeskAPI with
 * @param pass The Password to access the  HelpDeskAPI with
 * @param options Configuration options
 * @return Instance of {@link HelpDeskAPI}
 */

var HelpDeskAPI = function (login, pass, options) {
	
    if (!options)
        var options = {};

    if (!login || !pass)
        throw 'You have to provide an login and pass for this to work.';

	this.version     = '1.0';
	this.login      = login;
    this.pass      = pass;
	this.secure      = options.secure || false;
	this.packageInfo = options.packageInfo;
    this.httpHost    = login + ':' + pass + '@' + 'api.beta.helpdesk.bigwebapps.com';
	this.httpUri     = (this.secure) ? 'https://'+this.httpHost+':443' : 'http://'+this.httpHost+':80';	
}

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

	var finalParams = { login : this.login, password: this.pass };
	
	for (var i = 0; i < availableParams.length; i++) {
		currentParam = availableParams[i];
		if (typeof givenParams[currentParam] !== 'undefined')
			finalParams[currentParam] = givenParams[currentParam];
	}

    $.ajax({
        url: this.httpUri+'/'+method+'?callback=?',
        type: 'GET',
        cache: false,
        dataType: "json",
        data: finalParams,
        contentType: "application/json; charset=utf-8",
        timeout: 5000,
        success: function(data) {
            callback(data);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            if (errorThrown == 'timeout')
            {
                console.log('401');
                window.location.replace('login.html');
            }
            else if (errorThrown == 'parsererror')
                callback({ 'error' : 'Error parsing JSON answer from  HelpDeskAPI.', 'code' : 'xxx' });
            else
                callback({ 'error' : 'Unable to connect to the  HelpDeskAPI endpoint.', 'code' : 'xxx' });
        }
    });
}

/*****************************************************************************/
/************************* Authentication Related Methods **************************/
/*****************************************************************************/

/**
 * Get list of user organizations and instances.
 *
 * @see http://developer.helpdesk.bigwebapps.com/
 */
HelpDeskAPI.prototype.organizations = function (params, callback) {
    if (typeof params == 'function') callback = params, params = {};
    this.execute('login/organizations', [
    ], params, callback);
}

/**
 * List of open tickets
 *
 * @see http://developer.helpdesk.bigwebapps.com/
 */
HelpDeskAPI.prototype.open_tickets = function (params, callback) {
    if (typeof params == 'function') callback = params, params = {};
    this.execute(params[0] +'/' + params[1] + '/ticket', [
    ], params, callback);
}