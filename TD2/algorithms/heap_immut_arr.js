////////
// Immutable MinHeap with Array
///////

function MinHeap_Immut_Arr(data) {
    if (data === undefined) {
        this.data = [];
    }
    else this.data = data;
}

MinHeap_Immut_Arr.prototype.insert = function (val) {
    let newHeap = new MinHeap_Immut_Arr([...this.data, val]);
    newHeap._percolateUp(newHeap.data.length - 1);
    return newHeap
};

MinHeap_Immut_Arr.prototype.extractMin = function () {
    const min = this.data[0];
    let newHeap = new MinHeap_Immut_Arr([this.data[this.data.length - 1], ...this.data.slice(1, this.data.length - 1)]);
    newHeap._percolateDown(0);
    return [newHeap, min];
};

MinHeap_Immut_Arr.prototype.construct = function (array) {
    this.data = array;
    let piv = Math.floor(this.data.length / 2) - 1;
    for (let i = piv; i >= 0; i--) {
        this._percolateDown(i);
    }
};

MinHeap_Immut_Arr.prototype.toString = function () {
    return this.data;
};

//// PRIVATE

MinHeap_Immut_Arr.prototype._percolateUp = function (index) {
    while (index > 0) {
        let parent = Math.floor((index + 1) / 2) - 1;

        if (this.data[parent] > this.data[index]) {
            this._swap(parent, index);
        }

        index = parent;
    }
};

MinHeap_Immut_Arr.prototype._percolateDown = function (index) {
    while (true) {
        let child = (index + 1) * 2;
        let sibling = child - 1;
        let toSwap = null;

        if (this.data[index] > this.data[child]) {
            toSwap = child;
        }

        if (this.data[index] > this.data[sibling] && (this.data[child] == null || (this.data[child] !== null && this.data[sibling] < this.data[child]))) {
            toSwap = sibling;
        }

        if (toSwap == null) {
            break;
        }

        this._swap(toSwap, index);

        index = toSwap;
    }
};

MinHeap_Immut_Arr.prototype._swap = function (i, j) {
    const firstItem = this.data[i];
    this.data[i] = this.data[j];
    this.data[j] = firstItem;
};


function MinHeap_Immut_Arr_Wrapper() {
    this.immutHeapArray = new MinHeap_Immut_Arr();
}

MinHeap_Immut_Arr_Wrapper.prototype.insert = function (val) {
    this.immutHeapArray = this.immutHeapArray.insert(val);
};

MinHeap_Immut_Arr_Wrapper.prototype.extractMin = function () {
    let res = this.immutHeapArray.extractMin();
    this.immutHeapArray = res[0];
    return res[1];
};

MinHeap_Immut_Arr_Wrapper.prototype.construct = function (array) {
    this.immutHeapArray.construct(array);
};

MinHeap_Immut_Arr_Wrapper.prototype.toString = function () {
    return this.immutHeapArray.toString();
};

//
// let heap = new MinHeap_Immut_Arr_Wrapper();
// heap.construct([1, 3, 4, 5, 6, 2, 9, 10]);
// console.log(heap.toString());
// console.log(heap.extractMin());
// console.log(heap.toString());
// console.log(heap.extractMin());
// console.log(heap.toString());
// console.log(heap.extractMin());
// console.log(heap.toString());
// console.log(heap.extractMin());
// console.log(heap.toString());
