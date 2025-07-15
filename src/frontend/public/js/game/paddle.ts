import { Game } from "./../game.js"
import { GameStateMachine } from "./../game.js"
import { randomNumber } from "./../game.js"
import { stateMachine } from "./../game.js"
import { Shape } from "./shape.js";

export enum PaddleType {
	PADDLE_PLAYER,
	PADDLE_AI
}	

export class Paddle extends Shape {
	private m_type : PaddleType;

	private m_speed : number;
	private m_upKey : string;
	private m_downKey : string;
	private m_colour : string;
	
	/* SECTION: AI
	 * */
	private m_aiUpdateCalled : boolean;
	private	m_aiDestX : number;
	private	m_aiDestY : number;
	
	constructor(x : number, y : number, w : number, h : number, upKey : string, downKey : string, colour : string, type : PaddleType) {
		super(x, y, w, h);
		this.m_upKey = upKey;
		this.m_downKey = downKey;
		this.m_colour = colour;
		this.m_speed = 8.0;
		this.m_type = type;
	}

	draw(context: CanvasRenderingContext2D) {
		context.fillStyle = this.m_colour;
		context.fillRect(this.x, this.y, this.width, this.height);
	}

	update(canvas: HTMLCanvasElement, ball : Shape) {
		if (stateMachine == GameStateMachine.STATE_GAME_START) {
			if (this.m_type == PaddleType.PADDLE_PLAYER) {
				this.updatePlayer(canvas);
			}
			else {
				this.updateAI(canvas, ball);
			}
			
			this.updatePosition(canvas);
		}
	}

	updatePlayer(canvas : HTMLCanvasElement) {
		if (Game.keysPressed[this.m_upKey]) {
			this.yVel = -1.0;
			if (this.y <= 20.0) {
				this.yVel = 0.0;
			}
		} else if (Game.keysPressed[this.m_downKey]) {
			this.yVel = 1.0;
			if (this.y + this.height >= canvas.height - 20.0) {
				this.yVel = 0.0;
			}
		} else {
			this.yVel = 0.0;
		}
	}

	updateAI(canvas : HTMLCanvasElement, ball : Shape) {
		/* NOTE(joleksia)
		 *  AI Code goes here...
		 * */
		if (!this.m_aiUpdateCalled) {

			/* setInterval must be called only once per match
			 * */
			this.m_aiUpdateCalled = true;
			setInterval(() => {
		
				if (stateMachine == GameStateMachine.STATE_GAME_START) {	
					
					/* AI should work only if the ball is approaching it
					 * */
					if (this.isApproaching(canvas, ball)) {
				
						let	_pos_to_ball : number;
						let	_vel_x : number;
						let _vel_y : number;

						_pos_to_ball = Math.sqrt((ball.x - this.x)*(ball.x - this.x));
						_vel_x = ball.xVel;
						_vel_y = ball.yVel;
						this.m_aiDestX = ball.x * randomNumber(0.9, 1.0);
						this.m_aiDestY = ball.y * randomNumber(0.9, 1.0);
						for (let i : number = 0.0; i < _pos_to_ball / _vel_x; i++) {
							if (
								this.m_aiDestY + _vel_y <= 10.0 ||
								this.m_aiDestY + ball.height + _vel_y >= canvas.height - 10.0
							) {
								_vel_y *= -1.0;
							}
							this.m_aiDestX += _vel_x;
							this.m_aiDestY += _vel_y;
						}
						console.log("[ AI ] Ball destination: " + this.m_aiDestX + ", " + this.m_aiDestY);

					}

				}

			}, 1000);

		}

		if (this.y + this.height < this.m_aiDestY) {
			this.yVel = 1.0;
		}
		else if (this.y > this.m_aiDestY) {
			this.yVel = -1.0;
		}
		else {
			this.yVel = 0.0;
		}
	}

	updatePosition(canvas : HTMLCanvasElement) {
		/* Floor and ceiling collision detection
		 * */
		if (this.y < 20.0) {
			this.yVel = 0.0;
			this.y = 20.0;
		}
		if (this.y + this.height > canvas.height - 20.0) {
			this.yVel = 0.0;
			this.y = canvas.height - 20.0 - this.height;
		}

		this.y += this.yVel * this.m_speed;
	}

	isApproaching(canvas : HTMLCanvasElement, ball : Shape) : boolean {
		let _dist0 = Math.sqrt((ball.x - this.x)*(ball.x - this.x) + (ball.y - this.y)*(ball.y - this.y));
		let _dist1 = Math.sqrt((ball.xPrev - this.x)*(ball.xPrev - this.x) + (ball.yPrev - this.y)*(ball.yPrev - this.y));

		if (_dist0 < _dist1) {
			return (true);
		}
		return (false);
	}
}
