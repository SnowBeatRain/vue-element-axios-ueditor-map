IDN="http://beadhouse.nbxuanma.com/";
// $(".aside").height($(window).height()-100);
// $(".content").height($(window).height()-100);
// $(".guanliadd").height($(window).height()-100);
$(".Bedit").height(($(window).height()-100)*0.8);
$(".select").click(function(){
	if($(this).siblings("select").is(":hidden")){
		$(this).siblings("select").show();
	}else{
		$(this).siblings("select").hide();
	}
})
$(".headRight").click(function(){
	sessionStorage.clear("token");
	location.href="login.html"
})
var year = new Date().getFullYear();
var mouth = new Date().getMonth()+ 1;
var day = new Date().getDate();
var a = new Array("日", "一", "二", "三", "四", "五", "六"); 
var week = new Date().getDay(); 
var str = year+"年"+mouth+"月"+day+"日"+" 星期"+a[week]; 
$(".time").html(str);
