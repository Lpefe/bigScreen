var url = "http://" + target + "/monitor/grp";
var ping_cfg = "http://" + target + "/monitor/ping_cfg"
var host = "http://" + target + "/monitor/host"
var close = document.querySelector("#close");
var submit1 = document.querySelector("#submit1");
var submit2 = document.querySelector("#submit2");
//点击关联模板跳转到模板页面
function aa(id) {
  layer.open({
    type: 2,
    title: '关联模板',
    offset: 'cc',
    maxmin: false, //开启最大化最小化按钮
    area: ['850px', '170px'],
    content: ['../html/grp_pingcfg.html?id=' + id], //iframe的url，no代表不显示滚动条
    shadeClose: true,
    shade: 0.8,
    success: function (layero, index) {
      var body = layer.getChildFrame('body', index);
      //var iframeWin = window[layero.find('iframe')[0]['name']]; //得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method();

      body.find("#cfgNav")[0].style.display = "none"
      //iframeWin.layui.form.render()
    }
  });
}
close.onclick = function () {
  document.querySelector("#ss").style.display = "none"
}
var mycfg = []
var selectcfg = ""
$.ajax({
  url: ping_cfg,
  success: function (response) {
    for (var i = 0; i < response.data.length; i++) {
      var data = {}
      data.name = response.data[i].name
      data.value = response.data[i].id
      mycfg.push(data)
      selectcfg += "<option value=" + response.data[i].id + ">" + response.data[i].name + "</option>"
    }
    $("#selectGrp").append(selectcfg)
    layui.form.render()
  },
});


layui.use(['form', 'layedit', 'laydate'], function () {
  var form = layui.form,
    layer = layui.layer;

  //监听提交增加
  form.on('submit(demo1)', function (data) {
    var userInfo = {
      "grp_name": data.field.grp_name,
      "cfg_id": data.field.cfg_id,
    };
    fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=utf-8',
      },
      credentials: 'include',
      body: JSON.stringify(userInfo)
    }).then(function (data) {

      data.json().then(data => {

        if (data.retcode === 0) {
          layer.msg("添加成功", {
            icon: 6, //成功的表情
            time: 1000 //1秒关闭（如果不配置，默认是3秒）
          })

        } else {
          layer.msg("添加失败" + data.desc, {
            icon: 5,
            time: 5000
          }); //失败的表情
        }
      })
    }).then(function () {
      setTimeout(function () {
        location.reload()
      }, 1000)
    })
    return false; //阻止表单跳转
  });
  //监听提交修改
  form.on('submit(demo2)', function (data) {
    var userInfo = {
      "id": id,
      "cfg_id": data.field.cfg_id,
      "grp_name": data.field.grp_name,
    };
    fetch(url, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=utf-8',
      },
      credentials: 'include',
      body: JSON.stringify(userInfo)
    }).then(function (data) {
      data.json().then(data => {

        if (data.retcode === 0) {
          layer.msg("修改成功", {
            icon: 6, //成功的表情
            time: 1000 //1秒关闭（如果不配置，默认是3秒）
          })

        } else {
          layer.msg("修改失败" + data.desc, {
            icon: 5,
            time: 5000
          }); //失败的表情
        }
      })
    }).then(function () {
      setTimeout(function () {
        location.reload()
      }, 1000)

    })
    return false; //阻止表单跳转
  });
  layui.use('element', function () {
    var element = layui.element;
  });
  var grp_name = ""
  var cfg_id = ""
  layui.use('table', function () {
    var table = layui.table;

    table.render({
      elem: '#test',
      url: url,
      limit: 10, 
      page:true,
      toolbar: `<div class="layui-btn-container">



<div class="" style="float: left; position: relative;">
   
  <input style="width: 150px; height:31px;" type="text" id="select_orderId" name="select_orderId"  placeholder="请输入组名称" autocomplete="off" class="layui-input">
</div>
  <button class="layui-btn layui-btn-sm" lay-event="search" id="searchBtn" style="float: left; margin-right: 10px;">搜索</button> 
  <button class="layui-btn layui-btn-sm" lay-event="isAll" style="float: left; margin-right: 10px;">批量添加模板</button>
<button class="layui-btn layui-btn-sm" lay-event="add" style="float: left; margin-right: 10px;">添加组</button>
</div>`,

      //limit: 1000, //每页默认显示的数量,
      //age: false,


      parseData: function (res) { //res 即为原始返回的数据
        return {
          "code": res.retcode, //解析接口状态
          "msg": res.desc, //解析提示文本
          "data": res.data, //解析数据列表
          "count": res.total,
        }
      },
      title: '用户数据表',
      cols: [
        [{
          type: 'checkbox',
          fixed: 'left',
          width: "4%",
        }, {
          field: 'id',
          title: 'ID',
          width: "24%",
          fixed: 'left',
          unresize: true,
          sort: true
        }, {
          field: 'grp_name',
          title: '组名称',
          width: "24%",
        }, {
          field: 'cfg_name',
          title: '关联模板',
          width: "24%",
          templet: function (d) {
            return '<span style="color: #00f;" onclick="aa(' + d.cfg_id + ')">' + d.cfg_name + '</span>'
          }
        }, {
          fixed: 'right',
          title: '操作',
          toolbar: '#barDemo',
          width: "24%"
        }]
      ],
    });
    table.on('toolbar(test)', function (obj) {
      var checkStatus = table.checkStatus(obj.config.id);
      switch (obj.event) {
        case 'getCheckData':
          var data = checkStatus.data;
          layer.alert(JSON.stringify(data));
          break;
        case 'getCheckLength':
          var data = checkStatus.data;
          layer.msg('选中了：' + data.length + ' 个');
          break;
        case 'isAll':
          var data = checkStatus.data;
          if (data.length === 0) {
            layer.msg("请至少选择一项");
          } else {
            var grp_id = ""
            for (var i = 0; i < data.length; i++) {
              grp_id += data[i].id + ","
            }
            fetch(ping_cfg)
              .then((response) => {
                return response.text(); //返回一个带有文本的对象
              })
              .then((responseText) => {
                var response = $.parseJSON(responseText)
                var selectcfg = ""
                for (var i = 0; i < response.data.length; i++) {
                  var data = {}
                  data.name = response.data[i].name
                  data.value = response.data[i].id
                  selectcfg += "<option value=" + response.data[i].id + ">" + response.data[i].name +
                    "</option>"
                }
                layer.open({
                  type: 2,
                  title: '批量添加模板',
                  offset: 'cc',
                  maxmin: true, //开启最大化最小化按钮
                  area: ['450px', '300px'],
                  content: ['../html/batchAddCfg.html?' + grp_id], //iframe的url，no代表不显示滚动条
                  shadeClose: true,
                  shade: 0.8,
                  success: function (layero, index) {

                    var body = layer.getChildFrame('body', index);
                    var iframeWin = window[layero.find('iframe')[0]['name']]; //得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method();
                    body.find("#batchcfgselect2").append(selectcfg)
                    iframeWin.layui.form.render()
                  }
                });
                //$("#batchcfgselect2").append(selectcfg)
              })
              .catch((error) => {
                alert(error)
              })

          }
          break;
        case 'add':
          layui.form.render()
          document.querySelector("#ss").style.display = "block"
          document.querySelector("#addText").style.display = "block"
          document.querySelector("#editText").style.display = "none"
          document.querySelector("#submit1").style.display = "inline-block"
          document.querySelector("#submit2").style.display = "none"
          break;
        case "search":
          //tab搜索
          var selectId = document.querySelector("#select_orderId").value
          table.reload('test', {
            url: url,
            where: {
              grp_name: selectId
            }
          });
      };
    });
    //监听行工具事件
    table.on('tool(test)', function (obj) {
      var data = obj.data;
      id = data.id
      cfg_id = data.cfg_id
      grp_name = data.grp_name
      //表单初始赋值
      form.val('example', {
        "grp_name": grp_name,
        "cfg_id": cfg_id,
      })
      if (obj.event === 'del') {
        layer.confirm('真的删除行么', function (index) {
          fetch(url + "/" + id, {
            method: 'DELETE',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json;charset=utf-8',
            },
            credentials: 'include',
          }).then(function (data) {
            //document.querySelector("#submit2").style.display = "none"

            data.json().then(data => {

              if (data.retcode === 0) {
                layer.msg("删除成功", {
                  icon: 6, //成功的表情
                  time: 1000 //1秒关闭（如果不配置，默认是3秒）
                })

              } else {
                layer.msg("删除失败" + data.desc, {
                  icon: 5,
                  time: 5000
                }); //失败的表情
              }
            })
          }).then(function () {
            setTimeout(function () {
              location.reload()
            }, 1000)
          })
        });
      } else if (obj.event === 'edit') {
        document.querySelector("#ss").style.display = "block"
        document.querySelector("#addText").style.display = "none"
        document.querySelector("#editText").style.display = "block"
        document.querySelector("#submit1").style.display = "none"
        document.querySelector("#submit2").style.display = "inline-block"
      } else if (obj.event === 'host') {
        layer.open({
          type: 2,
          title: '当前组内设备详情',
          offset: 'cc',
          maxmin: true, //开启最大化最小化按钮
          area: ['750px', '600px'],
          content: ['../html/grp_host.html?' + id, ], //iframe的url，no代表不显示滚动条
          shadeClose: true,
          shade: 0.8,
        });
      }
    });
  });
});