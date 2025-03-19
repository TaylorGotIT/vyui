/***
华为天关防火墙 FastIP GRE Over IPsec
***/
const usg_fastip001html = `<table border="1">
<tr>
<td><input id="site1_id_input"></td>
<td><input id="site2_id_input"></td>
</tr>
<tr>
<td>WAN接口<select id="wan1_select">
<option value="G0/0/8" selected="selected">G8</option>
<option value="G0/0/9">G9</option>
<option value="G0/0/7">G7</option>
<option value="G0/0/6">G6</option>
</select>
</td>
<td>
<select id="wan1_type_select" onchange=usg_fastip001setWan1type(this.value)>
<option value="dhcp" selected="selected">WAN[ DHCP ]</option>
<option value="static">WAN[ Static ]</option>
</select>
</td>
</tr>

<tr id="wan1_setup_tr"></tr>

<tr>
<td>LAN接口<select id="lan1_select">
<option value="G0/0/1" selected="selected">G1</option>
<option value="G0/0/2">G2</option>
<option value="G0/0/3">G3</option>
<option value="G0/0/4">G4</option>
<option value="G0/0/5">G5</option>
<option value="G0/0/6">G6</option>
<option value="G0/0/7">G7</option>
</select>
</td>
<td><input id="lan1_ip_input" placeholder="[lan-ip]192.168.8.1/24"></td>
</tr>
<tr>
<td><input id="line1_input"></td>
<td><input id="line2_input"></td>
</tr>
<tr>
<td><input id="pe1_input"></td>
<td><input id="pe2_input"></td>
</tr>
<tr>
<td><input id="pe1_if_input"></td>
<td><input id="pe2_if_input"></td>
</tr>
<tr>
<td><input id="pe1_ip_input"></td>
<td><input id="pe2_ip_input"></td>
</tr>
<tr>
<td><input id="pe1_lo_input"></td>
<td><input id="pe2_lo_input"></td>
</tr>
<tr>
<td><input id="ce1_lo_input"></td>
<td><input id="ce2_lo_input"></td>
</tr>
<tr>
<td><input id="bgp1_lo_input"></td>
<td><input id="bgp2_lo_input"></td>
</tr>
<tr>
<td><input id="hkip1_input"></td>
<td><input id="hkip2_input"></td>
</tr>
<tr>
<td><input id="bgp1server_input"></td>
<td><input id="bgp2server_input"></td>
</tr>
<tr>
<td><input id="pe1_pub_input"></td>
<td><input id="pe2_pub_input"></td>
</tr>
<tr>
<td><input id="pe1_psk_input"></td>
<td><input id="pe2_psk_input"></td>
</tr>

</table>
<button type="button" onclick="usg_fastip001sub('/config')">提交配置信息(Submit Config Info)</button>
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

function usg_fastip001getList() {
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
                "bgplo":[],
                "bgpserver":[],
                "pub":[],
                "route":[],
                "psk":[],
                "hkip":[],
                "other":[],
            };
    for(let i = 0; i < lines.length; i++) {
        let line = lines[i]
        if(line!==""){
            let l = line.split(":");
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
                case 'loip':
                    info_json.bgplo.push(l1);
                    break;
                case 'hkip':
                    info_json.hkip.push(l1);
                    break;
                case 'bgpserverip':
                    info_json.bgpserver.push(l1);
                    break;
                case '拨号ip':
                    info_json.pub.push(l1);
                    break;
                case '秘钥':
                    info_json.psk.push(l1);
                    break;
                case '密钥':
                    info_json.psk.push(l1);
                    break;
                default:
                    if(l0.search('as')!=-1){
                        info_json.route.push(l1);
                    }
                    info_json.other.push(l1);
            }
        }
    }
    console.log(info_json);
    let site1id = info_json.id[0].replace(/[0-9]+/g,"");
    let site1num = getColNum(site1id);
    $("#site1_id_input").val(info_json.id[0]);
    $("#site2_id_input").val(info_json.id[1]);
    $("#line1_input").val(info_json.id[0]);
    $("#pe1_input").val(info_json.pe[0]);
    $("#pe1_if_input").val(info_json.if[0]);
    $("#pe1_ip_input").val(info_json.ip[0]);
    $("#pe1_pub_input").val(info_json.pub[0]);
    $("#pe1_lo_input").val(info_json.pelo[0]);
    $("#ce1_lo_input").val(info_json.celo[0]);
    $("#bgp1_lo_input").val(info_json.bgplo[0]);
    $("#hkip1_input").val(info_json.hkip[0]);
    $("#bgp1server_input").val(info_json.bgpserver[0]);
    $("#pe1_psk_input").val(info_json.psk[0]);
    $("#line2_input").val(info_json.id[1]);
    $("#pe2_input").val(info_json.pe[1]);
    $("#pe2_if_input").val(info_json.if[1]);
    $("#pe2_ip_input").val(info_json.ip[1]);
    $("#pe2_pub_input").val(info_json.pub[1]);
    $("#pe2_lo_input").val(info_json.pelo[1]);
    $("#ce2_lo_input").val(info_json.celo[1]);
    $("#bgp2_lo_input").val(info_json.bgplo[2]);
    $("#hkip2_input").val(info_json.hkip[1]);
    $("#bgp2server_input").val(info_json.bgpserver[1]);
    $("#pe2_psk_input").val(info_json.psk[1]);

}
//填充模板表格
$("#service_dev").append(usg_fastip001html);
//加载测试资源的解析数据
usg_fastip001getList();
function usg_fastip001setWan1type(value){
    $("#wan1_setup_tr").empty();
    let html = '';
    switch(value){
        case "dhcp":
            console.log(value);
            html += ``;
            break;
        case "static":
            console.log(value);
             html += `<td><input id="wan1_ip_input" placeholder="wan x.x.x.x/xx" required></td><td><input id="wan1_gw_input" placeholder="wan x.x.x.x/xx" required></td>`;
            break;
        case "pppoe":
            console.log(value);
            html += `<td><input id="wan1_pppoe_account_input" placeholder="wan pppoe account" required></td><td><input id="wan1_pppoe_password_input" placeholder="wan pppoe password" required></td>`;
            break;
    }
    console.log(html);
    $("#wan1_setup_tr").append(html);
};


function usg_fastip001sub(url){
  let user = $("#user_input").val();
  let time=getTime(new Date());
  let wan1 = $("#wan1_select").val();
  let line1 = $("#line1_input").val();
  let line2 = $("#line1_input").val();
  let lineid = line1.substr(0,7);
  let cid = line1.substr(0,6);
  let pe1 = $("#pe1_input").val();
  let pe1if = $("#pe1_if_input").val();
  let pe1ips = ipNext($("#pe1_ip_input").val().split('/')[0]);
  let pe1ip1 = pe1ips[0];
  let pe1ip2 = pe1ips[1];
  let pe1lo = $("#pe1_lo_input").val();
  let pe1pub = $("#pe1_pub_input").val();
  let pe1psk = $("#pe1_psk_input").val();
  let ce1lo = $("#ce1_lo_input").val();
  let bgp1lo = $("#bgp1_lo_input").val();

  let pe2 = $("#pe2_input").val();
  let pe2if = $("#pe2_if_input").val();
  let pe2ips = ipNext($("#pe2_ip_input").val().split('/')[0]);
  let pe2ip1 = pe2ips[0];
  let pe2ip2 = pe2ips[1];
  let pe2lo = $("#pe2_lo_input").val();
  let pe2pub = $("#pe2_pub_input").val();
  let pe2psk = $("#pe2_psk_input").val();
  let ce2lo = $("#ce2_lo_input").val();
  let bgp2lo = $("#bgp2_lo_input").val();
  let hkip1 = $("#hkip1_input").val().split('-')[0];
  let bgp1server = $("#bgp1server_input").val().split(',');
  let bgp2server = $("#bgp1server_input").val().split(',');
  let bgp1server1 = bgp1server[0];
  let bgp1server2 = bgp1server[1];
  let bgp2server1 = bgp2server[0];
  let bgp2server2 = bgp2server[1];


  let fmg_ip = $("#fmg_ip_input").val();
  let faz_ip = $("#faz_ip_input").val();
  let lan1 = $("#lan1_select").val();
  let lan1ip =  $("#lan1_ip_input").val();
  let lan1ipmask = cidrToSubnetMask(lan1ip);
  let hkip2 = $("#hkip2_input").val().split('-')[0];



  let wan1type = $("#wan1_type_select").val();
  console.log(wan1type);
  let wan_route_temp = '';
if(wan1type=='dhcp'){
    wan_route_temp =
`# WAN dhcp
#配置WAN接口，允许http、ping通过wanip登录设备
interface ${wan1}
 ip address dhcp-alloc
 service-manage http permit
 service-manage https permit
 service-manage ping permit
#
ip route 0.0.0.0 0 ${wan1} dhcp 222
ip route 1.1.1.1 32 ${wan1} dhcp
ip route ${pe1pub} 32 ${wan1} dhcp
ip route ${pe2pub} 32 ${wan1} dhcp
ip route ${pe1lo} 32 ${wan1} dhcp
ip route ${pe2lo} 32 ${wan1} dhcp
`;
}else if(wan1type=='static'){
    let wan1ip = $("#wan1_ip_input").val();
    let wan1gw = $("#wan1_gw_input").val();
    let wan1ipmask = cidrToSubnetMask(wan1ip);
    wan_route_temp =
`# WAN接口配置
#配置WAN接口，允许http、ping通过wanip登录设备
interface ${wan1}
 ip address ${wan1ipmask}
 service-manage http permit
 service-manage https permit
 service-manage ping permit
#
ip route-static 0.0.0.0 0 ${wan1} ${wan1gw} preference 222
ip route 1.1.1.1 32 ${wan1} ${wan1gw}
ip route-static ${pe1pub} 32 ${wan1gw} description pe1-pub
ip route-static ${pe2pub} 32 ${wan1gw} description pe2-pub
ip route-static ${pe1lo} 32 ${wan1gw} description pe1-lo
ip route-static ${pe2lo} 32 ${wan1gw} description pe2-lo
`;
}

let usg_fastip001mplsGreOverIPsec  =
`# Huawei USG Firewall MPLS GRE Over Ipsec Template.
# usg_fastip001
# Operator: ${user}
# ${time.cn}
# 用户配置

设备初始化
=================================
Please Press ENTER.
#USG6530F-D console登录需先手动设置密码（USG6510F-D需先电脑网线接管理口登录，初次登录需自定义账号密码）
Please configure the login password (8-16)
Enter Password:
#
${wan_route_temp}
#
#配置LAN接口，允许http、ping、ssh通过lanip登录设备
interface ${lan1}
 ip address ${lan1ipmask}
 service-manage http permit
 service-manage https permit
 service-manage ping permit
 service-manage ssh permit
#
#配置主备Tun CE对接IP
interface LoopBack1
 description main-ipsec
 ip address ${ce1lo} 32
#
interface LoopBack2
 description back-ipsec
 ip address ${ce2lo} 32
#
#配置HKIP
interface LoopBack3
 description HKIP
 ip address ${hkip1} 32
#
#配置接口安全区域（WAN、LAN）
firewall zone untrust
 add interface ${wan1}
#
firewall zone trust
 add interface ${lan1}
#
#配置账号登录设备权限默认开ssh登录
aaa
 local-user bothwin password irreversible-cipher $1d$SH&O/nY^9;OHSb3D$*^Hn/TTHO<sX,d9vMUd69{cw69W}[XyyGU9|iqnE$
 local-user bothwin password-force-change disable
 local-user bothwin privilege level 3
 local-user bothwin service-type terminal telnet http ssh
 local-user ${cid} password irreversible-cipher ${cid}@zxc
 local-user ${cid} password-force-change disable
 local-user ${cid} privilege level 3
 local-user ${cid} service-type terminal http
#
#配置ipsec感兴趣流
acl number 3001
 rule 5 permit ip source ${ce1lo} 0 destination ${pe1lo} 0
#
acl number 3002
 rule 5 permit ip source ${ce2lo} 0 destination ${pe2lo} 0
#
ike proposal 1
 encryption-algorithm 3des
 dh group2
 authentication-algorithm sha2-256
 sa duration 28800
 authentication-method pre-share
 integrity-algorithm hmac-sha2-256
 prf hmac-sha2-256
#
ipsec proposal 1
 esp authentication-algorithm sha1
 esp encryption-algorithm 3des
#
ike peer main
 pre-shared-key ${pe1psk}
 ike-proposal 1
 remote-id-type none
 dpd type periodic
 remote-address ${pe1pub}
#
ike peer back
 pre-shared-key ${pe2psk}
 ike-proposal 1
 remote-id-type none
 dpd type periodic
 remote-address ${pe2pub}
#
ipsec policy S2S-IPSEC 10 isakmp
 security acl 3001
 ike-peer main
 proposal 1
 tunnel local applied-interface
 alias Main-ipsec
 sa trigger-mode auto
 sa duration traffic-based 83886080
 sa duration time-based 3600
#
ipsec policy S2S-IPSEC 20 isakmp
 security acl 3002
 ike-peer back
 proposal 1
 tunnel local applied-interface
 alias Back-ipsec
 sa trigger-mode auto
 sa duration traffic-based 83886080
 sa duration time-based 3600
#
#WAN口应用IPsec
interface ${wan1}
 ipsec policy S2S-IPSEC
#
#配置tunnel
interface Tunnel0
 ip address ${pe1ip2} 30
 tunnel-protocol gre
 source ${ce1lo}
 destination ${pe1lo}
 mtu 1400
 service-manage all permit
#
interface Tunnel1
 ip address ${pe2ip2} 30
 tunnel-protocol gre
 source ${ce2lo}
 destination ${pe2lo}
 mtu 1400
 service-manage all permit
#
#配置tunnel安全区域
firewall zone untrust
 add interface Tunnel0
 add interface Tunnel1
#
#nqa检测main tunnel
nqa test-instance ipsec main
 test-type icmp
 destination-address ipv4 ${pe1ip1}
 source-address ipv4 ${pe1ip2}
 probe-count 1
 frequency 5
 start now
#
#配置跳板机路由
ip route-static 192.168.55.250 32 ${pe1ip1} track nqa ipsec main description to-ns4
ip route-static 192.168.55.250 32 ${pe2ip1} preference 222 description to-ns4
#放行安全策略，定义tun对接IP
ip address-set Tun-IPsec-CE type object
 address 0 ${ce1lo} mask 32
 address 1 ${ce2lo} mask 32
#
ip address-set Tun-IPsec-PE type object
 address 0 ${pe1lo} mask 32
 address 1 ${pe2lo} mask 32
#
#安全策略放行
security-policy
 rule name IPsec-ip
 #放行ipsec对接IP策略
  source-zone local
  source-zone untrust
  destination-zone local
  destination-zone untrust
  source-address address-set Tun-IPsec-CE
  source-address address-set Tun-IPsec-PE
  destination-address address-set Tun-IPsec-CE
  destination-address address-set Tun-IPsec-PE
  action permit
 rule name default-policy
  source-zone local
  source-zone trust
  source-zone untrust
  destination-zone local
  destination-zone trust
  destination-zone untrust
  action permit
#
#配置bgp community
ip community-filter 80 index 10 permit 65000:9939
ip community-filter 81 index 10 permit 65000:4134
ip community-filter 82 index 10 permit 65000:4837
ip community-filter 83 index 10 permit 65000:9808
#
#配置bgp路由
ip route-static ${bgp1server1} 32 ${pe1ip1} track nqa ipsec main description to-main-bgp
ip route-static ${bgp1server2} 32 ${pe1ip1} track nqa ipsec main description to-main-bgp
ip route-static ${bgp2server1} 32 ${pe2ip1} description to-back-bgp
ip route-static ${bgp2server2} 32 ${pe2ip1} description to-back-bgp
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
 apply ip-address next-hop 1.1.1.1
#
route-policy bgp-from--RSVR permit node 300
 description to-internet
 if-match community-filter 82
 apply ip-address next-hop 1.1.1.1
#
route-policy bgp-from--RSVR permit node 400
 description to-internet
 if-match community-filter 83
 apply ip-address next-hop 1.1.1.1
#
route-policy bgp-from--RSVR2 permit node 100
 description to-HK
 if-match community-filter 80
 apply ip-address next-hop ${pe2ip1}
#
route-policy bgp-from--RSVR2 permit node 200
 description to-internet
 if-match community-filter 81
 apply ip-address next-hop 1.1.1.1
 apply local-preference 50
#
route-policy bgp-from--RSVR2 permit node 300
 description to-internet
 if-match community-filter 82
 apply ip-address next-hop 1.1.1.1
 apply local-preference 50
#
route-policy bgp-from--RSVR2 permit node 400
 description to-internet
 if-match community-filter 83
 apply ip-address next-hop 1.1.1.1
 apply local-preference 50
#
bgp 65000
 router-id ${bgp1lo}
 private-4-byte-as enable
 peer ${bgp1server1} as-number 65000
 peer ${bgp1server1} connect-interface LoopBack3
 peer ${bgp1server2} as-number 65000
 peer ${bgp1server2} connect-interface LoopBack3
 peer ${bgp2server1} as-number 65000
 peer ${bgp2server1} connect-interface LoopBack3
 peer ${bgp2server2} as-number 65000
 peer ${bgp2server2} connect-interface LoopBack3
 #
 ipv4-family unicast
  preference 50 100 200
  peer ${bgp1server1} enable
  peer ${bgp1server1} route-policy bgp-from--RSVR import
  peer ${bgp1server2} enable
  peer ${bgp1server2} route-policy bgp-from--RSVR import
  peer ${bgp2server1} enable
  peer ${bgp2server1} route-policy bgp-from--RSVR2 import
  peer ${bgp2server2} enable
  peer ${bgp2server2} route-policy bgp-from--RSVR2 import
# 可选DNS
# 10.255.108.1	hza-ctsindns1
# 10.255.108.2	sha-ctsindns1
# 10.255.108.3	sha-cthkdns1
# 10.255.108.4	bja-cthkdns1
# 10.255.108.5	szd-cthkdns1
#DNS路由
ip route-static 192.168.251.138 32 ${pe1ip1} description to-main-dns
ip route-static 192.168.253.137 32 ${pe1ip1} description to-main-dns
ip route-static 192.168.253.86 32 ${pe2ip1} description to-back-dns
#配置dns
dns resolve
dns server 192.168.251.138
dns server 192.168.253.137
dns server 192.168.253.86
#
#配置dns透明代理
dns-transparent-policy
 #开启DNS透明代理功能
 dns transparent-proxy enable
 #绑定DNS出接口
 dns server bind interface Tunnel0 preferred 192.168.251.138 alternate 192.168.253.137 health-check enable
 dns server bind interface Tunnel1 preferred 192.168.253.86 health-check enable
 #配置域名使用指定DNS解析
 dns transparent-proxy exclude domain *.airasia.com server preferred 202.96.128.86
 #DNS透明代理选路模式为根据全局选路模式
 mode based-on-multi-interface
 #配置DNS透明代理策略规则
 rule name policy_dns
  #配置DNS透明代理策略规则动作,tpdns表示对匹配该规则的流量做DNS透明代理
  action tpdns
#
#配置nat
ip address-set LAN-IP type object
 address 10 10.0.0.0 mask 8
 address 172 172.16.0.0 mask 12
 address 192 172.16.0.0 mask 16
#
#配置流量经过tunnel转换源地址
nat address-group HKIP 0
 mode pat
 section 0 ${hkip1} ${hkip2}
#
nat-policy
 #该设备是客户网关模式需配置本地出口NAT（旁路模式可不需配置国内NAT）
 rule name GuideNatPolicy
  source-zone trust
  egress-interface ${wan1}
  source-address address-set LAN-IP
  action source-nat easy-ip
 #
 #配置访问国外NAT
 rule name TO-HK
  source-zone trust
  egress-interface Tunnel0
  egress-interface Tunnel1
  source-address address-set LAN-IP
  action source-nat address-group HKIP
#Web页面
web-manager enable port 8443
web-manager server-source -i ${wan1}
web-manager server-source -i ${lan1}
#
#配置允许ssh登录设备
stelnet server enable
ssh server rsa-key min-length 1024
ssh user bothwin
ssh user bothwin authentication-type password
ssh user bothwin service-type all
ssh user bothwin sftp-directory flash:
ssh user huawei
ssh user huawei authentication-type x509v3-rsa
ssh user huawei assign pki default
ssh user huawei service-type snetconf
ssh server-source -i ${lan1}
ssh server-source -i Tunnel0
ssh server-source -i Tunnel1
undo ssh server-source all-interface
undo ssh ipv6 server-source all-interface
ssh server assign pki default
ssh authorization-type default aaa
#
ssh server cipher aes256_gcm aes128_gcm aes256_ctr aes192_ctr aes128_ctr
ssh server hmac sha2_256_96 sha2_256 sha1 sha1_96 md5 md5_96
ssh server key-exchange dh_group_exchange_sha256 dh_group16_sha512 curve25519_sha256
ssh server publickey ecc rsa rsa_sha2_256 rsa_sha2_512
ssh server dh-exchange min-len 1024
#
#设置tunnel带宽4M
interface Tunnel0
 bandwidth egress 4000
#
interface Tunnel1
 bandwidth egress 4000
#
#设置dns qos带宽优先保证
bandwidth-policy
 profile name tun-dns
  #最大上传下载4M
  bandwidth maximum-bandwidth whole upstream 4000
  bandwidth maximum-bandwidth whole downstream 4000
  #优先保证2M
  bandwidth guaranteed-bandwidth whole upstream 2000
  bandwidth guaranteed-bandwidth whole downstream 2000
  #报文dscp
  remark dscp cs1
 rule name tun-dns
  #出口tunnel
  egress-interface Tunnel0
  egress-interface Tunnel1
  #保证dns服务
  service dns
  #调用以上最大带宽与保证带宽
  action qos profile tun-dns
  quit
#
#Dns劫持
#定义访问目标IP
ip address-set 11 type object
 address 0 0.0.0.0 mask 1
 address 1 128.0.0.0 mask 1
#
#定义目标转换后IP(lan ip)
destination-nat address-group 0 nat1
 reference count: 1
 section 0 192.168.250.1 192.168.250.1
#
nat-policy
 rule name dns
  source-zone trust
  source-address 192.168.0.0 mask 255.255.0.0
  destination-address address-set 11
  #只匹配目标dns端口
  service dns
  #目标IP转成nat1 IP
  action destination-nat address-group nat1


#来回路径不一致的情况下，关闭状态检测，
undo firewall session link-state check
# 保存配置
quit
save

注：
1、6530跳板机登录设备会用curve25519-sha256密钥算法导致无法登录，会提示如下
Received disconnect from 10.10.168.230 port 22:2: The connection is closed by SSH Server
Disconnected from 10.10.168.230 port 22

2、手动指定diffie-hellman-group-exchange-sha256密钥算法登录设备
ssh-oKexAlgorithms=diffie-hellman-group-exchange-sha256 bothwin@10.10.168.230

3、6510默认diffie-hellman-group-exchange-sha256密钥算法登录

`;
  let scriptName = `${line1}-Huawei-USG-Firewall-MPLS-GRE-Over-IPsec-Config-${time.ez}-By-${user}`;
  console.log(usg_fastip001mplsGreOverIPsec);
  downloadConfig(scriptName, usg_fastip001mplsGreOverIPsec);
};