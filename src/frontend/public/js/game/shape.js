export class Shape {
    constructor(x, y, w, h) {
        this.xVel = 0;
        this.yVel = 0;
        this.width = w;
        this.height = h;
        this.x = this.xprev = x;
        this.y = this.yprev = y;
    }
    aabb(other) {
        return ((this.x < (other.x + other.width) && (this.x + this.width) > other.x) &&
            (this.y < (other.y + other.height) && (this.y + this.height) > other.y));
    }
}
