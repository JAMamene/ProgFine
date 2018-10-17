// Defining equals for arrays in order to compare them
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

/**
 * Swap two values in an array
 * @param array to _swap in
 * @param i index of value 1
 * @param j index of value 2
 */
function swap(array, i, j) {
    let tmp = array[j];
    array[j] = array[i];
    array[i] = tmp;
}

/**
 * checks if an array is sparse and returns the missing index
 *
 * @param array array to check
 * @returns {*} false or the index of the missing entry in the array
 */
function sparseIndex(array) {
    for (let i = 0; i < array.length; i++) {
        if (typeof array[i] === "undefined") {
            return i;
        }
    }
    return false;
}

/**
 * Returns the standard deviation of values
 * @param values number[] the values to check
 * @returns {number} the standard deviation of the series
 */
function standardDeviation(values) {
    let avg = average(values);

    let squareDiffs = values.map(function (value) {
        var diff = value - avg;
        return diff * diff;
    });

    let avgSquareDiff = average(squareDiffs);

    return Math.sqrt(avgSquareDiff);
}

/**
 * Calculates the averate of a list of values
 *
 * @param data number[} array of number
 * @returns {number} the average
 */
function average(data) {
    let sum = data.reduce(function (sum, value) {
        return sum + value;
    }, 0);

    return sum / data.length;
}

/**
 * Returns the min, max, average and standard deviation of a series
 * @param data number[}
 * @returns {{stdDev: number, avg: number, min: *, max: *}} statistics results
 */
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
