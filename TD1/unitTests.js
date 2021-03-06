// Mandatory array to declare the different algorithms to use
let algorithms = [heapSort, insertionSort, mergeSort, apiSort,
    quickSortRandom, quickSortFirst, quickSortMedian3, quickSortMedian5,
    quickSortThreshold5, quickSortThreshold10, quickSortThreshold20, quickSortThreshold50,
    smoothSort, timSort, timSortMini];

// Arrays to sort for the unit tests
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

// Arrays sorted to compare with the generated results for the unit tests
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

// Unit testing will prompt errors in the console if any algorithm fail to sort a test array
for (let i = 0; i < tabs.length; i++) {
    algorithms.forEach(function (func) {
        let tab = tabs[i].slice();
        func(tab);
        console.assert(tab.equals(results[i]), "FAIL " + func.name, tab);
    });
}