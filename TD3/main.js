let canvas;
let context;
let lines;
let fpsStack = [];
let fps;
let grid;
const n = 1500;
$(function () {
    canvas = $("#canvas")[0];
    let size = 80;
    context = canvas.getContext('2d');
    lines = [];
    for (let i = 0; i < n; i++) {
        lines.push(new LineMask(
            Math.floor(Math.random() * (canvas.width - size) + size / 2),
            Math.floor(Math.random() * (canvas.height - size) + size / 2),
            Math.floor(Math.random() * 2 + 1),
            Math.floor(Math.random() * 360),
            Math.floor(Math.random() * 360),
            Math.floor((Math.random() * 2 + 1)),
            size,
            i
        ));
    }
    grid = new Grid(16, 16, 40, lines);
    // lines.push(new LineMask(500, 500, 2, 10, 45, 1, size, 1));
    // lines.push(new LineMask(200, 200, 2, 10, 45, 1, size, 2));
    window.requestAnimationFrame(update);
});

function update() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.font = "20px Arial";
    context.fillText("FPS : " + Math.floor(1 / fps) + " , Shapes : " + n, 10, 20);
    lines.forEach(line => {
        line.update(context, canvas);
    });
    let time = performance.now();
    // grid.update();
    // grid.getCollisions().forEach(pair => {
    //     let point = (pair[0].intersect(pair[1]));
    //     if (point) {
    //         context.rect(point.x, point.y, 1, 1);
    //         context.fillStyle = "red";
    //         context.fill();
    //     }
    // });
    context.fillStyle = "red";
    for (let i = 0; i < lines.length - 1; i++) {
        for (let j = i + 1; j < lines.length; j++) {
            let point = (lines[i].intersect(lines[j]));

            if (point) {
                context.fillRect(point.x, point.y, 2, 2);
            }
        }
    }
    let final = performance.now();
    //console.log(final - time);
    if (fpsStack.length < 30) {
        fpsStack.push(performance.now());
    }
    else {
        for (let i = 0; i < fpsStack.length - 1; i++) {
            fpsStack[i] = fpsStack[i + 1] - fpsStack[i];
        }
        fpsStack[fpsStack.length - 1] = performance.now() - fpsStack[fpsStack.length - 1];
        fps = average(fpsStack) / 1000;
        fpsStack = [];
    }
    window.requestAnimationFrame(update);
}

const average = arr => arr.reduce((p, c) => p + c, 0) / arr.length;