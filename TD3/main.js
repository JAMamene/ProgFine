$(function () {
    let canvas = $("#canvas")[0];
    let context = canvas.getContext('2d');
    let line = new Line(30, 40, null, 180, null, 100);
    let line1 = new Line(70, 100, null, 90, null, 40);
    let line2 = new Line(200, 384, null, 240, null, 300);
    line.draw(context);
    line1.draw(context);
    line2.draw(context);
});

// Longuer = 1.4/racine(n)