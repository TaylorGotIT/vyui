/* FastIP Tiktok 单个二次GRE 单运营商 */
const fastip106html = `<table border="1">
<tr>
<td>LineID</td>
<td><input id="lineid_input" placeholder="线路ID"></td>
<td><select id="version_select">
<option value="40" selected="selected">FnetOS[ 4.0 ]</option>
<option value="32">FnetOS[ 3.2 ]</option>
<option value="31">FnetOS[ 3.1 ]</option></select></td>
</tr>
<tr>
<td>Company</td>
<td><input id="cname_input" placeholder="CompanyName[eg:Huawei]"></td>
<td><input id="area_input" placeholder="Area[GZ,SZ,SH,etc...]"></td></tr>
<tr><td>WAN</td>
<td><select id="wan1_select">
<option value="eth0" selected="selected">WAN1-ETH0</option>
<option value="eth1">WAN1-ETH1</option>
<option value="br0">WAN1-BR0</option>
<option value="br1">WAN1-BR1</option></select>
<select id="wan1_provider_select">
<option value="CT" selected="selected">电信</option>
<option value="CU">联通</option>
<option value="CM">移动</option></select></td>
<td><select id="wan1_type_select" onchange=fastip106setWan(this.value)>
<option value="dhcp" selected="selected">WAN Type[ DHCP ]</option>
<option value="static">WAN Type[ Static ]</option>
<option value="pppoe">WAN Type[ PPPoE ]</option></select></td>
</tr>
<tr id="wan1_input_tr"></tr>
<tr>
<td>LocalDNS</td>
<td><input id="local1_dns_input" placeholder="本地DNS1[eg:223.5.5.5]" value="223.5.5.5"></td>
<td><input id="local2_dns_input" placeholder="本地DNS2[eg:223.6.6.6]" value="223.6.6.6"></td>
</tr>
<tr>
<td>OverseaDNS</td>
<td><input id="oversea1_dns_input" placeholder="海外DNS1[eg:8.8.8.8]" value="8.8.8.8"></td>
<td><input id="oversea2_dns_input" placeholder="海外DNS2[eg:8.8.4.4]" value="8.8.4.4"></td>
</tr>
<tr>
<td>BGPServerA</td>
<td><input id="bgp_server1_input" placeholder="BGP Server1" value="10.10.99.200"></td>
<td><input id="bgp_server2_input" placeholder="BGP Server2" value="10.10.99.202"></td>
</tr>
<tr>
<td>BGPServerB</td>
<td><input id="bgp_server3_input" placeholder="BGP Server3" value="10.10.99.201"></td>
<td><input id="bgp_server4_input" placeholder="BGP Server4" value="10.10.99.203"></td>
</tr>
<tr>
<td>PE</td>
<td><input id="pe1_input" placeholder="PE1[eg:gzd-upe1]"></td>
<td><input id="pe2_input" placeholder="PE2[eg:szd-upe2]"></td>
</tr>
<tr>
<td>PE IF</td>
<td><input id="pe1_if_input" placeholder="PE1IF[eg:Tunnel0/0/1]"></td>
<td><input id="pe2_if_input" placeholder="PE2IF[eg:Tunnel0/0/2]"></td>
</tr>
<tr>
<td>PE IP</td>
<td><input id="pe1_ip_input" placeholder="PE1IP[eg:10.x.x.x/30]"></td>
<td><input id="pe2_ip_input" placeholder="PE2IP[eg:10.x.x.x/30]"></td>
</tr>
<tr>
<td>PE LO</td>
<td><input id="pe1_lo_input" placeholder="PE1LO[eg:10.x.x.x/32]"></td>
<td><input id="pe2_lo_input" placeholder="PE2LO[eg:10.x.x.x/32]"></td>
</tr>
<tr>
<td>CE LO</td>
<td><input id="ce1_lo_input" placeholder="CE1LO[eg:10.x.x.x/32]"></td>
<td><input id="ce2_lo_input" placeholder="CE2LO[eg:10.x.x.x/32]"></td>
</tr>
<tr>
<td>AC</td>
<td><input id="ac1_input" placeholder="AC1[eg:gzd-acvpnpe1]"></td>
<td><input id="ac2_input" placeholder="AC2[eg:szd-acvpnpe1]"></td>
</tr>
<tr>
<td>AC IF</td>
<td><input id="ac1_if_input" placeholder="AC1IF[eg:vtun1000]"></td>
<td><input id="ac2_if_input" placeholder="AC2IF[eg:vtun2000]"></td>
</tr>
<tr>
<td>AC IP</td>
<td><input id="ac1_ip_input" placeholder="AC1IP[eg:10.x.x.x/30]"></td>
<td><input id="ac2_ip_input" placeholder="AC2IP[eg:10.x.x.x/30]"></td>
</tr>
<tr>
<td>AC Pub</td>
<td><input id="ac1_pub_input" placeholder="AC1Pub[eg:x.x.x.x]"></td>
<td><input id="ac2_pub_input" placeholder="AC2Pub[eg:x.x.x.x]"></td>
</tr>
<tr>
<td>NAT PE</td>
<td><input id="natpe1_input" placeholder="NATPE1[eg:us1-natpe1]"></td>
<td></td>
</tr>
<tr>
<td>NAT PE IF</td>
<td><input id="natpe1_if_input" placeholder="NATPE1IF[eg:tun1000]"></td>
<td></td>
</tr>
<tr>
<td>NAT PE IP</td>
<td><input id="natpe1_ip_input" placeholder="NATPE1IP[eg:10.x.x.x/30]"></td>
<td></td>
</tr>
<tr>
<td>NAT PE lo</td>
<td><input id="natpe1_lo_input" placeholder="NATPE1LO[eg:10.x.x.x/32]"></td>
<td></td>
</tr>
<tr>
<td>NAT CE lo</td>
<td><input id="natce1_lo_input" placeholder="NATCE1LO[eg:10.x.x.x/32]"></td>
<td></td>
</tr>
<tr>
<td>OverseaIP</td>
<td><input id="natpe1_oversea_input" placeholder="NATPE1Oversea[eg:10.x.x.x-x.x.x.x]"></td>
<td></td>
</tr>
</table>
<button type="button" onclick="fastip106sub('/config')">提交配置信息(Submit Config Info)</button>
`;

function fastip106getList() {
//空格全角分号去除
    let str = $("#config_textarea").val().replaceAll(' ','').replaceAll('：',':').replaceAll(';','');
    if(str.length>32){
    let lines = str.split(/\r?\n/);
    let info_json = {
        "id":[],
        "ac":[],
        "pe":[],
        "if":[],
        "ip":[],
        "celo":[],
        "pelo":[],
        "pub":[],
        "as":[],
        "natpe":[],
        "oversea":[],
        "other":[],
    };
    for(let i = 0; i < lines.length; i++) {
        let line = lines[i]
        if(line.length>8){
            let l = line.split(':');
            let l0 = l[0].toLowerCase();
            let l1 = l[1];
            console.log(l0);
            switch(l0){
                case 'lineid':
                    info_json.id.push(l1);
                    break;
                case 'pe':
                    if(l1.search('ac')!=-1 | l1.search('gw')!=-1){
                        info_json.ac.push(l1);
                    }else if(l1.search('nat')!=-1){
                        info_json.natpe.push(l1);
                    }else if(l1.search('pe')!=-1){
                        info_json.pe.push(l1);
                    }else{
                        info_json.pelo.push(l1);
                    };

                    break;
                case 'ce':
                    if(l1.search('.')!=-1){
                        info_json.celo.push(l1);
                    }
                    break;
                case 'tunnel':
                    info_json.if.push(l1);
                    break;
                case 'tun':
                    info_json.if.push(l1);
                    break;
                case 'wanip':
                    info_json.ip.push(l1);
                    break;
                case 'pe对接':
                    let a = l1.split('.')[0]
                    if(a!=10&&a!=172&&a!=192){
                        info_json.pub.push(l1);
                    }else{
                        info_json.pelo.push(l1);
                    };
                    break;
                case 'ce对接':
                    info_json.celo.push(l1);
                    break;
                case 'peas号':
                    info_json.as.push(l1);
                    break;
                default:
                    if(l1==undefined){
                        console.log(l0);
                        if(l0.search('natpe')!=-1){
                            info_json.natpe.push(l0);
                        }
                        break;
                    }
                    if(l1.search('-')!=-1){
                        let b = l1.replaceAll('-',',').replaceAll('_',',').split(',').filter(Boolean);
                        let ip_str = "";
                        let h = b[0].split('.')[0];
                        for(let i = 0; i < b.length/2; i++){
                            if(h!=10&&h!=172&&h!=192){
                                if(i==b.length/2-1){
                                    ip_str += `${b[i*2+1]}-${b[i*2]};`;
                                }else{
                                    ip_str += `${b[i*2+1]}-${b[i*2]},`;
                                };
                            }else{
                                if(i==b.length/2-1){
                                    ip_str += `${b[i*2]}-${b[i*2+1]};`;
                                }else{
                                    ip_str += `${b[i*2]}-${b[i*2+1]},`;
                                };
                           }
                        };
                        info_json.oversea.push(ip_str);
                    }else{
                        info_json.other.push(l1);
                    };
            }
        }
    };
    console.log(info_json);
    $("#lineid_input").val(info_json.id[0].substr(0,7));
    $("#pe1_input").val(info_json.pe[0]);
    $("#pe2_input").val(info_json.pe[1]);
    $("#pe1_if_input").val(info_json.if[0]);
    $("#pe2_if_input").val(info_json.if[2]);
    $("#pe1_ip_input").val(info_json.ip[0]);
    $("#pe2_ip_input").val(info_json.ip[2]);
    $("#pe1_lo_input").val(info_json.pelo[0]);
    $("#pe2_lo_input").val(info_json.pelo[1]);
    $("#ce1_lo_input").val(info_json.celo[0]);
    $("#ce2_lo_input").val(info_json.celo[1]);
    $("#pe1_as_input").val(info_json.as[1]);
    $("#pe2_as_input").val(info_json.as[1]);
    $("#ac1_input").val(info_json.ac[0]);
    $("#ac2_input").val(info_json.ac[1]);
    $("#ac1_if_input").val(info_json.if[1]);
    $("#ac2_if_input").val(info_json.if[3]);
    $("#ac1_ip_input").val(info_json.ip[1]);
    $("#ac2_ip_input").val(info_json.ip[3]);
    $("#ac1_pub_input").val(info_json.pub[0]);
    $("#ac2_pub_input").val(info_json.pub[1]);
    $("#natpe1_input").val(info_json.natpe[0]);
    $("#natpe1_if_input").val(info_json.if[4]);
    $("#natpe1_ip_input").val(info_json.ip[4]);
    $("#natpe1_lo_input").val(info_json.pelo[2]);
    $("#natce1_lo_input").val(info_json.celo[2]);
    $("#natpe1_oversea_input").val(info_json.oversea[0]);
  };
};

$("#service_dev").append(fastip106html);
//加载测试资源的解析数据
fastip106getList();

function fastip106setWan(value){
    let html='';
    wan_input_tr = '#wan1_input_tr';
    switch(value){
        case "dhcp":
            $(wan_input_tr).empty();
        break;
        case "static":
            $(wan_input_tr).empty();
            $(wan_input_tr).append(`<td>Static</td><td><input id="wan1_ip_input" placeholder="IP[x.x.x.x/x]"></td>
            <td><input id="wan1_gw_input" placeholder="GW[x.x.x.x]"></td>`);
        break;
        case "pppoe":
            $(wan_input_tr).empty();
            $(wan_input_tr).append(`<td>PPPoE</td><td><input id="pppoe1_user_input" placeholder="PPPoE[x.163.gd]"></td>
            <td><input id="pppoe1_pass_input" placeholder="PPPoE[******]"></td>`);
        break;
    };
}

function fastip106sub(url){
  let user = $("#user_input").val();
  let time=getTime(new Date());
  let wan1 = $("#wan1_select").val();
  let wan1Type = $("#wan1_type_select").val();
  let wan1Provider = $("#wan1_provider_select").val();

  let version = $("#version_select").val();
  let lineid = $("#lineid_input").val();
  let cname = $("#cname_input").val();
  let area = $("#area_input").val();
  let local1dns = $("#local1_dns_input").val();
  let local2dns = $("#local2_dns_input").val();
//获取主线参数
  let pe1 = $("#pe1_input").val();
  let pe1if = "tun"+$("#pe1_if_input").val().match(/[1-9]\d+/)[0];
  let pe1ips = ipNext($("#pe1_ip_input").val().split('/')[0]);
  let pe1ip1 = pe1ips[0];
  let pe1ip2 = pe1ips[1];
  let pe1lo = $("#pe1_lo_input").val();
  let ce1lo = $("#ce1_lo_input").val();

  let ac1 = $("#ac1_input").val();
  let ac1if = $("#ac1_if_input").val();
  let ac1port = ac1if.replace('vtun','');
  let ac1ips = ipNext($("#ac1_ip_input").val().split('/')[0]);
  let ac1ip1 = ac1ips[0];
  let ac1ip2 = ac1ips[1];
  let ac1pub = $("#ac1_pub_input").val();

//获取备线参数
  let pe2 = $("#pe2_input").val();
  let pe2if = "tun"+$("#pe2_if_input").val().match(/[1-9]\d+/)[0];
  let pe2ips = ipNext($("#pe2_ip_input").val().split('/')[0]);
  let pe2ip1 = pe2ips[0];
  let pe2ip2 = pe2ips[1];
  let pe2lo = $("#pe2_lo_input").val();
  let ce2lo = $("#ce2_lo_input").val();
  let ac2 = $("#ac2_input").val();
  let ac2if = $("#ac2_if_input").val();
  let ac2port = ac2if.replace('vtun','');
  let ac2ips = ipNext($("#ac2_ip_input").val().split('/')[0]);
  let ac2ip1 = ac2ips[0];
  let ac2ip2 = ac2ips[1];
  let ac2pub = $("#ac2_pub_input").val();

  let natpe1 = $("#natpe1_input").val();
  let natpe1ips = ipNext($("#natpe1_ip_input").val().split('/')[0]);
  let natpe1ip1 = natpe1ips[0];
  let natpe1ip2 = natpe1ips[1];
  let natpe1if = $("#natpe1_if_input").val();
  let natpe1lo = $("#natpe1_lo_input").val();
  let natce1lo = $("#natce1_lo_input").val();
  let oversea1ip = $("#natpe1_oversea_input").val();
  let oversea1ips = oversea1ip.split(',');

console.log(oversea1ips);
let oversea1ip1 = '';
let oversea1ip2 = '';
let oversea1ip3 = '';
switch (oversea1ips.length){
    case 1:
        oversea1ip1 = oversea1ips[0].split('-')[0];
    break;
    case 2:
        oversea1ip1 = oversea1ips[0].split('-')[0];
        oversea1ip2 = oversea1ips[1].split('-')[0];
    break;
    case 3:
        oversea1ip1 = oversea1ips[0].split('-')[0];
        oversea1ip2 = oversea1ips[1].split('-')[0];
        oversea1ip3 = oversea1ips[2].split('-')[0];
    break;
}
console.log(oversea1ip1);
console.log(oversea1ip2);
console.log(oversea1ip3);
let oversea1dns = $("#oversea1_dns_input").val();
let oversea2dns = $("#oversea2_dns_input").val();
let bgp1server1 = $("#bgp_server1_input").val();
let bgp1server2 = $("#bgp_server2_input").val();
let bgp1server3 = $("#bgp_server3_input").val();
let bgp1server4 = $("#bgp_server4_input").val();
//差异化配置生成
let initTemp ='';
let wanTemp = '';
let imageTemp = '';
let openvpnTemp = '';
let greTemp = '';
let smartdnsTemp = '';
let dhcpTemp = '';
switch(version){
    case "40":
//系统升级/降级模板
imageTemp +=`echo '# 系统升级最新4.0版本'
conf
delete system host-name
delete epoch controller
sudo systemctl stop epoch-openvpnd
rm /config/.initagentd.status
delete interfaces ethernet
delete interface openvpn
delete interface tunnel
delete interface loopback lo
delete nat
delete protocols
delete policy
set interfaces ethernet eth0 address dhcp
commit
exit
curl http://202.104.174.189:18080/epochos/ | grep vyos-epoch | awk -F '"' '{print "http://192.168.75.15/epochos/"$2}' | sed -n '$p' > img_list
while read -r url; do wget "$url" done < img_list
cat img_list
do add system image xxx`;

//WAN接口模板
if(wan1=="eth0" || wan1=="eth1"){
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
del interface ethernet ${wan1} address
set interfaces pppoe pppoe1 authentication user ${pppoe1user}
set interfaces pppoe pppoe1 authentication password ${pppoe1pass}
set interfaces pppoe pppoe1 default-route 'auto'
set interfaces pppoe pppoe1 description description WAN1_${wan1Provider}_${pppoe1user}/${pppoe1pass}
set interfaces pppoe pppoe1 mtu '1492'
set interfaces pppoe pppoe1 source-interface ${wan1}
set protocols static interface-route 1.1.1.1/32 next-hop-interface pppoe1`;
    break;
  };
}else if(wan1=="br0" || wan1=="br1"){
switch(wan1Type){
    case "dhcp":
        wanTemp += `set interfaces bridge ${wan1} description WAN1-${wan1Provider}-DHCP
set interfaces bridge ${wan1} address dhcp
set interfaces bridge ${wan1} member interface eth0
set interfaces bridge ${wan1} member interface eth1
set protocols static route 1.1.1.1/32 dhcp-interface ${wan1}`;
    break;
    case "static":
        let wan1ip = $("#wan1_ip_input").val();
        let wan1gw = $("#wan1_gw_input").val();
        wanTemp += `set interfaces bridge ${wan1} description WAN1-${wan1Provider}-GW-${wan1gw}
set interfaces bridge ${wan1} address ${wan1ip}
set interfaces bridge ${wan1} member interface eth0
set interfaces bridge ${wan1} member interface eth1
set protocols static route 1.1.1.1/32 next-hop ${wan1gw}`;
    break;
    case "pppoe":
        let pppoe1user = $("#pppoe1_user_input").val();
        let pppoe1pass = $("#pppoe1_pass_input").val();
        wanTemp += `set interfaces bridge ${wan1} description WAN1_${wan1Provider}_${pppoe1user}/${pppoe1pass}
del interfaces bridge ${wan1} address
set interfaces pppoe pppoe1 authentication user ${pppoe1user}
set interfaces pppoe pppoe1 authentication password ${pppoe1pass}
set interfaces pppoe pppoe1 default-route 'auto'
set interfaces pppoe pppoe1 description description WAN1_${wan1Provider}_${pppoe1user}/${pppoe1pass}
set interfaces pppoe pppoe1 mtu '1492'
set interfaces pppoe pppoe1 source-interface ${wan1}
set protocols static interface-route 1.1.1.1/32 next-hop-interface pppoe1`;
    break;
  };
}
//OpenVPN接口模板
openvpnTemp += `echo 'OpenVPN 接入配置[ac1]'
set interfaces openvpn ${ac1if} description AC1_${ac1}
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
#set interfaces openvpn ${ac1if} openvpn-option '--fragment 1300'
set interfaces openvpn ${ac1if} shared-secret-key-file '/config/auth/openvpn.secret'
echo 'OpenVPN 接入配置[ac2]'
set interfaces openvpn ${ac2if} description AC2_${ac2}
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
#set interfaces openvpn ${ac2if} openvpn-option '--fragment 1300'
set interfaces openvpn ${ac2if} shared-secret-key-file '/config/auth/openvpn.secret'`;

greTemp += `echo '>>>GRE 配置[Main]<<<'
set interfaces tunnel ${pe1if} description PE1_${pe1}
set interfaces tunnel ${pe1if} address ${pe1ip2}/30
set interfaces tunnel ${pe1if} source-address ${ac1ip2}
set interfaces tunnel ${pe1if} remote ${pe1lo}
set interfaces tunnel ${pe1if} encapsulation gre
set interfaces tunnel ${pe1if} multicast disable
set interfaces tunnel ${pe1if} parameters ip ttl 255
echo '>>>GRE 配置[Backup]<<<'
set interfaces tunnel ${pe2if} description PE2_${pe2}
set interfaces tunnel ${pe2if} address ${pe2ip2}/30
set interfaces tunnel ${pe2if} source-address ${ac2ip2}
set interfaces tunnel ${pe2if} remote ${pe2lo}
set interfaces tunnel ${pe2if} encapsulation gre
set interfaces tunnel ${pe2if} multicast disable
set interfaces tunnel ${pe2if} parameters ip ttl 255
echo '>>>GRE 配置[${natpe1}]<<<'
set interfaces tunnel ${natpe1if} description ${natpe1}
set interfaces tunnel ${natpe1if} address ${natpe1ip2}/30
set interfaces tunnel ${natpe1if} source-address ${natce1lo}
set interfaces tunnel ${natpe1if} remote ${natpe1lo}
set interfaces tunnel ${natpe1if} encapsulation gre
set interfaces tunnel ${natpe1if} multicast disable
set interfaces tunnel ${natpe1if} parameters ip ttl 255`;

smartdnsTemp += `set epoch file-sync task 1 local '/opt/cn.txt'
set epoch file-sync task 1 remote 'http://59.37.126.146:1909/f32x/domainlist/cn_domainlist.last'
set epoch file-sync task 2 local '/opt/oversea.txt'
set epoch file-sync task 2 remote 'http://59.37.126.146:1909/f32x/domainlist/oversea_domainlist.last'
set service dns forwarding allow-from '0.0.0.0/0'
set service dns forwarding cache-size '10000'
set service dns forwarding dnssec 'off'
set service dns forwarding domainlist CN file '/opt/cn.txt'
set service dns forwarding domainlist CN recursion-desired
set service dns forwarding domainlist CN server ${local1dns}
set service dns forwarding domainlist CN server ${local2dns}
set service dns forwarding domainlist CN server '114.114.114.114'
set service dns forwarding domainlist HK file '/opt/oversea.txt'
set service dns forwarding domainlist HK recursion-desired
set service dns forwarding domainlist HK server ${oversea1dns}
set service dns forwarding domainlist HK server ${oversea2dns}
set service dns forwarding listen-address 0.0.0.0
set service dns forwarding name-server ${oversea1dns}
set service dns forwarding name-server ${oversea2dns}`;

dhcpTemp += ``;
    break;
    case "32":
imageTemp += `echo '# 系统降级到3.2.17'
conf
delete system host-name
delete interfaces bridge
delete interfaces ethernet
delete interface openvpn
delete interface tunnel
delete interface loopback lo
delete firewall options interface
delete nat
delete protocols
delete policy
delete traffic-policy
delete track
delete smokeping
delete service dns
delete service dhcp-server
delete system name-server
delete system flow-accounting
set inter eth eth0 add dhcp
commit
exit
sudo wget http://192.168.75.15/FnetOS/vyos-1.2.9-S1-amd64.iso
add system image vyos-1.2.9-S1-amd64.iso
添加系统镜像后重启
reboot
开机后串口9600进入
conf
set inter eth eth0 add dhcp
commit
exit
sudo wget -O /tmp/finit http://59.37.126.146:1909/patching/f3.2.x_init.py
sudo chmod +x /tmp/finit
sudo /tmp/finit
update patch_updater
update patch
update sdwan
sudo useradd -d /var/lib/misc -s /bin/false dnsmasq
sudo echo "" > .bash_history
sudo rm -rf /var/log/wtmp*
sudo rm -rf /config/archive/config.boot*
sudo rm -rf /config/config.boot*
>~/.bash_history
reboot
初始化3.2.17后进入
# paping
sudo  wget ftp://psalesftp:Tfe28@w%@59.36.7.222/Taylorg/fnetos_tools_paping_2020.11.26.deb
sudo dpkg -i fnetos_tools_paping_2020.11.26.deb
# smartping FnetOS 3.2.X && Speedtest.py
wget http://59.37.126.146:1909/f32x/debs/fnetos_smartping_2020.10.23.deb
sudo dpkg -i fnetos_smartping_2020.10.23.deb
# smartdns
# 下载 安装 配置
sudo  wget ftp://psalesftp:Tfe28@w%@59.36.7.222/Taylorg/smartdns.1.2023.03.04-1125.x86_64-debian-all.deb
sudo dpkg -i smartdns.1.2023.03.04-1125.x86_64-debian-all.deb
# 清理安装包
dir
rm -rf *
curl -O https://raw.githubusercontent.com/sivel/speedtest-cli/master/speedtest.py
sudo chmod +x ./speedtest.py
config
del zone-policy
del system login user vyos
del interface ethernet eth1 address
del interface ethernet eth2 address
set interfaces bridge br2 description LAN
set interfaces bridge br2 address 192.168.8.1/24
set interfaces ethernet eth1 bridge-group bridge br2
set interfaces ethernet eth2 bridge-group bridge br2
set interfaces ethernet eth3 bridge-group bridge br2
set interfaces ethernet eth4 bridge-group bridge br2
set interfaces ethernet eth5 bridge-group bridge br2
set system console device ttyS0 speed 115200
set service smartping
commit
save`;
//WAN接口模板
if(wan1=="eth0" || wan1=="eth1"){
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
del interfaces ethernet ${wan1} address
set interfaces ethernet ${wan1} pppoe 1 default-route 'none'
set interfaces ethernet ${wan1} pppoe 1 mtu '1492'
set interfaces ethernet ${wan1} pppoe 1 name-server 'none'
set interfaces ethernet ${wan1} pppoe 1 password ${pppoe1user}
set interfaces ethernet ${wan1} pppoe 1 user-id ${pppoe1pass}
set protocols static interface-route 1.1.1.1/32 next-hop-interface pppoe1`;
    break;
  };
}else if(wan1=="br0" || wan1=="br1"){
switch(wan1Type){
    case "dhcp":
        wanTemp += `set interfaces bridge ${wan1} description WAN1-${wan1Provider}-DHCP
set interfaces bridge ${wan1} address dhcp
set interfaces bridge ${wan1} member interface eth0
set interfaces bridge ${wan1} member interface eth1
set protocols static route 1.1.1.1/32 dhcp-interface ${wan1}`;
    break;
    case "static":
        let wan1ip = $("#wan1_ip_input").val();
        let wan1gw = $("#wan1_gw_input").val();
        wanTemp += `set interfaces bridge ${wan1} description WAN1-${wan1Provider}-GW-${wan1gw}
set interfaces bridge ${wan1} address ${wan1ip}
set interfaces bridge ${wan1} member interface eth0
set interfaces bridge ${wan1} member interface eth1
set protocols static route 1.1.1.1/32 next-hop ${wan1gw}`;
    break;
    case "pppoe":
        let pppoe1user = $("#pppoe1_user_input").val();
        let pppoe1pass = $("#pppoe1_pass_input").val();
        wanTemp += `set interfaces bridge ${wan1} description WAN1_${wan1Provider}_${pppoe1user}/${pppoe1pass}
del interfaces bridge ${wan1} address
set interfaces bridge ${wan1} pppoe 1 default-route 'none'
set interfaces bridge ${wan1} pppoe 1 mtu '1492'
set interfaces bridge ${wan1} pppoe 1 name-server 'none'
set interfaces bridge ${wan1} pppoe 1 password ${pppoe1user}
set interfaces bridge ${wan1} pppoe 1 user-id ${pppoe1pass}
set protocols static interface-route 1.1.1.1/32 next-hop-interface pppoe1`;
    break;
  };
}
//OpenVPN接口模板
openvpnTemp += `echo 'OpenVPN 接入配置[ac1]'
set interfaces openvpn ${ac1if} description AC1_${ac1}
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
#set interfaces openvpn ${ac1if} openvpn-option '--fragment 1300'
set interfaces openvpn ${ac1if} shared-secret-key-file '/config/auth/openvpn.secret'
echo 'OpenVPN 接入配置[ac2]'
set interfaces openvpn ${ac2if} description AC2_${ac2}
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
#set interfaces openvpn ${ac2if} openvpn-option '--fragment 1300'
set interfaces openvpn ${ac2if} shared-secret-key-file '/config/auth/openvpn.secret'`;

greTemp += `echo '>>>GRE 配置[Main]<<<'
set interfaces tunnel ${pe1if} description PE1_${pe1}
set interfaces tunnel ${pe1if} address ${pe1ip2}/30
set interfaces tunnel ${pe1if} local ${ac1ip2}
set interfaces tunnel ${pe1if} remote ${pe1lo}
set interfaces tunnel ${pe1if} encapsulation gre
set interfaces tunnel ${pe1if} multicast disable
set interfaces tunnel ${pe1if} parameters ip ttl 255
echo '>>>GRE 配置[Backup]<<<'
set interfaces tunnel ${pe2if} description PE2_${pe2}
set interfaces tunnel ${pe2if} address ${pe2ip2}/30
set interfaces tunnel ${pe2if} local ${ac2ip2}
set interfaces tunnel ${pe2if} remote ${pe2lo}
set interfaces tunnel ${pe2if} encapsulation gre
set interfaces tunnel ${pe2if} multicast disable
set interfaces tunnel ${pe2if} parameters ip ttl 255
echo '>>>GRE 配置[${natpe1}]<<<'
set interfaces tunnel ${natpe1if} description ${natpe1}
set interfaces tunnel ${natpe1if} address ${natpe1ip2}/30
set interfaces tunnel ${natpe1if} local ${natce1lo}
set interfaces tunnel ${natpe1if} remote ${natpe1lo}
set interfaces tunnel ${natpe1if} encapsulation gre
set interfaces tunnel ${natpe1if} multicast disable
set interfaces tunnel ${natpe1if} parameters ip ttl 255`;

smartdnsTemp +=`set service dns dnsmasq cache-size '9999'
set service dns dnsmasq fnetlink-dns enable
set service dns dnsmasq fnetlink-dns local-isp-dns ${local1dns}
set service dns dnsmasq fnetlink-dns local-isp-dns ${local2dns}
set service dns dnsmasq fnetlink-dns upchinadomain host '59.37.126.146'
set service dns dnsmasq listen-on ${wan1}
set service dns dnsmasq listen-on br2
set service dns dnsmasq name-server ${oversea1dns}
set service dns dnsmasq name-server ${oversea2dns}
del system name-server
set system name-server 192.168.8.1`;
    break;
    case "31":
//WAN接口模板
if(wan1=="eth0" || wan1=="eth1"){
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
del interfaces ethernet ${wan1} address
set interfaces ethernet ${wan1} pppoe 1 default-route 'none'
set interfaces ethernet ${wan1} pppoe 1 mtu '1492'
set interfaces ethernet ${wan1} pppoe 1 name-server 'none'
set interfaces ethernet ${wan1} pppoe 1 password ${pppoe1user}
set interfaces ethernet ${wan1} pppoe 1 user-id ${pppoe1pass}
set protocols static interface-route 1.1.1.1/32 next-hop-interface pppoe1`;
    break;
  };
}else if(wan1=="br0" || wan1=="br1"){
switch(wan1Type){
    case "dhcp":
        wanTemp += `set interfaces bridge ${wan1} description WAN1-${wan1Provider}-DHCP
set interfaces bridge ${wan1} address dhcp
set interfaces bridge ${wan1} member interface eth0
set interfaces bridge ${wan1} member interface eth1
set protocols static route 1.1.1.1/32 dhcp-interface ${wan1}`;
    break;
    case "static":
        let wan1ip = $("#wan1_ip_input").val();
        let wan1gw = $("#wan1_gw_input").val();
        wanTemp += `set interfaces bridge ${wan1} description WAN1-${wan1Provider}-GW-${wan1gw}
set interfaces bridge ${wan1} address ${wan1ip}
set interfaces bridge ${wan1} member interface eth0
set interfaces bridge ${wan1} member interface eth1
set protocols static route 1.1.1.1/32 next-hop ${wan1gw}`;
    break;
    case "pppoe":
        let pppoe1user = $("#pppoe1_user_input").val();
        let pppoe1pass = $("#pppoe1_pass_input").val();
        wanTemp += `set interfaces bridge ${wan1} description WAN1_${wan1Provider}_${pppoe1user}/${pppoe1pass}
del interfaces bridge ${wan1} address
set interfaces bridge ${wan1} pppoe 1 default-route 'none'
set interfaces bridge ${wan1} pppoe 1 mtu '1492'
set interfaces bridge ${wan1} pppoe 1 name-server 'none'
set interfaces bridge ${wan1} pppoe 1 password ${pppoe1user}
set interfaces bridge ${wan1} pppoe 1 user-id ${pppoe1pass}
set protocols static interface-route 1.1.1.1/32 next-hop-interface pppoe1`;
    break;
  };
}
//OpenVPN接口模板
openvpnTemp += `echo 'OpenVPN 接入配置[ac1]'
set interfaces openvpn ${ac1if} description AC1_${ac1}
set interfaces openvpn ${ac1if} local-address ${ac1ip2} subnet-mask 255.255.255.252
set interfaces openvpn ${ac1if} remote-address ${ac1ip1}
set interfaces openvpn ${ac1if} remote-host ${ac1pub}
set interfaces openvpn ${ac1if} remote-port ${ac1port}
set interfaces openvpn ${ac1if} mode site-to-site-client
set interfaces openvpn ${ac1if} protocol udp
set interfaces openvpn ${ac1if} openvpn-option 'persist-tun'
set interfaces openvpn ${ac1if} openvpn-option '--persist-tun'
#set interfaces openvpn ${ac1if} openvpn-option 'tun-mtu 1420'
set interfaces openvpn ${ac1if} shared-secret-key-file '/config/auth/openvpn.secret'
echo 'OpenVPN 接入配置[ac2]'
set interfaces openvpn ${ac2if} description AC2_${ac2}
set interfaces openvpn ${ac2if} local-address ${ac2ip2} subnet-mask 255.255.255.252
set interfaces openvpn ${ac2if} remote-address ${ac2ip1}
set interfaces openvpn ${ac2if} remote-host ${ac2pub}
set interfaces openvpn ${ac2if} remote-port ${ac2port}
set interfaces openvpn ${ac1if} mode site-to-site-client
set interfaces openvpn ${ac2if} protocol udp
set interfaces openvpn ${ac2if} openvpn-option 'persist-tun'
set interfaces openvpn ${ac2if} openvpn-option '--persist-tun'
#set interfaces openvpn ${ac2if} openvpn-option 'tun-mtu 1420'
set interfaces openvpn ${ac2if} shared-secret-key-file '/config/auth/openvpn.secret'`;

greTemp += `echo '>>>GRE 配置[Main]<<<'
set interfaces tunnel ${pe1if} description PE1_${pe1}
set interfaces tunnel ${pe1if} address ${pe1ip2}/30
set interfaces tunnel ${pe1if} local-ip ${ac1ip2}
set interfaces tunnel ${pe1if} remote-ip ${pe1lo}
set interfaces tunnel ${pe1if} encapsulation gre
set interfaces tunnel ${pe1if} multicast disable
set interfaces tunnel ${pe1if} parameters ip ttl 255
echo '>>>GRE 配置[Backup]<<<'
set interfaces tunnel ${pe2if} description PE2_${pe2}
set interfaces tunnel ${pe2if} address ${pe2ip2}/30
set interfaces tunnel ${pe2if} local-ip ${ac2ip2}
set interfaces tunnel ${pe2if} remote-ip ${pe2lo}
set interfaces tunnel ${pe2if} encapsulation gre
set interfaces tunnel ${pe2if} multicast disable
set interfaces tunnel ${pe2if} parameters ip ttl 255
echo '>>>GRE 配置[${natpe1}]<<<'
set interfaces tunnel ${natpe1if} description ${natpe1}
set interfaces tunnel ${natpe1if} address ${natpe1ip2}/30
set interfaces tunnel ${natpe1if} local-ip ${natce1lo}
set interfaces tunnel ${natpe1if} remote-ip ${natpe1lo}
set interfaces tunnel ${natpe1if} encapsulation gre
set interfaces tunnel ${natpe1if} multicast disable
set interfaces tunnel ${natpe1if} parameters ip ttl 255`;

smartdnsTemp +=`set service dns forwarding cache-size '9999'
set service dns forwarding fnetlink-dns 'enable'
set service dns forwarding fnetlink-dns local-isp-dns ${local1dns}
set service dns forwarding fnetlink-dns local-isp-dns ${local2dns}
set service dns forwarding fnetlink-dns upchinadomain host '59.37.126.146'
set service dns forwarding fnetlink-dns upchinadomain uptime hour '0'
set service dns forwarding fnetlink-dns upchinadomain uptime min '0'
set service dns forwarding listen-on ${wan1}
set service dns dnsmasq listen-on br2
set service dns forwarding name-server ${oversea1dns}
set service dns forwarding name-server ${oversea2dns}`;
    break;
  };

let fastip106fastipGreOverOpenvpn  = String.raw
`#Fnet MPLS with GRE Over OpenVPN Tiktok Template.
#操作人员：${user}
#时间：${time.cn}
#系统：vyui-v2
#FnetOS Version ${version}
+++++++++++++++++++++++++++++++++++++++++++
${imageTemp}
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
set firewall name VPN2LOCAL default-action 'accept'
set firewall name VPN2LOCAL rule 1000 action 'accept'
set firewall name VPN2LOCAL rule 1000 source group network-group 'GROUP-FNET-Whitelist'
set firewall name VPN2LOCAL rule 2000 action 'drop'
set firewall name VPN2LOCAL rule 2000 destination port '179,2707,53,161,123,8899'
set firewall name VPN2LOCAL rule 2000 protocol 'tcp_udp'
set firewall name VPN2LOCAL rule 3000 action 'drop'
set firewall name VPN2LOCAL rule 3000 destination port '22,80,135,137,138,139,443,445,1080'
set firewall name VPN2LOCAL rule 3000 protocol 'tcp_udp'
set firewall name VPN2LOCAL rule 4000 action 'drop'
set firewall name VPN2LOCAL rule 4000 destination port '1723,3124,3127,3128,3389,5000,8080,31337'
set firewall name VPN2LOCAL rule 4000 protocol 'tcp_udp'
set interfaces ethernet ${wan1} firewall local name 'WAN2LOCAL'
set interfaces tunnel ${pe1if} firewall local name 'WAN2LOCAL'
set interfaces tunnel ${pe2if} firewall local name 'WAN2LOCAL'
set interfaces tunnel ${natpe1if} firewall local name 'VPN2LOCAL'
set system host-name ${lineid}-${cname}-${area}
set service snmp community both-win authorization 'ro'
set interfaces loopback lo address ${natce1lo}/32
set interfaces loopback lo address ${oversea1ip1}/32
${wanTemp}
${openvpnTemp}
${greTemp}
echo '>>>MTU TCP-MSS配置[interface] 看情况配置<<<'
# set firewall options interface ${ac1if} adjust-mss 1300
# set firewall options interface ${ac2if} adjust-mss 1300
# set firewall options interface ${pe1if} adjust-mss 1300
# set firewall options interface ${pe2if} adjust-mss 1300
# set firewall options interface ${natpe1if} adjust-mss 1300
# set interfaces tunnel ${natpe1if} mtu 1360
echo '>>>路由配置[Track 默认路由，对接公网路由，内网路由]<<<'
set protocols static route 223.5.5.5/32 next-hop 1.1.1.1
set track name to-223 failure-count 2
set track name to-223 success-count 2
set track name to-223 test 10 resp-time 5
set track name to-223 test 10 target 223.5.5.5
set track name to-223 test 10 ttl-limit 1
set track name to-223 test 10 type ping
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
echo '>>>二次GRE路由1<<<'
set protocols static route ${natpe1lo}/32 next-hop ${pe1ip1} track to-main
set protocols static route ${natpe1lo}/32 next-hop ${pe2ip1} distance 5
echo '>>>海外DNS路由<<<'
set protocols static route ${oversea1dns}/32 next-hop ${natpe1ip1}
set protocols static route ${oversea2dns}/32 next-hop ${natpe1ip1}

set protocols static route 114.113.245.99/32 next-hop ${pe1ip1}
set protocols static route 114.113.245.100/32 next-hop ${pe2ip1}
set protocols static route 192.168.55.125/32 next-hop ${pe1ip1} track to-main
set protocols static route 192.168.55.125/32 next-hop ${pe2ip1} distance 5
set protocols static route 192.168.55.250/32 next-hop ${pe1ip1} track to-main
set protocols static route 192.168.55.250/32 next-hop ${pe2ip1} distance 5
echo '5G WIFI SSID: sdwan PASSWD: 123456@sdwan'
set interfaces wireless wlan1 address '192.168.9.1/24'
set interfaces wireless wlan1 channel '0'
set interfaces wireless wlan1 country-code 'cn'
set interfaces wireless wlan1 dhcp-options client-id 'sdwan'
set interfaces wireless wlan1 hw-id 'cc:d3:9d:99:ff:61'
set interfaces wireless wlan1 mode 'ac'
set interfaces wireless wlan1 physical-device 'phy0'
set interfaces wireless wlan1 security wpa mode 'wpa2'
set interfaces wireless wlan1 security wpa passphrase '123456@sdwan'
set interfaces wireless wlan1 ssid 'sdwan'
set interfaces wireless wlan1 type 'access-point'
echo '2.4G WIFI 600M传输距离远'
set interfaces wireless wlan1 mode 'n'
echo 'LAN DHCP Server Range: 2-100'
#[4.0]set service dhcp-server shared-network-name dhcp_br2 subnet 192.168.8.0/24 description 'dhcp_br2'
set service dhcp-server shared-network-name dhcp_br2 subnet 192.168.8.0/24 default-router '192.168.8.1'
set service dhcp-server shared-network-name dhcp_br2 subnet 192.168.8.0/24 lease '7200'
set service dhcp-server shared-network-name dhcp_br2 subnet 192.168.8.0/24 dns-server 192.168.8.1
#[4.0]set service dhcp-server shared-network-name dhcp_br2 subnet 192.168.8.0/24 name-server 192.168.8.1
set service dhcp-server shared-network-name dhcp_br2 subnet 192.168.8.0/24 range 0 start '192.168.8.2'
set service dhcp-server shared-network-name dhcp_br2 subnet 192.168.8.0/24 range 0 stop '192.168.8.100'
echo 'WIFI DHCP Server Range: 2-100'
#[4.0]set service dhcp-server shared-network-name dhcp_wlan1 subnet 192.168.9.0/24 description 'dhcp_wlan1'
set service dhcp-server shared-network-name dhcp_wlan1 subnet 192.168.9.0/24 default-router '192.168.9.1'
set service dhcp-server shared-network-name dhcp_wlan1 subnet 192.168.9.0/24 lease '7200'
set service dhcp-server shared-network-name dhcp_wlan1 subnet 192.168.9.0/24 dns-server 192.168.9.1
#[4.0]set service dhcp-server shared-network-name dhcp_wlan1 subnet 192.168.9.0/24 name-server 192.168.9.1
set service dhcp-server shared-network-name dhcp_wlan1 subnet 192.168.9.0/24 range 0 start '192.168.9.2'
set service dhcp-server shared-network-name dhcp_wlan1 subnet 192.168.9.0/24 range 0 stop '192.168.9.100'
echo '192.168.9.101  54:05:db:b4:4a:41 dhcp_wlan1  iPhone'
set service dhcp-server shared-network-name dhcp_wlan1 subnet 192.168.9.0/24 static-mapping 101 ip-address '192.168.9.101'
set service dhcp-server shared-network-name dhcp_wlan1 subnet 192.168.9.0/24 static-mapping 101 mac-address '54:05:db:b4:4a:41'
set service dhcp-server shared-network-name dhcp_wlan1 subnet 192.168.9.0/24 static-mapping 101 static-mapping-parameters 'option domain-name-servers ${oversea1dns}, ${oversea2dns};'
echo '192.168.8.101  55:05:db:b4:4a:40 dhcp_br2  iPhone'
set service dhcp-server shared-network-name dhcp_br2 subnet 192.168.8.0/24 static-mapping 1101 ip-address '192.168.8.101'
set service dhcp-server shared-network-name dhcp_br2 subnet 192.168.8.0/24 static-mapping 1101 mac-address '55:05:db:b4:4a:43'
set service dhcp-server shared-network-name dhcp_br2 subnet 192.168.8.0/24 static-mapping 1101 static-mapping-parameters 'option domain-name-servers ${oversea1dns}, ${oversea2dns};'
echo 'Table 100 to ${natpe1}'
set protocols static table 100 route 0.0.0.0/0 next-hop ${natpe1ip1}
set policy local-route rule 101 set table '100'
set policy local-route rule 101 source '192.168.9.101'
#
echo '>>>本地NAT<<<'
set nat source rule 100 outbound-interface 'eth0'
set nat source rule 100 translation address 'masquerade'
echo '# 海外NAT'
set nat source rule 1999 outbound-interface ${natpe1if}
set nat source rule 1999 translation address ${oversea1ip1}
echo '# MAC 绑定 多IP时绑定<<<'
# set nat source rule 101 source address 192.168.9.101/32
# set nat source rule 101 outbound-interface ${natpe1if}
# set nat source rule 101 translation address ${oversea1ip1}
##############
如果客户需要BGP分流
echo '>>>动态路由配置[BGP]<<<'
set protocols static route ${bgp1server1}/32 next-hop ${pe1ip1}
set protocols static route ${bgp1server2}/32 next-hop ${pe1ip1}
set protocols static route ${bgp1server3}/32 next-hop ${pe2ip1}
set protocols static route ${bgp1server4}/32 next-hop ${pe2ip1}
set policy community-list 80 rule 10 action 'permit'
set policy community-list 80 rule 10 description 'to_hk'
set policy community-list 80 rule 10 regex '65000:9939'
set policy community-list 81 rule 10 action 'permit'
set policy community-list 81 rule 10 description 'to_ct'
set policy community-list 81 rule 10 regex '65000:4134'
set policy community-list 82 rule 10 action 'permit'
set policy community-list 82 rule 10 description 'to_cnc'
set policy community-list 82 rule 10 regex '65000:4837'
set policy community-list 83 rule 10 action 'permit'
set policy community-list 83 rule 10 description 'to_cn_other'
set policy community-list 83 rule 10 regex '65000:9808'
set policy route-map bgp-from--RSVR rule 100 action 'permit'
set policy route-map bgp-from--RSVR rule 100 description 'to_hk'
set policy route-map bgp-from--RSVR rule 100 match community community-list '80'
set policy route-map bgp-from--RSVR rule 100 set ip-next-hop ${natpe1ip1}
set policy route-map bgp-from--RSVR rule 200 action 'permit'
set policy route-map bgp-from--RSVR rule 200 description 'to_ct'
set policy route-map bgp-from--RSVR rule 200 match community community-list '81'
set policy route-map bgp-from--RSVR rule 200 set ip-next-hop 1.1.1.1
set policy route-map bgp-from--RSVR rule 300 action 'permit'
set policy route-map bgp-from--RSVR rule 300 description 'to_cnc'
set policy route-map bgp-from--RSVR rule 300 match community community-list '82'
set policy route-map bgp-from--RSVR rule 300 set ip-next-hop 1.1.1.1
set policy route-map bgp-from--RSVR rule 400 action 'permit'
set policy route-map bgp-from--RSVR rule 400 description 'to_cn_other'
set policy route-map bgp-from--RSVR rule 400 match community community-list '83'
set policy route-map bgp-from--RSVR rule 400 set ip-next-hop 1.1.1.1
set policy route-map bgp-from--RSVR2 rule 100 action 'permit'
set policy route-map bgp-from--RSVR2 rule 100 description 'to_hk'
set policy route-map bgp-from--RSVR2 rule 100 match community community-list '80'
set policy route-map bgp-from--RSVR2 rule 100 set ip-next-hop ${natpe1ip1}
set policy route-map bgp-from--RSVR2 rule 100 set local-preference '50'
set policy route-map bgp-from--RSVR2 rule 200 action 'permit'
set policy route-map bgp-from--RSVR2 rule 200 description 'to_ct'
set policy route-map bgp-from--RSVR2 rule 200 match community community-list '81'
set policy route-map bgp-from--RSVR2 rule 200 set ip-next-hop 1.1.1.1
set policy route-map bgp-from--RSVR2 rule 200 set local-preference '50'
set policy route-map bgp-from--RSVR2 rule 300 action 'permit'
set policy route-map bgp-from--RSVR2 rule 300 description 'to_cnc'
set policy route-map bgp-from--RSVR2 rule 300 match community community-list '82'
set policy route-map bgp-from--RSVR2 rule 300 set ip-next-hop 1.1.1.1
set policy route-map bgp-from--RSVR2 rule 300 set local-preference '50'
set policy route-map bgp-from--RSVR2 rule 400 action 'permit'
set policy route-map bgp-from--RSVR2 rule 400 description 'to_cn_other'
set policy route-map bgp-from--RSVR2 rule 400 match community community-list '83'
set policy route-map bgp-from--RSVR2 rule 400 set ip-next-hop 1.1.1.1
set policy route-map bgp-from--RSVR2 rule 400 set local-preference '50'
set protocols bgp 65000 neighbor ${bgp1server1} peer-group 'RSVR'
set protocols bgp 65000 neighbor ${bgp1server2} peer-group 'RSVR'
set protocols bgp 65000 neighbor ${bgp1server3} peer-group 'RSVR2'
set protocols bgp 65000 neighbor ${bgp1server4} peer-group 'RSVR2'
set protocols bgp 65000 parameters router-id ${pe1ip2}
set protocols bgp 65000 peer-group RSVR address-family ipv4-unicast route-map import 'bgp-from--RSVR'
set protocols bgp 65000 peer-group RSVR address-family ipv4-unicast soft-reconfiguration inbound
set protocols bgp 65000 peer-group RSVR remote-as '65000'
set protocols bgp 65000 peer-group RSVR update-source ${pe1ip2}
set protocols bgp 65000 peer-group RSVR2 address-family ipv4-unicast route-map import 'bgp-from--RSVR2'
set protocols bgp 65000 peer-group RSVR2 address-family ipv4-unicast soft-reconfiguration inbound
set protocols bgp 65000 peer-group RSVR2 remote-as '65000'
set protocols bgp 65000 peer-group RSVR2 update-source ${pe2ip2}
set protocols bgp 65000 timers holdtime '15'
set protocols bgp 65000 timers keepalive '60'
echo '# 分流DNS配置<<<'
${smartdnsTemp}
delete system name-server
set system name-server 192.168.8.1
###SmartDNS 解决TK直播解析问题###
echo '# CE ETH5接口192.168.9.1/24'
config
del interfaces ethernet eth5 bridge-group bridge 'br2'
#[v4.0]del interfaces bridge br2 member interface eth5
set interfaces ethernet eth5 address '192.168.9.1/24'
set interfaces ethernet eth5 desc 'WIFI-LAN'
delete system name-server
set system name-server ${oversea1dns}
set system name-server ${oversea2dns}
commit
exit
echo '# 上游server需要选择当地DNS，示例为美国区域DNS'
sudo  wget ftp://psalesftp:Tfe28@w%@59.36.7.222/Taylorg/smartdns.1.2023.03.04-1125.x86_64-debian-all.deb
sudo dpkg -i smartdns.1.2023.03.04-1125.x86_64-debian-all.deb
sudo chmod 777 /etc/smartdns/smartdns.conf
sudo sed -i "s/^[^#]*:53$/#&/g" /etc/smartdns/smartdns.conf
sudo echo -e 'bind 127.0.0.1:5353 -no-cache
force-AAAA-SOA yes
speed-check-mode ping,tcp:80,tcp:443
server-https https://dns.google/dns-query
server-https https://cloudflare-dns.com/dns-query' >> /etc/smartdns/smartdns.conf
echo '# 开启SmartDNS'
sudo systemctl enable smartdns
sudo systemctl start smartdns
sudo systemctl status smartdns
sudo netstat -tunlp | grep smartdns
echo '# 策略路由 全局海外'
set protocols static table 100 route 0.0.0.0/0 next-hop ${natpe1ip1}
set policy route lanMap rule 10 set table '100'
set policy route lanMap rule 10 source address '192.168.9.0/24'
set interfaces ethernet eth5 policy route lanMap
echo '# dns 5353 劫持'
set nat destination rule 53 destination address '127.0.0.1'
set nat destination rule 53 destination port '53'
set nat destination rule 53 inbound-interface 'eth5'
set nat destination rule 53 protocol 'tcp_udp'
set nat destination rule 53 source address '192.168.9.0/24'
set nat destination rule 53 translation port '5353'
echo '# 测试SmartDNS'
sudo nslookup www.tiktok.com 127.0.0.1 -port=5353
echo '# 登录消息[banner]'
set system login banner post-login "################ \n\
SN: E1X16225005xxxxxxxx \n\
版本: FnetOS 3.2.17 @ vyos-1.2.9-S1 \n\
服务: FastIP GZ 10M \n\
公网: ETH0 DHCP \n\
内网: BR2 192.168.8.1/24 SmartDNS ON?OFF? \n\
拓扑：WIFI路由器---CE路由器---光猫 \n\
安装人员: ${user} \n\
最后修改: ${user} ${time.cn} \n\
################"

###########
#  测试   #
###########
IP/环境监测
区域
https://ipinfo.io/${oversea1ip1}
类型
ISP > Business > hosting
AS号
https://bgp.he.net
whoer.net 100%
https://whoer.net
污染度     < 50%
https://scamalytics.com
Ping测试：
sudo ping ${ac1ip1} -i 0.1 -c 100 -q -s 1500
sudo ping ${ac2ip1} -i 0.1 -c 100 -q
sudo ping ${pe1ip1} -i 0.1 -c 100 -q -s 1500
sudo ping ${pe2ip1} -i 0.1 -c 100 -q -s 1500
sudo ping ${natpe1ip1} -i 0.1 -c 100 -q -s 1500
sudo ping www.yahoo.com -i 0.1 -c 100 -q -s 1500
网站测速:
https://www.speedtest.net
https://fast.com
https://www.att.com/support/speedtest
SmartPing监控：
阿里DNS：223.5.5.5
谷歌DNS：8.8.8.8
主线Pub: ${ac1pub}
备线Pub: ${ac2pub}
${natpe1}: ${natpe1ip1}
`;
  let filename = `${lineid}-Fast-SD-WAN-GREOverGRE-Config-${time.ez}-By-${user}`;
  let data = {};
  console.log(fastip106fastipGreOverOpenvpn);
  downloadConfig(filename, fastip106fastipGreOverOpenvpn);
  let type = 'post'
  let datatype = 'json';
  ajaxHandler(url,data,datatype,type);
};