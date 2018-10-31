Line = function (centerX, centerY, speed, angle, rotation, size) {
    this.centerX = centerX;
    this.centerY = centerY;
    this.speed = speed;
    this.angle = angle;
    this.rotation = rotation;
    this.size = size;
};

Line.prototype.draw = function (ctx) {
    ctx.moveTo(this.centerX, this.centerY);
    ctx.lineTo(
        this.centerX + this.size / 2 * Math.cos(Math.PI * this.angle / 180.0), this.centerY + this.size / 2 * Math.sin(Math.PI * this.angle / 180)
    );
    ctx.moveTo(this.centerX, this.centerY);
    ctx.lineTo(
        this.centerX - this.size / 2 * Math.cos(Math.PI * this.angle / 180.0), this.centerY - this.size / 2 * Math.sin(Math.PI * this.angle / 180)
    );
    ctx.fillRect(this.centerX, this.centerY, 3, 3);
    ctx.stroke();
};