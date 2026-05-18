/***
VYOS FastIP 使用F-Guard GRE Over IPsec 非HK出口
***/
const fastip109html = `<table border="1">
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
<select id="wan1_type_select" onchange=fastip109setWan1type(this.value)>
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
<option value="eth2" selected="selected">eth2</option>
<option value="eth3">eth3</option>
<option value="eth4">eth4</option>
<option value="eth5">eth5</option>
</select>
</td>
<td><input id="lan1_ip_input" value="192.168.8.1/24"></td>
</tr>

<tr>
<td style="text-align: center;">接入区域</td>
<td><input id="area_input" placeholder="Area[GZ,SZ,SH,etc...]"></td>
<td><select id="wan1_provider_select">
<option value="CT" selected="selected">电信</option>
<option value="CU">联通</option>
<option value="CM">移动</option></select></td>
</tr>

<tr>
<td style="text-align: center;">分流DNS</td>
<td><input id="dns1_input" value='1.0.0.1'></td>
<td><input id="dns2_input" value='9.9.9.9'></td>
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
<td><input id="oversea1ip1_input"></td>
<td><input id="oversea2ip1_input"></td>
</tr>
<tr>
<td style="text-align: center;">BGP Server</td>
<td><input id="bgp1server_input" value='103.252.19.25,43.229.117.226'></td>
<td><input id="bgp2server_input" value='103.252.19.99,43.229.119.251'></td>
</tr>



</table>
<button type="button" onclick="fastip109sub('/config')">提交配置信息(Submit Config Info)</button>
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

function fastip109getList() {
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
    $("#oversea1ip1_input").val(info_json.overseaip[0]);
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
    $("#oversea2ip1_input").val(info_json.overseaip[1]);
    if (info_json.psk[1]){
        $("#ac2_psk_input").val(info_json.psk[1]);
    }

}
//填充模板表格
$("#service_dev").append(fastip109html);
//加载测试资源的解析数据
fastip109getList();
function fastip109setWan1type(value){
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


function fastip109sub(url){
  let user = $("#user_input").val();
  let time=getTime(new Date());
  let wan1 = $("#wan1_select").val();
  let line1 = $("#line1_input").val();
  let line2 = $("#line1_input").val();
  let lineid = line1.substr(0,7);
  let site1id = line1.replace(/\d+$/, '');
  let cid = line1.replace(/[0-9]+/g,"");
  let wan1Provider = $("#wan1_provider_select").val();
  let area = $("#area_input").val();
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
  let oversea1ip1 = $("#oversea1ip1_input").val().split('-')[0];
  let oversea2ip1 = $("#oversea2ip1_input").val().split('-')[0];

  console.log(wan1type);
  let wan_route_temp = '';
if(wan1type=='dhcp'){
    wan1gw = '1.1.1.1';
    wan_route_temp +=`set interfaces ethernet ${wan1} description WAN1-${wan1Provider}-DHCP
set interfaces ethernet ${wan1} address dhcp
set protocols static route 1.1.1.1/32 dhcp-interface ${wan1}`;
}else if(wan1type=='static'){
    wan1ips = $("#wan1_ip_input").val();
    wan1gw = $("#wan1_gw_input").val();
    wan1ipmask = cidrToSubnetMask(wan1ips);
    wan1ip = wan1ips.split('/')[0];
    wan_route_temp += `set interfaces ethernet ${wan1} description WAN1-${wan1Provider}-GW-${wan1gw}
set interfaces ethernet ${wan1} address ${wan1ip}
set protocols static route 1.1.1.1/32 next-hop ${wan1gw}`;
}

let fastip109mplsGreOverIPsec  =
`# VYOS Use F-Guard FastIP MPLS GRE Over Ipsec Template.
# fastip109
# Operator: ${user}
# ${time.cn}
#设备初始化
=================================
echo '基础配置[防火墙规则，系统名称，物理接口]'
set firewall group network-group GROUP-FNET-Whitelist network '43.229.117.226/32'
set firewall group network-group GROUP-FNET-Whitelist network '43.229.119.251/32'
set firewall group network-group GROUP-FNET-Whitelist network '120.76.31.146/32'
set firewall group network-group GROUP-FNET-Whitelist network '202.104.174.178/32'
set firewall group network-group GROUP-FNET-Whitelist network '114.112.236.97/32'
set firewall group network-group GROUP-FNET-Whitelist network '114.112.238.8/29'
set firewall group network-group GROUP-FNET-Whitelist network '192.168.55.250/32'
set firewall group network-group GROUP-FNET-Whitelist network '192.168.55.10/32'
set firewall group network-group GROUP-FNET-Whitelist network '192.168.55.11/32'
set firewall group network-group GROUP-FNET-Whitelist network '114.113.245.99/32'
set firewall group network-group GROUP-FNET-Whitelist network '114.113.245.100/32'
set firewall group network-group GROUP-FNET-Whitelist network '114.113.245.101/32'
set firewall group network-group GROUP-FNET-Whitelist network '10.0.0.0/8'
set firewall group network-group GROUP-FNET-Whitelist network '172.16.0.0/12'
set firewall group network-group GROUP-FNET-Whitelist network '192.168.0.0/16'
set firewall group network-group GROUP-FNET-Whitelist network '100.68.250.0/24'
set firewall group network-group GROUP-FNET-Whitelist network '224.0.0.0/4'
#
set firewall name WAN2LOCAL default-action 'drop'
set firewall name WAN2LOCAL rule 1005 action 'accept'
set firewall name WAN2LOCAL rule 1005 state established 'enable'
set firewall name WAN2LOCAL rule 1005 state related 'enable'
set firewall name WAN2LOCAL rule 1010 action 'accept'
set firewall name WAN2LOCAL rule 1010 source group network-group 'GROUP-FNET-Whitelist'
set firewall name WAN2LOCAL rule 1210 action 'accept'
set firewall name WAN2LOCAL rule 1210 protocol 'gre'
set firewall name WAN2LOCAL rule 1220 action 'accept'
set firewall name WAN2LOCAL rule 1220 protocol 'ipip'
#
set system host-name ${lineid}-${cname}-${area}
set service snmp community both-win authorization 'ro'
set service smartping password both-win
set service ssh disable-host-validation
set service ssh port 2707
#
${wan_route_temp}
#
echo '# Portal配置'
set system syslog global facility all level 'info'
set system syslog host 192.168.237.78 facility protocols level 'debug'
set openfalcon server-address 192.168.237.86
set openfalcon endpoint-name ${lineid}-${cname}-${area}
set interfaces loopback lo address ${ce1lo}/32
set interfaces loopback lo address ${ce2lo}/32
set interfaces dummy dum101 address ${oversea1ip1}/32
set interfaces dummy dum201 address ${oversea2ip1}/32
#
#IPsec 接入
set vpn ipsec esp-group ESP-FNET-V2 lifetime '3600'
set vpn ipsec esp-group ESP-FNET-V2 mode 'tunnel'
set vpn ipsec esp-group ESP-FNET-V2 pfs 'disable'
set vpn ipsec esp-group ESP-FNET-V2 proposal 1 encryption 'aes128gcm128'
#
set vpn ipsec ike-group IKE-FNET-V2 close-action 'restart'
set vpn ipsec ike-group IKE-FNET-V2 dead-peer-detection action 'restart'
set vpn ipsec ike-group IKE-FNET-V2 dead-peer-detection interval '2'
set vpn ipsec ike-group IKE-FNET-V2 dead-peer-detection timeout '60'
set vpn ipsec ike-group IKE-FNET-V2 ikev2-reauth 'no'
set vpn ipsec ike-group IKE-FNET-V2 key-exchange 'ikev2'
set vpn ipsec ike-group IKE-FNET-V2 lifetime '28800'
set vpn ipsec ike-group IKE-FNET-V2 mobike 'disable'
set vpn ipsec ike-group IKE-FNET-V2 proposal 1 dh-group '14'
set vpn ipsec ike-group IKE-FNET-V2 proposal 1 encryption 'aes256'
set vpn ipsec ike-group IKE-FNET-V2 proposal 1 hash 'sha384'
set vpn ipsec ike-group IKE-FNET-V2 proposal 1 prf 'prfsha384'
set vpn ipsec ipsec-interfaces interface 'br0'
set vpn ipsec nat-traversal 'enable'
#
set vpn ipsec site-to-site peer ${ac1pub} authentication id '${lineid}1'
set vpn ipsec site-to-site peer ${ac1pub} authentication mode 'pre-shared-secret'
set vpn ipsec site-to-site peer ${ac1pub} authentication pre-shared-secret 'both-win'
set vpn ipsec site-to-site peer ${ac1pub} authentication remote-id '${ac1pub}'
set vpn ipsec site-to-site peer ${ac1pub} connection-type 'initiate'
set vpn ipsec site-to-site peer ${ac1pub} default-esp-group 'ESP-FNET-V2'
set vpn ipsec site-to-site peer ${ac1pub} ike-group 'IKE-FNET-V2'
set vpn ipsec site-to-site peer ${ac1pub} ikev2-reauth 'yes'
set vpn ipsec site-to-site peer ${ac1pub} local-address any
set vpn ipsec site-to-site peer ${ac1pub} tunnel 1 local prefix ${ce1lo}
set vpn ipsec site-to-site peer ${ac1pub} tunnel 1 remote prefix '10.255.111.128/25'
#
set vpn ipsec site-to-site peer ${ac2pub} authentication id '${lineid}1'
set vpn ipsec site-to-site peer ${ac2pub} authentication mode 'pre-shared-secret'
set vpn ipsec site-to-site peer ${ac2pub} authentication pre-shared-secret 'both-win'
set vpn ipsec site-to-site peer ${ac2pub} authentication remote-id '${ac2pub}'
set vpn ipsec site-to-site peer ${ac2pub} connection-type 'initiate'
set vpn ipsec site-to-site peer ${ac2pub} default-esp-group 'ESP-FNET-V2'
set vpn ipsec site-to-site peer ${ac2pub} ike-group 'IKE-FNET-V2'
set vpn ipsec site-to-site peer ${ac2pub} ikev2-reauth 'yes'
set vpn ipsec site-to-site peer ${ac2pub} local-address any
set vpn ipsec site-to-site peer ${ac2pub} tunnel 1 local prefix ${ce2lo}
set vpn ipsec site-to-site peer ${ac2pub} tunnel 1 remote prefix '10.255.108.0/22'
#
echo '>>>路由配置[Track 默认路由，对接公网路由，内网路由]<<<'
set protocols static route 223.5.5.5/32 next-hop 1.1.1.1
set track name to-223 failure-count 2
set track name to-223 success-count 2
set track name to-223 test 10 resp-time 5
set track name to-223 test 10 target 223.5.5.5
set track name to-223 test 10 ttl-limit 1
set track name to-223 test 10 type ping
#
set track name to-main failure-count 2
set track name to-main success-count 2
set track name to-main test 10 resp-time 5
set track name to-main test 10 target ${pe1ip1}
set track name to-main test 10 ttl-limit 1
set track name to-main test 10 type ping
echo '>>>接入路由<<<'
set protocols static route ${ac1pub}/32 next-hop 1.1.1.1
set protocols static route ${ac2pub}/32 next-hop 1.1.1.1
set protocols static route 10.255.108.0/22 next-hop 1.1.1.1
set protocols static route 10.255.111.128/25 next-hop 1.1.1.1
set protocols static route 0.0.0.0/0 next-hop 1.1.1.1 distance '255'
echo '>>>监控系统路由<<<'
set protocols static route 114.113.245.99/32 next-hop ${pe1ip1}
set protocols static route 114.113.245.100/32 next-hop ${pe2ip1}
set protocols static route 192.168.55.125/32 next-hop ${pe1ip1} track to-main
set protocols static route 192.168.55.125/32 next-hop ${pe2ip1} distance 5
set protocols static route 192.168.55.250/32 next-hop ${pe1ip1} track to-main
set protocols static route 192.168.55.250/32 next-hop ${pe2ip1} distance 5
set protocols static route 192.168.237.78/32 next-hop ${pe1ip1} track to-main
set protocols static route 192.168.237.78/32 next-hop ${pe2ip1} distance 5
set protocols static route 192.168.237.86/32 next-hop ${pe1ip1} track to-main
set protocols static route 192.168.237.86/32 next-hop ${pe2ip1} distance 5
echo '>>>NetFlow<<<'
set protocols static route 10.100.114.12/32 next-hop ${pe1ip1} track to-main
set protocols static route 10.100.114.12/32 next-hop ${pe2ip1} distance 5
#
set interfaces tunnel ${pe1if} address ${pe1ip2}
set interfaces tunnel ${pe1if} description 'NATPE1 ${pe1}'
set interfaces tunnel ${pe1if} encapsulation 'gre'
set interfaces tunnel ${pe1if} mtu '1400'
set interfaces tunnel ${pe1if} multicast 'disable'
set interfaces tunnel ${pe1if} parameters ip ttl '255'
set interfaces tunnel ${pe1if} remote ${pe1lo}
set interfaces tunnel ${pe1if} source-address ${ce1lo}
#
set interfaces tunnel ${pe2if} address ${pe2ip2}
set interfaces tunnel ${pe2if} description 'NATPE2 ${pe2}'
set interfaces tunnel ${pe2if} encapsulation 'gre'
set interfaces tunnel ${pe2if} mtu '1400'
set interfaces tunnel ${pe2if} multicast 'disable'
set interfaces tunnel ${pe2if} parameters ip ttl '255'
set interfaces tunnel ${pe2if} remote ${pe2lo}
set interfaces tunnel ${pe2if} source-address ${ce2lo}
#
set firewall options interface ${pe1if} adjust-mss '1300'
set firewall options interface ${pe2if} adjust-mss '1300'
#
set interfaces ethernet ${wan1} firewall local name 'WAN2LOCAL'
set interfaces tunnel ${pe1if} firewall local name 'WAN2LOCAL'
set interfaces tunnel ${pe2if} firewall local name 'WAN2LOCAL'
#
echo '>>>动态路由配置[BGP]<<<'
set protocols static route ${bgp1server1}/32 next-hop ${pe1ip1}
set protocols static route ${bgp1server1}/32 blackhole distance 5
set protocols static route ${bgp1server2}/32 next-hop ${pe1ip1}
set protocols static route ${bgp1server2}/32 blackhole distance 5
set protocols static route ${bgp2server1}/32 next-hop ${pe2ip1}
set protocols static route ${bgp2server1}/32 blackhole distance 5
set protocols static route ${bgp2server2}/32 next-hop ${pe2ip1}
set protocols static route ${bgp2server2}/32 blackhole distance 5
#
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
#
set policy route-map bgp-from--RSVR rule 100 action 'permit'
set policy route-map bgp-from--RSVR rule 100 description 'to_hk'
set policy route-map bgp-from--RSVR rule 100 match community community-list '80'
set policy route-map bgp-from--RSVR rule 100 set ip-next-hop ${pe1ip1}
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
set policy route-map bgp-from--RSVR rule 1000 action 'deny'
set policy route-map bgp-from--RSVR rule 1000 description 'block_route'
#
set policy route-map bgp-from--RSVR2 rule 100 action 'permit'
set policy route-map bgp-from--RSVR2 rule 100 description 'to_hk'
set policy route-map bgp-from--RSVR2 rule 100 match community community-list '80'
set policy route-map bgp-from--RSVR2 rule 100 set ip-next-hop ${pe2ip1}
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
set policy route-map bgp-from--RSVR2 rule 1000 action 'deny'
set policy route-map bgp-from--RSVR2 rule 1000 description 'block_route'
#
set protocols bgp 65000 neighbor ${bgp1server1} peer-group 'RSVR'
set protocols bgp 65000 neighbor ${bgp1server2} peer-group 'RSVR'
set protocols bgp 65000 neighbor ${bgp2server1} peer-group 'RSVR2'
set protocols bgp 65000 neighbor ${bgp2server2} peer-group 'RSVR2'
set protocols bgp 65000 parameters router-id ${oversea1ip1}
set protocols bgp 65000 peer-group RSVR address-family ipv4-unicast route-map import 'bgp-from--RSVR'
set protocols bgp 65000 peer-group RSVR address-family ipv4-unicast soft-reconfiguration inbound
set protocols bgp 65000 peer-group RSVR remote-as '65000'
set protocols bgp 65000 peer-group RSVR update-source ${oversea1ip1}
set protocols bgp 65000 peer-group RSVR2 address-family ipv4-unicast route-map import 'bgp-from--RSVR2'
set protocols bgp 65000 peer-group RSVR2 address-family ipv4-unicast soft-reconfiguration inbound
set protocols bgp 65000 peer-group RSVR2 remote-as '65000'
set protocols bgp 65000 peer-group RSVR2 update-source ${oversea2ip1}
set protocols bgp 65000 timers holdtime '15'
set protocols bgp 65000 timers keepalive '60'
#
echo '>>>DNS劫持<<<'
set nat destination rule 50 inbound-interface 'br2'
set nat destination rule 50 destination port 53
set nat destination rule 50 protocol tcp_udp
set nat destination rule 50 translation address '192.168.8.1'
echo '>>>本地NAT<<<'
set nat source rule 100 outbound-interface 'eth0'
set nat source rule 100 translation address 'masquerade'
echo '# 海外NAT<<<'
set nat source rule 1001 outbound-interface ${pe1if}
set nat source rule 1001 source address 192.168.0.0/16
set nat source rule 1001 translation address ${oversea1ip1}
set nat source rule 2001 outbound-interface ${pe2if}
set nat source rule 2001 source address 192.168.0.0/16
set nat source rule 2001 translation address ${oversea2ip1}
#
set nat source rule 1991 outbound-interface ${pe1if}
set nat source rule 1991 destination address '10.0.0.0/8'
set nat source rule 1991 exclude
set nat source rule 2991 outbound-interface ${pe2if}
set nat source rule 2991 destination address '10.0.0.0/8'
set nat source rule 2991 exclude
#
set nat source rule 1992 outbound-interface ${pe1if}
set nat source rule 1992 destination address '192.168.0.0/16'
set nat source rule 1992 exclude
set nat source rule 2992 outbound-interface ${pe2if}
set nat source rule 2992 destination address '192.168.0.0/16'
set nat source rule 2992 exclude
#
set nat source rule 1999 outbound-interface ${pe1if}
set nat source rule 1999 source address ${pe1ip2}
set nat source rule 1999 translation address ${oversea1ip1}
set nat source rule 2999 outbound-interface ${pe2if}
set nat source rule 2999 source address ${pe2ip2}
set nat source rule 2999 translation address ${oversea2ip1}
#
echo '# 分流DNS配置<<<'
delete system name-server
set system name-server 127.0.0.1
set epoch file-sync task 1 local '/opt/cn.txt'
set epoch file-sync task 1 remote 'http://183.56.161.82:1909/f32x/domainlist/cn_domainlist.last'
set epoch file-sync task 2 local '/opt/oversea.txt'
set epoch file-sync task 2 remote 'http://183.56.161.82:1909/f32x/domainlist/oversea_domainlist.last'
set service dns forwarding allow-from '0.0.0.0/0'
set service dns forwarding cache-size '10000'
set service dns forwarding dnssec 'off'
set service dns forwarding domainlist CN file '/opt/cn.txt'
set service dns forwarding domainlist CN recursion-desired
set service dns forwarding domainlist CN server ${localdns1ip}
set service dns forwarding domainlist CN server ${localdns2ip}
set service dns forwarding domainlist HK file '/opt/oversea.txt'
set service dns forwarding domainlist HK recursion-desired
set service dns forwarding domainlist HK server ${dns1ip}
set service dns forwarding domainlist HK server ${dns2ip}
set service dns forwarding listen-address 0.0.0.0
set service dns forwarding name-server ${dns1ip}
set service dns forwarding name-server ${dns2ip}
#
echo 'LAN DHCP Server Range: 2-100'
set service dhcp-server shared-network-name dhcp_br2 subnet 192.168.8.0/24 description 'dhcp_br2'
set service dhcp-server shared-network-name dhcp_br2 subnet 192.168.8.0/24 default-router '192.168.8.1'
set service dhcp-server shared-network-name dhcp_br2 subnet 192.168.8.0/24 lease '7200'
set service dhcp-server shared-network-name dhcp_br2 subnet 192.168.8.0/24 name-server '192.168.8.1'
set service dhcp-server shared-network-name dhcp_br2 subnet 192.168.8.0/24 range 0 start '192.168.8.2'
set service dhcp-server shared-network-name dhcp_br2 subnet 192.168.8.0/24 range 0 stop '192.168.8.100'
#
echo '>>>NetFlow<<<'
set system flow-accounting interface br2
set system flow-accounting netflow engine-id '1'
set system flow-accounting netflow server 10.100.114.12 port '9995'
set system flow-accounting netflow timeout expiry-interval '60'
set system flow-accounting netflow timeout flow-generic '10'
set system flow-accounting netflow timeout icmp '300'
set system flow-accounting netflow timeout max-active-life '604800'
set system flow-accounting netflow timeout tcp-fin '300'
set system flow-accounting netflow timeout tcp-generic '3600'
set system flow-accounting netflow timeout tcp-rst '120'
set system flow-accounting netflow timeout udp '120'
set system flow-accounting netflow version '9'
set system flow-accounting syslog-facility 'daemon'
#
`;
  let scriptName = `${lineid}-Huawei-F-Guard-FastIP-GRE-Over-IPsec-Config-${time.ez}-By-${user}`;
  console.log(fastip109mplsGreOverIPsec);
  downloadConfig(scriptName, fastip109mplsGreOverIPsec);
};