function ImmutableTree(n) {
    this.left = null;
    this.right = null;
    this.val = n;
    this.height = 1;
}

function createFromNode(node) {
    if (node === null) {
        return null;
    }
    let tmp = new ImmutableTree(node.val);
    tmp.left = node.left;
    tmp.right = node.right;
    tmp.height = node.height;
    return tmp;
}

ImmutableTree.prototype.construct = function (array) {
    array.sort((a, b) => {
        return a - b;
    });
    console.log(array);
    return arrToImmutableTree(array, 0, array.length - 1);
};

function arrToImmutableTree(array, start, end) {
    if (start > end) return null;
    let middle = start + Math.floor((end - start) / 2);
    let tree = new ImmutableTree(array[middle]);
    tree.left = arrToImmutableTree(array, start, middle - 1);
    tree.right = arrToImmutableTree(array, middle + 1, end);
    tree.height = Math.max(height(tree.left), height(tree.right)) + 1;
    return tree;
}

ImmutableTree.prototype.insert = function (n) {
    if (n === this.val) return this;
    let ret = createFromNode(this);
    if (n < this.val) {
        if (this.left === null) {
            ret.left = new ImmutableTree(n);
        } else {
            ret.left.insert(n);
        }
    } else {
        if (this.right === null) {
            ret.right = new ImmutableTree(n);
        } else {
            ret.right.insert(n);
        }
    }
    let lh = height(this.left);
    let rh = height(this.right);
    ret.height = Math.max(lh, rh) + 1;
    let balance = lh - rh;
    if (balance > 1 && n < ret.left.val) {
        ret._rotateRight();
    }
    if (balance < -1 && n > ret.right.val) {
        ret._rotateLeft();
    }
    if (balance > 1 && n > ret.left.val) {
        ret.left = ret.left._rotateLeft();
        ret._rotateRight();
    }
    if (balance < -1 && n < ret.right.val) {
        ret.right = ret.right._rotateRight();
        ret._rotateLeft();
    }
    return ret;
};

// Rotation droite :
//            y                            x
//           / \          ----->         /   \
//         x    y.right            x.left     y
//        / \                                / \
//  x.left   t                              t   y.right
ImmutableTree.prototype._rotateRight = function () {
    let x = createFromNode(this.left);
    let t = this.right;
    x.right = this;
    this.left = t;
    this.height = Math.max(height(this.left), height(this.right)) + 1;
    x.height = Math.max(height(x.left), height(x.right)) + 1;
    return x;
};

// Rotation gauche :
//         x                                y
//        / \           ----->            /   \
//  x.left   y                          x    y.right
//          / \                        / \
//         t   y.right           x.left   t
ImmutableTree.prototype._rotateLeft = function () {
    // noinspection JSSuspiciousNameCombination
    let y = createFromNode(this.right);
    let t = y.left;
    y.left = this;
    this.right = t;
    this.height = Math.max(height(this.left), height(this.right)) + 1;
    y.height = Math.max(height(y.left), height(y.right)) + 1;
    // noinspection JSSuspiciousNameCombination
    return y;
};

ImmutableTree.prototype._remove = function (n) {
    let ret = createFromNode(this);
    if (n < this.val) {
        ret.left = createFromNode(this.left)._remove(n);
    } else if (n > this.val) {
        ret.right = createFromNode(this.right)._remove(n);
    } else {
        if (this.left === null && this.right === null) {
            return null;
        }
        if (this.left === null || this.right === null) {
            let tmp;
            if (this.left !== null) {
                tmp = this.left;
            } else {
                tmp = this.right;
            }
            ret.left = tmp.left;
            ret.right = tmp.right;
            ret.val = tmp.val;
            ret.height = tmp.height;
        } else {
            let tmp = this.right._minValueNode();
            ret.left = tmp.left;
            ret.right = tmp.right;
            ret.val = tmp.val;
            ret.height = tmp.height;
            ret.right = ret.right._remove(n);
        }
    }
    ret.height = Math.max(height(this.left), height(this.right)) + 1;
    let balance = getBalance(this);
    if (balance > 1 && getBalance(this.left) >= 0) {
        return ret._rotateRight();
    } else if (balance > 1) {
        ret.left = ret.left._rotateLeft();
        return ret._rotateRight();
    }
    if (balance < -1 && getBalance(this.right) <= 0) {
        return ret._rotateLeft();
    } else if (balance < -1) {
        ret.right = ret.right._rotateRight();
        return ret._rotateLeft();
    }
    return ret;
};

ImmutableTree.prototype._minValueNode = function () {
    let tmp = this;
    while (tmp.left !== null) {
        tmp = tmp.left;
    }
    return tmp;
};

ImmutableTree.prototype.toString = function () {
    let l = this.left === null ? "null" : this.left._toString(1);
    let r = this.right === null ? "null" : this.right._toString(1);
    return "Value: " + this.val + "\n" + "Left:\n" + l + "Right:\n" + r + "\n";
};

ImmutableTree.prototype._toString = function (indent) {
    let str = "";
    for (let i = 0; i < indent; i++) str += "   ";
    let l = this.left === null ? str + "    null" : this.left._toString(indent + 1);
    let r = this.right === null ? str + "    null" : this.right._toString(indent + 1);
    return str + "Value: " + this.val + "\n" + str + "Left:\n" + l + "\n" + str + "Right:\n" + r + "\n";
};

function ImmutableTreeWrapper() {
    this.tree = null;
}

ImmutableTreeWrapper.prototype.insert = function (val) {
    this.tree = this.tree.insert(val);
};

ImmutableTreeWrapper.prototype.extractMin = function () {
    let min = this._minValueNode().val;
    this.tree = this._remove(min);
    return min;
};

ImmutableTreeWrapper.prototype.construct = function (array) {
    this.tree = ImmutableTree.construct(array);
};

ImmutableTreeWrapper.prototype.toString = function () {
    return this.tree.toString();
};


// let tree = new ImmutableTree(7);
// tree = tree.insert(4);
// tree = tree.insert(979);
// tree = tree.insert(9);
// tree = tree.insert(7);
// tree = tree.insert(74);
// tree = tree.insert(1);
// tree = tree.insert(3);
// console.log(tree);
// console.log(tree.toString());
// tree = tree._remove(1);
// tree = tree._remove(4);
// tree = tree._remove(74);
// tree = tree._remove(9);
// console.log(tree.toString());