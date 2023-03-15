/* FastIP 华为路由器 单运营商 */
const fastip003html = `<table border="1">
<tr>
<td>LineID</td>
<td><input id="lineid_input" placeholder="线路ID"></td>
<td><select id="version_select">
<option value="32" selected="selected">FnetOS[ 3.2 ]</option>
<option value="40">FnetOS[ 4.0 ]</option>
<option value="31">FnetOS[ 3.1 ]</option></select></td>
</tr>
<tr>
<td>Company</td>
<td><input id="cname_input" placeholder="CompanyName[eg:Huawei]"></td>
<td><input id="area_input" placeholder="Area[GZ,SZ,SH,etc...]"></td></tr>
<tr>
<td>WAN1</td>
<td><select id="wan1_select">
<option value="G0/0/8" selected="selected">WAN-G0/0/8</option>
<option value="G0/0/9">WAN-G0/0/9</option>
<option value="G0/0/10">WAN-G0/0/10</option></select>
<select id="wan1_provider_select">
<option value="CT" selected="selected">电信</option>
<option value="CU">联通</option>
<option value="CM">移动</option></select></td>
<td><select id="wan1_type_select" onchange=fastip003setWan1(this.value)>
<option value="static" selected="selected">WAN Type[ Static ]</option>
<option value="dhcp">WAN Type[ DHCP ]</option>
<option value="pppoe">WAN Type[ PPPoE ]</option></select></td>
</tr>
<tr id="wan1_input_tr"></tr>
<tr>
<td>LocalDNS</td>
<td><input id="local_dns1_input" placeholder="本地DNS1[eg:223.5.5.5]" value="223.5.5.5"></td>
<td><input id="local_dns2_input" placeholder="本地DNS2[eg:223.6.6.6]" value="223.6.6.6"></td>
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
<td>PE</td>
<td><input id="pe1_input" placeholder="PE1[eg:gzd-acvpnpe1]"></td>
<td><input id="pe2_input" placeholder="PE2[eg:szd-acvpnpe1]"></td>
</tr>
<tr>
<td>PE IF</td>
<td><input id="pe1_if_input" placeholder="PE1IF[eg:vtun1000]"></td>
<td><input id="pe2_if_input" placeholder="PE2IF[eg:vtun2000]"></td>
</tr>
<tr>
<td>PE IP</td>
<td><input id="pe1_ip_input" placeholder="PE1IP[eg:10.x.x.x/30]"></td>
<td><input id="pe2_ip_input" placeholder="PE2IP[eg:10.x.x.x/30]"></td>
</tr>
<tr>
<td>PE Lo</td>
<td><input id="pe1_lo_input" placeholder="PE1Lo[eg:x.x.x.x]"></td>
<td><input id="pe2_lo_input" placeholder="PE2Lo[eg:x.x.x.x]"></td>
</tr>
<tr>
<td>CE Lo</td>
<td><input id="ce1_lo_input" placeholder="CE1Lo[eg:x.x.x.x]"></td>
<td><input id="ce2_lo_input" placeholder="CE2Lo[eg:x.x.x.x]"></td>
</tr>
<tr>
<td>BGP Lo</td>
<td><input id="bgp1_lo_input" placeholder="CE1Lo[eg:x.x.x.x]"></td>
<td><input id="bgp2_lo_input" placeholder="CE2Lo[eg:x.x.x.x]"></td>
</tr>
<td>OverseaIP</td>
<td><input id="pe1_oversea_input" placeholder="海外IP[eg:10.x.x.x-x.x.x.x]"></td>
<td><input id="pe2_oversea_input" placeholder="海外IP[eg:10.x.x.x-x.x.x.x]"></td>
</tr>
<tr>
<td>AC Pub</td>
<td><input id="ac1_pub_input" placeholder="AC1Pub[eg:x.x.x.x]"></td>
<td><input id="ac2_pub_input" placeholder="AC2Pub[eg:x.x.x.x]"></td>
</tr>
<tr>
<td>AC PSK</td>
<td><input id="ac1_psk_input" placeholder="AC1Psk[eg:xxx]"></td>
<td><input id="ac2_psk_input" placeholder="AC2Psk[eg:xxx]"></td>
</tr>
<tr>

</table>
<button type="button" onclick="fastip003sub('/config')">提交配置信息(Submit Config Info)</button>
`;

function fastip003getList() {
//空格全角分号去除
    let str = $("#config_textarea").val().replaceAll(' ','').replaceAll('：',':').replaceAll(';','');
    if(str.length>32){
    let lines = str.split(/\r?\n/);
    let info_json = {
                "id":[],
                "pe":[],
                "if":[],
                "ip":[],
                "pelo":[],
                "celo":[],
                "bgplo":[],
                "pub":[],
                "psk":[],
                "bgp":[],
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
                    info_json.pe.push(l1);
                    break;
                case '主pe':
                    info_json.pe.push(l1);
                    break;
                case 'pe对接':
                    info_json.pelo.push(l1);
                    break;
                case 'pedocking':
                    info_json.pelo.push(l1);
                    break;
                case 'cedocking':
                    info_json.celo.push(l1);
                    break;
                case 'ce对接':
                    info_json.celo.push(l1);
                    break;
                case 'celoip':
                    info_json.bgplo.push(l1);
                    break;
                case 'tunnel':
                    info_json.if.push(l1);
                    break;
                case 'wanip':
                    info_json.ip.push(l1);
                    break;
                case '拨号ip':
                    info_json.pub.push(l1);
                    break;
                case '拨号':
                    info_json.pub.push(l1);
                    break;
                case '秘钥':
                    info_json.psk.push(l1);
                    break;
                case 'docking':
                    info_json.pub.push(l1);
                    break;
                case 'hkip':
                    info_json.oversea.push(l1);
                    break;
                case 'bgpserverip':
                    let bgp = l1.split(",");
                    info_json.bgp.push(bgp[0]);
                    info_json.bgp.push(bgp[1]);
                    break;
                default:
                    info_json.other.push(l1);
            };
        }
    };
    console.log(info_json);
    $("#lineid_input").val(info_json.id[0].substr(0,7));
    $("#pe1_input").val(info_json.pe[0]);
    $("#pe1_if_input").val(info_json.if[0]);
    $("#pe1_ip_input").val(info_json.ip[0]);
    $("#pe1_lo_input").val(info_json.pelo[0]);
    $("#ce1_lo_input").val(info_json.celo[0]);
    $("#bgp1_lo_input").val(info_json.bgplo[0]);
    $("#pe1_oversea_input").val(info_json.oversea[0]);
    $("#ac1_input").val(info_json.pe[1]);
    $("#ac1_if_input").val(info_json.if[1]);
    $("#ac1_ip_input").val(info_json.ip[1]);
    $("#ac1_pub_input").val(info_json.pub[0]);

    $("#pe2_input").val(info_json.pe[2]);
    $("#pe2_if_input").val(info_json.if[1]);
    $("#pe2_ip_input").val(info_json.ip[1]);
    $("#pe2_lo_input").val(info_json.pelo[2]);
    $("#ce2_lo_input").val(info_json.celo[3]);
    $("#bgp2_lo_input").val(info_json.bgplo[1]);
    $("#pe2_oversea_input").val(info_json.oversea[0]);
    $("#ac2_input").val(info_json.pe[3]);
    $("#ac2_if_input").val(info_json.if[3]);
    $("#ac2_ip_input").val(info_json.ip[3]);
    $("#ac2_pub_input").val(info_json.pub[1]);
  };
};

$("#service_dev").append(fastip003html);
//加载测试资源的解析数据
fastip003getList();

function fastip003setWan1(value){
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

function fastip003sub(url){
  let time = getTime(new Date());
  let user = $("#user_input").val();
  let wan1 = $("#wan1_select").val();
  let wan1Type = $("#wan1_type_select").val();
  let wan1Provider = $("#wan1_provider_select").val();

  let version = $("#version_select").val();
  let lineid = $("#lineid_input").val();
  let cnameEN = $("#cname_input").val();
  let area = $("#area_input").val();
  let local1dns = $("#local1_dns_input").val();
  let local2dns = $("#local2_dns_input").val();
  let oversea1dns = $("#oversea1_dns_input").val();
  let oversea2dns = $("#oversea2_dns_input").val();
  let bpg1lo = $("#bgp1_lo_input").val();
  let bgp1server1 = $("#bgp_server1_input").val();
  let bgp1server2 = $("#bgp_server2_input").val();
  let bgp1server3 = $("#bgp_server3_input").val();
  let bgp1server4 = $("#bgp_server4_input").val();
  let oversea1ips = $("#pe1_oversea_input").val().split(',')[0];
  let oversea1ip1 = oversea1ips.split(',')[0].split('-')[0];

  let pe1 = $("#pe1_input").val();
  let pe1if = $("#pe1_if_input").val();
  let pe1ips = ipNext($("#pe1_ip_input").val().split('/')[0]);
  let pe1ip1 = pe1ips[0];
  let pe1ip2 = pe1ips[1];
  let pe1lo = $("#pe1_lo_input").val();
  let ce1lo = $("#ce1_lo_input").val();
  let ac1 = $("#ac1_input").val();
  let ac1pub = $("#ac1_pub_input").val();
  let ac1psk = $("#ac1_psk_input").val();

  let pe2 = $("#pe2_input").val();
  let pe2if = $("#pe2_if_input").val();
  let pe2ips = ipNext($("#pe2_ip_input").val().split('/')[0]);
  let pe2ip1 = pe2ips[0];
  let pe2ip2 = pe2ips[1];
  let pe2lo = $("#pe2_lo_input").val();
  let ce2lo = $("#ce2_lo_input").val();
  let ac2 = $("#ac2_input").val();
  let ac2pub = $("#ac2_pub_input").val();
  let ac2psk = $("#ac2_psk_input").val();
//差异化配置生成
let wan1Temp = '';
switch(wan1Type){
    case "dhcp":
        wan1Temp += `interface ${wan1}
description WAN1-${wan1Provider}
ip address dhcp
undo ipv6 enable`;
    break;
    case "static":
        let wan1ip = $("#wan1_ip_input").val();
        let wan1gw = $("#wan1_gw_input").val();
        wan1Temp += `interface ${wan1}
description WAN1-${wan1Provider}
ip address ${wan1ip}
undo ipv6 enable
ip route-static ${ac1pub} 32 ${wan1gw}
ip route-static ${ac2pub} 32 ${wan1gw}
ip route-static ${pe1lo} 32 ${wan1gw}
ip route-static ${pe2lo} 32 ${wan1gw}
ip route-static 0.0.0.0 0.0.0.0 ${wan1gw} preference 220`;
    break;
    case "pppoe":
        let pppoe1user = $("#pppoe1_user_input").val();
        let pppoe1pass = $("#pppoe1_pass_input").val();
        wan1Temp += `interface ${wan1}
description WAN1-${wan1Provider}
ip address ${wan1ip}
undo ipv6 enable
ip route-static ${ac1pub} 32 ${wan1gw}
ip route-static ${ac2pub} 32 ${wan1gw}
ip route-static ${pe1lo} 32 ${wan1gw}
ip route-static ${pe2lo} 32 ${wan1gw}
ip route-static 0.0.0.0 0.0.0.0 ${wan1gw} preference 220`;
    break;
  };


let fastip003fastipOpenvpn  =
`#Fnetlink FastIP Template.
#操作人员：${user}
#时间：${time.cn}
#系统：vyui-v1
#Huawei Router Version ${version}
+++++++++++++++++++++++++++++++++++++++++++
#init router
set factory-configuration from default
#当前设置保存为出厂设置    Y
factory-configuration reset
#确认还原出厂设置   Y
reboot
#不保存配置到下次启动     N
#确认重启   Y
#
sys
telnet server enable
sysname 603389I1-YaTeLan-CE1
aaa
undo local-user admin
local-user bothwin password irreversible-cipher $1a$~~7t1fmR'#$J*6DOVsDKHMDcd67rT8Mv)z3<>JYaVlU5u@u\m%G$
local-user bothwin privilege level 15
local-user bothwin service-type telnet terminal ssh http

acl number 2707
rule 10 permit source 192.168.0.0 0.0.255.255
rule 20 permit source 172.16.0.0 0.15.255.255
rule 30 permit source 10.0.0.0 0.255.255.255
rule 40 permit source 114.112.238.8 0.0.0.7
rule 50 permit source 192.168.55.250 0
rule 60 permit source 113.105.190.147 0
rule 70 permit source 202.104.174.178 0
rule 80 permit source 120.76.31.146 0
rule 90 permit source 59.37.126.140 0
rule 100 permit source 183.61.239.168 0

user-interface vty 0 4
acl 2707 inbound
authentication-mode aaa
user privilege level 15
ntp-service enable
ntp-service unicast-server 192.168.55.250


# AAA配置
hwtacacs-server template fnetlink_tacacs
hwtacacs-server authentication 192.168.55.250
hwtacacs-server authorization 192.168.55.250
hwtacacs-server accounting 192.168.55.250
# 设定认证源IP
# hwtacacs-server source-ip 192.168.247.10
hwtacacs-server shared-key cipher bothwin

aaa
authentication-scheme fnet_tac
authentication-mode hwtacacs local
authorization-scheme fnet_tac
authorization-mode hwtacacs local
authorization-cmd 15 hwtacacs local
accounting-scheme fnet_tac

accounting start-fail online
accounting interim-fail online
accounting-mode hwtacacs
recording-scheme fnet_tac
recording-mode hwtacacs fnetlink_tacacs
cmd recording-scheme fnet_tac
service-scheme fnet_tac
admin-user privilege level 15
domain fnet_tac
authentication-scheme fnet_tac
accounting-scheme fnet_tac
authorization-scheme fnet_tac
hwtacacs-server fnetlink_tacacs
domain fnet_tac admin

#################################
stelnet server enable
ssh server permit interface all
aaa
 local-user bothwin password irreversible-cipher Tfe28@w%
 local-user bothwin service-type terminal ssh
 local-user bothwin privilege level 15
 Y
 undo local-aaa-user password policy administrator
 local-user admin password irreversible-cipher admin@huawei.com
 QWE@qwe123
quit
quit
#
nqa test-instance pe pe1
 test-type icmp
 destination-address ipv4 ${pe1ip1}
 frequency 3
 probe-count 1
 start now
#
${wan1Temp}
#
interface vlan 1
description LAN1
ip address 192.168.8.1/24
#
interface LoopBack0
description bgp-loip
ip address ${bpg1lo} 32
#
interface LoopBack1
 description main-loip
 ip address ${ce1lo} 32
#
interface LoopBack2
 description backup-loip
 ip address ${ce2lo} 32
#
interface LoopBack100
 description hkip
 ip address ${oversea1ip1} 32
#
acl number 3333
 rule 1 permit ip source ${ce1lo} 0 destination ${pe1lo} 0
#
acl number 3334
 rule 1 permit ip source ${ce2lo} 0 destination ${pe2lo} 0
#
# IPSEC
ipsec proposal ipsectran1
 esp authentication-algorithm sha1
 esp encryption-algorithm 3des
#
ike proposal 10
 encryption-algorithm 3des
 dh group2
 authentication-algorithm sha1
 sa duration 28800
 authentication-method pre-share
 integrity-algorithm hmac-sha1-96
 prf hmac-sha1
#
ike peer main
 undo version 2
 version 1
 pre-shared-key cipher both-win
 ike-proposal 10
 remote-address ${ac1pub}
 rsa encryption-padding oaep
 rsa signature-padding pss
 ikev2 authentication sign-hash sha2-256
#
ike peer backup
 undo version 2
 version 1
 pre-shared-key cipher both-win
 ike-proposal 10
 remote-address ${ac2pub}
 rsa encryption-padding oaep
 rsa signature-padding pss
 ikev2 authentication sign-hash sha2-256
#
ipsec policy S2S-IPSEC 10 isakmp
 security acl 3333
 pfs dh-group2
 ike-peer main
 proposal ipsectran1
#
ipsec policy S2S-IPSEC 20 isakmp
 security acl 3334
 pfs dh-group2
 ike-peer backup
 proposal ipsectran1
#
interface ${wan1}
ipsec policy S2S-IPSEC
#
interface Tunnel0/0/100
 description "main-${pe1}-${pe1if}"
 tcp adjust-mss 1300
 ip address ${pe1ip2} 30
 tunnel-protocol gre
 source LoopBack1
 destination ${pe1lo}

interface Tunnel0/0/200
 description "backup-${pe2}-${pe2if}"
 tcp adjust-mss 1300
 ip address ${pe2lo} 30
 tunnel-protocol gre
 source LoopBack2
 destination ${pe2lo}
#
#MPLS监控路由
ip route-static 114.113.245.99 32 10.40.45.69 track nqa pe pe1
ip route-static 114.113.245.100 32 10.41.45.69 preference 70
#跳板机路由
ip route-static 192.168.55.250 32 10.40.45.69 track nqa pe pe1
ip route-static 192.168.55.250 32 10.41.45.69 preference 70
#BGP Server
ip route-static ${bgp1server1} 32 ${pe1ip1}
ip route-static ${bgp1server2} 32 ${pe1ip1}
ip route-static ${bgp1server3} 32 ${pe2ip1}
ip route-static ${bgp1server4} 32 ${pe2ip1}
#
# 缺省情况下，BGP本地优先级的值为100。
# 该值越大则实际的优先级越高
#
ip community-filter 80 permit 65000:9939
ip community-filter 81 permit 65000:4134
ip community-filter 82 permit 65000:4837
ip community-filter 83 permit 65000:9808
#
route-policy bgp-from--RSVR permit node 100
 description To-HK
 if-match community-filter 80
 apply ip-address next-hop ${pe1ip1}
route-policy bgp-from--RSVR permit node 200
 description To-CT
 if-match community-filter 81
 apply ip-address next-hop 1.1.1.1
route-policy bgp-from--RSVR permit node 300
 description To-CNC
 if-match community-filter 82
 apply ip-address next-hop 1.1.1.1
route-policy bgp-from--RSVR permit node 400
 description To-CN-Other
 if-match community-filter 83
 apply ip-address next-hop 1.1.1.1
#
route-policy bgp-from--RSVR2 permit node 100
 description To-HK
 if-match community-filter 80
 apply ip-address next-hop ${pe2ip1}
 apply local-preference 210
route-policy bgp-from--RSVR2 permit node 200
 description To-CT
 if-match community-filter 81
 apply ip-address next-hop 1.1.1.1
 apply local-preference 210
route-policy bgp-from--RSVR2 permit node 300
 description To-CNC
 if-match community-filter 82
 apply ip-address next-hop 1.1.1.1
 apply local-preference 210
route-policy bgp-from--RSVR2 permit node 400
 description To-CN-Other
 if-match community-filter 83
 apply ip-address next-hop 1.1.1.1
 apply local-preference 210
#
# 主线 默认200 备线设置 210  逃生默认路由220
# ebgp 20 ibgp 200 local 200
#
bgp 65000
router-id ${bpg1lo}
preference 20 200 200
group RSVR internal
group RSVR2 internal
peer ${bgp1server1} group RSVR
peer ${bgp1server2} group RSVR
peer ${bgp1server3} group RSVR2
peer ${bgp1server4} group RSVR2
ipv4-family unicast
undo synchronization
peer RSVR  enable
peer RSVR2  enable
peer RSVR route-policy bgp-from--RSVR import
peer RSVR2 route-policy bgp-from--RSVR2 import
#
# Local NAT
acl number 3999
 rule 1 deny ip source ${ce1lo} 0 destination ${pe1lo} 0
 rule 2 deny ip source ${ce1lo} 0 destination ${pe1lo} 0
 rule 10 permit ip source 10.0.0.0 0.0.0.255
 rule 20 permit ip source 172.16.0.0 0.0.240.255
 rule 30 permit ip source 192.168.0.0 0.0.255.255
interface ${wan1}
 nat outbound 3999
#
# Oversea NAT
acl number 3998
 rule 1 permit ip source 192.168.0.0 0.0.255.255
interface Tunnel0/0/100
nat outbound 3998 interface LoopBack 100
interface Tunnel0/0/200
nat outbound 3998 interface LoopBack 100

####################################
1、HKIP配置到接口，只能做一个NAT
interface LoopBack100
description hkip
ip address ${oversea1ip1} 255.255.255.255
#
interface Tunnel0/0/200
nat outbound 3999 interface LoopBack 100

2、HKIP配置到地址池
nat address-group 0 103.141.236.115 103.141.236.115
interface Tunnel0/0/200
nat outbound 3999 address-group 0
#
# SmartDNS 需要向NOC申请放通客户出口公网IP
# 如果公网IP不固定，可以直接使用公司内网SmartDNS【192.168.55.105】
`;
  let filename = `${lineid}-Fastip-HK-Huawei-ConfigBy${user}-${time.ez}`;
  let data = {};
  downloadConfig(filename, fastip003fastipOpenvpn);
  let type = 'post'
  let datatype = 'json';
  ajaxHandler(url,data,datatype,type);
};
