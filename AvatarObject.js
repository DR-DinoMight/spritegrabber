const SPRITE_INCREMENT = 48,
      SPRITE_SIZE = 64,
      MOVEMENT_SPEED = 1.5,
      MIN_ANIMATION_TIME = 3000,
      MIN_TEXT_DISPLAY_TIME = 10000;


class AvatarObject {
    constructor(spriteImageLocation, direction = 'down', x = 0, y = 0, width = 16, height = 16, timePerFrame = 150, numberOfFrames = 2) {
        this.characterProperties = {
            'down': {x: 0, y: 0, reverse: false}, //down
            'up': {x: 16, y: 0, reverse: false}, //up
            'right': {x: 0, y: 0, reverse: true}, //right
            'left': {x: 32, y: 0, reverse: false}, //left
        };
        this.spriteImageLocation = spriteImageLocation
        this.spriteSheet = new Image(); // ImageLocation
        this.spriteSheet.src = this.spriteImageLocation;
        this.reversedSpriteSheet = document.createElement('canvas');

        this.spriteSheet.addEventListener('load', () => {

            this.reversedSpriteSheet.width = this.spriteSheet.width;
            this.reversedSpriteSheet.height = this.spriteSheet.height;
            const ctx2 = this.reversedSpriteSheet.getContext('2d');
            ctx2.scale(-1, 1); // flip
            ctx2.drawImage(this.spriteSheet, -this.spriteSheet.width, 0);
        //     // Done. Now you can use this.reversedSpriteSheet whenever you need the flipped sprites.
        }, {once: true});


        this.ideling = false;

        var keys = Object.keys(this.characterProperties);
        this.direction = keys[ keys.length * Math.random() << 0];
        this.x = x; // where to draw X coordinate
        this.y = y; // where to draw Y coordinate.
        this.width = width;     //the width of sprite
        this.height = height; // the height of sprite
        this.timePerFrame = timePerFrame; //time in(ms) given to each frame default 250ms
        this.numberOfFrames = numberOfFrames; //number of frames(sprites) in the spritesheet, default 1
        //current frame pointer
        this.frameIndex = 1;

        //last time frame index was updated
        this.lastUpdate = Date.now();
        this.lastAnimationChange = Date.now();
    }

    update() {

        if(Date.now() - this.lastUpdate >= this.timePerFrame) {
            this.frameIndex++;
            if(this.frameIndex > this.numberOfFrames) {
                this.frameIndex = 1;
            }
            this.lastUpdate = Date.now();
        }
    }

    changeAnimation(context) {

        let currentDate = Date.now();

        if (currentDate >= this.lastAnimationChange + MIN_ANIMATION_TIME &&
            Math.random() < 0.40
        ){
            if (Math.random() < 0.25)
            {
                this.ideling = true;
                this.direction = 'down';
            }
            else {
                this.ideling = false;
                var keys = Object.keys(this.characterProperties);
                this.direction = keys[ keys.length * Math.random() << 0];
            }
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

    draw(context) {

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

        context.drawImage(
            this.characterProperties[this.direction].reverse ? this.reversedSpriteSheet : this.spriteSheet,
            (this.frameIndex === 2) ? this.characterProperties[this.direction].x + SPRITE_INCREMENT : this.characterProperties[this.direction].x,
            this.characterProperties[this.direction].y,
            this.spriteSheet.width / 6,
            this.height,
            this.x,
            this.y,
            SPRITE_SIZE,
            SPRITE_SIZE
        );
    }
}

export default AvatarObject;
