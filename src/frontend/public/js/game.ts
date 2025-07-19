import { Shape } from "./game/shape.js";
import { Paddle } from "./game/paddle.js";
import { PaddleType } from "./game/paddle.js";
import { Ball } from "./game/ball.js";

export function randomNumber(min : number, max : number) : number {
	return (min + (Math.random() / 2147483647) * (min - max));
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
		
		this.m_ball = new Ball(
			this.m_gameCanvas.width / 2 - ballSize / 2,
			this.m_gameCanvas.height / 2 - ballSize / 2,
			ballSize, ballSize
		);
	}

	update() {
		this.m_player1.update(this.m_gameCanvas, this.m_ball);
		this.m_player2.update(this.m_gameCanvas, this.m_ball);
		this.m_ball.update(this.m_player1,this.m_player2,this.m_gameCanvas);

		if (this.m_ball.outOfBound(this.m_gameCanvas)) {
			this.m_ball.restart(this.m_gameCanvas);
			this.m_player1.restart();
			this.m_player2.restart();
		}
	}

	render() {
		this.renderCourt();
		this.m_player1.render(this.m_gameContext);
		this.m_player2.render(this.m_gameContext);
		this.m_ball.render(this.m_gameContext);
	}

	run() {
		game.update();
		game.render();
		requestAnimationFrame(game.run);
	}

	renderCourt() {
		// Draws the court floor
		this.m_gameContext.fillStyle = "#008566";
		this.m_gameContext.fillRect(0, 0, this.m_gameCanvas.width, this.m_gameCanvas.height);

		// Draws half-way line
		this.m_gameContext.fillStyle = "#fff";
		this.m_gameContext.fillRect(this.m_gameCanvas.width / 2 - 2, 8, 4, this.m_gameCanvas.height - 16);

		// Draws score numbers
		this.m_gameContext.fillText(Game.player1Score.toString(), this.m_gameCanvas.width / 3, 128);
		this.m_gameContext.fillText(Game.player2Score.toString(), this.m_gameCanvas.width / 3 * 2, 128);
	}
}

var game: Game;

function	gamePlay() {
	game = new Game();
	requestAnimationFrame(game.run);
	(<HTMLButtonElement>document.getElementById("gamePlay")).disabled = true;
}

export function	setupGameFrame() {
	document.getElementById("gamePlay").addEventListener("click", async( ) => { gamePlay(); });
}
