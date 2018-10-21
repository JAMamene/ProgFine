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

let PriorityQueues = [MinHeap, MinHeap_Immut_Arr_Wrapper, MinHeap_Immut_Tree, AVLTreeWrapper];

// Check that each PriorityqQueue implements the interface
PriorityQueues.forEach((elem) => {
    elem.prototype.implements = implements;
    console.assert(new elem().implements(IPriorityQueue));
});


// Check that each PriorityqQueue implements the interface
PriorityQueues.forEach((elem) => {
    let structure = new elem();
    structure.construct([1,3,4,5,6,2,9,10]);
    console.assert(structure.extractMin() === 1,structure.constructor.name);
    console.assert(structure.extractMin() === 2,structure.constructor.name);
    console.assert(structure.extractMin() === 3,structure.constructor.name);
    console.assert(structure.extractMin() === 4,structure.constructor.name);
    structure.insert(3);
    structure.insert(5);
    structure.insert(1);
    structure.insert(2);
    structure.insert(4);
    structure.insert(13);
    structure.insert(15);
    structure.insert(11);
    structure.insert(12);
    structure.insert(14);
    structure.insert(23);
    structure.insert(25);
    structure.insert(21);
    structure.insert(22);
    structure.insert(24);

});