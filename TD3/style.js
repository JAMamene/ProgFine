let algorithms = ["basic", "quad", "grid", "mask"];


$(function () {
    let options = [];
    let src = algorithms;
    src.forEach(function (method) {
        let option = "<option value=" + method + ">" + method + "</option>";
        options.push(option);
    });
    let selector = $("#alg");
    selector.html(options).prop('selectedIndex', 0);
});
