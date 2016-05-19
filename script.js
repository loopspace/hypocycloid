'use strict';

var ctx;
var timer;
var speed = 1;
var parameter;
var time = 0;
var sf;
var w;
var h;
var p,q,n,m;
var pp;
var opts;

var Vec2 = function(x,y) {
    this.x = x;
    this.y = y;
}

Vec2.prototype.set = function(x,y) {
    this.x = x;
    this.y = y;
    return this;
}

Vec2.prototype.clone = function(v) {
    this.x = v.x;
    this.y = v.y;
    return this;
}

Vec2.prototype.add = function(v) {
    this.x += v.x;
    this.y += v.y;
    return this;
}

Vec2.prototype.scale = function(c) {
    this.x *= c;
    this.y *= c;
    return this;
}

Vec2.prototype.rotate = function(a) {
    var x,y,ca,sa;
    ca = Math.cos(a);
    sa = Math.sin(a);
    x = this.x;
    y = this.y;
    this.x = x * ca - y * sa;
    this.y = x * sa + y * ca;
    return this;
}

function init() {
    var cvs = document.getElementById('cvs');
    ctx = cvs.getContext('2d');
    parameter = new Parameter('paramtbl');
    parameter.integer('Numerator','p',1,24,3,reset);
    parameter.integer('Denominator','q',1,24,8,reset);
    parameter.integer('Clockwise polygon size','n',1,12,3,reset);
    parameter.integer('Anticlockwise polygon size','m',1,12,8,reset);
    parameter.boolean('Outer Circle','oc',true,reset); 
    parameter.separator('First Anticlockwise Circle:');
    parameter.boolean('Circle','afc',true,reset); 
    parameter.boolean('Lines','afl',true,reset); 
    parameter.boolean('Dots','afd',true,reset); 
    parameter.separator('Other Anticlockwise Circles:');
    parameter.boolean('Circle','arc',true,reset); 
    parameter.boolean('Lines','arl',true,reset); 
    parameter.boolean('Dots','ard',true,reset); 
    parameter.separator('First Clockwise Circle:');
    parameter.boolean('Circle','cfc',true,reset); 
    parameter.boolean('Lines','cfl',true,reset); 
    parameter.boolean('Dots','cfd',true,reset); 
    parameter.separator('Other Clockwise Circles:');
    parameter.boolean('Circle','crc',true,reset); 
    parameter.boolean('Lines','crl',true,reset); 
    parameter.boolean('Dots','crd',true,reset); 
    timer = new Timer();
    setSize();
    reset();
    window.addEventListener('resize', setSize, false);
    window.requestAnimationFrame(metadraw);
}

function metadraw() {
    timer.update();
    draw(timer.deltaTime());
    window.requestAnimationFrame(metadraw);
}


window.addEventListener('load',init,false);

var draw = function() {

    var j,k;
    var acl = '#00ffff';
    var ccl = '#ffff00';
    var c = new Vec2(0,0);
    var pc = new Vec2(0,0);
    var r;
    var pt = 5;
    var lp,np;
    
    return function(dt) {
	if (pp < 0) { return; };
	clear(ctx,"black");
	ctx.save();
	time += dt * speed;
	ctx.translate(w/2,h/2);
	ctx.strokeStyle = '#ff00ff';
	ctx.lineWidth = 2;
	ctx.beginPath();
	if (opts.oc) {
	    ctx.arc(0,0,sf/2,0,2*Math.PI,true);
	}
	r = p/q*sf/2;
	if (opts.af.circle) {
	    lp = 0;
	} else {
	    lp = 1;
	}
	if (opts.ar.circle) {
	    np = m;
	} else {
	    np = 1;
	}
	for (k = lp; k < np; k++) {
	    c.set(sf/2 - r,0).rotate(time*p/q + 2*Math.PI/m*k);
	    ctx.moveTo(c.x + r,c.y);
	    ctx.arc(c.x,c.y,r,0,2*Math.PI,true);
	}
	if (opts.cf.circle) {
	    lp = 0;
	} else {
	    lp = 1;
	}
	if (opts.cr.circle) {
	    np = n;
	} else {
	    np = 1;
	}
	r = pp/q*sf/2;
	for (k = lp; k < np; k++) {
	    c.set(sf/2 - r,0).rotate(-time*pp/q - 2*Math.PI/n*k);
	    ctx.moveTo(c.x + r,c.y);
	    ctx.arc(c.x,c.y,r,0,2*Math.PI,true);
	}
	ctx.stroke();

	ctx.beginPath();
	ctx.strokeStyle = "#00ffff";
	r = p/q*sf/2;
	if (opts.af.lines) {
	    lp = 0;
	} else {
	    lp = 1;
	}
	if (opts.ar.lines) {
	    np = m;
	} else {
	    np = 1;
	}
	for (k = lp; k < np; k++) {
	    c.set(sf/2 - r,0).rotate(time*p/q + 2*Math.PI/m*k);
	    pc.set(r,0).rotate(-time*pp/q - 2*Math.PI/n*k).add(c);
	    ctx.moveTo(pc.x,pc.y);
	    for (j=1; j <= n; j++) {
		pc.set(r,0).rotate(-time*pp/q - 2*Math.PI/n*(k+j)).add(c);
		ctx.lineTo(pc.x,pc.y);
	    }

	}
	ctx.stroke();

	ctx.beginPath();
	ctx.strokeStyle = "#ffff00";
	r = pp/q*sf/2;
	if (opts.cf.lines) {
	    lp = 0;
	} else {
	    lp = 1;
	}
	if (opts.cr.lines) {
	    np = n;
	} else {
	    np = 1;
	}
	for (k = lp; k < np; k++) {
	    c.set(sf/2 - r,0).rotate(-time*pp/q - 2*Math.PI/n*k);
	    pc.set(r,0).rotate(time*p/q + 2*Math.PI/m*k).add(c);
	    ctx.moveTo(pc.x,pc.y);
	    for (j=1; j <= m; j++) {
		pc.set(r,0).rotate(time*p/q + 2*Math.PI/m*(k+j)).add(c);
		ctx.lineTo(pc.x,pc.y);
	    }

	}
	ctx.stroke();

	ctx.beginPath();
	ctx.fillStyle = "#00ffff";
	r = p/q*sf/2;
	if (opts.af.dots) {
	    lp = 0;
	} else {
	    lp = 1;
	}
	if (opts.ar.dots) {
	    np = m;
	} else {
	    np = 1;
	}
	for (k = lp; k < np; k++) {
	    c.set(sf/2 - r,0).rotate(time*p/q + 2*Math.PI/m*k);
	    for (j=0; j < n; j++) {
		pc.set(r,0).rotate(-time*pp/q - 2*Math.PI/n*(k+j)).add(c);
		ctx.moveTo(pc.x + pt,pc.y);
		ctx.arc(pc.x,pc.y,pt,0,2*Math.PI,true);
	    }

	}
	ctx.fill();

	ctx.beginPath();
	ctx.fillStyle = "#ffff00";
	r = pp/q*sf/2;
	if (opts.cf.dots) {
	    lp = 0;
	} else {
	    lp = 1;
	}
	if (opts.cr.dots) {
	    np = n;
	} else {
	    np = 1;
	}
	for (k = lp; k < np; k++) {
	    c.set(sf/2 - r,0).rotate(-time*pp/q - 2*Math.PI/n*k);
	    for (j=1; j <= m; j++) {
		pc.set(r,0).rotate(time*p/q + 2*Math.PI/m*(k+j)).add(c);
		ctx.moveTo(pc.x + pt,pc.y);
		ctx.arc(pc.x,pc.y,pt,0,2*Math.PI,true);
	    }

	}
	ctx.fill();
	
	ctx.restore();
    }
}()

function setSize() {
    var cvs = document.getElementById('cvs');
    var cvsdiv = cvs.parentNode;
    var w = cvsdiv.offsetWidth;
    var h = window.innerHeight;
    cvs.width = '500';
    cvs.height = '500';
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
    parameter.getParameters();
    w = ctx.canvas.width;
    h = ctx.canvas.height;
    sf = .9*Math.min(w,h);
    p = parameter.getParameter('p');
    q = parameter.getParameter('q');
    n = parameter.getParameter('n');
    m = parameter.getParameter('m');
    opts = {
	oc: parameter.getParameter('oc'),
	af: {
	    circle: parameter.getParameter('afc'),
	    lines: parameter.getParameter('afl'),
	    dots: parameter.getParameter('afd'),
	},
	ar: {
	    circle: parameter.getParameter('arc'),
	    lines: parameter.getParameter('arl'),
	    dots: parameter.getParameter('ard'),
	},
	cf: {
	    circle: parameter.getParameter('cfc'),
	    lines: parameter.getParameter('cfl'),
	    dots: parameter.getParameter('cfd'),
	},
	cr: {
	    circle: parameter.getParameter('crc'),
	    lines: parameter.getParameter('crl'),
	    dots: parameter.getParameter('crd'),
	},
    }

    pp = q - p;
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
    this.addRow(desc,sel);
    this.values[name] = init;
}

Parameter.prototype.boolean = function(desc,name,init,callback) {
    var cbx = document.createElement('input');
    cbx.type = 'checkbox';
    cbx.value = init;
    cbx.id = 'parameter_' + name;
    if (typeof callback === 'function') {
	cbx.addEventListener('change',callback);
    }
    this.addRow(desc,cbx);
    this.values[name] = init;
}

Parameter.prototype.separator = function(desc) {
    this.addRow(desc);
}

Parameter.prototype.addRow = function(lbl,elt) {
    var row = document.createElement('tr');
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

Parameter.prototype.getParameters = function() {
    var sel,k;
    for (k in this.values) {
	sel = document.getElementById('parameter_' + k);
	if (sel.type == 'checkbox') {
	    this.values[k] = sel.checked;
	} else {
	    this.values[k] = sel.value;
	}
    }
}

Parameter.prototype.getParameter = function(n) {
    return this.values[n];
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

