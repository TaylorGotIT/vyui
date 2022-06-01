var fastip001_version = 1;
const fastip001html = `<label for="cname_input">客户名（Company Name）：</label>
<input id="cname_input" placeholder="公司名（英文）">
<select id="area_select" ><option value="GZ">广州[ GZ ]</option>
<option value="SZ">深圳[ SZ ]</option>
<option value="BJ">北京[ BJ ]</option>
<option value="SH">上海[ SH ]</option>
<option value="SU">苏州[ SU ]</option>
<option value="WH">武汉[ WH ]</option></select><br>
<label for="cid_select">CID：</label>
<select id="cid_select"></select><br><br>
<label for="wan1type_select">WAN1 Type: </label>
<select id="wan1type_select" onchange="fastip001setWan1type(this.value)">
<option default="dhcp">下拉选择[ WAN1 Type ]</option>
<option value="dhcp">自动获取[ DHCP ]</option>
<option value="static">静态[ Static ]</option>
<option value="pppoe">宽带拨号[ PPPoe ]</option>
<option value="bridge">桥接[ Bridge ]</option></select><br>
<p>FastIP单机旁挂单网模板表[fastip001]</p>
<input type="text" name="wan1" maxlength="64" id="wan1ip_input" placeholder="ETH0 IP Address">
<input type="text" name="wan1" maxlength="64" id="wan1gw_input" placeholder="ETH0 Gateway"><br>
<label for="pe1_select">PE_Main：</label>
<select id="pe1_select"></select><br>
<label for="pe1_if_select">PE_Main_Interface：</label>
<select id="pe1_if_select"></select><br>
<label for="pe1_ip_select">PE_Main_IP：</label>
<select id="pe1_ip_select"></select><br>
<label for="pe1_lo_select">PE_Main_Remote_IP：</label>
<select id="pe1_lo_select"></select><br>

<label for="ac1_select">AC_Main：</label>
<select id="ac1_select"></select><br>
<label for="ac1_if_select">AC_Main_Interface：</label>
<select id="ac1_if_select"></select><br>
<label for="ac1_ip_select">AC_Main_IP：</label>
<select id="ac1_ip_select"></select><br>
<label for="ac1_remote_select">AC_Main_Remote_IP：</label>
<select id="ac1_remote_select"></select><br><br>

<label for="pe2_select">PE_Backup：</label>
<select id="pe2_select"></select><br>
<label for="pe2_if_select">PE_Backup_Interface：</label>
<select id="pe2_if_select"></select><br>
<label for="pe2_ip_select">PE_Backup_IP：</label>
<select id="pe2_ip_select"></select><br>
<label for="pe2_lo_select">PE_Backup_Remote_IP：</label>
<select id="pe2_lo_select"></select><br>

<label for="ac2_select">AC_Backup：</label>
<select id="ac2_select"></select><br>
<label for="ac2_if_select">AC_Backup_Interface：</label>
<select id="ac2_if_select"></select><br>
<label for="ac2_ip_select">AC_Backup_IP：</label>
<select id="ac2_ip_select"></select><br>
<label for="ac2_remote_select">AC_Backup_Remote_IP：</label>
<select id="ac2_remote_select"></select><br><br>
<button type="button" onclick="fastip001sub('/config')">提交配置信息(Submit Config Info)</button>
`;
$("#service_dev").append(fastip001html);

function fastip001setWan1type(value){
    switch(value){
        case "dhcp":
            console.log(value);
            break;
        case "static":
            console.log(value);
            break;
        case "pppoe":
            console.log(value);
            break;
        case "bridge":
            console.log(value);
            break;
    }
};

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
  let cid = $("#cid_select").val();

  let ac1 = $("#ac1_select").val();
  let ac1if = $("#ac1_if_select").val();
  let ac1port = ac1if.replace('vtun','');
  let ac1ips = ipNext($("#ac1_ip_select").val().split('/')[0]);
  let ac1ip1 = ac1ips[0];
  let ac1ip2 = ac1ips[1];
  let ac1remote = $("#ac1_remote_select").val();

  let ac2 = $("#ac2_select").val();
  let ac2if = $("#ac2_if_select").val();
  let ac2port = ac2if.replace('vtun','');
  let ac2ips = ipNext($("#ac2_ip_select").val().split('/')[0]);
  let ac2ip1 = ac2ips[0];
  let ac2ip2 = ac2ips[1];
  let ac2remote = $("#ac2_remote_select").val();

  let pe1 = $("#pe1_select").val();
  let pe1if = $("#pe1_if_select").val();
  let pe1ifNum = pe1if.match(/[1-9]\d+/)[0];
  let pe1ips = ipNext($("#pe1_ip_select").val().split('/')[0]);
  let pe1ip1 = pe1ips[0];
  let pe1ip2 = pe1ips[1];
  let pe1lo = $("#pe1_lo_select").val();

  let pe2 = $("#pe2_select").val();
  let pe2if = $("#pe2_if_select").val();
  let pe2ifNum = pe2if.match(/[1-9]\d+/)[0];
  let pe2ips = ipNext($("#pe2_ip_select").val().split('/')[0]);
  let pe2ip1 = pe2ips[0];
  let pe2ip2 = pe2ips[1];
  let pe2lo = $("#pe2_lo_select").val();

let fastip001fastipGreOverOpenvpn  =
`#Fnet MPLS with GRE Over OpenVPN Template.
#操作人员：${user}
#时间：${time.cn}
#系统：vyui-v1
#vyos version >= 4.0
+++++++++++++++++++++++++++++++++++++++++++
echo '基础配置[系统名称，物理接口]'
set system host-name ${cid}-${cname}-${area}
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
  let filename = `Fast-SD-WAN-FastIP-GREOverOpenVPN-Config-${time.ez}-By-${user}`;
  let data = {};
  console.log(fastip001fastipGreOverOpenvpn);
  downloadConfig(filename, fastip001fastipGreOverOpenvpn);
  let type = 'post'
  let datatype = 'json';
  ajaxHandler(url,data,datatype,type);
};