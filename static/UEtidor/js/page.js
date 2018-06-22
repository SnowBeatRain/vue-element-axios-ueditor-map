var xhmsq = function(xhr) {
    xhr.setRequestHeader('Authorization', sessionStorage.getItem("token"));
};
var PageIndex=1;
function getlist() {
    if(sessionStorage.getItem("guanlipage")){
        var index = sessionStorage.getItem("guanlipage");
    }else{
        var index = 1
    }
    $.ajax({
        type: "get",
        url: IDN + "/api/BusinessManage/ProductList",
        data: { pageIndex: index, pageSize: 4 },
        beforeSend: xhmsq,
        dataType: "json",
        async: false,
        cache: false, //关闭AJAX缓存
        success: function(data) {
            PageIndex = data.Result.PageIndex;
            var str = "";
            for (var i = 0; i < data.Result.ProductList.length; i++) {
                var ID=data.Result.ProductList[i].ID;
                var image=data.Result.ProductList[i].Image;
                var Name=data.Result.ProductList[i].Name;
                var Price=data.Result.ProductList[i].Price;
                var Score=data.Result.ProductList[i].Score;
                str+="<tr data-id="+ID+">"+
                        "<td>"+
                            "<span class='img'><img src="+image+"></span>"+
                        "</td>"+
                        "<td class='proname'>"+Name+"</td>"+
                        "<td>"+Score+"</td>"+
                        "<td>￥"+Price+"</td>"+
                        "<td>"+
                            "<a class='prodel'>删除</a>"+
                            "<a class='proedit'>编辑</a>"+
                        "</td>"+
                    "</tr>"
            }
            $("tbody").html(str);
        },
        error: function(e) {}
    })
}getlist();

/*删除*/
function del(id) {
    $.ajax({
        type: "get",
        url: IDN + "/api/BusinessManage/DeleteBusinessProduct",
        data: { ID: id},
        beforeSend: xhmsq,
        dataType: "json",
        async: false,
        success: function(data) {
            if(data.Status == 800047){
                alert(data.Result);
            }else if(data.Status == 1){
                location.reload();   
            }
        },
        error: function(e) {}
    })
}
function del1(id) {
    $.ajax({
        type: "get",
        url: IDN + "/api/BusinessManage/DeleteTravelProduct",
        data: { ID: id},
        beforeSend: xhmsq,
        dataType: "json",
        async: false,
        success: function(data) {
            if(data.Status == 800047){
                alert(data.Result);
            }else if(data.Status == 1){
                location.reload();   
            }
        },
        error: function(e) {}
    })
}
var type=sessionStorage.getItem("Type");
if(type == 1){
    
}else if(type == 3){
    $(".fenlei").hide();
}

$('#light-pagination').pagination({
    prevText: '上一页',
    nextText: '下一页',    
    pages: PageIndex,
    displayedPages: 3,
    edges: 3,
    currentPage:sessionStorage.getItem("guanlipage"),
    onPageClick:function(pageNumber, event)
    {
        sessionStorage.setItem("guanlipage", pageNumber);
        getlist(pageNumber);  
    }
});
$(".fenlei").click(function(){
    location.href="fenlei.html";
})

$(".prodel").live('click', function() {  
   if(confirm("确定删除此条信息？"))
        {
            
            var id=$(this).parent("td").parent("tr").attr("data-id");
            if(sessionStorage.getItem("Type")==1){
               del(id) 
           }else if(sessionStorage.getItem("Type")==3){
               del1(id)
           }
            
        }
});
$(".add").click(function(){
    if(sessionStorage.getItem("Type")==3){
        location.href="add1.html"
    }else if(sessionStorage.getItem("Type")==1){
        location.href="add.html"
    }
})
$(".proedit").live('click',function(){
    var id=$(this).parent("td").parent("tr").attr("data-id");
    if(sessionStorage.getItem("Type")==3){
        location.href="bianji1.html?id="+id;
    }else if(sessionStorage.getItem("Type")==1){
       location.href="bianji.html?id="+id; 
    }
})