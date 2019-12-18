---
layout: basic
title: 
description: Contact page for Krone.dev
permalink: /

css: [constants]
scripts: [three/three.min, three/shapeStars, three/shapeScene, about]
---
<style>
    html, body{
        overflow: hidden;
        position: relative;
        height: 100%;
        margin: 0;
        padding: 0;
    }
    .aboutBar{

        height: 10vh;
        width: 100vw;
        background-color: red;
        z-index: 1000;
        position: fixed;
    }
    #aboutBarTop{
        top: 0;
    }
    #aboutBarBottom{
        bottom: 0;
    }
    #aboutCanvas { 
                height: 80vh;
                position: fixed;
                z-index: 2;
                //background-color: var(--primary1);
                color: var(--white);
     }
</style>
<div class='aboutBar' id = 'aboutBarTop'></div>
<canvas id='aboutCanvas'></canvas>
<div class='aboutBar' id = 'aboutBarBottom'></div>