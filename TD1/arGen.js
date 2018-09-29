function randomGen(size) {
    return Array.from({length: size}, () => Math.floor(Math.random() * 4096));
}

function randomGenBigNumber(size) {
    return Array.from({length: size}, () => Math.floor(Math.random() * 100000000));
}

function sortedAscend(size) {
    return Array.from({length: size}, (v, k) => k);
}

function sortedDescend(size) {
    return Array.from({length: size}, (v, k) => size - k);
}

function pseudoSorted(size) {
    let arr = Array.from({length: size}, (v, k) => k);
    for (let i = 0; i < Math.floor(size / 8); i++) {
        swap(arr, Math.floor(Math.random() * (size - 1)), Math.floor((Math.random() * (size - 1))));
    }
    return arr;
}

function lottaSameValue(size) {
    return Array.from({length: size}, () => Math.floor(Math.random() * 128));
}