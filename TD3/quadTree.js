let threshold = 32;

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
            let isin = [false, false, false, false];
            let points = [line.firstEnd, line.center, line.secondEnd];
            points.forEach(point => {
                if (point.x < middlex && point.y < middley) {
                    isin[0] = true;
                }
                else if (point.x < middlex && point.y > middley) {
                    isin[1] = true;
                }
                if (point.x > middlex && point.y < middley) {
                    isin[2] = true;
                }
                else if (point.x > middlex && point.y > middley) {
                    isin[3] = true;
                }
            });
            if (isin[0]) {
                quarter1.push(line);
            }
            if (isin[1]) {
                quarter2.push(line);
            }
            if (isin[2]) {
                quarter3.push(line);
            }
            if (isin[3]) {
                quarter4.push(line);
            }
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