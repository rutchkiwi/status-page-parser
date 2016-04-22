var onReady = function () {
	// console.log("ready")

	var status_string_to_classname = function(status_string) {
		if (status_string === "ok") {
			return "panel-success"
		} else if (status_string === "warn") {
			return "panel-warn"
		} else if (status_string === "error") {
			return "panel-danger"
		} else {
			return "panel-default";
		}
	}

	var info_box = function(name, value) {
//   <!-- <div class="panel panel-primary">...</div> -->
		status_string = value["status"]
		status = status_string_to_classname(status_string)

		return `
		<div class="col-md-4">
			<div class="panel ${status}">
			  <div class="panel-heading">
			    <h3 class="panel-title">${name}</h3>
			  </div>
			  <div class="panel-body">
			    ${value}
			  </div>
			</div>
		</div>
		`
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
				$(".page-header").html("&nbsp&nbspStatus for "+serviceName+"");

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