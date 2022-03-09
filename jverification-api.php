<?php
// jverification-api/getPhone/?operater=&token=
// jverification-api/verify/?operater=&phone=&token=
function postCurl($url, $data)
{
	$devKey = env("ENVCONFIG", "{}")["jiguang_devkey"];
	$devSecret = env("ENVCONFIG", "{}")["jiguang_devsecret"];
	$appKey = env("ENVCONFIG", "{}")["jiguang_appkey"];
	$masterSecret = env("ENVCONFIG", "{}")["jiguang_mastersecret"];
	$headers = array(
		"Content-type: application/json",
		"Authorization: Basic " . base64_encode("{$appKey}:{$masterSecret}")
	);
	$curl = curl_init();
	curl_setopt($curl, CURLOPT_URL, $url);
	curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);
	curl_setopt($curl, CURLOPT_POST, 1);
	curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
	curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
	curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
	$output = curl_exec($curl);
	curl_close($curl);
	return json_decode($output, true);
}
function ret($code, $status, $content, $requestId)
{
	return array(
		"code" => $code,
		"status" => $status,
		"content" => $content,
		"requestId" => $requestId
	);
}
function getPhone($loginToken, $exID = null)
{
	$data = json_encode(array(
		"loginToken" => $loginToken,
		"exID" => $exID
	), $GLOBALS["def_en_json_mask"]);
	$res = postCurl("https://api.verification.jpush.cn/v1/web/h5/loginTokenVerify", $data);
	if($res["code"] != 8000)
	{
		return ret($res["code"], "fail", $res["content"], isset($res["id"]) ? $res["id"] : 0);
	}
	// 认证成功对手机号解密
	$prikey = env("ENVCONFIG", "{}")["jverify_private_key"];
	$prikey = "-----BEGIN PRIVATE KEY-----" . PHP_EOL . trim(preg_replace("/\\\\n|\\\\r|\s+/", PHP_EOL, (string)$prikey)) . PHP_EOL . "-----END PRIVATE KEY-----";
	$phone = "";
	$encrypted = $res["phone"];
	set_error_handler(function($errno, $errstr, $errfile = null, $errline = null, $errcontext = array())
	{
		if((0 === error_reporting()) || !(error_reporting() & $errno))
		{
			return false;
		}
		throw new ErrorException($errstr, 0, $errno, $errfile, $errline);
	}, E_WARNING);
	try
	{
		$r = openssl_private_decrypt(base64_decode($encrypted), $phone, openssl_pkey_get_private($prikey), OPENSSL_PKCS1_PADDING);
	}
	catch(\Exception $e)
	{
		logger($e->getMessage());
		try
		{
			$r = openssl_private_decrypt(base64_decode($encrypted), $phone, openssl_pkey_get_private($prikey), OPENSSL_NO_PADDING);
		}
		catch(\Exception $e)
		{
			logger($e->getMessage());
		}
	}
	restore_error_handler();
	return ret($r ? 0 : -1, $r ? "success" : "fail", $r ? $phone : "decrypt phone failed", isset($res["id"]) ? $res["id"] : 0);
}
function verify($phone, $token, $exID = null)
{
	$data = json_encode(array(
		"phone" => $phone,
		"token" => $token,
		"exID" => $exID
	), $GLOBALS["def_en_json_mask"]);
	$res = postCurl("https://api.verification.jpush.cn/v1/web/h5/verify", $data);
	return ret(($res["code"] == 9000) ? 0 : $res["code"], ($res["code"] == 9000) ? "success" : "fail", $res["content"], isset($res["id"]) ? $res["id"] : 0);
}
logAccess();
if(isset($GLOBALS["workdirs"][1]) && ($GLOBALS["workdirs"][1] === "verify"))
{
	exit(json_encode(verify(isset($_REQUEST["phone"]) ? $_REQUEST["phone"] : exit(json_encode(ret(-1, "fail", "缺少参数 phone", "0"), $GLOBALS["def_en_json_mask"])), isset($_REQUEST["token"]) ? $_REQUEST["token"] : exit(json_encode(ret(-1, "fail", "缺少参数 token", "0"), $GLOBALS["def_en_json_mask"]))), $GLOBALS["def_en_json_mask"]));
}
else
{
	exit(json_encode(getPhone(isset($_REQUEST["token"]) ? $_REQUEST["token"] : exit(json_encode(ret(-1, "fail", "缺少参数 token", "0"), $GLOBALS["def_en_json_mask"]))), $GLOBALS["def_en_json_mask"]));
}
;?>