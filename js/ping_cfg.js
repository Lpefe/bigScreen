var url = "http://" + target + "/monitor/ping_cfg";
var close = document.querySelector("#close");
var submit1 = document.querySelector("#submit1");
var submit2 = document.querySelector("#submit2");
close.onclick = function () {
  document.querySelector("#ss").style.display = "none"
}
var a = location.href;
var s = a.indexOf("=");
var t = a.substring(s + 1); // t就是?后面的东西了 

layui.use(['form', 'layedit', 'laydate'], function () {
  var form = layui.form,
    layer = layui.layer,
    layedit = layui.layedit,
    laydate = layui.laydate;
  $ = layui.jquery
  //监听提交增加
  form.on('submit(demo1)', function (data) {
    var userInfo = {
      "name": data.field.name,
      "checksec": data.field.checksec,
      "num": data.field.num,
      "avgdelay": data.field.avgdelay,
      "loss": data.field.loss
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
            layer.msg("添加失败"+data.desc, {
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
      "name": data.field.name,
      "checksec": data.field.checksec,
      "num": data.field.num,
      "avgdelay": data.field.avgdelay,
      "loss": data.field.loss
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
            layer.msg("修改失败"+data.desc, {
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
  var id = ""
  var name = ""
  var checksec = ""
  var num = ""
  var avgdelay = ""
  var loss = ""

  layui.use('table', function () {
    var table = layui.table;


    table.render({
      elem: '#test',
      url: url,
      toolbar: `    <div class="layui-btn-container">


    <div class="" style="float: left; position: relative;">
       
      <input style="width: 150px; height:31px;" type="text" id="select_orderId" name="select_orderId"  placeholder="请输入模板名称" autocomplete="off" class="layui-input">
    </div>
      <button class="layui-btn layui-btn-sm" lay-event="search" id="searchBtn" style="float: left; margin-right: 10px;">搜索</button> 
    <button class="layui-btn layui-btn-sm" lay-event="add" style="float: left; margin-right: 10px;">添加</button>

  </div>`,

      //limit: 5, //每页默认显示的数量,
      page: true,
      limit: 10, 

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
          field: 'id',
          title: 'ID',
          width: "10%",
          fixed: 'left',
          unresize: true,
          sort: true
        },{
          field: 'name',
          title: '名称',
          width: "15%",
          edit: 'text',
        }, {
          field: 'checksec',
          title: '检测周期（s）',
          width: "10%",
          edit: 'text',
        },{
          field: 'avgdelay',
          title: '平均时延（ms）',
          width: "10%",
          edit: 'text'
        },  {
          field: 'loss',
          title: '丢包率（%）',
          width: "10%"
        },  {
          field: 'num',
          title: '发生次数（次）',
          width: "10%",
          edit: 'text',
        },  {
          field: 'create_at',
          title: '创建时间',
          width: "20%",
          edit: 'text',
        },{
          fixed: 'right',
          title: '操作',
          toolbar: '#barDemo',
          width: "15%"
        }]
      ],
    });
    table.on('toolbar(test)', function (obj) {
      var checkStatus = table.checkStatus(obj.config.id);
      switch (obj.event) {
        case 'add':
          document.querySelector("#ss").style.display = "block"
          document.querySelector("#addText").style.display = "block"
          document.querySelector("#editText").style.display = "none"
          document.querySelector("#submit1").style.display = "inline-block"
          document.querySelector("#submit2").style.display = "none"
          break;
        case "search":
          //tab搜索
          var selectName = document.querySelector("#select_orderId").value
          table.reload('test', {
            url: url,
            where: {
              name: selectName
            }
          });
      };
    });

    if (t.length < 5) {
      table.reload('test', {
        url: url,
        where: {
          id: t
        }
      });
    }
    //监听行工具事件
    table.on('tool(test)', function (obj) {
      var data = obj.data;
      id = data.id
      name = data.name
      checksec = data.checksec
      num = data.num
      avgdelay = data.avgdelay
      loss = data.loss

      //表单初始赋值
      form.val('example', {
        "name": name,
        "checksec": checksec,
        "num": num,
        "avgdelay": avgdelay,
        "loss": loss
      })
      if (obj.event === 'del') {
        layer.confirm('真的删除行么', function (index) {
          fetch(url + "/" + id, {
            method: 'DELETE',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json;charset=utf-8',
            },
            credentials: 'include'
          }).then(function (data) {
            //document.querySelector("#submit2").style.display = "none"

            data.json().then(data => {

              if (data.retcode === 0) {
                  layer.msg("删除成功", {
                      icon: 6, //成功的表情
                      time: 1000 //1秒关闭（如果不配置，默认是3秒）
                  })

              } else {
                  layer.msg("删除失败"+data.desc, {
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
      }
    });
  });
});