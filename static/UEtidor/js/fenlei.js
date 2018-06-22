var xhmsq = function(xhr) {
    xhr.setRequestHeader('Authorization', sessionStorage.getItem("token"));
};
var PageIndex=1;
function fenye() {
	if(sessionStorage.getItem("fenyepage")){
		var index = sessionStorage.getItem("fenyepage")
	}else{
		var index = 1
	}
    $.ajax({
        type: "get",
        url: IDN + "/api/BusinessManage/SubClass",
        data: { pageIndex: index, pageSize: 4 },
        beforeSend: xhmsq,
        dataType: "json",
        async: false,
        success: function(data) {
        	PageIndex = data.Result.PageIndex;
            var str="";
            for(var i=0;i<data.Result.Data.length;i++){
            	var ID=data.Result.Data[i].ID;
            	var Name=data.Result.Data[i].Name;
            	str+="<tr data-id="+ID+"><td>"+Name+"</td><td><a class='prodel'>删除</a><a class='proedit'>编辑</a><a class='sure'>确定</a></td></tr>"
            }
            $("tbody").html(str);
        },
        error: function(e) {}
    })
}fenye();
$('#light-pagination').pagination({
    prevText: '上一页',
    nextText: '下一页',    
    pages: PageIndex,
    displayedPages: 3,
    edges: 3,
    currentPage:sessionStorage.getItem("fenyepage"),
    onPageClick:function(pageNumber, event)
    {
    	sessionStorage.setItem("fenyepage", pageNumber);
        fenye(pageNumber);  
    }
});
$(".guanli").click(function(){
    location.href="page1.html";
})

/*删除*/
function del(id) {
    $.ajax({
        type: "get",
        url: IDN + "/api/BusinessManage/DeleteSubClass",
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

$(".prodel").live('click', function() {  
   if(confirm("确定删除此条信息？"))
        {
        	
            var id=$(this).parent("td").parent("tr").attr("data-id");
            del(id);
        }
        else 
        {
           alert("如果取消，就写一个返回事件吧！");
        } 
});




/*添加*/
$(".add").click(function(){
	$(".fixedbox").show()
})
$(".fixedbox button").click(function(){
	var Name = $(".fixedbox input").val();
	$.ajax({
        type: "get",
        url: IDN + "/api/BusinessManage/AddSubClass",
        data: { CategoryName : Name},
        beforeSend: xhmsq,
        dataType: "json",
        async: false,
        success: function(data) {
            location.reload(); 
        },
        error: function(e) {}
    })
})

/*修改*/

$(".proedit").live('click', function() {  
	$("tbody td a").hide();
	$(".sure").show();
	$(this).parent("td").siblings().attr("contenteditable",true);
	$(this).parent("td").siblings().focus();
})
$(".sure").live('click', function() {
	var id=$(this).parent("td").parent("tr").attr("data-id");
	var name=$(this).parent("td").siblings().text();
	$.ajax({
        type: "get",
        url: IDN + "/api/BusinessManage/EditSubClass",
        data: { ID:id ,CategoryName : name},
        beforeSend: xhmsq,
        dataType: "json",
        async: false,
        success: function(data) {
             $(this).parent("td").siblings().attr("contenteditable",false);
             $("tbody td a").show();
             $(".sure").hide();
        },
        error: function(e) {}
    })
})