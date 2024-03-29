//提交配置方式：1、一次性提交保存为开机配置，重启；2、SSH一条条刷进去；
const infoJsn = []
const listIP = []
const listIF = []
const listOther = []
const ipv4_regex = /^(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}$/gm;
const ipv4_regex2 = /^([0-9]{1,3}\.){3}[0-9]{1,3}(\/([0-9]|[1-2][0-9]|3[0-2]))?$/gm
//NOC分配的配置文本正则匹配分割为字符串单元
//通过黑名单匹配祛除多余字符串
//生成可选 参数池，手动确认哪些信息留下。
//生成待取用参数列表ListIP、ListIF、ListOther。


function getCookie(name) {
    var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
    return r ? r[1] : undefined;
}

function setCookie(cname, cvalue, exdays){
    let d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

window.onload=function(){
    const xsrf = getCookie('_xsrf');
    const uname = getCookie('uname');
    //_xsrf Header Setup for Ajax
    function xsrfSafeMethod(method) {
        // these HTTP methods do not require CSRF protection
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }
    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!xsrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-XSRFToken", xsrf);
            }
        }
    });
}

//判断是否在前面加0
function checkTime(s){
    return s < 10 ? '0' + s: s;
};

function getTime(d) {
    let yyyy = d.getFullYear();
    let MM = checkTime(d.getMonth() + 1);
    let dd = checkTime(d.getDate());
    let hh = checkTime(d.getHours());
    let mm = checkTime(d.getMinutes());
    let t = {
        "cn": yyyy + "年" + MM + "月" + dd + "日  " + hh + ":" + mm,
        "en": yyyy + "/" + MM + "/" + dd + " " + hh + ":" + mm,
        "ez": yyyy + MM + dd + hh + mm,
    }
    return t;
};

function ajaxHandler(url,data,datatype,type,callback){
  $.ajax({
    url:url,
    data:data,
    dataType:datatype,
    type:type,
    error:function(msg){
      console.log(JSON.stringify(msg));
    },
    success:function(msg){
      if(msg.hasOwnProperty("url")){
        next(msg["url"]);
      }
      console.log(msg);
    },
    complete:function(msg){
      console.log(JSON.stringify(msg));
    },
  });
}

function ifConfig(){

}

function initConfig(url){
    let v = $("#wan_if_select").val();
    console.log(v);
    let if_type = v[0];
    let if_num = v[1];
    let if_all = if_type+if_num;
    $("#wan_if_select").sel
    let type = 'get';
    let datatype = 'text';
    let data = '';
    ajaxHandler(url,data,datatype,type);
    console.log(if_type);
}

function checkVersion(){

}

//动态获取选中的模板JS文件
function getTempJS(value){
    console.log(value);
    $("#service_dev").children().remove();
    switch(value){
        case "fastip001":
            try{
                if($.isFunction(fastip001sub)){
                    //已下载脚本时需要调用脚本执行
                    $("#service_dev").append(fastip001html);
                    fastip001getList();
                    console.log("fastip001 已下载");
                };
            }catch(e){
                js_path = "/static/js/"+ value + ".js";
                $.getScript(js_path, function(){});
                console.log("fastip001 未下载");
            };
            break;
        case "fastip002":
            try{
                if($.isFunction(fastip002sub)){
                    $("#service_dev").append(fastip002html);
                    fastip002getList();
                    console.log("fastip002 已下载");
                };
            }catch(e){
                js_path = "/static/js/"+ value + ".js";
                $.getScript(js_path, function(){});
                console.log("fastip002 未下载");
            };
            break;
        case "sdwan001":
            try{
                if($.isFunction(sdwan001sub)){
                    $("#service_dev").append(sdwan001html);
                    sdwan001getList();
                    console.log("sdwan001 已下载");
                };
            }catch(e){
                js_path = "/static/js/"+ value + ".js";
                $.getScript(js_path, function(){});
                console.log("sdwan001 未下载");
            };
            break;
        case "sdwan002":
            try{
                if($.isFunction(sdwan002sub)){
                    $("#service_dev").append(sdwan002html);
                    console.log("sdwan002 已下载");
                };
            }catch(e){
                js_path = "/static/js/"+ value + ".js";
                $.getScript(js_path, function(){});
                console.log("sdwab002 未下载");
            };
            break;
        case "mpls001":
            try{
                if($.isFunction(mpls001sub)){
                    $("#service_dev").append(mpls001html);
                    console.log("mpls001 已下载");
                };
            }catch(e){
                js_path = "/static/js/"+ value + ".js";
                $.getScript(js_path, function(){});
                console.log("mpls001 未下载");
            };
            break;
        case "mpls002":
            try{
                if($.isFunction(mpls002sub)){
                    $("#service_dev").append(mpls002html);
                    console.log("mpls002 已下载");
                };
            }catch(e){
                js_path = "/static/js/"+ value + ".js";
                $.getScript(js_path, function(){});
                console.log("mpls002 未下载");
            };
            break;
    };

};

function downloadConfig(name, str) {
  let a = document.createElement('a');
  a.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(str));
  a.setAttribute('download', name);
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function logout(url){
  let type = 'delete';
  let datatype = 'json';
  let data = '';
  ajaxHandler(url,data,datatype,type);
}

function ipNext(str){
    let s = str.split('.');
    let s1 = Number(s[3])+1;
    let s2 = Number(s[3])+2;
    ip1 = `${s[0]}.${s[1]}.${s[2]}.${s1.toString()}`;
    ip2 = `${s[0]}.${s[1]}.${s[2]}.${s2.toString()}`;
    return [ip1,ip2];
}

function next(url){
  console.log('redirect to===>' + url);
  if(url!=null){
    window.location.href = url;
  }
}