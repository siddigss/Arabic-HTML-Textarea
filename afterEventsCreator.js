// For simplicity here we define an after event to be an artificial event that is 
// dispatched from this javascript code. The goal of an after event is to be handled
// just after the event is handled. After events are defined by two arguments:
// the element in which it will be handled
// the event it will be handled after.
// the function it will call.
// We include the function in order to impose a strict order between called function
// if needed later and because it fits the objective of their definition to begin with.
// I am not sure if this method works in the senario of Arabic HTML textarea project,
// I would appreciate if someone can guarantee its robustness.


var afterEventsName = [];
var afterEventsData = {};

function addAfterEventListener(elem, eve, func){
    let afterEve = createAfterEvent(elem, eve)
    let f =function(){
        elem.dispatchEvent(afterEve);
    };
    elem.addEventListener(eve, function(e){setTimeout(f,0); afterEventsData[afterEve.type]=e;})
    elem.addEventListener(afterEve.type, e => func(afterEventsData[e.type]));
}

function createAfterEvent(){
    // approximate bound from birthday paradox to avoid collisions with more than 50%.
    stringLength = Math.ceil(2*Math.log(afterEventsName.length + 1)/Math.log(36));
    stringLength = Math.max(5, stringLength);
    s = '';
    while(afterEventsName.includes(s) || s.length == 0)
        s = getRandomString(stringLength);
    afterEventsName[afterEventsName.length+1] = s;
    var afterEve = new Event(s);
    return afterEve;
}

function getRandomString(length){
    s = '';
    while(s.length < length)
        s = Math.random().toString(36).slice(2, length+2);
    return s;
}

