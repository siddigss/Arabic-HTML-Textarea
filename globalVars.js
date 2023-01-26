var textareaIds = [];

// These regexes depend on the desired writing style and the keyboard layout.
// The layout assumed here is qwerty for English and the usualy Arabic one for Arabic.
//var enforceRegex = /[\\\+\{\}\=\+\(\)\[\]]/;
//var enforceRegex = /[\\\+\{\}]/;
var enforceRegex = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
var oneKeyRegex = /[`!@#$%^&*()_+\-=;':"\\|~]/; // ":?
var twoKeysRegex = /[\[\]{}.,<>\/]/;
var noNeedToEnforceRegex = /[?؟]/; // Our algorithm does not modify these.


var changeEnforcingDirShortcuts = [['ctrl', 'shift', 'KeyE']];

