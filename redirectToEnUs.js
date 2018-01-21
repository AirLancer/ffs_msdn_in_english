var msdnUrls_1 = "*://*.msdn.microsoft.com/*";
var msdnUrls_2 = "*://msdn.microsoft.com/*";
var decEnUsBaseUrl = "msdn.microsoft.com/en-us";
var encEnUsBaseUrl = encodeURIComponent(decEnUsBaseUrl);
var decBaseUrl = "msdn.microsoft.com/"
var encBaseUrl = encodeURIComponent(decBaseUrl);
var pattern = encBaseUrl + "\\D{2}-\\D{2}";
var re = new RegExp(pattern, "i");

function redirect(requestDetails) {

	var encReqUrl = encodeURIComponent(requestDetails.url);
	// Not the msdn page?
	if(!encReqUrl || encReqUrl == "undefined")
		return;

	// Already in en-us?
	if(encReqUrl.includes(encEnUsBaseUrl) || !encReqUrl.match(re))
		return;

	encReqUrl = encReqUrl.replace(re, encEnUsBaseUrl);
	var decTabUrl = decodeURIComponent(encReqUrl);

	return { redirectUrl: decTabUrl };
}

browser.webRequest.onBeforeRequest.addListener(
  redirect,
  {urls:[msdnUrls_1, msdnUrls_2]},
  ["blocking"]
);