<?php
// subscribe/?host=shoutingtoutiao3.10010.com&url=
function testNode($name, $addr = "0.0.0.0")
{
	return "vmess://" . base64_encode('{"v":"2","ps":"' . $name . '","add":"' . $addr . '","port":"00000","id":"00000000-0000-0000-0000-000000000000","aid":"0","scy":"auto","net":"ws","type":"","host":"web.omeo.top","path":"/","tls":"","sni":""}');
}
function handler()
{
	try
	{
		if(isset($_REQUEST["url"]) && !empty($_REQUEST["url"]))
		{
			$output = array();
			logger(array("headers" => json_decode(file_get_contents("https://httpbin.org/headers"), true, 512, JSON_BIGINT_AS_STRING)));
			$data = trim(file_get_contents($_REQUEST["url"]));
			logger(array($_REQUEST["url"] => $http_response_header));
			if(isset($http_response_header[0]) && preg_match("/([\d]{3})/", $http_response_header[0], $matches))
			{
				if(isset($matches[1]) && (($matches[1] !== "200") && ($matches[1] !== "206") && ($matches[1] !== "301") && ($matches[1] !== "302") && ($matches[1] !== "303") && ($matches[1] !== "304") && ($matches[1] !== "307") && ($matches[1] !== "308")))
				{
					$output[0] = testNode("〖{$matches[1]}〗获取失败", (!isset($_REQUEST["host"]) || empty($_REQUEST["host"])) ? "0.0.0.0" : $_REQUEST["host"]);
					logger(array("errormsg" => $data));
				}
				else
				{
					$output[0] = testNode("〖" . (isset($matches[1]) ?$matches[1] : "200") . "〗获取成功", (!isset($_REQUEST["host"]) || empty($_REQUEST["host"])) ? "0.0.0.0" : $_REQUEST["host"]);
				}
			}
			if(!isset($_REQUEST["host"]) || empty($_REQUEST["host"]))
			{
				return $data;
			}
			$lines = trim((base64_encode(base64_decode($data)) === $data) ? base64_decode($data) : $data);
			foreach(explode(PHP_EOL, $lines) as $index => $line)
			{
				$url = parse_url(trim($line));
				// 节点类型
				$type = $url["scheme"];
				if(!empty($type))
				{
					if($type === "vmess")
					{
						// 节点信息
						$node = json_decode(base64_decode($url["host"]), true, 512, JSON_BIGINT_AS_STRING);
						// 修改为指定的 host
						$node["host"] = $_REQUEST["host"];
						// 当开启传输安全（tls）时，这个需要一起设置，未开启时此值会被软件自动过滤丢弃
						$node["sni"] = $_REQUEST["host"];
						$output[] = $type . "://" . base64_encode(json_encode($node, $GLOBALS["def_en_json_mask"]));
					}
					else
					{
						// 其他类型不进行处理
						$output[] = trim($line);
					}
				}
			}
			return base64_encode(implode(PHP_EOL, $output));
		}
		return "订阅地址有误，请确认后重试！";
	}
	catch(\Exception | \Error | \Throwable $e)
	{
		return $e->getMessage();
	}
	return "未知错误！";
}
logger(array("request" => array(
	"get" => $_GET,
	"post" => $_POST
)));
logger(array("server" => $_SERVER));
$result = (string)handler();
/**
return json_encode(array(
	"isBase64Encoded" => false,
	"statusCode" => 200,
	"headers" => array("Content-Type" => "text/html"),
	"body" => $result
), JSON_PRETTY_PRINT | $GLOBALS["def_en_json_mask"]);
*/
logger(array("result" => $result));
exit($result);
;?>