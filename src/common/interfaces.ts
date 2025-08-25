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
	TOURNAMENT = "TOURNAMENT",
	USER = "USER"
}

export enum WebsocketMessageType {
	CHAT = "CHAT",
	INVITE = "INVITE",
	JOIN = "JOIN",
	LEAVE = "LEAVE",
	READY = "READY",
	UNREADY= "UNREADY"
}

export interface WebsocketMessage {
	fromId?: number,
	group: WebsocketMessageGroup,
	toId?: number,
	type: WebsocketMessageType
}

export interface WebsocketGameMessage extends WebsocketMessage {
	gameId: string
}

export interface WebsocketChatMessage extends WebsocketMessage {
	chat: string
}

export interface WebsocketGameChatMessage extends WebsocketGameMessage, WebsocketChatMessage {
	gameId: string
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
	fromId: number,
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

export interface Tournament {
	match: number,
	m1p1Nick: string,
	m1p2Nick: string,
	m2p1Nick: string,
	m2p2Nick: string,
	m3p1Nick: string,
	m3p2Nick: string,
	m1p1Score: number,
	m1p2Score: number,
	m2p1Score: number,
	m2p2Score: number,
	m3p1Score: number,
	m3p2Score: number,
}

export interface UserBox {
	accessToken?: string,
	refreshToken?: string,
	result: Result,
	user?: User
}

export interface Box<T> {
	result: Result,
	contents?: T
}
