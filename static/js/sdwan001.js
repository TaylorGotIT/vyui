const sdwan001html = `<label for="pe1_select">PE_Main：</label>
<select id="pe1_select"></select><br>
<label for="pe1_if_select">PE_Main_Interface：</label>
<select id="pe1_if_select"></select><br>
<label for="pe1_ip_select">PE_Main_IP：</label>
<select id="pe1_ip_select"></select><br>
<label for="pe1_remote_select">PE_Main_Remote_IP：</label>
<select id="pe1_remote_select"></select><br>
<label for="pe1_local_as_select">PE1_Local_AS：</label>
<select id="pe1_local_as_select"></select><br>
<label for="pe1_remote_as_select">PE1_Remote_AS：</label>
<select id="pe1_remote_as_select"></select><br><br>

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
<label for="pe2_remote_select">PE_Backup_Remote_IP：</label>
<select id="pe2_remote_select"></select><br>
<label for="pe2_local_as_select">PE2_Local_AS：</label>
<select id="pe2_local_as_select"></select><br>
<label for="pe2_remote_as_select">PE2_Remote_AS：</label>
<select id="pe2_remote_as_select"></select><br><br>

<label for="ac2_select">AC_Backup：</label>
<select id="ac2_select"></select><br>
<label for="ac2_if_select">AC_Backup_Interface：</label>
<select id="ac2_if_select"></select><br>
<label for="ac2_ip_select">AC_Backup_IP：</label>
<select id="ac2_ip_select"></select><br>
<label for="ac2_remote_select">AC_Backup_Remote_IP：</label>
<select id="ac2_remote_select"></select><br><br>
<button type="button" onclick="sdwan001sub('/config')">提交配置信息(Submit Config Info)</button>
`;
function sdwan001sub(url){
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
  let pe1remote = $("#pe1_remote_select").val();
  let pe1localAs = $("#pe1_local_as_select").val();
  let pe1remoteAs = $("#pe1_remote_as_select").val();

  let pe2 = $("#pe2_select").val();
  let pe2if = $("#pe2_if_select").val();
  let pe2ifNum = pe2if.match(/[1-9]\d+/)[0];
  let pe2ips = ipNext($("#pe2_ip_select").val().split('/')[0]);
  let pe2ip1 = pe2ips[0];
  let pe2ip2 = pe2ips[1];
  let pe2remote = $("#pe2_remote_select").val();
  let pe2localAs = $("#pe2_local_as_select").val();
  let pe2remoteAs = $("#pe2_remote_as_select").val();

  let mplsGreOverOpenvpn  =
`#Fnet MPLS with GRE Over Ipsec Template.
#${user}
#${time}
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
    print("\r\n err_desp:%s" % (err_desp))
    result, n11, n21 = ops.cli.execute(handle, "system-view")
    result, n11, n21 = ops.cli.execute(handle, "ip vpn-instance underlay_ipsec")
    result, n11, n21 = ops.cli.execute(handle, "ipv4-family")
    result, n11, n21 = ops.cli.execute(handle, "quit")
    result, n11, n21 = ops.cli.execute(handle, "quit")
    result, n11, n21 = ops.cli.execute(handle, "acl number 3333")
    result, n11, n21 = ops.cli.execute(handle, "rule 1 permit ip vpn-instance underlay_ipsec source 10.20.234.10 0 destination 10.20.234.242 0")
    result, n11, n21 = ops.cli.execute(handle, "acl number 3334")
    result, n11, n21 = ops.cli.execute(handle, "rule 1 permit ip vpn-instance underlay_ipsec source 10.30.254.154 0 destination 10.30.255.252 0")
    result, n11, n21 = ops.cli.execute(handle, "acl number 3999")
    result, n11, n21 = ops.cli.execute(handle, "rule 10 permit ip source 100.64.0.0 0.0.255.255")
    result, n11, n21 = ops.cli.execute(handle, "rule 20 permit ip source 100.65.0.0 0.0.255.255")
    result, n11, n21 = ops.cli.execute(handle, "rule 30 permit ip source 192.168.0.0 0.0.255.255")
    result, n11, n21 = ops.cli.execute(handle, "quit")
    result, n11, n21 = ops.cli.execute(handle, "ipsec proposal ipsectran1")
    result, n11, n21 = ops.cli.execute(handle, "esp authentication-algorithm sha1")
    result, n11, n21 = ops.cli.execute(handle, "esp encryption-algorithm 3des")
    result, n11, n21 = ops.cli.execute(handle, "ipsec proposal sdwan-proposal")
    result, n11, n21 = ops.cli.execute(handle, "esp authentication-algorithm sha2-256")
    result, n11, n21 = ops.cli.execute(handle, "esp encryption-algorithm aes-")
    result, n11, n21 = ops.cli.execute(handle, "ike proposal default")
    result, n11, n21 = ops.cli.execute(handle, "encryption-algorithm aes-256 aes-192 aes-128")
    result, n11, n21 = ops.cli.execute(handle, "dh group14")
    result, n11, n21 = ops.cli.execute(handle, "authentication-algorithm sha2-512 sha2-384 sha2-256")
    result, n11, n21 = ops.cli.execute(handle, "authentication-method pre-share")
    result, n11, n21 = ops.cli.execute(handle, "integrity-algorithm hmac-sha2-256")
    result, n11, n21 = ops.cli.execute(handle, "prf hmac-sha2-256")
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
    result, n11, n21 = ops.cli.execute(handle, "pre-shared-key cipher ${pe1pk}")
    result, n11, n21 = ops.cli.execute(handle, "ike-proposal 10")
    result, n11, n21 = ops.cli.execute(handle, "dpd retransmit-interval 30")
    result, n11, n21 = ops.cli.execute(handle, "dpd packet receive if-related enable")
    result, n11, n21 = ops.cli.execute(handle, "remote-address vpn-instance underlay_ipsec ${pe1remote}")
    result, n11, n21 = ops.cli.execute(handle, "rsa encryption-padding oaep")
    result, n11, n21 = ops.cli.execute(handle, "rsa signature-padding pss")
    result, n11, n21 = ops.cli.execute(handle, "undo local-id-preference certificate enable")
    result, n11, n21 = ops.cli.execute(handle, "ikev2 authentication sign-hash sha2-256")
    result, n11, n21 = ops.cli.execute(handle, "ike peer backup")
    result, n11, n21 = ops.cli.execute(handle, "undo version 2")
    result, n11, n21 = ops.cli.execute(handle, "pre-shared-key cipher ${pe2pk}")
    result, n11, n21 = ops.cli.execute(handle, "ike-proposal 10")
    result, n11, n21 = ops.cli.execute(handle, "dpd retransmit-interval 30")
    result, n11, n21 = ops.cli.execute(handle, "dpd packet receive if-related enable")
    result, n11, n21 = ops.cli.execute(handle, "remote-address vpn-instance underlay_ipsec ${pe2remote}")
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
    result, n11, n21 = ops.cli.execute(handle, "interface ${loop1if1}")
    result, n11, n21 = ops.cli.execute(handle, "undo portswitch")
    result, n11, n21 = ops.cli.execute(handle, "interface ${loop1if1}.100")
    result, n11, n21 = ops.cli.execute(handle, "description to-lan1")
    result, n11, n21 = ops.cli.execute(handle, "dot1q termination vid 100")
    result, n11, n21 = ops.cli.execute(handle, "ip binding vpn-instance underlay_ipsec")
    result, n11, n21 = ops.cli.execute(handle, "ip address 100.64.0.165 255.255.255.252")
    result, n11, n21 = ops.cli.execute(handle, "interface ${loop1if1}.200")
    result, n11, n21 = ops.cli.execute(handle, "description to-lan2")
    result, n11, n21 = ops.cli.execute(handle, "dot1q termination vid 200")
    result, n11, n21 = ops.cli.execute(handle, "ip binding vpn-instance underlay_ipsec")
    result, n11, n21 = ops.cli.execute(handle, "ip address ${loop1if1ip} 30")
    result, n11, n21 = ops.cli.execute(handle, "interface ${wan1}")
    result, n11, n21 = ops.cli.execute(handle, "description to-wan1")
    result, n11, n21 = ops.cli.execute(handle, "ip binding vpn-instance underlay_ipsec")
    result, n11, n21 = ops.cli.execute(handle, "ip address ${wan1ip} ${wan1mask}")
    result, n11, n21 = ops.cli.execute(handle, "tcp adjust-mss 1200")
    result, n11, n21 = ops.cli.execute(handle, "nat outbound 3999 ")
    result, n11, n21 = ops.cli.execute(handle, "ipsec policy S2S-IPSEC")
    # lo1 lo2
    result, n11, n21 = ops.cli.execute(handle, "interface LoopBack1")
    result, n11, n21 = ops.cli.execute(handle, "ip binding vpn-instance underlay_ipsec")
    result, n11, n21 = ops.cli.execute(handle, "ip address 10.20.234.10 255.255.255.255")
    result, n11, n21 = ops.cli.execute(handle, "interface LoopBack2")
    result, n11, n21 = ops.cli.execute(handle, "ip binding vpn-instance underlay_ipsec")
    result, n11, n21 = ops.cli.execute(handle, "ip address 10.30.254.154 255.255.255.255")
    # tun1 tun2
    result, n11, n21 = ops.cli.execute(handle, "interface Tunnel0/0/1000")
    result, n11, n21 = ops.cli.execute(handle, "description 'pri to ${pe1} Tunnel0/0/${pe1if} by ${wan1}'")
    result, n11, n21 = ops.cli.execute(handle, "ip binding vpn-instance underlay_ipsec")
    result, n11, n21 = ops.cli.execute(handle, "tcp adjust-mss 1300")
    result, n11, n21 = ops.cli.execute(handle, "ip address ${pe1ip2} 255.255.255.252")
    result, n11, n21 = ops.cli.execute(handle, "tunnel-protocol gre")
    result, n11, n21 = ops.cli.execute(handle, "source LoopBack1")
    result, n11, n21 = ops.cli.execute(handle, "destination vpn-instance underlay_ipsec ${pe1lo}")
    result, n11, n21 = ops.cli.execute(handle, "interface Tunnel0/0/1001")
    result, n11, n21 = ops.cli.execute(handle, "description 'pri to wha-upebk1 Tunnel0/0/${pe2if} by ${wan1}'")
    result, n11, n21 = ops.cli.execute(handle, "ip binding vpn-instance underlay_ipsec")
    result, n11, n21 = ops.cli.execute(handle, "tcp adjust-mss 1300")
    result, n11, n21 = ops.cli.execute(handle, "ip address ${pe2ip2} 30")
    result, n11, n21 = ops.cli.execute(handle, "tunnel-protocol gre")
    result, n11, n21 = ops.cli.execute(handle, "source LoopBack2")
    result, n11, n21 = ops.cli.execute(handle, "destination vpn-instance underlay_ipsec ${pe2lo}")
    result, n11, n21 = ops.cli.execute(handle, "quit")
    # nqa
    result, n11, n21 = ops.cli.execute(handle, "nqa test-instance pri pri")
    result, n11, n21 = ops.cli.execute(handle, "test-type icmp")
    result, n11, n21 = ops.cli.execute(handle, "destination-address ipv4 10.30.74.69")
    result, n11, n21 = ops.cli.execute(handle, "source-address ipv4 10.30.74.70")
    result, n11, n21 = ops.cli.execute(handle, "frequency 30")
    result, n11, n21 = ops.cli.execute(handle, "probe-count 6")
    result, n11, n21 = ops.cli.execute(handle, "vpn-instance underlay_ipsec")
    result, n11, n21 = ops.cli.execute(handle, "start now")
    result, n11, n21 = ops.cli.execute(handle, "quit")
    # static route
    result, n11, n21 = ops.cli.execute(handle, "ip route-static vpn-instance underlay_ipsec 0.0.0.0 0.0.0.0 122.227.248.145 preference 222")
    result, n11, n21 = ops.cli.execute(handle, "ip route-static vpn-instance underlay_ipsec 10.30.255.252 255.255.255.255 122.227.248.145")
    result, n11, n21 = ops.cli.execute(handle, "ip route-static vpn-instance underlay_ipsec 116.211.87.68 255.255.255.255 122.227.248.145")
    result, n11, n21 = ops.cli.execute(handle, "ip route-static vpn-instance underlay_ipsec 10.20.234.242 255.255.255.255 122.227.248.145")
    result, n11, n21 = ops.cli.execute(handle, "ip route-static vpn-instance underlay_ipsec 122.227.241.244 255.255.255.255 122.227.248.145")
    result, n11, n21 = ops.cli.execute(handle, "ip route-static vpn-instance underlay_ipsec 100.64.0.0 24 10.30.74.69")
    result, n11, n21 = ops.cli.execute(handle, "ip route-static vpn-instance underlay_ipsec 100.65.0.0 24 10.40.53.117")
    result, n11, n21 = ops.cli.execute(handle, "ip route-static vpn-instance underlay_ipsec 192.168.76.0 255.255.255.0 100.64.0.166")
    result, n11, n21 = ops.cli.execute(handle, "ip route-static vpn-instance underlay_ipsec 114.113.245.99 255.255.255.255 10.30.74.69")
    result, n11, n21 = ops.cli.execute(handle, "ip route-static vpn-instance underlay_ipsec 114.113.245.100 255.255.255.255 10.40.53.117")
    result, n11, n21 = ops.cli.execute(handle, "ip route-static vpn-instance underlay_ipsec 192.168.55.250 255.255.255.255 10.30.74.69 track nqa pri pri")
    result, n11, n21 = ops.cli.execute(handle, "ip route-static vpn-instance underlay_ipsec 192.168.55.250 255.255.255.255 10.40.53.117 preference 70")
    # aaa
    result, n11, n21 = ops.cli.execute(handle, "aaa")
    result, n11, n21 = ops.cli.execute(handle, "local-user admin service-type terminal ssh http")
    result, n11, n21 = ops.cli.execute(handle, "quit")
    result, n11, n21 = ops.cli.execute(handle, "stelnet server enable")
    result, n11, n21 = ops.cli.execute(handle, "ssh server permit interface all")
    result, n11, n21 = ops.cli.execute(handle, "user-interface vty 0")
    result, n11, n21 = ops.cli.execute(handle, "protocol inbound ssh")
    result, n11, n21 = ops.cli.execute(handle, "user-interface vty 1 4")
    result, n11, n21 = ops.cli.execute(handle, "authentication-mode aaa")
    ops.syslog("ops:add_tunnel is success", "critical", "syslog")
    ops.cli.close(handle)
    return 0
`;

  let data = {};
  console.log(mplsGreOverOpenvpn);
  let type = 'post'
  let datatype = 'json';
  ajaxHandler(url,data,datatype,type);
};