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
        "ez": yyyy + "" + MM + "" + dd + "" + hh + "" + mm,
    }
    return t;
};

const a2z = "abcdefghijklmnopqrstuvwxyz";

function getColNum(str){
    s = str.toLowerCase();
    let a = null;
    for(let i = 0;i < s.length; i++){

        let b = a2z.indexOf(s[i])+1;
        if(s.length==0){
            a+=b;
            break;
        }else if(i==s.length-1){
            a+=b;
            break;
        }else{
            a+=26*b;
        }
    }
    console.log(a);
    return a
}

function getLoopIP(num){
    let n = num-1
    let a = n%64;
    let b,c = null;
    if(a==0){
        b=0;
    }else{
        b = a*4;
    }
    c= parseInt(n/64);
    return [`100.64.${c}.${b}/30`,`100.65.${c}.${b}/30`];
}

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
        case "fastip003":
            try{
                if($.isFunction(fastip003sub)){
                    $("#service_dev").append(fastip003html);
                    fastip003getList();
                    console.log("fastip003 已下载");
                };
            }catch(e){
                js_path = "/static/js/"+ value + ".js";
                $.getScript(js_path, function(){});
                console.log("fastip003 未下载");
            };
            break;
        case "fastip005":
            try{
                if($.isFunction(fastip005sub)){
                    $("#service_dev").append(fastip005html);
                    fastip005getList();
                    console.log("fastip003 已下载");
                };
            }catch(e){
                js_path = "/static/js/"+ value + ".js";
                $.getScript(js_path, function(){});
                console.log("fastip005 未下载");
            };
            break;
        case "fastip101":
            try{
                if($.isFunction(fastip101sub)){
                    $("#service_dev").append(fastip101html);
                    fastip101getList();
                    console.log("fastip101 已下载");
                };
            }catch(e){
                js_path = "/static/js/"+ value + ".js";
                $.getScript(js_path, function(){});
                console.log("fastip101 未下载");
            };
            break;
        case "fastip102":
            try{
                if($.isFunction(fastip102sub)){
                    $("#service_dev").append(fastip102html);
                    fastip102getList();
                    console.log("fastip102 已下载");
                };
            }catch(e){
                js_path = "/static/js/"+ value + ".js";
                $.getScript(js_path, function(){});
                console.log("fastip102 未下载");
            };
            break;
        case "fastip103":
            try{
                if($.isFunction(fastip103sub)){
                    $("#service_dev").append(fastip103html);
                    fastip103getList();
                    console.log("fastip103 已下载");
                };
            }catch(e){
                js_path = "/static/js/"+ value + ".js";
                $.getScript(js_path, function(){});
                console.log("fastip103 未下载");
            };
            break;
        case "fastip104":
            try{
                if($.isFunction(fastip104sub)){
                    $("#service_dev").append(fastip104html);
                    fastip104getList();
                    console.log("fastip104 已下载");
                };
            }catch(e){
                js_path = "/static/js/"+ value + ".js";
                $.getScript(js_path, function(){});
                console.log("fastip104 未下载");
            };
            break;
        case "fastip105":
            try{
                if($.isFunction(fastip105sub)){
                    $("#service_dev").append(fastip105html);
                    fastip105getList();
                    console.log("fastip105 已下载");
                };
            }catch(e){
                js_path = "/static/js/"+ value + ".js";
                $.getScript(js_path, function(){});
                console.log("fastip105 未下载");
            };
            break;
        case "fastip106":
            try{
                if($.isFunction(fastip106sub)){
                    $("#service_dev").append(fastip106html);
                    fastip106getList();
                    console.log("fastip106 已下载");
                };
            }catch(e){
                js_path = "/static/js/"+ value + ".js";
                $.getScript(js_path, function(){});
                console.log("fastip106 未下载");
            };
            break;
        case "fastip107":
            try{
                if($.isFunction(fastip107sub)){
                    $("#service_dev").append(fastip107html);
                    fastip107getList();
                    console.log("fastip107 已下载");
                };
            }catch(e){
                js_path = "/static/js/"+ value + ".js";
                $.getScript(js_path, function(){});
                console.log("fastip107 未下载");
            };
            break;
        case "fastip201":
            try{
                if($.isFunction(fastip201sub)){
                    $("#service_dev").append(fastip201html);
                    fastip201getList();
                    console.log("fastip201 已下载");
                };
            }catch(e){
                js_path = "/static/js/"+ value + ".js";
                $.getScript(js_path, function(){});
                console.log("fastip201 未下载");
            };
            break;
        case "fastip202":
            try{
                if($.isFunction(fastip202sub)){
                    $("#service_dev").append(fastip202html);
                    fastip202getList();
                    console.log("fastip202 已下载");
                };
            }catch(e){
                js_path = "/static/js/"+ value + ".js";
                $.getScript(js_path, function(){});
                console.log("fastip202 未下载");
            };
            break;
        case "fastip203":
            try{
                if($.isFunction(fastip203sub)){
                    $("#service_dev").append(fastip203html);
                    fastip201getList();
                    console.log("fastip203 已下载");
                };
            }catch(e){
                js_path = "/static/js/"+ value + ".js";
                $.getScript(js_path, function(){});
                console.log("fastip203 未下载");
            };
            break;
               $("#service_dev").append(fastip301html);
        case "fastip301":
            try{
                if($.isFunction(fastip301sub)){
                   fastip301getList();
                    console.log("fastip301 已下载");
                };
            }catch(e){
                js_path = "/static/js/"+ value + ".js";
                $.getScript(js_path, function(){});
                console.log("fastip301 未下载");
            };
            break;
        case "fastip302":
            try{
                if($.isFunction(fastip302sub)){
                   fastip302getList();
                    console.log("fastip302 已下载");
                };
            }catch(e){
                js_path = "/static/js/"+ value + ".js";
                $.getScript(js_path, function(){});
                console.log("fastip302 未下载");
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
        case "sdwan003":
            try{
                if($.isFunction(sdwan003sub)){
                    $("#service_dev").append(sdwan003html);
                    console.log("sdwan003 已下载");
                };
            }catch(e){
                js_path = "/static/js/"+ value + ".js";
                $.getScript(js_path, function(){});
                console.log("sdwab003 未下载");
            };
            break;
        case "sdwan005":
            try{
                if($.isFunction(sdwan005sub)){
                    $("#service_dev").append(sdwan005html);
                    console.log("sdwan005 已下载");
                };
            }catch(e){
                js_path = "/static/js/"+ value + ".js";
                $.getScript(js_path, function(){});
                console.log("sdwab005 未下载");
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
        case "fortinet_mpls001":
            try{
                if($.isFunction(fortinet_mpls001sub)){
                    $("#service_dev").append(fortinet_mpls001html);
                    console.log("fortinet_mpls001 已下载");
                };
            }catch(e){
                js_path = "/static/js/"+ value + ".js";
                $.getScript(js_path, function(){});
                console.log("fortinet_mpls001 未下载");
            };
            break;
        case "sslvpn001":
            try{
                if($.isFunction(sslvpn001sub)){
                    $("#service_dev").append(sslvpn001html);
                    console.log("sslvpn001 已下载");
                };
            }catch(e){
                js_path = "/static/js/"+ value + ".js";
                $.getScript(js_path, function(){});
                console.log("sslvpn001 未下载");
            };
            break;
        case "dhcp032":
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
        case "dhcp040":
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
        //FnetOS3.2
        case "wifi032":
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
        //FnetOS4.0
        case "wifi040":
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