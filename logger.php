<?php
// logger/
function env($key, $default = null, $transformJsonArray = true)
{
	$val = $default;
	if(isset($_ENV[$key]))
	{
		$val = $_ENV[$key];
	}
	else if(getenv($key))
	{
		$val = getenv($key);
	}
	if($transformJsonArray && is_string($val) && !empty($val) && is_array(json_decode($val, true)))
	{
		$val = json_decode($val, true);
	}
	return $val;
}
$workdirs = array_values(array_filter(explode("/", $_SERVER["SCRIPT_NAME"])));
$workregion = env("ENVCONFIG", "{}")["region"] ? env("ENVCONFIG", "{}")["region"] : "ap-guangzhou";
$workurl = array(
	"ap-guangzhou" => "https://service-lb0eorvm-1252239881.gz.apigw.tencentcs.com/release/",
	"ap-hongkong" => "https://service-1wgha66g-1252239881.hk.apigw.tencentcs.com/release/"
)[$workregion];
$def_en_json_mask = JSON_PARTIAL_OUTPUT_ON_ERROR | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE;
function logger($log)
{
	try
	{
		return file_put_contents("php://stderr", json_encode($log, JSON_PRETTY_PRINT | $GLOBALS["def_en_json_mask"]) . PHP_EOL);
	}
	catch(\Exception | \Error | \Throwable $e)
	{
		file_put_contents("php://stderr", ((string)$log) . PHP_EOL);
		return file_put_contents("php://stderr", ($e->getMessage()) . PHP_EOL);
	}
}
function logAccess()
{
	return logger(array(
		"?" => rawurldecode($_SERVER["QUERY_STRING"]),
		"get" => $GET,
		"post" => $POST,
		"rawdata" => file_get_contents("php://input"),
		"jsonarray" => json_decode(file_get_contents("php://input"), true, 512, JSON_BIGINT_AS_STRING),
		"requestinfo" => $_SERVER
	));
}
// https://www.php.net/manual/zh/context.php
stream_context_set_default(array(
	"http" => array(
		"user_agent" => $_SERVER["HTTP_USER_AGENT"],
		"header" => array(
			"Accept: */*"
		),
		"follow_location" => 1,
		"max_redirects" => 5,
		"timeout" => 30.0,
		"ignore_errors" => true
	),
	"ssl" => array(
		"verify_peer" => false,
		"verify_peer_name" => false,
		"allow_self_signed" => true,
		"capture_peer_cert" => true,
		"capture_peer_cert_chain" => true
	)
));
;?>