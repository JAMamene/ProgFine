function Grid(width, height, cellSize, lines) {
    this.lines = lines;
    this.width = width;
    this.height = height;
    this.cellSize = cellSize;
    this.grid = [[]];
}


Grid.prototype.update = function () {

    this.grid = Array(this.width);

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
                this.grid[point.x] = Array(this.height);
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

Grid.prototype.resolveCollisions = function (context) {
    this.update();
    this.grid.forEach(col => {
        col.forEach(cell => {
            for (let k = 0; k < cell.length; k++) {

                let lineA = cell[k];

                for (let l = k + 1; l < cell.length; l++) {

                    let point = (lineA.intersect(cell[l]));
                    if (point) {
                        context.fillRect(point.x - 1, point.y - 1, 2, 2);
                    }
                }
            }
        })
    });
};