import AvatarObject from "./AvatarObject.js";

const DEATHRATE = 100000;

class UserObject {
    constructor(username) {
        this.username = username;
        this.avatar = new AvatarObject()
        this.avatar.load();
        this.avatar.setMessage(this.username);
        this.lastTimeSeen = Date.now();
        this.deathTime = this.lastTimeSeen + DEATHRATE;
    }

    updateActivity() {
        this.lastTimeSeen = Date.now();
        this.deathTime = this.lastTimeSeen + DEATHRATE;
    }

    update(displayDebug=false){
        if (displayDebug){
            this.avatar.setMessage(this.username);
        }
        this.avatar.update();
    }
}

export default UserObject;
