"use strict";

var msdnDomain = "*://msdn.microsoft.com/*";
var msdnSubdomain = "*://*.msdn.microsoft.com/*";
var docsDomain = "*://docs.microsoft.com/*";
var docsSubdomain = "*://*.docs.microsoft.com/*";


//// Decoded and Encoded URLs
// msdn
var decodedEnUsMsdnBaseUrl = "msdn.microsoft.com/en-us";
var encodedEnUsMsdnBaseUrl = encodeURIComponent(decodedEnUsMsdnBaseUrl);
var decodedMsdnBaseUrl = "msdn.microsoft.com/";
var encodedMsdnBaseUrl = encodeURIComponent(decodedMsdnBaseUrl);
// docs.microsoft
var decodedEnUsDocsBaseUrl = "docs.microsoft.com/en-us";
var encodedEnUsDocsBaseUrl = encodeURIComponent(decodedEnUsDocsBaseUrl);
var decodedDocsBaseUrl = "docs.microsoft.com/";
var encodedDocsBaseUrl = encodeURIComponent(decodedDocsBaseUrl);

//// Regular Expressions and Patterns
// msdn
var msdnPattern = encodedMsdnBaseUrl + "\\D{2}-\\D{2}";
var msdnRegEx = new RegExp(msdnPattern, "i");
// docs.microsoft
var docsPattern = encodedDocsBaseUrl + "\\D{2}-\\D{2}";
var docsRegEx = new RegExp(docsPattern, "i");

var shouldRedirectDocs;
var shouldRedirectMsdn;

chrome.storage.sync.get("msdn", function (items) {
    if (items.msdn === false) {
        shouldRedirectMsdn = false;
    } else {
        shouldRedirectMsdn = true;
    }
});

chrome.storage.sync.get("docs", function (items) {
    if (items.docs === false) {
        shouldRedirectDocs = false;
    } else {
        shouldRedirectDocs = true;
    }
});

function redirect(requestDetails) {

    var browserUrl_encoded = encodeURIComponent(requestDetails.url);
    if (!browserUrl_encoded || browserUrl_encoded === "undefined") {
        return;
    }

    // Redirect MSDN
    if (shouldRedirectMsdn && browserUrl_encoded.match(msdnRegEx)) {
        // Already in en-us?
        if (browserUrl_encoded.includes(encodedEnUsMsdnBaseUrl)) {
            return;
        }

        browserUrl_encoded = browserUrl_encoded.replace(msdnRegEx, encodedEnUsMsdnBaseUrl);
        var browserUrl_decoded = decodeURIComponent(browserUrl_encoded);

        return {redirectUrl: browserUrl_decoded};
    }
    // Redirect docs.microsoft
    if (shouldRedirectDocs && browserUrl_encoded.match(docsRegEx)) {
        // Already in en-us?
        if (browserUrl_encoded.includes(encodedEnUsDocsBaseUrl)) {
            return;
        }

        browserUrl_encoded = browserUrl_encoded.replace(docsRegEx, encodedEnUsDocsBaseUrl);
        var browserUrl_decoded = decodeURIComponent(browserUrl_encoded);

        return {redirectUrl: browserUrl_decoded};
    }
}

chrome.webRequest.onBeforeRequest.addListener(
    redirect,
    {urls: [msdnDomain, msdnSubdomain, docsDomain, docsSubdomain]},
    ["blocking"]
);

chrome.storage.onChanged.addListener(function (changes, namespace) {
    if (changes.docs !== undefined) {
        shouldRedirectDocs = changes.docs.newValue;
    }
    if (changes.msdn !== undefined) {
        shouldRedirectMsdn = changes.msdn.newValue;
    }
});