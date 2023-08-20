var lastClicked, vpt;

var lst = [],c = 0;

document.onclick = (e) => {
    e.preventDefault();
    let a = e.target.className.replace(" cp"+c.toString(), '');
    if (a == "") e.target.removeAttribute("class");
    else e.target.className = a;
    let arr={};
    lastClicked = e.target;
    for(cd of e.target.attributes){
        if(cd.name == "href") break;
        arr[cd.name] = cd.value;
    };
    window.top.postMessage("cp"+JSON.stringify([e.target.localName,arr]));
};

window.onmessage = function(e) {
    if (e.data.startsWith('cp')) {
        if(c==0) vpt = lastClicked;
        lst.push(lastClicked);
        lastClicked.className += " cp"+c.toString();
        c +=1;
    }
};

document.onmouseover = (e) => {
    if((vpt && !vpt.contains(e.target)) || lst.includes(e.target)) return e;
    e.target.className += " cp"+c.toString();
};
document.onmouseout = (e) => {
    if(!lst.includes(e.target)){
        let a = e.target.className.replace(" cp"+c.toString(), '');
        if (a == "") e.target.removeAttribute("class");
        else e.target.className = a;
    }
};