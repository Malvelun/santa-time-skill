var express = require("express");
var alexa = require("alexa-app");

var PORT = process.env.PORT || 8080;
var app = express();

// ALWAYS setup the alexa app and attach it to express before anything else.
var alexaApp = new alexa.app("santa-time");

alexaApp.express({
  expressApp: app,
  //router: express.Router(),

  // verifies requests come from amazon alexa. Must be enabled for production.
  // You can disable this if you're running a dev environment and want to POST
  // things to test behavior. enabled by default.
  checkCert: false,

  // sets up a GET route when set to true. This is handy for testing in
  // development, but not recommended for production. disabled by default
  debug: true
});

// now POST calls to /test in express will be handled by the app.request() function

// from here on you can setup any other express routes or middlewares as normal
app.set("view engine", "ejs");

app.pre = function(request, response, type) {
  if (request.applicationId != "amzn1.ask.skill.0471c64a-5dd7-4470-ad36-03134c6c68bc") {
    // fail ungracefully
    return response.fail("Invalid Application ID");
  }
};

alexaApp.launch(function(request, response) {
  response.say("Welcome to Santa Time!");
});

alexaApp.sessionEnded(function(request, response) {
  // cleanup the user's server-side session
  logout(request.userId);
  // no response required
});


alexaApp.intent("Christmas", {
    "slots": {},
    "utterances": []
  },
  function(request, response) {
    response.say("Just 2 more sleeps till Christmas!");
  }
);

alexaApp.intent("AMAZON.StopIntent", {
  "slots": {},
  "utterances": []
}, function(request, response) {
  	var stopOutput = "Ask me again soon! Bye.";
  	response.say(stopOutput)
  	return
});

alexaApp.intent("AMAZON.CancelIntent", {
  "slots": {},
  "utterances": []
}, function(request, response) {
  	var cancelOutput = "Alright, maybe next time. Bye.";
  	response.say(cancelOutput);
  	return
});

alexaApp.intent("AMAZON.HelpIntent",{
  "slots": {},
  "utterances": []
}, function(request, response) {
  	var helpOutput = "Just ask for Santa's coming!";
  	var reprompt = "So, do you want so ask me something?";
  	response.say(helpOutput).reprompt(reprompt).shouldEndSession(false);
  	return
});






app.listen(PORT, () => console.log("Listening on port " + PORT + "."));