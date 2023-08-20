from bs4 import BeautifulSoup
import requests
import hashlib
import flask
import json
from flask import send_file, request, render_template, session, url_for
import glob


def checkForUpdates(cd,hash=None):
    """
        This checks for changes in the site.
        Instead of comparing old and new HTML code, a MD5 hash will be generated with the code as an input.
        Only the hash will be stored (to save space). To check for changed the hash generated again and compared.

    """
    hs = hashlib.md5(cd.encode()).hexdigest()
    if hash != hs:
        return True,hs
    return False,hash


# def parse(txt):
#     s = BeautifulSoup(txt, "html.parser")
#     for c in s.find("div",class_="container").children:
#         try:
#             w = c.find_next("div",class_="col-sm-10")
#             print([x for x in w.children][0].strip())
#             print([x['href'] for x in w.findChildren("a")])
#             print(c.find_next("div",class_="col-sm-2").text)
#             print("_______________________________________")
#         except:
#             pass

def parse(c,lst):
    s = BeautifulSoup(c, "html.parser")
    vpt = s.find(lst[0][0], lst[0][1])
    r = []
    # implement checkForUpdates
    for cp in vpt.findChildren(lst[2][0], lst[2][1]):
        r.append([cp.findChild(lst[3][0], lst[3][1]).text, cp.findChild(lst[4][0], lst[4][1]).text])
    return r,vpt

# parse(requests.get("https://www.cee.kerala.gov.in/keam2023/notification").content)



app = flask.Flask(__name__)

@app.route("/parse", methods=['POST'])
def par():
    d = json.loads(request.form['d'])
    r = parse(requests.get(session['s']).content, json.loads(request.form['d']))
    c = checkForUpdates(r[1])
    with open(f"data/{session['s'].replace('/','').replace(':','').replace('https','')}") as f:
        json.dump([session['s'],d,c[1]])
    return 

@app.route("/check", methods=['GET','POST'])
def check():
    for f in glob.glob("data/*.d"):
        with open(f,'r') as r:
            # checkForUpdates()
            pass


@app.route("/site")
def f():
    session['s'] = request.args['s']
    s = BeautifulSoup(requests.get(session['s']).content, "html.parser")
    s.html.body.append(s.new_tag("script",src=url_for("static",filename="js/vp.js")))
    s.html.head.append(s.new_tag("link",rel= "stylesheet",href=url_for("static",filename="css/vp.css")))
    return str(s)

# This errorhandler is not used 'as it is', instead used to reroute all the requests to the
# actual IFRAME's site. (More like a proxy)
@app.errorhandler(404)
def reroute(e):
    resp = requests.get(session['s'] + request.full_path, stream=True, headers={'origin':session['s']})
    # Sometimes it could be an actual 404, so to avoid being in a forever loop, a 200 with "404" text will be returned.
    if resp.status_code == 404: return "404"
    return resp.raw.read(), resp.status_code, resp.headers.items()

@app.route("/")
def main():
    return render_template("main.html",s=session['s'])

app.debug = True
app.secret_key = "vdfvjnknvfi89"
app.run()
