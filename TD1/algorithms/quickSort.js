function quickSortRandom(array) {
    qSort(array, randomPivot, 0, array.length - 1);
}

function randomPivot(array, first, last) {
    return Math.floor(Math.random() * (last - first) + first);
}

function quickSortMedian3(array) {
    qSort(array, median3, 0, array.length - 1);
}

function median3(array, first, last) {
    let middle = Math.floor((first + last) / 2);
    swapIfSmaller(array, last, first);
    swapIfSmaller(array, middle, first);
    swapIfSmaller(array, last, middle);
    return middle;
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

function qSort(array, pivotPicker, first, last) {
    if (first < last) {
        let pivot = pivotPicker(array, first, last);
        pivot = partition(array, first, last, pivot);
        qSort(array, pivotPicker, first, pivot - 1);
        qSort(array, pivotPicker, pivot + 1, last);
    }
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

// median de 3, 4, 5, 1er élément

