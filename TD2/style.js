let pQueueMethods = ["construct", "insert", "extractMin"];
let treeMethods = ["remove", "find"];


$(function () {
    $("#dStruct").change(function () {
        updateOperations();
    });

    let updateOperations = function () {
        let options = [];
        let src = [];
        if ($("#dStruct").val() === "0") {
            src = pQueueMethods;
        }
        else if ($("#dStruct").val() === "1") {
            console.log("tree");
            src = treeMethods;
        }
        src.forEach(function (method) {
            let option = "<option value=" + method + ">" + method + "</option>";
            options.push(option);
        });
        let selector = $("#methods");
        selector.html(options).prop('selectedIndex', 0);
    };

    updateOperations();
});
