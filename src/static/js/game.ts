class Game {
	private gameCanvas: HTMLCanvasElement;
	private gameContext: CanvasRenderingContext2D;
	private player1: Paddle;
	private player2: Paddle;
	private ball: Ball;
	public static keysPressed: boolean[] = [];
	public static player1Score: number = 0;
	public static player2Score: number = 0;

	constructor() {
		this.gameCanvas = document.getElementById("pongCanvas") as HTMLCanvasElement;
		this.gameCanvas.width = this.gameCanvas.parentElement.clientWidth;
		this.gameCanvas.height = this.gameCanvas.parentElement.clientHeight;
		this.gameContext = this.gameCanvas.getContext("2d");
		//this.gameContext.font = "30px Orbitron";

		window.addEventListener("keydown", function (e) {
			Game.keysPressed[e.key] = true;
		});

		window.addEventListener("keyup", function (e) {
			Game.keysPressed[e.key] = false;
		});

		// Adjust these dependent on available space
		var paddleWidth: number = 8;
		var paddleHeight: number = 64;
		var ballSize: number = 8;
		var wallOffset: number = 20;

		this.player1 = new Paddle(wallOffset, this.gameCanvas.height / 2 - paddleHeight / 2, paddleWidth, paddleHeight, "w", "s", "#f00");
		this.player2 = new Paddle(this.gameCanvas.width - (wallOffset + paddleWidth), this.gameCanvas.height / 2 - paddleHeight / 2, paddleWidth, paddleHeight, "ArrowUp", "ArrowDown", "#0f0");
		this.ball = new Ball(this.gameCanvas.width / 2 - ballSize / 2, this.gameCanvas.height / 2 - ballSize / 2, ballSize, ballSize);
		this.draw();
	}

	drawCourt() {
		// Draws the court floor
		this.gameContext.fillStyle = "#008566";
		this.gameContext.fillRect(0, 0, this.gameCanvas.width, this.gameCanvas.height);

		// Draws outline
		this.gameContext.strokeStyle = "#fff";
		this.gameContext.lineWidth = 4;
		this.gameContext.strokeRect(8, 8, this.gameCanvas.width - 16, this.gameCanvas.height - 16);

		// Draws half-way line
		this.gameContext.fillStyle = "#fff";
		this.gameContext.fillRect(this.gameCanvas.width / 2 - 2, 8, 4, this.gameCanvas.height - 16);

		// Draws score numbers
		this.gameContext.fillText(Game.player1Score.toString(), this.gameCanvas.width / 3, 100);
		this.gameContext.fillText(Game.player2Score.toString(), this.gameCanvas.width / 3 * 2, 100);
	}

	update() {
		this.player1.update(this.gameCanvas);
		this.player2.update(this.gameCanvas);
		this.ball.update(this.player1,this.player2,this.gameCanvas);
	}

	draw() {
		this.drawCourt();
		this.player1.draw(this.gameContext);
		this.player2.draw(this.gameContext);
		this.ball.draw(this.gameContext);
	}

	gameLoop() {
		game.update();
		game.draw();
		requestAnimationFrame(game.gameLoop);
	}
}

// The parent class for paddles (players) and the ball
abstract class Shape {
	width: number;
	height: number;
	x: number;
	y: number;
	xVel: number = 0;
	yVel: number = 0;
	constructor(x: number, y: number, w: number, h: number) {
		this.width = w;
		this.height = h;
		this.x = x;
		this.y = y;
	}
	abstract draw(context: CanvasRenderingContext2D) : void;
}

class Paddle extends Shape {
	private speed: number = 10;
	private upKey: string;
	private downKey: string;
	private colour: string;

	constructor(x: number, y: number, w: number, h: number, upKey: string, downKey: string, colour: string) {
		super(x, y, w, h);
		this.upKey = upKey;
		this.downKey = downKey;
		this.colour = colour;
	}

	draw(context: CanvasRenderingContext2D) {
		context.fillStyle = this.colour;
		context.fillRect(this.x, this.y, this.width, this.height);
	}

	update(canvas: HTMLCanvasElement) {
		if (Game.keysPressed[this.upKey]) {
			this.yVel = -1;
			if (this.y <= 20) {
				this.yVel = 0
			}
		} else if (Game.keysPressed[this.downKey]) {
			this.yVel = 1;
			if (this.y + this.height >= canvas.height - 20) {
				this.yVel = 0;
			}
		} else {
			this.yVel = 0;
		}

		this.y += this.yVel * this.speed;
	}
}

class Ball extends Shape {

	private speed: number = 0.5;

	constructor(x: number, y: number, w: number, h: number) {
		super(x, y, w, h);
		var randomDirection = Math.floor(Math.random() * 2) + 1;
		if (randomDirection % 2) {
			this.xVel = 1;
		} else {
			this.xVel = -1;
		}
		this.yVel = 1;
	}

	draw(context: CanvasRenderingContext2D) {
		context.fillStyle = "#fff";
		context.fillRect(this.x, this.y, this.width, this.height);
	}

	update(player1: Paddle, player2: Paddle, canvas: HTMLCanvasElement) {
		// If the ball hits the top wall, bounce it off
		if (this.y <= 10) {
			this.yVel = 1;
		}

		// If the ball hits the bottom wall, bounce it off
		if (this.y + this.height >= canvas.height - 10) {
			this.yVel = -1;
		}

		// If the ball goes past the left player
		if (this.x <= 0) {
			this.x = canvas.width / 2 - this.width / 2;
			Game.player2Score += 1;
		}

		// If the ball goes past the right player
		if (this.x + this.width >= canvas.width) {
			this.x = canvas.width / 2 - this.width / 2;
			Game.player1Score += 1;
		}

		// If the ball is hit by the left player
		if (this.x <= player1.x + player1.width) {
			if (this.y >= player1.y && this.y + this.height <= player1.y + player1.height) {
				this.xVel = 1;
			}
		}

		// If the ball is hit by the right player
		if (this.x + this.width >= player2.x) {
			if (this.y >= player2.y && this.y + this.height <= player2.y + player2.height) {
				this.xVel = -1;
			}
		}

		this.x += this.xVel * this.speed;
		this.y += this.yVel * this.speed;
	}
}

var game: Game;

// Calculates the starting conditions and draws everything
function setupGame() {
	game = new Game();
}

// Starts the ball moving and allows the players to move
function startGame() {
	requestAnimationFrame(game.gameLoop);
}

window.setupGame = setupGame;
window.startGame = startGame;
