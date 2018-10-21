Object.prototype.Implements = function (interfaceObject) {
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

let PriorityQueues = [MinHeap, MinHeap_Immut_Arr_Wrapper, MinHeap_Immut_Tree, AVLTree];

// Check that each PriorityqQueue implements the interface
PriorityQueues.forEach((elem) => {
    console.assert(new elem().Implements(IPriorityQueue));
});


// Check that each PriorityqQueue implements the interface
PriorityQueues.forEach((elem) => {
    let structure = new elem();
    structure.construct([1,3,4,5,6,2,9,10]);
    console.assert(structure.extractMin() === 1,structure.constructor.name);
    console.assert(structure.extractMin() === 2,structure.constructor.name);
    console.assert(structure.extractMin() === 3,structure.constructor.name);
    console.assert(structure.extractMin() === 4,structure.constructor.name);
});