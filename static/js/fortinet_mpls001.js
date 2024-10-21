/***
飞塔防火墙 MPLS骨干组网 GRE Over IPsec
***/
const fortinet_mpls001html = `<table border="1">
<tr>
<td><input id="site1_id_input"></td>
<td><input id="site2_id_input"></td>
</tr>
<tr>
<td>WAN接口<select id="wan1_select">
<option value="wan" selected="selected">wan</option>
<option value="wan1">wan1</option>
<option value="wan2">wan2</option>
<option value="port1">port1</option>
<option value="port2">port2</option>
<option value="port3">port3</option>
<option value="port4">port4</option>
<option value="lan1">lan1</option>
<option value="lan2">lan2</option>
<option value="lan3">lan3</option>
<option value="lan4">lan4</option>
</select>
</td>
<td>
<select id="wan1_type_select" onchange=fortinet_mpls001setWan1type(this.value)>
<option value="dhcp" selected="selected">WAN[ DHCP ]</option>
<option value="static">WAN[ Static ]</option>
<option value="pppoe">WAN[ PPPoE ]</option>
</select>
</td>
</tr>

<tr id="wan1_setup_tr"></tr>

<tr>
<td>LAN接口<select id="lan1_select">
<option value="lan" selected="selected">lan</option>
<option value="lan1">lan1</option>
<option value="internel">internel</option>
<option value="port2">port2</option>
</select>
</td>
<td><input id="lan1_ip_input" placeholder="[lan-ip]192.168.8.1/24"></td>
</tr>
<tr>
<td><input id="subnet1_input" placeholder="[发布子网1]192.168.10.0/24"></td>
<td><input id="subnet2_input" placeholder="[发布子网2]192.168.20.0/24"></td>
</tr>
<tr>
<td><input id="line1_input"></td>
<td><input id="line2_input"></td>
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
<td><input id="pe1_as_input"></td>
<td><input id="pe2_as_input"></td>
</tr>
<tr>
<td><input id="ce1_as_input"></td>
<td><input id="ce2_as_input"></td>
</tr>
<tr>
<td><input id="pe1_pub_input"></td>
<td><input id="pe2_pub_input"></td>
</tr>
<tr>
<td><input id="pe1_psk_input"></td>
<td><input id="pe2_psk_input"></td>
</tr>

<tr>
<td><input id="fmg_ip_input" placeholder="FMG IP x.x.x.x"></td>
<td><input id="faz_ip_input" placeholder="FAZ IP x.x.x.x"></td>
</tr>

</table>
<button type="button" onclick="fortinet_mpls001sub('/config')">提交配置信息(Submit Config Info)</button>
`;

function cidrToSubnetMask(cidr) {
    // 提取前缀长度
    let ips = cidr.split('/')
    const prefixLength = parseInt(ips[1], 10);

    // 创建一个32位的二进制字符串，前缀长度位为1，其余为0
    let maskBits = '1'.padStart(prefixLength, '1').padEnd(32, '0');

    // 将二进制字符串转换为四个八位组的数组
    let octets = [];
    for (let i = 0; i < 4; i++) {
        octets.push(parseInt(maskBits.slice(i * 8, (i + 1) * 8), 2));
    }

    // 将数组转换为点分十进制格式的字符串
    return ips[0] + " " + octets.join('.');
}

function fortinet_mpls001getList() {
    let str = $("#config_textarea").val().replaceAll(' ','').replaceAll('：',':').replaceAll(';','');;
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
                "pelo":[],
                "celo":[],
                "peas":[],
                "ceas":[],
                "pub":[],
                "route":[],
                "psk":[],
                "other":[],
            };
    for(let i = 0; i < lines.length; i++) {
        let line = lines[i]
        if(line!==""){
            let l = line.split(":");
            let l0 = l[0].toLowerCase();
            let l1 = l[1];
            if(ipv4_regex2.test(l1)){
                console.log(l1);
            }
            let html =  "<option value='"+ l1 +"'>"+ line +"</option>";
            console.log(l0)
            switch(l0){
                case 'lineid':
                    info_json.id.push(l1);
                    break;
                case 'pe':
                    info_json.pe.push(l1);
                    break;
                case 'tunnel':
                    info_json.if.push(l1);
                    break;
                case 'wanip':
                    info_json.ip.push(l1);
                    break;
                case 'pe对接':
                    info_json.pelo.push(l1);
                    break;
                case 'ce对接':
                    info_json.celo.push(l1);
                    break;
                case 'peas号':
                    info_json.peas.push(l1);
                    break;
                case 'ceas号':
                    info_json.ceas.push(l1);
                    break;
                case '拨号ip':
                    info_json.pub.push(l1);
                    break;
                case '秘钥':
                    info_json.psk.push(l1);
                    break;
                default:
                    if(l0.search('as')!=-1){
                        info_json.route.push(l1);
                    }
                    info_json.other.push(l1);
            }
        }
    }
    console.log(info_json);
    let site1id = info_json.id[0].replace(/[0-9]+/g,"");
    let site1num = getColNum(site1id);
    $("#site1_id_input").val(info_json.id[0]);
    $("#site2_id_input").val(info_json.id[1]);
    $("#line1_input").val(info_json.id[0]);
    $("#pe1_input").val(info_json.pe[0]);
    $("#pe1_if_input").val(info_json.if[0]);
    $("#pe1_ip_input").val(info_json.ip[0]);
    $("#pe1_pub_input").val(info_json.pub[0]);
    $("#pe1_lo_input").val(info_json.pelo[0]);
    $("#ce1_lo_input").val(info_json.celo[0]);
    $("#pe1_as_input").val(info_json.peas[0]);
    $("#ce1_as_input").val(info_json.ceas[0]);
    $("#pe1_psk_input").val(info_json.psk[0]);
    $("#line2_input").val(info_json.id[1]);
    $("#pe2_input").val(info_json.pe[1]);
    $("#pe2_if_input").val(info_json.if[1]);
    $("#pe2_ip_input").val(info_json.ip[1]);
    $("#pe2_pub_input").val(info_json.pub[1]);
    $("#pe2_lo_input").val(info_json.pelo[1]);
    $("#ce2_lo_input").val(info_json.celo[1]);
    $("#pe2_as_input").val(info_json.peas[1]);
    $("#ce2_as_input").val(info_json.ceas[1]);
    $("#pe2_psk_input").val(info_json.psk[1]);

}
//填充模板表格
$("#service_dev").append(fortinet_mpls001html);
//加载测试资源的解析数据
fortinet_mpls001getList();
function fortinet_mpls001setWan1type(value){
    $("#wan1_setup_tr").empty();
    let html = '';
    switch(value){
        case "dhcp":
            console.log(value);
            html += ``;
            break;
        case "static":
            console.log(value);
             html += `<td><input id="wan1_ip_input" placeholder="wan x.x.x.x/xx" required></td><td><input id="wan1_gw_input" placeholder="wan x.x.x.x/xx" required></td>`;
            break;
        case "pppoe":
            console.log(value);
            html += `<td><input id="wan1_pppoe_account_input" placeholder="wan pppoe account" required></td><td><input id="wan1_pppoe_password_input" placeholder="wan pppoe password" required></td>`;
            break;
    }
    console.log(html);
    $("#wan1_setup_tr").append(html);
};


function fortinet_mpls001sub(url){
  let user = $("#user_input").val();
  let time=getTime(new Date());
  let wan1 = $("#wan1_select").val();
  let line1 = $("#line1_input").val();
  let line2 = $("#line1_input").val();
  let lineid = line1.substr(0,7);
  let cid = line1.substr(0,6);
  let pe1 = $("#pe1_input").val();
  let pe1if = $("#pe1_if_input").val();
  let pe1ips = ipNext($("#pe1_ip_input").val().split('/')[0]);
  let pe1ip1 = pe1ips[0];
  let pe1ip2 = pe1ips[1];
  let pe1lo = $("#pe1_lo_input").val();
  let pe1pub = $("#pe1_pub_input").val();
  let pe1psk = $("#pe1_psk_input").val();
  let ce1lo = $("#ce1_lo_input").val();
  let ce1as = $("#ce1_as_input").val();
  let pe1as = $("#pe1_as_input").val();

  let pe2 = $("#pe2_input").val();
  let pe2if = $("#pe2_if_input").val();
  let pe2ips = ipNext($("#pe2_ip_input").val().split('/')[0]);
  let pe2ip1 = pe2ips[0];
  let pe2ip2 = pe2ips[1];
  let pe2lo = $("#pe2_lo_input").val();
  let pe2pub = $("#pe2_pub_input").val();
  let pe2psk = $("#pe2_psk_input").val();
  let ce2lo = $("#ce2_lo_input").val();
  let ce2as = $("#ce2_as_input").val();
  let pe2as = $("#pe2_as_input").val();
  let fmg_ip = $("#fmg_ip_input").val();
  let faz_ip = $("#faz_ip_input").val();
  let lan1 = $("#lan1_select").val();
  let lan1ip =  $("#lan1_ip_input").val();
  let lan1ipmask = cidrToSubnetMask(lan1ip);
  let subnet1 = $("#subnet1_input").val();
  let subnet2 = $("#subnet2_input").val();
  let subnet1ipmask = cidrToSubnetMask(subnet1);
  let subnet2ipmask = cidrToSubnetMask(subnet2);
  let wan1type = $("#wan1_type_select").val();
  console.log(wan1type);
  let wan_route_temp = '';
if(wan1type=='dhcp'){
    wan_route_temp =
`# WAN dhcp
config system interface
    edit "${wan1}"
        set vdom "root"
        set mode dhcp
    end
# 静态路由
# IPsec 公网路由
config router static
    edit 0
        set dstaddr "ipsec_main_pub"
        set device "${wan1}"
        set dynamic-gateway enable
    next
    edit 0
        set dstaddr "ipsec_back_pub"
        set device "${wan1}"
        set dynamic-gateway enable
    next
end
`;
}else if(wan1type=='static'){
    let wan1ip = $("#wan1_ip_input").val();
    let wan1gw = $("#wan1_gw_input").val();
    let wan1ipmask = cidrToSubnetMask(wan1ip);
    console.log(wan1ipmask);
    wan_route_temp =
`# WAN接口配置
config system interface
    edit "${wan1}"
        set vdom "root"
        set ip ${wan1ipmask}
        set allowaccess https ssh
        set type physical
    next
end
# 静态路由配置
config router static
    edit 0
        set gateway ${wan1gw}
        set device "${wan1}"
    next
end
# 静态路由
# IPsec 公网路由
config router static
    edit 0
        set dstaddr "ipsec_main_pub"
        set device "${wan1}"
        set gateway ${wan1gw}
    next
    edit 0
        set dstaddr "ipsec_back_pub"
        set device "${wan1}"
        set gateway ${wan1gw}
    next
end
`;
}else if(wan1type=='pppoe'){
    let wan1account = $("#wan1_pppoe_account_input").val();
    let wan1password = $("#wan1_pppoe_password_input").val();
    wan_route_temp =
`config system pppoe-interface
    edit "pppoe"
        set device "${wan1}"
        set username "${wan1account}"
        set password "${wan1password}"
    next
end
# 静态路由
# IPsec 公网路由
config router static
    edit 0
        set dstaddr "ipsec_main_pub"
        set device "${wan1}"
        set dynamic-gateway enable
    next
    edit 0
        set dstaddr "ipsec_back_pub"
        set device "${wan1}"
        set dynamic-gateway enable
    next
end
`;
}
  let fortinet_mpls001mplsGreOverIPsec  =
`# Fortinet MPLS GRE Over Ipsec Template.
# fortinet_mpls001
# Operator: ${user}
# ${time.cn}
# 用户配置
config system admin
    edit "admin"
        set accprofile "super_admin"
        set vdom "root"
        set password ENC SH2oRWvJuasrkgOrUB5cR/J0Zfp0eYblJ3SlZp+6c7aQ9ahe0qe3O5x28h8DD0=
    next
end
config system admin
    edit "bothwin"
        set accprofile "super_admin"
        set vdom "root"
        set password ENC SH2/LnffS6T+1Hrln3bVsKSAz5XNgioOMAcb2zO5Z9BLNfIznClPW05RfKZ/cQ=
    next
end
# 系统配置
config system global
    set admin-port 8480
    set admin-sport 8443
    set admin-ssh-port 2707
    set admintimeout 60
    set language simch
    set timezone 55
end
# LAN接口
config system interface
    edit "${lan1}"
        set vdom "root"
        set ip ${lan1ipmask}
        set allowaccess ping https ssh http speed-test
    next
end
# DNS
config system dns
    set primary 223.5.5.5
    set secondary 223.6.6.6
end
config system dns-server
    edit "lan"
    next
end
config system dns-database
    edit "google.com"
        set domain "google.com"
        set authoritative disable
        set forwarder "8.8.8.8" "8.8.4.4"
    next
end
# 可见功能
config system settings
    set gui-dns-database enable
    set gui-load-balance enable
    set gui-local-in-policy enable
    set gui-dynamic-routing enable
    set gui-sslvpn-personal-bookmarks enable
    set gui-sslvpn-realms enable
    set gui-policy-based-ipsec enable
    set gui-spamfilter enable
    set gui-dlp-profile enable
    set gui-advanced-policy enable
    set gui-allow-unnamed-policy enable
    set gui-multiple-interface-policy enable
    set gui-policy-disclaimer enable
end
# IP地址对象添加
config firewall address
    edit "10.0.0.0/8"
        set subnet 10.0.0.0/8
        set allow-routing enable
    next
    edit "172.16.0.0/12"
        set subnet 172.16.0.0/12
        set allow-routing enable
    next
    edit "192.168.0.0/16"
        set subnet 192.168.0.0/16
        set allow-routing enable
    next
end
config firewall address
    edit "ipsec_main_pub"
        set subnet ${pe1pub} 255.255.255.255
        set allow-routing enable
    next
end
config firewall address
    edit "ipsec_main_remote"
        set subnet ${pe1lo} 255.255.255.255
        set allow-routing enable
    next
end
config firewall address
    edit "ipsec_main_local"
        set subnet ${ce1lo} 255.255.255.255
        set allow-routing enable
    next
end
config firewall address
    edit "ipsec_back_pub"
        set subnet ${pe2pub} 255.255.255.255
        set allow-routing enable
    next
end
config firewall address
    edit "ipsec_back_remote"
        set subnet ${pe2lo} 255.255.255.255
        set allow-routing enable
    next
end
config firewall address
    edit "ipsec_back_local"
        set subnet ${ce2lo} 255.255.255.255
        set allow-routing enable
    next
end
config firewall address
    edit "fnet_celo"
        set allow-routing enable
        set subnet 192.168.55.250 255.255.255.255
    next
end
config firewall address
    edit "fnet_monitor1"
        set allow-routing enable
        set subnet 192.168.55.10 255.255.255.255
    next
end
config firewall address
    edit "fnet_monitor2"
        set allow-routing enable
        set subnet 192.168.55.11 255.255.255.255
    next
end
config firewall address
    edit "fnet_pub_monitor1"
        set allow-routing enable
        set subnet 114.113.245.99 255.255.255.255
    next
end
config firewall address
    edit "fnet_pub_monitor2"
        set allow-routing enable
        set subnet 114.113.245.100 255.255.255.255
    next
end
config system interface
    edit "lo1"
        set vdom "root"
        set ip ${ce1lo} 255.255.255.255
        set allowaccess ping
        set type loopback
        set alias "ipsec_main_local"
        set role lan
    next
end
config system interface
    edit "lo2"
        set vdom "root"
        set ip ${ce2lo} 255.255.255.255
        set allowaccess ping
        set type loopback
        set alias "ipsec_back_local"
        set role lan
    next
end
# IPsec 一阶配置，WAN口非公网IP，需要开启NAT穿越。
config vpn ipsec phase1-interface
    edit "ipsec_main"
        set interface "wan1"
        set ike-version 2
        set peertype any
        set net-device disable
        set proposal aes128-sha256 3des-sha1 aes128-sha1 3des-sha256
        set dhgrp 2
        set nattraversal enable
        set remote-gw ${pe1pub}
        set psksecret both-win
    next
end
config vpn ipsec phase1-interface
    edit "ipsec_back"
        set interface "wan1"
        set ike-version 2
        set peertype any
        set net-device disable
        set proposal aes128-sha256 3des-sha1 aes128-sha1 3des-sha256
        set dhgrp 2
        set nattraversal enable
        set remote-gw ${pe2pub}
        set psksecret both-win
    next
end
# IPsec 二阶配置
config vpn ipsec phase2-interface
    edit "ipsec_main"
        set phase1name "ipsec_main"
        set proposal 3des-sha1 aes128-sha256 aes128-sha1 3des-sha256
        set dhgrp 31 2
        set auto-negotiate enable
        set src-addr-type name
        set dst-addr-type name
        set src-name "ipsec_main_local"
        set dst-name "ipsec_main_remote"
    next
end
config vpn ipsec phase2-interface
    edit "ipsec_back"
        set phase1name "ipsec_back"
        set proposal 3des-sha1 aes128-sha256 aes128-sha1 3des-sha256
        set dhgrp 31 2
        set auto-negotiate enable
        set src-addr-type name
        set dst-addr-type name
        set src-name "ipsec_back_local"
        set dst-name "ipsec_back_remote"
    next
end
# WAN接口及路由
# IPsec 静态路由
# 0代表自动排序
${wan_route_temp}
# IPsec PE lo IP路由，黑洞路由保障IPsec断开后路由不可达。
config router static
    edit 0
        set dstaddr "ipsec_main_remote"
        set device "ipsec_main"
    next
    edit 0
        set dstaddr "ipsec_main_remote"
        set device "ipsec_main"
        set distance 255
        set blackhole enable
    next
    edit 0
        set dstaddr "ipsec_back_remote"
        set device "ipsec_back"
    next
    edit 0
        set dstaddr "ipsec_back_remote"
        set device "ipsec_back"
        set distance 255
        set blackhole enable
    next
end
# 防火墙放通IPsec接口，IPsec流量不需要记录日志
config firewall policy
    edit 0
        set name "ipsec_main_out"
        set srcintf "lo1"
        set dstintf "ipsec_main"
        set action accept
        set srcaddr "ipsec_main_local"
        set dstaddr "ipsec_main_remote"
        set schedule "always"
        set service "ALL"
        set logtraffic disable
    next
end
config firewall policy
    edit 0
        set name "ipsec_back_out"
        set srcintf "lo2"
        set dstintf "ipsec_back"
        set action accept
        set srcaddr "ipsec_back_local"
        set dstaddr "ipsec_back_remote"
        set schedule "always"
        set service "ALL"
        set logtraffic disable
    next
end
# 查看IPsec状态
get vpn ike gateway
get vpn ipsec tunnel details
# ping 测试，测试后还原
execute ping-options source ${ce1lo}
execute ping ${pe1lo}
execute ping-options source ${ce2lo}
execute ping ${pe2lo}
execute ping-options source Auto

# GRE 接口
# 先配置GRE，后自动生成同名GRE接口。
# 删除接口仅删除GRE即可。
config system gre-tunnel
    edit "mpls_main"
        set remote-gw ${pe1lo}
        set local-gw ${ce1lo}
    next
end
config system gre-tunnel
    edit "mpls_back"
        set remote-gw ${pe2lo}
        set local-gw ${ce2lo}
    next
end
config system interface
    edit "mpls_main"
        set vdom "root"
        set ip ${pe1ip2} 255.255.255.255
        set allowaccess ping https ssh http
        set type tunnel
        set remote-ip ${pe1ip1} 255.255.255.255
        set description "${pe1} ${pe1if}"
        set monitor-bandwidth enable
        set interface "ipsec_main"
    next
end
config system interface
    edit "mpls_back"
        set vdom "root"
        set ip ${pe2ip2} 255.255.255.255
        set allowaccess ping https ssh http
        set type tunnel
        set remote-ip ${pe2ip1} 255.255.255.255
        set description "${pe2} ${pe2if}"
        set monitor-bandwidth enable
        set interface "ipsec_back"
    next
end
# 添加Track 功能
config system link-monitor
    edit "mpls_main"
        set srcintf "mpls_main"
        set server "${pe1ip1}"
    next
    edit "mpls_back"
        set srcintf "mpls_back"
        set server "${pe2ip1}"
    next
end
# 查看Track状态
diagnose sys link-monitor status

# BGP允许发布内网路由 prefix-list
config router prefix-list
    edit "prefix_list_local_route"
        config rule
            edit 10
                set prefix ${subnet1ipmask}
            next
            edit 20
                set prefix ${subnet2ipmask}
            next
        end
    next
end
# BGP引入路由主备——基于本地优先级
# 默认200，本地优先级高的优先
config router route-map
    edit "bgp_route_map_mpls_main_in"
        config rule
            edit 100
                set set-local-preference 210
            next
        end
    next
    edit "bgp_route_map_mpls_back_in"
        config rule
            edit 100
            next
        end
    next
end
config router bgp
    set as ${ce1as}
    set router-id ${pe1ip2}
    set holdtime-timer 15
    config neighbor
        edit "${pe1ip1}"
            set soft-reconfiguration enable
            set prefix-list-out "prefix_list_local_route"
            set remote-as ${pe1as}
           set route-map-in "bgp_route_map_mpls_main_in"
            set update-source "mpls_main"
        next
        edit "${pe2ip1}"
            set soft-reconfiguration enable
            set prefix-list-out "prefix_list_local_route"
            set remote-as ${pe2as}
            set route-map-in "bgp_route_map_mpls_back_in"
            set update-source "mpls_back"
        next
    end
    config network
        edit 0
            set prefix ${subnet1ipmask}
        next
        edit 0
            set prefix ${subnet2ipmask}
        next
    end
end
# FMG FAZ
config system central-management
    set type fortimanager
    set fmg "${fmg_ip}"
end
config log fortianalyzer setting
    set status enable
    set server "${faz_ip}"
end
`;
  let scriptName = `${line1}-Fortinet-MPLS-GRE-Over-IPsec-Config-${time.ez}-By-${user}`;
  console.log(fortinet_mpls001mplsGreOverIPsec);
  downloadConfig(scriptName, fortinet_mpls001mplsGreOverIPsec);
};