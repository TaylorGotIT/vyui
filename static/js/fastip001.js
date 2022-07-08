/* FastIP 假组网 单运营商 */
const fastip001html = `<table border="1">
<tr><td><select id="version_select">
<option value="40" selected="selected">FnetOS[ 4.0 ]</option>
<option value="32">FnetOS[ 3.2 ]</option>
<option value="31">FnetOS[ 3.1 ]</option></select></td>
<td id="lineid_td"></td></tr>
<tr><td><input id="cname_input" placeholder="CompanyName[eg:Huawei]"></td>
<td><input id="area_input" placeholder="Area[GZ,SZ,SH,etc...]"></td></tr>
<tr><td><select id="wan1_select">
<option value="eth0" selected="selected">WAN-ETH0</option>
<option value="eth1">WAN-ETH1</option>
<option value="br0">WAN-BR0</option>
<option value="br1">WAN-BR1</option></select>
<select id="wan1_provider_select">
<option value="CT" selected="selected">电信[CT]</option>
<option value="CU">联通[CU]</option>
<option value="CM">移动[CM]</option></select></td>
<td><select id="wan1_type_select" onchange=fastip001setWan(this.value)>
<option value="dhcp" selected="selected">WAN Type[ DHCP ]</option>
<option value="static">WAN Type[ Static ]</option>
<option value="pppoe">WAN Type[ PPPoE ]</option></select></td></tr>
<tr id="wan1_input_tr"></tr>
//
<tr><td><select id="lan1_select">
<option value="eth" selected="selected">LAN-ETH</option>
<option value="br">LAN-BR</option>
<option value="vlan">LAN-Vlan</option></select></td>
<td>1</td></tr>
<tr><td><input type="checkbox" value="boy" name="interface"/>0
<input type="checkbox" value="boy" name="interface"/>1
<input type="checkbox" value="girl" name="interface"/>2
<input type="checkbox" value="girl" name="interface"/>3
<input type="checkbox" value="girl" name="interface"/>4
<input type="checkbox" value="girl" name="interface"/>5</td></tr>
//
<tr><td><input id="local1_dns_input" placeholder="本地DNS1[eg:223.5.5.5]"></td>
<td><input id="local2_dns_input" placeholder="本地DNS2[eg:223.6.6.6]"></td></tr>
<tr><td><input id="oversea1_dns_input" placeholder="海外DNS1[eg:8.8.8.8]"></td>
<td><input id="oversea2_dns_input" placeholder="海外DNS2[eg:8.8.4.4]"></td></tr>
<tr><td id="ac1_td"></td><td id="ac2_td"></td></tr>
<tr><td id="ac1_if_td"></td><td id="ac2_if_td"></td></tr>
<tr><td id="ac1_ip_td"></td><td id="ac2_ip_td"></td></tr>
<tr><td id="ac1_pub_td"></td><td id="ac2_pub_td"></td></tr>
<tr><td id="ac1_oversea_td"></td><td id="ac2_oversea_td"></td></tr>
<tr><td id="ac1_bgp_td"></td><td id="ac2_bgp_td"></td></tr>
</table>
<button type="button" onclick="fastip001sub('/config')">提交配置信息(Submit Config Info)</button>
`;

function fastip001getList() {
//空格全角分号去除
    let str = $("#config_textarea").val().replaceAll(' ','').replaceAll('：',':');
    if(str.length>32){
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
    $("#lineid_td").append(info_json.id[0].substr(0,7));
    $("#ac1_td").append(info_json.pe[0]);
    $("#ac1_if_td").append(info_json.if[0]);
    $("#ac1_ip_td").append(info_json.ip[0]);
    $("#ac1_pub_td").append(info_json.pub[0]);
    $("#ac1_oversea_td").append(info_json.oversea[0]);
    $("#ac1_bgp_td").append(info_json.bgp[0]);

    $("#ac2_td").append(info_json.pe[1]);
    $("#ac2_if_td").append(info_json.if[1]);
    $("#ac2_ip_td").append(info_json.ip[1]);
    $("#ac2_pub_td").append(info_json.pub[1]);
    $("#ac2_oversea_td").append(info_json.oversea[1]);
    $("#ac2_bgp_td").append(info_json.bgp[1]);
  };
};

$("#service_dev").append(fastip001html);
//加载测试资源的解析数据
fastip001getList();

function fastip001setWan(value){
    let html='';
    console.log(value);
    switch(value){
        case "dhcp":
            $("#wan1_input_tr").empty();
        break;
        case "static":
            $("#wan1_input_tr").empty();
            $("#wan1_input_tr").append(`<td><input id="wan1_ip_input" placeholder="IP[x.x.x.x/x]"></td>
            <td><input id="wan1_gw_input" placeholder="GW[x.x.x.x]"></td>`);
        break;
        case "pppoe":
            $("#wan1_input_tr").empty();
            $("#wan1_input_tr").append(`<td><input id="pppoe1_user_input" placeholder="PPPoE[x.163.gd]"></td>
            <td><input id="pppoe1_pass_input" placeholder="PPPoE[******]"></td>`);
        break;
    };

}

function fastip001sub(url){
  let user = $("#user_input").val();
  let time=getTime(new Date());
  let wan1 = $("#wan1_select").val();
  let wan1Type = $("#wan1_type_select").val();
  let wan1Provider = $("#wan1_provider_select").val();

  let version = $("#version_select").val();
  let lineid = $("#lineid_td").html();
  let cname = $("#cname_input").val();
  let area = $("#area_input").val();
  let local1dns = $("#local1_dns_input").val();
  let local2dns = $("#local2_dns_input").val();
  let oversea1dns = $("#oversea1_dns_input").val();
  let oversea2dns = $("#oversea2_dns_input").val();
  let oversea1ips = $("#ac1_oversea_td").html();
  let oversea1ip1 = oversea1ips.split(',')[0].split('-')[0];
//获取主线参数
  let ac1 = $("#ac1_td").html();
  let ac1if = $("#ac1_if_td").html();
  let ac1port = ac1if.replace('vtun','');
  let ac1ips = ipNext($("#ac1_ip_td").html().split('/')[0]);
  let ac1ip1 = ac1ips[0];
  let ac1ip2 = ac1ips[1];
  let ac1remote = $("#ac1_pub_td").html();
  let bgp1servers1 = $("#ac1_bgp_td").html().split(',');
  let bgp1server1 = bgp1servers1[0];
  let bgp1server3 = bgp1servers1[1];

//获取备线参数
  let ac2 = $("#ac2_td").html();
  let ac2if = $("#ac2_if_td").html();
  let ac2port = ac2if.replace('vtun','');
  let ac2ips = ipNext($("#ac2_ip_td").html().split('/')[0]);
  let ac2ip1 = ac2ips[0];
  let ac2ip2 = ac2ips[1];
  let ac2remote = $("#ac2_pub_td").html();
  let bgp1servers2 = $("#ac2_bgp_td").html().split(',');
  let bgp1server2 = bgp1servers2[0];
  let bgp1server4 = bgp1servers2[1];
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
        wanTemp += `set interfaces ethernet ${wan1} description 'WAN1_CT_${pppoe1user}/${pppoe1pass}'
set interfaces ethernet ${wan1} pppoe 1 default-route 'none'
set interfaces ethernet ${wan1} pppoe 1 mtu '1492'
set interfaces ethernet ${wan1} pppoe 1 name-server 'none'
set interfaces ethernet ${wan1} pppoe 1 password ${pppoe1user}
set interfaces ethernet ${wan1} pppoe 1 user-id ${pppoe1pass}
set protocols static interface-route 1.1.1.1/32 next-hop-interface pppoe1`;
    break;
  };
let smartdns = '';
switch(version){
    case "40":
smartdns += `set epoch controller entry 121.201.101.125 port '20004'
set epoch file-sync task 1 local '/opt/cn.txt'
set epoch file-sync task 1 remote 'http://59.37.126.146:1909/f32x/domainlist/cn_domainlist.last'
set epoch file-sync task 2 local '/opt/oversea.txt'
set epoch file-sync task 2 remote 'http://59.37.126.146:1909/f32x/domainlist/oversea_domainlist.last'
set service dns forwarding allow-from '0.0.0.0/0'
set service dns forwarding cache-size '10000'
set service dns forwarding dnssec 'off'
set service dns forwarding domainlist CN file '/opt/cn.txt'
set service dns forwarding domainlist CN recursion-desired
set service dns forwarding domainlist CN server ${local1dns}
set service dns forwarding domainlist CN server ${local2dns}
set service dns forwarding domainlist CN server '114.114.114.114'
set service dns forwarding domainlist HK file '/opt/oversea.txt'
set service dns forwarding domainlist HK recursion-desired
set service dns forwarding domainlist HK server ${oversea1dns}
set service dns forwarding domainlist HK server ${oversea2dns}
set service dns forwarding listen-address 0.0.0.0
set service dns forwarding name-server ${oversea1dns}
set service dns forwarding name-server ${oversea2dns}`;
    break;
    case "32":
smartdns +=`set service dns dnsmasq cache-size '9999'
set service dns dnsmasq fnetlink-dns enable
set service dns dnsmasq fnetlink-dns local-isp-dns ${local1dns}
set service dns dnsmasq fnetlink-dns local-isp-dns ${local2dns}
set service dns dnsmasq fnetlink-dns upchinadomain host '59.37.126.146'
set service dns dnsmasq listen-on ${wan1}
set service dns dnsmasq name-server ${oversea1dns}
set service dns dnsmasq name-server ${oversea2dns}`;
    break;
    case "31":
smartdns +=`set service dns forwarding cache-size '9999'
set service dns forwarding fnetlink-dns 'enable'
set service dns forwarding fnetlink-dns local-isp-dns ${local1dns}
set service dns forwarding fnetlink-dns local-isp-dns ${local2dns}
set service dns forwarding fnetlink-dns upchinadomain host '59.37.126.146'
set service dns forwarding fnetlink-dns upchinadomain uptime hour '0'
set service dns forwarding fnetlink-dns upchinadomain uptime min '0'
set service dns forwarding listen-on ${wan1}
set service dns forwarding name-server ${oversea1dns}
set service dns forwarding name-server ${oversea2dns}`;
    break;
  };
let fastip001fastipGreOverOpenvpn  =
`#Fnet MPLS with GRE Over OpenVPN Template.
#操作人员：${user}
#时间：${time.cn}
#系统：vyui-v1
#FnetOS Version ${version}
+++++++++++++++++++++++++++++++++++++++++++
echo '基础配置[防火墙规则，系统名称，物理接口]'
set firewall group network-group GROUP-FNET-Whitelist network 202.104.174.178/32
set firewall group network-group GROUP-FNET-Whitelist network 114.112.232.0/23
set firewall group network-group GROUP-FNET-Whitelist network 114.112.236.0/22
set firewall group network-group GROUP-FNET-Whitelist network 114.113.240.0/23
set firewall group network-group GROUP-FNET-Whitelist network 114.113.244.0/23
set firewall group network-group GROUP-FNET-Whitelist network 223.252.176.0/24
set firewall group network-group GROUP-FNET-Whitelist network 10.0.0.0/8
set firewall group network-group GROUP-FNET-Whitelist network 172.16.0.0/12
set firewall group network-group GROUP-FNET-Whitelist network 192.168.0.0/16
set firewall name WAN2LOCAL default-action 'accept'
set firewall name WAN2LOCAL rule 1000 action 'accept'
set firewall name WAN2LOCAL rule 1000 source group network-group 'GROUP-FNET-Whitelist'
set firewall name WAN2LOCAL rule 2000 action 'drop'
set firewall name WAN2LOCAL rule 2000 destination port '179,2707,53,161,123,8899'
set firewall name WAN2LOCAL rule 2000 protocol 'tcp_udp'
set interfaces ethernet eth0 firewall local name 'WAN2LOCAL'
set interfaces ethernet eth1 firewall local name 'WAN2LOCAL'
set interfaces openvpn ${ac1if} firewall local name 'WAN2LOCAL'
set interfaces openvpn ${ac2if} firewall local name 'WAN2LOCAL'
set system host-name ${lineid}-${cname}-${area}
set service smartping
set service snmp community both-win authorization 'ro'
set interfaces loopback lo address ${oversea1ip1}/32
set interfaces loopback lo description ${oversea1ips}
${wanTemp}
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
echo '>>>MTU TCP-MSS配置[interface]<<<'
set firewall options interface ${ac1if} adjust-mss '1300'
set firewall options interface ${ac2if} adjust-mss '1300'
echo '>>>路由配置[Track 默认路由，对接公网路由，内网路由]<<<'
set protocols static route 114.114.114.114/32 next-hop 1.1.1.1
set track name to-114 failure-count 2
set track name to-114 success-count 2
set track name to-114 test 10 resp-time 5
set track name to-114 test 10 target 114.114.114.114
set track name to-114 test 10 ttl-limit 1
set track name to-114 test 10 type ping
set track name to-main failure-count 2
set track name to-main success-count 2
set track name to-main test 10 resp-time 5
set track name to-main test 10 target 10.30.20.129
set track name to-main test 10 ttl-limit 1
set track name to-main test 10 type ping
echo '>>>静态路由配置[Static]<<<'
set protocols static route ${ac1remote}/32 next-hop 1.1.1.1
set protocols static route ${ac1remote}/32 next-hop 1.1.1.1
set protocols static route 114.113.245.99/32 next-hop ${ac1ip1}
set protocols static route 114.113.245.100/32 next-hop ${ac2ip1}
set protocols static route 192.168.55.125/32 next-hop ${ac1ip1} track to-main
set protocols static route 192.168.55.125/32 next-hop ${ac2ip1} distance 5
set protocols static route 192.168.55.250/32 next-hop ${ac1ip1} track to-main
set protocols static route 192.168.55.250/32 next-hop ${ac2ip1} distance 5
set protocols static route ${bgp1server1}/32 next-hop ${ac1ip1} track 'to-main'
set protocols static route ${bgp1server1}/32 blackhole distance '5'
set protocols static route ${bgp1server3}/32 next-hop ${ac1ip1} track 'to-main'
set protocols static route ${bgp1server3}/32 blackhole distance '5'
set protocols static route ${bgp1server2}/32 next-hop ${ac2ip1}
set protocols static route ${bgp1server4}/32 next-hop ${ac2ip1}
echo '>>>动态路由配置[BGP]<<<'
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
set policy community-list 85 rule 10 action 'permit'
set policy community-list 85 rule 10 description 'to_deny'
set policy community-list 85 rule 10 regex '65000:9807'
set policy route-map bgp-from--RSVR rule 100 action 'permit'
set policy route-map bgp-from--RSVR rule 100 description 'to_hk'
set policy route-map bgp-from--RSVR rule 100 match community community-list '80'
set policy route-map bgp-from--RSVR rule 100 set ip-next-hop ${ac1ip1}
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
set policy route-map bgp-from--RSVR2 rule 100 action 'permit'
set policy route-map bgp-from--RSVR2 rule 100 description 'to_hk'
set policy route-map bgp-from--RSVR2 rule 100 match community community-list '80'
set policy route-map bgp-from--RSVR2 rule 100 set ip-next-hop ${ac2ip1}
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
set protocols bgp 65000 neighbor ${bgp1server1} peer-group 'RSVR'
set protocols bgp 65000 neighbor ${bgp1server3} peer-group 'RSVR'
set protocols bgp 65000 neighbor ${bgp1server2} peer-group 'RSVR2'
set protocols bgp 65000 neighbor ${bgp1server4} peer-group 'RSVR2'
set protocols bgp 65000 parameters router-id 10.30.140.14
set protocols bgp 65000 peer-group RSVR address-family ipv4-unicast route-map import 'bgp-from--RSVR'
set protocols bgp 65000 peer-group RSVR address-family ipv4-unicast soft-reconfiguration inbound
set protocols bgp 65000 peer-group RSVR remote-as '65000'
set protocols bgp 65000 peer-group RSVR update-source ${ac1ip2}
set protocols bgp 65000 peer-group RSVR2 address-family ipv4-unicast route-map import 'bgp-from--RSVR2'
set protocols bgp 65000 peer-group RSVR2 address-family ipv4-unicast soft-reconfiguration inbound
set protocols bgp 65000 peer-group RSVR2 remote-as '65000'
set protocols bgp 65000 peer-group RSVR2 update-source ${ac2ip2}
set protocols bgp 65000 timers holdtime '15'
set protocols bgp 65000 timers keepalive '60'
echo '>>>DNS劫持<<<'
set nat destination rule 50 destination port 53
set nat destination rule 50 inbound-interface ${wan1}
set nat destination rule 50 protocol tcp_udp
set nat destination rule 50 translation address 127.0.0.1
echo '>>>本地NAT<<<'
set nat source rule 100 outbound-interface ${wan1}
set nat source rule 100 translation address masquerade
echo '>>>海外NAT<<<'
set nat source rule 1001 destination address ${oversea1dns}/32
set nat source rule 1001 outbound-interface ${ac1if}
set nat source rule 1001 translation address ${oversea1ip1}
set nat source rule 2001 destination address ${oversea1dns}/32
set nat source rule 2001 outbound-interface ${ac2if}
set nat source rule 2001 translation address ${oversea1ip1}
set nat source rule 1002 destination address ${oversea2dns}/32
set nat source rule 1002 outbound-interface ${ac1if}
set nat source rule 1002 translation address ${oversea1ip1}
set nat source rule 2002 destination address ${oversea2dns}/32
set nat source rule 2002 outbound-interface ${ac2if}
set nat source rule 2002 translation address ${oversea1ip1}
echo '>>>SmartDNS智能DNS配置<<<'
${smartdns}
###以上配置commit后再贴###
delete system name-server
set system name-server 127.0.0.1
`;
  let filename = `${lineid}-Fast-SD-WAN-FastIP-GREOverOpenVPN-Config-${time.ez}-By-${user}`;
  let data = {};
  downloadConfig(filename, fastip001fastipGreOverOpenvpn);
  let type = 'post'
  let datatype = 'json';
  ajaxHandler(url,data,datatype,type);
};