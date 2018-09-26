google.charts.load('current', {'packages': ['corechart']});
google.charts.setOnLoadCallback(drawChart);

function measureTimes(alg, entrySize, iterations, maxMillis) {
    let times = new Array(iterations);
    for (let i = 0; i < iterations; i++) {
        let tab = Array.from({length: entrySize}, () => Math.floor(Math.random() * 1000));
        let t0 = performance.now();
        alg(tab);
        let t1 = performance.now();
        if ((t1 - t0) > maxMillis) {
            return null;
        }
        times[i] = (t1 - t0) * 1000;
    }
    return times;
}

let ns = [4, 16, 64, 256, 512, 1024, 2048, 4096, 8196];
let valuesScatter = new Array(ns.length);
let candleCharts = new Array(functions.length);
for (let i = 0; i < candleCharts.length; i++) {
    candleCharts[i] = [];
}

for (let entrySizeIndex = 0; entrySizeIndex < ns.length; entrySizeIndex++) {
    let datumScatter = new Array(functions.length + 1);
    datumScatter[0] = Math.log2(ns[entrySizeIndex]);
    for (let algIndex = 0; algIndex < functions.length; algIndex++) {
        let datumCandle = new Array(5);
        let times = measureTimes(functions[algIndex], ns[entrySizeIndex], 128, 128);
        if (times == null) {
            console.log(functions[algIndex].name + " FAILED at " + ns[entrySizeIndex]);
        }
        else {
            let stats = statistics(times);

            datumCandle[0] = "N=" + ns[entrySizeIndex];
            let min = Math.log2(stats.min);
            datumCandle[1] = min < 0 ? 0 : min;
            let inf = Math.log2(stats.avg - stats.stdDev / 2);
            datumCandle[2] = isNaN(inf) || inf < 0 ? 0 : inf;
            datumCandle[3] = Math.log2(stats.avg + stats.stdDev / 2);
            datumCandle[4] = Math.log2(stats.max);
            candleCharts[algIndex][entrySizeIndex] = datumCandle;

            datumScatter[algIndex + 1] = Math.log2(stats.avg);
        }
    }
    valuesScatter[entrySizeIndex] = datumScatter;
}

function drawChart() {
    let legend = new Array(functions.length + 1);
    legend[0] = "Size";
    for (let i = 1; i <= functions.length; i++) {
        legend[i] = functions[i - 1].name;
    }
    valuesScatter.unshift(legend);
    let dataScatter = google.visualization.arrayToDataTable(
        valuesScatter
    );
    let trendline = {
        type: 'linear',
        showR2: true,
        visibleInLegend: true
    };
    let optionsScatter = {
        chartArea: {width: '60%'},
        trendlines: {
            0: trendline,
            1: trendline,
            2: trendline,
            3: trendline,
            4: trendline,
            5: trendline
        }
    };

    let chartLinear = new google.visualization.ScatterChart(document.getElementById('chartLinear'));
    chartLinear.draw(dataScatter, optionsScatter);

    for (let i = 0; i < functions.length; i++) {

        let currentChart = candleCharts[i]

        //handle a hole in the values
        while (sparseIndex(currentChart) !== false) {
            currentChart.splice(sparseIndex(currentChart), 1);
        }

        let dataCandle = google.visualization.arrayToDataTable(currentChart, true);

        let optionsCandle = {
            title: "Algorithm " + functions[i].name + " execution times",
            legend: 'none'
        };

        let d1 = document.getElementById('chartLinear');
        d1.insertAdjacentHTML('afterend', '<div id="chartCandle' + functions[i].name + '" style="height: 500px; width: 80%"></div>');

        let chartCandle = new google.visualization.CandlestickChart(document.getElementById("chartCandle" + functions[i].name));

        chartCandle.draw(dataCandle, optionsCandle);
    }
}