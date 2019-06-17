var logout = "http://" + target + "/monitor/logout/";
layui.use('element', function(){
    var element = layui.element; //导航的hover效果、二级菜单等功能，需要依赖element模块
    //监听导航点击
    element.on('nav(demo)', function(elem){
      //console.log(elem)
      layer.msg(elem.text());
    });
  });
var username= window.sessionStorage.getItem("username")
if(window.sessionStorage.getItem("username")===null){
    alert("您还没有登录，请登录后重试！")
    window.location = "./login.html";
}
$("#navname")[0].innerHTML="欢迎："+username
$("#leave")[0].onclick = function () {
    $.ajax({
        url: logout,
        success: function (response) {
            window.sessionStorage.clear();
            window.location = "./login.html";
        },
    });
}
$("#changepwd")[0].onclick = function () {
    layer.open({
        type: 2,
        title: false,
        closeBtn:0,
        offset: 'cc',
        //maxmin: false, //开启最大化最小化按钮
        area: ['550px', '250px'],
        content: ['./nav_change_pwd.html','no'], //iframe的url，no代表不显示滚动条
        shadeClose: true,
        shade: [0.5],
        success: function (layero, index) {
          var body = layer.getChildFrame('body', index);
          //var iframeWin = window[layero.find('iframe')[0]['name']]; //得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method();
          //body.find("#cfgNav")[0].style.display = "none"
          //iframeWin.layui.form.render()
        }
      });
}
