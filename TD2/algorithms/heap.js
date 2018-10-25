////////
// Mutable MinHeap with Array
///////

function MinHeap() {
    this.data = [];
}

MinHeap.prototype.insert = function (val) {
    this.data.push(val);
    this._percolateUp(this.data.length - 1);
};

MinHeap.prototype.extractMin = function () {
    let min = this.data[0];

    // set first element to last element
    this.data[0] = this.data.pop();

    this._percolateDown(0);

    return min;
};

MinHeap.prototype.construct = function (array) {
    this.data = array;
    let piv = Math.floor(this.data.length / 2) - 1;
    for (let i = piv; i >= 0; i--) {
        this._percolateDown(i);
    }
};

MinHeap.prototype.toString = function () {
    return this.data;
};

///////// PRIVATE

MinHeap.prototype._percolateUp = function (index) {
    while (index > 0) {
        let parent = Math.floor((index + 1) / 2) - 1;

        if (this.data[parent] > this.data[index]) {
            this._swap(parent, index);
        }

        index = parent;
    }
};

MinHeap.prototype._percolateDown = function (index) {
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

MinHeap.prototype._swap = function (i, j) {
    let temp = this.data[i];
    this.data[i] = this.data[j];
    this.data[j] = temp;
};

MinHeap.prototype.structureName = "MinHeap";

