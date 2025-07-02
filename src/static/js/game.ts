enum GameStateMachine {
	STATE_GAME_SETUP,
	STATE_GAME_START,
	STATE_GAME_PAUSE
}

class Game {
	private	m_gameCanvas: HTMLCanvasElement;
	private	m_gameContext: CanvasRenderingContext2D;
	private	m_player1: Paddle;
	private	m_player2: Paddle;
	private	m_ball: Ball;
	
	public static	keysPressed: boolean[] = [];
	public static	player1Score: number = 0;
	public static	player2Score: number = 0;

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
		var paddleHeight: number = 80;
		var ballSize: number = 16;
		var wallOffset: number = 24;

		this.m_player1 = new Paddle(wallOffset, this.m_gameCanvas.height / 2 - paddleHeight / 2, paddleWidth, paddleHeight, "w", "s", "#fa2222");
		this.m_player2 = new Paddle(this.m_gameCanvas.width - (wallOffset + paddleWidth), this.m_gameCanvas.height / 2 - paddleHeight / 2, paddleWidth, paddleHeight, "ArrowUp", "ArrowDown", "#22fa22");
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
		this.m_gameContext.fillText(Game.player1Score.toString(), this.m_gameCanvas.width / 3, 100);
		this.m_gameContext.fillText(Game.player2Score.toString(), this.m_gameCanvas.width / 3 * 2, 100);
	}

	update() {
		this.m_player1.update(this.m_gameCanvas);
		this.m_player2.update(this.m_gameCanvas);
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
	private speed: number = 10.0;
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
			this.yVel = -1.0;
			if (this.y <= 20.0) {
				this.yVel = 0.0;
			}
		} else if (Game.keysPressed[this.downKey]) {
			this.yVel = 1.0;
			if (this.y + this.height >= canvas.height - 20.0) {
				this.yVel = 0.0;
			}
		} else {
			this.yVel = 0.0;
		}

		this.y += this.yVel * this.speed;
	}
}

class Ball extends Shape {

	private speed: number = 2.0;

	constructor(x: number, y: number, w: number, h: number) {
		super(x, y, w, h);
		this.randomDirection();
	}

	restart(canvas : HTMLCanvasElement) {
		this.speed = 2.0;
		this.x = canvas.width / 2.0 - this.width / 2.0;
		this.y = canvas.height / 2.0 - this.height / 2.0;
		this.randomDirection();
	}

	draw(context: CanvasRenderingContext2D) {
		context.fillStyle = "#fff";
		context.fillRect(this.x, this.y, this.width, this.height);
	}

	update(player1: Paddle, player2: Paddle, canvas: HTMLCanvasElement) {
		this.collisionDetection(player1, player2, canvas);

		// If the ball goes past the left player
		if (this.x <= 0.0) {
			Game.player2Score += 1.0;
			this.restart(canvas);
		}

		// If the ball goes past the right player
		if (this.x + this.width >= canvas.width) {
			Game.player1Score += 1.0;
			this.restart(canvas);
		}

		/* clamping the ball's speed to the maximum value (in this case: 16.0) (let the hell go loose) */
		this.speed = this.speed > 16.0 ? 16.0 : this.speed;
		this.x += this.xVel * this.speed;
		this.y += this.yVel * this.speed;
	}

	private	randomDirection() {
		var randomDirection : number;

		randomDirection = Math.floor(Math.random() * 2) + 1;
		if (randomDirection % 2) {
			this.xVel = 1.0;
		} else {
			this.xVel = -1.0;
		}
		randomDirection = Math.floor(Math.random() * 2) + 1;
		if (randomDirection % 2) {
			this.yVel = 1.0;
		} else {
			this.yVel = -1.0;
		}
	}

	private	collisionDetection(player1: Paddle, player2: Paddle, canvas: HTMLCanvasElement) {
		// Basic ball - to - top/bottom collistion detection
		if (
			(this.y <= 10.0) ||
			(this.y + this.height >= canvas.height - 10.0)
		) {
			this.yVel *= -1.0;
			this.speed += 0.2;
		}

		// Basic ball - to - player collision detection
		// Horizontal collision
		if (
			aabb(this, player1) || aabb(this, player2)
		) {
			/* NOTE(joleksia):
			 *  In this if - block, I think that we should handle both horizontal and vertical bouncess of the paddle
			 * */
			if (
				(this.y >= player1.y && this.y + this.height <= player1.y + player1.height) ||
				(this.y >= player2.y && this.y + this.height <= player2.y + player2.height)
			) {
				this.xVel *= -1.0;
			}
			this.speed += 0.4;
		}
	}
}

var game: Game;
var stateMachine : GameStateMachine;

function aabb(a : Shape, b : Shape) : boolean { 
	return (
		(a.x < (b.x + b.width) && (a.x + a.width) > b.x) &&
		(a.y < (b.y + b.height) && (a.y + a.height) > b.y)
	);
}

// Calculates the starting conditions and draws everything
// NOTE(joleksia): If you spam this function, the velocity goes insane because now we're launching many revursive functions of update for the Game
function setupGame() {
	game = new Game();
	stateMachine = GameStateMachine.STATE_GAME_SETUP;
	requestAnimationFrame(game.gameLoop);
}

function playGame() {
	stateMachine = GameStateMachine.STATE_GAME_START;
}

function pauseGame() {
	stateMachine = GameStateMachine.STATE_GAME_PAUSE;
}

window.setupGame = setupGame;
window.playGame = playGame;
window.pauseGame = pauseGame;
