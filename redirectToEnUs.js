chrome.tabs.onUpdated.addListener(function() {
	chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
	  if(!tabs || tabs.length==0)
		  return;
	  var tab = tabs[0];
	  var encTabUrl = encodeURIComponent(tab.url);
	  // Not the msdn page?
	  if(!encTabUrl || encTabUrl == "undefined")
		  return;
	  var decEnUsBaseUrl = "msdn.microsoft.com/en-us"
	  var encEnUsBaseUrl = encodeURIComponent(decEnUsBaseUrl);
	  
	  // Already in en-us?
	  if(encTabUrl.includes(encEnUsBaseUrl))
		  return;
	  
	  var decBaseUrl = "msdn.microsoft.com/"
	  var encBaseUrl = encodeURIComponent(decBaseUrl);
	  
	  var pattern = encBaseUrl + "\\D{2}-\\D{2}";
	  var re = new RegExp(pattern, "i");
	  
	  var encTabUrl = encTabUrl.replace(re, encEnUsBaseUrl);
	  var decTabUrl = decodeURIComponent(encTabUrl);

	  chrome.tabs.update(undefined, {url: decTabUrl});
	});
})