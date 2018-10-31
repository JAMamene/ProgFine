$(function () {
    let canvas = $("#canvas")[0];
    let context = canvas.getContext('2d');
    let line = new Line(30, 40, 1, 180, 10, 5, 30);
    let line1 = new Line(70, 100, 2, 90, 90, 25, 40);
    let line2 = new Line(200, 384, 3, 240, 100, 32, 300);
    line.draw(context);
    line1.draw(context);
    line2.draw(context);
    window.requestAnimationFrame(update);
});

function update() {

}

// Longuer = 1.4/racine(n)