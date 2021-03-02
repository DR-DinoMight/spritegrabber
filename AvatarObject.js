const SPRITE_INCREMENT = 48,
      SPRITE_SIZE = 64,
      MOVEMENT_SPEED = 1.5,
      MIN_ANIMATION_TIME = 3000;


class AvatarObject {
    constructor(spriteImageLocation, direction = 'down', x = 0, y = 0, width = 16, height = 16, timePerFrame = 150, numberOfFrames = 2) {
        this.characterProperties = {
            'down': {x: 0, y: 0, reverse: false}, //down
            'up': {x: 16, y: 0, reverse: false}, //up
            'right': {x: 32, y: 0, reverse: false}, //right
            'left': {x: 32, y: 0, reverse: true}, //left
        };
        this.spriteImageLocation = spriteImageLocation
        this.spriteSheet = new Image(); // ImageLocation
        this.spriteSheet.src = this.spriteImageLocation;

        // this.spriteSheet.addEventListener('load', () => {

        // this.reversedSpriteSheet = document.createElement('canvas');
        // this.reversedSpriteSheet.width = this.spriteSheet.width;
        // this.reversedSpriteSheet.height = this.spriteSheet.height;
        //     const ctx = this.reversedSpriteSheet.getContext('2d');
        //     ctx.scale(-1, 1); // flip
        //     this.reversedSpriteSheet.draw(this.spriteSheet, -this.spriteSheet.width, 0);
        //     // Done. Now you can use this.reversedSpriteSheet whenever you need the flipped sprites.
        // }, {once: true});


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

        if (this.y + SPRITE_SIZE > context.canvas.height){
            this.direction = 'up'
            this.lastAnimationChange = Date.now();
        }else if (this.y < 0) {
            this.direction = 'down'
            this.lastAnimationChange = Date.now();
        }
        else if (this.x < 0) {
            this.direction = 'right'
            this.lastAnimationChange = Date.now();

        }
        else if (this.x + SPRITE_SIZE > context.canvas.width) {
            this.direction = 'left'
            this.lastAnimationChange = Date.now();
        }

        // console.log(this.x + SPRITE_SIZE, context.canvas.width, this.x + SPRITE_SIZE > context.canvas.width)
        // this.direction = direction;
        // this.frameIndex = 0;
    }

    displayMessage(context, randomMessage = false) {

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
            this.spriteSheet,
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







