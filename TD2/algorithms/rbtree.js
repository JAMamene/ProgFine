function Node(data) {
    this.data = data;
    this.left = null;
    this.right = null;
    this.red = true;
}

Node.prototype.get_child = function (dir) {
    return dir ? this.right : this.left;
};

Node.prototype.set_child = function (dir, val) {
    if (dir) {
        this.right = val;
    }
    else {
        this.left = val;
    }
};

Node.prototype.toString = function () {
    return this.data.toString().concat((this.red === true) ? " (R)" : " (B)");
};

function RBTree() {
    this._root = null;
    this._comparator = function (a, b) {
        return b - a;
    };
    this.size = 0;
}

// returns true if inserted, false if duplicate
RBTree.prototype.insert = function (data) {
    let ret = false;

    if (this._root === null) {
        // empty tree
        this._root = new Node(data);
        ret = true;
        this.size++;
    }
    else {
        let head = new Node(undefined); // fake tree root

        let dir = 0;
        let last = 0;

        // setup
        let gp = null; // grandparent
        let ggp = head; // grand-grand-parent
        let p = null; // parent
        let node = this._root;
        ggp.right = this._root;

        // search down
        while (true) {
            if (node === null) {
                // insert new node at the bottom
                node = new Node(data);
                p.set_child(dir, node);
                ret = true;
                this.size++;
            }
            else if (this.is_red(node.left) && this.is_red(node.right)) {
                // color flip
                node.red = true;
                node.left.red = false;
                node.right.red = false;
            }

            // fix red violation
            if (this.is_red(node) && this.is_red(p)) {
                let dir2 = ggp.right === gp;

                if (node === p.get_child(last)) {
                    ggp.set_child(dir2, this._single_rotate(gp, !last));
                }
                else {
                    ggp.set_child(dir2, this._double_rotate(gp, !last));
                }
            }

            let cmp = this._comparator(node.data, data);

            // stop if found
            if (cmp === 0) {
                break;
            }

            last = dir;
            dir = cmp < 0;

            // update helpers
            if (gp !== null) {
                ggp = gp;
            }
            gp = p;
            p = node;
            node = node.get_child(dir);
        }

        // update root
        this._root = head.right;
    }

    // make root black
    this._root.red = false;

    return ret;
};

// returns true if removed, false if not found
RBTree.prototype.remove = function (data) {
    if (this._root === null) {
        return false;
    }

    let head = new Node(undefined); // fake tree root
    let node = head;
    node.right = this._root;
    let p = null; // parent
    let gp = null; // grand parent
    let found = null; // found item
    let dir = 1;

    while (node.get_child(dir) !== null) {
        let last = dir;

        // update helpers
        gp = p;
        p = node;
        node = node.get_child(dir);

        let cmp = this._comparator(data, node.data);

        dir = cmp > 0;

        // save found node
        if (cmp === 0) {
            found = node;
        }

        // push the red node down
        if (!this.is_red(node) && !this.is_red(node.get_child(dir))) {
            if (this.is_red(node.get_child(!dir))) {
                let sr = this._single_rotate(node, dir);
                p.set_child(last, sr);
                p = sr;
            }
            else if (!this.is_red(node.get_child(!dir))) {
                let sibling = p.get_child(!last);
                if (sibling !== null) {
                    if (!this.is_red(sibling.get_child(!last)) && !this.is_red(sibling.get_child(last))) {
                        // color flip
                        p.red = false;
                        sibling.red = true;
                        node.red = true;
                    }
                    else {
                        let dir2 = gp.right === p;

                        if (this.is_red(sibling.get_child(last))) {
                            gp.set_child(dir2, this._double_rotate(p, last));
                        }
                        else if (this.is_red(sibling.get_child(!last))) {
                            gp.set_child(dir2, this._single_rotate(p, last));
                        }

                        // ensure correct coloring
                        let gpc = gp.get_child(dir2);
                        gpc.red = true;
                        node.red = true;
                        gpc.left.red = false;
                        gpc.right.red = false;
                    }
                }
            }
        }
    }

    // replace and remove if found
    if (found !== null) {
        found.data = node.data;
        p.set_child(p.right === node, node.get_child(node.left === null));
        this.size--;
    }

    // update root and make it black
    this._root = head.right;
    if (this._root !== null) {
        this._root.red = false;
    }

    return found !== null;
};

RBTree.prototype.toString = function () {
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

RBTree.prototype.is_red = function (node) {
    return node !== null && node.red;
};

RBTree.prototype._single_rotate = function (root, dir) {
    let save = root.get_child(!dir);

    root.set_child(!dir, save.get_child(dir));
    save.set_child(dir, root);

    root.red = true;
    save.red = false;

    return save;
};

RBTree.prototype._double_rotate = function (root, dir) {
    root.set_child(!dir, this._single_rotate(root.get_child(!dir), !dir));
    return this._single_rotate(root, dir);
};