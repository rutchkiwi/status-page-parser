var onReady = function () {
	$(function () {
  		$('[data-toggle="tooltip"]').tooltip()
	});

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

	var health_check_box = function(name, value_map) {
		status_string = value_map["status"]
		delete value_map["status"]
		status = status_string_to_classname_suffix(status_string)

		if (status !== "default") {
			label = `<span class="label label-${status}">${status_string}</span>`
		} else {
			label = ""
		}

		inner_html = function(values){
			ret = ""
			jQuery.each(values, function(key, val) {
				ret = ret + " " +key + ": " + val + "<br>"
			});
			return ret;
		}

		comment = value_map["comment"]; delete value_map["comment"];
		help_html = `<div class="help_text"><i>${comment}</i><br/></div>`;

		return `
		<div class="col-md-6">
			<div class="panel panel-${status}">
			  <div class="panel-heading">
			  	<div class="panel-title pull-left">
			  		${name}</div>
			  	<div class="panel-title pull-right">${label}</div>
			  	<div class="clearfix"></div> 
			  </div>
			  <div class="panel-body">
			  	${help_html}
			    ${inner_html(value_map)}
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