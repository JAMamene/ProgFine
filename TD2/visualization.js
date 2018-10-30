$(function () {
    // Feeds values of the form to benchmark when runBench is clicked
    $("#runBench").click(function (e) {
        e.preventDefault();
        let method = $("#methods").val();
        let bailoutTime = $("#bailoutTime").val();
        let iterations = $("#iterations").val();
        let dStruct = Structures[$("#dStruct").val()];
        console.log("method : " + method);
        console.log("bailout : " + bailoutTime);
        console.log("iterations : " + iterations);
        runBench(method, iterations, bailoutTime, dStruct);
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
        try {
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
                case "remove":
                    arr = shuffle(entrySize);
                    dataType.construct(arr);
                    t0 = performance.now();
                    for (let i = 0; i < entrySize-1; i++) {
                        dataType[funcToTest](arr[i]);
                    }
                    t1 = performance.now();
                    break;
                case "find":
                    arr = shuffle(entrySize);
                    dataType.construct(arr);
                    t0 = performance.now();
                    for (let i = 0; i < entrySize-1; i++) {
                        dataType[funcToTest](arr[i]);
                    }
                    t1 = performance.now();
                    break;
                default:
                    console.error("invalid function to test " + funcToTest);
                    break;
            }
        }
        catch (e) {
            console.error(e);
            return null;
        }


        // If exec time was too long and the chance was used then return null
        if ((t1 - t0) > maxMillis) {
            if (oneChance) {
                console.log(new DataType().structureName + " WARNING at " + entrySize);
                oneChance = false;
            }
            else {
                console.log(new DataType().structureName + " FAILED at " + entrySize);
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
 * @param iterations {number} the number of times each algorithm will be fired for each n
 * @param bailoutTime {number} the milliseconds before an algorithm execution is aborted
 * @param family {array} the selected Datastructures, an array containing the different objects to experiment on
 */
function runBench(funcToTest, iterations, bailoutTime, family) {
    let selectedDataStructures = family;
    // The different tab size to experiment on
    let ns = [2, 4, 7, 15, 31, 63, 127, 255, 511, 1023, 2047, 4095, 8191, 16383, 32767 /*, 65535*/];
    let bailoutTimeMS = bailoutTime;
    // The number of ignored ns (the x first one), reason is for warmup and because time of small tabs arre inconsistent
    let warmupOffset = 7;
    // The values for the scatterChart
    let valuesScatter = new Array(ns.length - warmupOffset);
    // The candleChart array
    let candleCharts = new Array(selectedDataStructures.length);
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
        let datumScatter = new Array(selectedDataStructures.length + 1);
        datumScatter[0] = Math.log2(ns[entrySizeIndex]);
        // Run all algorithms
        for (let algIndex = 0; algIndex < selectedDataStructures.length; algIndex++) {
            let datumCandle = new Array(5);

            // Measure times for the selected algorithm and array size
            let times = measureTimes(selectedDataStructures[algIndex], ns[entrySizeIndex], iterations, bailoutTimeMS, funcToTest);

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
        $("#chartArea").empty().append("<div id=\"chartLinear\" style=\"width: 80%\"></div>\n");
        $("#chartLinear").after(" <div class=\"container-fluid\">\n" +
            "        <ul class=\"nav nav-pills center-pills\" id=\"algo-tabs\" role=\"tablist\"></ul>\n" +
            "        <div class=\"tab-content\" id=\"algo-contents\"/>\n" +
            "    </div>");


        // Add legend to every column of the values of scatter
        let legend = new Array(selectedDataStructures.length + 1);
        legend[0] = "Size";
        for (let i = 1; i <= selectedDataStructures.length; i++) {
            legend[i] = new selectedDataStructures[i - 1]().structureName;
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
        for (let i = 0; i < selectedDataStructures.length; i++) {
            trendlines[i] = trendline;
        }
        let optionsScatter = {
            title: 'Speed by entry size',
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
        for (let i = 0; i < selectedDataStructures.length; i++) {

            let currentChart = candleCharts[i];

            let structName = new selectedDataStructures[i]().structureName;

            //handle a hole in the values
            while (sparseIndex(currentChart) !== false) {
                currentChart.splice(sparseIndex(currentChart), 1);
            }

            let dataCandle = google.visualization.arrayToDataTable(currentChart, true);

            let optionsCandle = {
                title: funcToTest + " on " + structName + " execution times",
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
                "    <a class=\"nav-link\" id=\"tab-chart-candle\" data-toggle=\"pill\" href=\"#chart-candle" + structName + "\" role=\"tab\"\n" +
                "                   aria-controls=\"#chart-candle" + structName + "\" aria-selected=\"true\">" + structName + "</a>\n" +
                "</li>\n");
            $("#algo-contents").append("" +
                "<div class=\"tab-pane fade\" id=\"chart-candle" + structName + "\" role=\"tabpanel\" aria-labelledby=\"tab-chart-candle" + structName + "\">" +
                "    <div class=\"container\"><div id=\"chartCandle" + structName + "\" style=\"height: 450px; width: 950px; margin: auto\"></div></div>" +
                "</div>");
            let chartCandle = new google.visualization.CandlestickChart($("#chartCandle" + structName)[0]);
            chartCandle.draw(dataCandle, optionsCandle);
        }
    }
}