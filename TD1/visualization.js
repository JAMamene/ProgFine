google.charts.load('current', {'packages': ['corechart']});
google.charts.setOnLoadCallback(drawChart);

function drawChart() {
    var data = google.visualization.arrayToDataTable([
        ['Age', 'Weight'],
        [8, 12],
        [4, 5.5],
        [11, 14],
        [4, 5],
        [3, 3.5],
        [6.5, 7]
    ]);

    var options = {
        hAxis: {minValue: 0, maxValue: 15},
        vAxis: {minValue: 0, maxValue: 15},
        chartArea: {width: '50%'},
        trendlines: {
            0: {
                type: 'linear',
                showR2: true,
                visibleInLegend: true
            }
        }
    };

    var chartLinear = new google.visualization.ScatterChart(document.getElementById('chartLinear'));
    chartLinear.draw(data, options);

    options.trendlines[0].type = 'exponential';
    options.colors = ['#6F9654'];

    var chartExponential = new google.visualization.ScatterChart(document.getElementById('chartExponential'));
    chartExponential.draw(data, options);
}