let implements = function (interfaceObject) {
    for (let property in interfaceObject) {
        if (typeof interfaceObject[property] != "string") {
            continue;
        }
        if (this[property] == undefined || typeof this[property] != interfaceObject[property]) {
            console.error("Object " + this.constructor.name + " does not implement necessary property : " + property);
            return false;
        }
    }
    return true;
};


/**
 * Interface PriorityQueue
 */
const IPriorityQueue =
    {
        insert: "function",
        extractMin: "function",
        construct: "function",
        toString: "function",
        structureName: "string"
    };

/**
 * Interface PriorityQueue
 */

const ITree = Object.assign({
    find: "function",
    remove: "function",
}, IPriorityQueue);

let PriorityQueues = [MinHeap, MinHeap_Immut_Arr_Wrapper, MinHeap_Immut_Tree, AVLTreeWrapper, ImmutableTreeWrapper,
    RBTree, ImmutableRBTree];

// Check that each PriorityqQueue implements the interface
PriorityQueues.forEach((elem) => {
    elem.prototype.implements = implements;
    console.assert(new elem().implements(IPriorityQueue));
});

let Trees = [AVLTreeWrapper, RBTree, ImmutableRBTree, ImmutableTreeWrapper];

// Check that each Trees implements the interface
Trees.forEach((elem) => {
    elem.prototype.implements = implements;
    console.assert(new elem().implements(ITree));
});

let Structures = [PriorityQueues, Trees];

// Tests
PriorityQueues.forEach((elem) => {
    let structure = new elem();
    structure.construct([1, 3, 4, 5, 6, 2, 9]);
    console.assert(structure.extractMin() === 1, structure.constructor.name, "\n" + structure.toString());
    console.assert(structure.extractMin() === 2, structure.constructor.name, "\n" + structure.toString());
    console.assert(structure.extractMin() === 3, structure.constructor.name, "\n" + structure.toString());
    console.assert(structure.extractMin() === 4, structure.constructor.name, "\n" + structure.toString());
    console.assert(structure.extractMin() === 5, structure.constructor.name, "\n" + structure.toString());
    console.assert(structure.extractMin() === 6, structure.constructor.name, "\n" + structure.toString());
    console.assert(structure.extractMin() === 9, structure.constructor.name, "\n" + structure.toString());
    structure = new elem();
    let n = 31;
    let arr = shuffledArr(n);
    for (let i = 0; i < n; i++) {
        structure.insert(arr[i]);
    }
    for (let i = 0; i < n; i++) {
        console.assert(structure.extractMin() === i, structure.constructor.name, "\n" + structure.toString());
    }
});

TreeTest(AVLTreeWrapper, checkAVLNode, "tree");
TreeTest(ImmutableTreeWrapper, checkAVLNode, "tree");
TreeTest(RBTree, checkRbNode, "_root");
TreeTest(ImmutableRBTree, checkRbNode, "_root");

function TreeTest(structure, checker, rootName) {
    let wrapper = new structure();
    let n = 100;
    let arr = shuffle(n);
    wrapper.construct(arr);
    checker(wrapper[rootName]);
    wrapper = new structure();
    for (let i = 0; i < n; i++) {
        wrapper.insert(arr[i]);
    }
    checker(wrapper[rootName]);
}

function checkAVLNode(node) {
    if (node.left !== null) {
        console.assert(node.left.val < node.val);
        checkAVLNode(node.left);
    }
    if (node.right !== null) {
        console.assert(node.right.val > node.val);
        checkAVLNode(node.right);
    }
    if (node.left == null && node.right == null) {
        console.assert(node.height === 1);
    }
    let balance = Math.abs((node.left === null ? 0 : node.left.height) -
        (node.right === null ? 0 : node.right.height));
    console.assert(balance === 0 || balance === 1);
}

function checkRbNode(node, parent) {
    if (parent === undefined) {
        console.assert(!node.red);
        let arr = [];
        buildPaths(node, arr, 0);
        let val = arr[0];
        for (let i = 0; i < arr.length; i++) {
            console.assert(val === arr[i]);
        }
    }
    if (node.left !== null) {
        console.assert(node.left.data < node.data);
        checkRbNode(node.left, this);
    }
    if (node.right !== null) {
        console.assert(node.right.data > node.data);
        checkRbNode(node.right, this);
    }
    if (parent !== undefined) {
        if (node.red = true) {
            console.assert(!parent.red);
        }
    }
}

function buildPaths(node, arr, count) {
    if (!node.red) {
        count++;
    }
    if (node.right === null && node.left === null) {
        arr.push(count);
        return;
    }
    if (node.right !== null) {
        buildPaths(node.right, arr, count);
    }
    if (node.left !== null) {
        buildPaths(node.left, arr, count);
    }
}
