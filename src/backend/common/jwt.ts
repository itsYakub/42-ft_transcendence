import { createHmac } from 'crypto';
import { User } from '../auth/User';

function createHMAC(message: string, secret: string) {
	return createHmac('sha256', secret)
		.update(message)
		.digest("base64");
}

function replaceChars(input: string) {
	return input.replace(/[=+/]/g, charToBeReplaced => {
		switch (charToBeReplaced) {
			case '=':
				return '';
			case '+':
				return '-';
			case '/':
				return '_';
		}
	});
};

export function createJWT(user: User): string {
	let header = JSON.stringify(
		{
			"typ": "JWT",
			"alg": "HS256"
		});
	var date = new Date();
	date.setDate(date.getDate() + 3);
	let payload = JSON.stringify(
		{
			"sub": user.getID(),
			"name": user.getNick(),
			"role": user.getRole(),
			"exp": date
		});
	header = replaceChars(header);
	payload = replaceChars(payload);
	header = btoa(header);
	payload = btoa(payload);
	let hash = createHMAC(header + "." + payload, process.env.JWT_SECRET);
	hash = replaceChars(hash);
	return header + "." + payload + "." + hash;
}

export function validJWT(jwt: string): boolean {
	if (!jwt)
		return false;
	const splitJWT = jwt.split(".");
	if (3 != splitJWT.length)
		return false;
	const header = splitJWT[0];
	const payload = splitJWT[1];
	const signature = splitJWT[2];
	let hash = createHMAC(header + "." + payload, process.env.JWT_SECRET);
	hash = replaceChars(hash);
	return hash == signature;
}
