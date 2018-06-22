$(".form a").click(function() {
    var name = $("#name").val();
    var pwd = $.md5($("#pwd").val());
    $.ajax({
        type: "post",
        url: IDN + "/api/BusinessManage/Login ",
        data: { Phone: name, Pwd: pwd },
        dataType: "json",
        async: true,
        success: function(data) {
            if (data.Status == 1) {
                sessionStorage.setItem("Type", data.Result.Type);
                sessionStorage.setItem("token", data.Result.token);
                location.href = "page1.html";
            }
        },
        error: function(e) {}
    })
})

$(".icon-quxiao").click(function() {
    $(this).siblings("input").val("");
})
