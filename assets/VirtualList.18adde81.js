import{r as n,j as f,a as x}from"./index.4a0d5c1c.js";function d(e){const t=n.exports.useRef(null),s=n.exports.useRef(null),o=n.exports.useRef(0),[c,a]=n.exports.useState(0),[i,u]=n.exports.useState(0);return n.exports.useEffect(()=>{o.current=Math.ceil(t.current.clientHeight/e)+1;const l=new IntersectionObserver(()=>{const r=t.current.scrollTop;a(Math.floor(r/e)),u(r-r%e)},{root:t.current,threshold:[0,.1,.3,.5,.7,.8,.9,1]});return l.observe(s.current),a(-0),()=>{s.current&&l.unobserve(s.current)}},[]),{containerRef:t,visionRef:s,startIndex:c,startOffset:i,volume:o}}const v=({list:e,itemHeight:t=50})=>{const{containerRef:s,visionRef:o,startIndex:c,startOffset:a,volume:i}=d(t),u=Math.min(c+i.current,e.length);return f("div",{className:"list-container",ref:s,children:[x("div",{className:"list-scroll-layer",style:{height:e.length*t}}),x("div",{className:"list-vision",ref:o,style:{transform:`translate3d(0px, ${a}px, 0px)`},children:e.slice(c,u).map(({content:l,key:r})=>f("div",{className:"list-item",children:[l," ",r]},r))})]})};export{v as default};
