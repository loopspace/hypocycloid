'use strict';

var timer;
var parameter;
var hypocycloid;

function init() {
    var cvs = document.getElementById('cvs');
    var ctx = cvs.getContext('2d');
    
    parameter = new Parameter('paramtbl');
    parameter.integer('Numerator','p',1,24,3,reset);
    parameter.integer('Denominator','q',1,24,8,reset);
    parameter.integer('Clockwise polygon size','n',1,12,3,reset);
    parameter.integer('Anticlockwise polygon size','m',1,12,8,reset);
    parameter.number('Speed','speed',0,5,1,reset);
    parameter.boolean('Outer Circle','oc',true,reset);
    parameter.boolean('Trace','trace',false,reset);
    parameter.separator('First Anticlockwise Circle:');
    parameter.boolean('Circle','afc',true,reset); 
    parameter.boolean('Lines','afl',true,reset); 
    parameter.boolean('Dots','afds',true,reset);
    parameter.boolean('Singleton','afd',false,reset);
    parameter.separator('Other Anticlockwise Circles:');
    parameter.boolean('Circle','arc',true,reset); 
    parameter.boolean('Lines','arl',true,reset); 
    parameter.boolean('Dots','ards',true,reset); 
    parameter.boolean('Singleton','ard',false,reset); 
    parameter.separator('First Clockwise Circle:');
    parameter.boolean('Circle','cfc',true,reset); 
    parameter.boolean('Lines','cfl',true,reset); 
    parameter.boolean('Dots','cfds',true,reset); 
    parameter.boolean('Singleton','cfd',false,reset); 
    parameter.separator('Other Clockwise Circles:');
    parameter.boolean('Circle','crc',true,reset); 
    parameter.boolean('Lines','crl',true,reset); 
    parameter.boolean('Dots','crds',true,reset);
    parameter.boolean('Singleton','crd',false,reset);
    
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
    hypocycloid.setParameters(p,q,n,m,opts);
}

var Parameter = function(id) {
    this.formtbl = document.getElementById(id);
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

