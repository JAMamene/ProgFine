//////////
// NODE
/////////
function MinHeap_Node(val) {
    this.val = val;
    this.left = null;
    this.right = null;

}

MinHeap_Node.prototype.toString = function () {
    return this.val;
};


//////////
// TREE
//////////

//normally the root should not be mutated to keep history of changes but since it's just for testing I didn't have to
function MinHeap_Immut_Tree() {
    this.root = null;
    this.nbNode = 0;
}

MinHeap_Immut_Tree.prototype.insert = function (val) {
    let node;
    if (this.nbNode === 0) {
        node = new MinHeap_Node(val);
        this.root = node;
    }
    else {
        let res = this._insertLastNode(val);
        this._percolateUp(res[0], res[1], res[2]);
    }
    this.nbNode++;
};

MinHeap_Immut_Tree.prototype.extractMin = function () {
    let min = this.root.val;

    if (this.nbNode === 1) {
        this.root = null;
    }
    else {
        this._popLastNodeAsRoot();
        this.root = this._percolateDown(this.root);
    }

    this.nbNode--;
    return min;
};

// Bad n log n implementation
MinHeap_Immut_Tree.prototype.construct2 = function (array) {
    array.sort(function (a, b) {
        return a - b;
    });
    let queue = [];
    let cpt = 0;
    this.root = new MinHeap_Node(array[cpt++]);
    queue.push(this.root);
    while (!(queue.length === 0)) {
        let tempNode = queue.pop();

        if (cpt < array.length) {
            let tempLeft = new MinHeap_Node(array[cpt++]);
            tempNode.left = tempLeft;
            queue.unshift(tempLeft);
        }

        if (cpt < array.length) {
            let tempRight = new MinHeap_Node(array[cpt++]);
            tempNode.right = tempRight;
            queue.unshift(tempRight);
        }
    }
    this.nbNode = array.length;
};

MinHeap_Immut_Tree.prototype.construct = function (array) {
    let queue = [];
    let cpt = 0;
    this.root = new MinHeap_Node(array[cpt++]);
    queue.push(this.root);
    while (!(queue.length === 0)) {
        let tempNode = queue.pop();

        if (cpt < array.length) {
            let tempLeft = new MinHeap_Node(array[cpt++]);
            tempNode.left = tempLeft;
            queue.unshift(tempLeft);
        }

        if (cpt < array.length) {
            let tempRight = new MinHeap_Node(array[cpt++]);
            tempNode.right = tempRight;
            queue.unshift(tempRight);
        }
    }
    this.nbNode = array.length;
    let piv = Math.floor(this.nbNode / 2);
    for (let i = piv; i >= 0; i--) {
        let res = this._getToNode(i);
        if (res[0] == null) {
            this.root=this._percolateDown(this.root);
        }
        else if (res[2]) {
            res[0].left = this._percolateDown(res[1]);
        }
        else {
            res[0].right = this._percolateDown(res[1]);
        }
    }
};

MinHeap_Immut_Tree.prototype.toString = function () {
    let lines = [];

    if (this.root != null) {
        let indentText = "  ";
        let stack = [[this.root, 0, "^"]];

        while (stack.length > 0) {
            let current = stack.pop();
            let node = current[0];
            let indent = current[1];
            let line = "";

            for (let i = 0; i < indent; i++) {
                line += indentText;
            }

            line += current[2] + "(" + node.toString() + ")";
            lines.push(line);

            if (node.right != null) stack.push([node.right, indent + 1, "R"]);
            if (node.left != null) stack.push([node.left, indent + 1, "L"]);
        }
    }

    return lines.join("\n");
};


//// Private methods

MinHeap_Immut_Tree.prototype._getToNode = function (id) {
    let node = this.root;
    let parent = null;
    let isLeft;
    let path = (id >>> 0).toString(2).substring(1);
    for (let i = 0; i < path.length; i++) {
        if (path.charAt(i) === '0') {
            parent = node;
            node = node.left;
            isLeft = true;
        }
        else {
            parent = node;
            node = node.right;
            isLeft = false;
        }
    }
    return [parent, node, isLeft];
};

MinHeap_Immut_Tree.prototype._insertLastNode = function (val) {
    let path = ((this.nbNode + 1) >>> 0).toString(2).substring(1);
    let node = this.root;
    let tmp;
    let stack = [node];
    for (let i = 0; i < path.length; i++) {
        if (path.charAt(i) === '0') {
            tmp = node.left;
            if (tmp == null) {
                tmp = new MinHeap_Node(val, node);
                node.left = tmp;
                return [stack, tmp, path];
            }
        }
        else {
            tmp = node.right;
            if (tmp == null) {
                tmp = new MinHeap_Node(val, node);
                node.right = tmp;
                return [stack, tmp, path];
            }
        }
        node = tmp;
        stack.push(node);
    }
    tmp = new MinHeap_Node(val, node);
    node.left = tmp;
    return [stack, tmp, path];
};

MinHeap_Immut_Tree.prototype._popLastNodeAsRoot = function (left, right) {
    let path = ((this.nbNode) >>> 0).toString(2).substring(1);
    let node = this.root;
    let stack = [node];
    for (let i = 0; i < path.length; i++) {
        if (path.charAt(i) === '0') {
            node = node.left;
        }
        else {
            node = node.right;
        }
        stack.push(node);
    }
    stack.pop();
    let parent = stack.pop();
    if (parent.left === node) {
        parent.left = null;
    }
    else {
        parent.right = null;
    }
    let newRoot = new MinHeap_Node(node.val);
    newRoot.left = this.root.left;
    newRoot.right = this.root.right;
    this.root = newRoot;
};


MinHeap_Immut_Tree.prototype._percolateUp = function (stack, node, path) {
    while (true) {
        let parent = stack.pop();
        let bit = path.charAt(path.length - 1);
        path = path.substring(0, path.length - 1);
        if (parent == null) {
            this.root = node;
            return;
        }
        if (parent.val > node.val) {
            node = this._swapUp(parent, node, bit);
        }
        else {
            node = this._moveUp(parent, node, bit);
        }
    }
};

MinHeap_Immut_Tree.prototype._swapUp = function (parent, node, bit) {
    let nParent = new MinHeap_Node(parent.val);
    nParent.left = node.left;
    nParent.right = node.right;

    let nNode = new MinHeap_Node(node.val);

    if (bit === '0') {
        nNode.left = nParent;
        nNode.right = parent.right;
    }
    else {
        nNode.left = parent.left;
        nNode.right = nParent;
    }
    return nNode;
};

MinHeap_Immut_Tree.prototype._moveUp = function (parent, node, bit) {
    let nParent = new MinHeap_Node(parent.val);

    if (bit === '0') {
        nParent.left = node;
        nParent.right = parent.right;
    }
    else {
        nParent.left = parent.left;
        nParent.right = node;
    }
    return nParent;
};


MinHeap_Immut_Tree.prototype._percolateDown = function (node) {
    let left = node.left;
    let right = node.right;
    let toSwap = null;
    if (left != null) {
        if (node.val > left.val) {
            toSwap = left;
        }
    }
    if (right !== null) {
        if (node.val > right.val && (left == null) || (left != null && right.val < left.val && node.val > right.val)) {
            toSwap = right;
        }
    }

    if (toSwap != null) {
        let res;
        if (toSwap === left) {
            res = this._swapDown(node, left);
        }
        else {
            res = this._swapDown(node, right);
        }
        let nParent = res[0];
        let nChild = res[1];
        if (toSwap === left) {
            nParent.left = this._percolateDown(nChild);
        }
        else {
            nParent.right = this._percolateDown(nChild);
        }
        return nParent;
    }
    else {
        return node;
    }
};

MinHeap_Immut_Tree.prototype._swapDown = function (parent, node) {
    let nParent = new MinHeap_Node(parent.val);
    nParent.left = node.left;
    nParent.right = node.right;

    let nNode = new MinHeap_Node(node.val);

    if (parent.left === node) {
        nNode.left = nParent;
        nNode.right = parent.right;
    }
    else {
        nNode.left = parent.left;
        nNode.right = nParent;
    }
    return [nNode, nParent];
};

//BrokenCaseFixVerification
let minHeapImmutTree = new MinHeap_Immut_Tree();
minHeapImmutTree.insert(5);
minHeapImmutTree.insert(6);
minHeapImmutTree.insert(16);
minHeapImmutTree.insert(14);
minHeapImmutTree.insert(27);
minHeapImmutTree.insert(23);
minHeapImmutTree.insert(25);
minHeapImmutTree.insert(11);
minHeapImmutTree.insert(17);
minHeapImmutTree.insert(4);
minHeapImmutTree.insert(1);
minHeapImmutTree.insert(3);
minHeapImmutTree.insert(15);
minHeapImmutTree.insert(13);
minHeapImmutTree.insert(21);
minHeapImmutTree.insert(7);
minHeapImmutTree.insert(26);
minHeapImmutTree.insert(24);
minHeapImmutTree.extractMin();
minHeapImmutTree.extractMin();
minHeapImmutTree.extractMin();
console.assert(minHeapImmutTree.root.left.right.val === 14, minHeapImmutTree.constructor.name, "\n" + minHeapImmutTree.toString());
console.assert(minHeapImmutTree.root.left.right.right.val === 26, minHeapImmutTree.constructor.name, "\n" + minHeapImmutTree.toString());

// minHeapImmutTree.construct([10, 39, 47, 27, 46, 129, 7, 2, 4, 3, 9, 8, 1]);
