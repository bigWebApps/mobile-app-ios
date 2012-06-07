// JavaScript Document
var api_url = "http://api.beta.helpdesk.bigwebapps.com/";
function getapicommandurl(command) {
    return getapicommandurl(command, "");
}
function getapicommandurl(command, key) {
    var command_url = '';
    switch (command) {
    case 'login':
        command_url = 'login/post';
        break;
    case 'org':
        command_url = 'login/organizations';
        break;
    case 'setorg':
        command_url = 'login/setorganization/' + key;
        break;
    case 'inst':
        command_url = 'login/instances';
        break;
    case 'setinst':
        command_url = 'login/setinstance/' + key;
        break;
    default:
        command_url = command;
    }
    return api_url + command_url + "?callback=?";
}
function api_login(email, pass, success_function) {
    $.getJSON(getapicommandurl('login'), { LoginName:email, Password:pass }, success_function);
}
function api_organizations(success_function) {
    $.getJSON(getapicommandurl('org'), null, success_function);
}
function api_set_organization(key, success_function) {
    $.getJSON(getapicommandurl('setorg', key), null, success_function);
}
function api_instances(success_function) {
    $.getJSON(getapicommandurl('inst'), null, success_function);
}
function api_set_instance(key, success_function) {
    $.getJSON(getapicommandurl('setinst', key), null, success_function);
}