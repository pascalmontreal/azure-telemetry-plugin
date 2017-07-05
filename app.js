var express = require('express');
var path = require('path');

var app = express();

// static content path
app.use(express.static(path.join(__dirname,'public')))

// body-parser
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// json display formatting
app.set('json spaces', 2);

// database
var Datastore = require('nedb')
var db = new Datastore({ filename: 'data/db/telemetry.db' });
db.loadDatabase(function(err){
	if (err) {
		console.log("There was an error loading database.")
	} else {
		app.listen(3000, () => {
			console.log("Listening on 3000")
		})
	}
})

// returns all the telemetry objects
app.get('/telemetry', function(req, res){ 
	db.find({}).sort({timestamp:1}).exec(function(err, docs){
		if (err) {
			res.status(500).end() // internal server error
		} else {
			res.setHeader('Content-Type', 'application/json')
			res.json(docs)
			res.status(200)
			res.end()
		}
	})
})

// inserts a new telemetry object
app.post('/telemetry', function(req, res){
	if (req.body){
		db.insert(req.body, function(err, newDocs){
			if (err) {
				console.log(err)
				res.status(400).end() // bad request
			}
			else res.status(201).end() // created
		})
	} else {
		res.status(204).end() // no content
	}
	res.status(201).end()
})

// empties the telemetry database
app.delete('/telemetry', function(req, res){
	db.remove({}, { multi: true }, function (err, numRemoved) {
		if (err) {
			res.status(500).end() // internal server error
		} else {
			res.status(200).end() // ok
		}
	})
})
