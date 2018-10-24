function ImmutableTree() {
    this.left = null;
    this.right = null;
    this.val = null;
    this.height = 0;
}

function createFromNode(node) {
    if (node === null) {
        return null;
    }
    let tmp = new ImmutableTree();
    tmp.left = node.left;
    tmp.right = node.right;
    tmp.height = node.height;
    tmp.val = node.val;
    return tmp;
}

ImmutableTree.prototype.construct = function (array) {
    array.sort((a, b) => {
        return a - b;
    });
    this._arrToTree(array, 0, array.length - 1);
};

ImmutableTree.prototype._arrToTree = function (array, start, end) {
    let middle = start + Math.floor((end - start) / 2);
    this.val = array[middle];
    if (start <= middle - 1) {
        this.left = new ImmutableTree();
        this.left._arrToTree(array, start, middle - 1);
    }
    if (middle + 1 <= end) {
        this.right = new ImmutableTree();
        this.right._arrToTree(array, middle + 1, end);
    }
    this.height = Math.max(height(this.left), height(this.right)) + 1;
};

ImmutableTree.prototype.insert = function (n) {
    if (this.val === null) {
        let ret = new ImmutableTree();
        ret.val = n;
        ret.height = 1;
        return ret;
    }
    let ret = createFromNode(this);
    if (n === ret.val) return ret;
    if (n < ret.val) {
        if (ret.left === null) {
            ret.left = new ImmutableTree();
        }
        ret.left = ret.left.insert(n);
    } else {
        if (ret.right === null) {
            ret.right = new ImmutableTree();
        }
        ret.right = ret.right.insert(n);
    }
    let lh = height(ret.left);
    let rh = height(ret.right);
    ret.height = Math.max(lh, rh) + 1;
    let balance = lh - rh;
    if (balance > 1 && n < ret.left.val) {
        return ret._rotateRight();
    }
    if (balance < -1 && n > ret.right.val) {
        return ret._rotateLeft();
    }
    if (balance > 1 && n > ret.left.val) {
        ret.left = ret.left._rotateLeft();
        return ret._rotateRight();
    }
    if (balance < -1 && n < ret.right.val) {
        ret.right = ret.right._rotateRight();
        return ret._rotateLeft();
    }
    return ret;
};

// Rotation droite :
//           this                          x
//           / \          ----->         /   \
//         x  this.right            x.left   this
//        / \                                / \
//  x.left   t                              t   this.right

ImmutableTree.prototype._rotateRight = function () {
    let x = createFromNode(this.left);
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
    if (n < ret.val) {
        ret.left = ret.left._remove(n);
    } else if (n > ret.val) {
        ret.right = ret.right._remove(n);
    } else {
        if (ret.left === null && ret.right === null) {
            return null;
        }
        if (ret.left === null || ret.right === null) {
            let tmp;
            if (ret.left !== null) {
                tmp = ret.left;
            } else {
                tmp = ret.right;
            }
            ret.left = tmp.left;
            ret.right = tmp.right;
            ret.val = tmp.val;
            ret.height = tmp.height;
        } else {
            let tmp = ret.right._minValueNode();
            ret.left = tmp.left;
            ret.right = tmp.right;
            ret.val = tmp.val;
            ret.height = tmp.height;
            ret.right = ret.right._remove(n);
        }
    }
    ret.height = Math.max(height(ret.left), height(ret.right)) + 1;
    let balance = getBalance(ret);
    if (balance > 1 && getBalance(ret.left) >= 0) {
        return ret._rotateRight();
    } else if (balance > 1) {
        ret.left = ret.left._rotateLeft();
        return ret._rotateRight();
    }
    if (balance < -1 && getBalance(ret.right) <= 0) {
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

// noinspection JSUnusedGlobalSymbols
ImmutableTree.prototype.toString = AVLTree.prototype.toString;

function ImmutableTreeWrapper() {
    // noinspection JSUnusedGlobalSymbols
    this.tree = new ImmutableTree();
}

ImmutableTreeWrapper.prototype.remove = AVLTreeWrapper.prototype.delete;

ImmutableTreeWrapper.prototype.find = AVLTreeWrapper.prototype.find;

ImmutableTreeWrapper.prototype.insert = AVLTreeWrapper.prototype.insert;

ImmutableTreeWrapper.prototype.extractMin = AVLTreeWrapper.prototype.extractMin;

// noinspection JSUnusedGlobalSymbols
ImmutableTreeWrapper.prototype.construct = AVLTreeWrapper.prototype.construct;

// noinspection JSUnusedGlobalSymbols
ImmutableTreeWrapper.prototype.toString = AVLTreeWrapper.prototype.toString;