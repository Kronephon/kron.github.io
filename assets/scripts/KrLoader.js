var assetsLoaded = false;
//var customLoaded = false;

document.addEventListener('loaded', function (e) {
    if(assetsLoaded == true){
        var elem = document.getElementById('loadingScreen');
        if(elem){
            elem.parentNode.removeChild(elem); 
        }
        
    }
}, false);


/*setTimeout(
    function() {
        assetsLoaded = true;
        var event = new Event('loaded');
        document.dispatchEvent(event);
}, 5000);*/


window.onload = function() {
    assetsLoaded = true;
    var event = new Event('loaded');
    document.dispatchEvent(event);
};

function Loading() {

    loading = document.createElement('div');
    loading.id = "loadingScreen";

    var styles = `
    #loadingScreen {
        position: fixed;
        left: 0;
        top: 0;
        bottom: 0;
        right: 0;
        z-index: 2;
        background-color: rgba(0,0,0,0.8);
    }`
    var styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
    //var sheet = window.document.styleSheets[0];
    //console.log(sheet);
    //console.log(sheet.cssRules);
    //sheet.insertRule("", sheet.cssRules.length);
    
    document.body.appendChild(loading);
}


Loading();