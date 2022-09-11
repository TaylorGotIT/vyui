import os
from abc import ABC
import tornado.ioloop
import tornado.web
from tornado.web import RequestHandler
from tornado.web import authenticated as authed
from dbLocal import userAuthList, ifList
import json
from tornado.escape import json_encode
from tornado.template import Template, Loader
import subprocess

class VYreq(RequestHandler):
    def get_current_user(self):
        return self.get_secure_cookie("user")

    def get_req_json(self):
        return json.loads(self.request.body.decode('utf-8'))

    def write_json(self, d):
        self.set_header('Content-Type', 'application/json')
        self.write(json.dumps(d))
        print('write_json')


class VYHome(VYreq):
    @authed
    def get(self):
        self.render("temp/home.html", title="VYHome UI", uname=self.current_user, iflist=ifList)

    @authed
    def post(self):
        json_obj = self.get_req_json()
        if json_obj['act']:
            uname = json_obj['username']

    @authed
    def delete(self):
        json_obj = self.get_req_json()
        if json_obj['act']:
            uname = json_obj['username']
            self.write('home delete')


class VYAutoScript(VYreq):
    @authed
    def get(self):
        self.render("temp/autoScript.html", title="AutoScript", uname=self.current_user)

    @authed
    def post(self):
        json_obj = self.get_req_json()
        if json_obj['act']:
            uname = json_obj['username']

    @authed
    def delete(self):
        json_obj = self.get_req_json()
        if json_obj['act']:
            uname = json_obj['username']
            self.write('home delete')


class VYLogin(VYreq, ABC):
    def get(self):
        self.render("temp/login.html", title="VYLogin UI")

    def post(self):
        j = self.get_req_json()
        if j['username'] and j['password']:
            uname = j['username']
            upass = j['password']
            if userAuthList.get(uname) == upass:
                self.set_secure_cookie('user', uname)
                self.write_json({
                    'uname': uname,
                    'authed': True,
                    'url': '/'
                })
            else:
                self.write_json({
                    'msg': "wrong!",
                    'authed': False,
                })
        else:
            self.write_json({
                'msg': "invalid",
                'authed': False,
            })

    @authed
    def delete(self):
        username = self.get_current_user()
        print(username)
        self.clear_cookie('user')
        self.set_header('Content-Type', 'application/json')
        output = json.dumps({'authed': False, 'url': '/login'})
        self.write(output)


class VYUHome(VYreq, ABC):
    @authed
    def get(self):
        self.render("temp/userHome.html", title="VYUHome")

    @authed
    def post(self):
        json_str = self.request.body.decode('utf-8')
        json_obj = json.loads(json_str)
        if json_obj['username']:
            uname = json_obj['username']
            upass = json_obj['password']
            if userAuthList.get(uname) == upass:
                self.set_secure_cookie('user', uname)
                self.set_header('Content-Type', 'application/json')
                output = json.dumps({'authed': True, 'url': '/'})
                self.write(output)
            else:
                self.write("Wrong username or password!")
        else:
            self.redirect(r'/')

    @authed
    def delete(self):
        username = self.get_current_user()
        print(username)
        self.clear_cookie('user')
        self.set_header('Content-Type', 'application/json')
        output = json.dumps({'authed': False, 'url': '/login'})
        self.write(output)


class VYConfig(VYreq):
    @authed
    def get(self):
        self.write('get_config')

    @authed
    def post(self):
        self.write('post_config')


class VYwg(VYreq):
    def gen_wg_keys(self):
        k1 = subprocess.check_output("wg genkey", shell=True).decode("utf-8").strip()
        k2 = subprocess.check_output("echo %s | wg pubkey" % (k1,), shell=True).decode("utf-8").strip()
        return {'PrivateKey': k1, 'PublicKey': k2}

    def gen_preshared(self):
        k1 = subprocess.check_output("wg genkey", shell=True).decode("utf-8").strip()
        return {'PresharedKey': k1}

    @authed
    def get(self):
        self.render("temp/wg.html", title="WireGuard")

    @authed
    def post(self):
        j = self.get_req_json()
        c = int(j['client'])
        p = int(j['prekey'])
        s = int(j['server'])
        result = {
            'server': [],
            'client': [],
            'prekey': [],
        }
        print(j)
        if p == 1:
            prekey = self.gen_preshared()
            for i in range(c):
                result['prekey'].append(prekey)
        else:
            for i in range(c):
                result['prekey'].append(self.gen_preshared())
        for i in range(c):
            result['client'].append(self.gen_wg_keys())
        for i in range(s):
            result['server'].append(self.gen_wg_keys())

        self.write_json(result)


class VYExcel(VYreq):
    def gen_wg_keys(self):
        k1 = subprocess.check_output("wg genkey", shell=True).decode("utf-8").strip()
        k2 = subprocess.check_output("echo %s | wg pubkey" % (k1,), shell=True).decode("utf-8").strip()
        return {'PrivateKey': k1, 'PublicKey': k2}

    def gen_preshared(self):
        k1 = subprocess.check_output("wg genkey", shell=True).decode("utf-8").strip()
        return {'PresharedKey': k1}

    @authed
    def get(self):
        self.render("temp/excelHandler.html", title="ExcelHandler")

    @authed
    def post(self):
        j = self.get_req_json()
        c = int(j['client'])
        p = int(j['prekey'])
        s = int(j['server'])
        result = {
            'server': [],
            'client': [],
            'prekey': [],
        }
        print(j)
        if p == 1:
            prekey = self.gen_preshared()
            for i in range(c):
                result['prekey'].append(prekey)
        else:
            for i in range(c):
                result['prekey'].append(self.gen_preshared())
        for i in range(c):
            result['client'].append(self.gen_wg_keys())
        for i in range(s):
            result['server'].append(self.gen_wg_keys())

        self.write_json(result)



settings = {
    "cookie_secret": "__TODO:_GENERATE_YOUR_OWN_RANDOM_VALUE_HERE__",
    "login_url": "/login",
}

if __name__ == "__main__":
    app = tornado.web.Application([
        (r"/", VYHome),
        (r"/autoScript", VYAutoScript),
        (r"/login", VYLogin),
        (r"/user", VYUHome),
        (r"/config", VYConfig),
        (r"/wg", VYwg),
        (r"/excel", VYExcel),
        (r'/static/(.*)', tornado.web.StaticFileHandler, {'path': os.path.join(os.path.dirname(__file__), './static')}),
        (r'/temp/(.*)', tornado.web.StaticFileHandler, {'path': os.path.join(os.path.dirname(__file__), './temp')})
    ], **settings)
    app.listen(80)
    tornado.ioloop.IOLoop.current().start()
