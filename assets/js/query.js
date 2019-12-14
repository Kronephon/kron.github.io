---

---

//title,date,excerpt,url
function parseCSV(file, returnElem){
    var csvObject = Papa.parse(file, {header: true, skipEmptyLines:true});
    if(csvObject.errors.length == 0){
        for(i = 0; i < csvObject.data.length; ++i){
            var event = new CustomEvent('queryResult', { detail: csvObject.data[i] } );
            returnElem.dispatchEvent(event);
        }
    }
}

function queryContent(input, returnElem){ //TODO: add optional here
    if(!input){
        var xhr = new XMLHttpRequest();
        xhr.open('GET', "{{site.searchIndex}}", true);
            xhr.onreadystatechange = function() {
                if (this.readyState !== 4) return;
                if (this.status !== 200) return;
                parseCSV(this.response, returnElem);
            };
        xhr.send();
    }else{

    }
}