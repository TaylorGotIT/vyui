/* FastIP 假组网 双运营商 */
const fastip101html = `<table border="1">
<tr><td><select id="wan1_select">
<option value="eth0" selected="selected">WAN1-ETH0</option>
<option value="eth1">WAN1-ETH1</option>
<option value="br0">WAN1-BR0</option>
<option value="br1">WAN1-BR1</option></select>
<select id="wan1_provider_select">
<option value="CT" selected="selected">电信[CT]</option>
<option value="CU">联通[CU]</option>
<option value="CM">移动[CM]</option></select></td>
<td><select id="wan1_type_select" onchange=fastip101setWan(this.id,this.value)>
<option value="dhcp" selected="selected">WAN Type[ DHCP ]</option>
<option value="static">WAN Type[ Static ]</option>
<option value="pppoe">WAN Type[ PPPoE ]</option></select></td></tr>
<tr id="wan1_input_tr"></tr>
<tr><td><input id="bgp_server1_input" value="10.10.99.200"></td>
<td><input id="bgp_server2_input" value="10.10.99.202"></td></tr>
<tr><td><input id="bgp_server3_input" value="10.10.99.201"></td>
<td><input id="bgp_server4_input" value="10.10.99.203"></td></tr>
<tr><td id="line1_id_td"></td><td id="line2_id_td"></td></tr>
<tr><td id="pe1_td"></td><td id="pe2_td"></td></tr>
<tr><td id="pe1_if_td"></td><td id="pe2_if_td"></td></tr>
<tr><td id="pe1_ip_td"></td><td id="pe2_ip_td"></td></tr>
<tr><td id="pe1_lo_td"></td><td id="pe2_lo_td"></td></tr>
<tr><td id="ce1_lo_td"></td><td id="ce2_lo_td"></td></tr>
<tr><td id="pe1_as_td"></td><td id="pe2_as_td"></td></tr>
<tr><td id="pe1_oversea_td"></td><td id="pe2_oversea_td"></td></tr>
<tr><td id="ac1_td"></td><td id="ac2_td"></td></tr>
<tr><td id="ac1_if_td"></td><td id="ac2_if_td"></td></tr>
<tr><td id="ac1_ip_td"></td><td id="ac2_ip_td"></td></tr>
<tr><td id="ac1_pub_td"></td><td id="ac2_pub_td"></td></tr>
</table>
<button type="button" onclick="fastip101sub('/config')">提交配置信息(Submit Config Info)</button>
`;

function fastip101getList() {
//空格全角分号去除
    let str = $("#config_textarea").val().replaceAll(' ','').replaceAll('：',':');
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
                    if(l1.search('.')!=-1){
                        info_json.oversea.push(l1);
                    }else{
                        info_json.other.push(l1);
                    }

            };
        }
    };
    console.log(info_json);
    $("#lineid_td").append(info_json.id[0]);
    $("#line1_id_td").append(info_json.id[0]);
    $("#line2_id_td").append(info_json.id[1]);
    $("#pe1_td").append(info_json.pe[0]);
    $("#pe1_if_td").append(info_json.if[0]);
    $("#pe1_ip_td").append(info_json.ip[0]);
    $("#pe1_lo_td").append(info_json.lo[0]);
    $("#ce1_lo_td").append(info_json.lo[1]);
    $("#pe1_oversea_td").append(info_json.oversea[1]);
    $("#pe1_as_td").append(info_json.as[1]);
    $("#ac1_td").append(info_json.ac[0]);
    $("#ac1_if_td").append(info_json.if[1]);
    $("#ac1_ip_td").append(info_json.ip[1]);
    $("#ac1_pub_td").append(info_json.pub[0]);
    $("#ac1_oversea_td").append(info_json.oversea[0]);

    $("#pe2_td").append(info_json.pe[1]);
    $("#pe2_if_td").append(info_json.if[2]);
    $("#pe2_ip_td").append(info_json.ip[2]);
    $("#pe2_lo_td").append(info_json.lo[2]);
    $("#ce2_lo_td").append(info_json.lo[3]);
    $("#pe2_oversea_td").append(info_json.oversea[1]);
    $("#pe2_as_td").append(info_json.as[1]);
    $("#ac2_td").append(info_json.ac[1]);
    $("#ac2_if_td").append(info_json.if[3]);
    $("#ac2_ip_td").append(info_json.ip[3]);
    $("#ac2_pub_td").append(info_json.pub[1]);

  };
};

$("#service_dev").append(fastip101html);
//加载测试资源的解析数据
fastip101getList();

function fastip101setWan(id,value){
    let html='';

    wan_input_id = '#'+id.split('_')[0] + '_input_tr';
    wan_gw_id = '#'+id.split('_')[0] + '_gw_tr';
    console.log(wan_input_id);
    switch(value){
        case "dhcp":
            $(wan_input_id).empty();
        break;
        case "static":
            $(wan_input_id).empty();
            $(wan_input_id).append(`<td><input id=wan_input_id placeholder="IP[x.x.x.x/x]"></td>
            <td><input id="wan1_gw_input" placeholder="GW[x.x.x.x]"></td>`);
        break;
        case "pppoe":
            $(wan_input_id).empty();
            $(wan_input_id).append(`<td><input id="pppoe1_user_input" placeholder="PPPoE[x.163.gd]"></td>
            <td><input id="pppoe1_pass_input" placeholder="PPPoE[******]"></td>`);
        break;
    };

}

function fastip101sub(url){
  let user = $("#user_input").val();
  let time=getTime(new Date());
  let wan1 = $("#wan1_select").val();
  let wan1Type = $("#wan1_type_select").val();
  let wan1Provider = $("#wan1_provider_select").val();
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
  let cname = $("#cname_input").val();
  let area = $("#area_select").val();
  let line1id = $("#line1_id_td").html();
  let cid = line1id.substr(0,6);
  let lineid = line1id.substr(0,7);
  let bgp1server1 = $("#bgp_server1_input").val();
  let bgp1server2 = $("#bgp_server2_input").val();
  let bgp1server3 = $("#bgp_server3_input").val();
  let bgp1server4 = $("#bgp_server4_input").val();

//获取主线参数
  let pe1 = $("#pe1_td").html();
  let pe1if = $("#pe1_if_td").html();
  let pe1ifNum = pe1if.match(/[1-9]\d+/)[0];
  let pe1ips = ipNext($("#pe1_ip_td").html().split('/')[0]);
  let pe1ip1 = pe1ips[0];
  let pe1ip2 = pe1ips[1];
  let pe1lo = $("#pe1_lo_td").html();
  let ce1lo = $("#ce1_lo_td").html();

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
  let pe2ips = ipNext($("#pe2_ip_td").html().split('/')[0]);
  let pe2ip1 = pe2ips[0];
  let pe2ip2 = pe2ips[1];
  let pe2lo = $("#pe2_lo_td").html();
  let ce2lo = $("#ce2_lo_td").html();
  let ac2 = $("#ac2_td").html();
  let ac2if = $("#ac2_if_td").html();
  let ac2port = ac2if.replace('vtun','');
  let ac2ips = ipNext($("#ac2_ip_td").html().split('/')[0]);
  let ac2ip1 = ac2ips[0];
  let ac2ip2 = ac2ips[1];
  let ac2remote = $("#ac2_pub_td").html();

let fastip101fastipGreOverOpenvpn  =
`#Fnet MPLS with GRE Over OpenVPN Template.
#操作人员：${user}
#时间：${time.cn}
#系统：vyui-v1
#vyos version >= 4.0
+++++++++++++++++++++++++++++++++++++++++++
echo '基础配置[系统名称，物理接口]'
set system host-name ${lineid}-${cname}-${area}
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
set interfaces tunnel tun${pe1ifNum} description PE1_${pe1if}
set interfaces tunnel tun${pe1ifNum} address ${pe1ip2}/30
#[v3.2]set interfaces tunnel tun${pe1ifNum} local-ip ${ac1ip2}
#[v3.2]set interfaces tunnel tun${pe1ifNum} remote-ip ${pe1lo}
set interfaces tunnel tun${pe1ifNum} source-address ${ac1ip2}
set interfaces tunnel tun${pe1ifNum} remote ${pe1lo}
set interfaces tunnel tun${pe1ifNum} encapsulation gre
set interfaces tunnel tun${pe1ifNum} multicast disable
set interfaces tunnel tun${pe1ifNum} parameters ip ttl 255
echo '>>>GRE 配置[Backup]<<<'
set interfaces tunnel tun${pe2ifNum} description PE2_${pe2if}
set interfaces tunnel tun${pe2ifNum} address ${pe2ip2}/30
#[v3.2]set interfaces tunnel tun${pe2ifNum} local-ip ${ac2ip2}
#[v3.2]set interfaces tunnel tun${pe2ifNum} remote-ip ${pe2lo}
set interfaces tunnel tun${pe2ifNum} source-address ${ac2ip2}
set interfaces tunnel tun${pe2ifNum} remote ${pe2lo}
set interfaces tunnel tun${pe2ifNum} encapsulation gre
set interfaces tunnel tun${pe2ifNum} multicast disable
set interfaces tunnel tun${pe2ifNum} parameters ip ttl 255
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
set protocols static route ${ac1remote}/32 next-hop ${ac1ip1}
set protocols static route ${ac2remote}/32 next-hop 1.1.1.1
set protocols static route 114.113.245.99/32 next-hop ${ac1ip1}
set protocols static route 114.113.245.100/32 next-hop ${ac2ip1}
set protocols static route 192.168.55.125/32 next-hop ${ac1ip1} track to-main
set protocols static route 192.168.55.125/32 next-hop ${ac2ip1} distance 5
set protocols static route 192.168.55.250/32 next-hop ${ac1ip1} track to-main
set protocols static route 192.168.55.250/32 next-hop ${ac2ip1} distance 5
echo '>>>动态路由配置[BGP]<<<'
set protocols static route ${bgp1server1}/32 next-hop ${ac1ip1} track 'to-main'
set protocols static route ${bgp1server1}/32 blackhole distance '5'
set protocols static route ${bgp1server3}/32 next-hop ${ac1ip1} track 'to-main'
set protocols static route ${bgp1server3}/32 blackhole distance '5'
set protocols static route ${bgp1server2}/32 next-hop ${ac2ip1}
set protocols static route ${bgp1server4}/32 next-hop ${ac2ip1}
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
set policy community-list 88 rule 10 action 'permit'
set policy community-list 88 rule 10 description 'to_google'
set policy community-list 88 rule 10 regex '65000:9008'
set policy community-list 91 rule 10 action 'permit'
set policy community-list 91 rule 10 description 'to_Microsoft'
set policy community-list 91 rule 10 regex '65000:9009'
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
set policy route-map bgp-from--RSVR rule 500 action 'permit'
set policy route-map bgp-from--RSVR rule 500 description 'to_Microsoft'
set policy route-map bgp-from--RSVR rule 500 match community community-list '91'
set policy route-map bgp-from--RSVR rule 500 set ip-next-hop 1.1.1.1
#
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
set policy route-map bgp-from--RSVR2 rule 500 action 'permit'
set policy route-map bgp-from--RSVR2 rule 500 description 'to_Microsoft'
set policy route-map bgp-from--RSVR2 rule 500 match community community-list '91'
set policy route-map bgp-from--RSVR2 rule 500 set ip-next-hop 1.1.1.1
set policy route-map bgp-from--RSVR2 rule 500 set local-preference '50'
#
set protocols bgp 65000 neighbor ${bgp1server1} peer-group 'RSVR'
set protocols bgp 65000 neighbor ${bgp1server3} peer-group 'RSVR'
set protocols bgp 65000 neighbor ${bgp1server2} peer-group 'RSVR2'
set protocols bgp 65000 neighbor ${bgp1server4} peer-group 'RSVR2'
set protocols bgp 65000 parameters router-id 10.30.140.14
set protocols bgp 65000 peer-group RSVR address-family ipv4-unicast route-map import 'bgp-from--RSVR'
set protocols bgp 65000 peer-group RSVR address-family ipv4-unicast soft-reconfiguration inbound
set protocols bgp 65000 peer-group RSVR remote-as '65000'
set protocols bgp 65000 peer-group RSVR update-source ${ac1ip1}
set protocols bgp 65000 peer-group RSVR2 address-family ipv4-unicast route-map import 'bgp-from--RSVR2'
set protocols bgp 65000 peer-group RSVR2 address-family ipv4-unicast soft-reconfiguration inbound
set protocols bgp 65000 peer-group RSVR2 remote-as '65000'
set protocols bgp 65000 peer-group RSVR2 update-source ${ac2ip1}
set protocols bgp 65000 timers holdtime '15'
set protocols bgp 65000 timers keepalive '60'
echo '>>>DNS配置<<<'
set epoch file-sync task 1 local '/run/cn.txt'
set epoch file-sync task 1 remote 'http://59.37.126.146:1909/f32x/domainlist/cn_domainlist.last'
set epoch file-sync task 2 local '/run/oversea.txt'
set epoch file-sync task 2 remote 'http://59.37.126.146:1909/f32x/domainlist/oversea_domainlist.last'
set service dns forwarding allow-from '0.0.0.0/0'
set service dns forwarding cache-size '10000'
set service dns forwarding dnssec 'off'
set service dns forwarding domainlist CN file '/opt/cn.txt'
set service dns forwarding domainlist CN recursion-desired
set service dns forwarding domainlist CN server '223.5.5.5'
set service dns forwarding domainlist CN server '223.6.6.6'
set service dns forwarding domainlist CN server '114.114.114.114'
set service dns forwarding domainlist HK file '/opt/oversea.txt'
set service dns forwarding domainlist HK recursion-desired
set service dns forwarding domainlist HK server '8.8.8.8'
set service dns forwarding domainlist HK server '8.8.4.4'
set service dns forwarding listen-address '0.0.0.0'
set service dns forwarding name-server '8.8.8.8'
set service dns forwarding name-server '208.67.222.222'
set service smartping
set service snmp community both-win authorization 'ro'
set service ssh disable-host-validation
set service ssh port '2707'
set system name-server '127.0.0.1'
set system ntp server 192.168.55.250
set system ntp server 202.104.174.178
set system time-zone 'Asia/Hong_Kong'
echo '>>>本地NAT配置<<<'
set nat destination rule 50 destination port '53'
set nat destination rule 50 inbound-interface 'br1'
set nat destination rule 50 protocol 'tcp_udp'
set nat destination rule 50 translation address '112.91.84.107'
set nat source rule 50 outbound-interface 'br1'
set nat source rule 50 source address '100.64.1.0/24'
set nat source rule 50 translation address 'masquerade'
echo '>>>外网NAT配置<<<'
set nat source rule 1000 destination address '8.8.8.8/32'
set nat source rule 1000 outbound-interface 'vtun1000'
set nat source rule 1000 translation address '100.72.1.56'
set nat source rule 2000 destination address '8.8.8.8/32'
set nat source rule 2000 outbound-interface 'vtun2000'
set nat source rule 2000 translation address '100.72.1.56'
#
set nat source rule 1001 destination address '8.8.4.4/32'
set nat source rule 1001 outbound-interface 'vtun1000'
set nat source rule 1001 translation address '100.72.1.56'
set nat source rule 2001 destination address '8.8.4.4/32'
set nat source rule 2001 outbound-interface 'vtun2000'
set nat source rule 2001 translation address '100.72.1.56'
#
set nat source rule 1002 destination address '208.67.222.222/32'
set nat source rule 1002 outbound-interface 'vtun1000'
set nat source rule 1002 translation address '100.72.1.56'
set nat source rule 2002 destination address '208.67.222.222/32'
set nat source rule 2002 outbound-interface 'vtun2000'
set nat source rule 2002 translation address '100.72.1.56'
#
set nat source rule 1003 outbound-interface 'vtun1000'
set nat source rule 1003 source address '112.91.84.104/29'
set nat source rule 1003 translation address '100.72.1.56'
set nat source rule 2003 outbound-interface 'vtun2000'
set nat source rule 2003 source address '112.91.84.104/29'
set nat source rule 2003 translation address '100.72.1.56'
`;
  let filename = `${lineid}-Fast-SD-WAN-FastIP-GREOverOpenVPN-Config-${time.ez}-By-${user}`;
  let data = {};
  console.log(fastip101fastipGreOverOpenvpn);
  downloadConfig(filename, fastip101fastipGreOverOpenvpn);
  let type = 'post'
  let datatype = 'json';
  ajaxHandler(url,data,datatype,type);
};