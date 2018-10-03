let quickSortThreshold = 0;

function quickSortRandom(array) {
    qSort(array, randomPivot, 0, array.length - 1, quickSortThreshold);
}

function quickSortMedian3(array) {
    qSort(array, median3, 0, array.length - 1, quickSortThreshold);
}

function quickSortMedian5(array) {
    qSort(array, median5, 0, array.length - 1, quickSortThreshold);
}

function quickSortThreshold5(array) {
    qSort(array, randomPivot, 0, array.length - 1, 5);
}

function quickSortThreshold10(array) {
    qSort(array, randomPivot, 0, array.length - 1, 10);
}

function quickSortThreshold20(array) {
    qSort(array, randomPivot, 0, array.length - 1, 20);
}

function randomPivot(array, first, last) {
    return Math.floor(Math.random() * (last - first) + first);
}

function median3(array, first, last) {
    let middle = Math.floor((first + last) / 2);
    swapIfSmaller(array, last, first);
    swapIfSmaller(array, middle, first);
    swapIfSmaller(array, last, middle);
    return middle;
}

function median5(array, first, last) {
    let middle = Math.floor((first + last) / 2);
    let left = Math.floor((first + middle) / 2);
    let right = Math.floor((middle + last) / 2);
    swapIfSmaller(array, left, first);
    swapIfSmaller(array, right, middle);
    if (array[middle] < array[first]) {
        swap(array, left, right);
        swap(array, middle, first);
    }
    swap(array, first, last);
    swapIfSmaller(array, left, first);
    if (array[first] < array[middle]) {
        swap(array, left, right);
        swap(array, first, middle);
    }
    return array[first] < array[right] ? first : right;
}

function swapIfSmaller(array, a, b) {
    if (array[a] < array[b]) {
        swap(array, a, b);
    }
}

function quickSortFirst(array) {
    qSort(array, firstAsPivot, 0, array.length - 1);
}

function firstAsPivot(array, first, last) {
    return first;
}

function qSort(array, pivotPicker, first, last, threshold) {
    if (first > last) {
        return;
    }
    if (last - first <= threshold) {
        iSort(array, first, last + 1);
        return;
    }
    let pivot = pivotPicker(array, first, last);
    pivot = partition(array, first, last, pivot);
    qSort(array, pivotPicker, first, pivot - 1, threshold);
    qSort(array, pivotPicker, pivot + 1, last, threshold);
}

function partition(array, first, last, pivot) {
    swap(array, pivot, last);
    let j = first;
    for (let i = first; i < last; i++) {
        if (array[i] <= array[last]) {
            swap(array, i, j);
            j++;
        }
    }
    swap(array, last, j);
    return j;
}
