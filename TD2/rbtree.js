/// RBTREE

function RBTree() {
    this._root      = null;
    this._ancestors = [];
}

RBTree.prototype._findNode = function(value, saveAncestors) {
    if ( saveAncestors == null ) saveAncestors = false;

    let result = this._root;

    if ( saveAncestors ) {
        this._ancestors = [];
    }
    
    while ( result != null ) {
        if ( value !== result._value ) {
            if ( saveAncestors ) {
                this._ancestors.push(result);
            }
            if ( value < result._value ) {
                result = result._left;
            } else {
                result = result._right;
            }
        } else {
            break;
        }
    }

    return result;
};


RBTree.prototype._maxNode = function(node, saveAncestors) {
    if ( node == null ) node = this._root;
    if ( saveAncestors == null ) saveAncestors = false;

    if ( node != null ) {
        while ( node._right != null ) {
            if ( saveAncestors ) {
                this._ancestors.push(node);
            }
            node = node._right;
        }
    }

    return node;
};

RBTree.prototype._minNode = function(node, saveAncestors) {
    if ( node == null ) node = this._root;
    if ( saveAncestors == null ) saveAncestors = false;

    if ( node != null ) {
        while ( node._left != null ) {
            if ( saveAncestors ) {
                this._ancestors.push(node);
            }
            node = node._left;
        }
    }

    return node;
};

RBTree.prototype._nextNode = function(node) {
    if ( node != null ) {
        if ( node._right != null ) {
            this._ancestors.push(node);
            node = this._minNode(node._right, true);
        } else {
            let ancestors = this._ancestors;
            let parent = ancestors.pop();
            
            while ( parent != null && parent._right === node ) {
                node = parent;
                parent = ancestors.pop();
            }

            node = parent;
        }
    } else {
        this._ancestors = [];
        node = this._minNode(this._root, true);
    }

    return node;
};

RBTree.prototype._previousNode = function(node) {
    if ( node != null ) {
        if ( node._left != null ) {
            this._ancestors.push(node);
            node = this._maxNode(node._left, true);
        } else {
            let ancestors = this._ancestors;
            let parent = ancestors.pop();
            
            while ( parent != null && parent._left === node ) {
                node = parent;
                parent = ancestors.pop();
            }

            node = parent;
        }
    } else {
        this._ancestors = [];
        node = this._maxNode(this._root, true);
    }

    return node;
};

RBTree.prototype.add = function(value) {
    let result;
    
    if ( this._root == null ) {
        result = this._root = new RBNode(value);
    } else {
        let addResult = this._root.add(value);

        this._root = addResult[0];
        result = addResult[1];
    }

    return result;
};

RBTree.prototype.find = function(value) {
    let node = this._findNode(value);
    
    return ( node != null ) ? node._value : null;
};

RBTree.prototype.findNext = function(value) {
    let current = this._findNode(value, true);

    current = this._nextNode(current);

    return (current != null ) ? current._value : null;
};

RBTree.prototype.findPrevious = function(value) {
    let current = this._findNode(value, true);

    current = this._previousNode(current);

    return (current != null ) ? current._value : null;
};

RBTree.prototype.max = function() {
    let result = this._maxNode();

    return ( result != null ) ? result._value : null;
};

RBTree.prototype.min = function() {
    let result = this._minNode();

    return ( result != null ) ? result._value : null;
};

RBTree.prototype.remove = function(value) {
    let result;

    if ( this._root != null ) {
        let remResult = this._root.remove(value);

        this._root = remResult[0];
        result = remResult[1];
    } else {
        result = null;
    }

    return result;
};

RBTree.prototype.traverse = function(func) {
    if ( this._root != null ) {
        this._root.traverse(func);
    }
};

RBTree.prototype.toString = function() {
    let lines = [];

    if ( this._root != null ) {
        let indentText = "  ";
        let stack = [[this._root, 0, "^"]];

        while ( stack.length > 0 ) {
            let current = stack.pop();
            let node    = current[0];
            let indent  = current[1];
            let line    = "";

            for ( let i = 0; i < indent; i++ ) {
                line += indentText;
            }

            line += current[2] + "(" + node.toString() + ")";
            lines.push(line);

            if ( node._right != null ) stack.push([node._right, indent+1, "R"]);
            if ( node._left  != null ) stack.push([node._left,  indent+1, "L"]);
        }
    }

    return lines.join("\n");
};

////// NODE

function RBNode(value) {
    this._left   = null;
    this._right  = null;
    this._value  = value;
    this._height = 1;
}

RBNode.prototype.add = function(value) {
    let addResult;
    let result;
    let newNode;

    if ( value !== this.value ) {
        if ( value < this._value ) {
            if ( this._left != null ) {
                addResult = this._left.add(value);
                this._left = addResult[0];
                newNode = addResult[1];
            } else {
                newNode = this._left = new RBNode(value);
            }
        } else if ( value > this._value ) {
            if ( this._right != null ) {
                addResult = this._right.add(value);
                this._right = addResult[0];
                newNode = addResult[1];
            } else {
                newNode = this._right = new RBNode(value);
            }
        }
        result = [this.balanceTree(), newNode];
    } else {
        result = [this, this];
    }

    return result;
};

RBNode.prototype.balanceTree = function() {
    let leftHeight = (this._left != null) ? this._left._height : 0;
    let rightHeight = (this._right != null) ? this._right._height : 0;
    let result;

    if (leftHeight > rightHeight + 1) {
        result = this.swingRight();
    } else if (rightHeight > leftHeight + 1) {
        result = this.swingLeft();
    } else {
        this.setHeight();
        result = this;
    }

    return result;
};

RBNode.prototype.join = function(that) {
    let result;

    if ( that == null ) {
        result = this;
    } else {
        let top;

        if ( this._height > that._height ) {
            top = this;
            top._right = that.join(top._right);
        } else {
            top = that;
            top._left = this.join(top._left);
        }

        result = top.balanceTree();
    }

    return result;
};

RBNode.prototype.moveLeft = function() {
    let right = this._right;
    this._right = right._left;
    right._left = this;
    this.setHeight();
    right.setHeight();

    return right;
};

RBNode.prototype.moveRight = function() {
    let left = this._left;
    this._left = left._right;
    left._right = this;
    this.setHeight();
    left.setHeight();

    return left;
};

RBNode.prototype.remove = function(value) {
    let remResult;
    let result;
    let remNode;

    if ( value !== this._value ) {
        if ( value < this._value ) {
            if ( this._left != null ) {
                remResult = this._left.remove(value);
                this._left = remResult[0];
                remNode = remResult[1];
            } else {
                remNode = null;
            }
        } else {
            if ( this._right != null ) {
                remResult = this._right.remove(value);
                this._right = remResult[0];
                remNode = remResult[1];
            } else {
                remNode = null;
            }
        }

        result = this;
    } else {
        remNode = this;

        if ( this._left == null ) {
            result = this._right;
        } else if ( this._right == null ) {
            result = this._left;
        } else {
            result = this._left.join(this._right);
            this._left = null;
            this._right = null;
        }
    }

    if ( remNode != null ) {
        if ( result != null ) {
            return [result.balanceTree(), remNode];
        } else {
            return [result, remNode];
        }
    } else {
        return [this, null];
    }
};

RBNode.prototype.setHeight = function() {
    let leftHeight  = (this._left  != null) ? this._left._height  : 0;
    let rightHeight = (this._right != null) ? this._right._height : 0;

    this._height = (leftHeight < rightHeight) ? rightHeight + 1 : leftHeight + 1;
};

RBNode.prototype.swingLeft = function() {
    let right      = this._right;
    let rightLeft  = right._left;
    let rightRight = right._right;
    let rightLeftHeight  = (rightLeft  != null ) ? rightLeft._height  : 0;
    let rightRightHeight = (rightRight != null ) ? rightRight._height : 0;

    if ( rightLeftHeight > rightRightHeight ) {
        this._right = right.moveRight();
    }

    return this.moveLeft();
};

RBNode.prototype.swingRight = function() {
    let left      = this._left;
    let leftRight = left._right;
    let leftLeft  = left._left;
    let leftRightHeight = (leftRight != null ) ? leftRight._height : 0;
    let leftLeftHeight  = (leftLeft  != null ) ? leftLeft._height  : 0;

    if ( leftRightHeight > leftLeftHeight ) {
        this._left = left.moveLeft();
    }

    return this.moveRight();
};

RBNode.prototype.traverse = function(func) {
    if ( this._left  != null ) this._left.traverse(func);
    func(this);
    if ( this._right != null ) this._right.traverse(func);
};

RBNode.prototype.toString = function() {
    return this._value.toString();
};

////////////////::

let rbtree = new RBTree();
rbtree.add(13);
rbtree.add(8);
rbtree.add(17);
rbtree.add(1);
rbtree.add(11);
rbtree.add(15);
rbtree.add(25);
rbtree.add(6);
rbtree.add(22);
rbtree.add(27);
console.log(rbtree.toString());
// console.log(rbtree.min());
// console.log(rbtree.max());