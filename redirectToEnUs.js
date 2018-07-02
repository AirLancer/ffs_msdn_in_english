"use strict";

var msdnDomain = "*://msdn.microsoft.com/*";
var msdnSubdomain = "*://*.msdn.microsoft.com/*";
var docsDomain = "*://docs.microsoft.com/*";
var docsSubdomain = "*://*.docs.microsoft.com/*";
var supportDomain = "*://support.microsoft.com/*";
var supportSubdomain = "*://*.support.microsoft.com/*";

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
// support.microsoft
var decodedEnUsSupportBaseUrl = "support.microsoft.com/en-us";
var encodedEnUsSupportBaseUrl = encodeURIComponent(decodedEnUsSupportBaseUrl);
var decodedSupportBaseUrl = "support.microsoft.com/";
var encodedSupportBaseUrl = encodeURIComponent(decodedSupportBaseUrl);

//// Regular Expressions and Patterns
// msdn
var msdnPattern = encodedMsdnBaseUrl + "\\D{2}-\\D{2}";
var msdnRegEx = new RegExp(msdnPattern, "i");
// docs.microsoft
var docsPattern = encodedDocsBaseUrl + "\\D{2}-\\D{2}";
var docsRegEx = new RegExp(docsPattern, "i");
// support.microsoft
var supportPattern = encodedSupportBaseUrl + "\\D{2}-\\D{2}";
var supportRegEx = new RegExp(supportPattern, "i");

var shouldRedirectDocs;
var shouldRedirectMsdn;
var shouldRedirectSupport;

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

chrome.storage.sync.get("support", function (items) {
    if (items.support === false) {
        shouldRedirectSupport = false;
    } else {
        shouldRedirectSupport = true;
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
    // Redirect support.microsoft
    if (shouldRedirectSupport && browserUrl_encoded.match(supportRegEx)) {
        // Already in en-us?
        if (browserUrl_encoded.includes(encodedEnUsSupportBaseUrl)) {
            return;
        }

        browserUrl_encoded = browserUrl_encoded.replace(supportRegEx, encodedEnUsSupportBaseUrl);
        var browserUrl_decoded = decodeURIComponent(browserUrl_encoded);

        return {redirectUrl: browserUrl_decoded};
    }
}

chrome.webRequest.onBeforeRequest.addListener(
    redirect,
    {urls: [msdnDomain, msdnSubdomain,
            docsDomain, docsSubdomain,
            supportDomain, supportSubdomain]},
    ["blocking"]
);

chrome.storage.onChanged.addListener(function (changes, namespace) {
    if (changes.docs !== undefined) {
        shouldRedirectDocs = changes.docs.newValue;
    }
    if (changes.msdn !== undefined) {
        shouldRedirectMsdn = changes.msdn.newValue;
    }
    if (changes.support !== undefined) {
        shouldRedirectSupport = changes.support.newValue;
    }
});