/* FastIP 假组网 海外VPS GreOverOpenVPN */
const fastip201html = `<table border="1">
<tr>
<td>LineID</td>
<td><input id="lineid_input" value="65xxxx"></td>
<td><input id="area_input" value="GZ"></td>
</tr>
<tr>
<td>公司名</td>
<td><input id="cnameEN_input" value="Fnet"></td>
<td><input id="cnameCN_input" value="XX公司"></td>
</tr>
<tr>
<td>WAN</td>
<td>
<select id="wan1_select">
<option value="G0/0/8" selected="selected">G0/0/8</option>
<option value="G0/0/9">G0/0/9</option>
</select>
<select id="wan1_provider_select">
<option value="CT" selected="selected">电信[CT]</option>
<option value="CU">联通[CU]</option>
<option value="CM">移动[CM]</option></select></td>
<td><select id="wan1_type_select" onchange=fastip201setWan(this.value)>
<option value="dhcp" selected="selected">WAN Type[ DHCP ]</option>
<option value="static">WAN Type[ Static ]</option>
<option value="pppoe">WAN Type[ PPPoE ]</option></select></td></tr>
<tr id="wan1_input_tr"></tr>
<tr>
<td>PE</td>
<td><input id="pe1_input"></td>
<td><input id="pe2_input"></td>
</tr>
<tr>
<td>PE IF</td>
<td><input id="pe1_if_input"></td>
<td><input id="pe2_if_input"></td>
</tr>
<tr>
<td>PE IP</td>
<td><input id="pe1_ip_input"></td>
<td><input id="pe2_ip_input"></td>
</tr>
<tr>
<td>PE loip</td>
<td><input id="pe1_lo_input"></td>
<td><input id="pe2_lo_input"></td>
</tr>
<tr>
<td>CE loip</td>
<td><input id="ce1_lo_input"></td>
<td><input id="ce2_lo_input"></td>
</tr>
<td>Oversea</td>
<td><input id="pe1_oversea_input"></td>
<td><input id="pe2_oversea_input"></td>
</tr>
<tr>
<td>PE pub</td>
<td><input id="pe1_pub_input"></td>
<td><input id="pe2_pub_input"></td>
</tr>
<tr>
<td>PE psk</td>
<td><input id="pe1_psk_input"></td>
<td><input id="pe2_psk_input"></td>
</tr>
</table>
<button type="button" onclick="fastip201sub('/config')">提交配置信息(Submit Config Info)</button>
`;

function fastip201getList() {
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
        "oversea":[],
        "pub":[],
        "psk":[],
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
                    if(l1.includes('upe')){
                        info_json.pe.push(l1);
                    }else{
                        info_json.ac.push(l1);
                    };

                    break;
                case 'tunnel':
                    info_json.if.push(l1);
                    break;
                case 'wanip':
                    info_json.ip.push(l1);
                    break;
                case 'pe对接':
                    info_json.pelo.push(l1);
                    break;
                case 'ce对接':
                    info_json.celo.push(l1);
                    break;
                case '拨号ip':
                    info_json.pub.push(l1);
                    break;
                case '秘钥':
                    info_json.psk.push(l1);
                    break;
                case 'peas号':
                    break;
                case '拨号pe':
                    break;
                case '对接ip':
                    break;
                case 'loopip':
                    break;
                default:
                    if(l1.search('.')!=-1){
                        info_json.oversea.push(l1);
                    }else{
                        info_json.other.push(l1);
                    }
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
    $("#pe1_oversea_input").val(info_json.oversea[0]);
    $("#pe1_pub_input").val(info_json.pub[0]);
    $("#pe1_psk_input").val(info_json.psk[0]);

    $("#pe2_input").val(info_json.pe[1]);
    $("#pe2_if_input").val(info_json.if[1]);
    $("#pe2_ip_input").val(info_json.ip[1]);
    $("#pe2_lo_input").val(info_json.pelo[1]);
    $("#ce2_lo_input").val(info_json.celo[1]);
    $("#pe2_oversea_input").val(info_json.oversea[1]);
    $("#pe2_pub_input").val(info_json.pub[1]);
    $("#pe2_psk_input").val(info_json.psk[1]);
  };
};

function fastip201setWan(value){
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

$("#service_dev").append(fastip201html);
//加载测试资源的解析数据
fastip201getList();

function fastip201sub(url){
  let user = $("#user_input").val();
  let time=getTime(new Date());

  let cnameEN = $("#cnameEN_input").val();
  let cnameCN = $("#cnameCN_input").val();
  let area = $("#area_input").val().toUpperCase();
  let lineid = $("#lineid_input").val();
  let cid = lineid.substr(0,6);
  let sid = lineid.substr(0,7);
  let wan1 =  $("#wan1_select").val();
  let wan1Type = $("#wan1_type_select").val();
  let wan1Provider =  $("#wan1_provider_select").val();
//获取主线参数
  let pe1 = $("#pe1_input").val();
  let pe1if = $("#pe1_if_input").val();
  let pe1ips = ipNext($("#pe1_ip_input").val().split('/')[0]);
  let pe1ip1 = pe1ips[0];
  let pe1ip2 = pe1ips[1];
  let pe1lo = $("#pe1_lo_input").val();
  let ce1lo = $("#ce1_lo_input").val();
  let oversea1ips = $("#pe1_oversea_input").val().split(',')[0];
  let oversea1ip = oversea1ips.split(',')[0];
  let oversea1ip1 = oversea1ip.split('-')[0];
  let pe1pub = $("#pe1_pub_input").val();
  let pe1psk = $("#pe1_psk_input").val();

//获取备线参数
  let pe2 = $("#pe2_input").val();
  let pe2if = $("#pe2_if_input").val();
  let pe2ips = ipNext($("#pe2_ip_input").val().split('/')[0]);
  let pe2ip1 = pe2ips[0];
  let pe2ip2 = pe2ips[1];
  let pe2lo = $("#pe2_lo_input").val();
  let ce2lo = $("#ce2_lo_input").val();
  let pe2pub = $("#pe2_pub_input").val();
  let pe2psk = $("#pe2_psk_input").val();

//差异化配置生成
let wanTemp = '';
switch(wan1Type){
    case "dhcp":
        wanTemp += `#
interface ${wan1}
 undo portswitch
 description Wan1-DHCP-${wan1Provider}
 ip address dhcp-alloc
 ipsec policy S2S-IPSEC
 quit
ip route 0.0.0.0 0 ${wan1} dhcp preference 222 tag 7777
ip route 10.10.253.254 32 ${wan1} dhcp tag 7777
ip route 192.168.250.31 32 ${wan1} dhcp tag 7777
#`;
    break;
    case "static":
        let wan1ip = $("#wan1_ip_input").val();
        let wan1gw = $("#wan1_gw_input").val();
        wanTemp += `#
interface ${wan1}
 undo portswitch
 description Wan1-Static-${wan1Provider}
 ip address ${wan1ip}
 ipsec policy S2S-IPSEC
 quit
ip route-static 0.0.0.0 0 ${wan1gw} preference 222 tag 7777
ip route-static 10.10.253.254 32 ${wan1gw} tag 7777
ip route-static 192.168.250.31 32 ${wan1gw} tag 7777
#`;
    break;
    case "pppoe":
        let pppoe1user = $("#pppoe1_user_input").val();
        let pppoe1pass = $("#pppoe1_pass_input").val();
        wanTemp += `#
dialer-rule
 dialer-rule 1 ip permit
#
interface Dialer0
 link-protocol ppp
 ip address ppp-negotiate
 ppp chap user ${pppoe1user}
 ppp chap password cipher ${pppoe1pass}
 dialer user server
 dialer bundle 1
 dialer-group 1
 nat outbound 3999
 tcp adjust-mss 1472
 ipsec policy S2S-IPSEC
#
interface ${wan1}
 description Wan1-PPPoE-${wan1Provider}
 pppoe-client dial-bundle-number 1
#
ip route-static 0.0.0.0 0 Dialer0 preference 222 tag 7777
ip route-static 10.10.253.254 32 Dialer0 tag 7777
ip route-static 192.168.250.31 32 Dialer0 tag 7777
#`;
    break;
  };

let fastip201tiktokGreOverIPsec  =
`#Fnet Tiktok with GRE Over IPsec Template.
#操作人员：${user}
#时间：${time.cn}
#系统：vyui-v1
#Huawei Router Version >= R21
+++++++++++++++++++++++++++++++++++++++++++
#WAN1配置
${wanTemp}
domain fnet_tac admin
#
dhcp enable
interface vlanif 100
ip address 192.168.8.1 24
dhcp select interface
dhcp client expected-lease 7200
dhcp client client-id sdwan
dhcp server gateway-list 192.168.8.1
dhcp server dns-list 8.8.8.8
dhcp server ip-range 192.168.8.2 192.168.8.254
dhcp server mask 255.255.255.0
dhcp server logging
dhcp server static-bind ip-address 192.168.8.201 mac-address 2020-e2f3-2a3b
#针对不同出口创建不同VPN实例
ip vpn-instance vpn1
 ipv4-family
#配置3a认证对接
radius-server template default
hwtacacs-server template fnetlink_tacacs
 hwtacacs-server authentication 192.168.55.250
 hwtacacs-server authorization 192.168.55.250
 hwtacacs-server accounting 192.168.55.250
 hwtacacs-server shared-key cipher %^%#,k0Q%f>DtL4|gHE;x"Q43w)5LI-@=$Faag%jSnd;%^%#
#配置过滤可以ssh或者telnet登录的ip
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
#ipsec感兴趣流
acl number 3333
 rule 1 permit ip source ${ce1lo} 0 destination ${pe1lo} 0
acl number 3334
 rule 1 permit ip source ${ce2lo} 0 destination ${pe2lo} 0
#NAT匹配源ip
acl number 3999
 rule 5 permit ip source 192.168.8.0 0.0.0.255
#ipsec配置
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
 ike-proposal 10
 remote-address ${pe1pub}
 pre-shared-key cipher ${pe1psk}
 rsa encryption-padding oaep
 rsa signature-padding pss
 undo local-id-preference certificate enable
 ikev2 authentication sign-hash sha2-256
ike peer backup
 undo version 2
 ike-proposal 10
 remote-address ${pe2pub}
 pre-shared-key cipher ${pe2psk}
 rsa encryption-padding oaep
 rsa signature-padding pss
 undo local-id-preference certificate enable
 ikev2 authentication sign-hash sha2-256
#
ipsec policy S2S-IPSEC 10 isakmp
 security acl 3333
 ike-peer main
 proposal ipsectran1
ipsec policy S2S-IPSEC 20 isakmp
 security acl 3334
 ike-peer backup
 proposal ipsectran1
#
free-rule-template name default_free_rule
#
portal-access-profile name portal_access_profile
#
aaa
 authentication-scheme default
  authentication-mode local
 authentication-scheme fnet_tac
  authentication-mode hwtacacs local
 authentication-scheme radius
  authentication-mode radius
 authorization-scheme default
  authorization-mode local
 authorization-scheme fnet_tac
  authorization-mode hwtacacs local
  authorization-cmd 15 hwtacacs local
 accounting-scheme default
  accounting-mode none
 accounting-scheme fnet_tac
  accounting-mode hwtacacs
  accounting start-fail online
 recording-scheme fnet_tac
  recording-mode hwtacacs fnetlink_tacacs
 cmd recording-scheme fnet_tac
 local-aaa-user password policy administrator
 service-scheme fnet_tac
  admin-user privilege level 15
 domain default
  authentication-scheme default
  accounting-scheme default
  radius-server default
 domain default_admin
  authentication-scheme default
  accounting-scheme default
 domain fnet_tac
  authentication-scheme fnet_tac
  accounting-scheme fnet_tac
  authorization-scheme fnet_tac
  radius-server default
  hwtacacs-server fnetlink_tacacs
 local-user bothwin password irreversible-cipher ???
 local-user bothwin privilege level 15
 local-user bothwin service-type telnet terminal ssh http
#配置对接客户手机或者wifi的lan口
interface vlan1
 description "lan1"
 ip binding vpn-instance vpn1
 ip address 192.168.8.1 24
#配置美国IP
interface LoopBack100
description "${oversea1ips}"
 ip binding vpn-instance vpn1
 ip address ${oversea1ip1} 32
#
interface LoopBack1
ip address ${ce1lo} 32
#
interface LoopBack2
 ip address ${ce2lo} 32
#配置tunnel
interface ${pe1if}
 description "PE1_${pe1}"
 ip binding vpn-instance vpn1
 tcp adjust-mss 1300
 ip address ${pe1ip2} 30
 tunnel-protocol gre
 source ${ce1lo}
 destination ${pe1lo}
 nat outbound 3999 interface LoopBack 100
 qos car outbound cir 10240 pir 10240 cbs 1925120 pbs 3205120 green pass yellow pass red discard
#
interface ${pe2if}
 description "PE1_${pe2}"
 ip binding vpn-instance vpn1
 tcp adjust-mss 1300
 ip address ${pe2ip2} 30
 tunnel-protocol gre
 source ${ce2lo}
 destination ${pe2lo}
 nat outbound 3999 interface LoopBack 100
 qos car outbound cir 10240 pir 10240 cbs 1925120 pbs 3205120 green pass yellow pass red discard
#
nqa test-instance pri pri
 test-type icmp
 destination-address ipv4 ${pe1ip1}
 source-address ipv4 ${pe1ip2}
 frequency 30
 probe-count 6
 vpn-instance vpn1
 start now
#配置相应路由
ip route-static vpn-instance vpn1 0.0.0.0 0.0.0.0 10.10.92.33 track nqa pri pri
ip route-static vpn-instance vpn1 0.0.0.0 0.0.0.0 10.10.94.109 preference 70
#
snmp-agent trap enable
#
ntp-service unicast-server 192.168.55.250
#
user-interface con 0
 authentication-mode aaa
user-interface vty 0 4
 acl 2707 inbound
 authentication-mode aaa
 user privilege level 15
#
`;
  let filename = `${cnameCN}-${sid}-FastIP-Tiktok-GREOverIPsec-Config-By-${user}-${time.ez}`;
  let data = {};
  console.log(fastip201tiktokGreOverIPsec);
  downloadConfig(filename, fastip201tiktokGreOverIPsec);
  let type = 'post'
  let datatype = 'json';
  ajaxHandler(url,data,datatype,type);
};