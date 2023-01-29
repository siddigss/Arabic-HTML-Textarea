

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
        //ta.addEventListener('textInput', textareaInputHook); // does changing from input to textInput affect?
        ta.addEventListener('keydown', textareaHookDeletedText);
        ta.addEventListener('keydown', saveLastKeydownEvent);
        addAfterEventListener(ta, 'keydown', correctCursorPositionsAfterKeydown);
        addAfterEventListener(ta, 'click', e=>correctCursorPositionsAfterClick(e.target));
        addAfterEventListener(ta, 'selection', e=>correctCursorPositionsAfterClick(e.target));
        ta.addEventListener('copy', textareaCopyHook);
        ta.addEventListener('paste', textareaPasteHook);
        //ta.addEventListener('keydown',changeEnforcingDirByHotkeys); // we prefer the usage of window below.
        ta.addEventListener('keydown',changeLineLanguageByHotKeys);
        //ta.addEventListener('keyup',changeLineLanguageByHotKeys);
        addAfterEventListener(ta, 'keyup', changeLineLanguageByHotKeys);
        ta.value = RTLMark;
        ta.selectionStart = 1;
        ta.selectionEnd = 1;
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




