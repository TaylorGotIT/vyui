/***
华为天关防火墙 FastIP 虚拟接口 GRE Over IPsec 非HK出口
***/
const usg_fastip003html = `<table border="1">
<tr>
<td style="text-align: center;">公司</td>
<td><input id="cname_input" value="xx公司"></td>
<td><input id="zone_input" value="GZ"></td>
</tr>

<tr>
<td style="text-align: center;">WAN1 接口</td>
<td><select id="wan1_select">
<option value="G0/0/9" selected="selected">G0/0/9</option>
<option value="G0/0/7">G0/0/7</option>
<option value="G0/0/6">G0/0/6</option>
</td>

<td>
</select>
<select id="wan1_type_select" onchange=usg_fastip003setWan1type(this.value)>
<option value="dhcp" selected="selected">WAN[ DHCP ]</option>
<option value="static">WAN[ Static ]</option>
<option value="pppoe">WAN[ PPPOE ]</option>
</select>
</td>
</tr>

<tr id="wan1_setup_tr"></tr>

<tr>
<td style="text-align: center;">LAN接口</td>
<td><select id="lan1_select">
<option value="G0/0/8" selected="selected">G0/0/8</option>
<option value="G0/0/1">G0/0/1</option>
<option value="G0/0/2">G0/0/2</option>
<option value="G0/0/3">G0/0/3</option>
<option value="G0/0/4">G0/0/4</option>
<option value="G0/0/5">G0/0/5</option>
</select>
</td>
<td><input id="lan1_ip_input" value="192.168.8.1/24"></td>
</tr>

<tr>
<td style="text-align: center;">分流DNS</td>
<td><input id="dns1_input" value='10.255.108.7'></td>
<td><input id="dns2_input" value='10.255.108.58'></td>
</tr>
<tr>
<td style="text-align: center;">国内DNS</td>
<td><input id="local_dns1_input" value='223.5.5.5'></td>
<td><input id="local_dns2_input" value='223.6.6.6'></td>
</tr>

<tr>
<td style="text-align: center;">线路ID</td>
<td><input id="line1_input"></td>
<td><input id="line2_input"></td>
</tr>

<tr>
<td style="text-align: center;">AC</td>
<td><input id="ac1_input"></td>
<td><input id="ac2_input"></td>
</tr>
<tr>
<td style="text-align: center;">AC Pub</td>
<td><input id="ac1_pub_input"></td>
<td><input id="ac2_pub_input"></td>
</tr>
<tr>
<td style="text-align: center;">感兴趣流</td>
<td><input id="acl1_input"></td>
<td><input id="acl2_input"></td>
</tr>
<tr>
<td style="text-align: center;">AC AuthID</td>
<td><input id="ac1_authid_input"></td>
<td><input id="ac2_authid_input"></td>
</tr>
<tr>
<td style="text-align: center;">AC PSK</td>
<td><input id="ac1_psk_input" value='both-win'></td>
<td><input id="ac2_psk_input" value='both-win'></td>
</tr>
<tr>
<td style="text-align: center;">PE</td>
<td><input id="pe1_input"></td>
<td><input id="pe2_input"></td>
</tr>
<tr>
<td style="text-align: center;">PE接口</td>
<td><input id="pe1_if_input"></td>
<td><input id="pe2_if_input"></td>
</tr>
<tr>
<td style="text-align: center;">PE IP</td>
<td><input id="pe1_ip_input"></td>
<td><input id="pe2_ip_input"></td>
</tr>
<tr>
<td style="text-align: center;">PE Lo</td>
<td><input id="pe1_lo_input"></td>
<td><input id="pe2_lo_input"></td>
</tr>
<tr>
<td style="text-align: center;">CE Lo</td>
<td><input id="ce1_lo_input"></td>
<td><input id="ce2_lo_input"></td>
</tr>
<tr>
<td style="text-align: center;">海外IP</td>
<td><input id="OverseaIP1_input"></td>
<td><input id="OverseaIP2_input"></td>
</tr>
<tr>
<td style="text-align: center;">BGP Server</td>
<td><input id="bgp1server_input" value='103.252.19.25,43.229.117.226'></td>
<td><input id="bgp2server_input" value='103.252.19.99,43.229.119.251'></td>
</tr>



</table>
<button type="button" onclick="usg_fastip003sub('/config')">提交配置信息(Submit Config Info)</button>
`;

function cidrToSubnetMask(cidr) {
    // 提取前缀长度
    let ips = cidr.split('/')
    const prefixLength = parseInt(ips[1], 10);

    // 创建一个32位的二进制字符串，前缀长度位为1，其余为0
    let maskBits = '1'.padStart(prefixLength, '1').padEnd(32, '0');

    // 将二进制字符串转换为四个八位组的数组
    let octets = [];
    for (let i = 0; i < 4; i++) {
        octets.push(parseInt(maskBits.slice(i * 8, (i + 1) * 8), 2));
    }

    // 将数组转换为点分十进制格式的字符串
    return ips[0] + " " + octets.join('.');
}

function usg_fastip003getList() {
    let str = $("#config_textarea").val().replaceAll(' ','').replaceAll('：',':').replaceAll(';','');;
    let lines = str.split(/\r?\n/);
    let id_html ="";
    let pe_html ="";
    let ip_html ="";
    let pe_ip_html ="";
    let pub_ip_html ="";
    let ce_ip_html ="";
    let if_html ="";
    let as_html ="";
    let psk_html ="";
    let info_html ="";
    let info_json = {
                "id":[],
                "pe":[],
                "if":[],
                "ip":[],
                "pelo":[],
                "celo":[],
                "acl":[],
                "authid":[],
                "pub":[],
                "psk":[],
                "overseaip":[],
                "other":[],
            };
    for(let i = 0; i < lines.length; i++) {
        let line = lines[i]
        if(line!==""){
            console.log(line);

            let l = [];

            if(line.search(':')!=-1){
                l = line.split(":");
            }else if(line.search('#')!=-1){
                l = line.split("#");
            }
            if (!l.length) {
                l[0]='lineid';
                l[1]=line;
            }

            let l0 = l[0].toLowerCase();
            let l1 = l[1];
            if(ipv4_regex2.test(l1)){
                console.log(l1);
            }
            let html =  "<option value='"+ l1 +"'>"+ line +"</option>";
            console.log(l0)
            switch(l0){
                case 'lineid':
                    info_json.id.push(l1);
                    break;
                case '主ipsec_pe':
                    info_json.pe.push(l1);
                    break;
                case '备ipsec_pe':
                    info_json.pe.push(l1);
                    break;
                case '拨号ip':
                    info_json.pub.push(l1);
                    break;
                case 'loip':
                    info_json.celo.push(l1);
                    break;
                case '感兴趣流':
                    info_json.acl.push(l1);
                    break;
                case '认证id':
                    info_json.authid.push(l1);
                    break;
                case '预共享密钥':
                    info_json.psk.push(l1);
                    break;
                case 'pe':
                    info_json.pe.push(l1);
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
                case '出口ip':
                    info_json.overseaip.push(l1);
                    break;
                default:
                    info_json.other.push(l1);
            }
        }
    }
    console.log(info_json);
    $("#line1_input").val(info_json.id[0]);
    $("#ac1_input").val(info_json.pe[0]);
    $("#acl1_input").val(info_json.acl[1]);
    $("#pe1_input").val(info_json.pe[1]);
    $("#pe1_if_input").val(info_json.if[0]);
    $("#pe1_ip_input").val(info_json.ip[0]);
    $("#ac1_pub_input").val(info_json.pub[0]);
    $("#pe1_lo_input").val(info_json.pelo[0]);
    $("#ac1_authid_input").val(info_json.authid[0]);
    $("#ce1_lo_input").val(info_json.celo[0]);
    $("#OverseaIP1_input").val(info_json.overseaip[0]);
    if (info_json.psk[0]){
        $("#ac1_psk_input").val(info_json.psk[0]);
    }
    $("#line2_input").val(info_json.id[0]);
    $("#ac2_input").val(info_json.pe[2]);
    $("#acl2_input").val(info_json.acl[2]);
    $("#pe2_input").val(info_json.pe[3]);
    $("#pe2_if_input").val(info_json.if[1]);
    $("#pe2_ip_input").val(info_json.ip[1]);
    $("#ac2_pub_input").val(info_json.pub[1]);
    $("#pe2_lo_input").val(info_json.pelo[1]);
    $("#ac2_authid_input").val(info_json.authid[1]);
    $("#ce2_lo_input").val(info_json.celo[2]);
    $("#OverseaIP2_input").val(info_json.overseaip[1]);
    if (info_json.psk[1]){
        $("#ac2_psk_input").val(info_json.psk[1]);
    }

}
//填充模板表格
$("#service_dev").append(usg_fastip003html);
//加载测试资源的解析数据
usg_fastip003getList();
function usg_fastip003setWan1type(value){
    $("#wan1_setup_tr").empty();
    let html = '';
    switch(value){
        case "dhcp":
            console.log(value);
            html += ``;
            break;
        case "static":
            console.log(value);
             html += `<td style="text-align: center;">WAN1 IP</td> <td><input id="wan1_ip_input" value="192.168.9.2/24" required></td><td><input id="wan1_gw_input" value="192.168.9.1" required></td>`;
            break;
        case "pppoe":
            console.log(value);
            html += `<td style="text-align: center;">拨号账号</td> <td><input id="wan1_pppoe_account_input" placeholder="xxx@163.gd" required></td><td><input id="wan1_pppoe_password_input" placeholder="xxx" required></td>`;
            break;
    }
    console.log(html);
    $("#wan1_setup_tr").append(html);
};


function usg_fastip003sub(url){
  let user = $("#user_input").val();
  let time=getTime(new Date());
  let wan1 = $("#wan1_select").val();
  let line1 = $("#line1_input").val();
  let line2 = $("#line1_input").val();
  let lineid = line1.substr(0,7);
  let site1id = line1.replace(/\d+$/, '');
  let cid = line1.replace(/[0-9]+/g,"");
  let ac1 = $("#ac1_input").val();
  let pe1 = $("#pe1_input").val();
  let pe1if = $("#pe1_if_input").val();
  let pe1ips = ipNext($("#pe1_ip_input").val().split('/')[0]);
  let pe1ip1 = pe1ips[0];
  let pe1ip2 = pe1ips[1];
  let pe1lo = $("#pe1_lo_input").val();
  let ac1pub = $("#ac1_pub_input").val();
  let authid1 = $("#ac1_authid_input").val();
  let ac1psk = $("#ac1_psk_input").val();
  let ce1lo = $("#ce1_lo_input").val();
  let dns1ip = $("#dns1_input").val();
  let localdns1ip = $("#local_dns1_input").val();

  let ac2 = $("#ac2_input").val();
  let pe2 = $("#pe2_input").val();
  let pe2if = $("#pe2_if_input").val();
  let pe2ips = ipNext($("#pe2_ip_input").val().split('/')[0]);
  let pe2ip1 = pe2ips[0];
  let pe2ip2 = pe2ips[1];
  let pe2lo = $("#pe2_lo_input").val();
  let ac2pub = $("#ac2_pub_input").val();
  let authid2 = $("#ac2_authid_input").val();
  let ac2psk = $("#ac2_psk_input").val();
  let ce2lo = $("#ce2_lo_input").val();
  let dns2ip = $("#dns2_input").val();
  let localdns2ip = $("#local_dns2_input").val();

  let bgp1server = $("#bgp1server_input").val().split(',');
  let bgp2server = $("#bgp2server_input").val().split(',');
  let bgp1server1 = bgp1server[0];
  let bgp1server2 = bgp1server[1];
  let bgp2server1 = bgp2server[0];
  let bgp2server2 = bgp2server[1];

  let cname = $("#cname_input").val();
  let zone = $("#zone_input").val();
  let wan1type = $("#wan1_type_select").val();
  let wan1ip = '';
  let wan1ipmask = '';
  let wan1gw = '';
  let lan1 = $("#lan1_select").val();
  let lan1ips =  $("#lan1_ip_input").val();
  let lan1ip = lan1ips.split('/')[0]
  let lan1ipmask = cidrToSubnetMask(lan1ips);
  let OverseaIP1 = $("#OverseaIP1_input").val().split('-')[0];
  let OverseaIP2 = $("#OverseaIP2_input").val().split('-')[0];

  console.log(wan1type);
  let wan_route_temp = '';
if(wan1type=='dhcp'){
    wan1gw = '1.1.1.1';
    wan_route_temp =
`# WAN dhcp
#配置WAN接口，允许http、ping通过wanip登录设备
interface ${wan1}
 ip address dhcp-alloc
 dhcp client default-route preference 222
 service-manage http permit
 service-manage https permit
 service-manage ping permit
#
ip route 1.1.1.1 32 ${wan1} dhcp
#
`;
}else if(wan1type=='static'){
    wan1ips = $("#wan1_ip_input").val();
    wan1gw = $("#wan1_gw_input").val();
    wan1ipmask = cidrToSubnetMask(wan1ips);
    wan1ip = wan1ips.split('/')[0];
    wan_route_temp =
`# WAN接口配置
#配置WAN接口，允许http、ping通过wanip登录设备
interface ${wan1}
 ip address ${wan1ipmask}
 service-manage http permit
 service-manage https permit
 service-manage ssh permit
 service-manage ping permit
#
ip route-static 0.0.0.0 0 ${wan1} ${wan1gw} preference 222
#
`;
}

let usg_fastip003mplsGreOverIPsec  =
`# Huawei USG Firewall MPLS GRE Over Ipsec Template.
# usg_fastip003
# Operator: ${user}
# ${time.cn}
#
# 注册到乾坤云：mgt.seccloud.huawei.com，注册到noc的私有化乾坤OP：119.145.21.126，端口都是 10020
# 仓库License是乾坤云，NOC的License是N1,只能上自建中控
#
设备初始化
=================================
Please Press ENTER.
#USG6530F-D console登录需先手动设置密码（USG6510F-D需先电脑网线接管理口登录，初次登录需自定义账号密码）
Please configure the login password (8-16)
Enter Password:
#
sysname ${lineid}-F-Guard-${zone}
#
# 配置国区保障乾坤云对接正常
country CN
Y
#
#NTP
clock timezone Beijing add 08:00:00
ntp unicast-server 192.168.55.250
ntp unicast-server 203.107.6.88
#
#Log
log type policy enable
log type traffic enable
log type traffic-report enable
#
#威胁防护&资产扫描
asset threat-insight enable
asset monitor-host ip 10.0.0.0 mask 8
asset monitor-host ip 172.16.0.0 mask 12
asset monitor-host ip 192.168.0.0 mask 16
#
undo configuration exclusive by-user-name huawei
#
update schedule ips-sdb daily 03:00
update schedule av-sdb daily 03:00
update schedule sa-sdb daily 03:00
#
country CN
Y
#
web-manager enable port 8443
web-manager http forward enable
web-manager server-source all-interface
Y
#
#配置账号登录设备权限默认开ssh登录
aaa
 local-aaa-user password policy administrator
  password expire 0
 local-user bothwin password irreversible-cipher $1d$SH&O/nY^9;OHSb3D$*^Hn/TTHO<sX,d9vMUd69{cw69W}[XyyGU9|iqnE$
 local-user bothwin password-force-change disable
 local-user bothwin privilege level 3
 Y
 local-user bothwin service-type terminal telnet http ssh
 Y
 local-user bothwin@default password irreversible-cipher $1d$SH&O/nY^9;OHSb3D$*^Hn/TTHO<sX,d9vMUd69{cw69W}[XyyGU9|iqnE$
 local-user bothwin@default password-force-change disable
 local-user bothwin@default privilege level 3
 Y
 local-user bothwin@default service-type terminal telnet http ssh
 Y
#
# 客户账号可不添加
aaa
 local-user ${lineid} password irreversible-cipher ${lineid}@Zxc
 local-user ${lineid} password-force-change disable
 local-user ${lineid} privilege level 3
 Y
 local-user ${lineid} service-type http
 Y
#
#配置tacacs认证登录
 hwtacacs-server template fnetlink_tacacs
 hwtacacs-server timer response-timeout 2
 hwtacacs-server authentication 192.168.55.250
 hwtacacs-server authorization 192.168.55.250
 hwtacacs-server accounting 192.168.55.250
 hwtacacs-server shared-key cipher bothwin
 Y
#
aaa
 authentication-scheme fnet_tac
  authentication-mode hwtacacs local
 authorization-scheme fnet_tac
  authorization-mode hwtacacs local
  authorization-cmd 3 hwtacacs local
 accounting-scheme fnet_tac
  accounting-mode hwtacacs
 recording-scheme fnet_tac
  recording-mode hwtacacs fnetlink_tacacs
 cmd recording-scheme fnet_tac
 service-scheme fnet_tac
  admin-user privilege level 3
 domain fnet_tac
  authentication-scheme fnet_tac
  accounting-scheme fnet_tac
  authorization-scheme fnet_tac
  hwtacacs-server fnetlink_tacacs
domain fnet_tac admin
#
#设置acl白名单登录设备
acl number 3999
 rule 5 permit ip source 202.104.174.178 0
 rule 10 permit ip source 100.64.0.0 0.63.255.255
 rule 15 permit ip source 113.105.190.147 0
 rule 20 permit ip source 114.112.238.8 0.0.0.7
 rule 25 permit ip source 114.113.245.101 0
 rule 30 permit ip source 120.76.31.146 0
 rule 35 permit ip source 127.0.0.1 0
 rule 40 permit ip source 172.16.0.0 0.15.255.255
 rule 45 permit ip source 183.61.239.168 0
 rule 50 permit ip source 192.168.0.0 0.0.255.255
 rule 55 permit ip source 192.168.55.250 0
 rule 65 permit ip source 59.37.126.140 0
 rule 70 permit ip source 10.0.0.0 0.255.255.255
 rule 71 permit ip source 119.145.21.125 0
 rule 72 permit ip source 43.229.117.21 0
 rule 73 permit ip source 119.145.21.126 0
 rule 74 permit ip source 43.229.119.246 0
#
user-interface vty 0 15
 acl 3999 inbound
 authentication-mode aaa
 protocol inbound ssh
#
user-interface con 0
 authentication-mode aaa
#
${wan_route_temp}
#
#开启DHCP
dhcp enable
#
#配置LAN接口，允许http、ping、ssh通过lanip登录设备
interface ${lan1}
 ip address ${lan1ipmask}
 service-manage http permit
 service-manage https permit
 service-manage ssh permit
 service-manage ping permit
 ### DHCP按需配置
 dhcp select interface
 dhcp server ip-range 192.168.8.1 192.168.8.254
 dhcp server mask 255.255.255.0
 dhcp server gateway-list 192.168.8.1
 dhcp server dns-list 192.168.8.1
#
#开启DHCP
dhcp enable
#
#配置主备Tun CE对接IP
interface LoopBack1
 description Main-IPsec-lo
 ip address ${ce1lo} 32
#
interface LoopBack2
 description Back-IPsec-lo
 ip address ${ce2lo} 32
#
#配置OverseaIP
interface LoopBack100
 description OverseaIP
 ip address ${OverseaIP1} 32
#
interface LoopBack200
 description OverseaIP
 ip address ${OverseaIP2} 32
#
acl number 3001
 rule 5 permit ip source ${ce1lo} 0 destination 10.255.108.0 0.0.3.255
#
acl number 3002
 rule 5 permit ip source ${ce1lo} 0 destination 10.255.108.0 0.0.3.255
 rule 10 permit ip source ${ce2lo} 0 destination 10.255.111.128 0.0.0.127
#
ike proposal 1
 encryption-algorithm aes-256
 dh group14
 authentication-algorithm sha2-256
 authentication-method pre-share
 integrity-algorithm hmac-sha2-384
 prf hmac-sha2-384
#
ike proposal 2
 encryption-algorithm aes-256
 dh group14
 authentication-algorithm sha2-256
 authentication-method pre-share
 integrity-algorithm hmac-sha2-384
 prf hmac-sha2-384
#
ipsec proposal 1
 encapsulation-mode auto
 undo esp authentication-algorithm
 esp encryption-algorithm aes-128-gcm-128
#
ipsec proposal 2
 encapsulation-mode auto
 undo esp authentication-algorithm
 esp encryption-algorithm aes-128-gcm-128
#
ike peer main
 pre-shared-key both-win
 ike-proposal 1
 local-id-type fqdn
 remote-id-type none
 local-id ${authid1}
 dpd type periodic
 remote-address ${ac1pub}
 negotiate route inject enable
 Y
#
ike peer back
 pre-shared-key both-win
 ike-proposal 2
 local-id-type fqdn
 remote-id-type none
 local-id ${authid2}
 dpd type periodic
 remote-address ${ac2pub}
 negotiate route inject enable
 Y
#
ipsec policy IPsecPolicy1 10 isakmp
 security acl 3001
 ike-peer main
 proposal 1
 # 直接调用接口IP，仅接口多IP时指定IP
 # tunnel local ${wan1ip}
 tunnel local applied-interface
 Y
 alias Main-ipsec
 sa trigger-mode auto
 sa duration traffic-based 83886080
 sa duration time-based 3600
 route inject dynamic preference 60
#
ipsec policy IPsecPolicy2 10 isakmp
 security acl 3002
 ike-peer back
 proposal 2
 # 直接调用接口IP，仅接口多IP时指定IP
 # tunnel local ${wan1ip}
 tunnel local applied-interface
 Y
 alias Back-ipsec
 sa trigger-mode auto
 sa duration traffic-based 83886080
 sa duration time-based 3600
 route inject dynamic preference 80
#
interface Tunnel1
 description IPsec-Main-Tunnnel1-${ac1}
 ip address unnumbered interface ${wan1}
 tunnel-protocol ipsec
 ipsec policy IPsecPolicy1
#
interface Tunnel2
 description IPsec-Back-Tunnnel2-${ac2}
 ip address unnumbered interface ${wan1}
 tunnel-protocol ipsec
 ipsec policy IPsecPolicy2
#
interface Tunnel1000
 description Main-to-NATPE1-${pe1}-${pe1if}
 mtu 1452
 ip address ${pe1ip2} 30
 tunnel-protocol gre
 source LoopBack1
 destination ${pe1lo}
 service-manage all permit
#
interface Tunnel2000
 description Back-to-NATPE2-${pe2}-${pe2if}
 mtu 1452
 ip address ${pe2ip2} 30
 tunnel-protocol gre
 source LoopBack2
 destination ${pe2lo}
 service-manage all permit
#
firewall zone untrust
 add interface ${wan1}
 add interface Tunnel1
 add interface Tunnel2
 add interface Tunnel1000
 add interface Tunnel2000
#
#
firewall zone trust
 add interface ${lan1}
#
# tcp-mss 修改，避免上网问题或BGP起不来
firewall tcp-mss 1300
# 放通安全策略
security-policy
 rule name Deny_DoH_DoT
  source-zone trust
  destination-zone untrust
  source-address address-set LAN-IP
  application app DNS_Over_HTTPS
  action deny
 rule name Local_to_Untrust
  source-zone local
  source-zone untrust
  destination-zone local
  destination-zone untrust
  profile av default
  profile ips default
  profile url-filter default
  profile dns-filter default
  action permit
 rule name Trust_to_Untrust
  source-zone trust
  source-zone untrust
  destination-zone trust
  destination-zone untrust
  session logging
  traffic logging enable
  profile av default
  profile ips default
  profile url-filter default
  profile dns-filter default
  action permit
 rule name Trust_to_Local
  source-zone local
  source-zone trust
  destination-zone local
  destination-zone trust
  session logging
  traffic logging enable
  profile av default
  profile ips default
  profile url-filter default
  profile dns-filter default
  action permit
#
#nqa检测main tunnel
nqa test-instance fastip main
 test-type icmp
 destination-address ipv4 ${pe1ip1}
 source-address ipv4 ${pe1ip2}
 probe-count 1
 frequency 5
 start now
#
#拨入IP路由
ip route-static ${ac1pub} 255.255.255.255 1.1.1.1 description ac1pub
ip route-static ${ac2pub} 255.255.255.255 1.1.1.1 description ac2pub
#
#中控路由
ip route-static 119.145.21.126 255.255.255.255 1.1.1.1 description qiankunyun
ip route-static 119.145.21.124 255.255.255.255 1.1.1.1 description qiankunyun
#
#国内DNS路由
ip route-static 223.5.5.5 255.255.255.255 NULL0 track nqa fastip main
ip route-static 223.5.5.5 255.255.255.255 1.1.1.1 preference 222
ip route-static 223.6.6.6 255.255.255.255 NULL0 track nqa fastip main
ip route-static 223.6.6.6 255.255.255.255 1.1.1.1 preference 222
#
#配置跳板机路由
ip route-static 192.168.55.250 32 ${pe1ip1} track nqa fastip main description to-ns4
ip route-static 192.168.55.250 32 ${pe2ip1} preference 222 description to-ns4
#
ip route-static 192.168.55.10 32 ${pe1ip1}
ip route-static 192.168.55.11 32 ${pe2ip1}
#
ip route-static 114.113.245.99 32 ${pe1ip1}
ip route-static 114.113.245.100 32 ${pe2ip1}
#
#配置允许ssh登录设备
stelnet server enable
ssh ipv4 server port 2707
Y
ssh server rsa-key min-length 1024
ssh user bothwin
ssh user bothwin authentication-type password
ssh user bothwin service-type all
ssh user bothwin sftp-directory flash:
#
ssh server-source -i ${wan1}
Y
ssh server-source -i ${lan1}
Y
ssh server-source -i Tunnel1000
Y
ssh server-source -i Tunnel2000
Y
undo ssh server-source all-interface
undo ssh ipv6 server-source all-interface
ssh server assign pki default
Y
ssh authorization-type default aaa
#
ssh server cipher aes256_gcm aes128_gcm aes256_ctr aes192_ctr aes128_ctr
ssh server hmac sha2_256_96 sha2_256 sha1 sha1_96 md5 md5_96
ssh server key-exchange dh_group_exchange_sha256 dh_group16_sha512 curve25519_sha256
ssh server publickey ecc x509v3-ssh-rsa rsa_sha2_256 rsa_sha2_512
ssh server dh-exchange min-len 1024
#
ssh client first-time enable
ssh client publickey x509v3-ssh-rsa rsa_sha2_256 rsa_sha2_512
ssh client cipher aes256_gcm aes128_gcm aes256_ctr aes192_ctr aes128_ctr
ssh client hmac sha2_256_96 sha2_256 sha1 sha1_96 md5 md5_96
ssh client key-exchange dh_group_exchange_sha256 dh_group16_sha512 curve25519_sha256
#
#BGP Server 需要NOC白名单放通出口公网IP
ip route-static ${bgp1server1} 32 ${pe1ip1} description BGPserver1
ip route-static ${bgp1server1} 32 NULL0 preference 65 description BGPserver1
ip route-static ${bgp1server2} 32 ${pe1ip1} description BGPserver2
ip route-static ${bgp1server2} 32 NULL0 preference 65 description BGPserver2
ip route-static ${bgp2server1} 32 ${pe2ip1} description BGPserver3
ip route-static ${bgp2server2} 32 ${pe2ip1} description BGPserver4
#
ip community-filter 80 index 10 permit 65000:9939
ip community-filter 81 index 10 permit 65000:4134
ip community-filter 82 index 10 permit 65000:4837
ip community-filter 83 index 10 permit 65000:9808
#
#配置bgp分流下一跳
route-policy bgp-from--RSVR permit node 100
 description to-HK
 if-match community-filter 80
 apply ip-address next-hop ${pe1ip1}
#
route-policy bgp-from--RSVR permit node 200
 description to-internet
 if-match community-filter 81
 apply ip-address next-hop ${wan1gw}
#
route-policy bgp-from--RSVR permit node 300
 description to-internet
 if-match community-filter 82
 apply ip-address next-hop ${wan1gw}
#
route-policy bgp-from--RSVR permit node 400
 description to-internet
 if-match community-filter 83
 apply ip-address next-hop ${wan1gw}
#
route-policy bgp-from--RSVR deny node 999
#
route-policy bgp-from--RSVR2 permit node 100
 description to-HK
 if-match community-filter 80
 apply ip-address next-hop ${pe2ip1}
#
route-policy bgp-from--RSVR2 permit node 200
 description to-internet
 if-match community-filter 81
 apply ip-address next-hop ${wan1gw}
 apply local-preference 50
#
route-policy bgp-from--RSVR2 permit node 300
 description to-internet
 if-match community-filter 82
 apply ip-address next-hop ${wan1gw}
 apply local-preference 50
#
route-policy bgp-from--RSVR2 permit node 400
 description to-internet
 if-match community-filter 83
 apply ip-address next-hop ${wan1gw}
 apply local-preference 50
#
route-policy bgp-from--RSVR2 deny node 999
#
#拒绝在bgp server发布路由
route-policy bgp-from--deny deny node 999
#
bgp 65000
 router-id ${OverseaIP1}
 timer keepalive 5 hold 15
 Y
 private-4-byte-as enable
 peer ${bgp1server1} as-number 65000
 peer ${bgp1server1} connect-interface LoopBack100
 peer ${bgp1server2} as-number 65000
 peer ${bgp1server2} connect-interface LoopBack100
 peer ${bgp2server1} as-number 65000
 peer ${bgp2server1} connect-interface LoopBack200
 peer ${bgp2server2} as-number 65000
 peer ${bgp2server2} connect-interface LoopBack200
 #
 ipv4-family unicast
  preference 20 50 200
  peer ${bgp1server1} enable
  peer ${bgp1server1} route-policy bgp-from--RSVR import
  peer ${bgp1server1} route-policy bgp-from--deny export
  peer ${bgp1server2} enable
  peer ${bgp1server2} route-policy bgp-from--RSVR import
  peer ${bgp1server2} route-policy bgp-from--deny export
  peer ${bgp2server1} enable
  peer ${bgp2server1} route-policy bgp-from--RSVR2 import
  peer ${bgp2server1} route-policy bgp-from--deny export
  peer ${bgp2server2} enable
  peer ${bgp2server2} route-policy bgp-from--RSVR2 import
  peer ${bgp2server2} route-policy bgp-from--deny export
#
#配置nat
ip address-set LAN-IP type object
 address 0 10.0.0.0 mask 8
 address 1 172.16.0.0 mask 12
 address 2 192.168.0.0 mask 16
#
#配置流量经过tunnel转换源地址
# ID 0 如果被旧配置占用可以先删除，或者改其他ID
# undo nat address-group MainUSIP
# undo nat address-group BackUSIP
#
nat address-group Main_US_IP
 mode pat
 section 0 ${OverseaIP1} ${OverseaIP1}
#
nat address-group Back_US_IP
 mode pat
 section 0 ${OverseaIP2} ${OverseaIP2}
#
nat-policy
 rule name LOCAL_To_WAN
  source-zone local
  egress-interface ${wan1}
  action source-nat easy-ip
#
#该设备是客户网关模式需配置本地出口NAT（旁路模式可不需配置国内NAT）
#
nat-policy
 rule name LAN_To_WAN
  source-zone trust
  egress-interface ${wan1}
  source-address address-set LAN-IP
  action source-nat easy-ip
#
nat-policy
 rule name LAN_To_Main_US
  source-zone trust
  egress-interface Tunnel1000
  source-address address-set LAN-IP
  action source-nat address-group Main_US_IP
#
nat-policy
 rule name LAN_To_Back_US
  source-zone trust
  egress-interface Tunnel2000
  source-address address-set LAN-IP
  action source-nat address-group Back_US_IP
#
DNS
################################################
# 配置dns，监听本地接口IP
# 使用ce的ipsec lo地址为原，访问内部DNS服务器
# 先删除旧的，再加我们的
# 优先配置我们的DNS，最后配置本地逃生DNS
# 最多可以指定6个DNS Server，在进行动态域名解析的时候，按照DNS Server的配置顺序发送查询报文。
# 首先向配置的第一个DNS Server发送域名请求，如果在指定时间（
# 通过执行命令dns forward retry-timeout进行配置）内没有收到响应，就重新发送域名请求。
# 在重发了指定次数（dns forward retry-number）后，如果仍然没有收到响应，
# 就向下一个DNS Server发送请求，依次进行。

# DNS为感兴趣流，所以要加原IP为感兴趣流IP
# 但是这样会导致DNS无法访问国内运营商公网DNS等，需要加出接口SNAT：“DNS走本地SNAT”

# DNS列表，按实际出口选择
# NOC按需求不断增加，如没有对应的当地出口DNS，可提前找NOC增加。

#智能dns，在企业微信群《DNS需求-F-guard融合网关【加速无忧】》公告里面找

#####################################################################
#先删除旧配置，不然旧的DNS配置可能会影响解析结果
undo dns server
dns resolve
dns server ${dns1ip}
dns server ${dns2ip}
dns server ${localdns1ip}
dns server ${localdns2ip}
dns server source-interface LoopBack1
dns server bind local-ip ${lan1ip}
dns-server-select-algorithm fixed
#fixed表示是配置选择DNS服务器的固定算法，从上往下匹配
#
dns proxy enable
dns proxy forward-any-response
#降低轮询次数和时间，避免轮询到本地DNS时间太久，无法响应
dns forward retry-number 0
dns forward retry-timeout 1
#
dns-transparent-policy
 dns transparent-proxy enable
 dns server bind interface ${wan1} preferred ${localdns1ip} alternate ${localdns2ip} health-check enable
 dns server bind interface Tunnel1 preferred ${dns1ip} alternate ${dns2ip} health-check enable
 dns server bind interface Tunnel2 preferred ${dns1ip} alternate ${dns2ip} health-check enable
 ### 指定DNS解析，海外必须指定内部DNS！！！
 dns transparent-proxy exclude domain 【国内域名】 server preferred ${localdns1ip} alternate ${localdns2ip}
 dns transparent-proxy exclude domain 【海外域名】 server preferred ${dns1ip} alternate ${dns2ip}
#
#DNS乱序问题
diagnose
startup saved-configuration mode cfg
quit
#
#Dns劫持
#定义访问目标IP
ip address-set Any-IP type object
 address 0 0.0.0.0 mask 1
 address 1 128.0.0.0 mask 1
#
#定义目标转换后IP(lan ip)
destination-nat address-group DNS-IP
 section 0 ${lan1ip} ${lan1ip}
#
nat-policy
 rule name DNS_Redirect_To_Local
  source-zone trust
  source-address 192.168.0.0 mask 255.255.0.0
  destination-address address-set Any-IP
  #只匹配目标dns端口
  service dns dns-tcp
  #目标IP转成DNS-IP
  action destination-nat address-group DNS-IP
#
#Qos 10M ，保障DNS流量2M
interface Tunnel1000
 bandwidth egress 10000
#
interface Tunnel2000
 bandwidth egress 10000
#
#设置dns qos带宽优先保证
bandwidth-policy
 profile name tun-dns
  #最大上传下载4M
  bandwidth maximum-bandwidth whole upstream 10000
  bandwidth maximum-bandwidth whole downstream 10000
  #优先保证2M
  bandwidth guaranteed-bandwidth whole upstream 2000
  bandwidth guaranteed-bandwidth whole downstream 2000
  #报文dscp
  remark dscp cs1
 rule name tun-dns
  #出口tunnel
  egress-interface Tunnel1000
  egress-interface Tunnel2000
  #保证dns服务
  service dns
  #调用以上最大带宽与保证带宽
  action qos profile tun-dns
#
# OPS
info-center enable
ops
assistant ipsec1down
execute 1 command sys
execute 2.1 command ipsec policy IPsecPolicy1 10 isakmp
execute 2.2 command undo policy enable
execute 2.3 command ping -q -c 360 127.0.0.1
execute 2.4 command policy enable
execute 2.5 command quit
condition alarm feature ipsec name hwIPSecTunnelStop DstIP eq ${ac1pub}
#
ops
assistant ipsec2down
execute 1 command sys
execute 2.1 command ipsec policy IPsecPolicy2 10 isakmp
execute 2.2 command undo policy enable
execute 2.3 command ping -q -c 360 127.0.0.1
execute 2.4 command policy enable
execute 2.5 command quit
condition alarm feature ipsec name hwIPSecTunnelStop DstIP eq ${ac2pub}
#
# 保存配置
quit
save
#
#SD-Card格式化
>sys  #进入系统视图
]diagnose  #进入调试视图
diagnose] display device disk  #查看当前SD-Card的状态，未格式化时是"未注册"状态，格式化后是注册状态
diagnose] format disk partition nlog  #格式化SD-Card，失败就再格式化一次。
diagnose] quit
>disk offline  #格式化Ext4后需要重新下电和上电，使SD-Card挂载到系统
>disk online  #如果命令行上下电失败，可手动拔插
>sys
]diagnose
diagnose] display device disk
diagnose] display disk partition nlog  #查看log日志盘大小是否与SD-Card一致
#
#License
https://esdp.huawei.com/sdpcust/#/guest
私有化中控乾坤接人IP端口 119.145.21.126  10020
调试测试
# ike
display ike sa
# ipsec
display ipsec sa
#
# 查看BGP状态
display bgp all summary
display bgp peer
# 上游DNS端口测试可达
ping tcp -a ${ce1lo} ${localdns1ip} 53
ping tcp -a ${ce1lo} ${dns1ip}  53
ping tcp -a ${ce1lo} ${dns2ip}  53
# 查看DNS
display dns server verbose
display dns configuration
# DNS在切换测试
1、关闭主线IPsec，客户端PC测试解析国内外；
2、关闭主、备线IPsec，客户端PC测试解析国内外；
#
# 上线之后需要，LAN侧的PC测试攻击，攻击链接如下：
F-Guard交付前验证是否能正常产生告警：
PC用web访问以下恶意域名，流量经过设备，访问后可在事件里产生告警
 浏览器访问一下域名即可，实际网页是打不开的，安全中控会产生告警的。
http://223.5.5.5/f/discuz?agId=0&charset=gbk&key=%3Cscript%3Ealert(/xss/)%3C/script%3E
http://124.70.187.71/?A=B189216B739460A8F2A95093329E3608A0521DBE
https://record.boreye.com
https://update.boreye.com
https://bk.boreye.com
https://www.binance.com/

注：
# 清除FG系统DNS缓存
reset dns dynamic-host
#
#来回路径不一致的情况下，关闭状态检测，
#
undo firewall session link-state check
#
`;
  let scriptName = `${lineid}-Huawei-F-Guard-FastIP-GRE-Over-IPsec-Config-${time.ez}-By-${user}`;
  console.log(usg_fastip003mplsGreOverIPsec);
  downloadConfig(scriptName, usg_fastip003mplsGreOverIPsec);
};