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

export enum MessageType {
	GAME_READY = "GAME_READY",
	USER_CONNECT = "USER_CONNECT",
	USER_DISCONNECT = "USER_DISCONNECT",
	USER_JOIN_GAME = "USER_JOIN_GAME",
	USER_INVITE = "USER_INVITE",
	USER_LEAVE_GAME = "USER_LEAVE_GAME",
	USER_LEAVE_TOURNAMENT = "USER_LEAVE_TOURNAMENT",
	USER_READY = "USER_READY",
	USER_SEND_GAME_CHAT = "USER_SEND_GAME_CHAT",
	USER_SEND_USER_CHAT = "USER_SEND_USER_CHAT",
	USER_UNREADY = "USER_UNREADY",
	TOURNAMENT_GAMER_READY = "TOURNAMENT_GAMER_READY",
	TOURNAMENT_MATCH_START = "TOURNAMENT_MATCH_START",
	TOURNAMENT_UPDATE = "TOURNAMENT_UPDATE",
}

export interface Message {
	chat?: string,
	content?: string
	fromId?: number,
	gameId?: string,
	toId?: number,
	type: MessageType
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
	accessToken?: string,
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
	gameId: string,
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

export enum MatchStatus {
	FINISHED = 1,
	NOT_STARTED = 0,
	PLAYING = 2
}

export interface TournamentGamer {
	index: number,
	nick: string,
	ready: boolean,
	userId: number
}

export interface Tournament {
	primaryMatch: {
		gamer1: TournamentGamer,
		gamer2: TournamentGamer,
		matchStatus: MatchStatus
	},
	secondaryMatch: {
		gamer1: TournamentGamer,
		gamer2: TournamentGamer,
		matchStatus: MatchStatus
	},
	final?: {
		gamer1?: TournamentGamer,
		gamer2?: TournamentGamer,
		matchStatus?: MatchStatus
	}
}

export interface Box<T> {
	result: Result,
	contents?: T
}
