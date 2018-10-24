function AVLTree() {
    this.left = null;
    this.right = null;
    this.val = null;
    this.height = 0;
}

AVLTree.prototype.construct = function (array) {
    array.sort((a, b) => {
        return a - b;
    });
    this._arrToTree(array, 0, array.length - 1);
};

AVLTree.prototype._arrToTree = function (array, start, end) {
    let middle = start + Math.floor((end - start) / 2);
    this.val = array[middle];
    if (start <= middle - 1) {
        this.left = new AVLTree();
        this.left._arrToTree(array, start, middle - 1);
    }
    if (middle + 1 <= end) {
        this.right = new AVLTree();
        this.right._arrToTree(array, middle + 1, end);
    }
    this.height = Math.max(height(this.left), height(this.right)) + 1;
};

AVLTree.prototype.insert = function (n) {
    if (this.val === null) {
        this.val = n;
        this.height = 1;
        return this;
    }
    if (n === this.val) return this;
    if (n < this.val) {
        if (this.left === null) {
            this.left = new AVLTree();
        }
        this.left = this.left.insert(n);
    } else {
        if (this.right === null) {
            this.right = new AVLTree();
        }
        this.right = this.right.insert(n);
    }
    let lh = height(this.left);
    let rh = height(this.right);
    this.height = Math.max(lh, rh) + 1;
    let balance = lh - rh;
    if (balance > 1 && n < this.left.val) {
        return this._rotateRight();
    }
    if (balance < -1 && n > this.right.val) {
        return this._rotateLeft();
    }
    if (balance > 1 && n > this.left.val) {
        this.left = this.left._rotateLeft();
        return this._rotateRight();
    }
    if (balance < -1 && n < this.right.val) {
        this.right = this.right._rotateRight();
        return this._rotateLeft();
    }
    return this;
};

function height(x) {
    if (x === null) {
        return 0;
    }
    return x.height;
}

// Rotation droite :
//           this                          x
//           / \          ----->         /   \
//         x  this.right            x.left   this
//        / \                                / \
//  x.left   t                              t   this.right

AVLTree.prototype._rotateRight = function () {
    let x = this.left;
    let t = x.right;
    x.right = this;
    this.left = t;
    this.height = Math.max(height(this.left), height(this.right)) + 1;
    x.height = Math.max(height(x.left), height(x.right)) + 1;
    return x;
};

// Rotation gauche :
//        this                              y
//        / \           ----->            /   \
//this.left  y                          this    y.right
//          / \                        / \
//         t   y.right        this.left   t

AVLTree.prototype._rotateLeft = function () {
    // noinspection JSSuspiciousNameCombination
    let y = this.right;
    let t = y.left;
    y.left = this;
    this.right = t;
    this.height = Math.max(height(this.left), height(this.right)) + 1;
    y.height = Math.max(height(y.left), height(y.right)) + 1;
    // noinspection JSSuspiciousNameCombination
    return y;
};

AVLTree.prototype._remove = function (n) {
    if (n < this.val) {
        this.left = this.left._remove(n);
    } else if (n > this.val) {
        this.right = this.right._remove(n);
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
            this.left = tmp.left;
            this.right = tmp.right;
            this.val = tmp.val;
            this.height = tmp.height;
        } else {
            let tmp = this.right._minValueNode();
            this.left = tmp.left;
            this.right = tmp.right;
            this.val = tmp.val;
            this.height = tmp.height;
            this.right = this.right._remove(n);
        }
    }
    this.height = Math.max(height(this.left), height(this.right)) + 1;
    let balance = getBalance(this);
    if (balance > 1 && getBalance(this.left) >= 0) {
        return this._rotateRight();
    } else if (balance > 1) {
        this.left = this.left._rotateLeft();
        return this._rotateRight();
    }
    if (balance < -1 && getBalance(this.right) <= 0) {
        return this._rotateLeft();
    } else if (balance < -1) {
        this.right = this.right._rotateRight();
        return this._rotateLeft();
    }
    return this;
};

function getBalance(node) {
    if (node === null) return 0;
    return height(node.left) - height(node.right);
}

AVLTree.prototype._minValueNode = function () {
    let tmp = this;
    while (tmp.left !== null) {
        tmp = tmp.left;
    }
    return tmp;
};

AVLTree.prototype.toString = function () {
    let l = this.left === null ? "   null" : this.left._toString(1);
    let r = this.right === null ? "   null" : this.right._toString(1);
    return "Value: " + this.val + "\n" + "Height: " + this.height + "\n" +
        "Left:\n" + l + "\n" + "Right:\n" + r + "\n";
};

AVLTree.prototype._toString = function (indent) {
    let str = "";
    for (let i = 0; i < indent; i++) str += "   ";
    let l = this.left === null ? str + "    null" : this.left._toString(indent + 1);
    let r = this.right === null ? str + "    null" : this.right._toString(indent + 1);
    return str + "Value: " + this.val + "\n" + str + "Height: " + this.height + "\n"
        + str + "Left:\n" + l + "\n" + str + "Right:\n" + r + "\n";
};

AVLTreeWrapper.prototype.find = function (val) {
    function _find(node, val) {
        if (node === null) {
            return false;
        }
        if (node.val === val) {
            return true;
        } else if (val > node.val) {
            return _find(node.right, val);
        } else {
            return _find(node.left, val);
        }
    }

    return _find(tree, val);
};

AVLTreeWrapper.prototype.remove = function (val) {
    this.tree = this.tree._remove(val);
};

function AVLTreeWrapper() {
    this.tree = new AVLTree();
}

AVLTreeWrapper.prototype.insert = function (val) {
    this.tree = this.tree.insert(val);
};

AVLTreeWrapper.prototype.extractMin = function () {
    let min = this.tree._minValueNode().val;
    this.tree = this.tree._remove(min);
    return min;
};

AVLTreeWrapper.prototype.construct = function (array) {
    this.tree.construct(array);
};

AVLTreeWrapper.prototype.toString = function () {
    return this.tree.toString();
};