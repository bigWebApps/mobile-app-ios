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

var HelpDeskAPI = function (options) {
	
    if (!options)
        var options = {};

    //if (!login || !pass)
    //    throw 'You have to provide an login and pass for this to work.';

    this.key =  getStorage('key');
	this.version     = '1.0';
	this.login      = getStorage('login');
    this.pass      = getStorage('password');
	this.secure      = options.secure || false;
	this.packageInfo = options.packageInfo;
    this.httpHost    = 'api.beta.helpdesk.bigwebapps.com';
    this.httpUri     = (this.secure) ? 'https://'+this.httpHost+':443' : 'http://'+this.httpHost;
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

    var finalParams = {};//"";

    //finalParams = "{";
    for (var i = 0; i < availableParams.length; i++) {
        currentParam = availableParams[i];
        if (typeof givenParams[currentParam] !== 'undefined')
        {
            finalParams[currentParam] = givenParams[currentParam];
            //finalParams += '"' + currentParam + '":"' + givenParams[i] + '", ';
        }
    }
    //finalParams += "}";

    if (this.key)
    {
        var basicUrl = this.key + ':' + 'x' + '@' + this.httpHost;
        this.httpUri = (this.secure) ? 'https://'+basicUrl+':443' : 'http://'+basicUrl;
    }

    var requestType = typeof finalParams.Method !== 'undefined'? finalParams.Method : 'POST';

    //alert(this.httpUri + '/' + method);
    //console.log(this.login + ':' + this.pass + '=' + base64.encode(this.login + ':' + this.pass));

    $.mobile.showPageLoadingMsg();
    //console.log(availableParams);
    //console.log(givenParams);
    //console.log(finalParams);
    $.ajax({
        url: this.httpUri + '/' + method,
        type: requestType,
        cache:false,
        async: false,
        dataType:"json",
        data: JSON.stringify(finalParams), //'{"UserName":"jon.vickers@micajah.com", "Password":"vader"}', //finalParams,
        contentType:"application/json; charset=utf-8",
        timeout:6000,
        success:function (data) {
            //alert('success');
            if (typeof data.UserKey !== 'undefined')
                setStorage('key', data.UserKey);
            callback(data);
        },
        error:function (jqXHR, textStatus, errorThrown) {
           if (jqXHR.status == 403)
           {
               alert(errorThrown);
               clearStorage();
               window.location.replace("login.html")
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
        }
    });

    $.mobile.hidePageLoadingMsg();
}

/*****************************************************************************/
/************************* Authentication Related Methods **************************/
/*****************************************************************************/

/**
 * Login user.
 *
 * @see http://developer.helpdesk.bigwebapps.com/
 */
HelpDeskAPI.prototype.loginUser = function (params, callback) {
    if (typeof params == 'function') callback = params, params = {};
    clearStorage();
    this.login      = params[0];
    this.pass      = params[1];
    setStorage('login', this.login);
    setStorage('password', this.pass);
    this.execute('login', ["UserName", "Password"
    ], params, callback);
}

/**
 * Get list of user organizations and instances.
 *
 * @see http://developer.helpdesk.bigwebapps.com/
 */
HelpDeskAPI.prototype.organizations = function (callback) {
    var params = {"Method": "GET"};
    if (typeof params == 'function') callback = params, params = {};
    this.execute('login', ["Method"]
    , params, callback);
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

// adapted from here: http://ostermiller.org/calc/encode.html
var base64 = {};

(function () {
    var END_OF_INPUT = -1,
        base64Chars = new Array(
            'A','B','C','D','E','F','G','H',
            'I','J','K','L','M','N','O','P',
            'Q','R','S','T','U','V','W','X',
            'Y','Z','a','b','c','d','e','f',
            'g','h','i','j','k','l','m','n',
            'o','p','q','r','s','t','u','v',
            'w','x','y','z','0','1','2','3',
            '4','5','6','7','8','9','+','/'),
        reverseBase64Chars = new Array(),
        base64Str,
        base64Count;

    for (var i=0; i < base64Chars.length; i++){
        reverseBase64Chars[base64Chars[i]] = i;
    }

    function setBase64Str(str){
        base64Str = str;
        base64Count = 0;
    }
    function readBase64(){
        if (!base64Str) return END_OF_INPUT;
        if (base64Count >= base64Str.length) return END_OF_INPUT;
        var c = base64Str.charCodeAt(base64Count) & 0xff;
        base64Count++;
        return c;
    }
    function readReverseBase64(){
        if (!base64Str) return END_OF_INPUT;
        while (true){
            if (base64Count >= base64Str.length) return END_OF_INPUT;
            var nextCharacter = base64Str.charAt(base64Count);
            base64Count++;
            if (reverseBase64Chars[nextCharacter]){
                return reverseBase64Chars[nextCharacter];
            }
            if (nextCharacter == 'A') return 0;
        }
        return END_OF_INPUT;
    }

    function ntos(n){
        n=n.toString(16);
        if (n.length == 1) n="0"+n;
        n="%"+n;
        return unescape(n);
    }

    base64.encode = function(str){
        setBase64Str(str);
        var result = '';
        var inBuffer = new Array(3);
        var lineCount = 0;
        var done = false;
        while (!done && (inBuffer[0] = readBase64()) != END_OF_INPUT){
            inBuffer[1] = readBase64();
            inBuffer[2] = readBase64();
            result += (base64Chars[ inBuffer[0] >> 2 ]);
            if (inBuffer[1] != END_OF_INPUT){
                result += (base64Chars [(( inBuffer[0] << 4 ) & 0x30) | (inBuffer[1] >> 4) ]);
                if (inBuffer[2] != END_OF_INPUT){
                    result += (base64Chars [((inBuffer[1] << 2) & 0x3c) | (inBuffer[2] >> 6) ]);
                    result += (base64Chars [inBuffer[2] & 0x3F]);
                } else {
                    result += (base64Chars [((inBuffer[1] << 2) & 0x3c)]);
                    result += ('=');
                    done = true;
                }
            } else {
                result += (base64Chars [(( inBuffer[0] << 4 ) & 0x30)]);
                result += ('=');
                result += ('=');
                done = true;
            }
            lineCount += 4;
            if (lineCount >= 76){
                result += ('\n');
                lineCount = 0;
            }
        }
        return result;
    }

    base64.decode = function(str){
        setBase64Str(str);
        var result = "";
        var inBuffer = new Array(4);
        var done = false;
        while (!done && (inBuffer[0] = readReverseBase64()) != END_OF_INPUT
            && (inBuffer[1] = readReverseBase64()) != END_OF_INPUT){
            inBuffer[2] = readReverseBase64();
            inBuffer[3] = readReverseBase64();
            result += ntos((((inBuffer[0] << 2) & 0xff)| inBuffer[1] >> 4));
            if (inBuffer[2] != END_OF_INPUT){
                result += ntos((((inBuffer[1] << 4) & 0xff)| inBuffer[2] >> 2));
                if (inBuffer[3] != END_OF_INPUT){
                    result += ntos((((inBuffer[2] << 6) & 0xff) | inBuffer[3]));
                } else {
                    done = true;
                }
            } else {
                done = true;
            }
        }
        return result;
    }
})()