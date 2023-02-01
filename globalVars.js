var textareaIds = [];

// These regexes depend on the desired writing style and the keyboard layout.
// The layout assumed here is qwerty for English and the usualy Arabic one for Arabic.

// \u061C is Arabic Letter Mark (ALM).
var enforceRegex = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/~\n]/;
//var oneKeyRegex = /[`!@#$%^&*()_+\-=;':"\\|~]/; // ":?
//var twoKeysRegex = /[\[\]{}.,<>\/]/;
//var noNeedToEnforceRegex = /[?؟]/; // Our algorithm does not modify these.


// The format for shortcuts is a combination of ctrl, shift, alt and possibly one letter a the end.
// everyone of these variables is a list of lists of shortcuts.
var changeEnforcingDirShortcuts = [['ctrl', 'shift', 'KeyE']];
var changeLineLanguageEnglsih = [['ctrl', 'shiftleft'], ['shift', 'controlleft']];
var changeLineLanguageArabic = [['ctrl', 'shiftright'], ['shift', 'controlright']];

