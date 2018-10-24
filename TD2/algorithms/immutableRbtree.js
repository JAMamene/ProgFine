function copyRBNode(node) {
    let tmp = new Node(node.data);
    tmp.red = node.red;
    tmp.left = node.left;
    tmp.right = node.right;
    return tmp;
}

function ImmutableRBTree() {
    this._root = null;
}

function rb_immut_rotate_left(node) {
    let child = copyRBNode(node.right);
    let childLeft = child.left;
    child.left = node;
    node.right = childLeft;
    return child;
}

function rb_immut_rotate_right(node) {
    let child = copyRBNode(node.left);
    let childRight = child.right;
    child.right = node;
    node.left = childRight;
    return child;
}

function swapColors(node, other) {
    let tmp = node.red;
    node.red = other.red;
    other.red = tmp;
}

function is_red(node) {
    return node !== null && node.red;
}

ImmutableRBTree.prototype.insert = function (val) {
    this._root = _insert(this._root, val);
    this._root.red = false;
};

function _insert(node, data) {
    if (node === null) {
        return new Node(data);
    }
    node = copyRBNode(node);
    if (data < node.data) {
        node.left = _insert(node.left, data);
    } else if (data > node.data) {
        node.right = _insert(node.right, data);
    } else {
        return node;
    }
    if (is_red(node.right) && !is_red(node.left)) {
        node = rb_immut_rotate_left(node);
        node.left = copyRBNode(node.left);
        swapColors(node, node.left);
    }
    if (is_red(node.left) && is_red(node.left.left)) {
        node = rb_immut_rotate_right(node);
        node.right = copyRBNode(node.right);
        swapColors(node, node.right);
    }
    if (is_red(node.left) && is_red(node.right)) {
        node.red = !node.red;
        node.left = copyRBNode(node.left);
        node.right = copyRBNode(node.right);
        node.left.red = false;
        node.right.red = false;
    }
    return node;
}

function flipColors(node) {
    node.red = !node.red;
    if (node.left !== null) {
        node.left = copyRBNode(node.left);
        node.left.red = !node.left.red;
    }
    if (node.right !== null) {
        node.right = copyRBNode(node.right);
        node.right.red = !node.right.red;
    }
}

function balance(node) {
    if (is_red(node.right)) {
        node = rb_immut_rotate_left(node);
    }
    if (is_red(node.left) && is_red(node.left.left)) {
        node = rb_immut_rotate_right(node);
    }
    if (is_red(node.left) && is_red(node.right)) {
        flipColors(node);
    }
    return node;
}

function moveRedLeft(node) {
    flipColors(node);
    if (node.right !== null && is_red(node.right.left)) {
        node.right = rb_immut_rotate_right(node.right);
        node = rb_immut_rotate_left(node);
        flipColors(node);
    }
    return node;
}

// // Assuming that h is red and both h.right and h.right.left
//     // are black, make h.right or one of its children red.
//     private Node moveRedRight(Node h) {
//         flipColors(h);
//         if (isRed(h.left.left)) {
//             h = rotateRight(h);
//             flipColors(h);
//         }
//         return h;
//     }
function moveRedRight(node) {
    flipColors(node);
    if (is_red(node.left.left)) {
        node = rb_immut_rotate_right(node);
        flipColors(node);
    }
    return node;
}

function deleteMin(node) {
    if (node.left === null) {
        return null;
    }
    node = copyRBNode(node);
    if (!is_red(node.left) && !is_red(node.left.left)) {
        node = moveRedLeft(node);
    }
    node.left = deleteMin(node.left);
    return balance(node);
}

ImmutableRBTree.prototype.extractMin = function () {
    function findMin(node) {
        if (node.left === null) {
            return node;
        } else {
            return findMin(node.left);
        }
    }

    let minNode = findMin(this._root);
    let min = minNode.data;
    this._root = deleteMin(this._root);
    return min;
};


ImmutableRBTree.prototype.remove = function (val) {

    function minNode(node) {
        if (node.left === null) {
            return node;
        } else return minNode(node.left);
    }

    // // delete the key-value pair with the given key rooted at h
//     private Node delete(Node h, Key key) {
//         if (key.compareTo(h.key) < 0)  {
//             if (!isRed(h.left) && !isRed(h.left.left))
//                 h = moveRedLeft(h);
//             h.left = delete(h.left, key);
//         }
//         else {
//             if (isRed(h.left))
//                 h = rotateRight(h);
//             if (key.compareTo(h.key) == 0 && (h.right == null))
//                 return null;
//             if (!isRed(h.right) && !isRed(h.right.left))
//                 h = moveRedRight(h);
//             if (key.compareTo(h.key) == 0) {
//                 Node x = min(h.right);
//                 h.key = x.key;
//                 h.val = x.val;
//                 // h.val = get(h.right, min(h.right).key);
//                 // h.key = min(h.right).key;
//                 h.right = deleteMin(h.right);
//             }
//             else h.right = delete(h.right, key);
//         }
//         return balance(h);
//     }
    function _remove(node, val) {
        if (val < node.data) {
            if (!is_red(node.left) && !is_red(node.left.left)) {
                node = moveRedLeft(node);
            }
            node.left = _remove(node.left, val);
        } else {
            if (is_red(node.left)) {
                node = rb_immut_rotate_right(node);
            }
            if (node.data === val && node.right === null) {
                return null;
            }
            if (!is_red(node.right) && is_red(node.right.left)) {
                node = moveRedRight(node);
            }
            if (node.data === val) {
                let x = minNode(node.right);
                node.data = x.data;
                node.right = deleteMin(node.right);
            } else {
                node.right = _remove(node.right, val);
            }
        }
    }

    if (this._root === null) {
        // empty tree
        return;
    }
    this._root = _remove(this._root, val);
};

ImmutableRBTree.prototype.toString = function () {
    let lines = [];
    if (this._root != null) {
        let indentText = "  ";
        let stack = [[this._root, 0, "^"]];
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

            if (node.get_child(true) != null) stack.push([node.get_child(true), indent + 1, "R"]);
            if (node.get_child(false) != null) stack.push([node.get_child(false), indent + 1, "L"]);
        }
    }
    return lines.join("\n");
};

ImmutableRBTree.prototype.construct = RBTree.prototype.construct;
ImmutableRBTree.prototype.find = RBTree.prototype.find;

// let tree = new ImmutableRBTree();
// let arr = [22, 11, 18, 8, 26, 3, 7];
// tree.construct(arr);
// console.log(tree.toString());
// for (let i of arr) {
//     console.log(i);
//     tree.remove(i);
//     console.log(tree.toString());
// }

