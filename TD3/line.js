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


Line.prototype.update = function (ctx) {
    this.center.x += this.speed * Math.cos(this.angle);
    this.center.y += this.speed * Math.sin(this.angle);
    this.rotation += this.rotationAngle;
    this.draw(ctx);
};