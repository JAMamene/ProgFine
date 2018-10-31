let canvas, context, lines;
$(function () {
    canvas = $("#canvas")[0];
    let size = 100;
    context = canvas.getContext('2d');
    lines = [];
    for (let i = 0; i < 100; i++) {
        lines.push(new Line(
            Math.floor(Math.random() * (canvas.width - size) + size),
            Math.floor(Math.random() * (canvas.height - size) + size),
            Math.floor(Math.random() * 2),
            Math.floor(Math.random() * 360),
            Math.floor(Math.random() * 360),
            Math.floor((Math.random() * 10) - 5),
            size
        ));
    }
    window.requestAnimationFrame(update);
});

function update() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    lines.forEach(line => {
        line.update(context);
    });
    window.requestAnimationFrame(update);
    for (let i = 0; i < lines.length; i++) {
        for (let j = i; j < lines.length; j++) {
            let point = (lines[i].intersect(lines[j]));
            if (point) {
                context.rect(point.x-1, point.y-1, 2, 2);
                context.fillStyle = "red";
                context.fill();
            }
        }
    }
}

