// The parent class for paddles (players) and the ball
export abstract class Shape {
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

	aabb(other : Shape) : boolean { 
		return (
			(this.x < (other.x + other.width) && (this.x + this.width) > other.x) &&
			(this.y < (other.y + other.height) && (this.y + this.height) > other.y)
		);
	}
}
