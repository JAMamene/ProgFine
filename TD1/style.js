var arGenAlgos = [randomGen, randomGenBigNumber, sortedAscend, sortedDescend, pseudoSorted, lottaSameValue];

$(function () {
    //Convert numbers in log2 to the real values
//     $('#real').click(function () {
//         $('text').each(function () {
//             let text = $(this).text();
//             if (!isNaN(text) && !(text == 0)) {
//                 $(this).html(Math.pow(2, parseInt($(this).text())));
//             }
//         });
//     });


    //Generate the form content in the main page
    let options = [];
    let src = new Array(arGenAlgos.length);
    for (let i = 0; i < arGenAlgos.length; i++) {
        src[i] = ({
            id: i,
            txt: arGenAlgos[i].name
        });
    }
    src.forEach(function (arGenAlgo) {
        let option = "<option value=" + arGenAlgo.id + ">" + arGenAlgo.txt + "</option>";
        options.push(option);
    });
    let selector = $("#arGen");
    selector.html(options).prop('selectedIndex', 0);
    for (let i = 0; i < algorithms.length; i++) {
        $("#checkboxes").append(
            $("<div/>").addClass("col-md-3").append(
                $("<div/>").addClass("custom-control").addClass("custom-checkbox")
                    .append($("<input/>").attr({
                            type: "checkbox",
                            class: "custom-control-input checkbox-alg",
                            id: i
                        }), $("<label/>").attr({
                            class: "custom-control-label",
                            for: i,
                        }).html(algorithms[i].name)
                    )
            )
        )
    }

});