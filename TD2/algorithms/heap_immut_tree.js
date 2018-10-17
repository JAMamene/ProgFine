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
/////////
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
        node = res[1];
        let stack = res[0];
        this._percolateUp(stack, node);
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
        this._percolateDown();
    }

    this.nbNode--;
    return min;
};

MinHeap_Immut_Tree.prototype.construct = function (array) {
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

MinHeap_Immut_Tree.prototype._insertLastNode = function (val) {
    let path = ((this.nbNode + 1) >>> 0).toString(2);
    let node = this.root;
    let tmp;
    let stack = [node];
    for (let i = 1; i < path.length; i++) {
        if (path.charAt(i) === '0') {
            tmp = node.left;
            if (tmp == null) {
                tmp = new MinHeap_Node(val, node);
                node.left = tmp;
                return [stack, tmp];
            }
        }
        else {
            tmp = node.right;
            if (tmp == null) {
                tmp = new MinHeap_Node(val, node);
                node.right = tmp;
                return [stack, tmp];
            }
        }
        node = tmp;
        stack.push(node);
    }
    tmp = new MinHeap_Node(val, node);
    node.left = tmp;
    return [stack, tmp];
};

MinHeap_Immut_Tree.prototype._popLastNodeAsRoot = function (left, right) {
    let path = ((this.nbNode) >>> 0).toString(2);
    let node = this.root;
    let stack = [node];
    for (let i = 1; i < path.length; i++) {
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


MinHeap_Immut_Tree.prototype._percolateUp = function (stack, node) {
    while (true) {
        let stackCopy = stack.slice();
        let parent = stack.pop();
        if (parent == null) {
            return;
        }
        if (parent.val > node.val) {
            node = this._moveUp(stackCopy, node);
        }
    }
};

MinHeap_Immut_Tree.prototype._percolateDown = function () {
    let node = this.root;
    let old = null;
    while (true) {
        let left = node.left;
        let right = node.right;
        let toSwap = null;
        if (left != null) {
            if (node.val > left.val) {
                toSwap = left;
            }
        }
        if (right != null) {
            if (node.val > right.val && (node.left == null) || (left !== null && right.val < left.val)) {
                toSwap = right;
            }
        }

        if (toSwap == null) {
            break;
        }

        let res = this._swapDown(old, node, toSwap);
        node = res[0];
        old = res[1];
    }
};

MinHeap_Immut_Tree.prototype._moveUp = function (stack, node) {

    let parent = stack.pop();
    let gp = stack.pop();

    if (parent == null) {
        return;
    }

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

    if (gp != null) {
        if (gp.left = parent) {
            gp.left = nNode;
        }
        else {
            gp.right = nNode;
        }
    }
    else {
        this.root = nNode;
    }
    return nNode;
};

MinHeap_Immut_Tree.prototype._swapDown = function (gp, parent, node) {
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

    if (gp != null) {
        if (gp.left === parent) {
            gp.left = nNode;
        }
        else {
            gp.right = nNode;
        }
    }
    else {
        this.root = nNode;
    }
    //nParent is now child and nNode is parent
    return [nParent,nNode];
};

// let heap = new MinHeap_Immut_Tree();
// heap.insert(2);
// heap.insert(3);
// heap.insert(4);
// console.log(heap.toString());
// heap.insert(1);
// console.log(heap.toString());
// console.log(heap.extractMin());
// console.log(heap.toString());
// console.log(heap.extractMin());
// console.log(heap.toString());
// console.log(heap.extractMin());
// console.log(heap.toString());
// console.log(heap.extractMin());
// console.log(heap.toString());
// let heap = new MinHeap_Immut_Tree();
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
//
//
// bench
// heapify
// Suppression (sans compter ajout)
// Ajout + Suppression (avec éventuellement opti tas)