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
    console.log(array);
}

function heapify(array, count) {
    let start = iParent(count - 1);
    while (start >= 0) {
        siftDown(array, start, count - 1);
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
        if (swapper === root) {
            return;
        }
        else {
            swap(array, root, swapper);
            root = swapper;
        }
    }
}

let tab = [5, 2, 3, 4, 1];
heapSort(tab);
console.assert(tab.equals([1, 2, 3, 4, 5]), "heapSort Error", tab);