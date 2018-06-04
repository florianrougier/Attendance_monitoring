//Import dependancies to receive a json file from the python file on the raspberry
var express = require('express');
var morgan = require("morgan");
var bodyParser = require('body-parser');
var rand = require("random-seed").create();
var pushbots = require('pushbots');

var app = express();
var urlencodedParser = bodyParser.urlencoded({ extended: true });
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));
     

// Listen to port 8080 where the identification code should be sent in.
app.listen(8080, function() {
	console.log("Server running");
});

//Create instance of the Pushbots API
//Sending to (android and ios) platforms by default add optional paramater "0" for iOS, "1" for Android and "2" for Chrome.
var Pushbots = new pushbots.api({
	id:'5b0863231db2dc08000910e2',
	secret:'c69104b69b2f30fb5cb39c19407be412'
});
function setNotification (){
	Pushbots.setMessage(rand.intBetween(min = 10000, max = 100000));
	Pushbots.customNotificationTitle("MinCheck");
}

// Set up the send by alias method
Pushbots.sendByAlias("test");

//With token (not usefull in our case because we can't know the token of the user before sending the notification)
//var token = "dLVjHzoLH0o:APA91bEtCU92ipEr4jvCjLCnb27mqFyRmI4A_4LEIqZepgEMc1BJmItIX7Pz1N_yMh5kNgQIGIqoZIw9llDq6kIzsaj9kPkPVorNseCTrJt1MvP3bERvAW7u30LN_nrc7Trty6vCxp5d";

app.post("/", urlencodedParser, function(request, response) {
	console.log(request.body.card_id); // retrieve the card id sent by the raspberry
	setNotification();
	Pushbots.push(function(response){
		console.log(response);
	});
	response.send("Connection succeeded");
});


// Now that we sent the code to the phone, we need to recuperate the password entered by the user and compare it to the
// generated code

// if (code generated == code entered){
// 	return true
// }
// 	else return false	


