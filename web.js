
import AvatarObject from "./AvatarObject.js";
import UserObject from "./UserObject.js";

let canvas, context;

let users = [];
const disallowList = [
    'PretzelRocks',
    'StreamElements'
];


const client = new tmi.Client({
	connection: { reconnect: true },
	channels: [ 'Dr_DinoMight' ]
});


window.onload = () => {
    canvas = document.getElementById('container');
    canvas.width = document.documentElement.clientWidth - 16;
    canvas.height = document.documentElement.clientHeight -16;
    context = canvas.getContext("2d");
    context.imageSmoothingEnabled = false;

    client.connect();

    client.on("connected", (address, port) => {
        console.log("conected");
    })

    client.on("chat", (channel, userstate, message, self) => {
        // Don't listen to my own messages..
        if (self || disallowList.indexOf(userstate['display-name']) === 1) return;
        // Do your stuff.
        var user = users.find(o => o.username === userstate['display-name'])
        if (!user) {
            users.push(new UserObject(userstate['display-name']));
            console.log(users);
        }
        else{
            user.updateActivity();
        }
    });

    users.push(new UserObject('hello'));

    document.addEventListener('AvatarLoaded', () => {
        console.log("Loaded");
        loop();
    }, true)
}

const loop = () => {

    // if (Date.now() > BIRTHDEATHRATE + lastBirthOrDeath ) {
    //     console.log('in here');
    //     if (Math.random() < 0.30 && users.length <= 7) {
    //         users.push( new AvatarObject(`/imgs/sprite_${Math.floor((Math.random() * 100) + 1)}.png`));
    //     } else if (Math.random() < 0.10 && users.length > 3 && users.length <= 7) {
    //         users.shift();
    //     }
    //     lastBirthOrDeath = Date.now();
    // }
    update();
    draw();
    requestAnimationFrame(loop);
}

const update = () => {
    let newUser = [];
    users.forEach( (user) =>{
        if (user.deathTime >= Date.now()){
            newUser.push(user)
            user.update(true);
        }
    });
    users = newUser;
}

const draw = async () => {
    context.clearRect(0,0,canvas.width, canvas.height);
    users.forEach( (user) =>{
        user.avatar.draw(context);
    });
}

