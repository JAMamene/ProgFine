Line = function (centerX, centerY, speed, angle, rotation, rotationAngle, size) {
    this.centerX = centerX;
    this.centerY = centerY;
    this.speed = speed;
    this.angle = Math.PI * angle / 180.0;
    this.rotation = Math.PI * rotation / 180.0;
    this.rotationAngle = Math.PI * rotationAngle / 180.0;
    this.size = size;
};

Line.prototype.draw = function (ctx) {
    ctx.moveTo(this.centerX, this.centerY);
    ctx.lineTo(
        this.centerX + this.size / 2 * Math.cos(this.rotation), this.centerY + this.size / 2 * Math.sin(this.rotation)
    );
    ctx.moveTo(this.centerX, this.centerY);
    ctx.lineTo(
        this.centerX - this.size / 2 * Math.cos(this.rotation), this.centerY - this.size / 2 * Math.sin(this.rotation)
    );
    ctx.stroke();
};

Line.prototype.update = function () {
    this.centerX += this.angle * this.speed;
    this.centerY += this.angle * this.speed;
    this.rotation += this.rotationAngle;
};