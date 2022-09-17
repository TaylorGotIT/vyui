/* FastIP 假组网 Tiktok 单运营商 */
const fastip103html = `<table border="1">
<tr><td><select id="version_select">
<option value="40" selected="selected">FnetOS[ 4.0 ]</option>
<option value="32">FnetOS[ 3.2 ]</option>
<option value="31">FnetOS[ 3.1 ]</option></select></td>
<td id="lineid_td"></td></tr>
<tr><td><input id="cname_input" placeholder="CompanyName[eg:Huawei]"></td>
<td><input id="area_input" placeholder="Area[GZ,SZ,SH,etc...]"></td></tr>
<tr><td><select id="wan1_select">
<option value="eth0" selected="selected">WAN1-ETH0</option>
<option value="eth1">WAN1-ETH1</option>
<option value="br0">WAN1-BR0</option>
<option value="br1">WAN1-BR1</option></select>
<select id="wan1_provider_select">
<option value="CT" selected="selected">电信[CT]</option>
<option value="CU">联通[CU]</option>
<option value="CM">移动[CM]</option></select></td>
<td><select id="wan1_type_select" onchange=fastip103setWan(this.value)>
<option value="dhcp" selected="selected">WAN Type[ DHCP ]</option>
<option value="static">WAN Type[ Static ]</option>
<option value="pppoe">WAN Type[ PPPoE ]</option></select></td></tr>
<tr>
<td><input id="oversea1_dns_input" placeholder="海外DNS1[eg:8.8.8.8]"></td>
<td><input id="oversea2_dns_input" placeholder="海外DNS2[eg:8.8.4.4]"></td>
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
<td><input id="pe1_oversea_input"></td>
<td><input id="pe2_oversea_input"></td>
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
<button type="button" onclick="fastip103sub('/config')">提交配置信息(Submit Config Info)</button>
`;

function fastip103getList() {
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
                    if(l1.search('ac')!=-1){
                        info_json.ac.push(l1);
                    }else{
                        info_json.pe.push(l1);
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
                default:
                    console.log(l1)
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
    $("#pe1_lo_input").val(info_json.lo[0]);
    $("#ce1_lo_input").val(info_json.lo[1]);
    $("#pe1_oversea_input").val(info_json.oversea[1]);
    $("#pe1_as_input").val(info_json.as[1]);
    $("#ac1_input").val(info_json.ac[0]);
    $("#ac1_if_input").val(info_json.if[1]);
    $("#ac1_ip_input").val(info_json.ip[1]);
    $("#ac1_pub_input").val(info_json.pub[0]);

    $("#pe2_input").val(info_json.pe[1]);
    $("#pe2_if_input").val(info_json.if[2]);
    $("#pe2_ip_input").val(info_json.ip[2]);
    $("#pe2_lo_input").val(info_json.lo[2]);
    $("#ce2_lo_input").val(info_json.lo[3]);
    $("#pe2_oversea_input").val(info_json.oversea[1]);
    $("#pe2_as_input").val(info_json.as[1]);
    $("#ac2_input").val(info_json.ac[1]);
    $("#ac2_if_input").val(info_json.if[3]);
    $("#ac2_ip_input").val(info_json.ip[3]);
    $("#ac2_pub_input").val(info_json.pub[1]);
  };
};

$("#service_dev").append(fastip103html);
//加载测试资源的解析数据
fastip103getList();

function fastip103setWan(value){
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

function fastip103sub(url){
  let user = $("#user_input").val();
  let time=getTime(new Date());
  let wan1 = $("#wan1_select").val();
  let wan1Type = $("#wan1_type_select").val();
  let wan1Provider = $("#wan1_provider_select").val();

  let version = $("#version_select").val();
  let lineid = $("#lineid_td").val();
  let cname = $("#cname_input").val();
  let area = $("#area_input").val();
  let oversea1dns = $("#oversea1_dns_input").val();
  let oversea2dns = $("#oversea2_dns_input").val();
  let oversea1ips = $("#pe1_oversea_input").val().split(',')[0];
  let oversea1ip1 = oversea1ips.split(',')[0].split('-')[0];
//获取主线参数
  let pe1 = $("#pe1_input").val();
  let pe1if = "tun"+$("#pe1_if_input").val().match(/[1-9]\d+/)[0];
  let pe1ips = ipNext($("#pe1_ip_input").val().split('/')[0]);
  let pe1ip1 = pe1ips[0];
  let pe1ip2 = pe1ips[1];
  let pe1lo = $("#pe1_lo_input").val();
  let ce1lo = $("#ce1_lo_input").val();

  let ac1 = $("#ac1_input").val();
  let ac1if = $("#ac1_if_input").val();
  let ac1port = ac1if.replace('vtun','');
  let ac1ips = ipNext($("#ac1_ip_input").val().split('/')[0]);
  let ac1ip1 = ac1ips[0];
  let ac1ip2 = ac1ips[1];
  let ac1remote = $("#ac1_pub_input").val();

//获取备线参数
  let pe2 = $("#pe2_input").val();
  let pe2if = "tun"+$("#pe2_if_input").val().match(/[1-9]\d+/)[0];
  let pe2ips = ipNext($("#pe2_ip_input").val().split('/')[0]);
  let pe2ip1 = pe2ips[0];
  let pe2ip2 = pe2ips[1];
  let pe2lo = $("#pe2_lo_input").val();
  let ce2lo = $("#ce2_lo_input").val();
  let ac2 = $("#ac2_input").val();
  let ac2if = $("#ac2_if_input").val();
  let ac2port = ac2if.replace('vtun','');
  let ac2ips = ipNext($("#ac2_ip_input").val().split('/')[0]);
  let ac2ip1 = ac2ips[0];
  let ac2ip2 = ac2ips[1];
  let ac2remote = $("#ac2_pub_input").html();
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

let fastip103fastipGreOverOpenvpn  =
`#Fnet MPLS with GRE Over OpenVPN Tiktok Template.
#操作人员：${user}
#时间：${time.cn}
#系统：vyui-v2
#FnetOS Version ${version}
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
set firewall name VPN2LOCAL default-action 'accept'
set firewall name VPN2LOCAL rule 1000 action 'accept'
set firewall name VPN2LOCAL rule 1000 source group network-group 'GROUP-FNET-Whitelist'
set firewall name VPN2LOCAL rule 2000 action 'drop'
set firewall name VPN2LOCAL rule 2000 destination port '179,2707,53,161,123,8899'
set firewall name VPN2LOCAL rule 2000 protocol 'tcp_udp'
set firewall name VPN2LOCAL rule 3000 action 'drop'
set firewall name VPN2LOCAL rule 3000 destination port '22,80,135,137,138,139,443,445,1080'
set firewall name VPN2LOCAL rule 3000 protocol 'tcp_udp'
set firewall name VPN2LOCAL rule 4000 action 'drop'
set firewall name VPN2LOCAL rule 4000 destination port '1723,3124,3127,3128,3389,5000,8080,31337'
set firewall name VPN2LOCAL rule 4000 protocol 'tcp_udp'
set interfaces ethernet eth0 firewall local name 'WAN2LOCAL'
set interfaces ethernet eth1 firewall local name 'WAN2LOCAL'
set interfaces tunnel ${pe1if} firewall local name 'VPN2LOCAL'
set interfaces tunnel ${pe2if} firewall local name 'VPN2LOCAL'
set system host-name ${lineid}-${cname}-${area}
set service snmp community both-win authorization 'ro'
set service smartping
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
set firewall options interface ${ac1if} adjust-mss 1300
set firewall options interface ${ac2if} adjust-mss 1300
set firewall options interface ${pe1if} adjust-mss 1300
set firewall options interface ${pe2if} adjust-mss 1300
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
set track name to-main test 10 target ${pe1ip1}
set track name to-main test 10 ttl-limit 1
set track name to-main test 10 type ping
echo '>>>静态路由配置[Static]<<<'
set protocols static route ${ac1remote}/32 next-hop 1.1.1.1
set protocols static route ${ac2remote}/32 next-hop 1.1.1.1
set protocols static route ${pe1lo}/32 next-hop ${ac1ip1}
set protocols static route ${pe2lo}/32 next-hop ${ac2ip1}
set protocols static route 0.0.0.0/0 next-hop ${pe1ip1} track to-main
set protocols static route 0.0.0.0/0 next-hop ${pe2ip1} distance 5
set protocols static route 114.113.245.99/32 next-hop ${pe1ip1}
set protocols static route 114.113.245.100/32 next-hop ${pe2ip1}
set protocols static route 192.168.55.125/32 next-hop ${pe1ip1} track to-main
set protocols static route 192.168.55.125/32 next-hop ${pe2ip1} distance 5
set protocols static route 192.168.55.250/32 next-hop ${pe1ip1} track to-main
set protocols static route 192.168.55.250/32 next-hop ${pe2ip1} distance 5
echo '>>>海外NAT<<<'
set nat source rule 1001 destination address ${oversea1dns}/32
set nat source rule 1001 outbound-interface ${pe1if}
set nat source rule 1001 translation address ${oversea1ip1}
set nat source rule 2001 destination address ${oversea1dns}/32
set nat source rule 2001 outbound-interface ${pe2if}
set nat source rule 2001 translation address ${oversea1ip1}
set nat source rule 1002 destination address ${oversea2dns}/32
set nat source rule 1002 outbound-interface ${pe1if}
set nat source rule 1002 translation address ${oversea1ip1}
set nat source rule 2002 destination address ${oversea2dns}/32
set nat source rule 2002 outbound-interface ${pe2if}
set nat source rule 2002 translation address ${oversea1ip1}
set nat source rule 1003 source address 192.168.8.0/24
set nat source rule 1003 outbound-interface ${pe1if}
set nat source rule 1003 translation address ${oversea1ip1}
set nat source rule 2003 source address 192.168.0.0/16
set nat source rule 2003 outbound-interface ${pe2if}
set nat source rule 2003 translation address ${oversea1ip1}
echo '>>>Table default 海外，DHCP指定海外DNS<<<'
delete interface eth1 address
delete interface eth2 address
set interfaces bridge br2 description lan
set interfaces bridge br2 ip address 192.168.8.1/24
set interfaces bridge br2 member interface eth1
set interfaces bridge br2 member interface eth2
set interfaces bridge br2 member interface eth3
set interfaces bridge br2 member interface eth4
set interfaces bridge br2 member interface eth5
set service dhcp-server shared-network-name dhcp_eth2 subnet 192.168.8.0/24 description 'Br_2_DHCP'
set service dhcp-server shared-network-name dhcp_eth2 subnet 192.168.8.0/24 default-router '192.168.8.1'
set service dhcp-server shared-network-name dhcp_eth2 subnet 192.168.8.0/24 lease '86400'
set service dhcp-server shared-network-name dhcp_eth2 subnet 192.168.8.0/24 name-server ${oversea1dns}
set service dhcp-server shared-network-name dhcp_eth2 subnet 192.168.8.0/24 name-server ${oversea2dns}
set service dhcp-server shared-network-name dhcp_eth2 subnet 192.168.8.0/24 range 0 start '192.168.8.2'
set service dhcp-server shared-network-name dhcp_eth2 subnet 192.168.8.0/24 range 0 stop '192.168.8.200'
echo '>>>Table 100 走英国，直播手机IP与MAC绑定，DHCP指定英国DNS<<<'
set service dhcp-server shared-network-name dhcp_eth2 subnet 192.168.8.0/24 static-mapping 201 ip-address '192.168.8.201'
set service dhcp-server shared-network-name dhcp_eth2 subnet 192.168.8.0/24 static-mapping 201 mac-address '54:05:db:b4:4a:4f'
set service dhcp-server shared-network-name dhcp_eth2 subnet 192.168.8.0/24 static-mapping 201 static-mapping-parameters 'option domain-name-servers 212.78.94.40, 158.43.128.72;'
set protocols static table 100 route 0.0.0.0/0 next-hop 英国GRE-IP
set policy local-route rule 100 set table '100'
set policy local-route rule 100 source '192.168.8.201'
echo '5G WIFI DHCP'
set interfaces wireless wlan1 address '192.168.9.1/24'
set interfaces wireless wlan1 channel '0'
set interfaces wireless wlan1 country-code 'cn'
set interfaces wireless wlan1 dhcp-options client-id 'uk-wifi'
set interfaces wireless wlan1 hw-id 'cc:d3:9d:99:ff:61'
set interfaces wireless wlan1 mode 'ac'
set interfaces wireless wlan1 physical-device 'phy0'
set interfaces wireless wlan1 security wpa mode 'wpa2'
set interfaces wireless wlan1 security wpa passphrase '123456@vpn'
set interfaces wireless wlan1 ssid 'us_wifi'
set interfaces wireless wlan1 type 'access-point'
set service dhcp-server shared-network-name dhcp_wifi subnet 192.168.9.0/24 default-router '192.168.9.1'
set service dhcp-server shared-network-name dhcp_wifi subnet 192.168.9.0/24 lease '86400'
set service dhcp-server shared-network-name dhcp_wifi subnet 192.168.9.0/24 name-server ${oversea1dns}
set service dhcp-server shared-network-name dhcp_wifi subnet 192.168.9.0/24 name-server ${oversea2dns}
set service dhcp-server shared-network-name dhcp_wifi subnet 192.168.9.0/24 range 0 start '192.168.9.2'
set service dhcp-server shared-network-name dhcp_wifi subnet 192.168.9.0/24 range 0 stop '192.168.9.200'
################
IP/环境监测
    IP当地
    AS号当地
    ISP > Business > hosting
    whoer.net 100%
    污染度 < 50%
测速：
    网站测速
    谷歌云盘上传下载测速
`;
  let filename = `${lineid}-Fast-SD-WAN-FastIP-GREOverOpenVPN-Config-${time.ez}-By-${user}`;
  let data = {};
  console.log(fastip103fastipGreOverOpenvpn);
  downloadConfig(filename, fastip103fastipGreOverOpenvpn);
  let type = 'post'
  let datatype = 'json';
  ajaxHandler(url,data,datatype,type);
};