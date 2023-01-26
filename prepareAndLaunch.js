

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
        ta.addEventListener('keydown', saveLastKeydownEvent);
        addAfterEventListener(ta, 'keydown', correctCursorPositionsAfterKeydown);
        addAfterEventListener(ta, 'click', e=>correctCursorPositionsAfterClick(e.target));
        addAfterEventListener(ta, 'selection', e=>correctCursorPositionsAfterClick(e.target));
        ta.addEventListener('copy', textareaCopyHook);
        ta.addEventListener('paste', textareaPasteHook);
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
//document.addEventListener('copy', (event) => { console.log('copied?!'); navigator.clipboard.writeText('New Text');});




