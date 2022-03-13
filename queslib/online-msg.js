if((/M2105K81AC/).test(navigator.userAgent))
{
	if(!sessionStorage.getItem("queslib-online-M2105K81AC"))
	{
		// parser.api.tipmsg("妈的，还看，祝你挂科！", "error", null, 5000);
		/**
		new $.Zebra_Dialog("妈的，还看，祝你挂科！", {
			auto_close: 1100,
			buttons: false,
			modal: false
		});
		*/
		sessionStorage.setItem("queslib-online-M2105K81AC", "ok");
	}
}