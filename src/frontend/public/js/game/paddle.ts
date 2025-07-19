import {
	Game,
	randomNumber,
} from "./../game.js";

import { Shape } from "./shape.js";

export enum PaddleType {
	PADDLE_PLAYER,
	PADDLE_AI
}	

export class Paddle extends Shape {
	private m_type : PaddleType;

	private	m_initialX : number;
	private	m_initialY : number;

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
		this.m_initialX = x;
		this.m_initialY = y;

		this.m_speed = 8.0;
		this.m_upKey = upKey;
		this.m_downKey = downKey;
		this.m_colour = colour;

		this.m_type = type;
	}

	update(canvas: HTMLCanvasElement, ball : Shape) {
		if (this.m_type == PaddleType.PADDLE_PLAYER) {
			this.updatePlayer(canvas);
		}
		else {
			this.updateAI(canvas, ball);
		}
		
		this.updatePosition(canvas);
	}
	
	render(context: CanvasRenderingContext2D) {
		context.fillStyle = this.m_colour;
		context.fillRect(this.x, this.y, this.width, this.height);
	}

	restart() {
		this.x = this.m_initialX;
		this.y = this.m_initialY;
		this.xVel = this.yVel = 0.0;
	}

	private	updatePlayer(canvas : HTMLCanvasElement) {
		if (Game.keysPressed[this.m_upKey]) {
			this.yVel = -1.0;
			if (this.y <= 0.0) {
				this.yVel = 0.0;
			}
		} else if (Game.keysPressed[this.m_downKey]) {
			this.yVel = 1.0;
			if (this.y + this.height >= canvas.height) {
				this.yVel = 0.0;
			}
		} else {
			this.yVel = 0.0;
		}
	}

	private	updateAI(canvas : HTMLCanvasElement, ball : Shape) {
		/* NOTE(joleksia)
		 *  AI Code goes here...
		 * */
		if (!this.m_aiUpdateCalled) {

			/* setInterval must be called only once per match
			 * */
			this.m_aiUpdateCalled = true;
			setInterval(() => {
		
				this.aiLogic(canvas, ball);

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

	private	updatePosition(canvas : HTMLCanvasElement) {
		/* Floor and ceiling collision detection
		 * */
		if (this.y < 0.0) {
			this.yVel = 0.0;
			this.y = 0.0;
		}
		if (this.y + this.height > canvas.height) {
			this.yVel = 0.0;
			this.y = canvas.height - this.height;
		}

		this.y += this.yVel * this.m_speed;
	}

	private	aiLogic(canvas : HTMLCanvasElement, ball : Shape) {
		let	_dis_to_ball : number;
		let	_vel_x : number;
		let _vel_y : number;

		_dis_to_ball = Math.sqrt((ball.x-this.x)*(ball.x-this.x));
		_vel_x = ball.xVel;
		_vel_y = ball.yVel;
	
		this.m_aiDestX = ball.x;
		this.m_aiDestY = ball.y;

		for ( ; ; ) {
			if (
				this.m_aiDestY + _vel_y <= 0.0 ||
				this.m_aiDestY + ball.height + _vel_y >= canvas.height
			) {
				_vel_y *= -1.0;
			}
			if (
				this.m_aiDestX + _vel_x <= 0.0 ||
				this.m_aiDestX + ball.width + _vel_x >= canvas.width
			) {
				_vel_x *= -1.0;
			}
			this.m_aiDestX += _vel_x;
			this.m_aiDestY += _vel_y;
			if (Math.sqrt((this.m_aiDestX-this.x)*(this.m_aiDestX-this.x)) < 64.0) {
				break;
			}
		}
		
		console.log("[ AI ] Ball destination: " + this.m_aiDestX + ", " + this.m_aiDestY);
	}
}
