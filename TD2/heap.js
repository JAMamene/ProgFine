function MinHeap() {
    this.data = [];
}

MinHeap.prototype.insert = function (val) {
    this.data.push(val);
    this.bubbleUp(this.data.length - 1);
};

////////
// Mutable MinHeap with Array
///////

MinHeap.prototype.extractMin = function () {
    let min = this.data[0];

    // set first element to last element
    this.data[0] = this.data.pop();

    // call bubble down
    this.bubbleDown(0);

    return min;
};

MinHeap.prototype.bubbleUp = function (index) {
    while (index > 0) {
        let parent = Math.floor((index + 1) / 2) - 1;

        if (this.data[parent] > this.data[index]) {
            // swap
            this.swap(parent, index);
        }

        index = parent;
    }
};

MinHeap.prototype.bubbleDown = function (index) {
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

MinHeap.prototype.swap = function (i, j) {
    let temp = this.data[i];
    this.data[i] = this.data[j];
    this.data[j] = temp;
};




////////
// Immutable MinHeap with Array
///////

function ImmutableMinHeap() {
    this.data = [];
}

ImmutableMinHeap.prototype.insert = function (val) {
    this.data = [...this.data, val];
    console.log(this.data);
    this.bubbleUp(this.data.length - 1);
};

ImmutableMinHeap.prototype.extractMin = function () {
    const min = this.data[0];
    this.data = [this.data[this.data.length - 1], ...this.data.slice(1, this.data.length - 1)];
    this.bubbleDown(0);

    return min;
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
    const results = this.data.slice();
    const firstItem = this.data[i];
    results[i] = this.data[j];
    results[j] = firstItem;

    this.data = results;
};