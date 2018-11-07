function Quad(x, y, width, lines) {
    this.x = x;
    this.y = y;
    this.lines = lines;
    this.width = width;
}

Quad.prototype.quadify = function () {
    if (this.lines.length > threshold && this.width > 40) {
        let quarter1 = [];
        let quarter2 = [];
        let quarter3 = [];
        let quarter4 = [];
        let semiWidth = this.width / 2;
        let middlex = this.x + semiWidth;
        let middley = this.y + semiWidth;
        this.lines.forEach(line => {
            let points = [line.center, line.firstEnd, line.secondEnd];
            points.forEach(point => {
                if (point.x < middlex && point.y < middley) {
                    quarter1.push(line);
                }
                else if (point.x < middlex && point.y > middley) {
                    quarter2.push(line);
                }
                if (point.x > middlex && point.y < middley) {
                    quarter3.push(line);
                }
                else if (point.x > middlex && point.y > middley) {
                    quarter4.push(line);
                }
            });
        });
        return [
            new Quad(this.x, this.y, semiWidth, quarter1),
            new Quad(this.x, this.y + semiWidth, semiWidth, quarter2),
            new Quad(this.x + semiWidth, this.y, semiWidth, quarter3),
            new Quad(this.x + semiWidth, this.y + semiWidth, semiWidth, quarter4)
        ];
    }
    return this;
};