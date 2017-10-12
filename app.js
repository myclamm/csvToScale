$( document ).ready(function() {
    var taskPayloads = [];
    var headers = [];

    document.getElementById("csvFile").addEventListener("change", csvToTasks, false);
    document.getElementById("sendTasks").addEventListener("click", sendTasks, false);

    function csvToTasks (evt) {
    	var data = null;
    	var file = evt.target.files[0];

    	Papa.parse(file, {
    		complete: function(results, file) {
    			headers = results.data.shift()
    			createTaskPayloads(results.data);
    			renderPreview();
    			console.log('taskPayloads',taskPayloads)
    		}
    	})
    }
    
    function createTaskPayloads(csvArray) {
    	_.each(csvArray, function (values) {
    		var payload = {}
    		
    		_.each(values, function (value, index) {
    			var field = headers[index];
    			payload[field] = value;
    		})

    		taskPayloads.push(payload);
    	})
    	$("#taskCount").text("("+taskPayloads.length+" tasks uploaded)")

    }

    function renderPreview () {
    	var preview = "";
    	var firstFive = taskPayloads.slice(0,5);

    	_.each(firstFive, function (payload,index) {
    		preview += "--Task "+(index+1)+"-- \n"
    		preview += "POST https://api.scaleapi.com/v1/task/annotation \n"
			preview += JSON.stringify(payload, null, 4)
			preview += "\n\n"
    	})

    	$("#preview").val(preview)
    	console.log('preview',preview)
    }

    function sendTasks () {
    	_.each(taskPayloads, function(payload) {
    		var token = $("#token").val()+":"
    		var base64Token = btoa(token)

			$.ajax({
			    url: "https://api.scaleapi.com/v1/task/annotation",
			    type: 'post',
			    crossOrigin: true,
			    data: payload,
			    headers: {
      			'Authorization': "Basic " + base64Token,
      			'Access-Control-Allow-Origin': "*"
      			},
			    dataType: 'json',
			    success: function (data) {
			        console.log(data);
			    }
			});

    	})
    }
});