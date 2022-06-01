var fastip001_version = 1;
const fastip001html = `<table border="1">
<tr><td><input id="wan1_type_input" value="Static"></td>
<td><select id="wan1_select">
<option value="eth0" selected="selected">WAN-ETH0</option>
<option value="eth1" selected="selected">WAN-ETH1</option>
<option value="br0" selected="selected">WAN-BR0</option>
<option value="br1" selected="selected">WAN-BR1</option></select></td></tr>
<tr><td><input id="wan1_ip_input" placeholder="[wan-ip]192.168.1.254/24"></td>
<td><input id="wan1_gw_input" placeholder="[wan-gw]192.168.1.1"></td></tr>
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
 <tr><td><select id="loop1_if_select">
 <option value="G0/0/2">自环LAN[G0/0/2]</option>
 <option value="G0/0/3">自环LAN[G0/0/3]</option>
 <option value="G0/0/4" selected="selected">自环LAN[G0/0/4]</option>
 <option value="G0/0/5">自环LAN[G0/0/5]</option>
 <option value="G0/0/6">自环LAN[G0/0/6]</option>
 <option value="G0/0/7">自环LAN[G0/0/7]</option>
 <option value="G0/0/7">自环LAN[G0/0/8]</option>
 <option value="G0/0/7">自环LAN[G0/0/9]</option></select></td>
 <td><select id="loop1_if_select">
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
  <tr><td id="ac1_td"></td><td id="ac2_td"></td></tr>
  <tr><td id="ac1_if_td"></td><td id="ac2_if_td"></td></tr>
  <tr><td id="ac1_ip_td"></td><td id="ac2_ip_td"></td></tr>
  <tr><td id="ac1_pub_td"></td><td id="ac2_pub_td"></td></tr>
</table>
<button type="button" onclick="fastip001sub('/config')">提交配置信息(Submit Config Info)</button>
`;
function fastip001getList() {
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
                "lo":[],
                "pub":[],
                "other":[],
            };
    for(let i = 0; i < lines.length; i++) {
        let line = lines[i]
        if(line!==""){
            let l = line.split(":");
            let l0 = l[0];
            let l1 = l[1];
            if(ipv4_regex2.test(l1)){
                console.log(l1);
            }
            switch(l0){
                case 'LineID':
                    info_json.id.push(l1);
                    break;
                case 'PE':
                    info_json.pe.push(l1);
                    break;
                case 'Tunnel':
                    info_json.if.push(l1);
                    break;
                case 'wanip':
                    info_json.ip.push(l1);
                    break;
                case 'PE 对接':
                    info_json.lo.push(l1);
                    break;
                default:
                    info_json.other.push(l1);
            }
        }
    }
    console.log(info_json);
    $("#lineid_td").append(info_json.id[0].substr(0,7));
    $("#pe1_td").append(info_json.pe[0]);
    $("#pe1_if_td").append(info_json.if[0]);
    $("#pe1_ip_td").append(info_json.ip[0]);
    $("#pe1_pub_td").append(info_json.pub[0]);
    $("#pe1_lo_td").append(info_json.lo[0]);
    $("#ac1_td").append(info_json.pe[1]);
    $("#ac1_if_td").append(info_json.if[1]);
    $("#ac1_ip_td").append(info_json.ip[1]);
    $("#ac1_pub_td").append(info_json.pub[0]);

    $("#pe2_td").append(info_json.pe[2]);
    $("#pe2_if_td").append(info_json.if[2]);
    $("#pe2_ip_td").append(info_json.ip[2]);
    $("#pe2_lo_td").append(info_json.lo[1]);
    $("#ac2_td").append(info_json.pe[3]);
    $("#ac2_if_td").append(info_json.if[3]);
    $("#ac2_ip_td").append(info_json.ip[3]);
    $("#ac2_pub_td").append(info_json.pub[1]);
}
$("#service_dev").append(fastip001html);
//加载测试资源的解析数据
fastip001getList();

function fastip001sub(url){
  let user = $("#user_input").val();
  let time=getTime(new Date());
  let cname = $("#cname_input").val();
  let area = $("#area_select").val();
  let wan1gw1 = '192.168.1.1';
  let wan2gw2 = '192.168.2.1';
  let lan1gw1 = '192.168.1.254';
  let subnet1 = '192.168.1.0/24';
  let subnet2 = '192.168.2.0/24';
  let lineid = $("#lineid_td").html();
//获取主线参数
  let pe1 = $("#pe1_td").html();
  let pe1if = $("#pe1_if_td").html();
  let pe1ifNum = pe1if.match(/[1-9]\d+/)[0];
  let pe1ips = ipNext($("#pe1_ip_td").html().split('/')[0]);
  let pe1ip1 = pe1ips[0];
  let pe1ip2 = pe1ips[1];
  let pe1lo = $("#pe1_lo_td").html();
  let ac1 = $("#ac1_td").html();
  let ac1if = $("#ac1_if_td").html();
  let ac1port = ac1if.replace('vtun','');
  let ac1ips = ipNext($("#ac1_ip_td").html().split('/')[0]);
  let ac1ip1 = ac1ips[0];
  let ac1ip2 = ac1ips[1];
  let ac1remote = $("#ac1_pub_td").html();
//获取备线参数
  let pe2 = $("#pe2_td").html();
  let pe2if = $("#pe2_if_td").html();
  let pe2ifNum = pe2if.match(/[1-9]\d+/)[0];
  let pe2ips = ipNext($("#pe2_ip_td").val().split('/')[0]);
  let pe2ip1 = pe2ips[0];
  let pe2ip2 = pe2ips[1];
  let pe2lo = $("#pe2_lo_td").html();
  let ac2 = $("#ac2_td").html();
  let ac2if = $("#ac2_if_td").html();
  let ac2port = ac2if.replace('vtun','');
  let ac2ips = ipNext($("#ac2_ip_td").html().split('/')[0]);
  let ac2ip1 = ac2ips[0];
  let ac2ip2 = ac2ips[1];
  let ac2remote = $("#ac2_pub_td").html();

let fastip001fastipGreOverOpenvpn  =
`#Fnet MPLS with GRE Over OpenVPN Template.
#操作人员：${user}
#时间：${time.cn}
#系统：vyui-v1
#vyos version >= 4.0
+++++++++++++++++++++++++++++++++++++++++++
echo '基础配置[系统名称，物理接口]'
set system host-name ${lineid}-${cname}-${area}
set interfaces ethernet eth0 description WAN1
set interfaces ethernet eth0 address dhcp
set protocols static route 1.1.1.1/32 dhcp-interface 'eth0'
echo 'OpenVPN 接入配置[ac1]'
set interfaces openvpn ${ac1if} description AC1_to_${ac1}
set interfaces openvpn ${ac1if} local-address ${ac1ip2} subnet-mask 255.255.255.252
set interfaces openvpn ${ac1if} remote-address ${ac1ip1}
set interfaces openvpn ${ac1if} remote-host ${ac1remote}
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
set interfaces openvpn ${ac2if} remote-host ${ac2remote}
set interfaces openvpn ${ac2if} remote-port ${ac2port}
set interfaces openvpn ${ac2if} mode site-to-site
set interfaces openvpn ${ac2if} protocol udp
set interfaces openvpn ${ac2if} openvpn-option '--nobind'
set interfaces openvpn ${ac2if} openvpn-option '--ping 10'
set interfaces openvpn ${ac2if} openvpn-option '--ping-restart 60'
set interfaces openvpn ${ac2if} openvpn-option '--persist-tun'
set interfaces openvpn ${ac2if} shared-secret-key-file '/config/auth/openvpn.secret'
echo '>>>GRE 配置[Main]<<<'
set interfaces tunnel tun${pe1ifNum} description PE1_${pe1if}
set interfaces tunnel tun${pe1ifNum} address ${pe1ip2}/30
#set interfaces tunnel tun${pe1ifNum} local-ip ${ac1ip2}
#set interfaces tunnel tun${pe1ifNum} remote-ip ${pe1lo}
set interfaces tunnel tun${pe1ifNum} source-address ${ac1ip2}
set interfaces tunnel tun${pe1ifNum} remote ${pe1lo}
set interfaces tunnel tun${pe1ifNum} encapsulation gre
set interfaces tunnel tun${pe1ifNum} multicast disable
set interfaces tunnel tun${pe1ifNum} parameters ip ttl 255
echo '>>>GRE 配置[Backup]<<<'
set interfaces tunnel tun${pe2ifNum} description PE2_${pe2if}
set interfaces tunnel tun${pe2ifNum} address ${pe2ip2}/30
#set interfaces tunnel tun${pe2ifNum} local-ip ${ac2ip2}
#set interfaces tunnel tun${pe2ifNum} remote-ip ${pe2lo}
set interfaces tunnel tun${pe2ifNum} source-address ${ac2ip2}
set interfaces tunnel tun${pe2ifNum} remote ${pe2lo}
set interfaces tunnel tun${pe2ifNum} encapsulation gre
set interfaces tunnel tun${pe2ifNum} multicast disable
set interfaces tunnel tun${pe2ifNum} parameters ip ttl 255
echo '>>>MTU TCP-MSS配置[interface]<<<'
set firewall options interface ${ac1if} adjust-mss '1300'
set firewall options interface ${ac2if} adjust-mss '1300'
set firewall options interface tun${pe1ifNum} adjust-mss '1300'
set firewall options interface tun${pe2ifNum} adjust-mss '1300'
echo '>>>路由配置[Track 默认路由，对接公网路由，内网路由]<<<'
set track name to-main failure-count 2
set track name to-main success-count 2
set track name to-main test 10 resp-time 5
set track name to-main test 10 target 10.30.20.129
set track name to-main test 10 ttl-limit 1
set track name to-main test 10 type ping
echo '>>>静态路由配置[Static]<<<'
set protocols static route ${ac1remote}/32 next-hop ${wan1gw1}
set protocols static route ${ac1remote}/32 next-hop ${wan2gw2}
set protocols static route 10.0.0.0/8 next-hop ${lan1gw1}
set protocols static route 172.16.0.0/12 next-hop ${lan1gw1}
set protocols static route 192.168.0.0/16 next-hop ${lan1gw1}
set protocols static route 192.168.247.10/32 next-hop ${ac1ip1}
set protocols static route 192.168.253.53/32 next-hop ${ac2ip1}
set protocols static route 114.113.245.99/32 next-hop ${pe1ip1}
set protocols static route 114.113.245.100/32 next-hop ${pe2ip1}
set protocols static route 192.168.55.125/32 next-hop ${pe1ip1} track to-main
set protocols static route 192.168.55.125/32 next-hop ${pe2ip1} distance 5
set protocols static route 192.168.55.250/32 next-hop ${pe1ip1} track to-main
set protocols static route 192.168.55.250/32 next-hop ${pe2ip1} distance 5
echo '>>>动态路由配置[BGP]<<<'
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
set protocols bgp 65000 neighbor ${pe1ip1} update-source ${pe1ip2}

set protocols bgp 65000 neighbor ${pe2ip1} address-family ipv4-unicast allowas-in
set protocols bgp 65000 neighbor ${pe2ip1} address-family ipv4-unicast prefix-list export 'Local-Route'
set protocols bgp 65000 neighbor ${pe2ip1} address-family ipv4-unicast route-map import 'bgp-from--Backup'
set protocols bgp 65000 neighbor ${pe2ip1} address-family ipv4-unicast soft-reconfiguration inbound
set protocols bgp 65000 neighbor ${pe2ip1} update-source ${pe2ip2}
#
# track 静态路由配置
#
set protocols static route 223.5.5.5/32 next-hop ${wan1gw1}
#

# Fnetlink路由配置
#
# 监控服务器公网IP路由
#
`;
  let filename = `${lineid}-Fast-SD-WAN-FastIP-GREOverOpenVPN-Config-${time.ez}-By-${user}`;
  let data = {};
  console.log(fastip001fastipGreOverOpenvpn);
  downloadConfig(filename, fastip001fastipGreOverOpenvpn);
  let type = 'post'
  let datatype = 'json';
  ajaxHandler(url,data,datatype,type);
};