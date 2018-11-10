let canvas;
let context;
let lines;
let n;
let size = 40;
let fpsCounterList = [];
let benchLimit = 100;
let fps;
let grid;
let tree;
let bench = false;
let algorithm;
let timerId = 0;
let running = false;
let gridDebug = false;
$(function () {
    // Feeds values of the form to benchmark when runBench is clicked
    $("#runVisualization").click(function (e) {
        e.preventDefault();
        n = $("#lineNumber").val();
        algorithm = $("#alg").val();
        console.log("algorithm : " + algorithm);
        console.log("lines : " + n);
        startVisualization(false);
    });
    $("#runBench").click(function (e) {
        e.preventDefault();
        startBenchmarking();
    });
});

function newRandomLine(mask) {
    if (!mask) {
        return new Line(
            Math.floor(Math.random() * (canvas.width - size) + size / 2),
            Math.floor(Math.random() * (canvas.height - size) + size / 2),
            Math.random() * 2 + 0.1,
            Math.floor(Math.random() * 360),
            Math.floor(Math.random() * 360),
            Math.random() * 2 + 0.1,
            size,
        );
    }
    else {
        return new LineMask(
            Math.floor(Math.random() * (canvas.width - size) + size / 2),
            Math.floor(Math.random() * (canvas.height - size) + size / 2),
            Math.random() * 2 + 0.1,
            Math.floor(Math.random() * 360),
            Math.floor(Math.random() * 360),
            Math.random() * 2 + 0.1,
            size,
        );
    }
}

function startBenchmarking() {
    let lineNumbers = [100, 250, 500, 1000, 1500, 2000, 2500, 3000];
    let valuesScatter = new Array(lineNumbers.length - 2);
    for (let linesIndex = 0; linesIndex < lineNumbers.length; linesIndex++) {
        let datumScatter = new Array(algorithms.length + 1);
        datumScatter[0] = Math.log2(lineNumbers[linesIndex]);
        for (let algIndex = 0; algIndex < algorithms.length; algIndex++) {
            let frameTimes = algBenchmark(algorithms[algIndex], lineNumbers[linesIndex]);
            if (linesIndex >= 2 && frameTimes != null) {
                datumScatter[algIndex + 1] = Math.log2(average(frameTimes)*1000);
            }

        }
        if (linesIndex >= 2) {
            valuesScatter[linesIndex - 2] = datumScatter;
        }
    }
    google.charts.load('upcoming', {'packages': ['corechart']});
    console.log(valuesScatter);
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
        // Erase current ScatterChart and create a new one
        $("#chartArea").empty().append("<div id=\"chartLinear\" style=\"width: 100%\"></div>\n");

        // Add legend to every column of the values of scatter
        let legend = new Array(algorithms.length + 1);
        legend[0] = "Size";
        for (let i = 1; i <= algorithms.length; i++) {
            legend[i] = algorithms[i - 1];
        }
        valuesScatter.unshift(legend);
        let dataScatter = google.visualization.arrayToDataTable(
            valuesScatter
        );

        // Generate scatterChart with options
        let trendline = {
            type: 'linear',
            showR2: true,
            visibleInLegend: true
        };
        let trendlines = {};
        for (let i = 0; i < algorithms.length; i++) {
            trendlines[i] = trendline;
        }
        let optionsScatter = {
            title: 'Average frame time by number of lines',
            chartArea: {
                width: '70%',
                right: '26%'
            },
            explorer: {},
            hAxis: {
                title: 'Number of lines Log2(LineNumber)',
                minValue: 0,
                viewWindow: {
                    min: 0,
                    max: 15
                },
            },
            vAxis: {
                title: 'Average frametime Log2(NanoSeconds)',
                minValue: 0,
                viewWindow: {
                    min: 0,
                    max: 100
                },
            },
            legend: {
                textStyle: {
                    fontSize: 14
                }
            },
            height: 900,
            trendlines: trendlines
        };
        let chartLinear = new google.visualization.ScatterChart($("#chartLinear")[0]);
        chartLinear.draw(dataScatter, optionsScatter);
    }
}

function algBenchmark(algo, nbLines) {
    canvas = $("#canvas")[0];
    context = canvas.getContext('2d');
    lines = new Array(nbLines);
    if (algo !== "mask") {
        for (let i = 0; i < nbLines; i++) {
            lines[i] = newRandomLine(false);
        }
    }
    else {
        for (let i = 0; i < nbLines; i++) {
            lines[i] = newRandomLine(true);
        }
    }
    if (algo === "grid") {
        grid = new Grid(canvas.width / (size / 2), size, lines);
    }
    return updateBench(algo, [], 0);
}

function updateBench(algo, fpsList, i) {
    if (i >= benchLimit) {
        return fpsList;
    }
    lines.forEach(line => {
        line.updatePos(canvas);
    });

    let frameTime = performance.now();
    computeCollisions(algo, true);
    frameTime = performance.now() - frameTime;
    if (frameTime > 100) {
        return null;
    }
    fpsList.push(frameTime);
    return updateBench(algo, fpsList, ++i);
}

function startVisualization() {
    if (running) {
        window.cancelAnimationFrame(timerId);
    }
    running = true;
    canvas = $("#canvas")[0];
    context = canvas.getContext('2d');
    context.fillStyle = "red";
    lines = new Array(n);
    if (algorithm !== "mask") {
        for (let i = 0; i < n; i++) {
            lines[i] = newRandomLine(false);
        }
    }
    else {
        for (let i = 0; i < n; i++) {
            lines[i] = newRandomLine(true);
        }
    }
    if (algorithm === "grid") {
        grid = new Grid(canvas.width / (size / 2), size, lines);
    }
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
    computeCollisions(algorithm, false);

    if (fpsCounterList.length < 10) {
        fpsCounterList.push(performance.now());
    }
    else {
        for (let i = 0; i < fpsCounterList.length - 1; i++) {
            fpsCounterList[i] = fpsCounterList[i + 1] - fpsCounterList[i];
        }
        fpsCounterList[fpsCounterList.length - 1] = performance.now() - fpsCounterList[fpsCounterList.length - 1];
        fps = average(fpsCounterList) / 1000;
        fpsCounterList = [];
    }
    timerId = window.requestAnimationFrame(update);
}


function computeCollisions(algorithm, bench) {
    function drawCollisions(point) {
        if (point) {
            if (!bench) {
                context.fillRect(point.x - 1, point.y - 1, 2, 2);
            }
            colls++;
        }
    }

    let colls = 0;

    switch (algorithm) {
        case "basic":
        case "mask":
            for (let i = 0; i < lines.length - 1; i++) {
                for (let j = i + 1; j < lines.length; j++) {
                    let point = (lines[i].intersect(lines[j]));
                    drawCollisions(point);
                }
            }
            break;
        case "grid":
            if (gridDebug) {
                grid.draw(context);
            }
            grid.update();
            grid.grid.forEach(col => {
                col.forEach(cell => {
                    for (let k = 0; k < cell.length; k++) {

                        let lineA = cell[k];

                        for (let l = k + 1; l < cell.length; l++) {

                            let point = (lineA.intersect(cell[l]));
                            drawCollisions(point);
                        }
                    }
                });
            });
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
                            drawCollisions(point);

                        }
                    }
                }
            );
            break;
        default:
    }
    //console.log(algorithm + " " + colls);
}

const average = arr => arr.reduce((p, c) => p + c, 0) / arr.length;