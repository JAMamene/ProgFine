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

MinHeap_Immut_Tree.prototype.insertLastNode = function (val) {
    let path = ((this.nbNode + 1) >>> 0).toString(2);
    console.log(path);
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

MinHeap_Immut_Tree.prototype.popLastNodeAsRoot = function (left, right) {
    let path = ((this.nbNode) >>> 0).toString(2);
    console.log(path);
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

MinHeap_Immut_Tree.prototype.insert = function (val) {
    let node;
    if (this.nbNode === 0) {
        node = new MinHeap_Node(val);
        this.root = node;
    }
    else {
        let res = this.insertLastNode(val);
        node = res[1];
        let stack = res[0];
        this.bubbleUp(stack, node);
    }
    this.nbNode++;
};

MinHeap_Immut_Tree.prototype.extractMin = function () {
    let min = this.root.val;

    if (this.nbNode === 1) {
        this.root = null;
    }
    else {
        this.popLastNodeAsRoot();
        this.bubbleDown();
    }

    this.nbNode--;
    return min;
};

MinHeap_Immut_Tree.prototype.bubbleUp = function (stack, node) {
    while (true) {
        let stackCopy = stack.slice();
        let parent = stack.pop();
        if (parent == null) {
            console.log("NULL");
            return;
        }
        if (parent.val > node.val) {
            console.log("SWAP");
            this.moveUp(stackCopy, node);
        }
    }
};

MinHeap_Immut_Tree.prototype.bubbleDown = function () {
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

        node = this.swapDown(old, node, toSwap);
        old = toSwap;
    }
    // while (true) {
    //     let child = (index + 1) * 2;
    //     let sibling = child - 1;
    //     let toSwap = null;
    //
    //     if (this.data[index] > this.data[child]) {
    //         toSwap = child;
    //     }
    //
    //     if (this.data[index] > this.data[sibling] && (this.data[child] == null || (this.data[child] !== null && this.data[sibling] < this.data[child]))) {
    //         toSwap = sibling;
    //     }
    //
    //     if (toSwap == null) {
    //         break;
    //     }
    //
    //     this.swap(toSwap, index);
    //
    //     index = toSwap;
    // }
};

//TODO
// MinHeap.prototype.heapify = function (array) {
//     this.data = array;
//     let piv = Math.floor(this.data.length / 2) - 1;
//     for (let i = piv; i >= 0; i--) {
//         this.bubbleDown(i);
//     }
// };

MinHeap_Immut_Tree.prototype.moveUp = function (stack, node) {

    let parent = stack.pop();
    let gp = stack.pop();

    if (parent == null) {
        return;
    }

    let nParent = new MinHeap_Node(parent.val);
    nParent.left = node.left;
    nParent.right = node.right;

    if (parent.left === node) {
        node.left = nParent;
        node.right = parent.right;
    }
    else {
        node.left = parent.left;
        node.right = nParent;
    }

    if (gp != null) {
        if (gp.left = parent) {
            gp.left = node;
        }
        else {
            gp.right = node;
        }
    }
    else {
        this.root = node;
    }
};

MinHeap_Immut_Tree.prototype.swapDown = function (gp, parent, node) {
    let nParent = new MinHeap_Node(parent.val);
    nParent.left = node.left;
    nParent.right = node.right;

    if (parent.left === node) {
        node.left = nParent;
        node.right = parent.right;
    }
    else {
        node.left = parent.left;
        node.right = nParent;
    }

    if (gp != null) {
        if (gp.left = parent) {
            gp.left = node;
        }
        else {
            gp.right = node;
        }
    }
    else {
        this.root = node;
    }
    return node;
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

let heap = new MinHeap_Immut_Tree();
heap.insert(2);
heap.insert(3);
heap.insert(4);
console.log(heap.toString());
heap.insert(1);
console.log(heap.toString());
console.log(heap.extractMin());
console.log(heap.toString());
console.log(heap.extractMin());
console.log(heap.toString());
console.log(heap.extractMin());
console.log(heap.toString());
console.log(heap.extractMin());
console.log(heap.toString());


// bench
// heapify
// Suppression (sans compter ajout)
// Ajout + Suppression (avec éventuellement opti tas)