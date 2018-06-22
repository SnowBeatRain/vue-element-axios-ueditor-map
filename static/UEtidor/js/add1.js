var xhmsq = function(xhr) {
    xhr.setRequestHeader('Authorization', sessionStorage.getItem("token"));
};
$.ajax({
    type: "get",
    url: IDN + "/api/BusinessManage/TravelProductType",
    data: { pageIndex: 1, pageSize: 999 },
    beforeSend: xhmsq,
    dataType: "json",
    async: false,
    success: function(data) {
        var str="";
        for(var i=0;i<data.Result.length;i++){
        	var ID=data.Result[i].ID;
        	var Name=data.Result[i].Name;
        	str+="<option data-id="+ID+">"+Name+"</option>"
        }
        $(".realselect").html(str);
    },
    error: function(e) {}
})
$(".add1-aside option").click(function(){
    $(".select").val($(this).val());
    $(".select").attr("data",$(this).attr("data-id"))
    $(".realselect").hide();
})
$("#logopost").change(function(){
    var file = this.files[0];
    $(".logoSrue").attr("src",window.URL.createObjectURL(file));
    var formData = new FormData(); 
    formData.append('file', file);  
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
            $(".logopost").val(imgurl);
        },
        error: function() {
            console.log('Upload error');
        }
    });
})
$("#imgpost").change(function(){
    var file = this.files[0];
    $(".imgSure").attr("src",window.URL.createObjectURL(file));
    var formData = new FormData(); 
    formData.append('file', file);  
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
            $(".imgpost").val(imgurl);
        },
        error: function() {
            console.log('Upload error');
        }
    });
})


function postdata(){
    var isadd = $("input[type='radio']:checked").val();
    var eduit = UE.getEditor('container').getContent();
    var SrotID = $(".select").attr("data");
    var Description = $("textarea").val();
    var Price = $(".add1-price").val();
    var TravelName = $(".Name").val();
    var TransType = $(".add1-type option:checked").val();
    var Logo = $(".logopost").val();
    var Image  = $(".imgpost").val();
    $.ajax({
        type: "Post",
        url: IDN+"/api/BusinessManage/AddTravelProduct",
        data: {SrotID :SrotID, TransType :TransType,Image:Image, Logo:Logo,IsAdd:isadd,Detail:encodeURIComponent(eduit),TravelName:TravelName,Price:Price,Description:Description},
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
    }else if(!$(".add1-price").val()) {
        alert("请先添加价格")
    }else if(!$(".Name").val()) {
        alert("请先填写名称")
    }else if(!$(".logopost").val()) {
        alert("请先添加Logo")
    }else if(!$(".imgpost").val()) {
        alert("请先添加图片")
    }else{
        postdata();
        }
})