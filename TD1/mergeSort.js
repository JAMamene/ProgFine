function mergeSort(array) {
    if (array.length === 1) {
        return array;
    }
    return merge(mergeSort(array.slice(0, array.length / 2)), mergeSort(array.slice(array.length / 2)));
}

function merge(left, right) {
    let result = [];
    while (left.length !== 0 && right.length !== 0) {
        if (left[0] < right[0]) {
            result.push(left[0]);
            left = left.slice(1);
        } else {
            result.push(right[0]);
            right = right.slice(1);
        }
    }
    fillRest(result, left);
    fillRest(result, right);
    return result;
}

function fillRest(result, array) {
    if (array.length !== 0) {
        for (let i = 0; i < array.length; i++) {
            result.push(array[i]);
        }
    }
    return result;
}