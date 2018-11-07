Line = function (centerX, centerY, speed, angle, rotation, rotationAngle, size, id) {
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
    ctx.lineTo(this.firstEnd.x, this.firstEnd.y);
    ctx.moveTo(this.center.x, this.center.y);
    ctx.lineTo(this.secondEnd.x, this.secondEnd.y);
    ctx.stroke();
};

Line.prototype.updateFirstEnd = function () {
    this.firstEnd.x = this.center.x + this.size / 2 * Math.cos(this.rotation);
    this.firstEnd.y = this.center.y + this.size / 2 * Math.sin(this.rotation);
};

Line.prototype.updateSecondEnd = function () {
    this.secondEnd.x = this.center.x - this.size / 2 * Math.cos(this.rotation);
    this.secondEnd.y = this.center.y - this.size / 2 * Math.sin(this.rotation);
};

Line.prototype.checkForCollision = function (canvas) {
    if (this.firstEnd.x <= 0 || this.secondEnd.x <= 0) {
        this.angle = Math.PI - this.angle;
        this.rotationAngle = -this.rotationAngle;
    }
    else if (this.firstEnd.x >= canvas.width || this.secondEnd.x >= canvas.width) {
        this.angle = -Math.PI - this.angle;
        this.rotationAngle = -this.rotationAngle;
    }
    else if (this.firstEnd.y <= 0 || this.secondEnd.y <= 0 ||this.firstEnd.y >= canvas.height || this.secondEnd.y >= canvas.height) {
        this.angle = -this.angle;
        this.rotationAngle = -this.rotationAngle;
    }
};

Line.prototype.vectorIntersect = function (other) {
    // this.firstEnd = A
    // this.secondEnd = B
    // other.firstEnd = C
    // other.secondEnd = D
    let ab = {
        x: this.secondEnd.x - this.firstEnd.x,
        y: this.secondEnd.y - this.firstEnd.y
    };
    let alpha = ab.x * (other.firstEnd.y - this.firstEnd.y) - ab.y * (other.firstEnd.x - this.firstEnd.x);
    let beta = ab.x * (other.secondEnd.y - this.firstEnd.y) - ab.y * (other.secondEnd.x - this.firstEnd.x);
    if (!((alpha >= 0 && beta <= 0) || (alpha <= 0 && beta >= 0))) {
        return false;
    }
    ab = {
        x: other.secondEnd.x - other.firstEnd.x,
        y: other.secondEnd.y - other.firstEnd.x
    };
    alpha = ab.x * (this.secondEnd.y - other.firstEnd.y) - ab.y * (this.secondEnd.x - other.firstEnd.x);
    beta = ab.x * (this.firstEnd.y - other.firstEnd.y) - ab.y * (this.firstEnd.x - other.firstEnd.x);
    if (!((alpha >= 0 && beta <= 0) || (alpha <= 0 && beta >= 0))) {
        return false;
    }
    return {
        x: (alpha * other.secondEnd.x - beta * other.firstEnd.x) / (alpha - beta),
        y: (alpha * other.secondEnd.y - beta * other.firstEnd.y) / (alpha - beta)
    };
};

//http://paulbourke.net/geometry/pointlineplane/
Line.prototype.intersect = function (other) {
    let denominator = ((other.secondEnd.y - other.firstEnd.y) * (this.secondEnd.x - this.firstEnd.x)
        - (other.secondEnd.x - other.firstEnd.x) * (this.secondEnd.y - this.firstEnd.y));

    // Lines are parallel
    if (denominator === 0) {
        return false;
    }

    let ua = ((other.secondEnd.x - other.firstEnd.x) * (this.firstEnd.y - other.firstEnd.y)
        - (other.secondEnd.y - other.firstEnd.y) * (this.firstEnd.x - other.firstEnd.x)) / denominator;
    let ub = ((this.secondEnd.x - this.firstEnd.x) * (this.firstEnd.y - other.firstEnd.y)
        - (this.secondEnd.y - this.firstEnd.y) * (this.firstEnd.x - other.firstEnd.x)) / denominator;

    // is the intersection along the segments
    if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
        return false;
    }

    // Return a object with the x and y coordinates of the intersection
    return {
        x: this.firstEnd.x + ua * (this.secondEnd.x - this.firstEnd.x),
        y: this.firstEnd.y + ua * (this.secondEnd.y - this.firstEnd.y)
    }
};


Line.prototype.update = function (ctx, canvas) {
    this.checkForCollision(canvas);
    this.center.x += this.speed * Math.cos(this.angle);
    this.center.y += this.speed * Math.sin(this.angle);
    this.rotation += this.rotationAngle;
    this.updateFirstEnd();
    this.updateSecondEnd();
    this.draw(ctx);
};