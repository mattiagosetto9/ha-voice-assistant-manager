/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */


function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$2=globalThis,e$2=t$2.ShadowRoot&&(void 0===t$2.ShadyCSS||t$2.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s$2=Symbol(),o$4=new WeakMap;let n$3 = class n{constructor(t,e,o){if(this._$cssResult$=true,o!==s$2)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e;}get styleSheet(){let t=this.o;const s=this.t;if(e$2&&void 0===t){const e=void 0!==s&&1===s.length;e&&(t=o$4.get(s)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&o$4.set(s,t));}return t}toString(){return this.cssText}};const r$4=t=>new n$3("string"==typeof t?t:t+"",void 0,s$2),i$3=(t,...e)=>{const o=1===t.length?t[0]:e.reduce((e,s,o)=>e+(t=>{if(true===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[o+1],t[0]);return new n$3(o,t,s$2)},S$1=(s,o)=>{if(e$2)s.adoptedStyleSheets=o.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const e of o){const o=document.createElement("style"),n=t$2.litNonce;void 0!==n&&o.setAttribute("nonce",n),o.textContent=e.cssText,s.appendChild(o);}},c$2=e$2?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return r$4(e)})(t):t;

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:i$2,defineProperty:e$1,getOwnPropertyDescriptor:h$1,getOwnPropertyNames:r$3,getOwnPropertySymbols:o$3,getPrototypeOf:n$2}=Object,a$1=globalThis,c$1=a$1.trustedTypes,l$1=c$1?c$1.emptyScript:"",p$1=a$1.reactiveElementPolyfillSupport,d$1=(t,s)=>t,u$1={toAttribute(t,s){switch(s){case Boolean:t=t?l$1:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t);}return t},fromAttribute(t,s){let i=t;switch(s){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t);}catch(t){i=null;}}return i}},f$1=(t,s)=>!i$2(t,s),b$1={attribute:true,type:String,converter:u$1,reflect:false,useDefault:false,hasChanged:f$1};Symbol.metadata??=Symbol("metadata"),a$1.litPropertyMetadata??=new WeakMap;let y$1 = class y extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t);}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,s=b$1){if(s.state&&(s.attribute=false),this._$Ei(),this.prototype.hasOwnProperty(t)&&((s=Object.create(s)).wrapped=true),this.elementProperties.set(t,s),!s.noAccessor){const i=Symbol(),h=this.getPropertyDescriptor(t,i,s);void 0!==h&&e$1(this.prototype,t,h);}}static getPropertyDescriptor(t,s,i){const{get:e,set:r}=h$1(this.prototype,t)??{get(){return this[s]},set(t){this[s]=t;}};return {get:e,set(s){const h=e?.call(this);r?.call(this,s),this.requestUpdate(t,h,i);},configurable:true,enumerable:true}}static getPropertyOptions(t){return this.elementProperties.get(t)??b$1}static _$Ei(){if(this.hasOwnProperty(d$1("elementProperties")))return;const t=n$2(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties);}static finalize(){if(this.hasOwnProperty(d$1("finalized")))return;if(this.finalized=true,this._$Ei(),this.hasOwnProperty(d$1("properties"))){const t=this.properties,s=[...r$3(t),...o$3(t)];for(const i of s)this.createProperty(i,t[i]);}const t=this[Symbol.metadata];if(null!==t){const s=litPropertyMetadata.get(t);if(void 0!==s)for(const[t,i]of s)this.elementProperties.set(t,i);}this._$Eh=new Map;for(const[t,s]of this.elementProperties){const i=this._$Eu(t,s);void 0!==i&&this._$Eh.set(i,t);}this.elementStyles=this.finalizeStyles(this.styles);}static finalizeStyles(s){const i=[];if(Array.isArray(s)){const e=new Set(s.flat(1/0).reverse());for(const s of e)i.unshift(c$2(s));}else void 0!==s&&i.push(c$2(s));return i}static _$Eu(t,s){const i=s.attribute;return  false===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=false,this.hasUpdated=false,this._$Em=null,this._$Ev();}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this));}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.();}removeController(t){this._$EO?.delete(t);}_$E_(){const t=new Map,s=this.constructor.elementProperties;for(const i of s.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t);}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return S$1(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(true),this._$EO?.forEach(t=>t.hostConnected?.());}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.());}attributeChangedCallback(t,s,i){this._$AK(t,i);}_$ET(t,s){const i=this.constructor.elementProperties.get(t),e=this.constructor._$Eu(t,i);if(void 0!==e&&true===i.reflect){const h=(void 0!==i.converter?.toAttribute?i.converter:u$1).toAttribute(s,i.type);this._$Em=t,null==h?this.removeAttribute(e):this.setAttribute(e,h),this._$Em=null;}}_$AK(t,s){const i=this.constructor,e=i._$Eh.get(t);if(void 0!==e&&this._$Em!==e){const t=i.getPropertyOptions(e),h="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:u$1;this._$Em=e;const r=h.fromAttribute(s,t.type);this[e]=r??this._$Ej?.get(e)??r,this._$Em=null;}}requestUpdate(t,s,i,e=false,h){if(void 0!==t){const r=this.constructor;if(false===e&&(h=this[t]),i??=r.getPropertyOptions(t),!((i.hasChanged??f$1)(h,s)||i.useDefault&&i.reflect&&h===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,i))))return;this.C(t,s,i);} false===this.isUpdatePending&&(this._$ES=this._$EP());}C(t,s,{useDefault:i,reflect:e,wrapped:h},r){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??s??this[t]),true!==h||void 0!==r)||(this._$AL.has(t)||(this.hasUpdated||i||(s=void 0),this._$AL.set(t,s)),true===e&&this._$Em!==t&&(this._$Eq??=new Set).add(t));}async _$EP(){this.isUpdatePending=true;try{await this._$ES;}catch(t){Promise.reject(t);}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,s]of this._$Ep)this[t]=s;this._$Ep=void 0;}const t=this.constructor.elementProperties;if(t.size>0)for(const[s,i]of t){const{wrapped:t}=i,e=this[s];true!==t||this._$AL.has(s)||void 0===e||this.C(s,void 0,i,e);}}let t=false;const s=this._$AL;try{t=this.shouldUpdate(s),t?(this.willUpdate(s),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(s)):this._$EM();}catch(s){throw t=false,this._$EM(),s}t&&this._$AE(s);}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=true,this.firstUpdated(t)),this.updated(t);}_$EM(){this._$AL=new Map,this.isUpdatePending=false;}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return  true}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM();}updated(t){}firstUpdated(t){}};y$1.elementStyles=[],y$1.shadowRootOptions={mode:"open"},y$1[d$1("elementProperties")]=new Map,y$1[d$1("finalized")]=new Map,p$1?.({ReactiveElement:y$1}),(a$1.reactiveElementVersions??=[]).push("2.1.2");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$1=globalThis,i$1=t=>t,s$1=t$1.trustedTypes,e=s$1?s$1.createPolicy("lit-html",{createHTML:t=>t}):void 0,h="$lit$",o$2=`lit$${Math.random().toFixed(9).slice(2)}$`,n$1="?"+o$2,r$2=`<${n$1}>`,l=document,c=()=>l.createComment(""),a=t=>null===t||"object"!=typeof t&&"function"!=typeof t,u=Array.isArray,d=t=>u(t)||"function"==typeof t?.[Symbol.iterator],f="[ \t\n\f\r]",v=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,_=/-->/g,m=/>/g,p=RegExp(`>|${f}(?:([^\\s"'>=/]+)(${f}*=${f}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),g=/'/g,$=/"/g,y=/^(?:script|style|textarea|title)$/i,x=t=>(i,...s)=>({_$litType$:t,strings:i,values:s}),b=x(1),E=Symbol.for("lit-noChange"),A=Symbol.for("lit-nothing"),C=new WeakMap,P=l.createTreeWalker(l,129);function V(t,i){if(!u(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==e?e.createHTML(i):i}const N=(t,i)=>{const s=t.length-1,e=[];let n,l=2===i?"<svg>":3===i?"<math>":"",c=v;for(let i=0;i<s;i++){const s=t[i];let a,u,d=-1,f=0;for(;f<s.length&&(c.lastIndex=f,u=c.exec(s),null!==u);)f=c.lastIndex,c===v?"!--"===u[1]?c=_:void 0!==u[1]?c=m:void 0!==u[2]?(y.test(u[2])&&(n=RegExp("</"+u[2],"g")),c=p):void 0!==u[3]&&(c=p):c===p?">"===u[0]?(c=n??v,d=-1):void 0===u[1]?d=-2:(d=c.lastIndex-u[2].length,a=u[1],c=void 0===u[3]?p:'"'===u[3]?$:g):c===$||c===g?c=p:c===_||c===m?c=v:(c=p,n=void 0);const x=c===p&&t[i+1].startsWith("/>")?" ":"";l+=c===v?s+r$2:d>=0?(e.push(a),s.slice(0,d)+h+s.slice(d)+o$2+x):s+o$2+(-2===d?i:x);}return [V(t,l+(t[s]||"<?>")+(2===i?"</svg>":3===i?"</math>":"")),e]};class S{constructor({strings:t,_$litType$:i},e){let r;this.parts=[];let l=0,a=0;const u=t.length-1,d=this.parts,[f,v]=N(t,i);if(this.el=S.createElement(f,e),P.currentNode=this.el.content,2===i||3===i){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes);}for(;null!==(r=P.nextNode())&&d.length<u;){if(1===r.nodeType){if(r.hasAttributes())for(const t of r.getAttributeNames())if(t.endsWith(h)){const i=v[a++],s=r.getAttribute(t).split(o$2),e=/([.?@])?(.*)/.exec(i);d.push({type:1,index:l,name:e[2],strings:s,ctor:"."===e[1]?I:"?"===e[1]?L:"@"===e[1]?z:H}),r.removeAttribute(t);}else t.startsWith(o$2)&&(d.push({type:6,index:l}),r.removeAttribute(t));if(y.test(r.tagName)){const t=r.textContent.split(o$2),i=t.length-1;if(i>0){r.textContent=s$1?s$1.emptyScript:"";for(let s=0;s<i;s++)r.append(t[s],c()),P.nextNode(),d.push({type:2,index:++l});r.append(t[i],c());}}}else if(8===r.nodeType)if(r.data===n$1)d.push({type:2,index:l});else {let t=-1;for(;-1!==(t=r.data.indexOf(o$2,t+1));)d.push({type:7,index:l}),t+=o$2.length-1;}l++;}}static createElement(t,i){const s=l.createElement("template");return s.innerHTML=t,s}}function M(t,i,s=t,e){if(i===E)return i;let h=void 0!==e?s._$Co?.[e]:s._$Cl;const o=a(i)?void 0:i._$litDirective$;return h?.constructor!==o&&(h?._$AO?.(false),void 0===o?h=void 0:(h=new o(t),h._$AT(t,s,e)),void 0!==e?(s._$Co??=[])[e]=h:s._$Cl=h),void 0!==h&&(i=M(t,h._$AS(t,i.values),h,e)),i}class R{constructor(t,i){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=i;}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:i},parts:s}=this._$AD,e=(t?.creationScope??l).importNode(i,true);P.currentNode=e;let h=P.nextNode(),o=0,n=0,r=s[0];for(;void 0!==r;){if(o===r.index){let i;2===r.type?i=new k(h,h.nextSibling,this,t):1===r.type?i=new r.ctor(h,r.name,r.strings,this,t):6===r.type&&(i=new Z(h,this,t)),this._$AV.push(i),r=s[++n];}o!==r?.index&&(h=P.nextNode(),o++);}return P.currentNode=l,e}p(t){let i=0;for(const s of this._$AV) void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,i),i+=s.strings.length-2):s._$AI(t[i])),i++;}}class k{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,i,s,e){this.type=2,this._$AH=A,this._$AN=void 0,this._$AA=t,this._$AB=i,this._$AM=s,this.options=e,this._$Cv=e?.isConnected??true;}get parentNode(){let t=this._$AA.parentNode;const i=this._$AM;return void 0!==i&&11===t?.nodeType&&(t=i.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,i=this){t=M(this,t,i),a(t)?t===A||null==t||""===t?(this._$AH!==A&&this._$AR(),this._$AH=A):t!==this._$AH&&t!==E&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):d(t)?this.k(t):this._(t);}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t));}_(t){this._$AH!==A&&a(this._$AH)?this._$AA.nextSibling.data=t:this.T(l.createTextNode(t)),this._$AH=t;}$(t){const{values:i,_$litType$:s}=t,e="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=S.createElement(V(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===e)this._$AH.p(i);else {const t=new R(e,this),s=t.u(this.options);t.p(i),this.T(s),this._$AH=t;}}_$AC(t){let i=C.get(t.strings);return void 0===i&&C.set(t.strings,i=new S(t)),i}k(t){u(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let s,e=0;for(const h of t)e===i.length?i.push(s=new k(this.O(c()),this.O(c()),this,this.options)):s=i[e],s._$AI(h),e++;e<i.length&&(this._$AR(s&&s._$AB.nextSibling,e),i.length=e);}_$AR(t=this._$AA.nextSibling,s){for(this._$AP?.(false,true,s);t!==this._$AB;){const s=i$1(t).nextSibling;i$1(t).remove(),t=s;}}setConnected(t){ void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t));}}class H{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,i,s,e,h){this.type=1,this._$AH=A,this._$AN=void 0,this.element=t,this.name=i,this._$AM=e,this.options=h,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=A;}_$AI(t,i=this,s,e){const h=this.strings;let o=false;if(void 0===h)t=M(this,t,i,0),o=!a(t)||t!==this._$AH&&t!==E,o&&(this._$AH=t);else {const e=t;let n,r;for(t=h[0],n=0;n<h.length-1;n++)r=M(this,e[s+n],i,n),r===E&&(r=this._$AH[n]),o||=!a(r)||r!==this._$AH[n],r===A?t=A:t!==A&&(t+=(r??"")+h[n+1]),this._$AH[n]=r;}o&&!e&&this.j(t);}j(t){t===A?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"");}}class I extends H{constructor(){super(...arguments),this.type=3;}j(t){this.element[this.name]=t===A?void 0:t;}}class L extends H{constructor(){super(...arguments),this.type=4;}j(t){this.element.toggleAttribute(this.name,!!t&&t!==A);}}class z extends H{constructor(t,i,s,e,h){super(t,i,s,e,h),this.type=5;}_$AI(t,i=this){if((t=M(this,t,i,0)??A)===E)return;const s=this._$AH,e=t===A&&s!==A||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,h=t!==A&&(s===A||e);e&&this.element.removeEventListener(this.name,this,s),h&&this.element.addEventListener(this.name,this,t),this._$AH=t;}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t);}}class Z{constructor(t,i,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=i,this.options=s;}get _$AU(){return this._$AM._$AU}_$AI(t){M(this,t);}}const B=t$1.litHtmlPolyfillSupport;B?.(S,k),(t$1.litHtmlVersions??=[]).push("3.3.2");const D=(t,i,s)=>{const e=s?.renderBefore??i;let h=e._$litPart$;if(void 0===h){const t=s?.renderBefore??null;e._$litPart$=h=new k(i.insertBefore(c(),t),t,void 0,s??{});}return h._$AI(t),h};

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const s=globalThis;class i extends y$1{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0;}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const r=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=D(r,this.renderRoot,this.renderOptions);}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(true);}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(false);}render(){return E}}i._$litElement$=true,i["finalized"]=true,s.litElementHydrateSupport?.({LitElement:i});const o$1=s.litElementPolyfillSupport;o$1?.({LitElement:i});(s.litElementVersions??=[]).push("4.2.2");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t=t=>(e,o)=>{ void 0!==o?o.addInitializer(()=>{customElements.define(t,e);}):customElements.define(t,e);};

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const o={attribute:true,type:String,converter:u$1,reflect:false,hasChanged:f$1},r$1=(t=o,e,r)=>{const{kind:n,metadata:i}=r;let s=globalThis.litPropertyMetadata.get(i);if(void 0===s&&globalThis.litPropertyMetadata.set(i,s=new Map),"setter"===n&&((t=Object.create(t)).wrapped=true),s.set(r.name,t),"accessor"===n){const{name:o}=r;return {set(r){const n=e.get.call(this);e.set.call(this,r),this.requestUpdate(o,n,t,true,r);},init(e){return void 0!==e&&this.C(o,void 0,t,e),e}}}if("setter"===n){const{name:o}=r;return function(r){const n=this[o];e.call(this,r),this.requestUpdate(o,n,t,true,r);}}throw Error("Unsupported decorator location: "+n)};function n(t){return (e,o)=>"object"==typeof o?r$1(t,e,o):((t,e,o)=>{const r=e.hasOwnProperty(o);return e.constructor.createProperty(o,t),r?Object.getOwnPropertyDescriptor(e,o):void 0})(t,e,o)}

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function r(r){return n({...r,state:true,attribute:false})}

/**
 * English translations
 */
const en = {
    // Header
    title: "Voice Assistant Manager",
    mode: "Mode",
    linked: "Linked",
    separate: "Separate",
    exclude: "Exclude",
    include: "Include",
    // Tabs
    entities: "Entities",
    settings: "Settings",
    // Domain card
    domainsToExclude: "Domains to Exclude",
    domainsToInclude: "Domains to Include",
    selected: "selected",
    selectAll: "Select All",
    deselectAll: "Deselect All",
    // Filters
    search: "Search",
    searchPlaceholder: "Search by name or ID...",
    domain: "Domain",
    allDomains: "All domains",
    area: "Area",
    allAreas: "All areas",
    onlyHidden: "Only hidden",
    onlyExposed: "Only exposed",
    withAlias: "With alias",
    overrides: "Overrides",
    // Bulk actions
    selectedCount: "selected",
    selectAction: "Select action...",
    addToExclusions: "Add to exclusions",
    removeFromExclusions: "Remove from exclusions",
    addOverride: "Add override",
    removeOverride: "Remove override",
    excludeDomain: "Exclude entire domain",
    excludeDevice: "Exclude entire device",
    addAliasPrefix: "Add alias prefix",
    addAliasSuffix: "Add alias suffix",
    clearAlias: "Clear alias",
    valuePlaceholder: "Value (for prefix/suffix)",
    apply: "Apply",
    clear: "Clear",
    // Table
    status: "Status",
    override: "Override",
    voiceAlias: "Voice Alias",
    name: "Name",
    reason: "Reason",
    exposed: "Exposed",
    hidden: "Hidden",
    byDomain: "By domain",
    manual: "Manual",
    aliasPlaceholder: "Voice alias...",
    // Pagination
    showing: "Showing",
    of: "of",
    total: "total",
    perPage: "per page",
    page: "Page",
    first: "First",
    prev: "Prev",
    next: "Next",
    last: "Last",
    noResults: "No entities match the current filters",
    // Settings
    googleAssistant: "Google Assistant",
    enableGoogle: "Enable Google Assistant",
    projectId: "Project ID",
    projectIdPlaceholder: "my-home-assistant-project",
    serviceAccountPath: "Service Account Path",
    serviceAccountPlaceholder: "/config/SERVICE_ACCOUNT.json",
    reportState: "Report State",
    securePin: "Secure Devices PIN (optional)",
    securePinPlaceholder: "1234",
    advancedYaml: "Advanced YAML (optional)",
    amazonAlexa: "Amazon Alexa",
    enableAlexa: "Enable Alexa",
    baseConfig: "Base Configuration (required)",
    baseConfigPlaceholder: "locale: it-IT\nendpoint: https://...",
    homekitBridge: "HomeKit Bridge",
    homekitDescription: "Select a HomeKit bridge. Configuration will be synced when you click \"Save & Generate\" on the Entities tab.",
    noHomekitBridges: "No HomeKit bridges found. Please configure HomeKit Bridge in Home Assistant first.",
    noBridge: "No bridge (disabled)",
    port: "Port",
    homekitEnabled: "HomeKit will be enabled after saving",
    homekitDisabled: "HomeKit disabled",
    backToEntities: "Back to Entities",
    saveSettings: "Save Settings",
    saving: "Saving...",
    configureSettings: "Configure your voice assistant settings above",
    // Footer
    googleReady: "Google Assistant: Ready",
    googleNotConfigured: "Google Assistant: Not configured",
    alexaReady: "Alexa: Ready",
    alexaNotConfigured: "Alexa: Not configured",
    homekitEnabledStatus: "HomeKit: Enabled",
    homekitDisabledStatus: "HomeKit: Disabled",
    previewYaml: "Preview YAML",
    saveGenerate: "Save & Generate",
    checkConfig: "Check Config",
    restartHa: "Restart HA",
    // Dialog
    yamlPreview: "YAML Preview",
    warnings: "Warnings",
    notConfigured: "Not configured",
    close: "Close",
    // Messages
    loading: "Loading Voice Assistant Manager...",
    error: "Error",
    retry: "Retry",
    settingsSaved: "Settings saved successfully!",
    configValid: "Configuration is valid!",
    configError: "Configuration error",
    restartConfirm: "Are you sure you want to restart Home Assistant?",
    restarting: "Home Assistant is restarting...",
    configSaved: "Configuration saved:",
    googleOk: "Google Assistant: OK",
    alexaOk: "Alexa: OK",
    homekitOk: "HomeKit: OK",
    unsavedChanges: "Unsaved changes",
    unsavedChangesMessage: "You have unsaved changes. Do you want to discard them?",
    discardChanges: "Discard Changes",
    cancel: "Cancel",
};

/**
 * Italian translations
 */
const it = {
    // Header
    title: "Voice Assistant Manager",
    mode: "Modalità",
    linked: "Collegata",
    separate: "Separata",
    exclude: "Escludi",
    include: "Includi",
    // Tabs
    entities: "Entità",
    settings: "Impostazioni",
    // Domain card
    domainsToExclude: "Domini da Escludere",
    domainsToInclude: "Domini da Includere",
    selected: "selezionati",
    selectAll: "Seleziona Tutti",
    deselectAll: "Deseleziona Tutti",
    // Filters
    search: "Cerca",
    searchPlaceholder: "Cerca per nome o ID...",
    domain: "Dominio",
    allDomains: "Tutti i domini",
    area: "Area",
    allAreas: "Tutte le aree",
    onlyHidden: "Solo nascosti",
    onlyExposed: "Solo esposti",
    withAlias: "Con alias",
    overrides: "Override",
    // Bulk actions
    selectedCount: "selezionati",
    selectAction: "Seleziona azione...",
    addToExclusions: "Aggiungi alle esclusioni",
    removeFromExclusions: "Rimuovi dalle esclusioni",
    addOverride: "Aggiungi override",
    removeOverride: "Rimuovi override",
    excludeDomain: "Escludi intero dominio",
    excludeDevice: "Escludi intero dispositivo",
    addAliasPrefix: "Aggiungi prefisso alias",
    addAliasSuffix: "Aggiungi suffisso alias",
    clearAlias: "Cancella alias",
    valuePlaceholder: "Valore (per prefisso/suffisso)",
    apply: "Applica",
    clear: "Pulisci",
    // Table
    status: "Stato",
    override: "Override",
    voiceAlias: "Alias Vocale",
    name: "Nome",
    reason: "Motivo",
    exposed: "Esposto",
    hidden: "Nascosto",
    byDomain: "Per dominio",
    manual: "Manuale",
    aliasPlaceholder: "Alias vocale...",
    // Pagination
    showing: "Mostrando",
    of: "di",
    total: "totali",
    perPage: "per pagina",
    page: "Pagina",
    first: "Prima",
    prev: "Prec",
    next: "Succ",
    last: "Ultima",
    noResults: "Nessuna entità corrisponde ai filtri attuali",
    // Settings
    googleAssistant: "Google Assistant",
    enableGoogle: "Abilita Google Assistant",
    projectId: "ID Progetto",
    projectIdPlaceholder: "my-home-assistant-project",
    serviceAccountPath: "Percorso Service Account",
    serviceAccountPlaceholder: "/config/SERVICE_ACCOUNT.json",
    reportState: "Riporta Stato",
    securePin: "PIN Dispositivi Sicuri (opzionale)",
    securePinPlaceholder: "1234",
    advancedYaml: "YAML Avanzato (opzionale)",
    amazonAlexa: "Amazon Alexa",
    enableAlexa: "Abilita Alexa",
    baseConfig: "Configurazione Base (richiesta)",
    baseConfigPlaceholder: "locale: it-IT\nendpoint: https://...",
    homekitBridge: "Bridge HomeKit",
    homekitDescription: "Seleziona un bridge HomeKit. La configurazione verrà sincronizzata quando clicchi \"Salva e Genera\" nella tab Entità.",
    noHomekitBridges: "Nessun bridge HomeKit trovato. Configura prima HomeKit Bridge in Home Assistant.",
    noBridge: "Nessun bridge (disabilitato)",
    port: "Porta",
    homekitEnabled: "HomeKit verrà abilitato dopo il salvataggio",
    homekitDisabled: "HomeKit disabilitato",
    backToEntities: "Torna alle Entità",
    saveSettings: "Salva Impostazioni",
    saving: "Salvataggio...",
    configureSettings: "Configura le impostazioni degli assistenti vocali sopra",
    // Footer
    googleReady: "Google Assistant: Pronto",
    googleNotConfigured: "Google Assistant: Non configurato",
    alexaReady: "Alexa: Pronto",
    alexaNotConfigured: "Alexa: Non configurato",
    homekitEnabledStatus: "HomeKit: Abilitato",
    homekitDisabledStatus: "HomeKit: Disabilitato",
    previewYaml: "Anteprima YAML",
    saveGenerate: "Salva e Genera",
    checkConfig: "Verifica Config",
    restartHa: "Riavvia HA",
    // Dialog
    yamlPreview: "Anteprima YAML",
    warnings: "Avvisi",
    notConfigured: "Non configurato",
    close: "Chiudi",
    // Messages
    loading: "Caricamento Voice Assistant Manager...",
    error: "Errore",
    retry: "Riprova",
    settingsSaved: "Impostazioni salvate con successo!",
    configValid: "Configurazione valida!",
    configError: "Errore configurazione",
    restartConfirm: "Sei sicuro di voler riavviare Home Assistant?",
    restarting: "Home Assistant si sta riavviando...",
    configSaved: "Configurazione salvata:",
    googleOk: "Google Assistant: OK",
    alexaOk: "Alexa: OK",
    homekitOk: "HomeKit: OK",
    unsavedChanges: "Modifiche non salvate",
    unsavedChangesMessage: "Hai modifiche non salvate. Vuoi scartarle?",
    discardChanges: "Scarta Modifiche",
    cancel: "Annulla",
};

/**
 * Localization system for Voice Manager
 */
const translations = { en, it };
/**
 * Create a translator function for the given language
 */
function createTranslator(language) {
    const lang = language?.substring(0, 2) || 'en';
    const dict = translations[lang] || translations.en;
    return (key) => {
        return dict[key] || translations.en[key] || key;
    };
}

/**
 * Debounce utility function
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(str) {
    if (!str)
        return "";
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
}

/**
 * Shared CSS variables and common styles
 */
const sharedStyles = i$3 `
  :host {
    display: block;
    --mdc-theme-primary: var(--primary-color);
    --vm-card-bg: var(--card-background-color, #fff);
    --vm-text-primary: var(--primary-text-color, #212121);
    --vm-text-secondary: var(--secondary-text-color, #727272);
    --vm-divider: var(--divider-color, #e0e0e0);
    --vm-success: #4caf50;
    --vm-warning: #ff9800;
    --vm-error: #f44336;
  }

  .btn {
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .btn-primary {
    background: var(--primary-color);
    color: white;
  }

  .btn-primary:hover:not(:disabled) {
    opacity: 0.9;
  }

  .btn-secondary {
    background: var(--vm-divider);
    color: var(--vm-text-primary);
  }

  .btn-secondary:hover:not(:disabled) {
    background: var(--secondary-background-color);
  }

  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .loading-container,
  .error-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 48px;
    text-align: center;
  }

  .spinner {
    width: 48px;
    height: 48px;
    border: 4px solid var(--vm-divider);
    border-top-color: var(--primary-color);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .error-container {
    color: var(--vm-error);
  }
`;
/**
 * Header styles
 */
const headerStyles = i$3 `
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    flex-wrap: wrap;
    gap: 16px;
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
  }

  .header h1 {
    margin: 0;
    font-size: 24px;
    font-weight: 400;
    color: var(--vm-text-primary);
  }

  .mode-select {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .mode-select label {
    color: var(--vm-text-secondary);
    font-size: 14px;
  }

  .mode-select select {
    padding: 8px 12px;
    border: 1px solid var(--vm-divider);
    border-radius: 4px;
    background: var(--vm-card-bg);
    color: var(--vm-text-primary);
    font-size: 14px;
    cursor: pointer;
  }

  .platform-tabs {
    display: flex;
    background: var(--secondary-background-color);
    border-radius: 8px;
    padding: 4px;
    gap: 4px;
  }

  .platform-tab {
    padding: 8px 16px;
    border: none;
    border-radius: 6px;
    background: transparent;
    color: var(--vm-text-secondary);
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .platform-tab:hover {
    background: var(--vm-divider);
  }

  .platform-tab.active {
    background: var(--primary-color);
    color: white;
  }

  .platform-tab.google.active {
    background: #4285f4;
  }

  .platform-tab.alexa.active {
    background: #00caff;
  }

  .platform-tab.homekit.active {
    background: #ff9500;
  }

  .filter-mode-toggle {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 12px;
    background: var(--secondary-background-color);
    border-radius: 8px;
  }

  .filter-mode-toggle label {
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    font-size: 14px;
  }

  .filter-mode-toggle input[type="radio"] {
    cursor: pointer;
  }
`;
/**
 * Tab styles
 */
const tabStyles = i$3 `
  .tabs {
    display: flex;
    border-bottom: 1px solid var(--vm-divider);
    margin-bottom: 16px;
    gap: 8px;
  }

  .tab {
    padding: 12px 24px;
    background: none;
    border: none;
    color: var(--vm-text-secondary);
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    border-bottom: 2px solid transparent;
    transition: all 0.2s ease;
  }

  .tab:hover {
    color: var(--vm-text-primary);
  }

  .tab.active {
    color: var(--primary-color);
    border-bottom-color: var(--primary-color);
  }
`;
/**
 * Content card styles
 */
const cardStyles = i$3 `
  .content {
    background: var(--vm-card-bg);
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .domain-card {
    background: var(--vm-card-bg);
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: 16px;
    overflow: hidden;
  }

  .domain-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    background: var(--secondary-background-color);
    cursor: pointer;
  }

  .domain-card-header h3 {
    margin: 0;
    font-size: 14px;
    font-weight: 500;
  }

  .domain-card-header .toggle-icon {
    transition: transform 0.2s ease;
  }

  .domain-card-header .toggle-icon.expanded {
    transform: rotate(180deg);
  }

  .domain-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 8px;
    padding: 16px;
  }

  .domain-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px;
    border-radius: 4px;
    background: var(--secondary-background-color);
    cursor: pointer;
    font-size: 13px;
  }

  .domain-item:hover {
    background: var(--vm-divider);
  }

  .domain-item.selected {
    background: var(--primary-color);
    color: white;
  }

  .domain-actions {
    display: flex;
    gap: 8px;
    padding: 0 16px 16px;
  }

  .domain-actions button {
    padding: 6px 12px;
    border: 1px solid var(--vm-divider);
    border-radius: 4px;
    background: var(--vm-card-bg);
    color: var(--vm-text-primary);
    cursor: pointer;
    font-size: 12px;
  }

  .domain-actions button:hover {
    background: var(--secondary-background-color);
  }
`;

/**
 * Table and entity list styles
 */
const tableStyles = i$3 `
  .entity-table-container {
    overflow: hidden;
  }

  .table-scroll {
    overflow-x: auto;
    max-height: 500px;
    overflow-y: auto;
  }

  .entity-table {
    width: 100%;
    border-collapse: collapse;
    min-width: 900px;
  }

  .entity-table th,
  .entity-table td {
    padding: 12px 16px;
    text-align: left;
    border-bottom: 1px solid var(--vm-divider);
  }

  .entity-table th {
    background: var(--secondary-background-color);
    font-weight: 500;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: var(--vm-text-secondary);
    position: sticky;
    top: 0;
    z-index: 1;
  }

  .entity-table tbody tr:hover {
    background: var(--secondary-background-color);
  }

  .entity-table tbody tr.excluded {
    background: rgba(244, 67, 54, 0.05);
  }

  .entity-table tbody tr.override {
    background: rgba(255, 152, 0, 0.1);
  }

  .entity-link {
    color: var(--primary-color);
    cursor: pointer;
    text-decoration: none;
  }

  .entity-link:hover {
    text-decoration: underline;
  }

  .entity-id {
    font-family: monospace;
    font-size: 12px;
    color: var(--vm-text-secondary);
  }

  .alias-input {
    width: 100%;
    padding: 6px 8px;
    border: 1px solid var(--vm-divider);
    border-radius: 4px;
    font-size: 13px;
    background: var(--vm-card-bg);
    color: var(--vm-text-primary);
  }

  .status-badge {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 11px;
    font-weight: 500;
  }

  .status-badge.exposed {
    background: rgba(76, 175, 80, 0.1);
    color: var(--vm-success);
  }

  .status-badge.excluded {
    background: rgba(244, 67, 54, 0.1);
    color: var(--vm-error);
  }

  .status-badge.override {
    background: rgba(255, 152, 0, 0.1);
    color: var(--vm-warning);
  }

  .reason-text {
    font-size: 11px;
    color: var(--vm-text-secondary);
  }

  .override-btn {
    padding: 4px 8px;
    border: 1px solid var(--vm-divider);
    border-radius: 4px;
    background: var(--vm-card-bg);
    cursor: pointer;
    font-size: 12px;
  }

  .override-btn:hover {
    background: var(--secondary-background-color);
  }

  .override-btn.active {
    background: var(--vm-warning);
    color: white;
    border-color: var(--vm-warning);
  }

  .no-results {
    text-align: center;
    padding: 48px;
    color: var(--vm-text-secondary);
  }
`;
/**
 * Pagination styles
 */
const paginationStyles = i$3 `
  .pagination {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    border-top: 1px solid var(--vm-divider);
    flex-wrap: wrap;
    gap: 12px;
  }

  .pagination-info {
    font-size: 13px;
    color: var(--vm-text-secondary);
  }

  .pagination-controls {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .pagination-controls button {
    padding: 6px 12px;
    border: 1px solid var(--vm-divider);
    border-radius: 4px;
    background: var(--vm-card-bg);
    color: var(--vm-text-primary);
    cursor: pointer;
    font-size: 13px;
  }

  .pagination-controls button:hover:not(:disabled) {
    background: var(--secondary-background-color);
  }

  .pagination-controls button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .pagination-controls select {
    padding: 6px 8px;
    border: 1px solid var(--vm-divider);
    border-radius: 4px;
    background: var(--vm-card-bg);
    color: var(--vm-text-primary);
    font-size: 13px;
  }

  .page-input {
    width: 60px;
    padding: 6px 8px;
    border: 1px solid var(--vm-divider);
    border-radius: 4px;
    text-align: center;
    font-size: 13px;
  }
`;

/**
 * Filter bar styles
 */
const filterStyles = i$3 `
  .filters {
    padding: 16px;
    border-bottom: 1px solid var(--vm-divider);
  }

  .filter-row {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    align-items: flex-end;
  }

  .filter-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .filter-item label {
    font-size: 12px;
    color: var(--vm-text-secondary);
    font-weight: 500;
  }

  .filter-item input,
  .filter-item select {
    padding: 8px 12px;
    border: 1px solid var(--vm-divider);
    border-radius: 4px;
    background: var(--vm-card-bg);
    color: var(--vm-text-primary);
    font-size: 14px;
    min-width: 150px;
  }

  .filter-toggles {
    display: flex;
    gap: 16px;
    align-items: center;
  }

  .filter-toggle {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    cursor: pointer;
  }

  .filter-toggle input {
    cursor: pointer;
  }
`;
/**
 * Bulk actions bar styles
 */
const bulkActionsStyles = i$3 `
  .bulk-actions {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    background: var(--primary-color);
    color: white;
  }

  .bulk-actions .count {
    font-weight: 500;
  }

  .bulk-actions select,
  .bulk-actions input {
    padding: 6px 12px;
    border: none;
    border-radius: 4px;
    font-size: 14px;
  }

  .bulk-actions button {
    padding: 6px 16px;
    border: none;
    border-radius: 4px;
    background: white;
    color: var(--primary-color);
    font-weight: 500;
    cursor: pointer;
  }

  .bulk-actions button:hover {
    background: rgba(255, 255, 255, 0.9);
  }
`;
/**
 * Settings form styles
 */
const settingsStyles = i$3 `
  .settings-container {
    padding: 24px;
  }

  .settings-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 24px;
  }

  .settings-card {
    background: var(--secondary-background-color);
    border-radius: 8px;
    padding: 20px;
  }

  .settings-card h3 {
    margin: 0 0 16px;
    font-size: 16px;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .settings-card .icon {
    font-size: 20px;
  }

  .settings-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .form-group label {
    font-size: 13px;
    color: var(--vm-text-secondary);
    font-weight: 500;
  }

  .form-group input,
  .form-group select,
  .form-group textarea {
    padding: 10px 12px;
    border: 1px solid var(--vm-divider);
    border-radius: 4px;
    background: var(--vm-card-bg);
    color: var(--vm-text-primary);
    font-size: 14px;
  }

  .form-group textarea {
    min-height: 100px;
    font-family: monospace;
    resize: vertical;
  }

  .form-group .checkbox-label {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
  }

  .form-actions {
    display: flex;
    gap: 12px;
    margin-top: 8px;
  }

  .homekit-section {
    background: var(--secondary-background-color);
    border-radius: 8px;
    padding: 20px;
    margin-top: 24px;
  }

  .homekit-bridge-select {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-top: 12px;
  }

  .homekit-bridge-select select {
    flex: 1;
    padding: 10px 12px;
    border: 1px solid var(--vm-divider);
    border-radius: 4px;
    background: var(--vm-card-bg);
    color: var(--vm-text-primary);
    font-size: 14px;
  }

  .homekit-actions {
    display: flex;
    gap: 12px;
    margin-top: 16px;
  }
`;

/**
 * Dialog and modal styles
 */
const dialogStyles = i$3 `
  .dialog-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .dialog {
    background: var(--vm-card-bg);
    border-radius: 8px;
    max-width: 800px;
    max-height: 80vh;
    width: 90%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .dialog-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 24px;
    border-bottom: 1px solid var(--vm-divider);
  }

  .dialog-header h2 {
    margin: 0;
    font-size: 18px;
  }

  .dialog-close {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: var(--vm-text-secondary);
  }

  .dialog-content {
    padding: 24px;
    overflow-y: auto;
    flex: 1;
  }

  .yaml-preview {
    background: var(--secondary-background-color);
    padding: 16px;
    border-radius: 4px;
    font-family: monospace;
    font-size: 12px;
    white-space: pre-wrap;
    overflow-x: auto;
    max-height: 400px;
  }

  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    padding: 16px 24px;
    border-top: 1px solid var(--vm-divider);
  }
`;

/**
 * Footer styles
 */
const footerStyles = i$3 `
  .footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 24px;
    background: var(--secondary-background-color);
    border-radius: 0 0 8px 8px;
    flex-wrap: wrap;
    gap: 12px;
  }

  .footer-info {
    font-size: 13px;
    color: var(--vm-text-secondary);
  }

  .footer-actions {
    display: flex;
    gap: 12px;
  }
`;

/**
 * Voice Manager Panel for Home Assistant
 *
 * A LitElement-based panel for managing Google Assistant, Alexa, and HomeKit
 * Smart Home exposure with include/exclude workflow.
 *
 * @version 1.0.0
 * @license MIT
 */
const DEFAULT_FILTER_CONFIG = {
    filter_mode: 'exclude',
    domains: [],
    entities: [],
    devices: [],
    overrides: [],
};
let VoiceAssistantManagerPanel = class VoiceAssistantManagerPanel extends i {
    constructor() {
        super();
        this.narrow = false;
        this._state = null;
        this._loading = true;
        this._error = null;
        this._activeTab = 'entities';
        this._selectedEntities = [];
        this._filters = {
            search: '',
            domains: [],
            area: '',
            device: '',
            onlyExcluded: false,
            onlyNotExcluded: false,
            onlyWithAlias: false,
            onlyOverrides: false,
        };
        this._previewDialog = false;
        this._previewContent = null;
        this._bulkActionValue = '';
        this._saving = false;
        this._currentPage = 1;
        this._pageSize = 50;
        this._activePlatform = 'google';
        this._domainsExpanded = false;
        this._pendingGoogleSettings = null;
        this._pendingAlexaSettings = null;
        this._pendingHomekitBridge = null;
        this._pendingFilterConfig = null;
        this._pendingGoogleFilterConfig = null;
        this._pendingAlexaFilterConfig = null;
        this._pendingHomekitFilterConfig = null;
        this._pendingAliases = null;
        this._pendingGoogleAliases = null;
        this._pendingAlexaAliases = null;
        this._hasUnsavedChanges = false;
        this._showUnsavedDialog = false;
        this._pendingTabSwitch = null;
        this._debouncedSearch = debounce((value) => {
            this._filters = { ...this._filters, search: value };
            this._currentPage = 1;
        }, 300);
    }
    get _t() {
        return createTranslator(this.hass?.language);
    }
    connectedCallback() {
        super.connectedCallback();
        this._loadState();
    }
    async _loadState() {
        this._loading = true;
        this._error = null;
        try {
            const result = await this.hass.callWS({
                type: 'voice_assistant_manager/get_state',
            });
            this._state = result;
            // Initialize pending settings
            this._pendingGoogleSettings = { ...(result.google_settings || {}) };
            this._pendingAlexaSettings = { ...(result.alexa_settings || {}) };
            this._pendingHomekitBridge = result.homekit_entry_id || '';
            // Initialize pending filter configs
            this._pendingFilterConfig = { ...(result.filter_config || DEFAULT_FILTER_CONFIG) };
            this._pendingGoogleFilterConfig = { ...(result.google_filter_config || DEFAULT_FILTER_CONFIG) };
            this._pendingAlexaFilterConfig = { ...(result.alexa_filter_config || DEFAULT_FILTER_CONFIG) };
            this._pendingHomekitFilterConfig = { ...(result.homekit_filter_config || DEFAULT_FILTER_CONFIG) };
            // Initialize pending aliases
            this._pendingAliases = { ...(result.aliases || {}) };
            this._pendingGoogleAliases = { ...(result.google_aliases || {}) };
            this._pendingAlexaAliases = { ...(result.alexa_aliases || {}) };
            // Reset unsaved changes flag
            this._hasUnsavedChanges = false;
        }
        catch (error) {
            console.error('Failed to load state:', error);
            this._error = error.message || 'Failed to load Voice Manager state';
        }
        this._loading = false;
    }
    _getCurrentFilterConfig() {
        if (!this._state)
            return DEFAULT_FILTER_CONFIG;
        if (this._state.mode === 'linked') {
            return this._pendingFilterConfig || DEFAULT_FILTER_CONFIG;
        }
        if (this._activePlatform === 'google') {
            return this._pendingGoogleFilterConfig || DEFAULT_FILTER_CONFIG;
        }
        else if (this._activePlatform === 'alexa') {
            return this._pendingAlexaFilterConfig || DEFAULT_FILTER_CONFIG;
        }
        else {
            return this._pendingHomekitFilterConfig || DEFAULT_FILTER_CONFIG;
        }
    }
    _getCurrentAliases() {
        if (!this._state)
            return {};
        if (this._state.mode === 'linked') {
            return this._pendingAliases || {};
        }
        if (this._activePlatform === 'google') {
            return this._pendingGoogleAliases || {};
        }
        else if (this._activePlatform === 'alexa') {
            return this._pendingAlexaAliases || {};
        }
        return {};
    }
    _isEntityExposed(entity) {
        const config = this._getCurrentFilterConfig();
        const filterMode = config.filter_mode || 'exclude';
        const domains = config.domains || [];
        const entities = config.entities || [];
        const overrides = config.overrides || [];
        const entityDomain = entity.entity_id.split('.')[0];
        const isOverride = overrides.includes(entity.entity_id);
        const isDomainMatch = domains.includes(entityDomain);
        const isEntityMatch = entities.includes(entity.entity_id);
        if (filterMode === 'exclude') {
            if (isOverride)
                return { exposed: true, reason: 'override' };
            if (isDomainMatch)
                return { exposed: false, reason: 'domain' };
            if (isEntityMatch)
                return { exposed: false, reason: 'entity' };
            return { exposed: true, reason: '' };
        }
        else {
            if (isOverride)
                return { exposed: false, reason: 'override' };
            if (isDomainMatch)
                return { exposed: true, reason: 'domain' };
            if (isEntityMatch)
                return { exposed: true, reason: 'entity' };
            return { exposed: false, reason: '' };
        }
    }
    _getFilteredEntities() {
        if (!this._state?.entities)
            return [];
        let entities = [...this._state.entities];
        const aliases = this._getCurrentAliases();
        if (this._filters.search) {
            const search = this._filters.search.toLowerCase();
            entities = entities.filter((e) => e.entity_id.toLowerCase().includes(search) ||
                (e.name && e.name.toLowerCase().includes(search)));
        }
        if (this._filters.domains && this._filters.domains.length > 0) {
            entities = entities.filter((e) => this._filters.domains.includes(e.domain));
        }
        if (this._filters.area) {
            entities = entities.filter((e) => e.area_id === this._filters.area);
        }
        if (this._filters.device) {
            entities = entities.filter((e) => e.device_id === this._filters.device);
        }
        if (this._filters.onlyExcluded) {
            entities = entities.filter((e) => !this._isEntityExposed(e).exposed);
        }
        if (this._filters.onlyNotExcluded) {
            entities = entities.filter((e) => this._isEntityExposed(e).exposed);
        }
        if (this._filters.onlyWithAlias) {
            entities = entities.filter((e) => aliases[e.entity_id]);
        }
        if (this._filters.onlyOverrides) {
            const config = this._getCurrentFilterConfig();
            const overrides = config.overrides || [];
            entities = entities.filter((e) => overrides.includes(e.entity_id));
        }
        return entities;
    }
    async _setMode(mode) {
        this._saving = true;
        try {
            await this.hass.callWS({
                type: 'voice_assistant_manager/set_mode',
                mode: mode,
            });
            this._state = { ...this._state, mode: mode };
        }
        catch (error) {
            console.error('Failed to set mode:', error);
            this._showError('Failed to set mode: ' + error.message);
        }
        this._saving = false;
    }
    _setFilterMode(filterMode) {
        const config = this._getCurrentFilterConfig();
        config.filter_mode = filterMode;
        if (this._state?.mode === 'linked') {
            this._pendingFilterConfig = { ...config };
        }
        else if (this._activePlatform === 'google') {
            this._pendingGoogleFilterConfig = { ...config };
        }
        else if (this._activePlatform === 'alexa') {
            this._pendingAlexaFilterConfig = { ...config };
        }
        else {
            this._pendingHomekitFilterConfig = { ...config };
        }
        this._hasUnsavedChanges = true;
    }
    _toggleDomain(domain) {
        const config = this._getCurrentFilterConfig();
        const domains = new Set(config.domains || []);
        if (domains.has(domain)) {
            domains.delete(domain);
        }
        else {
            domains.add(domain);
        }
        config.domains = Array.from(domains);
        if (this._state?.mode === 'linked') {
            this._pendingFilterConfig = { ...config };
        }
        else if (this._activePlatform === 'google') {
            this._pendingGoogleFilterConfig = { ...config };
        }
        else if (this._activePlatform === 'alexa') {
            this._pendingAlexaFilterConfig = { ...config };
        }
        else {
            this._pendingHomekitFilterConfig = { ...config };
        }
        this._hasUnsavedChanges = true;
    }
    _selectAllDomains() {
        const allDomains = this._state?.domains || [];
        const config = this._getCurrentFilterConfig();
        config.domains = [...allDomains];
        if (this._state?.mode === 'linked') {
            this._pendingFilterConfig = { ...config };
        }
        else if (this._activePlatform === 'google') {
            this._pendingGoogleFilterConfig = { ...config };
        }
        else if (this._activePlatform === 'alexa') {
            this._pendingAlexaFilterConfig = { ...config };
        }
        else {
            this._pendingHomekitFilterConfig = { ...config };
        }
        this._hasUnsavedChanges = true;
    }
    _deselectAllDomains() {
        const config = this._getCurrentFilterConfig();
        config.domains = [];
        if (this._state?.mode === 'linked') {
            this._pendingFilterConfig = { ...config };
        }
        else if (this._activePlatform === 'google') {
            this._pendingGoogleFilterConfig = { ...config };
        }
        else if (this._activePlatform === 'alexa') {
            this._pendingAlexaFilterConfig = { ...config };
        }
        else {
            this._pendingHomekitFilterConfig = { ...config };
        }
        this._hasUnsavedChanges = true;
    }
    _toggleOverride(entityId) {
        const config = this._getCurrentFilterConfig();
        const overrides = new Set(config.overrides || []);
        if (overrides.has(entityId)) {
            overrides.delete(entityId);
        }
        else {
            overrides.add(entityId);
        }
        config.overrides = Array.from(overrides);
        if (this._state?.mode === 'linked') {
            this._pendingFilterConfig = { ...config };
        }
        else if (this._activePlatform === 'google') {
            this._pendingGoogleFilterConfig = { ...config };
        }
        else if (this._activePlatform === 'alexa') {
            this._pendingAlexaFilterConfig = { ...config };
        }
        else {
            this._pendingHomekitFilterConfig = { ...config };
        }
        this._hasUnsavedChanges = true;
    }
    _toggleSelectAllPage(e, pageEntities) {
        const target = e.target;
        if (target.checked) {
            const pageIds = pageEntities.map((e) => e.entity_id);
            const newSelection = new Set([...this._selectedEntities, ...pageIds]);
            this._selectedEntities = Array.from(newSelection);
        }
        else {
            const pageIds = new Set(pageEntities.map((e) => e.entity_id));
            this._selectedEntities = this._selectedEntities.filter(id => !pageIds.has(id));
        }
    }
    _toggleSelectEntity(entityId, checked) {
        if (checked) {
            this._selectedEntities = [...this._selectedEntities, entityId];
        }
        else {
            this._selectedEntities = this._selectedEntities.filter((id) => id !== entityId);
        }
    }
    _openEntity(entityId) {
        const event = new CustomEvent('hass-more-info', {
            detail: { entityId },
            bubbles: true,
            composed: true,
        });
        this.dispatchEvent(event);
    }
    _setAlias(entityId, alias) {
        const aliases = { ...this._getCurrentAliases() };
        if (alias) {
            aliases[entityId] = alias;
        }
        else {
            delete aliases[entityId];
        }
        if (this._state?.mode === 'linked') {
            this._pendingAliases = { ...aliases };
        }
        else if (this._activePlatform === 'google') {
            this._pendingGoogleAliases = { ...aliases };
        }
        else if (this._activePlatform === 'alexa') {
            this._pendingAlexaAliases = { ...aliases };
        }
        this._hasUnsavedChanges = true;
    }
    _bulkAction(action) {
        if (this._selectedEntities.length === 0)
            return;
        const config = this._getCurrentFilterConfig();
        const aliases = this._getCurrentAliases();
        const ent_reg = this.hass.states;
        if (action === 'exclude') {
            const current_entities = new Set(config.entities || []);
            this._selectedEntities.forEach(id => current_entities.add(id));
            config.entities = Array.from(current_entities);
        }
        else if (action === 'unexclude') {
            const current_entities = new Set(config.entities || []);
            this._selectedEntities.forEach(id => current_entities.delete(id));
            config.entities = Array.from(current_entities);
        }
        else if (action === 'add_override') {
            const current_overrides = new Set(config.overrides || []);
            this._selectedEntities.forEach(id => current_overrides.add(id));
            config.overrides = Array.from(current_overrides);
        }
        else if (action === 'remove_override') {
            const current_overrides = new Set(config.overrides || []);
            this._selectedEntities.forEach(id => current_overrides.delete(id));
            config.overrides = Array.from(current_overrides);
        }
        else if (action === 'set_alias_prefix' || action === 'set_alias_suffix') {
            this._selectedEntities.forEach(entityId => {
                const state = ent_reg[entityId];
                const name = state?.attributes?.friendly_name || entityId;
                if (action === 'set_alias_prefix') {
                    aliases[entityId] = `${this._bulkActionValue}${name}`;
                }
                else {
                    aliases[entityId] = `${name}${this._bulkActionValue}`;
                }
            });
        }
        else if (action === 'clear_alias') {
            this._selectedEntities.forEach(entityId => {
                delete aliases[entityId];
            });
        }
        else if (action === 'exclude_domain') {
            const domains = new Set(config.domains || []);
            this._selectedEntities.forEach(entityId => {
                const domain = entityId.split('.')[0];
                domains.add(domain);
            });
            config.domains = Array.from(domains);
        }
        else if (action === 'exclude_device') {
            const entities = this._state?.entities || [];
            const devices = new Set(config.devices || []);
            this._selectedEntities.forEach(entityId => {
                const entity = entities.find(e => e.entity_id === entityId);
                if (entity?.device_id) {
                    devices.add(entity.device_id);
                }
            });
            config.devices = Array.from(devices);
        }
        // Update pending state
        if (this._state?.mode === 'linked') {
            this._pendingFilterConfig = { ...config };
            this._pendingAliases = { ...aliases };
        }
        else if (this._activePlatform === 'google') {
            this._pendingGoogleFilterConfig = { ...config };
            this._pendingGoogleAliases = { ...aliases };
        }
        else if (this._activePlatform === 'alexa') {
            this._pendingAlexaFilterConfig = { ...config };
            this._pendingAlexaAliases = { ...aliases };
        }
        else {
            this._pendingHomekitFilterConfig = { ...config };
        }
        this._hasUnsavedChanges = true;
        this._selectedEntities = [];
        this._bulkActionValue = '';
    }
    async _saveAllSettings() {
        this._saving = true;
        try {
            const payload = {
                type: 'voice_assistant_manager/save_all',
            };
            // Add filter configs
            if (this._pendingFilterConfig) {
                payload.filter_config = this._pendingFilterConfig;
            }
            if (this._pendingGoogleFilterConfig) {
                payload.google_filter_config = this._pendingGoogleFilterConfig;
            }
            if (this._pendingAlexaFilterConfig) {
                payload.alexa_filter_config = this._pendingAlexaFilterConfig;
            }
            if (this._pendingHomekitFilterConfig) {
                payload.homekit_filter_config = this._pendingHomekitFilterConfig;
            }
            // Add aliases
            if (this._pendingAliases) {
                payload.aliases = this._pendingAliases;
            }
            if (this._pendingGoogleAliases) {
                payload.google_aliases = this._pendingGoogleAliases;
            }
            if (this._pendingAlexaAliases) {
                payload.alexa_aliases = this._pendingAlexaAliases;
            }
            // Add settings
            if (this._pendingGoogleSettings) {
                payload.google_settings = this._pendingGoogleSettings;
            }
            if (this._pendingAlexaSettings) {
                payload.alexa_settings = this._pendingAlexaSettings;
            }
            // Add HomeKit bridge
            const currentBridge = this._state?.homekit_entry_id || '';
            if (this._pendingHomekitBridge !== currentBridge) {
                payload.homekit_entry_id = this._pendingHomekitBridge || null;
            }
            await this.hass.callWS(payload);
            await this._loadState();
            this._hasUnsavedChanges = false;
            alert(this._t('settingsSaved'));
        }
        catch (error) {
            console.error('Failed to save settings:', error);
            this._showError('Failed to save settings: ' + error.message);
        }
        this._saving = false;
    }
    _discardChanges() {
        if (!this._state)
            return;
        // Reset all pending states to saved state
        this._pendingFilterConfig = { ...(this._state.filter_config || DEFAULT_FILTER_CONFIG) };
        this._pendingGoogleFilterConfig = { ...(this._state.google_filter_config || DEFAULT_FILTER_CONFIG) };
        this._pendingAlexaFilterConfig = { ...(this._state.alexa_filter_config || DEFAULT_FILTER_CONFIG) };
        this._pendingHomekitFilterConfig = { ...(this._state.homekit_filter_config || DEFAULT_FILTER_CONFIG) };
        this._pendingAliases = { ...(this._state.aliases || {}) };
        this._pendingGoogleAliases = { ...(this._state.google_aliases || {}) };
        this._pendingAlexaAliases = { ...(this._state.alexa_aliases || {}) };
        this._pendingGoogleSettings = { ...(this._state.google_settings || {}) };
        this._pendingAlexaSettings = { ...(this._state.alexa_settings || {}) };
        this._pendingHomekitBridge = this._state.homekit_entry_id || '';
        this._hasUnsavedChanges = false;
        this._showUnsavedDialog = false;
    }
    _handleTabSwitch(newTab) {
        if (this._hasUnsavedChanges) {
            this._pendingTabSwitch = newTab;
            this._showUnsavedDialog = true;
        }
        else {
            this._activeTab = newTab;
        }
    }
    _confirmTabSwitch() {
        if (this._pendingTabSwitch) {
            this._activeTab = this._pendingTabSwitch;
            this._pendingTabSwitch = null;
        }
        this._showUnsavedDialog = false;
        this._hasUnsavedChanges = false;
    }
    _cancelTabSwitch() {
        this._showUnsavedDialog = false;
        this._pendingTabSwitch = null;
    }
    _updatePendingGoogle(key, value) {
        this._pendingGoogleSettings = {
            ...this._pendingGoogleSettings,
            [key]: value,
        };
        this._hasUnsavedChanges = true;
    }
    _updatePendingAlexa(key, value) {
        this._pendingAlexaSettings = {
            ...this._pendingAlexaSettings,
            [key]: value,
        };
        this._hasUnsavedChanges = true;
    }
    async _previewYAML() {
        try {
            const result = await this.hass.callWS({
                type: 'voice_assistant_manager/preview_yaml',
            });
            this._previewContent = result;
            this._previewDialog = true;
        }
        catch (error) {
            console.error('Failed to preview YAML:', error);
            this._showError('Failed to preview YAML: ' + error.message);
        }
    }
    async _writeFiles() {
        this._saving = true;
        try {
            // First, save all pending changes if any
            if (this._hasUnsavedChanges) {
                const payload = {
                    type: 'voice_assistant_manager/save_all',
                };
                // Add filter configs
                if (this._pendingFilterConfig) {
                    payload.filter_config = this._pendingFilterConfig;
                }
                if (this._pendingGoogleFilterConfig) {
                    payload.google_filter_config = this._pendingGoogleFilterConfig;
                }
                if (this._pendingAlexaFilterConfig) {
                    payload.alexa_filter_config = this._pendingAlexaFilterConfig;
                }
                if (this._pendingHomekitFilterConfig) {
                    payload.homekit_filter_config = this._pendingHomekitFilterConfig;
                }
                // Add aliases
                if (this._pendingAliases) {
                    payload.aliases = this._pendingAliases;
                }
                if (this._pendingGoogleAliases) {
                    payload.google_aliases = this._pendingGoogleAliases;
                }
                if (this._pendingAlexaAliases) {
                    payload.alexa_aliases = this._pendingAlexaAliases;
                }
                // Add settings
                if (this._pendingGoogleSettings) {
                    payload.google_settings = this._pendingGoogleSettings;
                }
                if (this._pendingAlexaSettings) {
                    payload.alexa_settings = this._pendingAlexaSettings;
                }
                // Add HomeKit bridge
                const currentBridge = this._state?.homekit_entry_id || '';
                if (this._pendingHomekitBridge !== currentBridge) {
                    payload.homekit_entry_id = this._pendingHomekitBridge || null;
                }
                await this.hass.callWS(payload);
                this._hasUnsavedChanges = false;
            }
            // Then write files
            const result = await this.hass.callWS({
                type: 'voice_assistant_manager/write_files',
            });
            let message = this._t('configSaved') + '\n';
            if (result.google?.written)
                message += '- ' + this._t('googleOk') + '\n';
            else if (result.google?.error)
                message += `- Google Assistant: ${result.google.error}\n`;
            if (result.alexa?.written)
                message += '- ' + this._t('alexaOk') + '\n';
            else if (result.alexa?.error)
                message += `- Alexa: ${result.alexa.error}\n`;
            if (result.homekit?.written)
                message += '- ' + this._t('homekitOk') + '\n';
            else if (result.homekit?.error)
                message += `- HomeKit: ${result.homekit.error}\n`;
            alert(message);
            await this._loadState();
        }
        catch (error) {
            console.error('Failed to write files:', error);
            this._showError('Failed to write files: ' + error.message);
        }
        this._saving = false;
    }
    async _checkConfig() {
        this._saving = true;
        try {
            const result = await this.hass.callWS({
                type: 'voice_assistant_manager/check_config',
            });
            if (result.success) {
                alert(this._t('configValid'));
            }
            else {
                alert(this._t('configError') + ': ' + (result.error || 'Unknown error'));
            }
        }
        catch (error) {
            console.error('Failed to check config:', error);
            alert('Failed to check config: ' + error.message);
        }
        this._saving = false;
    }
    async _restartHA() {
        if (!confirm(this._t('restartConfirm'))) {
            return;
        }
        this._saving = true;
        try {
            await this.hass.callWS({
                type: 'voice_assistant_manager/restart',
            });
            alert(this._t('restarting'));
        }
        catch (error) {
            console.error('Failed to restart:', error);
            alert('Failed to restart: ' + error.message);
        }
        this._saving = false;
    }
    _showError(message) {
        alert(message);
    }
    render() {
        if (this._loading) {
            return b `
        <div class="loading-container">
          <div class="spinner"></div>
          <p>${this._t('loading')}</p>
        </div>
      `;
        }
        if (this._error) {
            return b `
        <div class="error-container">
          <p>${this._t('error')}: ${this._error}</p>
          <button class="btn btn-primary" @click=${this._loadState}>
            ${this._t('retry')}
          </button>
        </div>
      `;
        }
        const isSeparateMode = this._state?.mode === 'separate';
        const filterConfig = this._getCurrentFilterConfig();
        const filterMode = filterConfig.filter_mode || 'exclude';
        return b `
      <div class="header">
        <div class="header-left">
          <h1>${this._t('title')}</h1>
          <div class="mode-select">
            <label>${this._t('mode')}:</label>
            <select
              @change=${(e) => this._setMode(e.target.value)}
              .value=${this._state?.mode || 'linked'}
              ?disabled=${this._saving}
            >
              <option value="linked">${this._t('linked')}</option>
              <option value="separate">${this._t('separate')}</option>
            </select>
          </div>
          ${isSeparateMode ? b `
            <div class="platform-tabs">
              <button 
                class="platform-tab google ${this._activePlatform === 'google' ? 'active' : ''}"
                @click=${() => this._activePlatform = 'google'}
              >Google</button>
              <button 
                class="platform-tab alexa ${this._activePlatform === 'alexa' ? 'active' : ''}"
                @click=${() => this._activePlatform = 'alexa'}
              >Alexa</button>
              <button 
                class="platform-tab homekit ${this._activePlatform === 'homekit' ? 'active' : ''}"
                @click=${() => this._activePlatform = 'homekit'}
              >HomeKit</button>
            </div>
          ` : ''}
          <div class="filter-mode-toggle">
            <label>
              <input 
                type="radio" 
                name="filterMode" 
                value="exclude"
                .checked=${filterMode === 'exclude'}
                @change=${() => this._setFilterMode('exclude')}
                ?disabled=${this._saving}
              />
              ${this._t('exclude')}
            </label>
            <label>
              <input 
                type="radio" 
                name="filterMode" 
                value="include"
                .checked=${filterMode === 'include'}
                @change=${() => this._setFilterMode('include')}
                ?disabled=${this._saving}
              />
              ${this._t('include')}
            </label>
          </div>
        </div>
      </div>

      <div class="tabs">
        <div
          class="tab ${this._activeTab === 'entities' ? 'active' : ''}"
          @click=${() => this._handleTabSwitch('entities')}
        >
          ${this._t('entities')}
        </div>
        <div
          class="tab ${this._activeTab === 'settings' ? 'active' : ''}"
          @click=${() => this._handleTabSwitch('settings')}
        >
          ${this._t('settings')}
        </div>
      </div>

      <div class="content">
        ${this._activeTab === 'entities'
            ? this._renderEntitiesTab()
            : this._renderSettingsTab()}
      </div>

      ${this._renderFooter()}
      ${this._showUnsavedDialog ? this._renderUnsavedDialog() : ''}
      ${this._previewDialog ? this._renderPreviewDialog() : ''}
    `;
    }
    _renderDomainCard() {
        const filterConfig = this._getCurrentFilterConfig();
        const filterMode = filterConfig.filter_mode || 'exclude';
        const selectedDomains = new Set(filterConfig.domains || []);
        const allDomains = this._state?.domains || [];
        return b `
      <div class="domain-card">
        <div 
          class="domain-card-header"
          @click=${() => this._domainsExpanded = !this._domainsExpanded}
        >
          <h3>
            ${filterMode === 'exclude' ? this._t('domainsToExclude') : this._t('domainsToInclude')}
            (${selectedDomains.size} ${this._t('selected')})
          </h3>
          <span class="toggle-icon ${this._domainsExpanded ? 'expanded' : ''}">
            ▼
          </span>
        </div>
        ${this._domainsExpanded ? b `
          <div class="domain-grid">
            ${allDomains.map(domain => b `
              <div 
                class="domain-item ${selectedDomains.has(domain) ? 'selected' : ''}"
                @click=${() => this._toggleDomain(domain)}
              >
                <input 
                  type="checkbox" 
                  .checked=${selectedDomains.has(domain)}
                  @click=${(e) => e.stopPropagation()}
                  @change=${() => this._toggleDomain(domain)}
                />
                ${domain}
              </div>
            `)}
          </div>
          <div class="domain-actions">
            <button @click=${this._selectAllDomains}>${this._t('selectAll')}</button>
            <button @click=${this._deselectAllDomains}>${this._t('deselectAll')}</button>
          </div>
        ` : ''}
      </div>
    `;
    }
    _renderEntitiesTab() {
        const filteredEntities = this._getFilteredEntities();
        const aliases = this._getCurrentAliases();
        const filterConfig = this._getCurrentFilterConfig();
        const overrides = new Set(filterConfig.overrides || []);
        const totalPages = Math.ceil(filteredEntities.length / this._pageSize);
        const currentPage = Math.min(this._currentPage, totalPages || 1);
        const startIndex = (currentPage - 1) * this._pageSize;
        const endIndex = startIndex + this._pageSize;
        const paginatedEntities = filteredEntities.slice(startIndex, endIndex);
        return b `
      ${this._renderDomainCard()}
      ${this._renderFilters()}
      ${this._selectedEntities.length > 0 ? this._renderBulkActions() : ''}

      <div class="entity-table-container">
        <div class="table-scroll">
          <table class="entity-table">
            <thead>
              <tr>
                <th style="width: 40px">
                  <input
                    type="checkbox"
                    @change=${(e) => this._toggleSelectAllPage(e, paginatedEntities)}
                    .checked=${paginatedEntities.length > 0 &&
            paginatedEntities.every(e => this._selectedEntities.includes(e.entity_id))}
                  />
                </th>
                <th style="width: 80px">${this._t('status')}</th>
                <th style="width: 70px">${this._t('override')}</th>
                <th style="width: 180px">${this._t('voiceAlias')}</th>
                <th>${this._t('name')}</th>
                <th style="width: 100px">${this._t('domain')}</th>
                <th style="width: 120px">${this._t('area')}</th>
                <th style="width: 100px">${this._t('reason')}</th>
              </tr>
            </thead>
            <tbody>
              ${paginatedEntities.length === 0
            ? b `
                    <tr>
                      <td colspan="8" class="no-results">
                        ${this._t('noResults')}
                      </td>
                    </tr>
                  `
            : paginatedEntities.map((entity) => {
                const { exposed, reason } = this._isEntityExposed(entity);
                const alias = aliases[entity.entity_id] || '';
                const isSelected = this._selectedEntities.includes(entity.entity_id);
                const isOverride = overrides.has(entity.entity_id);
                const showOverride = reason === 'domain';
                return b `
                      <tr class="${!exposed ? 'excluded' : ''} ${isOverride ? 'override' : ''}">
                        <td>
                          <input
                            type="checkbox"
                            .checked=${isSelected}
                            @change=${(e) => this._toggleSelectEntity(entity.entity_id, e.target.checked)}
                          />
                        </td>
                        <td>
                          <span class="status-badge ${exposed ? 'exposed' : 'excluded'} ${isOverride ? 'override' : ''}">
                            ${exposed ? this._t('exposed') : this._t('hidden')}
                          </span>
                        </td>
                        <td>
                          ${showOverride || isOverride ? b `
                            <button 
                              class="override-btn ${isOverride ? 'active' : ''}"
                              @click=${() => this._toggleOverride(entity.entity_id)}
                              title="${isOverride ? this._t('removeOverride') : this._t('addOverride')}"
                            >
                              ${isOverride ? '−' : '+'}
                            </button>
                          ` : ''}
                        </td>
                        <td>
                          <input
                            type="text"
                            class="alias-input"
                            .value=${alias}
                            placeholder="${this._t('aliasPlaceholder')}"
                            maxlength="128"
                            @change=${(e) => this._setAlias(entity.entity_id, e.target.value)}
                          />
                        </td>
                        <td>
                          <span
                            class="entity-link"
                            @click=${() => this._openEntity(entity.entity_id)}
                          >
                            ${escapeHtml(entity.name || entity.entity_id)}
                          </span>
                        </td>
                        <td>${escapeHtml(entity.domain)}</td>
                        <td>${escapeHtml(entity.area_name || '-')}</td>
                        <td>
                          <span class="reason-text">
                            ${reason === 'domain' ? this._t('byDomain') :
                    reason === 'entity' ? this._t('manual') :
                        reason === 'override' ? this._t('override') : ''}
                          </span>
                        </td>
                      </tr>
                    `;
            })}
            </tbody>
          </table>
        </div>
        <div class="pagination">
          <div class="pagination-info">
            ${this._t('showing')} ${startIndex + 1}-${Math.min(endIndex, filteredEntities.length)} 
            ${this._t('of')} ${filteredEntities.length} ${this._t('entities').toLowerCase()}
            ${this._state?.entities?.length !== filteredEntities.length
            ? `(${this._state?.entities?.length || 0} ${this._t('total')})`
            : ''}
          </div>
          <div class="pagination-controls">
            <select 
              .value=${String(this._pageSize)}
              @change=${(e) => {
            this._pageSize = parseInt(e.target.value);
            this._currentPage = 1;
        }}
            >
              <option value="25">25 ${this._t('perPage')}</option>
              <option value="50">50 ${this._t('perPage')}</option>
              <option value="100">100 ${this._t('perPage')}</option>
              <option value="200">200 ${this._t('perPage')}</option>
            </select>
            <button 
              ?disabled=${currentPage <= 1}
              @click=${() => this._currentPage = 1}
            >${this._t('first')}</button>
            <button 
              ?disabled=${currentPage <= 1}
              @click=${() => this._currentPage = currentPage - 1}
            >${this._t('prev')}</button>
            <span>
              ${this._t('page')} 
              <input 
                type="number" 
                class="page-input"
                min="1" 
                max="${totalPages}"
                .value=${String(currentPage)}
                @change=${(e) => {
            const page = parseInt(e.target.value);
            if (page >= 1 && page <= totalPages) {
                this._currentPage = page;
            }
        }}
              />
              ${this._t('of')} ${totalPages || 1}
            </span>
            <button 
              ?disabled=${currentPage >= totalPages}
              @click=${() => this._currentPage = currentPage + 1}
            >${this._t('next')}</button>
            <button 
              ?disabled=${currentPage >= totalPages}
              @click=${() => this._currentPage = totalPages}
            >${this._t('last')}</button>
          </div>
        </div>
      </div>
    `;
    }
    _renderFilters() {
        return b `
      <div class="filters">
        <div class="filter-row">
          <div class="filter-item">
            <label>${this._t('search')}</label>
            <input
              type="text"
              placeholder="${this._t('searchPlaceholder')}"
              .value=${this._filters.search}
              @input=${(e) => this._debouncedSearch(e.target.value)}
            />
          </div>

          <div class="filter-item">
            <label>${this._t('domain')}</label>
            <select
              @change=${(e) => {
            const value = e.target.value;
            this._filters = {
                ...this._filters,
                domains: value ? [value] : [],
            };
            this._currentPage = 1;
        }}
            >
              <option value="">${this._t('allDomains')}</option>
              ${(this._state?.domains || []).map((domain) => b `<option value="${domain}">${escapeHtml(domain)}</option>`)}
            </select>
          </div>

          <div class="filter-item">
            <label>${this._t('area')}</label>
            <select
              @change=${(e) => {
            this._filters = { ...this._filters, area: e.target.value };
            this._currentPage = 1;
        }}
            >
              <option value="">${this._t('allAreas')}</option>
              ${(this._state?.areas || []).map((area) => b `<option value="${area.id}">
                    ${escapeHtml(area.name)}
                  </option>`)}
            </select>
          </div>

          <div class="filter-toggles">
            <label class="filter-toggle">
              <input
                type="checkbox"
                .checked=${this._filters.onlyExcluded}
                @change=${(e) => {
            this._filters = {
                ...this._filters,
                onlyExcluded: e.target.checked,
                onlyNotExcluded: false,
            };
            this._currentPage = 1;
        }}
              />
              ${this._t('onlyHidden')}
            </label>

            <label class="filter-toggle">
              <input
                type="checkbox"
                .checked=${this._filters.onlyNotExcluded}
                @change=${(e) => {
            this._filters = {
                ...this._filters,
                onlyNotExcluded: e.target.checked,
                onlyExcluded: false,
            };
            this._currentPage = 1;
        }}
              />
              ${this._t('onlyExposed')}
            </label>

            <label class="filter-toggle">
              <input
                type="checkbox"
                .checked=${this._filters.onlyWithAlias}
                @change=${(e) => {
            this._filters = {
                ...this._filters,
                onlyWithAlias: e.target.checked,
            };
            this._currentPage = 1;
        }}
              />
              ${this._t('withAlias')}
            </label>

            <label class="filter-toggle">
              <input
                type="checkbox"
                .checked=${this._filters.onlyOverrides}
                @change=${(e) => {
            this._filters = {
                ...this._filters,
                onlyOverrides: e.target.checked,
            };
            this._currentPage = 1;
        }}
              />
              ${this._t('overrides')}
            </label>
          </div>
        </div>
      </div>
    `;
    }
    _renderBulkActions() {
        return b `
      <div class="bulk-actions">
        <span class="count">${this._selectedEntities.length} ${this._t('selectedCount')}</span>
        <select id="bulkAction">
          <option value="">${this._t('selectAction')}</option>
          <option value="exclude">${this._t('addToExclusions')}</option>
          <option value="unexclude">${this._t('removeFromExclusions')}</option>
          <option value="add_override">${this._t('addOverride')}</option>
          <option value="remove_override">${this._t('removeOverride')}</option>
          <option value="exclude_domain">${this._t('excludeDomain')}</option>
          <option value="exclude_device">${this._t('excludeDevice')}</option>
          <option value="set_alias_prefix">${this._t('addAliasPrefix')}</option>
          <option value="set_alias_suffix">${this._t('addAliasSuffix')}</option>
          <option value="clear_alias">${this._t('clearAlias')}</option>
        </select>
        <input
          type="text"
          placeholder="${this._t('valuePlaceholder')}"
          .value=${this._bulkActionValue}
          @input=${(e) => (this._bulkActionValue = e.target.value)}
        />
        <button
          @click=${() => {
            const select = this.shadowRoot?.querySelector('#bulkAction');
            if (select?.value) {
                this._bulkAction(select.value);
            }
        }}
          ?disabled=${this._saving}
        >
          ${this._t('apply')}
        </button>
        <button
          @click=${() => {
            this._selectedEntities = [];
            this._bulkActionValue = '';
        }}
        >
          ${this._t('clear')}
        </button>
      </div>
    `;
    }
    _renderSettingsTab() {
        const googleSettings = this._pendingGoogleSettings || this._state?.google_settings || {};
        const alexaSettings = this._pendingAlexaSettings || this._state?.alexa_settings || {};
        return b `
      <div class="settings-container">
        <div class="settings-grid">
          <div class="settings-card">
            <h3>
              <span class="icon">🔵</span>
              ${this._t('googleAssistant')}
            </h3>
            <div class="settings-form">
              <div class="form-group">
                <label class="checkbox-label">
                  <input
                    type="checkbox"
                    .checked=${googleSettings.enabled || false}
                    @change=${(e) => this._updatePendingGoogle('enabled', e.target.checked)}
                  />
                  ${this._t('enableGoogle')}
                </label>
              </div>
              <div class="form-group">
                <label>${this._t('projectId')}</label>
                <input
                  type="text"
                  .value=${googleSettings.project_id || ''}
                  placeholder="${this._t('projectIdPlaceholder')}"
                  @input=${(e) => this._updatePendingGoogle('project_id', e.target.value)}
                />
              </div>
              <div class="form-group">
                <label>${this._t('serviceAccountPath')}</label>
                <input
                  type="text"
                  .value=${googleSettings.service_account_path || ''}
                  placeholder="${this._t('serviceAccountPlaceholder')}"
                  @input=${(e) => this._updatePendingGoogle('service_account_path', e.target.value)}
                />
              </div>
              <div class="form-group">
                <label class="checkbox-label">
                  <input
                    type="checkbox"
                    .checked=${googleSettings.report_state !== false}
                    @change=${(e) => this._updatePendingGoogle('report_state', e.target.checked)}
                  />
                  ${this._t('reportState')}
                </label>
              </div>
              <div class="form-group">
                <label>${this._t('securePin')}</label>
                <input
                  type="text"
                  .value=${googleSettings.secure_devices_pin || ''}
                  placeholder="${this._t('securePinPlaceholder')}"
                  @input=${(e) => this._updatePendingGoogle('secure_devices_pin', e.target.value)}
                />
              </div>
              <div class="form-group">
                <label>${this._t('advancedYaml')}</label>
                <textarea
                  .value=${googleSettings.advanced_yaml || ''}
                  placeholder="exposed_domains:\n  - switch\n  - light"
                  @input=${(e) => this._updatePendingGoogle('advanced_yaml', e.target.value)}
                ></textarea>
              </div>
            </div>
          </div>

          <div class="settings-card">
            <h3>
              <span class="icon">🔷</span>
              ${this._t('amazonAlexa')}
            </h3>
            <div class="settings-form">
              <div class="form-group">
                <label class="checkbox-label">
                  <input
                    type="checkbox"
                    .checked=${alexaSettings.enabled || false}
                    @change=${(e) => this._updatePendingAlexa('enabled', e.target.checked)}
                  />
                  ${this._t('enableAlexa')}
                </label>
              </div>
              <div class="form-group">
                <label>${this._t('baseConfig')}</label>
                <textarea
                  .value=${alexaSettings.advanced_yaml || ''}
                  placeholder="${this._t('baseConfigPlaceholder')}"
                  @input=${(e) => this._updatePendingAlexa('advanced_yaml', e.target.value)}
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        ${this._renderHomekitSettings()}
      </div>
    `;
    }
    _renderHomekitSettings() {
        const bridges = this._state?.homekit_bridges || [];
        let selectedBridge = '';
        if (this._pendingHomekitBridge !== null && this._pendingHomekitBridge !== undefined) {
            selectedBridge = this._pendingHomekitBridge;
        }
        else if (this._state?.homekit_entry_id) {
            selectedBridge = this._state.homekit_entry_id;
        }
        const bridgeExists = selectedBridge && bridges.some((b) => b.entry_id === selectedBridge);
        const effectiveBridge = bridgeExists ? selectedBridge : '';
        return b `
      <div class="homekit-section">
        <h3>
          <span class="icon">🟠</span>
          ${this._t('homekitBridge')}
        </h3>
        <p style="color: var(--vm-text-secondary); font-size: 14px;">
          ${this._t('homekitDescription')}
        </p>
        
        ${bridges.length === 0 ? b `
          <p style="color: var(--vm-warning);">
            ${this._t('noHomekitBridges')}
          </p>
        ` : b `
          <div class="homekit-bridge-select">
            <select @change=${(e) => {
            this._pendingHomekitBridge = e.target.value;
            this._hasUnsavedChanges = true;
        }}>
              <option value="" ?selected=${!effectiveBridge}>${this._t('noBridge')}</option>
              ${bridges.map((bridge) => b `
                <option value="${bridge.entry_id}" ?selected=${effectiveBridge === bridge.entry_id}>
                  ${escapeHtml(bridge.title)} (${this._t('port')}: ${bridge.port})
                </option>
              `)}
            </select>
          </div>
          ${effectiveBridge ? b `
            <p style="color: var(--vm-success); font-size: 13px; margin-top: 8px;">
              ✓ ${this._t('homekitEnabled')}
            </p>
          ` : b `
            <p style="color: var(--vm-text-secondary); font-size: 13px; margin-top: 8px;">
              ${this._t('homekitDisabled')}
            </p>
          `}
        `}
      </div>
    `;
    }
    _renderFooter() {
        if (this._activeTab === 'settings') {
            return b `
        <div class="footer">
          <div class="footer-info">
            ${this._t('configureSettings')}
          </div>
          <div class="footer-actions">
            <button
              class="btn btn-secondary"
              @click=${() => this._handleTabSwitch('entities')}
            >
              ${this._t('backToEntities')}
            </button>
            <button
              class="btn btn-secondary"
              @click=${this._discardChanges}
              ?disabled=${!this._hasUnsavedChanges}
            >
              ${this._t('discardChanges') || 'Discard Changes'}
            </button>
            <button
              class="btn btn-primary"
              @click=${this._saveAllSettings}
              ?disabled=${this._saving}
            >
              ${this._saving ? this._t('saving') : this._t('saveSettings')}
            </button>
          </div>
        </div>
      `;
        }
        return b `
      <div class="footer">
        <div class="footer-info">
          ${this._hasUnsavedChanges ? b `
            <span style="color: var(--vm-warning); font-weight: bold;">
              ⚠️ ${this._t('unsavedChanges') || 'Unsaved changes'}
            </span>
            |
          ` : ''}
          ${this._state?.google_complete
            ? this._t('googleReady')
            : this._t('googleNotConfigured')}
          |
          ${this._state?.alexa_complete
            ? this._t('alexaReady')
            : this._t('alexaNotConfigured')}
          |
          ${this._state?.homekit_entry_id
            ? this._t('homekitEnabledStatus')
            : this._t('homekitDisabledStatus')}
        </div>
        <div class="footer-actions">
          ${this._hasUnsavedChanges ? b `
            <button
              class="btn btn-secondary"
              @click=${this._discardChanges}
            >
              ${this._t('discardChanges') || 'Discard Changes'}
            </button>
          ` : ''}
          <button
            class="btn btn-secondary"
            @click=${this._previewYAML}
            ?disabled=${this._saving}
          >
            ${this._t('previewYaml')}
          </button>
          <button
            class="btn btn-primary"
            @click=${this._writeFiles}
            ?disabled=${this._saving}
          >
            ${this._t('saveGenerate')}
          </button>
          <button
            class="btn btn-secondary"
            @click=${this._checkConfig}
            ?disabled=${this._saving}
          >
            ${this._t('checkConfig')}
          </button>
          <button
            class="btn btn-secondary"
            @click=${this._restartHA}
            ?disabled=${this._saving}
            style="background: var(--vm-warning); color: white;"
          >
            ${this._t('restartHa')}
          </button>
        </div>
      </div>
    `;
    }
    _renderUnsavedDialog() {
        return b `
      <div class="dialog-overlay" @click=${this._cancelTabSwitch}>
        <div class="dialog" @click=${(e) => e.stopPropagation()} style="max-width: 500px;">
          <div class="dialog-header">
            <h2>⚠️ ${this._t('unsavedChanges') || 'Unsaved Changes'}</h2>
            <button
              class="dialog-close"
              @click=${this._cancelTabSwitch}
            >
              ×
            </button>
          </div>
          <div class="dialog-content">
            <p>${this._t('unsavedChangesMessage') || 'You have unsaved changes. Do you want to discard them?'}</p>
          </div>
          <div class="dialog-footer">
            <button
              class="btn btn-secondary"
              @click=${this._cancelTabSwitch}
            >
              ${this._t('cancel') || 'Cancel'}
            </button>
            <button
              class="btn btn-primary"
              @click=${() => {
            this._discardChanges();
            this._confirmTabSwitch();
        }}
              style="background: var(--vm-warning);"
            >
              ${this._t('discardChanges') || 'Discard Changes'}
            </button>
          </div>
        </div>
      </div>
    `;
    }
    _renderPreviewDialog() {
        return b `
      <div class="dialog-overlay" @click=${() => (this._previewDialog = false)}>
        <div class="dialog" @click=${(e) => e.stopPropagation()}>
          <div class="dialog-header">
            <h2>${this._t('yamlPreview')}</h2>
            <button
              class="dialog-close"
              @click=${() => (this._previewDialog = false)}
            >
              ×
            </button>
          </div>
          <div class="dialog-content">
            ${this._previewContent?.google
            ? b `
                  <h3>${this._t('googleAssistant')}</h3>
                  ${this._previewContent.google.warnings?.length
                ? b `
                        <p style="color: var(--vm-warning)">
                          ${this._t('warnings')}:
                          ${this._previewContent.google.warnings.join(', ')}
                        </p>
                      `
                : ''}
                  <pre class="yaml-preview">${this._previewContent.google.yaml || this._t('notConfigured')}</pre>
                `
            : ''}
            ${this._previewContent?.alexa
            ? b `
                  <h3>${this._t('amazonAlexa')}</h3>
                  ${this._previewContent.alexa.warnings?.length
                ? b `
                        <p style="color: var(--vm-warning)">
                          ${this._t('warnings')}:
                          ${this._previewContent.alexa.warnings.join(', ')}
                        </p>
                      `
                : ''}
                  <pre class="yaml-preview">${this._previewContent.alexa.yaml || this._t('notConfigured')}</pre>
                `
            : ''}
          </div>
          <div class="dialog-footer">
            <button
              class="btn btn-secondary"
              @click=${() => (this._previewDialog = false)}
            >
              ${this._t('close')}
            </button>
            <button class="btn btn-primary" @click=${this._writeFiles}>
              ${this._t('saveGenerate')}
            </button>
          </div>
        </div>
      </div>
    `;
    }
};
VoiceAssistantManagerPanel.styles = [
    sharedStyles,
    headerStyles,
    tabStyles,
    cardStyles,
    tableStyles,
    paginationStyles,
    filterStyles,
    bulkActionsStyles,
    settingsStyles,
    dialogStyles,
    footerStyles,
    i$3 `
      :host {
        display: block;
        padding: 16px;
      }

      @media (max-width: 768px) {
        :host {
          padding: 8px;
        }

        .filters {
          padding: 12px;
        }

        .filter-item input,
        .filter-item select {
          min-width: 120px;
        }

        .settings-grid {
          grid-template-columns: 1fr;
        }

        .table-scroll {
          max-height: 400px;
        }

        .entity-table {
          min-width: 700px;
        }
      }
    `,
];
__decorate([
    n({ attribute: false })
], VoiceAssistantManagerPanel.prototype, "hass", void 0);
__decorate([
    n({ type: Boolean })
], VoiceAssistantManagerPanel.prototype, "narrow", void 0);
__decorate([
    n({ attribute: false })
], VoiceAssistantManagerPanel.prototype, "panel", void 0);
__decorate([
    r()
], VoiceAssistantManagerPanel.prototype, "_state", void 0);
__decorate([
    r()
], VoiceAssistantManagerPanel.prototype, "_loading", void 0);
__decorate([
    r()
], VoiceAssistantManagerPanel.prototype, "_error", void 0);
__decorate([
    r()
], VoiceAssistantManagerPanel.prototype, "_activeTab", void 0);
__decorate([
    r()
], VoiceAssistantManagerPanel.prototype, "_selectedEntities", void 0);
__decorate([
    r()
], VoiceAssistantManagerPanel.prototype, "_filters", void 0);
__decorate([
    r()
], VoiceAssistantManagerPanel.prototype, "_previewDialog", void 0);
__decorate([
    r()
], VoiceAssistantManagerPanel.prototype, "_previewContent", void 0);
__decorate([
    r()
], VoiceAssistantManagerPanel.prototype, "_bulkActionValue", void 0);
__decorate([
    r()
], VoiceAssistantManagerPanel.prototype, "_saving", void 0);
__decorate([
    r()
], VoiceAssistantManagerPanel.prototype, "_currentPage", void 0);
__decorate([
    r()
], VoiceAssistantManagerPanel.prototype, "_pageSize", void 0);
__decorate([
    r()
], VoiceAssistantManagerPanel.prototype, "_activePlatform", void 0);
__decorate([
    r()
], VoiceAssistantManagerPanel.prototype, "_domainsExpanded", void 0);
__decorate([
    r()
], VoiceAssistantManagerPanel.prototype, "_pendingGoogleSettings", void 0);
__decorate([
    r()
], VoiceAssistantManagerPanel.prototype, "_pendingAlexaSettings", void 0);
__decorate([
    r()
], VoiceAssistantManagerPanel.prototype, "_pendingHomekitBridge", void 0);
__decorate([
    r()
], VoiceAssistantManagerPanel.prototype, "_pendingFilterConfig", void 0);
__decorate([
    r()
], VoiceAssistantManagerPanel.prototype, "_pendingGoogleFilterConfig", void 0);
__decorate([
    r()
], VoiceAssistantManagerPanel.prototype, "_pendingAlexaFilterConfig", void 0);
__decorate([
    r()
], VoiceAssistantManagerPanel.prototype, "_pendingHomekitFilterConfig", void 0);
__decorate([
    r()
], VoiceAssistantManagerPanel.prototype, "_pendingAliases", void 0);
__decorate([
    r()
], VoiceAssistantManagerPanel.prototype, "_pendingGoogleAliases", void 0);
__decorate([
    r()
], VoiceAssistantManagerPanel.prototype, "_pendingAlexaAliases", void 0);
__decorate([
    r()
], VoiceAssistantManagerPanel.prototype, "_hasUnsavedChanges", void 0);
__decorate([
    r()
], VoiceAssistantManagerPanel.prototype, "_showUnsavedDialog", void 0);
__decorate([
    r()
], VoiceAssistantManagerPanel.prototype, "_pendingTabSwitch", void 0);
VoiceAssistantManagerPanel = __decorate([
    t('voice-assistant-manager-panel')
], VoiceAssistantManagerPanel);

export { VoiceAssistantManagerPanel };
