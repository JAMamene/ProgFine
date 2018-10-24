$(function () {
    // Feeds values of the form to benchmark when runBench is clicked
    $("#runBench").click(function (e) {
        e.preventDefault();
        let bailoutTime = $("#bailoutTime").val();
        let iterations = $("#iterations").val();
        console.log("bailout : " + bailoutTime);
        console.log("iterations : " + iterations);
        runBench("extractMin", iterations, bailoutTime);
    });
});


function measureTimes(DataType, entrySize, iterations, maxMillis, funcToTest) {
    let times = new Array(iterations);
    let oneChance = true;

    // Run the number of iterations wanted
    for (let i = 0; i < iterations; i++) {

        let t0;
        let t1;
        let arr;
        let dataType = new DataType();
        switch (funcToTest) {
            case "construct":
                arr = shuffle(entrySize);
                t0 = performance.now();
                dataType[funcToTest](arr);
                t1 = performance.now();
                break;
            case "insert":
                arr = shuffle(entrySize);
                t0 = performance.now();
                for (let i = 0; i < entrySize; i++) {
                    dataType[funcToTest](arr[i]);
                }
                t1 = performance.now();
                break;
            case "extractMin":
                arr = shuffle(entrySize);
                dataType.construct(arr);
                t0 = performance.now();
                for (let i = 0; i < entrySize; i++) {
                    dataType[funcToTest]();
                }
                t1 = performance.now();
                break;
            default:
                console.error("invalid function to test " + funcToTest);
                break;
        }


        // If exec time was too long and the chance was used then return null
        if ((t1 - t0) > maxMillis) {
            if (oneChance) {
                console.log(DataType.name + " WARNING at " + entrySize);
                oneChance = false;
            }
            else {
                console.log(DataType.name + " FAILED at " + entrySize);
                return null;
            }
        }
        // Return time as Nanoseconds to prevent negative values for the logarithm
        times[i] = (t1 - t0) * 1000;
    }
    return times;
}

/**
 * Computation of exec times and creation of the graphs
 * @param funcToTest {string} the member function to test (extractMin, insert, construct)
 * @param iterations the number of times each algorithm will be fired for each n
 * @param bailoutTime the milliseconds before an algorithm execution is aborted
 */
function runBench(funcToTest, iterations, bailoutTime) {
    let selectedAlgs = PriorityQueues;
    console.log(PriorityQueues);
    // The different tab size to experiment on
    let ns = [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768, 65536];
    let bailoutTimeMS = bailoutTime;
    // The number of ignored ns (the x first one), reason is for warmup and because time of small tabs arre inconsistent
    let warmupOffset = 7;
    // The values for the scatterChart
    let valuesScatter = new Array(ns.length - warmupOffset);
    // The candleChart array
    let candleCharts = new Array(selectedAlgs.length);
    for (let i = 0; i < candleCharts.length; i++) {
        candleCharts[i] = [];
    }
    // The index indicating the size of the entry of the ns array
    let entrySizeIndex = 0;
    // Loop is used with timeout to update the progress bar
    (function loop() {
        $(".progress-bar").css("width", ((entrySizeIndex + 1) / ns.length) * 100 + "%").attr("aria-valuenow", entrySizeIndex).text(ns[entrySizeIndex]);
        console.log(ns[entrySizeIndex]);
        // Initialize the data for an entrySize on the scatterChart
        let datumScatter = new Array(selectedAlgs.length + 1);
        datumScatter[0] = Math.log2(ns[entrySizeIndex]);
        // Run all algorithms
        for (let algIndex = 0; algIndex < selectedAlgs.length; algIndex++) {
            let datumCandle = new Array(5);

            // Measure times for the selected algorithm and array size
            let times = measureTimes(selectedAlgs[algIndex], ns[entrySizeIndex], iterations, bailoutTimeMS, funcToTest);

            // if times is null then the execution failed and we don't add the values to the charts
            if (entrySizeIndex >= warmupOffset && times != null) {

                // Add values to the candleChart
                let stats = statistics(times);
                datumCandle[0] = "N=" + ns[entrySizeIndex];
                let min = Math.log2(stats.min);
                datumCandle[1] = min < 0 ? 0 : min;
                let inf = Math.log2(stats.avg - stats.stdDev / 2);
                datumCandle[2] = isNaN(inf) || inf < 0 ? 0 : inf;
                datumCandle[3] = Math.log2(stats.avg + stats.stdDev / 2);
                datumCandle[4] = Math.log2(stats.max);
                candleCharts[algIndex][entrySizeIndex] = datumCandle;

                // Add values to scatterChart
                datumScatter[algIndex + 1] = Math.log2(stats.avg);
            }
        }
        // If we are out of the warmup set the values for the array size in the scatterchart
        if (entrySizeIndex >= warmupOffset) {
            valuesScatter[entrySizeIndex - warmupOffset] = datumScatter;
        }
        // Loop if there are still n to test with a timeout for ui refresh
        entrySizeIndex++;
        if (entrySizeIndex < ns.length) {
            setTimeout(loop, 100);
        }
        // Else generate the charts with the values we got
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
        // Erase current ScatterChart and create a new one
        $("#chartArea").empty().append("<div id=\"chartLinear\" style=\"width: 100%\"></div>\n");
        $("#chartLinear").after(" <div class=\"container-fluid\">\n" +
            "        <ul class=\"nav nav-pills center-pills\" id=\"algo-tabs\" role=\"tablist\"></ul>\n" +
            "        <div class=\"tab-content\" id=\"algo-contents\"/>\n" +
            "    </div>");


        // Add legend to every column of the values of scatter
        let legend = new Array(selectedAlgs.length + 1);
        legend[0] = "Size";
        for (let i = 1; i <= selectedAlgs.length; i++) {
            legend[i] = selectedAlgs[i - 1].name;
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
        for (let i = 0; i < selectedAlgs.length; i++) {
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


        // Generate a CandleChart for each algorithm
        for (let i = 0; i < selectedAlgs.length; i++) {

            let currentChart = candleCharts[i];

            //handle a hole in the values
            while (sparseIndex(currentChart) !== false) {
                currentChart.splice(sparseIndex(currentChart), 1);
            }

            let dataCandle = google.visualization.arrayToDataTable(currentChart, true);

            let optionsCandle = {
                title: "Algorithm " + selectedAlgs[i].name + " execution times",
                legend: 'none',
                width: 950,
                height: 450,
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

            // Create tabs navigation for each sorting algorithm and append the values
            $("#algo-tabs").append("" +
                "<li class=\"nav-item\">\n" +
                "    <a class=\"nav-link\" id=\"tab-chart-candle\" data-toggle=\"pill\" href=\"#chart-candle" + selectedAlgs[i].name + "\" role=\"tab\"\n" +
                "                   aria-controls=\"#chart-candle" + selectedAlgs[i].name + "\" aria-selected=\"true\">" + selectedAlgs[i].name + "</a>\n" +
                "</li>\n");
            $("#algo-contents").append("" +
                "<div class=\"tab-pane fade\" id=\"chart-candle" + selectedAlgs[i].name + "\" role=\"tabpanel\" aria-labelledby=\"tab-chart-candle" + selectedAlgs[i].name + "\">" +
                "    <div class=\"container\"><div id=\"chartCandle" + selectedAlgs[i].name + "\" style=\"height: 450px; width: 950px; margin: auto\"></div></div>" +
                "</div>");
            let chartCandle = new google.visualization.CandlestickChart($("#chartCandle" + selectedAlgs[i].name)[0]);
            chartCandle.draw(dataCandle, optionsCandle);
        }
    }
}