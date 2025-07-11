import { Shape } from "./game/shape.js";
import { Paddle } from "./game/paddle.js";
import { PaddleType } from "./game/paddle.js";
import { Ball } from "./game/ball.js";

export enum GameStateMachine {
	STATE_GAME_SETUP,
	STATE_GAME_START,
	STATE_GAME_PAUSE
}

export class Game {
	private	m_gameCanvas : HTMLCanvasElement;
	private	m_gameContext : CanvasRenderingContext2D;
	private	m_player1 : Paddle;
	private	m_player2 : Paddle;
	private	m_ball : Ball;
	
	public static	keysPressed : boolean[] = [];
	public static	player1Score : number = 0;
	public static	player2Score : number = 0;

	constructor() {
		this.m_gameCanvas = document.getElementById("pongCanvas") as HTMLCanvasElement;
		this.m_gameCanvas.width = this.m_gameCanvas.parentElement.clientWidth;
		this.m_gameCanvas.height = this.m_gameCanvas.parentElement.clientHeight;
		this.m_gameContext = this.m_gameCanvas.getContext("2d");
		//this.gameContext.font = "30px Orbitron";

		window.addEventListener("keydown", function (e) {
			Game.keysPressed[e.key] = true;
		});

		window.addEventListener("keyup", function (e) {
			Game.keysPressed[e.key] = false;
		});

		// Adjust these dependent on available space
		var paddleWidth: number = 16;
		var paddleHeight: number = 128;
		var ballSize: number = 20;
		var wallOffset: number = 24;

		this.m_player1 = new Paddle(
			wallOffset, this.m_gameCanvas.height / 2 - paddleHeight / 2,
			paddleWidth, paddleHeight,
			"w", "s", "#fa2222",
			PaddleType.PADDLE_AI
		);
		
		this.m_player2 = new Paddle(
			this.m_gameCanvas.width - (wallOffset + paddleWidth),
			this.m_gameCanvas.height / 2 - paddleHeight / 2,
			paddleWidth, paddleHeight,
			"ArrowUp", "ArrowDown", "#22fa22",
			PaddleType.PADDLE_AI
		);
		
		this.m_ball = new Ball(this.m_gameCanvas.width / 2 - ballSize / 2, this.m_gameCanvas.height / 2 - ballSize / 2, ballSize, ballSize);
		this.draw();
	}

	drawCourt() {
		// Draws the court floor
		this.m_gameContext.fillStyle = "#008566";
		this.m_gameContext.fillRect(0, 0, this.m_gameCanvas.width, this.m_gameCanvas.height);

		// Draws outline
		this.m_gameContext.strokeStyle = "#fff";
		this.m_gameContext.lineWidth = 4;
		this.m_gameContext.strokeRect(8, 8, this.m_gameCanvas.width - 16, this.m_gameCanvas.height - 16);

		// Draws half-way line
		this.m_gameContext.fillStyle = "#fff";
		this.m_gameContext.fillRect(this.m_gameCanvas.width / 2 - 2, 8, 4, this.m_gameCanvas.height - 16);

		// Draws score numbers
		this.m_gameContext.fillText(Game.player1Score.toString(), this.m_gameCanvas.width / 3, 128);
		this.m_gameContext.fillText(Game.player2Score.toString(), this.m_gameCanvas.width / 3 * 2, 128);
	}

	update() {
		this.m_player1.update(this.m_gameCanvas, this.m_ball);
		this.m_player2.update(this.m_gameCanvas, this.m_ball);
		if (stateMachine == GameStateMachine.STATE_GAME_START) {
			this.m_ball.update(this.m_player1,this.m_player2,this.m_gameCanvas);
		}
	}

	draw() {
		this.drawCourt();
		this.m_player1.draw(this.m_gameContext);
		this.m_player2.draw(this.m_gameContext);
		this.m_ball.draw(this.m_gameContext);
	}

	gameLoop() {
		game.update();
		game.draw();
		requestAnimationFrame(game.gameLoop);
	}
}

var game: Game;
export var stateMachine : GameStateMachine;

function setupGame() {
	game = new Game();
	stateMachine = GameStateMachine.STATE_GAME_SETUP;
	requestAnimationFrame(game.gameLoop);
	(<HTMLButtonElement>document.getElementById("gameSetup")).disabled = true;
}

function playGame() {
	stateMachine = GameStateMachine.STATE_GAME_START;
}

function pauseGame() {
	stateMachine = GameStateMachine.STATE_GAME_PAUSE;
}

export function setupGameFrame() {
	document.getElementById("gameSetup").addEventListener("click", async( ) => { setupGame(); });
	document.getElementById("gamePlay").addEventListener("click", async( ) => { playGame(); });
	document.getElementById("gamePause").addEventListener("click", async( ) => { pauseGame(); });
}
