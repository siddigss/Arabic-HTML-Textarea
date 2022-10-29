

function fillTextareasIds(){ // TODO
    textareaIds.push("textarea1");
} 
function fillTargetedTextareas(e){
    fillTextareasIds();
     textareaIds.forEach(name => {
        ta = document.getElementById(name)
        targetedTextareas.push(ta);
        ta.addEventListener('input', textareaInputHook);
        ta.addEventListener('keydown', textareaHookDeletedText);
        ta.addEventListener('keydown', textareaHookArrowsKeydown);
    });
}

function hotkeysPreperations(){
    for(let i=0 ; i<changeEnforcingDirShortcuts.length; i++){
        continuousCaptureCount[changeEnforcingDirShortcuts[i]] = 0
    }
}

// writing document instead of window doesn't work.
window.addEventListener('load', fillTargetedTextareas);
window.addEventListener('load', hotkeysPreperations);
window.addEventListener('keydown',changeEnforcingDirByHotkeys);





