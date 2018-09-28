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

$(function () {
    $("#runBench").click(runBench);
});

function runBench() {
    let ns = [128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32700];
    let bailoutTime = 40;
    let valuesScatter = new Array(ns.length);
    let candleCharts = new Array(functions.length);
    for (let i = 0; i < candleCharts.length; i++) {
        candleCharts[i] = [];
    }
    let entrySizeIndex = 0;
    (function loop() {
        $(".progress-bar").css("width", ((entrySizeIndex + 1) / ns.length) * 100 + "%").attr("aria-valuenow", entrySizeIndex);
        console.log(ns[entrySizeIndex]);
        let datumScatter = new Array(functions.length + 1);
        datumScatter[0] = Math.log2(ns[entrySizeIndex]);
        for (let algIndex = 0; algIndex < functions.length; algIndex++) {
            let datumCandle = new Array(5);
            let times = measureTimes(functions[algIndex], ns[entrySizeIndex], 128, bailoutTime);
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
        entrySizeIndex++;
        if (entrySizeIndex < ns.length) {
            setTimeout(loop, 0);
        }
        else {
            loadChart()
        }
    })();

    function loadChart() {
        google.charts.load('current', {'packages': ['corechart']});
        google.charts.setOnLoadCallback(drawChart);
    }

    function drawChart() {
        let legend = new Array(functions.length + 1);
        legend[0] = "Size";
        for (let i = 1; i <= functions.length; i++) {
            legend[i] = functions[i - 1].name;
        }
        valuesScatter.unshift(legend);
        console.log(valuesScatter);
        let dataScatter = google.visualization.arrayToDataTable(
            valuesScatter
        );
        let trendline = {
            type: 'linear',
            showR2: true,
            visibleInLegend: true
        };
        let trendlines = {};
        for (let i = 0; i < functions.length; i++) {
            trendlines[i] = trendline;
        }
        let optionsScatter = {
            title: 'Different sorting algorithm sorting speed by entry size',
            chartArea: {width: '65%'},
            explorer: {},
            hAxis: {
                title: 'Size of entry (Log2(arraysize))',
                minValue: 0,
                viewWindow: {
                    min: 0,
                    max: 20
                },
            },
            vAxis: {
                title: 'Average time of execution (Log2(ms))',
                minValue: 0,
                viewWindow: {
                    min: 0,
                    max: 20
                },
            },
            trendlines: trendlines
        };

        let chartLinear = new google.visualization.ScatterChart($("#chartLinear")[0]);
        chartLinear.draw(dataScatter, optionsScatter);

        $("#chartLinear").after(" <div class=\"container-fluid\">\n" +
            "        <ul class=\"nav nav-pills center-pills\" id=\"algo-tabs\" role=\"tablist\"></ul>\n" +
            "        <div class=\"tab-content\" id=\"algo-contents\"/>\n" +
            "    </div>");

        for (let i = 0; i < functions.length; i++) {

            let currentChart = candleCharts[i];

            //handle a hole in the values
            while (sparseIndex(currentChart) !== false) {
                currentChart.splice(sparseIndex(currentChart), 1);
            }

            let dataCandle = google.visualization.arrayToDataTable(currentChart, true);

            let optionsCandle = {
                title: "Algorithm " + functions[i].name + " execution times",
                legend: 'none',
                width: 800,
                height: 400,
                vAxis: {
                    viewWindow: {
                        min: 0,
                        max: bailoutTime
                    }
                },
            };

            $("#algo-tabs").append("" +
                "<li class=\"nav-item\">\n" +
                "    <a class=\"nav-link\" id=\"tab-chart-candle\" data-toggle=\"pill\" href=\"#chart-candle" + functions[i].name + "\" role=\"tab\"\n" +
                "                   aria-controls=\"#chart-candle" + functions[i].name + "\" aria-selected=\"true\">" + functions[i].name + "</a>\n" +
                "</li>\n");
            $("#algo-contents").append("" +
                "<div class=\"tab-pane fade\" id=\"chart-candle" + functions[i].name + "\" role=\"tabpanel\" aria-labelledby=\"tab-chart-candle" + functions[i].name + "\">" +
                "    <div class=\"container\"><div id=\"chartCandle" + functions[i].name + "\" style=\"height: 400px; width: 800px; margin: auto\"></div></div>" +
                "</div>");
            let chartCandle = new google.visualization.CandlestickChart($("#chartCandle" + functions[i].name)[0]);
            chartCandle.draw(dataCandle, optionsCandle);
        }
    }
}