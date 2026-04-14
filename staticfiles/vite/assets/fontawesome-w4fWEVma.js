function $e(t,e,n){return(e=Ke(e))in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function Yt(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(t);e&&(a=a.filter(function(r){return Object.getOwnPropertyDescriptor(t,r).enumerable})),n.push.apply(n,a)}return n}function o(t){for(var e=1;e<arguments.length;e++){var n=arguments[e]!=null?arguments[e]:{};e%2?Yt(Object(n),!0).forEach(function(a){$e(t,a,n[a])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):Yt(Object(n)).forEach(function(a){Object.defineProperty(t,a,Object.getOwnPropertyDescriptor(n,a))})}return t}function qe(t,e){if(typeof t!="object"||!t)return t;var n=t[Symbol.toPrimitive];if(n!==void 0){var a=n.call(t,e);if(typeof a!="object")return a;throw new TypeError("@@toPrimitive must return a primitive value.")}return(e==="string"?String:Number)(t)}function Ke(t){var e=qe(t,"string");return typeof e=="symbol"?e:e+""}const Ut=()=>{};let Mt={},de={},ge=null,pe={mark:Ut,measure:Ut};try{typeof window<"u"&&(Mt=window),typeof document<"u"&&(de=document),typeof MutationObserver<"u"&&(ge=MutationObserver),typeof performance<"u"&&(pe=performance)}catch{}const{userAgent:Wt=""}=Mt.navigator||{},N=Mt,p=de,Ht=ge,K=pe;N.document;const E=!!p.documentElement&&!!p.head&&typeof p.addEventListener=="function"&&typeof p.createElement=="function",he=~Wt.indexOf("MSIE")||~Wt.indexOf("Trident/");var Qe=/fa(s|r|l|t|d|dr|dl|dt|b|k|kd|ss|sr|sl|st|sds|sdr|sdl|sdt)?[\-\ ]/,Je=/Font ?Awesome ?([56 ]*)(Solid|Regular|Light|Thin|Duotone|Brands|Free|Pro|Sharp Duotone|Sharp|Kit)?.*/i,be={classic:{fa:"solid",fas:"solid","fa-solid":"solid",far:"regular","fa-regular":"regular",fal:"light","fa-light":"light",fat:"thin","fa-thin":"thin",fab:"brands","fa-brands":"brands"},duotone:{fa:"solid",fad:"solid","fa-solid":"solid","fa-duotone":"solid",fadr:"regular","fa-regular":"regular",fadl:"light","fa-light":"light",fadt:"thin","fa-thin":"thin"},sharp:{fa:"solid",fass:"solid","fa-solid":"solid",fasr:"regular","fa-regular":"regular",fasl:"light","fa-light":"light",fast:"thin","fa-thin":"thin"},"sharp-duotone":{fa:"solid",fasds:"solid","fa-solid":"solid",fasdr:"regular","fa-regular":"regular",fasdl:"light","fa-light":"light",fasdt:"thin","fa-thin":"thin"}},Ze={GROUP:"duotone-group",PRIMARY:"primary",SECONDARY:"secondary"},ye=["fa-classic","fa-duotone","fa-sharp","fa-sharp-duotone"],h="classic",nt="duotone",tn="sharp",en="sharp-duotone",ve=[h,nt,tn,en],nn={classic:{900:"fas",400:"far",normal:"far",300:"fal",100:"fat"},duotone:{900:"fad",400:"fadr",300:"fadl",100:"fadt"},sharp:{900:"fass",400:"fasr",300:"fasl",100:"fast"},"sharp-duotone":{900:"fasds",400:"fasdr",300:"fasdl",100:"fasdt"}},an={"Font Awesome 6 Free":{900:"fas",400:"far"},"Font Awesome 6 Pro":{900:"fas",400:"far",normal:"far",300:"fal",100:"fat"},"Font Awesome 6 Brands":{400:"fab",normal:"fab"},"Font Awesome 6 Duotone":{900:"fad",400:"fadr",normal:"fadr",300:"fadl",100:"fadt"},"Font Awesome 6 Sharp":{900:"fass",400:"fasr",normal:"fasr",300:"fasl",100:"fast"},"Font Awesome 6 Sharp Duotone":{900:"fasds",400:"fasdr",normal:"fasdr",300:"fasdl",100:"fasdt"}},rn=new Map([["classic",{defaultShortPrefixId:"fas",defaultStyleId:"solid",styleIds:["solid","regular","light","thin","brands"],futureStyleIds:[],defaultFontWeight:900}],["sharp",{defaultShortPrefixId:"fass",defaultStyleId:"solid",styleIds:["solid","regular","light","thin"],futureStyleIds:[],defaultFontWeight:900}],["duotone",{defaultShortPrefixId:"fad",defaultStyleId:"solid",styleIds:["solid","regular","light","thin"],futureStyleIds:[],defaultFontWeight:900}],["sharp-duotone",{defaultShortPrefixId:"fasds",defaultStyleId:"solid",styleIds:["solid","regular","light","thin"],futureStyleIds:[],defaultFontWeight:900}]]),sn={classic:{solid:"fas",regular:"far",light:"fal",thin:"fat",brands:"fab"},duotone:{solid:"fad",regular:"fadr",light:"fadl",thin:"fadt"},sharp:{solid:"fass",regular:"fasr",light:"fasl",thin:"fast"},"sharp-duotone":{solid:"fasds",regular:"fasdr",light:"fasdl",thin:"fasdt"}},on=["fak","fa-kit","fakd","fa-kit-duotone"],Gt={kit:{fak:"kit","fa-kit":"kit"},"kit-duotone":{fakd:"kit-duotone","fa-kit-duotone":"kit-duotone"}},cn=["kit"],ln={kit:{"fa-kit":"fak"}},fn=["fak","fakd"],un={kit:{fak:"fa-kit"}},Xt={kit:{kit:"fak"},"kit-duotone":{"kit-duotone":"fakd"}},Q={GROUP:"duotone-group",SWAP_OPACITY:"swap-opacity",PRIMARY:"primary",SECONDARY:"secondary"},mn=["fa-classic","fa-duotone","fa-sharp","fa-sharp-duotone"],dn=["fak","fa-kit","fakd","fa-kit-duotone"],gn={"Font Awesome Kit":{400:"fak",normal:"fak"},"Font Awesome Kit Duotone":{400:"fakd",normal:"fakd"}},pn={classic:{"fa-brands":"fab","fa-duotone":"fad","fa-light":"fal","fa-regular":"far","fa-solid":"fas","fa-thin":"fat"},duotone:{"fa-regular":"fadr","fa-light":"fadl","fa-thin":"fadt"},sharp:{"fa-solid":"fass","fa-regular":"fasr","fa-light":"fasl","fa-thin":"fast"},"sharp-duotone":{"fa-solid":"fasds","fa-regular":"fasdr","fa-light":"fasdl","fa-thin":"fasdt"}},hn={classic:["fas","far","fal","fat","fad"],duotone:["fadr","fadl","fadt"],sharp:["fass","fasr","fasl","fast"],"sharp-duotone":["fasds","fasdr","fasdl","fasdt"]},dt={classic:{fab:"fa-brands",fad:"fa-duotone",fal:"fa-light",far:"fa-regular",fas:"fa-solid",fat:"fa-thin"},duotone:{fadr:"fa-regular",fadl:"fa-light",fadt:"fa-thin"},sharp:{fass:"fa-solid",fasr:"fa-regular",fasl:"fa-light",fast:"fa-thin"},"sharp-duotone":{fasds:"fa-solid",fasdr:"fa-regular",fasdl:"fa-light",fasdt:"fa-thin"}},bn=["fa-solid","fa-regular","fa-light","fa-thin","fa-duotone","fa-brands"],gt=["fa","fas","far","fal","fat","fad","fadr","fadl","fadt","fab","fass","fasr","fasl","fast","fasds","fasdr","fasdl","fasdt",...mn,...bn],yn=["solid","regular","light","thin","duotone","brands"],xe=[1,2,3,4,5,6,7,8,9,10],vn=xe.concat([11,12,13,14,15,16,17,18,19,20]),xn=[...Object.keys(hn),...yn,"2xs","xs","sm","lg","xl","2xl","beat","border","fade","beat-fade","bounce","flip-both","flip-horizontal","flip-vertical","flip","fw","inverse","layers-counter","layers-text","layers","li","pull-left","pull-right","pulse","rotate-180","rotate-270","rotate-90","rotate-by","shake","spin-pulse","spin-reverse","spin","stack-1x","stack-2x","stack","ul",Q.GROUP,Q.SWAP_OPACITY,Q.PRIMARY,Q.SECONDARY].concat(xe.map(t=>"".concat(t,"x"))).concat(vn.map(t=>"w-".concat(t))),An={"Font Awesome 5 Free":{900:"fas",400:"far"},"Font Awesome 5 Pro":{900:"fas",400:"far",normal:"far",300:"fal"},"Font Awesome 5 Brands":{400:"fab",normal:"fab"},"Font Awesome 5 Duotone":{900:"fad"}};const S="___FONT_AWESOME___",pt=16,Ae="fa",ke="svg-inline--fa",F="data-fa-i2svg",ht="data-fa-pseudo-element",kn="data-fa-pseudo-element-pending",Nt="data-prefix",Ot="data-icon",Vt="fontawesome-i2svg",Cn="async",wn=["HTML","HEAD","STYLE","SCRIPT"],Ce=(()=>{try{return!0}catch{return!1}})();function $(t){return new Proxy(t,{get(e,n){return n in e?e[n]:e[h]}})}const we=o({},be);we[h]=o(o(o(o({},{"fa-duotone":"duotone"}),be[h]),Gt.kit),Gt["kit-duotone"]);const Sn=$(we),bt=o({},sn);bt[h]=o(o(o(o({},{duotone:"fad"}),bt[h]),Xt.kit),Xt["kit-duotone"]);const Bt=$(bt),yt=o({},dt);yt[h]=o(o({},yt[h]),un.kit);const zt=$(yt),vt=o({},pn);vt[h]=o(o({},vt[h]),ln.kit);$(vt);const Pn=Qe,Se="fa-layers-text",En=Je,Ln=o({},nn);$(Ln);const Mn=["class","data-prefix","data-icon","data-fa-transform","data-fa-mask"],ct=Ze,Nn=[...cn,...xn],G=N.FontAwesomeConfig||{};function On(t){var e=p.querySelector("script["+t+"]");if(e)return e.getAttribute(t)}function zn(t){return t===""?!0:t==="false"?!1:t==="true"?!0:t}p&&typeof p.querySelector=="function"&&[["data-family-prefix","familyPrefix"],["data-css-prefix","cssPrefix"],["data-family-default","familyDefault"],["data-style-default","styleDefault"],["data-replacement-class","replacementClass"],["data-auto-replace-svg","autoReplaceSvg"],["data-auto-add-css","autoAddCss"],["data-auto-a11y","autoA11y"],["data-search-pseudo-elements","searchPseudoElements"],["data-observe-mutations","observeMutations"],["data-mutate-approach","mutateApproach"],["data-keep-original-source","keepOriginalSource"],["data-measure-performance","measurePerformance"],["data-show-missing-icons","showMissingIcons"]].forEach(e=>{let[n,a]=e;const r=zn(On(n));r!=null&&(G[a]=r)});const Pe={styleDefault:"solid",familyDefault:h,cssPrefix:Ae,replacementClass:ke,autoReplaceSvg:!0,autoAddCss:!0,autoA11y:!0,searchPseudoElements:!1,observeMutations:!0,mutateApproach:"async",keepOriginalSource:!0,measurePerformance:!1,showMissingIcons:!0};G.familyPrefix&&(G.cssPrefix=G.familyPrefix);const U=o(o({},Pe),G);U.autoReplaceSvg||(U.observeMutations=!1);const l={};Object.keys(Pe).forEach(t=>{Object.defineProperty(l,t,{enumerable:!0,set:function(e){U[t]=e,X.forEach(n=>n(l))},get:function(){return U[t]}})});Object.defineProperty(l,"familyPrefix",{enumerable:!0,set:function(t){U.cssPrefix=t,X.forEach(e=>e(l))},get:function(){return U.cssPrefix}});N.FontAwesomeConfig=l;const X=[];function In(t){return X.push(t),()=>{X.splice(X.indexOf(t),1)}}const M=pt,k={size:16,x:0,y:0,rotate:0,flipX:!1,flipY:!1};function Tn(t){if(!t||!E)return;const e=p.createElement("style");e.setAttribute("type","text/css"),e.innerHTML=t;const n=p.head.childNodes;let a=null;for(let r=n.length-1;r>-1;r--){const s=n[r],i=(s.tagName||"").toUpperCase();["STYLE","LINK"].indexOf(i)>-1&&(a=s)}return p.head.insertBefore(e,a),t}const Fn="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";function V(){let t=12,e="";for(;t-- >0;)e+=Fn[Math.random()*62|0];return e}function W(t){const e=[];for(let n=(t||[]).length>>>0;n--;)e[n]=t[n];return e}function It(t){return t.classList?W(t.classList):(t.getAttribute("class")||"").split(" ").filter(e=>e)}function Ee(t){return"".concat(t).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/'/g,"&#39;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function _n(t){return Object.keys(t||{}).reduce((e,n)=>e+"".concat(n,'="').concat(Ee(t[n]),'" '),"").trim()}function at(t){return Object.keys(t||{}).reduce((e,n)=>e+"".concat(n,": ").concat(t[n].trim(),";"),"")}function Tt(t){return t.size!==k.size||t.x!==k.x||t.y!==k.y||t.rotate!==k.rotate||t.flipX||t.flipY}function Dn(t){let{transform:e,containerWidth:n,iconWidth:a}=t;const r={transform:"translate(".concat(n/2," 256)")},s="translate(".concat(e.x*32,", ").concat(e.y*32,") "),i="scale(".concat(e.size/16*(e.flipX?-1:1),", ").concat(e.size/16*(e.flipY?-1:1),") "),c="rotate(".concat(e.rotate," 0 0)"),u={transform:"".concat(s," ").concat(i," ").concat(c)},f={transform:"translate(".concat(a/2*-1," -256)")};return{outer:r,inner:u,path:f}}function Rn(t){let{transform:e,width:n=pt,height:a=pt,startCentered:r=!1}=t,s="";return r&&he?s+="translate(".concat(e.x/M-n/2,"em, ").concat(e.y/M-a/2,"em) "):r?s+="translate(calc(-50% + ".concat(e.x/M,"em), calc(-50% + ").concat(e.y/M,"em)) "):s+="translate(".concat(e.x/M,"em, ").concat(e.y/M,"em) "),s+="scale(".concat(e.size/M*(e.flipX?-1:1),", ").concat(e.size/M*(e.flipY?-1:1),") "),s+="rotate(".concat(e.rotate,"deg) "),s}var jn=`:root, :host {
  --fa-font-solid: normal 900 1em/1 "Font Awesome 6 Free";
  --fa-font-regular: normal 400 1em/1 "Font Awesome 6 Free";
  --fa-font-light: normal 300 1em/1 "Font Awesome 6 Pro";
  --fa-font-thin: normal 100 1em/1 "Font Awesome 6 Pro";
  --fa-font-duotone: normal 900 1em/1 "Font Awesome 6 Duotone";
  --fa-font-duotone-regular: normal 400 1em/1 "Font Awesome 6 Duotone";
  --fa-font-duotone-light: normal 300 1em/1 "Font Awesome 6 Duotone";
  --fa-font-duotone-thin: normal 100 1em/1 "Font Awesome 6 Duotone";
  --fa-font-brands: normal 400 1em/1 "Font Awesome 6 Brands";
  --fa-font-sharp-solid: normal 900 1em/1 "Font Awesome 6 Sharp";
  --fa-font-sharp-regular: normal 400 1em/1 "Font Awesome 6 Sharp";
  --fa-font-sharp-light: normal 300 1em/1 "Font Awesome 6 Sharp";
  --fa-font-sharp-thin: normal 100 1em/1 "Font Awesome 6 Sharp";
  --fa-font-sharp-duotone-solid: normal 900 1em/1 "Font Awesome 6 Sharp Duotone";
  --fa-font-sharp-duotone-regular: normal 400 1em/1 "Font Awesome 6 Sharp Duotone";
  --fa-font-sharp-duotone-light: normal 300 1em/1 "Font Awesome 6 Sharp Duotone";
  --fa-font-sharp-duotone-thin: normal 100 1em/1 "Font Awesome 6 Sharp Duotone";
}

svg:not(:root).svg-inline--fa, svg:not(:host).svg-inline--fa {
  overflow: visible;
  box-sizing: content-box;
}

.svg-inline--fa {
  display: var(--fa-display, inline-block);
  height: 1em;
  overflow: visible;
  vertical-align: -0.125em;
}
.svg-inline--fa.fa-2xs {
  vertical-align: 0.1em;
}
.svg-inline--fa.fa-xs {
  vertical-align: 0em;
}
.svg-inline--fa.fa-sm {
  vertical-align: -0.0714285705em;
}
.svg-inline--fa.fa-lg {
  vertical-align: -0.2em;
}
.svg-inline--fa.fa-xl {
  vertical-align: -0.25em;
}
.svg-inline--fa.fa-2xl {
  vertical-align: -0.3125em;
}
.svg-inline--fa.fa-pull-left {
  margin-right: var(--fa-pull-margin, 0.3em);
  width: auto;
}
.svg-inline--fa.fa-pull-right {
  margin-left: var(--fa-pull-margin, 0.3em);
  width: auto;
}
.svg-inline--fa.fa-li {
  width: var(--fa-li-width, 2em);
  top: 0.25em;
}
.svg-inline--fa.fa-fw {
  width: var(--fa-fw-width, 1.25em);
}

.fa-layers svg.svg-inline--fa {
  bottom: 0;
  left: 0;
  margin: auto;
  position: absolute;
  right: 0;
  top: 0;
}

.fa-layers-counter, .fa-layers-text {
  display: inline-block;
  position: absolute;
  text-align: center;
}

.fa-layers {
  display: inline-block;
  height: 1em;
  position: relative;
  text-align: center;
  vertical-align: -0.125em;
  width: 1em;
}
.fa-layers svg.svg-inline--fa {
  transform-origin: center center;
}

.fa-layers-text {
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  transform-origin: center center;
}

.fa-layers-counter {
  background-color: var(--fa-counter-background-color, #ff253a);
  border-radius: var(--fa-counter-border-radius, 1em);
  box-sizing: border-box;
  color: var(--fa-inverse, #fff);
  line-height: var(--fa-counter-line-height, 1);
  max-width: var(--fa-counter-max-width, 5em);
  min-width: var(--fa-counter-min-width, 1.5em);
  overflow: hidden;
  padding: var(--fa-counter-padding, 0.25em 0.5em);
  right: var(--fa-right, 0);
  text-overflow: ellipsis;
  top: var(--fa-top, 0);
  transform: scale(var(--fa-counter-scale, 0.25));
  transform-origin: top right;
}

.fa-layers-bottom-right {
  bottom: var(--fa-bottom, 0);
  right: var(--fa-right, 0);
  top: auto;
  transform: scale(var(--fa-layers-scale, 0.25));
  transform-origin: bottom right;
}

.fa-layers-bottom-left {
  bottom: var(--fa-bottom, 0);
  left: var(--fa-left, 0);
  right: auto;
  top: auto;
  transform: scale(var(--fa-layers-scale, 0.25));
  transform-origin: bottom left;
}

.fa-layers-top-right {
  top: var(--fa-top, 0);
  right: var(--fa-right, 0);
  transform: scale(var(--fa-layers-scale, 0.25));
  transform-origin: top right;
}

.fa-layers-top-left {
  left: var(--fa-left, 0);
  right: auto;
  top: var(--fa-top, 0);
  transform: scale(var(--fa-layers-scale, 0.25));
  transform-origin: top left;
}

.fa-1x {
  font-size: 1em;
}

.fa-2x {
  font-size: 2em;
}

.fa-3x {
  font-size: 3em;
}

.fa-4x {
  font-size: 4em;
}

.fa-5x {
  font-size: 5em;
}

.fa-6x {
  font-size: 6em;
}

.fa-7x {
  font-size: 7em;
}

.fa-8x {
  font-size: 8em;
}

.fa-9x {
  font-size: 9em;
}

.fa-10x {
  font-size: 10em;
}

.fa-2xs {
  font-size: 0.625em;
  line-height: 0.1em;
  vertical-align: 0.225em;
}

.fa-xs {
  font-size: 0.75em;
  line-height: 0.0833333337em;
  vertical-align: 0.125em;
}

.fa-sm {
  font-size: 0.875em;
  line-height: 0.0714285718em;
  vertical-align: 0.0535714295em;
}

.fa-lg {
  font-size: 1.25em;
  line-height: 0.05em;
  vertical-align: -0.075em;
}

.fa-xl {
  font-size: 1.5em;
  line-height: 0.0416666682em;
  vertical-align: -0.125em;
}

.fa-2xl {
  font-size: 2em;
  line-height: 0.03125em;
  vertical-align: -0.1875em;
}

.fa-fw {
  text-align: center;
  width: 1.25em;
}

.fa-ul {
  list-style-type: none;
  margin-left: var(--fa-li-margin, 2.5em);
  padding-left: 0;
}
.fa-ul > li {
  position: relative;
}

.fa-li {
  left: calc(-1 * var(--fa-li-width, 2em));
  position: absolute;
  text-align: center;
  width: var(--fa-li-width, 2em);
  line-height: inherit;
}

.fa-border {
  border-color: var(--fa-border-color, #eee);
  border-radius: var(--fa-border-radius, 0.1em);
  border-style: var(--fa-border-style, solid);
  border-width: var(--fa-border-width, 0.08em);
  padding: var(--fa-border-padding, 0.2em 0.25em 0.15em);
}

.fa-pull-left {
  float: left;
  margin-right: var(--fa-pull-margin, 0.3em);
}

.fa-pull-right {
  float: right;
  margin-left: var(--fa-pull-margin, 0.3em);
}

.fa-beat {
  animation-name: fa-beat;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, ease-in-out);
}

.fa-bounce {
  animation-name: fa-bounce;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.28, 0.84, 0.42, 1));
}

.fa-fade {
  animation-name: fa-fade;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.4, 0, 0.6, 1));
}

.fa-beat-fade {
  animation-name: fa-beat-fade;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.4, 0, 0.6, 1));
}

.fa-flip {
  animation-name: fa-flip;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, ease-in-out);
}

.fa-shake {
  animation-name: fa-shake;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, linear);
}

.fa-spin {
  animation-name: fa-spin;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 2s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, linear);
}

.fa-spin-reverse {
  --fa-animation-direction: reverse;
}

.fa-pulse,
.fa-spin-pulse {
  animation-name: fa-spin;
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, steps(8));
}

@media (prefers-reduced-motion: reduce) {
  .fa-beat,
.fa-bounce,
.fa-fade,
.fa-beat-fade,
.fa-flip,
.fa-pulse,
.fa-shake,
.fa-spin,
.fa-spin-pulse {
    animation-delay: -1ms;
    animation-duration: 1ms;
    animation-iteration-count: 1;
    transition-delay: 0s;
    transition-duration: 0s;
  }
}
@keyframes fa-beat {
  0%, 90% {
    transform: scale(1);
  }
  45% {
    transform: scale(var(--fa-beat-scale, 1.25));
  }
}
@keyframes fa-bounce {
  0% {
    transform: scale(1, 1) translateY(0);
  }
  10% {
    transform: scale(var(--fa-bounce-start-scale-x, 1.1), var(--fa-bounce-start-scale-y, 0.9)) translateY(0);
  }
  30% {
    transform: scale(var(--fa-bounce-jump-scale-x, 0.9), var(--fa-bounce-jump-scale-y, 1.1)) translateY(var(--fa-bounce-height, -0.5em));
  }
  50% {
    transform: scale(var(--fa-bounce-land-scale-x, 1.05), var(--fa-bounce-land-scale-y, 0.95)) translateY(0);
  }
  57% {
    transform: scale(1, 1) translateY(var(--fa-bounce-rebound, -0.125em));
  }
  64% {
    transform: scale(1, 1) translateY(0);
  }
  100% {
    transform: scale(1, 1) translateY(0);
  }
}
@keyframes fa-fade {
  50% {
    opacity: var(--fa-fade-opacity, 0.4);
  }
}
@keyframes fa-beat-fade {
  0%, 100% {
    opacity: var(--fa-beat-fade-opacity, 0.4);
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(var(--fa-beat-fade-scale, 1.125));
  }
}
@keyframes fa-flip {
  50% {
    transform: rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), var(--fa-flip-angle, -180deg));
  }
}
@keyframes fa-shake {
  0% {
    transform: rotate(-15deg);
  }
  4% {
    transform: rotate(15deg);
  }
  8%, 24% {
    transform: rotate(-18deg);
  }
  12%, 28% {
    transform: rotate(18deg);
  }
  16% {
    transform: rotate(-22deg);
  }
  20% {
    transform: rotate(22deg);
  }
  32% {
    transform: rotate(-12deg);
  }
  36% {
    transform: rotate(12deg);
  }
  40%, 100% {
    transform: rotate(0deg);
  }
}
@keyframes fa-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.fa-rotate-90 {
  transform: rotate(90deg);
}

.fa-rotate-180 {
  transform: rotate(180deg);
}

.fa-rotate-270 {
  transform: rotate(270deg);
}

.fa-flip-horizontal {
  transform: scale(-1, 1);
}

.fa-flip-vertical {
  transform: scale(1, -1);
}

.fa-flip-both,
.fa-flip-horizontal.fa-flip-vertical {
  transform: scale(-1, -1);
}

.fa-rotate-by {
  transform: rotate(var(--fa-rotate-angle, 0));
}

.fa-stack {
  display: inline-block;
  vertical-align: middle;
  height: 2em;
  position: relative;
  width: 2.5em;
}

.fa-stack-1x,
.fa-stack-2x {
  bottom: 0;
  left: 0;
  margin: auto;
  position: absolute;
  right: 0;
  top: 0;
  z-index: var(--fa-stack-z-index, auto);
}

.svg-inline--fa.fa-stack-1x {
  height: 1em;
  width: 1.25em;
}
.svg-inline--fa.fa-stack-2x {
  height: 2em;
  width: 2.5em;
}

.fa-inverse {
  color: var(--fa-inverse, #fff);
}

.sr-only,
.fa-sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.sr-only-focusable:not(:focus),
.fa-sr-only-focusable:not(:focus) {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.svg-inline--fa .fa-primary {
  fill: var(--fa-primary-color, currentColor);
  opacity: var(--fa-primary-opacity, 1);
}

.svg-inline--fa .fa-secondary {
  fill: var(--fa-secondary-color, currentColor);
  opacity: var(--fa-secondary-opacity, 0.4);
}

.svg-inline--fa.fa-swap-opacity .fa-primary {
  opacity: var(--fa-secondary-opacity, 0.4);
}

.svg-inline--fa.fa-swap-opacity .fa-secondary {
  opacity: var(--fa-primary-opacity, 1);
}

.svg-inline--fa mask .fa-primary,
.svg-inline--fa mask .fa-secondary {
  fill: black;
}`;function Le(){const t=Ae,e=ke,n=l.cssPrefix,a=l.replacementClass;let r=jn;if(n!==t||a!==e){const s=new RegExp("\\.".concat(t,"\\-"),"g"),i=new RegExp("\\--".concat(t,"\\-"),"g"),c=new RegExp("\\.".concat(e),"g");r=r.replace(s,".".concat(n,"-")).replace(i,"--".concat(n,"-")).replace(c,".".concat(a))}return r}let $t=!1;function lt(){l.autoAddCss&&!$t&&(Tn(Le()),$t=!0)}var Yn={mixout(){return{dom:{css:Le,insertCss:lt}}},hooks(){return{beforeDOMElementCreation(){lt()},beforeI2svg(){lt()}}}};const P=N||{};P[S]||(P[S]={});P[S].styles||(P[S].styles={});P[S].hooks||(P[S].hooks={});P[S].shims||(P[S].shims=[]);var C=P[S];const Me=[],Ne=function(){p.removeEventListener("DOMContentLoaded",Ne),tt=1,Me.map(t=>t())};let tt=!1;E&&(tt=(p.documentElement.doScroll?/^loaded|^c/:/^loaded|^i|^c/).test(p.readyState),tt||p.addEventListener("DOMContentLoaded",Ne));function Un(t){E&&(tt?setTimeout(t,0):Me.push(t))}function q(t){const{tag:e,attributes:n={},children:a=[]}=t;return typeof t=="string"?Ee(t):"<".concat(e," ").concat(_n(n),">").concat(a.map(q).join(""),"</").concat(e,">")}function qt(t,e,n){if(t&&t[e]&&t[e][n])return{prefix:e,iconName:n,icon:t[e][n]}}var ft=function(e,n,a,r){var s=Object.keys(e),i=s.length,c=n,u,f,m;for(a===void 0?(u=1,m=e[s[0]]):(u=0,m=a);u<i;u++)f=s[u],m=c(m,e[f],f,e);return m};function Wn(t){const e=[];let n=0;const a=t.length;for(;n<a;){const r=t.charCodeAt(n++);if(r>=55296&&r<=56319&&n<a){const s=t.charCodeAt(n++);(s&64512)==56320?e.push(((r&1023)<<10)+(s&1023)+65536):(e.push(r),n--)}else e.push(r)}return e}function xt(t){const e=Wn(t);return e.length===1?e[0].toString(16):null}function Hn(t,e){const n=t.length;let a=t.charCodeAt(e),r;return a>=55296&&a<=56319&&n>e+1&&(r=t.charCodeAt(e+1),r>=56320&&r<=57343)?(a-55296)*1024+r-56320+65536:a}function Kt(t){return Object.keys(t).reduce((e,n)=>{const a=t[n];return!!a.icon?e[a.iconName]=a.icon:e[n]=a,e},{})}function At(t,e){let n=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{};const{skipHooks:a=!1}=n,r=Kt(e);typeof C.hooks.addPack=="function"&&!a?C.hooks.addPack(t,Kt(e)):C.styles[t]=o(o({},C.styles[t]||{}),r),t==="fas"&&At("fa",e)}const{styles:B,shims:Gn}=C,Oe=Object.keys(zt),Xn=Oe.reduce((t,e)=>(t[e]=Object.keys(zt[e]),t),{});let Ft=null,ze={},Ie={},Te={},Fe={},_e={};function Vn(t){return~Nn.indexOf(t)}function Bn(t,e){const n=e.split("-"),a=n[0],r=n.slice(1).join("-");return a===t&&r!==""&&!Vn(r)?r:null}const De=()=>{const t=a=>ft(B,(r,s,i)=>(r[i]=ft(s,a,{}),r),{});ze=t((a,r,s)=>(r[3]&&(a[r[3]]=s),r[2]&&r[2].filter(c=>typeof c=="number").forEach(c=>{a[c.toString(16)]=s}),a)),Ie=t((a,r,s)=>(a[s]=s,r[2]&&r[2].filter(c=>typeof c=="string").forEach(c=>{a[c]=s}),a)),_e=t((a,r,s)=>{const i=r[2];return a[s]=s,i.forEach(c=>{a[c]=s}),a});const e="far"in B||l.autoFetchSvg,n=ft(Gn,(a,r)=>{const s=r[0];let i=r[1];const c=r[2];return i==="far"&&!e&&(i="fas"),typeof s=="string"&&(a.names[s]={prefix:i,iconName:c}),typeof s=="number"&&(a.unicodes[s.toString(16)]={prefix:i,iconName:c}),a},{names:{},unicodes:{}});Te=n.names,Fe=n.unicodes,Ft=rt(l.styleDefault,{family:l.familyDefault})};In(t=>{Ft=rt(t.styleDefault,{family:l.familyDefault})});De();function _t(t,e){return(ze[t]||{})[e]}function $n(t,e){return(Ie[t]||{})[e]}function T(t,e){return(_e[t]||{})[e]}function Re(t){return Te[t]||{prefix:null,iconName:null}}function qn(t){const e=Fe[t],n=_t("fas",t);return e||(n?{prefix:"fas",iconName:n}:null)||{prefix:null,iconName:null}}function O(){return Ft}const je=()=>({prefix:null,iconName:null,rest:[]});function Kn(t){let e=h;const n=Oe.reduce((a,r)=>(a[r]="".concat(l.cssPrefix,"-").concat(r),a),{});return ve.forEach(a=>{(t.includes(n[a])||t.some(r=>Xn[a].includes(r)))&&(e=a)}),e}function rt(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};const{family:n=h}=e,a=Sn[n][t];if(n===nt&&!t)return"fad";const r=Bt[n][t]||Bt[n][a],s=t in C.styles?t:null;return r||s||null}function Qn(t){let e=[],n=null;return t.forEach(a=>{const r=Bn(l.cssPrefix,a);r?n=r:a&&e.push(a)}),{iconName:n,rest:e}}function Qt(t){return t.sort().filter((e,n,a)=>a.indexOf(e)===n)}function st(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};const{skipLookups:n=!1}=e;let a=null;const r=gt.concat(dn),s=Qt(t.filter(g=>r.includes(g))),i=Qt(t.filter(g=>!gt.includes(g))),c=s.filter(g=>(a=g,!ye.includes(g))),[u=null]=c,f=Kn(s),m=o(o({},Qn(i)),{},{prefix:rt(u,{family:f})});return o(o(o({},m),ea({values:t,family:f,styles:B,config:l,canonical:m,givenPrefix:a})),Jn(n,a,m))}function Jn(t,e,n){let{prefix:a,iconName:r}=n;if(t||!a||!r)return{prefix:a,iconName:r};const s=e==="fa"?Re(r):{},i=T(a,r);return r=s.iconName||i||r,a=s.prefix||a,a==="far"&&!B.far&&B.fas&&!l.autoFetchSvg&&(a="fas"),{prefix:a,iconName:r}}const Zn=ve.filter(t=>t!==h||t!==nt),ta=Object.keys(dt).filter(t=>t!==h).map(t=>Object.keys(dt[t])).flat();function ea(t){const{values:e,family:n,canonical:a,givenPrefix:r="",styles:s={},config:i={}}=t,c=n===nt,u=e.includes("fa-duotone")||e.includes("fad"),f=i.familyDefault==="duotone",m=a.prefix==="fad"||a.prefix==="fa-duotone";if(!c&&(u||f||m)&&(a.prefix="fad"),(e.includes("fa-brands")||e.includes("fab"))&&(a.prefix="fab"),!a.prefix&&Zn.includes(n)&&(Object.keys(s).find(d=>ta.includes(d))||i.autoFetchSvg)){const d=rn.get(n).defaultShortPrefixId;a.prefix=d,a.iconName=T(a.prefix,a.iconName)||a.iconName}return(a.prefix==="fa"||r==="fa")&&(a.prefix=O()||"fas"),a}class na{constructor(){this.definitions={}}add(){for(var e=arguments.length,n=new Array(e),a=0;a<e;a++)n[a]=arguments[a];const r=n.reduce(this._pullDefinitions,{});Object.keys(r).forEach(s=>{this.definitions[s]=o(o({},this.definitions[s]||{}),r[s]),At(s,r[s]);const i=zt[h][s];i&&At(i,r[s]),De()})}reset(){this.definitions={}}_pullDefinitions(e,n){const a=n.prefix&&n.iconName&&n.icon?{0:n}:n;return Object.keys(a).map(r=>{const{prefix:s,iconName:i,icon:c}=a[r],u=c[2];e[s]||(e[s]={}),u.length>0&&u.forEach(f=>{typeof f=="string"&&(e[s][f]=c)}),e[s][i]=c}),e}}let Jt=[],j={};const Y={},aa=Object.keys(Y);function ra(t,e){let{mixoutsTo:n}=e;return Jt=t,j={},Object.keys(Y).forEach(a=>{aa.indexOf(a)===-1&&delete Y[a]}),Jt.forEach(a=>{const r=a.mixout?a.mixout():{};if(Object.keys(r).forEach(s=>{typeof r[s]=="function"&&(n[s]=r[s]),typeof r[s]=="object"&&Object.keys(r[s]).forEach(i=>{n[s]||(n[s]={}),n[s][i]=r[s][i]})}),a.hooks){const s=a.hooks();Object.keys(s).forEach(i=>{j[i]||(j[i]=[]),j[i].push(s[i])})}a.provides&&a.provides(Y)}),n}function kt(t,e){for(var n=arguments.length,a=new Array(n>2?n-2:0),r=2;r<n;r++)a[r-2]=arguments[r];return(j[t]||[]).forEach(i=>{e=i.apply(null,[e,...a])}),e}function _(t){for(var e=arguments.length,n=new Array(e>1?e-1:0),a=1;a<e;a++)n[a-1]=arguments[a];(j[t]||[]).forEach(s=>{s.apply(null,n)})}function z(){const t=arguments[0],e=Array.prototype.slice.call(arguments,1);return Y[t]?Y[t].apply(null,e):void 0}function Ct(t){t.prefix==="fa"&&(t.prefix="fas");let{iconName:e}=t;const n=t.prefix||O();if(e)return e=T(n,e)||e,qt(Ye.definitions,n,e)||qt(C.styles,n,e)}const Ye=new na,sa=()=>{l.autoReplaceSvg=!1,l.observeMutations=!1,_("noAuto")},ia={i2svg:function(){let t=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};return E?(_("beforeI2svg",t),z("pseudoElements2svg",t),z("i2svg",t)):Promise.reject(new Error("Operation requires a DOM of some kind."))},watch:function(){let t=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};const{autoReplaceSvgRoot:e}=t;l.autoReplaceSvg===!1&&(l.autoReplaceSvg=!0),l.observeMutations=!0,Un(()=>{ca({autoReplaceSvgRoot:e}),_("watch",t)})}},oa={icon:t=>{if(t===null)return null;if(typeof t=="object"&&t.prefix&&t.iconName)return{prefix:t.prefix,iconName:T(t.prefix,t.iconName)||t.iconName};if(Array.isArray(t)&&t.length===2){const e=t[1].indexOf("fa-")===0?t[1].slice(3):t[1],n=rt(t[0]);return{prefix:n,iconName:T(n,e)||e}}if(typeof t=="string"&&(t.indexOf("".concat(l.cssPrefix,"-"))>-1||t.match(Pn))){const e=st(t.split(" "),{skipLookups:!0});return{prefix:e.prefix||O(),iconName:T(e.prefix,e.iconName)||e.iconName}}if(typeof t=="string"){const e=O();return{prefix:e,iconName:T(e,t)||t}}}},v={noAuto:sa,config:l,dom:ia,parse:oa,library:Ye,findIconDefinition:Ct,toHtml:q},ca=function(){let t=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};const{autoReplaceSvgRoot:e=p}=t;(Object.keys(C.styles).length>0||l.autoFetchSvg)&&E&&l.autoReplaceSvg&&v.dom.i2svg({node:e})};function it(t,e){return Object.defineProperty(t,"abstract",{get:e}),Object.defineProperty(t,"html",{get:function(){return t.abstract.map(n=>q(n))}}),Object.defineProperty(t,"node",{get:function(){if(!E)return;const n=p.createElement("div");return n.innerHTML=t.html,n.children}}),t}function la(t){let{children:e,main:n,mask:a,attributes:r,styles:s,transform:i}=t;if(Tt(i)&&n.found&&!a.found){const{width:c,height:u}=n,f={x:c/u/2,y:.5};r.style=at(o(o({},s),{},{"transform-origin":"".concat(f.x+i.x/16,"em ").concat(f.y+i.y/16,"em")}))}return[{tag:"svg",attributes:r,children:e}]}function fa(t){let{prefix:e,iconName:n,children:a,attributes:r,symbol:s}=t;const i=s===!0?"".concat(e,"-").concat(l.cssPrefix,"-").concat(n):s;return[{tag:"svg",attributes:{style:"display: none;"},children:[{tag:"symbol",attributes:o(o({},r),{},{id:i}),children:a}]}]}function Dt(t){const{icons:{main:e,mask:n},prefix:a,iconName:r,transform:s,symbol:i,title:c,maskId:u,titleId:f,extra:m,watchable:g=!1}=t,{width:d,height:b}=n.found?n:e,L=fn.includes(a),I=[l.replacementClass,r?"".concat(l.cssPrefix,"-").concat(r):""].filter(R=>m.classes.indexOf(R)===-1).filter(R=>R!==""||!!R).concat(m.classes).join(" ");let x={children:[],attributes:o(o({},m.attributes),{},{"data-prefix":a,"data-icon":r,class:I,role:m.attributes.role||"img",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 ".concat(d," ").concat(b)})};const w=L&&!~m.classes.indexOf("fa-fw")?{width:"".concat(d/b*16*.0625,"em")}:{};g&&(x.attributes[F]=""),c&&(x.children.push({tag:"title",attributes:{id:x.attributes["aria-labelledby"]||"title-".concat(f||V())},children:[c]}),delete x.attributes.title);const y=o(o({},x),{},{prefix:a,iconName:r,main:e,mask:n,maskId:u,transform:s,symbol:i,styles:o(o({},w),m.styles)}),{children:A,attributes:D}=n.found&&e.found?z("generateAbstractMask",y)||{children:[],attributes:{}}:z("generateAbstractIcon",y)||{children:[],attributes:{}};return y.children=A,y.attributes=D,i?fa(y):la(y)}function Zt(t){const{content:e,width:n,height:a,transform:r,title:s,extra:i,watchable:c=!1}=t,u=o(o(o({},i.attributes),s?{title:s}:{}),{},{class:i.classes.join(" ")});c&&(u[F]="");const f=o({},i.styles);Tt(r)&&(f.transform=Rn({transform:r,startCentered:!0,width:n,height:a}),f["-webkit-transform"]=f.transform);const m=at(f);m.length>0&&(u.style=m);const g=[];return g.push({tag:"span",attributes:u,children:[e]}),s&&g.push({tag:"span",attributes:{class:"sr-only"},children:[s]}),g}function ua(t){const{content:e,title:n,extra:a}=t,r=o(o(o({},a.attributes),n?{title:n}:{}),{},{class:a.classes.join(" ")}),s=at(a.styles);s.length>0&&(r.style=s);const i=[];return i.push({tag:"span",attributes:r,children:[e]}),n&&i.push({tag:"span",attributes:{class:"sr-only"},children:[n]}),i}const{styles:ut}=C;function wt(t){const e=t[0],n=t[1],[a]=t.slice(4);let r=null;return Array.isArray(a)?r={tag:"g",attributes:{class:"".concat(l.cssPrefix,"-").concat(ct.GROUP)},children:[{tag:"path",attributes:{class:"".concat(l.cssPrefix,"-").concat(ct.SECONDARY),fill:"currentColor",d:a[0]}},{tag:"path",attributes:{class:"".concat(l.cssPrefix,"-").concat(ct.PRIMARY),fill:"currentColor",d:a[1]}}]}:r={tag:"path",attributes:{fill:"currentColor",d:a}},{found:!0,width:e,height:n,icon:r}}const ma={found:!1,width:512,height:512};function da(t,e){!Ce&&!l.showMissingIcons&&t&&console.error('Icon with name "'.concat(t,'" and prefix "').concat(e,'" is missing.'))}function St(t,e){let n=e;return e==="fa"&&l.styleDefault!==null&&(e=O()),new Promise((a,r)=>{if(n==="fa"){const s=Re(t)||{};t=s.iconName||t,e=s.prefix||e}if(t&&e&&ut[e]&&ut[e][t]){const s=ut[e][t];return a(wt(s))}da(t,e),a(o(o({},ma),{},{icon:l.showMissingIcons&&t?z("missingIconAbstract")||{}:{}}))})}const te=()=>{},Pt=l.measurePerformance&&K&&K.mark&&K.measure?K:{mark:te,measure:te},H='FA "6.7.2"',ga=t=>(Pt.mark("".concat(H," ").concat(t," begins")),()=>Ue(t)),Ue=t=>{Pt.mark("".concat(H," ").concat(t," ends")),Pt.measure("".concat(H," ").concat(t),"".concat(H," ").concat(t," begins"),"".concat(H," ").concat(t," ends"))};var Rt={begin:ga,end:Ue};const J=()=>{};function ee(t){return typeof(t.getAttribute?t.getAttribute(F):null)=="string"}function pa(t){const e=t.getAttribute?t.getAttribute(Nt):null,n=t.getAttribute?t.getAttribute(Ot):null;return e&&n}function ha(t){return t&&t.classList&&t.classList.contains&&t.classList.contains(l.replacementClass)}function ba(){return l.autoReplaceSvg===!0?Z.replace:Z[l.autoReplaceSvg]||Z.replace}function ya(t){return p.createElementNS("http://www.w3.org/2000/svg",t)}function va(t){return p.createElement(t)}function We(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};const{ceFn:n=t.tag==="svg"?ya:va}=e;if(typeof t=="string")return p.createTextNode(t);const a=n(t.tag);return Object.keys(t.attributes||[]).forEach(function(s){a.setAttribute(s,t.attributes[s])}),(t.children||[]).forEach(function(s){a.appendChild(We(s,{ceFn:n}))}),a}function xa(t){let e=" ".concat(t.outerHTML," ");return e="".concat(e,"Font Awesome fontawesome.com "),e}const Z={replace:function(t){const e=t[0];if(e.parentNode)if(t[1].forEach(n=>{e.parentNode.insertBefore(We(n),e)}),e.getAttribute(F)===null&&l.keepOriginalSource){let n=p.createComment(xa(e));e.parentNode.replaceChild(n,e)}else e.remove()},nest:function(t){const e=t[0],n=t[1];if(~It(e).indexOf(l.replacementClass))return Z.replace(t);const a=new RegExp("".concat(l.cssPrefix,"-.*"));if(delete n[0].attributes.id,n[0].attributes.class){const s=n[0].attributes.class.split(" ").reduce((i,c)=>(c===l.replacementClass||c.match(a)?i.toSvg.push(c):i.toNode.push(c),i),{toNode:[],toSvg:[]});n[0].attributes.class=s.toSvg.join(" "),s.toNode.length===0?e.removeAttribute("class"):e.setAttribute("class",s.toNode.join(" "))}const r=n.map(s=>q(s)).join(`
`);e.setAttribute(F,""),e.innerHTML=r}};function ne(t){t()}function He(t,e){const n=typeof e=="function"?e:J;if(t.length===0)n();else{let a=ne;l.mutateApproach===Cn&&(a=N.requestAnimationFrame||ne),a(()=>{const r=ba(),s=Rt.begin("mutate");t.map(r),s(),n()})}}let jt=!1;function Ge(){jt=!0}function Et(){jt=!1}let et=null;function ae(t){if(!Ht||!l.observeMutations)return;const{treeCallback:e=J,nodeCallback:n=J,pseudoElementsCallback:a=J,observeMutationsRoot:r=p}=t;et=new Ht(s=>{if(jt)return;const i=O();W(s).forEach(c=>{if(c.type==="childList"&&c.addedNodes.length>0&&!ee(c.addedNodes[0])&&(l.searchPseudoElements&&a(c.target),e(c.target)),c.type==="attributes"&&c.target.parentNode&&l.searchPseudoElements&&a(c.target.parentNode),c.type==="attributes"&&ee(c.target)&&~Mn.indexOf(c.attributeName))if(c.attributeName==="class"&&pa(c.target)){const{prefix:u,iconName:f}=st(It(c.target));c.target.setAttribute(Nt,u||i),f&&c.target.setAttribute(Ot,f)}else ha(c.target)&&n(c.target)})}),E&&et.observe(r,{childList:!0,attributes:!0,characterData:!0,subtree:!0})}function Aa(){et&&et.disconnect()}function ka(t){const e=t.getAttribute("style");let n=[];return e&&(n=e.split(";").reduce((a,r)=>{const s=r.split(":"),i=s[0],c=s.slice(1);return i&&c.length>0&&(a[i]=c.join(":").trim()),a},{})),n}function Ca(t){const e=t.getAttribute("data-prefix"),n=t.getAttribute("data-icon"),a=t.innerText!==void 0?t.innerText.trim():"";let r=st(It(t));return r.prefix||(r.prefix=O()),e&&n&&(r.prefix=e,r.iconName=n),r.iconName&&r.prefix||(r.prefix&&a.length>0&&(r.iconName=$n(r.prefix,t.innerText)||_t(r.prefix,xt(t.innerText))),!r.iconName&&l.autoFetchSvg&&t.firstChild&&t.firstChild.nodeType===Node.TEXT_NODE&&(r.iconName=t.firstChild.data)),r}function wa(t){const e=W(t.attributes).reduce((r,s)=>(r.name!=="class"&&r.name!=="style"&&(r[s.name]=s.value),r),{}),n=t.getAttribute("title"),a=t.getAttribute("data-fa-title-id");return l.autoA11y&&(n?e["aria-labelledby"]="".concat(l.replacementClass,"-title-").concat(a||V()):(e["aria-hidden"]="true",e.focusable="false")),e}function Sa(){return{iconName:null,title:null,titleId:null,prefix:null,transform:k,symbol:!1,mask:{iconName:null,prefix:null,rest:[]},maskId:null,extra:{classes:[],styles:{},attributes:{}}}}function re(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{styleParser:!0};const{iconName:n,prefix:a,rest:r}=Ca(t),s=wa(t),i=kt("parseNodeAttributes",{},t);let c=e.styleParser?ka(t):[];return o({iconName:n,title:t.getAttribute("title"),titleId:t.getAttribute("data-fa-title-id"),prefix:a,transform:k,mask:{iconName:null,prefix:null,rest:[]},maskId:null,symbol:!1,extra:{classes:r,styles:c,attributes:s}},i)}const{styles:Pa}=C;function Xe(t){const e=l.autoReplaceSvg==="nest"?re(t,{styleParser:!1}):re(t);return~e.extra.classes.indexOf(Se)?z("generateLayersText",t,e):z("generateSvgReplacementMutation",t,e)}function Ea(){return[...on,...gt]}function se(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:null;if(!E)return Promise.resolve();const n=p.documentElement.classList,a=m=>n.add("".concat(Vt,"-").concat(m)),r=m=>n.remove("".concat(Vt,"-").concat(m)),s=l.autoFetchSvg?Ea():ye.concat(Object.keys(Pa));s.includes("fa")||s.push("fa");const i=[".".concat(Se,":not([").concat(F,"])")].concat(s.map(m=>".".concat(m,":not([").concat(F,"])"))).join(", ");if(i.length===0)return Promise.resolve();let c=[];try{c=W(t.querySelectorAll(i))}catch{}if(c.length>0)a("pending"),r("complete");else return Promise.resolve();const u=Rt.begin("onTree"),f=c.reduce((m,g)=>{try{const d=Xe(g);d&&m.push(d)}catch(d){Ce||d.name==="MissingIcon"&&console.error(d)}return m},[]);return new Promise((m,g)=>{Promise.all(f).then(d=>{He(d,()=>{a("active"),a("complete"),r("pending"),typeof e=="function"&&e(),u(),m()})}).catch(d=>{u(),g(d)})})}function La(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:null;Xe(t).then(n=>{n&&He([n],e)})}function Ma(t){return function(e){let n=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};const a=(e||{}).icon?e:Ct(e||{});let{mask:r}=n;return r&&(r=(r||{}).icon?r:Ct(r||{})),t(a,o(o({},n),{},{mask:r}))}}const Na=function(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};const{transform:n=k,symbol:a=!1,mask:r=null,maskId:s=null,title:i=null,titleId:c=null,classes:u=[],attributes:f={},styles:m={}}=e;if(!t)return;const{prefix:g,iconName:d,icon:b}=t;return it(o({type:"icon"},t),()=>(_("beforeDOMElementCreation",{iconDefinition:t,params:e}),l.autoA11y&&(i?f["aria-labelledby"]="".concat(l.replacementClass,"-title-").concat(c||V()):(f["aria-hidden"]="true",f.focusable="false")),Dt({icons:{main:wt(b),mask:r?wt(r.icon):{found:!1,width:null,height:null,icon:{}}},prefix:g,iconName:d,transform:o(o({},k),n),symbol:a,title:i,maskId:s,titleId:c,extra:{attributes:f,styles:m,classes:u}})))};var Oa={mixout(){return{icon:Ma(Na)}},hooks(){return{mutationObserverCallbacks(t){return t.treeCallback=se,t.nodeCallback=La,t}}},provides(t){t.i2svg=function(e){const{node:n=p,callback:a=()=>{}}=e;return se(n,a)},t.generateSvgReplacementMutation=function(e,n){const{iconName:a,title:r,titleId:s,prefix:i,transform:c,symbol:u,mask:f,maskId:m,extra:g}=n;return new Promise((d,b)=>{Promise.all([St(a,i),f.iconName?St(f.iconName,f.prefix):Promise.resolve({found:!1,width:512,height:512,icon:{}})]).then(L=>{let[I,x]=L;d([e,Dt({icons:{main:I,mask:x},prefix:i,iconName:a,transform:c,symbol:u,maskId:m,title:r,titleId:s,extra:g,watchable:!0})])}).catch(b)})},t.generateAbstractIcon=function(e){let{children:n,attributes:a,main:r,transform:s,styles:i}=e;const c=at(i);c.length>0&&(a.style=c);let u;return Tt(s)&&(u=z("generateAbstractTransformGrouping",{main:r,transform:s,containerWidth:r.width,iconWidth:r.width})),n.push(u||r.icon),{children:n,attributes:a}}}},za={mixout(){return{layer(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};const{classes:n=[]}=e;return it({type:"layer"},()=>{_("beforeDOMElementCreation",{assembler:t,params:e});let a=[];return t(r=>{Array.isArray(r)?r.map(s=>{a=a.concat(s.abstract)}):a=a.concat(r.abstract)}),[{tag:"span",attributes:{class:["".concat(l.cssPrefix,"-layers"),...n].join(" ")},children:a}]})}}}},Ia={mixout(){return{counter(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};const{title:n=null,classes:a=[],attributes:r={},styles:s={}}=e;return it({type:"counter",content:t},()=>(_("beforeDOMElementCreation",{content:t,params:e}),ua({content:t.toString(),title:n,extra:{attributes:r,styles:s,classes:["".concat(l.cssPrefix,"-layers-counter"),...a]}})))}}}},Ta={mixout(){return{text(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};const{transform:n=k,title:a=null,classes:r=[],attributes:s={},styles:i={}}=e;return it({type:"text",content:t},()=>(_("beforeDOMElementCreation",{content:t,params:e}),Zt({content:t,transform:o(o({},k),n),title:a,extra:{attributes:s,styles:i,classes:["".concat(l.cssPrefix,"-layers-text"),...r]}})))}}},provides(t){t.generateLayersText=function(e,n){const{title:a,transform:r,extra:s}=n;let i=null,c=null;if(he){const u=parseInt(getComputedStyle(e).fontSize,10),f=e.getBoundingClientRect();i=f.width/u,c=f.height/u}return l.autoA11y&&!a&&(s.attributes["aria-hidden"]="true"),Promise.resolve([e,Zt({content:e.innerHTML,width:i,height:c,transform:r,title:a,extra:s,watchable:!0})])}}};const Fa=new RegExp('"',"ug"),ie=[1105920,1112319],oe=o(o(o(o({},{FontAwesome:{normal:"fas",400:"fas"}}),an),An),gn),Lt=Object.keys(oe).reduce((t,e)=>(t[e.toLowerCase()]=oe[e],t),{}),_a=Object.keys(Lt).reduce((t,e)=>{const n=Lt[e];return t[e]=n[900]||[...Object.entries(n)][0][1],t},{});function Da(t){const e=t.replace(Fa,""),n=Hn(e,0),a=n>=ie[0]&&n<=ie[1],r=e.length===2?e[0]===e[1]:!1;return{value:xt(r?e[0]:e),isSecondary:a||r}}function Ra(t,e){const n=t.replace(/^['"]|['"]$/g,"").toLowerCase(),a=parseInt(e),r=isNaN(a)?"normal":a;return(Lt[n]||{})[r]||_a[n]}function ce(t,e){const n="".concat(kn).concat(e.replace(":","-"));return new Promise((a,r)=>{if(t.getAttribute(n)!==null)return a();const i=W(t.children).filter(d=>d.getAttribute(ht)===e)[0],c=N.getComputedStyle(t,e),u=c.getPropertyValue("font-family"),f=u.match(En),m=c.getPropertyValue("font-weight"),g=c.getPropertyValue("content");if(i&&!f)return t.removeChild(i),a();if(f&&g!=="none"&&g!==""){const d=c.getPropertyValue("content");let b=Ra(u,m);const{value:L,isSecondary:I}=Da(d),x=f[0].startsWith("FontAwesome");let w=_t(b,L),y=w;if(x){const A=qn(L);A.iconName&&A.prefix&&(w=A.iconName,b=A.prefix)}if(w&&!I&&(!i||i.getAttribute(Nt)!==b||i.getAttribute(Ot)!==y)){t.setAttribute(n,y),i&&t.removeChild(i);const A=Sa(),{extra:D}=A;D.attributes[ht]=e,St(w,b).then(R=>{const Ve=Dt(o(o({},A),{},{icons:{main:R,mask:je()},prefix:b,iconName:y,extra:D,watchable:!0})),ot=p.createElementNS("http://www.w3.org/2000/svg","svg");e==="::before"?t.insertBefore(ot,t.firstChild):t.appendChild(ot),ot.outerHTML=Ve.map(Be=>q(Be)).join(`
`),t.removeAttribute(n),a()}).catch(r)}else a()}else a()})}function ja(t){return Promise.all([ce(t,"::before"),ce(t,"::after")])}function Ya(t){return t.parentNode!==document.head&&!~wn.indexOf(t.tagName.toUpperCase())&&!t.getAttribute(ht)&&(!t.parentNode||t.parentNode.tagName!=="svg")}function le(t){if(E)return new Promise((e,n)=>{const a=W(t.querySelectorAll("*")).filter(Ya).map(ja),r=Rt.begin("searchPseudoElements");Ge(),Promise.all(a).then(()=>{r(),Et(),e()}).catch(()=>{r(),Et(),n()})})}var Ua={hooks(){return{mutationObserverCallbacks(t){return t.pseudoElementsCallback=le,t}}},provides(t){t.pseudoElements2svg=function(e){const{node:n=p}=e;l.searchPseudoElements&&le(n)}}};let fe=!1;var Wa={mixout(){return{dom:{unwatch(){Ge(),fe=!0}}}},hooks(){return{bootstrap(){ae(kt("mutationObserverCallbacks",{}))},noAuto(){Aa()},watch(t){const{observeMutationsRoot:e}=t;fe?Et():ae(kt("mutationObserverCallbacks",{observeMutationsRoot:e}))}}}};const ue=t=>{let e={size:16,x:0,y:0,flipX:!1,flipY:!1,rotate:0};return t.toLowerCase().split(" ").reduce((n,a)=>{const r=a.toLowerCase().split("-"),s=r[0];let i=r.slice(1).join("-");if(s&&i==="h")return n.flipX=!0,n;if(s&&i==="v")return n.flipY=!0,n;if(i=parseFloat(i),isNaN(i))return n;switch(s){case"grow":n.size=n.size+i;break;case"shrink":n.size=n.size-i;break;case"left":n.x=n.x-i;break;case"right":n.x=n.x+i;break;case"up":n.y=n.y-i;break;case"down":n.y=n.y+i;break;case"rotate":n.rotate=n.rotate+i;break}return n},e)};var Ha={mixout(){return{parse:{transform:t=>ue(t)}}},hooks(){return{parseNodeAttributes(t,e){const n=e.getAttribute("data-fa-transform");return n&&(t.transform=ue(n)),t}}},provides(t){t.generateAbstractTransformGrouping=function(e){let{main:n,transform:a,containerWidth:r,iconWidth:s}=e;const i={transform:"translate(".concat(r/2," 256)")},c="translate(".concat(a.x*32,", ").concat(a.y*32,") "),u="scale(".concat(a.size/16*(a.flipX?-1:1),", ").concat(a.size/16*(a.flipY?-1:1),") "),f="rotate(".concat(a.rotate," 0 0)"),m={transform:"".concat(c," ").concat(u," ").concat(f)},g={transform:"translate(".concat(s/2*-1," -256)")},d={outer:i,inner:m,path:g};return{tag:"g",attributes:o({},d.outer),children:[{tag:"g",attributes:o({},d.inner),children:[{tag:n.icon.tag,children:n.icon.children,attributes:o(o({},n.icon.attributes),d.path)}]}]}}}};const mt={x:0,y:0,width:"100%",height:"100%"};function me(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!0;return t.attributes&&(t.attributes.fill||e)&&(t.attributes.fill="black"),t}function Ga(t){return t.tag==="g"?t.children:[t]}var Xa={hooks(){return{parseNodeAttributes(t,e){const n=e.getAttribute("data-fa-mask"),a=n?st(n.split(" ").map(r=>r.trim())):je();return a.prefix||(a.prefix=O()),t.mask=a,t.maskId=e.getAttribute("data-fa-mask-id"),t}}},provides(t){t.generateAbstractMask=function(e){let{children:n,attributes:a,main:r,mask:s,maskId:i,transform:c}=e;const{width:u,icon:f}=r,{width:m,icon:g}=s,d=Dn({transform:c,containerWidth:m,iconWidth:u}),b={tag:"rect",attributes:o(o({},mt),{},{fill:"white"})},L=f.children?{children:f.children.map(me)}:{},I={tag:"g",attributes:o({},d.inner),children:[me(o({tag:f.tag,attributes:o(o({},f.attributes),d.path)},L))]},x={tag:"g",attributes:o({},d.outer),children:[I]},w="mask-".concat(i||V()),y="clip-".concat(i||V()),A={tag:"mask",attributes:o(o({},mt),{},{id:w,maskUnits:"userSpaceOnUse",maskContentUnits:"userSpaceOnUse"}),children:[b,x]},D={tag:"defs",children:[{tag:"clipPath",attributes:{id:y},children:Ga(g)},A]};return n.push(D,{tag:"rect",attributes:o({fill:"currentColor","clip-path":"url(#".concat(y,")"),mask:"url(#".concat(w,")")},mt)}),{children:n,attributes:a}}}},Va={provides(t){let e=!1;N.matchMedia&&(e=N.matchMedia("(prefers-reduced-motion: reduce)").matches),t.missingIconAbstract=function(){const n=[],a={fill:"currentColor"},r={attributeType:"XML",repeatCount:"indefinite",dur:"2s"};n.push({tag:"path",attributes:o(o({},a),{},{d:"M156.5,447.7l-12.6,29.5c-18.7-9.5-35.9-21.2-51.5-34.9l22.7-22.7C127.6,430.5,141.5,440,156.5,447.7z M40.6,272H8.5 c1.4,21.2,5.4,41.7,11.7,61.1L50,321.2C45.1,305.5,41.8,289,40.6,272z M40.6,240c1.4-18.8,5.2-37,11.1-54.1l-29.5-12.6 C14.7,194.3,10,216.7,8.5,240H40.6z M64.3,156.5c7.8-14.9,17.2-28.8,28.1-41.5L69.7,92.3c-13.7,15.6-25.5,32.8-34.9,51.5 L64.3,156.5z M397,419.6c-13.9,12-29.4,22.3-46.1,30.4l11.9,29.8c20.7-9.9,39.8-22.6,56.9-37.6L397,419.6z M115,92.4 c13.9-12,29.4-22.3,46.1-30.4l-11.9-29.8c-20.7,9.9-39.8,22.6-56.8,37.6L115,92.4z M447.7,355.5c-7.8,14.9-17.2,28.8-28.1,41.5 l22.7,22.7c13.7-15.6,25.5-32.9,34.9-51.5L447.7,355.5z M471.4,272c-1.4,18.8-5.2,37-11.1,54.1l29.5,12.6 c7.5-21.1,12.2-43.5,13.6-66.8H471.4z M321.2,462c-15.7,5-32.2,8.2-49.2,9.4v32.1c21.2-1.4,41.7-5.4,61.1-11.7L321.2,462z M240,471.4c-18.8-1.4-37-5.2-54.1-11.1l-12.6,29.5c21.1,7.5,43.5,12.2,66.8,13.6V471.4z M462,190.8c5,15.7,8.2,32.2,9.4,49.2h32.1 c-1.4-21.2-5.4-41.7-11.7-61.1L462,190.8z M92.4,397c-12-13.9-22.3-29.4-30.4-46.1l-29.8,11.9c9.9,20.7,22.6,39.8,37.6,56.9 L92.4,397z M272,40.6c18.8,1.4,36.9,5.2,54.1,11.1l12.6-29.5C317.7,14.7,295.3,10,272,8.5V40.6z M190.8,50 c15.7-5,32.2-8.2,49.2-9.4V8.5c-21.2,1.4-41.7,5.4-61.1,11.7L190.8,50z M442.3,92.3L419.6,115c12,13.9,22.3,29.4,30.5,46.1 l29.8-11.9C470,128.5,457.3,109.4,442.3,92.3z M397,92.4l22.7-22.7c-15.6-13.7-32.8-25.5-51.5-34.9l-12.6,29.5 C370.4,72.1,384.4,81.5,397,92.4z"})});const s=o(o({},r),{},{attributeName:"opacity"}),i={tag:"circle",attributes:o(o({},a),{},{cx:"256",cy:"364",r:"28"}),children:[]};return e||i.children.push({tag:"animate",attributes:o(o({},r),{},{attributeName:"r",values:"28;14;28;28;14;28;"})},{tag:"animate",attributes:o(o({},s),{},{values:"1;0;1;1;0;1;"})}),n.push(i),n.push({tag:"path",attributes:o(o({},a),{},{opacity:"1",d:"M263.7,312h-16c-6.6,0-12-5.4-12-12c0-71,77.4-63.9,77.4-107.8c0-20-17.8-40.2-57.4-40.2c-29.1,0-44.3,9.6-59.2,28.7 c-3.9,5-11.1,6-16.2,2.4l-13.1-9.2c-5.6-3.9-6.9-11.8-2.6-17.2c21.2-27.2,46.4-44.7,91.2-44.7c52.3,0,97.4,29.8,97.4,80.2 c0,67.6-77.4,63.5-77.4,107.8C275.7,306.6,270.3,312,263.7,312z"}),children:e?[]:[{tag:"animate",attributes:o(o({},s),{},{values:"1;0;0;0;0;1;"})}]}),e||n.push({tag:"path",attributes:o(o({},a),{},{opacity:"0",d:"M232.5,134.5l7,168c0.3,6.4,5.6,11.5,12,11.5h9c6.4,0,11.7-5.1,12-11.5l7-168c0.3-6.8-5.2-12.5-12-12.5h-23 C237.7,122,232.2,127.7,232.5,134.5z"}),children:[{tag:"animate",attributes:o(o({},s),{},{values:"0;0;1;1;0;0;"})}]}),{tag:"g",attributes:{class:"missing"},children:n}}}},Ba={hooks(){return{parseNodeAttributes(t,e){const n=e.getAttribute("data-fa-symbol"),a=n===null?!1:n===""?!0:n;return t.symbol=a,t}}}},$a=[Yn,Oa,za,Ia,Ta,Ua,Wa,Ha,Xa,Va,Ba];ra($a,{mixoutsTo:v});v.noAuto;v.config;const Ja=v.library,Za=v.dom;v.parse;v.findIconDefinition;v.toHtml;v.icon;v.layer;v.text;v.counter;const tr={prefix:"fas",iconName:"stethoscope",icon:[576,512,[129658],"f0f1","M142.4 21.9c5.6 16.8-3.5 34.9-20.2 40.5L96 71.1 96 192c0 53 43 96 96 96s96-43 96-96l0-120.9-26.1-8.7c-16.8-5.6-25.8-23.7-20.2-40.5s23.7-25.8 40.5-20.2l26.1 8.7C334.4 19.1 352 43.5 352 71.1L352 192c0 77.2-54.6 141.6-127.3 156.7C231 404.6 278.4 448 336 448c61.9 0 112-50.1 112-112l0-70.7c-28.3-12.3-48-40.5-48-73.3c0-44.2 35.8-80 80-80s80 35.8 80 80c0 32.8-19.7 61-48 73.3l0 70.7c0 97.2-78.8 176-176 176c-92.9 0-168.9-71.9-175.5-163.1C87.2 334.2 32 269.6 32 192L32 71.1c0-27.5 17.6-52 43.8-60.7l26.1-8.7c16.8-5.6 34.9 3.5 40.5 20.2zM480 224a32 32 0 1 0 0-64 32 32 0 1 0 0 64z"]},er={prefix:"fas",iconName:"bookmark",icon:[384,512,[128278,61591],"f02e","M0 48V487.7C0 501.1 10.9 512 24.3 512c5 0 9.9-1.5 14-4.4L192 400 345.7 507.6c4.1 2.9 9 4.4 14 4.4c13.4 0 24.3-10.9 24.3-24.3V48c0-26.5-21.5-48-48-48H48C21.5 0 0 21.5 0 48z"]},nr={prefix:"fas",iconName:"user",icon:[448,512,[128100,62144],"f007","M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l388.6 0c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304l-91.4 0z"]},ar={prefix:"fas",iconName:"temperature-high",icon:[512,512,[],"f769","M416 64a32 32 0 1 1 0 64 32 32 0 1 1 0-64zm0 128A96 96 0 1 0 416 0a96 96 0 1 0 0 192zM96 112c0-26.5 21.5-48 48-48s48 21.5 48 48l0 164.5c0 17.3 7.1 31.9 15.3 42.5C217.8 332.6 224 349.5 224 368c0 44.2-35.8 80-80 80s-80-35.8-80-80c0-18.5 6.2-35.4 16.7-48.9C88.9 308.4 96 293.8 96 276.5L96 112zM144 0C82.1 0 32 50.2 32 112l0 164.4c0 .1-.1 .3-.2 .6c-.2 .6-.8 1.6-1.7 2.8C11.2 304.2 0 334.8 0 368c0 79.5 64.5 144 144 144s144-64.5 144-144c0-33.2-11.2-63.8-30.1-88.1c-.9-1.2-1.5-2.2-1.7-2.8c-.1-.3-.2-.5-.2-.6L256 112C256 50.2 205.9 0 144 0zm0 416c26.5 0 48-21.5 48-48c0-20.9-13.4-38.7-32-45.3L160 112c0-8.8-7.2-16-16-16s-16 7.2-16 16l0 210.7c-18.6 6.6-32 24.4-32 45.3c0 26.5 21.5 48 48 48z"]},rr={prefix:"fas",iconName:"newspaper",icon:[512,512,[128240],"f1ea","M96 96c0-35.3 28.7-64 64-64l288 0c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64L80 480c-44.2 0-80-35.8-80-80L0 128c0-17.7 14.3-32 32-32s32 14.3 32 32l0 272c0 8.8 7.2 16 16 16s16-7.2 16-16L96 96zm64 24l0 80c0 13.3 10.7 24 24 24l112 0c13.3 0 24-10.7 24-24l0-80c0-13.3-10.7-24-24-24L184 96c-13.3 0-24 10.7-24 24zm208-8c0 8.8 7.2 16 16 16l48 0c8.8 0 16-7.2 16-16s-7.2-16-16-16l-48 0c-8.8 0-16 7.2-16 16zm0 96c0 8.8 7.2 16 16 16l48 0c8.8 0 16-7.2 16-16s-7.2-16-16-16l-48 0c-8.8 0-16 7.2-16 16zM160 304c0 8.8 7.2 16 16 16l256 0c8.8 0 16-7.2 16-16s-7.2-16-16-16l-256 0c-8.8 0-16 7.2-16 16zm0 96c0 8.8 7.2 16 16 16l256 0c8.8 0 16-7.2 16-16s-7.2-16-16-16l-256 0c-8.8 0-16 7.2-16 16z"]},sr={prefix:"fas",iconName:"code",icon:[640,512,[],"f121","M392.8 1.2c-17-4.9-34.7 5-39.6 22l-128 448c-4.9 17 5 34.7 22 39.6s34.7-5 39.6-22l128-448c4.9-17-5-34.7-22-39.6zm80.6 120.1c-12.5 12.5-12.5 32.8 0 45.3L562.7 256l-89.4 89.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l112-112c12.5-12.5 12.5-32.8 0-45.3l-112-112c-12.5-12.5-32.8-12.5-45.3 0zm-306.7 0c-12.5-12.5-32.8-12.5-45.3 0l-112 112c-12.5 12.5-12.5 32.8 0 45.3l112 112c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256l89.4-89.4c12.5-12.5 12.5-32.8 0-45.3z"]},ir={prefix:"fas",iconName:"chart-line",icon:[512,512,["line-chart"],"f201","M64 64c0-17.7-14.3-32-32-32S0 46.3 0 64L0 400c0 44.2 35.8 80 80 80l400 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 416c-8.8 0-16-7.2-16-16L64 64zm406.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L320 210.7l-57.4-57.4c-12.5-12.5-32.8-12.5-45.3 0l-112 112c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L240 221.3l57.4 57.4c12.5 12.5 32.8 12.5 45.3 0l128-128z"]},qa={prefix:"fas",iconName:"screwdriver-wrench",icon:[512,512,["tools"],"f7d9","M78.6 5C69.1-2.4 55.6-1.5 47 7L7 47c-8.5 8.5-9.4 22-2.1 31.6l80 104c4.5 5.9 11.6 9.4 19 9.4l54.1 0 109 109c-14.7 29-10 65.4 14.3 89.6l112 112c12.5 12.5 32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3l-112-112c-24.2-24.2-60.6-29-89.6-14.3l-109-109 0-54.1c0-7.5-3.5-14.5-9.4-19L78.6 5zM19.9 396.1C7.2 408.8 0 426.1 0 444.1C0 481.6 30.4 512 67.9 512c18 0 35.3-7.2 48-19.9L233.7 374.3c-7.8-20.9-9-43.6-3.6-65.1l-61.7-61.7L19.9 396.1zM512 144c0-10.5-1.1-20.7-3.2-30.5c-2.4-11.2-16.1-14.1-24.2-6l-63.9 63.9c-3 3-7.1 4.7-11.3 4.7L352 176c-8.8 0-16-7.2-16-16l0-57.4c0-4.2 1.7-8.3 4.7-11.3l63.9-63.9c8.1-8.1 5.2-21.8-6-24.2C388.7 1.1 378.5 0 368 0C288.5 0 224 64.5 224 144l0 .8 85.3 85.3c36-9.1 75.8 .5 104 28.7L429 274.5c49-23 83-72.8 83-130.5zM56 432a24 24 0 1 1 48 0 24 24 0 1 1 -48 0z"]},or=qa,cr={prefix:"fas",iconName:"envelope",icon:[512,512,[128386,9993,61443],"f0e0","M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48L48 64zM0 176L0 384c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-208L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z"]},lr={prefix:"fas",iconName:"water",icon:[576,512,[],"f773","M269.5 69.9c11.1-7.9 25.9-7.9 37 0C329 85.4 356.5 96 384 96c26.9 0 55.4-10.8 77.4-26.1c0 0 0 0 0 0c11.9-8.5 28.1-7.8 39.2 1.7c14.4 11.9 32.5 21 50.6 25.2c17.2 4 27.9 21.2 23.9 38.4s-21.2 27.9-38.4 23.9c-24.5-5.7-44.9-16.5-58.2-25C449.5 149.7 417 160 384 160c-31.9 0-60.6-9.9-80.4-18.9c-5.8-2.7-11.1-5.3-15.6-7.7c-4.5 2.4-9.7 5.1-15.6 7.7c-19.8 9-48.5 18.9-80.4 18.9c-33 0-65.5-10.3-94.5-25.8c-13.4 8.4-33.7 19.3-58.2 25c-17.2 4-34.4-6.7-38.4-23.9s6.7-34.4 23.9-38.4C42.8 92.6 61 83.5 75.3 71.6c11.1-9.5 27.3-10.1 39.2-1.7c0 0 0 0 0 0C136.7 85.2 165.1 96 192 96c27.5 0 55-10.6 77.5-26.1zm37 288C329 373.4 356.5 384 384 384c26.9 0 55.4-10.8 77.4-26.1c0 0 0 0 0 0c11.9-8.5 28.1-7.8 39.2 1.7c14.4 11.9 32.5 21 50.6 25.2c17.2 4 27.9 21.2 23.9 38.4s-21.2 27.9-38.4 23.9c-24.5-5.7-44.9-16.5-58.2-25C449.5 437.7 417 448 384 448c-31.9 0-60.6-9.9-80.4-18.9c-5.8-2.7-11.1-5.3-15.6-7.7c-4.5 2.4-9.7 5.1-15.6 7.7c-19.8 9-48.5 18.9-80.4 18.9c-33 0-65.5-10.3-94.5-25.8c-13.4 8.4-33.7 19.3-58.2 25c-17.2 4-34.4-6.7-38.4-23.9s6.7-34.4 23.9-38.4c18.1-4.2 36.2-13.3 50.6-25.2c11.1-9.4 27.3-10.1 39.2-1.7c0 0 0 0 0 0C136.7 373.2 165.1 384 192 384c27.5 0 55-10.6 77.5-26.1c11.1-7.9 25.9-7.9 37 0zm0-144C329 229.4 356.5 240 384 240c26.9 0 55.4-10.8 77.4-26.1c0 0 0 0 0 0c11.9-8.5 28.1-7.8 39.2 1.7c14.4 11.9 32.5 21 50.6 25.2c17.2 4 27.9 21.2 23.9 38.4s-21.2 27.9-38.4 23.9c-24.5-5.7-44.9-16.5-58.2-25C449.5 293.7 417 304 384 304c-31.9 0-60.6-9.9-80.4-18.9c-5.8-2.7-11.1-5.3-15.6-7.7c-4.5 2.4-9.7 5.1-15.6 7.7c-19.8 9-48.5 18.9-80.4 18.9c-33 0-65.5-10.3-94.5-25.8c-13.4 8.4-33.7 19.3-58.2 25c-17.2 4-34.4-6.7-38.4-23.9s6.7-34.4 23.9-38.4c18.1-4.2 36.2-13.3 50.6-25.2c11.1-9.5 27.3-10.1 39.2-1.7c0 0 0 0 0 0C136.7 229.2 165.1 240 192 240c27.5 0 55-10.6 77.5-26.1c11.1-7.9 25.9-7.9 37 0z"]},fr={prefix:"fas",iconName:"sliders",icon:[512,512,["sliders-h"],"f1de","M0 416c0 17.7 14.3 32 32 32l54.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 448c17.7 0 32-14.3 32-32s-14.3-32-32-32l-246.7 0c-12.3-28.3-40.5-48-73.3-48s-61 19.7-73.3 48L32 384c-17.7 0-32 14.3-32 32zm128 0a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zM320 256a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm32-80c-32.8 0-61 19.7-73.3 48L32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l246.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48l54.7 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-54.7 0c-12.3-28.3-40.5-48-73.3-48zM192 128a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm73.3-64C253 35.7 224.8 16 192 16s-61 19.7-73.3 48L32 64C14.3 64 0 78.3 0 96s14.3 32 32 32l86.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 128c17.7 0 32-14.3 32-32s-14.3-32-32-32L265.3 64z"]},ur={prefix:"fas",iconName:"calculator",icon:[384,512,[128425],"f1ec","M64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-384c0-35.3-28.7-64-64-64L64 0zM96 64l192 0c17.7 0 32 14.3 32 32l0 32c0 17.7-14.3 32-32 32L96 160c-17.7 0-32-14.3-32-32l0-32c0-17.7 14.3-32 32-32zm32 160a32 32 0 1 1 -64 0 32 32 0 1 1 64 0zM96 352a32 32 0 1 1 0-64 32 32 0 1 1 0 64zM64 416c0-17.7 14.3-32 32-32l96 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-96 0c-17.7 0-32-14.3-32-32zM192 256a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm32 64a32 32 0 1 1 -64 0 32 32 0 1 1 64 0zm64-64a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm32 64a32 32 0 1 1 -64 0 32 32 0 1 1 64 0zM288 448a32 32 0 1 1 0-64 32 32 0 1 1 0 64z"]},Ka={prefix:"fas",iconName:"house",icon:[576,512,[127968,63498,63500,"home","home-alt","home-lg-alt"],"f015","M575.8 255.5c0 18-15 32.1-32 32.1l-32 0 .7 160.2c0 2.7-.2 5.4-.5 8.1l0 16.2c0 22.1-17.9 40-40 40l-16 0c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1L416 512l-24 0c-22.1 0-40-17.9-40-40l0-24 0-64c0-17.7-14.3-32-32-32l-64 0c-17.7 0-32 14.3-32 32l0 64 0 24c0 22.1-17.9 40-40 40l-24 0-31.9 0c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2l-16 0c-22.1 0-40-17.9-40-40l0-112c0-.9 0-1.9 .1-2.8l0-69.7-32 0c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z"]},mr=Ka,dr={prefix:"fas",iconName:"magnifying-glass",icon:[512,512,[128269,"search"],"f002","M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"]},Qa={prefix:"fas",iconName:"list-check",icon:[512,512,["tasks"],"f0ae","M152.1 38.2c9.9 8.9 10.7 24 1.8 33.9l-72 80c-4.4 4.9-10.6 7.8-17.2 7.9s-12.9-2.4-17.6-7L7 113C-2.3 103.6-2.3 88.4 7 79s24.6-9.4 33.9 0l22.1 22.1 55.1-61.2c8.9-9.9 24-10.7 33.9-1.8zm0 160c9.9 8.9 10.7 24 1.8 33.9l-72 80c-4.4 4.9-10.6 7.8-17.2 7.9s-12.9-2.4-17.6-7L7 273c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l22.1 22.1 55.1-61.2c8.9-9.9 24-10.7 33.9-1.8zM224 96c0-17.7 14.3-32 32-32l224 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-224 0c-17.7 0-32-14.3-32-32zm0 160c0-17.7 14.3-32 32-32l224 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-224 0c-17.7 0-32-14.3-32-32zM160 416c0-17.7 14.3-32 32-32l288 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-288 0c-17.7 0-32-14.3-32-32zM48 368a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"]},gr=Qa,pr={prefix:"fas",iconName:"user-shield",icon:[640,512,[],"f505","M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l388.6 0c1.8 0 3.5-.2 5.3-.5c-76.3-55.1-99.8-141-103.1-200.2c-16.1-4.8-33.1-7.3-50.7-7.3l-91.4 0zm308.8-78.3l-120 48C358 277.4 352 286.2 352 296c0 63.3 25.9 168.8 134.8 214.2c5.9 2.5 12.6 2.5 18.5 0C614.1 464.8 640 359.3 640 296c0-9.8-6-18.6-15.1-22.3l-120-48c-5.7-2.3-12.1-2.3-17.8 0zM591.4 312c-3.9 50.7-27.2 116.7-95.4 149.7l0-187.8L591.4 312z"]},hr={prefix:"fas",iconName:"wind",icon:[512,512,[],"f72e","M288 32c0 17.7 14.3 32 32 32l32 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 128c-17.7 0-32 14.3-32 32s14.3 32 32 32l320 0c53 0 96-43 96-96s-43-96-96-96L320 0c-17.7 0-32 14.3-32 32zm64 352c0 17.7 14.3 32 32 32l32 0c53 0 96-43 96-96s-43-96-96-96L32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-32 0c-17.7 0-32 14.3-32 32zM128 512l32 0c53 0 96-43 96-96s-43-96-96-96L32 320c-17.7 0-32 14.3-32 32s14.3 32 32 32l128 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-32 0c-17.7 0-32 14.3-32 32s14.3 32 32 32z"]},br={prefix:"fas",iconName:"calendar",icon:[448,512,[128197,128198],"f133","M96 32l0 32L48 64C21.5 64 0 85.5 0 112l0 48 448 0 0-48c0-26.5-21.5-48-48-48l-48 0 0-32c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 32L160 64l0-32c0-17.7-14.3-32-32-32S96 14.3 96 32zM448 192L0 192 0 464c0 26.5 21.5 48 48 48l352 0c26.5 0 48-21.5 48-48l0-272z"]},yr={prefix:"fas",iconName:"briefcase",icon:[512,512,[128188],"f0b1","M184 48l144 0c4.4 0 8 3.6 8 8l0 40L176 96l0-40c0-4.4 3.6-8 8-8zm-56 8l0 40L64 96C28.7 96 0 124.7 0 160l0 96 192 0 128 0 192 0 0-96c0-35.3-28.7-64-64-64l-64 0 0-40c0-30.9-25.1-56-56-56L184 0c-30.9 0-56 25.1-56 56zM512 288l-192 0 0 32c0 17.7-14.3 32-32 32l-64 0c-17.7 0-32-14.3-32-32l0-32L0 288 0 416c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-128z"]},vr={prefix:"fas",iconName:"cloud-sun",icon:[640,512,[9925],"f6c4","M294.2 1.2c5.1 2.1 8.7 6.7 9.6 12.1l14.1 84.7 84.7 14.1c5.4 .9 10 4.5 12.1 9.6s1.5 10.9-1.6 15.4l-38.5 55c-2.2-.1-4.4-.2-6.7-.2c-23.3 0-45.1 6.2-64 17.1l0-1.1c0-53-43-96-96-96s-96 43-96 96s43 96 96 96c8.1 0 15.9-1 23.4-2.9c-36.6 18.1-63.3 53.1-69.8 94.9l-24.4 17c-4.5 3.2-10.3 3.8-15.4 1.6s-8.7-6.7-9.6-12.1L98.1 317.9 13.4 303.8c-5.4-.9-10-4.5-12.1-9.6s-1.5-10.9 1.6-15.4L52.5 208 2.9 137.2c-3.2-4.5-3.8-10.3-1.6-15.4s6.7-8.7 12.1-9.6L98.1 98.1l14.1-84.7c.9-5.4 4.5-10 9.6-12.1s10.9-1.5 15.4 1.6L208 52.5 278.8 2.9c4.5-3.2 10.3-3.8 15.4-1.6zM144 208a64 64 0 1 1 128 0 64 64 0 1 1 -128 0zM639.9 431.9c0 44.2-35.8 80-80 80l-271.9 0c-53 0-96-43-96-96c0-47.6 34.6-87 80-94.6l0-1.3c0-53 43-96 96-96c34.9 0 65.4 18.6 82.2 46.4c13-9.1 28.8-14.4 45.8-14.4c44.2 0 80 35.8 80 80c0 5.9-.6 11.7-1.9 17.2c37.4 6.7 65.8 39.4 65.8 78.7z"]};export{fr as a,lr as b,ar as c,hr as d,mr as e,dr as f,yr as g,cr as h,br as i,gr as j,nr as k,Ja as l,rr as m,or as n,vr as o,ur as p,er as q,ir as r,sr as s,pr as t,tr as u,Za as v};
