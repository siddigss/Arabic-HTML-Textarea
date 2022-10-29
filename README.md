# Arabic-HTML-Textarea
Javascript packages that provide support for easier Arabic typing.


## Description
This javascript package works by altering the ambiguous inputs to the textarea by adding strong directional zero length characters. Doing this will allows for clearer writing and avoids the usual bi-directional headache resulting from the minimal support textareas have for bi-directional text.  

This project started with the idea od providing appropraite minimal eye-relieving and less stressing elements for writing LaTeX in Arabic. However, the usage of the Arabic HTML textarea will be much general than just LaTeX.


## Try the Package
Check the [projet page](https://siddigss.github.io/Arabic-HTML-Textarea/).


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

### Ensure Compatibility
For ease of usage this package must minimize the conflicts with other packages. This endeavour rises querstions about property `value` of the textarea and copying and pasting and possibly other questiosn.

### Producing and Looking for Test Cases
By this we mean a collection of string that look different in the textarea than the way we would like to look like. Collecting such examples will help in the process and in fact allow us to define a score for Arabic support text packages in general. This naturally requires writing a way to test them automatically.


## Project Structure
`index.html` is the project testing page.  
The tasks are seperated among files in a module manner. Once things are working the files may be combined.

