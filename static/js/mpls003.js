/* MPLS 组网 双机 */

const mpls001_version = 1;
const mpls001html = `<table border="1">
<tr>
<td><input id="lineid_input"></td>
<td><input id="area_input" value="GZ"></td>
</tr>

<tr><td><input id="cname_input" placeholder="CompanyName[eg:Huawei]"></td>
<td><input id="area_input" placeholder="Area[GZ,SZ,SH,etc...]"></td></tr>

<tr><td><select id="version_select">
<option value="40" selected="selected">FnetOS[ 4.0 ]</option>
<option value="32">FnetOS[ 3.2 ]</option>
<option value="31">FnetOS[ 3.1 ]</option></select></td>
<td><input id="subnet_input" placeholder="Subnet[eg:10.1.1.0/24]"></td></tr>

<tr><td><select id="wan1_select">
<option value="eth0" selected="selected">WAN1-ETH0</option>
<option value="eth1">WAN1-ETH1</option>
<option value="br0">WAN1-BR0</option>
<option value="br1">WAN1-BR1</option></select>
<select id="wan1_provider_select">
<option value="CT" selected="selected">[CT]</option>
<option value="CU">[CU]</option>
<option value="CM">[CM]</option></select></td>
<td><select id="wan1_type_select" onchange=mpls001setWan(this.value)>
<option value="dhcp" selected="selected">WAN Type[ DHCP ]</option>
<option value="static">WAN Type[ Static ]</option>
<option value="pppoe">WAN Type[ PPPoE ]</option></select></td></tr>
<tr id="wan1_input_tr"></tr>

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
<td><input id="pe1_as_input"></td>
<td><input id="pe2_as_input"></td>
</tr>

<tr>
<td><input id="ce1_as_input"></td>
<td><input id="ce2_as_input"></td>
</tr>

<tr>
<td><input id="ac1_input"></td>
<td><input id="ac2_input"></td>
</tr>

<tr>
<td><input id="ac1_if_input"></td>
<td><input id="ac2_if_input"></td>
</tr>

<tr>
<td><input id="ac1_ip_input"></td>
<td><input id="ac2_ip_input"></td>
</tr>

<tr>
<td><input id="ac1_pub_input"></td>
<td><input id="ac2_pub_input"></td>
</tr>
</table>
<button type="button" onclick="mpls001sub('/config')">提交配置信息(Submit Config Info)</button>
`;

function mpls001getList() {
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
        "lo":[],
        "pub":[],
        "as":[],
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
                    if(l1.search('pe')!=-1){
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
                    let a = l1.split('.')[0]
                    if(a!=10&&a!=172&&a!=192){
                        info_json.pub.push(l1);
                    }else{
                        info_json.lo.push(l1);
                    };
                    break;
                case 'ce对接':
                    info_json.lo.push(l1);
                    break;
                case 'peas号':
                    info_json.as.push(l1);
                    break;
                case 'ceas号':
                    info_json.as.push(l1);
                    break;
                default:
                    console.log(l1)
                    info_json.other.push(l1);
            };
        }
    };

    $("#lineid_input").val(info_json.id[0].substr(0,7));
    $("#pe1_input").val(info_json.pe[0]);
    $("#pe1_if_input").val(info_json.if[0]);
    $("#pe1_ip_input").val(info_json.ip[0]);
    $("#pe1_lo_input").val(info_json.lo[0]);
    $("#ce1_lo_input").val(ipNext(info_json.ip[1].split('/')[0])[1]);
    $("#pe1_as_input").val(info_json.as[0]);
    $("#ce1_as_input").val(info_json.as[1]);
    $("#ac1_input").val(info_json.ac[0]);
    $("#ac1_if_input").val(info_json.if[1]);
    $("#ac1_ip_input").val(info_json.ip[1]);
    $("#ac1_pub_input").val(info_json.pub[0]);

    $("#pe2_input").val(info_json.pe[1]);
    $("#pe2_if_input").val(info_json.if[2]);
    $("#pe2_ip_input").val(info_json.ip[2]);
    $("#pe2_lo_input").val(info_json.lo[2]);
    $("#ce2_lo_input").val(ipNext(info_json.ip[3].split('/')[0])[1]);
    $("#pe2_as_input").val(info_json.as[2]);
    $("#ce2_as_input").val(info_json.as[3]);
    $("#ac2_input").val(info_json.ac[1]);
    $("#ac2_if_input").val(info_json.if[3]);
    $("#ac2_ip_input").val(info_json.ip[3]);
    $("#ac2_pub_input").val(info_json.pub[1]);
    console.log(info_json);
  };
};

$("#service_dev").append(mpls001html);

mpls001getList()

function mpls001setWan(value){
    let html='';
    wan_input_tr = '#wan1_input_tr';
    switch(value){
        case "dhcp":
            $(wan_input_tr).empty();
        break;
        case "static":
            $(wan_input_tr).empty();
            $(wan_input_tr).append(`<td><input id="wan1_ip_input" placeholder="IP[x.x.x.x/x]"></td>
            <td><input id="wan1_gw_input" placeholder="GW[x.x.x.x]"></td>`);
        break;
        case "pppoe":
            $(wan_input_tr).empty();
            $(wan_input_tr).append(`<td><input id="pppoe1_user_input" placeholder="PPPoE[x.163.gd]"></td>
            <td><input id="pppoe1_pass_input" placeholder="PPPoE[******]"></td>`);
        break;
    };
}

function mpls001sub(url){
  let user = $("#user_input").val();
  let time=getTime(new Date());
  let wan1 = $("#wan1_select").val();
  let wan1Type = $("#wan1_type_select").val();
  let wan1Provider = $("#wan1_provider_select").val();

  let cname = $("#cname_input").val();
  let area = $("#area_input").val();
  let subnet = $("#subnet_input").val();

  let lineid = $("#lineid_input").val();
  let cid = lineid.substr(0,6);
  let ac1 = $("#ac1_input").val();
  let ac1if = $("#ac1_if_input").val();
  let ac1port = ac1if.replace('vtun','');
  let ac1ips = ipNext($("#ac1_ip_input").val().split('/')[0]);
  let ac1ip1 = ac1ips[0];
  let ac1ip2 = ac1ips[1];
  let ac1pub = $("#ac1_pub_input").val();

  let ac2 = $("#ac2_input").val();
  let ac2if = $("#ac2_if_input").val();
  let ac2port = ac2if.replace('vtun','');
  let ac2ips = ipNext($("#ac2_ip_input").val().split('/')[0]);
  let ac2ip1 = ac2ips[0];
  let ac2ip2 = ac2ips[1];
  let ac2pub = $("#ac2_pub_input").val();

  let pe1 = $("#pe1_input").val();
  let pe1if = "tun"+$("#pe1_if_input").val().match(/[1-9]\d+/)[0];
  let pe1ifNum = pe1if.match(/[1-9]\d+/)[0];
  let pe1ips = ipNext($("#pe1_ip_input").val().split('/')[0]);
  let pe1ip1 = pe1ips[0];
  let pe1ip2 = pe1ips[1];
  let pe1lo = $("#pe1_lo_input").val();
  let ce1lo = $("#ce1_lo_input").val();
  let pe1As = $("#pe1_as_input").val();
  let ce1As = $("#ce1_as_input").val();

  let pe2 = $("#pe2_input").val();
  let pe2if = "tun"+$("#pe2_if_input").val().match(/[1-9]\d+/)[0];
  let pe2ifNum = pe2if.match(/[1-9]\d+/)[0];
  let pe2ips = ipNext($("#pe2_ip_input").val().split('/')[0]);
  let pe2ip1 = pe2ips[0];
  let pe2ip2 = pe2ips[1];
  let pe2lo = $("#pe2_lo_input").val();
  let ce2lo = $("#ce2_lo_input").val();
  let pe2As = $("#pe2_as_input").val();
  let ce2As = $("#ce2_as_input").val();

//差异化配置生成
let wanTemp = '';
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
set interfaces ethernet ${wan1} pppoe 1 default-route 'none'
set interfaces ethernet ${wan1} pppoe 1 mtu '1492'
set interfaces ethernet ${wan1} pppoe 1 name-server 'none'
set interfaces ethernet ${wan1} pppoe 1 password ${pppoe1user}
set interfaces ethernet ${wan1} pppoe 1 user-id ${pppoe1pass}
set protocols static interface-route 1.1.1.1/32 next-hop-interface pppoe1`;
    break;
  };

let mpls001MPLSGreOverOpenvpn  =
`#Fnet MPLS with GRE Over OpenVPN Template.
#操作人员：${user}
#时间：${time}
#系统：vyui-v1
#vyos version >= 1.28.
+++++++++++++++++++++++++++++++++++++++++++
echo '初始化设备'
delete system host-name
delete epoch controller
sudo systemctl stop epoch-openvpnd
rm /config/.initagentd.status
delete interface openvpn
delete interface tunnel
delete interface loopback lo
delete firewall options interface
delete nat
delete protocols
delete policy
delete track
delete service dns
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

set interfaces ethernet eth0 firewall local name 'WAN2LOCAL'
set interfaces ethernet eth1 firewall local name 'WAN2LOCAL'
set interfaces tunnel ${pe1if} firewall local name 'WAN2LOCAL'
set interfaces tunnel ${pe2if} firewall local name 'WAN2LOCAL'
echo '基础配置[系统名称，物理接口]'
set system host-name ${lineid}-${cname}-${area}
set service snmp community both-win authorization 'ro'
set service smartping password both-win
set service ssh disable-host-validation
set service ssh port 2707
set service ssh acl permit '10.0.0.0/8'
set service ssh acl permit '100.64.0.0/10'
set service ssh acl permit '172.16.0.0/12'
set service ssh acl permit '192.168.0.0/16'
set service ssh acl permit '183.61.239.168/32'
set service ssh acl permit '202.104.174.178/32'
set service ssh acl permit '59.37.126.140/32'
set service ssh acl permit '113.105.190.147/32'
set service ssh acl permit '114.112.238.8/29'
set service ssh acl permit '114.113.245.101/32'
set service ssh acl permit '120.76.31.146/32'
set system syslog global facility all level 'info'
set system syslog host 192.168.237.78 facility protocols level 'debug'
set openfalcon server-address 192.168.237.86
set openfalcon endpoint-name ${lineid}-${cnameEN}-${area}
${wanTemp}
echo 'OpenVPN 接入配置[ac1]'
set interfaces openvpn ${ac1if} description AC1_to_${ac1}
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
set interfaces openvpn ${ac1if} shared-secret-key-file '/config/auth/openvpn.secret'
echo 'OpenVPN 接入配置[ac2]'
set interfaces openvpn ${ac2if} description AC2_to_${ac2}
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
set interfaces openvpn ${ac2if} shared-secret-key-file '/config/auth/openvpn.secret'
echo '>>>GRE 配置[Main]<<<'
set interfaces tunnel ${pe1if} description PE1_${pe1}
set interfaces tunnel ${pe1if} address ${pe1ip2}/30
#[v3.2]set interfaces tunnel ${pe1if} local-ip ${ac1ip2}
#[v3.2]set interfaces tunnel ${pe1if} remote-ip ${pe1lo}
set interfaces tunnel ${pe1if} source-address ${ac1ip2}
set interfaces tunnel ${pe1if} remote ${pe1lo}
set interfaces tunnel ${pe1if} encapsulation gre
set interfaces tunnel ${pe1if} multicast disable
set interfaces tunnel ${pe1if} parameters ip ttl 255
echo '>>>GRE 配置[Backup]<<<'
set interfaces tunnel ${pe2if} description PE2_${pe2}
set interfaces tunnel ${pe2if} address ${pe2ip2}/30
#[v3.2]set interfaces tunnel ${pe2if} local-ip ${ac2ip2}
#[v3.2]set interfaces tunnel ${pe2if} remote-ip ${pe2lo}
set interfaces tunnel ${pe2if} source-address ${ac2ip2}
set interfaces tunnel ${pe2if} remote ${pe2lo}
set interfaces tunnel ${pe2if} encapsulation gre
set interfaces tunnel ${pe2if} multicast disable
set interfaces tunnel ${pe2if} parameters ip ttl 255
echo '>>>MTU TCP-MSS配置[interface]<<<'
set firewall options interface ${ac1if} adjust-mss '1300'
set firewall options interface ${ac2if} adjust-mss '1300'
set firewall options interface tun${pe1ifNum} adjust-mss '1300'
set firewall options interface tun${pe2ifNum} adjust-mss '1300'
echo '>>>路由配置[Track 默认路由，对接公网路由，内网路由]<<<'
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
set protocols static route 114.113.245.99/32 next-hop ${pe1ip1}
set protocols static route 114.113.245.100/32 next-hop ${pe2ip1}
set protocols static route 192.168.55.125/32 next-hop ${pe1ip1} track to-main
set protocols static route 192.168.55.125/32 next-hop ${pe2ip1} distance 5
set protocols static route 192.168.55.250/32 next-hop ${pe1ip1} track to-main
set protocols static route 192.168.55.250/32 next-hop ${pe2ip1} distance 5
set protocols static route 192.168.237.86/32 next-hop ${pe1ip1} track to-main
set protocols static route 192.168.237.86/32 next-hop ${pe2ip1} distance 5
echo '>>>动态路由配置[BGP]<<<'
set policy prefix-list Local-Route rule 10 action 'permit'
set policy prefix-list Local-Route rule 10 prefix ${subnet}
set policy route-map BGP rule 10 action 'permit'
set policy route-map BGP rule 10 match ip address prefix-list 'Local-Route'
set policy route-map BGP rule 999 action 'deny'

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
set protocols bgp 65000 neighbor ${pe1ip1} local-as ${ce1As}
set protocols bgp 65000 neighbor ${pe1ip1} remote-as ${pe1As}
set protocols bgp 65000 neighbor ${pe1ip1} update-source ${pe1ip2}

set protocols bgp 65000 neighbor ${pe2ip1} address-family ipv4-unicast allowas-in
set protocols bgp 65000 neighbor ${pe2ip1} address-family ipv4-unicast prefix-list export 'Local-Route'
set protocols bgp 65000 neighbor ${pe2ip1} address-family ipv4-unicast route-map import 'bgp-from--Backup'
set protocols bgp 65000 neighbor ${pe2ip1} address-family ipv4-unicast soft-reconfiguration inbound
set protocols bgp 65000 neighbor ${pe2ip1} local-as ${ce2As}
set protocols bgp 65000 neighbor ${pe2ip1} remote-as ${pe2As}
set protocols bgp 65000 neighbor ${pe2ip1} update-source ${pe2ip2}

echo '>>>NetFlow<<<'
set system flow-accounting interface tun1015
set system flow-accounting interface tun1153
set system flow-accounting netflow engine-id '1'
set system flow-accounting netflow server 10.100.114.1  port '9995'
set system flow-accounting netflow timeout expiry-interval '60'
set system flow-accounting netflow timeout flow-generic '3600'
set system flow-accounting netflow timeout icmp '300'
set system flow-accounting netflow timeout max-active-life '604800'
set system flow-accounting netflow timeout tcp-fin '300'
set system flow-accounting netflow timeout tcp-generic '3600'
set system flow-accounting netflow timeout tcp-rst '120'
set system flow-accounting netflow timeout udp '300'
set system flow-accounting netflow version '9'
set system flow-accounting syslog-facility 'daemon'
`;
  let filename = `${lineid}-MPLS-GREOverOpenVPN-Config-${time.ez}-By-${user}`;
  let data = {};
  console.log(mpls001MPLSGreOverOpenvpn);
  downloadConfig(filename, mpls001MPLSGreOverOpenvpn);
  let type = 'post'
  let datatype = 'json';
  ajaxHandler(url,data,datatype,type);
};