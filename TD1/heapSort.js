function heapSort(array) {
    for (let i = array.length/2; i >= 1;i--) {
        sift(array,i,array.length);
    }
    for (let i = array.length; i >=2; i--) {
        swap(array[i], array[1]);
        sift(array,1,i-1);
    }
}