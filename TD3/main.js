let canvas;
let context;
let lines;
let n;
let size = 40;
let fpsStack = [];
let fps;
let grid;
let tree;
let algorithm;
let timerId = 0;
let running = false;
let gridDebug = false;
$(function () {
    // Feeds values of the form to benchmark when runBench is clicked
    $("#runBench").click(function (e) {
        e.preventDefault();
        n = $("#lineNumber").val();
        algorithm = $("#alg").val();
        console.log("algorithm : " + algorithm);
        console.log("lines : " + n);
        startVisualization();
    });
});

function startVisualization() {
    if (running) {
        window.cancelAnimationFrame(timerId);
    }
    running = true;
    canvas = $("#canvas")[0];
    context = canvas.getContext('2d');
    context.fillStyle = "red";
    lines = [];
    for (let i = 0; i < n; i++) {
        if (algorithm !== "mask") {
            lines.push(new Line(
                Math.floor(Math.random() * (canvas.width - size) + size / 2),
                Math.floor(Math.random() * (canvas.height - size) + size / 2),
                Math.random() * 2 + 0.1,
                Math.floor(Math.random() * 360),
                Math.floor(Math.random() * 360),
                Math.random() * 2 + 0.1,
                size,
            ));
        }
        else {
            lines.push(new LineMask(
                Math.floor(Math.random() * (canvas.width - size) + size / 2),
                Math.floor(Math.random() * (canvas.height - size) + size / 2),
                Math.random() * 2 + 0.1,
                Math.floor(Math.random() * 360),
                Math.floor(Math.random() * 360),
                Math.random() * 2 + 0.1,
                size,
            ));
        }
    }
    grid = new Grid(canvas.width / (size / 2), size, lines);
    timerId = window.requestAnimationFrame(update);
}

function update() {
    gridDebug = $("#gridDebug").is(':checked');
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.font = "20px Arial";
    context.fillText("FPS : " + Math.floor(1 / fps) + " , Shapes : " + n, 10, 20);
    lines.forEach(line => {
        line.update(context, canvas);
    });

    computeCollisions(algorithm);

    if (fpsStack.length < 10) {
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
    timerId = window.requestAnimationFrame(update);
}


function computeCollisions(algorithm) {
    switch (algorithm) {
        case "basic":
        case "mask":
            for (let i = 0; i < lines.length - 1; i++) {
                for (let j = i + 1; j < lines.length; j++) {
                    let point = (lines[i].intersect(lines[j]));
                    if (point) {
                        context.fillRect(point.x - 1, point.y - 1, 2, 2);
                    }
                }
            }
            break;
        case "grid":
            if (gridDebug) {
                grid.draw(context);
            }
            grid.resolveCollisions(context);
            break;
        case "quad":
            let quads = [];
            quads.push(new Quad(0, 0, canvas.width, lines, 32));
            for (; ;) {
                let len = quads.length;
                for (let i = 0; i < len; i++) {
                    quads[i] = quads[i].quadify();
                }
                quads = quads.flat();
                if (len === quads.length) break;
            }
            quads.forEach(quad => {
                if (gridDebug) {
                    context.beginPath();
                    context.moveTo(quad.x, quad.y);
                    context.lineTo(quad.x + quad.width, quad.y);
                    context.lineTo(quad.x + quad.width, quad.y + quad.width);
                    context.stroke();
                }
                for (let i = 0; i < quad.lines.length; i++) {
                    for (let j = i + 1; j < quad.lines.length; j++) {
                        let point = (quad.lines[i].intersect(quad.lines[j]));
                        if (point) {
                            context.fillRect(point.x - 1, point.y - 1, 2, 2);
                        }
                    }
                }
            });
            break;
        default:
    }
}

const average = arr => arr.reduce((p, c) => p + c, 0) / arr.length;