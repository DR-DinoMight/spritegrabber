var gTextures = { loaded: 0, requested: 0 };
const PARTS_MAX = {
    eyes: 12,
    mouth: 8,
    ears: 6,
    torso: 5,
    hair: 22,
  };

let COLORS = {
    'dr_dinos': [ "#181B29", "#B3760A", "#FFB626", "#CC9900" ],
    'panthers': [ "#181B29", "#A40A0C", "#F14C4E", "#F11012"],
    'grand': [ "#4c1c2d", "#d23c4e", "#5fb1f5", "#eaf5fa"],
    'ice': [ "#7c3f58", "#eb6b6f", "#f9a875", "#fff6d3"],
}

var gParts = {}
var gColorMode = '012';


class SpriteMaker {

    constructor(color = null) {
        this.canvas = document.createElement('canvas');
        this.canvas.width = 16 * 6;
        this.canvas.height = 16 * 1;
        this.context = this.canvas.getContext('2d');
        this.loading = true;
        this.chosenColor = COLORS[color];
        // console.log(this.chosenColor, color, COLORS);
        // console.log('this.chosenColor', this.chosenColor)
    }

    async load() {
        await this.loadAllTextures();
        await this.randomiseAll();
        await this.updatecanvas();
    }

    getCanvas() {
        return this.canvas;
    }

    getImage() {
        var image = this.canvas.toDataURL("image/png");
        return image;
    }

    async loadTexture(key) {
        var self = this;
        var texture = new Image();
        texture.src = `./imgs/spriteParts/${key}.png?v=${Math.random()}`;
        gTextures.requested++;
        gTextures[key] = texture;
        if (key == 'hands') console.log(gTextures);
        texture.onload = function(e) {
            gTextures.loaded++;

            if (gTextures.loaded == gTextures.requested){
                self.updatecanvas().then(() => {
                    window.dispatchEvent(SpriteMakerLoaded);
                });
            }
        }
    }

    async loadAllTextures() {
        await this.loadTexture("hair");
        await this.loadTexture("base");
        await this.loadTexture("eyes");
        await this.loadTexture("mouth");
        await this.loadTexture("ears");
        await this.loadTexture("torso");
        await this.loadTexture("hands");
    }

    drawPart(key, forceY, forceFrame){
        var y = gParts[key] == null ? forceY : gParts[key]; // 0's falsy
        if(y == null){ return }
        var w = 16 * 6;
        var h = 16;

        if(forceFrame || forceFrame === 0){
            this.context.drawImage(gTextures[key], forceFrame*16, y*16, 16, 16, forceFrame*16, 0, 16, 16);
        } else {
            this.context.drawImage(gTextures[key], 0, y*16, w, h, 0, 0, w, h);
        }
    }


    async updatecanvas() {

        if (gTextures.loaded == gTextures.requested){
            this.loading = true;
            this.context.clearRect(0,0, this.canvas.width, this.canvas.height);
            this.context.drawImage(gTextures['base'], 0, 0);

            this.drawPart("hair");
            this.drawPart("torso");
            this.drawPart("ears");
            this.drawPart("mouth");
            this.drawPart("eyes");
            this.drawPart("hands", 0);

            // back of the hair
            // this.drawPart("hair", null, 4);
            // this.drawPart("hair", null, 1);
            await this.colourSprite();
            this.loading = false
            return this.canvas;
        }
    }

    async colourSprite() {
        var imageData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
        var data = imageData.data
        const keys = Object.keys(COLORS);
        // console.log(keys);
        var color = this.chosenColor || COLORS[keys[ keys.length * Math.random() << 0]];

        var C = (n) => {
            return [
                parseInt(color[n].substr(1, 2), 16),
                parseInt(color[n].substr(3, 2), 16),
                parseInt(color[n].substr(5, 2), 16)
            ];
        }

        var mode = gColorMode.split('').map(function(n){ return parseInt(n) });
        var dark = C(mode[0]);
        var mid = C(mode[1]);
        var light = C(mode[2]);

        for (var i=0; i<data.length; i+=4) {
            var r = data[i];
            if(r<50){
                data[i+0] = dark[0];
                data[i+1] = dark[1];
                data[i+2] = dark[2];
                data[i+3] = 255;
            } else if(r<180){
                data[i+0] = mid[0];
                data[i+1] = mid[1];
                data[i+2] = mid[2];
                data[i+3] = 255;
            } else if(r<245){
                data[i+0] = light[0];
                data[i+1] = light[1];
                data[i+2] = light[2];
                data[i+3] = 255;
            } else {
                data[i+0] = 255;
                data[i+1] = 255;
                data[i+2] = 255;
                data[i+3] = 0;
            }
        }
        this.context.putImageData(imageData,0,0);
    }

    async randomise(key){
        for (var i=0; i<6; i++){
            var max = PARTS_MAX[key];
            var randval = Math.floor(Math.random() * (max + 1));
            gParts[key] = randval;
        }
    }

    async randomiseAll(){
        await this.randomise("hair");
        await this.randomise("eyes");
        await this.randomise("mouth");
        await this.randomise("ears");
        await this.randomise("torso");
        this.loading = false;
    }

}

export var SpriteMakerLoaded = new Event (
    "SpritMakerLoaded", {
        bubbles: true,
        cancelable: true,
        composed: true
    }
)


export default SpriteMaker;
