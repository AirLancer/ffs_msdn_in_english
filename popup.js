"use strict";
// Fix HTML
$(function () {
    setDocsCheckbox();
    setMsdnCheckbox();
    setSupportCheckbox();
    setAzureCheckbox();

    $("#docs").change(function () {
        if ($(this).is(':checked')) {
            saveDocsValue(true);
        } else {
            saveDocsValue(false);
        }
    });
    $("#msdn").change(function () {
        if ($(this).is(':checked')) {
            saveMsdnValue(true);
        } else {
            saveMsdnValue(false);
        }
    });
    $("#support").change(function () {
        if ($(this).is(':checked')) {
            saveSupportValue(true);
        } else {
            saveSupportValue(false);
        }
    });
    $("#azure").change(function () {
        if ($(this).is(':checked')) {
            saveAzureValue(true);
        } else {
            saveAzureValue(false);
        }
    });
});

function setDocsCheckbox() {
    chrome.storage.sync.get("docs", function (items) {
        if (items.docs === false) {
            $("#docs").prop('checked', false);
        } else {
            $("#docs").prop('checked', true);
        }
    });
}

function setMsdnCheckbox() {
    chrome.storage.sync.get("msdn", function (items) {
        if (items.msdn === false) {
            $("#msdn").prop('checked', false);
        } else {
            $("#msdn").prop('checked', true);
        }
    });
}

function setSupportCheckbox() {
    chrome.storage.sync.get("support", function (items) {
        if (items.support === false) {
            $("#support").prop('checked', false);
        } else {
            $("#support").prop('checked', true);
        }
    });
}

function setAzureCheckbox() {
    chrome.storage.sync.get("azure", function (items) {
        if (items.azure === false) {
            $("#azure").prop('checked', false);
        } else {
            $("#azure").prop('checked', true);
        }
    });
}

function saveDocsValue(value) {
    chrome.storage.sync.set({'docs': value});
}

function saveMsdnValue(value) {
    chrome.storage.sync.set({'msdn': value});
}

function saveSupportValue(value) {
    chrome.storage.sync.set({ 'support': value });
}

function saveAzureValue(value) {
    chrome.storage.sync.set({ 'azure': value });
}
