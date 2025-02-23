import{_ as yo}from"./vendor-t-BWxlVkay.js";import{o as rl}from"./vendor-i-QmFmXgsK.js";var Cc={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const il=function(n){const e=[];let t=0;for(let r=0;r<n.length;r++){let i=n.charCodeAt(r);i<128?e[t++]=i:i<2048?(e[t++]=i>>6|192,e[t++]=i&63|128):(i&64512)===55296&&r+1<n.length&&(n.charCodeAt(r+1)&64512)===56320?(i=65536+((i&1023)<<10)+(n.charCodeAt(++r)&1023),e[t++]=i>>18|240,e[t++]=i>>12&63|128,e[t++]=i>>6&63|128,e[t++]=i&63|128):(e[t++]=i>>12|224,e[t++]=i>>6&63|128,e[t++]=i&63|128)}return e},xf=function(n){const e=[];let t=0,r=0;for(;t<n.length;){const i=n[t++];if(i<128)e[r++]=String.fromCharCode(i);else if(i>191&&i<224){const s=n[t++];e[r++]=String.fromCharCode((i&31)<<6|s&63)}else if(i>239&&i<365){const s=n[t++],a=n[t++],c=n[t++],l=((i&7)<<18|(s&63)<<12|(a&63)<<6|c&63)-65536;e[r++]=String.fromCharCode(55296+(l>>10)),e[r++]=String.fromCharCode(56320+(l&1023))}else{const s=n[t++],a=n[t++];e[r++]=String.fromCharCode((i&15)<<12|(s&63)<<6|a&63)}}return e.join("")},sl={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(n,e){if(!Array.isArray(n))throw Error("encodeByteArray takes an array as a parameter");this.init_();const t=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[];for(let i=0;i<n.length;i+=3){const s=n[i],a=i+1<n.length,c=a?n[i+1]:0,l=i+2<n.length,d=l?n[i+2]:0,p=s>>2,g=(s&3)<<4|c>>4;let E=(c&15)<<2|d>>6,R=d&63;l||(R=64,a||(E=64)),r.push(t[p],t[g],t[E],t[R])}return r.join("")},encodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(n):this.encodeByteArray(il(n),e)},decodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(n):xf(this.decodeStringToByteArray(n,e))},decodeStringToByteArray(n,e){this.init_();const t=e?this.charToByteMapWebSafe_:this.charToByteMap_,r=[];for(let i=0;i<n.length;){const s=t[n.charAt(i++)],c=i<n.length?t[n.charAt(i)]:0;++i;const d=i<n.length?t[n.charAt(i)]:64;++i;const g=i<n.length?t[n.charAt(i)]:64;if(++i,s==null||c==null||d==null||g==null)throw new Uf;const E=s<<2|c>>4;if(r.push(E),d!==64){const R=c<<4&240|d>>2;if(r.push(R),g!==64){const k=d<<6&192|g;r.push(k)}}}return r},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let n=0;n<this.ENCODED_VALS.length;n++)this.byteToCharMap_[n]=this.ENCODED_VALS.charAt(n),this.charToByteMap_[this.byteToCharMap_[n]]=n,this.byteToCharMapWebSafe_[n]=this.ENCODED_VALS_WEBSAFE.charAt(n),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[n]]=n,n>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(n)]=n,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(n)]=n)}}};class Uf extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const Ff=function(n){const e=il(n);return sl.encodeByteArray(e,!0)},pi=function(n){return Ff(n).replace(/\./g,"")},ol=function(n){try{return sl.decodeString(n,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Bf(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const qf=()=>Bf().__FIREBASE_DEFAULTS__,$f=()=>{if(typeof process>"u"||typeof Cc>"u")return;const n=Cc.__FIREBASE_DEFAULTS__;if(n)return JSON.parse(n)},jf=()=>{if(typeof document>"u")return;let n;try{n=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=n&&ol(n[1]);return e&&JSON.parse(e)},Oi=()=>{try{return qf()||$f()||jf()}catch(n){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${n}`);return}},al=n=>{var e,t;return(t=(e=Oi())===null||e===void 0?void 0:e.emulatorHosts)===null||t===void 0?void 0:t[n]},cl=n=>{const e=al(n);if(!e)return;const t=e.lastIndexOf(":");if(t<=0||t+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const r=parseInt(e.substring(t+1),10);return e[0]==="["?[e.substring(1,t-1),r]:[e.substring(0,t),r]},ul=()=>{var n;return(n=Oi())===null||n===void 0?void 0:n.config},ll=n=>{var e;return(e=Oi())===null||e===void 0?void 0:e[`_${n}`]};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zf{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}wrapCallback(e){return(t,r)=>{t?this.reject(t):this.resolve(r),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(t):e(t,r))}}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function hl(n,e){if(n.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const t={alg:"none",type:"JWT"},r=e||"demo-project",i=n.iat||0,s=n.sub||n.user_id;if(!s)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const a=Object.assign({iss:`https://securetoken.google.com/${r}`,aud:r,iat:i,exp:i+3600,auth_time:i,sub:s,user_id:s,firebase:{sign_in_provider:"custom",identities:{}}},n);return[pi(JSON.stringify(t)),pi(JSON.stringify(a)),""].join(".")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ae(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function Hf(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(Ae())}function Gf(){var n;const e=(n=Oi())===null||n===void 0?void 0:n.forceEnvironment;if(e==="node")return!0;if(e==="browser")return!1;try{return Object.prototype.toString.call(global.process)==="[object process]"}catch{return!1}}function Wf(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function dl(){const n=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof n=="object"&&n.id!==void 0}function Kf(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function Qf(){const n=Ae();return n.indexOf("MSIE ")>=0||n.indexOf("Trident/")>=0}function Yf(){return!Gf()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function fl(){try{return typeof indexedDB=="object"}catch{return!1}}function pl(){return new Promise((n,e)=>{try{let t=!0;const r="validate-browser-context-for-indexeddb-analytics-module",i=self.indexedDB.open(r);i.onsuccess=()=>{i.result.close(),t||self.indexedDB.deleteDatabase(r),n(!0)},i.onupgradeneeded=()=>{t=!1},i.onerror=()=>{var s;e(((s=i.error)===null||s===void 0?void 0:s.message)||"")}}catch(t){e(t)}})}function Xf(){return!(typeof navigator>"u"||!navigator.cookieEnabled)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Jf="FirebaseError";class Be extends Error{constructor(e,t,r){super(t),this.code=e,this.customData=r,this.name=Jf,Object.setPrototypeOf(this,Be.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,Xt.prototype.create)}}class Xt{constructor(e,t,r){this.service=e,this.serviceName=t,this.errors=r}create(e,...t){const r=t[0]||{},i=`${this.service}/${e}`,s=this.errors[e],a=s?Zf(s,r):"Error",c=`${this.serviceName}: ${a} (${i}).`;return new Be(i,c,r)}}function Zf(n,e){return n.replace(ep,(t,r)=>{const i=e[r];return i!=null?String(i):`<${r}?>`})}const ep=/\{\$([^}]+)}/g;function tp(n){for(const e in n)if(Object.prototype.hasOwnProperty.call(n,e))return!1;return!0}function or(n,e){if(n===e)return!0;const t=Object.keys(n),r=Object.keys(e);for(const i of t){if(!r.includes(i))return!1;const s=n[i],a=e[i];if(kc(s)&&kc(a)){if(!or(s,a))return!1}else if(s!==a)return!1}for(const i of r)if(!t.includes(i))return!1;return!0}function kc(n){return n!==null&&typeof n=="object"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function yr(n){const e=[];for(const[t,r]of Object.entries(n))Array.isArray(r)?r.forEach(i=>{e.push(encodeURIComponent(t)+"="+encodeURIComponent(i))}):e.push(encodeURIComponent(t)+"="+encodeURIComponent(r));return e.length?"&"+e.join("&"):""}function Kn(n){const e={};return n.replace(/^\?/,"").split("&").forEach(r=>{if(r){const[i,s]=r.split("=");e[decodeURIComponent(i)]=decodeURIComponent(s)}}),e}function Qn(n){const e=n.indexOf("?");if(!e)return"";const t=n.indexOf("#",e);return n.substring(e,t>0?t:void 0)}function np(n,e){const t=new rp(n,e);return t.subscribe.bind(t)}class rp{constructor(e,t){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=t,this.task.then(()=>{e(this)}).catch(r=>{this.error(r)})}next(e){this.forEachObserver(t=>{t.next(e)})}error(e){this.forEachObserver(t=>{t.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,t,r){let i;if(e===void 0&&t===void 0&&r===void 0)throw new Error("Missing Observer.");ip(e,["next","error","complete"])?i=e:i={next:e,error:t,complete:r},i.next===void 0&&(i.next=Os),i.error===void 0&&(i.error=Os),i.complete===void 0&&(i.complete=Os);const s=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?i.error(this.finalError):i.complete()}catch{}}),this.observers.push(i),s}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let t=0;t<this.observers.length;t++)this.sendOne(t,e)}sendOne(e,t){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{t(this.observers[e])}catch(r){typeof console<"u"&&console.error&&console.error(r)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function ip(n,e){if(typeof n!="object"||n===null)return!1;for(const t of e)if(t in n&&typeof n[t]=="function")return!0;return!1}function Os(){}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const sp=1e3,op=2,ap=4*60*60*1e3,cp=.5;function Nc(n,e=sp,t=op){const r=e*Math.pow(t,n),i=Math.round(cp*r*(Math.random()-.5)*2);return Math.min(ap,r+i)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Q(n){return n&&n._delegate?n._delegate:n}class Fe{constructor(e,t,r){this.name=e,this.instanceFactory=t,this.type=r,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ft="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class up{constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){const r=new zf;if(this.instancesDeferred.set(t,r),this.isInitialized(t)||this.shouldAutoInitialize())try{const i=this.getOrInitializeService({instanceIdentifier:t});i&&r.resolve(i)}catch{}}return this.instancesDeferred.get(t).promise}getImmediate(e){var t;const r=this.normalizeInstanceIdentifier(e?.identifier),i=(t=e?.optional)!==null&&t!==void 0?t:!1;if(this.isInitialized(r)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:r})}catch(s){if(i)return null;throw s}else{if(i)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(hp(e))try{this.getOrInitializeService({instanceIdentifier:Ft})}catch{}for(const[t,r]of this.instancesDeferred.entries()){const i=this.normalizeInstanceIdentifier(t);try{const s=this.getOrInitializeService({instanceIdentifier:i});r.resolve(s)}catch{}}}}clearInstance(e=Ft){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(t=>"INTERNAL"in t).map(t=>t.INTERNAL.delete()),...e.filter(t=>"_delete"in t).map(t=>t._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=Ft){return this.instances.has(e)}getOptions(e=Ft){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:t={}}=e,r=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(r))throw Error(`${this.name}(${r}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const i=this.getOrInitializeService({instanceIdentifier:r,options:t});for(const[s,a]of this.instancesDeferred.entries()){const c=this.normalizeInstanceIdentifier(s);r===c&&a.resolve(i)}return i}onInit(e,t){var r;const i=this.normalizeInstanceIdentifier(t),s=(r=this.onInitCallbacks.get(i))!==null&&r!==void 0?r:new Set;s.add(e),this.onInitCallbacks.set(i,s);const a=this.instances.get(i);return a&&e(a,i),()=>{s.delete(e)}}invokeOnInitCallbacks(e,t){const r=this.onInitCallbacks.get(t);if(r)for(const i of r)try{i(e,t)}catch{}}getOrInitializeService({instanceIdentifier:e,options:t={}}){let r=this.instances.get(e);if(!r&&this.component&&(r=this.component.instanceFactory(this.container,{instanceIdentifier:lp(e),options:t}),this.instances.set(e,r),this.instancesOptions.set(e,t),this.invokeOnInitCallbacks(r,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,r)}catch{}return r||null}normalizeInstanceIdentifier(e=Ft){return this.component?this.component.multipleInstances?e:Ft:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function lp(n){return n===Ft?void 0:n}function hp(n){return n.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dp{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const t=this.getProvider(e.name);if(t.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);t.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const t=new up(e,this);return this.providers.set(e,t),t}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var z;(function(n){n[n.DEBUG=0]="DEBUG",n[n.VERBOSE=1]="VERBOSE",n[n.INFO=2]="INFO",n[n.WARN=3]="WARN",n[n.ERROR=4]="ERROR",n[n.SILENT=5]="SILENT"})(z||(z={}));const fp={debug:z.DEBUG,verbose:z.VERBOSE,info:z.INFO,warn:z.WARN,error:z.ERROR,silent:z.SILENT},pp=z.INFO,mp={[z.DEBUG]:"log",[z.VERBOSE]:"log",[z.INFO]:"info",[z.WARN]:"warn",[z.ERROR]:"error"},gp=(n,e,...t)=>{if(e<n.logLevel)return;const r=new Date().toISOString(),i=mp[e];if(i)console[i](`[${r}]  ${n.name}:`,...t);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class Li{constructor(e){this.name=e,this._logLevel=pp,this._logHandler=gp,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in z))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?fp[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,z.DEBUG,...e),this._logHandler(this,z.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,z.VERBOSE,...e),this._logHandler(this,z.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,z.INFO,...e),this._logHandler(this,z.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,z.WARN,...e),this._logHandler(this,z.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,z.ERROR,...e),this._logHandler(this,z.ERROR,...e)}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _p{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(t=>{if(yp(t)){const r=t.getImmediate();return`${r.library}/${r.version}`}else return null}).filter(t=>t).join(" ")}}function yp(n){const e=n.getComponent();return e?.type==="VERSION"}const Ks="@firebase/app",Dc="0.10.16";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const lt=new Li("@firebase/app"),vp="@firebase/app-compat",Ep="@firebase/analytics-compat",Tp="@firebase/analytics",Ip="@firebase/app-check-compat",wp="@firebase/app-check",Ap="@firebase/auth",Rp="@firebase/auth-compat",bp="@firebase/database",Sp="@firebase/data-connect",Pp="@firebase/database-compat",Cp="@firebase/functions",kp="@firebase/functions-compat",Np="@firebase/installations",Dp="@firebase/installations-compat",Vp="@firebase/messaging",Op="@firebase/messaging-compat",Lp="@firebase/performance",Mp="@firebase/performance-compat",xp="@firebase/remote-config",Up="@firebase/remote-config-compat",Fp="@firebase/storage",Bp="@firebase/storage-compat",qp="@firebase/firestore",$p="@firebase/vertexai",jp="@firebase/firestore-compat",zp="firebase",Hp="11.0.2";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Qs="[DEFAULT]",Gp={[Ks]:"fire-core",[vp]:"fire-core-compat",[Tp]:"fire-analytics",[Ep]:"fire-analytics-compat",[wp]:"fire-app-check",[Ip]:"fire-app-check-compat",[Ap]:"fire-auth",[Rp]:"fire-auth-compat",[bp]:"fire-rtdb",[Sp]:"fire-data-connect",[Pp]:"fire-rtdb-compat",[Cp]:"fire-fn",[kp]:"fire-fn-compat",[Np]:"fire-iid",[Dp]:"fire-iid-compat",[Vp]:"fire-fcm",[Op]:"fire-fcm-compat",[Lp]:"fire-perf",[Mp]:"fire-perf-compat",[xp]:"fire-rc",[Up]:"fire-rc-compat",[Fp]:"fire-gcs",[Bp]:"fire-gcs-compat",[qp]:"fire-fst",[jp]:"fire-fst-compat",[$p]:"fire-vertex","fire-js":"fire-js",[zp]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const mi=new Map,Wp=new Map,Ys=new Map;function Vc(n,e){try{n.container.addComponent(e)}catch(t){lt.debug(`Component ${e.name} failed to register with FirebaseApp ${n.name}`,t)}}function ze(n){const e=n.name;if(Ys.has(e))return lt.debug(`There were multiple attempts to register component ${e}.`),!1;Ys.set(e,n);for(const t of mi.values())Vc(t,n);for(const t of Wp.values())Vc(t,n);return!0}function Dt(n,e){const t=n.container.getProvider("heartbeat").getImmediate({optional:!0});return t&&t.triggerHeartbeat(),n.container.getProvider(e)}function $e(n){return n.settings!==void 0}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Kp={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},Rt=new Xt("app","Firebase",Kp);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qp{constructor(e,t,r){this._isDeleted=!1,this._options=Object.assign({},e),this._config=Object.assign({},t),this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=r,this.container.addComponent(new Fe("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw Rt.create("app-deleted",{appName:this._name})}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Jt=Hp;function Yp(n,e={}){let t=n;typeof e!="object"&&(e={name:e});const r=Object.assign({name:Qs,automaticDataCollectionEnabled:!1},e),i=r.name;if(typeof i!="string"||!i)throw Rt.create("bad-app-name",{appName:String(i)});if(t||(t=ul()),!t)throw Rt.create("no-options");const s=mi.get(i);if(s){if(or(t,s.options)&&or(r,s.config))return s;throw Rt.create("duplicate-app",{appName:i})}const a=new dp(i);for(const l of Ys.values())a.addComponent(l);const c=new Qp(t,r,a);return mi.set(i,c),c}function Mi(n=Qs){const e=mi.get(n);if(!e&&n===Qs&&ul())return Yp();if(!e)throw Rt.create("no-app",{appName:n});return e}function Me(n,e,t){var r;let i=(r=Gp[n])!==null&&r!==void 0?r:n;t&&(i+=`-${t}`);const s=i.match(/\s|\//),a=e.match(/\s|\//);if(s||a){const c=[`Unable to register library "${i}" with version "${e}":`];s&&c.push(`library name "${i}" contains illegal characters (whitespace or "/")`),s&&a&&c.push("and"),a&&c.push(`version name "${e}" contains illegal characters (whitespace or "/")`),lt.warn(c.join(" "));return}ze(new Fe(`${i}-version`,()=>({library:i,version:e}),"VERSION"))}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Xp="firebase-heartbeat-database",Jp=1,ar="firebase-heartbeat-store";let Ls=null;function ml(){return Ls||(Ls=rl(Xp,Jp,{upgrade:(n,e)=>{switch(e){case 0:try{n.createObjectStore(ar)}catch(t){console.warn(t)}}}}).catch(n=>{throw Rt.create("idb-open",{originalErrorMessage:n.message})})),Ls}async function Zp(n){try{const t=(await ml()).transaction(ar),r=await t.objectStore(ar).get(gl(n));return await t.done,r}catch(e){if(e instanceof Be)lt.warn(e.message);else{const t=Rt.create("idb-get",{originalErrorMessage:e?.message});lt.warn(t.message)}}}async function Oc(n,e){try{const r=(await ml()).transaction(ar,"readwrite");await r.objectStore(ar).put(e,gl(n)),await r.done}catch(t){if(t instanceof Be)lt.warn(t.message);else{const r=Rt.create("idb-set",{originalErrorMessage:t?.message});lt.warn(r.message)}}}function gl(n){return`${n.name}!${n.options.appId}`}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const em=1024,tm=30*24*60*60*1e3;class nm{constructor(e){this.container=e,this._heartbeatsCache=null;const t=this.container.getProvider("app").getImmediate();this._storage=new im(t),this._heartbeatsCachePromise=this._storage.read().then(r=>(this._heartbeatsCache=r,r))}async triggerHeartbeat(){var e,t;try{const i=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),s=Lc();return((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((t=this._heartbeatsCache)===null||t===void 0?void 0:t.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===s||this._heartbeatsCache.heartbeats.some(a=>a.date===s)?void 0:(this._heartbeatsCache.heartbeats.push({date:s,agent:i}),this._heartbeatsCache.heartbeats=this._heartbeatsCache.heartbeats.filter(a=>{const c=new Date(a.date).valueOf();return Date.now()-c<=tm}),this._storage.overwrite(this._heartbeatsCache))}catch(r){lt.warn(r)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const t=Lc(),{heartbeatsToSend:r,unsentEntries:i}=rm(this._heartbeatsCache.heartbeats),s=pi(JSON.stringify({version:2,heartbeats:r}));return this._heartbeatsCache.lastSentHeartbeatDate=t,i.length>0?(this._heartbeatsCache.heartbeats=i,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),s}catch(t){return lt.warn(t),""}}}function Lc(){return new Date().toISOString().substring(0,10)}function rm(n,e=em){const t=[];let r=n.slice();for(const i of n){const s=t.find(a=>a.agent===i.agent);if(s){if(s.dates.push(i.date),Mc(t)>e){s.dates.pop();break}}else if(t.push({agent:i.agent,dates:[i.date]}),Mc(t)>e){t.pop();break}r=r.slice(1)}return{heartbeatsToSend:t,unsentEntries:r}}class im{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return fl()?pl().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const t=await Zp(this.app);return t?.heartbeats?t:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){var t;if(await this._canUseIndexedDBPromise){const i=await this.read();return Oc(this.app,{lastSentHeartbeatDate:(t=e.lastSentHeartbeatDate)!==null&&t!==void 0?t:i.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){var t;if(await this._canUseIndexedDBPromise){const i=await this.read();return Oc(this.app,{lastSentHeartbeatDate:(t=e.lastSentHeartbeatDate)!==null&&t!==void 0?t:i.lastSentHeartbeatDate,heartbeats:[...i.heartbeats,...e.heartbeats]})}else return}}function Mc(n){return pi(JSON.stringify({version:2,heartbeats:n})).length}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function sm(n){ze(new Fe("platform-logger",e=>new _p(e),"PRIVATE")),ze(new Fe("heartbeat",e=>new nm(e),"PRIVATE")),Me(Ks,Dc,n),Me(Ks,Dc,"esm2017"),Me("fire-js","")}sm("");function _l(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const om=_l,yl=new Xt("auth","Firebase",_l());/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const gi=new Li("@firebase/auth");function am(n,...e){gi.logLevel<=z.WARN&&gi.warn(`Auth (${Jt}): ${n}`,...e)}function ii(n,...e){gi.logLevel<=z.ERROR&&gi.error(`Auth (${Jt}): ${n}`,...e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ue(n,...e){throw Eo(n,...e)}function je(n,...e){return Eo(n,...e)}function vo(n,e,t){const r=Object.assign(Object.assign({},om()),{[e]:t});return new Xt("auth","Firebase",r).create(e,{appName:n.name})}function ct(n){return vo(n,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function cm(n,e,t){const r=t;if(!(e instanceof r))throw r.name!==e.constructor.name&&Ue(n,"argument-error"),vo(n,"argument-error",`Type of ${e.constructor.name} does not match expected instance.Did you pass a reference from a different Auth SDK?`)}function Eo(n,...e){if(typeof n!="string"){const t=e[0],r=[...e.slice(1)];return r[0]&&(r[0].appName=n.name),n._errorFactory.create(t,...r)}return yl.create(n,...e)}function M(n,e,...t){if(!n)throw Eo(e,...t)}function st(n){const e="INTERNAL ASSERTION FAILED: "+n;throw ii(e),new Error(e)}function ht(n,e){n||st(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Xs(){var n;return typeof self<"u"&&((n=self.location)===null||n===void 0?void 0:n.href)||""}function um(){return xc()==="http:"||xc()==="https:"}function xc(){var n;return typeof self<"u"&&((n=self.location)===null||n===void 0?void 0:n.protocol)||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function lm(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(um()||dl()||"connection"in navigator)?navigator.onLine:!0}function hm(){if(typeof navigator>"u")return null;const n=navigator;return n.languages&&n.languages[0]||n.language||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vr{constructor(e,t){this.shortDelay=e,this.longDelay=t,ht(t>e,"Short delay should be less than long delay!"),this.isMobile=Hf()||Kf()}get(){return lm()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function To(n,e){ht(n.emulator,"Emulator should always be set here");const{url:t}=n.emulator;return e?`${t}${e.startsWith("/")?e.slice(1):e}`:t}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vl{static initialize(e,t,r){this.fetchImpl=e,t&&(this.headersImpl=t),r&&(this.responseImpl=r)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;st("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;st("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;st("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const dm={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const fm=new vr(3e4,6e4);function Je(n,e){return n.tenantId&&!e.tenantId?Object.assign(Object.assign({},e),{tenantId:n.tenantId}):e}async function Ze(n,e,t,r,i={}){return El(n,i,async()=>{let s={},a={};r&&(e==="GET"?a=r:s={body:JSON.stringify(r)});const c=yr(Object.assign({key:n.config.apiKey},a)).slice(1),l=await n._getAdditionalHeaders();l["Content-Type"]="application/json",n.languageCode&&(l["X-Firebase-Locale"]=n.languageCode);const d=Object.assign({method:e,headers:l},s);return Wf()||(d.referrerPolicy="no-referrer"),vl.fetch()(Tl(n,n.config.apiHost,t,c),d)})}async function El(n,e,t){n._canInitEmulator=!1;const r=Object.assign(Object.assign({},dm),e);try{const i=new mm(n),s=await Promise.race([t(),i.promise]);i.clearNetworkTimeout();const a=await s.json();if("needConfirmation"in a)throw Yr(n,"account-exists-with-different-credential",a);if(s.ok&&!("errorMessage"in a))return a;{const c=s.ok?a.errorMessage:a.error.message,[l,d]=c.split(" : ");if(l==="FEDERATED_USER_ID_ALREADY_LINKED")throw Yr(n,"credential-already-in-use",a);if(l==="EMAIL_EXISTS")throw Yr(n,"email-already-in-use",a);if(l==="USER_DISABLED")throw Yr(n,"user-disabled",a);const p=r[l]||l.toLowerCase().replace(/[_\s]+/g,"-");if(d)throw vo(n,p,d);Ue(n,p)}}catch(i){if(i instanceof Be)throw i;Ue(n,"network-request-failed",{message:String(i)})}}async function Er(n,e,t,r,i={}){const s=await Ze(n,e,t,r,i);return"mfaPendingCredential"in s&&Ue(n,"multi-factor-auth-required",{_serverResponse:s}),s}function Tl(n,e,t,r){const i=`${e}${t}?${r}`;return n.config.emulator?To(n.config,i):`${n.config.apiScheme}://${i}`}function pm(n){switch(n){case"ENFORCE":return"ENFORCE";case"AUDIT":return"AUDIT";case"OFF":return"OFF";default:return"ENFORCEMENT_STATE_UNSPECIFIED"}}class mm{clearNetworkTimeout(){clearTimeout(this.timer)}constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((t,r)=>{this.timer=setTimeout(()=>r(je(this.auth,"network-request-failed")),fm.get())})}}function Yr(n,e,t){const r={appName:n.name};t.email&&(r.email=t.email),t.phoneNumber&&(r.phoneNumber=t.phoneNumber);const i=je(n,e,r);return i.customData._tokenResponse=t,i}function Uc(n){return n!==void 0&&n.enterprise!==void 0}class gm{constructor(e){if(this.siteKey="",this.recaptchaEnforcementState=[],e.recaptchaKey===void 0)throw new Error("recaptchaKey undefined");this.siteKey=e.recaptchaKey.split("/")[3],this.recaptchaEnforcementState=e.recaptchaEnforcementState}getProviderEnforcementState(e){if(!this.recaptchaEnforcementState||this.recaptchaEnforcementState.length===0)return null;for(const t of this.recaptchaEnforcementState)if(t.provider&&t.provider===e)return pm(t.enforcementState);return null}isProviderEnabled(e){return this.getProviderEnforcementState(e)==="ENFORCE"||this.getProviderEnforcementState(e)==="AUDIT"}isAnyProviderEnabled(){return this.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")||this.isProviderEnabled("PHONE_PROVIDER")}}async function _m(n,e){return Ze(n,"GET","/v2/recaptchaConfig",Je(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ym(n,e){return Ze(n,"POST","/v1/accounts:delete",e)}async function Il(n,e){return Ze(n,"POST","/v1/accounts:lookup",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function er(n){if(n)try{const e=new Date(Number(n));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function vm(n,e=!1){const t=Q(n),r=await t.getIdToken(e),i=Io(r);M(i&&i.exp&&i.auth_time&&i.iat,t.auth,"internal-error");const s=typeof i.firebase=="object"?i.firebase:void 0,a=s?.sign_in_provider;return{claims:i,token:r,authTime:er(Ms(i.auth_time)),issuedAtTime:er(Ms(i.iat)),expirationTime:er(Ms(i.exp)),signInProvider:a||null,signInSecondFactor:s?.sign_in_second_factor||null}}function Ms(n){return Number(n)*1e3}function Io(n){const[e,t,r]=n.split(".");if(e===void 0||t===void 0||r===void 0)return ii("JWT malformed, contained fewer than 3 sections"),null;try{const i=ol(t);return i?JSON.parse(i):(ii("Failed to decode base64 JWT payload"),null)}catch(i){return ii("Caught error parsing JWT payload as JSON",i?.toString()),null}}function Fc(n){const e=Io(n);return M(e,"internal-error"),M(typeof e.exp<"u","internal-error"),M(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function cr(n,e,t=!1){if(t)return e;try{return await e}catch(r){throw r instanceof Be&&Em(r)&&n.auth.currentUser===n&&await n.auth.signOut(),r}}function Em({code:n}){return n==="auth/user-disabled"||n==="auth/user-token-expired"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Tm{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){var t;if(e){const r=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),r}else{this.errorBackoff=3e4;const i=((t=this.user.stsTokenManager.expirationTime)!==null&&t!==void 0?t:0)-Date.now()-3e5;return Math.max(0,i)}}schedule(e=!1){if(!this.isRunning)return;const t=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},t)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){e?.code==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Js{constructor(e,t){this.createdAt=e,this.lastLoginAt=t,this._initializeTime()}_initializeTime(){this.lastSignInTime=er(this.lastLoginAt),this.creationTime=er(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function _i(n){var e;const t=n.auth,r=await n.getIdToken(),i=await cr(n,Il(t,{idToken:r}));M(i?.users.length,t,"internal-error");const s=i.users[0];n._notifyReloadListener(s);const a=!((e=s.providerUserInfo)===null||e===void 0)&&e.length?wl(s.providerUserInfo):[],c=wm(n.providerData,a),l=n.isAnonymous,d=!(n.email&&s.passwordHash)&&!c?.length,p=l?d:!1,g={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:c,metadata:new Js(s.createdAt,s.lastLoginAt),isAnonymous:p};Object.assign(n,g)}async function Im(n){const e=Q(n);await _i(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function wm(n,e){return[...n.filter(r=>!e.some(i=>i.providerId===r.providerId)),...e]}function wl(n){return n.map(e=>{var{providerId:t}=e,r=yo(e,["providerId"]);return{providerId:t,uid:r.rawId||"",displayName:r.displayName||null,email:r.email||null,phoneNumber:r.phoneNumber||null,photoURL:r.photoUrl||null}})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Am(n,e){const t=await El(n,{},async()=>{const r=yr({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:i,apiKey:s}=n.config,a=Tl(n,i,"/v1/token",`key=${s}`),c=await n._getAdditionalHeaders();return c["Content-Type"]="application/x-www-form-urlencoded",vl.fetch()(a,{method:"POST",headers:c,body:r})});return{accessToken:t.access_token,expiresIn:t.expires_in,refreshToken:t.refresh_token}}async function Rm(n,e){return Ze(n,"POST","/v2/accounts:revokeToken",Je(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hn{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){M(e.idToken,"internal-error"),M(typeof e.idToken<"u","internal-error"),M(typeof e.refreshToken<"u","internal-error");const t="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):Fc(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,t)}updateFromIdToken(e){M(e.length!==0,"internal-error");const t=Fc(e);this.updateTokensAndExpiration(e,null,t)}async getToken(e,t=!1){return!t&&this.accessToken&&!this.isExpired?this.accessToken:(M(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,t){const{accessToken:r,refreshToken:i,expiresIn:s}=await Am(e,t);this.updateTokensAndExpiration(r,i,Number(s))}updateTokensAndExpiration(e,t,r){this.refreshToken=t||null,this.accessToken=e||null,this.expirationTime=Date.now()+r*1e3}static fromJSON(e,t){const{refreshToken:r,accessToken:i,expirationTime:s}=t,a=new hn;return r&&(M(typeof r=="string","internal-error",{appName:e}),a.refreshToken=r),i&&(M(typeof i=="string","internal-error",{appName:e}),a.accessToken=i),s&&(M(typeof s=="number","internal-error",{appName:e}),a.expirationTime=s),a}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new hn,this.toJSON())}_performRefresh(){return st("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function yt(n,e){M(typeof n=="string"||typeof n>"u","internal-error",{appName:e})}class ot{constructor(e){var{uid:t,auth:r,stsTokenManager:i}=e,s=yo(e,["uid","auth","stsTokenManager"]);this.providerId="firebase",this.proactiveRefresh=new Tm(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=t,this.auth=r,this.stsTokenManager=i,this.accessToken=i.accessToken,this.displayName=s.displayName||null,this.email=s.email||null,this.emailVerified=s.emailVerified||!1,this.phoneNumber=s.phoneNumber||null,this.photoURL=s.photoURL||null,this.isAnonymous=s.isAnonymous||!1,this.tenantId=s.tenantId||null,this.providerData=s.providerData?[...s.providerData]:[],this.metadata=new Js(s.createdAt||void 0,s.lastLoginAt||void 0)}async getIdToken(e){const t=await cr(this,this.stsTokenManager.getToken(this.auth,e));return M(t,this.auth,"internal-error"),this.accessToken!==t&&(this.accessToken=t,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),t}getIdTokenResult(e){return vm(this,e)}reload(){return Im(this)}_assign(e){this!==e&&(M(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(t=>Object.assign({},t)),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const t=new ot(Object.assign(Object.assign({},this),{auth:e,stsTokenManager:this.stsTokenManager._clone()}));return t.metadata._copy(this.metadata),t}_onReload(e){M(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,t=!1){let r=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),r=!0),t&&await _i(this),await this.auth._persistUserIfCurrent(this),r&&this.auth._notifyListenersIfCurrent(this)}async delete(){if($e(this.auth.app))return Promise.reject(ct(this.auth));const e=await this.getIdToken();return await cr(this,ym(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return Object.assign(Object.assign({uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>Object.assign({},e)),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId},this.metadata.toJSON()),{apiKey:this.auth.config.apiKey,appName:this.auth.name})}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,t){var r,i,s,a,c,l,d,p;const g=(r=t.displayName)!==null&&r!==void 0?r:void 0,E=(i=t.email)!==null&&i!==void 0?i:void 0,R=(s=t.phoneNumber)!==null&&s!==void 0?s:void 0,k=(a=t.photoURL)!==null&&a!==void 0?a:void 0,V=(c=t.tenantId)!==null&&c!==void 0?c:void 0,C=(l=t._redirectEventId)!==null&&l!==void 0?l:void 0,B=(d=t.createdAt)!==null&&d!==void 0?d:void 0,$=(p=t.lastLoginAt)!==null&&p!==void 0?p:void 0,{uid:q,emailVerified:j,isAnonymous:he,providerData:Z,stsTokenManager:T}=t;M(q&&T,e,"internal-error");const m=hn.fromJSON(this.name,T);M(typeof q=="string",e,"internal-error"),yt(g,e.name),yt(E,e.name),M(typeof j=="boolean",e,"internal-error"),M(typeof he=="boolean",e,"internal-error"),yt(R,e.name),yt(k,e.name),yt(V,e.name),yt(C,e.name),yt(B,e.name),yt($,e.name);const y=new ot({uid:q,auth:e,email:E,emailVerified:j,displayName:g,isAnonymous:he,photoURL:k,phoneNumber:R,tenantId:V,stsTokenManager:m,createdAt:B,lastLoginAt:$});return Z&&Array.isArray(Z)&&(y.providerData=Z.map(v=>Object.assign({},v))),C&&(y._redirectEventId=C),y}static async _fromIdTokenResponse(e,t,r=!1){const i=new hn;i.updateFromServerResponse(t);const s=new ot({uid:t.localId,auth:e,stsTokenManager:i,isAnonymous:r});return await _i(s),s}static async _fromGetAccountInfoResponse(e,t,r){const i=t.users[0];M(i.localId!==void 0,"internal-error");const s=i.providerUserInfo!==void 0?wl(i.providerUserInfo):[],a=!(i.email&&i.passwordHash)&&!s?.length,c=new hn;c.updateFromIdToken(r);const l=new ot({uid:i.localId,auth:e,stsTokenManager:c,isAnonymous:a}),d={uid:i.localId,displayName:i.displayName||null,photoURL:i.photoUrl||null,email:i.email||null,emailVerified:i.emailVerified||!1,phoneNumber:i.phoneNumber||null,tenantId:i.tenantId||null,providerData:s,metadata:new Js(i.createdAt,i.lastLoginAt),isAnonymous:!(i.email&&i.passwordHash)&&!s?.length};return Object.assign(l,d),l}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Bc=new Map;function at(n){ht(n instanceof Function,"Expected a class definition");let e=Bc.get(n);return e?(ht(e instanceof n,"Instance stored in cache mismatched with class"),e):(e=new n,Bc.set(n,e),e)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Al{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,t){this.storage[e]=t}async _get(e){const t=this.storage[e];return t===void 0?null:t}async _remove(e){delete this.storage[e]}_addListener(e,t){}_removeListener(e,t){}}Al.type="NONE";const qc=Al;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function si(n,e,t){return`firebase:${n}:${e}:${t}`}class dn{constructor(e,t,r){this.persistence=e,this.auth=t,this.userKey=r;const{config:i,name:s}=this.auth;this.fullUserKey=si(this.userKey,i.apiKey,s),this.fullPersistenceKey=si("persistence",i.apiKey,s),this.boundEventHandler=t._onStorageEvent.bind(t),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);return e?ot._fromJSON(this.auth,e):null}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const t=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,t)return this.setCurrentUser(t)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,t,r="authUser"){if(!t.length)return new dn(at(qc),e,r);const i=(await Promise.all(t.map(async d=>{if(await d._isAvailable())return d}))).filter(d=>d);let s=i[0]||at(qc);const a=si(r,e.config.apiKey,e.name);let c=null;for(const d of t)try{const p=await d._get(a);if(p){const g=ot._fromJSON(e,p);d!==s&&(c=g),s=d;break}}catch{}const l=i.filter(d=>d._shouldAllowMigration);return!s._shouldAllowMigration||!l.length?new dn(s,e,r):(s=l[0],c&&await s._set(a,c.toJSON()),await Promise.all(t.map(async d=>{if(d!==s)try{await d._remove(a)}catch{}})),new dn(s,e,r))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function $c(n){const e=n.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(Pl(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(Rl(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(kl(e))return"Blackberry";if(Nl(e))return"Webos";if(bl(e))return"Safari";if((e.includes("chrome/")||Sl(e))&&!e.includes("edge/"))return"Chrome";if(Cl(e))return"Android";{const t=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,r=n.match(t);if(r?.length===2)return r[1]}return"Other"}function Rl(n=Ae()){return/firefox\//i.test(n)}function bl(n=Ae()){const e=n.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function Sl(n=Ae()){return/crios\//i.test(n)}function Pl(n=Ae()){return/iemobile/i.test(n)}function Cl(n=Ae()){return/android/i.test(n)}function kl(n=Ae()){return/blackberry/i.test(n)}function Nl(n=Ae()){return/webos/i.test(n)}function wo(n=Ae()){return/iphone|ipad|ipod/i.test(n)||/macintosh/i.test(n)&&/mobile/i.test(n)}function bm(n=Ae()){var e;return wo(n)&&!!(!((e=window.navigator)===null||e===void 0)&&e.standalone)}function Sm(){return Qf()&&document.documentMode===10}function Dl(n=Ae()){return wo(n)||Cl(n)||Nl(n)||kl(n)||/windows phone/i.test(n)||Pl(n)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Vl(n,e=[]){let t;switch(n){case"Browser":t=$c(Ae());break;case"Worker":t=`${$c(Ae())}-${n}`;break;default:t=n}const r=e.length?e.join(","):"FirebaseCore-web";return`${t}/JsCore/${Jt}/${r}`}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pm{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,t){const r=s=>new Promise((a,c)=>{try{const l=e(s);a(l)}catch(l){c(l)}});r.onAbort=t,this.queue.push(r);const i=this.queue.length-1;return()=>{this.queue[i]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const t=[];try{for(const r of this.queue)await r(e),r.onAbort&&t.push(r.onAbort)}catch(r){t.reverse();for(const i of t)try{i()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:r?.message})}}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Cm(n,e={}){return Ze(n,"GET","/v2/passwordPolicy",Je(n,e))}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const km=6;class Nm{constructor(e){var t,r,i,s;const a=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=(t=a.minPasswordLength)!==null&&t!==void 0?t:km,a.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=a.maxPasswordLength),a.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=a.containsLowercaseCharacter),a.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=a.containsUppercaseCharacter),a.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=a.containsNumericCharacter),a.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=a.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=(i=(r=e.allowedNonAlphanumericCharacters)===null||r===void 0?void 0:r.join(""))!==null&&i!==void 0?i:"",this.forceUpgradeOnSignin=(s=e.forceUpgradeOnSignin)!==null&&s!==void 0?s:!1,this.schemaVersion=e.schemaVersion}validatePassword(e){var t,r,i,s,a,c;const l={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,l),this.validatePasswordCharacterOptions(e,l),l.isValid&&(l.isValid=(t=l.meetsMinPasswordLength)!==null&&t!==void 0?t:!0),l.isValid&&(l.isValid=(r=l.meetsMaxPasswordLength)!==null&&r!==void 0?r:!0),l.isValid&&(l.isValid=(i=l.containsLowercaseLetter)!==null&&i!==void 0?i:!0),l.isValid&&(l.isValid=(s=l.containsUppercaseLetter)!==null&&s!==void 0?s:!0),l.isValid&&(l.isValid=(a=l.containsNumericCharacter)!==null&&a!==void 0?a:!0),l.isValid&&(l.isValid=(c=l.containsNonAlphanumericCharacter)!==null&&c!==void 0?c:!0),l}validatePasswordLengthOptions(e,t){const r=this.customStrengthOptions.minPasswordLength,i=this.customStrengthOptions.maxPasswordLength;r&&(t.meetsMinPasswordLength=e.length>=r),i&&(t.meetsMaxPasswordLength=e.length<=i)}validatePasswordCharacterOptions(e,t){this.updatePasswordCharacterOptionsStatuses(t,!1,!1,!1,!1);let r;for(let i=0;i<e.length;i++)r=e.charAt(i),this.updatePasswordCharacterOptionsStatuses(t,r>="a"&&r<="z",r>="A"&&r<="Z",r>="0"&&r<="9",this.allowedNonAlphanumericCharacters.includes(r))}updatePasswordCharacterOptionsStatuses(e,t,r,i,s){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=t)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=r)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=i)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=s))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Dm{constructor(e,t,r,i){this.app=e,this.heartbeatServiceProvider=t,this.appCheckServiceProvider=r,this.config=i,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new jc(this),this.idTokenSubscription=new jc(this),this.beforeStateQueue=new Pm(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=yl,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=i.sdkClientVersion}_initializeWithPersistence(e,t){return t&&(this._popupRedirectResolver=at(t)),this._initializationPromise=this.queue(async()=>{var r,i;if(!this._deleted&&(this.persistenceManager=await dn.create(this,e),!this._deleted)){if(!((r=this._popupRedirectResolver)===null||r===void 0)&&r._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(t),this.lastNotifiedUid=((i=this.currentUser)===null||i===void 0?void 0:i.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const t=await Il(this,{idToken:e}),r=await ot._fromGetAccountInfoResponse(this,t,e);await this.directlySetCurrentUser(r)}catch(t){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",t),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var t;if($e(this.app)){const a=this.app.settings.authIdToken;return a?new Promise(c=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(a).then(c,c))}):this.directlySetCurrentUser(null)}const r=await this.assertedPersistence.getCurrentUser();let i=r,s=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const a=(t=this.redirectUser)===null||t===void 0?void 0:t._redirectEventId,c=i?._redirectEventId,l=await this.tryRedirectSignIn(e);(!a||a===c)&&l?.user&&(i=l.user,s=!0)}if(!i)return this.directlySetCurrentUser(null);if(!i._redirectEventId){if(s)try{await this.beforeStateQueue.runMiddleware(i)}catch(a){i=r,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(a))}return i?this.reloadAndSetCurrentUserOrClear(i):this.directlySetCurrentUser(null)}return M(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===i._redirectEventId?this.directlySetCurrentUser(i):this.reloadAndSetCurrentUserOrClear(i)}async tryRedirectSignIn(e){let t=null;try{t=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return t}async reloadAndSetCurrentUserOrClear(e){try{await _i(e)}catch(t){if(t?.code!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=hm()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if($e(this.app))return Promise.reject(ct(this));const t=e?Q(e):null;return t&&M(t.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(t&&t._clone(this))}async _updateCurrentUser(e,t=!1){if(!this._deleted)return e&&M(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),t||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return $e(this.app)?Promise.reject(ct(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return $e(this.app)?Promise.reject(ct(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(at(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const t=this._getPasswordPolicyInternal();return t.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):t.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await Cm(this),t=new Nm(e);this.tenantId===null?this._projectPasswordPolicy=t:this._tenantPasswordPolicies[this.tenantId]=t}_getPersistence(){return this.assertedPersistence.persistence.type}_updateErrorMap(e){this._errorFactory=new Xt("auth","Firebase",e())}onAuthStateChanged(e,t,r){return this.registerStateListener(this.authStateSubscription,e,t,r)}beforeAuthStateChanged(e,t){return this.beforeStateQueue.pushCallback(e,t)}onIdTokenChanged(e,t,r){return this.registerStateListener(this.idTokenSubscription,e,t,r)}authStateReady(){return new Promise((e,t)=>{if(this.currentUser)e();else{const r=this.onAuthStateChanged(()=>{r(),e()},t)}})}async revokeAccessToken(e){if(this.currentUser){const t=await this.currentUser.getIdToken(),r={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:t};this.tenantId!=null&&(r.tenantId=this.tenantId),await Rm(this,r)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)===null||e===void 0?void 0:e.toJSON()}}async _setRedirectUser(e,t){const r=await this.getOrInitRedirectPersistenceManager(t);return e===null?r.removeCurrentUser():r.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const t=e&&at(e)||this._popupRedirectResolver;M(t,this,"argument-error"),this.redirectPersistenceManager=await dn.create(this,[at(t._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var t,r;return this._isInitialized&&await this.queue(async()=>{}),((t=this._currentUser)===null||t===void 0?void 0:t._redirectEventId)===e?this._currentUser:((r=this.redirectUser)===null||r===void 0?void 0:r._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var e,t;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const r=(t=(e=this.currentUser)===null||e===void 0?void 0:e.uid)!==null&&t!==void 0?t:null;this.lastNotifiedUid!==r&&(this.lastNotifiedUid=r,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,t,r,i){if(this._deleted)return()=>{};const s=typeof t=="function"?t:t.next.bind(t);let a=!1;const c=this._isInitialized?Promise.resolve():this._initializationPromise;if(M(c,this,"internal-error"),c.then(()=>{a||s(this.currentUser)}),typeof t=="function"){const l=e.addObserver(t,r,i);return()=>{a=!0,l()}}else{const l=e.addObserver(t);return()=>{a=!0,l()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return M(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=Vl(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var e;const t={"X-Client-Version":this.clientVersion};this.app.options.appId&&(t["X-Firebase-gmpid"]=this.app.options.appId);const r=await((e=this.heartbeatServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getHeartbeatsHeader());r&&(t["X-Firebase-Client"]=r);const i=await this._getAppCheckToken();return i&&(t["X-Firebase-AppCheck"]=i),t}async _getAppCheckToken(){var e;const t=await((e=this.appCheckServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getToken());return t?.error&&am(`Error while retrieving App Check token: ${t.error}`),t?.token}}function et(n){return Q(n)}class jc{constructor(e){this.auth=e,this.observer=null,this.addObserver=np(t=>this.observer=t)}get next(){return M(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let xi={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function Vm(n){xi=n}function Ol(n){return xi.loadJS(n)}function Om(){return xi.recaptchaEnterpriseScript}function Lm(){return xi.gapiScript}function Mm(n){return`__${n}${Math.floor(Math.random()*1e6)}`}class xm{constructor(){this.enterprise=new Um}ready(e){e()}execute(e,t){return Promise.resolve("token")}render(e,t){return""}}class Um{ready(e){e()}execute(e,t){return Promise.resolve("token")}render(e,t){return""}}const Fm="recaptcha-enterprise",Ll="NO_RECAPTCHA";class Bm{constructor(e){this.type=Fm,this.auth=et(e)}async verify(e="verify",t=!1){async function r(s){if(!t){if(s.tenantId==null&&s._agentRecaptchaConfig!=null)return s._agentRecaptchaConfig.siteKey;if(s.tenantId!=null&&s._tenantRecaptchaConfigs[s.tenantId]!==void 0)return s._tenantRecaptchaConfigs[s.tenantId].siteKey}return new Promise(async(a,c)=>{_m(s,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}).then(l=>{if(l.recaptchaKey===void 0)c(new Error("recaptcha Enterprise site key undefined"));else{const d=new gm(l);return s.tenantId==null?s._agentRecaptchaConfig=d:s._tenantRecaptchaConfigs[s.tenantId]=d,a(d.siteKey)}}).catch(l=>{c(l)})})}function i(s,a,c){const l=window.grecaptcha;Uc(l)?l.enterprise.ready(()=>{l.enterprise.execute(s,{action:e}).then(d=>{a(d)}).catch(()=>{a(Ll)})}):c(Error("No reCAPTCHA enterprise script loaded."))}return this.auth.settings.appVerificationDisabledForTesting?new xm().execute("siteKey",{action:"verify"}):new Promise((s,a)=>{r(this.auth).then(c=>{if(!t&&Uc(window.grecaptcha))i(c,s,a);else{if(typeof window>"u"){a(new Error("RecaptchaVerifier is only supported in browser"));return}let l=Om();l.length!==0&&(l+=c),Ol(l).then(()=>{i(c,s,a)}).catch(d=>{a(d)})}}).catch(c=>{a(c)})})}}async function zc(n,e,t,r=!1,i=!1){const s=new Bm(n);let a;if(i)a=Ll;else try{a=await s.verify(t)}catch{a=await s.verify(t,!0)}const c=Object.assign({},e);if(t==="mfaSmsEnrollment"||t==="mfaSmsSignIn"){if("phoneEnrollmentInfo"in c){const l=c.phoneEnrollmentInfo.phoneNumber,d=c.phoneEnrollmentInfo.recaptchaToken;Object.assign(c,{phoneEnrollmentInfo:{phoneNumber:l,recaptchaToken:d,captchaResponse:a,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}else if("phoneSignInInfo"in c){const l=c.phoneSignInInfo.recaptchaToken;Object.assign(c,{phoneSignInInfo:{recaptchaToken:l,captchaResponse:a,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}return c}return r?Object.assign(c,{captchaResp:a}):Object.assign(c,{captchaResponse:a}),Object.assign(c,{clientType:"CLIENT_TYPE_WEB"}),Object.assign(c,{recaptchaVersion:"RECAPTCHA_ENTERPRISE"}),c}async function yi(n,e,t,r,i){var s;if(!((s=n._getRecaptchaConfig())===null||s===void 0)&&s.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")){const a=await zc(n,e,t,t==="getOobCode");return r(n,a)}else return r(n,e).catch(async a=>{if(a.code==="auth/missing-recaptcha-token"){console.log(`${t} is protected by reCAPTCHA Enterprise for this project. Automatically triggering the reCAPTCHA flow and restarting the flow.`);const c=await zc(n,e,t,t==="getOobCode");return r(n,c)}else return Promise.reject(a)})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function qm(n,e){const t=Dt(n,"auth");if(t.isInitialized()){const i=t.getImmediate(),s=t.getOptions();if(or(s,e??{}))return i;Ue(i,"already-initialized")}return t.initialize({options:e})}function $m(n,e){const t=e?.persistence||[],r=(Array.isArray(t)?t:[t]).map(at);e?.errorMap&&n._updateErrorMap(e.errorMap),n._initializeWithPersistence(r,e?.popupRedirectResolver)}function jm(n,e,t){const r=et(n);M(r._canInitEmulator,r,"emulator-config-failed"),M(/^https?:\/\//.test(e),r,"invalid-emulator-scheme");const i=!1,s=Ml(e),{host:a,port:c}=zm(e),l=c===null?"":`:${c}`;r.config.emulator={url:`${s}//${a}${l}/`},r.settings.appVerificationDisabledForTesting=!0,r.emulatorConfig=Object.freeze({host:a,port:c,protocol:s.replace(":",""),options:Object.freeze({disableWarnings:i})}),Hm()}function Ml(n){const e=n.indexOf(":");return e<0?"":n.substr(0,e+1)}function zm(n){const e=Ml(n),t=/(\/\/)?([^?#/]+)/.exec(n.substr(e.length));if(!t)return{host:"",port:null};const r=t[2].split("@").pop()||"",i=/^(\[[^\]]+\])(:|$)/.exec(r);if(i){const s=i[1];return{host:s,port:Hc(r.substr(s.length+1))}}else{const[s,a]=r.split(":");return{host:s,port:Hc(a)}}}function Hc(n){if(!n)return null;const e=Number(n);return isNaN(e)?null:e}function Hm(){function n(){const e=document.createElement("p"),t=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",t.position="fixed",t.width="100%",t.backgroundColor="#ffffff",t.border=".1em solid #000000",t.color="#b50000",t.bottom="0px",t.left="0px",t.margin="0px",t.zIndex="10000",t.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",n):n())}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ao{constructor(e,t){this.providerId=e,this.signInMethod=t}toJSON(){return st("not implemented")}_getIdTokenResponse(e){return st("not implemented")}_linkToIdToken(e,t){return st("not implemented")}_getReauthenticationResolver(e){return st("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function xl(n,e){return Ze(n,"POST","/v1/accounts:resetPassword",Je(n,e))}async function Gm(n,e){return Ze(n,"POST","/v1/accounts:signUp",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Wm(n,e){return Er(n,"POST","/v1/accounts:signInWithPassword",Je(n,e))}async function Km(n,e){return Ze(n,"POST","/v1/accounts:sendOobCode",Je(n,e))}async function Qm(n,e){return Km(n,e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Ym(n,e){return Er(n,"POST","/v1/accounts:signInWithEmailLink",Je(n,e))}async function Xm(n,e){return Er(n,"POST","/v1/accounts:signInWithEmailLink",Je(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ur extends Ao{constructor(e,t,r,i=null){super("password",r),this._email=e,this._password=t,this._tenantId=i}static _fromEmailAndPassword(e,t){return new ur(e,t,"password")}static _fromEmailAndCode(e,t,r=null){return new ur(e,t,"emailLink",r)}toJSON(){return{email:this._email,password:this._password,signInMethod:this.signInMethod,tenantId:this._tenantId}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e;if(t?.email&&t?.password){if(t.signInMethod==="password")return this._fromEmailAndPassword(t.email,t.password);if(t.signInMethod==="emailLink")return this._fromEmailAndCode(t.email,t.password,t.tenantId)}return null}async _getIdTokenResponse(e){switch(this.signInMethod){case"password":const t={returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return yi(e,t,"signInWithPassword",Wm);case"emailLink":return Ym(e,{email:this._email,oobCode:this._password});default:Ue(e,"internal-error")}}async _linkToIdToken(e,t){switch(this.signInMethod){case"password":const r={idToken:t,returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return yi(e,r,"signUpPassword",Gm);case"emailLink":return Xm(e,{idToken:t,email:this._email,oobCode:this._password});default:Ue(e,"internal-error")}}_getReauthenticationResolver(e){return this._getIdTokenResponse(e)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function fn(n,e){return Er(n,"POST","/v1/accounts:signInWithIdp",Je(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Jm="http://localhost";class Ht extends Ao{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const t=new Ht(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(t.idToken=e.idToken),e.accessToken&&(t.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(t.nonce=e.nonce),e.pendingToken&&(t.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(t.accessToken=e.oauthToken,t.secret=e.oauthTokenSecret):Ue("argument-error"),t}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e,{providerId:r,signInMethod:i}=t,s=yo(t,["providerId","signInMethod"]);if(!r||!i)return null;const a=new Ht(r,i);return a.idToken=s.idToken||void 0,a.accessToken=s.accessToken||void 0,a.secret=s.secret,a.nonce=s.nonce,a.pendingToken=s.pendingToken||null,a}_getIdTokenResponse(e){const t=this.buildRequest();return fn(e,t)}_linkToIdToken(e,t){const r=this.buildRequest();return r.idToken=t,fn(e,r)}_getReauthenticationResolver(e){const t=this.buildRequest();return t.autoCreate=!1,fn(e,t)}buildRequest(){const e={requestUri:Jm,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const t={};this.idToken&&(t.id_token=this.idToken),this.accessToken&&(t.access_token=this.accessToken),this.secret&&(t.oauth_token_secret=this.secret),t.providerId=this.providerId,this.nonce&&!this.pendingToken&&(t.nonce=this.nonce),e.postBody=yr(t)}return e}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Zm(n){switch(n){case"recoverEmail":return"RECOVER_EMAIL";case"resetPassword":return"PASSWORD_RESET";case"signIn":return"EMAIL_SIGNIN";case"verifyEmail":return"VERIFY_EMAIL";case"verifyAndChangeEmail":return"VERIFY_AND_CHANGE_EMAIL";case"revertSecondFactorAddition":return"REVERT_SECOND_FACTOR_ADDITION";default:return null}}function eg(n){const e=Kn(Qn(n)).link,t=e?Kn(Qn(e)).deep_link_id:null,r=Kn(Qn(n)).deep_link_id;return(r?Kn(Qn(r)).link:null)||r||t||e||n}class Ro{constructor(e){var t,r,i,s,a,c;const l=Kn(Qn(e)),d=(t=l.apiKey)!==null&&t!==void 0?t:null,p=(r=l.oobCode)!==null&&r!==void 0?r:null,g=Zm((i=l.mode)!==null&&i!==void 0?i:null);M(d&&p&&g,"argument-error"),this.apiKey=d,this.operation=g,this.code=p,this.continueUrl=(s=l.continueUrl)!==null&&s!==void 0?s:null,this.languageCode=(a=l.languageCode)!==null&&a!==void 0?a:null,this.tenantId=(c=l.tenantId)!==null&&c!==void 0?c:null}static parseLink(e){const t=eg(e);try{return new Ro(t)}catch{return null}}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class An{constructor(){this.providerId=An.PROVIDER_ID}static credential(e,t){return ur._fromEmailAndPassword(e,t)}static credentialWithLink(e,t){const r=Ro.parseLink(t);return M(r,"argument-error"),ur._fromEmailAndCode(e,r.code,r.tenantId)}}An.PROVIDER_ID="password";An.EMAIL_PASSWORD_SIGN_IN_METHOD="password";An.EMAIL_LINK_SIGN_IN_METHOD="emailLink";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bo{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Tr extends bo{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vt extends Tr{constructor(){super("facebook.com")}static credential(e){return Ht._fromParams({providerId:vt.PROVIDER_ID,signInMethod:vt.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return vt.credentialFromTaggedObject(e)}static credentialFromError(e){return vt.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return vt.credential(e.oauthAccessToken)}catch{return null}}}vt.FACEBOOK_SIGN_IN_METHOD="facebook.com";vt.PROVIDER_ID="facebook.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Et extends Tr{constructor(){super("google.com"),this.addScope("profile")}static credential(e,t){return Ht._fromParams({providerId:Et.PROVIDER_ID,signInMethod:Et.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:t})}static credentialFromResult(e){return Et.credentialFromTaggedObject(e)}static credentialFromError(e){return Et.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:t,oauthAccessToken:r}=e;if(!t&&!r)return null;try{return Et.credential(t,r)}catch{return null}}}Et.GOOGLE_SIGN_IN_METHOD="google.com";Et.PROVIDER_ID="google.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Tt extends Tr{constructor(){super("github.com")}static credential(e){return Ht._fromParams({providerId:Tt.PROVIDER_ID,signInMethod:Tt.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return Tt.credentialFromTaggedObject(e)}static credentialFromError(e){return Tt.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return Tt.credential(e.oauthAccessToken)}catch{return null}}}Tt.GITHUB_SIGN_IN_METHOD="github.com";Tt.PROVIDER_ID="github.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class It extends Tr{constructor(){super("twitter.com")}static credential(e,t){return Ht._fromParams({providerId:It.PROVIDER_ID,signInMethod:It.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:t})}static credentialFromResult(e){return It.credentialFromTaggedObject(e)}static credentialFromError(e){return It.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:t,oauthTokenSecret:r}=e;if(!t||!r)return null;try{return It.credential(t,r)}catch{return null}}}It.TWITTER_SIGN_IN_METHOD="twitter.com";It.PROVIDER_ID="twitter.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function tg(n,e){return Er(n,"POST","/v1/accounts:signUp",Je(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gt{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,t,r,i=!1){const s=await ot._fromIdTokenResponse(e,r,i),a=Gc(r);return new Gt({user:s,providerId:a,_tokenResponse:r,operationType:t})}static async _forOperation(e,t,r){await e._updateTokensIfNecessary(r,!0);const i=Gc(r);return new Gt({user:e,providerId:i,_tokenResponse:r,operationType:t})}}function Gc(n){return n.providerId?n.providerId:"phoneNumber"in n?"phone":null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vi extends Be{constructor(e,t,r,i){var s;super(t.code,t.message),this.operationType=r,this.user=i,Object.setPrototypeOf(this,vi.prototype),this.customData={appName:e.name,tenantId:(s=e.tenantId)!==null&&s!==void 0?s:void 0,_serverResponse:t.customData._serverResponse,operationType:r}}static _fromErrorAndOperation(e,t,r,i){return new vi(e,t,r,i)}}function Ul(n,e,t,r){return(e==="reauthenticate"?t._getReauthenticationResolver(n):t._getIdTokenResponse(n)).catch(s=>{throw s.code==="auth/multi-factor-auth-required"?vi._fromErrorAndOperation(n,s,e,r):s})}async function ng(n,e,t=!1){const r=await cr(n,e._linkToIdToken(n.auth,await n.getIdToken()),t);return Gt._forOperation(n,"link",r)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function rg(n,e,t=!1){const{auth:r}=n;if($e(r.app))return Promise.reject(ct(r));const i="reauthenticate";try{const s=await cr(n,Ul(r,i,e,n),t);M(s.idToken,r,"internal-error");const a=Io(s.idToken);M(a,r,"internal-error");const{sub:c}=a;return M(n.uid===c,r,"user-mismatch"),Gt._forOperation(n,i,s)}catch(s){throw s?.code==="auth/user-not-found"&&Ue(r,"user-mismatch"),s}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Fl(n,e,t=!1){if($e(n.app))return Promise.reject(ct(n));const r="signIn",i=await Ul(n,r,e),s=await Gt._fromIdTokenResponse(n,r,i);return t||await n._updateCurrentUser(s.user),s}async function ig(n,e){return Fl(et(n),e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class So{constructor(e,t){this.factorId=e,this.uid=t.mfaEnrollmentId,this.enrollmentTime=new Date(t.enrolledAt).toUTCString(),this.displayName=t.displayName}static _fromServerResponse(e,t){return"phoneInfo"in t?Po._fromServerResponse(e,t):"totpInfo"in t?Co._fromServerResponse(e,t):Ue(e,"internal-error")}}class Po extends So{constructor(e){super("phone",e),this.phoneNumber=e.phoneInfo}static _fromServerResponse(e,t){return new Po(t)}}class Co extends So{constructor(e){super("totp",e)}static _fromServerResponse(e,t){return new Co(t)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ko(n){const e=et(n);e._getPasswordPolicyInternal()&&await e._updatePasswordPolicy()}async function JI(n,e,t){const r=et(n);await yi(r,{requestType:"PASSWORD_RESET",email:e,clientType:"CLIENT_TYPE_WEB"},"getOobCode",Qm)}async function ZI(n,e,t){await xl(Q(n),{oobCode:e,newPassword:t}).catch(async r=>{throw r.code==="auth/password-does-not-meet-requirements"&&ko(n),r})}async function sg(n,e){const t=Q(n),r=await xl(t,{oobCode:e}),i=r.requestType;switch(M(i,t,"internal-error"),i){case"EMAIL_SIGNIN":break;case"VERIFY_AND_CHANGE_EMAIL":M(r.newEmail,t,"internal-error");break;case"REVERT_SECOND_FACTOR_ADDITION":M(r.mfaInfo,t,"internal-error");default:M(r.email,t,"internal-error")}let s=null;return r.mfaInfo&&(s=So._fromServerResponse(et(t),r.mfaInfo)),{data:{email:(r.requestType==="VERIFY_AND_CHANGE_EMAIL"?r.newEmail:r.email)||null,previousEmail:(r.requestType==="VERIFY_AND_CHANGE_EMAIL"?r.email:r.newEmail)||null,multiFactorInfo:s},operation:i}}async function ew(n,e){const{data:t}=await sg(Q(n),e);return t.email}async function tw(n,e,t){if($e(n.app))return Promise.reject(ct(n));const r=et(n),a=await yi(r,{returnSecureToken:!0,email:e,password:t,clientType:"CLIENT_TYPE_WEB"},"signUpPassword",tg).catch(l=>{throw l.code==="auth/password-does-not-meet-requirements"&&ko(n),l}),c=await Gt._fromIdTokenResponse(r,"signIn",a);return await r._updateCurrentUser(c.user),c}function nw(n,e,t){return $e(n.app)?Promise.reject(ct(n)):ig(Q(n),An.credential(e,t)).catch(async r=>{throw r.code==="auth/password-does-not-meet-requirements"&&ko(n),r})}function og(n,e,t,r){return Q(n).onIdTokenChanged(e,t,r)}function ag(n,e,t){return Q(n).beforeAuthStateChanged(e,t)}function rw(n,e,t,r){return Q(n).onAuthStateChanged(e,t,r)}function iw(n){return Q(n).signOut()}const Ei="__sak";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Bl{constructor(e,t){this.storageRetriever=e,this.type=t}_isAvailable(){try{return this.storage?(this.storage.setItem(Ei,"1"),this.storage.removeItem(Ei),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,t){return this.storage.setItem(e,JSON.stringify(t)),Promise.resolve()}_get(e){const t=this.storage.getItem(e);return Promise.resolve(t?JSON.parse(t):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const cg=1e3,ug=10;class ql extends Bl{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,t)=>this.onStorageEvent(e,t),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=Dl(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const t of Object.keys(this.listeners)){const r=this.storage.getItem(t),i=this.localCache[t];r!==i&&e(t,i,r)}}onStorageEvent(e,t=!1){if(!e.key){this.forAllChangedKeys((a,c,l)=>{this.notifyListeners(a,l)});return}const r=e.key;t?this.detachListener():this.stopPolling();const i=()=>{const a=this.storage.getItem(r);!t&&this.localCache[r]===a||this.notifyListeners(r,a)},s=this.storage.getItem(r);Sm()&&s!==e.newValue&&e.newValue!==e.oldValue?setTimeout(i,ug):i()}notifyListeners(e,t){this.localCache[e]=t;const r=this.listeners[e];if(r)for(const i of Array.from(r))i(t&&JSON.parse(t))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,t,r)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:t,newValue:r}),!0)})},cg)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,t){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,t){await super._set(e,t),this.localCache[e]=JSON.stringify(t)}async _get(e){const t=await super._get(e);return this.localCache[e]=JSON.stringify(t),t}async _remove(e){await super._remove(e),delete this.localCache[e]}}ql.type="LOCAL";const lg=ql;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $l extends Bl{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,t){}_removeListener(e,t){}}$l.type="SESSION";const jl=$l;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function hg(n){return Promise.all(n.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(t){return{fulfilled:!1,reason:t}}}))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ui{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const t=this.receivers.find(i=>i.isListeningto(e));if(t)return t;const r=new Ui(e);return this.receivers.push(r),r}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const t=e,{eventId:r,eventType:i,data:s}=t.data,a=this.handlersMap[i];if(!a?.size)return;t.ports[0].postMessage({status:"ack",eventId:r,eventType:i});const c=Array.from(a).map(async d=>d(t.origin,s)),l=await hg(c);t.ports[0].postMessage({status:"done",eventId:r,eventType:i,response:l})}_subscribe(e,t){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(t)}_unsubscribe(e,t){this.handlersMap[e]&&t&&this.handlersMap[e].delete(t),(!t||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}Ui.receivers=[];/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function No(n="",e=10){let t="";for(let r=0;r<e;r++)t+=Math.floor(Math.random()*10);return n+t}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dg{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,t,r=50){const i=typeof MessageChannel<"u"?new MessageChannel:null;if(!i)throw new Error("connection_unavailable");let s,a;return new Promise((c,l)=>{const d=No("",20);i.port1.start();const p=setTimeout(()=>{l(new Error("unsupported_event"))},r);a={messageChannel:i,onMessage(g){const E=g;if(E.data.eventId===d)switch(E.data.status){case"ack":clearTimeout(p),s=setTimeout(()=>{l(new Error("timeout"))},3e3);break;case"done":clearTimeout(s),c(E.data.response);break;default:clearTimeout(p),clearTimeout(s),l(new Error("invalid_response"));break}}},this.handlers.add(a),i.port1.addEventListener("message",a.onMessage),this.target.postMessage({eventType:e,eventId:d,data:t},[i.port2])}).finally(()=>{a&&this.removeMessageHandler(a)})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function We(){return window}function fg(n){We().location.href=n}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function zl(){return typeof We().WorkerGlobalScope<"u"&&typeof We().importScripts=="function"}async function pg(){if(!navigator?.serviceWorker)return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function mg(){var n;return((n=navigator?.serviceWorker)===null||n===void 0?void 0:n.controller)||null}function gg(){return zl()?self:null}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Hl="firebaseLocalStorageDb",_g=1,Ti="firebaseLocalStorage",Gl="fbase_key";class Ir{constructor(e){this.request=e}toPromise(){return new Promise((e,t)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{t(this.request.error)})})}}function Fi(n,e){return n.transaction([Ti],e?"readwrite":"readonly").objectStore(Ti)}function yg(){const n=indexedDB.deleteDatabase(Hl);return new Ir(n).toPromise()}function Zs(){const n=indexedDB.open(Hl,_g);return new Promise((e,t)=>{n.addEventListener("error",()=>{t(n.error)}),n.addEventListener("upgradeneeded",()=>{const r=n.result;try{r.createObjectStore(Ti,{keyPath:Gl})}catch(i){t(i)}}),n.addEventListener("success",async()=>{const r=n.result;r.objectStoreNames.contains(Ti)?e(r):(r.close(),await yg(),e(await Zs()))})})}async function Wc(n,e,t){const r=Fi(n,!0).put({[Gl]:e,value:t});return new Ir(r).toPromise()}async function vg(n,e){const t=Fi(n,!1).get(e),r=await new Ir(t).toPromise();return r===void 0?null:r.value}function Kc(n,e){const t=Fi(n,!0).delete(e);return new Ir(t).toPromise()}const Eg=800,Tg=3;class Wl{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db?this.db:(this.db=await Zs(),this.db)}async _withRetries(e){let t=0;for(;;)try{const r=await this._openDb();return await e(r)}catch(r){if(t++>Tg)throw r;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return zl()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=Ui._getInstance(gg()),this.receiver._subscribe("keyChanged",async(e,t)=>({keyProcessed:(await this._poll()).includes(t.key)})),this.receiver._subscribe("ping",async(e,t)=>["keyChanged"])}async initializeSender(){var e,t;if(this.activeServiceWorker=await pg(),!this.activeServiceWorker)return;this.sender=new dg(this.activeServiceWorker);const r=await this.sender._send("ping",{},800);r&&!((e=r[0])===null||e===void 0)&&e.fulfilled&&!((t=r[0])===null||t===void 0)&&t.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||mg()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{if(!indexedDB)return!1;const e=await Zs();return await Wc(e,Ei,"1"),await Kc(e,Ei),!0}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,t){return this._withPendingWrite(async()=>(await this._withRetries(r=>Wc(r,e,t)),this.localCache[e]=t,this.notifyServiceWorker(e)))}async _get(e){const t=await this._withRetries(r=>vg(r,e));return this.localCache[e]=t,t}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(t=>Kc(t,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){const e=await this._withRetries(i=>{const s=Fi(i,!1).getAll();return new Ir(s).toPromise()});if(!e)return[];if(this.pendingWrites!==0)return[];const t=[],r=new Set;if(e.length!==0)for(const{fbase_key:i,value:s}of e)r.add(i),JSON.stringify(this.localCache[i])!==JSON.stringify(s)&&(this.notifyListeners(i,s),t.push(i));for(const i of Object.keys(this.localCache))this.localCache[i]&&!r.has(i)&&(this.notifyListeners(i,null),t.push(i));return t}notifyListeners(e,t){this.localCache[e]=t;const r=this.listeners[e];if(r)for(const i of Array.from(r))i(t)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),Eg)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,t){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&this.stopPolling()}}Wl.type="LOCAL";const Ig=Wl;new vr(3e4,6e4);/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Kl(n,e){return e?at(e):(M(n._popupRedirectResolver,n,"argument-error"),n._popupRedirectResolver)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Do extends Ao{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return fn(e,this._buildIdpRequest())}_linkToIdToken(e,t){return fn(e,this._buildIdpRequest(t))}_getReauthenticationResolver(e){return fn(e,this._buildIdpRequest())}_buildIdpRequest(e){const t={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(t.idToken=e),t}}function wg(n){return Fl(n.auth,new Do(n),n.bypassAuthState)}function Ag(n){const{auth:e,user:t}=n;return M(t,e,"internal-error"),rg(t,new Do(n),n.bypassAuthState)}async function Rg(n){const{auth:e,user:t}=n;return M(t,e,"internal-error"),ng(t,new Do(n),n.bypassAuthState)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ql{constructor(e,t,r,i,s=!1){this.auth=e,this.resolver=r,this.user=i,this.bypassAuthState=s,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(t)?t:[t]}execute(){return new Promise(async(e,t)=>{this.pendingPromise={resolve:e,reject:t};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(r){this.reject(r)}})}async onAuthEvent(e){const{urlResponse:t,sessionId:r,postBody:i,tenantId:s,error:a,type:c}=e;if(a){this.reject(a);return}const l={auth:this.auth,requestUri:t,sessionId:r,tenantId:s||void 0,postBody:i||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(c)(l))}catch(d){this.reject(d)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return wg;case"linkViaPopup":case"linkViaRedirect":return Rg;case"reauthViaPopup":case"reauthViaRedirect":return Ag;default:Ue(this.auth,"internal-error")}}resolve(e){ht(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){ht(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const bg=new vr(2e3,1e4);async function sw(n,e,t){if($e(n.app))return Promise.reject(je(n,"operation-not-supported-in-this-environment"));const r=et(n);cm(n,e,bo);const i=Kl(r,t);return new Bt(r,"signInViaPopup",e,i).executeNotNull()}class Bt extends Ql{constructor(e,t,r,i,s){super(e,t,i,s),this.provider=r,this.authWindow=null,this.pollId=null,Bt.currentPopupAction&&Bt.currentPopupAction.cancel(),Bt.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return M(e,this.auth,"internal-error"),e}async onExecution(){ht(this.filter.length===1,"Popup operations only handle one event");const e=No();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(t=>{this.reject(t)}),this.resolver._isIframeWebStorageSupported(this.auth,t=>{t||this.reject(je(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)===null||e===void 0?void 0:e.associatedEvent)||null}cancel(){this.reject(je(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,Bt.currentPopupAction=null}pollUserCancellation(){const e=()=>{var t,r;if(!((r=(t=this.authWindow)===null||t===void 0?void 0:t.window)===null||r===void 0)&&r.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(je(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,bg.get())};e()}}Bt.currentPopupAction=null;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Sg="pendingRedirect",oi=new Map;class Pg extends Ql{constructor(e,t,r=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],t,void 0,r),this.eventId=null}async execute(){let e=oi.get(this.auth._key());if(!e){try{const r=await Cg(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(r)}catch(t){e=()=>Promise.reject(t)}oi.set(this.auth._key(),e)}return this.bypassAuthState||oi.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const t=await this.auth._redirectUserForId(e.eventId);if(t)return this.user=t,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function Cg(n,e){const t=Dg(e),r=Ng(n);if(!await r._isAvailable())return!1;const i=await r._get(t)==="true";return await r._remove(t),i}function kg(n,e){oi.set(n._key(),e)}function Ng(n){return at(n._redirectPersistence)}function Dg(n){return si(Sg,n.config.apiKey,n.name)}async function Vg(n,e,t=!1){if($e(n.app))return Promise.reject(ct(n));const r=et(n),i=Kl(r,e),a=await new Pg(r,i,t).execute();return a&&!t&&(delete a.user._redirectEventId,await r._persistUserIfCurrent(a.user),await r._setRedirectUser(null,e)),a}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Og=10*60*1e3;class Lg{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let t=!1;return this.consumers.forEach(r=>{this.isEventForConsumer(e,r)&&(t=!0,this.sendToConsumer(e,r),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!Mg(e)||(this.hasHandledPotentialRedirect=!0,t||(this.queuedRedirectEvent=e,t=!0)),t}sendToConsumer(e,t){var r;if(e.error&&!Yl(e)){const i=((r=e.error.code)===null||r===void 0?void 0:r.split("auth/")[1])||"internal-error";t.onError(je(this.auth,i))}else t.onAuthEvent(e)}isEventForConsumer(e,t){const r=t.eventId===null||!!e.eventId&&e.eventId===t.eventId;return t.filter.includes(e.type)&&r}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=Og&&this.cachedEventUids.clear(),this.cachedEventUids.has(Qc(e))}saveEventToCache(e){this.cachedEventUids.add(Qc(e)),this.lastProcessedEventTime=Date.now()}}function Qc(n){return[n.type,n.eventId,n.sessionId,n.tenantId].filter(e=>e).join("-")}function Yl({type:n,error:e}){return n==="unknown"&&e?.code==="auth/no-auth-event"}function Mg(n){switch(n.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return Yl(n);default:return!1}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function xg(n,e={}){return Ze(n,"GET","/v1/projects",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ug=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,Fg=/^https?/;async function Bg(n){if(n.config.emulator)return;const{authorizedDomains:e}=await xg(n);for(const t of e)try{if(qg(t))return}catch{}Ue(n,"unauthorized-domain")}function qg(n){const e=Xs(),{protocol:t,hostname:r}=new URL(e);if(n.startsWith("chrome-extension://")){const a=new URL(n);return a.hostname===""&&r===""?t==="chrome-extension:"&&n.replace("chrome-extension://","")===e.replace("chrome-extension://",""):t==="chrome-extension:"&&a.hostname===r}if(!Fg.test(t))return!1;if(Ug.test(n))return r===n;const i=n.replace(/\./g,"\\.");return new RegExp("^(.+\\."+i+"|"+i+")$","i").test(r)}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $g=new vr(3e4,6e4);function Yc(){const n=We().___jsl;if(n?.H){for(const e of Object.keys(n.H))if(n.H[e].r=n.H[e].r||[],n.H[e].L=n.H[e].L||[],n.H[e].r=[...n.H[e].L],n.CP)for(let t=0;t<n.CP.length;t++)n.CP[t]=null}}function jg(n){return new Promise((e,t)=>{var r,i,s;function a(){Yc(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{Yc(),t(je(n,"network-request-failed"))},timeout:$g.get()})}if(!((i=(r=We().gapi)===null||r===void 0?void 0:r.iframes)===null||i===void 0)&&i.Iframe)e(gapi.iframes.getContext());else if(!((s=We().gapi)===null||s===void 0)&&s.load)a();else{const c=Mm("iframefcb");return We()[c]=()=>{gapi.load?a():t(je(n,"network-request-failed"))},Ol(`${Lm()}?onload=${c}`).catch(l=>t(l))}}).catch(e=>{throw ai=null,e})}let ai=null;function zg(n){return ai=ai||jg(n),ai}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Hg=new vr(5e3,15e3),Gg="__/auth/iframe",Wg="emulator/auth/iframe",Kg={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},Qg=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function Yg(n){const e=n.config;M(e.authDomain,n,"auth-domain-config-required");const t=e.emulator?To(e,Wg):`https://${n.config.authDomain}/${Gg}`,r={apiKey:e.apiKey,appName:n.name,v:Jt},i=Qg.get(n.config.apiHost);i&&(r.eid=i);const s=n._getFrameworks();return s.length&&(r.fw=s.join(",")),`${t}?${yr(r).slice(1)}`}async function Xg(n){const e=await zg(n),t=We().gapi;return M(t,n,"internal-error"),e.open({where:document.body,url:Yg(n),messageHandlersFilter:t.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:Kg,dontclear:!0},r=>new Promise(async(i,s)=>{await r.restyle({setHideOnLeave:!1});const a=je(n,"network-request-failed"),c=We().setTimeout(()=>{s(a)},Hg.get());function l(){We().clearTimeout(c),i(r)}r.ping(l).then(l,()=>{s(a)})}))}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Jg={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},Zg=500,e_=600,t_="_blank",n_="http://localhost";class Xc{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function r_(n,e,t,r=Zg,i=e_){const s=Math.max((window.screen.availHeight-i)/2,0).toString(),a=Math.max((window.screen.availWidth-r)/2,0).toString();let c="";const l=Object.assign(Object.assign({},Jg),{width:r.toString(),height:i.toString(),top:s,left:a}),d=Ae().toLowerCase();t&&(c=Sl(d)?t_:t),Rl(d)&&(e=e||n_,l.scrollbars="yes");const p=Object.entries(l).reduce((E,[R,k])=>`${E}${R}=${k},`,"");if(bm(d)&&c!=="_self")return i_(e||"",c),new Xc(null);const g=window.open(e||"",c,p);M(g,n,"popup-blocked");try{g.focus()}catch{}return new Xc(g)}function i_(n,e){const t=document.createElement("a");t.href=n,t.target=e;const r=document.createEvent("MouseEvent");r.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),t.dispatchEvent(r)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const s_="__/auth/handler",o_="emulator/auth/handler",a_=encodeURIComponent("fac");async function Jc(n,e,t,r,i,s){M(n.config.authDomain,n,"auth-domain-config-required"),M(n.config.apiKey,n,"invalid-api-key");const a={apiKey:n.config.apiKey,appName:n.name,authType:t,redirectUrl:r,v:Jt,eventId:i};if(e instanceof bo){e.setDefaultLanguage(n.languageCode),a.providerId=e.providerId||"",tp(e.getCustomParameters())||(a.customParameters=JSON.stringify(e.getCustomParameters()));for(const[p,g]of Object.entries({}))a[p]=g}if(e instanceof Tr){const p=e.getScopes().filter(g=>g!=="");p.length>0&&(a.scopes=p.join(","))}n.tenantId&&(a.tid=n.tenantId);const c=a;for(const p of Object.keys(c))c[p]===void 0&&delete c[p];const l=await n._getAppCheckToken(),d=l?`#${a_}=${encodeURIComponent(l)}`:"";return`${c_(n)}?${yr(c).slice(1)}${d}`}function c_({config:n}){return n.emulator?To(n,o_):`https://${n.authDomain}/${s_}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const xs="webStorageSupport";class u_{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=jl,this._completeRedirectFn=Vg,this._overrideRedirectResult=kg}async _openPopup(e,t,r,i){var s;ht((s=this.eventManagers[e._key()])===null||s===void 0?void 0:s.manager,"_initialize() not called before _openPopup()");const a=await Jc(e,t,r,Xs(),i);return r_(e,a,No())}async _openRedirect(e,t,r,i){await this._originValidation(e);const s=await Jc(e,t,r,Xs(),i);return fg(s),new Promise(()=>{})}_initialize(e){const t=e._key();if(this.eventManagers[t]){const{manager:i,promise:s}=this.eventManagers[t];return i?Promise.resolve(i):(ht(s,"If manager is not set, promise should be"),s)}const r=this.initAndGetManager(e);return this.eventManagers[t]={promise:r},r.catch(()=>{delete this.eventManagers[t]}),r}async initAndGetManager(e){const t=await Xg(e),r=new Lg(e);return t.register("authEvent",i=>(M(i?.authEvent,e,"invalid-auth-event"),{status:r.onEvent(i.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:r},this.iframes[e._key()]=t,r}_isIframeWebStorageSupported(e,t){this.iframes[e._key()].send(xs,{type:xs},i=>{var s;const a=(s=i?.[0])===null||s===void 0?void 0:s[xs];a!==void 0&&t(!!a),Ue(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const t=e._key();return this.originValidationPromises[t]||(this.originValidationPromises[t]=Bg(e)),this.originValidationPromises[t]}get _shouldInitProactively(){return Dl()||bl()||wo()}}const l_=u_;var Zc="@firebase/auth",eu="1.8.1";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class h_{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)===null||e===void 0?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const t=this.auth.onIdTokenChanged(r=>{e(r?.stsTokenManager.accessToken||null)});this.internalListeners.set(e,t),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const t=this.internalListeners.get(e);t&&(this.internalListeners.delete(e),t(),this.updateProactiveRefresh())}assertAuthConfigured(){M(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function d_(n){switch(n){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function f_(n){ze(new Fe("auth",(e,{options:t})=>{const r=e.getProvider("app").getImmediate(),i=e.getProvider("heartbeat"),s=e.getProvider("app-check-internal"),{apiKey:a,authDomain:c}=r.options;M(a&&!a.includes(":"),"invalid-api-key",{appName:r.name});const l={apiKey:a,authDomain:c,clientPlatform:n,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:Vl(n)},d=new Dm(r,i,s,l);return $m(d,t),d},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,t,r)=>{e.getProvider("auth-internal").initialize()})),ze(new Fe("auth-internal",e=>{const t=et(e.getProvider("auth").getImmediate());return(r=>new h_(r))(t)},"PRIVATE").setInstantiationMode("EXPLICIT")),Me(Zc,eu,d_(n)),Me(Zc,eu,"esm2017")}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const p_=5*60,m_=ll("authIdTokenMaxAge")||p_;let tu=null;const g_=n=>async e=>{const t=e&&await e.getIdTokenResult(),r=t&&(new Date().getTime()-Date.parse(t.issuedAtTime))/1e3;if(r&&r>m_)return;const i=t?.token;tu!==i&&(tu=i,await fetch(n,{method:i?"POST":"DELETE",headers:i?{Authorization:`Bearer ${i}`}:{}}))};function ow(n=Mi()){const e=Dt(n,"auth");if(e.isInitialized())return e.getImmediate();const t=qm(n,{popupRedirectResolver:l_,persistence:[Ig,lg,jl]}),r=ll("authTokenSyncURL");if(r&&typeof isSecureContext=="boolean"&&isSecureContext){const s=new URL(r,location.origin);if(location.origin===s.origin){const a=g_(s.toString());ag(t,a,()=>a(t.currentUser)),og(t,c=>a(c))}}const i=al("auth");return i&&jm(t,`http://${i}`),t}function __(){var n,e;return(e=(n=document.getElementsByTagName("head"))===null||n===void 0?void 0:n[0])!==null&&e!==void 0?e:document}Vm({loadJS(n){return new Promise((e,t)=>{const r=document.createElement("script");r.setAttribute("src",n),r.onload=e,r.onerror=i=>{const s=je("internal-error");s.customData=i,t(s)},r.type="text/javascript",r.charset="UTF-8",__().appendChild(r)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});f_("Browser");var nu=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var jt,Xl;(function(){var n;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function e(T,m){function y(){}y.prototype=m.prototype,T.D=m.prototype,T.prototype=new y,T.prototype.constructor=T,T.C=function(v,I,A){for(var _=Array(arguments.length-2),nt=2;nt<arguments.length;nt++)_[nt-2]=arguments[nt];return m.prototype[I].apply(v,_)}}function t(){this.blockSize=-1}function r(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.B=Array(this.blockSize),this.o=this.h=0,this.s()}e(r,t),r.prototype.s=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function i(T,m,y){y||(y=0);var v=Array(16);if(typeof m=="string")for(var I=0;16>I;++I)v[I]=m.charCodeAt(y++)|m.charCodeAt(y++)<<8|m.charCodeAt(y++)<<16|m.charCodeAt(y++)<<24;else for(I=0;16>I;++I)v[I]=m[y++]|m[y++]<<8|m[y++]<<16|m[y++]<<24;m=T.g[0],y=T.g[1],I=T.g[2];var A=T.g[3],_=m+(A^y&(I^A))+v[0]+3614090360&4294967295;m=y+(_<<7&4294967295|_>>>25),_=A+(I^m&(y^I))+v[1]+3905402710&4294967295,A=m+(_<<12&4294967295|_>>>20),_=I+(y^A&(m^y))+v[2]+606105819&4294967295,I=A+(_<<17&4294967295|_>>>15),_=y+(m^I&(A^m))+v[3]+3250441966&4294967295,y=I+(_<<22&4294967295|_>>>10),_=m+(A^y&(I^A))+v[4]+4118548399&4294967295,m=y+(_<<7&4294967295|_>>>25),_=A+(I^m&(y^I))+v[5]+1200080426&4294967295,A=m+(_<<12&4294967295|_>>>20),_=I+(y^A&(m^y))+v[6]+2821735955&4294967295,I=A+(_<<17&4294967295|_>>>15),_=y+(m^I&(A^m))+v[7]+4249261313&4294967295,y=I+(_<<22&4294967295|_>>>10),_=m+(A^y&(I^A))+v[8]+1770035416&4294967295,m=y+(_<<7&4294967295|_>>>25),_=A+(I^m&(y^I))+v[9]+2336552879&4294967295,A=m+(_<<12&4294967295|_>>>20),_=I+(y^A&(m^y))+v[10]+4294925233&4294967295,I=A+(_<<17&4294967295|_>>>15),_=y+(m^I&(A^m))+v[11]+2304563134&4294967295,y=I+(_<<22&4294967295|_>>>10),_=m+(A^y&(I^A))+v[12]+1804603682&4294967295,m=y+(_<<7&4294967295|_>>>25),_=A+(I^m&(y^I))+v[13]+4254626195&4294967295,A=m+(_<<12&4294967295|_>>>20),_=I+(y^A&(m^y))+v[14]+2792965006&4294967295,I=A+(_<<17&4294967295|_>>>15),_=y+(m^I&(A^m))+v[15]+1236535329&4294967295,y=I+(_<<22&4294967295|_>>>10),_=m+(I^A&(y^I))+v[1]+4129170786&4294967295,m=y+(_<<5&4294967295|_>>>27),_=A+(y^I&(m^y))+v[6]+3225465664&4294967295,A=m+(_<<9&4294967295|_>>>23),_=I+(m^y&(A^m))+v[11]+643717713&4294967295,I=A+(_<<14&4294967295|_>>>18),_=y+(A^m&(I^A))+v[0]+3921069994&4294967295,y=I+(_<<20&4294967295|_>>>12),_=m+(I^A&(y^I))+v[5]+3593408605&4294967295,m=y+(_<<5&4294967295|_>>>27),_=A+(y^I&(m^y))+v[10]+38016083&4294967295,A=m+(_<<9&4294967295|_>>>23),_=I+(m^y&(A^m))+v[15]+3634488961&4294967295,I=A+(_<<14&4294967295|_>>>18),_=y+(A^m&(I^A))+v[4]+3889429448&4294967295,y=I+(_<<20&4294967295|_>>>12),_=m+(I^A&(y^I))+v[9]+568446438&4294967295,m=y+(_<<5&4294967295|_>>>27),_=A+(y^I&(m^y))+v[14]+3275163606&4294967295,A=m+(_<<9&4294967295|_>>>23),_=I+(m^y&(A^m))+v[3]+4107603335&4294967295,I=A+(_<<14&4294967295|_>>>18),_=y+(A^m&(I^A))+v[8]+1163531501&4294967295,y=I+(_<<20&4294967295|_>>>12),_=m+(I^A&(y^I))+v[13]+2850285829&4294967295,m=y+(_<<5&4294967295|_>>>27),_=A+(y^I&(m^y))+v[2]+4243563512&4294967295,A=m+(_<<9&4294967295|_>>>23),_=I+(m^y&(A^m))+v[7]+1735328473&4294967295,I=A+(_<<14&4294967295|_>>>18),_=y+(A^m&(I^A))+v[12]+2368359562&4294967295,y=I+(_<<20&4294967295|_>>>12),_=m+(y^I^A)+v[5]+4294588738&4294967295,m=y+(_<<4&4294967295|_>>>28),_=A+(m^y^I)+v[8]+2272392833&4294967295,A=m+(_<<11&4294967295|_>>>21),_=I+(A^m^y)+v[11]+1839030562&4294967295,I=A+(_<<16&4294967295|_>>>16),_=y+(I^A^m)+v[14]+4259657740&4294967295,y=I+(_<<23&4294967295|_>>>9),_=m+(y^I^A)+v[1]+2763975236&4294967295,m=y+(_<<4&4294967295|_>>>28),_=A+(m^y^I)+v[4]+1272893353&4294967295,A=m+(_<<11&4294967295|_>>>21),_=I+(A^m^y)+v[7]+4139469664&4294967295,I=A+(_<<16&4294967295|_>>>16),_=y+(I^A^m)+v[10]+3200236656&4294967295,y=I+(_<<23&4294967295|_>>>9),_=m+(y^I^A)+v[13]+681279174&4294967295,m=y+(_<<4&4294967295|_>>>28),_=A+(m^y^I)+v[0]+3936430074&4294967295,A=m+(_<<11&4294967295|_>>>21),_=I+(A^m^y)+v[3]+3572445317&4294967295,I=A+(_<<16&4294967295|_>>>16),_=y+(I^A^m)+v[6]+76029189&4294967295,y=I+(_<<23&4294967295|_>>>9),_=m+(y^I^A)+v[9]+3654602809&4294967295,m=y+(_<<4&4294967295|_>>>28),_=A+(m^y^I)+v[12]+3873151461&4294967295,A=m+(_<<11&4294967295|_>>>21),_=I+(A^m^y)+v[15]+530742520&4294967295,I=A+(_<<16&4294967295|_>>>16),_=y+(I^A^m)+v[2]+3299628645&4294967295,y=I+(_<<23&4294967295|_>>>9),_=m+(I^(y|~A))+v[0]+4096336452&4294967295,m=y+(_<<6&4294967295|_>>>26),_=A+(y^(m|~I))+v[7]+1126891415&4294967295,A=m+(_<<10&4294967295|_>>>22),_=I+(m^(A|~y))+v[14]+2878612391&4294967295,I=A+(_<<15&4294967295|_>>>17),_=y+(A^(I|~m))+v[5]+4237533241&4294967295,y=I+(_<<21&4294967295|_>>>11),_=m+(I^(y|~A))+v[12]+1700485571&4294967295,m=y+(_<<6&4294967295|_>>>26),_=A+(y^(m|~I))+v[3]+2399980690&4294967295,A=m+(_<<10&4294967295|_>>>22),_=I+(m^(A|~y))+v[10]+4293915773&4294967295,I=A+(_<<15&4294967295|_>>>17),_=y+(A^(I|~m))+v[1]+2240044497&4294967295,y=I+(_<<21&4294967295|_>>>11),_=m+(I^(y|~A))+v[8]+1873313359&4294967295,m=y+(_<<6&4294967295|_>>>26),_=A+(y^(m|~I))+v[15]+4264355552&4294967295,A=m+(_<<10&4294967295|_>>>22),_=I+(m^(A|~y))+v[6]+2734768916&4294967295,I=A+(_<<15&4294967295|_>>>17),_=y+(A^(I|~m))+v[13]+1309151649&4294967295,y=I+(_<<21&4294967295|_>>>11),_=m+(I^(y|~A))+v[4]+4149444226&4294967295,m=y+(_<<6&4294967295|_>>>26),_=A+(y^(m|~I))+v[11]+3174756917&4294967295,A=m+(_<<10&4294967295|_>>>22),_=I+(m^(A|~y))+v[2]+718787259&4294967295,I=A+(_<<15&4294967295|_>>>17),_=y+(A^(I|~m))+v[9]+3951481745&4294967295,T.g[0]=T.g[0]+m&4294967295,T.g[1]=T.g[1]+(I+(_<<21&4294967295|_>>>11))&4294967295,T.g[2]=T.g[2]+I&4294967295,T.g[3]=T.g[3]+A&4294967295}r.prototype.u=function(T,m){m===void 0&&(m=T.length);for(var y=m-this.blockSize,v=this.B,I=this.h,A=0;A<m;){if(I==0)for(;A<=y;)i(this,T,A),A+=this.blockSize;if(typeof T=="string"){for(;A<m;)if(v[I++]=T.charCodeAt(A++),I==this.blockSize){i(this,v),I=0;break}}else for(;A<m;)if(v[I++]=T[A++],I==this.blockSize){i(this,v),I=0;break}}this.h=I,this.o+=m},r.prototype.v=function(){var T=Array((56>this.h?this.blockSize:2*this.blockSize)-this.h);T[0]=128;for(var m=1;m<T.length-8;++m)T[m]=0;var y=8*this.o;for(m=T.length-8;m<T.length;++m)T[m]=y&255,y/=256;for(this.u(T),T=Array(16),m=y=0;4>m;++m)for(var v=0;32>v;v+=8)T[y++]=this.g[m]>>>v&255;return T};function s(T,m){var y=c;return Object.prototype.hasOwnProperty.call(y,T)?y[T]:y[T]=m(T)}function a(T,m){this.h=m;for(var y=[],v=!0,I=T.length-1;0<=I;I--){var A=T[I]|0;v&&A==m||(y[I]=A,v=!1)}this.g=y}var c={};function l(T){return-128<=T&&128>T?s(T,function(m){return new a([m|0],0>m?-1:0)}):new a([T|0],0>T?-1:0)}function d(T){if(isNaN(T)||!isFinite(T))return g;if(0>T)return C(d(-T));for(var m=[],y=1,v=0;T>=y;v++)m[v]=T/y|0,y*=4294967296;return new a(m,0)}function p(T,m){if(T.length==0)throw Error("number format error: empty string");if(m=m||10,2>m||36<m)throw Error("radix out of range: "+m);if(T.charAt(0)=="-")return C(p(T.substring(1),m));if(0<=T.indexOf("-"))throw Error('number format error: interior "-" character');for(var y=d(Math.pow(m,8)),v=g,I=0;I<T.length;I+=8){var A=Math.min(8,T.length-I),_=parseInt(T.substring(I,I+A),m);8>A?(A=d(Math.pow(m,A)),v=v.j(A).add(d(_))):(v=v.j(y),v=v.add(d(_)))}return v}var g=l(0),E=l(1),R=l(16777216);n=a.prototype,n.m=function(){if(V(this))return-C(this).m();for(var T=0,m=1,y=0;y<this.g.length;y++){var v=this.i(y);T+=(0<=v?v:4294967296+v)*m,m*=4294967296}return T},n.toString=function(T){if(T=T||10,2>T||36<T)throw Error("radix out of range: "+T);if(k(this))return"0";if(V(this))return"-"+C(this).toString(T);for(var m=d(Math.pow(T,6)),y=this,v="";;){var I=j(y,m).g;y=B(y,I.j(m));var A=((0<y.g.length?y.g[0]:y.h)>>>0).toString(T);if(y=I,k(y))return A+v;for(;6>A.length;)A="0"+A;v=A+v}},n.i=function(T){return 0>T?0:T<this.g.length?this.g[T]:this.h};function k(T){if(T.h!=0)return!1;for(var m=0;m<T.g.length;m++)if(T.g[m]!=0)return!1;return!0}function V(T){return T.h==-1}n.l=function(T){return T=B(this,T),V(T)?-1:k(T)?0:1};function C(T){for(var m=T.g.length,y=[],v=0;v<m;v++)y[v]=~T.g[v];return new a(y,~T.h).add(E)}n.abs=function(){return V(this)?C(this):this},n.add=function(T){for(var m=Math.max(this.g.length,T.g.length),y=[],v=0,I=0;I<=m;I++){var A=v+(this.i(I)&65535)+(T.i(I)&65535),_=(A>>>16)+(this.i(I)>>>16)+(T.i(I)>>>16);v=_>>>16,A&=65535,_&=65535,y[I]=_<<16|A}return new a(y,y[y.length-1]&-2147483648?-1:0)};function B(T,m){return T.add(C(m))}n.j=function(T){if(k(this)||k(T))return g;if(V(this))return V(T)?C(this).j(C(T)):C(C(this).j(T));if(V(T))return C(this.j(C(T)));if(0>this.l(R)&&0>T.l(R))return d(this.m()*T.m());for(var m=this.g.length+T.g.length,y=[],v=0;v<2*m;v++)y[v]=0;for(v=0;v<this.g.length;v++)for(var I=0;I<T.g.length;I++){var A=this.i(v)>>>16,_=this.i(v)&65535,nt=T.i(I)>>>16,kn=T.i(I)&65535;y[2*v+2*I]+=_*kn,$(y,2*v+2*I),y[2*v+2*I+1]+=A*kn,$(y,2*v+2*I+1),y[2*v+2*I+1]+=_*nt,$(y,2*v+2*I+1),y[2*v+2*I+2]+=A*nt,$(y,2*v+2*I+2)}for(v=0;v<m;v++)y[v]=y[2*v+1]<<16|y[2*v];for(v=m;v<2*m;v++)y[v]=0;return new a(y,0)};function $(T,m){for(;(T[m]&65535)!=T[m];)T[m+1]+=T[m]>>>16,T[m]&=65535,m++}function q(T,m){this.g=T,this.h=m}function j(T,m){if(k(m))throw Error("division by zero");if(k(T))return new q(g,g);if(V(T))return m=j(C(T),m),new q(C(m.g),C(m.h));if(V(m))return m=j(T,C(m)),new q(C(m.g),m.h);if(30<T.g.length){if(V(T)||V(m))throw Error("slowDivide_ only works with positive integers.");for(var y=E,v=m;0>=v.l(T);)y=he(y),v=he(v);var I=Z(y,1),A=Z(v,1);for(v=Z(v,2),y=Z(y,2);!k(v);){var _=A.add(v);0>=_.l(T)&&(I=I.add(y),A=_),v=Z(v,1),y=Z(y,1)}return m=B(T,I.j(m)),new q(I,m)}for(I=g;0<=T.l(m);){for(y=Math.max(1,Math.floor(T.m()/m.m())),v=Math.ceil(Math.log(y)/Math.LN2),v=48>=v?1:Math.pow(2,v-48),A=d(y),_=A.j(m);V(_)||0<_.l(T);)y-=v,A=d(y),_=A.j(m);k(A)&&(A=E),I=I.add(A),T=B(T,_)}return new q(I,T)}n.A=function(T){return j(this,T).h},n.and=function(T){for(var m=Math.max(this.g.length,T.g.length),y=[],v=0;v<m;v++)y[v]=this.i(v)&T.i(v);return new a(y,this.h&T.h)},n.or=function(T){for(var m=Math.max(this.g.length,T.g.length),y=[],v=0;v<m;v++)y[v]=this.i(v)|T.i(v);return new a(y,this.h|T.h)},n.xor=function(T){for(var m=Math.max(this.g.length,T.g.length),y=[],v=0;v<m;v++)y[v]=this.i(v)^T.i(v);return new a(y,this.h^T.h)};function he(T){for(var m=T.g.length+1,y=[],v=0;v<m;v++)y[v]=T.i(v)<<1|T.i(v-1)>>>31;return new a(y,T.h)}function Z(T,m){var y=m>>5;m%=32;for(var v=T.g.length-y,I=[],A=0;A<v;A++)I[A]=0<m?T.i(A+y)>>>m|T.i(A+y+1)<<32-m:T.i(A+y);return new a(I,T.h)}r.prototype.digest=r.prototype.v,r.prototype.reset=r.prototype.s,r.prototype.update=r.prototype.u,Xl=r,a.prototype.add=a.prototype.add,a.prototype.multiply=a.prototype.j,a.prototype.modulo=a.prototype.A,a.prototype.compare=a.prototype.l,a.prototype.toNumber=a.prototype.m,a.prototype.toString=a.prototype.toString,a.prototype.getBits=a.prototype.i,a.fromNumber=d,a.fromString=p,jt=a}).apply(typeof nu<"u"?nu:typeof self<"u"?self:typeof window<"u"?window:{});var Xr=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var Jl,Yn,Zl,ci,eo,eh,th,nh;(function(){var n,e=typeof Object.defineProperties=="function"?Object.defineProperty:function(o,u,h){return o==Array.prototype||o==Object.prototype||(o[u]=h.value),o};function t(o){o=[typeof globalThis=="object"&&globalThis,o,typeof window=="object"&&window,typeof self=="object"&&self,typeof Xr=="object"&&Xr];for(var u=0;u<o.length;++u){var h=o[u];if(h&&h.Math==Math)return h}throw Error("Cannot find global object")}var r=t(this);function i(o,u){if(u)e:{var h=r;o=o.split(".");for(var f=0;f<o.length-1;f++){var w=o[f];if(!(w in h))break e;h=h[w]}o=o[o.length-1],f=h[o],u=u(f),u!=f&&u!=null&&e(h,o,{configurable:!0,writable:!0,value:u})}}function s(o,u){o instanceof String&&(o+="");var h=0,f=!1,w={next:function(){if(!f&&h<o.length){var b=h++;return{value:u(b,o[b]),done:!1}}return f=!0,{done:!0,value:void 0}}};return w[Symbol.iterator]=function(){return w},w}i("Array.prototype.values",function(o){return o||function(){return s(this,function(u,h){return h})}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var a=a||{},c=this||self;function l(o){var u=typeof o;return u=u!="object"?u:o?Array.isArray(o)?"array":u:"null",u=="array"||u=="object"&&typeof o.length=="number"}function d(o){var u=typeof o;return u=="object"&&o!=null||u=="function"}function p(o,u,h){return o.call.apply(o.bind,arguments)}function g(o,u,h){if(!o)throw Error();if(2<arguments.length){var f=Array.prototype.slice.call(arguments,2);return function(){var w=Array.prototype.slice.call(arguments);return Array.prototype.unshift.apply(w,f),o.apply(u,w)}}return function(){return o.apply(u,arguments)}}function E(o,u,h){return E=Function.prototype.bind&&Function.prototype.bind.toString().indexOf("native code")!=-1?p:g,E.apply(null,arguments)}function R(o,u){var h=Array.prototype.slice.call(arguments,1);return function(){var f=h.slice();return f.push.apply(f,arguments),o.apply(this,f)}}function k(o,u){function h(){}h.prototype=u.prototype,o.aa=u.prototype,o.prototype=new h,o.prototype.constructor=o,o.Qb=function(f,w,b){for(var N=Array(arguments.length-2),X=2;X<arguments.length;X++)N[X-2]=arguments[X];return u.prototype[w].apply(f,N)}}function V(o){const u=o.length;if(0<u){const h=Array(u);for(let f=0;f<u;f++)h[f]=o[f];return h}return[]}function C(o,u){for(let h=1;h<arguments.length;h++){const f=arguments[h];if(l(f)){const w=o.length||0,b=f.length||0;o.length=w+b;for(let N=0;N<b;N++)o[w+N]=f[N]}else o.push(f)}}class B{constructor(u,h){this.i=u,this.j=h,this.h=0,this.g=null}get(){let u;return 0<this.h?(this.h--,u=this.g,this.g=u.next,u.next=null):u=this.i(),u}}function $(o){return/^[\s\xa0]*$/.test(o)}function q(){var o=c.navigator;return o&&(o=o.userAgent)?o:""}function j(o){return j[" "](o),o}j[" "]=function(){};var he=q().indexOf("Gecko")!=-1&&!(q().toLowerCase().indexOf("webkit")!=-1&&q().indexOf("Edge")==-1)&&!(q().indexOf("Trident")!=-1||q().indexOf("MSIE")!=-1)&&q().indexOf("Edge")==-1;function Z(o,u,h){for(const f in o)u.call(h,o[f],f,o)}function T(o,u){for(const h in o)u.call(void 0,o[h],h,o)}function m(o){const u={};for(const h in o)u[h]=o[h];return u}const y="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function v(o,u){let h,f;for(let w=1;w<arguments.length;w++){f=arguments[w];for(h in f)o[h]=f[h];for(let b=0;b<y.length;b++)h=y[b],Object.prototype.hasOwnProperty.call(f,h)&&(o[h]=f[h])}}function I(o){var u=1;o=o.split(":");const h=[];for(;0<u&&o.length;)h.push(o.shift()),u--;return o.length&&h.push(o.join(":")),h}function A(o){c.setTimeout(()=>{throw o},0)}function _(){var o=ls;let u=null;return o.g&&(u=o.g,o.g=o.g.next,o.g||(o.h=null),u.next=null),u}class nt{constructor(){this.h=this.g=null}add(u,h){const f=kn.get();f.set(u,h),this.h?this.h.next=f:this.g=f,this.h=f}}var kn=new B(()=>new tf,o=>o.reset());class tf{constructor(){this.next=this.g=this.h=null}set(u,h){this.h=u,this.g=h,this.next=null}reset(){this.next=this.g=this.h=null}}let Nn,Dn=!1,ls=new nt,Ca=()=>{const o=c.Promise.resolve(void 0);Nn=()=>{o.then(nf)}};var nf=()=>{for(var o;o=_();){try{o.h.call(o.g)}catch(h){A(h)}var u=kn;u.j(o),100>u.h&&(u.h++,o.next=u.g,u.g=o)}Dn=!1};function pt(){this.s=this.s,this.C=this.C}pt.prototype.s=!1,pt.prototype.ma=function(){this.s||(this.s=!0,this.N())},pt.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function ge(o,u){this.type=o,this.g=this.target=u,this.defaultPrevented=!1}ge.prototype.h=function(){this.defaultPrevented=!0};var rf=function(){if(!c.addEventListener||!Object.defineProperty)return!1;var o=!1,u=Object.defineProperty({},"passive",{get:function(){o=!0}});try{const h=()=>{};c.addEventListener("test",h,u),c.removeEventListener("test",h,u)}catch{}return o}();function Vn(o,u){if(ge.call(this,o?o.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,o){var h=this.type=o.type,f=o.changedTouches&&o.changedTouches.length?o.changedTouches[0]:null;if(this.target=o.target||o.srcElement,this.g=u,u=o.relatedTarget){if(he){e:{try{j(u.nodeName);var w=!0;break e}catch{}w=!1}w||(u=null)}}else h=="mouseover"?u=o.fromElement:h=="mouseout"&&(u=o.toElement);this.relatedTarget=u,f?(this.clientX=f.clientX!==void 0?f.clientX:f.pageX,this.clientY=f.clientY!==void 0?f.clientY:f.pageY,this.screenX=f.screenX||0,this.screenY=f.screenY||0):(this.clientX=o.clientX!==void 0?o.clientX:o.pageX,this.clientY=o.clientY!==void 0?o.clientY:o.pageY,this.screenX=o.screenX||0,this.screenY=o.screenY||0),this.button=o.button,this.key=o.key||"",this.ctrlKey=o.ctrlKey,this.altKey=o.altKey,this.shiftKey=o.shiftKey,this.metaKey=o.metaKey,this.pointerId=o.pointerId||0,this.pointerType=typeof o.pointerType=="string"?o.pointerType:sf[o.pointerType]||"",this.state=o.state,this.i=o,o.defaultPrevented&&Vn.aa.h.call(this)}}k(Vn,ge);var sf={2:"touch",3:"pen",4:"mouse"};Vn.prototype.h=function(){Vn.aa.h.call(this);var o=this.i;o.preventDefault?o.preventDefault():o.returnValue=!1};var Nr="closure_listenable_"+(1e6*Math.random()|0),of=0;function af(o,u,h,f,w){this.listener=o,this.proxy=null,this.src=u,this.type=h,this.capture=!!f,this.ha=w,this.key=++of,this.da=this.fa=!1}function Dr(o){o.da=!0,o.listener=null,o.proxy=null,o.src=null,o.ha=null}function Vr(o){this.src=o,this.g={},this.h=0}Vr.prototype.add=function(o,u,h,f,w){var b=o.toString();o=this.g[b],o||(o=this.g[b]=[],this.h++);var N=ds(o,u,f,w);return-1<N?(u=o[N],h||(u.fa=!1)):(u=new af(u,this.src,b,!!f,w),u.fa=h,o.push(u)),u};function hs(o,u){var h=u.type;if(h in o.g){var f=o.g[h],w=Array.prototype.indexOf.call(f,u,void 0),b;(b=0<=w)&&Array.prototype.splice.call(f,w,1),b&&(Dr(u),o.g[h].length==0&&(delete o.g[h],o.h--))}}function ds(o,u,h,f){for(var w=0;w<o.length;++w){var b=o[w];if(!b.da&&b.listener==u&&b.capture==!!h&&b.ha==f)return w}return-1}var fs="closure_lm_"+(1e6*Math.random()|0),ps={};function ka(o,u,h,f,w){if(Array.isArray(u)){for(var b=0;b<u.length;b++)ka(o,u[b],h,f,w);return null}return h=Va(h),o&&o[Nr]?o.K(u,h,d(f)?!!f.capture:!!f,w):cf(o,u,h,!1,f,w)}function cf(o,u,h,f,w,b){if(!u)throw Error("Invalid event type");var N=d(w)?!!w.capture:!!w,X=gs(o);if(X||(o[fs]=X=new Vr(o)),h=X.add(u,h,f,N,b),h.proxy)return h;if(f=uf(),h.proxy=f,f.src=o,f.listener=h,o.addEventListener)rf||(w=N),w===void 0&&(w=!1),o.addEventListener(u.toString(),f,w);else if(o.attachEvent)o.attachEvent(Da(u.toString()),f);else if(o.addListener&&o.removeListener)o.addListener(f);else throw Error("addEventListener and attachEvent are unavailable.");return h}function uf(){function o(h){return u.call(o.src,o.listener,h)}const u=lf;return o}function Na(o,u,h,f,w){if(Array.isArray(u))for(var b=0;b<u.length;b++)Na(o,u[b],h,f,w);else f=d(f)?!!f.capture:!!f,h=Va(h),o&&o[Nr]?(o=o.i,u=String(u).toString(),u in o.g&&(b=o.g[u],h=ds(b,h,f,w),-1<h&&(Dr(b[h]),Array.prototype.splice.call(b,h,1),b.length==0&&(delete o.g[u],o.h--)))):o&&(o=gs(o))&&(u=o.g[u.toString()],o=-1,u&&(o=ds(u,h,f,w)),(h=-1<o?u[o]:null)&&ms(h))}function ms(o){if(typeof o!="number"&&o&&!o.da){var u=o.src;if(u&&u[Nr])hs(u.i,o);else{var h=o.type,f=o.proxy;u.removeEventListener?u.removeEventListener(h,f,o.capture):u.detachEvent?u.detachEvent(Da(h),f):u.addListener&&u.removeListener&&u.removeListener(f),(h=gs(u))?(hs(h,o),h.h==0&&(h.src=null,u[fs]=null)):Dr(o)}}}function Da(o){return o in ps?ps[o]:ps[o]="on"+o}function lf(o,u){if(o.da)o=!0;else{u=new Vn(u,this);var h=o.listener,f=o.ha||o.src;o.fa&&ms(o),o=h.call(f,u)}return o}function gs(o){return o=o[fs],o instanceof Vr?o:null}var _s="__closure_events_fn_"+(1e9*Math.random()>>>0);function Va(o){return typeof o=="function"?o:(o[_s]||(o[_s]=function(u){return o.handleEvent(u)}),o[_s])}function _e(){pt.call(this),this.i=new Vr(this),this.M=this,this.F=null}k(_e,pt),_e.prototype[Nr]=!0,_e.prototype.removeEventListener=function(o,u,h,f){Na(this,o,u,h,f)};function Re(o,u){var h,f=o.F;if(f)for(h=[];f;f=f.F)h.push(f);if(o=o.M,f=u.type||u,typeof u=="string")u=new ge(u,o);else if(u instanceof ge)u.target=u.target||o;else{var w=u;u=new ge(f,o),v(u,w)}if(w=!0,h)for(var b=h.length-1;0<=b;b--){var N=u.g=h[b];w=Or(N,f,!0,u)&&w}if(N=u.g=o,w=Or(N,f,!0,u)&&w,w=Or(N,f,!1,u)&&w,h)for(b=0;b<h.length;b++)N=u.g=h[b],w=Or(N,f,!1,u)&&w}_e.prototype.N=function(){if(_e.aa.N.call(this),this.i){var o=this.i,u;for(u in o.g){for(var h=o.g[u],f=0;f<h.length;f++)Dr(h[f]);delete o.g[u],o.h--}}this.F=null},_e.prototype.K=function(o,u,h,f){return this.i.add(String(o),u,!1,h,f)},_e.prototype.L=function(o,u,h,f){return this.i.add(String(o),u,!0,h,f)};function Or(o,u,h,f){if(u=o.i.g[String(u)],!u)return!0;u=u.concat();for(var w=!0,b=0;b<u.length;++b){var N=u[b];if(N&&!N.da&&N.capture==h){var X=N.listener,de=N.ha||N.src;N.fa&&hs(o.i,N),w=X.call(de,f)!==!1&&w}}return w&&!f.defaultPrevented}function Oa(o,u,h){if(typeof o=="function")h&&(o=E(o,h));else if(o&&typeof o.handleEvent=="function")o=E(o.handleEvent,o);else throw Error("Invalid listener argument");return 2147483647<Number(u)?-1:c.setTimeout(o,u||0)}function La(o){o.g=Oa(()=>{o.g=null,o.i&&(o.i=!1,La(o))},o.l);const u=o.h;o.h=null,o.m.apply(null,u)}class hf extends pt{constructor(u,h){super(),this.m=u,this.l=h,this.h=null,this.i=!1,this.g=null}j(u){this.h=arguments,this.g?this.i=!0:La(this)}N(){super.N(),this.g&&(c.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function On(o){pt.call(this),this.h=o,this.g={}}k(On,pt);var Ma=[];function xa(o){Z(o.g,function(u,h){this.g.hasOwnProperty(h)&&ms(u)},o),o.g={}}On.prototype.N=function(){On.aa.N.call(this),xa(this)},On.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var ys=c.JSON.stringify,df=c.JSON.parse,ff=class{stringify(o){return c.JSON.stringify(o,void 0)}parse(o){return c.JSON.parse(o,void 0)}};function vs(){}vs.prototype.h=null;function Ua(o){return o.h||(o.h=o.i())}function Fa(){}var Ln={OPEN:"a",kb:"b",Ja:"c",wb:"d"};function Es(){ge.call(this,"d")}k(Es,ge);function Ts(){ge.call(this,"c")}k(Ts,ge);var Lt={},Ba=null;function Lr(){return Ba=Ba||new _e}Lt.La="serverreachability";function qa(o){ge.call(this,Lt.La,o)}k(qa,ge);function Mn(o){const u=Lr();Re(u,new qa(u))}Lt.STAT_EVENT="statevent";function $a(o,u){ge.call(this,Lt.STAT_EVENT,o),this.stat=u}k($a,ge);function be(o){const u=Lr();Re(u,new $a(u,o))}Lt.Ma="timingevent";function ja(o,u){ge.call(this,Lt.Ma,o),this.size=u}k(ja,ge);function xn(o,u){if(typeof o!="function")throw Error("Fn must not be null and must be a function");return c.setTimeout(function(){o()},u)}function Un(){this.g=!0}Un.prototype.xa=function(){this.g=!1};function pf(o,u,h,f,w,b){o.info(function(){if(o.g)if(b)for(var N="",X=b.split("&"),de=0;de<X.length;de++){var K=X[de].split("=");if(1<K.length){var ye=K[0];K=K[1];var ve=ye.split("_");N=2<=ve.length&&ve[1]=="type"?N+(ye+"="+K+"&"):N+(ye+"=redacted&")}}else N=null;else N=b;return"XMLHTTP REQ ("+f+") [attempt "+w+"]: "+u+`
`+h+`
`+N})}function mf(o,u,h,f,w,b,N){o.info(function(){return"XMLHTTP RESP ("+f+") [ attempt "+w+"]: "+u+`
`+h+`
`+b+" "+N})}function nn(o,u,h,f){o.info(function(){return"XMLHTTP TEXT ("+u+"): "+_f(o,h)+(f?" "+f:"")})}function gf(o,u){o.info(function(){return"TIMEOUT: "+u})}Un.prototype.info=function(){};function _f(o,u){if(!o.g)return u;if(!u)return null;try{var h=JSON.parse(u);if(h){for(o=0;o<h.length;o++)if(Array.isArray(h[o])){var f=h[o];if(!(2>f.length)){var w=f[1];if(Array.isArray(w)&&!(1>w.length)){var b=w[0];if(b!="noop"&&b!="stop"&&b!="close")for(var N=1;N<w.length;N++)w[N]=""}}}}return ys(h)}catch{return u}}var Mr={NO_ERROR:0,gb:1,tb:2,sb:3,nb:4,rb:5,ub:6,Ia:7,TIMEOUT:8,xb:9},za={lb:"complete",Hb:"success",Ja:"error",Ia:"abort",zb:"ready",Ab:"readystatechange",TIMEOUT:"timeout",vb:"incrementaldata",yb:"progress",ob:"downloadprogress",Pb:"uploadprogress"},Is;function xr(){}k(xr,vs),xr.prototype.g=function(){return new XMLHttpRequest},xr.prototype.i=function(){return{}},Is=new xr;function mt(o,u,h,f){this.j=o,this.i=u,this.l=h,this.R=f||1,this.U=new On(this),this.I=45e3,this.H=null,this.o=!1,this.m=this.A=this.v=this.L=this.F=this.S=this.B=null,this.D=[],this.g=null,this.C=0,this.s=this.u=null,this.X=-1,this.J=!1,this.O=0,this.M=null,this.W=this.K=this.T=this.P=!1,this.h=new Ha}function Ha(){this.i=null,this.g="",this.h=!1}var Ga={},ws={};function As(o,u,h){o.L=1,o.v=qr(rt(u)),o.m=h,o.P=!0,Wa(o,null)}function Wa(o,u){o.F=Date.now(),Ur(o),o.A=rt(o.v);var h=o.A,f=o.R;Array.isArray(f)||(f=[String(f)]),ac(h.i,"t",f),o.C=0,h=o.j.J,o.h=new Ha,o.g=Rc(o.j,h?u:null,!o.m),0<o.O&&(o.M=new hf(E(o.Y,o,o.g),o.O)),u=o.U,h=o.g,f=o.ca;var w="readystatechange";Array.isArray(w)||(w&&(Ma[0]=w.toString()),w=Ma);for(var b=0;b<w.length;b++){var N=ka(h,w[b],f||u.handleEvent,!1,u.h||u);if(!N)break;u.g[N.key]=N}u=o.H?m(o.H):{},o.m?(o.u||(o.u="POST"),u["Content-Type"]="application/x-www-form-urlencoded",o.g.ea(o.A,o.u,o.m,u)):(o.u="GET",o.g.ea(o.A,o.u,null,u)),Mn(),pf(o.i,o.u,o.A,o.l,o.R,o.m)}mt.prototype.ca=function(o){o=o.target;const u=this.M;u&&it(o)==3?u.j():this.Y(o)},mt.prototype.Y=function(o){try{if(o==this.g)e:{const ve=it(this.g);var u=this.g.Ba();const on=this.g.Z();if(!(3>ve)&&(ve!=3||this.g&&(this.h.h||this.g.oa()||pc(this.g)))){this.J||ve!=4||u==7||(u==8||0>=on?Mn(3):Mn(2)),Rs(this);var h=this.g.Z();this.X=h;t:if(Ka(this)){var f=pc(this.g);o="";var w=f.length,b=it(this.g)==4;if(!this.h.i){if(typeof TextDecoder>"u"){Mt(this),Fn(this);var N="";break t}this.h.i=new c.TextDecoder}for(u=0;u<w;u++)this.h.h=!0,o+=this.h.i.decode(f[u],{stream:!(b&&u==w-1)});f.length=0,this.h.g+=o,this.C=0,N=this.h.g}else N=this.g.oa();if(this.o=h==200,mf(this.i,this.u,this.A,this.l,this.R,ve,h),this.o){if(this.T&&!this.K){t:{if(this.g){var X,de=this.g;if((X=de.g?de.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!$(X)){var K=X;break t}}K=null}if(h=K)nn(this.i,this.l,h,"Initial handshake response via X-HTTP-Initial-Response"),this.K=!0,bs(this,h);else{this.o=!1,this.s=3,be(12),Mt(this),Fn(this);break e}}if(this.P){h=!0;let qe;for(;!this.J&&this.C<N.length;)if(qe=yf(this,N),qe==ws){ve==4&&(this.s=4,be(14),h=!1),nn(this.i,this.l,null,"[Incomplete Response]");break}else if(qe==Ga){this.s=4,be(15),nn(this.i,this.l,N,"[Invalid Chunk]"),h=!1;break}else nn(this.i,this.l,qe,null),bs(this,qe);if(Ka(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),ve!=4||N.length!=0||this.h.h||(this.s=1,be(16),h=!1),this.o=this.o&&h,!h)nn(this.i,this.l,N,"[Invalid Chunked Response]"),Mt(this),Fn(this);else if(0<N.length&&!this.W){this.W=!0;var ye=this.j;ye.g==this&&ye.ba&&!ye.M&&(ye.j.info("Great, no buffering proxy detected. Bytes received: "+N.length),Ds(ye),ye.M=!0,be(11))}}else nn(this.i,this.l,N,null),bs(this,N);ve==4&&Mt(this),this.o&&!this.J&&(ve==4?Tc(this.j,this):(this.o=!1,Ur(this)))}else Lf(this.g),h==400&&0<N.indexOf("Unknown SID")?(this.s=3,be(12)):(this.s=0,be(13)),Mt(this),Fn(this)}}}catch{}finally{}};function Ka(o){return o.g?o.u=="GET"&&o.L!=2&&o.j.Ca:!1}function yf(o,u){var h=o.C,f=u.indexOf(`
`,h);return f==-1?ws:(h=Number(u.substring(h,f)),isNaN(h)?Ga:(f+=1,f+h>u.length?ws:(u=u.slice(f,f+h),o.C=f+h,u)))}mt.prototype.cancel=function(){this.J=!0,Mt(this)};function Ur(o){o.S=Date.now()+o.I,Qa(o,o.I)}function Qa(o,u){if(o.B!=null)throw Error("WatchDog timer not null");o.B=xn(E(o.ba,o),u)}function Rs(o){o.B&&(c.clearTimeout(o.B),o.B=null)}mt.prototype.ba=function(){this.B=null;const o=Date.now();0<=o-this.S?(gf(this.i,this.A),this.L!=2&&(Mn(),be(17)),Mt(this),this.s=2,Fn(this)):Qa(this,this.S-o)};function Fn(o){o.j.G==0||o.J||Tc(o.j,o)}function Mt(o){Rs(o);var u=o.M;u&&typeof u.ma=="function"&&u.ma(),o.M=null,xa(o.U),o.g&&(u=o.g,o.g=null,u.abort(),u.ma())}function bs(o,u){try{var h=o.j;if(h.G!=0&&(h.g==o||Ss(h.h,o))){if(!o.K&&Ss(h.h,o)&&h.G==3){try{var f=h.Da.g.parse(u)}catch{f=null}if(Array.isArray(f)&&f.length==3){var w=f;if(w[0]==0){e:if(!h.u){if(h.g)if(h.g.F+3e3<o.F)Wr(h),Hr(h);else break e;Ns(h),be(18)}}else h.za=w[1],0<h.za-h.T&&37500>w[2]&&h.F&&h.v==0&&!h.C&&(h.C=xn(E(h.Za,h),6e3));if(1>=Ja(h.h)&&h.ca){try{h.ca()}catch{}h.ca=void 0}}else Ut(h,11)}else if((o.K||h.g==o)&&Wr(h),!$(u))for(w=h.Da.g.parse(u),u=0;u<w.length;u++){let K=w[u];if(h.T=K[0],K=K[1],h.G==2)if(K[0]=="c"){h.K=K[1],h.ia=K[2];const ye=K[3];ye!=null&&(h.la=ye,h.j.info("VER="+h.la));const ve=K[4];ve!=null&&(h.Aa=ve,h.j.info("SVER="+h.Aa));const on=K[5];on!=null&&typeof on=="number"&&0<on&&(f=1.5*on,h.L=f,h.j.info("backChannelRequestTimeoutMs_="+f)),f=h;const qe=o.g;if(qe){const Qr=qe.g?qe.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(Qr){var b=f.h;b.g||Qr.indexOf("spdy")==-1&&Qr.indexOf("quic")==-1&&Qr.indexOf("h2")==-1||(b.j=b.l,b.g=new Set,b.h&&(Ps(b,b.h),b.h=null))}if(f.D){const Vs=qe.g?qe.g.getResponseHeader("X-HTTP-Session-Id"):null;Vs&&(f.ya=Vs,ee(f.I,f.D,Vs))}}h.G=3,h.l&&h.l.ua(),h.ba&&(h.R=Date.now()-o.F,h.j.info("Handshake RTT: "+h.R+"ms")),f=h;var N=o;if(f.qa=Ac(f,f.J?f.ia:null,f.W),N.K){Za(f.h,N);var X=N,de=f.L;de&&(X.I=de),X.B&&(Rs(X),Ur(X)),f.g=N}else vc(f);0<h.i.length&&Gr(h)}else K[0]!="stop"&&K[0]!="close"||Ut(h,7);else h.G==3&&(K[0]=="stop"||K[0]=="close"?K[0]=="stop"?Ut(h,7):ks(h):K[0]!="noop"&&h.l&&h.l.ta(K),h.v=0)}}Mn(4)}catch{}}var vf=class{constructor(o,u){this.g=o,this.map=u}};function Ya(o){this.l=o||10,c.PerformanceNavigationTiming?(o=c.performance.getEntriesByType("navigation"),o=0<o.length&&(o[0].nextHopProtocol=="hq"||o[0].nextHopProtocol=="h2")):o=!!(c.chrome&&c.chrome.loadTimes&&c.chrome.loadTimes()&&c.chrome.loadTimes().wasFetchedViaSpdy),this.j=o?this.l:1,this.g=null,1<this.j&&(this.g=new Set),this.h=null,this.i=[]}function Xa(o){return o.h?!0:o.g?o.g.size>=o.j:!1}function Ja(o){return o.h?1:o.g?o.g.size:0}function Ss(o,u){return o.h?o.h==u:o.g?o.g.has(u):!1}function Ps(o,u){o.g?o.g.add(u):o.h=u}function Za(o,u){o.h&&o.h==u?o.h=null:o.g&&o.g.has(u)&&o.g.delete(u)}Ya.prototype.cancel=function(){if(this.i=ec(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const o of this.g.values())o.cancel();this.g.clear()}};function ec(o){if(o.h!=null)return o.i.concat(o.h.D);if(o.g!=null&&o.g.size!==0){let u=o.i;for(const h of o.g.values())u=u.concat(h.D);return u}return V(o.i)}function Ef(o){if(o.V&&typeof o.V=="function")return o.V();if(typeof Map<"u"&&o instanceof Map||typeof Set<"u"&&o instanceof Set)return Array.from(o.values());if(typeof o=="string")return o.split("");if(l(o)){for(var u=[],h=o.length,f=0;f<h;f++)u.push(o[f]);return u}u=[],h=0;for(f in o)u[h++]=o[f];return u}function Tf(o){if(o.na&&typeof o.na=="function")return o.na();if(!o.V||typeof o.V!="function"){if(typeof Map<"u"&&o instanceof Map)return Array.from(o.keys());if(!(typeof Set<"u"&&o instanceof Set)){if(l(o)||typeof o=="string"){var u=[];o=o.length;for(var h=0;h<o;h++)u.push(h);return u}u=[],h=0;for(const f in o)u[h++]=f;return u}}}function tc(o,u){if(o.forEach&&typeof o.forEach=="function")o.forEach(u,void 0);else if(l(o)||typeof o=="string")Array.prototype.forEach.call(o,u,void 0);else for(var h=Tf(o),f=Ef(o),w=f.length,b=0;b<w;b++)u.call(void 0,f[b],h&&h[b],o)}var nc=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function If(o,u){if(o){o=o.split("&");for(var h=0;h<o.length;h++){var f=o[h].indexOf("="),w=null;if(0<=f){var b=o[h].substring(0,f);w=o[h].substring(f+1)}else b=o[h];u(b,w?decodeURIComponent(w.replace(/\+/g," ")):"")}}}function xt(o){if(this.g=this.o=this.j="",this.s=null,this.m=this.l="",this.h=!1,o instanceof xt){this.h=o.h,Fr(this,o.j),this.o=o.o,this.g=o.g,Br(this,o.s),this.l=o.l;var u=o.i,h=new $n;h.i=u.i,u.g&&(h.g=new Map(u.g),h.h=u.h),rc(this,h),this.m=o.m}else o&&(u=String(o).match(nc))?(this.h=!1,Fr(this,u[1]||"",!0),this.o=Bn(u[2]||""),this.g=Bn(u[3]||"",!0),Br(this,u[4]),this.l=Bn(u[5]||"",!0),rc(this,u[6]||"",!0),this.m=Bn(u[7]||"")):(this.h=!1,this.i=new $n(null,this.h))}xt.prototype.toString=function(){var o=[],u=this.j;u&&o.push(qn(u,ic,!0),":");var h=this.g;return(h||u=="file")&&(o.push("//"),(u=this.o)&&o.push(qn(u,ic,!0),"@"),o.push(encodeURIComponent(String(h)).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),h=this.s,h!=null&&o.push(":",String(h))),(h=this.l)&&(this.g&&h.charAt(0)!="/"&&o.push("/"),o.push(qn(h,h.charAt(0)=="/"?Rf:Af,!0))),(h=this.i.toString())&&o.push("?",h),(h=this.m)&&o.push("#",qn(h,Sf)),o.join("")};function rt(o){return new xt(o)}function Fr(o,u,h){o.j=h?Bn(u,!0):u,o.j&&(o.j=o.j.replace(/:$/,""))}function Br(o,u){if(u){if(u=Number(u),isNaN(u)||0>u)throw Error("Bad port number "+u);o.s=u}else o.s=null}function rc(o,u,h){u instanceof $n?(o.i=u,Pf(o.i,o.h)):(h||(u=qn(u,bf)),o.i=new $n(u,o.h))}function ee(o,u,h){o.i.set(u,h)}function qr(o){return ee(o,"zx",Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^Date.now()).toString(36)),o}function Bn(o,u){return o?u?decodeURI(o.replace(/%25/g,"%2525")):decodeURIComponent(o):""}function qn(o,u,h){return typeof o=="string"?(o=encodeURI(o).replace(u,wf),h&&(o=o.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),o):null}function wf(o){return o=o.charCodeAt(0),"%"+(o>>4&15).toString(16)+(o&15).toString(16)}var ic=/[#\/\?@]/g,Af=/[#\?:]/g,Rf=/[#\?]/g,bf=/[#\?@]/g,Sf=/#/g;function $n(o,u){this.h=this.g=null,this.i=o||null,this.j=!!u}function gt(o){o.g||(o.g=new Map,o.h=0,o.i&&If(o.i,function(u,h){o.add(decodeURIComponent(u.replace(/\+/g," ")),h)}))}n=$n.prototype,n.add=function(o,u){gt(this),this.i=null,o=rn(this,o);var h=this.g.get(o);return h||this.g.set(o,h=[]),h.push(u),this.h+=1,this};function sc(o,u){gt(o),u=rn(o,u),o.g.has(u)&&(o.i=null,o.h-=o.g.get(u).length,o.g.delete(u))}function oc(o,u){return gt(o),u=rn(o,u),o.g.has(u)}n.forEach=function(o,u){gt(this),this.g.forEach(function(h,f){h.forEach(function(w){o.call(u,w,f,this)},this)},this)},n.na=function(){gt(this);const o=Array.from(this.g.values()),u=Array.from(this.g.keys()),h=[];for(let f=0;f<u.length;f++){const w=o[f];for(let b=0;b<w.length;b++)h.push(u[f])}return h},n.V=function(o){gt(this);let u=[];if(typeof o=="string")oc(this,o)&&(u=u.concat(this.g.get(rn(this,o))));else{o=Array.from(this.g.values());for(let h=0;h<o.length;h++)u=u.concat(o[h])}return u},n.set=function(o,u){return gt(this),this.i=null,o=rn(this,o),oc(this,o)&&(this.h-=this.g.get(o).length),this.g.set(o,[u]),this.h+=1,this},n.get=function(o,u){return o?(o=this.V(o),0<o.length?String(o[0]):u):u};function ac(o,u,h){sc(o,u),0<h.length&&(o.i=null,o.g.set(rn(o,u),V(h)),o.h+=h.length)}n.toString=function(){if(this.i)return this.i;if(!this.g)return"";const o=[],u=Array.from(this.g.keys());for(var h=0;h<u.length;h++){var f=u[h];const b=encodeURIComponent(String(f)),N=this.V(f);for(f=0;f<N.length;f++){var w=b;N[f]!==""&&(w+="="+encodeURIComponent(String(N[f]))),o.push(w)}}return this.i=o.join("&")};function rn(o,u){return u=String(u),o.j&&(u=u.toLowerCase()),u}function Pf(o,u){u&&!o.j&&(gt(o),o.i=null,o.g.forEach(function(h,f){var w=f.toLowerCase();f!=w&&(sc(this,f),ac(this,w,h))},o)),o.j=u}function Cf(o,u){const h=new Un;if(c.Image){const f=new Image;f.onload=R(_t,h,"TestLoadImage: loaded",!0,u,f),f.onerror=R(_t,h,"TestLoadImage: error",!1,u,f),f.onabort=R(_t,h,"TestLoadImage: abort",!1,u,f),f.ontimeout=R(_t,h,"TestLoadImage: timeout",!1,u,f),c.setTimeout(function(){f.ontimeout&&f.ontimeout()},1e4),f.src=o}else u(!1)}function kf(o,u){const h=new Un,f=new AbortController,w=setTimeout(()=>{f.abort(),_t(h,"TestPingServer: timeout",!1,u)},1e4);fetch(o,{signal:f.signal}).then(b=>{clearTimeout(w),b.ok?_t(h,"TestPingServer: ok",!0,u):_t(h,"TestPingServer: server error",!1,u)}).catch(()=>{clearTimeout(w),_t(h,"TestPingServer: error",!1,u)})}function _t(o,u,h,f,w){try{w&&(w.onload=null,w.onerror=null,w.onabort=null,w.ontimeout=null),f(h)}catch{}}function Nf(){this.g=new ff}function Df(o,u,h){const f=h||"";try{tc(o,function(w,b){let N=w;d(w)&&(N=ys(w)),u.push(f+b+"="+encodeURIComponent(N))})}catch(w){throw u.push(f+"type="+encodeURIComponent("_badmap")),w}}function $r(o){this.l=o.Ub||null,this.j=o.eb||!1}k($r,vs),$r.prototype.g=function(){return new jr(this.l,this.j)},$r.prototype.i=function(o){return function(){return o}}({});function jr(o,u){_e.call(this),this.D=o,this.o=u,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.u=new Headers,this.h=null,this.B="GET",this.A="",this.g=!1,this.v=this.j=this.l=null}k(jr,_e),n=jr.prototype,n.open=function(o,u){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.B=o,this.A=u,this.readyState=1,zn(this)},n.send=function(o){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");this.g=!0;const u={headers:this.u,method:this.B,credentials:this.m,cache:void 0};o&&(u.body=o),(this.D||c).fetch(new Request(this.A,u)).then(this.Sa.bind(this),this.ga.bind(this))},n.abort=function(){this.response=this.responseText="",this.u=new Headers,this.status=0,this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),1<=this.readyState&&this.g&&this.readyState!=4&&(this.g=!1,jn(this)),this.readyState=0},n.Sa=function(o){if(this.g&&(this.l=o,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=o.headers,this.readyState=2,zn(this)),this.g&&(this.readyState=3,zn(this),this.g)))if(this.responseType==="arraybuffer")o.arrayBuffer().then(this.Qa.bind(this),this.ga.bind(this));else if(typeof c.ReadableStream<"u"&&"body"in o){if(this.j=o.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.v=new TextDecoder;cc(this)}else o.text().then(this.Ra.bind(this),this.ga.bind(this))};function cc(o){o.j.read().then(o.Pa.bind(o)).catch(o.ga.bind(o))}n.Pa=function(o){if(this.g){if(this.o&&o.value)this.response.push(o.value);else if(!this.o){var u=o.value?o.value:new Uint8Array(0);(u=this.v.decode(u,{stream:!o.done}))&&(this.response=this.responseText+=u)}o.done?jn(this):zn(this),this.readyState==3&&cc(this)}},n.Ra=function(o){this.g&&(this.response=this.responseText=o,jn(this))},n.Qa=function(o){this.g&&(this.response=o,jn(this))},n.ga=function(){this.g&&jn(this)};function jn(o){o.readyState=4,o.l=null,o.j=null,o.v=null,zn(o)}n.setRequestHeader=function(o,u){this.u.append(o,u)},n.getResponseHeader=function(o){return this.h&&this.h.get(o.toLowerCase())||""},n.getAllResponseHeaders=function(){if(!this.h)return"";const o=[],u=this.h.entries();for(var h=u.next();!h.done;)h=h.value,o.push(h[0]+": "+h[1]),h=u.next();return o.join(`\r
`)};function zn(o){o.onreadystatechange&&o.onreadystatechange.call(o)}Object.defineProperty(jr.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(o){this.m=o?"include":"same-origin"}});function uc(o){let u="";return Z(o,function(h,f){u+=f,u+=":",u+=h,u+=`\r
`}),u}function Cs(o,u,h){e:{for(f in h){var f=!1;break e}f=!0}f||(h=uc(h),typeof o=="string"?h!=null&&encodeURIComponent(String(h)):ee(o,u,h))}function ne(o){_e.call(this),this.headers=new Map,this.o=o||null,this.h=!1,this.v=this.g=null,this.D="",this.m=0,this.l="",this.j=this.B=this.u=this.A=!1,this.I=null,this.H="",this.J=!1}k(ne,_e);var Vf=/^https?$/i,Of=["POST","PUT"];n=ne.prototype,n.Ha=function(o){this.J=o},n.ea=function(o,u,h,f){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+o);u=u?u.toUpperCase():"GET",this.D=o,this.l="",this.m=0,this.A=!1,this.h=!0,this.g=this.o?this.o.g():Is.g(),this.v=this.o?Ua(this.o):Ua(Is),this.g.onreadystatechange=E(this.Ea,this);try{this.B=!0,this.g.open(u,String(o),!0),this.B=!1}catch(b){lc(this,b);return}if(o=h||"",h=new Map(this.headers),f)if(Object.getPrototypeOf(f)===Object.prototype)for(var w in f)h.set(w,f[w]);else if(typeof f.keys=="function"&&typeof f.get=="function")for(const b of f.keys())h.set(b,f.get(b));else throw Error("Unknown input type for opt_headers: "+String(f));f=Array.from(h.keys()).find(b=>b.toLowerCase()=="content-type"),w=c.FormData&&o instanceof c.FormData,!(0<=Array.prototype.indexOf.call(Of,u,void 0))||f||w||h.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[b,N]of h)this.g.setRequestHeader(b,N);this.H&&(this.g.responseType=this.H),"withCredentials"in this.g&&this.g.withCredentials!==this.J&&(this.g.withCredentials=this.J);try{fc(this),this.u=!0,this.g.send(o),this.u=!1}catch(b){lc(this,b)}};function lc(o,u){o.h=!1,o.g&&(o.j=!0,o.g.abort(),o.j=!1),o.l=u,o.m=5,hc(o),zr(o)}function hc(o){o.A||(o.A=!0,Re(o,"complete"),Re(o,"error"))}n.abort=function(o){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.m=o||7,Re(this,"complete"),Re(this,"abort"),zr(this))},n.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),zr(this,!0)),ne.aa.N.call(this)},n.Ea=function(){this.s||(this.B||this.u||this.j?dc(this):this.bb())},n.bb=function(){dc(this)};function dc(o){if(o.h&&typeof a<"u"&&(!o.v[1]||it(o)!=4||o.Z()!=2)){if(o.u&&it(o)==4)Oa(o.Ea,0,o);else if(Re(o,"readystatechange"),it(o)==4){o.h=!1;try{const N=o.Z();e:switch(N){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var u=!0;break e;default:u=!1}var h;if(!(h=u)){var f;if(f=N===0){var w=String(o.D).match(nc)[1]||null;!w&&c.self&&c.self.location&&(w=c.self.location.protocol.slice(0,-1)),f=!Vf.test(w?w.toLowerCase():"")}h=f}if(h)Re(o,"complete"),Re(o,"success");else{o.m=6;try{var b=2<it(o)?o.g.statusText:""}catch{b=""}o.l=b+" ["+o.Z()+"]",hc(o)}}finally{zr(o)}}}}function zr(o,u){if(o.g){fc(o);const h=o.g,f=o.v[0]?()=>{}:null;o.g=null,o.v=null,u||Re(o,"ready");try{h.onreadystatechange=f}catch{}}}function fc(o){o.I&&(c.clearTimeout(o.I),o.I=null)}n.isActive=function(){return!!this.g};function it(o){return o.g?o.g.readyState:0}n.Z=function(){try{return 2<it(this)?this.g.status:-1}catch{return-1}},n.oa=function(){try{return this.g?this.g.responseText:""}catch{return""}},n.Oa=function(o){if(this.g){var u=this.g.responseText;return o&&u.indexOf(o)==0&&(u=u.substring(o.length)),df(u)}};function pc(o){try{if(!o.g)return null;if("response"in o.g)return o.g.response;switch(o.H){case"":case"text":return o.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in o.g)return o.g.mozResponseArrayBuffer}return null}catch{return null}}function Lf(o){const u={};o=(o.g&&2<=it(o)&&o.g.getAllResponseHeaders()||"").split(`\r
`);for(let f=0;f<o.length;f++){if($(o[f]))continue;var h=I(o[f]);const w=h[0];if(h=h[1],typeof h!="string")continue;h=h.trim();const b=u[w]||[];u[w]=b,b.push(h)}T(u,function(f){return f.join(", ")})}n.Ba=function(){return this.m},n.Ka=function(){return typeof this.l=="string"?this.l:String(this.l)};function Hn(o,u,h){return h&&h.internalChannelParams&&h.internalChannelParams[o]||u}function mc(o){this.Aa=0,this.i=[],this.j=new Un,this.ia=this.qa=this.I=this.W=this.g=this.ya=this.D=this.H=this.m=this.S=this.o=null,this.Ya=this.U=0,this.Va=Hn("failFast",!1,o),this.F=this.C=this.u=this.s=this.l=null,this.X=!0,this.za=this.T=-1,this.Y=this.v=this.B=0,this.Ta=Hn("baseRetryDelayMs",5e3,o),this.cb=Hn("retryDelaySeedMs",1e4,o),this.Wa=Hn("forwardChannelMaxRetries",2,o),this.wa=Hn("forwardChannelRequestTimeoutMs",2e4,o),this.pa=o&&o.xmlHttpFactory||void 0,this.Xa=o&&o.Tb||void 0,this.Ca=o&&o.useFetchStreams||!1,this.L=void 0,this.J=o&&o.supportsCrossDomainXhr||!1,this.K="",this.h=new Ya(o&&o.concurrentRequestLimit),this.Da=new Nf,this.P=o&&o.fastHandshake||!1,this.O=o&&o.encodeInitMessageHeaders||!1,this.P&&this.O&&(this.O=!1),this.Ua=o&&o.Rb||!1,o&&o.xa&&this.j.xa(),o&&o.forceLongPolling&&(this.X=!1),this.ba=!this.P&&this.X&&o&&o.detectBufferingProxy||!1,this.ja=void 0,o&&o.longPollingTimeout&&0<o.longPollingTimeout&&(this.ja=o.longPollingTimeout),this.ca=void 0,this.R=0,this.M=!1,this.ka=this.A=null}n=mc.prototype,n.la=8,n.G=1,n.connect=function(o,u,h,f){be(0),this.W=o,this.H=u||{},h&&f!==void 0&&(this.H.OSID=h,this.H.OAID=f),this.F=this.X,this.I=Ac(this,null,this.W),Gr(this)};function ks(o){if(gc(o),o.G==3){var u=o.U++,h=rt(o.I);if(ee(h,"SID",o.K),ee(h,"RID",u),ee(h,"TYPE","terminate"),Gn(o,h),u=new mt(o,o.j,u),u.L=2,u.v=qr(rt(h)),h=!1,c.navigator&&c.navigator.sendBeacon)try{h=c.navigator.sendBeacon(u.v.toString(),"")}catch{}!h&&c.Image&&(new Image().src=u.v,h=!0),h||(u.g=Rc(u.j,null),u.g.ea(u.v)),u.F=Date.now(),Ur(u)}wc(o)}function Hr(o){o.g&&(Ds(o),o.g.cancel(),o.g=null)}function gc(o){Hr(o),o.u&&(c.clearTimeout(o.u),o.u=null),Wr(o),o.h.cancel(),o.s&&(typeof o.s=="number"&&c.clearTimeout(o.s),o.s=null)}function Gr(o){if(!Xa(o.h)&&!o.s){o.s=!0;var u=o.Ga;Nn||Ca(),Dn||(Nn(),Dn=!0),ls.add(u,o),o.B=0}}function Mf(o,u){return Ja(o.h)>=o.h.j-(o.s?1:0)?!1:o.s?(o.i=u.D.concat(o.i),!0):o.G==1||o.G==2||o.B>=(o.Va?0:o.Wa)?!1:(o.s=xn(E(o.Ga,o,u),Ic(o,o.B)),o.B++,!0)}n.Ga=function(o){if(this.s)if(this.s=null,this.G==1){if(!o){this.U=Math.floor(1e5*Math.random()),o=this.U++;const w=new mt(this,this.j,o);let b=this.o;if(this.S&&(b?(b=m(b),v(b,this.S)):b=this.S),this.m!==null||this.O||(w.H=b,b=null),this.P)e:{for(var u=0,h=0;h<this.i.length;h++){t:{var f=this.i[h];if("__data__"in f.map&&(f=f.map.__data__,typeof f=="string")){f=f.length;break t}f=void 0}if(f===void 0)break;if(u+=f,4096<u){u=h;break e}if(u===4096||h===this.i.length-1){u=h+1;break e}}u=1e3}else u=1e3;u=yc(this,w,u),h=rt(this.I),ee(h,"RID",o),ee(h,"CVER",22),this.D&&ee(h,"X-HTTP-Session-Id",this.D),Gn(this,h),b&&(this.O?u="headers="+encodeURIComponent(String(uc(b)))+"&"+u:this.m&&Cs(h,this.m,b)),Ps(this.h,w),this.Ua&&ee(h,"TYPE","init"),this.P?(ee(h,"$req",u),ee(h,"SID","null"),w.T=!0,As(w,h,null)):As(w,h,u),this.G=2}}else this.G==3&&(o?_c(this,o):this.i.length==0||Xa(this.h)||_c(this))};function _c(o,u){var h;u?h=u.l:h=o.U++;const f=rt(o.I);ee(f,"SID",o.K),ee(f,"RID",h),ee(f,"AID",o.T),Gn(o,f),o.m&&o.o&&Cs(f,o.m,o.o),h=new mt(o,o.j,h,o.B+1),o.m===null&&(h.H=o.o),u&&(o.i=u.D.concat(o.i)),u=yc(o,h,1e3),h.I=Math.round(.5*o.wa)+Math.round(.5*o.wa*Math.random()),Ps(o.h,h),As(h,f,u)}function Gn(o,u){o.H&&Z(o.H,function(h,f){ee(u,f,h)}),o.l&&tc({},function(h,f){ee(u,f,h)})}function yc(o,u,h){h=Math.min(o.i.length,h);var f=o.l?E(o.l.Na,o.l,o):null;e:{var w=o.i;let b=-1;for(;;){const N=["count="+h];b==-1?0<h?(b=w[0].g,N.push("ofs="+b)):b=0:N.push("ofs="+b);let X=!0;for(let de=0;de<h;de++){let K=w[de].g;const ye=w[de].map;if(K-=b,0>K)b=Math.max(0,w[de].g-100),X=!1;else try{Df(ye,N,"req"+K+"_")}catch{f&&f(ye)}}if(X){f=N.join("&");break e}}}return o=o.i.splice(0,h),u.D=o,f}function vc(o){if(!o.g&&!o.u){o.Y=1;var u=o.Fa;Nn||Ca(),Dn||(Nn(),Dn=!0),ls.add(u,o),o.v=0}}function Ns(o){return o.g||o.u||3<=o.v?!1:(o.Y++,o.u=xn(E(o.Fa,o),Ic(o,o.v)),o.v++,!0)}n.Fa=function(){if(this.u=null,Ec(this),this.ba&&!(this.M||this.g==null||0>=this.R)){var o=2*this.R;this.j.info("BP detection timer enabled: "+o),this.A=xn(E(this.ab,this),o)}},n.ab=function(){this.A&&(this.A=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.M=!0,be(10),Hr(this),Ec(this))};function Ds(o){o.A!=null&&(c.clearTimeout(o.A),o.A=null)}function Ec(o){o.g=new mt(o,o.j,"rpc",o.Y),o.m===null&&(o.g.H=o.o),o.g.O=0;var u=rt(o.qa);ee(u,"RID","rpc"),ee(u,"SID",o.K),ee(u,"AID",o.T),ee(u,"CI",o.F?"0":"1"),!o.F&&o.ja&&ee(u,"TO",o.ja),ee(u,"TYPE","xmlhttp"),Gn(o,u),o.m&&o.o&&Cs(u,o.m,o.o),o.L&&(o.g.I=o.L);var h=o.g;o=o.ia,h.L=1,h.v=qr(rt(u)),h.m=null,h.P=!0,Wa(h,o)}n.Za=function(){this.C!=null&&(this.C=null,Hr(this),Ns(this),be(19))};function Wr(o){o.C!=null&&(c.clearTimeout(o.C),o.C=null)}function Tc(o,u){var h=null;if(o.g==u){Wr(o),Ds(o),o.g=null;var f=2}else if(Ss(o.h,u))h=u.D,Za(o.h,u),f=1;else return;if(o.G!=0){if(u.o)if(f==1){h=u.m?u.m.length:0,u=Date.now()-u.F;var w=o.B;f=Lr(),Re(f,new ja(f,h)),Gr(o)}else vc(o);else if(w=u.s,w==3||w==0&&0<u.X||!(f==1&&Mf(o,u)||f==2&&Ns(o)))switch(h&&0<h.length&&(u=o.h,u.i=u.i.concat(h)),w){case 1:Ut(o,5);break;case 4:Ut(o,10);break;case 3:Ut(o,6);break;default:Ut(o,2)}}}function Ic(o,u){let h=o.Ta+Math.floor(Math.random()*o.cb);return o.isActive()||(h*=2),h*u}function Ut(o,u){if(o.j.info("Error code "+u),u==2){var h=E(o.fb,o),f=o.Xa;const w=!f;f=new xt(f||"//www.google.com/images/cleardot.gif"),c.location&&c.location.protocol=="http"||Fr(f,"https"),qr(f),w?Cf(f.toString(),h):kf(f.toString(),h)}else be(2);o.G=0,o.l&&o.l.sa(u),wc(o),gc(o)}n.fb=function(o){o?(this.j.info("Successfully pinged google.com"),be(2)):(this.j.info("Failed to ping google.com"),be(1))};function wc(o){if(o.G=0,o.ka=[],o.l){const u=ec(o.h);(u.length!=0||o.i.length!=0)&&(C(o.ka,u),C(o.ka,o.i),o.h.i.length=0,V(o.i),o.i.length=0),o.l.ra()}}function Ac(o,u,h){var f=h instanceof xt?rt(h):new xt(h);if(f.g!="")u&&(f.g=u+"."+f.g),Br(f,f.s);else{var w=c.location;f=w.protocol,u=u?u+"."+w.hostname:w.hostname,w=+w.port;var b=new xt(null);f&&Fr(b,f),u&&(b.g=u),w&&Br(b,w),h&&(b.l=h),f=b}return h=o.D,u=o.ya,h&&u&&ee(f,h,u),ee(f,"VER",o.la),Gn(o,f),f}function Rc(o,u,h){if(u&&!o.J)throw Error("Can't create secondary domain capable XhrIo object.");return u=o.Ca&&!o.pa?new ne(new $r({eb:h})):new ne(o.pa),u.Ha(o.J),u}n.isActive=function(){return!!this.l&&this.l.isActive(this)};function bc(){}n=bc.prototype,n.ua=function(){},n.ta=function(){},n.sa=function(){},n.ra=function(){},n.isActive=function(){return!0},n.Na=function(){};function Kr(){}Kr.prototype.g=function(o,u){return new Ve(o,u)};function Ve(o,u){_e.call(this),this.g=new mc(u),this.l=o,this.h=u&&u.messageUrlParams||null,o=u&&u.messageHeaders||null,u&&u.clientProtocolHeaderRequired&&(o?o["X-Client-Protocol"]="webchannel":o={"X-Client-Protocol":"webchannel"}),this.g.o=o,o=u&&u.initMessageHeaders||null,u&&u.messageContentType&&(o?o["X-WebChannel-Content-Type"]=u.messageContentType:o={"X-WebChannel-Content-Type":u.messageContentType}),u&&u.va&&(o?o["X-WebChannel-Client-Profile"]=u.va:o={"X-WebChannel-Client-Profile":u.va}),this.g.S=o,(o=u&&u.Sb)&&!$(o)&&(this.g.m=o),this.v=u&&u.supportsCrossDomainXhr||!1,this.u=u&&u.sendRawJson||!1,(u=u&&u.httpSessionIdParam)&&!$(u)&&(this.g.D=u,o=this.h,o!==null&&u in o&&(o=this.h,u in o&&delete o[u])),this.j=new sn(this)}k(Ve,_e),Ve.prototype.m=function(){this.g.l=this.j,this.v&&(this.g.J=!0),this.g.connect(this.l,this.h||void 0)},Ve.prototype.close=function(){ks(this.g)},Ve.prototype.o=function(o){var u=this.g;if(typeof o=="string"){var h={};h.__data__=o,o=h}else this.u&&(h={},h.__data__=ys(o),o=h);u.i.push(new vf(u.Ya++,o)),u.G==3&&Gr(u)},Ve.prototype.N=function(){this.g.l=null,delete this.j,ks(this.g),delete this.g,Ve.aa.N.call(this)};function Sc(o){Es.call(this),o.__headers__&&(this.headers=o.__headers__,this.statusCode=o.__status__,delete o.__headers__,delete o.__status__);var u=o.__sm__;if(u){e:{for(const h in u){o=h;break e}o=void 0}(this.i=o)&&(o=this.i,u=u!==null&&o in u?u[o]:void 0),this.data=u}else this.data=o}k(Sc,Es);function Pc(){Ts.call(this),this.status=1}k(Pc,Ts);function sn(o){this.g=o}k(sn,bc),sn.prototype.ua=function(){Re(this.g,"a")},sn.prototype.ta=function(o){Re(this.g,new Sc(o))},sn.prototype.sa=function(o){Re(this.g,new Pc)},sn.prototype.ra=function(){Re(this.g,"b")},Kr.prototype.createWebChannel=Kr.prototype.g,Ve.prototype.send=Ve.prototype.o,Ve.prototype.open=Ve.prototype.m,Ve.prototype.close=Ve.prototype.close,nh=function(){return new Kr},th=function(){return Lr()},eh=Lt,eo={mb:0,pb:1,qb:2,Jb:3,Ob:4,Lb:5,Mb:6,Kb:7,Ib:8,Nb:9,PROXY:10,NOPROXY:11,Gb:12,Cb:13,Db:14,Bb:15,Eb:16,Fb:17,ib:18,hb:19,jb:20},Mr.NO_ERROR=0,Mr.TIMEOUT=8,Mr.HTTP_ERROR=6,ci=Mr,za.COMPLETE="complete",Zl=za,Fa.EventType=Ln,Ln.OPEN="a",Ln.CLOSE="b",Ln.ERROR="c",Ln.MESSAGE="d",_e.prototype.listen=_e.prototype.K,Yn=Fa,ne.prototype.listenOnce=ne.prototype.L,ne.prototype.getLastError=ne.prototype.Ka,ne.prototype.getLastErrorCode=ne.prototype.Ba,ne.prototype.getStatus=ne.prototype.Z,ne.prototype.getResponseJson=ne.prototype.Oa,ne.prototype.getResponseText=ne.prototype.oa,ne.prototype.send=ne.prototype.ea,ne.prototype.setWithCredentials=ne.prototype.Ha,Jl=ne}).apply(typeof Xr<"u"?Xr:typeof self<"u"?self:typeof window<"u"?window:{});const ru="@firebase/firestore";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Te{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}Te.UNAUTHENTICATED=new Te(null),Te.GOOGLE_CREDENTIALS=new Te("google-credentials-uid"),Te.FIRST_PARTY=new Te("first-party-uid"),Te.MOCK_USER=new Te("mock-user");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Rn="11.0.2";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Wt=new Li("@firebase/firestore");function an(){return Wt.logLevel}function O(n,...e){if(Wt.logLevel<=z.DEBUG){const t=e.map(Vo);Wt.debug(`Firestore (${Rn}): ${n}`,...t)}}function dt(n,...e){if(Wt.logLevel<=z.ERROR){const t=e.map(Vo);Wt.error(`Firestore (${Rn}): ${n}`,...t)}}function gn(n,...e){if(Wt.logLevel<=z.WARN){const t=e.map(Vo);Wt.warn(`Firestore (${Rn}): ${n}`,...t)}}function Vo(n){if(typeof n=="string")return n;try{/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/return function(t){return JSON.stringify(t)}(n)}catch{return n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function x(n="Unexpected state"){const e=`FIRESTORE (${Rn}) INTERNAL ASSERTION FAILED: `+n;throw dt(e),new Error(e)}function Y(n,e){n||x()}function F(n,e){return n}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const S={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class D extends Be{constructor(e,t){super(e,t),this.code=e,this.message=t,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ut{constructor(){this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rh{constructor(e,t){this.user=t,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class y_{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,t){e.enqueueRetryable(()=>t(Te.UNAUTHENTICATED))}shutdown(){}}class v_{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,t){this.changeListener=t,e.enqueueRetryable(()=>t(this.token.user))}shutdown(){this.changeListener=null}}class E_{constructor(e){this.t=e,this.currentUser=Te.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,t){Y(this.o===void 0);let r=this.i;const i=l=>this.i!==r?(r=this.i,t(l)):Promise.resolve();let s=new ut;this.o=()=>{this.i++,this.currentUser=this.u(),s.resolve(),s=new ut,e.enqueueRetryable(()=>i(this.currentUser))};const a=()=>{const l=s;e.enqueueRetryable(async()=>{await l.promise,await i(this.currentUser)})},c=l=>{O("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=l,this.o&&(this.auth.addAuthTokenListener(this.o),a())};this.t.onInit(l=>c(l)),setTimeout(()=>{if(!this.auth){const l=this.t.getImmediate({optional:!0});l?c(l):(O("FirebaseAuthCredentialsProvider","Auth not yet detected"),s.resolve(),s=new ut)}},0),a()}getToken(){const e=this.i,t=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(t).then(r=>this.i!==e?(O("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):r?(Y(typeof r.accessToken=="string"),new rh(r.accessToken,this.currentUser)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const e=this.auth&&this.auth.getUid();return Y(e===null||typeof e=="string"),new Te(e)}}class T_{constructor(e,t,r){this.l=e,this.h=t,this.P=r,this.type="FirstParty",this.user=Te.FIRST_PARTY,this.T=new Map}I(){return this.P?this.P():null}get headers(){this.T.set("X-Goog-AuthUser",this.l);const e=this.I();return e&&this.T.set("Authorization",e),this.h&&this.T.set("X-Goog-Iam-Authorization-Token",this.h),this.T}}class I_{constructor(e,t,r){this.l=e,this.h=t,this.P=r}getToken(){return Promise.resolve(new T_(this.l,this.h,this.P))}start(e,t){e.enqueueRetryable(()=>t(Te.FIRST_PARTY))}shutdown(){}invalidateToken(){}}class w_{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class A_{constructor(e){this.A=e,this.forceRefresh=!1,this.appCheck=null,this.R=null}start(e,t){Y(this.o===void 0);const r=s=>{s.error!=null&&O("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${s.error.message}`);const a=s.token!==this.R;return this.R=s.token,O("FirebaseAppCheckTokenProvider",`Received ${a?"new":"existing"} token.`),a?t(s.token):Promise.resolve()};this.o=s=>{e.enqueueRetryable(()=>r(s))};const i=s=>{O("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=s,this.o&&this.appCheck.addTokenListener(this.o)};this.A.onInit(s=>i(s)),setTimeout(()=>{if(!this.appCheck){const s=this.A.getImmediate({optional:!0});s?i(s):O("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}},0)}getToken(){const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then(t=>t?(Y(typeof t.token=="string"),this.R=t.token,new w_(t.token)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function R_(n){const e=typeof self<"u"&&(self.crypto||self.msCrypto),t=new Uint8Array(n);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(t);else for(let r=0;r<n;r++)t[r]=Math.floor(256*Math.random());return t}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ih{static newId(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",t=Math.floor(256/e.length)*e.length;let r="";for(;r.length<20;){const i=R_(40);for(let s=0;s<i.length;++s)r.length<20&&i[s]<t&&(r+=e.charAt(i[s]%e.length))}return r}}function G(n,e){return n<e?-1:n>e?1:0}function _n(n,e,t){return n.length===e.length&&n.every((r,i)=>t(r,e[i]))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ce{static now(){return ce.fromMillis(Date.now())}static fromDate(e){return ce.fromMillis(e.getTime())}static fromMillis(e){const t=Math.floor(e/1e3),r=Math.floor(1e6*(e-1e3*t));return new ce(t,r)}constructor(e,t){if(this.seconds=e,this.nanoseconds=t,t<0)throw new D(S.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(t>=1e9)throw new D(S.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(e<-62135596800)throw new D(S.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new D(S.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/1e6}_compareTo(e){return this.seconds===e.seconds?G(this.nanoseconds,e.nanoseconds):G(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{seconds:this.seconds,nanoseconds:this.nanoseconds}}valueOf(){const e=this.seconds- -62135596800;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class U{static fromTimestamp(e){return new U(e)}static min(){return new U(new ce(0,0))}static max(){return new U(new ce(253402300799,999999999))}constructor(e){this.timestamp=e}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class lr{constructor(e,t,r){t===void 0?t=0:t>e.length&&x(),r===void 0?r=e.length-t:r>e.length-t&&x(),this.segments=e,this.offset=t,this.len=r}get length(){return this.len}isEqual(e){return lr.comparator(this,e)===0}child(e){const t=this.segments.slice(this.offset,this.limit());return e instanceof lr?e.forEach(r=>{t.push(r)}):t.push(e),this.construct(t)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}forEach(e){for(let t=this.offset,r=this.limit();t<r;t++)e(this.segments[t])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,t){const r=Math.min(e.length,t.length);for(let i=0;i<r;i++){const s=e.get(i),a=t.get(i);if(s<a)return-1;if(s>a)return 1}return e.length<t.length?-1:e.length>t.length?1:0}}class J extends lr{construct(e,t,r){return new J(e,t,r)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const t=[];for(const r of e){if(r.indexOf("//")>=0)throw new D(S.INVALID_ARGUMENT,`Invalid segment (${r}). Paths must not contain // in them.`);t.push(...r.split("/").filter(i=>i.length>0))}return new J(t)}static emptyPath(){return new J([])}}const b_=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class pe extends lr{construct(e,t,r){return new pe(e,t,r)}static isValidIdentifier(e){return b_.test(e)}canonicalString(){return this.toArray().map(e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),pe.isValidIdentifier(e)||(e="`"+e+"`"),e)).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)==="__name__"}static keyField(){return new pe(["__name__"])}static fromServerFormat(e){const t=[];let r="",i=0;const s=()=>{if(r.length===0)throw new D(S.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);t.push(r),r=""};let a=!1;for(;i<e.length;){const c=e[i];if(c==="\\"){if(i+1===e.length)throw new D(S.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const l=e[i+1];if(l!=="\\"&&l!=="."&&l!=="`")throw new D(S.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);r+=l,i+=2}else c==="`"?(a=!a,i++):c!=="."||a?(r+=c,i++):(s(),i++)}if(s(),a)throw new D(S.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new pe(t)}static emptyPath(){return new pe([])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class L{constructor(e){this.path=e}static fromPath(e){return new L(J.fromString(e))}static fromName(e){return new L(J.fromString(e).popFirst(5))}static empty(){return new L(J.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&J.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,t){return J.comparator(e.path,t.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new L(new J(e.slice()))}}function S_(n,e){const t=n.toTimestamp().seconds,r=n.toTimestamp().nanoseconds+1,i=U.fromTimestamp(r===1e9?new ce(t+1,0):new ce(t,r));return new St(i,L.empty(),e)}function P_(n){return new St(n.readTime,n.key,-1)}class St{constructor(e,t,r){this.readTime=e,this.documentKey=t,this.largestBatchId=r}static min(){return new St(U.min(),L.empty(),-1)}static max(){return new St(U.max(),L.empty(),-1)}}function C_(n,e){let t=n.readTime.compareTo(e.readTime);return t!==0?t:(t=L.comparator(n.documentKey,e.documentKey),t!==0?t:G(n.largestBatchId,e.largestBatchId))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const k_="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class N_{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(e){this.onCommittedListeners.push(e)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach(e=>e())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function bn(n){if(n.code!==S.FAILED_PRECONDITION||n.message!==k_)throw n;O("LocalStore","Unexpectedly lost primary lease")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class P{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e(t=>{this.isDone=!0,this.result=t,this.nextCallback&&this.nextCallback(t)},t=>{this.isDone=!0,this.error=t,this.catchCallback&&this.catchCallback(t)})}catch(e){return this.next(void 0,e)}next(e,t){return this.callbackAttached&&x(),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(t,this.error):this.wrapSuccess(e,this.result):new P((r,i)=>{this.nextCallback=s=>{this.wrapSuccess(e,s).next(r,i)},this.catchCallback=s=>{this.wrapFailure(t,s).next(r,i)}})}toPromise(){return new Promise((e,t)=>{this.next(e,t)})}wrapUserFunction(e){try{const t=e();return t instanceof P?t:P.resolve(t)}catch(t){return P.reject(t)}}wrapSuccess(e,t){return e?this.wrapUserFunction(()=>e(t)):P.resolve(t)}wrapFailure(e,t){return e?this.wrapUserFunction(()=>e(t)):P.reject(t)}static resolve(e){return new P((t,r)=>{t(e)})}static reject(e){return new P((t,r)=>{r(e)})}static waitFor(e){return new P((t,r)=>{let i=0,s=0,a=!1;e.forEach(c=>{++i,c.next(()=>{++s,a&&s===i&&t()},l=>r(l))}),a=!0,s===i&&t()})}static or(e){let t=P.resolve(!1);for(const r of e)t=t.next(i=>i?P.resolve(i):r());return t}static forEach(e,t){const r=[];return e.forEach((i,s)=>{r.push(t.call(this,i,s))}),this.waitFor(r)}static mapArray(e,t){return new P((r,i)=>{const s=e.length,a=new Array(s);let c=0;for(let l=0;l<s;l++){const d=l;t(e[d]).next(p=>{a[d]=p,++c,c===s&&r(a)},p=>i(p))}})}static doWhile(e,t){return new P((r,i)=>{const s=()=>{e()===!0?t().next(()=>{s()},i):r()};s()})}}function D_(n){const e=n.match(/Android ([\d.]+)/i),t=e?e[1].split(".").slice(0,2).join("."):"-1";return Number(t)}function Sn(n){return n.name==="IndexedDbTransactionError"}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Bi{constructor(e,t){this.previousValue=e,t&&(t.sequenceNumberHandler=r=>this.ie(r),this.se=r=>t.writeSequenceNumber(r))}ie(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){const e=++this.previousValue;return this.se&&this.se(e),e}}Bi.oe=-1;function qi(n){return n==null}function Ii(n){return n===0&&1/n==-1/0}function V_(n){return typeof n=="number"&&Number.isInteger(n)&&!Ii(n)&&n<=Number.MAX_SAFE_INTEGER&&n>=Number.MIN_SAFE_INTEGER}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function O_(n){let e="";for(let t=0;t<n.length;t++)e.length>0&&(e=iu(e)),e=L_(n.get(t),e);return iu(e)}function L_(n,e){let t=e;const r=n.length;for(let i=0;i<r;i++){const s=n.charAt(i);switch(s){case"\0":t+="";break;case"":t+="";break;default:t+=s}}return t}function iu(n){return n+""}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function su(n){let e=0;for(const t in n)Object.prototype.hasOwnProperty.call(n,t)&&e++;return e}function Vt(n,e){for(const t in n)Object.prototype.hasOwnProperty.call(n,t)&&e(t,n[t])}function sh(n){for(const e in n)if(Object.prototype.hasOwnProperty.call(n,e))return!1;return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class te{constructor(e,t){this.comparator=e,this.root=t||fe.EMPTY}insert(e,t){return new te(this.comparator,this.root.insert(e,t,this.comparator).copy(null,null,fe.BLACK,null,null))}remove(e){return new te(this.comparator,this.root.remove(e,this.comparator).copy(null,null,fe.BLACK,null,null))}get(e){let t=this.root;for(;!t.isEmpty();){const r=this.comparator(e,t.key);if(r===0)return t.value;r<0?t=t.left:r>0&&(t=t.right)}return null}indexOf(e){let t=0,r=this.root;for(;!r.isEmpty();){const i=this.comparator(e,r.key);if(i===0)return t+r.left.size;i<0?r=r.left:(t+=r.left.size+1,r=r.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal((t,r)=>(e(t,r),!1))}toString(){const e=[];return this.inorderTraversal((t,r)=>(e.push(`${t}:${r}`),!1)),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new Jr(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new Jr(this.root,e,this.comparator,!1)}getReverseIterator(){return new Jr(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new Jr(this.root,e,this.comparator,!0)}}class Jr{constructor(e,t,r,i){this.isReverse=i,this.nodeStack=[];let s=1;for(;!e.isEmpty();)if(s=t?r(e.key,t):1,t&&i&&(s*=-1),s<0)e=this.isReverse?e.left:e.right;else{if(s===0){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop();const t={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return t}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}}class fe{constructor(e,t,r,i,s){this.key=e,this.value=t,this.color=r??fe.RED,this.left=i??fe.EMPTY,this.right=s??fe.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,t,r,i,s){return new fe(e??this.key,t??this.value,r??this.color,i??this.left,s??this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,r){let i=this;const s=r(e,i.key);return i=s<0?i.copy(null,null,null,i.left.insert(e,t,r),null):s===0?i.copy(null,t,null,null,null):i.copy(null,null,null,null,i.right.insert(e,t,r)),i.fixUp()}removeMin(){if(this.left.isEmpty())return fe.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,t){let r,i=this;if(t(e,i.key)<0)i.left.isEmpty()||i.left.isRed()||i.left.left.isRed()||(i=i.moveRedLeft()),i=i.copy(null,null,null,i.left.remove(e,t),null);else{if(i.left.isRed()&&(i=i.rotateRight()),i.right.isEmpty()||i.right.isRed()||i.right.left.isRed()||(i=i.moveRedRight()),t(e,i.key)===0){if(i.right.isEmpty())return fe.EMPTY;r=i.right.min(),i=i.copy(r.key,r.value,null,null,i.right.removeMin())}i=i.copy(null,null,null,null,i.right.remove(e,t))}return i.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){const e=this.copy(null,null,fe.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){const e=this.copy(null,null,fe.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){const e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth(){const e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed()||this.right.isRed())throw x();const e=this.left.check();if(e!==this.right.check())throw x();return e+(this.isRed()?0:1)}}fe.EMPTY=null,fe.RED=!0,fe.BLACK=!1;fe.EMPTY=new class{constructor(){this.size=0}get key(){throw x()}get value(){throw x()}get color(){throw x()}get left(){throw x()}get right(){throw x()}copy(e,t,r,i,s){return this}insert(e,t,r){return new fe(e,t)}remove(e,t){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ue{constructor(e){this.comparator=e,this.data=new te(this.comparator)}has(e){return this.data.get(e)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal((t,r)=>(e(t),!1))}forEachInRange(e,t){const r=this.data.getIteratorFrom(e[0]);for(;r.hasNext();){const i=r.getNext();if(this.comparator(i.key,e[1])>=0)return;t(i.key)}}forEachWhile(e,t){let r;for(r=t!==void 0?this.data.getIteratorFrom(t):this.data.getIterator();r.hasNext();)if(!e(r.getNext().key))return}firstAfterOrEqual(e){const t=this.data.getIteratorFrom(e);return t.hasNext()?t.getNext().key:null}getIterator(){return new ou(this.data.getIterator())}getIteratorFrom(e){return new ou(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let t=this;return t.size<e.size&&(t=e,e=this),e.forEach(r=>{t=t.add(r)}),t}isEqual(e){if(!(e instanceof ue)||this.size!==e.size)return!1;const t=this.data.getIterator(),r=e.data.getIterator();for(;t.hasNext();){const i=t.getNext().key,s=r.getNext().key;if(this.comparator(i,s)!==0)return!1}return!0}toArray(){const e=[];return this.forEach(t=>{e.push(t)}),e}toString(){const e=[];return this.forEach(t=>e.push(t)),"SortedSet("+e.toString()+")"}copy(e){const t=new ue(this.comparator);return t.data=e,t}}class ou{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Oe{constructor(e){this.fields=e,e.sort(pe.comparator)}static empty(){return new Oe([])}unionWith(e){let t=new ue(pe.comparator);for(const r of this.fields)t=t.add(r);for(const r of e)t=t.add(r);return new Oe(t.toArray())}covers(e){for(const t of this.fields)if(t.isPrefixOf(e))return!0;return!1}isEqual(e){return _n(this.fields,e.fields,(t,r)=>t.isEqual(r))}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class oh extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class me{constructor(e){this.binaryString=e}static fromBase64String(e){const t=function(i){try{return atob(i)}catch(s){throw typeof DOMException<"u"&&s instanceof DOMException?new oh("Invalid base64 string: "+s):s}}(e);return new me(t)}static fromUint8Array(e){const t=function(i){let s="";for(let a=0;a<i.length;++a)s+=String.fromCharCode(i[a]);return s}(e);return new me(t)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return function(t){return btoa(t)}(this.binaryString)}toUint8Array(){return function(t){const r=new Uint8Array(t.length);for(let i=0;i<t.length;i++)r[i]=t.charCodeAt(i);return r}(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return G(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}me.EMPTY_BYTE_STRING=new me("");const M_=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function Pt(n){if(Y(!!n),typeof n=="string"){let e=0;const t=M_.exec(n);if(Y(!!t),t[1]){let i=t[1];i=(i+"000000000").substr(0,9),e=Number(i)}const r=new Date(n);return{seconds:Math.floor(r.getTime()/1e3),nanos:e}}return{seconds:se(n.seconds),nanos:se(n.nanos)}}function se(n){return typeof n=="number"?n:typeof n=="string"?Number(n):0}function Ct(n){return typeof n=="string"?me.fromBase64String(n):me.fromUint8Array(n)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function $i(n){var e,t;return((t=(((e=n?.mapValue)===null||e===void 0?void 0:e.fields)||{}).__type__)===null||t===void 0?void 0:t.stringValue)==="server_timestamp"}function ji(n){const e=n.mapValue.fields.__previous_value__;return $i(e)?ji(e):e}function hr(n){const e=Pt(n.mapValue.fields.__local_write_time__.timestampValue);return new ce(e.seconds,e.nanos)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class x_{constructor(e,t,r,i,s,a,c,l,d){this.databaseId=e,this.appId=t,this.persistenceKey=r,this.host=i,this.ssl=s,this.forceLongPolling=a,this.autoDetectLongPolling=c,this.longPollingOptions=l,this.useFetchStreams=d}}class dr{constructor(e,t){this.projectId=e,this.database=t||"(default)"}static empty(){return new dr("","")}get isDefaultDatabase(){return this.database==="(default)"}isEqual(e){return e instanceof dr&&e.projectId===this.projectId&&e.database===this.database}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Zr={mapValue:{fields:{__type__:{stringValue:"__max__"}}}};function kt(n){return"nullValue"in n?0:"booleanValue"in n?1:"integerValue"in n||"doubleValue"in n?2:"timestampValue"in n?3:"stringValue"in n?5:"bytesValue"in n?6:"referenceValue"in n?7:"geoPointValue"in n?8:"arrayValue"in n?9:"mapValue"in n?$i(n)?4:F_(n)?9007199254740991:U_(n)?10:11:x()}function Ye(n,e){if(n===e)return!0;const t=kt(n);if(t!==kt(e))return!1;switch(t){case 0:case 9007199254740991:return!0;case 1:return n.booleanValue===e.booleanValue;case 4:return hr(n).isEqual(hr(e));case 3:return function(i,s){if(typeof i.timestampValue=="string"&&typeof s.timestampValue=="string"&&i.timestampValue.length===s.timestampValue.length)return i.timestampValue===s.timestampValue;const a=Pt(i.timestampValue),c=Pt(s.timestampValue);return a.seconds===c.seconds&&a.nanos===c.nanos}(n,e);case 5:return n.stringValue===e.stringValue;case 6:return function(i,s){return Ct(i.bytesValue).isEqual(Ct(s.bytesValue))}(n,e);case 7:return n.referenceValue===e.referenceValue;case 8:return function(i,s){return se(i.geoPointValue.latitude)===se(s.geoPointValue.latitude)&&se(i.geoPointValue.longitude)===se(s.geoPointValue.longitude)}(n,e);case 2:return function(i,s){if("integerValue"in i&&"integerValue"in s)return se(i.integerValue)===se(s.integerValue);if("doubleValue"in i&&"doubleValue"in s){const a=se(i.doubleValue),c=se(s.doubleValue);return a===c?Ii(a)===Ii(c):isNaN(a)&&isNaN(c)}return!1}(n,e);case 9:return _n(n.arrayValue.values||[],e.arrayValue.values||[],Ye);case 10:case 11:return function(i,s){const a=i.mapValue.fields||{},c=s.mapValue.fields||{};if(su(a)!==su(c))return!1;for(const l in a)if(a.hasOwnProperty(l)&&(c[l]===void 0||!Ye(a[l],c[l])))return!1;return!0}(n,e);default:return x()}}function fr(n,e){return(n.values||[]).find(t=>Ye(t,e))!==void 0}function yn(n,e){if(n===e)return 0;const t=kt(n),r=kt(e);if(t!==r)return G(t,r);switch(t){case 0:case 9007199254740991:return 0;case 1:return G(n.booleanValue,e.booleanValue);case 2:return function(s,a){const c=se(s.integerValue||s.doubleValue),l=se(a.integerValue||a.doubleValue);return c<l?-1:c>l?1:c===l?0:isNaN(c)?isNaN(l)?0:-1:1}(n,e);case 3:return au(n.timestampValue,e.timestampValue);case 4:return au(hr(n),hr(e));case 5:return G(n.stringValue,e.stringValue);case 6:return function(s,a){const c=Ct(s),l=Ct(a);return c.compareTo(l)}(n.bytesValue,e.bytesValue);case 7:return function(s,a){const c=s.split("/"),l=a.split("/");for(let d=0;d<c.length&&d<l.length;d++){const p=G(c[d],l[d]);if(p!==0)return p}return G(c.length,l.length)}(n.referenceValue,e.referenceValue);case 8:return function(s,a){const c=G(se(s.latitude),se(a.latitude));return c!==0?c:G(se(s.longitude),se(a.longitude))}(n.geoPointValue,e.geoPointValue);case 9:return cu(n.arrayValue,e.arrayValue);case 10:return function(s,a){var c,l,d,p;const g=s.fields||{},E=a.fields||{},R=(c=g.value)===null||c===void 0?void 0:c.arrayValue,k=(l=E.value)===null||l===void 0?void 0:l.arrayValue,V=G(((d=R?.values)===null||d===void 0?void 0:d.length)||0,((p=k?.values)===null||p===void 0?void 0:p.length)||0);return V!==0?V:cu(R,k)}(n.mapValue,e.mapValue);case 11:return function(s,a){if(s===Zr.mapValue&&a===Zr.mapValue)return 0;if(s===Zr.mapValue)return 1;if(a===Zr.mapValue)return-1;const c=s.fields||{},l=Object.keys(c),d=a.fields||{},p=Object.keys(d);l.sort(),p.sort();for(let g=0;g<l.length&&g<p.length;++g){const E=G(l[g],p[g]);if(E!==0)return E;const R=yn(c[l[g]],d[p[g]]);if(R!==0)return R}return G(l.length,p.length)}(n.mapValue,e.mapValue);default:throw x()}}function au(n,e){if(typeof n=="string"&&typeof e=="string"&&n.length===e.length)return G(n,e);const t=Pt(n),r=Pt(e),i=G(t.seconds,r.seconds);return i!==0?i:G(t.nanos,r.nanos)}function cu(n,e){const t=n.values||[],r=e.values||[];for(let i=0;i<t.length&&i<r.length;++i){const s=yn(t[i],r[i]);if(s)return s}return G(t.length,r.length)}function vn(n){return to(n)}function to(n){return"nullValue"in n?"null":"booleanValue"in n?""+n.booleanValue:"integerValue"in n?""+n.integerValue:"doubleValue"in n?""+n.doubleValue:"timestampValue"in n?function(t){const r=Pt(t);return`time(${r.seconds},${r.nanos})`}(n.timestampValue):"stringValue"in n?n.stringValue:"bytesValue"in n?function(t){return Ct(t).toBase64()}(n.bytesValue):"referenceValue"in n?function(t){return L.fromName(t).toString()}(n.referenceValue):"geoPointValue"in n?function(t){return`geo(${t.latitude},${t.longitude})`}(n.geoPointValue):"arrayValue"in n?function(t){let r="[",i=!0;for(const s of t.values||[])i?i=!1:r+=",",r+=to(s);return r+"]"}(n.arrayValue):"mapValue"in n?function(t){const r=Object.keys(t.fields||{}).sort();let i="{",s=!0;for(const a of r)s?s=!1:i+=",",i+=`${a}:${to(t.fields[a])}`;return i+"}"}(n.mapValue):x()}function ui(n){switch(kt(n)){case 0:case 1:return 4;case 2:return 8;case 3:case 8:return 16;case 4:const e=ji(n);return e?16+ui(e):16;case 5:return 2*n.stringValue.length;case 6:return Ct(n.bytesValue).approximateByteSize();case 7:return n.referenceValue.length;case 9:return function(r){return(r.values||[]).reduce((i,s)=>i+ui(s),0)}(n.arrayValue);case 10:case 11:return function(r){let i=0;return Vt(r.fields,(s,a)=>{i+=s.length+ui(a)}),i}(n.mapValue);default:throw x()}}function wi(n,e){return{referenceValue:`projects/${n.projectId}/databases/${n.database}/documents/${e.path.canonicalString()}`}}function no(n){return!!n&&"integerValue"in n}function Oo(n){return!!n&&"arrayValue"in n}function uu(n){return!!n&&"nullValue"in n}function lu(n){return!!n&&"doubleValue"in n&&isNaN(Number(n.doubleValue))}function li(n){return!!n&&"mapValue"in n}function U_(n){var e,t;return((t=(((e=n?.mapValue)===null||e===void 0?void 0:e.fields)||{}).__type__)===null||t===void 0?void 0:t.stringValue)==="__vector__"}function tr(n){if(n.geoPointValue)return{geoPointValue:Object.assign({},n.geoPointValue)};if(n.timestampValue&&typeof n.timestampValue=="object")return{timestampValue:Object.assign({},n.timestampValue)};if(n.mapValue){const e={mapValue:{fields:{}}};return Vt(n.mapValue.fields,(t,r)=>e.mapValue.fields[t]=tr(r)),e}if(n.arrayValue){const e={arrayValue:{values:[]}};for(let t=0;t<(n.arrayValue.values||[]).length;++t)e.arrayValue.values[t]=tr(n.arrayValue.values[t]);return e}return Object.assign({},n)}function F_(n){return(((n.mapValue||{}).fields||{}).__type__||{}).stringValue==="__max__"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ne{constructor(e){this.value=e}static empty(){return new Ne({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let t=this.value;for(let r=0;r<e.length-1;++r)if(t=(t.mapValue.fields||{})[e.get(r)],!li(t))return null;return t=(t.mapValue.fields||{})[e.lastSegment()],t||null}}set(e,t){this.getFieldsMap(e.popLast())[e.lastSegment()]=tr(t)}setAll(e){let t=pe.emptyPath(),r={},i=[];e.forEach((a,c)=>{if(!t.isImmediateParentOf(c)){const l=this.getFieldsMap(t);this.applyChanges(l,r,i),r={},i=[],t=c.popLast()}a?r[c.lastSegment()]=tr(a):i.push(c.lastSegment())});const s=this.getFieldsMap(t);this.applyChanges(s,r,i)}delete(e){const t=this.field(e.popLast());li(t)&&t.mapValue.fields&&delete t.mapValue.fields[e.lastSegment()]}isEqual(e){return Ye(this.value,e.value)}getFieldsMap(e){let t=this.value;t.mapValue.fields||(t.mapValue={fields:{}});for(let r=0;r<e.length;++r){let i=t.mapValue.fields[e.get(r)];li(i)&&i.mapValue.fields||(i={mapValue:{fields:{}}},t.mapValue.fields[e.get(r)]=i),t=i}return t.mapValue.fields}applyChanges(e,t,r){Vt(t,(i,s)=>e[i]=s);for(const i of r)delete e[i]}clone(){return new Ne(tr(this.value))}}function ah(n){const e=[];return Vt(n.fields,(t,r)=>{const i=new pe([t]);if(li(r)){const s=ah(r.mapValue).fields;if(s.length===0)e.push(i);else for(const a of s)e.push(i.child(a))}else e.push(i)}),new Oe(e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ie{constructor(e,t,r,i,s,a,c){this.key=e,this.documentType=t,this.version=r,this.readTime=i,this.createTime=s,this.data=a,this.documentState=c}static newInvalidDocument(e){return new Ie(e,0,U.min(),U.min(),U.min(),Ne.empty(),0)}static newFoundDocument(e,t,r,i){return new Ie(e,1,t,U.min(),r,i,0)}static newNoDocument(e,t){return new Ie(e,2,t,U.min(),U.min(),Ne.empty(),0)}static newUnknownDocument(e,t){return new Ie(e,3,t,U.min(),U.min(),Ne.empty(),2)}convertToFoundDocument(e,t){return!this.createTime.isEqual(U.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=e),this.version=e,this.documentType=1,this.data=t,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=Ne.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=Ne.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=U.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(e){return e instanceof Ie&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new Ie(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class En{constructor(e,t){this.position=e,this.inclusive=t}}function hu(n,e,t){let r=0;for(let i=0;i<n.position.length;i++){const s=e[i],a=n.position[i];if(s.field.isKeyField()?r=L.comparator(L.fromName(a.referenceValue),t.key):r=yn(a,t.data.field(s.field)),s.dir==="desc"&&(r*=-1),r!==0)break}return r}function du(n,e){if(n===null)return e===null;if(e===null||n.inclusive!==e.inclusive||n.position.length!==e.position.length)return!1;for(let t=0;t<n.position.length;t++)if(!Ye(n.position[t],e.position[t]))return!1;return!0}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pr{constructor(e,t="asc"){this.field=e,this.dir=t}}function B_(n,e){return n.dir===e.dir&&n.field.isEqual(e.field)}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ch{}class ae extends ch{constructor(e,t,r){super(),this.field=e,this.op=t,this.value=r}static create(e,t,r){return e.isKeyField()?t==="in"||t==="not-in"?this.createKeyFieldInFilter(e,t,r):new $_(e,t,r):t==="array-contains"?new H_(e,r):t==="in"?new G_(e,r):t==="not-in"?new W_(e,r):t==="array-contains-any"?new K_(e,r):new ae(e,t,r)}static createKeyFieldInFilter(e,t,r){return t==="in"?new j_(e,r):new z_(e,r)}matches(e){const t=e.data.field(this.field);return this.op==="!="?t!==null&&this.matchesComparison(yn(t,this.value)):t!==null&&kt(this.value)===kt(t)&&this.matchesComparison(yn(t,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return e===0;case"!=":return e!==0;case">":return e>0;case">=":return e>=0;default:return x()}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class He extends ch{constructor(e,t){super(),this.filters=e,this.op=t,this.ae=null}static create(e,t){return new He(e,t)}matches(e){return uh(this)?this.filters.find(t=>!t.matches(e))===void 0:this.filters.find(t=>t.matches(e))!==void 0}getFlattenedFilters(){return this.ae!==null||(this.ae=this.filters.reduce((e,t)=>e.concat(t.getFlattenedFilters()),[])),this.ae}getFilters(){return Object.assign([],this.filters)}}function uh(n){return n.op==="and"}function lh(n){return q_(n)&&uh(n)}function q_(n){for(const e of n.filters)if(e instanceof He)return!1;return!0}function ro(n){if(n instanceof ae)return n.field.canonicalString()+n.op.toString()+vn(n.value);if(lh(n))return n.filters.map(e=>ro(e)).join(",");{const e=n.filters.map(t=>ro(t)).join(",");return`${n.op}(${e})`}}function hh(n,e){return n instanceof ae?function(r,i){return i instanceof ae&&r.op===i.op&&r.field.isEqual(i.field)&&Ye(r.value,i.value)}(n,e):n instanceof He?function(r,i){return i instanceof He&&r.op===i.op&&r.filters.length===i.filters.length?r.filters.reduce((s,a,c)=>s&&hh(a,i.filters[c]),!0):!1}(n,e):void x()}function dh(n){return n instanceof ae?function(t){return`${t.field.canonicalString()} ${t.op} ${vn(t.value)}`}(n):n instanceof He?function(t){return t.op.toString()+" {"+t.getFilters().map(dh).join(" ,")+"}"}(n):"Filter"}class $_ extends ae{constructor(e,t,r){super(e,t,r),this.key=L.fromName(r.referenceValue)}matches(e){const t=L.comparator(e.key,this.key);return this.matchesComparison(t)}}class j_ extends ae{constructor(e,t){super(e,"in",t),this.keys=fh("in",t)}matches(e){return this.keys.some(t=>t.isEqual(e.key))}}class z_ extends ae{constructor(e,t){super(e,"not-in",t),this.keys=fh("not-in",t)}matches(e){return!this.keys.some(t=>t.isEqual(e.key))}}function fh(n,e){var t;return(((t=e.arrayValue)===null||t===void 0?void 0:t.values)||[]).map(r=>L.fromName(r.referenceValue))}class H_ extends ae{constructor(e,t){super(e,"array-contains",t)}matches(e){const t=e.data.field(this.field);return Oo(t)&&fr(t.arrayValue,this.value)}}class G_ extends ae{constructor(e,t){super(e,"in",t)}matches(e){const t=e.data.field(this.field);return t!==null&&fr(this.value.arrayValue,t)}}class W_ extends ae{constructor(e,t){super(e,"not-in",t)}matches(e){if(fr(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const t=e.data.field(this.field);return t!==null&&!fr(this.value.arrayValue,t)}}class K_ extends ae{constructor(e,t){super(e,"array-contains-any",t)}matches(e){const t=e.data.field(this.field);return!(!Oo(t)||!t.arrayValue.values)&&t.arrayValue.values.some(r=>fr(this.value.arrayValue,r))}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Q_{constructor(e,t=null,r=[],i=[],s=null,a=null,c=null){this.path=e,this.collectionGroup=t,this.orderBy=r,this.filters=i,this.limit=s,this.startAt=a,this.endAt=c,this.ue=null}}function fu(n,e=null,t=[],r=[],i=null,s=null,a=null){return new Q_(n,e,t,r,i,s,a)}function Lo(n){const e=F(n);if(e.ue===null){let t=e.path.canonicalString();e.collectionGroup!==null&&(t+="|cg:"+e.collectionGroup),t+="|f:",t+=e.filters.map(r=>ro(r)).join(","),t+="|ob:",t+=e.orderBy.map(r=>function(s){return s.field.canonicalString()+s.dir}(r)).join(","),qi(e.limit)||(t+="|l:",t+=e.limit),e.startAt&&(t+="|lb:",t+=e.startAt.inclusive?"b:":"a:",t+=e.startAt.position.map(r=>vn(r)).join(",")),e.endAt&&(t+="|ub:",t+=e.endAt.inclusive?"a:":"b:",t+=e.endAt.position.map(r=>vn(r)).join(",")),e.ue=t}return e.ue}function Mo(n,e){if(n.limit!==e.limit||n.orderBy.length!==e.orderBy.length)return!1;for(let t=0;t<n.orderBy.length;t++)if(!B_(n.orderBy[t],e.orderBy[t]))return!1;if(n.filters.length!==e.filters.length)return!1;for(let t=0;t<n.filters.length;t++)if(!hh(n.filters[t],e.filters[t]))return!1;return n.collectionGroup===e.collectionGroup&&!!n.path.isEqual(e.path)&&!!du(n.startAt,e.startAt)&&du(n.endAt,e.endAt)}function io(n){return L.isDocumentKey(n.path)&&n.collectionGroup===null&&n.filters.length===0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zt{constructor(e,t=null,r=[],i=[],s=null,a="F",c=null,l=null){this.path=e,this.collectionGroup=t,this.explicitOrderBy=r,this.filters=i,this.limit=s,this.limitType=a,this.startAt=c,this.endAt=l,this.ce=null,this.le=null,this.he=null,this.startAt,this.endAt}}function Y_(n,e,t,r,i,s,a,c){return new Zt(n,e,t,r,i,s,a,c)}function zi(n){return new Zt(n)}function pu(n){return n.filters.length===0&&n.limit===null&&n.startAt==null&&n.endAt==null&&(n.explicitOrderBy.length===0||n.explicitOrderBy.length===1&&n.explicitOrderBy[0].field.isKeyField())}function xo(n){return n.collectionGroup!==null}function pn(n){const e=F(n);if(e.ce===null){e.ce=[];const t=new Set;for(const s of e.explicitOrderBy)e.ce.push(s),t.add(s.field.canonicalString());const r=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";(function(a){let c=new ue(pe.comparator);return a.filters.forEach(l=>{l.getFlattenedFilters().forEach(d=>{d.isInequality()&&(c=c.add(d.field))})}),c})(e).forEach(s=>{t.has(s.canonicalString())||s.isKeyField()||e.ce.push(new pr(s,r))}),t.has(pe.keyField().canonicalString())||e.ce.push(new pr(pe.keyField(),r))}return e.ce}function Ke(n){const e=F(n);return e.le||(e.le=X_(e,pn(n))),e.le}function X_(n,e){if(n.limitType==="F")return fu(n.path,n.collectionGroup,e,n.filters,n.limit,n.startAt,n.endAt);{e=e.map(i=>{const s=i.dir==="desc"?"asc":"desc";return new pr(i.field,s)});const t=n.endAt?new En(n.endAt.position,n.endAt.inclusive):null,r=n.startAt?new En(n.startAt.position,n.startAt.inclusive):null;return fu(n.path,n.collectionGroup,e,n.filters,n.limit,t,r)}}function so(n,e){const t=n.filters.concat([e]);return new Zt(n.path,n.collectionGroup,n.explicitOrderBy.slice(),t,n.limit,n.limitType,n.startAt,n.endAt)}function Ai(n,e,t){return new Zt(n.path,n.collectionGroup,n.explicitOrderBy.slice(),n.filters.slice(),e,t,n.startAt,n.endAt)}function Hi(n,e){return Mo(Ke(n),Ke(e))&&n.limitType===e.limitType}function ph(n){return`${Lo(Ke(n))}|lt:${n.limitType}`}function cn(n){return`Query(target=${function(t){let r=t.path.canonicalString();return t.collectionGroup!==null&&(r+=" collectionGroup="+t.collectionGroup),t.filters.length>0&&(r+=`, filters: [${t.filters.map(i=>dh(i)).join(", ")}]`),qi(t.limit)||(r+=", limit: "+t.limit),t.orderBy.length>0&&(r+=`, orderBy: [${t.orderBy.map(i=>function(a){return`${a.field.canonicalString()} (${a.dir})`}(i)).join(", ")}]`),t.startAt&&(r+=", startAt: ",r+=t.startAt.inclusive?"b:":"a:",r+=t.startAt.position.map(i=>vn(i)).join(",")),t.endAt&&(r+=", endAt: ",r+=t.endAt.inclusive?"a:":"b:",r+=t.endAt.position.map(i=>vn(i)).join(",")),`Target(${r})`}(Ke(n))}; limitType=${n.limitType})`}function Gi(n,e){return e.isFoundDocument()&&function(r,i){const s=i.key.path;return r.collectionGroup!==null?i.key.hasCollectionId(r.collectionGroup)&&r.path.isPrefixOf(s):L.isDocumentKey(r.path)?r.path.isEqual(s):r.path.isImmediateParentOf(s)}(n,e)&&function(r,i){for(const s of pn(r))if(!s.field.isKeyField()&&i.data.field(s.field)===null)return!1;return!0}(n,e)&&function(r,i){for(const s of r.filters)if(!s.matches(i))return!1;return!0}(n,e)&&function(r,i){return!(r.startAt&&!function(a,c,l){const d=hu(a,c,l);return a.inclusive?d<=0:d<0}(r.startAt,pn(r),i)||r.endAt&&!function(a,c,l){const d=hu(a,c,l);return a.inclusive?d>=0:d>0}(r.endAt,pn(r),i))}(n,e)}function J_(n){return n.collectionGroup||(n.path.length%2==1?n.path.lastSegment():n.path.get(n.path.length-2))}function mh(n){return(e,t)=>{let r=!1;for(const i of pn(n)){const s=Z_(i,e,t);if(s!==0)return s;r=r||i.field.isKeyField()}return 0}}function Z_(n,e,t){const r=n.field.isKeyField()?L.comparator(e.key,t.key):function(s,a,c){const l=a.data.field(s),d=c.data.field(s);return l!==null&&d!==null?yn(l,d):x()}(n.field,e,t);switch(n.dir){case"asc":return r;case"desc":return-1*r;default:return x()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class en{constructor(e,t){this.mapKeyFn=e,this.equalsFn=t,this.inner={},this.innerSize=0}get(e){const t=this.mapKeyFn(e),r=this.inner[t];if(r!==void 0){for(const[i,s]of r)if(this.equalsFn(i,e))return s}}has(e){return this.get(e)!==void 0}set(e,t){const r=this.mapKeyFn(e),i=this.inner[r];if(i===void 0)return this.inner[r]=[[e,t]],void this.innerSize++;for(let s=0;s<i.length;s++)if(this.equalsFn(i[s][0],e))return void(i[s]=[e,t]);i.push([e,t]),this.innerSize++}delete(e){const t=this.mapKeyFn(e),r=this.inner[t];if(r===void 0)return!1;for(let i=0;i<r.length;i++)if(this.equalsFn(r[i][0],e))return r.length===1?delete this.inner[t]:r.splice(i,1),this.innerSize--,!0;return!1}forEach(e){Vt(this.inner,(t,r)=>{for(const[i,s]of r)e(i,s)})}isEmpty(){return sh(this.inner)}size(){return this.innerSize}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ey=new te(L.comparator);function ft(){return ey}const gh=new te(L.comparator);function Xn(...n){let e=gh;for(const t of n)e=e.insert(t.key,t);return e}function _h(n){let e=gh;return n.forEach((t,r)=>e=e.insert(t,r.overlayedDocument)),e}function qt(){return nr()}function yh(){return nr()}function nr(){return new en(n=>n.toString(),(n,e)=>n.isEqual(e))}const ty=new te(L.comparator),ny=new ue(L.comparator);function H(...n){let e=ny;for(const t of n)e=e.add(t);return e}const ry=new ue(G);function iy(){return ry}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Uo(n,e){if(n.useProto3Json){if(isNaN(e))return{doubleValue:"NaN"};if(e===1/0)return{doubleValue:"Infinity"};if(e===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:Ii(e)?"-0":e}}function vh(n){return{integerValue:""+n}}function sy(n,e){return V_(e)?vh(e):Uo(n,e)}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wi{constructor(){this._=void 0}}function oy(n,e,t){return n instanceof mr?function(i,s){const a={fields:{__type__:{stringValue:"server_timestamp"},__local_write_time__:{timestampValue:{seconds:i.seconds,nanos:i.nanoseconds}}}};return s&&$i(s)&&(s=ji(s)),s&&(a.fields.__previous_value__=s),{mapValue:a}}(t,e):n instanceof gr?Th(n,e):n instanceof _r?Ih(n,e):function(i,s){const a=Eh(i,s),c=mu(a)+mu(i.Pe);return no(a)&&no(i.Pe)?vh(c):Uo(i.serializer,c)}(n,e)}function ay(n,e,t){return n instanceof gr?Th(n,e):n instanceof _r?Ih(n,e):t}function Eh(n,e){return n instanceof Ri?function(r){return no(r)||function(s){return!!s&&"doubleValue"in s}(r)}(e)?e:{integerValue:0}:null}class mr extends Wi{}class gr extends Wi{constructor(e){super(),this.elements=e}}function Th(n,e){const t=wh(e);for(const r of n.elements)t.some(i=>Ye(i,r))||t.push(r);return{arrayValue:{values:t}}}class _r extends Wi{constructor(e){super(),this.elements=e}}function Ih(n,e){let t=wh(e);for(const r of n.elements)t=t.filter(i=>!Ye(i,r));return{arrayValue:{values:t}}}class Ri extends Wi{constructor(e,t){super(),this.serializer=e,this.Pe=t}}function mu(n){return se(n.integerValue||n.doubleValue)}function wh(n){return Oo(n)&&n.arrayValue.values?n.arrayValue.values.slice():[]}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cy{constructor(e,t){this.field=e,this.transform=t}}function uy(n,e){return n.field.isEqual(e.field)&&function(r,i){return r instanceof gr&&i instanceof gr||r instanceof _r&&i instanceof _r?_n(r.elements,i.elements,Ye):r instanceof Ri&&i instanceof Ri?Ye(r.Pe,i.Pe):r instanceof mr&&i instanceof mr}(n.transform,e.transform)}class ly{constructor(e,t){this.version=e,this.transformResults=t}}class Pe{constructor(e,t){this.updateTime=e,this.exists=t}static none(){return new Pe}static exists(e){return new Pe(void 0,e)}static updateTime(e){return new Pe(e)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}function hi(n,e){return n.updateTime!==void 0?e.isFoundDocument()&&e.version.isEqual(n.updateTime):n.exists===void 0||n.exists===e.isFoundDocument()}class Ki{}function Ah(n,e){if(!n.hasLocalMutations||e&&e.fields.length===0)return null;if(e===null)return n.isNoDocument()?new Qi(n.key,Pe.none()):new wr(n.key,n.data,Pe.none());{const t=n.data,r=Ne.empty();let i=new ue(pe.comparator);for(let s of e.fields)if(!i.has(s)){let a=t.field(s);a===null&&s.length>1&&(s=s.popLast(),a=t.field(s)),a===null?r.delete(s):r.set(s,a),i=i.add(s)}return new Ot(n.key,r,new Oe(i.toArray()),Pe.none())}}function hy(n,e,t){n instanceof wr?function(i,s,a){const c=i.value.clone(),l=_u(i.fieldTransforms,s,a.transformResults);c.setAll(l),s.convertToFoundDocument(a.version,c).setHasCommittedMutations()}(n,e,t):n instanceof Ot?function(i,s,a){if(!hi(i.precondition,s))return void s.convertToUnknownDocument(a.version);const c=_u(i.fieldTransforms,s,a.transformResults),l=s.data;l.setAll(Rh(i)),l.setAll(c),s.convertToFoundDocument(a.version,l).setHasCommittedMutations()}(n,e,t):function(i,s,a){s.convertToNoDocument(a.version).setHasCommittedMutations()}(0,e,t)}function rr(n,e,t,r){return n instanceof wr?function(s,a,c,l){if(!hi(s.precondition,a))return c;const d=s.value.clone(),p=yu(s.fieldTransforms,l,a);return d.setAll(p),a.convertToFoundDocument(a.version,d).setHasLocalMutations(),null}(n,e,t,r):n instanceof Ot?function(s,a,c,l){if(!hi(s.precondition,a))return c;const d=yu(s.fieldTransforms,l,a),p=a.data;return p.setAll(Rh(s)),p.setAll(d),a.convertToFoundDocument(a.version,p).setHasLocalMutations(),c===null?null:c.unionWith(s.fieldMask.fields).unionWith(s.fieldTransforms.map(g=>g.field))}(n,e,t,r):function(s,a,c){return hi(s.precondition,a)?(a.convertToNoDocument(a.version).setHasLocalMutations(),null):c}(n,e,t)}function dy(n,e){let t=null;for(const r of n.fieldTransforms){const i=e.data.field(r.field),s=Eh(r.transform,i||null);s!=null&&(t===null&&(t=Ne.empty()),t.set(r.field,s))}return t||null}function gu(n,e){return n.type===e.type&&!!n.key.isEqual(e.key)&&!!n.precondition.isEqual(e.precondition)&&!!function(r,i){return r===void 0&&i===void 0||!(!r||!i)&&_n(r,i,(s,a)=>uy(s,a))}(n.fieldTransforms,e.fieldTransforms)&&(n.type===0?n.value.isEqual(e.value):n.type!==1||n.data.isEqual(e.data)&&n.fieldMask.isEqual(e.fieldMask))}class wr extends Ki{constructor(e,t,r,i=[]){super(),this.key=e,this.value=t,this.precondition=r,this.fieldTransforms=i,this.type=0}getFieldMask(){return null}}class Ot extends Ki{constructor(e,t,r,i,s=[]){super(),this.key=e,this.data=t,this.fieldMask=r,this.precondition=i,this.fieldTransforms=s,this.type=1}getFieldMask(){return this.fieldMask}}function Rh(n){const e=new Map;return n.fieldMask.fields.forEach(t=>{if(!t.isEmpty()){const r=n.data.field(t);e.set(t,r)}}),e}function _u(n,e,t){const r=new Map;Y(n.length===t.length);for(let i=0;i<t.length;i++){const s=n[i],a=s.transform,c=e.data.field(s.field);r.set(s.field,ay(a,c,t[i]))}return r}function yu(n,e,t){const r=new Map;for(const i of n){const s=i.transform,a=t.data.field(i.field);r.set(i.field,oy(s,a,e))}return r}class Qi extends Ki{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class fy extends Ki{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class py{constructor(e,t,r,i){this.batchId=e,this.localWriteTime=t,this.baseMutations=r,this.mutations=i}applyToRemoteDocument(e,t){const r=t.mutationResults;for(let i=0;i<this.mutations.length;i++){const s=this.mutations[i];s.key.isEqual(e.key)&&hy(s,e,r[i])}}applyToLocalView(e,t){for(const r of this.baseMutations)r.key.isEqual(e.key)&&(t=rr(r,e,t,this.localWriteTime));for(const r of this.mutations)r.key.isEqual(e.key)&&(t=rr(r,e,t,this.localWriteTime));return t}applyToLocalDocumentSet(e,t){const r=yh();return this.mutations.forEach(i=>{const s=e.get(i.key),a=s.overlayedDocument;let c=this.applyToLocalView(a,s.mutatedFields);c=t.has(i.key)?null:c;const l=Ah(a,c);l!==null&&r.set(i.key,l),a.isValidDocument()||a.convertToNoDocument(U.min())}),r}keys(){return this.mutations.reduce((e,t)=>e.add(t.key),H())}isEqual(e){return this.batchId===e.batchId&&_n(this.mutations,e.mutations,(t,r)=>gu(t,r))&&_n(this.baseMutations,e.baseMutations,(t,r)=>gu(t,r))}}class Fo{constructor(e,t,r,i){this.batch=e,this.commitVersion=t,this.mutationResults=r,this.docVersions=i}static from(e,t,r){Y(e.mutations.length===r.length);let i=function(){return ty}();const s=e.mutations;for(let a=0;a<s.length;a++)i=i.insert(s[a].key,r[a].version);return new Fo(e,t,r,i)}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class my{constructor(e,t){this.largestBatchId=e,this.mutation=t}getKey(){return this.mutation.key}isEqual(e){return e!==null&&this.mutation===e.mutation}toString(){return`Overlay{
      largestBatchId: ${this.largestBatchId},
      mutation: ${this.mutation.toString()}
    }`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gy{constructor(e,t){this.count=e,this.unchangedNames=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var oe,W;function _y(n){switch(n){default:return x();case S.CANCELLED:case S.UNKNOWN:case S.DEADLINE_EXCEEDED:case S.RESOURCE_EXHAUSTED:case S.INTERNAL:case S.UNAVAILABLE:case S.UNAUTHENTICATED:return!1;case S.INVALID_ARGUMENT:case S.NOT_FOUND:case S.ALREADY_EXISTS:case S.PERMISSION_DENIED:case S.FAILED_PRECONDITION:case S.ABORTED:case S.OUT_OF_RANGE:case S.UNIMPLEMENTED:case S.DATA_LOSS:return!0}}function bh(n){if(n===void 0)return dt("GRPC error has no .code"),S.UNKNOWN;switch(n){case oe.OK:return S.OK;case oe.CANCELLED:return S.CANCELLED;case oe.UNKNOWN:return S.UNKNOWN;case oe.DEADLINE_EXCEEDED:return S.DEADLINE_EXCEEDED;case oe.RESOURCE_EXHAUSTED:return S.RESOURCE_EXHAUSTED;case oe.INTERNAL:return S.INTERNAL;case oe.UNAVAILABLE:return S.UNAVAILABLE;case oe.UNAUTHENTICATED:return S.UNAUTHENTICATED;case oe.INVALID_ARGUMENT:return S.INVALID_ARGUMENT;case oe.NOT_FOUND:return S.NOT_FOUND;case oe.ALREADY_EXISTS:return S.ALREADY_EXISTS;case oe.PERMISSION_DENIED:return S.PERMISSION_DENIED;case oe.FAILED_PRECONDITION:return S.FAILED_PRECONDITION;case oe.ABORTED:return S.ABORTED;case oe.OUT_OF_RANGE:return S.OUT_OF_RANGE;case oe.UNIMPLEMENTED:return S.UNIMPLEMENTED;case oe.DATA_LOSS:return S.DATA_LOSS;default:return x()}}(W=oe||(oe={}))[W.OK=0]="OK",W[W.CANCELLED=1]="CANCELLED",W[W.UNKNOWN=2]="UNKNOWN",W[W.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",W[W.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",W[W.NOT_FOUND=5]="NOT_FOUND",W[W.ALREADY_EXISTS=6]="ALREADY_EXISTS",W[W.PERMISSION_DENIED=7]="PERMISSION_DENIED",W[W.UNAUTHENTICATED=16]="UNAUTHENTICATED",W[W.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",W[W.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",W[W.ABORTED=10]="ABORTED",W[W.OUT_OF_RANGE=11]="OUT_OF_RANGE",W[W.UNIMPLEMENTED=12]="UNIMPLEMENTED",W[W.INTERNAL=13]="INTERNAL",W[W.UNAVAILABLE=14]="UNAVAILABLE",W[W.DATA_LOSS=15]="DATA_LOSS";/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function yy(){return new TextEncoder}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const vy=new jt([4294967295,4294967295],0);function vu(n){const e=yy().encode(n),t=new Xl;return t.update(e),new Uint8Array(t.digest())}function Eu(n){const e=new DataView(n.buffer),t=e.getUint32(0,!0),r=e.getUint32(4,!0),i=e.getUint32(8,!0),s=e.getUint32(12,!0);return[new jt([t,r],0),new jt([i,s],0)]}class Bo{constructor(e,t,r){if(this.bitmap=e,this.padding=t,this.hashCount=r,t<0||t>=8)throw new Jn(`Invalid padding: ${t}`);if(r<0)throw new Jn(`Invalid hash count: ${r}`);if(e.length>0&&this.hashCount===0)throw new Jn(`Invalid hash count: ${r}`);if(e.length===0&&t!==0)throw new Jn(`Invalid padding when bitmap length is 0: ${t}`);this.Te=8*e.length-t,this.Ie=jt.fromNumber(this.Te)}Ee(e,t,r){let i=e.add(t.multiply(jt.fromNumber(r)));return i.compare(vy)===1&&(i=new jt([i.getBits(0),i.getBits(1)],0)),i.modulo(this.Ie).toNumber()}de(e){return(this.bitmap[Math.floor(e/8)]&1<<e%8)!=0}mightContain(e){if(this.Te===0)return!1;const t=vu(e),[r,i]=Eu(t);for(let s=0;s<this.hashCount;s++){const a=this.Ee(r,i,s);if(!this.de(a))return!1}return!0}static create(e,t,r){const i=e%8==0?0:8-e%8,s=new Uint8Array(Math.ceil(e/8)),a=new Bo(s,i,t);return r.forEach(c=>a.insert(c)),a}insert(e){if(this.Te===0)return;const t=vu(e),[r,i]=Eu(t);for(let s=0;s<this.hashCount;s++){const a=this.Ee(r,i,s);this.Ae(a)}}Ae(e){const t=Math.floor(e/8),r=e%8;this.bitmap[t]|=1<<r}}class Jn extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Yi{constructor(e,t,r,i,s){this.snapshotVersion=e,this.targetChanges=t,this.targetMismatches=r,this.documentUpdates=i,this.resolvedLimboDocuments=s}static createSynthesizedRemoteEventForCurrentChange(e,t,r){const i=new Map;return i.set(e,Ar.createSynthesizedTargetChangeForCurrentChange(e,t,r)),new Yi(U.min(),i,new te(G),ft(),H())}}class Ar{constructor(e,t,r,i,s){this.resumeToken=e,this.current=t,this.addedDocuments=r,this.modifiedDocuments=i,this.removedDocuments=s}static createSynthesizedTargetChangeForCurrentChange(e,t,r){return new Ar(r,t,H(),H(),H())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class di{constructor(e,t,r,i){this.Re=e,this.removedTargetIds=t,this.key=r,this.Ve=i}}class Sh{constructor(e,t){this.targetId=e,this.me=t}}class Ph{constructor(e,t,r=me.EMPTY_BYTE_STRING,i=null){this.state=e,this.targetIds=t,this.resumeToken=r,this.cause=i}}class Tu{constructor(){this.fe=0,this.ge=Iu(),this.pe=me.EMPTY_BYTE_STRING,this.ye=!1,this.we=!0}get current(){return this.ye}get resumeToken(){return this.pe}get Se(){return this.fe!==0}get be(){return this.we}De(e){e.approximateByteSize()>0&&(this.we=!0,this.pe=e)}ve(){let e=H(),t=H(),r=H();return this.ge.forEach((i,s)=>{switch(s){case 0:e=e.add(i);break;case 2:t=t.add(i);break;case 1:r=r.add(i);break;default:x()}}),new Ar(this.pe,this.ye,e,t,r)}Ce(){this.we=!1,this.ge=Iu()}Fe(e,t){this.we=!0,this.ge=this.ge.insert(e,t)}Me(e){this.we=!0,this.ge=this.ge.remove(e)}xe(){this.fe+=1}Oe(){this.fe-=1,Y(this.fe>=0)}Ne(){this.we=!0,this.ye=!0}}class Ey{constructor(e){this.Le=e,this.Be=new Map,this.ke=ft(),this.qe=ei(),this.Qe=ei(),this.Ke=new te(G)}$e(e){for(const t of e.Re)e.Ve&&e.Ve.isFoundDocument()?this.Ue(t,e.Ve):this.We(t,e.key,e.Ve);for(const t of e.removedTargetIds)this.We(t,e.key,e.Ve)}Ge(e){this.forEachTarget(e,t=>{const r=this.ze(t);switch(e.state){case 0:this.je(t)&&r.De(e.resumeToken);break;case 1:r.Oe(),r.Se||r.Ce(),r.De(e.resumeToken);break;case 2:r.Oe(),r.Se||this.removeTarget(t);break;case 3:this.je(t)&&(r.Ne(),r.De(e.resumeToken));break;case 4:this.je(t)&&(this.He(t),r.De(e.resumeToken));break;default:x()}})}forEachTarget(e,t){e.targetIds.length>0?e.targetIds.forEach(t):this.Be.forEach((r,i)=>{this.je(i)&&t(i)})}Je(e){const t=e.targetId,r=e.me.count,i=this.Ye(t);if(i){const s=i.target;if(io(s))if(r===0){const a=new L(s.path);this.We(t,a,Ie.newNoDocument(a,U.min()))}else Y(r===1);else{const a=this.Ze(t);if(a!==r){const c=this.Xe(e),l=c?this.et(c,e,a):1;if(l!==0){this.He(t);const d=l===2?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.Ke=this.Ke.insert(t,d)}}}}}Xe(e){const t=e.me.unchangedNames;if(!t||!t.bits)return null;const{bits:{bitmap:r="",padding:i=0},hashCount:s=0}=t;let a,c;try{a=Ct(r).toUint8Array()}catch(l){if(l instanceof oh)return gn("Decoding the base64 bloom filter in existence filter failed ("+l.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw l}try{c=new Bo(a,i,s)}catch(l){return gn(l instanceof Jn?"BloomFilter error: ":"Applying bloom filter failed: ",l),null}return c.Te===0?null:c}et(e,t,r){return t.me.count===r-this.rt(e,t.targetId)?0:2}rt(e,t){const r=this.Le.getRemoteKeysForTarget(t);let i=0;return r.forEach(s=>{const a=this.Le.nt(),c=`projects/${a.projectId}/databases/${a.database}/documents/${s.path.canonicalString()}`;e.mightContain(c)||(this.We(t,s,null),i++)}),i}it(e){const t=new Map;this.Be.forEach((s,a)=>{const c=this.Ye(a);if(c){if(s.current&&io(c.target)){const l=new L(c.target.path);this.st(l).has(a)||this.ot(a,l)||this.We(a,l,Ie.newNoDocument(l,e))}s.be&&(t.set(a,s.ve()),s.Ce())}});let r=H();this.Qe.forEach((s,a)=>{let c=!0;a.forEachWhile(l=>{const d=this.Ye(l);return!d||d.purpose==="TargetPurposeLimboResolution"||(c=!1,!1)}),c&&(r=r.add(s))}),this.ke.forEach((s,a)=>a.setReadTime(e));const i=new Yi(e,t,this.Ke,this.ke,r);return this.ke=ft(),this.qe=ei(),this.Qe=ei(),this.Ke=new te(G),i}Ue(e,t){if(!this.je(e))return;const r=this.ot(e,t.key)?2:0;this.ze(e).Fe(t.key,r),this.ke=this.ke.insert(t.key,t),this.qe=this.qe.insert(t.key,this.st(t.key).add(e)),this.Qe=this.Qe.insert(t.key,this._t(t.key).add(e))}We(e,t,r){if(!this.je(e))return;const i=this.ze(e);this.ot(e,t)?i.Fe(t,1):i.Me(t),this.Qe=this.Qe.insert(t,this._t(t).delete(e)),this.Qe=this.Qe.insert(t,this._t(t).add(e)),r&&(this.ke=this.ke.insert(t,r))}removeTarget(e){this.Be.delete(e)}Ze(e){const t=this.ze(e).ve();return this.Le.getRemoteKeysForTarget(e).size+t.addedDocuments.size-t.removedDocuments.size}xe(e){this.ze(e).xe()}ze(e){let t=this.Be.get(e);return t||(t=new Tu,this.Be.set(e,t)),t}_t(e){let t=this.Qe.get(e);return t||(t=new ue(G),this.Qe=this.Qe.insert(e,t)),t}st(e){let t=this.qe.get(e);return t||(t=new ue(G),this.qe=this.qe.insert(e,t)),t}je(e){const t=this.Ye(e)!==null;return t||O("WatchChangeAggregator","Detected inactive target",e),t}Ye(e){const t=this.Be.get(e);return t&&t.Se?null:this.Le.ut(e)}He(e){this.Be.set(e,new Tu),this.Le.getRemoteKeysForTarget(e).forEach(t=>{this.We(e,t,null)})}ot(e,t){return this.Le.getRemoteKeysForTarget(e).has(t)}}function ei(){return new te(L.comparator)}function Iu(){return new te(L.comparator)}const Ty={asc:"ASCENDING",desc:"DESCENDING"},Iy={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},wy={and:"AND",or:"OR"};class Ay{constructor(e,t){this.databaseId=e,this.useProto3Json=t}}function oo(n,e){return n.useProto3Json||qi(e)?e:{value:e}}function bi(n,e){return n.useProto3Json?`${new Date(1e3*e.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+e.nanoseconds).slice(-9)}Z`:{seconds:""+e.seconds,nanos:e.nanoseconds}}function Ch(n,e){return n.useProto3Json?e.toBase64():e.toUint8Array()}function Ry(n,e){return bi(n,e.toTimestamp())}function Qe(n){return Y(!!n),U.fromTimestamp(function(t){const r=Pt(t);return new ce(r.seconds,r.nanos)}(n))}function qo(n,e){return ao(n,e).canonicalString()}function ao(n,e){const t=function(i){return new J(["projects",i.projectId,"databases",i.database])}(n).child("documents");return e===void 0?t:t.child(e)}function kh(n){const e=J.fromString(n);return Y(Lh(e)),e}function co(n,e){return qo(n.databaseId,e.path)}function Us(n,e){const t=kh(e);if(t.get(1)!==n.databaseId.projectId)throw new D(S.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+t.get(1)+" vs "+n.databaseId.projectId);if(t.get(3)!==n.databaseId.database)throw new D(S.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+t.get(3)+" vs "+n.databaseId.database);return new L(Dh(t))}function Nh(n,e){return qo(n.databaseId,e)}function by(n){const e=kh(n);return e.length===4?J.emptyPath():Dh(e)}function uo(n){return new J(["projects",n.databaseId.projectId,"databases",n.databaseId.database]).canonicalString()}function Dh(n){return Y(n.length>4&&n.get(4)==="documents"),n.popFirst(5)}function wu(n,e,t){return{name:co(n,e),fields:t.value.mapValue.fields}}function Sy(n,e){let t;if("targetChange"in e){e.targetChange;const r=function(d){return d==="NO_CHANGE"?0:d==="ADD"?1:d==="REMOVE"?2:d==="CURRENT"?3:d==="RESET"?4:x()}(e.targetChange.targetChangeType||"NO_CHANGE"),i=e.targetChange.targetIds||[],s=function(d,p){return d.useProto3Json?(Y(p===void 0||typeof p=="string"),me.fromBase64String(p||"")):(Y(p===void 0||p instanceof Buffer||p instanceof Uint8Array),me.fromUint8Array(p||new Uint8Array))}(n,e.targetChange.resumeToken),a=e.targetChange.cause,c=a&&function(d){const p=d.code===void 0?S.UNKNOWN:bh(d.code);return new D(p,d.message||"")}(a);t=new Ph(r,i,s,c||null)}else if("documentChange"in e){e.documentChange;const r=e.documentChange;r.document,r.document.name,r.document.updateTime;const i=Us(n,r.document.name),s=Qe(r.document.updateTime),a=r.document.createTime?Qe(r.document.createTime):U.min(),c=new Ne({mapValue:{fields:r.document.fields}}),l=Ie.newFoundDocument(i,s,a,c),d=r.targetIds||[],p=r.removedTargetIds||[];t=new di(d,p,l.key,l)}else if("documentDelete"in e){e.documentDelete;const r=e.documentDelete;r.document;const i=Us(n,r.document),s=r.readTime?Qe(r.readTime):U.min(),a=Ie.newNoDocument(i,s),c=r.removedTargetIds||[];t=new di([],c,a.key,a)}else if("documentRemove"in e){e.documentRemove;const r=e.documentRemove;r.document;const i=Us(n,r.document),s=r.removedTargetIds||[];t=new di([],s,i,null)}else{if(!("filter"in e))return x();{e.filter;const r=e.filter;r.targetId;const{count:i=0,unchangedNames:s}=r,a=new gy(i,s),c=r.targetId;t=new Sh(c,a)}}return t}function Py(n,e){let t;if(e instanceof wr)t={update:wu(n,e.key,e.value)};else if(e instanceof Qi)t={delete:co(n,e.key)};else if(e instanceof Ot)t={update:wu(n,e.key,e.data),updateMask:xy(e.fieldMask)};else{if(!(e instanceof fy))return x();t={verify:co(n,e.key)}}return e.fieldTransforms.length>0&&(t.updateTransforms=e.fieldTransforms.map(r=>function(s,a){const c=a.transform;if(c instanceof mr)return{fieldPath:a.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(c instanceof gr)return{fieldPath:a.field.canonicalString(),appendMissingElements:{values:c.elements}};if(c instanceof _r)return{fieldPath:a.field.canonicalString(),removeAllFromArray:{values:c.elements}};if(c instanceof Ri)return{fieldPath:a.field.canonicalString(),increment:c.Pe};throw x()}(0,r))),e.precondition.isNone||(t.currentDocument=function(i,s){return s.updateTime!==void 0?{updateTime:Ry(i,s.updateTime)}:s.exists!==void 0?{exists:s.exists}:x()}(n,e.precondition)),t}function Cy(n,e){return n&&n.length>0?(Y(e!==void 0),n.map(t=>function(i,s){let a=i.updateTime?Qe(i.updateTime):Qe(s);return a.isEqual(U.min())&&(a=Qe(s)),new ly(a,i.transformResults||[])}(t,e))):[]}function ky(n,e){return{documents:[Nh(n,e.path)]}}function Ny(n,e){const t={structuredQuery:{}},r=e.path;let i;e.collectionGroup!==null?(i=r,t.structuredQuery.from=[{collectionId:e.collectionGroup,allDescendants:!0}]):(i=r.popLast(),t.structuredQuery.from=[{collectionId:r.lastSegment()}]),t.parent=Nh(n,i);const s=function(d){if(d.length!==0)return Oh(He.create(d,"and"))}(e.filters);s&&(t.structuredQuery.where=s);const a=function(d){if(d.length!==0)return d.map(p=>function(E){return{field:un(E.field),direction:Oy(E.dir)}}(p))}(e.orderBy);a&&(t.structuredQuery.orderBy=a);const c=oo(n,e.limit);return c!==null&&(t.structuredQuery.limit=c),e.startAt&&(t.structuredQuery.startAt=function(d){return{before:d.inclusive,values:d.position}}(e.startAt)),e.endAt&&(t.structuredQuery.endAt=function(d){return{before:!d.inclusive,values:d.position}}(e.endAt)),{ct:t,parent:i}}function Dy(n){let e=by(n.parent);const t=n.structuredQuery,r=t.from?t.from.length:0;let i=null;if(r>0){Y(r===1);const p=t.from[0];p.allDescendants?i=p.collectionId:e=e.child(p.collectionId)}let s=[];t.where&&(s=function(g){const E=Vh(g);return E instanceof He&&lh(E)?E.getFilters():[E]}(t.where));let a=[];t.orderBy&&(a=function(g){return g.map(E=>function(k){return new pr(ln(k.field),function(C){switch(C){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}}(k.direction))}(E))}(t.orderBy));let c=null;t.limit&&(c=function(g){let E;return E=typeof g=="object"?g.value:g,qi(E)?null:E}(t.limit));let l=null;t.startAt&&(l=function(g){const E=!!g.before,R=g.values||[];return new En(R,E)}(t.startAt));let d=null;return t.endAt&&(d=function(g){const E=!g.before,R=g.values||[];return new En(R,E)}(t.endAt)),Y_(e,i,a,s,c,"F",l,d)}function Vy(n,e){const t=function(i){switch(i){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return x()}}(e.purpose);return t==null?null:{"goog-listen-tags":t}}function Vh(n){return n.unaryFilter!==void 0?function(t){switch(t.unaryFilter.op){case"IS_NAN":const r=ln(t.unaryFilter.field);return ae.create(r,"==",{doubleValue:NaN});case"IS_NULL":const i=ln(t.unaryFilter.field);return ae.create(i,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const s=ln(t.unaryFilter.field);return ae.create(s,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const a=ln(t.unaryFilter.field);return ae.create(a,"!=",{nullValue:"NULL_VALUE"});default:return x()}}(n):n.fieldFilter!==void 0?function(t){return ae.create(ln(t.fieldFilter.field),function(i){switch(i){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";default:return x()}}(t.fieldFilter.op),t.fieldFilter.value)}(n):n.compositeFilter!==void 0?function(t){return He.create(t.compositeFilter.filters.map(r=>Vh(r)),function(i){switch(i){case"AND":return"and";case"OR":return"or";default:return x()}}(t.compositeFilter.op))}(n):x()}function Oy(n){return Ty[n]}function Ly(n){return Iy[n]}function My(n){return wy[n]}function un(n){return{fieldPath:n.canonicalString()}}function ln(n){return pe.fromServerFormat(n.fieldPath)}function Oh(n){return n instanceof ae?function(t){if(t.op==="=="){if(lu(t.value))return{unaryFilter:{field:un(t.field),op:"IS_NAN"}};if(uu(t.value))return{unaryFilter:{field:un(t.field),op:"IS_NULL"}}}else if(t.op==="!="){if(lu(t.value))return{unaryFilter:{field:un(t.field),op:"IS_NOT_NAN"}};if(uu(t.value))return{unaryFilter:{field:un(t.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:un(t.field),op:Ly(t.op),value:t.value}}}(n):n instanceof He?function(t){const r=t.getFilters().map(i=>Oh(i));return r.length===1?r[0]:{compositeFilter:{op:My(t.op),filters:r}}}(n):x()}function xy(n){const e=[];return n.fields.forEach(t=>e.push(t.canonicalString())),{fieldPaths:e}}function Lh(n){return n.length>=4&&n.get(0)==="projects"&&n.get(2)==="databases"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class At{constructor(e,t,r,i,s=U.min(),a=U.min(),c=me.EMPTY_BYTE_STRING,l=null){this.target=e,this.targetId=t,this.purpose=r,this.sequenceNumber=i,this.snapshotVersion=s,this.lastLimboFreeSnapshotVersion=a,this.resumeToken=c,this.expectedCount=l}withSequenceNumber(e){return new At(this.target,this.targetId,this.purpose,e,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(e,t){return new At(this.target,this.targetId,this.purpose,this.sequenceNumber,t,this.lastLimboFreeSnapshotVersion,e,null)}withExpectedCount(e){return new At(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,e)}withLastLimboFreeSnapshotVersion(e){return new At(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,e,this.resumeToken,this.expectedCount)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Uy{constructor(e){this.ht=e}}function Fy(n){const e=Dy({parent:n.parent,structuredQuery:n.structuredQuery});return n.limitType==="LAST"?Ai(e,e.limit,"L"):e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class By{constructor(){this.ln=new qy}addToCollectionParentIndex(e,t){return this.ln.add(t),P.resolve()}getCollectionParents(e,t){return P.resolve(this.ln.getEntries(t))}addFieldIndex(e,t){return P.resolve()}deleteFieldIndex(e,t){return P.resolve()}deleteAllFieldIndexes(e){return P.resolve()}createTargetIndexes(e,t){return P.resolve()}getDocumentsMatchingTarget(e,t){return P.resolve(null)}getIndexType(e,t){return P.resolve(0)}getFieldIndexes(e,t){return P.resolve([])}getNextCollectionGroupToUpdate(e){return P.resolve(null)}getMinOffset(e,t){return P.resolve(St.min())}getMinOffsetFromCollectionGroup(e,t){return P.resolve(St.min())}updateCollectionGroup(e,t,r){return P.resolve()}updateIndexEntries(e,t){return P.resolve()}}class qy{constructor(){this.index={}}add(e){const t=e.lastSegment(),r=e.popLast(),i=this.index[t]||new ue(J.comparator),s=!i.has(r);return this.index[t]=i.add(r),s}has(e){const t=e.lastSegment(),r=e.popLast(),i=this.index[t];return i&&i.has(r)}getEntries(e){return(this.index[e]||new ue(J.comparator)).toArray()}}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Au={didRun:!1,sequenceNumbersCollected:0,targetsRemoved:0,documentsRemoved:0};class ke{static withCacheSize(e){return new ke(e,ke.DEFAULT_COLLECTION_PERCENTILE,ke.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT)}constructor(e,t,r){this.cacheSizeCollectionThreshold=e,this.percentileToCollect=t,this.maximumSequenceNumbersToCollect=r}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ke.DEFAULT_COLLECTION_PERCENTILE=10,ke.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT=1e3,ke.DEFAULT=new ke(41943040,ke.DEFAULT_COLLECTION_PERCENTILE,ke.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT),ke.DISABLED=new ke(-1,0,0);/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Tn{constructor(e){this.kn=e}next(){return this.kn+=2,this.kn}static qn(){return new Tn(0)}static Qn(){return new Tn(-1)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ru([n,e],[t,r]){const i=G(n,t);return i===0?G(e,r):i}class $y{constructor(e){this.Gn=e,this.buffer=new ue(Ru),this.zn=0}jn(){return++this.zn}Hn(e){const t=[e,this.jn()];if(this.buffer.size<this.Gn)this.buffer=this.buffer.add(t);else{const r=this.buffer.last();Ru(t,r)<0&&(this.buffer=this.buffer.delete(r).add(t))}}get maxValue(){return this.buffer.last()[0]}}class jy{constructor(e,t,r){this.garbageCollector=e,this.asyncQueue=t,this.localStore=r,this.Jn=null}start(){this.garbageCollector.params.cacheSizeCollectionThreshold!==-1&&this.Yn(6e4)}stop(){this.Jn&&(this.Jn.cancel(),this.Jn=null)}get started(){return this.Jn!==null}Yn(e){O("LruGarbageCollector",`Garbage collection scheduled in ${e}ms`),this.Jn=this.asyncQueue.enqueueAfterDelay("lru_garbage_collection",e,async()=>{this.Jn=null;try{await this.localStore.collectGarbage(this.garbageCollector)}catch(t){Sn(t)?O("LruGarbageCollector","Ignoring IndexedDB error during garbage collection: ",t):await bn(t)}await this.Yn(3e5)})}}class zy{constructor(e,t){this.Zn=e,this.params=t}calculateTargetCount(e,t){return this.Zn.Xn(e).next(r=>Math.floor(t/100*r))}nthSequenceNumber(e,t){if(t===0)return P.resolve(Bi.oe);const r=new $y(t);return this.Zn.forEachTarget(e,i=>r.Hn(i.sequenceNumber)).next(()=>this.Zn.er(e,i=>r.Hn(i))).next(()=>r.maxValue)}removeTargets(e,t,r){return this.Zn.removeTargets(e,t,r)}removeOrphanedDocuments(e,t){return this.Zn.removeOrphanedDocuments(e,t)}collect(e,t){return this.params.cacheSizeCollectionThreshold===-1?(O("LruGarbageCollector","Garbage collection skipped; disabled"),P.resolve(Au)):this.getCacheSize(e).next(r=>r<this.params.cacheSizeCollectionThreshold?(O("LruGarbageCollector",`Garbage collection skipped; Cache size ${r} is lower than threshold ${this.params.cacheSizeCollectionThreshold}`),Au):this.tr(e,t))}getCacheSize(e){return this.Zn.getCacheSize(e)}tr(e,t){let r,i,s,a,c,l,d;const p=Date.now();return this.calculateTargetCount(e,this.params.percentileToCollect).next(g=>(g>this.params.maximumSequenceNumbersToCollect?(O("LruGarbageCollector",`Capping sequence numbers to collect down to the maximum of ${this.params.maximumSequenceNumbersToCollect} from ${g}`),i=this.params.maximumSequenceNumbersToCollect):i=g,a=Date.now(),this.nthSequenceNumber(e,i))).next(g=>(r=g,c=Date.now(),this.removeTargets(e,r,t))).next(g=>(s=g,l=Date.now(),this.removeOrphanedDocuments(e,r))).next(g=>(d=Date.now(),an()<=z.DEBUG&&O("LruGarbageCollector",`LRU Garbage Collection
	Counted targets in ${a-p}ms
	Determined least recently used ${i} in `+(c-a)+`ms
	Removed ${s} targets in `+(l-c)+`ms
	Removed ${g} documents in `+(d-l)+`ms
Total Duration: ${d-p}ms`),P.resolve({didRun:!0,sequenceNumbersCollected:i,targetsRemoved:s,documentsRemoved:g})))}}function Hy(n,e){return new zy(n,e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gy{constructor(){this.changes=new en(e=>e.toString(),(e,t)=>e.isEqual(t)),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,t){this.assertNotApplied(),this.changes.set(e,Ie.newInvalidDocument(e).setReadTime(t))}getEntry(e,t){this.assertNotApplied();const r=this.changes.get(t);return r!==void 0?P.resolve(r):this.getFromCache(e,t)}getEntries(e,t){return this.getAllFromCache(e,t)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wy{constructor(e,t){this.overlayedDocument=e,this.mutatedFields=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ky{constructor(e,t,r,i){this.remoteDocumentCache=e,this.mutationQueue=t,this.documentOverlayCache=r,this.indexManager=i}getDocument(e,t){let r=null;return this.documentOverlayCache.getOverlay(e,t).next(i=>(r=i,this.remoteDocumentCache.getEntry(e,t))).next(i=>(r!==null&&rr(r.mutation,i,Oe.empty(),ce.now()),i))}getDocuments(e,t){return this.remoteDocumentCache.getEntries(e,t).next(r=>this.getLocalViewOfDocuments(e,r,H()).next(()=>r))}getLocalViewOfDocuments(e,t,r=H()){const i=qt();return this.populateOverlays(e,i,t).next(()=>this.computeViews(e,t,i,r).next(s=>{let a=Xn();return s.forEach((c,l)=>{a=a.insert(c,l.overlayedDocument)}),a}))}getOverlayedDocuments(e,t){const r=qt();return this.populateOverlays(e,r,t).next(()=>this.computeViews(e,t,r,H()))}populateOverlays(e,t,r){const i=[];return r.forEach(s=>{t.has(s)||i.push(s)}),this.documentOverlayCache.getOverlays(e,i).next(s=>{s.forEach((a,c)=>{t.set(a,c)})})}computeViews(e,t,r,i){let s=ft();const a=nr(),c=function(){return nr()}();return t.forEach((l,d)=>{const p=r.get(d.key);i.has(d.key)&&(p===void 0||p.mutation instanceof Ot)?s=s.insert(d.key,d):p!==void 0?(a.set(d.key,p.mutation.getFieldMask()),rr(p.mutation,d,p.mutation.getFieldMask(),ce.now())):a.set(d.key,Oe.empty())}),this.recalculateAndSaveOverlays(e,s).next(l=>(l.forEach((d,p)=>a.set(d,p)),t.forEach((d,p)=>{var g;return c.set(d,new Wy(p,(g=a.get(d))!==null&&g!==void 0?g:null))}),c))}recalculateAndSaveOverlays(e,t){const r=nr();let i=new te((a,c)=>a-c),s=H();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e,t).next(a=>{for(const c of a)c.keys().forEach(l=>{const d=t.get(l);if(d===null)return;let p=r.get(l)||Oe.empty();p=c.applyToLocalView(d,p),r.set(l,p);const g=(i.get(c.batchId)||H()).add(l);i=i.insert(c.batchId,g)})}).next(()=>{const a=[],c=i.getReverseIterator();for(;c.hasNext();){const l=c.getNext(),d=l.key,p=l.value,g=yh();p.forEach(E=>{if(!s.has(E)){const R=Ah(t.get(E),r.get(E));R!==null&&g.set(E,R),s=s.add(E)}}),a.push(this.documentOverlayCache.saveOverlays(e,d,g))}return P.waitFor(a)}).next(()=>r)}recalculateAndSaveOverlaysForDocumentKeys(e,t){return this.remoteDocumentCache.getEntries(e,t).next(r=>this.recalculateAndSaveOverlays(e,r))}getDocumentsMatchingQuery(e,t,r,i){return function(a){return L.isDocumentKey(a.path)&&a.collectionGroup===null&&a.filters.length===0}(t)?this.getDocumentsMatchingDocumentQuery(e,t.path):xo(t)?this.getDocumentsMatchingCollectionGroupQuery(e,t,r,i):this.getDocumentsMatchingCollectionQuery(e,t,r,i)}getNextDocuments(e,t,r,i){return this.remoteDocumentCache.getAllFromCollectionGroup(e,t,r,i).next(s=>{const a=i-s.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(e,t,r.largestBatchId,i-s.size):P.resolve(qt());let c=-1,l=s;return a.next(d=>P.forEach(d,(p,g)=>(c<g.largestBatchId&&(c=g.largestBatchId),s.get(p)?P.resolve():this.remoteDocumentCache.getEntry(e,p).next(E=>{l=l.insert(p,E)}))).next(()=>this.populateOverlays(e,d,s)).next(()=>this.computeViews(e,l,d,H())).next(p=>({batchId:c,changes:_h(p)})))})}getDocumentsMatchingDocumentQuery(e,t){return this.getDocument(e,new L(t)).next(r=>{let i=Xn();return r.isFoundDocument()&&(i=i.insert(r.key,r)),i})}getDocumentsMatchingCollectionGroupQuery(e,t,r,i){const s=t.collectionGroup;let a=Xn();return this.indexManager.getCollectionParents(e,s).next(c=>P.forEach(c,l=>{const d=function(g,E){return new Zt(E,null,g.explicitOrderBy.slice(),g.filters.slice(),g.limit,g.limitType,g.startAt,g.endAt)}(t,l.child(s));return this.getDocumentsMatchingCollectionQuery(e,d,r,i).next(p=>{p.forEach((g,E)=>{a=a.insert(g,E)})})}).next(()=>a))}getDocumentsMatchingCollectionQuery(e,t,r,i){let s;return this.documentOverlayCache.getOverlaysForCollection(e,t.path,r.largestBatchId).next(a=>(s=a,this.remoteDocumentCache.getDocumentsMatchingQuery(e,t,r,s,i))).next(a=>{s.forEach((l,d)=>{const p=d.getKey();a.get(p)===null&&(a=a.insert(p,Ie.newInvalidDocument(p)))});let c=Xn();return a.forEach((l,d)=>{const p=s.get(l);p!==void 0&&rr(p.mutation,d,Oe.empty(),ce.now()),Gi(t,d)&&(c=c.insert(l,d))}),c})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qy{constructor(e){this.serializer=e,this.Tr=new Map,this.Ir=new Map}getBundleMetadata(e,t){return P.resolve(this.Tr.get(t))}saveBundleMetadata(e,t){return this.Tr.set(t.id,function(i){return{id:i.id,version:i.version,createTime:Qe(i.createTime)}}(t)),P.resolve()}getNamedQuery(e,t){return P.resolve(this.Ir.get(t))}saveNamedQuery(e,t){return this.Ir.set(t.name,function(i){return{name:i.name,query:Fy(i.bundledQuery),readTime:Qe(i.readTime)}}(t)),P.resolve()}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Yy{constructor(){this.overlays=new te(L.comparator),this.Er=new Map}getOverlay(e,t){return P.resolve(this.overlays.get(t))}getOverlays(e,t){const r=qt();return P.forEach(t,i=>this.getOverlay(e,i).next(s=>{s!==null&&r.set(i,s)})).next(()=>r)}saveOverlays(e,t,r){return r.forEach((i,s)=>{this.Tt(e,t,s)}),P.resolve()}removeOverlaysForBatchId(e,t,r){const i=this.Er.get(r);return i!==void 0&&(i.forEach(s=>this.overlays=this.overlays.remove(s)),this.Er.delete(r)),P.resolve()}getOverlaysForCollection(e,t,r){const i=qt(),s=t.length+1,a=new L(t.child("")),c=this.overlays.getIteratorFrom(a);for(;c.hasNext();){const l=c.getNext().value,d=l.getKey();if(!t.isPrefixOf(d.path))break;d.path.length===s&&l.largestBatchId>r&&i.set(l.getKey(),l)}return P.resolve(i)}getOverlaysForCollectionGroup(e,t,r,i){let s=new te((d,p)=>d-p);const a=this.overlays.getIterator();for(;a.hasNext();){const d=a.getNext().value;if(d.getKey().getCollectionGroup()===t&&d.largestBatchId>r){let p=s.get(d.largestBatchId);p===null&&(p=qt(),s=s.insert(d.largestBatchId,p)),p.set(d.getKey(),d)}}const c=qt(),l=s.getIterator();for(;l.hasNext()&&(l.getNext().value.forEach((d,p)=>c.set(d,p)),!(c.size()>=i)););return P.resolve(c)}Tt(e,t,r){const i=this.overlays.get(r.key);if(i!==null){const a=this.Er.get(i.largestBatchId).delete(r.key);this.Er.set(i.largestBatchId,a)}this.overlays=this.overlays.insert(r.key,new my(t,r));let s=this.Er.get(t);s===void 0&&(s=H(),this.Er.set(t,s)),this.Er.set(t,s.add(r.key))}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xy{constructor(){this.sessionToken=me.EMPTY_BYTE_STRING}getSessionToken(e){return P.resolve(this.sessionToken)}setSessionToken(e,t){return this.sessionToken=t,P.resolve()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $o{constructor(){this.dr=new ue(le.Ar),this.Rr=new ue(le.Vr)}isEmpty(){return this.dr.isEmpty()}addReference(e,t){const r=new le(e,t);this.dr=this.dr.add(r),this.Rr=this.Rr.add(r)}mr(e,t){e.forEach(r=>this.addReference(r,t))}removeReference(e,t){this.gr(new le(e,t))}pr(e,t){e.forEach(r=>this.removeReference(r,t))}yr(e){const t=new L(new J([])),r=new le(t,e),i=new le(t,e+1),s=[];return this.Rr.forEachInRange([r,i],a=>{this.gr(a),s.push(a.key)}),s}wr(){this.dr.forEach(e=>this.gr(e))}gr(e){this.dr=this.dr.delete(e),this.Rr=this.Rr.delete(e)}Sr(e){const t=new L(new J([])),r=new le(t,e),i=new le(t,e+1);let s=H();return this.Rr.forEachInRange([r,i],a=>{s=s.add(a.key)}),s}containsKey(e){const t=new le(e,0),r=this.dr.firstAfterOrEqual(t);return r!==null&&e.isEqual(r.key)}}class le{constructor(e,t){this.key=e,this.br=t}static Ar(e,t){return L.comparator(e.key,t.key)||G(e.br,t.br)}static Vr(e,t){return G(e.br,t.br)||L.comparator(e.key,t.key)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Jy{constructor(e,t){this.indexManager=e,this.referenceDelegate=t,this.mutationQueue=[],this.Dr=1,this.vr=new ue(le.Ar)}checkEmpty(e){return P.resolve(this.mutationQueue.length===0)}addMutationBatch(e,t,r,i){const s=this.Dr;this.Dr++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const a=new py(s,t,r,i);this.mutationQueue.push(a);for(const c of i)this.vr=this.vr.add(new le(c.key,s)),this.indexManager.addToCollectionParentIndex(e,c.key.path.popLast());return P.resolve(a)}lookupMutationBatch(e,t){return P.resolve(this.Cr(t))}getNextMutationBatchAfterBatchId(e,t){const r=t+1,i=this.Fr(r),s=i<0?0:i;return P.resolve(this.mutationQueue.length>s?this.mutationQueue[s]:null)}getHighestUnacknowledgedBatchId(){return P.resolve(this.mutationQueue.length===0?-1:this.Dr-1)}getAllMutationBatches(e){return P.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(e,t){const r=new le(t,0),i=new le(t,Number.POSITIVE_INFINITY),s=[];return this.vr.forEachInRange([r,i],a=>{const c=this.Cr(a.br);s.push(c)}),P.resolve(s)}getAllMutationBatchesAffectingDocumentKeys(e,t){let r=new ue(G);return t.forEach(i=>{const s=new le(i,0),a=new le(i,Number.POSITIVE_INFINITY);this.vr.forEachInRange([s,a],c=>{r=r.add(c.br)})}),P.resolve(this.Mr(r))}getAllMutationBatchesAffectingQuery(e,t){const r=t.path,i=r.length+1;let s=r;L.isDocumentKey(s)||(s=s.child(""));const a=new le(new L(s),0);let c=new ue(G);return this.vr.forEachWhile(l=>{const d=l.key.path;return!!r.isPrefixOf(d)&&(d.length===i&&(c=c.add(l.br)),!0)},a),P.resolve(this.Mr(c))}Mr(e){const t=[];return e.forEach(r=>{const i=this.Cr(r);i!==null&&t.push(i)}),t}removeMutationBatch(e,t){Y(this.Or(t.batchId,"removed")===0),this.mutationQueue.shift();let r=this.vr;return P.forEach(t.mutations,i=>{const s=new le(i.key,t.batchId);return r=r.delete(s),this.referenceDelegate.markPotentiallyOrphaned(e,i.key)}).next(()=>{this.vr=r})}Ln(e){}containsKey(e,t){const r=new le(t,0),i=this.vr.firstAfterOrEqual(r);return P.resolve(t.isEqual(i&&i.key))}performConsistencyCheck(e){return this.mutationQueue.length,P.resolve()}Or(e,t){return this.Fr(e)}Fr(e){return this.mutationQueue.length===0?0:e-this.mutationQueue[0].batchId}Cr(e){const t=this.Fr(e);return t<0||t>=this.mutationQueue.length?null:this.mutationQueue[t]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zy{constructor(e){this.Nr=e,this.docs=function(){return new te(L.comparator)}(),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,t){const r=t.key,i=this.docs.get(r),s=i?i.size:0,a=this.Nr(t);return this.docs=this.docs.insert(r,{document:t.mutableCopy(),size:a}),this.size+=a-s,this.indexManager.addToCollectionParentIndex(e,r.path.popLast())}removeEntry(e){const t=this.docs.get(e);t&&(this.docs=this.docs.remove(e),this.size-=t.size)}getEntry(e,t){const r=this.docs.get(t);return P.resolve(r?r.document.mutableCopy():Ie.newInvalidDocument(t))}getEntries(e,t){let r=ft();return t.forEach(i=>{const s=this.docs.get(i);r=r.insert(i,s?s.document.mutableCopy():Ie.newInvalidDocument(i))}),P.resolve(r)}getDocumentsMatchingQuery(e,t,r,i){let s=ft();const a=t.path,c=new L(a.child("")),l=this.docs.getIteratorFrom(c);for(;l.hasNext();){const{key:d,value:{document:p}}=l.getNext();if(!a.isPrefixOf(d.path))break;d.path.length>a.length+1||C_(P_(p),r)<=0||(i.has(p.key)||Gi(t,p))&&(s=s.insert(p.key,p.mutableCopy()))}return P.resolve(s)}getAllFromCollectionGroup(e,t,r,i){x()}Lr(e,t){return P.forEach(this.docs,r=>t(r))}newChangeBuffer(e){return new ev(this)}getSize(e){return P.resolve(this.size)}}class ev extends Gy{constructor(e){super(),this.hr=e}applyChanges(e){const t=[];return this.changes.forEach((r,i)=>{i.isValidDocument()?t.push(this.hr.addEntry(e,i)):this.hr.removeEntry(r)}),P.waitFor(t)}getFromCache(e,t){return this.hr.getEntry(e,t)}getAllFromCache(e,t){return this.hr.getEntries(e,t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tv{constructor(e){this.persistence=e,this.Br=new en(t=>Lo(t),Mo),this.lastRemoteSnapshotVersion=U.min(),this.highestTargetId=0,this.kr=0,this.qr=new $o,this.targetCount=0,this.Qr=Tn.qn()}forEachTarget(e,t){return this.Br.forEach((r,i)=>t(i)),P.resolve()}getLastRemoteSnapshotVersion(e){return P.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return P.resolve(this.kr)}allocateTargetId(e){return this.highestTargetId=this.Qr.next(),P.resolve(this.highestTargetId)}setTargetsMetadata(e,t,r){return r&&(this.lastRemoteSnapshotVersion=r),t>this.kr&&(this.kr=t),P.resolve()}Un(e){this.Br.set(e.target,e);const t=e.targetId;t>this.highestTargetId&&(this.Qr=new Tn(t),this.highestTargetId=t),e.sequenceNumber>this.kr&&(this.kr=e.sequenceNumber)}addTargetData(e,t){return this.Un(t),this.targetCount+=1,P.resolve()}updateTargetData(e,t){return this.Un(t),P.resolve()}removeTargetData(e,t){return this.Br.delete(t.target),this.qr.yr(t.targetId),this.targetCount-=1,P.resolve()}removeTargets(e,t,r){let i=0;const s=[];return this.Br.forEach((a,c)=>{c.sequenceNumber<=t&&r.get(c.targetId)===null&&(this.Br.delete(a),s.push(this.removeMatchingKeysForTargetId(e,c.targetId)),i++)}),P.waitFor(s).next(()=>i)}getTargetCount(e){return P.resolve(this.targetCount)}getTargetData(e,t){const r=this.Br.get(t)||null;return P.resolve(r)}addMatchingKeys(e,t,r){return this.qr.mr(t,r),P.resolve()}removeMatchingKeys(e,t,r){this.qr.pr(t,r);const i=this.persistence.referenceDelegate,s=[];return i&&t.forEach(a=>{s.push(i.markPotentiallyOrphaned(e,a))}),P.waitFor(s)}removeMatchingKeysForTargetId(e,t){return this.qr.yr(t),P.resolve()}getMatchingKeysForTargetId(e,t){const r=this.qr.Sr(t);return P.resolve(r)}containsKey(e,t){return P.resolve(this.qr.containsKey(t))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mh{constructor(e,t){this.Kr={},this.overlays={},this.$r=new Bi(0),this.Ur=!1,this.Ur=!0,this.Wr=new Xy,this.referenceDelegate=e(this),this.Gr=new tv(this),this.indexManager=new By,this.remoteDocumentCache=function(i){return new Zy(i)}(r=>this.referenceDelegate.zr(r)),this.serializer=new Uy(t),this.jr=new Qy(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.Ur=!1,Promise.resolve()}get started(){return this.Ur}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let t=this.overlays[e.toKey()];return t||(t=new Yy,this.overlays[e.toKey()]=t),t}getMutationQueue(e,t){let r=this.Kr[e.toKey()];return r||(r=new Jy(t,this.referenceDelegate),this.Kr[e.toKey()]=r),r}getGlobalsCache(){return this.Wr}getTargetCache(){return this.Gr}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.jr}runTransaction(e,t,r){O("MemoryPersistence","Starting transaction:",e);const i=new nv(this.$r.next());return this.referenceDelegate.Hr(),r(i).next(s=>this.referenceDelegate.Jr(i).next(()=>s)).toPromise().then(s=>(i.raiseOnCommittedEvent(),s))}Yr(e,t){return P.or(Object.values(this.Kr).map(r=>()=>r.containsKey(e,t)))}}class nv extends N_{constructor(e){super(),this.currentSequenceNumber=e}}class jo{constructor(e){this.persistence=e,this.Zr=new $o,this.Xr=null}static ei(e){return new jo(e)}get ti(){if(this.Xr)return this.Xr;throw x()}addReference(e,t,r){return this.Zr.addReference(r,t),this.ti.delete(r.toString()),P.resolve()}removeReference(e,t,r){return this.Zr.removeReference(r,t),this.ti.add(r.toString()),P.resolve()}markPotentiallyOrphaned(e,t){return this.ti.add(t.toString()),P.resolve()}removeTarget(e,t){this.Zr.yr(t.targetId).forEach(i=>this.ti.add(i.toString()));const r=this.persistence.getTargetCache();return r.getMatchingKeysForTargetId(e,t.targetId).next(i=>{i.forEach(s=>this.ti.add(s.toString()))}).next(()=>r.removeTargetData(e,t))}Hr(){this.Xr=new Set}Jr(e){const t=this.persistence.getRemoteDocumentCache().newChangeBuffer();return P.forEach(this.ti,r=>{const i=L.fromPath(r);return this.ni(e,i).next(s=>{s||t.removeEntry(i,U.min())})}).next(()=>(this.Xr=null,t.apply(e)))}updateLimboDocument(e,t){return this.ni(e,t).next(r=>{r?this.ti.delete(t.toString()):this.ti.add(t.toString())})}zr(e){return 0}ni(e,t){return P.or([()=>P.resolve(this.Zr.containsKey(t)),()=>this.persistence.getTargetCache().containsKey(e,t),()=>this.persistence.Yr(e,t)])}}class Si{constructor(e,t){this.persistence=e,this.ri=new en(r=>O_(r.path),(r,i)=>r.isEqual(i)),this.garbageCollector=Hy(this,t)}static ei(e,t){return new Si(e,t)}Hr(){}Jr(e){return P.resolve()}forEachTarget(e,t){return this.persistence.getTargetCache().forEachTarget(e,t)}Xn(e){const t=this.nr(e);return this.persistence.getTargetCache().getTargetCount(e).next(r=>t.next(i=>r+i))}nr(e){let t=0;return this.er(e,r=>{t++}).next(()=>t)}er(e,t){return P.forEach(this.ri,(r,i)=>this.ir(e,r,i).next(s=>s?P.resolve():t(i)))}removeTargets(e,t,r){return this.persistence.getTargetCache().removeTargets(e,t,r)}removeOrphanedDocuments(e,t){let r=0;const i=this.persistence.getRemoteDocumentCache(),s=i.newChangeBuffer();return i.Lr(e,a=>this.ir(e,a,t).next(c=>{c||(r++,s.removeEntry(a,U.min()))})).next(()=>s.apply(e)).next(()=>r)}markPotentiallyOrphaned(e,t){return this.ri.set(t,e.currentSequenceNumber),P.resolve()}removeTarget(e,t){const r=t.withSequenceNumber(e.currentSequenceNumber);return this.persistence.getTargetCache().updateTargetData(e,r)}addReference(e,t,r){return this.ri.set(r,e.currentSequenceNumber),P.resolve()}removeReference(e,t,r){return this.ri.set(r,e.currentSequenceNumber),P.resolve()}updateLimboDocument(e,t){return this.ri.set(t,e.currentSequenceNumber),P.resolve()}zr(e){let t=e.key.toString().length;return e.isFoundDocument()&&(t+=ui(e.data.value)),t}ir(e,t,r){return P.or([()=>this.persistence.Yr(e,t),()=>this.persistence.getTargetCache().containsKey(e,t),()=>{const i=this.ri.get(t);return P.resolve(i!==void 0&&i>r)}])}getCacheSize(e){return this.persistence.getRemoteDocumentCache().getSize(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zo{constructor(e,t,r,i){this.targetId=e,this.fromCache=t,this.Wi=r,this.Gi=i}static zi(e,t){let r=H(),i=H();for(const s of t.docChanges)switch(s.type){case 0:r=r.add(s.doc.key);break;case 1:i=i.add(s.doc.key)}return new zo(e,t.fromCache,r,i)}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rv{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(e){this._documentReadCount+=e}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class iv{constructor(){this.ji=!1,this.Hi=!1,this.Ji=100,this.Yi=function(){return Yf()?8:D_(Ae())>0?6:4}()}initialize(e,t){this.Zi=e,this.indexManager=t,this.ji=!0}getDocumentsMatchingQuery(e,t,r,i){const s={result:null};return this.Xi(e,t).next(a=>{s.result=a}).next(()=>{if(!s.result)return this.es(e,t,i,r).next(a=>{s.result=a})}).next(()=>{if(s.result)return;const a=new rv;return this.ts(e,t,a).next(c=>{if(s.result=c,this.Hi)return this.ns(e,t,a,c.size)})}).next(()=>s.result)}ns(e,t,r,i){return r.documentReadCount<this.Ji?(an()<=z.DEBUG&&O("QueryEngine","SDK will not create cache indexes for query:",cn(t),"since it only creates cache indexes for collection contains","more than or equal to",this.Ji,"documents"),P.resolve()):(an()<=z.DEBUG&&O("QueryEngine","Query:",cn(t),"scans",r.documentReadCount,"local documents and returns",i,"documents as results."),r.documentReadCount>this.Yi*i?(an()<=z.DEBUG&&O("QueryEngine","The SDK decides to create cache indexes for query:",cn(t),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(e,Ke(t))):P.resolve())}Xi(e,t){if(pu(t))return P.resolve(null);let r=Ke(t);return this.indexManager.getIndexType(e,r).next(i=>i===0?null:(t.limit!==null&&i===1&&(t=Ai(t,null,"F"),r=Ke(t)),this.indexManager.getDocumentsMatchingTarget(e,r).next(s=>{const a=H(...s);return this.Zi.getDocuments(e,a).next(c=>this.indexManager.getMinOffset(e,r).next(l=>{const d=this.rs(t,c);return this.ss(t,d,a,l.readTime)?this.Xi(e,Ai(t,null,"F")):this.os(e,d,t,l)}))})))}es(e,t,r,i){return pu(t)||i.isEqual(U.min())?P.resolve(null):this.Zi.getDocuments(e,r).next(s=>{const a=this.rs(t,s);return this.ss(t,a,r,i)?P.resolve(null):(an()<=z.DEBUG&&O("QueryEngine","Re-using previous result from %s to execute query: %s",i.toString(),cn(t)),this.os(e,a,t,S_(i,-1)).next(c=>c))})}rs(e,t){let r=new ue(mh(e));return t.forEach((i,s)=>{Gi(e,s)&&(r=r.add(s))}),r}ss(e,t,r,i){if(e.limit===null)return!1;if(r.size!==t.size)return!0;const s=e.limitType==="F"?t.last():t.first();return!!s&&(s.hasPendingWrites||s.version.compareTo(i)>0)}ts(e,t,r){return an()<=z.DEBUG&&O("QueryEngine","Using full collection scan to execute query:",cn(t)),this.Zi.getDocumentsMatchingQuery(e,t,St.min(),r)}os(e,t,r,i){return this.Zi.getDocumentsMatchingQuery(e,r,i).next(s=>(t.forEach(a=>{s=s.insert(a.key,a)}),s))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sv{constructor(e,t,r,i){this.persistence=e,this._s=t,this.serializer=i,this.us=new te(G),this.cs=new en(s=>Lo(s),Mo),this.ls=new Map,this.hs=e.getRemoteDocumentCache(),this.Gr=e.getTargetCache(),this.jr=e.getBundleCache(),this.Ps(r)}Ps(e){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(e),this.indexManager=this.persistence.getIndexManager(e),this.mutationQueue=this.persistence.getMutationQueue(e,this.indexManager),this.localDocuments=new Ky(this.hs,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.hs.setIndexManager(this.indexManager),this._s.initialize(this.localDocuments,this.indexManager)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",t=>e.collect(t,this.us))}}function ov(n,e,t,r){return new sv(n,e,t,r)}async function xh(n,e){const t=F(n);return await t.persistence.runTransaction("Handle user change","readonly",r=>{let i;return t.mutationQueue.getAllMutationBatches(r).next(s=>(i=s,t.Ps(e),t.mutationQueue.getAllMutationBatches(r))).next(s=>{const a=[],c=[];let l=H();for(const d of i){a.push(d.batchId);for(const p of d.mutations)l=l.add(p.key)}for(const d of s){c.push(d.batchId);for(const p of d.mutations)l=l.add(p.key)}return t.localDocuments.getDocuments(r,l).next(d=>({Ts:d,removedBatchIds:a,addedBatchIds:c}))})})}function av(n,e){const t=F(n);return t.persistence.runTransaction("Acknowledge batch","readwrite-primary",r=>{const i=e.batch.keys(),s=t.hs.newChangeBuffer({trackRemovals:!0});return function(c,l,d,p){const g=d.batch,E=g.keys();let R=P.resolve();return E.forEach(k=>{R=R.next(()=>p.getEntry(l,k)).next(V=>{const C=d.docVersions.get(k);Y(C!==null),V.version.compareTo(C)<0&&(g.applyToRemoteDocument(V,d),V.isValidDocument()&&(V.setReadTime(d.commitVersion),p.addEntry(V)))})}),R.next(()=>c.mutationQueue.removeMutationBatch(l,g))}(t,r,e,s).next(()=>s.apply(r)).next(()=>t.mutationQueue.performConsistencyCheck(r)).next(()=>t.documentOverlayCache.removeOverlaysForBatchId(r,i,e.batch.batchId)).next(()=>t.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(r,function(c){let l=H();for(let d=0;d<c.mutationResults.length;++d)c.mutationResults[d].transformResults.length>0&&(l=l.add(c.batch.mutations[d].key));return l}(e))).next(()=>t.localDocuments.getDocuments(r,i))})}function Uh(n){const e=F(n);return e.persistence.runTransaction("Get last remote snapshot version","readonly",t=>e.Gr.getLastRemoteSnapshotVersion(t))}function cv(n,e){const t=F(n),r=e.snapshotVersion;let i=t.us;return t.persistence.runTransaction("Apply remote event","readwrite-primary",s=>{const a=t.hs.newChangeBuffer({trackRemovals:!0});i=t.us;const c=[];e.targetChanges.forEach((p,g)=>{const E=i.get(g);if(!E)return;c.push(t.Gr.removeMatchingKeys(s,p.removedDocuments,g).next(()=>t.Gr.addMatchingKeys(s,p.addedDocuments,g)));let R=E.withSequenceNumber(s.currentSequenceNumber);e.targetMismatches.get(g)!==null?R=R.withResumeToken(me.EMPTY_BYTE_STRING,U.min()).withLastLimboFreeSnapshotVersion(U.min()):p.resumeToken.approximateByteSize()>0&&(R=R.withResumeToken(p.resumeToken,r)),i=i.insert(g,R),function(V,C,B){return V.resumeToken.approximateByteSize()===0||C.snapshotVersion.toMicroseconds()-V.snapshotVersion.toMicroseconds()>=3e8?!0:B.addedDocuments.size+B.modifiedDocuments.size+B.removedDocuments.size>0}(E,R,p)&&c.push(t.Gr.updateTargetData(s,R))});let l=ft(),d=H();if(e.documentUpdates.forEach(p=>{e.resolvedLimboDocuments.has(p)&&c.push(t.persistence.referenceDelegate.updateLimboDocument(s,p))}),c.push(uv(s,a,e.documentUpdates).next(p=>{l=p.Is,d=p.Es})),!r.isEqual(U.min())){const p=t.Gr.getLastRemoteSnapshotVersion(s).next(g=>t.Gr.setTargetsMetadata(s,s.currentSequenceNumber,r));c.push(p)}return P.waitFor(c).next(()=>a.apply(s)).next(()=>t.localDocuments.getLocalViewOfDocuments(s,l,d)).next(()=>l)}).then(s=>(t.us=i,s))}function uv(n,e,t){let r=H(),i=H();return t.forEach(s=>r=r.add(s)),e.getEntries(n,r).next(s=>{let a=ft();return t.forEach((c,l)=>{const d=s.get(c);l.isFoundDocument()!==d.isFoundDocument()&&(i=i.add(c)),l.isNoDocument()&&l.version.isEqual(U.min())?(e.removeEntry(c,l.readTime),a=a.insert(c,l)):!d.isValidDocument()||l.version.compareTo(d.version)>0||l.version.compareTo(d.version)===0&&d.hasPendingWrites?(e.addEntry(l),a=a.insert(c,l)):O("LocalStore","Ignoring outdated watch update for ",c,". Current version:",d.version," Watch version:",l.version)}),{Is:a,Es:i}})}function lv(n,e){const t=F(n);return t.persistence.runTransaction("Get next mutation batch","readonly",r=>(e===void 0&&(e=-1),t.mutationQueue.getNextMutationBatchAfterBatchId(r,e)))}function hv(n,e){const t=F(n);return t.persistence.runTransaction("Allocate target","readwrite",r=>{let i;return t.Gr.getTargetData(r,e).next(s=>s?(i=s,P.resolve(i)):t.Gr.allocateTargetId(r).next(a=>(i=new At(e,a,"TargetPurposeListen",r.currentSequenceNumber),t.Gr.addTargetData(r,i).next(()=>i))))}).then(r=>{const i=t.us.get(r.targetId);return(i===null||r.snapshotVersion.compareTo(i.snapshotVersion)>0)&&(t.us=t.us.insert(r.targetId,r),t.cs.set(e,r.targetId)),r})}async function lo(n,e,t){const r=F(n),i=r.us.get(e),s=t?"readwrite":"readwrite-primary";try{t||await r.persistence.runTransaction("Release target",s,a=>r.persistence.referenceDelegate.removeTarget(a,i))}catch(a){if(!Sn(a))throw a;O("LocalStore",`Failed to update sequence numbers for target ${e}: ${a}`)}r.us=r.us.remove(e),r.cs.delete(i.target)}function bu(n,e,t){const r=F(n);let i=U.min(),s=H();return r.persistence.runTransaction("Execute query","readwrite",a=>function(l,d,p){const g=F(l),E=g.cs.get(p);return E!==void 0?P.resolve(g.us.get(E)):g.Gr.getTargetData(d,p)}(r,a,Ke(e)).next(c=>{if(c)return i=c.lastLimboFreeSnapshotVersion,r.Gr.getMatchingKeysForTargetId(a,c.targetId).next(l=>{s=l})}).next(()=>r._s.getDocumentsMatchingQuery(a,e,t?i:U.min(),t?s:H())).next(c=>(dv(r,J_(e),c),{documents:c,ds:s})))}function dv(n,e,t){let r=n.ls.get(e)||U.min();t.forEach((i,s)=>{s.readTime.compareTo(r)>0&&(r=s.readTime)}),n.ls.set(e,r)}class Su{constructor(){this.activeTargetIds=iy()}ps(e){this.activeTargetIds=this.activeTargetIds.add(e)}ys(e){this.activeTargetIds=this.activeTargetIds.delete(e)}gs(){const e={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(e)}}class fv{constructor(){this._o=new Su,this.ao={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,t,r){}addLocalQueryTarget(e,t=!0){return t&&this._o.ps(e),this.ao[e]||"not-current"}updateQueryState(e,t,r){this.ao[e]=t}removeLocalQueryTarget(e){this._o.ys(e)}isLocalQueryTarget(e){return this._o.activeTargetIds.has(e)}clearQueryState(e){delete this.ao[e]}getAllActiveQueryTargets(){return this._o.activeTargetIds}isActiveQueryTarget(e){return this._o.activeTargetIds.has(e)}start(){return this._o=new Su,Promise.resolve()}handleUserChange(e,t,r){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pv{uo(e){}shutdown(){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pu{constructor(){this.co=()=>this.lo(),this.ho=()=>this.Po(),this.To=[],this.Io()}uo(e){this.To.push(e)}shutdown(){window.removeEventListener("online",this.co),window.removeEventListener("offline",this.ho)}Io(){window.addEventListener("online",this.co),window.addEventListener("offline",this.ho)}lo(){O("ConnectivityMonitor","Network connectivity changed: AVAILABLE");for(const e of this.To)e(0)}Po(){O("ConnectivityMonitor","Network connectivity changed: UNAVAILABLE");for(const e of this.To)e(1)}static p(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let ti=null;function Fs(){return ti===null?ti=function(){return 268435456+Math.round(2147483648*Math.random())}():ti++,"0x"+ti.toString(16)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const mv={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery"};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gv{constructor(e){this.Eo=e.Eo,this.Ao=e.Ao}Ro(e){this.Vo=e}mo(e){this.fo=e}po(e){this.yo=e}onMessage(e){this.wo=e}close(){this.Ao()}send(e){this.Eo(e)}So(){this.Vo()}bo(){this.fo()}Do(e){this.yo(e)}vo(e){this.wo(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ee="WebChannelConnection";class _v extends class{get Co(){return!1}constructor(t){this.databaseInfo=t,this.databaseId=t.databaseId;const r=t.ssl?"https":"http",i=encodeURIComponent(this.databaseId.projectId),s=encodeURIComponent(this.databaseId.database);this.Fo=r+"://"+t.host,this.Mo=`projects/${i}/databases/${s}`,this.xo=this.databaseId.database==="(default)"?`project_id=${i}`:`project_id=${i}&database_id=${s}`}Oo(t,r,i,s,a){const c=Fs(),l=this.No(t,r.toUriEncodedString());O("RestConnection",`Sending RPC '${t}' ${c}:`,l,i);const d={"google-cloud-resource-prefix":this.Mo,"x-goog-request-params":this.xo};return this.Lo(d,s,a),this.Bo(t,l,d,i).then(p=>(O("RestConnection",`Received RPC '${t}' ${c}: `,p),p),p=>{throw gn("RestConnection",`RPC '${t}' ${c} failed with error: `,p,"url: ",l,"request:",i),p})}ko(t,r,i,s,a,c){return this.Oo(t,r,i,s,a)}Lo(t,r,i){t["X-Goog-Api-Client"]=function(){return"gl-js/ fire/"+Rn}(),t["Content-Type"]="text/plain",this.databaseInfo.appId&&(t["X-Firebase-GMPID"]=this.databaseInfo.appId),r&&r.headers.forEach((s,a)=>t[a]=s),i&&i.headers.forEach((s,a)=>t[a]=s)}No(t,r){const i=mv[t];return`${this.Fo}/v1/${r}:${i}`}terminate(){}}{constructor(e){super(e),this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams,this.longPollingOptions=e.longPollingOptions}Bo(e,t,r,i){const s=Fs();return new Promise((a,c)=>{const l=new Jl;l.setWithCredentials(!0),l.listenOnce(Zl.COMPLETE,()=>{try{switch(l.getLastErrorCode()){case ci.NO_ERROR:const p=l.getResponseJson();O(Ee,`XHR for RPC '${e}' ${s} received:`,JSON.stringify(p)),a(p);break;case ci.TIMEOUT:O(Ee,`RPC '${e}' ${s} timed out`),c(new D(S.DEADLINE_EXCEEDED,"Request time out"));break;case ci.HTTP_ERROR:const g=l.getStatus();if(O(Ee,`RPC '${e}' ${s} failed with status:`,g,"response text:",l.getResponseText()),g>0){let E=l.getResponseJson();Array.isArray(E)&&(E=E[0]);const R=E?.error;if(R&&R.status&&R.message){const k=function(C){const B=C.toLowerCase().replace(/_/g,"-");return Object.values(S).indexOf(B)>=0?B:S.UNKNOWN}(R.status);c(new D(k,R.message))}else c(new D(S.UNKNOWN,"Server responded with status "+l.getStatus()))}else c(new D(S.UNAVAILABLE,"Connection failed."));break;default:x()}}finally{O(Ee,`RPC '${e}' ${s} completed.`)}});const d=JSON.stringify(i);O(Ee,`RPC '${e}' ${s} sending request:`,i),l.send(t,"POST",d,r,15)})}qo(e,t,r){const i=Fs(),s=[this.Fo,"/","google.firestore.v1.Firestore","/",e,"/channel"],a=nh(),c=th(),l={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},d=this.longPollingOptions.timeoutSeconds;d!==void 0&&(l.longPollingTimeout=Math.round(1e3*d)),this.useFetchStreams&&(l.useFetchStreams=!0),this.Lo(l.initMessageHeaders,t,r),l.encodeInitMessageHeaders=!0;const p=s.join("");O(Ee,`Creating RPC '${e}' stream ${i}: ${p}`,l);const g=a.createWebChannel(p,l);let E=!1,R=!1;const k=new gv({Eo:C=>{R?O(Ee,`Not sending because RPC '${e}' stream ${i} is closed:`,C):(E||(O(Ee,`Opening RPC '${e}' stream ${i} transport.`),g.open(),E=!0),O(Ee,`RPC '${e}' stream ${i} sending:`,C),g.send(C))},Ao:()=>g.close()}),V=(C,B,$)=>{C.listen(B,q=>{try{$(q)}catch(j){setTimeout(()=>{throw j},0)}})};return V(g,Yn.EventType.OPEN,()=>{R||(O(Ee,`RPC '${e}' stream ${i} transport opened.`),k.So())}),V(g,Yn.EventType.CLOSE,()=>{R||(R=!0,O(Ee,`RPC '${e}' stream ${i} transport closed`),k.Do())}),V(g,Yn.EventType.ERROR,C=>{R||(R=!0,gn(Ee,`RPC '${e}' stream ${i} transport errored:`,C),k.Do(new D(S.UNAVAILABLE,"The operation could not be completed")))}),V(g,Yn.EventType.MESSAGE,C=>{var B;if(!R){const $=C.data[0];Y(!!$);const q=$,j=q?.error||((B=q[0])===null||B===void 0?void 0:B.error);if(j){O(Ee,`RPC '${e}' stream ${i} received error:`,j);const he=j.status;let Z=function(y){const v=oe[y];if(v!==void 0)return bh(v)}(he),T=j.message;Z===void 0&&(Z=S.INTERNAL,T="Unknown error status: "+he+" with message "+j.message),R=!0,k.Do(new D(Z,T)),g.close()}else O(Ee,`RPC '${e}' stream ${i} received:`,$),k.vo($)}}),V(c,eh.STAT_EVENT,C=>{C.stat===eo.PROXY?O(Ee,`RPC '${e}' stream ${i} detected buffering proxy`):C.stat===eo.NOPROXY&&O(Ee,`RPC '${e}' stream ${i} detected no buffering proxy`)}),setTimeout(()=>{k.bo()},0),k}}function Bs(){return typeof document<"u"?document:null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Xi(n){return new Ay(n,!0)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fh{constructor(e,t,r=1e3,i=1.5,s=6e4){this.li=e,this.timerId=t,this.Qo=r,this.Ko=i,this.$o=s,this.Uo=0,this.Wo=null,this.Go=Date.now(),this.reset()}reset(){this.Uo=0}zo(){this.Uo=this.$o}jo(e){this.cancel();const t=Math.floor(this.Uo+this.Ho()),r=Math.max(0,Date.now()-this.Go),i=Math.max(0,t-r);i>0&&O("ExponentialBackoff",`Backing off for ${i} ms (base delay: ${this.Uo} ms, delay with jitter: ${t} ms, last attempt: ${r} ms ago)`),this.Wo=this.li.enqueueAfterDelay(this.timerId,i,()=>(this.Go=Date.now(),e())),this.Uo*=this.Ko,this.Uo<this.Qo&&(this.Uo=this.Qo),this.Uo>this.$o&&(this.Uo=this.$o)}Jo(){this.Wo!==null&&(this.Wo.skipDelay(),this.Wo=null)}cancel(){this.Wo!==null&&(this.Wo.cancel(),this.Wo=null)}Ho(){return(Math.random()-.5)*this.Uo}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Bh{constructor(e,t,r,i,s,a,c,l){this.li=e,this.Yo=r,this.Zo=i,this.connection=s,this.authCredentialsProvider=a,this.appCheckCredentialsProvider=c,this.listener=l,this.state=0,this.Xo=0,this.e_=null,this.t_=null,this.stream=null,this.n_=0,this.r_=new Fh(e,t)}i_(){return this.state===1||this.state===5||this.s_()}s_(){return this.state===2||this.state===3}start(){this.n_=0,this.state!==4?this.auth():this.o_()}async stop(){this.i_()&&await this.close(0)}__(){this.state=0,this.r_.reset()}a_(){this.s_()&&this.e_===null&&(this.e_=this.li.enqueueAfterDelay(this.Yo,6e4,()=>this.u_()))}c_(e){this.l_(),this.stream.send(e)}async u_(){if(this.s_())return this.close(0)}l_(){this.e_&&(this.e_.cancel(),this.e_=null)}h_(){this.t_&&(this.t_.cancel(),this.t_=null)}async close(e,t){this.l_(),this.h_(),this.r_.cancel(),this.Xo++,e!==4?this.r_.reset():t&&t.code===S.RESOURCE_EXHAUSTED?(dt(t.toString()),dt("Using maximum backoff delay to prevent overloading the backend."),this.r_.zo()):t&&t.code===S.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this.P_(),this.stream.close(),this.stream=null),this.state=e,await this.listener.po(t)}P_(){}auth(){this.state=1;const e=this.T_(this.Xo),t=this.Xo;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then(([r,i])=>{this.Xo===t&&this.I_(r,i)},r=>{e(()=>{const i=new D(S.UNKNOWN,"Fetching auth token failed: "+r.message);return this.E_(i)})})}I_(e,t){const r=this.T_(this.Xo);this.stream=this.d_(e,t),this.stream.Ro(()=>{r(()=>this.listener.Ro())}),this.stream.mo(()=>{r(()=>(this.state=2,this.t_=this.li.enqueueAfterDelay(this.Zo,1e4,()=>(this.s_()&&(this.state=3),Promise.resolve())),this.listener.mo()))}),this.stream.po(i=>{r(()=>this.E_(i))}),this.stream.onMessage(i=>{r(()=>++this.n_==1?this.A_(i):this.onNext(i))})}o_(){this.state=5,this.r_.jo(async()=>{this.state=0,this.start()})}E_(e){return O("PersistentStream",`close with error: ${e}`),this.stream=null,this.close(4,e)}T_(e){return t=>{this.li.enqueueAndForget(()=>this.Xo===e?t():(O("PersistentStream","stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve()))}}}class yv extends Bh{constructor(e,t,r,i,s,a){super(e,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",t,r,i,a),this.serializer=s}d_(e,t){return this.connection.qo("Listen",e,t)}A_(e){return this.onNext(e)}onNext(e){this.r_.reset();const t=Sy(this.serializer,e),r=function(s){if(!("targetChange"in s))return U.min();const a=s.targetChange;return a.targetIds&&a.targetIds.length?U.min():a.readTime?Qe(a.readTime):U.min()}(e);return this.listener.R_(t,r)}V_(e){const t={};t.database=uo(this.serializer),t.addTarget=function(s,a){let c;const l=a.target;if(c=io(l)?{documents:ky(s,l)}:{query:Ny(s,l).ct},c.targetId=a.targetId,a.resumeToken.approximateByteSize()>0){c.resumeToken=Ch(s,a.resumeToken);const d=oo(s,a.expectedCount);d!==null&&(c.expectedCount=d)}else if(a.snapshotVersion.compareTo(U.min())>0){c.readTime=bi(s,a.snapshotVersion.toTimestamp());const d=oo(s,a.expectedCount);d!==null&&(c.expectedCount=d)}return c}(this.serializer,e);const r=Vy(this.serializer,e);r&&(t.labels=r),this.c_(t)}m_(e){const t={};t.database=uo(this.serializer),t.removeTarget=e,this.c_(t)}}class vv extends Bh{constructor(e,t,r,i,s,a){super(e,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",t,r,i,a),this.serializer=s}get f_(){return this.n_>0}start(){this.lastStreamToken=void 0,super.start()}P_(){this.f_&&this.g_([])}d_(e,t){return this.connection.qo("Write",e,t)}A_(e){return Y(!!e.streamToken),this.lastStreamToken=e.streamToken,Y(!e.writeResults||e.writeResults.length===0),this.listener.p_()}onNext(e){Y(!!e.streamToken),this.lastStreamToken=e.streamToken,this.r_.reset();const t=Cy(e.writeResults,e.commitTime),r=Qe(e.commitTime);return this.listener.y_(r,t)}w_(){const e={};e.database=uo(this.serializer),this.c_(e)}g_(e){const t={streamToken:this.lastStreamToken,writes:e.map(r=>Py(this.serializer,r))};this.c_(t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ev extends class{}{constructor(e,t,r,i){super(),this.authCredentials=e,this.appCheckCredentials=t,this.connection=r,this.serializer=i,this.S_=!1}b_(){if(this.S_)throw new D(S.FAILED_PRECONDITION,"The client has already been terminated.")}Oo(e,t,r,i){return this.b_(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([s,a])=>this.connection.Oo(e,ao(t,r),i,s,a)).catch(s=>{throw s.name==="FirebaseError"?(s.code===S.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),s):new D(S.UNKNOWN,s.toString())})}ko(e,t,r,i,s){return this.b_(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([a,c])=>this.connection.ko(e,ao(t,r),i,a,c,s)).catch(a=>{throw a.name==="FirebaseError"?(a.code===S.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),a):new D(S.UNKNOWN,a.toString())})}terminate(){this.S_=!0,this.connection.terminate()}}class Tv{constructor(e,t){this.asyncQueue=e,this.onlineStateHandler=t,this.state="Unknown",this.D_=0,this.v_=null,this.C_=!0}F_(){this.D_===0&&(this.M_("Unknown"),this.v_=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,()=>(this.v_=null,this.x_("Backend didn't respond within 10 seconds."),this.M_("Offline"),Promise.resolve())))}O_(e){this.state==="Online"?this.M_("Unknown"):(this.D_++,this.D_>=1&&(this.N_(),this.x_(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.M_("Offline")))}set(e){this.N_(),this.D_=0,e==="Online"&&(this.C_=!1),this.M_(e)}M_(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}x_(e){const t=`Could not reach Cloud Firestore backend. ${e}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this.C_?(dt(t),this.C_=!1):O("OnlineStateTracker",t)}N_(){this.v_!==null&&(this.v_.cancel(),this.v_=null)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Iv{constructor(e,t,r,i,s){this.localStore=e,this.datastore=t,this.asyncQueue=r,this.remoteSyncer={},this.L_=[],this.B_=new Map,this.k_=new Set,this.q_=[],this.Q_=s,this.Q_.uo(a=>{r.enqueueAndForget(async()=>{tn(this)&&(O("RemoteStore","Restarting streams for network reachability change."),await async function(l){const d=F(l);d.k_.add(4),await Rr(d),d.K_.set("Unknown"),d.k_.delete(4),await Ji(d)}(this))})}),this.K_=new Tv(r,i)}}async function Ji(n){if(tn(n))for(const e of n.q_)await e(!0)}async function Rr(n){for(const e of n.q_)await e(!1)}function qh(n,e){const t=F(n);t.B_.has(e.targetId)||(t.B_.set(e.targetId,e),Ko(t)?Wo(t):Pn(t).s_()&&Go(t,e))}function Ho(n,e){const t=F(n),r=Pn(t);t.B_.delete(e),r.s_()&&$h(t,e),t.B_.size===0&&(r.s_()?r.a_():tn(t)&&t.K_.set("Unknown"))}function Go(n,e){if(n.U_.xe(e.targetId),e.resumeToken.approximateByteSize()>0||e.snapshotVersion.compareTo(U.min())>0){const t=n.remoteSyncer.getRemoteKeysForTarget(e.targetId).size;e=e.withExpectedCount(t)}Pn(n).V_(e)}function $h(n,e){n.U_.xe(e),Pn(n).m_(e)}function Wo(n){n.U_=new Ey({getRemoteKeysForTarget:e=>n.remoteSyncer.getRemoteKeysForTarget(e),ut:e=>n.B_.get(e)||null,nt:()=>n.datastore.serializer.databaseId}),Pn(n).start(),n.K_.F_()}function Ko(n){return tn(n)&&!Pn(n).i_()&&n.B_.size>0}function tn(n){return F(n).k_.size===0}function jh(n){n.U_=void 0}async function wv(n){n.K_.set("Online")}async function Av(n){n.B_.forEach((e,t)=>{Go(n,e)})}async function Rv(n,e){jh(n),Ko(n)?(n.K_.O_(e),Wo(n)):n.K_.set("Unknown")}async function bv(n,e,t){if(n.K_.set("Online"),e instanceof Ph&&e.state===2&&e.cause)try{await async function(i,s){const a=s.cause;for(const c of s.targetIds)i.B_.has(c)&&(await i.remoteSyncer.rejectListen(c,a),i.B_.delete(c),i.U_.removeTarget(c))}(n,e)}catch(r){O("RemoteStore","Failed to remove targets %s: %s ",e.targetIds.join(","),r),await Pi(n,r)}else if(e instanceof di?n.U_.$e(e):e instanceof Sh?n.U_.Je(e):n.U_.Ge(e),!t.isEqual(U.min()))try{const r=await Uh(n.localStore);t.compareTo(r)>=0&&await function(s,a){const c=s.U_.it(a);return c.targetChanges.forEach((l,d)=>{if(l.resumeToken.approximateByteSize()>0){const p=s.B_.get(d);p&&s.B_.set(d,p.withResumeToken(l.resumeToken,a))}}),c.targetMismatches.forEach((l,d)=>{const p=s.B_.get(l);if(!p)return;s.B_.set(l,p.withResumeToken(me.EMPTY_BYTE_STRING,p.snapshotVersion)),$h(s,l);const g=new At(p.target,l,d,p.sequenceNumber);Go(s,g)}),s.remoteSyncer.applyRemoteEvent(c)}(n,t)}catch(r){O("RemoteStore","Failed to raise snapshot:",r),await Pi(n,r)}}async function Pi(n,e,t){if(!Sn(e))throw e;n.k_.add(1),await Rr(n),n.K_.set("Offline"),t||(t=()=>Uh(n.localStore)),n.asyncQueue.enqueueRetryable(async()=>{O("RemoteStore","Retrying IndexedDB access"),await t(),n.k_.delete(1),await Ji(n)})}function zh(n,e){return e().catch(t=>Pi(n,t,e))}async function Zi(n){const e=F(n),t=Nt(e);let r=e.L_.length>0?e.L_[e.L_.length-1].batchId:-1;for(;Sv(e);)try{const i=await lv(e.localStore,r);if(i===null){e.L_.length===0&&t.a_();break}r=i.batchId,Pv(e,i)}catch(i){await Pi(e,i)}Hh(e)&&Gh(e)}function Sv(n){return tn(n)&&n.L_.length<10}function Pv(n,e){n.L_.push(e);const t=Nt(n);t.s_()&&t.f_&&t.g_(e.mutations)}function Hh(n){return tn(n)&&!Nt(n).i_()&&n.L_.length>0}function Gh(n){Nt(n).start()}async function Cv(n){Nt(n).w_()}async function kv(n){const e=Nt(n);for(const t of n.L_)e.g_(t.mutations)}async function Nv(n,e,t){const r=n.L_.shift(),i=Fo.from(r,e,t);await zh(n,()=>n.remoteSyncer.applySuccessfulWrite(i)),await Zi(n)}async function Dv(n,e){e&&Nt(n).f_&&await async function(r,i){if(function(a){return _y(a)&&a!==S.ABORTED}(i.code)){const s=r.L_.shift();Nt(r).__(),await zh(r,()=>r.remoteSyncer.rejectFailedWrite(s.batchId,i)),await Zi(r)}}(n,e),Hh(n)&&Gh(n)}async function Cu(n,e){const t=F(n);t.asyncQueue.verifyOperationInProgress(),O("RemoteStore","RemoteStore received new credentials");const r=tn(t);t.k_.add(3),await Rr(t),r&&t.K_.set("Unknown"),await t.remoteSyncer.handleCredentialChange(e),t.k_.delete(3),await Ji(t)}async function Vv(n,e){const t=F(n);e?(t.k_.delete(2),await Ji(t)):e||(t.k_.add(2),await Rr(t),t.K_.set("Unknown"))}function Pn(n){return n.W_||(n.W_=function(t,r,i){const s=F(t);return s.b_(),new yv(r,s.connection,s.authCredentials,s.appCheckCredentials,s.serializer,i)}(n.datastore,n.asyncQueue,{Ro:wv.bind(null,n),mo:Av.bind(null,n),po:Rv.bind(null,n),R_:bv.bind(null,n)}),n.q_.push(async e=>{e?(n.W_.__(),Ko(n)?Wo(n):n.K_.set("Unknown")):(await n.W_.stop(),jh(n))})),n.W_}function Nt(n){return n.G_||(n.G_=function(t,r,i){const s=F(t);return s.b_(),new vv(r,s.connection,s.authCredentials,s.appCheckCredentials,s.serializer,i)}(n.datastore,n.asyncQueue,{Ro:()=>Promise.resolve(),mo:Cv.bind(null,n),po:Dv.bind(null,n),p_:kv.bind(null,n),y_:Nv.bind(null,n)}),n.q_.push(async e=>{e?(n.G_.__(),await Zi(n)):(await n.G_.stop(),n.L_.length>0&&(O("RemoteStore",`Stopping write stream with ${n.L_.length} pending writes`),n.L_=[]))})),n.G_}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qo{constructor(e,t,r,i,s){this.asyncQueue=e,this.timerId=t,this.targetTimeMs=r,this.op=i,this.removalCallback=s,this.deferred=new ut,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch(a=>{})}get promise(){return this.deferred.promise}static createAndSchedule(e,t,r,i,s){const a=Date.now()+r,c=new Qo(e,t,a,i,s);return c.start(r),c}start(e){this.timerHandle=setTimeout(()=>this.handleDelayElapsed(),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new D(S.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget(()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then(e=>this.deferred.resolve(e))):Promise.resolve())}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function Yo(n,e){if(dt("AsyncQueue",`${e}: ${n}`),Sn(n))return new D(S.UNAVAILABLE,`${e}: ${n}`);throw n}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mn{static emptySet(e){return new mn(e.comparator)}constructor(e){this.comparator=e?(t,r)=>e(t,r)||L.comparator(t.key,r.key):(t,r)=>L.comparator(t.key,r.key),this.keyedMap=Xn(),this.sortedSet=new te(this.comparator)}has(e){return this.keyedMap.get(e)!=null}get(e){return this.keyedMap.get(e)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(e){const t=this.keyedMap.get(e);return t?this.sortedSet.indexOf(t):-1}get size(){return this.sortedSet.size}forEach(e){this.sortedSet.inorderTraversal((t,r)=>(e(t),!1))}add(e){const t=this.delete(e.key);return t.copy(t.keyedMap.insert(e.key,e),t.sortedSet.insert(e,null))}delete(e){const t=this.get(e);return t?this.copy(this.keyedMap.remove(e),this.sortedSet.remove(t)):this}isEqual(e){if(!(e instanceof mn)||this.size!==e.size)return!1;const t=this.sortedSet.getIterator(),r=e.sortedSet.getIterator();for(;t.hasNext();){const i=t.getNext().key,s=r.getNext().key;if(!i.isEqual(s))return!1}return!0}toString(){const e=[];return this.forEach(t=>{e.push(t.toString())}),e.length===0?"DocumentSet ()":`DocumentSet (
  `+e.join(`  
`)+`
)`}copy(e,t){const r=new mn;return r.comparator=this.comparator,r.keyedMap=e,r.sortedSet=t,r}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ku{constructor(){this.z_=new te(L.comparator)}track(e){const t=e.doc.key,r=this.z_.get(t);r?e.type!==0&&r.type===3?this.z_=this.z_.insert(t,e):e.type===3&&r.type!==1?this.z_=this.z_.insert(t,{type:r.type,doc:e.doc}):e.type===2&&r.type===2?this.z_=this.z_.insert(t,{type:2,doc:e.doc}):e.type===2&&r.type===0?this.z_=this.z_.insert(t,{type:0,doc:e.doc}):e.type===1&&r.type===0?this.z_=this.z_.remove(t):e.type===1&&r.type===2?this.z_=this.z_.insert(t,{type:1,doc:r.doc}):e.type===0&&r.type===1?this.z_=this.z_.insert(t,{type:2,doc:e.doc}):x():this.z_=this.z_.insert(t,e)}j_(){const e=[];return this.z_.inorderTraversal((t,r)=>{e.push(r)}),e}}class In{constructor(e,t,r,i,s,a,c,l,d){this.query=e,this.docs=t,this.oldDocs=r,this.docChanges=i,this.mutatedKeys=s,this.fromCache=a,this.syncStateChanged=c,this.excludesMetadataChanges=l,this.hasCachedResults=d}static fromInitialDocuments(e,t,r,i,s){const a=[];return t.forEach(c=>{a.push({type:0,doc:c})}),new In(e,t,mn.emptySet(t),a,r,i,!0,!1,s)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(e){if(!(this.fromCache===e.fromCache&&this.hasCachedResults===e.hasCachedResults&&this.syncStateChanged===e.syncStateChanged&&this.mutatedKeys.isEqual(e.mutatedKeys)&&Hi(this.query,e.query)&&this.docs.isEqual(e.docs)&&this.oldDocs.isEqual(e.oldDocs)))return!1;const t=this.docChanges,r=e.docChanges;if(t.length!==r.length)return!1;for(let i=0;i<t.length;i++)if(t[i].type!==r[i].type||!t[i].doc.isEqual(r[i].doc))return!1;return!0}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ov{constructor(){this.H_=void 0,this.J_=[]}Y_(){return this.J_.some(e=>e.Z_())}}class Lv{constructor(){this.queries=Nu(),this.onlineState="Unknown",this.X_=new Set}terminate(){(function(t,r){const i=F(t),s=i.queries;i.queries=Nu(),s.forEach((a,c)=>{for(const l of c.J_)l.onError(r)})})(this,new D(S.ABORTED,"Firestore shutting down"))}}function Nu(){return new en(n=>ph(n),Hi)}async function Xo(n,e){const t=F(n);let r=3;const i=e.query;let s=t.queries.get(i);s?!s.Y_()&&e.Z_()&&(r=2):(s=new Ov,r=e.Z_()?0:1);try{switch(r){case 0:s.H_=await t.onListen(i,!0);break;case 1:s.H_=await t.onListen(i,!1);break;case 2:await t.onFirstRemoteStoreListen(i)}}catch(a){const c=Yo(a,`Initialization of query '${cn(e.query)}' failed`);return void e.onError(c)}t.queries.set(i,s),s.J_.push(e),e.ea(t.onlineState),s.H_&&e.ta(s.H_)&&Zo(t)}async function Jo(n,e){const t=F(n),r=e.query;let i=3;const s=t.queries.get(r);if(s){const a=s.J_.indexOf(e);a>=0&&(s.J_.splice(a,1),s.J_.length===0?i=e.Z_()?0:1:!s.Y_()&&e.Z_()&&(i=2))}switch(i){case 0:return t.queries.delete(r),t.onUnlisten(r,!0);case 1:return t.queries.delete(r),t.onUnlisten(r,!1);case 2:return t.onLastRemoteStoreUnlisten(r);default:return}}function Mv(n,e){const t=F(n);let r=!1;for(const i of e){const s=i.query,a=t.queries.get(s);if(a){for(const c of a.J_)c.ta(i)&&(r=!0);a.H_=i}}r&&Zo(t)}function xv(n,e,t){const r=F(n),i=r.queries.get(e);if(i)for(const s of i.J_)s.onError(t);r.queries.delete(e)}function Zo(n){n.X_.forEach(e=>{e.next()})}var ho,Du;(Du=ho||(ho={})).na="default",Du.Cache="cache";class ea{constructor(e,t,r){this.query=e,this.ra=t,this.ia=!1,this.sa=null,this.onlineState="Unknown",this.options=r||{}}ta(e){if(!this.options.includeMetadataChanges){const r=[];for(const i of e.docChanges)i.type!==3&&r.push(i);e=new In(e.query,e.docs,e.oldDocs,r,e.mutatedKeys,e.fromCache,e.syncStateChanged,!0,e.hasCachedResults)}let t=!1;return this.ia?this.oa(e)&&(this.ra.next(e),t=!0):this._a(e,this.onlineState)&&(this.aa(e),t=!0),this.sa=e,t}onError(e){this.ra.error(e)}ea(e){this.onlineState=e;let t=!1;return this.sa&&!this.ia&&this._a(this.sa,e)&&(this.aa(this.sa),t=!0),t}_a(e,t){if(!e.fromCache||!this.Z_())return!0;const r=t!=="Offline";return(!this.options.ua||!r)&&(!e.docs.isEmpty()||e.hasCachedResults||t==="Offline")}oa(e){if(e.docChanges.length>0)return!0;const t=this.sa&&this.sa.hasPendingWrites!==e.hasPendingWrites;return!(!e.syncStateChanged&&!t)&&this.options.includeMetadataChanges===!0}aa(e){e=In.fromInitialDocuments(e.query,e.docs,e.mutatedKeys,e.fromCache,e.hasCachedResults),this.ia=!0,this.ra.next(e)}Z_(){return this.options.source!==ho.Cache}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wh{constructor(e){this.key=e}}class Kh{constructor(e){this.key=e}}class Uv{constructor(e,t){this.query=e,this.da=t,this.Aa=null,this.hasCachedResults=!1,this.current=!1,this.Ra=H(),this.mutatedKeys=H(),this.Va=mh(e),this.ma=new mn(this.Va)}get fa(){return this.da}ga(e,t){const r=t?t.pa:new ku,i=t?t.ma:this.ma;let s=t?t.mutatedKeys:this.mutatedKeys,a=i,c=!1;const l=this.query.limitType==="F"&&i.size===this.query.limit?i.last():null,d=this.query.limitType==="L"&&i.size===this.query.limit?i.first():null;if(e.inorderTraversal((p,g)=>{const E=i.get(p),R=Gi(this.query,g)?g:null,k=!!E&&this.mutatedKeys.has(E.key),V=!!R&&(R.hasLocalMutations||this.mutatedKeys.has(R.key)&&R.hasCommittedMutations);let C=!1;E&&R?E.data.isEqual(R.data)?k!==V&&(r.track({type:3,doc:R}),C=!0):this.ya(E,R)||(r.track({type:2,doc:R}),C=!0,(l&&this.Va(R,l)>0||d&&this.Va(R,d)<0)&&(c=!0)):!E&&R?(r.track({type:0,doc:R}),C=!0):E&&!R&&(r.track({type:1,doc:E}),C=!0,(l||d)&&(c=!0)),C&&(R?(a=a.add(R),s=V?s.add(p):s.delete(p)):(a=a.delete(p),s=s.delete(p)))}),this.query.limit!==null)for(;a.size>this.query.limit;){const p=this.query.limitType==="F"?a.last():a.first();a=a.delete(p.key),s=s.delete(p.key),r.track({type:1,doc:p})}return{ma:a,pa:r,ss:c,mutatedKeys:s}}ya(e,t){return e.hasLocalMutations&&t.hasCommittedMutations&&!t.hasLocalMutations}applyChanges(e,t,r,i){const s=this.ma;this.ma=e.ma,this.mutatedKeys=e.mutatedKeys;const a=e.pa.j_();a.sort((p,g)=>function(R,k){const V=C=>{switch(C){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return x()}};return V(R)-V(k)}(p.type,g.type)||this.Va(p.doc,g.doc)),this.wa(r),i=i!=null&&i;const c=t&&!i?this.Sa():[],l=this.Ra.size===0&&this.current&&!i?1:0,d=l!==this.Aa;return this.Aa=l,a.length!==0||d?{snapshot:new In(this.query,e.ma,s,a,e.mutatedKeys,l===0,d,!1,!!r&&r.resumeToken.approximateByteSize()>0),ba:c}:{ba:c}}ea(e){return this.current&&e==="Offline"?(this.current=!1,this.applyChanges({ma:this.ma,pa:new ku,mutatedKeys:this.mutatedKeys,ss:!1},!1)):{ba:[]}}Da(e){return!this.da.has(e)&&!!this.ma.has(e)&&!this.ma.get(e).hasLocalMutations}wa(e){e&&(e.addedDocuments.forEach(t=>this.da=this.da.add(t)),e.modifiedDocuments.forEach(t=>{}),e.removedDocuments.forEach(t=>this.da=this.da.delete(t)),this.current=e.current)}Sa(){if(!this.current)return[];const e=this.Ra;this.Ra=H(),this.ma.forEach(r=>{this.Da(r.key)&&(this.Ra=this.Ra.add(r.key))});const t=[];return e.forEach(r=>{this.Ra.has(r)||t.push(new Kh(r))}),this.Ra.forEach(r=>{e.has(r)||t.push(new Wh(r))}),t}va(e){this.da=e.ds,this.Ra=H();const t=this.ga(e.documents);return this.applyChanges(t,!0)}Ca(){return In.fromInitialDocuments(this.query,this.ma,this.mutatedKeys,this.Aa===0,this.hasCachedResults)}}class Fv{constructor(e,t,r){this.query=e,this.targetId=t,this.view=r}}class Bv{constructor(e){this.key=e,this.Fa=!1}}class qv{constructor(e,t,r,i,s,a){this.localStore=e,this.remoteStore=t,this.eventManager=r,this.sharedClientState=i,this.currentUser=s,this.maxConcurrentLimboResolutions=a,this.Ma={},this.xa=new en(c=>ph(c),Hi),this.Oa=new Map,this.Na=new Set,this.La=new te(L.comparator),this.Ba=new Map,this.ka=new $o,this.qa={},this.Qa=new Map,this.Ka=Tn.Qn(),this.onlineState="Unknown",this.$a=void 0}get isPrimaryClient(){return this.$a===!0}}async function $v(n,e,t=!0){const r=ed(n);let i;const s=r.xa.get(e);return s?(r.sharedClientState.addLocalQueryTarget(s.targetId),i=s.view.Ca()):i=await Qh(r,e,t,!0),i}async function jv(n,e){const t=ed(n);await Qh(t,e,!0,!1)}async function Qh(n,e,t,r){const i=await hv(n.localStore,Ke(e)),s=i.targetId,a=n.sharedClientState.addLocalQueryTarget(s,t);let c;return r&&(c=await zv(n,e,s,a==="current",i.resumeToken)),n.isPrimaryClient&&t&&qh(n.remoteStore,i),c}async function zv(n,e,t,r,i){n.Ua=(g,E,R)=>async function(V,C,B,$){let q=C.view.ga(B);q.ss&&(q=await bu(V.localStore,C.query,!1).then(({documents:T})=>C.view.ga(T,q)));const j=$&&$.targetChanges.get(C.targetId),he=$&&$.targetMismatches.get(C.targetId)!=null,Z=C.view.applyChanges(q,V.isPrimaryClient,j,he);return Ou(V,C.targetId,Z.ba),Z.snapshot}(n,g,E,R);const s=await bu(n.localStore,e,!0),a=new Uv(e,s.ds),c=a.ga(s.documents),l=Ar.createSynthesizedTargetChangeForCurrentChange(t,r&&n.onlineState!=="Offline",i),d=a.applyChanges(c,n.isPrimaryClient,l);Ou(n,t,d.ba);const p=new Fv(e,t,a);return n.xa.set(e,p),n.Oa.has(t)?n.Oa.get(t).push(e):n.Oa.set(t,[e]),d.snapshot}async function Hv(n,e,t){const r=F(n),i=r.xa.get(e),s=r.Oa.get(i.targetId);if(s.length>1)return r.Oa.set(i.targetId,s.filter(a=>!Hi(a,e))),void r.xa.delete(e);r.isPrimaryClient?(r.sharedClientState.removeLocalQueryTarget(i.targetId),r.sharedClientState.isActiveQueryTarget(i.targetId)||await lo(r.localStore,i.targetId,!1).then(()=>{r.sharedClientState.clearQueryState(i.targetId),t&&Ho(r.remoteStore,i.targetId),fo(r,i.targetId)}).catch(bn)):(fo(r,i.targetId),await lo(r.localStore,i.targetId,!0))}async function Gv(n,e){const t=F(n),r=t.xa.get(e),i=t.Oa.get(r.targetId);t.isPrimaryClient&&i.length===1&&(t.sharedClientState.removeLocalQueryTarget(r.targetId),Ho(t.remoteStore,r.targetId))}async function Wv(n,e,t){const r=eE(n);try{const i=await function(a,c){const l=F(a),d=ce.now(),p=c.reduce((R,k)=>R.add(k.key),H());let g,E;return l.persistence.runTransaction("Locally write mutations","readwrite",R=>{let k=ft(),V=H();return l.hs.getEntries(R,p).next(C=>{k=C,k.forEach((B,$)=>{$.isValidDocument()||(V=V.add(B))})}).next(()=>l.localDocuments.getOverlayedDocuments(R,k)).next(C=>{g=C;const B=[];for(const $ of c){const q=dy($,g.get($.key).overlayedDocument);q!=null&&B.push(new Ot($.key,q,ah(q.value.mapValue),Pe.exists(!0)))}return l.mutationQueue.addMutationBatch(R,d,B,c)}).next(C=>{E=C;const B=C.applyToLocalDocumentSet(g,V);return l.documentOverlayCache.saveOverlays(R,C.batchId,B)})}).then(()=>({batchId:E.batchId,changes:_h(g)}))}(r.localStore,e);r.sharedClientState.addPendingMutation(i.batchId),function(a,c,l){let d=a.qa[a.currentUser.toKey()];d||(d=new te(G)),d=d.insert(c,l),a.qa[a.currentUser.toKey()]=d}(r,i.batchId,t),await br(r,i.changes),await Zi(r.remoteStore)}catch(i){const s=Yo(i,"Failed to persist write");t.reject(s)}}async function Yh(n,e){const t=F(n);try{const r=await cv(t.localStore,e);e.targetChanges.forEach((i,s)=>{const a=t.Ba.get(s);a&&(Y(i.addedDocuments.size+i.modifiedDocuments.size+i.removedDocuments.size<=1),i.addedDocuments.size>0?a.Fa=!0:i.modifiedDocuments.size>0?Y(a.Fa):i.removedDocuments.size>0&&(Y(a.Fa),a.Fa=!1))}),await br(t,r,e)}catch(r){await bn(r)}}function Vu(n,e,t){const r=F(n);if(r.isPrimaryClient&&t===0||!r.isPrimaryClient&&t===1){const i=[];r.xa.forEach((s,a)=>{const c=a.view.ea(e);c.snapshot&&i.push(c.snapshot)}),function(a,c){const l=F(a);l.onlineState=c;let d=!1;l.queries.forEach((p,g)=>{for(const E of g.J_)E.ea(c)&&(d=!0)}),d&&Zo(l)}(r.eventManager,e),i.length&&r.Ma.R_(i),r.onlineState=e,r.isPrimaryClient&&r.sharedClientState.setOnlineState(e)}}async function Kv(n,e,t){const r=F(n);r.sharedClientState.updateQueryState(e,"rejected",t);const i=r.Ba.get(e),s=i&&i.key;if(s){let a=new te(L.comparator);a=a.insert(s,Ie.newNoDocument(s,U.min()));const c=H().add(s),l=new Yi(U.min(),new Map,new te(G),a,c);await Yh(r,l),r.La=r.La.remove(s),r.Ba.delete(e),ta(r)}else await lo(r.localStore,e,!1).then(()=>fo(r,e,t)).catch(bn)}async function Qv(n,e){const t=F(n),r=e.batch.batchId;try{const i=await av(t.localStore,e);Jh(t,r,null),Xh(t,r),t.sharedClientState.updateMutationState(r,"acknowledged"),await br(t,i)}catch(i){await bn(i)}}async function Yv(n,e,t){const r=F(n);try{const i=await function(a,c){const l=F(a);return l.persistence.runTransaction("Reject batch","readwrite-primary",d=>{let p;return l.mutationQueue.lookupMutationBatch(d,c).next(g=>(Y(g!==null),p=g.keys(),l.mutationQueue.removeMutationBatch(d,g))).next(()=>l.mutationQueue.performConsistencyCheck(d)).next(()=>l.documentOverlayCache.removeOverlaysForBatchId(d,p,c)).next(()=>l.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(d,p)).next(()=>l.localDocuments.getDocuments(d,p))})}(r.localStore,e);Jh(r,e,t),Xh(r,e),r.sharedClientState.updateMutationState(e,"rejected",t),await br(r,i)}catch(i){await bn(i)}}function Xh(n,e){(n.Qa.get(e)||[]).forEach(t=>{t.resolve()}),n.Qa.delete(e)}function Jh(n,e,t){const r=F(n);let i=r.qa[r.currentUser.toKey()];if(i){const s=i.get(e);s&&(t?s.reject(t):s.resolve(),i=i.remove(e)),r.qa[r.currentUser.toKey()]=i}}function fo(n,e,t=null){n.sharedClientState.removeLocalQueryTarget(e);for(const r of n.Oa.get(e))n.xa.delete(r),t&&n.Ma.Wa(r,t);n.Oa.delete(e),n.isPrimaryClient&&n.ka.yr(e).forEach(r=>{n.ka.containsKey(r)||Zh(n,r)})}function Zh(n,e){n.Na.delete(e.path.canonicalString());const t=n.La.get(e);t!==null&&(Ho(n.remoteStore,t),n.La=n.La.remove(e),n.Ba.delete(t),ta(n))}function Ou(n,e,t){for(const r of t)r instanceof Wh?(n.ka.addReference(r.key,e),Xv(n,r)):r instanceof Kh?(O("SyncEngine","Document no longer in limbo: "+r.key),n.ka.removeReference(r.key,e),n.ka.containsKey(r.key)||Zh(n,r.key)):x()}function Xv(n,e){const t=e.key,r=t.path.canonicalString();n.La.get(t)||n.Na.has(r)||(O("SyncEngine","New document in limbo: "+t),n.Na.add(r),ta(n))}function ta(n){for(;n.Na.size>0&&n.La.size<n.maxConcurrentLimboResolutions;){const e=n.Na.values().next().value;n.Na.delete(e);const t=new L(J.fromString(e)),r=n.Ka.next();n.Ba.set(r,new Bv(t)),n.La=n.La.insert(t,r),qh(n.remoteStore,new At(Ke(zi(t.path)),r,"TargetPurposeLimboResolution",Bi.oe))}}async function br(n,e,t){const r=F(n),i=[],s=[],a=[];r.xa.isEmpty()||(r.xa.forEach((c,l)=>{a.push(r.Ua(l,e,t).then(d=>{var p;if((d||t)&&r.isPrimaryClient){const g=d?!d.fromCache:(p=t?.targetChanges.get(l.targetId))===null||p===void 0?void 0:p.current;r.sharedClientState.updateQueryState(l.targetId,g?"current":"not-current")}if(d){i.push(d);const g=zo.zi(l.targetId,d);s.push(g)}}))}),await Promise.all(a),r.Ma.R_(i),await async function(l,d){const p=F(l);try{await p.persistence.runTransaction("notifyLocalViewChanges","readwrite",g=>P.forEach(d,E=>P.forEach(E.Wi,R=>p.persistence.referenceDelegate.addReference(g,E.targetId,R)).next(()=>P.forEach(E.Gi,R=>p.persistence.referenceDelegate.removeReference(g,E.targetId,R)))))}catch(g){if(!Sn(g))throw g;O("LocalStore","Failed to update sequence numbers: "+g)}for(const g of d){const E=g.targetId;if(!g.fromCache){const R=p.us.get(E),k=R.snapshotVersion,V=R.withLastLimboFreeSnapshotVersion(k);p.us=p.us.insert(E,V)}}}(r.localStore,s))}async function Jv(n,e){const t=F(n);if(!t.currentUser.isEqual(e)){O("SyncEngine","User change. New user:",e.toKey());const r=await xh(t.localStore,e);t.currentUser=e,function(s,a){s.Qa.forEach(c=>{c.forEach(l=>{l.reject(new D(S.CANCELLED,a))})}),s.Qa.clear()}(t,"'waitForPendingWrites' promise is rejected due to a user change."),t.sharedClientState.handleUserChange(e,r.removedBatchIds,r.addedBatchIds),await br(t,r.Ts)}}function Zv(n,e){const t=F(n),r=t.Ba.get(e);if(r&&r.Fa)return H().add(r.key);{let i=H();const s=t.Oa.get(e);if(!s)return i;for(const a of s){const c=t.xa.get(a);i=i.unionWith(c.view.fa)}return i}}function ed(n){const e=F(n);return e.remoteStore.remoteSyncer.applyRemoteEvent=Yh.bind(null,e),e.remoteStore.remoteSyncer.getRemoteKeysForTarget=Zv.bind(null,e),e.remoteStore.remoteSyncer.rejectListen=Kv.bind(null,e),e.Ma.R_=Mv.bind(null,e.eventManager),e.Ma.Wa=xv.bind(null,e.eventManager),e}function eE(n){const e=F(n);return e.remoteStore.remoteSyncer.applySuccessfulWrite=Qv.bind(null,e),e.remoteStore.remoteSyncer.rejectFailedWrite=Yv.bind(null,e),e}class Ci{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(e){this.serializer=Xi(e.databaseInfo.databaseId),this.sharedClientState=this.za(e),this.persistence=this.ja(e),await this.persistence.start(),this.localStore=this.Ha(e),this.gcScheduler=this.Ja(e,this.localStore),this.indexBackfillerScheduler=this.Ya(e,this.localStore)}Ja(e,t){return null}Ya(e,t){return null}Ha(e){return ov(this.persistence,new iv,e.initialUser,this.serializer)}ja(e){return new Mh(jo.ei,this.serializer)}za(e){return new fv}async terminate(){var e,t;(e=this.gcScheduler)===null||e===void 0||e.stop(),(t=this.indexBackfillerScheduler)===null||t===void 0||t.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}Ci.provider={build:()=>new Ci};class tE extends Ci{constructor(e){super(),this.cacheSizeBytes=e}Ja(e,t){Y(this.persistence.referenceDelegate instanceof Si);const r=this.persistence.referenceDelegate.garbageCollector;return new jy(r,e.asyncQueue,t)}ja(e){const t=this.cacheSizeBytes!==void 0?ke.withCacheSize(this.cacheSizeBytes):ke.DEFAULT;return new Mh(r=>Si.ei(r,t),this.serializer)}}class po{async initialize(e,t){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(t),this.remoteStore=this.createRemoteStore(t),this.eventManager=this.createEventManager(t),this.syncEngine=this.createSyncEngine(t,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=r=>Vu(this.syncEngine,r,1),this.remoteStore.remoteSyncer.handleCredentialChange=Jv.bind(null,this.syncEngine),await Vv(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return function(){return new Lv}()}createDatastore(e){const t=Xi(e.databaseInfo.databaseId),r=function(s){return new _v(s)}(e.databaseInfo);return function(s,a,c,l){return new Ev(s,a,c,l)}(e.authCredentials,e.appCheckCredentials,r,t)}createRemoteStore(e){return function(r,i,s,a,c){return new Iv(r,i,s,a,c)}(this.localStore,this.datastore,e.asyncQueue,t=>Vu(this.syncEngine,t,0),function(){return Pu.p()?new Pu:new pv}())}createSyncEngine(e,t){return function(i,s,a,c,l,d,p){const g=new qv(i,s,a,c,l,d);return p&&(g.$a=!0),g}(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,t)}async terminate(){var e,t;await async function(i){const s=F(i);O("RemoteStore","RemoteStore shutting down."),s.k_.add(5),await Rr(s),s.Q_.shutdown(),s.K_.set("Unknown")}(this.remoteStore),(e=this.datastore)===null||e===void 0||e.terminate(),(t=this.eventManager)===null||t===void 0||t.terminate()}}po.provider={build:()=>new po};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class na{constructor(e){this.observer=e,this.muted=!1}next(e){this.muted||this.observer.next&&this.Xa(this.observer.next,e)}error(e){this.muted||(this.observer.error?this.Xa(this.observer.error,e):dt("Uncaught Error in snapshot listener:",e.toString()))}eu(){this.muted=!0}Xa(e,t){setTimeout(()=>{this.muted||e(t)},0)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nE{constructor(e,t,r,i,s){this.authCredentials=e,this.appCheckCredentials=t,this.asyncQueue=r,this.databaseInfo=i,this.user=Te.UNAUTHENTICATED,this.clientId=ih.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=s,this.authCredentials.start(r,async a=>{O("FirestoreClient","Received user=",a.uid),await this.authCredentialListener(a),this.user=a}),this.appCheckCredentials.start(r,a=>(O("FirestoreClient","Received new app check token=",a),this.appCheckCredentialListener(a,this.user)))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this.databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}terminate(){this.asyncQueue.enterRestrictedMode();const e=new ut;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted(async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(t){const r=Yo(t,"Failed to shutdown persistence");e.reject(r)}}),e.promise}}async function qs(n,e){n.asyncQueue.verifyOperationInProgress(),O("FirestoreClient","Initializing OfflineComponentProvider");const t=n.configuration;await e.initialize(t);let r=t.initialUser;n.setCredentialChangeListener(async i=>{r.isEqual(i)||(await xh(e.localStore,i),r=i)}),e.persistence.setDatabaseDeletedListener(()=>n.terminate()),n._offlineComponents=e}async function Lu(n,e){n.asyncQueue.verifyOperationInProgress();const t=await rE(n);O("FirestoreClient","Initializing OnlineComponentProvider"),await e.initialize(t,n.configuration),n.setCredentialChangeListener(r=>Cu(e.remoteStore,r)),n.setAppCheckTokenChangeListener((r,i)=>Cu(e.remoteStore,i)),n._onlineComponents=e}async function rE(n){if(!n._offlineComponents)if(n._uninitializedComponentsProvider){O("FirestoreClient","Using user provided OfflineComponentProvider");try{await qs(n,n._uninitializedComponentsProvider._offline)}catch(e){const t=e;if(!function(i){return i.name==="FirebaseError"?i.code===S.FAILED_PRECONDITION||i.code===S.UNIMPLEMENTED:!(typeof DOMException<"u"&&i instanceof DOMException)||i.code===22||i.code===20||i.code===11}(t))throw t;gn("Error using user provided cache. Falling back to memory cache: "+t),await qs(n,new Ci)}}else O("FirestoreClient","Using default OfflineComponentProvider"),await qs(n,new tE(void 0));return n._offlineComponents}async function td(n){return n._onlineComponents||(n._uninitializedComponentsProvider?(O("FirestoreClient","Using user provided OnlineComponentProvider"),await Lu(n,n._uninitializedComponentsProvider._online)):(O("FirestoreClient","Using default OnlineComponentProvider"),await Lu(n,new po))),n._onlineComponents}function iE(n){return td(n).then(e=>e.syncEngine)}async function ki(n){const e=await td(n),t=e.eventManager;return t.onListen=$v.bind(null,e.syncEngine),t.onUnlisten=Hv.bind(null,e.syncEngine),t.onFirstRemoteStoreListen=jv.bind(null,e.syncEngine),t.onLastRemoteStoreUnlisten=Gv.bind(null,e.syncEngine),t}function sE(n,e,t={}){const r=new ut;return n.asyncQueue.enqueueAndForget(async()=>function(s,a,c,l,d){const p=new na({next:E=>{p.eu(),a.enqueueAndForget(()=>Jo(s,g));const R=E.docs.has(c);!R&&E.fromCache?d.reject(new D(S.UNAVAILABLE,"Failed to get document because the client is offline.")):R&&E.fromCache&&l&&l.source==="server"?d.reject(new D(S.UNAVAILABLE,'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')):d.resolve(E)},error:E=>d.reject(E)}),g=new ea(zi(c.path),p,{includeMetadataChanges:!0,ua:!0});return Xo(s,g)}(await ki(n),n.asyncQueue,e,t,r)),r.promise}function oE(n,e,t={}){const r=new ut;return n.asyncQueue.enqueueAndForget(async()=>function(s,a,c,l,d){const p=new na({next:E=>{p.eu(),a.enqueueAndForget(()=>Jo(s,g)),E.fromCache&&l.source==="server"?d.reject(new D(S.UNAVAILABLE,'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')):d.resolve(E)},error:E=>d.reject(E)}),g=new ea(c,p,{includeMetadataChanges:!0,ua:!0});return Xo(s,g)}(await ki(n),n.asyncQueue,e,t,r)),r.promise}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function nd(n){const e={};return n.timeoutSeconds!==void 0&&(e.timeoutSeconds=n.timeoutSeconds),e}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Mu=new Map;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function rd(n,e,t){if(!t)throw new D(S.INVALID_ARGUMENT,`Function ${n}() cannot be called with an empty ${e}.`)}function aE(n,e,t,r){if(e===!0&&r===!0)throw new D(S.INVALID_ARGUMENT,`${n} and ${t} cannot be used together.`)}function xu(n){if(!L.isDocumentKey(n))throw new D(S.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${n} has ${n.length}.`)}function Uu(n){if(L.isDocumentKey(n))throw new D(S.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${n} has ${n.length}.`)}function es(n){if(n===void 0)return"undefined";if(n===null)return"null";if(typeof n=="string")return n.length>20&&(n=`${n.substring(0,20)}...`),JSON.stringify(n);if(typeof n=="number"||typeof n=="boolean")return""+n;if(typeof n=="object"){if(n instanceof Array)return"an array";{const e=function(r){return r.constructor?r.constructor.name:null}(n);return e?`a custom ${e} object`:"an object"}}return typeof n=="function"?"a function":x()}function Ce(n,e){if("_delegate"in n&&(n=n._delegate),!(n instanceof e)){if(e.name===n.constructor.name)throw new D(S.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const t=es(n);throw new D(S.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${t}`)}}return n}function cE(n,e){if(e<=0)throw new D(S.INVALID_ARGUMENT,`Function ${n}() requires a positive number, but it was: ${e}.`)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fu{constructor(e){var t,r;if(e.host===void 0){if(e.ssl!==void 0)throw new D(S.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host="firestore.googleapis.com",this.ssl=!0}else this.host=e.host,this.ssl=(t=e.ssl)===null||t===void 0||t;if(this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e.cacheSizeBytes===void 0)this.cacheSizeBytes=41943040;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<1048576)throw new D(S.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}aE("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=nd((r=e.experimentalLongPollingOptions)!==null&&r!==void 0?r:{}),function(s){if(s.timeoutSeconds!==void 0){if(isNaN(s.timeoutSeconds))throw new D(S.INVALID_ARGUMENT,`invalid long polling timeout: ${s.timeoutSeconds} (must not be NaN)`);if(s.timeoutSeconds<5)throw new D(S.INVALID_ARGUMENT,`invalid long polling timeout: ${s.timeoutSeconds} (minimum allowed value is 5)`);if(s.timeoutSeconds>30)throw new D(S.INVALID_ARGUMENT,`invalid long polling timeout: ${s.timeoutSeconds} (maximum allowed value is 30)`)}}(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&function(r,i){return r.timeoutSeconds===i.timeoutSeconds}(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}class ts{constructor(e,t,r,i){this._authCredentials=e,this._appCheckCredentials=t,this._databaseId=r,this._app=i,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new Fu({}),this._settingsFrozen=!1,this._terminateTask="notTerminated"}get app(){if(!this._app)throw new D(S.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new D(S.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new Fu(e),e.credentials!==void 0&&(this._authCredentials=function(r){if(!r)return new y_;switch(r.type){case"firstParty":return new I_(r.sessionIndex||"0",r.iamToken||null,r.authTokenFactory||null);case"provider":return r.client;default:throw new D(S.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}}(e.credentials))}_getSettings(){return this._settings}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return function(t){const r=Mu.get(t);r&&(O("ComponentProvider","Removing Datastore"),Mu.delete(t),r.terminate())}(this),Promise.resolve()}}function uE(n,e,t,r={}){var i;const s=(n=Ce(n,ts))._getSettings(),a=`${e}:${t}`;if(s.host!=="firestore.googleapis.com"&&s.host!==a&&gn("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used."),n._setSettings(Object.assign(Object.assign({},s),{host:a,ssl:!1})),r.mockUserToken){let c,l;if(typeof r.mockUserToken=="string")c=r.mockUserToken,l=Te.MOCK_USER;else{c=hl(r.mockUserToken,(i=n._app)===null||i===void 0?void 0:i.options.projectId);const d=r.mockUserToken.sub||r.mockUserToken.user_id;if(!d)throw new D(S.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");l=new Te(d)}n._authCredentials=new v_(new rh(c,l))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tt{constructor(e,t,r){this.converter=t,this._query=r,this.type="query",this.firestore=e}withConverter(e){return new tt(this.firestore,e,this._query)}}class we{constructor(e,t,r){this.converter=t,this._key=r,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new bt(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new we(this.firestore,e,this._key)}}class bt extends tt{constructor(e,t,r){super(e,t,zi(r)),this._path=r,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new we(this.firestore,null,new L(e))}withConverter(e){return new bt(this.firestore,e,this._path)}}function lw(n,e,...t){if(n=Q(n),rd("collection","path",e),n instanceof ts){const r=J.fromString(e,...t);return Uu(r),new bt(n,null,r)}{if(!(n instanceof we||n instanceof bt))throw new D(S.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=n._path.child(J.fromString(e,...t));return Uu(r),new bt(n.firestore,null,r)}}function lE(n,e,...t){if(n=Q(n),arguments.length===1&&(e=ih.newId()),rd("doc","path",e),n instanceof ts){const r=J.fromString(e,...t);return xu(r),new we(n,null,new L(r))}{if(!(n instanceof we||n instanceof bt))throw new D(S.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=n._path.child(J.fromString(e,...t));return xu(r),new we(n.firestore,n instanceof bt?n.converter:null,new L(r))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Bu{constructor(e=Promise.resolve()){this.Iu=[],this.Eu=!1,this.du=[],this.Au=null,this.Ru=!1,this.Vu=!1,this.mu=[],this.r_=new Fh(this,"async_queue_retry"),this.fu=()=>{const r=Bs();r&&O("AsyncQueue","Visibility state changed to "+r.visibilityState),this.r_.Jo()},this.gu=e;const t=Bs();t&&typeof t.addEventListener=="function"&&t.addEventListener("visibilitychange",this.fu)}get isShuttingDown(){return this.Eu}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.pu(),this.yu(e)}enterRestrictedMode(e){if(!this.Eu){this.Eu=!0,this.Vu=e||!1;const t=Bs();t&&typeof t.removeEventListener=="function"&&t.removeEventListener("visibilitychange",this.fu)}}enqueue(e){if(this.pu(),this.Eu)return new Promise(()=>{});const t=new ut;return this.yu(()=>this.Eu&&this.Vu?Promise.resolve():(e().then(t.resolve,t.reject),t.promise)).then(()=>t.promise)}enqueueRetryable(e){this.enqueueAndForget(()=>(this.Iu.push(e),this.wu()))}async wu(){if(this.Iu.length!==0){try{await this.Iu[0](),this.Iu.shift(),this.r_.reset()}catch(e){if(!Sn(e))throw e;O("AsyncQueue","Operation failed with retryable error: "+e)}this.Iu.length>0&&this.r_.jo(()=>this.wu())}}yu(e){const t=this.gu.then(()=>(this.Ru=!0,e().catch(r=>{this.Au=r,this.Ru=!1;const i=function(a){let c=a.message||"";return a.stack&&(c=a.stack.includes(a.message)?a.stack:a.message+`
`+a.stack),c}(r);throw dt("INTERNAL UNHANDLED ERROR: ",i),r}).then(r=>(this.Ru=!1,r))));return this.gu=t,t}enqueueAfterDelay(e,t,r){this.pu(),this.mu.indexOf(e)>-1&&(t=0);const i=Qo.createAndSchedule(this,e,t,r,s=>this.Su(s));return this.du.push(i),i}pu(){this.Au&&x()}verifyOperationInProgress(){}async bu(){let e;do e=this.gu,await e;while(e!==this.gu)}Du(e){for(const t of this.du)if(t.timerId===e)return!0;return!1}vu(e){return this.bu().then(()=>{this.du.sort((t,r)=>t.targetTimeMs-r.targetTimeMs);for(const t of this.du)if(t.skipDelay(),e!=="all"&&t.timerId===e)break;return this.bu()})}Cu(e){this.mu.push(e)}Su(e){const t=this.du.indexOf(e);this.du.splice(t,1)}}function qu(n){return function(t,r){if(typeof t!="object"||t===null)return!1;const i=t;for(const s of r)if(s in i&&typeof i[s]=="function")return!0;return!1}(n,["next","error","complete"])}class Xe extends ts{constructor(e,t,r,i){super(e,t,r,i),this.type="firestore",this._queue=new Bu,this._persistenceKey=i?.name||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const e=this._firestoreClient.terminate();this._queue=new Bu(e),this._firestoreClient=void 0,await e}}}function hw(n,e){const t=typeof n=="object"?n:Mi(),r=typeof n=="string"?n:"(default)",i=Dt(t,"firestore").getImmediate({identifier:r});if(!i._initialized){const s=cl("firestore");s&&uE(i,...s)}return i}function Sr(n){if(n._terminated)throw new D(S.FAILED_PRECONDITION,"The client has already been terminated.");return n._firestoreClient||hE(n),n._firestoreClient}function hE(n){var e,t,r;const i=n._freezeSettings(),s=function(c,l,d,p){return new x_(c,l,d,p.host,p.ssl,p.experimentalForceLongPolling,p.experimentalAutoDetectLongPolling,nd(p.experimentalLongPollingOptions),p.useFetchStreams)}(n._databaseId,((e=n._app)===null||e===void 0?void 0:e.options.appId)||"",n._persistenceKey,i);n._componentsProvider||!((t=i.localCache)===null||t===void 0)&&t._offlineComponentProvider&&(!((r=i.localCache)===null||r===void 0)&&r._onlineComponentProvider)&&(n._componentsProvider={_offline:i.localCache._offlineComponentProvider,_online:i.localCache._onlineComponentProvider}),n._firestoreClient=new nE(n._authCredentials,n._appCheckCredentials,n._queue,s,n._componentsProvider&&function(c){const l=c?._online.build();return{_offline:c?._offline.build(l),_online:l}}(n._componentsProvider))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wn{constructor(e){this._byteString=e}static fromBase64String(e){try{return new wn(me.fromBase64String(e))}catch(t){throw new D(S.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+t)}}static fromUint8Array(e){return new wn(me.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pr{constructor(...e){for(let t=0;t<e.length;++t)if(e[t].length===0)throw new D(S.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new pe(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ns{constructor(e){this._methodName=e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ra{constructor(e,t){if(!isFinite(e)||e<-90||e>90)throw new D(S.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(t)||t<-180||t>180)throw new D(S.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+t);this._lat=e,this._long=t}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}toJSON(){return{latitude:this._lat,longitude:this._long}}_compareTo(e){return G(this._lat,e._lat)||G(this._long,e._long)}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ia{constructor(e){this._values=(e||[]).map(t=>t)}toArray(){return this._values.map(e=>e)}isEqual(e){return function(r,i){if(r.length!==i.length)return!1;for(let s=0;s<r.length;++s)if(r[s]!==i[s])return!1;return!0}(this._values,e._values)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const dE=/^__.*__$/;class fE{constructor(e,t,r){this.data=e,this.fieldMask=t,this.fieldTransforms=r}toMutation(e,t){return this.fieldMask!==null?new Ot(e,this.data,this.fieldMask,t,this.fieldTransforms):new wr(e,this.data,t,this.fieldTransforms)}}class id{constructor(e,t,r){this.data=e,this.fieldMask=t,this.fieldTransforms=r}toMutation(e,t){return new Ot(e,this.data,this.fieldMask,t,this.fieldTransforms)}}function sd(n){switch(n){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw x()}}class sa{constructor(e,t,r,i,s,a){this.settings=e,this.databaseId=t,this.serializer=r,this.ignoreUndefinedProperties=i,s===void 0&&this.Fu(),this.fieldTransforms=s||[],this.fieldMask=a||[]}get path(){return this.settings.path}get Mu(){return this.settings.Mu}xu(e){return new sa(Object.assign(Object.assign({},this.settings),e),this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}Ou(e){var t;const r=(t=this.path)===null||t===void 0?void 0:t.child(e),i=this.xu({path:r,Nu:!1});return i.Lu(e),i}Bu(e){var t;const r=(t=this.path)===null||t===void 0?void 0:t.child(e),i=this.xu({path:r,Nu:!1});return i.Fu(),i}ku(e){return this.xu({path:void 0,Nu:!0})}qu(e){return Ni(e,this.settings.methodName,this.settings.Qu||!1,this.path,this.settings.Ku)}contains(e){return this.fieldMask.find(t=>e.isPrefixOf(t))!==void 0||this.fieldTransforms.find(t=>e.isPrefixOf(t.field))!==void 0}Fu(){if(this.path)for(let e=0;e<this.path.length;e++)this.Lu(this.path.get(e))}Lu(e){if(e.length===0)throw this.qu("Document fields must not be empty");if(sd(this.Mu)&&dE.test(e))throw this.qu('Document fields cannot begin and end with "__"')}}class pE{constructor(e,t,r){this.databaseId=e,this.ignoreUndefinedProperties=t,this.serializer=r||Xi(e)}$u(e,t,r,i=!1){return new sa({Mu:e,methodName:t,Ku:r,path:pe.emptyPath(),Nu:!1,Qu:i},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function Cn(n){const e=n._freezeSettings(),t=Xi(n._databaseId);return new pE(n._databaseId,!!e.ignoreUndefinedProperties,t)}function oa(n,e,t,r,i,s={}){const a=n.$u(s.merge||s.mergeFields?2:0,e,t,i);ca("Data must be an object, but it was:",a,r);const c=ud(r,a);let l,d;if(s.merge)l=new Oe(a.fieldMask),d=a.fieldTransforms;else if(s.mergeFields){const p=[];for(const g of s.mergeFields){const E=mo(e,g,t);if(!a.contains(E))throw new D(S.INVALID_ARGUMENT,`Field '${E}' is specified in your field mask but missing from your input data.`);hd(p,E)||p.push(E)}l=new Oe(p),d=a.fieldTransforms.filter(g=>l.covers(g.field))}else l=null,d=a.fieldTransforms;return new fE(new Ne(c),l,d)}class rs extends ns{_toFieldTransform(e){if(e.Mu!==2)throw e.Mu===1?e.qu(`${this._methodName}() can only appear at the top level of your update data`):e.qu(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);return e.fieldMask.push(e.path),null}isEqual(e){return e instanceof rs}}class aa extends ns{_toFieldTransform(e){return new cy(e.path,new mr)}isEqual(e){return e instanceof aa}}function od(n,e,t,r){const i=n.$u(1,e,t);ca("Data must be an object, but it was:",i,r);const s=[],a=Ne.empty();Vt(r,(l,d)=>{const p=ua(e,l,t);d=Q(d);const g=i.Bu(p);if(d instanceof rs)s.push(p);else{const E=Cr(d,g);E!=null&&(s.push(p),a.set(p,E))}});const c=new Oe(s);return new id(a,c,i.fieldTransforms)}function ad(n,e,t,r,i,s){const a=n.$u(1,e,t),c=[mo(e,r,t)],l=[i];if(s.length%2!=0)throw new D(S.INVALID_ARGUMENT,`Function ${e}() needs to be called with an even number of arguments that alternate between field names and values.`);for(let E=0;E<s.length;E+=2)c.push(mo(e,s[E])),l.push(s[E+1]);const d=[],p=Ne.empty();for(let E=c.length-1;E>=0;--E)if(!hd(d,c[E])){const R=c[E];let k=l[E];k=Q(k);const V=a.Bu(R);if(k instanceof rs)d.push(R);else{const C=Cr(k,V);C!=null&&(d.push(R),p.set(R,C))}}const g=new Oe(d);return new id(p,g,a.fieldTransforms)}function cd(n,e,t,r=!1){return Cr(t,n.$u(r?4:3,e))}function Cr(n,e){if(ld(n=Q(n)))return ca("Unsupported field value:",e,n),ud(n,e);if(n instanceof ns)return function(r,i){if(!sd(i.Mu))throw i.qu(`${r._methodName}() can only be used with update() and set()`);if(!i.path)throw i.qu(`${r._methodName}() is not currently supported inside arrays`);const s=r._toFieldTransform(i);s&&i.fieldTransforms.push(s)}(n,e),null;if(n===void 0&&e.ignoreUndefinedProperties)return null;if(e.path&&e.fieldMask.push(e.path),n instanceof Array){if(e.settings.Nu&&e.Mu!==4)throw e.qu("Nested arrays are not supported");return function(r,i){const s=[];let a=0;for(const c of r){let l=Cr(c,i.ku(a));l==null&&(l={nullValue:"NULL_VALUE"}),s.push(l),a++}return{arrayValue:{values:s}}}(n,e)}return function(r,i){if((r=Q(r))===null)return{nullValue:"NULL_VALUE"};if(typeof r=="number")return sy(i.serializer,r);if(typeof r=="boolean")return{booleanValue:r};if(typeof r=="string")return{stringValue:r};if(r instanceof Date){const s=ce.fromDate(r);return{timestampValue:bi(i.serializer,s)}}if(r instanceof ce){const s=new ce(r.seconds,1e3*Math.floor(r.nanoseconds/1e3));return{timestampValue:bi(i.serializer,s)}}if(r instanceof ra)return{geoPointValue:{latitude:r.latitude,longitude:r.longitude}};if(r instanceof wn)return{bytesValue:Ch(i.serializer,r._byteString)};if(r instanceof we){const s=i.databaseId,a=r.firestore._databaseId;if(!a.isEqual(s))throw i.qu(`Document reference is for database ${a.projectId}/${a.database} but should be for database ${s.projectId}/${s.database}`);return{referenceValue:qo(r.firestore._databaseId||i.databaseId,r._key.path)}}if(r instanceof ia)return function(a,c){return{mapValue:{fields:{__type__:{stringValue:"__vector__"},value:{arrayValue:{values:a.toArray().map(l=>{if(typeof l!="number")throw c.qu("VectorValues must only contain numeric values.");return Uo(c.serializer,l)})}}}}}}(r,i);throw i.qu(`Unsupported field value: ${es(r)}`)}(n,e)}function ud(n,e){const t={};return sh(n)?e.path&&e.path.length>0&&e.fieldMask.push(e.path):Vt(n,(r,i)=>{const s=Cr(i,e.Ou(r));s!=null&&(t[r]=s)}),{mapValue:{fields:t}}}function ld(n){return!(typeof n!="object"||n===null||n instanceof Array||n instanceof Date||n instanceof ce||n instanceof ra||n instanceof wn||n instanceof we||n instanceof ns||n instanceof ia)}function ca(n,e,t){if(!ld(t)||!function(i){return typeof i=="object"&&i!==null&&(Object.getPrototypeOf(i)===Object.prototype||Object.getPrototypeOf(i)===null)}(t)){const r=es(t);throw r==="an object"?e.qu(n+" a custom object"):e.qu(n+" "+r)}}function mo(n,e,t){if((e=Q(e))instanceof Pr)return e._internalPath;if(typeof e=="string")return ua(n,e);throw Ni("Field path arguments must be of type string or ",n,!1,void 0,t)}const mE=new RegExp("[~\\*/\\[\\]]");function ua(n,e,t){if(e.search(mE)>=0)throw Ni(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,n,!1,void 0,t);try{return new Pr(...e.split("."))._internalPath}catch{throw Ni(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,n,!1,void 0,t)}}function Ni(n,e,t,r,i){const s=r&&!r.isEmpty(),a=i!==void 0;let c=`Function ${e}() called with invalid data`;t&&(c+=" (via `toFirestore()`)"),c+=". ";let l="";return(s||a)&&(l+=" (found",s&&(l+=` in field ${r}`),a&&(l+=` in document ${i}`),l+=")"),new D(S.INVALID_ARGUMENT,c+n+l)}function hd(n,e){return n.some(t=>t.isEqual(e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class la{constructor(e,t,r,i,s){this._firestore=e,this._userDataWriter=t,this._key=r,this._document=i,this._converter=s}get id(){return this._key.path.lastSegment()}get ref(){return new we(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const e=new gE(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}get(e){if(this._document){const t=this._document.data.field(is("DocumentSnapshot.get",e));if(t!==null)return this._userDataWriter.convertValue(t)}}}class gE extends la{data(){return super.data()}}function is(n,e){return typeof e=="string"?ua(n,e):e instanceof Pr?e._internalPath:e._delegate._internalPath}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function dd(n){if(n.limitType==="L"&&n.explicitOrderBy.length===0)throw new D(S.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}class ha{}class ss extends ha{}function dw(n,e,...t){let r=[];e instanceof ha&&r.push(e),r=r.concat(t),function(s){const a=s.filter(l=>l instanceof da).length,c=s.filter(l=>l instanceof os).length;if(a>1||a>0&&c>0)throw new D(S.INVALID_ARGUMENT,"InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.")}(r);for(const i of r)n=i._apply(n);return n}class os extends ss{constructor(e,t,r){super(),this._field=e,this._op=t,this._value=r,this.type="where"}static _create(e,t,r){return new os(e,t,r)}_apply(e){const t=this._parse(e);return fd(e._query,t),new tt(e.firestore,e.converter,so(e._query,t))}_parse(e){const t=Cn(e.firestore);return function(s,a,c,l,d,p,g){let E;if(d.isKeyField()){if(p==="array-contains"||p==="array-contains-any")throw new D(S.INVALID_ARGUMENT,`Invalid Query. You can't perform '${p}' queries on documentId().`);if(p==="in"||p==="not-in"){ju(g,p);const R=[];for(const k of g)R.push($u(l,s,k));E={arrayValue:{values:R}}}else E=$u(l,s,g)}else p!=="in"&&p!=="not-in"&&p!=="array-contains-any"||ju(g,p),E=cd(c,a,g,p==="in"||p==="not-in");return ae.create(d,p,E)}(e._query,"where",t,e.firestore._databaseId,this._field,this._op,this._value)}}function fw(n,e,t){const r=e,i=is("where",n);return os._create(i,r,t)}class da extends ha{constructor(e,t){super(),this.type=e,this._queryConstraints=t}static _create(e,t){return new da(e,t)}_parse(e){const t=this._queryConstraints.map(r=>r._parse(e)).filter(r=>r.getFilters().length>0);return t.length===1?t[0]:He.create(t,this._getOperator())}_apply(e){const t=this._parse(e);return t.getFilters().length===0?e:(function(i,s){let a=i;const c=s.getFlattenedFilters();for(const l of c)fd(a,l),a=so(a,l)}(e._query,t),new tt(e.firestore,e.converter,so(e._query,t)))}_getQueryConstraints(){return this._queryConstraints}_getOperator(){return this.type==="and"?"and":"or"}}class fa extends ss{constructor(e,t){super(),this._field=e,this._direction=t,this.type="orderBy"}static _create(e,t){return new fa(e,t)}_apply(e){const t=function(i,s,a){if(i.startAt!==null)throw new D(S.INVALID_ARGUMENT,"Invalid query. You must not call startAt() or startAfter() before calling orderBy().");if(i.endAt!==null)throw new D(S.INVALID_ARGUMENT,"Invalid query. You must not call endAt() or endBefore() before calling orderBy().");return new pr(s,a)}(e._query,this._field,this._direction);return new tt(e.firestore,e.converter,function(i,s){const a=i.explicitOrderBy.concat([s]);return new Zt(i.path,i.collectionGroup,a,i.filters.slice(),i.limit,i.limitType,i.startAt,i.endAt)}(e._query,t))}}function pw(n,e="asc"){const t=e,r=is("orderBy",n);return fa._create(r,t)}class pa extends ss{constructor(e,t,r){super(),this.type=e,this._limit=t,this._limitType=r}static _create(e,t,r){return new pa(e,t,r)}_apply(e){return new tt(e.firestore,e.converter,Ai(e._query,this._limit,this._limitType))}}function mw(n){return cE("limit",n),pa._create("limit",n,"F")}class ma extends ss{constructor(e,t,r){super(),this.type=e,this._docOrFields=t,this._inclusive=r}static _create(e,t,r){return new ma(e,t,r)}_apply(e){const t=_E(e,this.type,this._docOrFields,this._inclusive);return new tt(e.firestore,e.converter,function(i,s){return new Zt(i.path,i.collectionGroup,i.explicitOrderBy.slice(),i.filters.slice(),i.limit,i.limitType,s,i.endAt)}(e._query,t))}}function gw(...n){return ma._create("startAfter",n,!1)}function _E(n,e,t,r){if(t[0]=Q(t[0]),t[0]instanceof la)return function(s,a,c,l,d){if(!l)throw new D(S.NOT_FOUND,`Can't use a DocumentSnapshot that doesn't exist for ${c}().`);const p=[];for(const g of pn(s))if(g.field.isKeyField())p.push(wi(a,l.key));else{const E=l.data.field(g.field);if($i(E))throw new D(S.INVALID_ARGUMENT,'Invalid query. You are trying to start or end a query using a document for which the field "'+g.field+'" is an uncommitted server timestamp. (Since the value of this field is unknown, you cannot start/end a query with it.)');if(E===null){const R=g.field.canonicalString();throw new D(S.INVALID_ARGUMENT,`Invalid query. You are trying to start or end a query using a document for which the field '${R}' (used as the orderBy) does not exist.`)}p.push(E)}return new En(p,d)}(n._query,n.firestore._databaseId,e,t[0]._document,r);{const i=Cn(n.firestore);return function(a,c,l,d,p,g){const E=a.explicitOrderBy;if(p.length>E.length)throw new D(S.INVALID_ARGUMENT,`Too many arguments provided to ${d}(). The number of arguments must be less than or equal to the number of orderBy() clauses`);const R=[];for(let k=0;k<p.length;k++){const V=p[k];if(E[k].field.isKeyField()){if(typeof V!="string")throw new D(S.INVALID_ARGUMENT,`Invalid query. Expected a string for document ID in ${d}(), but got a ${typeof V}`);if(!xo(a)&&V.indexOf("/")!==-1)throw new D(S.INVALID_ARGUMENT,`Invalid query. When querying a collection and ordering by documentId(), the value passed to ${d}() must be a plain document ID, but '${V}' contains a slash.`);const C=a.path.child(J.fromString(V));if(!L.isDocumentKey(C))throw new D(S.INVALID_ARGUMENT,`Invalid query. When querying a collection group and ordering by documentId(), the value passed to ${d}() must result in a valid document path, but '${C}' is not because it contains an odd number of segments.`);const B=new L(C);R.push(wi(c,B))}else{const C=cd(l,d,V);R.push(C)}}return new En(R,g)}(n._query,n.firestore._databaseId,i,e,t,r)}}function $u(n,e,t){if(typeof(t=Q(t))=="string"){if(t==="")throw new D(S.INVALID_ARGUMENT,"Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");if(!xo(e)&&t.indexOf("/")!==-1)throw new D(S.INVALID_ARGUMENT,`Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${t}' contains a '/' character.`);const r=e.path.child(J.fromString(t));if(!L.isDocumentKey(r))throw new D(S.INVALID_ARGUMENT,`Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${r}' is not because it has an odd number of segments (${r.length}).`);return wi(n,new L(r))}if(t instanceof we)return wi(n,t._key);throw new D(S.INVALID_ARGUMENT,`Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${es(t)}.`)}function ju(n,e){if(!Array.isArray(n)||n.length===0)throw new D(S.INVALID_ARGUMENT,`Invalid Query. A non-empty array is required for '${e.toString()}' filters.`)}function fd(n,e){const t=function(i,s){for(const a of i)for(const c of a.getFlattenedFilters())if(s.indexOf(c.op)>=0)return c.op;return null}(n.filters,function(i){switch(i){case"!=":return["!=","not-in"];case"array-contains-any":case"in":return["not-in"];case"not-in":return["array-contains-any","in","not-in","!="];default:return[]}}(e.op));if(t!==null)throw t===e.op?new D(S.INVALID_ARGUMENT,`Invalid query. You cannot use more than one '${e.op.toString()}' filter.`):new D(S.INVALID_ARGUMENT,`Invalid query. You cannot use '${e.op.toString()}' filters with '${t.toString()}' filters.`)}class yE{convertValue(e,t="none"){switch(kt(e)){case 0:return null;case 1:return e.booleanValue;case 2:return se(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,t);case 5:return e.stringValue;case 6:return this.convertBytes(Ct(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,t);case 11:return this.convertObject(e.mapValue,t);case 10:return this.convertVectorValue(e.mapValue);default:throw x()}}convertObject(e,t){return this.convertObjectMap(e.fields,t)}convertObjectMap(e,t="none"){const r={};return Vt(e,(i,s)=>{r[i]=this.convertValue(s,t)}),r}convertVectorValue(e){var t,r,i;const s=(i=(r=(t=e.fields)===null||t===void 0?void 0:t.value.arrayValue)===null||r===void 0?void 0:r.values)===null||i===void 0?void 0:i.map(a=>se(a.doubleValue));return new ia(s)}convertGeoPoint(e){return new ra(se(e.latitude),se(e.longitude))}convertArray(e,t){return(e.values||[]).map(r=>this.convertValue(r,t))}convertServerTimestamp(e,t){switch(t){case"previous":const r=ji(e);return r==null?null:this.convertValue(r,t);case"estimate":return this.convertTimestamp(hr(e));default:return null}}convertTimestamp(e){const t=Pt(e);return new ce(t.seconds,t.nanos)}convertDocumentKey(e,t){const r=J.fromString(e);Y(Lh(r));const i=new dr(r.get(1),r.get(3)),s=new L(r.popFirst(5));return i.isEqual(t)||dt(`Document ${s} contains a document reference within a different database (${i.projectId}/${i.database}) which is not supported. It will be treated as a reference in the current database (${t.projectId}/${t.database}) instead.`),s}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ga(n,e,t){let r;return r=n?t&&(t.merge||t.mergeFields)?n.toFirestore(e,t):n.toFirestore(e):e,r}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zn{constructor(e,t){this.hasPendingWrites=e,this.fromCache=t}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}}class pd extends la{constructor(e,t,r,i,s,a){super(e,t,r,i,a),this._firestore=e,this._firestoreImpl=e,this.metadata=s}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){const t=new fi(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(t,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,t={}){if(this._document){const r=this._document.data.field(is("DocumentSnapshot.get",e));if(r!==null)return this._userDataWriter.convertValue(r,t.serverTimestamps)}}}class fi extends pd{data(e={}){return super.data(e)}}class md{constructor(e,t,r,i){this._firestore=e,this._userDataWriter=t,this._snapshot=i,this.metadata=new Zn(i.hasPendingWrites,i.fromCache),this.query=r}get docs(){const e=[];return this.forEach(t=>e.push(t)),e}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(e,t){this._snapshot.docs.forEach(r=>{e.call(t,new fi(this._firestore,this._userDataWriter,r.key,r,new Zn(this._snapshot.mutatedKeys.has(r.key),this._snapshot.fromCache),this.query.converter))})}docChanges(e={}){const t=!!e.includeMetadataChanges;if(t&&this._snapshot.excludesMetadataChanges)throw new D(S.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===t||(this._cachedChanges=function(i,s){if(i._snapshot.oldDocs.isEmpty()){let a=0;return i._snapshot.docChanges.map(c=>{const l=new fi(i._firestore,i._userDataWriter,c.doc.key,c.doc,new Zn(i._snapshot.mutatedKeys.has(c.doc.key),i._snapshot.fromCache),i.query.converter);return c.doc,{type:"added",doc:l,oldIndex:-1,newIndex:a++}})}{let a=i._snapshot.oldDocs;return i._snapshot.docChanges.filter(c=>s||c.type!==3).map(c=>{const l=new fi(i._firestore,i._userDataWriter,c.doc.key,c.doc,new Zn(i._snapshot.mutatedKeys.has(c.doc.key),i._snapshot.fromCache),i.query.converter);let d=-1,p=-1;return c.type!==0&&(d=a.indexOf(c.doc.key),a=a.delete(c.doc.key)),c.type!==1&&(a=a.add(c.doc),p=a.indexOf(c.doc.key)),{type:vE(c.type),doc:l,oldIndex:d,newIndex:p}})}}(this,t),this._cachedChangesIncludeMetadataChanges=t),this._cachedChanges}}function vE(n){switch(n){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return x()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function _w(n){n=Ce(n,we);const e=Ce(n.firestore,Xe);return sE(Sr(e),n._key).then(t=>gd(e,n,t))}class _a extends yE{constructor(e){super(),this.firestore=e}convertBytes(e){return new wn(e)}convertReference(e){const t=this.convertDocumentKey(e,this.firestore._databaseId);return new we(this.firestore,null,t)}}function yw(n){n=Ce(n,tt);const e=Ce(n.firestore,Xe),t=Sr(e),r=new _a(e);return dd(n._query),oE(t,n._query).then(i=>new md(e,r,n,i))}function vw(n,e,t){n=Ce(n,we);const r=Ce(n.firestore,Xe),i=ga(n.converter,e,t);return kr(r,[oa(Cn(r),"setDoc",n._key,i,n.converter!==null,t).toMutation(n._key,Pe.none())])}function Ew(n,e,t,...r){n=Ce(n,we);const i=Ce(n.firestore,Xe),s=Cn(i);let a;return a=typeof(e=Q(e))=="string"||e instanceof Pr?ad(s,"updateDoc",n._key,e,t,r):od(s,"updateDoc",n._key,e),kr(i,[a.toMutation(n._key,Pe.exists(!0))])}function Tw(n){return kr(Ce(n.firestore,Xe),[new Qi(n._key,Pe.none())])}function Iw(n,e){const t=Ce(n.firestore,Xe),r=lE(n),i=ga(n.converter,e);return kr(t,[oa(Cn(n.firestore),"addDoc",r._key,i,n.converter!==null,{}).toMutation(r._key,Pe.exists(!1))]).then(()=>r)}function ww(n,...e){var t,r,i;n=Q(n);let s={includeMetadataChanges:!1,source:"default"},a=0;typeof e[a]!="object"||qu(e[a])||(s=e[a],a++);const c={includeMetadataChanges:s.includeMetadataChanges,source:s.source};if(qu(e[a])){const g=e[a];e[a]=(t=g.next)===null||t===void 0?void 0:t.bind(g),e[a+1]=(r=g.error)===null||r===void 0?void 0:r.bind(g),e[a+2]=(i=g.complete)===null||i===void 0?void 0:i.bind(g)}let l,d,p;if(n instanceof we)d=Ce(n.firestore,Xe),p=zi(n._key.path),l={next:g=>{e[a]&&e[a](gd(d,n,g))},error:e[a+1],complete:e[a+2]};else{const g=Ce(n,tt);d=Ce(g.firestore,Xe),p=g._query;const E=new _a(d);l={next:R=>{e[a]&&e[a](new md(d,E,g,R))},error:e[a+1],complete:e[a+2]},dd(n._query)}return function(E,R,k,V){const C=new na(V),B=new ea(R,C,k);return E.asyncQueue.enqueueAndForget(async()=>Xo(await ki(E),B)),()=>{C.eu(),E.asyncQueue.enqueueAndForget(async()=>Jo(await ki(E),B))}}(Sr(d),p,c,l)}function kr(n,e){return function(r,i){const s=new ut;return r.asyncQueue.enqueueAndForget(async()=>Wv(await iE(r),i,s)),s.promise}(Sr(n),e)}function gd(n,e,t){const r=t.docs.get(e._key),i=new _a(n);return new pd(n,i,e._key,r,new Zn(t.hasPendingWrites,t.fromCache),e.converter)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class EE{constructor(e,t){this._firestore=e,this._commitHandler=t,this._mutations=[],this._committed=!1,this._dataReader=Cn(e)}set(e,t,r){this._verifyNotCommitted();const i=$s(e,this._firestore),s=ga(i.converter,t,r),a=oa(this._dataReader,"WriteBatch.set",i._key,s,i.converter!==null,r);return this._mutations.push(a.toMutation(i._key,Pe.none())),this}update(e,t,r,...i){this._verifyNotCommitted();const s=$s(e,this._firestore);let a;return a=typeof(t=Q(t))=="string"||t instanceof Pr?ad(this._dataReader,"WriteBatch.update",s._key,t,r,i):od(this._dataReader,"WriteBatch.update",s._key,t),this._mutations.push(a.toMutation(s._key,Pe.exists(!0))),this}delete(e){this._verifyNotCommitted();const t=$s(e,this._firestore);return this._mutations=this._mutations.concat(new Qi(t._key,Pe.none())),this}commit(){return this._verifyNotCommitted(),this._committed=!0,this._mutations.length>0?this._commitHandler(this._mutations):Promise.resolve()}_verifyNotCommitted(){if(this._committed)throw new D(S.FAILED_PRECONDITION,"A write batch can no longer be used after commit() has been called.")}}function $s(n,e){if((n=Q(n)).firestore!==e)throw new D(S.INVALID_ARGUMENT,"Provided document reference is from a different Firestore instance.");return n}function Aw(){return new aa("serverTimestamp")}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Rw(n){return Sr(n=Ce(n,Xe)),new EE(n,e=>kr(n,e))}(function(e,t=!0){(function(i){Rn=i})(Jt),ze(new Fe("firestore",(r,{instanceIdentifier:i,options:s})=>{const a=r.getProvider("app").getImmediate(),c=new Xe(new E_(r.getProvider("auth-internal")),new A_(r.getProvider("app-check-internal")),function(d,p){if(!Object.prototype.hasOwnProperty.apply(d.options,["projectId"]))throw new D(S.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new dr(d.options.projectId,p)}(a,i),a);return s=Object.assign({useFetchStreams:t},s),c._setSettings(s),c},"PUBLIC").setMultipleInstances(!0)),Me(ru,"4.7.5",e),Me(ru,"4.7.5","esm2017")})();/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const _d="firebasestorage.googleapis.com",yd="storageBucket",TE=2*60*1e3,IE=10*60*1e3;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ie extends Be{constructor(e,t,r=0){super(js(e),`Firebase Storage: ${t} (${js(e)})`),this.status_=r,this.customData={serverResponse:null},this._baseMessage=this.message,Object.setPrototypeOf(this,ie.prototype)}get status(){return this.status_}set status(e){this.status_=e}_codeEquals(e){return js(e)===this.code}get serverResponse(){return this.customData.serverResponse}set serverResponse(e){this.customData.serverResponse=e,this.customData.serverResponse?this.message=`${this._baseMessage}
${this.customData.serverResponse}`:this.message=this._baseMessage}}var re;(function(n){n.UNKNOWN="unknown",n.OBJECT_NOT_FOUND="object-not-found",n.BUCKET_NOT_FOUND="bucket-not-found",n.PROJECT_NOT_FOUND="project-not-found",n.QUOTA_EXCEEDED="quota-exceeded",n.UNAUTHENTICATED="unauthenticated",n.UNAUTHORIZED="unauthorized",n.UNAUTHORIZED_APP="unauthorized-app",n.RETRY_LIMIT_EXCEEDED="retry-limit-exceeded",n.INVALID_CHECKSUM="invalid-checksum",n.CANCELED="canceled",n.INVALID_EVENT_NAME="invalid-event-name",n.INVALID_URL="invalid-url",n.INVALID_DEFAULT_BUCKET="invalid-default-bucket",n.NO_DEFAULT_BUCKET="no-default-bucket",n.CANNOT_SLICE_BLOB="cannot-slice-blob",n.SERVER_FILE_WRONG_SIZE="server-file-wrong-size",n.NO_DOWNLOAD_URL="no-download-url",n.INVALID_ARGUMENT="invalid-argument",n.INVALID_ARGUMENT_COUNT="invalid-argument-count",n.APP_DELETED="app-deleted",n.INVALID_ROOT_OPERATION="invalid-root-operation",n.INVALID_FORMAT="invalid-format",n.INTERNAL_ERROR="internal-error",n.UNSUPPORTED_ENVIRONMENT="unsupported-environment"})(re||(re={}));function js(n){return"storage/"+n}function ya(){const n="An unknown error occurred, please check the error payload for server response.";return new ie(re.UNKNOWN,n)}function wE(n){return new ie(re.OBJECT_NOT_FOUND,"Object '"+n+"' does not exist.")}function AE(n){return new ie(re.QUOTA_EXCEEDED,"Quota for bucket '"+n+"' exceeded, please view quota on https://firebase.google.com/pricing/.")}function RE(){const n="User is not authenticated, please authenticate using Firebase Authentication and try again.";return new ie(re.UNAUTHENTICATED,n)}function bE(){return new ie(re.UNAUTHORIZED_APP,"This app does not have permission to access Firebase Storage on this project.")}function SE(n){return new ie(re.UNAUTHORIZED,"User does not have permission to access '"+n+"'.")}function PE(){return new ie(re.RETRY_LIMIT_EXCEEDED,"Max retry time for operation exceeded, please try again.")}function CE(){return new ie(re.CANCELED,"User canceled the upload/download.")}function kE(n){return new ie(re.INVALID_URL,"Invalid URL '"+n+"'.")}function NE(n){return new ie(re.INVALID_DEFAULT_BUCKET,"Invalid default bucket '"+n+"'.")}function DE(){return new ie(re.NO_DEFAULT_BUCKET,"No default bucket found. Did you set the '"+yd+"' property when initializing the app?")}function VE(){return new ie(re.CANNOT_SLICE_BLOB,"Cannot slice blob for upload. Please retry the upload.")}function OE(){return new ie(re.NO_DOWNLOAD_URL,"The given file does not have any download URLs.")}function LE(n){return new ie(re.UNSUPPORTED_ENVIRONMENT,`${n} is missing. Make sure to install the required polyfills. See https://firebase.google.com/docs/web/environments-js-sdk#polyfills for more information.`)}function go(n){return new ie(re.INVALID_ARGUMENT,n)}function vd(){return new ie(re.APP_DELETED,"The Firebase app was deleted.")}function ME(n){return new ie(re.INVALID_ROOT_OPERATION,"The operation '"+n+"' cannot be performed on a root reference, create a non-root reference using child, such as .child('file.png').")}function ir(n,e){return new ie(re.INVALID_FORMAT,"String does not match format '"+n+"': "+e)}function Wn(n){throw new ie(re.INTERNAL_ERROR,"Internal error: "+n)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Le{constructor(e,t){this.bucket=e,this.path_=t}get path(){return this.path_}get isRoot(){return this.path.length===0}fullServerUrl(){const e=encodeURIComponent;return"/b/"+e(this.bucket)+"/o/"+e(this.path)}bucketOnlyServerUrl(){return"/b/"+encodeURIComponent(this.bucket)+"/o"}static makeFromBucketSpec(e,t){let r;try{r=Le.makeFromUrl(e,t)}catch{return new Le(e,"")}if(r.path==="")return r;throw NE(e)}static makeFromUrl(e,t){let r=null;const i="([A-Za-z0-9.\\-_]+)";function s(j){j.path.charAt(j.path.length-1)==="/"&&(j.path_=j.path_.slice(0,-1))}const a="(/(.*))?$",c=new RegExp("^gs://"+i+a,"i"),l={bucket:1,path:3};function d(j){j.path_=decodeURIComponent(j.path)}const p="v[A-Za-z0-9_]+",g=t.replace(/[.]/g,"\\."),E="(/([^?#]*).*)?$",R=new RegExp(`^https?://${g}/${p}/b/${i}/o${E}`,"i"),k={bucket:1,path:3},V=t===_d?"(?:storage.googleapis.com|storage.cloud.google.com)":t,C="([^?#]*)",B=new RegExp(`^https?://${V}/${i}/${C}`,"i"),q=[{regex:c,indices:l,postModify:s},{regex:R,indices:k,postModify:d},{regex:B,indices:{bucket:1,path:2},postModify:d}];for(let j=0;j<q.length;j++){const he=q[j],Z=he.regex.exec(e);if(Z){const T=Z[he.indices.bucket];let m=Z[he.indices.path];m||(m=""),r=new Le(T,m),he.postModify(r);break}}if(r==null)throw kE(e);return r}}class xE{constructor(e){this.promise_=Promise.reject(e)}getPromise(){return this.promise_}cancel(e=!1){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function UE(n,e,t){let r=1,i=null,s=null,a=!1,c=0;function l(){return c===2}let d=!1;function p(...C){d||(d=!0,e.apply(null,C))}function g(C){i=setTimeout(()=>{i=null,n(R,l())},C)}function E(){s&&clearTimeout(s)}function R(C,...B){if(d){E();return}if(C){E(),p.call(null,C,...B);return}if(l()||a){E(),p.call(null,C,...B);return}r<64&&(r*=2);let q;c===1?(c=2,q=0):q=(r+Math.random())*1e3,g(q)}let k=!1;function V(C){k||(k=!0,E(),!d&&(i!==null?(C||(c=2),clearTimeout(i),g(0)):C||(c=1)))}return g(0),s=setTimeout(()=>{a=!0,V(!0)},t),V}function FE(n){n(!1)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function BE(n){return n!==void 0}function qE(n){return typeof n=="object"&&!Array.isArray(n)}function va(n){return typeof n=="string"||n instanceof String}function zu(n){return Ea()&&n instanceof Blob}function Ea(){return typeof Blob<"u"}function Hu(n,e,t,r){if(r<e)throw go(`Invalid value for '${n}'. Expected ${e} or greater.`);if(r>t)throw go(`Invalid value for '${n}'. Expected ${t} or less.`)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function as(n,e,t){let r=e;return t==null&&(r=`https://${e}`),`${t}://${r}/v0${n}`}function Ed(n){const e=encodeURIComponent;let t="?";for(const r in n)if(n.hasOwnProperty(r)){const i=e(r)+"="+e(n[r]);t=t+i+"&"}return t=t.slice(0,-1),t}var zt;(function(n){n[n.NO_ERROR=0]="NO_ERROR",n[n.NETWORK_ERROR=1]="NETWORK_ERROR",n[n.ABORT=2]="ABORT"})(zt||(zt={}));/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function $E(n,e){const t=n>=500&&n<600,i=[408,429].indexOf(n)!==-1,s=e.indexOf(n)!==-1;return t||i||s}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jE{constructor(e,t,r,i,s,a,c,l,d,p,g,E=!0){this.url_=e,this.method_=t,this.headers_=r,this.body_=i,this.successCodes_=s,this.additionalRetryCodes_=a,this.callback_=c,this.errorCallback_=l,this.timeout_=d,this.progressCallback_=p,this.connectionFactory_=g,this.retry=E,this.pendingConnection_=null,this.backoffId_=null,this.canceled_=!1,this.appDelete_=!1,this.promise_=new Promise((R,k)=>{this.resolve_=R,this.reject_=k,this.start_()})}start_(){const e=(r,i)=>{if(i){r(!1,new ni(!1,null,!0));return}const s=this.connectionFactory_();this.pendingConnection_=s;const a=c=>{const l=c.loaded,d=c.lengthComputable?c.total:-1;this.progressCallback_!==null&&this.progressCallback_(l,d)};this.progressCallback_!==null&&s.addUploadProgressListener(a),s.send(this.url_,this.method_,this.body_,this.headers_).then(()=>{this.progressCallback_!==null&&s.removeUploadProgressListener(a),this.pendingConnection_=null;const c=s.getErrorCode()===zt.NO_ERROR,l=s.getStatus();if(!c||$E(l,this.additionalRetryCodes_)&&this.retry){const p=s.getErrorCode()===zt.ABORT;r(!1,new ni(!1,null,p));return}const d=this.successCodes_.indexOf(l)!==-1;r(!0,new ni(d,s))})},t=(r,i)=>{const s=this.resolve_,a=this.reject_,c=i.connection;if(i.wasSuccessCode)try{const l=this.callback_(c,c.getResponse());BE(l)?s(l):s()}catch(l){a(l)}else if(c!==null){const l=ya();l.serverResponse=c.getErrorText(),this.errorCallback_?a(this.errorCallback_(c,l)):a(l)}else if(i.canceled){const l=this.appDelete_?vd():CE();a(l)}else{const l=PE();a(l)}};this.canceled_?t(!1,new ni(!1,null,!0)):this.backoffId_=UE(e,t,this.timeout_)}getPromise(){return this.promise_}cancel(e){this.canceled_=!0,this.appDelete_=e||!1,this.backoffId_!==null&&FE(this.backoffId_),this.pendingConnection_!==null&&this.pendingConnection_.abort()}}class ni{constructor(e,t,r){this.wasSuccessCode=e,this.connection=t,this.canceled=!!r}}function zE(n,e){e!==null&&e.length>0&&(n.Authorization="Firebase "+e)}function HE(n,e){n["X-Firebase-Storage-Version"]="webjs/"+(e??"AppManager")}function GE(n,e){e&&(n["X-Firebase-GMPID"]=e)}function WE(n,e){e!==null&&(n["X-Firebase-AppCheck"]=e)}function KE(n,e,t,r,i,s,a=!0){const c=Ed(n.urlParams),l=n.url+c,d=Object.assign({},n.headers);return GE(d,e),zE(d,t),HE(d,s),WE(d,r),new jE(l,n.method,d,n.body,n.successCodes,n.additionalRetryCodes,n.handler,n.errorHandler,n.timeout,n.progressCallback,i,a)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function QE(){return typeof BlobBuilder<"u"?BlobBuilder:typeof WebKitBlobBuilder<"u"?WebKitBlobBuilder:void 0}function YE(...n){const e=QE();if(e!==void 0){const t=new e;for(let r=0;r<n.length;r++)t.append(n[r]);return t.getBlob()}else{if(Ea())return new Blob(n);throw new ie(re.UNSUPPORTED_ENVIRONMENT,"This browser doesn't seem to support creating Blobs")}}function XE(n,e,t){return n.webkitSlice?n.webkitSlice(e,t):n.mozSlice?n.mozSlice(e,t):n.slice?n.slice(e,t):null}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function JE(n){if(typeof atob>"u")throw LE("base-64");return atob(n)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ge={RAW:"raw",BASE64:"base64",BASE64URL:"base64url",DATA_URL:"data_url"};class zs{constructor(e,t){this.data=e,this.contentType=t||null}}function ZE(n,e){switch(n){case Ge.RAW:return new zs(Td(e));case Ge.BASE64:case Ge.BASE64URL:return new zs(Id(n,e));case Ge.DATA_URL:return new zs(tT(e),nT(e))}throw ya()}function Td(n){const e=[];for(let t=0;t<n.length;t++){let r=n.charCodeAt(t);if(r<=127)e.push(r);else if(r<=2047)e.push(192|r>>6,128|r&63);else if((r&64512)===55296)if(!(t<n.length-1&&(n.charCodeAt(t+1)&64512)===56320))e.push(239,191,189);else{const s=r,a=n.charCodeAt(++t);r=65536|(s&1023)<<10|a&1023,e.push(240|r>>18,128|r>>12&63,128|r>>6&63,128|r&63)}else(r&64512)===56320?e.push(239,191,189):e.push(224|r>>12,128|r>>6&63,128|r&63)}return new Uint8Array(e)}function eT(n){let e;try{e=decodeURIComponent(n)}catch{throw ir(Ge.DATA_URL,"Malformed data URL.")}return Td(e)}function Id(n,e){switch(n){case Ge.BASE64:{const i=e.indexOf("-")!==-1,s=e.indexOf("_")!==-1;if(i||s)throw ir(n,"Invalid character '"+(i?"-":"_")+"' found: is it base64url encoded?");break}case Ge.BASE64URL:{const i=e.indexOf("+")!==-1,s=e.indexOf("/")!==-1;if(i||s)throw ir(n,"Invalid character '"+(i?"+":"/")+"' found: is it base64 encoded?");e=e.replace(/-/g,"+").replace(/_/g,"/");break}}let t;try{t=JE(e)}catch(i){throw i.message.includes("polyfill")?i:ir(n,"Invalid character found")}const r=new Uint8Array(t.length);for(let i=0;i<t.length;i++)r[i]=t.charCodeAt(i);return r}class wd{constructor(e){this.base64=!1,this.contentType=null;const t=e.match(/^data:([^,]+)?,/);if(t===null)throw ir(Ge.DATA_URL,"Must be formatted 'data:[<mediatype>][;base64],<data>");const r=t[1]||null;r!=null&&(this.base64=rT(r,";base64"),this.contentType=this.base64?r.substring(0,r.length-7):r),this.rest=e.substring(e.indexOf(",")+1)}}function tT(n){const e=new wd(n);return e.base64?Id(Ge.BASE64,e.rest):eT(e.rest)}function nT(n){return new wd(n).contentType}function rT(n,e){return n.length>=e.length?n.substring(n.length-e.length)===e:!1}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wt{constructor(e,t){let r=0,i="";zu(e)?(this.data_=e,r=e.size,i=e.type):e instanceof ArrayBuffer?(t?this.data_=new Uint8Array(e):(this.data_=new Uint8Array(e.byteLength),this.data_.set(new Uint8Array(e))),r=this.data_.length):e instanceof Uint8Array&&(t?this.data_=e:(this.data_=new Uint8Array(e.length),this.data_.set(e)),r=e.length),this.size_=r,this.type_=i}size(){return this.size_}type(){return this.type_}slice(e,t){if(zu(this.data_)){const r=this.data_,i=XE(r,e,t);return i===null?null:new wt(i)}else{const r=new Uint8Array(this.data_.buffer,e,t-e);return new wt(r,!0)}}static getBlob(...e){if(Ea()){const t=e.map(r=>r instanceof wt?r.data_:r);return new wt(YE.apply(null,t))}else{const t=e.map(a=>va(a)?ZE(Ge.RAW,a).data:a.data_);let r=0;t.forEach(a=>{r+=a.byteLength});const i=new Uint8Array(r);let s=0;return t.forEach(a=>{for(let c=0;c<a.length;c++)i[s++]=a[c]}),new wt(i,!0)}}uploadData(){return this.data_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ad(n){let e;try{e=JSON.parse(n)}catch{return null}return qE(e)?e:null}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function iT(n){if(n.length===0)return null;const e=n.lastIndexOf("/");return e===-1?"":n.slice(0,e)}function sT(n,e){const t=e.split("/").filter(r=>r.length>0).join("/");return n.length===0?t:n+"/"+t}function Rd(n){const e=n.lastIndexOf("/",n.length-2);return e===-1?n:n.slice(e+1)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function oT(n,e){return e}class Se{constructor(e,t,r,i){this.server=e,this.local=t||e,this.writable=!!r,this.xform=i||oT}}let ri=null;function aT(n){return!va(n)||n.length<2?n:Rd(n)}function bd(){if(ri)return ri;const n=[];n.push(new Se("bucket")),n.push(new Se("generation")),n.push(new Se("metageneration")),n.push(new Se("name","fullPath",!0));function e(s,a){return aT(a)}const t=new Se("name");t.xform=e,n.push(t);function r(s,a){return a!==void 0?Number(a):a}const i=new Se("size");return i.xform=r,n.push(i),n.push(new Se("timeCreated")),n.push(new Se("updated")),n.push(new Se("md5Hash",null,!0)),n.push(new Se("cacheControl",null,!0)),n.push(new Se("contentDisposition",null,!0)),n.push(new Se("contentEncoding",null,!0)),n.push(new Se("contentLanguage",null,!0)),n.push(new Se("contentType",null,!0)),n.push(new Se("metadata","customMetadata",!0)),ri=n,ri}function cT(n,e){function t(){const r=n.bucket,i=n.fullPath,s=new Le(r,i);return e._makeStorageReference(s)}Object.defineProperty(n,"ref",{get:t})}function uT(n,e,t){const r={};r.type="file";const i=t.length;for(let s=0;s<i;s++){const a=t[s];r[a.local]=a.xform(r,e[a.server])}return cT(r,n),r}function Sd(n,e,t){const r=Ad(e);return r===null?null:uT(n,r,t)}function lT(n,e,t,r){const i=Ad(e);if(i===null||!va(i.downloadTokens))return null;const s=i.downloadTokens;if(s.length===0)return null;const a=encodeURIComponent;return s.split(",").map(d=>{const p=n.bucket,g=n.fullPath,E="/b/"+a(p)+"/o/"+a(g),R=as(E,t,r),k=Ed({alt:"media",token:d});return R+k})[0]}function hT(n,e){const t={},r=e.length;for(let i=0;i<r;i++){const s=e[i];s.writable&&(t[s.server]=n[s.local])}return JSON.stringify(t)}class Ta{constructor(e,t,r,i){this.url=e,this.method=t,this.handler=r,this.timeout=i,this.urlParams={},this.headers={},this.body=null,this.errorHandler=null,this.progressCallback=null,this.successCodes=[200],this.additionalRetryCodes=[]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Pd(n){if(!n)throw ya()}function dT(n,e){function t(r,i){const s=Sd(n,i,e);return Pd(s!==null),s}return t}function fT(n,e){function t(r,i){const s=Sd(n,i,e);return Pd(s!==null),lT(s,i,n.host,n._protocol)}return t}function Cd(n){function e(t,r){let i;return t.getStatus()===401?t.getErrorText().includes("Firebase App Check token is invalid")?i=bE():i=RE():t.getStatus()===402?i=AE(n.bucket):t.getStatus()===403?i=SE(n.path):i=r,i.status=t.getStatus(),i.serverResponse=r.serverResponse,i}return e}function kd(n){const e=Cd(n);function t(r,i){let s=e(r,i);return r.getStatus()===404&&(s=wE(n.path)),s.serverResponse=i.serverResponse,s}return t}function pT(n,e,t){const r=e.fullServerUrl(),i=as(r,n.host,n._protocol),s="GET",a=n.maxOperationRetryTime,c=new Ta(i,s,fT(n,t),a);return c.errorHandler=kd(e),c}function mT(n,e){const t=e.fullServerUrl(),r=as(t,n.host,n._protocol),i="DELETE",s=n.maxOperationRetryTime;function a(l,d){}const c=new Ta(r,i,a,s);return c.successCodes=[200,204],c.errorHandler=kd(e),c}function gT(n,e){return n&&n.contentType||e&&e.type()||"application/octet-stream"}function _T(n,e,t){const r=Object.assign({},t);return r.fullPath=n.path,r.size=e.size(),r.contentType||(r.contentType=gT(null,e)),r}function yT(n,e,t,r,i){const s=e.bucketOnlyServerUrl(),a={"X-Goog-Upload-Protocol":"multipart"};function c(){let q="";for(let j=0;j<2;j++)q=q+Math.random().toString().slice(2);return q}const l=c();a["Content-Type"]="multipart/related; boundary="+l;const d=_T(e,r,i),p=hT(d,t),g="--"+l+`\r
Content-Type: application/json; charset=utf-8\r
\r
`+p+`\r
--`+l+`\r
Content-Type: `+d.contentType+`\r
\r
`,E=`\r
--`+l+"--",R=wt.getBlob(g,r,E);if(R===null)throw VE();const k={name:d.fullPath},V=as(s,n.host,n._protocol),C="POST",B=n.maxUploadRetryTime,$=new Ta(V,C,dT(n,t),B);return $.urlParams=k,$.headers=a,$.body=R.uploadData(),$.errorHandler=Cd(e),$}class vT{constructor(){this.sent_=!1,this.xhr_=new XMLHttpRequest,this.initXhr(),this.errorCode_=zt.NO_ERROR,this.sendPromise_=new Promise(e=>{this.xhr_.addEventListener("abort",()=>{this.errorCode_=zt.ABORT,e()}),this.xhr_.addEventListener("error",()=>{this.errorCode_=zt.NETWORK_ERROR,e()}),this.xhr_.addEventListener("load",()=>{e()})})}send(e,t,r,i){if(this.sent_)throw Wn("cannot .send() more than once");if(this.sent_=!0,this.xhr_.open(t,e,!0),i!==void 0)for(const s in i)i.hasOwnProperty(s)&&this.xhr_.setRequestHeader(s,i[s].toString());return r!==void 0?this.xhr_.send(r):this.xhr_.send(),this.sendPromise_}getErrorCode(){if(!this.sent_)throw Wn("cannot .getErrorCode() before sending");return this.errorCode_}getStatus(){if(!this.sent_)throw Wn("cannot .getStatus() before sending");try{return this.xhr_.status}catch{return-1}}getResponse(){if(!this.sent_)throw Wn("cannot .getResponse() before sending");return this.xhr_.response}getErrorText(){if(!this.sent_)throw Wn("cannot .getErrorText() before sending");return this.xhr_.statusText}abort(){this.xhr_.abort()}getResponseHeader(e){return this.xhr_.getResponseHeader(e)}addUploadProgressListener(e){this.xhr_.upload!=null&&this.xhr_.upload.addEventListener("progress",e)}removeUploadProgressListener(e){this.xhr_.upload!=null&&this.xhr_.upload.removeEventListener("progress",e)}}class ET extends vT{initXhr(){this.xhr_.responseType="text"}}function Ia(){return new ET}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Kt{constructor(e,t){this._service=e,t instanceof Le?this._location=t:this._location=Le.makeFromUrl(t,e.host)}toString(){return"gs://"+this._location.bucket+"/"+this._location.path}_newRef(e,t){return new Kt(e,t)}get root(){const e=new Le(this._location.bucket,"");return this._newRef(this._service,e)}get bucket(){return this._location.bucket}get fullPath(){return this._location.path}get name(){return Rd(this._location.path)}get storage(){return this._service}get parent(){const e=iT(this._location.path);if(e===null)return null;const t=new Le(this._location.bucket,e);return new Kt(this._service,t)}_throwIfRoot(e){if(this._location.path==="")throw ME(e)}}function TT(n,e,t){n._throwIfRoot("uploadBytes");const r=yT(n.storage,n._location,bd(),new wt(e,!0),t);return n.storage.makeRequestWithTokens(r,Ia).then(i=>({metadata:i,ref:n}))}function IT(n){n._throwIfRoot("getDownloadURL");const e=pT(n.storage,n._location,bd());return n.storage.makeRequestWithTokens(e,Ia).then(t=>{if(t===null)throw OE();return t})}function wT(n){n._throwIfRoot("deleteObject");const e=mT(n.storage,n._location);return n.storage.makeRequestWithTokens(e,Ia)}function AT(n,e){const t=sT(n._location.path,e),r=new Le(n._location.bucket,t);return new Kt(n.storage,r)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function RT(n){return/^[A-Za-z]+:\/\//.test(n)}function bT(n,e){return new Kt(n,e)}function Nd(n,e){if(n instanceof wa){const t=n;if(t._bucket==null)throw DE();const r=new Kt(t,t._bucket);return e!=null?Nd(r,e):r}else return e!==void 0?AT(n,e):n}function ST(n,e){if(e&&RT(e)){if(n instanceof wa)return bT(n,e);throw go("To use ref(service, url), the first argument must be a Storage instance.")}else return Nd(n,e)}function Gu(n,e){const t=e?.[yd];return t==null?null:Le.makeFromBucketSpec(t,n)}function PT(n,e,t,r={}){n.host=`${e}:${t}`,n._protocol="http";const{mockUserToken:i}=r;i&&(n._overrideAuthToken=typeof i=="string"?i:hl(i,n.app.options.projectId))}class wa{constructor(e,t,r,i,s){this.app=e,this._authProvider=t,this._appCheckProvider=r,this._url=i,this._firebaseVersion=s,this._bucket=null,this._host=_d,this._protocol="https",this._appId=null,this._deleted=!1,this._maxOperationRetryTime=TE,this._maxUploadRetryTime=IE,this._requests=new Set,i!=null?this._bucket=Le.makeFromBucketSpec(i,this._host):this._bucket=Gu(this._host,this.app.options)}get host(){return this._host}set host(e){this._host=e,this._url!=null?this._bucket=Le.makeFromBucketSpec(this._url,e):this._bucket=Gu(e,this.app.options)}get maxUploadRetryTime(){return this._maxUploadRetryTime}set maxUploadRetryTime(e){Hu("time",0,Number.POSITIVE_INFINITY,e),this._maxUploadRetryTime=e}get maxOperationRetryTime(){return this._maxOperationRetryTime}set maxOperationRetryTime(e){Hu("time",0,Number.POSITIVE_INFINITY,e),this._maxOperationRetryTime=e}async _getAuthToken(){if(this._overrideAuthToken)return this._overrideAuthToken;const e=this._authProvider.getImmediate({optional:!0});if(e){const t=await e.getToken();if(t!==null)return t.accessToken}return null}async _getAppCheckToken(){const e=this._appCheckProvider.getImmediate({optional:!0});return e?(await e.getToken()).token:null}_delete(){return this._deleted||(this._deleted=!0,this._requests.forEach(e=>e.cancel()),this._requests.clear()),Promise.resolve()}_makeStorageReference(e){return new Kt(this,e)}_makeRequest(e,t,r,i,s=!0){if(this._deleted)return new xE(vd());{const a=KE(e,this._appId,r,i,t,this._firebaseVersion,s);return this._requests.add(a),a.getPromise().then(()=>this._requests.delete(a),()=>this._requests.delete(a)),a}}async makeRequestWithTokens(e,t){const[r,i]=await Promise.all([this._getAuthToken(),this._getAppCheckToken()]);return this._makeRequest(e,t,r,i).getPromise()}}const Wu="@firebase/storage",Ku="0.13.4";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Dd="storage";function bw(n,e,t){return n=Q(n),TT(n,e,t)}function Sw(n){return n=Q(n),IT(n)}function Pw(n){return n=Q(n),wT(n)}function Cw(n,e){return n=Q(n),ST(n,e)}function kw(n=Mi(),e){n=Q(n);const r=Dt(n,Dd).getImmediate({identifier:e}),i=cl("storage");return i&&CT(r,...i),r}function CT(n,e,t,r={}){PT(n,e,t,r)}function kT(n,{instanceIdentifier:e}){const t=n.getProvider("app").getImmediate(),r=n.getProvider("auth-internal"),i=n.getProvider("app-check-internal");return new wa(t,r,i,e,Jt)}function NT(){ze(new Fe(Dd,kT,"PUBLIC").setMultipleInstances(!0)),Me(Wu,Ku,""),Me(Wu,Ku,"esm2017")}NT();const Vd="@firebase/installations",Aa="0.6.11";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Od=1e4,Ld=`w:${Aa}`,Md="FIS_v2",DT="https://firebaseinstallations.googleapis.com/v1",VT=60*60*1e3,OT="installations",LT="Installations";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const MT={"missing-app-config-values":'Missing App configuration value: "{$valueName}"',"not-registered":"Firebase Installation is not registered.","installation-not-found":"Firebase Installation not found.","request-failed":'{$requestName} request failed with error "{$serverCode} {$serverStatus}: {$serverMessage}"',"app-offline":"Could not process request. Application offline.","delete-pending-registration":"Can't delete installation while there is a pending registration request."},Qt=new Xt(OT,LT,MT);function xd(n){return n instanceof Be&&n.code.includes("request-failed")}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ud({projectId:n}){return`${DT}/projects/${n}/installations`}function Fd(n){return{token:n.token,requestStatus:2,expiresIn:UT(n.expiresIn),creationTime:Date.now()}}async function Bd(n,e){const r=(await e.json()).error;return Qt.create("request-failed",{requestName:n,serverCode:r.code,serverMessage:r.message,serverStatus:r.status})}function qd({apiKey:n}){return new Headers({"Content-Type":"application/json",Accept:"application/json","x-goog-api-key":n})}function xT(n,{refreshToken:e}){const t=qd(n);return t.append("Authorization",FT(e)),t}async function $d(n){const e=await n();return e.status>=500&&e.status<600?n():e}function UT(n){return Number(n.replace("s","000"))}function FT(n){return`${Md} ${n}`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function BT({appConfig:n,heartbeatServiceProvider:e},{fid:t}){const r=Ud(n),i=qd(n),s=e.getImmediate({optional:!0});if(s){const d=await s.getHeartbeatsHeader();d&&i.append("x-firebase-client",d)}const a={fid:t,authVersion:Md,appId:n.appId,sdkVersion:Ld},c={method:"POST",headers:i,body:JSON.stringify(a)},l=await $d(()=>fetch(r,c));if(l.ok){const d=await l.json();return{fid:d.fid||t,registrationStatus:2,refreshToken:d.refreshToken,authToken:Fd(d.authToken)}}else throw await Bd("Create Installation",l)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function jd(n){return new Promise(e=>{setTimeout(e,n)})}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function qT(n){return btoa(String.fromCharCode(...n)).replace(/\+/g,"-").replace(/\//g,"_")}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $T=/^[cdef][\w-]{21}$/,_o="";function jT(){try{const n=new Uint8Array(17);(self.crypto||self.msCrypto).getRandomValues(n),n[0]=112+n[0]%16;const t=zT(n);return $T.test(t)?t:_o}catch{return _o}}function zT(n){return qT(n).substr(0,22)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function cs(n){return`${n.appName}!${n.appId}`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const zd=new Map;function Hd(n,e){const t=cs(n);Gd(t,e),HT(t,e)}function Gd(n,e){const t=zd.get(n);if(t)for(const r of t)r(e)}function HT(n,e){const t=GT();t&&t.postMessage({key:n,fid:e}),WT()}let $t=null;function GT(){return!$t&&"BroadcastChannel"in self&&($t=new BroadcastChannel("[Firebase] FID Change"),$t.onmessage=n=>{Gd(n.data.key,n.data.fid)}),$t}function WT(){zd.size===0&&$t&&($t.close(),$t=null)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const KT="firebase-installations-database",QT=1,Yt="firebase-installations-store";let Hs=null;function Ra(){return Hs||(Hs=rl(KT,QT,{upgrade:(n,e)=>{switch(e){case 0:n.createObjectStore(Yt)}}})),Hs}async function Di(n,e){const t=cs(n),i=(await Ra()).transaction(Yt,"readwrite"),s=i.objectStore(Yt),a=await s.get(t);return await s.put(e,t),await i.done,(!a||a.fid!==e.fid)&&Hd(n,e.fid),e}async function Wd(n){const e=cs(n),r=(await Ra()).transaction(Yt,"readwrite");await r.objectStore(Yt).delete(e),await r.done}async function us(n,e){const t=cs(n),i=(await Ra()).transaction(Yt,"readwrite"),s=i.objectStore(Yt),a=await s.get(t),c=e(a);return c===void 0?await s.delete(t):await s.put(c,t),await i.done,c&&(!a||a.fid!==c.fid)&&Hd(n,c.fid),c}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ba(n){let e;const t=await us(n.appConfig,r=>{const i=YT(r),s=XT(n,i);return e=s.registrationPromise,s.installationEntry});return t.fid===_o?{installationEntry:await e}:{installationEntry:t,registrationPromise:e}}function YT(n){const e=n||{fid:jT(),registrationStatus:0};return Kd(e)}function XT(n,e){if(e.registrationStatus===0){if(!navigator.onLine){const i=Promise.reject(Qt.create("app-offline"));return{installationEntry:e,registrationPromise:i}}const t={fid:e.fid,registrationStatus:1,registrationTime:Date.now()},r=JT(n,t);return{installationEntry:t,registrationPromise:r}}else return e.registrationStatus===1?{installationEntry:e,registrationPromise:ZT(n)}:{installationEntry:e}}async function JT(n,e){try{const t=await BT(n,e);return Di(n.appConfig,t)}catch(t){throw xd(t)&&t.customData.serverCode===409?await Wd(n.appConfig):await Di(n.appConfig,{fid:e.fid,registrationStatus:0}),t}}async function ZT(n){let e=await Qu(n.appConfig);for(;e.registrationStatus===1;)await jd(100),e=await Qu(n.appConfig);if(e.registrationStatus===0){const{installationEntry:t,registrationPromise:r}=await ba(n);return r||t}return e}function Qu(n){return us(n,e=>{if(!e)throw Qt.create("installation-not-found");return Kd(e)})}function Kd(n){return eI(n)?{fid:n.fid,registrationStatus:0}:n}function eI(n){return n.registrationStatus===1&&n.registrationTime+Od<Date.now()}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function tI({appConfig:n,heartbeatServiceProvider:e},t){const r=nI(n,t),i=xT(n,t),s=e.getImmediate({optional:!0});if(s){const d=await s.getHeartbeatsHeader();d&&i.append("x-firebase-client",d)}const a={installation:{sdkVersion:Ld,appId:n.appId}},c={method:"POST",headers:i,body:JSON.stringify(a)},l=await $d(()=>fetch(r,c));if(l.ok){const d=await l.json();return Fd(d)}else throw await Bd("Generate Auth Token",l)}function nI(n,{fid:e}){return`${Ud(n)}/${e}/authTokens:generate`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Sa(n,e=!1){let t;const r=await us(n.appConfig,s=>{if(!Qd(s))throw Qt.create("not-registered");const a=s.authToken;if(!e&&sI(a))return s;if(a.requestStatus===1)return t=rI(n,e),s;{if(!navigator.onLine)throw Qt.create("app-offline");const c=aI(s);return t=iI(n,c),c}});return t?await t:r.authToken}async function rI(n,e){let t=await Yu(n.appConfig);for(;t.authToken.requestStatus===1;)await jd(100),t=await Yu(n.appConfig);const r=t.authToken;return r.requestStatus===0?Sa(n,e):r}function Yu(n){return us(n,e=>{if(!Qd(e))throw Qt.create("not-registered");const t=e.authToken;return cI(t)?Object.assign(Object.assign({},e),{authToken:{requestStatus:0}}):e})}async function iI(n,e){try{const t=await tI(n,e),r=Object.assign(Object.assign({},e),{authToken:t});return await Di(n.appConfig,r),t}catch(t){if(xd(t)&&(t.customData.serverCode===401||t.customData.serverCode===404))await Wd(n.appConfig);else{const r=Object.assign(Object.assign({},e),{authToken:{requestStatus:0}});await Di(n.appConfig,r)}throw t}}function Qd(n){return n!==void 0&&n.registrationStatus===2}function sI(n){return n.requestStatus===2&&!oI(n)}function oI(n){const e=Date.now();return e<n.creationTime||n.creationTime+n.expiresIn<e+VT}function aI(n){const e={requestStatus:1,requestTime:Date.now()};return Object.assign(Object.assign({},n),{authToken:e})}function cI(n){return n.requestStatus===1&&n.requestTime+Od<Date.now()}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function uI(n){const e=n,{installationEntry:t,registrationPromise:r}=await ba(e);return r?r.catch(console.error):Sa(e).catch(console.error),t.fid}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function lI(n,e=!1){const t=n;return await hI(t),(await Sa(t,e)).token}async function hI(n){const{registrationPromise:e}=await ba(n);e&&await e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function dI(n){if(!n||!n.options)throw Gs("App Configuration");if(!n.name)throw Gs("App Name");const e=["projectId","apiKey","appId"];for(const t of e)if(!n.options[t])throw Gs(t);return{appName:n.name,projectId:n.options.projectId,apiKey:n.options.apiKey,appId:n.options.appId}}function Gs(n){return Qt.create("missing-app-config-values",{valueName:n})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Yd="installations",fI="installations-internal",pI=n=>{const e=n.getProvider("app").getImmediate(),t=dI(e),r=Dt(e,"heartbeat");return{app:e,appConfig:t,heartbeatServiceProvider:r,_delete:()=>Promise.resolve()}},mI=n=>{const e=n.getProvider("app").getImmediate(),t=Dt(e,Yd).getImmediate();return{getId:()=>uI(t),getToken:i=>lI(t,i)}};function gI(){ze(new Fe(Yd,pI,"PUBLIC")),ze(new Fe(fI,mI,"PRIVATE"))}gI();Me(Vd,Aa);Me(Vd,Aa,"esm2017");/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Vi="analytics",_I="firebase_id",yI="origin",vI=60*1e3,EI="https://firebase.googleapis.com/v1alpha/projects/-/apps/{app-id}/webConfig",Pa="https://www.googletagmanager.com/gtag/js";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const De=new Li("@firebase/analytics");/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const TI={"already-exists":"A Firebase Analytics instance with the appId {$id}  already exists. Only one Firebase Analytics instance can be created for each appId.","already-initialized":"initializeAnalytics() cannot be called again with different options than those it was initially called with. It can be called again with the same options to return the existing instance, or getAnalytics() can be used to get a reference to the already-initialized instance.","already-initialized-settings":"Firebase Analytics has already been initialized.settings() must be called before initializing any Analytics instanceor it will have no effect.","interop-component-reg-failed":"Firebase Analytics Interop Component failed to instantiate: {$reason}","invalid-analytics-context":"Firebase Analytics is not supported in this environment. Wrap initialization of analytics in analytics.isSupported() to prevent initialization in unsupported environments. Details: {$errorInfo}","indexeddb-unavailable":"IndexedDB unavailable or restricted in this environment. Wrap initialization of analytics in analytics.isSupported() to prevent initialization in unsupported environments. Details: {$errorInfo}","fetch-throttle":"The config fetch request timed out while in an exponential backoff state. Unix timestamp in milliseconds when fetch request throttling ends: {$throttleEndTimeMillis}.","config-fetch-failed":"Dynamic config fetch failed: [{$httpStatus}] {$responseMessage}","no-api-key":'The "apiKey" field is empty in the local Firebase config. Firebase Analytics requires this field tocontain a valid API key.',"no-app-id":'The "appId" field is empty in the local Firebase config. Firebase Analytics requires this field tocontain a valid app ID.',"no-client-id":'The "client_id" field is empty.',"invalid-gtag-resource":"Trusted Types detected an invalid gtag resource: {$gtagURL}."},xe=new Xt("analytics","Analytics",TI);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function II(n){if(!n.startsWith(Pa)){const e=xe.create("invalid-gtag-resource",{gtagURL:n});return De.warn(e.message),""}return n}function Xd(n){return Promise.all(n.map(e=>e.catch(t=>t)))}function wI(n,e){let t;return window.trustedTypes&&(t=window.trustedTypes.createPolicy(n,e)),t}function AI(n,e){const t=wI("firebase-js-sdk-policy",{createScriptURL:II}),r=document.createElement("script"),i=`${Pa}?l=${n}&id=${e}`;r.src=t?t?.createScriptURL(i):i,r.async=!0,document.head.appendChild(r)}function RI(n){let e=[];return Array.isArray(window[n])?e=window[n]:window[n]=e,e}async function bI(n,e,t,r,i,s){const a=r[i];try{if(a)await e[a];else{const l=(await Xd(t)).find(d=>d.measurementId===i);l&&await e[l.appId]}}catch(c){De.error(c)}n("config",i,s)}async function SI(n,e,t,r,i){try{let s=[];if(i&&i.send_to){let a=i.send_to;Array.isArray(a)||(a=[a]);const c=await Xd(t);for(const l of a){const d=c.find(g=>g.measurementId===l),p=d&&e[d.appId];if(p)s.push(p);else{s=[];break}}}s.length===0&&(s=Object.values(e)),await Promise.all(s),n("event",r,i||{})}catch(s){De.error(s)}}function PI(n,e,t,r){async function i(s,...a){try{if(s==="event"){const[c,l]=a;await SI(n,e,t,c,l)}else if(s==="config"){const[c,l]=a;await bI(n,e,t,r,c,l)}else if(s==="consent"){const[c,l]=a;n("consent",c,l)}else if(s==="get"){const[c,l,d]=a;n("get",c,l,d)}else if(s==="set"){const[c]=a;n("set",c)}else n(s,...a)}catch(c){De.error(c)}}return i}function CI(n,e,t,r,i){let s=function(...a){window[r].push(arguments)};return window[i]&&typeof window[i]=="function"&&(s=window[i]),window[i]=PI(s,n,e,t),{gtagCore:s,wrappedGtag:window[i]}}function kI(n){const e=window.document.getElementsByTagName("script");for(const t of Object.values(e))if(t.src&&t.src.includes(Pa)&&t.src.includes(n))return t;return null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const NI=30,DI=1e3;class VI{constructor(e={},t=DI){this.throttleMetadata=e,this.intervalMillis=t}getThrottleMetadata(e){return this.throttleMetadata[e]}setThrottleMetadata(e,t){this.throttleMetadata[e]=t}deleteThrottleMetadata(e){delete this.throttleMetadata[e]}}const Jd=new VI;function OI(n){return new Headers({Accept:"application/json","x-goog-api-key":n})}async function LI(n){var e;const{appId:t,apiKey:r}=n,i={method:"GET",headers:OI(r)},s=EI.replace("{app-id}",t),a=await fetch(s,i);if(a.status!==200&&a.status!==304){let c="";try{const l=await a.json();!((e=l.error)===null||e===void 0)&&e.message&&(c=l.error.message)}catch{}throw xe.create("config-fetch-failed",{httpStatus:a.status,responseMessage:c})}return a.json()}async function MI(n,e=Jd,t){const{appId:r,apiKey:i,measurementId:s}=n.options;if(!r)throw xe.create("no-app-id");if(!i){if(s)return{measurementId:s,appId:r};throw xe.create("no-api-key")}const a=e.getThrottleMetadata(r)||{backoffCount:0,throttleEndTimeMillis:Date.now()},c=new FI;return setTimeout(async()=>{c.abort()},vI),Zd({appId:r,apiKey:i,measurementId:s},a,c,e)}async function Zd(n,{throttleEndTimeMillis:e,backoffCount:t},r,i=Jd){var s;const{appId:a,measurementId:c}=n;try{await xI(r,e)}catch(l){if(c)return De.warn(`Timed out fetching this Firebase app's measurement ID from the server. Falling back to the measurement ID ${c} provided in the "measurementId" field in the local Firebase config. [${l?.message}]`),{appId:a,measurementId:c};throw l}try{const l=await LI(n);return i.deleteThrottleMetadata(a),l}catch(l){const d=l;if(!UI(d)){if(i.deleteThrottleMetadata(a),c)return De.warn(`Failed to fetch this Firebase app's measurement ID from the server. Falling back to the measurement ID ${c} provided in the "measurementId" field in the local Firebase config. [${d?.message}]`),{appId:a,measurementId:c};throw l}const p=Number((s=d?.customData)===null||s===void 0?void 0:s.httpStatus)===503?Nc(t,i.intervalMillis,NI):Nc(t,i.intervalMillis),g={throttleEndTimeMillis:Date.now()+p,backoffCount:t+1};return i.setThrottleMetadata(a,g),De.debug(`Calling attemptFetch again in ${p} millis`),Zd(n,g,r,i)}}function xI(n,e){return new Promise((t,r)=>{const i=Math.max(e-Date.now(),0),s=setTimeout(t,i);n.addEventListener(()=>{clearTimeout(s),r(xe.create("fetch-throttle",{throttleEndTimeMillis:e}))})})}function UI(n){if(!(n instanceof Be)||!n.customData)return!1;const e=Number(n.customData.httpStatus);return e===429||e===500||e===503||e===504}class FI{constructor(){this.listeners=[]}addEventListener(e){this.listeners.push(e)}abort(){this.listeners.forEach(e=>e())}}async function BI(n,e,t,r,i){if(i&&i.global){n("event",t,r);return}else{const s=await e,a=Object.assign(Object.assign({},r),{send_to:s});n("event",t,a)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function qI(){if(fl())try{await pl()}catch(n){return De.warn(xe.create("indexeddb-unavailable",{errorInfo:n?.toString()}).message),!1}else return De.warn(xe.create("indexeddb-unavailable",{errorInfo:"IndexedDB is not available in this environment."}).message),!1;return!0}async function $I(n,e,t,r,i,s,a){var c;const l=MI(n);l.then(R=>{t[R.measurementId]=R.appId,n.options.measurementId&&R.measurementId!==n.options.measurementId&&De.warn(`The measurement ID in the local Firebase config (${n.options.measurementId}) does not match the measurement ID fetched from the server (${R.measurementId}). To ensure analytics events are always sent to the correct Analytics property, update the measurement ID field in the local config or remove it from the local config.`)}).catch(R=>De.error(R)),e.push(l);const d=qI().then(R=>{if(R)return r.getId()}),[p,g]=await Promise.all([l,d]);kI(s)||AI(s,p.measurementId),i("js",new Date);const E=(c=a?.config)!==null&&c!==void 0?c:{};return E[yI]="firebase",E.update=!0,g!=null&&(E[_I]=g),i("config",p.measurementId,E),p.measurementId}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jI{constructor(e){this.app=e}_delete(){return delete sr[this.app.options.appId],Promise.resolve()}}let sr={},Xu=[];const Ju={};let Ws="dataLayer",zI="gtag",Zu,ef,el=!1;function HI(){const n=[];if(dl()&&n.push("This is a browser extension environment."),Xf()||n.push("Cookies are not available."),n.length>0){const e=n.map((r,i)=>`(${i+1}) ${r}`).join(" "),t=xe.create("invalid-analytics-context",{errorInfo:e});De.warn(t.message)}}function GI(n,e,t){HI();const r=n.options.appId;if(!r)throw xe.create("no-app-id");if(!n.options.apiKey)if(n.options.measurementId)De.warn(`The "apiKey" field is empty in the local Firebase config. This is needed to fetch the latest measurement ID for this Firebase app. Falling back to the measurement ID ${n.options.measurementId} provided in the "measurementId" field in the local Firebase config.`);else throw xe.create("no-api-key");if(sr[r]!=null)throw xe.create("already-exists",{id:r});if(!el){RI(Ws);const{wrappedGtag:s,gtagCore:a}=CI(sr,Xu,Ju,Ws,zI);ef=s,Zu=a,el=!0}return sr[r]=$I(n,Xu,Ju,e,Zu,Ws,t),new jI(n)}function Nw(n=Mi()){n=Q(n);const e=Dt(n,Vi);return e.isInitialized()?e.getImmediate():WI(n)}function WI(n,e={}){const t=Dt(n,Vi);if(t.isInitialized()){const i=t.getImmediate();if(or(e,t.getOptions()))return i;throw xe.create("already-initialized")}return t.initialize({options:e})}function KI(n,e,t,r){n=Q(n),BI(ef,sr[n.app.options.appId],e,t,r).catch(i=>De.error(i))}const tl="@firebase/analytics",nl="0.10.10";function QI(){ze(new Fe(Vi,(e,{options:t})=>{const r=e.getProvider("app").getImmediate(),i=e.getProvider("installations-internal").getImmediate();return GI(r,i,t)},"PUBLIC")),ze(new Fe("analytics-internal",n,"PRIVATE")),Me(tl,nl),Me(tl,nl,"esm2017");function n(e){try{const t=e.getProvider(Vi).getImmediate();return{logEvent:(r,i,s)=>KI(t,r,i,s)}}catch(t){throw xe.create("interop-component-reg-failed",{reason:t})}}}QI();export{Tw as A,Cw as B,bw as C,Sw as D,Pw as E,Rw as F,Et as G,ew as H,ZI as I,ce as T,hw as a,kw as b,Nw as c,lE as d,_w as e,tw as f,ow as g,iw as h,Yp as i,nw as j,sw as k,JI as l,lw as m,yw as n,rw as o,pw as p,dw as q,Me as r,vw as s,mw as t,gw as u,Ew as v,fw as w,ww as x,Aw as y,Iw as z};
//# sourceMappingURL=vendor-firebase-BLtHRE7a.js.map
