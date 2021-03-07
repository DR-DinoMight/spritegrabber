import SpriteMaker from "./SpriteMaker.js";

const SPRITE_INCREMENT = 48,
      SPRITE_SIZE = 64,
      MOVEMENT_SPEED = 1.5,
      MIN_ANIMATION_TIME = 3000,
      MIN_TEXT_DISPLAY_TIME = 10000,
      TIMESPERFRAME = 250;

var a = function(n) {
return n
    .split(',')
    .map(function(k){ return { x: parseInt(k), f: !!k.match('f')} });
}
var ANIMS = {
    rotate: a("0,0f,4,2"),
    down: a("0,3,5f,2f"),
    up: a("1,4,4f,1f"),
    left: a("2,5"),
    right: a("0f,3f"),
    idle: a("3,2f")
}

var currentAnimName;

class AvatarObject {
    constructor(direction = 'idle', x = 0, y = 0, ) {
        currentAnimName = direction;
        this.spriteSheetMaker = new SpriteMaker();

        this.ideling = false;

        var keys = Object.keys(ANIMS);
        this.direction = keys[ keys.length * Math.random() << 0];
        this.x = x; // where to draw X coordinate
        this.y = y; // where to draw Y coordinate.
         // the height of sprite
        this.timePerFrame = TIMESPERFRAME; //time in(ms) given to each frame default 250ms
        this.numberOfFrames = ANIMS[this.direction].length - 1; //number of frames(sprites) in the spritesheet, default 1
        //current frame pointer
        this.frameIndex = 0;
    }

    async load() {
        this.spriteSheetMaker.load();
        window.addEventListener("SpritMakerLoaded", async () => {
            var image  = new Image();
            image.src = this.spriteSheetMaker.getImage();
            this.spriteSheet = image;
            this.reversedSpriteSheet = document.createElement('canvas');

            this.spriteSheet.addEventListener('load', () => {

                this.reversedSpriteSheet.width = this.spriteSheet.width;
                this.reversedSpriteSheet.height = this.spriteSheet.height;
                const ctx2 = this.reversedSpriteSheet.getContext('2d');
                ctx2.scale(-1, 1); // flip
                ctx2.drawImage(this.spriteSheet, -this.spriteSheet.width, 0);
            }, {once: true});

            console.log(image);
            this.width = this.spriteSheet.width;     //the width of sprite
            this.height = this.spriteSheet.height;
                    //last time frame index was updated
            this.lastUpdate = Date.now();
            this.lastAnimationChange = Date.now();
            document.dispatchEvent(AvatarLoaded);
        },true);

        // co;nsole.image( await this.spriteSheetMaker.getImage());
    }

    async update() {
        if(Date.now() - this.lastUpdate >= this.timePerFrame) {
            this.frameIndex++;
            if(this.frameIndex > this.numberOfFrames) {
                this.frameIndex = 0;
            }
            this.lastUpdate = Date.now();
        }
    }

    changeAnimation(context) {

        let currentDate = Date.now();

        if (currentDate >= this.lastAnimationChange + MIN_ANIMATION_TIME &&
            Math.random() < 0.80
        ){
            console.log('here');
            var keys = Object.keys(ANIMS);
            this.direction = keys[ keys.length * Math.random() << 0];
            this.lastAnimationChange = currentDate;
        }

        if (this.y + SPRITE_SIZE > context.canvas.height-5){
            this.direction = 'up'
            this.lastAnimationChange = Date.now();
        }else if (this.y < 5) {
            this.direction = 'down'
            this.lastAnimationChange = Date.now();
        }
        else if (this.x < 5) {
            this.direction = 'right'
            this.lastAnimationChange = Date.now();

        }
        else if (this.x + SPRITE_SIZE > context.canvas.width-5) {
            this.direction = 'left'
            this.lastAnimationChange = Date.now();
        }

        // console.log(this.x + SPRITE_SIZE, context.canvas.width, this.x + SPRITE_SIZE > context.canvas.width)
        // this.direction = direction;
        // this.frameIndex = 0;
    }

    setMessage(message) {
        this.message = message;
    }

    displayMessage(context, message) {
        this.drawTextBG(context, message || this.message);
    }

    drawTextBG(ctx, txt, font = '18px Arial') {
        /// lets save current state as we make a lot of changes
        ctx.save();

        /// set font
        ctx.font = font;

        /// draw text from top - makes life easier at the moment
        ctx.textBaseline = 'top';

        /// color for background
        ctx.fillStyle = '#fff';

        /// get width of text
        var width = ctx.measureText(txt).width;

        let y = this.y - 40;
        let x = this.x - width/2;

        if (y - 20 < 0) {
            y = this.y + SPRITE_SIZE + 20;
        }

        if (x - 60 < 0) {
            x = 0;
        }else if (this.x + width > ctx.canvas.width) {
            x = ctx.canvas.width - (width+30);
        }

        /// draw background rect assuming height of font
        ctx.fillRect(x, y, width, parseInt(font, 10)+30);

        /// text color
        ctx.fillStyle = '#000';

        /// draw text on top
        ctx.fillText(txt, x+10, y+10);

        /// restore original state
        ctx.restore();
    }

    async draw(context) {
        if (!this.loading) {
            var time = Date.now ? Date.now() : +(new Date());

            var nt = parseInt(time / 200);
            // var anim = ANIMS[this.direction];
            var anim = ANIMS[this.direction];
            var len = anim.length;

            var findex = nt % len;
            var frame = anim[findex];

            this.changeAnimation(context);

            this.displayMessage(context);


            if (!this.ideling) {
                if (this.direction == 'down') {
                    this.y += MOVEMENT_SPEED;
                }else if (this.direction == 'up') {
                    this.y -= MOVEMENT_SPEED;
                }else if (this.direction == 'right') {
                    this.x += MOVEMENT_SPEED;
                }else  if (this.direction == 'left') {
                    this.x -= MOVEMENT_SPEED;
                }
            }



            context.save();

            context.drawImage(
                !frame.f ? this.spriteSheet : this.reversedSpriteSheet,
                frame.x * 16,
                0,
                16,
                16,
                this.x,
                this.y,
                SPRITE_SIZE,
                SPRITE_SIZE
            );
            context.restore();
        }
    }
}

export var AvatarLoaded = new Event (
    "AvatarLoaded", {
        bubbles: true,
        cancelable: true,
        composed: true
    }
)

export default AvatarObject;
