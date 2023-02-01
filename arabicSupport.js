
var LTRMark = '\u200E';
var RTLMark = '\u200F';
//var ArabicLineBegining = RTLMark + '\u061C' + RTLMark;
//var EnglishLineBegining = LTRMark + '\u061C' + LTRMark;
var targetedTextareas = [];
var currentEnforcingDirection = 'EN';
var deletedText = '';
var lastKeydownEvent;
//var lastInputLanguage = 'AR';

function enforceDir(c, dir, e){
    if(typeof(lastKeydownEvent) != undefined){
        if(arabicKeyPressed(lastKeydownEvent)){
            dir = 'AR';
        }
    }

    if(dir == 'AR'){
        return RTLMark + c + RTLMark; 
    }
    if(dir == 'EN'){
        return LTRMark + c + LTRMark; 
    }
}

function setCurrentEnforcingDirection(dir){
    currentEnforcingDirection = dir;
    document.getElementById('pEnforcingDir').innerText = currentEnforcingDirection;
}


// e is a keydown event.
function arabicKeyPressed(e){
    switch(e.key){
        case '.':
        case ',':
            return e.shiftKey;
        case '،':
            return true;
        case '[':
        case '{':
            return e.code != 'BracketLeft';
        case ']':
        case '}':
            return e.code != 'BracketRight';
        case '>':
            return e.code != 'Period';
        case '<':
            return e.code != 'Comma';
        case '/':
            return e.code != 'Slash';
    }
    return false;
}


// e is an input event for a textarea.
function textareaInputHook(e){
    let content = e.target.value;
    if(e.inputType == 'insertText'){
        if(e.target.value[e.target.selectionStart-3]=='\n'){
            // what did I want to do here?
            let ta = e.target;
            let cursorPosition = ta.selectionStart;
            let inputChar = e.data;
            let dirChar = RTLMark;
            if(isEnglish(inputChar) || (isAmbiguousChar(e.data) && currentEnforcingDirection=='EN')){
                dirChar = LTRMark;
            }
            ta.value = ta.value.substr(0, cursorPosition-4) + dirChar + '\n' + dirChar + 
                    ta.value.substr(cursorPosition-1, ta.value.length-cursorPosition+1);
            e.target.selectionStart = cursorPosition;
            e.target.selectionEnd = cursorPosition;
        }
        if(e.target.selectionStart==2){
            let ta = e.target;
            let cursorPosition = ta.selectionStart;
            let inputChar = e.data;
            let dirChar = RTLMark;
            if(isEnglish(inputChar) || (isAmbiguousChar(e.data) && currentEnforcingDirection=='EN')){
                dirChar = LTRMark;
            }
            ta.value = dirChar + ta.value.substr(1, ta.value.length-1);
            e.target.selectionStart = cursorPosition;
            e.target.selectionEnd = cursorPosition;
        }  


        if(isAmbiguousChar(e.data)){
            let cursorPosition = e.target.selectionStart;
            e.target.value = content.substr(0, cursorPosition-1) + 
            enforceDir(e.data, currentEnforcingDirection, e) +
            content.substr(cursorPosition, content.length-1);    
            e.target.selectionStart = cursorPosition+2;
            e.target.selectionEnd = cursorPosition+2;
        }
    }
    if(e.inputType == 'insertLineBreak'){
        let cursorPosition = e.target.selectionStart;
        e.target.value = content.substr(0, cursorPosition-1) + 
            enforceDir('\n', currentEnforcingDirection, e) +
            content.substr(cursorPosition, content.length-1);   
            e.target.selectionStart = cursorPosition+2;
            e.target.selectionEnd = cursorPosition+2;  
    }

    if(e.inputType == 'deleteContentBackward' || e.inputType == 'deleteContentForward'){        
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
    try{
        document.getElementById('textarea2').value = toUnicode(e.target.value);
    }
    catch(error){
        console.log('No debugging textarea to show hexes.');
    }
}


function textareaHookDeletedText(e){


    if(e.key == 'Backspace'){
        // to avoid deleting the first character which is the direction of the first line.
        if(e.target.value.length == 1){
            e.preventDefault();
            return '';
        }    

        let correction = 0;
        if(e.target.selectionStart == e.target.selectionEnd){
            correction = -1;
        }
        deletedText = e.target.value.substr(e.target.selectionStart + correction
            , e.target.selectionEnd - e.target.selectionStart - correction);
    }
    if(e.key == 'Delete'){
        // to avoid deleting the first character which is the direction of the first line.
        if(e.target.value.length == 1){
            e.preventDefault();
            return '';
        }
    
        let correction = 0;
        if(e.target.selectionStart == e.target.selectionEnd){
            correction = +1;
        }
        deletedText = e.target.value.substr(e.target.selectionStart
            , e.target.selectionEnd - e.target.selectionStart + correction);
    }

    return '';
}

function saveLastKeydownEvent(e){
    lastKeydownEvent = e;
}


function correctCursorPositions(ta, dir){
    selection = (ta.selectionStart != ta.selectionEnd);
    currentSelectionStart = ta.selectionStart;
    currentSelectionEnd = ta.selectionEnd;


    // quick clumsy fix.
    if(currentSelectionStart == 0){
        currentSelectionStart = 1;
        if(currentSelectionEnd == 0){
            currentSelectionEnd = 1;
        }
        selection = (ta.selectionStart != ta.selectionEnd);
    }

    // end of clumsy fix




    if(isAmbiguousChar(ta.value[currentSelectionStart-1])){
        currentSelectionStart = currentSelectionStart - 2;
        if(dir == 1){
            currentSelectionStart = currentSelectionStart + 3;
        }
    }
    else if((ta.value[currentSelectionStart-1] == LTRMark ||
        ta.value[currentSelectionStart-1] == RTLMark)){
            if(isAmbiguousChar(ta.value[currentSelectionStart-2])){
                // nothig
            }
            else{   // must mean the letter after is ambiguous except if it is the beginning of the textarea.
                if(currentSelectionStart > 1){
                    currentSelectionStart = currentSelectionStart - 1;
                    if(dir == 1){
                        currentSelectionStart = currentSelectionStart + 3;
                    }            
                }
            }
    }
    if(!selection){
        currentSelectionEnd = currentSelectionStart;
    }
    else{
        if(isAmbiguousChar(ta.value[currentSelectionEnd-1])){
            currentSelectionEnd = currentSelectionEnd + 1;
            if(dir == -1){
                currentSelectionStart = currentSelectionStart - 3;
            }
        }
        else if((ta.value[currentSelectionEnd-1] == LTRMark ||
            ta.value[currentSelectionEnd-1] == RTLMark)){
                if(isAmbiguousChar(ta.value[currentSelectionEnd-2])){
                    // nothig
                }
                else{   // must mean the letter after is ambiguous.
                    currentSelectionEnd = currentSelectionEnd + 2;
                    if(dir == -1){
                        currentSelectionStart = currentSelectionStart - 3;
                    }        
                }
        }    
    }

    ta.selectionStart = currentSelectionStart;
    ta.selectionEnd = currentSelectionEnd;
}

function correctCursorPositionsAfterKeydown(e){
    let ta = e.target;
    dir = 0;
    if(e.key == 'ArrowLeft'){
        dir = -1;
    }
    if(e.key == 'ArrowRight'){
        dir = 1;
    }

    // testing
    if(getLineLanguage(ta, ta.selectionStart) == 'Arabic'){
        dir = - dir;
    }
    // a little hacky solution for the arrowup and arrowdown movements when there is no text in a line. Needs to check more if it
    // always work and does not cause other issues.
    if(e.key == 'ArrowUp' && getLineLanguage(ta, ta.selectionStart) == 'English'){
        dir = 1;
    }
    if(e.key == 'ArrowDown' && getLineLanguage(ta, ta.selectionStart) == 'English'){
        dir = 1;
        if(getPreviousLineLanguage(ta, ta.selectionStart) == 'Arabic'){
            dir = 0;
        }
    }
    if(e.key == 'ArrowUp' && getLineLanguage(ta, ta.selectionStart) == 'Arabic'){
        dir = -1;
    }
    // end testing

    correctCursorPositions(ta, dir);
}


function correctCursorPositionsAfterClick(ta){
    selection = (ta.selectionStart != ta.selectionEnd);
    currentSelectionStart = ta.selectionStart;
    currentSelectionEnd = ta.selectionEnd;

    if(currentSelectionStart == 0){
        currentSelectionStart = 1;
        if(currentSelectionEnd == 0){
            currentSelectionEnd = 1;
        }
        selection = (ta.selectionStart != ta.selectionEnd);
    }


    if(isAmbiguousChar(ta.value[currentSelectionStart-1])){
        currentSelectionStart = currentSelectionStart + 1;
    }
    else if((ta.value[currentSelectionStart-1] == LTRMark ||
        ta.value[currentSelectionStart-1] == RTLMark)){
            if(isAmbiguousChar(ta.value[currentSelectionStart-2])){
                // nothig
            }
            else{   // must mean the letter after is ambiguous except if it is the beginning of the textarea.
                if(currentSelectionStart > 1)
                    currentSelectionStart = currentSelectionStart - 1;
            }
    }
    if(!selection){
        currentSelectionEnd = currentSelectionStart;
    }
    else{
        if(isAmbiguousChar(ta.value[currentSelectionEnd-1])){
            currentSelectionEnd = currentSelectionEnd + 1;
        }
        else if((ta.value[currentSelectionEnd-1] == LTRMark ||
            ta.value[currentSelectionEnd-1] == RTLMark)){
                if(isAmbiguousChar(ta.value[currentSelectionEnd-2])){
                    // nothig
                }
                else{   // must mean the letter after is ambiguous.
                    currentSelectionEnd = currentSelectionEnd -1;
                }
        }    
    }

    ta.selectionStart = currentSelectionStart;
    ta.selectionEnd = currentSelectionEnd;
}




function newLineDirection(){

}

function getLineBeginningPosition(ta, cursorPosition){
    let i=cursorPosition-1;
    while(i>0){
        if(ta.value[i]=='\n')
            return i+2;
        i--;
    }
    return 1;
}

// returns the languagge of the first character of the line that contains cursorPosition.
function getLineLanguage(ta, cursorPosition){
    let c = ta.value[getLineBeginningPosition(ta, cursorPosition)-1];
    /* old method
    if(isArabic(c))
        return 'Arabic'
    else
        return 'English' 
    */
   if(c == RTLMark)
        return 'Arabic';
    if(c == LTRMark)
        return 'English';
}
function getPreviousLineLanguage(ta, cursorPosition){
    let index = getLineBeginningPosition(ta, cursorPosition);
    if(index == 1){
        return null;
    }
    index = getLineBeginningPosition(ta, index-3)-1;
    let c = ta.value[index];
    if(c == RTLMark)
        return 'Arabic';
    if(c == LTRMark)
        return 'English';
}



// is this finished?
function enforcedStringLength(str){
    tmp = str;
    tmp = tmp.replace(new RegExp(/[\u200E\u200F]/,'g'), '');
}


function changeEnforcingDirByHotkeys(e){
    if(captureSimpleHotkeys(e, changeEnforcingDirShortcuts)){
        if(currentEnforcingDirection == 'AR'){
            setCurrentEnforcingDirection('EN');
            let ta = e.target;
            let selectionStart = ta.selectionStart;
            let selectionEnd = ta.selectionEnd;
            let s = ta.value.substr(selectionStart, selectionEnd-selectionStart);
            s = s.replace(/\u200F/g, "\u200E");
            ta.value = ta.value.substr(0, selectionStart) + s + ta.value.substr(selectionEnd, ta.value.length-selectionEnd);
            ta.selectionStart = selectionStart;
            ta.selectionEnd = selectionEnd;
        }
        else if(currentEnforcingDirection == 'EN'){
            setCurrentEnforcingDirection('AR');
            let ta = e.target;
            let selectionStart = ta.selectionStart;
            let selectionEnd = ta.selectionEnd;
            let s = ta.value.substr(selectionStart, selectionEnd-selectionStart);
            s = s.replace(/\u200E/g, "\u200F");
            ta.value = ta.value.substr(0, selectionStart) + s + ta.value.substr(selectionEnd, ta.value.length-selectionEnd);
            ta.selectionStart = selectionStart;
            ta.selectionEnd = selectionEnd;
        }
    }
}



function textareaCopyHook(e){
    let ta = e.target;
    if(ta.selectionStart < ta.selectionEnd){
        selectedText = ta.value.substr(ta.selectionStart, ta.selectionEnd);
        newText = removeEnforcingChars(selectedText);
        navigator.clipboard.writeText(newText);
    }
}

// lacks edge cases implementation.
function textareaPasteHook(e){
    let ta = e.target;
    pastedText = e.clipboardData.getData("text");
    newPastedText = autoEnforcer(pastedText);
    newText = ta.value.substr(0,ta.selectionStart) + newPastedText + 
    ta.value.substr(ta.selectionEnd,ta.value.length - ta.selectionEnd);
    let newcursorPosition = ta.selectionStart + newPastedText.length;
    ta.value = newText;
    ta.selectionStart = newcursorPosition;
    ta.selectionEnd = newcursorPosition;
    e.preventDefault();
}

function removeEnforcingChars(s){
    newS = s.replace(new RegExp(/[\u200E\u200F]/,'g'), '');
    return newS;
}

function autoEnforcer(s){
    let enforcingChar = LTRMark;
    if(currentEnforcingDirection == 'AR')
        enforcingChar = RTLMark;
    newS = s.replace(enforceRegex, enforcingChar + '$&' + enforcingChar);
    return newS;
}

function changeLineLanguageByHotKeys(e){
    if(captureSimpleHotkeys(e, changeLineLanguageArabic)){
        setLineLanguage(e.target, e.target.selectionStart, 'Arabic')
        e.preventDefault();
    }
    if(captureSimpleHotkeys(e, changeLineLanguageEnglsih)){
        setLineLanguage(e.target, e.target.selectionStart, 'English')
        e.preventDefault();
    }
    // looks clumsy, but works for now. This is to stop Ctrl+Shift from chaing the dir attribute of the textarea.
    e.target.dir = "auto";
}

function setLineLanguage(ta, cursorPosition, language){
    let lineStart = getLineBeginningPosition(ta, cursorPosition);
    let lineStartString = '';
    if(language == 'Arabic'){
        if(lineStart == 1){
            lineStartString = RTLMark;
        }
        else{
            lineStartString = RTLMark + '\n' + RTLMark;
        }
    }
    else if(language == 'English'){
        if(lineStart == 1){
            lineStartString = LTRMark;
        }
        else{
            lineStartString = LTRMark + '\n' + LTRMark;
        }
    }
    else{
        console.assert('Unkowned Language');
    }
    ta.value = ta.value.substr(0, lineStart-lineStartString.length) + lineStartString + ta.value.substr(lineStart, ta.value.length-lineStart);
    ta.selectionStart = cursorPosition;
    ta.selectionEnd = cursorPosition;
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

function concatenateRegex(regex1, regex2){
    var flags = (regex1.flags + regex2.flags).split("").sort().join("").replace(/(.)(?=.*\1)/g, "");
    return new RegExp(regex1.source + regex2.source, flags);    
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

function isArabic(text) {
    var pattern = /[\u0600-\u06FF\u0750-\u077F]/;
    result = pattern.test(text);
    return result;
}
function isEnglish(text) {
    var pattern = /[a-zA-Z]/;
    result = pattern.test(text);
    return result;
}

function isRTL(s){           
    var ltrChars    = 'A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02B8\u0300-\u0590\u0800-\u1FFF'+'\u2C00-\uFB1C\uFDFE-\uFE6F\uFEFD-\uFFFF',
        rtlChars    = '\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC',
        rtlDirCheck = new RegExp('^[^'+ltrChars+']*['+rtlChars+']');

    return rtlDirCheck.test(s);
};