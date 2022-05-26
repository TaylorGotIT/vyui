import os
from abc import ABC
import tornado.ioloop
import tornado.web
from tornado.web import RequestHandler
from tornado.web import authenticated as authed
from dbLocal import userAuthList, ifList
import json
from tornado.escape import json_encode


class VYreq(RequestHandler):
    def get_current_user(self):
        return self.get_secure_cookie("user")

    def get_req_json(self):
        return json.loads(self.request.body.decode('utf-8'))


class VYHome(VYreq):
    @authed
    def get(self):
        if not self.current_user:
            self.redirect("/login")
            return
        else:
            name = tornado.escape.xhtml_escape(self.current_user)
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


class VYLogin(VYreq, ABC):
    def get(self):
        self.render("temp/login.html", title="VYLogin UI")

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


settings = {
    "cookie_secret": "__TODO:_GENERATE_YOUR_OWN_RANDOM_VALUE_HERE__",
    "login_url": "/login",
}

if __name__ == "__main__":
    app = tornado.web.Application([
        (r"/", VYHome),
        (r"/login", VYLogin),
        (r"/config", VYConfig),
        (r'/static/(.*)', tornado.web.StaticFileHandler, {'path': os.path.join(os.path.dirname(__file__), './static')}),
        (r'/temp/(.*)', tornado.web.StaticFileHandler, {'path': os.path.join(os.path.dirname(__file__), './temp')})
    ], **settings)
    app.listen(80)
    tornado.ioloop.IOLoop.current().start()
