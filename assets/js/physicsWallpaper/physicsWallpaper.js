// simple 2d html5 interface
"use strict";

var canvas_pW;
var ctx_pW;
var foreground_pW;
var background_pW;

class Color_pW{
    constructor(stringValue){
        if(!stringValue.includes('rgb')){
            console.log("Color_pW made to accept only rgb variables for now");
            console.log(stringValue);
            return;
        }
        var rgb = stringValue.match(/\d+/g); 
        //var res = stringValue.replace(/(var\()(.*)\)/g, "$2");
        //var value = getComputedStyle(canvas).getPropertyValue(res);
        if(!rgb){
            console.log("rgb improperly parsed");
            return;
        }
        this.r = rgb[0];
        this.g = rgb[1];
        this.b = rgb[2];

    }
    get(){
        return 'rgb('+this.r+','+this.g+','+this.b+')';
    }
    getA(a){
        return 'rgba('+this.r+','+this.g+','+this.b+','+a+')';
    }
    hslToRgb(h, s, l){
        var r, g, b;

        if(s == 0){
            r = g = b = l; // achromatic
        }else{
            var hue2rgb = function hue2rgb(p, q, t){
                if(t < 0) t += 1;
                if(t > 1) t -= 1;
                if(t < 1/6) return p + (q - p) * 6 * t;
                if(t < 1/2) return q;
                if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            }

            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }

        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    }
}

function fade_pW(strength){
    ctx_pW.fillStyle=background_pW.getA(strength);
    ctx_pW.fillRect(0, 0, canvas_pW.width, canvas_pW.height);
}
function physicsWallpaperInit(canvasIn, colorForeground, colorBackground){
    if(!canvasIn){
        return;
    }
    canvas_pW = canvasIn;
    ctx_pW = canvas_pW.getContext("2d");
    if(!ctx_pW){
        return;
    }
    foreground_pW = new Color_pW(colorForeground);
    background_pW = new Color_pW(colorBackground);

    //var worldMatrix = new TransMatrix();

    function step(){
        //canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
        fade_pW(0.03, colorBackground);  
        
        var randomx = Math.random()*canvas.width;
        var randomy = Math.random()*canvas.height;
        
        drawCircle(new Point(randomx, randomy), 1, colorForeground);
        window.requestAnimationFrame(step);
    }

    window.requestAnimationFrame(step);
}

