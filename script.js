var onReady = function () {
	console.log("ready")

	var info_box = function(name, value) {
//   <!-- <div class="panel panel-primary">...</div> -->
		status_string = value["status"]
		console.log(status_string)
		if (status_string === "ok") {
			status = "panel-success"
		} else if (status_string === "warn") {
			status = "panel-warn"
		} else if (status_string === "error") {
			status = "panel-danger"
		} else {
			status = "";
		}
		console.log(status)

		// <div class="col-md-4">
		return `
			<div class="panel ">
		    	<div class="panel-body">
		      		${name}
	    		</div>

		    	<div class="panel-footer">${value}</div>
	  	</div>`
	  		// </div>
	}

	var update_status = function () {
		var xhr = new XMLHttpRequest();
		xhr.open('GET', '/status');
		// xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.onload = function() {
			if (xhr.status === 200) {
				var userInfo = JSON.parse(xhr.responseText);
				console.log(userInfo);

				serviceName = userInfo["name"] || "?";
				$(".heading").html("Status for "+serviceName+"");

				$("#main").empty();

				jQuery.each(userInfo, function(key, val) {
					$("#main").append(info_box(key, val))
					// $("#" + i).append(document.createTextNode(" - " + val));
				});
			}
		};
		xhr.send();
	}
	// setInterval(function(){update_status();}, 200000000);
	update_status();
}


$('document').ready(onReady);