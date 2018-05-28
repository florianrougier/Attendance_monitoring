//Import dependancies to receive a json file from the python file on the raspberry
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
     
app.post("/postdata", (req, res) => {
    var foo = req.body.foo;
    var ka = req.body.ka;
    console.log(foo);
    console.log(ka);
    res.send("kappa");
});

// Listen to port 3000 where the json file should be sent in.
app.listen(3000);

//Import dependancies to send push notifications from the server
var pushbots = require('pushbots');
var Pushbots = new pushbots.api({
	id:'5b0863231db2dc08000910e2',
	secret:'c69104b69b2f30fb5cb39c19407be412'
});

//sending to (android and ios) platforms by default add optional paramater "0" for iOS, "1" for Android and "2" for Chrome.

// TODO: Add a listener to retrieve information of the user who is trying to be marked as present 

// Generate a random code and fetch it to the user mobile phone
const multiplier = 10000;
function getRandomInt() {
  return Math.floor((Math.random() + 1) * multiplier);
}


Pushbots.customFields({"article_id":"1234"});
Pushbots.setMessage(getRandomInt());
Pushbots.customNotificationTitle("MinCheck");
//to send by tags

Pushbots.sendByTags(["test2"]);
// var alias = "test2"
// Pushbots.push(alias, function(response){
//     console.log(response);
// });

//to push to all (not necessarly usefull for our project)
// Pushbots.push(function(response){
// 	console.log(response);
// });

//to push to one device 

//With token (not usefull in our case because we can't know the token of the user before sending the notification)
// var token = "dLVjHzoLH0o:APA91bEtCU92ipEr4jvCjLCnb27mqFyRmI4A_4LEIqZepgEMc1BJmItIX7Pz1N_yMh5kNgQIGIqoZIw9llDq6kIzsaj9kPkPVorNseCTrJt1MvP3bERvAW7u30LN_nrc7Trty6vCxp5d";
// Pushbots.pushOne(token, function(response){
//     console.log(response);
// });

// We have to use the alias instead (we could use the tag too, but alias seems more specific)
// var alias = "test2"
// Pushbots.pushOne(alias, function(response){
//     console.log(response);
// });

// Now that we sent the code to the phone, we need to recuperate the password entered by the user and compare it to the
// generated code

// if (code generated == code entered){
// 	return true
// }
// 	else return false	
