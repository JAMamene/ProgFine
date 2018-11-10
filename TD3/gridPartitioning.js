function Grid(size, cellSize, lines) {
    this.lines = lines;
    this.size = size;
    this.cellSize = cellSize;
    this.grid = [[]];
}


Grid.prototype.update = function () {

    this.grid = Array(this.size);

    for (let i = 0; i < this.lines.length; i++) {
        let line = this.lines[i];

        let points = [
            new Point(
                Math.floor((line.center.x) / this.cellSize),
                Math.floor((line.center.y) / this.cellSize)
            ),
            new Point(
                Math.floor((line.firstEnd.x) / this.cellSize),
                Math.floor((line.firstEnd.y) / this.cellSize)
            ),
            new Point(
                Math.floor((line.secondEnd.x) / this.cellSize),
                Math.floor((line.secondEnd.y) / this.cellSize)
            ),
        ];

        let cells = [];
        points.forEach(point => {
            if (!this.grid[point.x]) {
                this.grid[point.x] = Array(this.size);
            }
            let gridCol = this.grid[point.x];
            if (!gridCol[point.y]) {
                gridCol[point.y] = [];
            }
            if (!(cells.includes(gridCol[point.y]))) {
                gridCol[point.y].push(line);
                cells.push(gridCol[point.y]);
            }
        });
    }
};

Grid.prototype.draw = function (context) {
    for (let i = 0; i < this.grid.length; i++) {
        if (!this.grid[i]) {
            continue;
        }
        for (let j = 0; j < this.grid[i].length; j++) {
            if (!this.grid[i][j]) {
                continue;
            }
            context.beginPath();
            let originX = i * this.cellSize;
            let originY = j * this.cellSize;
            context.moveTo(originX, originY);
            context.lineTo(originX + this.cellSize, originY);
            context.lineTo(originX + this.cellSize, originY + this.cellSize);
            context.lineTo(originX, originY + this.cellSize);
            context.lineTo(originX, originY);
            context.stroke();
        }
    }
};