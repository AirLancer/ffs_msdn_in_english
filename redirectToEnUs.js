"use strict";

var learnDomain = "*://learn.microsoft.com/*";
var learnSubdomain = "*://*.learn.microsoft.com/*";
var supportDomain = "*://support.microsoft.com/*";
var supportSubdomain = "*://*.support.microsoft.com/*";
var azureDomain = "*://azure.microsoft.com/*";
var azureSubdomain = "*://*.azure.microsoft.com/*";

//// Decoded and Encoded URLs
// learn.microsoft
var decodedEnUsLearnBaseUrl = "learn.microsoft.com/en-us";
var encodedEnUsLearnBaseUrl = encodeURIComponent(decodedEnUsLearnBaseUrl);
var decodedLearnBaseUrl = "learn.microsoft.com/";
var encodedLearnBaseUrl = encodeURIComponent(decodedLearnBaseUrl);
// support.microsoft
var decodedEnUsSupportBaseUrl = "support.microsoft.com/en-us";
var encodedEnUsSupportBaseUrl = encodeURIComponent(decodedEnUsSupportBaseUrl);
var decodedSupportBaseUrl = "support.microsoft.com/";
var encodedSupportBaseUrl = encodeURIComponent(decodedSupportBaseUrl);
// azure.microsoft
var decodedEnUsAzureBaseUrl = "azure.microsoft.com/en-us";
var encodedEnUsAzureBaseUrl = encodeURIComponent(decodedEnUsAzureBaseUrl);
var decodedAzureBaseUrl = "azure.microsoft.com/";
var encodedAzureBaseUrl = encodeURIComponent(decodedAzureBaseUrl);

//// Regular Expressions and Patterns
// learn.microsoft
var learnPattern = encodedLearnBaseUrl + "\\D{2}-\\D{2}";
var learnRegEx = new RegExp(learnPattern, "i");
// support.microsoft
var supportPattern = encodedSupportBaseUrl + "\\D{2}-\\D{2}";
var supportRegEx = new RegExp(supportPattern, "i");
// azure.microsoft
var azurePattern = encodedAzureBaseUrl + "\\D{2}-\\D{2}";
var azureRegEx = new RegExp(azurePattern, "i");

var shouldRedirectLearn;
var shouldRedirectMsdn;
var shouldRedirectSupport;
var shouldRedirectAzure;

chrome.storage.sync.get("learn", function (items) {
    if (items.learn === false) {
        shouldRedirectLearn = false;
    } else {
        shouldRedirectLearn = true;
    }
});

chrome.storage.sync.get("support", function (items) {
    if (items.support === false) {
        shouldRedirectSupport = false;
    } else {
        shouldRedirectSupport = true;
    }
});

chrome.storage.sync.get("azure", function (items) {
    if (items.azure === false) {
        shouldRedirectAzure = false;
    } else {
        shouldRedirectAzure = true;
    }
});

function redirect(requestDetails) {

    var browserUrl_encoded = encodeURIComponent(requestDetails.url);
    if (!browserUrl_encoded || browserUrl_encoded === "undefined") {
        return;
    }

    // Redirect learn.microsoft
    if (shouldRedirectLearn && browserUrl_encoded.match(learnRegEx)) {
        // Already in en-us?
        if (browserUrl_encoded.includes(encodedEnUsLearnBaseUrl)) {
            return;
        }

        browserUrl_encoded = browserUrl_encoded.replace(learnRegEx, encodedEnUsLearnBaseUrl);
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
    // Redirect azure.microsoft
    if (shouldRedirectAzure && browserUrl_encoded.match(azureRegEx)) {
        // Already in en-us?
        if (browserUrl_encoded.includes(encodedEnUsAzureBaseUrl)) {
            return;
        }

        browserUrl_encoded = browserUrl_encoded.replace(azureRegEx, encodedEnUsAzureBaseUrl);
        var browserUrl_decoded = decodeURIComponent(browserUrl_encoded);

        return {redirectUrl: browserUrl_decoded};
    }
}

chrome.webRequest.onBeforeRequest.addListener(
    redirect,
    {urls: [learnDomain, learnSubdomain,
            supportDomain, supportSubdomain,
            azureDomain, azureSubdomain]},
    ["blocking"]
);

chrome.storage.onChanged.addListener(function (changes, namespace) {
    if (changes.learn !== undefined) {
        shouldRedirectLearn = changes.docs.newValue;
    }
    if (changes.support !== undefined) {
        shouldRedirectSupport = changes.support.newValue;
    }
    if (changes.azure !== undefined) {
        shouldRedirectAzure = changes.azure.newValue;
    }
});
