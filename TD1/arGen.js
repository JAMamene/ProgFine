/**
 * File with several algorithms to generate array of various size
 **/

/**
 * Generate an array with random values
 * @param size
 */
function randomGen(size) {
    return Array.from({length: size}, () => Math.floor(Math.random() * 4096));
}

/**
 * Generate an array with random values with huge numbers
 * @param size
 */
function randomGenBigNumber(size) {
    return Array.from({length: size}, () => Math.floor(Math.random() * 100000000));
}

/**
 * Generate a sorted array in ascending order
 * @param size
 */
function sortedAscend(size) {
    return Array.from({length: size}, (v, k) => k);
}

/**
 * Generate a sorted array in descending order
 * @param size
 */
function sortedDescend(size) {
    return Array.from({length: size}, (v, k) => size - k);
}

/**
 * Generate a sorted array in ascending order with an eighth of his values shuffled
 * @param size
 */
function pseudoSorted(size) {
    let arr = Array.from({length: size}, (v, k) => k);
    for (let i = 0; i < Math.floor(size / 8); i++) {
        swap(arr, Math.floor(Math.random() * (size - 1)), Math.floor((Math.random() * (size - 1))));
    }
    return arr;
}

/**
 * Generate an array with few different values
 * @param size
 */
function lottaSameValue(size) {
    return Array.from({length: size}, () => Math.floor(Math.random() * 128));
}