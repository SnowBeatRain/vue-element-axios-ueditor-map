var xhmsq = function(xhr) {
    xhr.setRequestHeader('Authorization', sessionStorage.getItem("token"));
};
$.ajax({
    type: "get",
    url: IDN + "/api/BusinessManage/SubClass",
    data: { pageIndex: 1, pageSize: 999 },
    beforeSend: xhmsq,
    dataType: "json",
    async: false,
    success: function(data) {
        var str="";
        for(var i=0;i<data.Result.Data.length;i++){
        	var ID=data.Result.Data[i].ID;
        	var Name=data.Result.Data[i].Name;
        	str+="<option data-id="+ID+">"+Name+"</option>"
        }
        $("select").html(str);
    },
    error: function(e) {}
})

$(".select").click(function(){
    $("select").show();
})
$("option").click(function(){
    $(".select").val($(this).val());
    $(".select").attr("data",$(this).attr("data-id"))
    $("select").hide();
})
$("#imgpost").change(function(){
    var file = this.files[0];
    $(".image").attr("src",window.URL.createObjectURL(file));
})
function addimage(){
    var formData = new FormData(); 
    formData.append('file', $("#imgpost")[0].files[0]);  
    $.ajax({
        url: IDN+'/api/BusinessManage/UploadBusiness',
        type: "POST",
        data: formData,
        //dataType: 'json',
        processData: false,
        contentType: false,
        beforeSend: xhmsq,
        success: function(data) {
            var imgurl = data.Result;
            postdata(imgurl);
        },
        error: function() {
            console.log('Upload error');
        }
    });
}

function postdata(imgurl){
    var idadd = $("input[type='radio']:checked").val();
    var eduit = UE.getEditor('container').getContent();
    var SubClassID = $(".select").attr("data");
    var Name = $("textarea").val();
    var SalePrice = $(".price").val();
    $.ajax({
        type: "Post",
        url: IDN+"/api/BusinessManage/AddBusinessProduct",
        data: {SubClassID :SubClassID, Name:Name,Image:imgurl,SalePrice:SalePrice,IsAdded:idadd,Detail:encodeURIComponent(eduit)},
        beforeSend:xhmsq,
        dataType: "json",
        success: function (data) {
            if (data.Status == 1) {
                alert("保存成功");
                location.href="page1.html"
                // window.location.href="detail2.html"
            } else {
                alert("更新失败");
            }
        }, error: function (e) {
            alert("服务器错误,操作失败");
        }
    }); 
   
}
$(".add-button").click(function(){
    if(!$(".select").val()){
        alert("请先添加选择分类");
    }else if(!$("textarea").val()){
        alert("请先填写商品信息")
    }else if(!$(".price").val()) {
        alert("请先添加价格")
    }else if(!$("#imgpost").val()) {
        alert("请先添加图片")
    }else{
        addimage();
        }
})