
import AvatarObject from "./AvatarObject.js";


const BIRTHDEATHRATE = 2500;
let lastBirthOrDeath = Date.now();

let canvas, context;
let users = [];

window.onload = () => {
    canvas = document.getElementById('container');
    canvas.width = document.documentElement.clientWidth - 16;
    canvas.height = document.documentElement.clientHeight -16;
    context = canvas.getContext("2d");
    context.imageSmoothingEnabled = false;
    users.push( new AvatarObject(`/imgs/sprite_${Math.floor((Math.random() * 100) + 1)}.png`));
    users.push( new AvatarObject(`/imgs/sprite_${Math.floor((Math.random() * 100) + 1)}.png`));
    users.push( new AvatarObject(`/imgs/sprite_${Math.floor((Math.random() * 100) + 1)}.png`));
    loop();
}

const loop = () => {

    if (Date.now() > BIRTHDEATHRATE + lastBirthOrDeath ) {
        console.log('in here');
        if (Math.random() < 0.30 && users.length <= 7) {
            users.push( new AvatarObject(`/imgs/sprite_${Math.floor((Math.random() * 100) + 1)}.png`));
        } else if (Math.random() < 0.10 && users.length > 3 && users.length <= 7) {
            users.shift();
        }
        lastBirthOrDeath = Date.now();
    }

    update();
    draw();
    requestAnimationFrame(loop);
}

const update = () => {
    users.forEach( (avatar) =>{
        avatar.update();
    });
}

const draw = () => {
    context.clearRect(0,0,canvas.width, canvas.height);
    users.forEach( (avatar) =>{
        avatar.draw(context);
    });
}

