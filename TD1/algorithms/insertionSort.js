function insertionSort(array) {
    iSort(array, 0, array.length);
}

function iSort(array, first, last) {
    for (let i = first + 1; i < last; i++) {
        let x = array[i];
        let j = i - 1;
        for (; j >= first && array[j] > x; j--) {
            array[j + 1] = array[j];
        }
        array[j + 1] = x;
    }
}