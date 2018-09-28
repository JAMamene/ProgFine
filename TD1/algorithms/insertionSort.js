function insertionSort(array) {
    for (let i = 1; i < array.length; i++) {
        let x = array[i];
        let j = i - 1;
        for (; j >= 0 && array[j] > x; j--) {
            array[j + 1] = array[j];
        }
        array[j + 1] = x;
    }
}