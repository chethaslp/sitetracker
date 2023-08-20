const myModal = new bootstrap.Modal($('#modalId'));

var c = 0, lst=[], d;
window.onmessage = function(e) {
    if(e.data.startsWith("cp")){
        d = JSON.parse(e.data.slice(2));
        myModal.toggle("show");
    }
};
var cfn = () => {
    document.getElementById("vp").contentWindow.postMessage('cp'+c.toString());
    $("#ic"+c.toString()).removeClass("fa-spin").removeClass("fa-gear").addClass("fa-check-circle");
    $("#cp"+c.toString()).removeClass("active").removeClass("disabled");
    c += 1;
    $("#ic"+c.toString()).addClass("fa-spin").addClass("fa-gear").removeClass("fa-circle-o");
    $("#cp"+c.toString()).addClass("active");

    lst.push(d);
    if(c == 5){
        $.post({     
            url: '/parse',
            data: {"d":JSON.stringify(lst)},
            success: function (data) {
                console.log(data);   
            },
        });
    }
};