import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-app.js";
import { getAuth, signOut, onAuthStateChanged, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-auth.js";
import { getDatabase, ref, push, get, query, orderByChild, equalTo, remove } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-database.js";
import "https://ajax.googleapis.com/ajax/libs/jquery/3.6.4/jquery.min.js";
import "https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/js/bootstrap.min.js";
import showtimeago from "./showtimeago.js";

// CHANGE THIS VARIABLE
const firebaseConfig = {
    apiKey: "AIzaSyCFe_50K0dDKtfPs7DT4UcODQcQpTqnYS0",
    authDomain: "examerapp.firebaseapp.com",
    databaseURL: "https://examerapp.firebaseio.com",
    projectId: "examerapp",
    storageBucket: "examerapp.appspot.com",
    messagingSenderId: "616829474966",
    appId: "1:616829474966:web:34955529ebd48a35ae0ab7",
    measurementId: "G-C7PTK6XQEH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
const loader = new bootstrap.Modal($("#modal-load"));
const md_ss = new bootstrap.Modal($("#modal-ss"));
let user;


var mobileCheck = function() {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    if (check){
        $(".modal-body").text("Please use this site in desktop mode to continue.");
        loader.show();
        throw Error("Please use this site in desktop mode to continue.");
    }
};

mobileCheck();
onAuthStateChanged(auth, (u)=>{
    if(u){
        $(".dropdown").fadeOut({
            complete:()=>{
                $("#user-img").attr("src",u.photoURL);
                $("#user-id").text(u.email);
                $("#user-img-ph").hide();
                $("#user-img").show();
                $("#user-signin").hide();
                $("#user-signout").show();  
                loader.hide();
                $(".hist-bar-cnt").fadeIn();
                user = u;
                $(".dropdown").fadeIn();
                setSiteHistory();
            }
        })
    }else{
        $(".dropdown").fadeOut({
            complete:()=>{
                $("#user-img-ph").show();
                $("#user-img").hide();
                $("#user-id").text("Signin");
                $("#user-signin").show();
                $(".hist-bar-cnt").fadeOut();
                $("#user-signout").hide();  
                user = null;
                $(".dropdown").fadeIn();
            }
        });
    }
});

$("#user-signin").click(function (e) { 
    loader.show();
    signInWithPopup(auth, new GoogleAuthProvider())
    .catch((error) => {
        loader.hide();
    });
});

$("#user-signout").click(function (e) { 
    signOut(auth);
});

document.onanimationend = (e) => {
    $(e.target).removeClass("shake");
  };

$("#btn-track").click(function (e) { 
    if(!user){
        e.preventDefault();
        $(".user-bar").addClass("shake");
        return;
    }
    if($("#inp-url").val() == ""){
        e.preventDefault();
        $(".dsv").addClass("shake");
        return;
    }
    e.preventDefault();
    const url = $("#inp-url").val();
            
        
    const c = new XMLHttpRequest();
    c.open('get', url, true);
    c.onreadystatechange = () => {
        if (c.readyState === 4) {
            if ((c.status == 200) || (c.status == 0)) {
                $("#alrt-url").text(url);
                $("#user-email").html(user.email);
                md_ss.show();
    
                push(ref(db, 'sitetracker/sites/'), {
                    url: url,
                    email: user.email,
                    d: 0
                  });
                return;
            } else {
                $("#inp-url").addClass("is-invalid");
                $(".dsv").addClass("shake");
                $("#alrt-url").text(url);
                return;
            }

        }

    }
    c.send(null);
});

var setSiteHistory = () => {
    get(query(ref(db, 'sitetracker/sites/'), ...[orderByChild("email"), equalTo(user.email)]))
    .then((snapshot)=>{
        if(snapshot.size != 0){
            $("#usr-hist").html("");
            snapshot.forEach(p => {
                var e = p.val();
                $("#usr-hist").append('<li class="list-group-item d-flex justify-content-between" id="'+p.key+'" ><span class="">'+e.url+'</span><div><span class="badge '+((e.t)? 'bg-primary">Checked '+showtimeago(e.t) : 'bg-secondary">Queued')+'</span> &nbsp;<a href="#"><i class="fa fa-remove" alt="Remove site" id=btn'+p.key+' style="color:red;"></i></a></div></li>');
                $("#btn"+p.key).on("click", () =>{
                    var v = p.key;
                    remove(ref(db, 'sitetracker/sites/'+v));
                    setSiteHistory();
                });
            });
            $(".load-bar").fadeOut({
                complete:()=>{
                    $(".usr-hist-bar").fadeIn();
                }
            });
        }else{
            $(".hist-bar-cnt").fadeOut();
        }
    });
};

$('#modal-ss').on('hide.bs.modal', function (e) {
    $(".hist-bar-cnt").fadeIn();
    $("#inp-url").val("");
    setSiteHistory();
});