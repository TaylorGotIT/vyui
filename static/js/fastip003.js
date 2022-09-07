/* FastIP 华为路由器 单运营商 */
const fastip003html = `<table border="1">
<tr>
<td>基本信息</td>
<td><textarea id="basic_textarea" rows="4" cols="21">
area=gz
cnameEN=fnetlink
cnameCN=XX公司</textarea></td>
</tr>
<tr>
<td title="***示例***
---自动获取【DHCP】-----
G0/0/10=dhcp
---手动设定【Static】---
G0/0/10=192.168.1.254/24
gw=192.168.1.1
---宽带拨号【PPPoE】----
G0/0/10=pppoe
user=account
pass=password
wwan0=">WAN接口</td>
<td><textarea id="wan1_textarea" rows="2" cols="21" value="eth0">
isp=ct
eth0=dhcp</textarea></td>
</tr>
<tr>
<td title=
"---Ethernet---
G0/0/1=192.168.8.1/24
---Vlanif-----
vlan1=192.168.8.1/24
">内网LAN接口</td>
<td><textarea id="lan1_input" rows="1" cols="21">
G0/0/1=192.168.8.1/24</textarea></td>
</tr>
<tr>
<td title= "***示例***\nSmartDNS：smart-dns1=59.36.7.194\nsmart-dns2=59.37.126.146">SmartDNS</td>
<td><textarea id="local_dns_textarea" rows="2" cols="21">dns1=59.36.7.194\ndns2=59.37.126.146</textarea></td>
</tr>
<td title= "由输入的NOC分配资源自动整理生成，可以手动修改，避免自动识别问题">NOC分配资源</td>
<td><textarea id="resource_textarea" rows="15" cols="21"></textarea></td>
</tr>
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
                "lo":[],
                "pub":[],
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
                case 'wanip':
                    info_json.ip.push(l1);
                    break;
                case 'tunnel':
                    info_json.if.push(l1);
                    break;
                case 'docking':
                    info_json.pub.push(l1);
                    break;
                case 'celoip':
                    info_json.lo.push(l1);
                    break;
                case 'hkip':
                    info_json.oversea.push(l1);
                    break;
                case 'bgpserverip':
                    info_json.bgp.push(l1);
                    break;
                default:
                    info_json.other.push(l1);
            };
        }
    };
    console.log(info_json);
let peers = (info_json.bgp[0]+","+info_json.bgp[1]).split(",");
let resource_text =
`id=${info_json.id[0]}
ac1=${info_json.pe[0]}
ac1if=${info_json.if[0]}
ac1ip=${info_json.ip[0]}
ac1pub=${info_json.pub[0]}
ac2=${info_json.pe[1]}
ac2if=${info_json.if[1]}
ac2ip=${info_json.ip[1]}
ac2pub=${info_json.pub[1]}
loip=${info_json.lo[0]}
peer1=${peers[0]}
peer2=${peers[1]}
peer3=${peers[2]}
peer4=${peers[3]}
oversea=${info_json.oversea[0]}`;
console.log(resource_text);
    $("#resource_textarea").val(resource_text);
  };
};

$("#service_dev").append(fastip003html);
//加载测试资源的解析数据
fastip003getList();

function fastip003sub(url){
  let time = getTime(new Date());
  let user = $("#user_input").val();
  let bas = $("#basic_textarea").val().split('\n');
  let src =  $("#resource_textarea").val().split('\n')

  let wan1list = $("#wan1_textarea").val().split('\n');
  let wan1isp = wan1list[0].split('=')[1].toUpperCase();
  let wan1 = wan1list[1].split('=')[0];
  let wan1str = wan1list[1].split('=')[1]

  let wlan = $("#wlan0_textarea").val().split('\n');

  let version = bas[0].split('=')[1];
  let area = bas[1].split('=')[1].toUpperCase();
  let cnameEN = bas[2].split('=')[1];
  let cnameCN = bas[3].split('=')[1];
  let wlan0ip = wlan[0].split('=')[1];

  let lineid = src[0].split('=')[1];
//获取主线参数
  let ac1 = src[1].split('=')[1];
  let ac1if = src[2].split('=')[1];
  let ac1port = ac1if.replace('vtun','');
  let ac1ips = ipNext(src[3].split('=')[1].split('/')[0]);
  let ac1ip1 = ac1ips[0];
  let ac1ip2 = ac1ips[1];
  let ac1pub = src[4].split('=')[1];
//获取备线参数
  let ac2 = src[5].split('=')[1];
  let ac2if = src[6].split('=')[1];
  let ac2port = ac2if.replace('vtun','');
  let ac2ips = ipNext(src[7].split('=')[1].split('/')[0]);
  let ac2ip1 = ac2ips[0];
  let ac2ip2 = ac2ips[1];
  let ac2pub = src[8].split('=')[1];
  let loip = src[9].split('=')[1];
  let bgp1server1 = src[10].split('=')[1];
  let bgp1server2 = src[11].split('=')[1];
  let bgp1server3 = src[12].split('=')[1];
  let bgp1server4 = src[13].split('=')[1];
  let oversea1ips = src[14].split('=')[1];
  let oversea1ip1 = oversea1ips.split(',')[0].split('-')[0];
//获取DNS
  let dnss1 = $("#local_dns_textarea").val().split('\n');
  let dnss2 = $("#oversea_dns_textarea").val().split('\n');
  let local1dns = dnss1[0].split('=')[1];
  let local2dns = dnss1[1].split('=')[1];
  let oversea1dns = dnss2[0].split('=')[1];
  let oversea2dns = dnss2[1].split('=')[1];

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
interface ${wan1}
description WAN1-${wan1isp}
ip address ${wan1ip}
undo ipv6 enable
#
interface vlan 1
description LAN1
ip address ${lan1ip}
#
interface LoopBack0
description bgp-loip
ip address ${loip} 32
#
interface LoopBack1
description main-loip
ip address ${ce1loip} 32

interface LoopBack2
description backup-loip
ip address ${ce2loip} 32

interface LoopBack100
description hkip
ip address ${oversea1ip1} 32

acl number 3333
rule 1 permit ip source ${ce1loip} 0 destination ${pe1loip} 0

acl number 3334
rule 1 permit ip source ${ce2loip} 0 destination ${pe2loip} 0

ip route-static ${pe1pub} 32 ${wan1gw}
ip route-static ${pe2pub} 32 ${wan1gw}
ip route-static ${pe1loip} 32 ${wan1gw}
ip route-static ${pe2loip} 32 ${wan1gw}
ip route-static 0.0.0.0 0.0.0.0 ${wan1gw} preference 220
#测试用 DNS路由 ip route-static 192.168.55.105 32 ${wan1gw}
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
 pre-shared-key cipher both-win
 ike-proposal 10
 remote-address ${pe1pub}
 rsa encryption-padding oaep
 rsa signature-padding pss
 ikev2 authentication sign-hash sha2-256
#
ike peer backup
 undo version 2
 pre-shared-key cipher both-win
 ike-proposal 10
 remote-address ${pe2pub}
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
 destination ${pe1loip}

interface Tunnel0/0/200
 description "backup-${pe2}-${pe2if}"
 tcp adjust-mss 1300
 ip address ${pe2loip} 30
 tunnel-protocol gre
 source LoopBack2
 destination ${pe2loip}
#
#MPLS监控路由
ip route-static 114.113.245.99 32 10.40.45.69 track nqa pe pe1
ip route-static 114.113.245.100 32 10.41.45.69 preference 70
#跳板机路由
ip route-static 192.168.55.250 32 10.40.45.69 track nqa pe pe1
ip route-static 192.168.55.250 32 10.41.45.69 preference 70
#BGP Server
ip route-static 10.10.99.168 32 ${pe1ip1}
ip route-static 10.10.99.169 32 ${pe1ip1}
ip route-static 10.10.99.198 32 ${pe2ip1}
ip route-static 10.10.99.199 32 ${pe2ip1}
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
 apply ip-address next-hop ${wan1gw}
route-policy bgp-from--RSVR permit node 300
 description To-CNC
 if-match community-filter 82
 apply ip-address next-hop ${wan1gw}
route-policy bgp-from--RSVR permit node 400
 description To-CN-Other
 if-match community-filter 83
 apply ip-address next-hop ${wan1gw}
#
route-policy bgp-from--RSVR2 permit node 100
 description To-HK
 if-match community-filter 80
 apply ip-address next-hop ${pe2ip1}
 apply local-preference 210
route-policy bgp-from--RSVR2 permit node 200
 description To-CT
 if-match community-filter 81
 apply ip-address next-hop ${wan1gw}
 apply local-preference 210
route-policy bgp-from--RSVR2 permit node 300
 description To-CNC
 if-match community-filter 82
 apply ip-address next-hop ${wan1gw}
 apply local-preference 210
route-policy bgp-from--RSVR2 permit node 400
 description To-CN-Other
 if-match community-filter 83
 apply ip-address next-hop ${wan1gw}
 apply local-preference 210
#
# 主线 默认200 备线设置 210  逃生默认路由220
# ebgp 20 ibgp 200 local 200
#
bgp 65000
router-id ${loip}
preference 20 200 200
group RSVR internal
group RSVR2 internal
peer 10.10.99.168 group RSVR
peer 10.10.99.169 group RSVR
peer 10.10.99.198 group RSVR2
peer 10.10.99.199 group RSVR2
ipv4-family unicast
undo synchronization
peer RSVR  enable
peer RSVR2  enable
peer RSVR route-policy bgp-from--RSVR import
peer RSVR2 route-policy bgp-from--RSVR2 import
#
# Local NAT
acl number 3999
 rule 1 permit ip source 192.168.0.0 0.0.255.255
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
ip address 103.141.236.115 255.255.255.255
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
  let filename = `${cnameCN}-Fastip-${lineid}-ConfigBy${user}-${time.ez}`;
  let data = {};
  downloadConfig(filename, fastip003fastipOpenvpn);
  let type = 'post'
  let datatype = 'json';
  ajaxHandler(url,data,datatype,type);
};
