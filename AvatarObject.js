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
    rotate: a("0,2f,1,2"),
    up: a("0,3,0f,3f"),
    down: a("1,4,1f,4f"),
    left: a("2,5"),
    right: a("2f,5f"),
    idle: a("0,0f")
}

var currentAnimName;

class AvatarObject {
    constructor(direction = 'idle', x = 0, y = 0, ) {
        currentAnimName = direction;
        this.spriteSheetMaker = new SpriteMaker();
        this.spriteSheet = this.spriteSheetMaker.getCanvas();

        this.ideling = false;

        var keys = Object.keys(ANIMS);
        this.direction = keys[ keys.length * Math.random() << 0];
        this.x = x; // where to draw X coordinate
        this.y = y; // where to draw Y coordinate.
        this.width = this.spriteSheet.width;     //the width of sprite
        this.height = this.spriteSheet.height; // the height of sprite
        this.timePerFrame = TIMESPERFRAME; //time in(ms) given to each frame default 250ms
        this.numberOfFrames = ANIMS[this.direction].length - 1; //number of frames(sprites) in the spritesheet, default 1
        //current frame pointer
        this.frameIndex = 0;

        //last time frame index was updated
        this.lastUpdate = Date.now();
        this.lastAnimationChange = Date.now();
    }

    async load() {
        await this.spriteSheetMaker.updatecanvas();
        this.spriteSheet = await this.spriteSheetMaker.getCanvas();
        // console.image( await this.spriteSheetMaker.getImage());
    }

    async update() {
        while (this.loading){
            setTimeout(() => {
                console.log('loading');
            }, 100);
        }

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
            Math.random() < 0.40
        ){
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

    displayMessage(context, message = '') {
        this.drawTextBG(context, this.message);
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
            this.changeAnimation(context);

            this.displayMessage(context, true);


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

            var anim = ANIMS[currentAnimName];
            var frame = anim[this.frameIndex];
            var len = anim.length;

            context.save();

            if(frame && frame.f){
                context.translate(16, 0);
                context.scale(-1, 1);
            }
            if (!anim[this.frameIndex]) this.frameIndex = 0;

            context.drawImage(
                await this.spriteSheetMaker.getCanvas(),
                anim[this.frameIndex].x * 16,
                anim[this.frameIndex].y,
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

export default AvatarObject;
