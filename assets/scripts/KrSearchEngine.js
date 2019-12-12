---

---
// script is very dependent on structure in feed.html as it generates html code for it

LIMIT_PER_PAGE = 99;

var index = []

var all = [];
all.push("all");
{% for post in site.posts %}
all.push("{{post.url}}");
{% endfor %}
index.push(all);

{% for tag in site.tags %}
{% assign t = tag | first %}
var {{t}} = [];
{{t}}.push("{{t}}");
{% for post in site.posts %}
{% if post.tags contains t%}
{{t}}.push("{{post.url}}");
{% endif %}
{% endfor %}
index.push({{t}});
{% endfor %}

//receives a tag and goes through all the posts needed, if -1 presents all pending limit

function query(input) {
    result = [];
    for (var i = 0; i < index.length; i++) {
        if (index[i][0] == input) {
            result = index[i];
        }
    }
    if (result.length > 1) {
        insertFeed(result);
    }
}

function insertFeed(result) {
    container_block = document.getElementsByClassName('ArticleFeed')[0];
    if(container_block){
        clearFeed(container_block);
        for (var i = 1; i < result.length && i <= LIMIT_PER_PAGE; i++) {
            //get data
            var xhr = new XMLHttpRequest();
            xhr.open('GET', result[i], true);
            xhr.onreadystatechange = function() {
                if (this.readyState !== 4) return;
                if (this.status !== 200) return;
                var ref = this.responseURL.substr(window.location.href.length -5);
                parseAndBuild(this.responseText, container_block, ref);
            };
            xhr.send();
        }
    }
}

function parseAndBuild(htmlInput, destination_block, ref){ //TODO : requires sanitation
    //title, ref, date, excerpt, tags

    var dateRX = new RegExp(/.*?(<meta name=\"date\" content=\"(.*)\">).*?/g);
    date = dateRX.exec(htmlInput)[2];

    var titleRX = new RegExp(/(.*?<title>)(.*)(<\/title>.*?)/g);
    title = titleRX.exec(htmlInput)[2];

    var excerptRX = new RegExp(/.*?(<meta name=\"excerpt\" content=\"(.*)\">).*?/g);
    excerpt = excerptRX.exec(htmlInput)[2];

    var tagRX = new RegExp(/.*?(<meta name=\"tag_.+\" content=\"(.*)\">).*?/g);
    var tags = [];
    do {
        tag = tagRX.exec(htmlInput);
        if(tag){
            tags.push(tag[2]);
        }
    } while(tag);
    insertArticle(destination_block, createBlock(title, ref, date, excerpt, tags));

}

function insertArticle(destination, block)
{
    destination.appendChild(block);
}

function clearFeed(block) {
    block.innerHTML = "";
}

function createBlock(title, ref, date, excerpt, tags) {

    article = document.createElement('article');
    article.id = title.replace(/\s/g, '')+date.replace(/\s/g, '');

    var styles = `
    article#`+article.id+` {
        order: ` + parseInt(date.replace(/-/g, '')) + `;
    `
    var styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    divTitle = document.createElement('a');
    divTitle.className = "Title";
    divTitle.innerHTML = title;
    divTitle.href = ref;
    article.appendChild(divTitle);

    divDate = document.createElement('div');
    divDate.className = "Date";
    divDate.innerHTML = date;
    article.appendChild(divDate);

    for (var i = 0; i < tags.length; i++) {

        divTag = document.createElement('button');
        divTag.className = "Tag";
        divTag.type = "click";
        divTag.value = tags[i];
        divTag.onclick = function() {query(this.value);};
        divTag.innerHTML = tags[i];
        article.appendChild(divTag);

    }
    divExcerpt = document.createElement('div');
    divExcerpt.className = "Excerpt";
    divExcerpt.innerHTML = excerpt;
    article.appendChild(divExcerpt);

    return article;
}

function initFeed() {
    container_block = document.getElementsByClassName('ArticleFeed')[0];
    if (container_block) {
        query("all");
    }
}