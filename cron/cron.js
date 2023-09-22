import { initializeApp,deleteApp } from 'firebase/app';
import { getDatabase, ref, child, set, get, remove, goOffline } from "firebase/database";
import { createTransport }  from 'nodemailer';
import axios from "axios";

import  { configDotenv } from "dotenv";

configDotenv();
if(!process.env.FB_CONFIG) throw new Error("Please set Firebase configs to continue.");

var tr = createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EM_ID, 
    pass: process.env.EM_PW
  }
});
var s = 0;
console.log(process.env.FB_CONFIG);
var app = initializeApp(JSON.parse(process.env.FB_CONFIG.replace("'",'')));
const db = ref(getDatabase(), '/sitetracker/sites');

// Function to terminate app when inactivity occurs
const timerObj = setTimeout(() => {
  goOffline(getDatabase(app));
  deleteApp(app);
},2*60*1000);

const resolveState = (a) => {
  if(a) s += 1;
  else s -= 1;

  if(s==0){
    setImmediate(() => {
      timerObj.ref();
    });
  }else{
    timerObj.unref();
  }
};

// Fetch Function
(function(){
  get(db)
  .then((ss)=>{
    ss.forEach((cs) => {
      const d = cs.val();
      if(d.d == 0){
        addSite(cs);
      }else{
        axios.get(d.url)
        .then(response => {
          var arr = response.data.split('\n');
          var att = d.d.split('\n');
          var res = [];

          arr.forEach(e => {
            if (!att.includes(e)) res.push(e);
          });

          console.log(res);
          if(res.length == 0) {
            resolveState(1);
            set(child(db,cs.key+'/t'),new Date().toISOString()).then(()=>{resolveState(0);});;
            console.log("CHECK : " + d.url + " : NoChange");
          } else {
            updateSite(cs, response.data);
            
            var mailOptions = {
              from: 'Test',
              to: d.email,
              subject: 'A new update is available.',
              text: 'A new update is available for the site: '+ d.url + '\n' + res.join("\n")
            };
            mailOptions.html = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    .card-foot {padding: 0.5rem 1rem; background-color: rgba(0,0,0,.03); border-top: 1px solid rgba(0,0,0,.125);}
                    .card-body {padding: 1rem 1rem;}
                    .card-head {padding: 0.5rem 1rem; margin-bottom: 0; background-color: rgba(0,0,0,.03); border-bottom: 1px solid rgba(0,0,0,.125);}
                    .card-container {position: relative;display: flex; flex-direction: column;min-width: 0;word-wrap: break-word;background-color: #fff;background-clip: border-box;border: 1px solid rgba(0,0,0,.125); border-radius: 0.25rem;}
                    .bg {background-color: beige; display: flex; justify-content: center; align-items: center;}
                </style>
            </head>
            <body>
                <div class="bg">
                    <div class="card-container">
                        <div class="card-head">
                        A new update is available for the site: ${d.url}
                        </div>
                        <div class="card-body">
                            ${res.join("\n")}
                        </div>
                        <div class="card-foot" style="color: #6c757d">
                            The content shown above may not display properly, visit the site to view the change.
                        </div>
                    </div>
                </div>
            </body>
            </html>`;

            resolveState(1);
            tr.sendMail(mailOptions, function(error, info){
              resolveState(0);
              if (error) {
                console.log("Email NOT sent: " + error.code);
              } else {
                console.log('Email sent [CHANGED]: ' + mailOptions.to + ' : '+ cs.val().url);
              }
            });
          }
        })
        .catch(error => {
          console.log("ERROR: " + error.code + " : " + error.config.url);
        });
      }
    });
   





  });
})();

// Function to add new sites to the database.
const addSite = (cs) => {
  let d = cs.val();
  axios.get(d.url)
    .then(resp => {
      updateSite(cs,resp.data);

      var mailOptions = {
        from: 'Test',
        to: d.email,
        subject: 'Your site is added to our checklist.',
        text: 'The site: '+ d.url + ' is added to our checklist, now you\'ll recieve updates in the site right away in your email.'
      };
      tr.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent [ADDED]: ' + mailOptions.to + ' : '+ d.url);
        }
      });

    })
    .catch(error => {
      console.log("ERROR: " + error.code + " : " + error.config.url);

      resolveState(1);
      remove(child(db,cs.key)).then(()=>{resolveState(0);});
      var mailOptions = {
        from: 'Test',
        to: d.email,
        subject: 'The site you have given is not valid!',
        text: 'We are unable to resolve the site: '+ d.url + '\n This site is not added to our checklist, please re-enter the site after checking the url.'
      };
      tr.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent [INVALID]: ' + mailOptions.to + ' : '+ d.url);
        }
      });
    });
};

// Function to update changes in the site to the server.
var updateSite = (cs,r) =>{
  console.log("CHECK : " + cs.val().url + " : ChangeDetected");
  resolveState(1);
  resolveState(1);
  set(child(db,cs.key+'/d'),r).then(()=>{resolveState(0);});
  set(child(db,cs.key+'/t'),new Date().toISOString()).then(()=>{resolveState(0);});
};
