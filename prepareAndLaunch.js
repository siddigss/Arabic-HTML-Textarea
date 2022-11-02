

function fillTextareasIds(){ // TODO
    textareaIds.push("textarea1");
} 
function fillTargetedTextareas(e){
    fillTextareasIds();
     textareaIds.forEach(name => {
        ta = document.getElementById(name)
        targetedTextareas.push(ta);
        ta.dir = "auto";
        ta.addEventListener('input', textareaInputHook);
        ta.addEventListener('keydown', textareaHookDeletedText);
        addAfterEventListener(ta, 'keydown', correctCursorPositionsAfterKeydown);
        addAfterEventListener(ta, 'click', e=>correctCursorPositionsAfterClick(e.target));
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





