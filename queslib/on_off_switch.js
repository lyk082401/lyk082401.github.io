$(document).ready(function() {
	$("#onoffswitch").on('click', function(){
		clickSwitch()
	});
 
	var clickSwitch = function() {
		if ($("#onoffswitch").is(':checked')) {
			alert("在ON的状态下");
		} else {
			alert("在OFF的状态下");
		}
	};
});