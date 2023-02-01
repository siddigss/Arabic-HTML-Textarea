# Arabic HTML Textarea
Javascript packages that provide support for easier Arabic typing.


## Description
This javascript package works by altering the ambiguous inputs to the textarea by adding strong directional zero length characters. Doing this will allows for clearer writing and avoids the usual bi-directional headache resulting from the minimal support textareas have for bi-directional text.  

This project started with the idea od providing appropraite minimal eye-relieving and less stressing elements for writing LaTeX in Arabic. However, the usage of the Arabic HTML textarea will be much general than just LaTeX.


## Try the Package
Check the [projet page](https://siddigss.github.io/Arabic-HTML-Textarea/).



## Deployment
To deploy the package add the following lines to your html file:

```<script type="text/javascript" src="afterEventsCreator.js"></script>
<script type="text/javascript" src="debuggingTools.js"></script>
<script type="text/javascript" src="globalVars.js"></script>
<script type="text/javascript" src="hotkeys.js"></script>
<script type="text/javascript" src="arabicSupport.js"></script>
<script type="text/javascript" src="prepareAndLaunch.js"></script>
```
For every textarea that you like to use this package add the attribute `data-dirEnforce="user"` to it.  

Check the [projet page](https://siddigss.github.io/Arabic-HTML-Textarea/) source for example. 

## Main tasks
### Event handling
Adding these additional characters require changing the default behaviour for
* Deleting (both forward and backward).
* Arrows
* Click
* Selection  

We do this by attaching eventListerners. The most annoying hurdle right now is that eventListener are excuted before the default action of the textarea. This means either rewriting the default action or find how to call it in the eventListerner and the do `preventDefault()`.

### Browsers Copatibility
At the moment chrome and edge seem to work reasonably but firefox behaves weirdly.

### Ensure Compatibility with Plain Textarea
For ease of usage this package must minimize the conflicts with other packages. This endeavour rises querstions about property `value` of the textarea and copying and pasting and possibly other questiosn.

### Ensure Global Variables do not collide with other packages.

### Producing and Looking for Test Cases
By this we mean a collection of string that look different in the textarea than the way we would like to look like. Collecting such examples will help in the process and in fact allow us to define a score for Arabic support text packages in general. This naturally requires writing a way to test them automatically.

## Status
Experimental. The textarea seems to work reasonably on chrome. However, it may behave weirdly on other browsers.

## Project Structure
* `index.html` is the project testing page.  
* The rest of the files are seperated in a modules manner. Once things are working the files may be combined.

