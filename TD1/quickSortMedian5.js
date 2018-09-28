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
    // if (lo >= hi || k < 0 || lo + k >= hi) {
    //     console.log("OOPS");
    //     return;
    // }
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
    //console.log("Before partitioning " + array);
    let m = triage(array, lo, hi, pos);
    //console.log("After partitioning: " + array);
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

//import java.util.*;
//
// public class MedianOfMedians {
//     private MedianOfMedians() {
//
//     }
//
//     /**
//      * Returns median of list in linear time.
//      *
//      * @param list list to search, which may be reordered on return
//      * @return median of array in linear time.
//      */
//     public static Comparable getMedian(ArrayList<Comparable> list) {
//         int s = list.size();
//         if (s < 1)
//             throw new IllegalArgumentException();
//         int pos = select(list, 0, s, s / 2);
//         return list.get(pos);
//     }
//
//     /**
//      * Returns position of k'th largest element of sub-list.
//      *
//      * @param list list to search, whose sub-list may be shuffled before
//      *            returning
//      * @param lo first element of sub-list in list
//      * @param hi just after last element of sub-list in list
//      * @param k
//      * @return position of k'th largest element of (possibly shuffled) sub-list.
//      */
//     public static int select(ArrayList<Comparable> list, int lo, int hi, int k) {
//         if (lo >= hi || k < 0 || lo + k >= hi)
//             throw new IllegalArgumentException();
//         if (hi - lo < 10) {
//             Collections.sort(list.subList(lo, hi));
//             return lo + k;
//         }
//         int s = hi - lo;
//         int np = s / 5; // Number of partitions
//         for (int i = 0; i < np; i++) {
//             // For each partition, move its median to front of our sublist
//             int lo2 = lo + i * 5;
//             int hi2 = (i + 1 == np) ? hi : (lo2 + 5);
//             int pos = select(list, lo2, hi2, 2);
//             Collections.swap(list, pos, lo + i);
//         }
//
//         // Partition medians were moved to front, so we can recurse without making another list.
//         int pos = select(list, lo, lo + np, np / 2);
//
//         // Re-partition list to [<pivot][pivot][>pivot]
//         int m = triage(list, lo, hi, pos);
//         int cmp = lo + k - m;
//         if (cmp > 0)
//             return select(list, m + 1, hi, k - (m - lo) - 1);
//         else if (cmp < 0)
//             return select(list, lo, m, k);
//         return lo + k;
//     }
//
//     /**
//      * Partition sub-list into 3 parts [<pivot][pivot][>pivot].
//      *
//      * @param list
//      * @param lo
//      * @param hi
//      * @param pos input position of pivot value
//      * @return output position of pivot value
//      */
//     private static int triage(ArrayList<Comparable> list, int lo, int hi,
//             int pos) {
//         Comparable pivot = list.get(pos);
//         int lo3 = lo;
//         int hi3 = hi;
//         while (lo3 < hi3) {
//             Comparable e = list.get(lo3);
//             int cmp = e.compareTo(pivot);
//             if (cmp < 0)
//                 lo3++;
//             else if (cmp > 0)
//                 Collections.swap(list, lo3, --hi3);
//             else {
//                 while (hi3 > lo3 + 1) {
//                     assert (list.get(lo3).compareTo(pivot) == 0);
//                     e = list.get(--hi3);
//                     cmp = e.compareTo(pivot);
//                     if (cmp <= 0) {
//                         if (lo3 + 1 == hi3) {
//                             Collections.swap(list, lo3, lo3 + 1);
//                             lo3++;
//                             break;
//                         }
//                         Collections.swap(list, lo3, lo3 + 1);
//                         assert (list.get(lo3 + 1).compareTo(pivot) == 0);
//                         Collections.swap(list, lo3, hi3);
//                         lo3++;
//                         hi3++;
//                     }
//                 }
//                 break;
//             }
//         }
//         assert (list.get(lo3).compareTo(pivot) == 0);
//         return lo3;
//     }
//
// }

// let arr = [295, 653, 746, 827, 837, 236, 611, 805, 483, 65, 184, 57, 201, 452, 850, 347, 687, 367, 870, 718, 159, 455, 28, 713, 355, 206, 741, 22, 826, 91, 700, 676, 58, 978, 305, 862, 716, 200, 127, 554, 424, 762, 891, 503, 331, 281, 885, 2, 32, 359, 129, 166, 729, 269, 354, 374, 480, 428, 497, 60, 569, 203, 995, 44, 391, 300, 856, 6, 838, 890, 643, 787, 149, 478, 914, 832, 945, 482, 84, 551, 368, 987, 375, 810, 394, 624, 73, 752, 192, 965, 205, 51, 651, 439, 449, 16, 453, 61, 399, 563, 887, 123, 467, 181, 721, 508, 533, 834, 372, 878, 697, 70, 340, 504, 241, 336, 472, 360, 731, 492, 545, 974, 247, 426, 758, 767, 246, 155, 496, 136, 665, 514, 14, 715, 566, 189, 830, 481, 760, 175, 937, 858, 3, 634, 836, 574, 489, 79, 10, 905, 108, 297, 894, 263, 153, 585, 304, 101, 847, 912, 678, 56, 958, 180, 337, 104, 620, 273, 342, 234, 960, 861, 436, 928, 208, 415, 289, 948, 992, 839, 249, 144, 919, 860, 876, 754, 34, 7, 615, 235, 761, 619, 539, 981, 567, 226, 946, 475, 590, 278, 724, 583, 577, 433, 685, 644, 967, 357, 829, 268, 889, 207, 224, 87, 364, 199, 209, 699, 646, 674, 77, 477, 818, 383, 490, 437, 821, 213, 261, 735, 842, 816, 204, 416, 822, 961, 640, 540, 538, 103, 608, 859, 320, 717, 901, 27, 160, 410, 157, 96, 232, 202, 75, 670, 382, 639, 409, 526, 115, 556, 759, 558, 662, 138, 306, 42, 310, 728, 170, 988, 755, 89, 863, 276, 448, 150, 972, 133, 843, 660, 48, 400, 212, 652, 600, 588, 621, 698, 140, 459, 169, 799, 13, 328, 957, 576, 29, 921, 592, 571, 638, 282, 358, 584, 570, 334, 765, 936, 343, 659, 802, 930, 23, 476, 174, 312, 982, 906, 575, 899, 404, 491, 771, 675, 164, 709, 329, 267, 499, 186, 975, 82, 387, 559, 301, 298, 124, 5, 257, 784, 623, 462, 220, 898, 321, 120, 63, 511, 407, 562, 447, 30, 597, 991, 271, 977, 515, 484, 820, 393, 933, 904, 800, 880, 947, 512, 350, 148, 796, 379, 237, 471, 779, 943, 384, 193, 116, 656, 723, 701, 745, 548, 479, 679, 782, 361, 989, 835, 398, 285, 711, 325, 950, 274, 667, 980, 636, 80, 171, 649, 819, 780, 883, 25, 256, 707, 15, 308, 742, 266, 423, 629, 363, 66, 695, 100, 625, 165, 128, 999, 346, 953, 430, 833, 335, 966, 422, 446, 797, 403, 596, 151, 604, 641, 244, 272, 33, 690, 708, 68, 749, 131, 218, 673, 814, 319, 763, 650, 792, 461, 532, 500, 781, 628, 78, 637, 875, 259, 67, 867, 740, 632, 26, 37, 909, 587, 388, 341, 550, 112, 294, 622, 211, 59, 111, 486, 286, 582, 134, 804, 90, 20, 751, 466, 239, 727, 661, 922, 183, 702, 438, 522, 326, 534, 24, 117, 881, 92, 994, 696, 655, 214, 801, 594, 139, 811, 813, 886, 544, 345, 419, 505, 686, 857, 668, 81, 463, 672, 369, 366, 516, 874, 238, 172, 69, 307, 733, 36, 764, 864, 373, 979, 812, 411, 195, 62, 264, 703, 330, 429, 333, 849, 725, 580, 940, 549, 815, 527, 40, 265, 296, 469, 645, 18, 55, 750, 778, 228, 130, 920, 290, 9, 506, 806, 435, 445, 52, 4, 339, 450, 573, 495, 884, 64, 154, 951, 581, 519, 468, 682, 402, 973, 984, 314, 871, 397, 293, 322, 113, 790, 216, 691, 770, 747, 737, 258, 895, 197, 488, 443, 613, 41, 854, 631, 392, 848, 162, 502, 110, 487, 866, 53, 118, 831, 517, 897, 168, 464, 694, 788, 785, 998, 970, 705, 795, 602, 275, 43, 99, 147, 158, 39, 786, 167, 377, 971, 664, 176, 421, 768, 327, 616, 94, 903, 925, 949, 441, 593, 431, 299, 427, 704, 245, 156, 530, 260, 317, 607, 12, 132, 47, 315, 658, 97, 680, 923, 872, 809, 726, 692, 221, 907, 405, 8, 908, 473, 929, 610, 456, 465, 578, 851, 677, 210, 182, 83, 417, 390, 280, 927, 976, 191, 714, 798, 240, 251, 50, 963, 231, 74, 916, 776, 1, 145, 852, 654, 386, 710, 807, 380, 944, 288, 647, 736, 808, 962, 243, 412, 744, 689, 395, 187, 732, 525, 840, 54, 253, 941, 753, 541, 911, 964, 141, 349, 254, 501, 95, 255, 509, 230, 605, 706, 756, 190, 683, 225, 873, 406, 772, 460, 938, 513, 250, 557, 968, 521, 555, 789, 85, 21, 353, 198, 121, 279, 284, 242, 494, 277, 777, 537, 520, 287, 227, 420, 122, 348, 952, 841, 630, 990, 846, 935, 734, 518, 442, 547, 146, 617, 853, 440, 38, 793, 915, 524, 774, 595, 352, 712, 868, 642, 626, 931, 302, 470, 865, 783, 107, 983, 823, 371, 900, 222, 135, 106, 969, 803, 993, 385, 934, 1000, 693, 418, 618, 669, 173, 688, 270, 817, 444, 351, 986, 739, 324, 606, 565, 738, 824, 223, 531, 568, 766, 579, 926, 454, 344, 303, 855, 939, 535, 248, 523, 86, 217, 730, 985, 918, 896, 142, 893, 825, 119, 719, 98, 572, 932, 451, 498, 413, 434, 458, 76, 408, 196, 292, 378, 757, 560, 791, 536, 396, 35, 769, 591, 194, 589, 309, 997, 828, 46, 546, 844, 425, 313, 137, 11, 177, 775, 152, 879, 45, 955, 684, 510, 996, 917, 748, 892, 543, 609, 432, 252, 233, 910, 627, 956, 942, 356, 681, 376, 599, 332, 262, 561, 71, 365, 586, 648, 219, 845, 414, 601, 794, 72, 474, 283, 125, 553, 389, 877, 179, 924, 161, 635, 31, 882, 381, 722, 323, 671, 19, 362, 143, 603, 552, 542, 959, 163, 401, 114, 49, 485, 743, 105, 178, 657, 291, 215, 188, 612, 598, 869, 109, 529, 457, 720, 633, 564, 614, 370, 954, 493, 507, 311, 17, 185, 316, 88, 663, 126, 102, 888, 528, 318, 229, 902, 913, 773, 666, 338, 93];
// let copy = arr.slice();
// console.log("unsorted: " + arr);
// quickSortMedian5(arr);
// console.log(arr);
// insertionSort(copy);
// console.log("expected ");
// console.log(copy);
// console.log(copy.equals(arr));

