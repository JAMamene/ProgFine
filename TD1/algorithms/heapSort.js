function iParent(i) {
    return Math.floor((i - 1) / 2)
}

function iLeftChild(i) {
    return 2 * i + 1;
}

function heapSort(array) {
    heapify(array, array.length);
    let end = array.length - 1;
    while (end > 0) {
        swap(array, end, 0);
        end--;
        siftDown(array, 0, end);
    }
}

function heapify(array) {
    let start = iParent(array.length - 1);
    while (start >= 0) {
        siftDown(array, start, array.length - 1);
        start--;
    }
}

function siftDown(array, start, end) {
    let root = start;
    while (iLeftChild(root) <= end) {
        let child = iLeftChild(root);
        let swapper = root;
        if (array[swapper] < array[child]) {
            swapper = child;
        }
        if (child + 1 <= end && array[swapper] < array[child + 1]) {
            swapper = child + 1;
        }
        if (swapper === root) {
            return;
        }
        else {
            swap(array, root, swapper);
            root = swapper;
        }
    }
}