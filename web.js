
import AvatarObject from "./AvatarObject.js";
import UserObject from "./UserObject.js";

let canvas, context;

let users = [];
const disallowList = [
    'pretzelrocks',
    'streamelements'
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
        console.log("connected");
    })

    client.on("chat", (channel, userstate, message, self) => {
        // Don't listen to my own messages..
        if (self || disallowList.indexOf(userstate['display-name'].toLowerCase()) == 1) return;
        // Do your stuff.
        var user = users.find(o => o.username.toLowerCase() == userstate['display-name'].toLowerCase())
        // console.log(!user);
        if (!user) {

            if (userstate['display-name'].toLowerCase() == 'whitep4nth3r') {
                users.push(new UserObject(userstate['display-name'],'panthers'));
            }
            else if (userstate['display-name'].toLowerCase() == 'dr_dinomight') {
                users.push(new UserObject(userstate['display-name'], 'dr_dinos'));
            }
            else {
                users.push(new UserObject(userstate['display-name']));
            }

            // console.log(users);
        }
        else{
            user.updateActivity();
        }
    });

    // users.push(new UserObject('hello long name', 'dr_dinos'));

    document.addEventListener('AvatarLoaded', () => {
        loop();
    }, {
        once: true,
        passive: true,
        capture: true
      })
}

const loop = () => {
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
        // console.log('useruser)
        user.avatar.draw(context);
    });
}

