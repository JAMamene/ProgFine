// https://en.wikipedia.org/wiki/Median_of_medians
// https://stackoverflow.com/questions/1790360/median-of-medians-in-java

function quickSortMedian5(array) {
    qSortMedian(array, 0, array.length - 1);
}

function qSortMedian(array, first, last) {
    if (first < last) {
        let pivot = select5(array, first, last, Math.floor((last - first) / 2)); // ???
        pivot = partition(array, first, last, pivot);
        qSortMedian(array, first, pivot - 1);
        qSortMedian(array, pivot + 1, last);
    }
}

function iSort(array, first, last) {
    for (let i = first + 1; i < last; i++) {
        let x = array[i];
        let j = i - 1;
        for (; j >= first && array[j] > x; j--) {
            array[j + 1] = array[j];
        }
        array[j + 1] = x;
    }
}

function select5(array, lo, hi, k) {
    if (hi - lo < 10) {
        iSort(array, lo, hi);
        return lo + k;
    }
    let s = hi - lo;
    let np = Math.floor(s / 5); // Number of partitions
    for (let i = 0; i < np; i++) {
        // For each partition, move its median to front of our sublist
        let lo2 = lo + i * 5;
        let hi2 = (i + 1 === np) ? hi : (lo2 + 5);
        let pos = select5(array, lo2, hi2, 2);
        swap(array, pos, lo + i);
    }
    // Partition medians were moved to front, so we can recurse without making another list.
    let pos = select5(array, lo, lo + np, np / 2);

    // Re-partition list to [<pivot][pivot][>pivot]
    let m = triage(array, lo, hi, pos);
    let cmp = lo + k - m;
    if (cmp > 0)
        return select5(array, m + 1, hi, k - (m - lo) - 1);
    else if (cmp < 0)
        return select5(array, lo, m, k);
    return lo + k;
}

function triage(array, lo, hi, pos) {
    let pivot = array[pos];
    let lo3 = lo;
    let hi3 = hi;
    while (lo3 < hi3) {
        let e = array[lo3];
        if (e < pivot)
            lo3++;
        else if (e > pivot)
            swap(array, lo3, --hi3);
        else {
            while (hi3 > lo3 + 1) {
                e = array[--hi3];
                if (e < pivot) {
                    if (lo3 + 1 === hi3) {
                        swap(array, lo3, lo3 + 1);
                        lo3++;
                        break;
                    }
                    swap(array, lo3, lo3 + 1);
                    swap(array, lo3, hi3);
                    lo3++;
                    hi3++;
                }
            }
            break;
        }
    }
    return lo3;
}

