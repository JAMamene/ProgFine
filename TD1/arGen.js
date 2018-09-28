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

function lottaSameValue(size) {
    return Array.from({length: size}, () => Math.floor(Math.random() * 128));
}