Hypocycloid = function(ctx,p,q,n,m,opts) {
    this.ctx = ctx;
    this.p = p;
    this.q = q;
    this.n = n;
    this.m = m;
    this.opts = opts;

    this.c = new Vec2(0,0);
    this.pc = new Vec2(0,0);

    this.pt = 5;

    this.w = ctx.canvas.width;
    this.h = ctx.canvas.height;

    this.time = 0;
    this.speed = 1;

}



Hypocycloid.prototype.draw = function(dt) {
    this.time += dt * this.speed;
    var r,lp,np,k,nd;
    var c = this.c,
	pc = this.pc,
	p = this.p,
	q = this.q,
	sf = this.sf,
	w = this.w,
	h = this.h,
	n = this.n,
	m = this.m,
	ctx = this.ctx,
	opts = this.opts,
	time = this.time,
	pt = this.pt
	;
    var pp = q - p;
    if (pp < 0) { return; };
    if (!this.opts.trace) {
	clear(ctx,"black");
    }
    ctx.save();
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
	if ((k == 0 && opts.af.dot) || (k != 0 && opts.ar.dot)) {
	    nd = 1;
	} else {
	    nd = n;
	}
	for (j=0; j < nd; j++) {
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
	if ((k == 0 && opts.cf.dot) || (k != 0 && opts.cr.dot)) {
	    nd = 1;
	} else {
	    nd = m;
	}
	for (j=0; j < nd; j++) {
	    pc.set(r,0).rotate(time*p/q + 2*Math.PI/m*(k+j)).add(c);
	    ctx.moveTo(pc.x + pt,pc.y);
	    ctx.arc(pc.x,pc.y,pt,0,2*Math.PI,true);
	}
	
    }
    ctx.fill();
    ctx.restore();
}

Hypocycloid.prototype.setParameters = function(p,q,n,m,opts) {
    this.p = p;
    this.q = q;
    this.n = n;
    this.m = m;
    this.opts = opts;
    this.speed = this.opts.speed;
    clear(this.ctx,"black");
}

Hypocycloid.prototype.setSize = function() {
    this.w = this.ctx.canvas.width;
    this.h = this.ctx.canvas.height;
    this.sf = .9*Math.min(this.w,this.h);
}

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

