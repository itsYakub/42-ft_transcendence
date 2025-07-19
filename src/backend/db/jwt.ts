import { createHmac } from 'crypto';

function createHMAC(message: string, secret: string) {
	return createHmac('sha256', secret)
		.update(message)
		.digest("base64");
}

function replaceInvalidBase64Chars(input: string) {
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

export function createJWT(id: number): string {
	let header = JSON.stringify(
		{
			"typ": "JWT",
			"alg": "HS256"
		});
	var date = new Date();
	date.setDate(date.getDate() + 3);
	let payload = JSON.stringify(
		{
			"sub": id,
			"exp": date
		});
	header = replaceInvalidBase64Chars(header);
	payload = replaceInvalidBase64Chars(payload);
	header = btoa(header);
	payload = btoa(payload);
	let hash = createHMAC(header + "." + payload, process.env.JWT_SECRET);
	hash = replaceInvalidBase64Chars(hash);
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
	hash = replaceInvalidBase64Chars(hash);
	return hash == signature;
}
