var http =  require("http");
var fs = require("fs");
var express = require("express");
var twitter = require('ntwitter');
var config = JSON.parse(fs.readFileSync("config.json"));
var host = config.host;
var port = var port = process.env.PORT || 1337;;

var app = express();
//app = http.createServer(app);
// var server = http.createServer(function(req,res){
// 	if(err)
// 	{
// 		console.log("server has error");
// 	}
// 	consle.log("server is running");
// });
app.get("/", function(request, response){
	var content = fs.readFileSync("template.html");
    console.log("Contents");	
    console.log(content);	
	// getTweets(function(tweets){
 //        console.log(tweets);
	// 	var ul = '';
	// 	tweets.forEach(function(tweet) {
	// 		ul += "<li><strong>" + tweet.user.screen_name + ": </strong>" + tweet.text + "</li>";
	// 	});
	// 	//content = content.toString("utf8").replace("{{INITIAL_TWEETS}}", ul);
	// 	response.setHeader("Content-Type", "text/html");
	// 	response.send("hello");
	// });
	response.setHeader("Content-Type", "text/html");
	response.send(content);
	
});

var server = app.listen(port, function() {
    console.log('Listening on port %d', server.address().port);
});
//server.listen(port, host);
var io = require('socket.io').listen(server);

// var mongo = require("mongodb");
// var host = "127.0.0.1";
// var port = mongo.Connection.DEFAULT_PORT;
// var db = new mongo.Db("nodejs-introduction", new mongo.Server(host, port, {}));
// var tweetCollection;
// db.open(function(error){
// 	console.log("We are connected! " + host + ":" + port);
	
// 	db.collection("tweet", function(error, collection){
//         if(error){
//             console.log("dbError:", error);
//         }
// 		tweetCollection = collection;
// 	});

// });

function getTweets(callback) {
	tweetCollection.find({}, {"limit":10, "sort": {"_id": -1}}, function(error, cursor) {
		cursor.toArray(function(error, tweets) {
			callback(tweets);
		});
	});
}




//call twitter

//Instantiate the twitter component
//You will need to get your own key. Don't worry, it's free. But I cannot provide you one
//since it will instantiate a connection on my behalf and will drop all other streaming connections.
//Check out: https://dev.twitter.com/
var t = new twitter({
    consumer_key: 'sCYUU7UB12IeJH9PbhwSzc9m7',           // <--- FILL ME IN
    consumer_secret: 'qDJepYTs2jmuDnwe8qNSxDr1hiTSc1eTDY2XcmKDkGF1KWnJHg',        // <--- FILL ME IN
    access_token_key: '2684945310-afoXr2WbL7YJlQHLbIVH5rO0aTl2HMZvDvliMB8',       // <--- FILL ME IN
    access_token_secret: 'BauzAvpBKBioyef3vllFlNbJzyIFaXR2LgU7hZx0TjoWv'     // <--- FILL ME IN
});

//Tell the twitter API to filter on the watchSymbols 
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
 		io.sockets.emit("tweet", tweet);
      
    }
  });
  stream.on("end", function(){
		console.log("Disconnected");
	});
});