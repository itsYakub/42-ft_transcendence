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
	INVITE = "INVITE",
	JOIN = "JOIN",
	LEAVE = "LEAVE",
	READY = "READY"
}

export interface WebsocketMessage {
	chat?: string,
	fromId?: number,
	gameId?: string,
	group: WebsocketMessageGroup,
	toId?: number,
	type: WebsocketMessageType
}

export interface FrameParams {
	language: string,
	page?: string,
	result?: Result,
	user?: User
}

export enum UserType {
	GOOGLE = "GOOGLE",
	GUEST = "GUEST",
	USER = "USER"
}

export interface User {
	avatar: string,
	email: string,
	gameId: string,
	nick: string,
	online: number,
	password: string,
	playing: number,
	ready: number,
	refreshToken: string,
	totpEmail: number,
	totpEnabled: number,
	totpSecret: string,
	totpVerified: number,
	userId: number,
	userType: UserType
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
	fromId: number,
	message: string,
	sent_at: string,
	toId: number
}

export interface Friend {
	friendId: number,
	nick: string,
	online: number,
	userId: number
}

export interface Foe {
	foeId: number,
	nick: string,
	userId: number
}

export interface GameChat {
	chat: string,
	fromId: number,
	gameId: string,
	sent_at: string
}

export interface GameChatMessage {
	chat: string,
	fromId: number,
	nick: string
}

export interface UserBox {
	accessToken?: string,
	refreshToken?: string,
	result: Result,
	user?: User
}

export interface UsersBox {
	result: Result,
	users?: User[]
}

export interface FriendsBox {
	friends?: Friend[],
	result: Result
}

export interface FoesBox {
	foes?: Foe[],
	result: Result
}

export interface StringBox {
	result: Result,
	value?: string
}

export interface StringlistBox {
	result: Result,
	values?: string[]
}
