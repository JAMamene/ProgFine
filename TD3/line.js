Line = function (centerX, centerY, speed, angle, rotation, rotationAngle, size) {
    this.center = new Point(centerX, centerY);
    this.speed = speed;
    this.angle = Math.PI * angle / 180.0;
    this.rotation = Math.PI * rotation / 180.0;
    this.rotationAngle = Math.PI * rotationAngle / 180.0;
    this.size = size;
    this.firstEnd = new Point();
    this.secondEnd = new Point();
};

Point = function (x, y) {
    this.x = x;
    this.y = y;
};

Line.prototype.draw = function (ctx) {
    ctx.beginPath();
    ctx.moveTo(this.center.x, this.center.y);
    this.updateFirstEnd();
    this.updateSecondEnd();
    ctx.lineTo(this.firstEnd.x, this.firstEnd.y);
    ctx.moveTo(this.center.x, this.center.y);
    ctx.lineTo(this.secondEnd.x, this.secondEnd.y);
    ctx.stroke();
    this.checkForCollision(ctx);
};

Line.prototype.updateFirstEnd = function () {
    this.firstEnd.x = this.center.x + this.size / 2 * Math.cos(this.rotation);
    this.firstEnd.y = this.center.y + this.size / 2 * Math.sin(this.rotation);
};

Line.prototype.updateSecondEnd = function () {
    this.secondEnd.x = this.center.x - this.size / 2 * Math.cos(this.rotation);
    this.secondEnd.y = this.center.y - this.size / 2 * Math.sin(this.rotation);
};

Line.prototype.checkForCollision = function (ctx) {

};

Line.prototype.intersect = function (other) {
    let x1 = this.firstEnd.x;
    let x2 = this.secondEnd.x;
    let y1 = this.firstEnd.y;
    let y2 = this.secondEnd.y;
    let x3 = other.firstEnd.x;
    let x4 = other.secondEnd.x;
    let y3 = other.firstEnd.y;
    let y4 = other.secondEnd.y;
    // Check if none of the lines are of length 0
    if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
        return false
    }

    let denominator = ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));

    // Lines are parallel
    if (denominator === 0) {
        return false
    }

    let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator;
    let ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator;

    // is the intersection along the segments
    if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
        return false
    }

    // Return a object with the x and y coordinates of the intersection
    let x = x1 + ua * (x2 - x1);
    let y = y1 + ua * (y2 - y1);
    return {x, y}
};


Line.prototype.update = function (ctx) {
    this.center.x += this.speed * Math.cos(this.angle);
    this.center.y += this.speed * Math.sin(this.angle);
    this.rotation += this.rotationAngle;
    this.draw(ctx);
};