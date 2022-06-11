/* FastIP 假组网 单运营商 */
const fastip001html = `<table border="1">
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
<tr><td></td>
<td id="lineid_td"></td></tr>
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
  let area = $("#area_input").val();
  let lineid = $("#lineid_td").html();
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

let fastip001fastipGreOverOpenvpn  =
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
echo '>>>动态路由配置[BGP]<<<'
set protocols static route ${bgp1server1}/32 next-hop ${ac1ip1} track 'to-main'
set protocols static route ${bgp1server1}/32 blackhole distance '5'
set protocols static route ${bgp1server3}/32 next-hop ${ac1ip1} track 'to-main'
set protocols static route ${bgp1server3}/32 blackhole distance '5'
set protocols static route ${bgp1server2}/32 next-hop ${ac2ip1}
set protocols static route ${bgp1server4}/32 next-hop ${ac2ip1}
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
set policy community-list 85 rule 10 action 'permit'
set policy community-list 85 rule 10 description 'to_deny'
set policy community-list 85 rule 10 regex '65000:9807'
#
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
`;
  let filename = `${lineid}-Fast-SD-WAN-FastIP-GREOverOpenVPN-Config-${time.ez}-By-${user}`;
  let data = {};
  console.log(fastip001fastipGreOverOpenvpn);
  downloadConfig(filename, fastip001fastipGreOverOpenvpn);
  let type = 'post'
  let datatype = 'json';
  ajaxHandler(url,data,datatype,type);
};