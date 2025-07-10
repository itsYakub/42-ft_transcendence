import { genSaltSync, hashSync, compareSync } from "bcrypt-ts";

export class User {
	private id: number;
	private email: string;
	private password: string;
	private nick: string;
	private avatar: string = "engineer.jpg";
	private role: string = "USER";

	constructor(params: Partial<User> = {}) {
		Object.assign(this, params);
	}

	getID(): number {
		return this.id;
	}

	getEmail(): string {
		return this.email;
	}

	getAvatar(): string {
		return this.avatar;
	}

	getPassword(): string {
		return this.password;
	}

	getNick(): string {
		return this.nick;
	}

	setID(newID: number): void {
		this.id = newID;
	}

	setPassword(newPassword: string): void {
		this.password = newPassword;
	}

	hashPassword(): void {
		const salt = genSaltSync(13);
		const result = hashSync(this.password, salt);
		this.password = result;
	}

	checkPassword(enteredPassword: string): boolean {
		return compareSync(enteredPassword, this.password);
	}

	getRole(): string {
		return this.role;
	}

	static fromJSON(json: Partial<User>): User {
		let user = new User(json);
		user.hashPassword();
		return (user);
	}
}
