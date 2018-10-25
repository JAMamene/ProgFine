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
    let x = copyRBNode(node.right);
    node.right = x.left;
    x.left = node;
    x.red = x.left.red;
    x.left = copyRBNode(x.left);
    x.left.red = true;
    return x;
}

function rb_immut_rotate_right(node) {
    let x = copyRBNode(node.left);
    node.left = x.right;
    x.right = node;
    x.red = x.right.red;
    x.right = copyRBNode(x.right);
    x.right.red = true;
    return x;
}

function is_red(node) {
    return node !== null && node.red;
}

ImmutableRBTree.prototype.insert = function (val) {
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
        }
        if (is_red(node.left) && is_red(node.left.left)) {
            node = rb_immut_rotate_right(node);
        }
        if (is_red(node.left) && is_red(node.right)) {
            flipColors(node);
        }
        return node;
    }

    this._root = _insert(this._root, val);
    this._root.red = false;
};

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

    let node = copyRBNode(this._root);
    if (!is_red(node.left) && !is_red(node.right)) {
        node.red = true;
    }
    let minNode = findMin(node);
    let min = minNode.data;
    this._root = deleteMin(node);
    if (this._root !== null) {
        this._root.red = false;
    }
    return min;
};


ImmutableRBTree.prototype.remove = function (val) {

    function minNode(node) {
        if (node.left === null) {
            return node;
        } else return minNode(node.left);
    }

    function _remove(node, val) {
        node = copyRBNode(node);
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
            if (!is_red(node.right) && !is_red(node.right.left)) {
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
        return balance(node);
    }

    if (this._root === null) {
        // empty tree
        return;
    }
    let node = copyRBNode(this._root);
    if (!is_red(node.left) && !is_red(node.right)) {
        node.red = true;
    }
    this._root = _remove(node, val);
    if (this._root !== null) {
        this._root.red = false;
    }
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

ImmutableRBTree.prototype.structureName = "ImmutableRedBlackTree";


