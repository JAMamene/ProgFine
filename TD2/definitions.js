let implements = function (interfaceObject) {
    for (let property in interfaceObject) {
        if (typeof interfaceObject[property] != "string") {
            continue;
        }
        if (this[property] == undefined || typeof this[property] != interfaceObject[property]) {
            console.error("Object + " + this.constructor.name + " does not implement necessary property : " + property);
            return false;
        }
    }
    return true;
};


/**
 * Interface PriorityQueue
 */
let IPriorityQueue =
    {
        insert: "function",
        extractMin: "function",
        construct: "function",
        toString: "function"
    };

let PriorityQueues = [MinHeap, MinHeap_Immut_Arr_Wrapper, MinHeap_Immut_Tree, AVLTreeWrapper, ImmutableTreeWrapper];

// Check that each PriorityqQueue implements the interface
PriorityQueues.forEach((elem) => {
    elem.prototype.implements = implements;
    console.assert(new elem().implements(IPriorityQueue));
});


// Check that each PriorityqQueue implements the interface
PriorityQueues.forEach((elem) => {
    let structure = new elem();
    structure.construct([1, 3, 4, 5, 6, 2, 9, 10]);
    console.assert(structure.extractMin() === 1, structure.constructor.name);
    console.assert(structure.extractMin() === 2, structure.constructor.name);
    console.assert(structure.extractMin() === 3, structure.constructor.name);
    console.assert(structure.extractMin() === 4, structure.constructor.name);
    console.assert(structure.extractMin() === 5, structure.constructor.name);
    console.assert(structure.extractMin() === 6, structure.constructor.name);
    console.assert(structure.extractMin() === 9, structure.constructor.name);
    console.assert(structure.extractMin() === 10, structure.constructor.name);
    structure = new elem();
    let n = 64;
    let arr = shuffle(n);
    for (let i = 0; i < n; i++) {
        structure.insert(arr[i]);
    }
    console.log(structure);
    for (let i = 0; i < n; i++) {
        console.assert(structure.extractMin() === i, structure.constructor.name);
    }
});