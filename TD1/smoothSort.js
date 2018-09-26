//Copyright (c) 2011, Jason Davies
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
//   * Redistributions of source code must retain the above copyright notice, this
//     list of conditions and the following disclaimer.
//
//   * Redistributions in binary form must reproduce the above copyright notice,
//     this list of conditions and the following disclaimer in the documentation
//     and/or other materials provided with the distribution.
//
//   * The name Jason Davies may not be used to endorse or promote products
//     derived from this software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
// ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
// WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
// DISCLAIMED. IN NO EVENT SHALL JASON DAVIES BE LIABLE FOR ANY DIRECT, INDIRECT,
// INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
// LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
// PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
// LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE
// OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
// ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

// Leonardo numbers.
const LP = [
    1, 1, 3, 5, 9, 15, 25, 41, 67, 109, 177, 287, 465, 753,
    1219, 1973, 3193, 5167, 8361, 13529, 21891, 35421, 57313, 92735,
    150049, 242785, 392835, 635621, 1028457, 1664079, 2692537,
    4356617, 7049155, 11405773, 18454929, 29860703, 48315633, 78176337,
    126491971, 204668309, 331160281, 535828591, 866988873
];

function smoothSort(m, lo, hi) {
    if (arguments.length === 1) {
        lo = 0;
        hi = m.length - 1;
    }
    if (hi > LP[32]) {
        throw {error: "Maximum length exceeded for smoothsort implementation."};
    }
    let head = lo;
    let p = 1;
    let pshift = 1;
    let trail;

    while (head < hi) {
        if ((p & 3) === 3) {
            sift(m, pshift, head);
            p >>>= 2;
            pshift += 2;
        } else {
            if (LP[pshift - 1] >= hi - head) trinkle(m, p, pshift, head, false);
            else sift(m, pshift, head);
            if (pshift === 1) {
                p <<= 1;
                pshift--;
            } else {
                p <<= (pshift - 1);
                pshift = 1;
            }
        }
        p |= 1;
        head++;
    }
    trinkle(m, p, pshift, head, false);

    while (pshift !== 1 || p !== 1) {
        if (pshift <= 1) {
            trail = trailingzeroes(p & ~1);
            p >>>= trail;
            pshift += trail;
        } else {
            p <<= 2;
            p ^= 7;
            pshift -= 2;

            trinkle(m, p >>> 1, pshift + 1, head - LP[pshift] - 1, true);
            trinkle(m, p, pshift, head - 1, true);
        }

        head--;
    }
}

function trinkle(m, p, pshift, head, trusty) {
    let val = m[head];
    let stepson;
    let mstepson;
    let rt;
    let lf;
    let trail;

    while (p !== 1) {
        stepson = head - LP[pshift];

        if (ascending(mstepson = m[stepson], val) <= 0) break;

        if (!trusty && pshift > 1) {
            rt = head - 1;
            lf = head - 1 - LP[pshift - 2];
            if (ascending(m[rt], mstepson) >= 0 || ascending(m[lf], mstepson) >= 0) {
                break;
            }
        }

        m[head] = mstepson;

        head = stepson;
        trail = trailingzeroes(p & ~1);
        p >>>= trail;
        pshift += trail;
        trusty = false;
    }
    if (!trusty) {
        m[head] = val;
        sift(m, pshift, head);
    }
}

function sift(m, pshift, head) {
    let rt;
    let lf;
    let mrt;
    let mlf;
    let val = m[head];
    while (pshift > 1) {
        rt = head - 1;
        lf = head - 1 - LP[pshift - 2];
        mrt = m[rt];
        mlf = m[lf];

        if (ascending(val, mlf) >= 0 && ascending(val, mrt) >= 0) break;

        if (ascending(mlf, mrt) >= 0) {
            m[head] = mlf;
            head = lf;
            pshift--;
        } else {
            m[head] = mrt;
            head = rt;
            pshift -= 2;
        }
    }
    m[head] = val;
}


// Solution for determining number of trailing zeroes of a number's binary representation.
// Taken from http://www.0xe3.com/text/ntz/ComputingTrailingZerosHOWTO.html
const MultiplyDeBruijnBitPosition = [
    0, 1, 28, 2, 29, 14, 24, 3,
    30, 22, 20, 15, 25, 17, 4, 8,
    31, 27, 13, 23, 21, 19, 16, 7,
    26, 12, 18, 6, 11, 5, 10, 9];

function trailingzeroes(v) {
    return MultiplyDeBruijnBitPosition[(((v & -v) * 0x077CB531) >> 27) & 0x1f];
}

function ascending(a, b) {
    return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
}