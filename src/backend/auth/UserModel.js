import { genSaltSync, hashSync, compareSync } from "bcrypt-ts";
export class User {
    constructor(params = {}) {
        this.role = "USER";
        Object.assign(this, params);
    }
    getID() {
        return this.id;
    }
    getEmail() {
        return this.email;
    }
    getPassword() {
        return this.password;
    }
    getNick() {
        return this.nick;
    }
    setID(newID) {
        this.id = newID;
    }
    setPassword(newPassword) {
        this.password = newPassword;
    }
    hashPassword() {
        const salt = genSaltSync(13);
        const result = hashSync(this.password, salt);
        this.password = result;
    }
    checkPassword(enteredPassword) {
        return compareSync(enteredPassword, this.password);
    }
    getRole() {
        return this.role;
    }
    static fromJSON(json) {
        let user = new User(json);
        user.hashPassword();
        return (user);
    }
}
