
var LTRMark = '\u200E';
var RTLMark = '\u200F';
var targetedTextareas = [];
var currentEnforcingDirection = 'AR';
var deletedText = '';


function enforceDir(c, dir){
    if(dir == 'AR'){
        return RTLMark + c + RTLMark; 
    }
    if(dir == 'EN'){
        return LTRMark + c + LTRMark; 
    }
}

// e is an input event for a textarea.
function textareaInputHook(e){
    content = e.target.value;
    if(e.inputType == 'insertText'){
        //if(isAmbiguousChar(content[content.length-1])){
        if(isAmbiguousChar(e.data)){
            let cursorPosition = e.target.selectionStart;
            e.target.value = content.substr(0, cursorPosition-1) + 
            enforceDir(e.data, currentEnforcingDirection) +
            content.substr(cursorPosition, content.length-1);    
            e.target.selectionStart = cursorPosition+2;
            e.target.selectionEnd = cursorPosition+2;
        }    
    }
    if(e.inputType == 'deleteContentBackward'){
        let newContent = '';
        // assume no selection, is this always the case?
        let cursorPosition = e.target.selectionStart;
        // earliest to avoid using left and right notions.
        earliesDeletedtLetter = deletedText[0];
        latestDeletedtLetter = deletedText[deletedText.length-1];

        if(deletedText.length == 1){
            if(isAmbiguousChar(earliesDeletedtLetter)){
                newContent = content.substr(0,cursorPosition-1) + 
                 content.substr(cursorPosition+1,content.length-2);
                 e.target.value = newContent;
                 e.target.selectionStart = cursorPosition-1;
                 e.target.selectionEnd = cursorPosition-1;
            }
            if(earliesDeletedtLetter==LTRMark || earliesDeletedtLetter==RTLMark){
                if(isAmbiguousChar(content[cursorPosition-1])){
                    newContent = content.substr(0,cursorPosition-2) + 
                    content.substr(cursorPosition,content.length-2);
                    e.target.value = newContent;
                    e.target.selectionStart = cursorPosition-2;
                    e.target.selectionEnd = cursorPosition-2;
                }
                else if(isAmbiguousChar(content[cursorPosition])){
                    newContent = content.substr(0,cursorPosition) + 
                    content.substr(cursorPosition+2,content.length-2);
                    e.target.value = newContent;
                    e.target.selectionStart = cursorPosition;
                    e.target.selectionEnd = cursorPosition;
                }
            }
        }
        else if(deletedText.length == 2){
            if(isAmbiguousChar(earliesDeletedtLetter)){
                newContent = content.substr(0,cursorPosition-1) + 
                 content.substr(cursorPosition+1,content.length-2);
                 e.target.value = newContent;
                 e.target.selectionStart = cursorPosition-1;
                 e.target.selectionEnd = cursorPosition-1;
            }
            else if(earliesDeletedtLetter==LTRMark || earliesDeletedtLetter==RTLMark){
                if(isAmbiguousChar(content[cursorPosition-1])){
                    newContent = content.substr(0,cursorPosition-2) + 
                    content.substr(cursorPosition,content.length-2);
                    if(deletedText[1] == RTLMark || deletedText[1] == LTRMark){
                        newContent = newContent.substr(0,cursorPosition-2) + 
                        newContent.substr(cursorPosition+1,newContent.length-2);    
                    }
                    e.target.value = newContent;
                    e.target.selectionStart = cursorPosition-2;
                    e.target.selectionEnd = cursorPosition-2;
               }
                else if(isAmbiguousChar(content[cursorPosition])){
                    newContent = content.substr(0,cursorPosition) + 
                    content.substr(cursorPosition+2,content.length-2);
                    e.target.value = newContent;
                    e.target.selectionStart = cursorPosition;
                    e.target.selectionEnd = cursorPosition;
                }
            }
            else{
                if(deletedText[1] == RTLMark || deletedText[1] == LTRMark){
                    newContent = content.substr(0,cursorPosition) + 
                    content.substr(cursorPosition+2,content.length-2);    
                    e.target.value = newContent;
                    e.target.selectionStart = cursorPosition;
                    e.target.selectionEnd = cursorPosition;
                }
            }
        }
        else if(deletedText.length == 3 && 
            (earliesDeletedtLetter == LTRMark || earliesDeletedtLetter == RTLMark ) &&
            isAmbiguousChar(deletedText[1])){
                // nothing to change, only needed to isolate this case from the following if.
        }
        else if(deletedText.length >= 2){
            newContent = content;
            newCursorPosition = cursorPosition;
            if(isAmbiguousChar(earliesDeletedtLetter)){
                newContent = newContent.substr(0,cursorPosition-1) + 
                newContent.substr(cursorPosition,newContent.length-1);
                newCursorPosition = newCursorPosition - 1;
            }
            if(earliesDeletedtLetter == LTRMark || earliesDeletedtLetter == RTLMark){
                if(isAmbiguousChar(newContent[newCursorPosition-1])){
                    newContent = newContent.substr(0,newCursorPosition-2) + 
                    newContent.substr(newCursorPosition,newContent.length-2);
                    newCursorPosition = newCursorPosition - 2;
                }
            }
            if(isAmbiguousChar(latestDeletedtLetter)){
                newContent = newContent.substr(0,newCursorPosition) + 
                newContent.substr(newCursorPosition+1,newContent.length-1);
            }
            if(latestDeletedtLetter == LTRMark || latestDeletedtLetter == RTLMark){
                if(isAmbiguousChar(newContent[newCursorPosition])){
                    newContent = newContent.substr(0,newCursorPosition) + 
                    newContent.substr(newCursorPosition+2,newContent.length-2);
                }
            }
            e.target.value = newContent;
            e.target.selectionStart = newCursorPosition;
            e.target.selectionEnd = newCursorPosition;
        }
    }



    // for testing, remove later
    document.getElementById('textarea2').value = toUnicode(e.target.value);
}


function textareaHookDeletedText(e){
    if(e.key == 'Backspace'){
        let correction = 0;;
        if(e.target.selectionStart == e.target.selectionEnd){
            correction = -1;
        }
        deletedText = e.target.value.substr(e.target.selectionStart + correction
            , e.target.selectionEnd - e.target.selectionStart - correction);
    }
    return '';
}

function textareaHookArrowsKeydown(e){
    currentSelectionStart = e.target.selectionStart;
    currentSelectionEnd = e.target.selectionEnd;
    selection = (currentSelectionStart != currentSelectionEnd);
    shiftHeld = e.shiftKey;
    if(e.key == 'ArrowLeft'){
        /*if(currentSelectionStart != currentSelectionEnd){
            currentSelectionEnd = currentSelectionStart;
        }
        */
        if(isAmbiguousChar(e.target.value[currentSelectionStart-1])){
            currentSelectionStart = currentSelectionStart - 1;
            if(selection){
                if(currentSelectionEnd < currentSelectionStart + 2){
                    currentSelectionEnd = currentSelectionStart + 2;
                }
            }
        }
        else if((e.target.value[currentSelectionStart-1] == LTRMark ||
            e.target.value[currentSelectionStart-1] == RTLMark)){
                if(isAmbiguousChar(e.target.value[currentSelectionStart-2])){
                    currentSelectionStart = currentSelectionStart - 2;
                }
                else{   // must mean the letter after is ambiguous.
                    if(selection){
                        if(currentSelectionEnd < currentSelectionStart + 2){
                            currentSelectionEnd = currentSelectionStart + 2;
                        }
                    }
                }
        }
        if(!shiftHeld && selection)
            currentSelectionEnd = currentSelectionStart + 1;
    }



    e.target.selectionStart = currentSelectionStart;
    e.target.selectionEnd = currentSelectionEnd;

}


function enforcedStringLength(str){
    tmp = str;
    tmp = tmp.replace(new RegExp(/[\u200E\u200F]/,'g'), '');
}


function changeEnforcingDirByHotkeys(e){
    if(captureSimpleHotkeys(e)){
        if(currentEnforcingDirection == 'AR'){
            currentEnforcingDirection = 'EN';
        }
        else if(currentEnforcingDirection == 'EN'){
            currentEnforcingDirection = 'AR';
        }
    }
}


// helping functions
function isAmbiguousChar(c){
    if(!isChar(c)){
        return false;
    }
    if(enforceRegex.test(c)){
        return true;
    }
    return false;
}

function isChar(c){
    if(typeof(c) =="string" && c.length == 1){
        return true;
    }
    return false;
}



// credits?
function toUnicode(str) {
	return str.split('').map(function (value, index, array) {
		var temp = value.charCodeAt(0).toString(16).padStart(4, '0');
		if (temp.length > 2) {
			return '\\u' + temp;
		}
		return value;
	}).join('');
}

