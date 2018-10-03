//https://stackoverflow.com/questions/27065824/implementing-merge-sort-in-javascript

function mergeSort(array) {
    mSort(array, 0, array.length);
}

function mSort(arr, start, end) {
    if (start >= end - 1) return;
    let mid = start + ~~((end - start) / 2);
    // after calling this
    // left half and right half are both sorted
    mSort(arr, start, mid);
    mSort(arr, mid, end);

    /**
     * Now we can do the merging
     */

        // holding merged array
        // size = end-start
        // everything here will be copied back to original array
    let cache = Array(end - start).fill(0);
    let k = mid;
    // this is O(n) to arr[start:end]
    for (let i = start, r = 0; i < mid; r++, i++) {
        while (k < end && arr[k] < arr[i]) cache[r++] = arr[k++];
        cache[r] = arr[i];
    }
    // k marks the position of the element in the right half that is bigger than all elements in the left
    // effectively it tells that we should only copy start~start+k element from cache to nums
    // because the rests are the same
    for (let i = 0; i < k - start; i++) arr[i + start] = cache[i];
}