const sdwan002html = `<table border="1">
<tr><td><select id="wan1_select">
<option value="G0/0/6" selected="selected">WAN-G0/0/6</option>
 <option value="G0/0/7">WAN-G0/0/7</option>
 <option value="G0/0/8">WAN-G0/0/8</option>
 <option value="G0/0/9">WAN-G0/0/9</option>
</select></td>
<td><select id="wan2_select">
<option value="G0/0/7">WAN-G0/0/6</option>
 <option value="G0/0/7" selected="selected">WAN-G0/0/7</option>
 <option value="G0/0/8">WAN-G0/0/8</option>
 <option value="G0/0/9">WAN-G0/0/9</option>
</select></td></tr>
<tr><td><input id="wan1_ip_input" placeholder="[wan1-ip]192.168.1.254/24"></td>
<td><input id="wan2_gw_input" placeholder="[wan2-gw]192.168.2.1"></td></tr>
<tr><td><input id="wan1_gw_input" placeholder="[wan1-gw]192.168.1.1"></td>
<td><input id="wan2_ip_input" placeholder="[wan2-ip]192.168.2.254/24"></td></tr>
<tr><td id="lineid_td"></td>
<td><select id="loop_ip_select">
 <option value="0.1-0.2" selected="selected">站点A[0.0/30]</option>
 <option value="0.5-0.6">站点B[0.4/30]</option>
 <option value="0.9-0.10">站点C[0.8/30]</option>
 <option value="0.13-0.14">站点D[0.12/30]</option>
 <option value="0.17-0.18">站点E[0.16/30]</option>
 <option value="0.21-0.22">站点F[0.20/30]</option>
 <option value="0.25-0.26">站点G[0.24/30]</option>
 <option value="0.29-0.30">站点G[0.28/30]</option>
 <option value="0.33-0.34">站点H[0.32/30]</option></select></td></tr>
 <tr><td><select id="loop_if1_select">
 <option value="G0/0/2">自环LAN[G0/0/2]</option>
 <option value="G0/0/3">自环LAN[G0/0/3]</option>
 <option value="G0/0/4" selected="selected">自环LAN[G0/0/4]</option>
 <option value="G0/0/5">自环LAN[G0/0/5]</option>
 <option value="G0/0/6">自环LAN[G0/0/6]</option>
 <option value="G0/0/7">自环LAN[G0/0/7]</option>
 <option value="G0/0/7">自环LAN[G0/0/8]</option>
 <option value="G0/0/7">自环LAN[G0/0/9]</option></select></td>
 <td><select id="loop_if2_select">
 <option value="G0/0/2">自环WAN[G0/0/2]</option>
 <option value="G0/0/3">自环WAN[G0/0/3]</option>
 <option value="G0/0/4">自环WAN[G0/0/4]</option>
 <option value="G0/0/5" selected="selected">自环WAN[G0/0/5]</option>
 <option value="G0/0/6">自环WAN[G0/0/6]</option>
 <option value="G0/0/7">自环WAN[G0/0/7]</option>
 <option value="G0/0/7">自环WAN[G0/0/8]</option>
 <option value="G0/0/7">自环WAN[G0/0/9]</option></select></td></tr>
  <tr><th id="line1_th"></th><th id="line2_th"></th></tr>
  <tr><td id="pe1_td"></td><td id="pe2_td"></td></tr>
  <tr><td id="pe1_if_td"></td><td id="pe2_if_td"></tr>
  <tr><td id="pe1_ip_td"></td><td id="pe2_ip_td"></td></tr>
  <tr><td id="pe1_lo_td"></td><td id="pe2_lo_td"></td></tr>
  <tr><td id="ce1_lo_td"></td><td id="ce2_lo_td"></td></tr>
  <tr><td id="pe1_pub_td"></td><td id="pe2_pub_td"></td></tr>
  <tr><td id="pe1_psk_td"></td><td id="pe2_psk_td"></td></tr>
</table>
<button type="button" onclick="sdwan002sub('/config')">提交配置信息(Submit Config Info)</button>
`;

function sdwan002getList() {
    let str = $("#config_textarea").val();
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
                "pub":[],
                "psk":[],
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
                case 'pe 对接':
                    info_json.pelo.push(l1);
                    break;
                case 'ce 对接':
                    info_json.celo.push(l1);
                    break;
                case '拨号ip':
                    info_json.pub.push(l1);
                    break;
                case '秘钥':
                    info_json.psk.push(l1);
                    break;
                default:
                    info_json.other.push(l1);
            }
        }
    }
    console.log(info_json);
    $("#lineid_td").append(info_json.id[0].substr(0,7));
    $("#line1_th").append(info_json.id[0]);
    $("#pe1_td").append(info_json.pe[0]);
    $("#pe1_if_td").append(info_json.if[0]);
    $("#pe1_ip_td").append(info_json.ip[0]);
    $("#pe1_pub_td").append(info_json.pub[0]);
    $("#pe1_lo_td").append(info_json.pelo[0]);
    $("#ce1_lo_td").append(info_json.celo[0]);
    $("#pe1_psk_td").append(info_json.psk[0]);
    $("#line2_th").append(info_json.id[1]);
    $("#pe2_td").append(info_json.pe[1]);
    $("#pe2_if_td").append(info_json.if[1]);
    $("#pe2_ip_td").append(info_json.ip[1]);
    $("#pe2_pub_td").append(info_json.pub[1]);
    $("#pe2_lo_td").append(info_json.pelo[1]);
    $("#ce2_lo_td").append(info_json.celo[1]);
    $("#pe2_psk_td").append(info_json.psk[1]);
}
//填充模板表格
$("#service_dev").append(sdwan002html);
//加载测试资源的解析数据
sdwan002getList();
function sdwan002setWan1type(value){
    $("#wan_setup_td").empty();
    let html = '';
    switch(value){
        case "dhcp":
            console.log(value);
            html += `<input id="wan1_input" value="G0/0/x">`;
            break;
        case "static":
            console.log(value);
             html += `<input id="wan1_input" value="G0/0/6-ip/mask-gw">`;
            break;
        case "pppoe":
            console.log(value);
            html += `<input id="wan1_input" placeholder="account/password" required>`;
            break;
    }
    console.log(html);
    $("#wan_setup_td").append(html);
};

function sdwan002sub(url){
  let user = $("#user_input").val();
  let time=getTime(new Date());
  let wan1 = $("#wan1_select").val();
  let loopif1 = $("#loop_if1_select").val();
  let loopif2 = $("#loop_if2_select").val();
  let loopips = $("#loop_ip_select").val().split('-');
  let loopif1ip1 = "100.64." + loopips[1];
  let loopif1ip2 = "100.65." + loopips[1];
  let loopif2ip1 = "100.64." + loopips[0];
  let loopif2ip2 = "100.65." + loopips[0];
  let wan1ip = $("#wan1_ip_input").val().replace('/',' ');
  let wan1gw = $("#wan1_gw_input").val();
  let lineid = $("#lineid_td").html();
  let pe1 = $("#pe1_td").html();
  let pe1if = $("#pe1_if_td").html();
  let pe1ips = ipNext($("#pe1_ip_td").html().split('/')[0]);
  let pe1ip1 = pe1ips[0];
  let pe1ip2 = pe1ips[1];
  let pe1lo = $("#pe1_lo_td").html();
  let pe1pub = $("#pe1_pub_td").html();
  let ce1lo = $("#ce1_lo_td").html();

  let pe2 = $("#pe2_td").html();
  let pe2if = $("#pe2_if_td").html();
  let pe2ips = ipNext($("#pe2_ip_td").html().split('/')[0]);
  let pe2ip1 = pe2ips[0];
  let pe2ip2 = pe2ips[1];
  let pe2lo = $("#pe2_lo_td").html();
  let pe2pub = $("#pe2_pub_td").html();
  let ce2lo = $("#ce2_lo_td").html();
  let sdwan002mplsGreOverIPsec  =
`#Fnet Huawei SD-WAN MPLS with GRE Over Ipsec Template.
#Operator: ${user}
#${time.cn}
#version >= V300R019C13SPC200
# coding=utf-8
import ops
import sys
import os

def ops_condition(ops):
    value, descri_str = ops.iclog.subscribe(tag="startup", moduName="DEV", infoAlias="ENTUP", logInfo="register success")
    print('Script has being installed')
    return 0

def ops_execute(ops):
    handle, err_desp = ops.cli.open()
    print(err_desp)
    result, n11, n21 = ops.cli.execute(handle, "system-view")
    result, n11, n21 = ops.cli.execute(handle, "ip vpn-instance underlay_ipsec")
    result, n11, n21 = ops.cli.execute(handle, "ipv4-family")
    result, n11, n21 = ops.cli.execute(handle, "quit")
    result, n11, n21 = ops.cli.execute(handle, "quit")
    result, n11, n21 = ops.cli.execute(handle, "acl number 3333")
    result, n11, n21 = ops.cli.execute(handle, "rule 1 permit ip vpn-instance underlay_ipsec source ${ce1lo} 0 destination ${pe1lo} 0")
    result, n11, n21 = ops.cli.execute(handle, "acl number 3334")
    result, n11, n21 = ops.cli.execute(handle, "rule 1 permit ip vpn-instance underlay_ipsec source ${ce2lo} 0 destination ${pe2lo} 0")
    result, n11, n21 = ops.cli.execute(handle, "acl number 3999")
    result, n11, n21 = ops.cli.execute(handle, "rule 10 permit ip source 100.64.0.0 0.0.255.255")
    result, n11, n21 = ops.cli.execute(handle, "rule 20 permit ip source 100.65.0.0 0.0.255.255")
    result, n11, n21 = ops.cli.execute(handle, "quit")
    result, n11, n21 = ops.cli.execute(handle, "ipsec proposal ipsectran1")
    result, n11, n21 = ops.cli.execute(handle, "esp authentication-algorithm sha1")
    result, n11, n21 = ops.cli.execute(handle, "esp encryption-algorithm 3des")
    result, n11, n21 = ops.cli.execute(handle, "ipsec proposal sdwan-proposal")
    result, n11, n21 = ops.cli.execute(handle, "esp authentication-algorithm sha2-256")
    result, n11, n21 = ops.cli.execute(handle, "esp encryption-algorithm aes-")
    result, n11, n21 = ops.cli.execute(handle, "ike proposal 10")
    result, n11, n21 = ops.cli.execute(handle, "encryption-algorithm 3des")
    result, n11, n21 = ops.cli.execute(handle, "dh group2")
    result, n11, n21 = ops.cli.execute(handle, "authentication-algorithm sha1")
    result, n11, n21 = ops.cli.execute(handle, "sa duration 28800")
    result, n11, n21 = ops.cli.execute(handle, "authentication-method pre-share")
    result, n11, n21 = ops.cli.execute(handle, "integrity-algorithm hmac-sha1-96")
    result, n11, n21 = ops.cli.execute(handle, "prf hmac-sha1")
    result, n11, n21 = ops.cli.execute(handle, "ike peer main")
    result, n11, n21 = ops.cli.execute(handle, "undo version 2")
    result, n11, n21 = ops.cli.execute(handle, "pre-shared-key cipher both-win")
    result, n11, n21 = ops.cli.execute(handle, "ike-proposal 10")
    result, n11, n21 = ops.cli.execute(handle, "dpd retransmit-interval 30")
    result, n11, n21 = ops.cli.execute(handle, "dpd packet receive if-related enable")
    result, n11, n21 = ops.cli.execute(handle, "remote-address vpn-instance underlay_ipsec ${pe1pub}")
    result, n11, n21 = ops.cli.execute(handle, "rsa encryption-padding oaep")
    result, n11, n21 = ops.cli.execute(handle, "rsa signature-padding pss")
    result, n11, n21 = ops.cli.execute(handle, "undo local-id-preference certificate enable")
    result, n11, n21 = ops.cli.execute(handle, "ikev2 authentication sign-hash sha2-256")
    result, n11, n21 = ops.cli.execute(handle, "ike peer backup")
    result, n11, n21 = ops.cli.execute(handle, "undo version 2")
    result, n11, n21 = ops.cli.execute(handle, "pre-shared-key cipher both-win")
    result, n11, n21 = ops.cli.execute(handle, "ike-proposal 10")
    result, n11, n21 = ops.cli.execute(handle, "dpd retransmit-interval 30")
    result, n11, n21 = ops.cli.execute(handle, "dpd packet receive if-related enable")
    result, n11, n21 = ops.cli.execute(handle, "remote-address vpn-instance underlay_ipsec ${pe2pub}")
    result, n11, n21 = ops.cli.execute(handle, "rsa encryption-padding oaep")
    result, n11, n21 = ops.cli.execute(handle, "rsa signature-padding pss")
    result, n11, n21 = ops.cli.execute(handle, "undo local-id-preference certificate enable")
    result, n11, n21 = ops.cli.execute(handle, "ikev2 authentication sign-hash sha2-256")
    result, n11, n21 = ops.cli.execute(handle, "ipsec policy S2S-IPSEC 10 isakmp")
    result, n11, n21 = ops.cli.execute(handle, "security acl 3333")
    result, n11, n21 = ops.cli.execute(handle, "pfs dh-group2")
    result, n11, n21 = ops.cli.execute(handle, "ike-peer main")
    result, n11, n21 = ops.cli.execute(handle, "proposal ipsectran1")
    result, n11, n21 = ops.cli.execute(handle, "ipsec policy S2S-IPSEC 20 isakmp")
    result, n11, n21 = ops.cli.execute(handle, "security acl 3334")
    result, n11, n21 = ops.cli.execute(handle, "pfs dh-group2")
    result, n11, n21 = ops.cli.execute(handle, "ike-peer backup")
    result, n11, n21 = ops.cli.execute(handle, "proposal ipsectran1")
    result, n11, n21 = ops.cli.execute(handle, "quit")
    #loop interface
    result, n11, n21 = ops.cli.execute(handle, "interface ${loopif2}")
    result, n11, n21 = ops.cli.execute(handle, "undo portswitch")
    result, n11, n21 = ops.cli.execute(handle, "interface ${loopif2}.100")
    result, n11, n21 = ops.cli.execute(handle, "description to-lan1")
    result, n11, n21 = ops.cli.execute(handle, "dot1q termination vid 100")
    result, n11, n21 = ops.cli.execute(handle, "ip binding vpn-instance underlay_ipsec")
    result, n11, n21 = ops.cli.execute(handle, "ip address ${loopif2ip1} 30")
    result, n11, n21 = ops.cli.execute(handle, "interface ${loopif2}.200")
    result, n11, n21 = ops.cli.execute(handle, "description to-lan2")
    result, n11, n21 = ops.cli.execute(handle, "dot1q termination vid 200")
    result, n11, n21 = ops.cli.execute(handle, "ip binding vpn-instance underlay_ipsec")
    result, n11, n21 = ops.cli.execute(handle, "ip address ${loopif2ip2} 30")
    result, n11, n21 = ops.cli.execute(handle, "interface ${wan1}")
    result, n11, n21 = ops.cli.execute(handle, "description to-wan1")
    result, n11, n21 = ops.cli.execute(handle, "ip binding vpn-instance underlay_ipsec")
    result, n11, n21 = ops.cli.execute(handle, "ip address ${wan1ip}")
    result, n11, n21 = ops.cli.execute(handle, "nat outbound 3999 ")
    result, n11, n21 = ops.cli.execute(handle, "ipsec policy S2S-IPSEC")
    # lo1 lo2
    result, n11, n21 = ops.cli.execute(handle, "interface LoopBack1")
    result, n11, n21 = ops.cli.execute(handle, "ip binding vpn-instance underlay_ipsec")
    result, n11, n21 = ops.cli.execute(handle, "ip address ${ce1lo} 32")
    result, n11, n21 = ops.cli.execute(handle, "interface LoopBack2")
    result, n11, n21 = ops.cli.execute(handle, "ip binding vpn-instance underlay_ipsec")
    result, n11, n21 = ops.cli.execute(handle, "ip address ${ce2lo} 32")
    # tun1 tun2
    result, n11, n21 = ops.cli.execute(handle, "interface Tunnel0/0/1000")
    result, n11, n21 = ops.cli.execute(handle, "description 'pri-to-${pe1}-${pe1if}-by-${wan1}'")
    result, n11, n21 = ops.cli.execute(handle, "ip binding vpn-instance underlay_ipsec")
    result, n11, n21 = ops.cli.execute(handle, "tcp adjust-mss 1300")
    result, n11, n21 = ops.cli.execute(handle, "ip address ${pe1ip2} 30")
    result, n11, n21 = ops.cli.execute(handle, "tunnel-protocol gre")
    result, n11, n21 = ops.cli.execute(handle, "source LoopBack1")
    result, n11, n21 = ops.cli.execute(handle, "destination vpn-instance underlay_ipsec ${pe1lo}")
    result, n11, n21 = ops.cli.execute(handle, "interface Tunnel0/0/1001")
    result, n11, n21 = ops.cli.execute(handle, "description 'bak-to-${pe2}-${pe2if}-by-${wan1}'")
    result, n11, n21 = ops.cli.execute(handle, "ip binding vpn-instance underlay_ipsec")
    result, n11, n21 = ops.cli.execute(handle, "tcp adjust-mss 1300")
    result, n11, n21 = ops.cli.execute(handle, "ip address ${pe2ip2} 30")
    result, n11, n21 = ops.cli.execute(handle, "tunnel-protocol gre")
    result, n11, n21 = ops.cli.execute(handle, "source LoopBack2")
    result, n11, n21 = ops.cli.execute(handle, "destination vpn-instance underlay_ipsec ${pe2lo}")
    result, n11, n21 = ops.cli.execute(handle, "quit")
    # nqa
    result, n11, n21 = ops.cli.execute(handle, "nqa test-instance pri pri")
    result, n11, n21 = ops.cli.execute(handle, "test-type icmp")
    result, n11, n21 = ops.cli.execute(handle, "destination-address ipv4 ${pe1ip1}")
    result, n11, n21 = ops.cli.execute(handle, "source-address ipv4 ${pe1ip2}")
    result, n11, n21 = ops.cli.execute(handle, "frequency 30")
    result, n11, n21 = ops.cli.execute(handle, "probe-count 6")
    result, n11, n21 = ops.cli.execute(handle, "vpn-instance underlay_ipsec")
    result, n11, n21 = ops.cli.execute(handle, "start now")
    result, n11, n21 = ops.cli.execute(handle, "quit")
    # static route
    result, n11, n21 = ops.cli.execute(handle, "ip route-static vpn-instance underlay_ipsec 0.0.0.0 0 ${wan1gw} preference 222")
    result, n11, n21 = ops.cli.execute(handle, "ip route-static vpn-instance underlay_ipsec ${pe1lo} 32 ${wan1gw}")
    result, n11, n21 = ops.cli.execute(handle, "ip route-static vpn-instance underlay_ipsec ${pe2lo} 32 ${wan1gw}")
    result, n11, n21 = ops.cli.execute(handle, "ip route-static vpn-instance underlay_ipsec ${pe1pub} 32 ${wan1gw}")
    result, n11, n21 = ops.cli.execute(handle, "ip route-static vpn-instance underlay_ipsec ${pe2pub} 32 ${wan1gw}")
    result, n11, n21 = ops.cli.execute(handle, "ip route-static vpn-instance underlay_ipsec 100.64.0.0 16 ${pe1ip1}")
    result, n11, n21 = ops.cli.execute(handle, "ip route-static vpn-instance underlay_ipsec 100.65.0.0 16 ${pe2ip1}")
    result, n11, n21 = ops.cli.execute(handle, "ip route-static vpn-instance underlay_ipsec 114.113.245.99 32 ${pe1ip1}")
    result, n11, n21 = ops.cli.execute(handle, "ip route-static vpn-instance underlay_ipsec 114.113.245.100 32 ${pe2ip1}")
    result, n11, n21 = ops.cli.execute(handle, "ip route-static vpn-instance underlay_ipsec 192.168.55.250 32 ${pe1ip1} track nqa pri pri")
    result, n11, n21 = ops.cli.execute(handle, "ip route-static vpn-instance underlay_ipsec 192.168.55.250 32 ${pe2ip1} preference 70")
    ops.syslog("ops:add_tunnel is success", "critical", "syslog")
    ops.cli.close(handle)
    return 0
`;
let sdwan002helpText = `##########初始化开局脚本#####
ip vpn-instance underlay_ipsec
 ipv4-family
quit
quit
interface ${wan1}
 undo portswitch
 ip binding vpn-instance underlay_ipsec
 ip address ${wan1ip}
quit
ip route-static vpn-instance underlay_ipsec 0.0.0.0 0 192.168.1.1 preference 222
ftp server permit interface GigabitEthernet 0/0/0
ftp server enable
ssh server permit interface all
stelnet server enable
sftp server enable
aaa
 undo local-aaa-user password policy administrator
 local-user admin service-type terminal ssh http
 local-user bothwin password irreversible-cipher Tfe28@w%
 local-user bothwin service-type terminal ssh ftp
 local-user bothwin ftp-directory flash:
 local-user bothwin privilege level 15
# 确认 Y
# 还原初始密码
local-user admin password irreversible-cipher admin@huawei.com
quit
quit
#####上传 test.py 开局脚本#####
# 电脑网口 192.168.1.100/24 连接华为SD-WAN路由器 G0/0/0
# windows文件浏览页面输入访问路径：ftp://192.168.1.1/
# 认证登录后 上传${lineid}.py
ops install file ${lineid}.py
sys
ops
script-assistant python ${lineid}.py
quit
quit
set factory-configuration from current-configuration
#当前设置保存为出厂设置    Y
factory-configuration reset
#确认还原出厂设置   Y
reboot
#不保存配置到下次启动     N
#确认重启   Y
#重启后Ping测试
ping -vpn-instance underlay_ipsec -a ${loopif2ip1} 114.114.114.114
ping -vpn-instance underlay_ipsec -a ${loopif2ip2} 114.114.114.114
ping -vpn-instance underlay_ipsec ${pe1ip1}
ping -vpn-instance underlay_ipsec ${pe2ip1}
##########命令行开局#########
system-view
ip vpn-instance underlay_1
 ipv4-family
 quit
 quit
ip vpn-instance underlay_2
 ipv4-family
 quit
 quit
interface ${loopif1}
 undo portswitch
#
interface ${loopif1}.100
 dot1q termination vid 100
 ip binding vpn-instance underlay_1
 ip address ${loopif1ip1} 30
#
interface ${loopif1}.200
 dot1q termination vid 200
 ip binding vpn-instance underlay_2
 ip address ${loopif1ip2} 30
#
ip route-static vpn-instance underlay_1 119.145.21.126 32 ${loopif1}.100 ${loopif2ip1} tag 4400 description agile-controller
ip route-static vpn-instance underlay_2 119.145.21.126 32 ${loopif1}.200 ${loopif2ip2} tag 4400 description agile-controller
#Pinc测试
ping -vpn-instance underlay_1 -a ${loopif1ip1} 119.145.21.126
ping -vpn-instance underlay_2 -a ${loopif1ip2} 119.145.21.126
#确认OK后，命令行开局
 agile controller host 119.145.21.126 port 10020 vpn-instance underlay_1
 agile controller host 119.145.21.126 port 10020 vpn-instance underlay_2
quit
save
#保存配置 Y
#查看设备的ESN
display esn
#把设备ESN输入到中控设备上
#查看中控注册状态
display agile-controller status`;
  let scriptName = `${lineid}.py`;
  let helpTextName = `HelpText-${time.ez}`;
  let data = {};
  console.log(sdwan002mplsGreOverIPsec);
  console.log(sdwan002helpText);
  downloadConfig(scriptName, sdwan002mplsGreOverIPsec);
  downloadConfig(helpTextName, sdwan002helpText);
  let type = 'post'
  let datatype = 'json';
  ajaxHandler(url,data,datatype,type);
};