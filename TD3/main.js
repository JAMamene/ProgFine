let canvas, context, line, line1, line2;
$(function () {
    canvas = $("#canvas")[0];
    context = canvas.getContext('2d');
    line = new Line(30, 40, 1, 180, 10, 5, 30);
    line1 = new Line(70, 100, 2, 90, 90, 25, 40);
    line2 = new Line(200, 384, 1, 240, 240, -2, 300);

    window.requestAnimationFrame(update);
});

function update() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    line.update(context);
    line1.update(context);
    line2.update(context);
    window.requestAnimationFrame(update);

}

// Longuer = 1.4/racine(n)