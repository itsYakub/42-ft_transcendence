export enum result {
	ERR_DB,
	ERR_EMAIL_IN_USE,
	ERR_EXPIRED_TOKEN,
	ERR_FORBIDDEN,
	ERR_NO_USER,
	ERR_SAME_EMAIL,
	SUCCESS
}

export interface User {
	userId: number,
	nick: string,
	email: string,
	avatar: string,
	password: string,
	refreshToken: string,
	online: number,
	ready: number,
	playing: number,
	totpEnabled: number,
	totpSecret: string,
	totpVerified: number,
	totpEmail: number,
	type: string,
	gameId: string
}

export interface UserBox {
	result: result,
	user?: User,
	accessToken?: string,
	refreshToken?: string
}

export interface StringBox {
	result: result,
	value?: string
}

export interface StringlistBox {
	result: result,
	values?: string[]
}
