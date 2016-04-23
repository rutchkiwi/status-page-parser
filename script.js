var onReady = function () {

	var status_string_to_classname_suffix = function(status_string) {
		if (status_string === "ok") {
			return "success";
		} else if (status_string === "warning") {
			return "warning";
		} else if (status_string === "error") {
			return "danger";
		} else {
			return "default";
		}
	}

	var is_object = function(obj) {
  		return obj === Object(obj);
	}

	var make_meat = function(value) {
		if (is_object(value)) {
			return JSON.stringify(value)
		} else {
			return value
		}
	}

	var health_check_box = function(name, value) {
		status_string = value["status"]
		status = status_string_to_classname_suffix(status_string)
		meat = make_meat(value)

		if (status !== "default") {
			label = `<span class="label label-${status}">${status_string}</span>`
		} else {
			label = ""
		}

		return `
		<div class="col-md-6">
			<div class="panel panel-${status}">
			  <div class="panel-heading">
			  	<div class="panel-title pull-left">${name}</div>
			  	<div class="panel-title pull-right">${label}</div>
			  	<div class="clearfix"></div> 
			  </div>
			  <div class="panel-body">
			    ${meat}
			  </div>
			</div>
		</div>
		`
	}

	var update_info = function(info){

		value_html = function(val){
			if (is_object(val)){
				ret = ""
				jQuery.each(val, function (key, val){
					ret = ret + " " +key + ": " + val + "<br>"
				});
				return ret;
			} else {
				return val;
			}
		};

		info_element = function(key, val) {
			return `
				<a href="#" class="list-group-item">
            		<h4 class="list-group-item-heading">${key}</h4>
            		<p class="list-group-item-text">${value_html(val)}</p>
          		</a>
          `;
		};

		$("#info-list").empty();
		jQuery.each(info, function(key, val) {
			$("#info-list").append(info_element(key, val));
		});
	};

	var update_healthchecks = function(healthchecks){
		jQuery.each(healthchecks, function(key, val) {
			$("#main").append(health_check_box(key, val))
		});
	};

	var update_status = function () {
		console.log("updating")
		var xhr = new XMLHttpRequest();
		xhr.open('GET', '/status.json');
		// xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.onload = function() {
			if (xhr.status === 200) {
				var userInfo = JSON.parse(xhr.responseText);

				serviceName = userInfo["name"] || "?";
				$(".page-header").html("Status for "+serviceName+"");

				$("#main").empty();

				
				update_healthchecks(userInfo["healthchecks"])
				update_info(userInfo["info"])
			}
		};
		xhr.send();
	}
	// setInterval(function(){update_status();}, 200000000);
	update_status();
}


$('document').ready(onReady);