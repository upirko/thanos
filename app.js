import html2canvas from 'html2canvas';

const C_COUNT = 32;

const cWrap = document.createElement('div');
cWrap.style.position = 'fixed';
document.body.appendChild(cWrap);

const canvs = Array.apply(null, Array(C_COUNT)).map(() => document.createElement('canvas'));
canvs.forEach(c => {
  c.style.position = 'absolute';
  cWrap.appendChild(c);
});

let els = [];

function destroy(el) {
  
  html2canvas(el).then(canvas => {
    let width = canvas.width;
    let height = canvas.height;
    let ctx = canvas.getContext('2d');
    let iData = ctx.getImageData(0, 0, width, height);
    let d = [];
    
    for (let i = 0; i < C_COUNT; i++) {
      d.push(ctx.createImageData(width, height));
    }

    for (let w = 0; w < width; w++) {
      for (let h = 0; h < height; h++) {
        for (let l = 0; l < 2; l++) {
          let p = 4 * (h * width + w);
          let m = Math.floor(C_COUNT * (Math.random() + 2 * w / width) / 3);
          for (let c = 0; c < 4; c++) {
            d[m].data[p + c] = iData.data[p + c];
          }
        }
      }
    }

    d.forEach((idata, i) => {
      canvs[i].width = width;
      canvs[i].height = height;
      canvs[i].getContext('2d').putImageData(idata, 0, 0);
      
      canvs[i].style.visibility = 'visible';
      setTimeout(() => {
        canvs[i].style.transition = `all 2s ease-out ${2 * i / C_COUNT}s`;
      });

      setTimeout(() => {
        let a = (Math.random() - 0.5) * 2 * Math.PI;
        let ra = 20 * (Math.random() - 0.5)
        canvs[i].style.transform = `rotate(${ra}deg) translate(${30 * Math.cos(a)}px, ${45 * Math.sin(a)}px)`;
        canvs[i].style.opacity = 0;
      }, 400);
    });

    let pos = el.getBoundingClientRect();
    cWrap.style.top = `${pos.top}px`;
    cWrap.style.left = `${pos.left}px`;
    el.style.opacity = 0;
    if (els.length) {
      setTimeout(() => {
        canvs.forEach(resetCanvas);
        destroy(els.shift());
      }, 5000);
    }
    
  });
}
function resetCanvas(c) {
  c.style.transition = '';
  c.style.opacity = 1;
  c.style.transform = '';
  c.style.visibility = 'hidden';
}
window.start = (selector) => {
  els = [...document.querySelectorAll(selector)];
  if (els.length) destroy(els.shift());
}
