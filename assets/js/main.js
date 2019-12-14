---

---

function createLink(parent, icon, link){
    if(parent){
        const linker = document.createElement('a');
        linker.href = link;

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

addLinks('HeaderLinks');