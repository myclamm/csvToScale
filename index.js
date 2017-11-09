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

app.post('/task/create', function(req,res) {
	var task = req.body;

	scale.createAnnotationTask(task, function (err, task) {
		console.log('task',task);
		
		if(err){
			console.log('error:',err.message)
			res.send({
				status: 'Error: '+ err.message,
				params:{
					attachment:req.body.attachment
				}
		})
		}
		res.send(task);
	})

	})
	


var port = process.env.PORT || 8080

app.listen(port, function () {
	console.log('listening on port 8080')
});
