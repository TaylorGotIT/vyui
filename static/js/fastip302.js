/* CentOS FastIP 假组网 海外VPS GRE Over OpenVPN */
const fastip302html = `<table border="1">
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
<tr>
<td>PE</td>
<td><input id="pe1_input"></td>
<td><input id="pe2_input"></td>
</tr>
<tr>
<td>PE IF</td>
<td><input id="pe1_if_input"></td>
<td><input id="pe2_if_input"></td>
</tr>
<tr>
<td>PE IP</td>
<td><input id="pe1_ip_input"></td>
<td><input id="pe2_ip_input"></td>
</tr>
<tr>
<td>PE loip</td>
<td><input id="pe1_lo_input"></td>
<td><input id="pe2_lo_input"></td>
</tr>
<tr>
<td>PE AS</td>
<td><input id="pe1_as_input"></td>
<td><input id="pe2_as_input"></td>
</tr>
<tr>
<td>CE AS</td>
<td><input id="ce1_as_input"></td>
<td><input id="ce2_as_input"></td>
</tr>
<tr>
<td>AC</td>
<td><input id="ac1_input"></td>
<td><input id="ac2_input"></td>
</tr>
<tr>
<td>AC IF</td>
<td><input id="ac1_if_input"></td>
<td><input id="ac2_if_input"></td>
</tr>
<tr>
<td>AC IP</td>
<td><input id="ac1_ip_input"></td>
<td><input id="ac2_ip_input"></td>
</tr>
<tr>
<td>AC Pub</td>
<td><input id="ac1_pub_input"></td>
<td><input id="ac2_pub_input"></td>
</tr>
</table>
<button type="button" onclick="fastip302sub('/config')">提交配置信息(Submit Config Info)</button>
`;

function fastip302getList() {
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
                    if(l1.includes('upe')){
                        info_json.pe.push(l1);
                    }else{
                        info_json.ac.push(l1);
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
                case 'pedocking':
                    info_json.pelo.push(l1);
                    break;
                case 'cedocking':
                    info_json.celo.push(l1);
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
                        if(l0.search('natpe')!=-1){
                            info_json.natpe.push(l0);
                        }
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
    $("#pe1_as_input").val(info_json.as[0]);
    $("#ce1_as_input").val(info_json.as[1]);
    $("#ac1_input").val(info_json.ac[0]);
    $("#ac1_if_input").val(info_json.if[1]);
    $("#ac1_ip_input").val(info_json.ip[1]);
    $("#ac1_pub_input").val(info_json.pub[0]);

    $("#pe2_input").val(info_json.pe[1]);
    $("#pe2_if_input").val(info_json.if[2]);
    $("#pe2_ip_input").val(info_json.ip[2]);
    $("#pe2_lo_input").val(info_json.lo[2]);
    $("#pe2_as_input").val(info_json.as[2]);
    $("#ce2_as_input").val(info_json.as[3]);
    $("#ac2_input").val(info_json.ac[1]);
    $("#ac2_if_input").val(info_json.if[3]);
    $("#ac2_ip_input").val(info_json.ip[3]);
    $("#ac2_pub_input").val(info_json.pub[1]);
  };
};

$("#service_dev").append(fastip302html);
//加载测试资源的解析数据
fastip302getList();

function fastip302sub(url){
  let user = $("#user_input").val();
  let time=getTime(new Date());
  let cname = $("#cname_input").val();
  let area = $("#area_input").val().toUpperCase();
  let lineid = $("#lineid_input").val();
  let version = $("#version_select").val();

//获取主线参数
  let pe1 = $("#pe1_input").val();
  let pe1if = 'tun'+$("#pe1_if_input").val().match(/[1-9]\d+/)[0];
  let pe1ips = ipNext($("#pe1_ip_input").val().split('/')[0]);
  let pe1ip1 = pe1ips[0];
  let pe1ip2 = pe1ips[1];
  let pe1lo = $("#pe1_lo_input").val();
  let pe1as = $("#pe1_as_input").val();
  let ce1lo = $("#ce1_lo_input").val();
  let ce1as = $("#ce1_as_input").val();

  let ac1 = $("#ac1_input").val();
  let ac1if = $("#ac1_if_input").val();
  let ac1port = ac1if.replace('vtun','');
  let ac1ips = ipNext($("#ac1_ip_input").val().split('/')[0]);
  let ac1ip1 = ac1ips[0];
  let ac1ip2 = ac1ips[1];
  let ac1pub = $("#ac1_pub_input").val();
//获取备线参数
  let pe2 = $("#pe2_input").val();
  let pe2if = 'tun'+$("#pe2_if_input").val().match(/[1-9]\d+/)[0];
  let pe2ips = ipNext($("#pe2_ip_input").val().split('/')[0]);
  let pe2ip1 = pe2ips[0];
  let pe2ip2 = pe2ips[1];
  let pe2lo = $("#pe2_lo_input").val();
  let pe2as = $("#pe2_as_input").val();
  let ce2lo = $("#ce2_lo_input").val();
  let ce2as = $("#ce2_as_input").val();
  let ac2 = $("#ac2_input").val();
  let ac2if = $("#ac2_if_input").val();
  let ac2port = ac2if.replace('vtun','');
  let ac2ips = ipNext($("#ac2_ip_input").val().split('/')[0]);
  let ac2ip1 = ac2ips[0];
  let ac2ip2 = ac2ips[1];
  let ac2pub = $("#ac2_pub_input").val();

let fastip302fastipGreOverOpenvpn  =
`#CentOS${version} MPLS with GRE Over OpenVPN Template.
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

echo '关闭SELinux和防火墙'
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

echo '>>>安装OpenVPN'
yum install -y openssl lzo pam openssl-devel lzo-devel pam-devel
yum install -y easy-rsa
yum install -y openvpn

echo '>>>添加 OpenVPN key文件'
echo -e '#
# 2048 bit OpenVPN static key
#
-----BEGIN OpenVPN Static key V1-----
bc128dc962ec1c5956a642eb25b10d95
9e790198c6de25499ba6509cf3e2fd3a
1f5334ef62335dd1f159f12614c77d6a
889796c5bc237daccab9d625f8ec59f3
7f4fcca623ef92039a890d4b5de87274
1cb7ef76f2b1d7f007ee027e57113d4f
351a17e4ed101f6104073bfebc840daf
50fe3186e7684ab114777c19f2d1c017
c426d01dcb1d28ec16b667d9abbf5061
925f41b0d09a282b237668f8537cc9e1
db2677d56ff740f82fa9ed370b5ca4a8
f6408893e8cd15fd908eafe15599aea0
cd42d72be9175d63776190ca0ffd4c04
e1ac42d0ff91aeaf2c7f2ec06f813d61
5b9731ebe9a00ef4ebb74e92d23019e5
d4c80805afe6e66b14f3066e134cc859
-----END OpenVPN Static key V1-----' > /etc/openvpn/openvpn.secret

echo '>>>AC1 ${ac1if}'
echo -e '#AC1-${ac1}-${ac1if}
dev-type tun
dev ${ac1if}
remote ${ac1pub}
lport ${ac1port}
rport ${ac1port}
ifconfig ${ac1ip2} ${ac1ip1}
ping 10
ping-restart 60
push "ping 10"
push "ping-restart 60"
push "persist-tun"
push "persist-key"
persist-tun
secret /etc/openvpn/openvpn.secret
writepid /var/run/openvpn-server/${ac1if}.pid
status /var/run/openvpn-server/${ac1if}.status 30
verb 3' > /etc/openvpn/${ac1if}.conf

echo '>>>AC2 ${ac2if}'
echo -e '#AC2-${ac2}-${ac2if}
dev-type tun
dev ${ac2if}
remote ${ac2pub}
lport ${ac2port}
rport ${ac2port}
ifconfig ${ac2ip2} ${ac2ip1}
ping 10
ping-restart 60
push "ping 10"
push "ping-restart 60"
push "persist-tun"
push "persist-key"
persist-tun
secret /etc/openvpn/openvpn.secret
writepid /var/run/openvpn-server/${ac2if}.pid
status /var/run/openvpn-server/${ac2if}.status 30
verb 3' > /etc/openvpn/${ac2if}.conf

echo '>>>启动&开机自启OpenVPN'
systemctl start openvpn@${ac1if}
systemctl start openvpn@${ac2if}
systemctl enable openvpn@${ac1if}
systemctl enable openvpn@${ac2if}
# systemctl stop openvpn@${ac1if}
# systemctl stop openvpn@${ac2if}

echo '>>>PE1 ${pe1if}'
echo -e '#PE1-${pe1}-${pe1if}
DEVICE=${pe1if}
BOOTPROTO=static
ONBOOT=yes
DEVICETYPE=tunnel
TYPE=GRE
PEER_INNER_IPADDR=${pe1ip1}/30
PEER_OUTER_IPADDR=${pe1lo}
MY_INNER_IPADDR=${pe1ip2}/30
MY_OUTER_IPADDR=${ac1ip2}' > /etc/sysconfig/network-scripts/ifcfg-${pe1if}

echo '>>>PE2 ${pe2if}'
echo -e '#PE2-${pe2}-${pe2if}
DEVICE=${pe2if}
BOOTPROTO=static
ONBOOT=yes
DEVICETYPE=tunnel
TYPE=GRE
PEER_INNER_IPADDR=${pe2ip1}/30
PEER_OUTER_IPADDR=${pe2lo}
MY_INNER_IPADDR=${pe2ip2}/30
MY_OUTER_IPADDR=${ac2ip2}' > /etc/sysconfig/network-scripts/ifcfg-${pe2if}

echo '>>>启动GRE'
ifup ${pe1if}
ifup ${pe2if}
# ifdown ${pe1if}
# ifdown ${pe2if}

echo '>>>FRR配置'
vtysh
configure
ip route ${pe1lo}/32 ${ac1if}
ip route ${pe2lo}/32 ${ac2if}
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
  let filename = `${lineid}-假组网海外VPS-CentOS${version}-GREOverOpenVPN-Config-By-${user}-${time.ez}`;
  let data = {};
  console.log(fastip302fastipGreOverOpenvpn);
  downloadConfig(filename, fastip302fastipGreOverOpenvpn);
  let type = 'post'
  let datatype = 'json';
  ajaxHandler(url,data,datatype,type);
};