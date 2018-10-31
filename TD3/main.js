let canvas;
let context;
let lines;
let fpsStack = [];
let fps;
const n = 100;
$(function () {
    canvas = $("#canvas")[0];
    let size = 150;
    context = canvas.getContext('2d');
    lines = [];
    for (let i = 0; i < n; i++) {
        lines.push(new Line(
            Math.floor(Math.random() * (canvas.width - size) + size / 2),
            Math.floor(Math.random() * (canvas.height - size) + size / 2),
            Math.floor(Math.random() * 3 + 1),
            Math.floor(Math.random() * 360),
            Math.floor(Math.random() * 360),
            Math.floor((Math.random() * 4 + 1)),
            size
        ));
    }
    //lines.push(new Line(500, 500, 2, 10, 45, 1, size));
    window.requestAnimationFrame(update);
});

function update() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.font = "20px Arial";
    context.fillText("FPS : " + Math.floor(1 / fps) + " , Shapes : " + n, 10, 20);
    lines.forEach(line => {
        line.update(context, canvas);
    });
    window.requestAnimationFrame(update);
    for (let i = 0; i < lines.length; i++) {
        for (let j = i; j < lines.length; j++) {
            let point = (lines[i].intersect(lines[j]));
            if (point) {
                context.rect(point.x - 1, point.y - 1, 2, 2);
                context.fillStyle = "red";
                context.fill();
            }
        }
    }
    if (fpsStack.length < 30) {
        fpsStack.push(performance.now());
    }
    else {
        for (let i = 0; i < fpsStack.length - 1; i++) {
            fpsStack[i] = fpsStack[i + 1] - fpsStack[i];
        }
        fpsStack[fpsStack.length - 1] = performance.now() - fpsStack[fpsStack.length - 1];
        fps = average(fpsStack) / 1000;
        console.log(fps);
        console.log(fpsStack);
        fpsStack = [];
    }
}

const average = arr => arr.reduce((p, c) => p + c, 0) / arr.length;