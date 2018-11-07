LineMask = function (centerX, centerY, speed, angle, rotation, rotationAngle, size, id) {
    this.line = new Line(centerX, centerY, speed, angle, rotation, rotationAngle, size, id);
    this.mask = id;
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
    if ((this.mask >>> 16 & other.mask >>> 16) && (this.mask << 16 & other.mask << 16)) {
        return this.line.intersect(other.line);
    }
    return false;
};

LineMask.prototype.updateMask = function () {
    this.mask = (1 << (this.line.center.x / 40)
        | 1 << (16 + this.line.center.y / 40))
        | 1 << (this.line.firstEnd.x / 40)
        | 1 << (16 + this.line.firstEnd.y / 40)
        | 1 << (this.line.secondEnd.x / 40)
        | 1 << (16 + this.line.firstEnd.y / 40);
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