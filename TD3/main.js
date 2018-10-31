let canvas, context, lines;
$(function () {
    canvas = $("#canvas")[0];
    context = canvas.getContext('2d');
    lines = [];
    lines.push(new Line(30, 40, 1, 180, 10, 5, 100));
    lines.push(new Line(70, 100, 2, 90, 90, 25, 100));
    lines.push(new Line(200, 384, 1, 240, 240, -2, 100));
    window.requestAnimationFrame(update);
});

function update() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    lines.forEach(line => {
        line.update(context);
    });
    window.requestAnimationFrame(update);

}

