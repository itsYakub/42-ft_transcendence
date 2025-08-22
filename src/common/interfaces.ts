export enum Result {
	ERR_BAD_TOTP = "ERR_BAD_TOTP",
	ERR_DB = "ERR_DB",
	ERR_EMAIL_IN_USE = "ERR_EMAIL_IN_USE",
	ERR_EXPIRED_TOKEN = "ERR_EXPIRED_TOKEN",
	ERR_FORBIDDEN = "ERR_FORBIDDEN",
	ERR_GAME_FULL = "ERR_GAME_FULL",
	ERR_NO_USER = "ERR_NO_USER",
	ERR_NOT_FOUND = "ERR_NOT_FOUND",
	ERR_SAME_EMAIL = "ERR_SAME_EMAIL",
	SUCCESS = "SUCCESS"
}

export enum WebsocketMessageGroup {
	ERROR = "ERROR",
	GAME = "GAME",
	USER = "USER"
}

export enum WebsocketMessageType {
	CHAT = "CHAT",
	JOIN = "JOIN",
	INVITE = "INVITE",
	LEAVE = "LEAVE",
	READY = "READY"
}

export interface WebsocketMessage {
	group: WebsocketMessageGroup,
	type: WebsocketMessageType,
	fromId?: number,
	gameId?: string,
	toId?: number,
	chat?: string
}

export interface FrameParams {
	language: string, 
	page?: string,
	result?: Result,
	user?: User
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

export interface Gamer {
	nick: string,
	ready: number,
	userId: number
}

export interface Game {
	gameId: string,
	nicks: string
}

export interface UserMessage {
	messageId: number,
	fromId: number,
	toId: number,
	message: string,
	sent_at: string
}

export interface Friend {
	userId: number,
	friendId: number
}

export interface Foe {
	userId: number,
	foeId: number
}

export interface GameChat {
	fromId: number,
	gameId: string,
	chat: string,
	sent_at: string
}

export interface GameChatMessage {
	chat: string,
	fromId: number,
	nick: string
}

export interface UserBox {
	result: Result,
	user?: User,
	accessToken?: string,
	refreshToken?: string
}

export interface StringBox {
	result: Result,
	value?: string
}

export interface StringlistBox {
	result: Result,
	values?: string[]
}
