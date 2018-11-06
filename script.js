'use strict';

var timer;
var parameter;
var hypocycloid;

// Parse query string
var qs = (function(a) {
    if (a == "") return {};
    var b = {};
    for (var i = 0; i < a.length; ++i)
    {
        var p=a[i].split('=', 2);
        if (p.length == 1)
            b[p[0]] = "";
        else
            b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
    }
    return b;
})(window.location.search.substr(1).split('&'));

// Based on http://stackoverflow.com/a/21059677

function init() {
    var cvs = document.getElementById('cvs');
    var ctx = cvs.getContext('2d');
    var opts = setDefaults(qs);
    
    parameter = new Parameter('paramtbl');
    parameter.integer('Numerator','p',1,24,opts.p,reset);
    parameter.integer('Denominator','q',1,24,opts.q,reset);
    parameter.integer('Clockwise polygon size','n',1,12,opts.n,reset);
    parameter.integer('Anticlockwise polygon size','m',1,12,opts.m,reset);
    parameter.number('Speed','speed',0,5,opts.speed,reset);
    parameter.boolean('Outer Circle','oc',opts.oc,reset);
    parameter.boolean('Trace','trace',opts.trace,reset);
    parameter.separator('First Anticlockwise Circle:');
    parameter.boolean('Circle','afc',opts.afc,reset); 
    parameter.boolean('Lines','afl',opts.afl,reset); 
    parameter.boolean('Dots','afds',opts.afds,reset);
    parameter.boolean('Singleton','afd',opts.afd,reset);
    parameter.separator('Other Anticlockwise Circles:');
    parameter.boolean('Circle','arc',opts.arc,reset); 
    parameter.boolean('Lines','arl',opts.arl,reset); 
    parameter.boolean('Dots','ards',opts.ards,reset); 
    parameter.boolean('Singleton','ard',opts.ard,reset); 
    parameter.separator('First Clockwise Circle:');
    parameter.boolean('Circle','cfc',opts.cfc,reset); 
    parameter.boolean('Lines','cfl',opts.cfl,reset); 
    parameter.boolean('Dots','cfds',opts.cfds,reset); 
    parameter.boolean('Singleton','cfd',opts.cfd,reset); 
    parameter.separator('Other Clockwise Circles:');
    parameter.boolean('Circle','crc',opts.crc,reset); 
    parameter.boolean('Lines','crl',opts.crl,reset); 
    parameter.boolean('Dots','crds',opts.crds,reset);
    parameter.boolean('Singleton','crd',opts.crd,reset);
    
    timer = new Timer();
    hypocycloid = new Hypocycloid(ctx);
    setSize();
    reset();
    window.addEventListener('resize', setSize, false);
    window.requestAnimationFrame(metadraw);
}

function metadraw() {
    timer.update();
    hypocycloid.draw(timer.deltaTime());
    window.requestAnimationFrame(metadraw);
}

window.addEventListener('load',init,false);

function setSize() {
    var cvs = document.getElementById('cvs');
    cvs.width = '500';
    cvs.height = '500';
    hypocycloid.setSize();
}

function clear(c,cl) {
    var w = c.canvas.width;
    var h = c.canvas.height;
    c.save();
    c.setTransform(1,0,0,1,0,0);
    if (cl) {
	c.fillStyle = cl;
	c.fillRect(0,0,w,h);
    } else {
	c.clearRect(0,0,w,h);
    }
    c.restore();
}

function reset() {
    var p,q,n,m,opts;
    p = parameter.getParameter('p');
    q = parameter.getParameter('q');
    n = parameter.getParameter('n');
    m = parameter.getParameter('m');
    opts = {
	speed: parameter.getParameter('speed'),
	oc: parameter.getParameter('oc'),
	trace: parameter.getParameter('trace'),
	af: {
	    circle: parameter.getParameter('afc'),
	    lines: parameter.getParameter('afl'),
	    dots: parameter.getParameter('afds') || parameter.getParameter('afd'),
	    dot: parameter.getParameter('afd'),
	},
	ar: {
	    circle: parameter.getParameter('arc'),
	    lines: parameter.getParameter('arl'),
	    dots: parameter.getParameter('ards') || parameter.getParameter('ard'),
	    dot: parameter.getParameter('ard'),
	},
	cf: {
	    circle: parameter.getParameter('cfc'),
	    lines: parameter.getParameter('cfl'),
	    dots: parameter.getParameter('cfds') || parameter.getParameter('cfd'),
	    dot: parameter.getParameter('cfd'),
	},
	cr: {
	    circle: parameter.getParameter('crc'),
	    lines: parameter.getParameter('crl'),
	    dots: parameter.getParameter('crds') || parameter.getParameter('crd'),
	    dot: parameter.getParameter('crd'),
	},
    }
    parameter.serialise();
    hypocycloid.setParameters(p,q,n,m,opts);
}

function getOption(type,opt,def) {
    if (type == "integer") {
	if (opt !== undefined) {
	    return parseInt(opt,10);
	} else {
	    return def;
	}
    } else if (type == "float") {
	if (opt !== undefined) {
	    return parseFloat(opt);
	} else {
	    return def;
	}
    } else if (type == "string") {
	if (opt !== undefined) {
	    return opt;
	} else {
	    return def;
	}
    } else if (type == "boolean") {
	if (opt !== undefined) {
	    if (opt.toLowerCase() == "false") {
		return false;
	    } else {
		return true;
	    }
	} else {
	    return def;
	}
    }
    return def;
}

function setDefaults(q) {
    var opts = {};

    opts.p = getOption("integer", q.p, 3);
    opts.q = getOption("integer", q.q, 8);
    opts.n = getOption("integer", q.n, 3);
    opts.m = getOption("integer", q.m, 8);
    opts.speed = getOption("float",q.speed, 1);
    opts.oc = getOption("boolean", q.oc, true);
    opts.trace = getOption("boolean", q.trace, false);

    opts.afc = getOption("boolean", q.afc, true);
    opts.afl = getOption("boolean", q.afl, true);
    opts.afds = getOption("boolean", q.afds, true);
    opts.afd = getOption("boolean", q.afd, false);

    opts.arc = getOption("boolean", q.arc, true);
    opts.arl = getOption("boolean", q.arl, true);
    opts.ards = getOption("boolean", q.ards, true);
    opts.ard = getOption("boolean", q.ard, false);
    
    opts.cfc = getOption("boolean", q.cfc, true);
    opts.cfl = getOption("boolean", q.cfl, true);
    opts.cfds = getOption("boolean", q.cfds, true);
    opts.cfd = getOption("boolean", q.cfd, false);

    opts.crc = getOption("boolean", q.crc, true);
    opts.crl = getOption("boolean", q.crl, true);
    opts.crds = getOption("boolean", q.crds, true);
    opts.crd = getOption("boolean", q.crd, false);

    return opts;
}

var Parameter = function(id) {
    var formtbl = document.getElementById(id);
    var tbdy = document.createElement('tbody');
    formtbl.appendChild(tbdy);
    var tlnk = document.createElement('tbody');
    var tr = document.createElement('tr');

    var td = document.createElement('td');
    tr.appendChild(td);
    var a = document.createElement('a');
    a.setAttribute('href',"");
    var txt = document.createTextNode('Link to these settings');
    a.appendChild(txt);
    td.appendChild(a);
    
    tlnk.appendChild(tr);
    formtbl.appendChild(tlnk);

    this.settinglink = a;
    this.formtbl = tbdy;
    this.values = {};
}

Parameter.prototype.integer = function(desc,name,min,max,init,callback) {
    var sel = document.createElement('select');
    var opt;
    var index = 0;
    for (var i = min; i <= max; i++) {
	opt = document.createElement('option');
	opt.value = i;
	opt.innerHTML = i;
	sel.appendChild(opt);
	if (i < init) {
	    index++;
	}
    }
    sel.selectedIndex = index;
    sel.id = 'parameter_' + name;
    if (typeof callback === 'function') {
	sel.addEventListener('change',callback);
    }
    this.addRow(desc,sel,'int');
    this.values[name] = function() {return sel.value};
}

Parameter.prototype.boolean = function(desc,name,init,callback) {
    var cbx = document.createElement('input');
    cbx.type = 'checkbox';
    cbx.checked = init;
    cbx.id = 'parameter_' + name;
    if (typeof callback === 'function') {
	cbx.addEventListener('change',callback);
    }
    this.addRow(desc,cbx,'bool');
    this.values[name] = function() {return cbx.checked};
}

Parameter.prototype.number = function(desc,name,min,max,init,callback) {
    var dv = document.createElement('div');
    dv.id = 'parameter_' + name;
    var sp = document.createElement('span');
    var sph = document.createElement('span');
    dv.appendChild(sph);
    dv.appendChild(sp);
    dv.className += ' sliderCtr';
    sp.className += ' slider';
    sph.className += ' sliderBg';
    var p = (init - min)/(max - min)*100;
    sp.style.marginLeft = p + '%';
    var moving;
    if (typeof callback !== "function") {
	callback = function() {};
    }
    var fn = function(e) {
	e.preventDefault();
	if (moving) {
	    var w = dv.offsetWidth - 2;
	    var t = Math.min(w,Math.max(0,e.pageX - dv.offsetLeft));
	    sp.style.marginLeft = t + 'px';
	    callback();
	}
    };
    dv.addEventListener('mousedown',function(e) {moving = true; fn(e);});
    dv.addEventListener('mouseup',function() {moving = false;});
    dv.addEventListener('mousemove',fn);
    this.addRow(desc,dv,'slider');
    this.values[name] = function() {
	var style = sp.currentStyle || window.getComputedStyle(sp);
	var p = style.marginLeft.replace(/[^\d\.\-]/g,'');
	var w = dv.offsetWidth - 2;
	var t = p/w*(max - min) + min; 
	return t;
    };
}

Parameter.prototype.separator = function(desc) {
    this.addRow(desc,null,'sep');
}

Parameter.prototype.addRow = function(lbl,elt,cls) {
    var row = document.createElement('tr');
    row.className += 'paramRow ' + cls;
    var cell = document.createElement('td');
    var label = document.createTextNode(lbl);
    cell.appendChild(label);
    row.appendChild(cell);
    if (elt) {
	cell = document.createElement('td');
	cell.appendChild(elt);
	row.appendChild(cell);
    }
    this.formtbl.appendChild(row);
}

Parameter.prototype.getParameter = function(n) {
    return this.values[n]();
}

Parameter.prototype.serialise = function() {
    var objs = Object.entries(this.values);
    var params = [];
    var p;
    for (var i = 0; i < objs.length; i++) {
	p = objs[i][1]();
	if (typeof p == "boolean") {
	    if (p) {
		params.push(objs[i][0]);
	    } else {
		params.push(objs[i][0] + "=false");
	    }
	} else {
	    params.push(objs[i][0] + "=" + p);
	}
    }
    this.settinglink.setAttribute("href", "?" + params.join("&"));
}

var Timer = function() {
    this.stime = Date.now();
    this.ptime = Date.now();
    this.dtime = 0;
    this.mtime = Date.now();
}

Timer.prototype.update = function() {
    this.dtime = Date.now() - this.ptime;
    this.ptime = Date.now();
}

Timer.prototype.markTime = function() {
    this.mtime = Date.now();
}

Timer.prototype.fromMark = function() {
    return (Date.now() - this.mtime)/1000;
}
    
Timer.prototype.deltaTime = function() {
    return this.dtime/1000;
}

Timer.prototype.elapsedTime = function() {
    return (Date.now() - this.stime)/1000;
}

