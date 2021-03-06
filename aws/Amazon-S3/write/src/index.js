// alexa-cookbook sample code

// There are three sections, Text Strings, Skill Code, and Helper Function(s).
// You can copy and paste the entire file contents as the code for a new Lambda function,
//  or copy & paste section #3, the helper function, to the bottom of your existing Lambda code.


// 1. Text strings =====================================================================================================
//    Modify these strings and messages to change the behavior of your Lambda function
var myBucket = 'justin-cookbook-bucket'; //'alexabucket12';      // replace with your own bucket name!
var myObject = 'output-file.txt'; //'hello.txt';          // replace with your own file name!

// 2. Skill Code =======================================================================================================


var Alexa = require('alexa-sdk');

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);

    // alexa.appId = 'amzn1.echo-sdk-ams.app.1234';
    // alexa.dynamoDBTableName = 'YourTableName'; // creates new table for session.attributes

    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    'LaunchRequest': function () {
        this.emit('MyIntent');
    },
    'MyIntent': function () {
        var myParams = {
          Bucket: myBucket,
          Key: myObject,
          Body: `Write this string to the file ${myBucket}/${myObject}`
        };

        S3write(myParams,  myResult => {
          console.log("sent     : " + JSON.stringify(myParams));
          console.log("received : " + JSON.stringify(myResult));

          this.response.speak('The S 3 file was successfully written. ETag: ' + myResult );
          this.emit(':responseReady');
        });
    },
    'AMAZON.HelpIntent': function () {
        var reprompt = 'Say hello or write a file to S 3.';
        this.response.speak('Welcome to s3 file whisperer. ' + reprompt).listen(reprompt);
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        this.response.speak('Goodbye!');
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        this.response.speak('Goodbye!');
        this.emit(':responseReady');
    }

};

//    END of Intent Handlers {} ========================================================================================
// 3. Helper Function  =================================================================================================

function S3write(params, callback) {
    // call AWS S3
    var AWS = require('aws-sdk');
    var s3 = new AWS.S3();

    s3.putObject(params, function(err, data) {
        if(err) { console.log(err, err.stack); }
        else {
            callback(data["ETag"]);

        }
    });
}
