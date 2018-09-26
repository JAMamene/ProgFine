function insertionSort(array) {
    insertionSortR(array, array.length-1);
}

function insertionSortR(array, n) {
    if (n > 0) {
        insertionSortR(array, n - 1);
        let x = array[n];
        let j = n-1;
        while (j>=0 && array[j] > x) {
            array[j+1] = array[j];
            j--;
        }
        array[j+1] = x;
    }
}
