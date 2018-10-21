function AVLTree(n) {
    this.left = null;
    this.right = null;
    this.val = n;
    this.height = 1;
}

AVLTree.prototype.construct = function (array) {
    array.sort((a, b) => {
        return a - b
    });
    return arrToTree(array, 0, array.length - 1);
};

function arrToTree(array, start, end) {
    if (start > end) return null;
    let middle = start + Math.floor((end - start) / 2);
    let tree = new AVLTree(array[middle]);
    tree.left = arrToTree(array, start, middle - 1);
    tree.right = arrToTree(array, middle + 1, end);
    tree.height = Math.max(height(tree.left), height(tree.right)) + 1;
    return tree;
}

AVLTree.prototype.insert = function (n) {
    if (n === this.val) return;
    if (n < this.val) {
        if (this.left === null) {
            this.left = new AVLTree(n);
        } else {
            this.left.insert(n);
        }
    } else {
        if (this.right === null) {
            this.right = new AVLTree(n);
        } else {
            this.right.insert(n);
        }
    }
    let lh = height(this.left);
    let rh = height(this.right);
    this.height = Math.max(lh, rh) + 1;
    let balance = lh - rh;
    if (balance > 1 && n < this.left.val) {
        this._rotateRight();
    }
    if (balance < -1 && n > this.right.val) {
        this._rotateLeft();
    }
    if (balance > 1 && n > this.left.val) {
        this.left = this.left._rotateLeft();
        this._rotateRight();
    }
    if (balance < -1 && n < this.right.val) {
        this.right = this.right._rotateRight();
        this._rotateLeft();
    }
};

function height(x) {
    if (x === null) {
        return 0;
    }
    return x.height;
}

AVLTree.prototype._rotateRight = function () {
    let x = this.left;
    let t = this.right;
    x.right = this;
    this.left = t;
    this.height = Math.max(height(this.left), height(this.right)) + 1;
    x.height = Math.max(height(x.left), height(x.right)) + 1;
    return x;
};

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

AVLTree.prototype.extractMin = function () {
    let min = this._minValueNode().val;
    console.log(this._minValueNode());
    this._remove(min);
    return min;
};

AVLTree.prototype._remove = function (n) {
    if (this.left !== null) {
        return this.left._remove();
    }
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
    let l = this.left === null ? "null" : this.left._toString(1);
    let r = this.right === null ? "null" : this.right._toString(1);
    return "Value: " + this.val + "\n" + "Left:\n" + l + "Right:\n" + r + "\n";
};

AVLTree.prototype._toString = function (indent) {
    let str = "";
    for (let i = 0; i < indent; i++) str += "   ";
    let l = this.left === null ? str + "    null" : this.left._toString(indent + 1);
    let r = this.right === null ? str + "    null" : this.right._toString(indent + 1);
    return str + "Value: " + this.val + "\n" + str + "Left:\n" + l + "\n" + str + "Right:\n" + r + "\n";
};