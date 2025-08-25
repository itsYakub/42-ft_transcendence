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
	online: boolean,
	password: string,
	playing: boolean,
	ready: boolean,
	refreshToken: string,
	totpEmail: boolean,
	totpEnabled: boolean,
	totpSecret: string,
	totpVerified: boolean,
	userId: number,
	userType: UserType
}

export interface Gamer {
	nick: string,
	ready: boolean,
	userId: number
}

export interface Game {
	gameId: string,
	nicks: string
}

export interface MatchResult {
	opponent: string,
	opponentScore: number,
	playedAt: Date,
	score: number,
	tournamentWin: boolean,
	userId: number
}

export interface UserChatMessage {
	partnerId: number,
	partnerNick: string,
	message: string,
	sentAt: Date,
}

export interface UserChatPartner {
	partnerId: number,
	partnerNick: string
}

export interface Friend {
	friendId: number,
	nick: string,
	online: boolean,
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
	sentAt: Date
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

export interface MatchResultBox {
	matchResults?: MatchResult[],
	result: Result
}

export interface UserChatMessagesBox {
	messages?: UserChatMessage[],
	result: Result
}

export interface UserChatPartnersBox {
	partners?: UserChatPartner[],
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
