/* Wireguard Linux 单服务端 */
const wg101html = `<table border="1">
<tr><td>服务端描述</td>
<td><input maxlength="32" id="server_desc_input" value="WG_65000A_GZ"></td>
</tr>
<tr><td>服务端公钥</td>
<td><textarea id="server_pubkey_textarea" rows="2" cols="21"></textarea></td>
<tr><td>服务端端口</td>
<td>
<input type="number" id="server_port_input" min="49152" max="65535" value="51820">
</td>
</tr>
<tr>
<td>客户端范围</td>
<td>
<input type="number" id="client_start_input" min="1" max="1024" value="0">
<input type="number" id="client_end_input" min="1" max="1024" value="9">
</td>
</tr>
<tr>
<td>客户端子网</td>
<td><input maxlength="64" id="client_subnet_input" value=100.64.1.0/24></td>
</tr>
<tr>
<td>客户端起始IP</td>
<td><input maxlength="64" id="client_ip_start_input" value=100.64.1.2/24></td>
</tr>
<tr>
<td>客户端描述</td>
<td><input maxlength="32" id="client_desc_input" placeholder="Client Description"></td>
</tr>
<tr>
<td>客户端放通路由</td>
<td>
<textarea id="client_allowed_ip_textarea" maxlength="128" rows="5" cols="21">1.0.0.0/8, 2.0.0.0/7, 4.0.0.0/6, 8.0.0.0/5, 16.0.0.0/4, 32.0.0.0/3, 64.0.0.0/2, 128.0.0.0/1 </textarea>
</td>
</tr>
<tr>
<td>客户端DNS</td>
<td><input maxlength="128" id="client_dns_input" value="8.8.8.8,8.8.4.4"></td>
</tr>
<tr>
<td>客户端MTU</td>
<td>
<input type="number" id="client_mtu_input" min="1200" max="1500" value="1420">
</td>
</tr>
<tr>
<td>预共享密钥</td>
<td><select id="client_prekey_select">
        <option value=1 selected="selected">共用</option>
        <option value=0 >独立</option>
    </select></td>
</tr>
<tr>
<td>客户端拨入端口</td>
<td><input id="client_endpoint_input"  maxlength="64"  value="192.168.1.1:51820"></td>
</tr>
<td>客户端保活间隔</td>
<td><input id="client_keepalive_input" type="number" min="1" max="30" value="30"></td>
</tr>
</table>

<button type="button" onclick="wg101sub('/wg')">自动生成WireGuard配置</button>

<div id="wg101qrcode"></div>
`;



function wg101sub(url){
  let server = 1;
  let client = $("#client_end_input").val() - $("#client_start_input").val() + 1;
  console.log(client);
  let prekey = $("#client_prekey_select").val();
  if(prekey == 0){
    prekey+=client
  };
  console.log(prekey);
  let type = 'post';
  let datatype = 'json';
  let data = JSON.stringify({
    "server": server,
    "client": client,
    "prekey": prekey,
  });
  $.ajax({
    url:url,
    data:data,
    dataType:datatype,
    type:type,
    success:function(d){
      console.log(d);
      genWgConfig(d);
    },
  });
}

function genWgConfig(d){
  let s = d.server;
  let c = d.client;
  let p = d.prekey;
  //服务端
  let s_desc = $("#server_desc_input").val();
  let s_address = '100.64.1.1/24';
  let s_pubkey = $("#server_pubkey_textarea").val();
  let s_port = $("#server_port_input").val();
  let s_allowed_ips = $("#server_allowed_ips_input").val();

  //客户端
  let c_desc = $("#client_desc_input").val();
  let c_start = parseInt($("#client_start_input").val());
  let c_ip_start =  $("#client_ip_start_input").val();
  let c_allowed_ips = $("#client_allowed_ip_textarea").val();
  let c_dns = $("#client_dns_input").val();
  let c_mtu = $("#client_mtu_input").val();
  let c_endpoint = $("#client_endpoint_input").val();
  let c_keepalive = $("#client_keepalive_input").val();

  let s_peers = '';
  let c_peers = '';
  let clients = [];
  let servers = [];
  let list = {
    'server':{},
    'client':{},
  };
  let c_ips = getIPAll(c_ip_start,c.length);
  console.log(c_ips);
  for(var i=0;i<s.length;i++){
    for(var j=0;j<c.length;j++){
let c_num = c_start + j;
let s_peer =`
set interfaces wireguard wg${i} peer ${c_desc}${c_num} allowed-ips ${c_ips[j]}
set interfaces wireguard wg${i} peer ${c_desc}${c_num} persistent-keepalive ${c_keepalive}
set interfaces wireguard wg${i} peer ${c_desc}${c_num} preshared-key ${p[j].PresharedKey}
set interfaces wireguard wg${i} peer ${c_desc}${c_num} pubkey ${c[j].PublicKey }
`;

let c_if =
`#S${ i }Client${ c_num }.conf
#PublicKey = ${ c[j].PublicKey }
[Interface]
PrivateKey = ${ c[j].PrivateKey }
Address = ${ c_ips[j] }
DNS = ${ c_dns }
MTU = ${ c_mtu }

[Peer]
PublicKey = ${ s_pubkey }
PresharedKey = ${ p[j].PresharedKey }
AllowedIPs = ${ c_allowed_ips }
Endpoint = ${ c_endpoint }
PersistentKeepalive = ${ c_keepalive }`;

$('#wg101qrcode').append(`<dev id="qrcode${ i }${ j }"></dev>`);
$('#wg101qrcode').append(`<dev><a>[ Client${ i }-${ j } ]</a>
<pre backgroud-clo>${ c_if }<pre></dev>`);
let qrcode_dev = document.getElementById(`qrcode${ i }${ j }`);
new QRCode(qrcode_dev, c_if);
        clients.push(c_if)
        s_peers += s_peer;
//通过Canvas下载二维码
        let str = qrcode_dev.firstChild.toDataURL("image/png");
        let c_qrcode_name = `S${ i }Client${ c_num }.png`;
        downloadConfig(c_qrcode_name,str);
        let c_config_name = `S${ i }Client${ c_num }.conf`;
        downloadConfig(c_config_name,c_if);
    }

let s_if =
`#wg${ i }.conf
set interfaces wireguard wg${i} description ${ s_desc }
set interfaces wireguard wg${i} address ${ s_address }
set interfaces wireguard wg${i} port ${ s_port }

${ s_peers }
`;
let s_config_name = `wg${i}.conf`;
downloadConfig(s_config_name,s_if);
servers.push(s_if);
  }
console.log(clients);
console.log(servers);
}

function genQrcode(id,str){
  new QRCode($("#"+id), str);
}

$("#service_dev").append(wg101html);

