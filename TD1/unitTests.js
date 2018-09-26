let functions = [heapSort, insertionSort, mergeSort];
let tabs = [
    [1],
    [1, 2],
    [2, 1],
    [3, 2, 4, 1, 5],
    [29, 34, 129, 475, 23],
    [1, 3, 4, 5, 3, 2, 3],
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    [2, 3, 4, 7, 6, 10, 1, 9, 8, 5]
];
let results = [
    [1],
    [1, 2],
    [1, 2],
    [1, 2, 3, 4, 5],
    [23, 29, 34, 129, 475],
    [1, 2, 3, 3, 3, 4, 5],
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
];

for (let i = 0; i < tabs.length; i++) {
    functions.forEach(function (func) {
        let tab = tabs[i].slice();
        func(tab);
        console.assert(tab.equals(results[i]), "FAIL " + func.name, tab);
    });
}