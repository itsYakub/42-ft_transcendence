// The parent class for paddles (players) and the ball
export abstract class Shape {
	width : number = 0.0;
	height : number = 0.0;
	xVel : number = 0.0;
	yVel : number = 0.0;
	x : number = 0.0;
	y : number = 0.0;
	constructor(x: number, y: number, w: number, h: number) {
		this.width = w;
		this.height = h;
		this.x = x;
		this.y = y;

		console.log("[ SHAPE ] Created successfully | x." + this.x + ", y." + this.y + " | w." + this.width + ", h." + this.height);
	}
	abstract render(context: CanvasRenderingContext2D) : void;

	aabb(other : Shape) : boolean { 
		return (
			(this.x < (other.x + other.width) && (this.x + this.width) > other.x) &&
			(this.y < (other.y + other.height) && (this.y + this.height) > other.y)
		);
	}
}
