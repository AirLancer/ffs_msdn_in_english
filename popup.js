// Fix HTML
$(function() {
    setDocsCheckbox();
    setMsdnCheckbox();

    $("#docs").change(function(){
        if ($(this).is(':checked')) {
            saveDocsValue(true);
        } else{
            saveDocsValue(false);
        }
    });
    $("#msdn").change(function(){
        if ($(this).is(':checked')) {
            saveMsdnValue(true);
        } else{
            saveMsdnValue(false);
        }
    });
});

function setDocsCheckbox() {
    chrome.storage.sync.get("docs", function(items){
        if(items.docs === false){
            $("#docs").prop('checked', false);
        }else{
            $("#docs").prop('checked', true);
        }
    });
}

function setMsdnCheckbox() {
    chrome.storage.sync.get("msdn", function(items){
        if(items.msdn === false){
            $("#msdn").prop('checked', false);
        }else{
            $("#msdn").prop('checked', true);
        }
    });
}

function saveDocsValue(value) {
    chrome.storage.sync.set({ 'docs': value });
}

function saveMsdnValue(value) {
    chrome.storage.sync.set({ 'msdn': value });
}
