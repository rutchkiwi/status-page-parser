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


	var new_head = `
	  <meta http-equiv="content-type" content="text/html; charset=utf-8">
	  <title>waiting for js</title>

	  <link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css">
	  <link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap-theme.min.css">

	 <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.0/jquery.min.js"></script>
	 <script type="text/javascript" src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>

	 <!-- already loaded <script type="text/javascript" src="script.js"></script> -->
	 <link rel="stylesheet" type="text/css" href="style.css">
	`;

	var initial_body = `  <div class="container-fluid">
    <h1 class="page-header">Status</h1>
    <div class="row">
      <div class="col-md-4">
        <h2>Info</h2>
        <div class="list-group" id="info-list">


        </div>
      </div>

      <div class="col-md-8">
        <h2>&nbsp Health checks</h2>
        <div id="main">

          waiting for js phase 2 to load...
        </div>

      </div>
    </div>`;

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
				$("title").replaceWith("<title>Status for "+serviceName+"</title>");

				$("#main").empty();

				
				update_healthchecks(userInfo["healthchecks"])
				update_info(userInfo["info"])
			}
		};
		xhr.send();
	}

	// hack to load js and css from this script
	$('head').empty().append(new_head);
	$('body').empty().append(initial_body);

	update_status();
	// setInterval(function(){update_status();}, 200000000);
}

$('document').ready(onReady);