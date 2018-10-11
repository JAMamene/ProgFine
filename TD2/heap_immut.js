////////
// Immutable MinHeap with Array
///////

function ImmutableMinHeap(data) {
    if (data === undefined) {
        this.data = [];
    }
    else this.data = data;
}

ImmutableMinHeap.prototype.insert = function (val) {
    let newHeap = new ImmutableMinHeap([...this.data, val]);
    newHeap.bubbleUp(newHeap.data.length - 1);
    return newHeap
};

ImmutableMinHeap.prototype.extractMin = function () {
    const min = this.data[0];
    let newHeap = new ImmutableMinHeap([this.data[this.data.length - 1], ...this.data.slice(1, this.data.length - 1)]);
    newHeap.bubbleDown(0);
    return [newHeap, min];
};

ImmutableMinHeap.prototype.bubbleUp = function (index) {
    while (index > 0) {
        let parent = Math.floor((index + 1) / 2) - 1;

        if (this.data[parent] > this.data[index]) {
            this.swap(parent, index);
        }

        index = parent;
    }
};

ImmutableMinHeap.prototype.bubbleDown = function (index) {
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

        this.swap(toSwap, index);

        index = toSwap;
    }
};

ImmutableMinHeap.prototype.swap = function (i, j) {
    const firstItem = this.data[i];
    this.data[i] = this.data[j];
    this.data[j] = firstItem;
};

// let minHeap1 = new ImmutableMinHeap();
// let minHeap2 = minHeap1.insert(1);
// let minHeap3 = minHeap2.insert(3);
// let minHeap4 = minHeap3.insert(2);
// console.log(minHeap4.extractMin());
// console.log(minHeap1);
// console.log(minHeap2);
// console.log(minHeap3);