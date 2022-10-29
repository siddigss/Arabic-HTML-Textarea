
// simple consists of a combination of control buttons and only one character.
// the letter must be the last element in the shortcut.
var continuousCaptureCount = {};
function captureSimpleHotkeys(e){
    
    captures = changeEnforcingDirShortcuts.map(element => {
        element = element.map(x => x.toLowerCase());
        let captured = true;
        if(element.includes('ctrl')){
            if(!e.ctrlKey){
                captured = false;
            }
        }
        if(element.includes('shift')){
            if(!e.shiftKey){
                captured = false;
            }
        }
        if(element.includes('alt')){
            if(!e.altKey){
                captured = false;
            }
        }
        if(element[element.length-1] != (e.key).toLowerCase()){
            captured = false;
        }
        if(continuousCaptureCount[element]>0 && captured == false){
            continuousCaptureCount[element] = 0;
        }
        if(captured == true){
            continuousCaptureCount[element] += 1;
            if(continuousCaptureCount[element] > 1){
                return false;
            }
        }
        return captured;       
    });
    
    captureCount = 0;
    for(let i=0; i < captures.length; i++){
        captureCount += captures[i];
    }

    return captureCount>0
}





