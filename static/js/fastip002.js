/* FastIP 假组网 双运营商 */
const fastip002html = `<table border="1">
<tr>
<td>基本信息</td>
<td><textarea id="basic_textarea" rows="4" cols="21">
v=4.0
area=gz
cnameEN=fnetlink
cnameCN=XX公司</textarea></td>
</tr>
<tr>
<td title="***示例***
---自动获取【DHCP】-----
eth0=dhcp
---手动设定【Static】---
eth0=192.168.1.254/24
gw=192.168.1.1
---宽带拨号【PPPoE】----
eth0=pppoe(account,passwd)
---其他【Other】-------
br0(eth0,eth1)=
vlan1(eth0)=
wwan0=">WAN1接口</td>
<td><textarea id="wan1_textarea" rows="2" cols="21">
isp=ct
eth0=dhcp</textarea></td>
</tr>
<tr>
<td title="***示例***
---自动获取【DHCP】-----
eth1=dhcp
---手动设定【Static】---
eth1=192.168.1.254/24
gw=192.168.1.1
---宽带拨号【PPPoE】----
eth1=pppoe(account,passwd)
---其他【Other】-------
br0(eth0,eth1)=
vlan1(eth0)=
wwan0=">WAN2接口</td>
<td><textarea id="wan2_textarea" rows="2" cols="21">
isp=cm
eth1=dhcp</textarea></td>
</tr>
<tr>
<td title=
"---Ethernet---
eth2=192.168.8.1/24
---Bride------
br2(eth2,eth3,eth4,eth5)=192.168.8.1/24
---Vlanif-----
vlan1(eth2)=192.168.8.1/24
">内网LAN接口</td>
<td><textarea id="lan1_input" rows="1" cols="21">
eth2=192.168.8.1/24</textarea></td>
</tr>
<tr>
<td title= "
---关闭【OFF】---
wlan0=off
---启用【ON】----
wlan0=100.64.0.1/24
">内网WIFI</td>
<td><textarea id="wlan0_textarea" rows="1" cols="21" autocomplete="on">
wlan0=100.64.0.1/24</textarea></td>
</tr>
<tr>
<td title= "***示例***\n国内DNS：local-dns1=223.5.5.5\nlocal-dns2=223.6.6.6">本地DNS</td>
<td><textarea id="local_dns_textarea" rows="2" cols="21">dns1=223.5.5.5\ndns2=223.6.6.6</textarea></td>
<tr>
<tr>
<td title= "***示例***\n国外DNS：oversea-dns=8.8.8.8\noversea-dns2=8.8.4.4">海外DNS</td>
<td><textarea id="oversea_dns_textarea" rows="2" cols="21">dns1=8.8.8.8\ndns2=8.8.4.4</textarea></td>
</tr>
<tr>
<td title= "由输入的NOC分配资源自动整理生成，可以手动修改，避免自动识别问题">NOC分配资源</td>
<td><textarea id="resource_textarea" rows="15" cols="21"></textarea></td>
</tr>
</table>
<button type="button" onclick="fastip002sub('/config')">提交配置信息(Submit Config Info)</button>
`;

function fastip002getList() {
//空格全角分号去除
    let str = $("#config_textarea").val().replaceAll(' ','').replaceAll('：',':').replaceAll(';','');
    if(str.length>32){
    let lines = str.split(/\r?\n/);
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
let peers = (info_json.bgp[0]+","+info_json.bgp[1]).split(",");
let resource_text =
`id=${info_json.id[0]}
ac1=${info_json.pe[0]}
ac1if=${info_json.if[0]}
ac1ip=${info_json.ip[0]}
ac1pub=${info_json.pub[0]}
ac2=${info_json.pe[1]}
ac2if=${info_json.if[1]}
ac2ip=${info_json.ip[1]}
ac2pub=${info_json.pub[1]}
loip=${info_json.lo[0]}
peer1=${peers[0]}
peer2=${peers[1]}
peer3=${peers[2]}
peer4=${peers[3]}
oversea=${info_json.oversea[0]}`;
console.log(resource_text);
    $("#resource_textarea").val(resource_text);
  };
};

$("#service_dev").append(fastip002html);
//加载测试资源的解析数据
fastip002getList();

function fastip002sub(url){
  let time = getTime(new Date());
  let user = $("#user_input").val();
  let bas = $("#basic_textarea").val().split('\n');
  let src =  $("#resource_textarea").val().split('\n')
  let wan1list = $("#wan1_textarea").val().split('\n');
  let wan2list = $("#wan2_textarea").val().split('\n');
  let wan1isp = wan1list[0].split('=')[1].toUpperCase();
  let wan1 = wan1list[1].split('=')[0];
  let wan1str = wan1list[1].split('=')[1];
  let wan2isp = wan2list[0].split('=')[1].toUpperCase();
  let wan2 = wan2list[1].split('=')[0];
  let wan2str = wan2list[1].split('=')[1];

  let wlan = $("#wlan0_textarea").val().split('\n');

  let version = bas[0].split('=')[1];
  let area = bas[1].split('=')[1].toUpperCase();
  let cnameEN = bas[2].split('=')[1];
  let cnameCN = bas[3].split('=')[1];
  let wlan0ip = wlan[0].split('=')[1];

  let lineid = src[0].split('=')[1];
//获取主线参数
  let ac1 = src[1].split('=')[1];
  let ac1if = src[2].split('=')[1];
  let ac1port = ac1if.replace('vtun','');
  let ac1ips = ipNext(src[3].split('=')[1].split('/')[0]);
  let ac1ip1 = ac1ips[0];
  let ac1ip2 = ac1ips[1];
  let ac1pub = src[4].split('=')[1];
//获取备线参数
  let ac2 = src[5].split('=')[1];
  let ac2if = src[6].split('=')[1];
  let ac2port = ac2if.replace('vtun','');
  let ac2ips = ipNext(src[7].split('=')[1].split('/')[0]);
  let ac2ip1 = ac2ips[0];
  let ac2ip2 = ac2ips[1];
  let ac2pub = src[8].split('=')[1];
  let loip = src[9].split('=')[1];
  let bgp1server1 = src[10].split('=')[1];
  let bgp1server2 = src[11].split('=')[1];
  let bgp1server3 = src[12].split('=')[1];
  let bgp1server4 = src[13].split('=')[1];
  let oversea1ips = src[14].split('=')[1];
  let oversea1ip1 = oversea1ips.split(',')[0].split('-')[0];
//获取DNS
  let dnss1 = $("#local_dns_textarea").val().split('\n');
  let dnss2 = $("#oversea_dns_textarea").val().split('\n');
  let local1dns = dnss1[0].split('=')[1];
  let local2dns = dnss1[1].split('=')[1];
  let oversea1dns = dnss2[0].split('=')[1];
  let oversea2dns = dnss2[1].split('=')[1];
//差异化配置生成
  let wan1Temp = '';
  if(wan1str.includes('dhcp')){
wan1Temp += `set interfaces ethernet ${wan1} description WAN1-${wan1isp}-DHCP
set interfaces ethernet ${wan1} address dhcp
set protocols static route 1.1.1.1/32 dhcp-interface ${wan1}`;
  }else if(wan1str.includes('pppoe')){
let pppoe = wan1str.split('(')[1].split(')')[0].split(',');
let pppoe1user = pppoe[0];
let pppoe1pass = pppoe[1];
wan1Temp +=
`set interfaces ethernet ${wan1} description WAN1_${wan1isp}_${pppoe1user}/${pppoe1pass}
set interfaces ethernet ${wan1} pppoe 1 default-route 'none'
set interfaces ethernet ${wan1} pppoe 1 mtu '1472'
set interfaces ethernet ${wan1} pppoe 1 name-server 'none'
set interfaces ethernet ${wan1} pppoe 1 password ${pppoe1user}
set interfaces ethernet ${wan1} pppoe 1 user-id ${pppoe1pass}
set protocols static interface-route 1.1.1.1/32 next-hop-interface pppoe1`;
  }else{
let wan1gw = wan[2].split('=')[1]
wan1Temp += `set interfaces ethernet ${wan1} description WAN1-${wan1isp}-GW-${wan1gw}
set interfaces ethernet ${wan1} address ${wan1str}
set protocols static route 1.1.1.1/32 next-hop ${wan1gw}`;
  }

let wan2Temp = '';
  if(wan2str.includes('dhcp')){
wan2Temp += `set interfaces ethernet ${wan2} description WAN2-${wan2isp}-DHCP
set interfaces ethernet ${wan2} address dhcp
set protocols static route 1.1.1.1/32 dhcp-interface ${wan2}`;
  }else if(wan2str.includes('pppoe')){
let pppoe = wan2str.split('(')[1].split(')')[0].split(',');
let pppoe2user = pppoe[0];
let pppoe2pass = pppoe[1];
wan2Temp +=
`set interfaces ethernet ${wan2} description WAN2_${wan2isp}_${pppoe2user}/${pppoe2pass}
set interfaces ethernet ${wan2} pppoe 2 default-route 'none'
set interfaces ethernet ${wan2} pppoe 2 mtu '1472'
set interfaces ethernet ${wan2} pppoe 2 name-server 'none'
set interfaces ethernet ${wan2} pppoe 2 password ${pppoe2user}
set interfaces ethernet ${wan2} pppoe 2 user-id ${pppoe2pass}
set protocols static interface-route 1.1.1.2/32 next-hop-interface pppoe2`;
}else{
    let wan1gw = wan[2].split('=')[1]
    wan2Temp += `set interfaces ethernet ${wan1} description WAN1-${wan1isp}-GW-${wan1gw}
set interfaces ethernet ${wan1} address ${wan1ip}
set protocols static route 1.1.1.1/32 next-hop ${wan1gw}`;
}


let smartdns = '';
switch(version){
    case "4.0":
smartdns += `set epoch file-sync task 1 local '/opt/cn.txt'
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
    case "3.2":
smartdns +=`set service dns dnsmasq cache-size '9999'
set service dns dnsmasq fnetlink-dns enable
set service dns dnsmasq fnetlink-dns local-isp-dns ${local1dns}
set service dns dnsmasq fnetlink-dns local-isp-dns ${local2dns}
set service dns dnsmasq fnetlink-dns upchinadomain host '59.37.126.146'
set service dns dnsmasq listen-on ${wan1}
set service dns dnsmasq name-server ${oversea1dns}
set service dns dnsmasq name-server ${oversea2dns}`;
    break;
    case "3.1":
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

let fastip002fastipOpenvpn  =
`#Fnetlink FastIP Template.
#操作人员：${user}
#时间：${time.cn}
#系统：vyui-v1
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
set interfaces ethernet eth0 firewall local name 'WAN2LOCAL'
set interfaces ethernet eth1 firewall local name 'WAN2LOCAL'
set interfaces openvpn ${ac1if} firewall local name 'WAN2LOCAL'
set interfaces openvpn ${ac2if} firewall local name 'WAN2LOCAL'
set system host-name ${lineid}-${cnameEN}-${area}
set service smartping
set service snmp community both-win authorization 'ro'
set interfaces loopback lo address ${loip}/32
set interfaces loopback lo address ${oversea1ip1}/32
set interfaces loopback lo description ${oversea1ips}
${wan1Temp}
${wan2Temp}
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
set protocols static route ${ac1pub}/32 next-hop 1.1.1.1
set protocols static route ${ac2pub}/32 next-hop 1.1.1.2
set protocols static route 114.113.245.99/32 next-hop ${ac1ip1}
set protocols static route 114.113.245.100/32 next-hop ${ac2ip1}
set protocols static route 192.168.55.125/32 next-hop ${ac1ip1} track to-main
set protocols static route 192.168.55.125/32 next-hop ${ac2ip1} distance 5
set protocols static route 192.168.55.250/32 next-hop ${ac1ip1} track to-main
set protocols static route 192.168.55.250/32 next-hop ${ac2ip1} distance 5
set protocols static route ${bgp1server1}/32 next-hop ${ac1ip1} track 'to-main'
set protocols static route ${bgp1server1}/32 blackhole distance '5'
set protocols static route ${bgp1server2}/32 next-hop ${ac1ip1} track 'to-main'
set protocols static route ${bgp1server2}/32 blackhole distance '5'
set protocols static route ${bgp1server3}/32 next-hop ${ac2ip1}
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
set policy route-map bgp-from--RSVR2 rule 200 set ip-next-hop 1.1.1.2
set policy route-map bgp-from--RSVR2 rule 200 set local-preference '50'
set policy route-map bgp-from--RSVR2 rule 300 action 'permit'
set policy route-map bgp-from--RSVR2 rule 300 description 'to_cnc'
set policy route-map bgp-from--RSVR2 rule 300 match community community-list '82'
set policy route-map bgp-from--RSVR2 rule 300 set ip-next-hop 1.1.1.2
set policy route-map bgp-from--RSVR2 rule 300 set local-preference '50'
set policy route-map bgp-from--RSVR2 rule 400 action 'permit'
set policy route-map bgp-from--RSVR2 rule 400 description 'to_cn_other'
set policy route-map bgp-from--RSVR2 rule 400 match community community-list '83'
set policy route-map bgp-from--RSVR2 rule 400 set ip-next-hop 1.1.1.2
set policy route-map bgp-from--RSVR2 rule 400 set local-preference '50'
set protocols bgp 65000 neighbor ${bgp1server1} peer-group 'RSVR'
set protocols bgp 65000 neighbor ${bgp1server2} peer-group 'RSVR'
set protocols bgp 65000 neighbor ${bgp1server3} peer-group 'RSVR2'
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
###回程路由、WIFI、DHCP###
set protocols static route 10.0.0.0/8 next-hop 1.1.1.1
set protocols static route 172.16.0.0/12 next-hop 1.1.1.1
set protocols static route 192.168.0.0/16 next-hop 1.1.1.1
echo 'WIFI'
set interfaces wireless wlan0 address '${wlan0ip}'
set interfaces wireless wlan0 channel '0'
set interfaces wireless wlan0 country-code 'cn'
set interfaces wireless wlan0 dhcp-options client-id 'sd-wan'
set interfaces wireless wlan0 hw-id '04:f0:21:a9:8b:61'
set interfaces wireless wlan0 mode 'ac'
set interfaces wireless wlan0 physical-device 'phy0'
set interfaces wireless wlan0 security wpa mode 'wpa2'
set interfaces wireless wlan0 security wpa passphrase '123@sdwan'
set interfaces wireless wlan0 ssid 'sd-wan-wifi'
set interfaces wireless wlan0 type 'access-point'
echo 'dhcp@wifi'
set service dhcp-server shared-network-name wifi1 subnet 100.64.0.0/24 description 'WIFI_1_DHCP'
set service dhcp-server shared-network-name wifi1 subnet 100.64.0.0/24 default-router '100.64.0.1'
set service dhcp-server shared-network-name wifi1 subnet 100.64.0.0/24 lease '86400'
set service dhcp-server shared-network-name wifi1 subnet 100.64.0.0/24 name-server '100.64.0.1'
set service dhcp-server shared-network-name wifi1 subnet 100.64.0.0/24 range 0 start '100.64.0.2'
set service dhcp-server shared-network-name wifi1 subnet 100.64.0.0/24 range 0 stop '100.64.0.200'
echo 'dhcp@lan'
set service dhcp-server shared-network-name eth2dhcp subnet 192.168.8.0/24 description 'ETH_2_DHCP'
set service dhcp-server shared-network-name eth2dhcp subnet 192.168.8.0/24 default-router '192.168.8.1'
set service dhcp-server shared-network-name eth2dhcp subnet 192.168.8.0/24 lease '86400'
set service dhcp-server shared-network-name eth2dhcp subnet 192.168.8.0/24 name-server '192.168.8.1'
set service dhcp-server shared-network-name eth2dhcp subnet 192.168.8.0/24 range 0 start '192.168.8.2'
set service dhcp-server shared-network-name eth2dhcp subnet 192.168.8.0/24 range 0 stop '192.168.8.200'
echo 'nat@lan&wifi'
set nat source rule 1101 source address 192.168.0.0/16
set nat source rule 1101 outbound-interface ${ac1if}
set nat source rule 1101 translation address ${oversea1ip1}
set nat source rule 2101 source address 192.168.0.0/16
set nat source rule 2101 outbound-interface ${ac2if}
set nat source rule 2101 translation address ${oversea1ip1}
set nat source rule 1102 source address 100.64.0.0/24
set nat source rule 1102 outbound-interface ${ac1if}
set nat source rule 1102 translation address ${oversea1ip1}
set nat source rule 2102 source address 100.64.0.0/24
set nat source rule 2102 outbound-interface ${ac2if}
set nat source rule 2102 translation address ${oversea1ip1}
`;
  let filename = `${cnameCN}-Fastip-${lineid}-ConfigBy${user}-${time.ez}`;
  let data = {};
  downloadConfig(filename, fastip002fastipOpenvpn);
  let type = 'post'
  let datatype = 'json';
  ajaxHandler(url,data,datatype,type);
};