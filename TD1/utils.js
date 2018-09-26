if (Array.prototype.equals)
    console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
Array.prototype.equals = function (array) {
    if (!array)
        return false;

    if (this.length != array.length)
        return false;

    for (var i = 0, l = this.length; i < l; i++) {
        if (this[i] instanceof Array && array[i] instanceof Array) {
            if (!this[i].equals(array[i]))
                return false;
        }
        else if (this[i] != array[i]) {
            return false;
        }
    }
    return true;
};
Object.defineProperty(Array.prototype, "equals", {enumerable: false});

function swap(array, i, j) {
    let tmp = array[j];
    array[j] = array[i];
    array[i] = tmp;
}

function sparseIndex(array) {
    for (let i = 0; i < array.length; i++) {
        if (typeof array[i] === "undefined") {
            return i;
        }
    }
    return false;
}

function standardDeviation(values) {
    var avg = average(values);

    var squareDiffs = values.map(function (value) {
        var diff = value - avg;
        return diff * diff;
    });

    var avgSquareDiff = average(squareDiffs);

    return Math.sqrt(avgSquareDiff);
}

function average(data) {
    var sum = data.reduce(function (sum, value) {
        return sum + value;
    }, 0);

    return sum / data.length;
}

function statistics(data) {
    return {
        stdDev: standardDeviation(data),
        avg: average(data),
        min: data.reduce(function (a, b) {
            return Math.min(a, b);
        }),
        max: data.reduce(function (a, b) {
            return Math.max(a, b);
        })
    }
}
