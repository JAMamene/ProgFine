google.charts.load('current', {'packages': ['corechart']});
google.charts.setOnLoadCallback(drawChart);

let ns = [1, 4, 16, 64, 256, 1024, 4096];
let scores = new Array(ns.length);
for (let i = 0; i < ns.length; i++) {
    let datum = new Array(functions.length + 1);
    datum[0] = Math.log2(ns[i]);
    for (let k = 0; k < functions.length; k++) {
        let times = new Array(256);
        for (let j = 0; j < 256; j++) {
            let tab = Array.from({length: ns[i]}, () => Math.floor(Math.random() * 1000));
            let t0 = performance.now();
            functions[k](tab);
            let t1 = performance.now();
            times[j] = (t1 - t0) * 1000;
        }
        let sum = times.reduce(function (a, b) {
            return a + b;
        });
        let avg = sum / times.length;
        datum[k + 1] = Math.log2(avg);
    }
    scores[i] = datum;
}

function drawChart() {
    let legend = new Array(functions.length + 1);
    legend[0] = "Size";
    for (let i = 1; i <= functions.length; i++) {
        legend[i] = functions[i - 1].name;
    }
    scores.unshift(legend);
    console.log(scores);
    let data = google.visualization.arrayToDataTable(
        scores
    );
    let options = {
        chartArea: {width: '60%'},
        trendlines: {
            0: {
                type: 'linear',
                showR2: true,
                visibleInLegend: true
            },
            1: {
                type: 'linear',
                showR2: true,
                visibleInLegend: true
            },
            2: {
                type: 'linear',
                showR2: true,
                visibleInLegend: true
            },
            3: {
                type: 'linear',
                showR2: true,
                visibleInLegend: true
            },
            4: {
                type: 'linear',
                showR2: true,
                visibleInLegend: true
            },
            5: {
                type: 'linear',
                showR2: true,
                visibleInLegend: true
            }
        }
    };

    let chartLinear = new google.visualization.ScatterChart(document.getElementById('chartLinear'));
    chartLinear.draw(data, options);
}