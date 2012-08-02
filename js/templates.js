(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['ht_tickets_list'] = template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var stack1, functionType="function", escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, stack2, foundHelper;
  buffer += "\r\n<li data-corners=\"false\" data-shadow=\"false\" data-iconshadow=\"true\" data-wrapperels=\"div\" data-icon=\"arrow-r\" data-iconpos=\"right\" data-theme=\"d\">\r\n    <a href=\"ticket_detail.html?id=";
  foundHelper = helpers.Id;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.Id; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "\"  class=\"ui-link-inherit\" rel=\"external\">\r\n        <table>\r\n            <tr>\r\n                <td class=\"ticket-num\">#";
  foundHelper = helpers.TicketNumber;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.TicketNumber; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "</td>\r\n                <td class=\"ticket-subject\">";
  foundHelper = helpers.Subject;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.Subject; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "</td>\r\n            </tr>\r\n            <tr>\r\n                <table width=\"100%\">\r\n                    <tr>\r\n                        <td class=\"left\" width=\"60%\">\r\n                            <p class=\"customer\">";
  foundHelper = helpers.UserLastName;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.UserLastName; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + ", ";
  foundHelper = helpers.UserFirstName;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.UserFirstName; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "</p>\r\n                            <p class=\"account\">";
  foundHelper = helpers.AccountName;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.AccountName; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "</p>\r\n                            <p class=\"status ";
  foundHelper = helpers.TicketStatus;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.TicketStatus; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "\">";
  foundHelper = helpers.TicketStatus;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.TicketStatus; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "</p>\r\n                            <p class=\"smalllabel\">Tech</p>\r\n                            <p class=\"tech-name\">";
  foundHelper = helpers.TechnicianLastName;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.TechnicianLastName; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + ", ";
  foundHelper = helpers.TechnicianFirstName;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.TechnicianFirstName; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "</p>\r\n                        </td>\r\n                        <td class=\"left\">\r\n                            <p class=\"date today\">";
  stack1 = depth0.CreateTime;
  stack2 = {};
  stack2['format'] = "calendar";
  foundHelper = helpers.dateFormat;
  stack1 = foundHelper ? foundHelper.call(depth0, stack1, {hash:stack2}) : helperMissing.call(depth0, "dateFormat", stack1, {hash:stack2});
  buffer += escapeExpression(stack1) + "</p>\r\n                            <p>&nbsp;</p>\r\n                            <p>&nbsp;</p>\r\n                            <p class=\"smalllabel\">Class</p>\r\n                            <p class=\"class-name\">";
  foundHelper = helpers.ClassName;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.ClassName; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "</p>\r\n                        </td>\r\n                    </tr>\r\n                </table>\r\n            </tr>\r\n        </table>\r\n    </a>\r\n</li>\r\n";
  return buffer;}

  stack1 = depth0.objects;
  stack1 = helpers.each.call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(1, program1, data)});
  if(stack1 || stack1 === 0) { return stack1; }
  else { return ''; }});
templates['ht_ticket_detail_header'] = template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var buffer = "", stack1, stack2, foundHelper, functionType="function", escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing;


  buffer += "        <div class=\"ticket-det-box ";
  foundHelper = helpers.TicketStatus;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.TicketStatus; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "\">\r\n            <p class=\"status-det\">";
  foundHelper = helpers.TicketStatus;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.TicketStatus; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "</p>\r\n            <p class=\"status-ticket-num\">#";
  foundHelper = helpers.TicketNumber;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.TicketNumber; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "</p>\r\n        </div>\r\n        <div class=\"ticket-det-head\">\r\n            <h1>";
  foundHelper = helpers.UserFirstName;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.UserFirstName; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + " ";
  foundHelper = helpers.UserLastName;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.UserLastName; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "</h1>\r\n            <h2>";
  foundHelper = helpers.AccountName;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.AccountName; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "</h2>\r\n        </div>\r\n        <div class=\"ticket-tech-class\">\r\n            <div class=\"ticket-det-tech\">\r\n                <p class=\"smalllabel\">TECH</p>\r\n                <p>";
  foundHelper = helpers.TechnicianFirstName;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.TechnicianFirstName; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + " ";
  foundHelper = helpers.TechnicianLastName;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.TechnicianLastName; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "</p>\r\n            </div>\r\n            <div class=\"ticket-det-class\">\r\n                <p class=\"smalllabel\">CLASS</p>\r\n                <p>";
  foundHelper = helpers.ClassName;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.ClassName; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "</p>\r\n            </div>\r\n        </div>\r\n        <div class=\"ticket-level-priority\">\r\n			<div class=\"det-level\">\r\n            	<p>Level: <span>";
  foundHelper = helpers.Level;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.Level; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "</span></p>\r\n                <p><span>";
  foundHelper = helpers.LevelName;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.LevelName; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "</span></p>\r\n            </div>\r\n            <div class=\"det-priority\">\r\n            	<p>Priority: <span>";
  foundHelper = helpers.Priority;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.Priority; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "</span></p>\r\n                <p><span>";
  foundHelper = helpers.PriorityName;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.PriorityName; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "</span></p>\r\n            </div>            \r\n            <p class=\"det-date\">";
  stack1 = depth0.CreateTime;
  stack2 = {};
  stack2['format'] = "calendar";
  foundHelper = helpers.dateFormat;
  stack1 = foundHelper ? foundHelper.call(depth0, stack1, {hash:stack2}) : helperMissing.call(depth0, "dateFormat", stack1, {hash:stack2});
  buffer += escapeExpression(stack1) + "</p>			\r\n        </div>";
  return buffer;});
templates['ht_ticket_detail_response_list'] = template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var stack1, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, functionType="function", self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, stack2, foundHelper;
  buffer += "\r\n            <li data-corners=\"false\" data-shadow=\"false\" data-iconshadow=\"true\" data-wrapperels=\"div\" data-theme=\"d\" class=\"ticket-response\">\r\n                <div class=\"response-info\">\r\n                    <div class=\"response-date\">\r\n                        <p>";
  stack1 = depth0.RecordDate;
  stack2 = {};
  stack2['format'] = "utc";
  foundHelper = helpers.dateFormat;
  stack1 = foundHelper ? foundHelper.call(depth0, stack1, {hash:stack2}) : helperMissing.call(depth0, "dateFormat", stack1, {hash:stack2});
  buffer += escapeExpression(stack1) + "</p>\r\n                    </div>\r\n                    <div class=\"response-name\">\r\n                        <p class=\"res-name\">";
  foundHelper = helpers.UserFirstName;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.UserFirstName; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + " ";
  foundHelper = helpers.UserLastName;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.UserLastName; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "</p>\r\n                        <span class=\"res-type\">";
  foundHelper = helpers.LogType;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.LogType; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "</span>\r\n                    </div>\r\n                </div>\r\n                <div class=\"response-text-img\">\r\n                    <div class=\"res-gravatar\" data-gravatar=\"";
  foundHelper = helpers.UserEmail;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.UserEmail; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "\"><img class=\"res-gravatar-img\" src=\"\" width=\"25px\" /></div>\r\n                    <p class=\"res-text\">\r\n                        ";
  foundHelper = helpers.Note;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.Note; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n                    </p>\r\n                </div>\r\n            </li>\r\n            ";
  return buffer;}

  stack1 = depth0.objects;
  stack1 = helpers.each.call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(1, program1, data)});
  if(stack1 || stack1 === 0) { return stack1; }
  else { return ''; }});
templates['ht_ticket_info_list'] = template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var buffer = "", stack1, foundHelper, functionType="function", escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, foundHelper;
  buffer += "\r\n<li>\r\n    <p>Account Location:</p>\r\n    <strong>";
  foundHelper = helpers.AccountLocationName;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.AccountLocationName; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "</strong>\r\n</li>\r\n";
  return buffer;}

function program3(depth0,data) {
  
  var buffer = "", stack1, stack2, foundHelper;
  buffer += "\r\n<li>\r\n    <p>SLA Completion Date:</p>\r\n    <strong>";
  stack1 = depth0.SLAComplete;
  stack2 = {};
  stack2['format'] = "utc";
  foundHelper = helpers.dateFormat;
  stack1 = foundHelper ? foundHelper.call(depth0, stack1, {hash:stack2}) : helperMissing.call(depth0, "dateFormat", stack1, {hash:stack2});
  buffer += escapeExpression(stack1) + " (";
  stack1 = depth0.SLAComplete;
  stack2 = {};
  stack2['format'] = "fromNow";
  foundHelper = helpers.dateFormat;
  stack1 = foundHelper ? foundHelper.call(depth0, stack1, {hash:stack2}) : helperMissing.call(depth0, "dateFormat", stack1, {hash:stack2});
  buffer += escapeExpression(stack1) + ")</strong>\r\n</li>\r\n";
  return buffer;}

function program5(depth0,data) {
  
  var buffer = "", stack1, stack2, foundHelper;
  buffer += "\r\n<li>\r\n    <p>SLA Response Date:</p>\r\n    <strong>";
  stack1 = depth0.SLARespose;
  stack2 = {};
  stack2['format'] = "utc";
  foundHelper = helpers.dateFormat;
  stack1 = foundHelper ? foundHelper.call(depth0, stack1, {hash:stack2}) : helperMissing.call(depth0, "dateFormat", stack1, {hash:stack2});
  buffer += escapeExpression(stack1) + " (";
  stack1 = depth0.SLARespose;
  stack2 = {};
  stack2['format'] = "fromNow";
  foundHelper = helpers.dateFormat;
  stack1 = foundHelper ? foundHelper.call(depth0, stack1, {hash:stack2}) : helperMissing.call(depth0, "dateFormat", stack1, {hash:stack2});
  buffer += escapeExpression(stack1) + ")</strong>\r\n</li>\r\n";
  return buffer;}

function program7(depth0,data) {
  
  var buffer = "", stack1, stack2, foundHelper;
  buffer += "\r\n<li>\r\n    <p>Days Old/Work Day Timer:</p>\r\n    <strong>";
  stack1 = depth0.CreateTime;
  stack2 = {};
  stack2['format'] = "fromNow+";
  foundHelper = helpers.dateFormat;
  stack1 = foundHelper ? foundHelper.call(depth0, stack1, {hash:stack2}) : helperMissing.call(depth0, "dateFormat", stack1, {hash:stack2});
  buffer += escapeExpression(stack1) + "</strong>\r\n</li>\r\n";
  return buffer;}

function program9(depth0,data) {
  
  var buffer = "", stack1, foundHelper;
  buffer += "\r\n<li>\r\n    <p>Project:</p>\r\n    <strong>";
  foundHelper = helpers.ProjectName;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.ProjectName; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "</strong>\r\n</li>\r\n";
  return buffer;}

function program11(depth0,data) {
  
  
  return "\r\n<li>\r\n    <p>Assets:</p>\r\n    <strong>...</strong>\r\n</li>\r\n";}

function program13(depth0,data) {
  
  var buffer = "", stack1, stack2, foundHelper;
  buffer += "\r\n<li>\r\n    <p>Request Completion Date:</p>\r\n    <strong>";
  stack1 = depth0.RequestCompletionDate;
  stack2 = {};
  stack2['format'] = "calendar";
  foundHelper = helpers.dateFormat;
  stack1 = foundHelper ? foundHelper.call(depth0, stack1, {hash:stack2}) : helperMissing.call(depth0, "dateFormat", stack1, {hash:stack2});
  buffer += escapeExpression(stack1) + "</strong>\r\n</li>\r\n";
  return buffer;}

function program15(depth0,data) {
  
  var buffer = "", stack1, foundHelper;
  buffer += "\r\n<li>\r\n    <p>Custom Fields:</p>\r\n    <strong>";
  stack1 = depth0.CustomFieldsXML;
  foundHelper = helpers.customFields;
  stack1 = foundHelper ? foundHelper.call(depth0, stack1, {hash:{}}) : helperMissing.call(depth0, "customFields", stack1, {hash:{}});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</strong>\r\n</li>\r\n";
  return buffer;}

  stack1 = depth0.AccountLocationName;
  stack1 = helpers['if'].call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(1, program1, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n";
  stack1 = depth0.SLAComplete;
  stack1 = helpers['if'].call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(3, program3, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n";
  stack1 = depth0.SLARespose;
  stack1 = helpers['if'].call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(5, program5, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n<li>\r\n    <p>Hours:</p>\r\n    <strong>";
  foundHelper = helpers.TotalHours;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.TotalHours; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + " hr</strong>\r\n</li>\r\n";
  stack1 = depth0.CreateTime;
  stack1 = helpers['if'].call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(7, program7, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n";
  stack1 = depth0.ProjectName;
  stack1 = helpers['if'].call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(9, program9, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n";
  stack1 = depth0.null;
  stack1 = helpers['if'].call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(11, program11, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n";
  stack1 = depth0.RequestCompletionDate;
  stack1 = helpers['if'].call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(13, program13, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n";
  stack1 = depth0.CustomFieldsXML;
  stack1 = helpers['if'].call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(15, program15, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  return buffer;});
templates['ht_ticket_short_header'] = template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var buffer = "", stack1, foundHelper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "        <div class=\"ticket-det-box ";
  foundHelper = helpers.TicketStatus;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.TicketStatus; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "\">\r\n            <p class=\"status-det\">";
  foundHelper = helpers.TicketStatus;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.TicketStatus; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "</p>\r\n            <p class=\"status-ticket-num\">#";
  foundHelper = helpers.TicketNumber;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.TicketNumber; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "</p>\r\n        </div>\r\n        <div class=\"ticket-det-head\">\r\n            <h1>";
  foundHelper = helpers.UserFirstName;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.UserFirstName; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + " ";
  foundHelper = helpers.UserLastName;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.UserLastName; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "</h1>\r\n            <h2>";
  foundHelper = helpers.AccountName;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.AccountName; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "</h2>\r\n        </div>\r\n        <!--<div class=\"ticket-tech-class\">\r\n        <div class=\"ticket-det-subject\" style=\"color:#000000;text-shadow: none;margin: 0;\">\r\n            <h3>";
  foundHelper = helpers.Subject;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.Subject; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "</h3>\r\n        </div>\r\n        </div>-->";
  return buffer;});
})();
