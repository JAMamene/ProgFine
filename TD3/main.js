let canvas = $("#canvas")[0];
let context = canvas.getContext('2d');

console.log(context);
context.beginPath();
context.moveTo(100, 150);
context.lineTo(450, 50);
context.stroke();