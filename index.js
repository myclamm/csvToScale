var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var scaleapi = require('scaleapi');
var _ = require('lodash');

var scale = scaleapi.ScaleClient("test_53331dec0ac44116b663328d5be97bdb")

var app = express();

// Middleware
app.use(express.static(path.join(__dirname + '/client')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// Routes
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/client/index.html'));
});

app.post('/tasks/create', function(req,res) {
	var taskPayloads = req.body.tasks;
	var count = taskPayloads.length;

	// Create individual tasks
	_.each(taskPayloads, function(task){
		var payload = {};
		_.extend(payload,task);

		scale.createAnnotationTask(payload, function (err, task) {

			count--
			if(err){
				console.log('error:',err)
			}
			
			if(count === 0){
				console.log('done!')
				res.send(true);
			}
		})

	})
	
})


var port = process.env.PORT || 8080

app.listen(port, function () {
	console.log('listening on port 8080')
});
