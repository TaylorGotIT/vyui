/* FastIP 假组网 CentOS GRE接入骨干 发布默认路由 */
const fastip301html = `<table border="1">
<tr>
<td>LineID</td>
<td><input id="lineid_input"></td>
<td><select id="version_select">
<option value="7" selected="selected">CentOS[ 7 ]</option>
<option value="8">CentOS[ 8 ]</option>
<option value="9">CentOS[ 9 ]</option></select></td>
</tr>
<tr>
<td>Company</td>
<td><input id="cname_input" placeholder="CompanyName[eg:Huawei]"></td>
<td><input id="area_input" placeholder="Area[GZ,SZ,SH,etc...]"></td>
</tr>
<tr>
<td>WAN</td>
<td><select id="wan1_select">
<option value="eth0" selected="selected">WAN1-ETH0</option>
<option value="eth1">WAN1-ETH1</option>
<option value="br0">WAN1-BR0</option>
<option value="br1">WAN1-BR1</option></select>
<select id="wan1_provider_select">
<option value="CT" selected="selected">电信[CT]</option>
<option value="CU">联通[CU]</option>
<option value="CM">移动[CM]</option></select></td>
<td><select id="wan1_type_select" onchange=fastip301setWan(this.value)>
<option value="dhcp" selected="selected">WAN Type[ DHCP ]</option>
<option value="static">WAN Type[ Static ]</option>
<option value="pppoe">WAN Type[ PPPoE ]</option></select></td></tr>
<tr id="wan1_input_tr">
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
<td>PE Pub</td>
<td><input id="pe1_pub_input" placeholder="PE1Pub[eg:x.x.x.x]"></td>
<td><input id="pe2_pub_input" placeholder="PE2Pub[eg:x.x.x.x]"></td>
</tr>
<tr>
<td>CE Pub</td>
<td><input id="ce1_pub_input" placeholder="CE1Pub[eg:x.x.x.x]"></td>
<td><input id="ce2_pub_input" placeholder="CE2Pub[eg:x.x.x.x]"></td>
</tr>
<tr>
<td>PE AS</td>
<td><input id="pe1_as_input" placeholder="PE1AS[eg:x.x.x.x]"></td>
<td><input id="pe2_as_input" placeholder="PE2AS[eg:x.x.x.x]"></td>
</tr>
<td>CE AS</td>
<td><input id="ce1_as_input" placeholder="CE1AS[eg:x.x.x.x]"></td>
<td><input id="ce2_as_input" placeholder="CE2AS[eg:x.x.x.x]"></td>
</tr>
</table>
<button type="button" onclick="fastip301sub('/config')">提交配置信息(Submit Config Info)</button>
`;

function fastip301getList() {
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
                    info_json.pub.push(l1);
                    break;
                case 'ce对接':
                    info_json.pub.push(l1);
                    break;
                case 'peas号':
                    info_json.as.push(l1);
                    break;
                case 'ceas号':
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
    $("#pe1_pub_input").val(info_json.pub[0]);
    $("#ce1_pub_input").val(info_json.pub[1]);
    $("#pe1_as_input").val(info_json.as[0]);
    $("#ce1_as_input").val(info_json.as[1]);

    $("#pe2_input").val(info_json.pe[1]);
    $("#pe2_if_input").val(info_json.if[1]);
    $("#pe2_ip_input").val(info_json.ip[1]);
    $("#pe2_pub_input").val(info_json.pub[2]);
    $("#ce2_pub_input").val(info_json.pub[3]);
    $("#pe2_as_input").val(info_json.as[2]);
    $("#ce2_as_input").val(info_json.as[3]);
  };
};

$("#service_dev").append(fastip301html);
//加载测试资源的解析数据
fastip301getList();

function fastip301setWan(value){
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

function fastip301sub(url){
  let user = $("#user_input").val();
  let time=getTime(new Date());
  let wan1 = $("#wan1_select").val();
  let wan1Type = $("#wan1_type_select").val();
  let wan1Provider = $("#wan1_provider_select").val();

  let version = $("#version_select").val();
  let lineid = $("#lineid_input").val();
  let cname = $("#cname_input").val();
  let area = $("#area_input").val();
//获取主线参数
  let pe1 = $("#pe1_input").val();
  let pe1if = "tun"+$("#pe1_if_input").val().match(/[1-9]\d+/)[0];
  let pe1ips = ipNext($("#pe1_ip_input").val().split('/')[0]);
  let pe1ip1 = pe1ips[0];
  let pe1ip2 = pe1ips[1];
  let pe1pub = $("#pe1_pub_input").val();
  let ce1pub = $("#ce1_pub_input").val();
  let pe1as = $("#pe1_as_input").val();
  let ce1as = $("#ce1_as_input").val();

//获取备线参数
  let pe2 = $("#pe2_input").val();
  let pe2if = "tun"+$("#pe2_if_input").val().match(/[1-9]\d+/)[0];
  let pe2ips = ipNext($("#pe2_ip_input").val().split('/')[0]);
  let pe2ip1 = pe2ips[0];
  let pe2ip2 = pe2ips[1];
  let pe2pub = $("#pe2_pub_input").val();
  let ce2pub = $("#ce2_pub_input").val();
  let pe2as = $("#pe2_as_input").val();
  let ce2as = $("#ce2_as_input").val();

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
// let diff1 = '';
switch(version){
    case "7":

    break;
    case "8":

    break;
    case "9":

    break;
  };
let fastip301centosGre  =
`#CentOS ${version} MPLS GRE Template.
#操作人员：${user}
#时间：${time.cn}
#系统：vyui-v1
#CentOS${version}
+++++++++++++++++++++++++++++++++++++++++++
echo '>>>清理旧配置！！！（非必须，除非使用过）'
rm -rf /etc/sysconfig/network-scripts/ifcfg-tun*
rm -rf /etc/openvpn/vtun*

echo '>>>更改主机名称'
hostnamectl set-hostname ${lineid}-${cname}-${area}

echo '>>>关闭SELinux和防火墙'
sed -i "s/SELINUX=enforcing/SELINUX=disabled/g" /etc/selinux/config
sed -i "s/SELINUX=permissive/SELINUX=disabled/g" /etc/selinux/config
setenforce 0
systemctl stop firewalld
systemctl disable firewalld

echo '>>>安装epel yum仓库、frr'
yum update -y
yum install -y epel-release
FRRVER="frr-stable"
curl -O https://rpm.frrouting.org/repo/$FRRVER-repo-1-0.el7.noarch.rpm
sudo yum install ./$FRRVER* -y
sudo yum install frr frr-pythontools -y

echo '>>>初始化FRR配置'
sed -i "s/net.ipv4.ip_forward = 1/net.ipv4.ip_forward = 0/g" /etc/sysctl.conf
sysctl -p
sed -i "s/bgpd=no/bgpd=yes/g" /etc/frr/daemons
sed -i "s/pathd=no/pathd=no\nservice integrated-vtysh-config/g" /etc/frr/daemons
systemctl restart frr
systemctl enable frr

echo '>>>PE1 ${pe1if}'
echo -e '#PE1-${pe1}-${pe1if}
DEVICE=${pe1if}
BOOTPROTO=static
ONBOOT=yes
DEVICETYPE=tunnel
TYPE=GRE
PEER_INNER_IPADDR=${pe1ip1}/30
PEER_OUTER_IPADDR=${pe1pub}
MY_INNER_IPADDR=${pe1ip2}/30
MY_OUTER_IPADDR=${ce1pub}' > /etc/sysconfig/network-scripts/ifcfg-${pe1if}

echo '>>>PE2 ${pe2if}'
echo -e '#PE2-${pe2}-${pe2if}
DEVICE=${pe2if}
BOOTPROTO=static
ONBOOT=yes
DEVICETYPE=tunnel
TYPE=GRE
PEER_INNER_IPADDR=${pe2ip1}/30
PEER_OUTER_IPADDR=${pe2pub}
MY_INNER_IPADDR=${pe2ip2}/30
MY_OUTER_IPADDR=${ce2pub}' > /etc/sysconfig/network-scripts/ifcfg-${pe2if}

ifup ${pe1if}
ifup ${pe2if}
# ifdown ${pe1if}
# ifdown ${pe2if}

echo '>>>FRR配置'
vtysh
configure
ip route 114.113.245.99/32  ${pe1if}
ip route 114.113.245.100/32 ${pe2if}
!
router bgp ${ce1as}
neighbor ${pe1ip1} remote-as ${pe1as}
neighbor ${pe1ip1} description Main
neighbor ${pe1ip1} ebgp-multihop 255
neighbor ${pe1ip1} update-source ${pe1ip2}
neighbor ${pe2ip1} remote-as ${pe2as}
neighbor ${pe2ip1} description Backup
neighbor ${pe2ip1} ebgp-multihop 255
neighbor ${pe2ip1} update-source ${pe2ip2}
!
address-family ipv4 unicast
redistribute connected
redistribute static
neighbor ${pe1ip1} default-originate
neighbor ${pe1ip1} soft-reconfiguration inbound
neighbor ${pe1ip1} allowas-in
neighbor ${pe1ip1} prefix-list AS${ce1as}-out-list out
neighbor ${pe1ip1} route-map ma-local-pref in
neighbor ${pe2ip1} default-originate
neighbor ${pe2ip1} soft-reconfiguration inbound
neighbor ${pe2ip1} allowas-in
neighbor ${pe2ip1} prefix-list AS${ce1as}-out-list out
neighbor ${pe2ip1} route-map bk-local-pref in
exit-address-family
!
ip prefix-list AS${ce1as}-out-list seq 10 permit 0.0.0.0/0
!
route-map AS${ce1as}-OUT permit 10
match ip address prefix-list AS${ce1as}-out-list
!
route-map bk-local-pref permit 10
set local-preference 50
!
route-map ma-local-pref permit 10
!
exit
show ip bgp summary
write file
write integrated
write memory
write terminal
exit

echo '>>>NAT上网'
yum install iptables-services -y
systemctl enable iptables
systemctl start iptables
iptables -F
iptables -L
iptables -t nat -F
iptables -t nat -L
iptables -t nat -A POSTROUTING -s 10.0.0.0/8 -o eth0 -j MASQUERADE
iptables -t nat -A POSTROUTING -s 172.16.0.0/12 -o eth0 -j MASQUERADE
iptables -t nat -A POSTROUTING -s 192.168.0.0/16 -o eth0 -j MASQUERADE
service iptables save
`;
  let filename = `${lineid}-假组网海外VPS-CentOS${version}-GRE-Config-${time.ez}-By-${user}`;
  let data = {};
  console.log(fastip301centosGre);
  downloadConfig(filename, fastip301centosGre);
  let type = 'post'
  let datatype = 'json';
  ajaxHandler(url,data,datatype,type);
};