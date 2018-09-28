$(function () {
    $("#runBench").click(runBench);
});

function measureTimes(alg, entrySize, iterations, maxMillis) {
    let times = new Array(iterations);
    let oneChance = true;
    for (let i = 0; i < iterations; i++) {
        let arr = randomGen(entrySize);
        let t0 = performance.now();
        try {
            alg(arr);
        }
        catch (e) {
            console.log(e);
            return null;
        }
        let t1 = performance.now();
        if ((t1 - t0) > maxMillis) {
            if (oneChance) {
                console.log(alg.name + " WARNING at " + entrySize);
                oneChance = false;
            }
            else {
                console.log(alg.name + " FAILED at " + entrySize);
                return null;
            }
        }
        times[i] = (t1 - t0) * 1000;
    }
    return times;
}

function runBench() {
    let ns = [4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768];
    let bailoutTimeMS = 32;
    let warmupOffset = 4;
    let valuesScatter = new Array(ns.length - warmupOffset);
    let candleCharts = new Array(algorithms.length);
    for (let i = 0; i < candleCharts.length; i++) {
        candleCharts[i] = [];
    }
    let entrySizeIndex = 0;
    (function loop() {
        $(".progress-bar").css("width", ((entrySizeIndex + 1) / ns.length) * 100 + "%").attr("aria-valuenow", entrySizeIndex).text(ns[entrySizeIndex]);
        console.log(ns[entrySizeIndex]);
        let datumScatter = new Array(algorithms.length + 1);
        datumScatter[0] = Math.log2(ns[entrySizeIndex]);
        for (let algIndex = 0; algIndex < algorithms.length; algIndex++) {
            let datumCandle = new Array(5);
            let times = measureTimes(algorithms[algIndex], ns[entrySizeIndex], 64, bailoutTimeMS);
            if (entrySizeIndex >= warmupOffset && times != null) {
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
        if (entrySizeIndex >= warmupOffset) {
            valuesScatter[entrySizeIndex - warmupOffset] = datumScatter;
        }
        entrySizeIndex++;
        if (entrySizeIndex < ns.length) {
            setTimeout(loop, 50);
        }
        else {
            loadChart()
        }
    })();

    function loadChart() {
        google.charts.load('upcoming', {'packages': ['corechart']});
        google.charts.setOnLoadCallback(drawChart);
        console.log(valuesScatter);
    }

    function drawChart() {
        let legend = new Array(algorithms.length + 1);
        legend[0] = "Size";
        for (let i = 1; i <= algorithms.length; i++) {
            legend[i] = algorithms[i - 1].name;
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
        for (let i = 0; i < algorithms.length; i++) {
            trendlines[i] = trendline;
        }
        let optionsScatter = {
            title: 'Different sorting algorithm sorting speed by entry size',
            chartArea: {
                width: '70%',
                right: '26%'
            },
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
                title: 'Average time of execution (Log2(ns))',
                minValue: 0,
                viewWindow: {
                    min: 0,
                    max: 20
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

        $("#chartLinear").after(" <div class=\"container-fluid\">\n" +
            "        <ul class=\"nav nav-pills center-pills\" id=\"algo-tabs\" role=\"tablist\"></ul>\n" +
            "        <div class=\"tab-content\" id=\"algo-contents\"/>\n" +
            "    </div>");

        for (let i = 0; i < algorithms.length; i++) {

            let currentChart = candleCharts[i];

            //handle a hole in the values
            while (sparseIndex(currentChart) !== false) {
                currentChart.splice(sparseIndex(currentChart), 1);
            }

            let dataCandle = google.visualization.arrayToDataTable(currentChart, true);

            let optionsCandle = {
                title: "Algorithm " + algorithms[i].name + " execution times",
                legend: 'none',
                width: 800,
                height: 400,
                hAxis: {
                    title: 'Size of entry',
                },
                vAxis: {
                    title: 'Average time of execution (Log2(ns))',
                    viewWindow: {
                        min: 0,
                        max: 16,
                    },
                    ticks: [0, 4, 8, 12, 16]
                },
            };

            $("#algo-tabs").append("" +
                "<li class=\"nav-item\">\n" +
                "    <a class=\"nav-link\" id=\"tab-chart-candle\" data-toggle=\"pill\" href=\"#chart-candle" + algorithms[i].name + "\" role=\"tab\"\n" +
                "                   aria-controls=\"#chart-candle" + algorithms[i].name + "\" aria-selected=\"true\">" + algorithms[i].name + "</a>\n" +
                "</li>\n");
            $("#algo-contents").append("" +
                "<div class=\"tab-pane fade\" id=\"chart-candle" + algorithms[i].name + "\" role=\"tabpanel\" aria-labelledby=\"tab-chart-candle" + algorithms[i].name + "\">" +
                "    <div class=\"container\"><div id=\"chartCandle" + algorithms[i].name + "\" style=\"height: 400px; width: 800px; margin: auto\"></div></div>" +
                "</div>");
            let chartCandle = new google.visualization.CandlestickChart($("#chartCandle" + algorithms[i].name)[0]);
            chartCandle.draw(dataCandle, optionsCandle);
        }
    }
}