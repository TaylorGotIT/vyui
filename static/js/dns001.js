/* SmartDNS 域名列表模板 */
const dns001html = `<table border="1">
<tr><td>国内列表</td>
<td><input type="file" id="fileInput" onchange="dns001GetTextFile(this.files[0])"></td>
</tr>
<tr>

<button type="button" onclick="dns001AddDomain('/wg')">添加新域名</button>
<button type="button" onclick="dns001TransToSmartDNSForm('/wg')"></button>
<button type="button" onclick="dns001TransToDnsmasqForm('/wg')"></button>
<div id="dns001qrcode"></div>
`;

// 读取text文件
function outputText(text) {
  console.log(text.name);
};

const dns_arr = [];
//读取上传text
function dns001GetTextFile(file){
  const reader = new FileReader();
  reader.readAsText(file);
    reader.onload = (event) => {
      let text = event.target.result;
      console.log(file);
      const lines = text.split('\n');
      for (i in lines) {
        const line = lines[i].trim();
        console.log(line);

      }
    };
};

function dns001AddDomain(url){
  let time = getTime(new Date());
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
  let dnsTemp = "";
  if(c_dns.length > 0){
    dnsTemp += `DNS = ${ c_dns }`;
  }
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
MTU = ${ c_mtu }
${ dnsTemp }
[Peer]
PublicKey = ${ s_pubkey }
PresharedKey = ${ p[j].PresharedKey }
AllowedIPs = ${ c_allowed_ips }
Endpoint = ${ c_endpoint }
PersistentKeepalive = ${ c_keepalive }`;

$('#dns001qrcode').append(`<dev id="qrcode${ i }${ j }"></dev>`);
$('#dns001qrcode').append(`<dev><a>[ Client${ i }-${ j } ]</a>
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

$("#service_dev").append(dns001html);

