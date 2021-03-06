const hw = 80;
const hh = 60;
const ht = 30;
const bb = 8;
const t = 1;
const sb = hw/5;

const quality = 1;

const fn = 16 * quality;

const w = 10;
function main() {
    const start = Date.now();
    const model = render();
    const runTime = Date.now() - start;
    console.log(runTime/1000);
    return model;
}

function render() {
       return union( 
          
 union(
  translate([0,-ht*2,0], hollowOut(intersection(hump(), translate([10.5,2,0],cube([hw-21,ht-2,hh]))),1,0,1))
,translate([7.5,-ht-ht/2,hh/2],difference(rotate([0,90,0],cylinder({r: 4.5, h: 65, fn})),translate([3,-5,-5],cube([58,10,10]))))

),
flanges(),
 
       difference(
           hollowOut(humps(),t,0,t),
           translate([6.5,-ht*1.5,t],cube([4,ht,4])),
            translate([hw-10.5,-ht*1.5,t],cube([4,ht,4])),
                    translate([10,ht-2,0],cube([hw-20,ht,hh]))
),
        translate([hw/2,-ht/2,0],center(true, sucker()))
    );
}

function flangeReinforcement() {
    const rr = hw/2.5;
    const rt = 7;
    const rh = 16;
     return rotate([-90,90,0],intersection(
               translate([-rr/2-4,rr-rt,0],cube([rr+4,rt,rh])),
               cylinder({r:rr, h: rh, fn})
               ));
}

function flanges() {
   return difference(
union(
    support(),
             translate([35,27,17.2],   flangeReinforcement()),
            translate([45,27,17.2], mirror([1,0,0],flangeReinforcement())),
translate([10,0,0],mirror([1,0,0],flange(10))),
translate([hw-10,0,0],flange(10))
),
   translate([0,ht*2-2,-1],cube([hw,2,hh])),
                  linear_extrude({ height: hh }, polygon([ [0,0],[hw,0],[hw-10,ht],[10,ht] ])),
                  translate([9,ht*1.5,hh/2-5],cube([62,ht/2,10])),
      translate([7,ht+ht/2,hh/2],rotate([0,90,0],cylinder({r: 5, h: 66, fn})))         

   );
}

function support() {
    return difference( hump(), translate([10,0,0],cube([hw-20,ht,hh])));
}

function flange(w) {
    const s = -2;
    return translate([w/2+s/2,ht+ht/2,23],
        center(true,
            intersection(
             translate([s,s,hh-hw/2],rotate([90,0,0],sphere({r: hw/2, fn}))),
                translate([hw/2-w/2,0,hh/2],center(true,cube([w,ht,hh])))
            )
        )  
    );
  
}

function humps() {
    return union(
       translate([hw,0,0],rotate([0,0,180],hump())),
       hump()
    );
}

function hump(o=0) {
    return intersection(
    humpBase(),
    difference(
        cube([hw, ht-o, hh]),
        bevel(),
        translate([hw,ht,0],rotate([0,0,180],bevel()))
        )
   );
}

function sucker() {
  return intersection(
      translate([0,0,-sb/2],center([true,true,false],cube([sb*3,sb*3,sb/4]))),
      hollowOut(     
        union(
          torus({ ri: sb/2, ro: sb, fni: fn / 2, fno: fn }),
          torus({ ri: sb/2, ro: sb/3, fni: fn / 2, fno: fn })
        ),
        t,t,t
      )
    );
}

function humpBase() {
    return  translate([hw/2,ht/2,0],
    intersection(
    difference(
      union(
        translate([0,0,hh-hw/2],rotate([90,0,0],sphere({r: hw/2, fn})))
        ,cylinder({r:hw/2, h: hh-hw/2, fn})
      ),
      difference(
        cylinder({r:hw/2, h: bb/2, fn}),
        union(
          translate([0,0,bb/2],torus({ ri: bb/2, ro: hw/2-bb/2, fni: fn, fno: fn })),
          cylinder({r:hw/2-bb/2, h: bb, fn})
        )
      )
      ),
    translate([-hw/2,-hw/2,0],cube([hw,hw,hh]))
    )
    )
}

function bevel() {
    const d = 4;
    return translate([0,bb/d,bb/d],rotate([90,180,90],difference(
        cube([bb/d, bb/d, hw]),
        cylinder({ r: bb/d, h: hw, fn: fn })
    )));
}

function hollowOut(object, tx,ty,tz) {
    
    const b = object.getBounds();
    
    const xw = b[1].x - b[0].x;
    const yw = b[1].y - b[0].y;
    const zw = b[1].z - b[0].z;
    
    const sx = 1-tx*2/xw;
    const sy = 1-ty*2/yw;
    const sz = 1-tz*2/zw;
    
    const scaledObject = scale([sx, sy, sz], object);
    
    const sob = scaledObject.getBounds();
    
    const dx = b[1].x - sob[1].x - tx;
    const dy = b[1].y - sob[1].y - ty;
    const dz = b[1].z - sob[1].z - tz;
    
    return difference(
        object,
        translate([dx,dy,dz],scaledObject)
    );
}

