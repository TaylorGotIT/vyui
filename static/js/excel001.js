/* Excel Handler */

const excel001_version = 1;
const excel001html = `<table border="1">
<tr>
<td><input id="lineid_input"></td>
<td><input id="area_input" value="GZ"></td>
</tr>
</table>
<button type="button" onclick="excel001sub('/config')">提交配置信息(Submit Config Info)</button>
<input type="file" id="file" onchange="excel001GetExcelFile(this.files[0])" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"/>
`;

// 读取 excel文件
function outputWorkbook(workbook) {
	var sheetNames = workbook.SheetNames; // 工作表名称集合
	sheetNames.forEach(name => {
		var worksheet = workbook.Sheets[name]; // 只能通过工作表名称来获取指定工作表
		for(var key in worksheet) {
			// v是读取单元格的原始值
			console.log(key, key[0] === '!' ? worksheet[key] : worksheet[key].v);
		}
	});
};

//读取上传excel
function excel001GetExcelFile(file){
    readWorkbookFromLocalFile(file, function(workbook) {
				outputWorkbook(workbook);
	});
};

function excel001getList() {
    //空格全角分号去除
    let str = $("#config_textarea").val().split("#");
    let cvs_json = {
        "aclBasicHead":[
            "name",
            "cmd",
            "rule",
            "action",
            "srcIP",
            "desIP",
            "desc",
        ],
        "aclBasic": [],
        "aclAdvanceHead": [
            "name",
            "cmd",
            "rule",
            "action",
            "proto",
            "srcIP",
            "srcPort",
            "desIP",
            "desPort",
            "desc",
        ],
         "aclAdvance": [],
        "url": [],
        "urlHead": [
            "name",
            "cmd",
            "rule",
            "url",
        ]
    }
    for(let i = 0; i < str.length; i++) {
        let lines = str[i];
        if(lines.search('acl basic')!=-1){
            let name,cmd,rule,action,srcIP,desIP,desc= "-";
            let line = lines.split(/\r?\n/);
            //解析区域内每行配置
            for(let j = 0; j < line.length; j++) {
                rule,action,srcIP,desIP= "-";
                let l = line[j];
                //删除空白行
                let c = l.split(' ').filter(function(s){return s && s.trim();});
                if(c.length>1){
                    cmd = c.join(" ");
                    if(c[1]=="basic"){
                        name = cmd;
                    }else if(c[0]=="description"){
                        //描述配置需要使用“号来分割
                        if(l.search('"')!=-1){
                            desc = l.split('"').filter(function(s){return s && s.trim();})[1];
                        }else{
                            desc = c[1];
                        }
                    }else{
                        rule=c[1];
                        action=c[2];
                        if(c[3]=="source"){
                            srcIP = c[4]+"/"+v4unmask2cidr(c[5]).toString();
                        }else if(c[3]=="destination"){
                            desIP = c[4]+"/"+v4unmask2cidr(c[5]).toString();
                        }else{
                            console.log("basic other --" + cmd);
                        }
                    }
                    let rules = {"name":name,"cmd":cmd,"rule":empty2str(rule),"action":empty2str(action),
                    "srcIP":empty2str(srcIP),"desIP":empty2str(desIP),"desc":desc,};
                    cvs_json.aclBasic.push(rules);
                }
            }
        }
        else if(lines.search('acl advance')!=-1){
            let name,cmd,rule,action,proto,srcIP,srcPort,desIP,desPort,desc= "-";
            let line = lines.split(/\r?\n/);
            //解析区域内每行配置
            for(let j = 0; j < line.length; j++) {
                let l = line[j];
                //删除空白行
                let c = l.split(' ').filter(function(s){return s && s.trim();});
                if(c.length>1){
                    rule,action,proto,srcIP,srcPort,desIP,desPort= "-";
                    cmd = c.join(" ");
                    if(c[1]=="advanced"){
                        name = cmd;
                    }else if(l.search('description')!=- 1){
                        //描述配置需要使用“号来分割
                        if(l.search('"')!=-1){
                            desc = l.split('"').filter(function(s){return s && s.trim();})[1];
                        }else{
                            desc = c[1];
                        }
                    }else{
                        rule=c[1];
                        action=c[2];
                        proto=c[3];
                        if(c[3]!="tcp" && c[3]!="udp"){
                            if(c[4]=="source" && c[7]=="destination"){
                                srcIP=c[5]+"/"+v4unmask2cidr(c[6]).toString();
                                desIP=c[8]+"/"+v4unmask2cidr(c[9]).toString();
                            }else if(c[4]=="source"){
                                if(c[5]=="object-group"){
                                    srcIP=c[5]+" "+c[6];
                                }else{
                                    srcIP=c[5]+"/"+v4unmask2cidr(c[6]).toString();
                                }
                            }else if(c[4]=="destination"){
                                if(c[5]=="object-group"){
                                    desIP=c[5]+" "+c[6];
                                }else{
                                    desIP=c[5]+"/"+v4unmask2cidr(c[6]).toString();
                                }
                            }
                        }else if(c[4]=="source" && c[7]=="destination"){
                            srcIP=c[5]+"/"+v4unmask2cidr(c[6]).toString();
                            desIP=c[8]+"/"+v4unmask2cidr(c[9]).toString();
                            if(c[11]=="eq"){
                                desPort = c[12];
                            }else{
                                desPort = c[12]+"-"+c[13];
                            }
                        }else if(c[7]=="destination-port"){
                            rule,action,proto,srcIP,srcPort,desIP,desPort= "-";
                            srcIP=c[5]+"/"+v4unmask2cidr(c[6]).toString();
                            if(c[8]=="eq"){
                                desPort = c[9];
                            }else{
                                desPort = c[9]+"-"+c[10];
                            }
                        }else if(c[4]=="source-port"){
                        srcIP,srcPort,desIP,desPort= "-";
                        if(c[5]=="eq"){
                            srcPort = c[6];
                        }else{
                            srcPort = c[6]+"-"+c[7];
                        }
                    }else if(c[4]=="destination-port"){
                            if(c[5]=="eq"){
                                desPort = c[6];
                            }else{
                                desPort = c[6]+"-"+c[7];
                            }
                        }else{
                            console.log("Advance------" +l);
                        }

                    }
                let rules = {"name":name,"cmd":cmd,"rule":empty2str(rule),"action":empty2str(action),
                "proto":empty2str(proto),"srcIP":empty2str(srcIP),"srcPort":empty2str(srcPort),
                "desIP":empty2str(desIP),"desPort":empty2str(desPort),"desc":desc};
                console.log(rules);
                cvs_json.aclAdvance.push(rules);
                }
            }

        }else if(lines.search('object-group')!=-1){
            let name,cmd,rule,url= "-";
            let line = lines.split(/\r?\n/);
            for(let j = 0; j < line.length; j++){
                let l = line[j];
                cmd,rule,url = "-";
                //删除空白行
                let c = l.split(' ').filter(function(s){return s && s.trim();});
                if(c.length>0){
                    cmd = l;
                    if(c[0]=="object-group"){
                        name = c[3];
                    }else{
                        rule = c[0];
                        url = c[4];
                    }
                    let rules = {"name":name,"cmd":cmd,"rule":empty2str(rule),"url":empty2str(url)};
                    cvs_json.url.push(rules);
                }
            }
        }else{

        }
    }
    console.log(cvs_json);
    let time=getTime(new Date());
    jsonToExcel(cvs_json.aclBasic, cvs_json.aclBasicHead,"aclBasic"+time.cn)
    jsonToExcel(cvs_json.aclAdvance, cvs_json.aclAdvanceHead,"aclAdvance"+time.cn)
    jsonToExcel(cvs_json.url, cvs_json.urlHead,"url"+time.cn)
}

$("#service_dev").append(excel001html);

excel001getList();

function excel001setWan(value){
    let html='';
    wan_input_tr = '#wan1_input_tr';
    switch(value){
        case "dhcp":
            $(wan_input_tr).empty();
        break;
        case "static":
            $(wan_input_tr).empty();
            $(wan_input_tr).append(`<td><input id="wan1_ip_input" placeholder="IP[x.x.x.x/x]"></td>
            <td><input id="wan1_gw_input" placeholder="GW[x.x.x.x]"></td>`);
        break;
        case "pppoe":
            $(wan_input_tr).empty();
            $(wan_input_tr).append(`<td><input id="pppoe1_user_input" placeholder="PPPoE[x.163.gd]"></td>
            <td><input id="pppoe1_pass_input" placeholder="PPPoE[******]"></td>`);
        break;
    }
}

function excel001sub(url){
  let user = $("#user_input").val();
  let time=getTime(new Date());
  let wan1 = $("#wan1_select").val();
  let wan1Type = $("#wan1_type_select").val();
  let wan1Provider = $("#wan1_provider_select").val();

  let cname = $("#cname_input").val();
  let area = $("#area_input").val();
  let subnet = $("#subnet_input").val();

  let lineid = $("#lineid_input").val();
  let cid = lineid.substr(0,6);
  let ac1 = $("#ac1_input").val();
  let ac1if = $("#ac1_if_input").val();
  let ac1port = ac1if.replace('vtun','');
  let ac1ips = ipNext($("#ac1_ip_input").val().split('/')[0]);
  let ac1ip1 = ac1ips[0];
  let ac1ip2 = ac1ips[1];
  let ac1pub = $("#ac1_pub_input").val();

  let ac2 = $("#ac2_input").val();
  let ac2if = $("#ac2_if_input").val();
  let ac2port = ac2if.replace('vtun','');
  let ac2ips = ipNext($("#ac2_ip_input").val().split('/')[0]);
  let ac2ip1 = ac2ips[0];
  let ac2ip2 = ac2ips[1];
  let ac2pub = $("#ac2_pub_input").val();

  let pe1 = $("#pe1_input").val();
  let pe1if = "tun"+$("#pe1_if_input").val().match(/[1-9]\d+/)[0];
  let pe1ifNum = pe1if.match(/[1-9]\d+/)[0];
  let pe1ips = ipNext($("#pe1_ip_input").val().split('/')[0]);
  let pe1ip1 = pe1ips[0];
  let pe1ip2 = pe1ips[1];
  let pe1lo = $("#pe1_lo_input").val();
  let ce1lo = $("#ce1_lo_input").val();
  let pe1As = $("#pe1_as_input").val();
  let ce1As = $("#ce1_as_input").val();

  let pe2 = $("#pe2_input").val();
  let pe2if = "tun"+$("#pe2_if_input").val().match(/[1-9]\d+/)[0];
  let pe2ifNum = pe2if.match(/[1-9]\d+/)[0];
  let pe2ips = ipNext($("#pe2_ip_input").val().split('/')[0]);
  let pe2ip1 = pe2ips[0];
  let pe2ip2 = pe2ips[1];
  let pe2lo = $("#pe2_lo_input").val();
  let ce2lo = $("#ce2_lo_input").val();
  let pe2As = $("#pe2_as_input").val();
  let ce2As = $("#ce2_as_input").val();

//差异化配置生成
let wanTemp = '';
switch(wan1Type){
    case "dhcp":
        wanTemp += `set interfaces ethernet ${wan1} description WAN1-${wan1Provider}-DHCP
set interfaces ethernet ${wan1} address dhcp
set protocols static route 1.1.1.1/32 dhcp-interface ${wan1}`;
    break;
    case "static":
        let wan1ip = $("#wan1_ip_input").val();
        let wan1gw = $("#wan1_gw_input").val();
        wanTemp += `set interfaces ethernet ${wan1} description WAN1-${wan1Provider}-GW-${wan1gw}
set interfaces ethernet ${wan1} address ${wan1ip}
set protocols static route 1.1.1.1/32 next-hop ${wan1gw}`;
    break;
    case "pppoe":
        let pppoe1user = $("#pppoe1_user_input").val();
        let pppoe1pass = $("#pppoe1_pass_input").val();
        wanTemp += `set interfaces ethernet ${wan1} description WAN1_${wan1Provider}_${pppoe1user}/${pppoe1pass}
set interfaces ethernet ${wan1} pppoe 1 default-route 'none'
set interfaces ethernet ${wan1} pppoe 1 mtu '1492'
set interfaces ethernet ${wan1} pppoe 1 name-server 'none'
set interfaces ethernet ${wan1} pppoe 1 password ${pppoe1user}
set interfaces ethernet ${wan1} pppoe 1 user-id ${pppoe1pass}
set protocols static interface-route 1.1.1.1/32 next-hop-interface pppoe1`;
    break;
  };

let excel001MPLSGreOverOpenvpn  =
`#Fnet MPLS with GRE Over OpenVPN Template.
#操作人员：${user}
#时间：${time}
#系统：vyui-v1
#vyos version >= 1.28.
+++++++++++++++++++++++++++++++++++++++++++
echo '初始化设备'
delete system host-name
delete epoch controller
sudo systemctl stop epoch-openvpnd
rm /config/.initagentd.status
delete interface openvpn
delete interface tunnel
delete interface loopback lo
delete firewall options interface
delete nat
delete protocols
delete policy
delete track
delete service dns
echo '基础配置[防火墙规则，系统名称，物理接口]'
set firewall group network-group GROUP-FNET-Whitelist network 202.104.174.178/32
set firewall group network-group GROUP-FNET-Whitelist network 114.112.232.0/23
set firewall group network-group GROUP-FNET-Whitelist network 114.112.236.0/22
set firewall group network-group GROUP-FNET-Whitelist network 114.113.240.0/23
set firewall group network-group GROUP-FNET-Whitelist network 114.113.244.0/23
set firewall group network-group GROUP-FNET-Whitelist network 223.252.176.0/24
set firewall group network-group GROUP-FNET-Whitelist network 10.0.0.0/8
set firewall group network-group GROUP-FNET-Whitelist network 172.16.0.0/12
set firewall group network-group GROUP-FNET-Whitelist network 192.168.0.0/16
set firewall name WAN2LOCAL default-action 'accept'
set firewall name WAN2LOCAL rule 1000 action 'accept'
set firewall name WAN2LOCAL rule 1000 source group network-group 'GROUP-FNET-Whitelist'
set firewall name WAN2LOCAL rule 2000 action 'drop'
set firewall name WAN2LOCAL rule 2000 destination port '179,2707,53,161,123,8899'
set firewall name WAN2LOCAL rule 2000 protocol 'tcp_udp'
set interfaces ethernet eth0 firewall local name 'WAN2LOCAL'
set interfaces ethernet eth1 firewall local name 'WAN2LOCAL'
set interfaces tunnel ${pe1if} firewall local name 'WAN2LOCAL'
set interfaces tunnel ${pe2if} firewall local name 'WAN2LOCAL'
echo '基础配置[系统名称，物理接口]'
set system host-name ${lineid}-${cname}-${area}
set service snmp community both-win authorization 'ro'
set service smartping
${wanTemp}
echo 'OpenVPN 接入配置[ac1]'
set interfaces openvpn ${ac1if} description AC1_to_${ac1}
set interfaces openvpn ${ac1if} local-address ${ac1ip2} subnet-mask 255.255.255.252
set interfaces openvpn ${ac1if} remote-address ${ac1ip1}
set interfaces openvpn ${ac1if} remote-host ${ac1pub}
set interfaces openvpn ${ac1if} remote-port ${ac1port}
set interfaces openvpn ${ac1if} mode site-to-site
set interfaces openvpn ${ac1if} protocol udp
set interfaces openvpn ${ac1if} openvpn-option '--nobind'
set interfaces openvpn ${ac1if} openvpn-option '--ping 10'
set interfaces openvpn ${ac1if} openvpn-option '--ping-restart 60'
set interfaces openvpn ${ac1if} openvpn-option '--persist-tun'
set interfaces openvpn ${ac1if} shared-secret-key-file '/config/auth/openvpn.secret'
echo 'OpenVPN 接入配置[ac2]'
set interfaces openvpn ${ac2if} description AC2_to_${ac2}
set interfaces openvpn ${ac2if} local-address ${ac2ip2} subnet-mask 255.255.255.252
set interfaces openvpn ${ac2if} remote-address ${ac2ip1}
set interfaces openvpn ${ac2if} remote-host ${ac2pub}
set interfaces openvpn ${ac2if} remote-port ${ac2port}
set interfaces openvpn ${ac2if} mode site-to-site
set interfaces openvpn ${ac2if} protocol udp
set interfaces openvpn ${ac2if} openvpn-option '--nobind'
set interfaces openvpn ${ac2if} openvpn-option '--ping 10'
set interfaces openvpn ${ac2if} openvpn-option '--ping-restart 60'
set interfaces openvpn ${ac2if} openvpn-option '--persist-tun'
set interfaces openvpn ${ac2if} shared-secret-key-file '/config/auth/openvpn.secret'
echo '>>>GRE 配置[Main]<<<'
set interfaces tunnel ${pe1if} description PE1_${pe1}
set interfaces tunnel ${pe1if} address ${pe1ip2}/30
#[v3.2]set interfaces tunnel ${pe1if} local-ip ${ac1ip2}
#[v3.2]set interfaces tunnel ${pe1if} remote-ip ${pe1lo}
set interfaces tunnel ${pe1if} source-address ${ac1ip2}
set interfaces tunnel ${pe1if} remote ${pe1lo}
set interfaces tunnel ${pe1if} encapsulation gre
set interfaces tunnel ${pe1if} multicast disable
set interfaces tunnel ${pe1if} parameters ip ttl 255
echo '>>>GRE 配置[Backup]<<<'
set interfaces tunnel ${pe2if} description PE2_${pe2}
set interfaces tunnel ${pe2if} address ${pe2ip2}/30
#[v3.2]set interfaces tunnel ${pe2if} local-ip ${ac2ip2}
#[v3.2]set interfaces tunnel ${pe2if} remote-ip ${pe2lo}
set interfaces tunnel ${pe2if} source-address ${ac2ip2}
set interfaces tunnel ${pe2if} remote ${pe2lo}
set interfaces tunnel ${pe2if} encapsulation gre
set interfaces tunnel ${pe2if} multicast disable
set interfaces tunnel ${pe2if} parameters ip ttl 255
echo '>>>MTU TCP-MSS配置[interface]<<<'
set firewall options interface ${ac1if} adjust-mss '1300'
set firewall options interface ${ac2if} adjust-mss '1300'
set firewall options interface tun${pe1ifNum} adjust-mss '1300'
set firewall options interface tun${pe2ifNum} adjust-mss '1300'
echo '>>>路由配置[Track 默认路由，对接公网路由，内网路由]<<<'
set track name to-main failure-count 2
set track name to-main success-count 2
set track name to-main test 10 resp-time 5
set track name to-main test 10 target ${pe1ip1}
set track name to-main test 10 ttl-limit 1
set track name to-main test 10 type ping
echo '>>>静态路由配置[Static]<<<'
set protocols static route ${ac1pub}/32 next-hop 1.1.1.1
set protocols static route ${ac2pub}/32 next-hop 1.1.1.1
set protocols static route ${pe1lo}/32 next-hop ${ac1ip1}
set protocols static route ${pe2lo}/32 next-hop ${ac2ip1}
set protocols static route 114.113.245.99/32 next-hop ${pe1ip1}
set protocols static route 114.113.245.100/32 next-hop ${pe2ip1}
set protocols static route 192.168.55.125/32 next-hop ${pe1ip1} track to-main
set protocols static route 192.168.55.125/32 next-hop ${pe2ip1} distance 5
set protocols static route 192.168.55.250/32 next-hop ${pe1ip1} track to-main
set protocols static route 192.168.55.250/32 next-hop ${pe2ip1} distance 5
echo '>>>动态路由配置[BGP]<<<'
set policy prefix-list Local-Route rule 10 action 'permit'
set policy prefix-list Local-Route rule 10 prefix ${subnet}
set policy route-map BGP rule 10 action 'permit'
set policy route-map BGP rule 10 match ip address prefix-list 'Local-Route'
set policy route-map BGP rule 999 action 'deny'

set policy route-map bgp-from--Main rule 100 action 'permit'
set policy route-map bgp-from--Main rule 100 description 'MAIN'
set policy route-map bgp-from--Main rule 100 match
set policy route-map bgp-from--Main rule 100 set local-preference '150'
set policy route-map bgp-from--Backup rule 100 action 'permit'
set policy route-map bgp-from--Backup rule 100 description 'BK'
set policy route-map bgp-from--Backup rule 100 match
set policy route-map bgp-from--Backup rule 100 set local-preference '50'

set protocols bgp 65000 address-family ipv4-unicast redistribute connected route-map 'BGP'
set protocols bgp 65000 address-family ipv4-unicast redistribute static route-map 'BGP'
set protocols bgp 65000 neighbor ${pe1ip1} address-family ipv4-unicast allowas-in
set protocols bgp 65000 neighbor ${pe1ip1} address-family ipv4-unicast prefix-list export 'Local-Route'
set protocols bgp 65000 neighbor ${pe1ip1} address-family ipv4-unicast route-map import 'bgp-from--Main'
set protocols bgp 65000 neighbor ${pe1ip1} address-family ipv4-unicast soft-reconfiguration inbound
set protocols bgp 65000 neighbor ${pe1ip1} local-as ${ce1As}
set protocols bgp 65000 neighbor ${pe1ip1} remote-as ${pe1As}
set protocols bgp 65000 neighbor ${pe1ip1} update-source ${pe1ip2}

set protocols bgp 65000 neighbor ${pe2ip1} address-family ipv4-unicast allowas-in
set protocols bgp 65000 neighbor ${pe2ip1} address-family ipv4-unicast prefix-list export 'Local-Route'
set protocols bgp 65000 neighbor ${pe2ip1} address-family ipv4-unicast route-map import 'bgp-from--Backup'
set protocols bgp 65000 neighbor ${pe2ip1} address-family ipv4-unicast soft-reconfiguration inbound
set protocols bgp 65000 neighbor ${pe2ip1} local-as ${ce2As}
set protocols bgp 65000 neighbor ${pe2ip1} remote-as ${pe2As}
set protocols bgp 65000 neighbor ${pe2ip1} update-source ${pe2ip2}

echo '>>>NetFlow<<<'
set system flow-accounting interface tun1015
set system flow-accounting interface tun1153
set system flow-accounting netflow engine-id '1'
set system flow-accounting netflow server 10.100.114.1  port '9995'
set system flow-accounting netflow timeout expiry-interval '60'
set system flow-accounting netflow timeout flow-generic '3600'
set system flow-accounting netflow timeout icmp '300'
set system flow-accounting netflow timeout max-active-life '604800'
set system flow-accounting netflow timeout tcp-fin '300'
set system flow-accounting netflow timeout tcp-generic '3600'
set system flow-accounting netflow timeout tcp-rst '120'
set system flow-accounting netflow timeout udp '300'
set system flow-accounting netflow version '9'
set system flow-accounting syslog-facility 'daemon'
`;
  let filename = `${lineid}-MPLS-GREOverOpenVPN-Config-${time.ez}-By-${user}`;
  let data = {};
  console.log(excel001MPLSGreOverOpenvpn);
  downloadConfig(filename, excel001MPLSGreOverOpenvpn);
  let type = 'post'
  let datatype = 'json';
  ajaxHandler(url,data,datatype,type);
}