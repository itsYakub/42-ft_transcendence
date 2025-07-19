export class Shape {
    constructor(x, y, w, h) {
        this.width = 0.0;
        this.height = 0.0;
        this.xVel = 0.0;
        this.yVel = 0.0;
        this.x = 0.0;
        this.y = 0.0;
        this.width = w;
        this.height = h;
        this.x = x;
        this.y = y;
        console.log("[ SHAPE ] Created successfully | x." + this.x + ", y." + this.y + " | w." + this.width + ", h." + this.height);
    }
    aabb(other) {
        return ((this.x < (other.x + other.width) && (this.x + this.width) > other.x) &&
            (this.y < (other.y + other.height) && (this.y + this.height) > other.y));
    }
}
