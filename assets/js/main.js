---

---

function createLink(parent, icon, link){
    if(parent){
        const linker = document.createElement('a');
        linker.href = link;

        linker.rel = "external";
        linker.target = "_blank";

        const image = document.createElement('img');
        image.src = icon;

        linker.appendChild(image);
        parent.appendChild(linker);
    }
}

function addLinks(input){
    const links = document.getElementById(input);
    if(links){

        createLink(links, "{{site.instagram.icon}}", "{{site.instagram.link}}");
        createLink(links, "{{site.twitter.icon}}", "{{site.twitter.link}}");
        createLink(links, "{{site.github.icon}}", "{{site.github.link}}");
        createLink(links, "{{site.linkedin.icon}}", "{{site.linkedin.link}}");
    }
}

function insertPost(post, htmldiv){
    var article = document.createElement('div');
    article.class = "article";

    var title = document.createElement('a');
    title.class = "articleTitle"
    title.href = post.url;
    title.innerHTML = post.title;

    var date = document.createElement('div');
    date.class = "articleDate"
    date.innerHTML = post.date;

    var text = document.createElement('div');
    text.class = "articleText"
    text.innerHTML = post.excerpt;

    article.appendChild(title);
    article.appendChild(date);
    article.appendChild(text);


    htmldiv.appendChild(article);
}

function parsePostsAndBuild(e, parent){
    if(e.detail){
        insertPost(e.detail, parent);
    }else{
        console.log("parsePostsAndBuild: empty result");
    }
}

addLinks('HeaderLinks');

if(queryContent){

    const content = document.getElementById("Content");
    if(content){
        content.addEventListener('queryResult', function(e){parsePostsAndBuild(e, content)}, false);
        queryContent("",content);
    }
}

