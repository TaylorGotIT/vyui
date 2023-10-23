/* FastIP 假组网 双运营商 */
const fastip002html = `<table border="1">
<tr>
<td>LineID</td>
<td><input id="lineid_input" placeholder="线路ID"></td>
<td><select id="version_select">
<option value="40" selected="selected">FnetOS[ 4.0 ]</option>
<option value="32">FnetOS[ 3.2 ]</option>
<option value="31">FnetOS[ 3.1 ]</option></select></td>
</tr>
<tr>
<td>Company</td>
<td><input id="cname_input" placeholder="CompanyName[eg:Huawei]"></td>
<td><input id="area_input" placeholder="Area[GZ,SZ,SH,etc...]"></td></tr>
<tr>
<td>WAN1</td>
<td><select id="wan1_select">
<option value="eth0" selected="selected">WAN1-ETH0</option>
<option value="br0">WAN1-BR0</option></select>
<select id="wan1_provider_select">
<option value="CT" selected="selected">电信</option>
<option value="CU">联通</option>
<option value="CM">移动</option></select></td>
<td><select id="wan1_type_select" onchange=fastip002setWan1(this.value)>
<option value="dhcp" selected="selected">WAN Type[ DHCP ]</option>
<option value="static">WAN Type[ Static ]</option>
<option value="pppoe">WAN Type[ PPPoE ]</option></select></td>
</tr>
<tr id="wan1_input_tr"></tr>
<tr>
<tr>
<td>WAN2</td>
<td><select id="wan2_select">
<option value="eth1" selected="selected">WAN2-ETH1</option>
<option value="br1">WAN2-BR1</option></select>
<select id="wan2_provider_select">
<option value="CT" selected="selected">电信</option>
<option value="CU">联通</option>
<option value="CM">移动</option></select></td>
<td><select id="wan2_type_select" onchange=fastip002setWan2(this.value)>
<option value="dhcp" selected="selected">WAN Type[ DHCP ]</option>
<option value="static">WAN Type[ Static ]</option>
<option value="pppoe">WAN Type[ PPPoE ]</option></select></td>
</tr>
<tr id="wan2_input_tr"></tr>
<tr>
<td>LocalDNS</td>
<td><input id="local_dns1_input" placeholder="本地DNS1[eg:223.5.5.5]" value="223.5.5.5"></td>
<td><input id="local_dns2_input" placeholder="本地DNS2[eg:223.6.6.6]" value="223.6.6.6"></td>
</tr>
<tr>
<td>OverseaDNS</td>
<td><input id="oversea1_dns_input" placeholder="海外DNS1[eg:8.8.8.8]" value="8.8.8.8"></td>
<td><input id="oversea2_dns_input" placeholder="海外DNS2[eg:8.8.4.4]" value="8.8.4.4"></td>
</tr>
<tr>
<td>BGPServerA</td>
<td><input id="bgp_server1_input" placeholder="BGP Server1" value="10.10.99.200"></td>
<td><input id="bgp_server2_input" placeholder="BGP Server2" value="10.10.99.202"></td>
</tr>
<tr>
<td>BGPServerB</td>
<td><input id="bgp_server3_input" placeholder="BGP Server3" value="10.10.99.201"></td>
<td><input id="bgp_server4_input" placeholder="BGP Server4" value="10.10.99.203"></td>
</tr>
<td>AC</td>
<td><input id="ac1_input" placeholder="AC1[eg:gzd-acvpnpe1]"></td>
<td><input id="ac2_input" placeholder="AC2[eg:szd-acvpnpe1]"></td>
</tr>
<tr>
<td>AC IF</td>
<td><input id="ac1_if_input" placeholder="AC1IF[eg:vtun1000]"></td>
<td><input id="ac2_if_input" placeholder="AC2IF[eg:vtun2000]"></td>
</tr>
<tr>
<td>AC IP</td>
<td><input id="ac1_ip_input" placeholder="AC1IP[eg:10.x.x.x/30]"></td>
<td><input id="ac2_ip_input" placeholder="AC2IP[eg:10.x.x.x/30]"></td>
</tr>
<tr>
<td>AC Pub</td>
<td><input id="ac1_pub_input" placeholder="AC1Pub[eg:x.x.x.x]"></td>
<td><input id="ac2_pub_input" placeholder="AC2Pub[eg:x.x.x.x]"></td>
</tr>
<tr>
<td>CE Lo</td>
<td><input id="ce1_lo_input" placeholder="CE1Lo[eg:x.x.x.x]"></td>
<td><input id="ce2_lo_input" placeholder="CE2Lo[eg:x.x.x.x]"></td>
</tr>
<tr>
<td>OverseaIP</td>
<td><input id="ac1_oversea_input" placeholder="海外IP[eg:10.x.x.x-x.x.x.x]"></td>
<td><input id="ac2_oversea_input" placeholder="海外IP[eg:10.x.x.x-x.x.x.x]"></td>
</tr>
<tr>
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
                    let bgp = l1.split(",");
                    info_json.bgp.push(bgp[0]);
                    info_json.bgp.push(bgp[1]);
                    break;
                default:
                    if(l1==undefined){
                        console.log(l0);
                        //if(l0.search('natpe')!=-1){
                          //  info_json.natpe.push(l0);
                        //}
                        break;
                    }
                    if(l1.search('-')!=-1){
                        let b = l1.replaceAll('-',',').replaceAll('_',',').split(',').filter(Boolean);
                        let ip_str = "";
                        let h = b[0].split('.')[0];
                        for(let i = 0; i < b.length/2; i++){
                            if(h!=10&&h!=172&&h!=192){
                                if(i==b.length/2-1){
                                    ip_str += `${b[i*2+1]}-${b[i*2]};`;
                                }else{
                                    ip_str += `${b[i*2+1]}-${b[i*2]},`;
                                };
                            }else{
                                if(i==b.length/2-1){
                                    ip_str += `${b[i*2]}-${b[i*2+1]};`;
                                }else{
                                    ip_str += `${b[i*2]}-${b[i*2+1]},`;
                                };
                           }
                        };
                        info_json.oversea.push(ip_str);
            };
        }
    };
    };
    console.log(info_json);
    $("#lineid_input").val(info_json.id[0].substr(0,7));

    $("#ac1_input").val(info_json.pe[0]);
    $("#ac1_if_input").val(info_json.if[0]);
    $("#ac1_ip_input").val(info_json.ip[0]);
    $("#ac1_pub_input").val(info_json.pub[0]);
    $("#ce1_lo_input").val(info_json.lo[0]);
    $("#ac1_oversea_input").val(info_json.oversea[0]);
    $("#bgp_server1_input").val(info_json.bgp[0]);
    $("#bgp_server3_input").val(info_json.bgp[2]);

    $("#ac2_input").val(info_json.pe[1]);
    $("#ac2_if_input").val(info_json.if[1]);
    $("#ac2_ip_input").val(info_json.ip[1]);
    $("#ac2_pub_input").val(info_json.pub[1]);
    $("#ce2_lo_input").val(info_json.lo[1]);
    $("#ac2_oversea_input").val(info_json.oversea[0]);
    $("#bgp_server2_input").val(info_json.bgp[1]);
    $("#bgp_server4_input").val(info_json.bgp[3]);
  };
};

$("#service_dev").append(fastip002html);
//加载测试资源的解析数据
fastip002getList();

function fastip002setWan1(value){
    let html='';
    wan_input_tr = '#wan1_input_tr';
    switch(value){
        case "dhcp":
            $(wan_input_tr).empty();
        break;
        case "static":
            $(wan_input_tr).empty();
            $(wan_input_tr).append(`<td>Static</td><td><input id="wan1_ip_input" placeholder="IP[x.x.x.x/x]"></td>
            <td><input id="wan1_gw_input" placeholder="GW[x.x.x.x]"></td>`);
        break;
        case "pppoe":
            $(wan_input_tr).empty();
            $(wan_input_tr).append(`<td>PPPoE</td><td><input id="pppoe1_user_input" placeholder="PPPoE[x.163.gd]"></td>
            <td><input id="pppoe1_pass_input" placeholder="PPPoE[******]"></td>`);
        break;
    };
}

function fastip002setWan2(value){
    let html='';
    wan_input_tr = '#wan2_input_tr';
    switch(value){
        case "dhcp":
            $(wan_input_tr).empty();
        break;
        case "static":
            $(wan_input_tr).empty();
            $(wan_input_tr).append(`<td>Static</td><td><input id="wan2_ip_input" placeholder="IP[x.x.x.x/x]"></td>
            <td><input id="wan2_gw_input" placeholder="GW[x.x.x.x]"></td>`);
        break;
        case "pppoe":
            $(wan_input_tr).empty();
            $(wan_input_tr).append(`<td>PPPoE</td><td><input id="pppoe2_user_input" placeholder="PPPoE[x.163.gd]"></td>
            <td><input id="pppoe2_pass_input" placeholder="PPPoE[******]"></td>`);
        break;
    };
}

function fastip002sub(url){
  let time = getTime(new Date());
  let user = $("#user_input").val();
  let wan1 = $("#wan1_select").val();
  let wan2 = $("#wan2_select").val();
  let wan1Type = $("#wan1_type_select").val();
  let wan2Type = $("#wan2_type_select").val();
  let wan1Provider = $("#wan1_provider_select").val();
  let wan2Provider = $("#wan2_provider_select").val();

  let version = $("#version_select").val();
  let lineid = $("#lineid_input").val();
  let cnameEN = $("#cname_input").val();
  let area = $("#area_input").val();
  let local1dns = $("#local1_dns_input").val();
  let local2dns = $("#local2_dns_input").val();
  let oversea1dns = $("#oversea1_dns_input").val();
  let oversea2dns = $("#oversea2_dns_input").val();
  let bgp1server1 = $("#bgp_server1_input").val();
  let bgp1server2 = $("#bgp_server2_input").val();
  let bgp1server3 = $("#bgp_server3_input").val();
  let bgp1server4 = $("#bgp_server4_input").val();
  let oversea1ips = $("#ac1_oversea_input").val().split(',')[0];
  let oversea1ip1 = oversea1ips.split(',')[0].split('-')[0];

  let ce1lo = $("#ce1_lo_input").val();
  let ac1 = $("#ac1_input").val();
  let ac1if = $("#ac1_if_input").val();
  let ac1port = ac1if.replace('vtun','');
  let ac1ips = ipNext($("#ac1_ip_input").val().split('/')[0]);
  let ac1ip1 = ac1ips[0];
  let ac1ip2 = ac1ips[1];
  let ac1pub = $("#ac1_pub_input").val();

  let ce2lo = $("#ce2_lo_input").val();
  let ac2 = $("#ac2_input").val();
  let ac2if = $("#ac2_if_input").val();
  let ac2port = ac2if.replace('vtun','');
  let ac2ips = ipNext($("#ac2_ip_input").val().split('/')[0]);
  let ac2ip1 = ac2ips[0];
  let ac2ip2 = ac2ips[1];
  let ac2pub = $("#ac2_pub_input").val();
//差异化配置生成
let wan1Temp = '';
if(wan1=="eth0"){
switch(wan1Type){
    case "dhcp":
        wan1Temp += `set interfaces ethernet ${wan1} description WAN1-${wan1Provider}-DHCP
set interfaces ethernet ${wan1} address dhcp
set protocols static route 1.1.1.1/32 dhcp-interface ${wan1}`;
    break;
    case "static":
        let wan1ip = $("#wan1_ip_input").val();
        let wan1gw = $("#wan1_gw_input").val();
        wan1Temp += `set interfaces ethernet ${wan1} description WAN1-${wan1Provider}-GW-${wan1gw}
set interfaces ethernet ${wan1} address ${wan1ip}
set protocols static route 1.1.1.1/32 next-hop ${wan1gw}`;
    break;
    case "pppoe":
        let pppoe1user = $("#pppoe1_user_input").val();
        let pppoe1pass = $("#pppoe1_pass_input").val();
        wan1Temp += `set interfaces ethernet ${wan1} description WAN1_${wan1Provider}_${pppoe1user}/${pppoe1pass}
set interfaces ethernet ${wan1} pppoe 1 default-route 'none'
set interfaces ethernet ${wan1} pppoe 1 mtu '1492'
set interfaces ethernet ${wan1} pppoe 1 name-server 'none'
set interfaces ethernet ${wan1} pppoe 1 password ${pppoe1user}
set interfaces ethernet ${wan1} pppoe 1 user-id ${pppoe1pass}
set protocols static interface-route 1.1.1.1/32 next-hop-interface pppoe1`;
    break;
  };
}else if(wan1=="br0"){
switch(wan1Type){
    case "dhcp":
        wan1Temp += `set interfaces bridge ${wan1} description WAN1-${wan1Provider}-DHCP
set interfaces bridge ${wan1} address dhcp
set interfaces bridge ${wan1} member interface eth0
set interfaces bridge ${wan1} member interface eth1
set protocols static route 1.1.1.1/32 dhcp-interface ${wan1}`;
    break;
    case "static":
        let wan1ip = $("#wan1_ip_input").val();
        let wan1gw = $("#wan1_gw_input").val();
        wan1Temp += `set interfaces bridge ${wan1} description WAN1-${wan1Provider}-GW-${wan1gw}
set interfaces bridge ${wan1} address ${wan1ip}
set interfaces bridge ${wan1} member interface eth0
set interfaces bridge ${wan1} member interface eth1
set protocols static route 1.1.1.1/32 next-hop ${wan1gw}`;
    break;
    case "pppoe":
        let pppoe1user = $("#pppoe1_user_input").val();
        let pppoe1pass = $("#pppoe1_pass_input").val();
        wan1Temp += `set interfaces bridge ${wan1} description WAN1_${wan1Provider}_${pppoe1user}/${pppoe1pass}
set interfaces bridge ${wan1} pppoe 1 default-route 'none'
set interfaces bridge ${wan1} pppoe 1 mtu '1492'
set interfaces bridge ${wan1} pppoe 1 name-server 'none'
set interfaces bridge ${wan1} pppoe 1 password ${pppoe1user}
set interfaces bridge ${wan1} pppoe 1 user-id ${pppoe1pass}
set interfaces bridge ${wan1} member interface eth0
set interfaces bridge ${wan1} member interface eth1
set protocols static interface-route 1.1.1.1/32 next-hop-interface pppoe1`;
    break;
  };
}

let wan2Temp = '';
if(wan2=="eth1"){
switch(wan2Type){
    case "dhcp":
        wan2Temp += `set interfaces ethernet ${wan2} description WAN2-${wan2Provider}-DHCP
set interfaces ethernet ${wan2} address dhcp
set protocols static route 1.1.1.2/32 dhcp-interface ${wan2}`;
    break;
    case "static":
        let wan2ip = $("#wan2_ip_input").val();
        let wan2gw = $("#wan2_gw_input").val();
        wan2Temp += `set interfaces ethernet ${wan1} description WAN2-${wan2Provider}-GW-${wan2gw}
set interfaces ethernet ${wan2} address ${wan2ip}
set protocols static route 1.1.1.2/32 next-hop ${wan2gw}`;
    break;
    case "pppoe":
        let pppoe1user = $("#pppoe2_user_input").val();
        let pppoe1pass = $("#pppoe2_pass_input").val();
        wan2Temp += `set interfaces ethernet ${wan2} description WAN2_${wan2Provider}_${pppoe2user}/${pppoe2pass}
set interfaces ethernet ${wan2} pppoe 1 default-route 'none'
set interfaces ethernet ${wan2} pppoe 1 mtu '1492'
set interfaces ethernet ${wan2} pppoe 1 name-server 'none'
set interfaces ethernet ${wan2} pppoe 1 password ${pppoe2user}
set interfaces ethernet ${wan2} pppoe 1 user-id ${pppoe2pass}
set protocols static interface-route 1.1.1.2/32 next-hop-interface pppoe2`;
    break;
  };
}else if(wan2=="br1"){
switch(wan2Type){
    case "dhcp":
        wan2Temp += `set interfaces bridge ${wan2} description WAN2-${wan2Provider}-DHCP
set interfaces bridge ${wan2} address dhcp
set interfaces bridge ${wan1} member interface eth2
set interfaces bridge ${wan1} member interface eth3
set protocols static route 1.1.1.2/32 dhcp-interface ${wan2}`;
    break;
    case "static":
        let wan2ip = $("#wan2_ip_input").val();
        let wan2gw = $("#wan2_gw_input").val();
        wan2Temp += `set interfaces bridge ${wan1} description WAN2-${wan2Provider}-GW-${wan2gw}
set interfaces bridge ${wan2} address ${wan2ip}
set interfaces bridge ${wan1} member interface eth2
set interfaces bridge ${wan1} member interface eth3
set protocols static route 1.1.1.2/32 next-hop ${wan2gw}`;
    break;
    case "pppoe":
        let pppoe1user = $("#pppoe2_user_input").val();
        let pppoe1pass = $("#pppoe2_pass_input").val();
        wan2Temp += `set interfaces bridge ${wan2} description WAN2_${wan2Provider}_${pppoe2user}/${pppoe2pass}
set interfaces bridge ${wan2} pppoe 1 default-route 'none'
set interfaces bridge ${wan2} pppoe 1 mtu '1492'
set interfaces bridge ${wan2} pppoe 1 name-server 'none'
set interfaces bridge ${wan2} pppoe 1 password ${pppoe2user}
set interfaces bridge ${wan2} pppoe 1 user-id ${pppoe2pass}
set interfaces bridge ${wan1} member interface eth2
set interfaces bridge ${wan1} member interface eth3
set protocols static interface-route 1.1.1.2/32 next-hop-interface pppoe2`;
    break;
  };
}

let openvpnTemp = '';
let smartdnsTemp = '';
switch(version){
    case "40":
openvpnTemp += `echo 'OpenVPN 接入配置[ac1]'
set interfaces openvpn ${ac1if} description AC1_${ac1}
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
#set interfaces openvpn ${ac1if} openvpn-option '--fragment 1300'
set interfaces openvpn ${ac1if} shared-secret-key-file '/config/auth/openvpn.secret'
echo 'OpenVPN 接入配置[ac2]'
set interfaces openvpn ${ac2if} description AC2_${ac2}
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
#set interfaces openvpn ${ac2if} openvpn-option '--fragment 1300'
set interfaces openvpn ${ac2if} shared-secret-key-file '/config/auth/openvpn.secret'`;

smartdnsTemp += `set epoch file-sync task 1 local '/opt/cn.txt'
set epoch file-sync task 1 remote 'http://183.56.161.82:1909/f32x/domainlist/cn_domainlist.last'
set epoch file-sync task 2 local '/opt/oversea.txt'
set epoch file-sync task 2 remote 'http://183.56.161.82:1909/f32x/domainlist/oversea_domainlist.last'
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
openvpnTemp += `echo 'OpenVPN 接入配置[ac1]'
set interfaces openvpn ${ac1if} description AC1_${ac1}
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
#set interfaces openvpn ${ac1if} openvpn-option '--fragment 1300'
set interfaces openvpn ${ac1if} shared-secret-key-file '/config/auth/openvpn.secret'
echo 'OpenVPN 接入配置[ac2]'
set interfaces openvpn ${ac2if} description AC2_${ac2}
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
#set interfaces openvpn ${ac2if} openvpn-option '--fragment 1300'
set interfaces openvpn ${ac2if} shared-secret-key-file '/config/auth/openvpn.secret'`;

smartdnsTemp +=`set service dns dnsmasq cache-size '9999'
set service dns dnsmasq fnetlink-dns enable
set service dns dnsmasq fnetlink-dns local-isp-dns ${local1dns}
set service dns dnsmasq fnetlink-dns local-isp-dns ${local2dns}
set service dns dnsmasq fnetlink-dns upchinadomain host '59.37.126.146'
set service dns dnsmasq listen-on ${wan1}
set service dns dnsmasq name-server ${oversea1dns}
set service dns dnsmasq name-server ${oversea2dns}`;
    break;
    case "31":
openvpnTemp += `echo 'OpenVPN 接入配置[ac1]'
set interfaces openvpn ${ac1if} description AC1_${ac1}
set interfaces openvpn ${ac1if} local-address ${ac1ip2} subnet-mask 255.255.255.252
set interfaces openvpn ${ac1if} remote-address ${ac1ip1}
set interfaces openvpn ${ac1if} remote-host ${ac1pub}
set interfaces openvpn ${ac1if} remote-port ${ac1port}
set interfaces openvpn ${ac1if} mode site-to-site-client
set interfaces openvpn ${ac1if} protocol udp
set interfaces openvpn ${ac1if} openvpn-option 'persist-tun'
set interfaces openvpn ${ac1if} openvpn-option '--persist-tun'
#set interfaces openvpn ${ac1if} openvpn-option 'tun-mtu 1420'
set interfaces openvpn ${ac1if} shared-secret-key-file '/config/auth/openvpn.secret'
echo 'OpenVPN 接入配置[ac2]'
set interfaces openvpn ${ac2if} description AC2_${ac2}
set interfaces openvpn ${ac2if} local-address ${ac2ip2} subnet-mask 255.255.255.252
set interfaces openvpn ${ac2if} remote-address ${ac2ip1}
set interfaces openvpn ${ac2if} remote-host ${ac2pub}
set interfaces openvpn ${ac2if} remote-port ${ac2port}
set interfaces openvpn ${ac1if} mode site-to-site-client
set interfaces openvpn ${ac2if} protocol udp
set interfaces openvpn ${ac2if} openvpn-option 'persist-tun'
set interfaces openvpn ${ac2if} openvpn-option '--persist-tun'
#set interfaces openvpn ${ac2if} openvpn-option 'tun-mtu 1420'
set interfaces openvpn ${ac2if} shared-secret-key-file '/config/auth/openvpn.secret'`;

smartdnsTemp +=`set service dns forwarding cache-size '9999'
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
echo '>>>升级到最新镜像<<<'
conf
delete interfaces bridge
delete interfaces ethernet
set interfaces ethernet eth0 address dhcp
set system name-server 114.114.114.114
commit
exit
curl http://202.104.174.189:18080/epochos/ | \
grep vyos-epoch | \
awk -F '"' '{print $2}' | \
sed -n '$p' > img_list
while read -r img; do wget "http://192.168.75.15/epochos/$img"; done < img_list
while read -r img; do add system image "$img"; done < img_list
echo '初始化设备'
delete system host-name
delete epoch controller
sudo systemctl stop epoch-openvpnd
rm /config/.initagentd.status
delete interfaces ethernet eth0 address
delete interfaces ethernet eth1 address
delete interfaces ethernet eth2 address
delete interfaces ethernet eth3 address
delete interfaces ethernet eth4 address
delete interfaces ethernet eth5 address
delete interface openvpn
delete interface tunnel
delete interface loopback lo
delete firewall options interface
delete nat
delete protocols
delete policy
delete track
delete smokeping
delete traffic-policy
delete service dns
delete service dhcp-server
delete system name-server
delete system flow-accounting
set interfaces ethernet eth0 address dhcp
echo '>>>Table default 海外，DHCP指定海外DNS<<<'
set interfaces bridge br2 description LAN-Bridge-ETH1-5
set interfaces bridge br2 address 192.168.8.1/24
set interfaces bridge br2 member interface eth1
set interfaces bridge br2 member interface eth2
set interfaces bridge br2 member interface eth3
set interfaces bridge br2 member interface eth4
set interfaces bridge br2 member interface eth5
set system name-server 114.114.114.114
set service ssh disable-host-validation
set service ssh port 2707
set system login user bothwin authentication encrypted-password '$6$v.wWSn9tGGGWzElK$qrB79AFWdg4lCtrbVNjea6Gs.oMGeQ8now53XO/h8V8DZ5yiqzv33h0rSMw8wWKTZXRFf6O8uRRCcPaIHsaiq0'
set system time-zone Asia/Hong_Kong
set service smartping
commit
save
exit
sudo curl -O https://raw.githubusercontent.com/sivel/speedtest-cli/master/speedtest.py
sudo chmod +x  speedtest.py
conf
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
set interfaces ethernet ${wan1} firewall local name 'WAN2LOCAL'
set interfaces ethernet ${wan2} firewall local name 'WAN2LOCAL'
set interfaces openvpn ${ac1if} firewall local name 'WAN2LOCAL'
set interfaces openvpn ${ac2if} firewall local name 'WAN2LOCAL'
set system host-name ${lineid}-${cnameEN}-${area}
set service smartping
set service snmp community both-win authorization 'ro'
set interfaces loopback lo address ${ce1lo}/32
set interfaces loopback lo address ${ce2lo}/32
set interfaces loopback lo address ${oversea1ip1}/32
set interfaces loopback lo description ${ce1lo},${oversea1ips}
${wan1Temp}
${wan2Temp}
${openvpnTemp}
echo '>>>MTU TCP-MSS配置[interface]<<<'
set firewall options interface ${ac1if} adjust-mss '1300'
set firewall options interface ${ac2if} adjust-mss '1300'
echo '>>>路由配置[Track 默认路由，对接公网路由，内网路由]<<<'
set protocols static route 114.114.114.114/32 next-hop 1.1.1.1
set track name to-223 failure-count 2
set track name to-223 success-count 2
set track name to-223 test 10 resp-time 5
set track name to-223 test 10 target 114.114.114.114
set track name to-223 test 10 ttl-limit 1
set track name to-223 test 10 type ping
#
set track name to-main failure-count 2
set track name to-main success-count 2
set track name to-main test 10 resp-time 5
set track name to-main test 10 target 10.30.20.129
set track name to-main test 10 ttl-limit 1
set track name to-main test 10 type ping
echo '>>>静态路由配置[Static]<<<'
set protocols static route 0.0.0.0/0 next-hop 1.1.1.1 distance 220
set protocols static route 0.0.0.0/0 next-hop 1.1.1.2 distance 230
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
set protocols bgp 65000 parameters router-id ${ce1lo}
set protocols bgp 65000 peer-group RSVR address-family ipv4-unicast route-map import 'bgp-from--RSVR'
set protocols bgp 65000 peer-group RSVR address-family ipv4-unicast soft-reconfiguration inbound
set protocols bgp 65000 peer-group RSVR remote-as '65000'
set protocols bgp 65000 peer-group RSVR update-source ${ce1lo}
set protocols bgp 65000 peer-group RSVR2 address-family ipv4-unicast route-map import 'bgp-from--RSVR2'
set protocols bgp 65000 peer-group RSVR2 address-family ipv4-unicast soft-reconfiguration inbound
set protocols bgp 65000 peer-group RSVR2 remote-as '65000'
set protocols bgp 65000 peer-group RSVR2 update-source ${ce2lo}
set protocols bgp 65000 timers holdtime '15'
set protocols bgp 65000 timers keepalive '60'
#需要更换BGP Server时使用
#set protocols bgp 65000 neighbor ${bgp1server1} peer-group 'RSVR'
#set protocols bgp 65000 neighbor ${bgp1server2} peer-group 'RSVR'
#set protocols bgp 65000 neighbor ${bgp1server3} peer-group 'RSVR2'
#set protocols bgp 65000 neighbor ${bgp1server4} peer-group 'RSVR2'
echo '>>>DNS劫持<<<'
set nat destination rule 50 destination port 53
set nat destination rule 50 inbound-interface ${wan1}
set nat destination rule 50 protocol tcp_udp
set nat destination rule 50 translation address 127.0.0.1
echo '>>>本地NAT<<<'
set nat source rule 100 outbound-interface ${wan1}
set nat source rule 100 translation address masquerade
set nat source rule 200 outbound-interface ${wan2}
set nat source rule 200 translation address masquerade
echo '>>>海外NAT<<<'
set nat source rule 3001 destination address ${oversea1dns}/32
set nat source rule 3001 outbound-interface ${ac1if}
set nat source rule 3001 translation address ${oversea1ip1}
set nat source rule 4001 destination address ${oversea1dns}/32
set nat source rule 4001 outbound-interface ${ac2if}
set nat source rule 4001 translation address ${oversea1ip1}
set nat source rule 3002 destination address ${oversea2dns}/32
set nat source rule 3002 outbound-interface ${ac1if}
set nat source rule 3002 translation address ${oversea1ip1}
set nat source rule 4002 destination address ${oversea2dns}/32
set nat source rule 4002 outbound-interface ${ac2if}
set nat source rule 4002 translation address ${oversea1ip1}
echo '>>>SmartDNS智能DNS配置<<<'
${smartdnsTemp}
echo '# 登录消息[banner]'
set system login banner post-login "################ \n\
SN: E1X16225005xxxxxxxx \n\
版本: FnetOS 3.2.17 @ vyos-1.2.9-S1 \n\
服务: FastIP GZ 10M \n\
公网: ETH0 DHCP \n\
内网: BR2 192.168.8.254/24 \n\
拓扑：WIFI路由器---CE路由器---光猫 \n\
安装人员: ${user} \n\
最后修改: ${user} ${time.cn} \n\
################"
###以上配置commit后再贴###
delete system name-server
set system name-server 192.168.8.1
###回程路由、WIFI、DHCP###
set protocols static route 10.0.0.0/8 next-hop 1.1.1.1
set protocols static route 172.16.0.0/12 next-hop 1.1.1.1
set protocols static route 192.168.0.0/16 next-hop 1.1.1.1
echo '5G WIFI SSID: sdwan PASSWD: 123456@sdwan'
set interfaces wireless wlan1 address '192.168.9.1/24'
set interfaces wireless wlan1 channel '0'
set interfaces wireless wlan1 country-code 'cn'
set interfaces wireless wlan1 dhcp-options client-id 'sdwan'
set interfaces wireless wlan1 hw-id 'cc:d3:9d:99:ff:61'
set interfaces wireless wlan1 mode 'ac'
set interfaces wireless wlan1 physical-device 'phy0'
set interfaces wireless wlan1 security wpa mode 'wpa2'
set interfaces wireless wlan1 security wpa passphrase '123456@sdwan'
set interfaces wireless wlan1 ssid 'sdwan'
set interfaces wireless wlan1 type 'access-point'
echo '2.4G WIFI 600M传输距离远'
set interfaces wireless wlan1 mode 'n'
echo 'LAN DHCP Server Range: 2-200'
set service dhcp-server shared-network-name dhcp_br2 subnet 192.168.8.0/24 description 'dhcp_br2'
set service dhcp-server shared-network-name dhcp_br2 subnet 192.168.8.0/24 default-router '192.168.8.1'
set service dhcp-server shared-network-name dhcp_br2 subnet 192.168.8.0/24 lease '86400'
set service dhcp-server shared-network-name dhcp_br2 subnet 192.168.8.0/24 name-server '192.168.8.1'
set service dhcp-server shared-network-name dhcp_br2 subnet 192.168.8.0/24 range 0 start '192.168.8.2'
set service dhcp-server shared-network-name dhcp_br2 subnet 192.168.8.0/24 range 0 stop '192.168.8.200'
echo 'WIFI DHCP Server Range: 2-200'
set service dhcp-server shared-network-name dhcp_wlan1 subnet 192.168.9.0/24 description 'dhcp_wlan1'
set service dhcp-server shared-network-name dhcp_wlan1 subnet 192.168.9.0/24 default-router '192.168.9.1'
set service dhcp-server shared-network-name dhcp_wlan1 subnet 192.168.9.0/24 lease '86400'
set service dhcp-server shared-network-name dhcp_wlan1 subnet 192.168.9.0/24 name-server '192.168.9.1'
set service dhcp-server shared-network-name dhcp_wlan1 subnet 192.168.9.0/24 range 0 start '192.168.9.2'
set service dhcp-server shared-network-name dhcp_wlan1 subnet 192.168.9.0/24 range 0 stop '192.168.9.200'
################
测试：
    大包测试
        openvpn     CMD: sudo ping x.x.x.x -s 1500
            sudo ping ${ac1ip1} -i 0.1 -c 100 -s 1500
            sudo ping ${ac2ip1} -i 0.1 -c 100 -s 1500
        pc          CMD: ping www.yahoo.com -l 1500
    网站测速
        speedtest   URL: <https://www.speedtest.net>
        Fast        URL: <https://fast.com>
        ATT         URL: <https://www.att.com/support/speedtest>
        泰国         URL: <https://speedtest.adslthailand.com>
    谷歌云盘上传下载测速
SmartPing监控：
    阿里DNS：114.114.114.114
    谷歌DNS：8.8.8.8
    主线Pub: ${ac1ip1}
    备线Pub: ${ac2ip1}
`;
  let filename = `${lineid}-FastIP-HK-FnetOS-ConfigBy${user}-${time.ez}`;
  let data = {};
  downloadConfig(filename, fastip002fastipOpenvpn);
  let type = 'post'
  let datatype = 'json';
  ajaxHandler(url,data,datatype,type);
};