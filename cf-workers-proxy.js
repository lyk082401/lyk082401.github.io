// cf-workers google-proxy.omeo.workers.dev
// cf-pages lyk082401.pages.dev

addEventListener("fetch", function(event)
{
	return event.respondWith(handleRequest(event.request));
});

async function handleRequest(request)
{
	let url = new URL(request.url);
	if(url.protocol === "http:")
	{
		url.protocol = "https:";
		return Response.redirect(url.href);
	}
	if(url.hostname.startsWith("google-proxy."))
	{
		return await proxy(request);
	}
	if(url.hostname.startsWith("proxy."))
	{
		let url = new URL(request.url);
		url.protocol = "https:";
		url.hostname = "lyk082401.pages.dev";
		url.port = 443;
		return fetch(new Request(url, request));
		// return await proxy(request, "lyk082401.pages.dev", true);
	}
	if((/^www\.|^m\./i).test(url.hostname))
	{
		return redirect(request, url.hostname.split(".")[0] + ".omeo.top", 302);
	}
	return await dump(request);
}

async function proxy(request, proxy_host = "www.google.com", useHttps = true)
{
	const blocked_region = ["XX"];
	const blocked_ip_address = ["0.0.0.0", "127.0.0.1"];
	const region = request.headers.get("cf-ipcountry") && request.headers.get("cf-ipcountry").toUpperCase();
	const ip_address = request.headers.get("cf-connecting-ip");
	const user_agent = request.headers.get("user-agent");
	if(blocked_region.includes(region))
	{
		return new Response("Access denied: WorkersProxy is not available in your region yet.", {status: 403});
	}
	else if(blocked_ip_address.includes(ip_address))
	{
		return new Response("Access denied: Your IP address is blocked by WorkersProxy.", {status: 403});
	}
	else
	{
		let url = new URL(request.url);
		url.host = proxy_host;
		url.protocol = "https:";
		if(!useHttps)
		{
			url.protocol = "http:";
		}
		let new_request_headers = new Headers(request.headers);
		new_request_headers.set("Host", url.host);
		new_request_headers.set("Referer", url.href);
		let original_response = await fetch(url.href, {
			method: request.method,
			headers: new_request_headers,
			body: request.body,
			// mode: "cors",
			// credentials: "include",
			// cache: "default",
			redirect: "manual",
			// referrer: request.url,
			// referrerPolicy: "unsafe-url",
			// integrity: ""
		});
		let new_response_headers = new Headers(original_response.headers);
		new_response_headers.set("access-control-allow-origin", "*");
		new_response_headers.set("access-control-allow-methods", "GET,POST,PUT,PATCH,DELETE,HEAD,OPTIONS,CONNECT,TRACE");
		new_response_headers.set("access-control-allow-headers", "*");
		new_response_headers.set("access-control-allow-credentials", "true");
		new_response_headers.set("access-control-expose-headers", "*");
		new_response_headers.set("access-control-max-age", "2592000");
		new_response_headers.delete("content-security-policy");
		new_response_headers.delete("content-security-policy-report-only");
		new_response_headers.delete("clear-site-data");
		new_response_headers.set("cf-original-response-header", JSON.stringify(iteratorToObject(original_response.headers, function(key, val, isArrs)
		{
			const reargs = [new RegExp("=." + url.hostname.split(".").slice(-2).join(".") + ";", "ig"), "=." + new URL(request.url).hostname.split(".").slice(-3).join(".") + ";"];
			if((key.toLowerCase() === "set-cookie") || (key.toLowerCase() === "set-cookie2"))
			{
				if(isArrs)
				{
					new_response_headers.append(key, String.prototype.replace.apply(val, reargs));
				}
				else
				{
					new_response_headers.set(key, String.prototype.replace.apply(val, reargs));
				}
			}
		})));
		const content_type = new_response_headers.get("content-type");
		let original_response_clone = new Response(original_response.body, original_response); // original_response.clone();
		let original_text = null;
		if(content_type.includes("text/html") && content_type.includes("UTF-8"))
		{
			original_text = await original_response_clone.text();
			original_text = original_text.replace(new RegExp("//" + url.host + "/", "ig"), "//" + new URL(request.url).host + "/");
		}
		else
		{
			original_text = original_response_clone.body;
		}
		return new Response(original_text, {
			status: original_response.status,
			headers: new_response_headers
		});
	}
}

function iteratorToObject(it, fn)
{
	let entry = {};
	for(let [key, val] of it)
	{
		if(typeof(entry[key]) === "undefined")
		{
			entry[key] = val;
			fn && fn(key, val, false);
		}
		else
		{
			if(typeof(entry[key].push) === "undefined")
			{
				var old = entry[key];
				entry[key] = [];
				entry[key].push(old);
				fn && fn(key, old, false);
			}
			entry[key].push(val);
			fn && fn(key, val, true);
		}
	}
	return entry;
}

async function dump(request)
{
	const init = (
	{
		status: 200,
		headers: {"content-type": "text/html; charset=UTF-8"}
	});
	let json = JSON.parse(JSON.stringify(request));
	json.fetcher = undefined;
	json.headers = iteratorToObject(request.headers);
	if(request.body != null)
	{
		let body = new Response(request.body, request);
		json.body.text = await body.text();
	}
	return new Response('<pre style="word-break: normal; word-wrap: normal; white-space: pre-wrap;" contenteditable>' + JSON.stringify(json, null, "\t").replace(/\</ig, "&lt;").replace(/\>/ig, "&gt;") + "</pre>", init);
}

function redirect(request, host = "web.omeo.top", status = 302)
{
	const url = "https://" + host + "/" + request.url.split("/").slice(3).join("/");
	return Response.redirect(url, status);
}