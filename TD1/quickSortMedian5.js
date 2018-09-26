// Transcribed from pseudo-code
// https://en.wikipedia.org/wiki/Median_of_medians

function quickSortMedian5(array) {
    qSort(array, medianOfMedians, 0, array.length - 1);
}


// Get the exact median of an array with 5 elements or less
function median5(array, first, last) {
    let copy = array.slice(first, last);
    insertionSort(copy);
    if (copy.length % 2 !== 0) {
        return copy[Math.floor(copy.length / 2)];
    }
    return (copy[Math.floor(copy.length / 2) - 1] + copy[Math.floor(copy.length / 2)]) / 2;
}

function medianOfMedians(array, first, last) {
    if (first - last < 5) {
        return median5(array, first, last);
    }
    for (let i = first; i < last - 1; i += 5) {
        let subRight = i + 4;
        if (subRight > last) {
            subRight = last;
        }
        let median = median5(array, i, subRight);
        swap(array, median, first + Math.floor((i - first) / 5));
    }
    return select(array, first, first + Math.floor((last - first) / 5), Math.floor((last - first) / 10 + 1));
}

function select(array, first, last, n) {
    while (true) {
        if (first === last) {
            return first;
        }
        let pivotIndex = medianOfMedians(array, first, last);
        pivotIndex = partition(array, first, last, pivotIndex);
        if (n = pivotIndex) {
            return n;
        } else if (n < pivotIndex) {
            last = pivotIndex - 1;
        } else {
            first = pivotIndex + 1;
        }
    }
}

// let arr = [1, 6, 8, 7, 4, 2, 8, 9, 4, 6];
// quickSortMedian5(arr);
// console.log(arr);

