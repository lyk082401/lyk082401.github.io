<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS, CONNECT, TRACE");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Expose-Headers: *");
header("Access-Control-Max-Age: 2592000");
header("Timing-Allow-Origin: *");
include_once("logger.php");
function main_handler($event = null, $context = null)
{
	if($GLOBALS["workdirs"])
	{
		if($GLOBALS["workdirs"][0] === "logger")
		{
			// navigator.sendBeacon("", "数据");
			// (new Image()).src = "";
			return logAccess();
		}
		if($GLOBALS["workdirs"][0] === "jverification")
		{
			logger($_SERVER);
			return include_once("jverification-mobile-login.php");
		}
		if($GLOBALS["workdirs"][0] === "jverification-api")
		{
			return include_once("jverification-api.php");
		}
		if($GLOBALS["workdirs"][0] === "favicon.ico")
		{
			logger($_SERVER);
			return 0;
		}
		if($GLOBALS["workdirs"][0] === "subscribe")
		{
			return include_once("subscribe-node-handler.php");
		}
	}
}
exit(main_handler());
;?>