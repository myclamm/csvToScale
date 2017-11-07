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

                if (value){
                    if (field === "objects_to_annotate") {
                        payload[field] = value.split(",").map(function(x){
                            return x.trim();
                        })
                    } else if (field === "with_labels") {
                        payload[field] = _.lowerCase(value);
                    } else {
                        payload[field] = value;    
                    }    
                }
                


    			
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
        $.post("/tasks/create", {
            tasks: taskPayloads
        })
        .done(function(res, status){
            console.log('response',res)
        })

   //  	_.each(taskPayloads, function(payload) {
   //  		var token = $("#token").val()+":"
   //  		var base64Token = btoa(token)
    		
   //  		payload.headers = {
   //    			'Authorization': "Basic " + base64Token
   //    		}

   //  		$.post("https://api.scaleapi.com/v1/task/annotation",payload)
			// .done(function(res){
			// 	console.log('response',response)
			// })
   //  	})
    }
});