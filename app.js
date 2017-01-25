// Retrieve
var MongoClient = require('mongodb').MongoClient;

var crypto = require('crypto'),
algorithm = 'aes256',
password = 'asaadsaad';

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var fs = require("fs");
var app = express();

app.set('port', process.env.PORT || 4000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set('view options', {layout: false});
app.use('/public', express.static(__dirname + '/public'));  
app.use(express.static(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));


//get form 
app.get('/', function(req,res){
	var decryptedMessage;
	// Connect to the db
	MongoClient.connect("mongodb://localhost:27017/homework6", function(err, db) {
		if(err) { return console.dir(err); }
		// Fetch a collection to insert document into
		var collection = db.collection("homework6");
		// Insert a single document
		collection.insert({message:"ba12e76147f0f251b3a2975f7acaf446a86be1b4e2a67a5d51d62f7bfbed5c03"});

		// Fetch the document
		collection.findOne({message:"ba12e76147f0f251b3a2975f7acaf446a86be1b4e2a67a5d51d62f7bfbed5c03"}, function(err, item) {
		var secretMessage = item.message;
		
		decryptedMessage = decrypt(secretMessage);
		res.render('index', { 
			title: 'Express with secret Message!',
			message: decryptedMessage + ';',
			errors: {}        
		});   
		  db.close();
		})
	});         
});

function encrypt(text){
  var cipher = crypto.createCipher(algorithm,password)
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
}

function decrypt(text){
  var decipher = crypto.createDecipher(algorithm,password)
  var dec = decipher.update(text,'hex','utf8')
  dec += decipher.final('utf8');
  return dec;
}

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});