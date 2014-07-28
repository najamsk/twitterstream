//try this
var http = require('http')
var fs = require("fs");
var express = require("express");
var twitter = require('ntwitter');
var app = express();
var port = process.env.PORT || 1337;


app.get("/", function(request, response){
	var content = fs.readFileSync("template.html");
    // console.log("Contents");	
    // console.log(content);	
	
	response.setHeader("Content-Type", "text/html");
	response.send(content);
	
});

var server = app.listen(port, function() {
    //console.log('Listening on port %d', server.address().port);
});
//server.listen(port, host);
var io = require('socket.io').listen(server); //working on localhost

//var io = require('socket.io')(server); //azure

var t = new twitter({
    consumer_key: 'sCYUU7UB12IeJH9PbhwSzc9m7',           // <--- FILL ME IN
    consumer_secret: 'qDJepYTs2jmuDnwe8qNSxDr1hiTSc1eTDY2XcmKDkGF1KWnJHg',        // <--- FILL ME IN
    access_token_key: '2684945310-afoXr2WbL7YJlQHLbIVH5rO0aTl2HMZvDvliMB8',       // <--- FILL ME IN
    access_token_secret: 'BauzAvpBKBioyef3vllFlNbJzyIFaXR2LgU7hZx0TjoWv'     // <--- FILL ME IN
});

t.stream('statuses/filter', { track: ['gaza'] }, function(stream) {

  //We have a connection. Now watch the 'data' event for incomming tweets.
  stream.on('data', function(tweet) {
  	//console.log("tweet:", tweet);
    //This variable is used to indicate whether a symbol was actually mentioned.
    //Since twitter doesnt why the tweet was forwarded we have to search through the text
    //and determine which symbol it was ment for. Sometimes we can't tell, in which case we don't
    //want to increment the total counter...
    var claimed = false;

    //Make sure it was a valid tweet
    if (tweet.text !== undefined) {

      //We're gunna do some indexOf comparisons and we want it to be case agnostic.
      var text = tweet.text.toLowerCase();
	    setTimeout(function() {
		  io.sockets.emit("tweet", tweet);
		}, 5000);  
 		
      
    }
  });
  stream.on("end", function(){
		// console.log("Disconnected");
	});
});

// http.createServer(function(req, res) {
//     res.writeHead(200, { 'Content-Type': 'text/plain' });
//     res.end('Hello World\n');
// }).listen(port);

