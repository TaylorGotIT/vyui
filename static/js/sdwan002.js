/* 华为SD-WAN MPLS自环 双运营商 */
const sdwan002html = `<table border="1">
<tr>
<td><input id="site1_id_input"></td>
<td>中控开局IP</td>
</tr>
<tr>
<td><select id="wan1_select">
<option value="G0/0/2">WAN-G0/0/6</option>
<option value="G0/0/3">WAN-G0/0/7</option>
<option value="G0/0/4">WAN-G0/0/8</option>
<option value="G0/0/5">WAN-G0/0/9</option>
<option value="G0/0/8" selected="selected">WAN-G0/0/8</option>
<option value="G0/0/9">WAN-G0/0/9</option>
<option value="G0/0/10">WAN-G0/0/9</option>
</select></td>
<td><input id="controller1_ip_input" value="119.145.21.126"></td>
</tr>
<tr>
<td><input id="wan1_ip_input" placeholder="[wan1-ip]192.168.1.254/24"></td>
<td><input id="wan1_gw_input" placeholder="[wan1-gw]192.168.1.1"></td>
</tr>
<tr>
<td><select id="wan2_select">
<option value="G0/0/2">WAN-G0/0/6</option>
<option value="G0/0/3">WAN-G0/0/7</option>
<option value="G0/0/4">WAN-G0/0/8</option>
<option value="G0/0/5">WAN-G0/0/9</option>
<option value="G0/0/8">WAN-G0/0/9</option>
<option value="G0/0/9" selected="selected">WAN-G0/0/9</option>
<option value="G0/0/10">WAN-G0/0/9</option>
</select></td>
<td></td>
</tr>
<tr>
<td><input id="wan2_ip_input" placeholder="[wan2-ip]192.168.2.254/24"></td>
<td><input id="wan2_gw_input" placeholder="[wan2-gw]192.168.2.1"></td>
</tr>

<tr>
<td><select id="loop2_if_select">
 <option value="G0/0/2">自环WAN[G0/0/2]</option>
 <option value="G0/0/3">自环WAN[G0/0/3]</option>
 <option value="G0/0/4">自环WAN[G0/0/4]</option>
 <option value="G0/0/5" >自环WAN[G0/0/5]</option>
 <option value="G0/0/6">自环WAN[G0/0/6]</option>
 <option value="G0/0/7" selected="selected">自环WAN[G0/0/7]</option>
 <option value="G0/0/7">自环WAN[G0/0/8]</option>
 <option value="G0/0/7">自环WAN[G0/0/9]</option></select></td>
<td><select id="loop1_if_select">
 <option value="G0/0/2">自环LAN[G0/0/2]</option>
 <option value="G0/0/3">自环LAN[G0/0/3]</option>
 <option value="G0/0/4">自环LAN[G0/0/4]</option>
 <option value="G0/0/5">自环LAN[G0/0/5]</option>
 <option value="G0/0/6" selected="selected">自环LAN[G0/0/6]</option>
 <option value="G0/0/7">自环LAN[G0/0/7]</option>
 <option value="G0/0/7">自环LAN[G0/0/8]</option>
 <option value="G0/0/7">自环LAN[G0/0/9]</option></select></td>
</tr>
<tr>
<td><input id="loop1_ip_input"></td>
<td><input id="loop2_ip_input"></td>
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
<td><input id="pe1_pub_input"></td>
<td><input id="pe2_pub_input"></td>
</tr>
<tr>
<td><input id="pe1_psk_input"></td>
<td><input id="pe2_psk_input"></td>
</tr>
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
    let site1id = info_json.id[0].replace(/[0-9]+/g,"");
    let site1num = getColNum(site1id);
    let loopIParr = getLoopIP(site1num);
    $("#loop1_ip_input").val(loopIParr[0]);
    $("#loop2_ip_input").val(loopIParr[1]);
    $("#site1_id_input").val("站点-"+site1id);

    $("#line1_input").val(info_json.id[0]);
    $("#pe1_input").val(info_json.pe[0]);
    $("#pe1_if_input").val(info_json.if[0]);
    $("#pe1_ip_input").val(info_json.ip[0]);
    $("#pe1_pub_input").val(info_json.pub[0]);
    $("#pe1_lo_input").val(info_json.pelo[0]);
    $("#ce1_lo_input").val(info_json.celo[0]);
    $("#pe1_psk_input").val(info_json.psk[0]);
    $("#line2_input").val(info_json.id[1]);
    $("#pe2_input").val(info_json.pe[1]);
    $("#pe2_if_input").val(info_json.if[1]);
    $("#pe2_ip_input").val(info_json.ip[1]);
    $("#pe2_pub_input").val(info_json.pub[1]);
    $("#pe2_lo_input").val(info_json.pelo[1]);
    $("#ce2_lo_input").val(info_json.celo[1]);
    $("#pe2_psk_input").val(info_json.psk[1]);

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
  let controller1ip = $("#controller1_ip_input").val();
  let wan1 = $("#wan1_select").val();
  let wan2 = $("#wan2_select").val();
  let wan1ip = $("#wan1_ip_input").val().replace('/',' ');
  let wan1gw = $("#wan1_gw_input").val();
  let wan2ip = $("#wan2_ip_input").val().replace('/',' ');
  let wan2gw = $("#wan2_gw_input").val();
  let loop1if = $("#loop1_if_select").val();
  let loop2if = $("#loop2_if_select").val();
  let loop1cidr = $("#loop1_ip_input").val();
  let loop2cidr = $("#loop2_ip_input").val();
  let loop1ip = loop1cidr.split("/")[0];
  let loop2ip = loop2cidr.split("/")[0];
  let loop1ips = ipNext(loop1ip);
  let loop2ips = ipNext(loop2ip);
  let loop1ip1 = loop1ips[0];
  let loop1ip2 = loop1ips[1];
  let loop2ip1 = loop2ips[0];
  let loop2ip2 = loop2ips[1];

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

  let pe2 = $("#pe2_input").val();
  let pe2if = $("#pe2_if_input").val();
  let pe2ips = ipNext($("#pe2_ip_input").val().split('/')[0]);
  let pe2ip1 = pe2ips[0];
  let pe2ip2 = pe2ips[1];
  let pe2lo = $("#pe2_lo_input").val();
  let pe2pub = $("#pe2_pub_input").val();
  let pe2psk = $("#pe2_psk_input").val();
  let ce2lo = $("#ce2_lo_input").val();

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
    choice={" Continue?":"Y"}
    result, n11, n21 = ops.cli.execute(handle, "system-view")
    result, n11, n21 = ops.cli.execute(handle, "ip vpn-instance ipsec1")
    result, n11, n21 = ops.cli.execute(handle, "ipv4-family")
    result, n11, n21 = ops.cli.execute(handle, "quit")
    result, n11, n21 = ops.cli.execute(handle, "ip vpn-instance ipsec2")
    result, n11, n21 = ops.cli.execute(handle, "ipv4-family")
    result, n11, n21 = ops.cli.execute(handle, "quit")
    result, n11, n21 = ops.cli.execute(handle, "acl number 3333")
    result, n11, n21 = ops.cli.execute(handle, "rule 1 permit ip vpn-instance ipsec1 source ${ce1lo} 0 destination ${pe1lo} 0")
    result, n11, n21 = ops.cli.execute(handle, "acl number 3334")
    result, n11, n21 = ops.cli.execute(handle, "rule 1 permit ip vpn-instance ipsec2 source ${ce2lo} 0 destination ${pe2lo} 0")
    result, n11, n21 = ops.cli.execute(handle, "acl number 3999")
    result, n11, n21 = ops.cli.execute(handle, "rule 10 permit ip source 100.64.0.0 0.0.255.255")
    result, n11, n21 = ops.cli.execute(handle, "rule 20 permit ip source 100.65.0.0 0.0.255.255")
    result, n11, n21 = ops.cli.execute(handle, "quit")
    result, n11, n21 = ops.cli.execute(handle, "ipsec proposal ipsectran1")
    result, n11, n21 = ops.cli.execute(handle, "esp authentication-algorithm sha1")
    result, n11, n21 = ops.cli.execute(handle, "esp encryption-algorithm 3des")
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
    result, n11, n21 = ops.cli.execute(handle, "pre-shared-key cipher ${pe1psk}")
    result, n11, n21 = ops.cli.execute(handle, "ike-proposal 10")
    result, n11, n21 = ops.cli.execute(handle, "dpd retransmit-interval 30")
    result, n11, n21 = ops.cli.execute(handle, "dpd packet receive if-related enable")
    result, n11, n21 = ops.cli.execute(handle, "remote-address vpn-instance ipsec1 ${pe1pub}")
    result, n11, n21 = ops.cli.execute(handle, "rsa encryption-padding oaep")
    result, n11, n21 = ops.cli.execute(handle, "rsa signature-padding pss")
    result, n11, n21 = ops.cli.execute(handle, "undo local-id-preference certificate enable")
    result, n11, n21 = ops.cli.execute(handle, "ikev2 authentication sign-hash sha2-256")
    result, n11, n21 = ops.cli.execute(handle, "ike peer backup")
    result, n11, n21 = ops.cli.execute(handle, "undo version 2")
    result, n11, n21 = ops.cli.execute(handle, "pre-shared-key cipher ${pe2psk}")
    result, n11, n21 = ops.cli.execute(handle, "ike-proposal 10")
    result, n11, n21 = ops.cli.execute(handle, "dpd retransmit-interval 30")
    result, n11, n21 = ops.cli.execute(handle, "dpd packet receive if-related enable")
    result, n11, n21 = ops.cli.execute(handle, "remote-address vpn-instance ipsec2 ${pe2pub}")
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
    result, n11, n21 = ops.cli.execute(handle, "interface ${loop1if}")
    result, n11, n21 = ops.cli.execute(handle, "undo portswitch")
    result, n11, n21 = ops.cli.execute(handle, "interface ${loop1if}.100")
    result, n11, n21 = ops.cli.execute(handle, "description mpls-wan1")
    result, n11, n21 = ops.cli.execute(handle, "dot1q termination vid 100")
    result, n11, n21 = ops.cli.execute(handle, "ip binding vpn-instance ipsec1")
    result, n11, n21 = ops.cli.execute(handle, "ip address ${loop1ip1} 30")
    result, n11, n21 = ops.cli.execute(handle, "interface ${loop1if}.200")
    result, n11, n21 = ops.cli.execute(handle, "description mpls-wan2")
    result, n11, n21 = ops.cli.execute(handle, "dot1q termination vid 200")
    result, n11, n21 = ops.cli.execute(handle, "ip binding vpn-instance ipsec2")
    result, n11, n21 = ops.cli.execute(handle, "ip address ${loop2ip1} 30")
    result, n11, n21 = ops.cli.execute(handle, "interface ${wan1}")
    result, n11, n21 = ops.cli.execute(handle, "description to-wan1")
    result, n11, n21 = ops.cli.execute(handle, "ip binding vpn-instance ipsec1")
    result, n11, n21 = ops.cli.execute(handle, "ip address ${wan1ip}")
    result, n11, n21 = ops.cli.execute(handle, "nat outbound 3999 ")
    result, n11, n21 = ops.cli.execute(handle, "ipsec policy S2S-IPSEC")
    result, n11, n21 = ops.cli.execute(handle, "interface ${wan2}")
    result, n11, n21 = ops.cli.execute(handle, "description to-wan2")
    result, n11, n21 = ops.cli.execute(handle, "ip binding vpn-instance ipsec2")
    result, n11, n21 = ops.cli.execute(handle, "ip address ${wan2ip}")
    result, n11, n21 = ops.cli.execute(handle, "nat outbound 3999 ")
    result, n11, n21 = ops.cli.execute(handle, "ipsec policy S2S-IPSEC")
    # lo1 lo2
    result, n11, n21 = ops.cli.execute(handle, "interface LoopBack1")
    result, n11, n21 = ops.cli.execute(handle, "ip binding vpn-instance ipsec1")
    result, n11, n21 = ops.cli.execute(handle, "ip address ${ce1lo} 32")
    result, n11, n21 = ops.cli.execute(handle, "interface LoopBack2")
    result, n11, n21 = ops.cli.execute(handle, "ip binding vpn-instance ipsec2")
    result, n11, n21 = ops.cli.execute(handle, "ip address ${ce2lo} 32")
    # tun1 tun2
    result, n11, n21 = ops.cli.execute(handle, "interface Tunnel0/0/1000")
    result, n11, n21 = ops.cli.execute(handle, "description 'pri-to-${pe1}-${pe1if}-by-${wan1}'")
    result, n11, n21 = ops.cli.execute(handle, "ip binding vpn-instance ipsec1")
    result, n11, n21 = ops.cli.execute(handle, "tcp adjust-mss 1300")
    result, n11, n21 = ops.cli.execute(handle, "ip address ${pe1ip2} 30")
    result, n11, n21 = ops.cli.execute(handle, "tunnel-protocol gre")
    result, n11, n21 = ops.cli.execute(handle, "source LoopBack1")
    result, n11, n21 = ops.cli.execute(handle, "destination vpn-instance ipsec1 ${pe1lo}")
    result, n11, n21 = ops.cli.execute(handle, "interface Tunnel0/0/1001")
    result, n11, n21 = ops.cli.execute(handle, "description 'bak-to-${pe2}-${pe2if}-by-${wan1}'")
    result, n11, n21 = ops.cli.execute(handle, "ip binding vpn-instance ipsec2")
    result, n11, n21 = ops.cli.execute(handle, "tcp adjust-mss 1300")
    result, n11, n21 = ops.cli.execute(handle, "ip address ${pe2ip2} 30")
    result, n11, n21 = ops.cli.execute(handle, "tunnel-protocol gre")
    result, n11, n21 = ops.cli.execute(handle, "source LoopBack2")
    result, n11, n21 = ops.cli.execute(handle, "destination vpn-instance ipsec2 ${pe2lo}")
    result, n11, n21 = ops.cli.execute(handle, "quit")
    # nqa
    result, n11, n21 = ops.cli.execute(handle, "nqa event 1 log")
    result, n11, n21 = ops.cli.execute(handle, "nqa test-instance admin ipsecmain")
    result, n11, n21 = ops.cli.execute(handle, "test-type icmp")
    result, n11, n21 = ops.cli.execute(handle, "destination-address ipv4 ${pe1lo}")
    result, n11, n21 = ops.cli.execute(handle, "source-address ipv4 ${ce1lo}")
    result, n11, n21 = ops.cli.execute(handle, "frequency 30")
    result, n11, n21 = ops.cli.execute(handle, "probe-count 6")
    result, n11, n21 = ops.cli.execute(handle, "vpn-instance ipsec1")
    result, n11, n21 = ops.cli.execute(handle, "alarm 1 lost-packet-ratio absolute rising-threshold 100 1")
    result, n11, n21 = ops.cli.execute(handle, "start now")
    result, n11, n21 = ops.cli.execute(handle, "quit")
    result, n11, n21 = ops.cli.execute(handle, "nqa event 1 log")
    result, n11, n21 = ops.cli.execute(handle, "nqa test-instance admin ipsecbackup")
    result, n11, n21 = ops.cli.execute(handle, "test-type icmp")
    result, n11, n21 = ops.cli.execute(handle, "destination-address ipv4 ${pe2lo}")
    result, n11, n21 = ops.cli.execute(handle, "source-address ipv4 ${ce2lo}")
    result, n11, n21 = ops.cli.execute(handle, "frequency 30")
    result, n11, n21 = ops.cli.execute(handle, "probe-count 6")
    result, n11, n21 = ops.cli.execute(handle, "vpn-instance ipsec2")
    result, n11, n21 = ops.cli.execute(handle, "alarm 1 lost-packet-ratio absolute rising-threshold 100 1")
    result, n11, n21 = ops.cli.execute(handle, "start now")
    result, n11, n21 = ops.cli.execute(handle, "quit")
    # static route
    result, n11, n21 = ops.cli.execute(handle, "ip route-static vpn-instance ipsec1 0.0.0.0 0 ${wan1gw}")
    result, n11, n21 = ops.cli.execute(handle, "ip route-static vpn-instance ipsec1 ${pe1lo} 32 ${wan1gw} description pe1lo")
    result, n11, n21 = ops.cli.execute(handle, "ip route-static vpn-instance ipsec1 ${pe1pub} 32 ${wan1gw} description pe1pub")
    result, n11, n21 = ops.cli.execute(handle, "ip route-static vpn-instance ipsec1 100.64.0.0 16 ${pe1ip1} description mpls1")
    result, n11, n21 = ops.cli.execute(handle, "ip route-static vpn-instance ipsec1 100.65.0.0 16 ${pe1ip1} description mpls2")
    result, n11, n21 = ops.cli.execute(handle, "ip route-static vpn-instance ipsec1 114.113.245.99 32 ${pe1ip1} description monitor1")
    result, n11, n21 = ops.cli.execute(handle, "ip route-static vpn-instance ipsec1 192.168.55.250 32 ${pe1ip1} description jumpServer")
    result, n11, n21 = ops.cli.execute(handle, "ip route-static vpn-instance ipsec2 0.0.0.0 0 ${wan2gw}")
    result, n11, n21 = ops.cli.execute(handle, "ip route-static vpn-instance ipsec2 ${pe2lo} 32 ${wan2gw} description pe2lo")
    result, n11, n21 = ops.cli.execute(handle, "ip route-static vpn-instance ipsec2 ${pe2pub} 32 ${wan2gw} description pe2pub")
    result, n11, n21 = ops.cli.execute(handle, "ip route-static vpn-instance ipsec2 100.64.0.0 16 ${pe2ip1} description mpls1")
    result, n11, n21 = ops.cli.execute(handle, "ip route-static vpn-instance ipsec2 100.65.0.0 16 ${pe2ip1} description mpls2")
    result, n11, n21 = ops.cli.execute(handle, "ip route-static vpn-instance ipsec2 114.113.245.100 32 ${pe2ip1} description monitor2")
    result, n11, n21 = ops.cli.execute(handle, "ip route-static vpn-instance ipsec2 192.168.55.250 32 ${pe2ip1} description jumpServer")
    ops.syslog("ops:add_tunnel is success", "critical", "syslog")
    ops.cli.close(handle)
    return 0
`;
let sdwan002helpText = `##########中控配置###########
快速开局先填写一条线路，开局后再填写。
name:       mpls_main
tn:         mpls_main
rd:         mpls
vrf:        underlay_1
interface:  ${loop2if}.100
ip address: ${loop1ip2}/30
gateway:    ${loop1ip1}

name:       mpls_backup
tn:         mpls_backup
rd:         mpls
vrf:        underlay_2
interface:  ${loop2if}.200
ip address: ${loop2ip2}/30
gateway:    ${loop2ip1}

##########初始化开局脚本#####
ip vpn-instance ipsec1
 ipv4-family
quit
quit
interface ${wan1}
 undo portswitch
 ip binding vpn-instance ipsec1
 ip address ${wan1ip}
quit
ip route-static vpn-instance ipsec1 0.0.0.0 0 192.168.1.1 preference 222
ftp server permit interface GigabitEthernet 0/0/0
ftp server enable
ssh server permit interface all
stelnet server enable
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
#####上传 ${lineid}.py 开局脚本及ipsec自动重置脚本#####
【1】公网FTP
登录公司公网FTP，上传文件到自己的文件夹，路由器通过公网获取开局脚本。
ftp 59.36.7.222 vpn-instance ipsec1
dir
get ${lineid}.py

【2】本地FTP
# 电脑网口 192.168.1.100/24 连接华为SD-WAN路由器 G0/0/0
# windows文件浏览页面输入访问路径：ftp://192.168.1.1/
# 认证登录后 上传${lineid}.py ipsec_main.py ipsec_backup.py
#关闭ftp
undo ftp server permit interface GigabitEthernet 0/0/0
undo ftp server enable
# 安装python脚本：
ops install file ${lineid}.py
ops install file ipsec_main.py
ops install file ipsec_backup.py
system-view
ops
 script-assistant python ${lineid}.py
 environment ipsecmain ${pe1pub}
 environment ipsecbackup ${pe2pub}
 script-assistant python ipsec_main.py
 script-assistant python ipsec_backup.py
#
set factory-configuration from current-configuration
#当前设置保存为出厂设置    Y
factory-configuration reset
#确认还原出厂设置   Y
reboot
#不保存配置到下次启动     N
#确认重启   Y
#重启后Ping测试
ping -vpn-instance ipsec1 -a ${ce1lo} ${pe1lo}
ping -vpn-instance ipsec1 -a ${ce2lo} ${pe2lo}
ping -vpn-instance ipsec1 ${pe1ip1}
ping -vpn-instance ipsec2 ${pe2ip1}
ping -vpn-instance ipsec1 -a ${loop1ip1} 223.5.5.5
ping -vpn-instance ipsec2 -a ${loop2ip1} 223.5.5.5
##########命令行开局#########
system-view
ip vpn-instance underlay_1
 ipv4-family
 quit
 quit
interface ${loop2if}
 undo portswitch
#
interface ${loop2if}.100
 dot1q termination vid 100
 ip binding vpn-instance underlay_1
 ip address ${loop1ip2} 30
#
ip route-static vpn-instance underlay_1 ${controller1ip} 32 ${loop1if}.100 ${loop1ip1} tag 4400 description agile-controller
#Pinc测试
ping -vpn-instance underlay_1 -a ${loop1ip1} ${controller1ip}
#确认OK后，命令行开局
 agile controller host ${controller1ip} port 10020 vpn-instance underlay_1
quit
save
#保存配置 Y
#查看设备的ESN
display esn
#把设备ESN输入到中控设备上
#查看中控注册状态
display agile-controller status
############线上更改脚本信息#############
1、SSHFS通过堡垒机代理SSH隧道连接到CE路由器，挂载为本地文件；
2、文本编辑器直接编辑开局脚本，并保存；
脚本配置：
##...以下内容需添加到ops_execute函数中
def ops_execute(ops):
    #注释：配置变更代码块：
    result, n11, n21 = ops.cli.execute(handle, "ike peer PEER名称")
    result, n11, n21 = ops.cli.execute(handle, "undo remote-address 旧对接",choice)
    result, n11, n21 = ops.cli.execute(handle, "remote-address vpn-instance underlay_ipsec 新对接")
    result, n11, n21 = ops.cli.execute(handle, "quit")
    result, n11, n21 = ops.cli.execute(handle, "ip route-static vpn-instance underlay_ipsec 新对接 255.255.255.255 本地网关")
3、重新安装脚本
system-view
ops
 undo script-assistant python ${lineid}.py
 undo environment ipsecmain ${pe1pub}
 undo environment ipsecbackup ${pe2pub}
 undo script-assistant python ipsec_main.py
 undo script-assistant python ipsec_backup.py
Ctrl+Z
ops uninstall file ${lineid}.py
ops uninstall file ipsec_main.py
ops uninstall file ipsec_backup.py
#重新加载
ops install file ${lineid}.py
ops install file ipsec_main.py
ops install file ipsec_backup.py
system-view
ops
 script-assistant python ${lineid}.py
 environment ipsecmain 新对接IP
 environment ipsecbackup 新对接IP
 script-assistant python ipsec_main.py
 script-assistant python ipsec_backup.py
#
如卸载和加载脚本都没有报错，则表示配置变更成功。
`;
  let scriptName = `${lineid}.py`;
  let helpTextName = `HelpText-${time.ez}`;
  console.log(sdwan002mplsGreOverIPsec);
  console.log(sdwan002helpText);
  downloadConfig(scriptName, sdwan002mplsGreOverIPsec);
  downloadConfig(helpTextName, sdwan002helpText);
};