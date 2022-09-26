"use strict";
// Fix HTML
$(function () {
    setLearnCheckbox();
    setSupportCheckbox();
    setAzureCheckbox();

    $("#learn").change(function () {
        if ($(this).is(':checked')) {
            saveLearnValue(true);
        } else {
            saveLearnValue(false);
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

function setLearnCheckbox() {
    chrome.storage.sync.get("learn", function (items) {
        if (items.learn === false) {
            $("#learn").prop('checked', false);
        } else {
            $("#learn").prop('checked', true);
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

function saveLearnValue(value) {
    chrome.storage.sync.set({'learn': value});
}

function saveSupportValue(value) {
    chrome.storage.sync.set({ 'support': value });
}

function saveAzureValue(value) {
    chrome.storage.sync.set({ 'azure': value });
}
