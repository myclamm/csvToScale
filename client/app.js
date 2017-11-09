$( document ).ready(function() {
    var taskPayloads = [];
    var headers = [];

    document.getElementById("csvFile").addEventListener("change", csvToTasks, false);
    document.getElementById("sendTasks").addEventListener("click", sendTasks, false);

    //////////////Handsontable
    var data = [
      ["Attachment", "Status", "TaskId"]
    ];

    var container = document.getElementById('example');
    var hot = new Handsontable(container, {
      data: data,
      rowHeaders: true,
      colHeaders: true,
      colWidths: 300,
      width:1000,
      height:1000,
      copyPaste: true
    });

    var attachmentRow = {}

    var colA = 0
    var colB = 1
    var colC = 2

    var rowCount = 1
    //////////////////////////
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
            hot.setDataAtCell(rowCount,colA,payload.attachment)
            attachmentRow[payload.attachment] = rowCount
            rowCount++
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
    }

    function sendTasks () {
        console.log('taskPayloads',taskPayloads)

        _.each(taskPayloads, function(task){
            // $(".task-list").append("<li style='border:1px solid black'>"+task.attachment+" "+ "sent"+"</li>");
            $.post("/task/create", task)
                .done(function(res,status){
                    var row = attachmentRow[res.params.attachment]
                    console.log('res.params.attachment',res.params.attachment)
                    console.log('row',row)
                    hot.setDataAtCell(row,colB,res.status)
                    hot.setDataAtCell(row,colC,res.task_id)
                })
        })

        // $.post("/tasks/create", {
        //     tasks: taskPayloads
        // })
        // .done(function(res, status){
        //     console.log('response',res)
        // })

    }
});