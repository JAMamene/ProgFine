let randomPivot = function (array, first, last) {
    return Math.floor(Math.random() * (last - first) + first);
};

function quickSort(array, pivotPicker) {
    sort(array, pivotPicker, 0, array.length - 1);
}

function sort(array, pivotPicker, first, last) {
    if (first < last) {
        let pivot = Math.floor(Math.random() * (last - first) + first);
        pivot = partition(array, first, last, pivot);
        quickSort(array, first, pivot - 1);
        quickSort(array, pivot + 1, last);
    }
}

function partition(array, first, last, pivot) {
    swap(array, pivot, last);
    let j = first;
    for (let i = first; i < last; i++) {
        if (array[i] <= array[last]) {
            swap(array, i, j);
            j++;
        }
    }
    swap(array, last, j);
    return j;
}


let arr = [1, 6, 8, 4, 1, 2, 9];
console.log(quickSort(arr, randomPivot));

// partitionner(tableau T, entier premier, entier dernier, entier pivot)
//     échanger T[pivot] et T[dernier]  // échange le pivot avec le dernier du tableau , le pivot devient le dernier du tableau
//     j := premier
//     pour i de premier à dernier - 1 // la boucle se termine quand i = (dernier-1).
//         si T[i] <= T[dernier] alors
//             échanger T[i] et T[j]
//             j := j + 1
//     échanger T[dernier] et T[j]
//     renvoyer j
//
// tri_rapide(tableau T, entier premier, entier dernier)
//     début
//         si premier < dernier alors
//             pivot := choix_pivot(T, premier, dernier)
//             pivot := partitionner(T, premier, dernier, pivot)
//             tri_rapide(T, premier, pivot-1)
//             tri_rapide(T, pivot+1, dernier)
//         fin si
//     fin
