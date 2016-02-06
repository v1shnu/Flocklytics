var FLOCK_WEBHOOK_URL = "https://api.flock.co/hooks/sendMessage/<token>";

var request = require('request');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json());

app.listen(8080);

app.post('/fabric', function(req, res) {
    console.log(req.body); // Crash data
    try {
        sendToFlock(getMessageDataFromCrash(req.body));
    } catch (e) {
        console.log("Something went wrong.");
    }
    res.send("Oh noez!");
});

app.get('/', function(req, res) {
    res.send("Quit snooping around!");
});

var sendToFlock = function(message) {
    request.post(
        FLOCK_WEBHOOK_URL, {
            json: {
                text: message
            }
        },
        function(error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log("Crash details forwarded to Flock");
            }
        }
    );
}

var getMessageDataFromCrash = function(crashData) {
    var message = "";
    message += "*" + crashData.payload.title + "*\n";
    message += "Method: _" + crashData.payload.method + "_\n";
    message += "Crash count: " + crashData.payload.crashes_count + "\n";
    message += "Impacted devices: " + crashData.payload.impacted_devices_count + "\n";
    message += "More information: " + crashData.payload.url;
    return message;
}

