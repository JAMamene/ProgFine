LineMask = function (centerX, centerY, speed, angle, rotation, rotationAngle, size) {
    this.line = new Line(centerX, centerY, speed, angle, rotation, rotationAngle, size);
    this.maskX = null;
    this.maskY = null;
    this.divider = size / 2;
};

LineMask.prototype.draw = function (ctx) {
    this.line.draw(ctx);
};

LineMask.prototype.updateFirstEnd = function () {
    this.line.updateFirstEnd();
};

LineMask.prototype.updateSecondEnd = function () {
    this.line.updateSecondEnd();
};

LineMask.prototype.checkForCollision = function (canvas) {
    this.line.checkForCollision(canvas);
};
LineMask.prototype.vectorIntersect = function (other) {
    return this.line.vectorIntersect(other.line);
};

LineMask.prototype.intersect = function (other) {
    if (this.maskX & other.maskX && this.maskY & other.maskY) {
        return this.line.intersect(other.line);
    }
    return false;
};

LineMask.prototype.updateMask = function () {
    this.maskX = (1 << (this.line.center.x) / this.divider)
        | 1 << (this.line.firstEnd.x / this.divider)
        | 1 << (this.line.secondEnd.x / this.divider);
    this.maskY = 1 << (this.line.center.y / this.divider)
        | 1 << (this.line.firstEnd.y / this.divider)
        | 1 << (this.line.secondEnd.y / this.divider);
};


LineMask.prototype.update = function (ctx, canvas) {
    this.checkForCollision(canvas);
    this.line.center.x += this.line.speed * Math.cos(this.line.angle);
    this.line.center.y += this.line.speed * Math.sin(this.line.angle);
    this.line.rotation += this.line.rotationAngle;
    this.updateFirstEnd();
    this.updateSecondEnd();
    this.updateMask();
    this.draw(ctx);
};