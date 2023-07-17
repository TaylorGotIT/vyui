/* FastIP 假组网 FnetOS 单运营商 */
const fastip101html = `<table border="1">
<tr>
<td>LineID</td>
<td><input id="lineid_input"></td>
<td><select id="version_select">
<option value="40" selected="selected">FnetOS[ 4.0 ]</option>
<option value="32">FnetOS[ 3.2 ]</option>
<option value="31">FnetOS[ 3.1 ]</option></select></td>
</tr>
<tr>
<td>Company</td>
<td><input id="cname_input" placeholder="CompanyName[eg:Huawei]"></td>
<td><input id="area_input" placeholder="Area[GZ,SZ,SH,etc...]"></td>
</tr>
<tr>
<td>WAN</td>
<td><select id="wan1_select">
<option value="eth0" selected="selected">ETH0</option>
<option value="eth1">ETH1</option>
<option value="br0">BR0</option>
<option value="br1">BR1</option></select>
<select id="wan1_provider_select">
<option value="CT" selected="selected">电信[CT]</option>
<option value="CU">联通[CU]</option>
<option value="CM">移动[CM]</option></select></td>
<td><select id="wan1_type_select" onchange=fastip101setWan(this.value)>
<option value="dhcp" selected="selected">WAN Type[ DHCP ]</option>
<option value="static">WAN Type[ Static ]</option>
<option value="pppoe">WAN Type[ PPPoE ]</option></select></td></tr>
<tr id="wan1_input_tr">
</tr>
<tr>
<td>LocalDNS</td>
<td><input id="local1_dns_input" placeholder="本地DNS1[eg:223.5.5.5]" value="223.5.5.5"></td>
<td><input id="local2_dns_input" placeholder="本地DNS2[eg:223.6.6.6]" value="223.6.6.6"></td>
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
<tr>
<td>PE</td>
<td><input id="pe1_input" placeholder="PE1[eg:gzd-upe1]"></td>
<td><input id="pe2_input" placeholder="PE2[eg:szd-upe2]"></td>
</tr>
<tr>
<td>PE IF</td>
<td><input id="pe1_if_input" placeholder="PE1IF[eg:Tunnel0/0/1]"></td>
<td><input id="pe2_if_input" placeholder="PE2IF[eg:Tunnel0/0/2]"></td>
</tr>
<tr>
<td>PE IP</td>
<td><input id="pe1_ip_input" placeholder="PE1IP[eg:10.x.x.x/30]"></td>
<td><input id="pe2_ip_input" placeholder="PE2IP[eg:10.x.x.x/30]"></td>
</tr>
<tr>
<td>PE LO</td>
<td><input id="pe1_lo_input" placeholder="PE1LO[eg:10.x.x.x/32]"></td>
<td><input id="pe2_lo_input" placeholder="PE2LO[eg:10.x.x.x/32]"></td>
</tr>
<tr>
<td>CE LO</td>
<td><input id="ce1_lo_input" placeholder="CE1LO[eg:10.x.x.x/32]"></td>
<td><input id="ce2_lo_input" placeholder="CE2LO[eg:10.x.x.x/32]"></td>
</tr>
<tr>
<td>OverseaIP</td>
<td><input id="pe1_oversea_input" placeholder="海外IP[eg:10.x.x.x-x.x.x.x]"></td>
<td><input id="pe2_oversea_input" placeholder="海外IP[eg:10.x.x.x-x.x.x.x]"></td>
</tr>
<tr>
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
</table>
<button type="button" onclick="fastip101sub('/config')">提交配置信息(Submit Config Info)</button>
`;

function fastip101getList() {
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
                    if(l1.search('ac')!=-1 | l1.search('gw')!=-1){
                        info_json.ac.push(l1);
                    }else if(l1.search('pe')!=-1){
                        info_json.pe.push(l1);
                    }else{
                        info_json.lo.push(l1);
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
                    }else{
                        info_json.other.push(l1);
                    };
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
    $("#pe1_oversea_input").val(info_json.oversea[0]);
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
    $("#pe2_oversea_input").val(info_json.oversea[0]);
    $("#pe2_as_input").val(info_json.as[1]);
    $("#ac2_input").val(info_json.ac[1]);
    $("#ac2_if_input").val(info_json.if[3]);
    $("#ac2_ip_input").val(info_json.ip[3]);
    $("#ac2_pub_input").val(info_json.pub[1]);
  };
};

$("#service_dev").append(fastip101html);
//加载测试资源的解析数据
fastip101getList();

function fastip101setWan(value){
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

function fastip101sub(url){
  let user = $("#user_input").val();
  let time=getTime(new Date());
  let wan1 = $("#wan1_select").val();
  let wan1Type = $("#wan1_type_select").val();
  let wan1Provider = $("#wan1_provider_select").val();

  let version = $("#version_select").val();
  let lineid = $("#lineid_input").val();
  let cname = $("#cname_input").val();
  let area = $("#area_input").val();
  let local1dns = $("#local1_dns_input").val();
  let local2dns = $("#local2_dns_input").val();
  let oversea1dns = $("#oversea1_dns_input").val();
  let oversea2dns = $("#oversea2_dns_input").val();
  let bgp1server1 = $("#bgp_server1_input").val();
  let bgp1server2 = $("#bgp_server2_input").val();
  let bgp1server3 = $("#bgp_server3_input").val();
  let bgp1server4 = $("#bgp_server4_input").val();
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
  let ac1pub = $("#ac1_pub_input").val();

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
  let ac2pub = $("#ac2_pub_input").val();
//差异化配置生成
let wan1Temp = '';
if(wan1=="eth0" || wan1=="eth1"){
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
}else if(wan1=="br0" || wan1=="br1"){
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
let openvpnTemp = '';
let greTemp = '';
let smartdnsTemp = '';
switch(version){
    case "40":
greTemp += `echo '>>>GRE 配置[Main]<<<'
set interfaces tunnel ${pe1if} description PE1_${pe1}
set interfaces tunnel ${pe1if} address ${pe1ip2}/30
set interfaces tunnel ${pe1if} source-address ${ac1ip2}
set interfaces tunnel ${pe1if} remote ${pe1lo}
set interfaces tunnel ${pe1if} encapsulation gre
set interfaces tunnel ${pe1if} multicast disable
set interfaces tunnel ${pe1if} parameters ip ttl 255
echo '>>>GRE 配置[Backup]<<<'
set interfaces tunnel ${pe2if} description PE2_${pe2}
set interfaces tunnel ${pe2if} address ${pe2ip2}/30
set interfaces tunnel ${pe2if} source-address ${ac2ip2}
set interfaces tunnel ${pe2if} remote ${pe2lo}
set interfaces tunnel ${pe2if} encapsulation gre
set interfaces tunnel ${pe2if} multicast disable
set interfaces tunnel ${pe2if} parameters ip ttl 255`;

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
greTemp += `echo '>>>GRE 配置[Main]<<<'
set interfaces tunnel ${pe1if} description PE1_${pe1}
set interfaces tunnel ${pe1if} address ${pe1ip2}/30
set interfaces tunnel ${pe1if} local ${ac1ip2}
set interfaces tunnel ${pe1if} remote ${pe1lo}
set interfaces tunnel ${pe1if} encapsulation gre
set interfaces tunnel ${pe1if} multicast disable
set interfaces tunnel ${pe1if} parameters ip ttl 255
echo '>>>GRE 配置[Backup]<<<'
set interfaces tunnel ${pe2if} description PE2_${pe2}
set interfaces tunnel ${pe2if} address ${pe2ip2}/30
set interfaces tunnel ${pe2if} local ${ac2ip2}
set interfaces tunnel ${pe2if} remote ${pe2lo}
set interfaces tunnel ${pe2if} encapsulation gre
set interfaces tunnel ${pe2if} multicast disable
set interfaces tunnel ${pe2if} parameters ip ttl 255`;

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
greTemp += `echo '>>>GRE 配置[Main]<<<'
set interfaces tunnel ${pe1if} description PE1_${pe1}
set interfaces tunnel ${pe1if} address ${pe1ip2}/30
set interfaces tunnel ${pe1if} local-ip ${ac1ip2}
set interfaces tunnel ${pe1if} remote-ip ${pe1lo}
set interfaces tunnel ${pe1if} encapsulation gre
set interfaces tunnel ${pe1if} multicast disable
set interfaces tunnel ${pe1if} parameters ip ttl 255
echo '>>>GRE 配置[Backup]<<<'
set interfaces tunnel ${pe2if} description PE2_${pe2}
set interfaces tunnel ${pe2if} address ${pe2ip2}/30
set interfaces tunnel ${pe2if} local-ip ${ac2ip2}
set interfaces tunnel ${pe2if} remote-ip ${pe2lo}
set interfaces tunnel ${pe2if} encapsulation gre
set interfaces tunnel ${pe2if} multicast disable
set interfaces tunnel ${pe2if} parameters ip ttl 255`;

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

let fastip101fastipGreOverOpenvpn  =
`#Fnet MPLS with GRE Over OpenVPN Template.
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
echo '>>>Table default 海外，DHCP指定海外DNS<<<'
set interfaces bridge br2 description LAN-Bridge-ETH1-5
set interfaces bridge br2 address 192.168.8.1/24
set interfaces bridge br2 member interface eth1set interfaces bridge br2 member interface eth1
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
set interfaces tunnel ${pe1if} firewall local name 'WAN2LOCAL'
set interfaces tunnel ${pe2if} firewall local name 'WAN2LOCAL'
set system host-name ${lineid}-${cname}-${area}
set service snmp community both-win authorization 'ro'
set service smartping
set interfaces loopback lo address ${oversea1ip1}/32
set interfaces loopback lo description ${oversea1ips}
${wan1Temp}
${openvpnTemp}
${greTemp}
echo '>>>MTU TCP-MSS配置[interface]<<<'
set firewall options interface ${ac1if} adjust-mss 1300
set firewall options interface ${ac2if} adjust-mss 1300
set firewall options interface ${pe1if} adjust-mss 1300
set firewall options interface ${pe2if} adjust-mss 1300
echo '>>>路由配置[Track 默认路由，对接公网路由，内网路由]<<<'
set protocols static route 223.5.5.5/32 next-hop 1.1.1.1
set track name to-223 failure-count 2
set track name to-223 success-count 2
set track name to-223 test 10 resp-time 5
set track name to-223 test 10 target 223.5.5.5
set track name to-223 test 10 ttl-limit 1
set track name to-223 test 10 type ping
set track name to-main failure-count 2
set track name to-main success-count 2
set track name to-main test 10 resp-time 5
set track name to-main test 10 target ${pe1ip1}
set track name to-main test 10 ttl-limit 1
set track name to-main test 10 type ping
echo '>>>静态路由配置[Static]<<<'
set protocols static route 0.0.0.0/0 next-hop 1.1.1.1 distance 220
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
echo '>>>动态路由配置[BGP]<<<'
set protocols static route ${bgp1server1}/32 next-hop ${pe1ip1} track 'to-main'
set protocols static route ${bgp1server1}/32 blackhole distance '5'
set protocols static route ${bgp1server3}/32 next-hop ${pe1ip1} track 'to-main'
set protocols static route ${bgp1server3}/32 blackhole distance '5'
set protocols static route ${bgp1server2}/32 next-hop ${pe2ip1}
set protocols static route ${bgp1server4}/32 next-hop ${pe2ip1}
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
set protocols bgp 65000 neighbor ${bgp1server1} peer-group 'RSVR'
set protocols bgp 65000 neighbor ${bgp1server3} peer-group 'RSVR'
set protocols bgp 65000 neighbor ${bgp1server2} peer-group 'RSVR2'
set protocols bgp 65000 neighbor ${bgp1server4} peer-group 'RSVR2'
set protocols bgp 65000 parameters router-id ${pe1ip2}
set protocols bgp 65000 peer-group RSVR address-family ipv4-unicast route-map import 'bgp-from--RSVR'
set protocols bgp 65000 peer-group RSVR address-family ipv4-unicast soft-reconfiguration inbound
set protocols bgp 65000 peer-group RSVR remote-as '65000'
set protocols bgp 65000 peer-group RSVR update-source ${pe1ip2}
set protocols bgp 65000 peer-group RSVR2 address-family ipv4-unicast route-map import 'bgp-from--RSVR2'
set protocols bgp 65000 peer-group RSVR2 address-family ipv4-unicast soft-reconfiguration inbound
set protocols bgp 65000 peer-group RSVR2 remote-as '65000'
set protocols bgp 65000 peer-group RSVR2 update-source ${pe2ip2}
set protocols bgp 65000 timers holdtime '15'
set protocols bgp 65000 timers keepalive '60'
echo '5G WIFI SSID: sdwan PASSWD: 123456@sdwan'
set interfaces wireless wlan1 address 192.168.9.1/24
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
set service dhcp-server shared-network-name dhcp_br2 subnet 192.168.8.0/24 name-server 192.168.8.1
set service dhcp-server shared-network-name dhcp_br2 subnet 192.168.8.0/24 range 0 start '192.168.8.2'
set service dhcp-server shared-network-name dhcp_br2 subnet 192.168.8.0/24 range 0 stop '192.168.8.200'
echo 'WIFI DHCP Server Range: 2-200'
set service dhcp-server shared-network-name dhcp_wlan1 subnet 192.168.9.0/24 description 'dhcp_wlan1'
set service dhcp-server shared-network-name dhcp_wlan1 subnet 192.168.9.0/24 default-router '192.168.9.1'
set service dhcp-server shared-network-name dhcp_wlan1 subnet 192.168.9.0/24 lease '86400'
set service dhcp-server shared-network-name dhcp_wlan1 subnet 192.168.9.0/24 name-server 192.168.9.1
set service dhcp-server shared-network-name dhcp_wlan1 subnet 192.168.9.0/24 range 0 start '192.168.9.2'
set service dhcp-server shared-network-name dhcp_wlan1 subnet 192.168.9.0/24 range 0 stop '192.168.9.200'
echo '>>>DNS劫持<<<'
set nat destination rule 50 destination port 53
set nat destination rule 50 inbound-interface ${wan1}
set nat destination rule 50 protocol tcp_udp
set nat destination rule 50 translation address 192.168.8.1
echo '>>>本地NAT<<<'
set nat source rule 100 outbound-interface ${wan1}
set nat source rule 100 translation address masquerade
echo '>>>海外NAT<<<'
echo '>>>Br2 NAT 192.168.8.0/24<<<'
set nat source rule 1998 source address 192.168.8.0/24
set nat source rule 1998 outbound-interface ${pe1if}
set nat source rule 1998 translation address ${oversea1ip1}
set nat source rule 2998 source address 192.168.8.0/24
set nat source rule 2998 outbound-interface ${pe2if}
set nat source rule 2998 translation address ${oversea1ip1}
echo '>>>Wlan1 NAT 192.168.9.0/24<<<'
set nat source rule 1999 source address 192.168.9.0/24
set nat source rule 1999 outbound-interface ${pe1if}
set nat source rule 1999 translation address ${oversea1ip1}
set nat source rule 2999 source address 192.168.9.0/24
set nat source rule 2999 outbound-interface ${pe2if}
set nat source rule 2999 translation address ${oversea1ip1}
echo '>>>Google DNS NAT 8.8.8.8/32<<<'
set nat source rule 3000 destination address 8.8.8.8/32
set nat source rule 3000 outbound-interface ${pe1if}
set nat source rule 3000 translation address ${oversea1ip1}
set nat source rule 4000 destination address 8.8.8.8/32
set nat source rule 4000 outbound-interface ${pe2if}
set nat source rule 4000 translation address ${oversea1ip1}
echo '>>>海外DNS1 NAT ${oversea1dns}/32<<<'
set nat source rule 3001 destination address ${oversea1dns}/32
set nat source rule 3001 outbound-interface ${pe1if}
set nat source rule 3001 translation address ${oversea1ip1}
set nat source rule 4001 destination address ${oversea1dns}/32
set nat source rule 4001 outbound-interface ${pe2if}
set nat source rule 4001 translation address ${oversea1ip1}
echo '>>>海外DNS2 NAT ${oversea2dns}/32<<<'
set nat source rule 3002 destination address ${oversea2dns}/32
set nat source rule 3002 outbound-interface ${pe1if}
set nat source rule 3002 translation address ${oversea1ip1}
set nat source rule 4002 destination address ${oversea2dns}/32
set nat source rule 4002 outbound-interface ${pe2if}
set nat source rule 4002 translation address ${oversea1ip1}
echo '>>>SmartDNS配置<<<'
${smartdnsTemp}
###以上配置commit后再贴###
delete system name-server
set system name-server 192.168.8.1
`;
  let filename = `${lineid}-Fast-SD-WAN-FastIP-GREOverOpenVPN-Config-${time.ez}-By-${user}`;
  let data = {};
  console.log(fastip101fastipGreOverOpenvpn);
  downloadConfig(filename, fastip101fastipGreOverOpenvpn);
  let type = 'post'
  let datatype = 'json';
  ajaxHandler(url,data,datatype,type);
};