var Jm=Object.defineProperty;var Qm=(n,e,t)=>e in n?Jm(n,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[e]=t;var pl=(n,e,t)=>Qm(n,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function t(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(r){if(r.ep)return;r.ep=!0;const s=t(r);fetch(r.href,s)}})();function eg(n){try{let e=typeof location<"u"?location.href:void 0;return new URL(n,e).origin}catch{return null}}function gh(n){if(!n)return null;let e=n.length,t=n.indexOf("?"),i=n.indexOf("#");t!==-1&&(e=Math.min(e,t)),i!==-1&&(e=Math.min(e,i));let r=n.lastIndexOf(".",e),s=n.lastIndexOf("/",e),a=n.indexOf("://");return a!==-1&&a+2===s||r===-1||r<s?null:n.substring(r+1,e)||null}var co,Ao=(co=class{static setXRSession(e){e!==this.session&&(this.flushPending(),this.session=e)}static requestAnimationFrame(e){let{session:t,pending:i}=this,r,s=()=>{i.delete(r),e()};return r=t?t.requestAnimationFrame(s):requestAnimationFrame(s),i.set(r,e),r}static cancelAnimationFrame(e){let{pending:t,session:i}=this;t.delete(e),i?i.cancelAnimationFrame(e):cancelAnimationFrame(e)}static flushPending(){this.pending.forEach((e,t)=>{e(),this.cancelAnimationFrame(t)})}},pl(co,"pending",new Map),pl(co,"session",null),co),_h=2**30,up=class{get unloadPriorityCallback(){return this._unloadPriorityCallback}set unloadPriorityCallback(e){e.length===1?(console.warn('LRUCache: "unloadPriorityCallback" function has been changed to take two arguments.'),this._unloadPriorityCallback=(t,i)=>{let r=e(t),s=e(i);return r<s?-1:+(r>s)}):this._unloadPriorityCallback=e}constructor(){this.minSize=6e3,this.maxSize=8e3,this.minBytesSize=.3*_h,this.maxBytesSize=.4*_h,this.unloadPercent=.05,this.autoMarkUnused=!0,this.cachedBytes=0,this.itemSet=new Map,this.itemList=[],this.usedSet=new Set,this.callbacks=new Map,this.unloadingHandle=-1,this.bytesMap=new Map,this.loadedSet=new Set,this._unloadPriorityCallback=null;let e=this.itemSet;this.defaultPriorityCallback=t=>e.get(t)}isFull(){return this.itemSet.size>=this.maxSize||this.cachedBytes>=this.maxBytesSize}getMemoryUsage(e){return this.bytesMap.get(e)||0}setMemoryUsage(e,t){let{bytesMap:i,itemSet:r}=this;r.has(e)&&(this.cachedBytes-=i.get(e)||0,i.set(e,t),this.cachedBytes+=t)}add(e,t){let i=this.itemSet;if(i.has(e)||this.isFull())return!1;let r=this.usedSet,s=this.itemList,a=this.callbacks;return s.push(e),r.add(e),i.set(e,Date.now()),a.set(e,t),!0}has(e){return this.itemSet.has(e)}remove(e){let t=this.usedSet,i=this.itemSet,r=this.itemList,s=this.bytesMap,a=this.callbacks,o=this.loadedSet;if(i.has(e)){this.cachedBytes-=s.get(e)||0,s.delete(e),a.get(e)(e);let l=r.indexOf(e);return r.splice(l,1),t.delete(e),i.delete(e),a.delete(e),o.delete(e),!0}return!1}setLoaded(e,t){let{itemSet:i,loadedSet:r}=this;i.has(e)&&(t===!0?r.add(e):r.delete(e))}markUsed(e){let t=this.itemSet,i=this.usedSet;t.has(e)&&!i.has(e)&&(t.set(e,Date.now()),i.add(e))}markUnused(e){this.usedSet.delete(e)}markAllUnused(){this.usedSet.clear()}isUsed(e){return this.usedSet.has(e)}unloadUnusedContent(){let{unloadPercent:e,minSize:t,maxSize:i,itemList:r,itemSet:s,usedSet:a,loadedSet:o,callbacks:l,bytesMap:c,minBytesSize:u,maxBytesSize:h}=this,d=r.length-a.size,f=r.length-o.size,m=Math.max(Math.min(r.length-t,d),0),_=this.cachedBytes-u,g=this.unloadPriorityCallback||this.defaultPriorityCallback,p=!1,y=m>0&&d>0||f&&r.length>i;if(d&&this.cachedBytes>u||f&&this.cachedBytes>h||y){r.sort((T,M)=>{let L=a.has(T);if(L===a.has(M)){let z=o.has(T);return z===o.has(M)?-g(T,M):z?1:-1}else return L?1:-1});let x=Math.max(t*e,m*e),v=Math.ceil(Math.min(x,d,m)),w=Math.max(e*_,e*u),b=Math.min(w,_),A=0,R=0;for(;this.cachedBytes-R>h||r.length-A>i;){let T=r[A],M=c.get(T)||0;if(a.has(T)&&o.has(T)||this.cachedBytes-R-M<h&&r.length-A<=i)break;R+=M,A++}for(;R<b||A<v;){let T=r[A],M=c.get(T)||0;if(a.has(T)||this.cachedBytes-R-M<u&&A>=v)break;R+=M,A++}r.splice(0,A).forEach(T=>{this.cachedBytes-=c.get(T)||0,l.get(T)(T),c.delete(T),s.delete(T),l.delete(T),o.delete(T),a.delete(T)}),p=A<m||R<_&&A<d,p&&(p=A>0)}p&&(this.unloadingHandle=Ao.requestAnimationFrame(()=>this.scheduleUnload()))}scheduleUnload(){Ao.cancelAnimationFrame(this.unloadingHandle),this.scheduled||(this.scheduled=!0,queueMicrotask(()=>{this.scheduled=!1,this.unloadUnusedContent()}))}},tg=class extends DOMException{constructor(){super("PriorityQueue: Item removed","AbortError")}},as=class{get running(){return this.items.length!==0||this.currJobs!==0}constructor(){this.maxJobs=6,this.items=[],this.callbacks=new Map,this.currJobs=0,this.scheduled=!1,this.autoUpdate=!0,this.priorityCallback=null,this._schedulingCallback=e=>{Ao.requestAnimationFrame(e)},this._runjobs=()=>{this.scheduled=!1,this.tryRunJobs()}}sort(){let e=this.priorityCallback,t=this.items;e!==null&&t.sort(e)}has(e){return this.callbacks.has(e)}add(e,t){let i={callback:t,reject:null,resolve:null,promise:null};return i.promise=new Promise((r,s)=>{let a=this.items,o=this.callbacks;i.resolve=r,i.reject=s,a.unshift(e),o.set(e,i),this.autoUpdate&&this.scheduleJobRun()}),i.promise}remove(e){let t=this.items,i=this.callbacks,r=t.indexOf(e);if(r!==-1){let s=i.get(e);s.promise.catch(a=>{if(a.name!=="AbortError")throw a}),s.reject(new tg),t.splice(r,1),i.delete(e)}}removeByFilter(e){let{items:t}=this;for(let i=0;i<t.length;i++){let r=t[i];e(r)&&(this.remove(r),i--)}}tryRunJobs(){this.sort();let e=this.items,t=this.callbacks,i=this.maxJobs,r=0,s=()=>{this.currJobs--,this.autoUpdate&&this.scheduleJobRun()};for(;i>this.currJobs&&e.length>0&&r<i;){this.currJobs++,r++;let a=e.pop(),{callback:o,resolve:l,reject:c}=t.get(a);t.delete(a);let u;try{u=o(a)}catch(h){c(h),s();continue}u instanceof Promise?u.then(l).catch(c).finally(s):(l(u),s())}}flush(e){let{items:t,callbacks:i}=this,r=t.indexOf(e);if(!i.has(e))return;let{callback:s,resolve:a,reject:o}=i.get(e);i.delete(e),t.splice(r,1);let l;try{l=s(e)}catch(c){o(c);return}return l instanceof Promise?l.then(a).catch(o):a(l),l}scheduleJobRun(){this.scheduled||(this.scheduled=(this._schedulingCallback(this._runjobs),!0))}},ng=class{get running(){for(let e of this.originQueues.values())if(e.running)return!0;return!1}get maxJobsPerOrigin(){return this._maxJobsPerOrigin}set maxJobsPerOrigin(e){this._maxJobsPerOrigin=e,this.originQueues.forEach(t=>t.maxJobs=e)}get maxJobs(){return this.maxJobsPerOrigin}set maxJobs(e){console.warn('DownloadPriorityQueue: "maxJobs" is no longer valid and limits jobs per server origin. Use "maxJobsPerOrigin", instead.'),this.maxJobsPerOrigin=e}get priorityCallback(){return this._priorityCallback}set priorityCallback(e){this._priorityCallback=e,this.originQueues.forEach(t=>t.priorityCallback=e)}constructor(){this.originQueues=new Map,this._itemQueues=new WeakMap,this._maxJobsPerOrigin=6,this._priorityCallback=null}add(e,t,i,r=null){this.originQueues.forEach((c,u)=>{c.running||this.originQueues.delete(u)});let s=e===null?null:eg(e),a=this.originQueues.get(s);a||(a=new as,a.maxJobs=this._maxJobsPerOrigin,a.priorityCallback=this._priorityCallback,this.originQueues.set(s,a));let o=this._itemQueues.get(t);if(o&&o!==a&&o.has(t))throw Error("DownloadPriorityQueue: Item is already queued with a different url origin.");this._itemQueues.set(t,a);let l=a.add(t,i);return r!==null&&(r.aborted?this.remove(t):r.addEventListener("abort",()=>this.remove(t),{once:!0})),l}remove(e){let t=this._itemQueues.get(e);t&&(t.remove(e),this._itemQueues.delete(e))}has(e){let t=this._itemQueues.get(e);return!!(t&&t.has(e))}},xh=6378137,ig=6356752314245179e-9,va={inView:!1,error:1/0,distanceFromCamera:1/0};function Qo(n){return n===4||n===-1}function ai(n,e){return el(n)&&n.traversal.lastFrameVisited===e&&n.traversal.used}function el(n){return!!n.traversal}function ca(n){let{children:e}=n,t=e.length===0||el(e[e.length-1]),i=!n.internal.hasUnrenderableContent||Qo(n.internal.loadingState);return t&&i}function sr(n){return n.traversal.unconditionallyRefine}function Zs(n,e){if(el(n)&&(e.ensureChildrenArePreprocessed(n),n.traversal.lastFrameVisited!==e.frameCount&&(n.traversal.wasInFrustum=n.traversal.inFrustum,n.traversal.wasSetActive=n.traversal.active,n.traversal.wasSetVisible=n.traversal.visible,n.traversal.usedLastFrame=n.traversal.used,n.traversal.lastFrameVisited=e.frameCount,n.traversal.used=!1,n.traversal.inFrustum=!1,n.traversal.isLeaf=!1,n.traversal.visible=!1,n.traversal.active=!1,n.traversal.error=1/0,n.traversal.distanceFromCamera=1/0,n.traversal.allChildrenReady=!1,n.traversal.allChildrenLoaded=!1,n.traversal.kicked=!1,n.traversal.allUsedChildrenProcessed=!1,e.calculateTileViewErrorWithPlugin(n,va),n.traversal.inFrustum=va.inView,n.traversal.error=va.error,n.traversal.distanceFromCamera=va.distanceFromCamera,n.traversal.unconditionallyRefine=n.internal.hasUnrenderableContent,!n.traversal.unconditionallyRefine))){let t=n.parent;for(;t&&t.traversal.unconditionallyRefine;)t=t.parent;t&&t.geometricError<=n.geometricError&&(n.traversal.unconditionallyRefine=!0)}}function Mc(n,e,t=!1){if(Zs(n,e),t?e.markTileUsed(n):wo(n),sr(n)&&ca(n)){let i=n.children;for(let r=0,s=i.length;r<s;r++)Mc(i[r],e,t)}}function hp(n,e){if(Zs(n,e),n.traversal.usedLastFrame&&(wo(n),n.traversal.wasSetActive&&(n.traversal.active=!0),(!n.traversal.active||sr(n))&&ca(n))){let t=n.children;for(let i=0,r=t.length;i<r;i++)hp(t[i],e)}}function wo(n){n.traversal.used=!0}function rg(n,e){return!(n.traversal.error<=e.errorTarget&&!sr(n)||e.maxDepth>0&&n.internal.depth+1>=e.maxDepth||!ca(n))}function dp(n,e){let{frameCount:t}=e,{children:i}=n;for(let r=0,s=i.length;r<s;r++){let a=i[r];ai(a,t)&&(a.traversal.active&&(a.traversal.kicked=!0,a.traversal.active=!1),dp(a,e))}}function vh(n){return!sr(n)&&(!n.internal.hasContent||Qo(n.internal.loadingState))}function fp(n,e){if(Zs(n,e),!n.traversal.inFrustum)return;let t=n.parent;if(t&&t.refine==="ADD"&&n.geometricError>0&&n.traversal.error*(t.geometricError/n.geometricError)<=e.errorTarget)return;if(!rg(n,e)){wo(n);return}let i=!1,r=!1,s=n.children;for(let a=0,o=s.length;a<o;a++){let l=s[a];fp(l,e),i||(i=ai(l,e.frameCount)),r||(r=l.traversal.inFrustum)}if(n.refine==="REPLACE"&&!r&&s.length!==0){n.traversal.inFrustum=!1,e.markTileUsed(n);for(let a=0,o=s.length;a<o;a++)Mc(s[a],e,!0);return}if(wo(n),n.refine==="REPLACE"&&i&&(e.loadSiblings||e.loadAncestors))for(let a=0,o=s.length;a<o;a++)Mc(s[a],e)}function pp(n,e){let t=e.frameCount;if(!ai(n,t))return;let i=n.children,r=!1;for(let a=0,o=i.length;a<o;a++){let l=i[a];r||(r=ai(l,t))}if(!r)n.traversal.isLeaf=!0;else{for(let o=0,l=i.length;o<l;o++)pp(i[o],e);let a=!0;for(let o=0,l=i.length;o<l;o++){let c=i[o];if(ai(c,t)){let u=!sr(c),h=!c.internal.hasContent||Qo(c.internal.loadingState);u&&h||c.traversal.allChildrenLoaded||(a=!1)}}n.traversal.allChildrenLoaded=a}let s=!0;for(let a=0,o=i.length;a<o;a++){let l=i[a];ai(l,e.frameCount)&&!l.traversal.allUsedChildrenProcessed&&(s=!1)}n.traversal.allUsedChildrenProcessed=s&&ca(n)}function mp(n,e){if(!ai(n,e.frameCount))return;let t=n.children;if(n.refine==="REPLACE"&&e.loadAncestors&&!n.traversal.allChildrenLoaded&&!sr(n)&&(n.traversal.isLeaf=!0),n.traversal.isLeaf){if(!sr(n)&&(n.traversal.active=!0,ca(n)&&n.internal.hasContent&&!Qo(n.internal.loadingState)))for(let r=0,s=t.length;r<s;r++)hp(t[r],e);return}let i=t.length>0;for(let r=0,s=t.length;r<s;r++){let a=t[r];mp(a,e),ai(a,e.frameCount)&&!(a.traversal.active&&vh(a))&&!a.traversal.allChildrenReady&&(i=!1)}n.traversal.allChildrenReady=i,n.refine==="REPLACE"&&!i&&n.traversal.wasSetActive&&vh(n)&&(n.traversal.active=!0,dp(n,e))}function gp(n,e){Zs(n,e);let t=ai(n,e.frameCount);if(t&&(n.internal.hasUnrenderableContent&&(e.markTileUsed(n),e.queueTileForDownload(n)),n.internal.hasRenderableContent&&n.refine==="ADD"&&(n.traversal.active=!0),(n.traversal.active||n.traversal.kicked)&&n.internal.hasContent&&(e.markTileUsed(n),n.traversal.allUsedChildrenProcessed&&e.queueTileForDownload(n),n.internal.loadingState!==4&&(n.traversal.active=!1)),e.loadAncestors&&n.internal.hasContent&&(e.markTileUsed(n),e.queueTileForDownload(n)),n.internal.virtualChildCount>0&&n.internal.hasContent&&e.markTileUsed(n),n.traversal.visible=n.internal.hasRenderableContent&&n.traversal.active&&n.traversal.inFrustum&&n.internal.loadingState===4,e.stats.used++,n.traversal.inFrustum&&e.stats.inFrustum++),t||el(n)&&n.traversal.usedLastFrame){let i=!1,r=!1;t?(i=n.traversal.active,r=e.displayActiveTiles&&n.traversal.active||n.traversal.visible):Zs(n,e),n.internal.hasRenderableContent&&n.internal.loadingState===4?(i&&e.stats.active++,r&&e.stats.visible++,n.traversal.wasSetActive!==i&&e.invokeOnePlugin(a=>a.setTileActive&&a.setTileActive(n,i)),n.traversal.wasSetVisible!==r&&e.invokeOnePlugin(a=>a.setTileVisible&&a.setTileVisible(n,r))):n.internal.hasRenderableContent||(r=n.traversal.isLeaf,n.traversal.wasSetVisible!==r&&e.invokeOnePlugin(a=>a.setEmptyTileVisible&&a.setEmptyTileVisible(n,r))),n.traversal.visible=r,n.traversal.active=i;let s=n.children;for(let a=0,o=s.length;a<o;a++){let l=s[a];gp(l,e)}}}function sg(n,e){fp(n,e),pp(n,e),mp(n,e),gp(n,e)}function ag(n){let e=null;return()=>{e===null&&(e=Ao.requestAnimationFrame(()=>{e=null,n()}))}}function _p(n,e=null,t=null){let i=[];for(i.push(n),i.push(null),i.push(0);i.length>0;){let r=i.pop(),s=i.pop(),a=i.pop();if(e&&e(a,s,r)){t&&t(a,s,r);return}let o=a.children;if(o)for(let l=o.length-1;l>=0;l--)i.push(o[l]),i.push(a),i.push(r+1);t&&t(a,s,r)}}var yh=Symbol("PLUGIN_REGISTERED"),gi={inView:!0,error:0,distance:1/0},og=(n,e)=>{let t=n.priority||0,i=e.priority||0;return t===i?!n.traversal||!e.traversal?0:n.traversal.used===e.traversal.used?n.traversal.error===e.traversal.error?n.traversal.distanceFromCamera===e.traversal.distanceFromCamera?n.internal.depthFromRenderedParent===e.internal.depthFromRenderedParent?0:n.internal.depthFromRenderedParent>e.internal.depthFromRenderedParent?-1:1:n.traversal.distanceFromCamera>e.traversal.distanceFromCamera?-1:1:n.traversal.error>e.traversal.error?1:-1:n.traversal.used?1:-1:t>i?1:-1},lg=(n,e)=>n.traversal.used===e.traversal.used?n.traversal.inFrustum===e.traversal.inFrustum?n.internal.hasUnrenderableContent===e.internal.hasUnrenderableContent?n.traversal.distanceFromCamera===e.traversal.distanceFromCamera?n.internal.depthFromRenderedParent===e.internal.depthFromRenderedParent?0:n.internal.depthFromRenderedParent>e.internal.depthFromRenderedParent?-1:1:n.traversal.distanceFromCamera>e.traversal.distanceFromCamera?-1:1:n.internal.hasUnrenderableContent?1:-1:n.traversal.inFrustum?1:-1:n.traversal.used?1:-1,cg=(n,e)=>n.traversal.lastFrameVisited===e.traversal.lastFrameVisited?n.internal.depthFromRenderedParent===e.internal.depthFromRenderedParent?n.internal.loadingState===e.internal.loadingState?n.internal.hasUnrenderableContent===e.internal.hasUnrenderableContent?n.traversal.error===e.traversal.error?0:n.traversal.error>e.traversal.error?-1:1:n.internal.hasUnrenderableContent?-1:1:n.internal.loadingState>e.internal.loadingState?-1:1:n.internal.depthFromRenderedParent>e.internal.depthFromRenderedParent?1:-1:n.traversal.lastFrameVisited>e.traversal.lastFrameVisited?-1:1,tl=(n,e)=>{let t=n.priority??1/0,i=e.priority??1/0;if(t!==i)return t>i?1:-1;if(!n.internal||!e.internal)return 0;let r=n.internal.renderer,s=e.internal.renderer,a=!r.loadAncestors,o=!s.loadAncestors;return a&&o?lg(n,e):og(n,e)},xp=new up;xp.unloadPriorityCallback=cg;var Ro=new ng;Ro.maxJobsPerOrigin=25,Ro.priorityCallback=tl;var Tc=new as;Tc.maxJobs=5,Tc.priorityCallback=tl;var Sc=new as;Sc.maxJobs=25,Sc.priorityCallback=(n,e)=>{let t=n.parent,i=e.parent;return t===i?0:t?i?tl(t,i):-1:1};var ug=class{get root(){let n=this.rootTileset;return n?n.root:null}get loadProgress(){let{stats:n,isLoading:e}=this,t=n.queued+n.downloading+n.parsing,i=n.inCacheSinceLoad+ +!!e;return i===0?1:1-t/i}get downloadQueue(){return this._downloadQueue}set downloadQueue(n){if(n instanceof as){console.warn('TilesRenderer: "downloadQueue" is no longer valid as a PriorityQueue. Use a DownloadPriorityQueue, instead.');return}this._downloadQueue=n}constructor(n=null){this.rootLoadingState=0,this.rootTileset=null,this.rootURL=n,this.fetchOptions={},this.plugins=[],this.queuedTiles=[],this.cachedSinceLoadComplete=new Set,this.isLoading=!1,this.processedTiles=new WeakSet,this.visibleTiles=new Set,this.activeTiles=new Set,this.usedSet=new Set,this.loadingTiles=new Set,this.lruCache=xp,this.downloadQueue=Ro,this.parseQueue=Tc,this.processNodeQueue=Sc,this.stats={inCacheSinceLoad:0,inCache:0,queued:0,downloading:0,parsing:0,loaded:0,failed:0,inFrustum:0,used:0,active:0,visible:0,tilesProcessed:0},this.frameCount=0,this._dispatchNeedsUpdateEvent=ag(()=>{this.dispatchEvent({type:"needs-update"})}),this.errorTarget=16,this.errorFalloff=0,this.errorFalloffDensity=2e-4,this.displayActiveTiles=!1,this.maxDepth=1/0,this.loadSiblings=!0,this.loadAncestors=!0,this.maxTilesProcessed=250}registerPlugin(n){if(n[yh]===!0)throw Error("TilesRendererBase: A plugin can only be registered to a single tileset");let e=this.plugins,t=n.priority||0,i=e.length;for(let r=0;r<e.length;r++)if((e[r].priority||0)>t){i=r;break}e.splice(i,0,n),n[yh]=!0,n.init&&n.init(this)}unregisterPlugin(n){let e=this.plugins;if(typeof n=="string"&&(n=this.getPluginByName(n)),e.includes(n)){let t=e.indexOf(n);return e.splice(t,1),n.dispose&&n.dispose(),!0}return!1}getPluginByName(n){return this.plugins.find(e=>e.name===n)||null}invokeOnePlugin(n){let e=[...this.plugins,this];for(let t=0;t<e.length;t++){let i=n(e[t]);if(i)return i}return null}invokeAllPlugins(n){let e=[...this.plugins,this],t=[];for(let i=0;i<e.length;i++){let r=n(e[i]);r&&t.push(r)}return t.length===0?null:Promise.all(t)}traverse(n,e,t=!0){this.root&&_p(this.root,(i,...r)=>(t&&this.ensureChildrenArePreprocessed(i,!0),n?n(i,...r):!1),e)}getAttributions(n=[]){return this.invokeAllPlugins(e=>e!==this&&e.getAttributions&&e.getAttributions(n)),n}update(){let{lruCache:n,usedSet:e,stats:t,root:i,downloadQueue:r,parseQueue:s,processNodeQueue:a}=this;if(this.rootLoadingState===0&&(this.rootLoadingState=2,this.invokeOnePlugin(c=>c.loadRootTileset&&c.loadRootTileset()).then(c=>{let u=this.rootURL;u!==null&&this.invokeAllPlugins(h=>u=h.preprocessURL?h.preprocessURL(u,null):u),this.rootLoadingState=4,this.rootTileset=c,this.dispatchEvent({type:"needs-update"}),this.dispatchEvent({type:"load-tileset",tileset:c,url:u}),this.dispatchEvent({type:"load-root-tileset",tileset:c,url:u})}).catch(c=>{this.rootLoadingState=-1,console.error(c),this.rootTileset=null,this.dispatchEvent({type:"load-error",tile:null,error:c,url:this.rootURL})})),!i)return;let o=null;if(this.invokeAllPlugins(c=>{if(c.doTilesNeedUpdate){let u=c.doTilesNeedUpdate();o=o===null?u:!!(o||u)}}),o===!1){this.dispatchEvent({type:"update-before"}),this.dispatchEvent({type:"update-after"});return}this.dispatchEvent({type:"update-before"}),t.inFrustum=0,t.used=0,t.active=0,t.visible=0,t.tilesProcessed=0,this.frameCount++,e.forEach(c=>n.markUnused(c)),e.clear(),this.prepareForTraversal(),sg(i,this),this.removeUnusedPendingTiles();let l=this.queuedTiles;l.sort(n.unloadPriorityCallback);for(let c=0,u=l.length;c<u&&!n.isFull();c++)this.requestTileContents(l[c]);l.length=0,n.scheduleUnload(),(r.running||s.running||a.running)===!1&&this.isLoading===!0&&(this.cachedSinceLoadComplete.clear(),t.inCacheSinceLoad=0,this.dispatchEvent({type:"tiles-load-end"}),this.isLoading=!1),this.dispatchEvent({type:"update-after"})}resetFailedTiles(){this.rootLoadingState===-1&&(this.rootLoadingState=0);let n=this.stats;n.failed!==0&&(this.traverse(e=>{e.internal.loadingState===-1&&(e.internal.loadingState=0)},null,!1),n.failed=0)}calculateTileViewErrorWithPlugin(n,e){this.calculateTileViewError(n,e);let{errorFalloff:t,errorFalloffDensity:i}=this;if(t>0&&Number.isFinite(e.distanceFromCamera)){let o=e.distanceFromCamera*i;e.error-=t*(1-Math.exp(-o*o))}let r=null,s=0,a=1/0;this.invokeAllPlugins(o=>{o!==this&&o.calculateTileViewError&&(gi.inView=!0,gi.error=0,gi.distance=1/0,o.calculateTileViewError(n,gi)&&(r===null&&(r=!0),r&&(r=gi.inView),gi.inView&&(a=Math.min(a,gi.distance),s=Math.max(s,gi.error))))}),e.inView&&r!==!1?(e.error=Math.max(e.error,s),e.distanceFromCamera=Math.min(e.distanceFromCamera,a)):r?(e.inView=!0,e.error=s,e.distanceFromCamera=a):e.inView=!1}dispose(){[...this.plugins].forEach(t=>{this.unregisterPlugin(t)});let n=this.lruCache,e=[];this.traverse(t=>(e.push(t),!1),null,!1);for(let t=0,i=e.length;t<i;t++)n.remove(e[t]);this.stats={queued:0,parsing:0,downloading:0,failed:0,inFrustum:0,traversed:0,used:0,active:0,visible:0},this.frameCount=0,this.loadingTiles.clear()}calculateBytesUsed(n,e){return 0}dispatchEvent(n){}addEventListener(n,e){}removeEventListener(n,e){}parseTile(n,e,t){return null}prepareForTraversal(){}disposeTile(n){n.traversal.visible&&(n.internal.hasRenderableContent?this.invokeOnePlugin(t=>t.setTileVisible&&t.setTileVisible(n,!1)):this.invokeOnePlugin(t=>t.setEmptyTileVisible&&t.setEmptyTileVisible(n,!1)),n.traversal.visible=!1),n.traversal.active&&n.internal.hasRenderableContent&&this.invokeOnePlugin(t=>t.setTileActive&&t.setTileActive(n,!1)),n.traversal.active=!1;let{scene:e}=n.engineData;e&&this.dispatchEvent({type:"dispose-model",scene:e,tile:n})}preprocessNode(n,e,t=null){var i;if(this.processedTiles.add(n),this.stats.tilesProcessed++,n.content&&(!("uri"in n.content)&&"url"in n.content&&(n.content.uri=n.content.url,delete n.content.url),n.content.boundingVolume&&!("box"in n.content.boundingVolume||"sphere"in n.content.boundingVolume||"region"in n.content.boundingVolume)&&delete n.content.boundingVolume),n.parent=t,n.children=n.children||[],n.internal={hasContent:!1,hasRenderableContent:!1,hasUnrenderableContent:!1,loadingState:0,basePath:e,depth:-1,depthFromRenderedParent:-1,isVirtual:!1,virtualChildCount:0,renderer:this,...n.internal},(i=n.content)==null?void 0:i.uri){let r=gh(n.content.uri),s=!!(r&&/json$/.test(r));n.internal.hasContent=!0,n.internal.hasUnrenderableContent=s,n.internal.hasRenderableContent=!s}else n.internal.hasContent=!1,n.internal.hasUnrenderableContent=!1,n.internal.hasRenderableContent=!1;t?(n.internal.depth=t.internal.depth+1,n.internal.depthFromRenderedParent=t.internal.depthFromRenderedParent+ +!!n.internal.hasRenderableContent):(n.internal.depth=0,n.internal.depthFromRenderedParent=+!!n.internal.hasRenderableContent),n.traversal={distanceFromCamera:1/0,error:1/0,inFrustum:!1,wasInFrustum:!1,isLeaf:!1,used:!1,usedLastFrame:!1,visible:!1,wasSetVisible:!1,active:!1,wasSetActive:!1,allChildrenReady:!1,allChildrenLoaded:!1,kicked:!1,allUsedChildrenProcessed:!1,lastFrameVisited:-1},t===null?n.refine=n.refine||"REPLACE":n.refine=n.refine||t.refine,n.engineData={scene:null,metadata:null,boundingVolume:null},Object.defineProperty(n,"cached",{get(){return console.warn('TilesRenderer: "tile.cached" field has been renamed to "tile.engineData".'),this.engineData},enumerable:!1,configurable:!0}),this.invokeAllPlugins(r=>{r!==this&&r.preprocessNode&&r.preprocessNode(n,e,t)})}setTileActive(n,e){e?this.activeTiles.add(n):this.activeTiles.delete(n)}setTileVisible(n,e){e?this.visibleTiles.add(n):this.visibleTiles.delete(n),this.dispatchEvent({type:"tile-visibility-change",scene:n.engineData.scene,tile:n,visible:e})}calculateTileViewError(n,e){}removeUnusedPendingTiles(){let{lruCache:n,loadingTiles:e}=this,t=[];for(let i of e)!n.isUsed(i)&&i.internal.loadingState===1&&t.push(i);for(let i=0;i<t.length;i++)n.remove(t[i])}queueTileForDownload(n){n.internal.loadingState!==0||this.lruCache.isFull()||this.queuedTiles.push(n)}markTileUsed(n){this.usedSet.add(n),this.lruCache.markUsed(n)}fetchData(n,e){return fetch(n,e)}ensureChildrenArePreprocessed(n,e=this.stats.tilesProcessed<this.maxTilesProcessed){let t=n.children;if(t.length===0||t[t.length-1].traversal)return;let i=r=>{for(let s=0,a=r.length;s<a;s++){let o=r[s];o&&!o.traversal&&this.preprocessNode(o,n.internal.basePath,n)}};e?(this.processNodeQueue.remove(n),i(t)):this.processNodeQueue.has(n)||this.processNodeQueue.add(n,r=>{i(r.children),this._dispatchNeedsUpdateEvent()})}getBytesUsed(n){let e=0;return this.invokeAllPlugins(t=>{t.calculateBytesUsed&&(e+=t.calculateBytesUsed(n,n.engineData.scene)||0)}),e}recalculateBytesUsed(n=null){let{lruCache:e,processedTiles:t}=this;n===null?e.itemSet.forEach(i=>{t.has(i)&&e.setMemoryUsage(i,this.getBytesUsed(i))}):e.setMemoryUsage(n,this.getBytesUsed(n))}preprocessTileset(n,e,t=null){let[i,r]=n.asset.version.split(".").map(a=>parseInt(a));console.assert(i<=1,"TilesRenderer: asset.version is expected to be a 1.x or a compatible version."),i===1&&r>0&&console.warn("TilesRenderer: tiles versions at 1.1 or higher have limited support. Some new extensions and features may not be supported.");let s=e.replace(/\/[^/]*$/,"");s=new URL(s,window.location.href).toString(),this.preprocessNode(n.root,s,t)}loadRootTileset(){let n=this.rootURL;return this.invokeAllPlugins(e=>n=e.preprocessURL?e.preprocessURL(n,null):n),this.invokeOnePlugin(e=>e.fetchData&&e.fetchData(n,this.fetchOptions)).then(e=>{if(!(e instanceof Response))return e;if(e.ok)return e.json();throw Error(`TilesRenderer: Failed to load tileset "${n}" with status ${e.status} : ${e.statusText}`)}).then(e=>(this.preprocessTileset(e,n),e))}requestTileContents(n){if(n.internal.loadingState!==0)return;let e=!1,t=null,i=new URL(n.content.uri,n.internal.basePath+"/").toString();this.invokeAllPlugins(d=>i=d.preprocessURL?d.preprocessURL(i,n):i);let r=this.stats,s=this.lruCache,a=this.downloadQueue,o=this.parseQueue,l=this.loadingTiles,c=gh(i),u=new AbortController,h=u.signal;if(s.add(n,d=>{u.abort(),e?d.children.length=0:this.invokeAllPlugins(f=>{f.disposeTile&&f.disposeTile(d)}),r.inCache--,this.cachedSinceLoadComplete.has(n)&&(this.cachedSinceLoadComplete.delete(n),r.inCacheSinceLoad--),d.internal.loadingState===1?r.queued--:d.internal.loadingState===2?r.downloading--:d.internal.loadingState===3?r.parsing--:d.internal.loadingState===4&&r.loaded--,d.internal.loadingState=0,o.remove(d),a.remove(d),l.delete(d)}))return this.isLoading||(this.isLoading=!0,this.dispatchEvent({type:"tiles-load-start"})),s.setMemoryUsage(n,this.getBytesUsed(n)),this.cachedSinceLoadComplete.add(n),r.inCacheSinceLoad++,r.inCache++,r.queued++,n.internal.loadingState=1,l.add(n),a.add(i,n,d=>{if(h.aborted)return Promise.resolve();n.internal.loadingState=2,r.downloading++,r.queued--;let f=this.invokeOnePlugin(m=>m.fetchData&&m.fetchData(i,{...this.fetchOptions,signal:h}));return this.dispatchEvent({type:"tile-download-start",tile:n,url:i,get uri(){return console.warn('tile-download-start event: "uri" has been renamed to "url".'),this.url}}),f}).then(d=>{if(!h.aborted){if(!(d instanceof Response))return d;if(d.ok)return c==="json"?d.json():d.arrayBuffer();throw Error(`Failed to load model with error code ${d.status}`)}}).then(d=>{if(!h.aborted)return r.downloading--,r.parsing++,n.internal.loadingState=3,o.add(n,f=>h.aborted?Promise.resolve():c==="json"&&d.root?(this.preprocessTileset(d,i,n),n.children.push(d.root),t=d,e=!0,Promise.resolve()):this.invokeOnePlugin(m=>m.parseTile&&m.parseTile(d,f,c,i,h)))}).then(()=>{if(h.aborted)return;r.parsing--,r.loaded++,n.internal.loadingState=4,l.delete(n),s.setLoaded(n,!0);let d=this.getBytesUsed(n);if(s.getMemoryUsage(n)===0&&d>0&&s.isFull()){s.remove(n);return}s.setMemoryUsage(n,d),this.dispatchEvent({type:"needs-update"}),e&&this.dispatchEvent({type:"load-tileset",tileset:t,url:i}),n.engineData.scene&&this.dispatchEvent({type:"load-model",scene:n.engineData.scene,tile:n,url:i})}).catch(d=>{h.aborted||(d.name==="AbortError"?s.remove(n):(o.remove(n),a.remove(n),n.internal.loadingState===1?r.queued--:n.internal.loadingState===2?r.downloading--:n.internal.loadingState===3?r.parsing--:n.internal.loadingState===4&&r.loaded--,r.failed++,console.error(`TilesRenderer : Failed to load tile at url "${n.content.uri}".`),console.error(d),n.internal.loadingState=-1,l.delete(n),s.setLoaded(n,!0),this.dispatchEvent({type:"load-error",tile:n,error:d,url:i})))})}};function Xr(n){if(n===null||n.byteLength<4)return"";let e;if(e=n instanceof DataView?n:new DataView(n),String.fromCharCode(e.getUint8(0))==="{")return null;let t="";for(let i=0;i<4;i++)t+=String.fromCharCode(e.getUint8(i));return t}var hg=new TextDecoder;function vp(n){return hg.decode(n)}function Eu(n){return n.replace(/[\\/][^\\/]+$/,"")+"/"}var ua=class{constructor(){this.fetchOptions={},this.workingPath=""}loadAsync(n){return fetch(n,this.fetchOptions).then(e=>{if(!e.ok)throw Error(`Failed to load file "${n}" with status ${e.status} : ${e.statusText}`);return e.arrayBuffer()}).then(e=>(this.workingPath===""&&(this.workingPath=Eu(n)),this.parse(e)))}resolveExternalURL(n){return new URL(n,this.workingPath).href}parse(n){throw Error("LoaderBase: Parse not implemented.")}};function yp(n,e,t,i,r,s){let a;switch(i){case"SCALAR":a=1;break;case"VEC2":a=2;break;case"VEC3":a=3;break;case"VEC4":a=4;break;default:throw Error(`FeatureTable : Feature type not provided for "${s}".`)}let o,l=t*a;switch(r){case"BYTE":o=new Int8Array(n,e,l);break;case"UNSIGNED_BYTE":o=new Uint8Array(n,e,l);break;case"SHORT":o=new Int16Array(n,e,l);break;case"UNSIGNED_SHORT":o=new Uint16Array(n,e,l);break;case"INT":o=new Int32Array(n,e,l);break;case"UNSIGNED_INT":o=new Uint32Array(n,e,l);break;case"FLOAT":o=new Float32Array(n,e,l);break;case"DOUBLE":o=new Float64Array(n,e,l);break;default:throw Error(`FeatureTable : Feature component type not provided for "${s}".`)}return o}var nl=class{constructor(n,e,t,i){this.buffer=n,this.binOffset=e+t,this.binLength=i;let r=null;if(t!==0){let s=new Uint8Array(n,e,t);r=JSON.parse(vp(s))}else r={};this.header=r}getKeys(){return Object.keys(this.header).filter(n=>n!=="extensions")}getData(n,e,t=null,i=null){let r=this.header;if(!(n in r))return null;let s=r[n];if(!(s instanceof Object)||Array.isArray(s))return s;{let{buffer:a,binOffset:o,binLength:l}=this,c=s.byteOffset||0,u=s.type||i,h=s.componentType||t;if("type"in s&&i&&s.type!==i)throw Error("FeatureTable: Specified type does not match expected type.");let d=o+c,f=yp(a,d,e,u,h,n);if(d+f.byteLength>o+l)throw Error("FeatureTable: Feature data read outside binary body length.");return f}}getBuffer(n,e){let{buffer:t,binOffset:i}=this;return t.slice(i+n,i+n+e)}},dg=class{constructor(n){this.batchTable=n;let e=n.header.extensions["3DTILES_batch_table_hierarchy"];this.classes=e.classes;for(let i of this.classes){let r=i.instances;for(let s in r)i.instances[s]=this._parseProperty(r[s],i.length,s)}if(this.instancesLength=e.instancesLength,this.classIds=this._parseProperty(e.classIds,this.instancesLength,"classIds"),e.parentCounts?this.parentCounts=this._parseProperty(e.parentCounts,this.instancesLength,"parentCounts"):this.parentCounts=Array(this.instancesLength).fill(1),e.parentIds){let i=this.parentCounts.reduce((r,s)=>r+s,0);this.parentIds=this._parseProperty(e.parentIds,i,"parentIds")}else this.parentIds=null;this.instancesIds=[];let t={};for(let i of this.classIds)t[i]=t[i]??0,this.instancesIds.push(t[i]),t[i]++}_parseProperty(n,e,t){if(Array.isArray(n))return n;{let{buffer:i,binOffset:r}=this.batchTable,s=n.byteOffset,a=n.componentType||"UNSIGNED_SHORT";return yp(i,r+s,e,"SCALAR",a,t)}}getDataFromId(n,e={}){let t=this.parentCounts[n];if(this.parentIds&&t>0){let o=0;for(let l=0;l<n;l++)o+=this.parentCounts[l];for(let l=0;l<t;l++){let c=this.parentIds[o+l];c!==n&&this.getDataFromId(c,e)}}let i=this.classIds[n],r=this.classes[i].instances,s=this.classes[i].name,a=this.instancesIds[n];for(let o in r)e[s]=e[s]||{},e[s][o]=r[o][a];return e}},bu=class extends nl{constructor(n,e,t,i,r){super(n,t,i,r),this.count=e,this.extensions={};let s=this.header.extensions;s&&s["3DTILES_batch_table_hierarchy"]&&(this.extensions["3DTILES_batch_table_hierarchy"]=new dg(this))}getDataFromId(n,e={}){if(n<0||n>=this.count)throw Error(`BatchTable: id value "${n}" out of bounds for "${this.count}" features number.`);for(let t of this.getKeys())e[t]=super.getData(t,this.count)[n];for(let t in this.extensions){let i=this.extensions[t];i.getDataFromId instanceof Function&&(e[t]=e[t]||{},i.getDataFromId(n,e[t]))}return e}getPropertyArray(n){return super.getData(n,this.count)}},fg=class extends ua{parse(n){let e=new DataView(n),t=Xr(e);console.assert(t==="b3dm");let i=e.getUint32(4,!0);console.assert(i===1);let r=e.getUint32(8,!0);console.assert(r===n.byteLength);let s=e.getUint32(12,!0),a=e.getUint32(16,!0),o=e.getUint32(20,!0),l=e.getUint32(24,!0),c=new nl(n.slice(28,28+s+a),0,s,a),u=28+s+a,h=new bu(n.slice(u,u+o+l),c.getData("BATCH_LENGTH"),0,o,l),d=u+o+l;return{version:i,featureTable:c,batchTable:h,glbBytes:new Uint8Array(n,d,r-d)}}},pg=class extends ua{parse(n){let e=new DataView(n),t=Xr(e);console.assert(t==="i3dm");let i=e.getUint32(4,!0);console.assert(i===1);let r=e.getUint32(8,!0);console.assert(r===n.byteLength);let s=e.getUint32(12,!0),a=e.getUint32(16,!0),o=e.getUint32(20,!0),l=e.getUint32(24,!0),c=e.getUint32(28,!0),u=new nl(n.slice(32,32+s+a),0,s,a),h=32+s+a,d=new bu(n.slice(h,h+o+l),u.getData("INSTANCES_LENGTH"),0,o,l),f=h+o+l,m=new Uint8Array(n,f,r-f),_=null,g=null,p=null;if(c)_=m,g=Promise.resolve();else{let y=this.resolveExternalURL(vp(m));p=Eu(y),g=fetch(y,this.fetchOptions).then(x=>{if(!x.ok)throw Error(`I3DMLoaderBase : Failed to load file "${y}" with status ${x.status} : ${x.statusText}`);return x.arrayBuffer()}).then(x=>{_=new Uint8Array(x)})}return g.then(()=>({version:i,featureTable:u,batchTable:d,glbBytes:_,gltfWorkingPath:p}))}},mg=class extends ua{parse(n){let e=new DataView(n),t=Xr(e);console.assert(t==="pnts");let i=e.getUint32(4,!0);console.assert(i===1);let r=e.getUint32(8,!0);console.assert(r===n.byteLength);let s=e.getUint32(12,!0),a=e.getUint32(16,!0),o=e.getUint32(20,!0),l=e.getUint32(24,!0),c=new nl(n.slice(28,28+s+a),0,s,a),u=28+s+a,h=new bu(n.slice(u,u+o+l),c.getData("BATCH_LENGTH")||c.getData("POINTS_LENGTH"),0,o,l);return Promise.resolve({version:i,featureTable:c,batchTable:h})}},gg=class extends ua{parse(n){let e=new DataView(n),t=Xr(e);console.assert(t==="cmpt",'CMPTLoader: The magic bytes equal "cmpt".');let i=e.getUint32(4,!0);console.assert(i===1,'CMPTLoader: The version listed in the header is "1".');let r=e.getUint32(8,!0);console.assert(r===n.byteLength,"CMPTLoader: The contents buffer length listed in the header matches the file.");let s=e.getUint32(12,!0),a=[],o=16;for(let l=0;l<s;l++){let c=new DataView(n,o,12),u=Xr(c),h=c.getUint32(4,!0),d=c.getUint32(8,!0),f=new Uint8Array(n,o,d);a.push({type:u,buffer:f,version:h}),o+=d}return{version:i,tiles:a}}};/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Au="170",_g=0,Mh=1,xg=2,Mp=1,vg=2,ti=3,di=0,$t=1,bn=2,Fi=0,nr=1,Ec=2,Th=3,Sh=4,Tp=5,Ji=100,yg=101,Mg=102,Tg=103,Sg=104,Sp=200,Ep=201,Eg=202,bg=203,bc=204,Ac=205,Ag=206,wg=207,Rg=208,Cg=209,Pg=210,Lg=211,Ig=212,Dg=213,Ug=214,wc=0,Rc=1,Cc=2,qr=3,Pc=4,Lc=5,Ic=6,Dc=7,bp=0,Ng=1,Fg=2,Oi=0,Og=1,Bg=2,kg=3,zg=4,Vg=5,Hg=6,Gg=7,Eh="attached",Wg="detached",Ap=300,jr=301,Yr=302,Co=303,Uc=304,il=306,$r=1e3,Ii=1001,Po=1002,Kt=1003,wp=1004,Ns=1005,Yt=1006,uo=1007,oi=1008,Xg=1008,In=1009,Rp=1010,Cp=1011,Js=1012,wu=1013,ar=1014,wn=1015,ha=1016,Ru=1017,Cu=1018,Kr=1020,Pp=35902,Lp=1021,Ip=1022,_n=1023,Dp=1024,Up=1025,Vr=1026,Zr=1027,Pu=1028,Lu=1029,rl=1030,Iu=1031,Du=1033,ho=33776,fo=33777,po=33778,mo=33779,Nc=35840,Fc=35841,Oc=35842,Bc=35843,kc=36196,zc=37492,Vc=37496,Hc=37808,Gc=37809,Wc=37810,Xc=37811,qc=37812,jc=37813,Yc=37814,$c=37815,Kc=37816,Zc=37817,Jc=37818,Qc=37819,eu=37820,tu=37821,go=36492,nu=36494,iu=36495,Np=36283,ru=36284,su=36285,au=36286,Qs=2300,ea=2301,ml=2302,bh=2400,Ah=2401,wh=2402,qg=2500,jg=0,Fp=1,ou=2,Yg=3200,$g=3201,Op=0,Kg=1,Pi="",gt="srgb",zt="srgb-linear",sl="linear",ot="srgb",dr=7680,Rh=519,Zg=512,Jg=513,Qg=514,Bp=515,e_=516,t_=517,n_=518,i_=519,lu=35044,Ch="300 es",li=2e3,Lo=2001;class kn{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;const i=this._listeners;return i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;const r=this._listeners[e];if(r!==void 0){const s=r.indexOf(t);s!==-1&&r.splice(s,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const i=this._listeners[e.type];if(i!==void 0){e.target=this;const r=i.slice(0);for(let s=0,a=r.length;s<a;s++)r[s].call(this,e);e.target=null}}}const It=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Ph=1234567;const Ws=Math.PI/180,Jr=180/Math.PI;function Pn(){const n=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(It[n&255]+It[n>>8&255]+It[n>>16&255]+It[n>>24&255]+"-"+It[e&255]+It[e>>8&255]+"-"+It[e>>16&15|64]+It[e>>24&255]+"-"+It[t&63|128]+It[t>>8&255]+"-"+It[t>>16&255]+It[t>>24&255]+It[i&255]+It[i>>8&255]+It[i>>16&255]+It[i>>24&255]).toLowerCase()}function Pt(n,e,t){return Math.max(e,Math.min(t,n))}function Uu(n,e){return(n%e+e)%e}function r_(n,e,t,i,r){return i+(n-e)*(r-i)/(t-e)}function s_(n,e,t){return n!==e?(t-n)/(e-n):0}function Xs(n,e,t){return(1-t)*n+t*e}function a_(n,e,t,i){return Xs(n,e,1-Math.exp(-t*i))}function o_(n,e=1){return e-Math.abs(Uu(n,e*2)-e)}function l_(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e),n*n*(3-2*n))}function c_(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e),n*n*n*(n*(n*6-15)+10))}function u_(n,e){return n+Math.floor(Math.random()*(e-n+1))}function h_(n,e){return n+Math.random()*(e-n)}function d_(n){return n*(.5-Math.random())}function f_(n){n!==void 0&&(Ph=n);let e=Ph+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function p_(n){return n*Ws}function m_(n){return n*Jr}function g_(n){return(n&n-1)===0&&n!==0}function __(n){return Math.pow(2,Math.ceil(Math.log(n)/Math.LN2))}function x_(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function v_(n,e,t,i,r){const s=Math.cos,a=Math.sin,o=s(t/2),l=a(t/2),c=s((e+i)/2),u=a((e+i)/2),h=s((e-i)/2),d=a((e-i)/2),f=s((i-e)/2),m=a((i-e)/2);switch(r){case"XYX":n.set(o*u,l*h,l*d,o*c);break;case"YZY":n.set(l*d,o*u,l*h,o*c);break;case"ZXZ":n.set(l*h,l*d,o*u,o*c);break;case"XZX":n.set(o*u,l*m,l*f,o*c);break;case"YXY":n.set(l*f,o*u,l*m,o*c);break;case"ZYZ":n.set(l*m,l*f,o*u,o*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+r)}}function An(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function rt(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}const ae={DEG2RAD:Ws,RAD2DEG:Jr,generateUUID:Pn,clamp:Pt,euclideanModulo:Uu,mapLinear:r_,inverseLerp:s_,lerp:Xs,damp:a_,pingpong:o_,smoothstep:l_,smootherstep:c_,randInt:u_,randFloat:h_,randFloatSpread:d_,seededRandom:f_,degToRad:p_,radToDeg:m_,isPowerOfTwo:g_,ceilPowerOfTwo:__,floorPowerOfTwo:x_,setQuaternionFromProperEuler:v_,normalize:rt,denormalize:An};class fe{constructor(e=0,t=0){fe.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,i=this.y,r=e.elements;return this.x=r[0]*t+r[3]*i+r[6],this.y=r[1]*t+r[4]*i+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(t,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(Pt(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const i=Math.cos(t),r=Math.sin(t),s=this.x-e.x,a=this.y-e.y;return this.x=s*i-a*r+e.x,this.y=s*r+a*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Ne{constructor(e,t,i,r,s,a,o,l,c){Ne.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,r,s,a,o,l,c)}set(e,t,i,r,s,a,o,l,c){const u=this.elements;return u[0]=e,u[1]=r,u[2]=o,u[3]=t,u[4]=s,u[5]=l,u[6]=i,u[7]=a,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,r=t.elements,s=this.elements,a=i[0],o=i[3],l=i[6],c=i[1],u=i[4],h=i[7],d=i[2],f=i[5],m=i[8],_=r[0],g=r[3],p=r[6],y=r[1],x=r[4],v=r[7],w=r[2],b=r[5],A=r[8];return s[0]=a*_+o*y+l*w,s[3]=a*g+o*x+l*b,s[6]=a*p+o*v+l*A,s[1]=c*_+u*y+h*w,s[4]=c*g+u*x+h*b,s[7]=c*p+u*v+h*A,s[2]=d*_+f*y+m*w,s[5]=d*g+f*x+m*b,s[8]=d*p+f*v+m*A,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8];return t*a*u-t*o*c-i*s*u+i*o*l+r*s*c-r*a*l}invert(){const e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8],h=u*a-o*c,d=o*l-u*s,f=c*s-a*l,m=t*h+i*d+r*f;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/m;return e[0]=h*_,e[1]=(r*c-u*i)*_,e[2]=(o*i-r*a)*_,e[3]=d*_,e[4]=(u*t-r*l)*_,e[5]=(r*s-o*t)*_,e[6]=f*_,e[7]=(i*l-c*t)*_,e[8]=(a*t-i*s)*_,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,r,s,a,o){const l=Math.cos(s),c=Math.sin(s);return this.set(i*l,i*c,-i*(l*a+c*o)+a+e,-r*c,r*l,-r*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(gl.makeScale(e,t)),this}rotate(e){return this.premultiply(gl.makeRotation(-e)),this}translate(e,t){return this.premultiply(gl.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,i=e.elements;for(let r=0;r<9;r++)if(t[r]!==i[r])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const gl=new Ne;function kp(n){for(let e=n.length-1;e>=0;--e)if(n[e]>=65535)return!0;return!1}function ta(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function y_(){const n=ta("canvas");return n.style.display="block",n}const Lh={};function Fs(n){n in Lh||(Lh[n]=!0,console.warn(n))}function M_(n,e,t){return new Promise(function(i,r){function s(){switch(n.clientWaitSync(e,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:r();break;case n.TIMEOUT_EXPIRED:setTimeout(s,t);break;default:i()}}setTimeout(s,t)})}function T_(n){const e=n.elements;e[2]=.5*e[2]+.5*e[3],e[6]=.5*e[6]+.5*e[7],e[10]=.5*e[10]+.5*e[11],e[14]=.5*e[14]+.5*e[15]}function S_(n){const e=n.elements;e[11]===-1?(e[10]=-e[10]-1,e[14]=-e[14]):(e[10]=-e[10],e[14]=-e[14]+1)}const Xe={enabled:!0,workingColorSpace:zt,spaces:{},convert:function(n,e,t){return this.enabled===!1||e===t||!e||!t||(this.spaces[e].transfer===ot&&(n.r=hi(n.r),n.g=hi(n.g),n.b=hi(n.b)),this.spaces[e].primaries!==this.spaces[t].primaries&&(n.applyMatrix3(this.spaces[e].toXYZ),n.applyMatrix3(this.spaces[t].fromXYZ)),this.spaces[t].transfer===ot&&(n.r=Hr(n.r),n.g=Hr(n.g),n.b=Hr(n.b))),n},fromWorkingColorSpace:function(n,e){return this.convert(n,this.workingColorSpace,e)},toWorkingColorSpace:function(n,e){return this.convert(n,e,this.workingColorSpace)},getPrimaries:function(n){return this.spaces[n].primaries},getTransfer:function(n){return n===Pi?sl:this.spaces[n].transfer},getLuminanceCoefficients:function(n,e=this.workingColorSpace){return n.fromArray(this.spaces[e].luminanceCoefficients)},define:function(n){Object.assign(this.spaces,n)},_getMatrix:function(n,e,t){return n.copy(this.spaces[e].toXYZ).multiply(this.spaces[t].fromXYZ)},_getDrawingBufferColorSpace:function(n){return this.spaces[n].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(n=this.workingColorSpace){return this.spaces[n].workingColorSpaceConfig.unpackColorSpace}};function hi(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function Hr(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}const Ih=[.64,.33,.3,.6,.15,.06],Dh=[.2126,.7152,.0722],Uh=[.3127,.329],Nh=new Ne().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Fh=new Ne().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);Xe.define({[zt]:{primaries:Ih,whitePoint:Uh,transfer:sl,toXYZ:Nh,fromXYZ:Fh,luminanceCoefficients:Dh,workingColorSpaceConfig:{unpackColorSpace:gt},outputColorSpaceConfig:{drawingBufferColorSpace:gt}},[gt]:{primaries:Ih,whitePoint:Uh,transfer:ot,toXYZ:Nh,fromXYZ:Fh,luminanceCoefficients:Dh,outputColorSpaceConfig:{drawingBufferColorSpace:gt}}});let fr;class E_{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{fr===void 0&&(fr=ta("canvas")),fr.width=e.width,fr.height=e.height;const i=fr.getContext("2d");e instanceof ImageData?i.putImageData(e,0,0):i.drawImage(e,0,0,e.width,e.height),t=fr}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=ta("canvas");t.width=e.width,t.height=e.height;const i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const r=i.getImageData(0,0,e.width,e.height),s=r.data;for(let a=0;a<s.length;a++)s[a]=hi(s[a]/255)*255;return i.putImageData(r,0,0),t}else if(e.data){const t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(hi(t[i]/255)*255):t[i]=hi(t[i]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let b_=0;class zp{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:b_++}),this.uuid=Pn(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let a=0,o=r.length;a<o;a++)r[a].isDataTexture?s.push(_l(r[a].image)):s.push(_l(r[a]))}else s=_l(r);i.url=s}return t||(e.images[this.uuid]=i),i}}function _l(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?E_.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let A_=0;class St extends kn{constructor(e=St.DEFAULT_IMAGE,t=St.DEFAULT_MAPPING,i=Ii,r=Ii,s=Yt,a=oi,o=_n,l=In,c=St.DEFAULT_ANISOTROPY,u=Pi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:A_++}),this.uuid=Pn(),this.name="",this.source=new zp(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=r,this.magFilter=s,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new fe(0,0),this.repeat=new fe(1,1),this.center=new fe(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ne,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Ap)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case $r:e.x=e.x-Math.floor(e.x);break;case Ii:e.x=e.x<0?0:1;break;case Po:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case $r:e.y=e.y-Math.floor(e.y);break;case Ii:e.y=e.y<0?0:1;break;case Po:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}St.DEFAULT_IMAGE=null;St.DEFAULT_MAPPING=Ap;St.DEFAULT_ANISOTROPY=1;class qe{constructor(e=0,t=0,i=0,r=1){qe.prototype.isVector4=!0,this.x=e,this.y=t,this.z=i,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,r){return this.x=e,this.y=t,this.z=i,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,i=this.y,r=this.z,s=this.w,a=e.elements;return this.x=a[0]*t+a[4]*i+a[8]*r+a[12]*s,this.y=a[1]*t+a[5]*i+a[9]*r+a[13]*s,this.z=a[2]*t+a[6]*i+a[10]*r+a[14]*s,this.w=a[3]*t+a[7]*i+a[11]*r+a[15]*s,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,r,s;const l=e.elements,c=l[0],u=l[4],h=l[8],d=l[1],f=l[5],m=l[9],_=l[2],g=l[6],p=l[10];if(Math.abs(u-d)<.01&&Math.abs(h-_)<.01&&Math.abs(m-g)<.01){if(Math.abs(u+d)<.1&&Math.abs(h+_)<.1&&Math.abs(m+g)<.1&&Math.abs(c+f+p-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const x=(c+1)/2,v=(f+1)/2,w=(p+1)/2,b=(u+d)/4,A=(h+_)/4,R=(m+g)/4;return x>v&&x>w?x<.01?(i=0,r=.707106781,s=.707106781):(i=Math.sqrt(x),r=b/i,s=A/i):v>w?v<.01?(i=.707106781,r=0,s=.707106781):(r=Math.sqrt(v),i=b/r,s=R/r):w<.01?(i=.707106781,r=.707106781,s=0):(s=Math.sqrt(w),i=A/s,r=R/s),this.set(i,r,s,t),this}let y=Math.sqrt((g-m)*(g-m)+(h-_)*(h-_)+(d-u)*(d-u));return Math.abs(y)<.001&&(y=1),this.x=(g-m)/y,this.y=(h-_)/y,this.z=(d-u)/y,this.w=Math.acos((c+f+p-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(t,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class w_ extends kn{constructor(e=1,t=1,i={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new qe(0,0,e,t),this.scissorTest=!1,this.viewport=new qe(0,0,e,t);const r={width:e,height:t,depth:1};i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Yt,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},i);const s=new St(r,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace);s.flipY=!1,s.generateMipmaps=i.generateMipmaps,s.internalFormat=i.internalFormat,this.textures=[];const a=i.count;for(let o=0;o<a;o++)this.textures[o]=s.clone(),this.textures[o].isRenderTargetTexture=!0;this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.depthTexture=i.depthTexture,this.samples=i.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let r=0,s=this.textures.length;r<s;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=i;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let i=0,r=e.textures.length;i<r;i++)this.textures[i]=e.textures[i].clone(),this.textures[i].isRenderTargetTexture=!0;const t=Object.assign({},e.texture.image);return this.texture.source=new zp(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class fi extends w_{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}}class Vp extends St{constructor(e=null,t=1,i=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:r},this.magFilter=Kt,this.minFilter=Kt,this.wrapR=Ii,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class R_ extends St{constructor(e=null,t=1,i=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:r},this.magFilter=Kt,this.minFilter=Kt,this.wrapR=Ii,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Zt{constructor(e=0,t=0,i=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=r}static slerpFlat(e,t,i,r,s,a,o){let l=i[r+0],c=i[r+1],u=i[r+2],h=i[r+3];const d=s[a+0],f=s[a+1],m=s[a+2],_=s[a+3];if(o===0){e[t+0]=l,e[t+1]=c,e[t+2]=u,e[t+3]=h;return}if(o===1){e[t+0]=d,e[t+1]=f,e[t+2]=m,e[t+3]=_;return}if(h!==_||l!==d||c!==f||u!==m){let g=1-o;const p=l*d+c*f+u*m+h*_,y=p>=0?1:-1,x=1-p*p;if(x>Number.EPSILON){const w=Math.sqrt(x),b=Math.atan2(w,p*y);g=Math.sin(g*b)/w,o=Math.sin(o*b)/w}const v=o*y;if(l=l*g+d*v,c=c*g+f*v,u=u*g+m*v,h=h*g+_*v,g===1-o){const w=1/Math.sqrt(l*l+c*c+u*u+h*h);l*=w,c*=w,u*=w,h*=w}}e[t]=l,e[t+1]=c,e[t+2]=u,e[t+3]=h}static multiplyQuaternionsFlat(e,t,i,r,s,a){const o=i[r],l=i[r+1],c=i[r+2],u=i[r+3],h=s[a],d=s[a+1],f=s[a+2],m=s[a+3];return e[t]=o*m+u*h+l*f-c*d,e[t+1]=l*m+u*d+c*h-o*f,e[t+2]=c*m+u*f+o*d-l*h,e[t+3]=u*m-o*h-l*d-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,r){return this._x=e,this._y=t,this._z=i,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const i=e._x,r=e._y,s=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(i/2),u=o(r/2),h=o(s/2),d=l(i/2),f=l(r/2),m=l(s/2);switch(a){case"XYZ":this._x=d*u*h+c*f*m,this._y=c*f*h-d*u*m,this._z=c*u*m+d*f*h,this._w=c*u*h-d*f*m;break;case"YXZ":this._x=d*u*h+c*f*m,this._y=c*f*h-d*u*m,this._z=c*u*m-d*f*h,this._w=c*u*h+d*f*m;break;case"ZXY":this._x=d*u*h-c*f*m,this._y=c*f*h+d*u*m,this._z=c*u*m+d*f*h,this._w=c*u*h-d*f*m;break;case"ZYX":this._x=d*u*h-c*f*m,this._y=c*f*h+d*u*m,this._z=c*u*m-d*f*h,this._w=c*u*h+d*f*m;break;case"YZX":this._x=d*u*h+c*f*m,this._y=c*f*h+d*u*m,this._z=c*u*m-d*f*h,this._w=c*u*h-d*f*m;break;case"XZY":this._x=d*u*h-c*f*m,this._y=c*f*h-d*u*m,this._z=c*u*m+d*f*h,this._w=c*u*h+d*f*m;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const i=t/2,r=Math.sin(i);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,i=t[0],r=t[4],s=t[8],a=t[1],o=t[5],l=t[9],c=t[2],u=t[6],h=t[10],d=i+o+h;if(d>0){const f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(u-l)*f,this._y=(s-c)*f,this._z=(a-r)*f}else if(i>o&&i>h){const f=2*Math.sqrt(1+i-o-h);this._w=(u-l)/f,this._x=.25*f,this._y=(r+a)/f,this._z=(s+c)/f}else if(o>h){const f=2*Math.sqrt(1+o-i-h);this._w=(s-c)/f,this._x=(r+a)/f,this._y=.25*f,this._z=(l+u)/f}else{const f=2*Math.sqrt(1+h-i-o);this._w=(a-r)/f,this._x=(s+c)/f,this._y=(l+u)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<Number.EPSILON?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Pt(this.dot(e),-1,1)))}rotateTowards(e,t){const i=this.angleTo(e);if(i===0)return this;const r=Math.min(1,t/i);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const i=e._x,r=e._y,s=e._z,a=e._w,o=t._x,l=t._y,c=t._z,u=t._w;return this._x=i*u+a*o+r*c-s*l,this._y=r*u+a*l+s*o-i*c,this._z=s*u+a*c+i*l-r*o,this._w=a*u-i*o-r*l-s*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const i=this._x,r=this._y,s=this._z,a=this._w;let o=a*e._w+i*e._x+r*e._y+s*e._z;if(o<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,o=-o):this.copy(e),o>=1)return this._w=a,this._x=i,this._y=r,this._z=s,this;const l=1-o*o;if(l<=Number.EPSILON){const f=1-t;return this._w=f*a+t*this._w,this._x=f*i+t*this._x,this._y=f*r+t*this._y,this._z=f*s+t*this._z,this.normalize(),this}const c=Math.sqrt(l),u=Math.atan2(c,o),h=Math.sin((1-t)*u)/c,d=Math.sin(t*u)/c;return this._w=a*h+this._w*d,this._x=i*h+this._x*d,this._y=r*h+this._y*d,this._z=s*h+this._z*d,this._onChangeCallback(),this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),r=Math.sqrt(1-i),s=Math.sqrt(i);return this.set(r*Math.sin(e),r*Math.cos(e),s*Math.sin(t),s*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class P{constructor(e=0,t=0,i=0){P.prototype.isVector3=!0,this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Oh.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Oh.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6]*r,this.y=s[1]*t+s[4]*i+s[7]*r,this.z=s[2]*t+s[5]*i+s[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,i=this.y,r=this.z,s=e.elements,a=1/(s[3]*t+s[7]*i+s[11]*r+s[15]);return this.x=(s[0]*t+s[4]*i+s[8]*r+s[12])*a,this.y=(s[1]*t+s[5]*i+s[9]*r+s[13])*a,this.z=(s[2]*t+s[6]*i+s[10]*r+s[14])*a,this}applyQuaternion(e){const t=this.x,i=this.y,r=this.z,s=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*r-o*i),u=2*(o*t-s*r),h=2*(s*i-a*t);return this.x=t+l*c+a*h-o*u,this.y=i+l*u+o*c-s*h,this.z=r+l*h+s*u-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[4]*i+s[8]*r,this.y=s[1]*t+s[5]*i+s[9]*r,this.z=s[2]*t+s[6]*i+s[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(t,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const i=e.x,r=e.y,s=e.z,a=t.x,o=t.y,l=t.z;return this.x=r*l-s*o,this.y=s*a-i*l,this.z=i*o-r*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return xl.copy(this).projectOnVector(e),this.sub(xl)}reflect(e){return this.sub(xl.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(Pt(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y,r=this.z-e.z;return t*t+i*i+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){const r=Math.sin(t)*e;return this.x=r*Math.sin(i),this.y=Math.cos(t)*e,this.z=r*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const xl=new P,Oh=new Zt;class cn{constructor(e=new P(1/0,1/0,1/0),t=new P(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(Mn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(Mn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const i=Mn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const s=i.getAttribute("position");if(t===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=s.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,Mn):Mn.fromBufferAttribute(s,a),Mn.applyMatrix4(e.matrixWorld),this.expandByPoint(Mn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),ya.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),ya.copy(i.boundingBox)),ya.applyMatrix4(e.matrixWorld),this.union(ya)}const r=e.children;for(let s=0,a=r.length;s<a;s++)this.expandByObject(r[s],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Mn),Mn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(ps),Ma.subVectors(this.max,ps),pr.subVectors(e.a,ps),mr.subVectors(e.b,ps),gr.subVectors(e.c,ps),_i.subVectors(mr,pr),xi.subVectors(gr,mr),zi.subVectors(pr,gr);let t=[0,-_i.z,_i.y,0,-xi.z,xi.y,0,-zi.z,zi.y,_i.z,0,-_i.x,xi.z,0,-xi.x,zi.z,0,-zi.x,-_i.y,_i.x,0,-xi.y,xi.x,0,-zi.y,zi.x,0];return!vl(t,pr,mr,gr,Ma)||(t=[1,0,0,0,1,0,0,0,1],!vl(t,pr,mr,gr,Ma))?!1:(Ta.crossVectors(_i,xi),t=[Ta.x,Ta.y,Ta.z],vl(t,pr,mr,gr,Ma))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Mn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Mn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(qn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),qn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),qn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),qn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),qn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),qn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),qn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),qn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(qn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const qn=[new P,new P,new P,new P,new P,new P,new P,new P],Mn=new P,ya=new cn,pr=new P,mr=new P,gr=new P,_i=new P,xi=new P,zi=new P,ps=new P,Ma=new P,Ta=new P,Vi=new P;function vl(n,e,t,i,r){for(let s=0,a=n.length-3;s<=a;s+=3){Vi.fromArray(n,s);const o=r.x*Math.abs(Vi.x)+r.y*Math.abs(Vi.y)+r.z*Math.abs(Vi.z),l=e.dot(Vi),c=t.dot(Vi),u=i.dot(Vi);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>o)return!1}return!0}const C_=new cn,ms=new P,yl=new P;class un{constructor(e=new P,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const i=this.center;t!==void 0?i.copy(t):C_.setFromPoints(e).getCenter(i);let r=0;for(let s=0,a=e.length;s<a;s++)r=Math.max(r,i.distanceToSquared(e[s]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;ms.subVectors(e,this.center);const t=ms.lengthSq();if(t>this.radius*this.radius){const i=Math.sqrt(t),r=(i-this.radius)*.5;this.center.addScaledVector(ms,r/i),this.radius+=r}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(yl.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(ms.copy(e.center).add(yl)),this.expandByPoint(ms.copy(e.center).sub(yl))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const jn=new P,Ml=new P,Sa=new P,vi=new P,Tl=new P,Ea=new P,Sl=new P;class Bi{constructor(e=new P,t=new P(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,jn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=jn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(jn.copy(this.origin).addScaledVector(this.direction,t),jn.distanceToSquared(e))}distanceSqToSegment(e,t,i,r){Ml.copy(e).add(t).multiplyScalar(.5),Sa.copy(t).sub(e).normalize(),vi.copy(this.origin).sub(Ml);const s=e.distanceTo(t)*.5,a=-this.direction.dot(Sa),o=vi.dot(this.direction),l=-vi.dot(Sa),c=vi.lengthSq(),u=Math.abs(1-a*a);let h,d,f,m;if(u>0)if(h=a*l-o,d=a*o-l,m=s*u,h>=0)if(d>=-m)if(d<=m){const _=1/u;h*=_,d*=_,f=h*(h+a*d+2*o)+d*(a*h+d+2*l)+c}else d=s,h=Math.max(0,-(a*d+o)),f=-h*h+d*(d+2*l)+c;else d=-s,h=Math.max(0,-(a*d+o)),f=-h*h+d*(d+2*l)+c;else d<=-m?(h=Math.max(0,-(-a*s+o)),d=h>0?-s:Math.min(Math.max(-s,-l),s),f=-h*h+d*(d+2*l)+c):d<=m?(h=0,d=Math.min(Math.max(-s,-l),s),f=d*(d+2*l)+c):(h=Math.max(0,-(a*s+o)),d=h>0?s:Math.min(Math.max(-s,-l),s),f=-h*h+d*(d+2*l)+c);else d=a>0?-s:s,h=Math.max(0,-(a*d+o)),f=-h*h+d*(d+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,h),r&&r.copy(Ml).addScaledVector(Sa,d),f}intersectSphere(e,t){jn.subVectors(e.center,this.origin);const i=jn.dot(this.direction),r=jn.dot(jn)-i*i,s=e.radius*e.radius;if(r>s)return null;const a=Math.sqrt(s-r),o=i-a,l=i+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){const i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,r,s,a,o,l;const c=1/this.direction.x,u=1/this.direction.y,h=1/this.direction.z,d=this.origin;return c>=0?(i=(e.min.x-d.x)*c,r=(e.max.x-d.x)*c):(i=(e.max.x-d.x)*c,r=(e.min.x-d.x)*c),u>=0?(s=(e.min.y-d.y)*u,a=(e.max.y-d.y)*u):(s=(e.max.y-d.y)*u,a=(e.min.y-d.y)*u),i>a||s>r||((s>i||isNaN(i))&&(i=s),(a<r||isNaN(r))&&(r=a),h>=0?(o=(e.min.z-d.z)*h,l=(e.max.z-d.z)*h):(o=(e.max.z-d.z)*h,l=(e.min.z-d.z)*h),i>l||o>r)||((o>i||i!==i)&&(i=o),(l<r||r!==r)&&(r=l),r<0)?null:this.at(i>=0?i:r,t)}intersectsBox(e){return this.intersectBox(e,jn)!==null}intersectTriangle(e,t,i,r,s){Tl.subVectors(t,e),Ea.subVectors(i,e),Sl.crossVectors(Tl,Ea);let a=this.direction.dot(Sl),o;if(a>0){if(r)return null;o=1}else if(a<0)o=-1,a=-a;else return null;vi.subVectors(this.origin,e);const l=o*this.direction.dot(Ea.crossVectors(vi,Ea));if(l<0)return null;const c=o*this.direction.dot(Tl.cross(vi));if(c<0||l+c>a)return null;const u=-o*vi.dot(Sl);return u<0?null:this.at(u/a,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class ge{constructor(e,t,i,r,s,a,o,l,c,u,h,d,f,m,_,g){ge.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,r,s,a,o,l,c,u,h,d,f,m,_,g)}set(e,t,i,r,s,a,o,l,c,u,h,d,f,m,_,g){const p=this.elements;return p[0]=e,p[4]=t,p[8]=i,p[12]=r,p[1]=s,p[5]=a,p[9]=o,p[13]=l,p[2]=c,p[6]=u,p[10]=h,p[14]=d,p[3]=f,p[7]=m,p[11]=_,p[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new ge().fromArray(this.elements)}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){const t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,i=e.elements,r=1/_r.setFromMatrixColumn(e,0).length(),s=1/_r.setFromMatrixColumn(e,1).length(),a=1/_r.setFromMatrixColumn(e,2).length();return t[0]=i[0]*r,t[1]=i[1]*r,t[2]=i[2]*r,t[3]=0,t[4]=i[4]*s,t[5]=i[5]*s,t[6]=i[6]*s,t[7]=0,t[8]=i[8]*a,t[9]=i[9]*a,t[10]=i[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,i=e.x,r=e.y,s=e.z,a=Math.cos(i),o=Math.sin(i),l=Math.cos(r),c=Math.sin(r),u=Math.cos(s),h=Math.sin(s);if(e.order==="XYZ"){const d=a*u,f=a*h,m=o*u,_=o*h;t[0]=l*u,t[4]=-l*h,t[8]=c,t[1]=f+m*c,t[5]=d-_*c,t[9]=-o*l,t[2]=_-d*c,t[6]=m+f*c,t[10]=a*l}else if(e.order==="YXZ"){const d=l*u,f=l*h,m=c*u,_=c*h;t[0]=d+_*o,t[4]=m*o-f,t[8]=a*c,t[1]=a*h,t[5]=a*u,t[9]=-o,t[2]=f*o-m,t[6]=_+d*o,t[10]=a*l}else if(e.order==="ZXY"){const d=l*u,f=l*h,m=c*u,_=c*h;t[0]=d-_*o,t[4]=-a*h,t[8]=m+f*o,t[1]=f+m*o,t[5]=a*u,t[9]=_-d*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){const d=a*u,f=a*h,m=o*u,_=o*h;t[0]=l*u,t[4]=m*c-f,t[8]=d*c+_,t[1]=l*h,t[5]=_*c+d,t[9]=f*c-m,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){const d=a*l,f=a*c,m=o*l,_=o*c;t[0]=l*u,t[4]=_-d*h,t[8]=m*h+f,t[1]=h,t[5]=a*u,t[9]=-o*u,t[2]=-c*u,t[6]=f*h+m,t[10]=d-_*h}else if(e.order==="XZY"){const d=a*l,f=a*c,m=o*l,_=o*c;t[0]=l*u,t[4]=-h,t[8]=c*u,t[1]=d*h+_,t[5]=a*u,t[9]=f*h-m,t[2]=m*h-f,t[6]=o*u,t[10]=_*h+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(P_,e,L_)}lookAt(e,t,i){const r=this.elements;return rn.subVectors(e,t),rn.lengthSq()===0&&(rn.z=1),rn.normalize(),yi.crossVectors(i,rn),yi.lengthSq()===0&&(Math.abs(i.z)===1?rn.x+=1e-4:rn.z+=1e-4,rn.normalize(),yi.crossVectors(i,rn)),yi.normalize(),ba.crossVectors(rn,yi),r[0]=yi.x,r[4]=ba.x,r[8]=rn.x,r[1]=yi.y,r[5]=ba.y,r[9]=rn.y,r[2]=yi.z,r[6]=ba.z,r[10]=rn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,r=t.elements,s=this.elements,a=i[0],o=i[4],l=i[8],c=i[12],u=i[1],h=i[5],d=i[9],f=i[13],m=i[2],_=i[6],g=i[10],p=i[14],y=i[3],x=i[7],v=i[11],w=i[15],b=r[0],A=r[4],R=r[8],T=r[12],M=r[1],L=r[5],z=r[9],I=r[13],q=r[2],k=r[6],O=r[10],j=r[14],B=r[3],G=r[7],Q=r[11],ie=r[15];return s[0]=a*b+o*M+l*q+c*B,s[4]=a*A+o*L+l*k+c*G,s[8]=a*R+o*z+l*O+c*Q,s[12]=a*T+o*I+l*j+c*ie,s[1]=u*b+h*M+d*q+f*B,s[5]=u*A+h*L+d*k+f*G,s[9]=u*R+h*z+d*O+f*Q,s[13]=u*T+h*I+d*j+f*ie,s[2]=m*b+_*M+g*q+p*B,s[6]=m*A+_*L+g*k+p*G,s[10]=m*R+_*z+g*O+p*Q,s[14]=m*T+_*I+g*j+p*ie,s[3]=y*b+x*M+v*q+w*B,s[7]=y*A+x*L+v*k+w*G,s[11]=y*R+x*z+v*O+w*Q,s[15]=y*T+x*I+v*j+w*ie,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[4],r=e[8],s=e[12],a=e[1],o=e[5],l=e[9],c=e[13],u=e[2],h=e[6],d=e[10],f=e[14],m=e[3],_=e[7],g=e[11],p=e[15];return m*(+s*l*h-r*c*h-s*o*d+i*c*d+r*o*f-i*l*f)+_*(+t*l*f-t*c*d+s*a*d-r*a*f+r*c*u-s*l*u)+g*(+t*c*h-t*o*f-s*a*h+i*a*f+s*o*u-i*c*u)+p*(-r*o*u-t*l*h+t*o*d+r*a*h-i*a*d+i*l*u)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){const r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=i),this}invert(){const e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8],h=e[9],d=e[10],f=e[11],m=e[12],_=e[13],g=e[14],p=e[15],y=h*g*c-_*d*c+_*l*f-o*g*f-h*l*p+o*d*p,x=m*d*c-u*g*c-m*l*f+a*g*f+u*l*p-a*d*p,v=u*_*c-m*h*c+m*o*f-a*_*f-u*o*p+a*h*p,w=m*h*l-u*_*l-m*o*d+a*_*d+u*o*g-a*h*g,b=t*y+i*x+r*v+s*w;if(b===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const A=1/b;return e[0]=y*A,e[1]=(_*d*s-h*g*s-_*r*f+i*g*f+h*r*p-i*d*p)*A,e[2]=(o*g*s-_*l*s+_*r*c-i*g*c-o*r*p+i*l*p)*A,e[3]=(h*l*s-o*d*s-h*r*c+i*d*c+o*r*f-i*l*f)*A,e[4]=x*A,e[5]=(u*g*s-m*d*s+m*r*f-t*g*f-u*r*p+t*d*p)*A,e[6]=(m*l*s-a*g*s-m*r*c+t*g*c+a*r*p-t*l*p)*A,e[7]=(a*d*s-u*l*s+u*r*c-t*d*c-a*r*f+t*l*f)*A,e[8]=v*A,e[9]=(m*h*s-u*_*s-m*i*f+t*_*f+u*i*p-t*h*p)*A,e[10]=(a*_*s-m*o*s+m*i*c-t*_*c-a*i*p+t*o*p)*A,e[11]=(u*o*s-a*h*s-u*i*c+t*h*c+a*i*f-t*o*f)*A,e[12]=w*A,e[13]=(u*_*r-m*h*r+m*i*d-t*_*d-u*i*g+t*h*g)*A,e[14]=(m*o*r-a*_*r-m*i*l+t*_*l+a*i*g-t*o*g)*A,e[15]=(a*h*r-u*o*r+u*i*l-t*h*l-a*i*d+t*o*d)*A,this}scale(e){const t=this.elements,i=e.x,r=e.y,s=e.z;return t[0]*=i,t[4]*=r,t[8]*=s,t[1]*=i,t[5]*=r,t[9]*=s,t[2]*=i,t[6]*=r,t[10]*=s,t[3]*=i,t[7]*=r,t[11]*=s,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,r))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const i=Math.cos(t),r=Math.sin(t),s=1-i,a=e.x,o=e.y,l=e.z,c=s*a,u=s*o;return this.set(c*a+i,c*o-r*l,c*l+r*o,0,c*o+r*l,u*o+i,u*l-r*a,0,c*l-r*o,u*l+r*a,s*l*l+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,r,s,a){return this.set(1,i,s,0,e,1,a,0,t,r,1,0,0,0,0,1),this}compose(e,t,i){const r=this.elements,s=t._x,a=t._y,o=t._z,l=t._w,c=s+s,u=a+a,h=o+o,d=s*c,f=s*u,m=s*h,_=a*u,g=a*h,p=o*h,y=l*c,x=l*u,v=l*h,w=i.x,b=i.y,A=i.z;return r[0]=(1-(_+p))*w,r[1]=(f+v)*w,r[2]=(m-x)*w,r[3]=0,r[4]=(f-v)*b,r[5]=(1-(d+p))*b,r[6]=(g+y)*b,r[7]=0,r[8]=(m+x)*A,r[9]=(g-y)*A,r[10]=(1-(d+_))*A,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,i){const r=this.elements;let s=_r.set(r[0],r[1],r[2]).length();const a=_r.set(r[4],r[5],r[6]).length(),o=_r.set(r[8],r[9],r[10]).length();this.determinant()<0&&(s=-s),e.x=r[12],e.y=r[13],e.z=r[14],Tn.copy(this);const c=1/s,u=1/a,h=1/o;return Tn.elements[0]*=c,Tn.elements[1]*=c,Tn.elements[2]*=c,Tn.elements[4]*=u,Tn.elements[5]*=u,Tn.elements[6]*=u,Tn.elements[8]*=h,Tn.elements[9]*=h,Tn.elements[10]*=h,t.setFromRotationMatrix(Tn),i.x=s,i.y=a,i.z=o,this}makePerspective(e,t,i,r,s,a,o=li){const l=this.elements,c=2*s/(t-e),u=2*s/(i-r),h=(t+e)/(t-e),d=(i+r)/(i-r);let f,m;if(o===li)f=-(a+s)/(a-s),m=-2*a*s/(a-s);else if(o===Lo)f=-a/(a-s),m=-a*s/(a-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=c,l[4]=0,l[8]=h,l[12]=0,l[1]=0,l[5]=u,l[9]=d,l[13]=0,l[2]=0,l[6]=0,l[10]=f,l[14]=m,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,i,r,s,a,o=li){const l=this.elements,c=1/(t-e),u=1/(i-r),h=1/(a-s),d=(t+e)*c,f=(i+r)*u;let m,_;if(o===li)m=(a+s)*h,_=-2*h;else if(o===Lo)m=s*h,_=-1*h;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-d,l[1]=0,l[5]=2*u,l[9]=0,l[13]=-f,l[2]=0,l[6]=0,l[10]=_,l[14]=-m,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const t=this.elements,i=e.elements;for(let r=0;r<16;r++)if(t[r]!==i[r])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}}const _r=new P,Tn=new ge,P_=new P(0,0,0),L_=new P(1,1,1),yi=new P,ba=new P,rn=new P,Bh=new ge,kh=new Zt;class Dn{constructor(e=0,t=0,i=0,r=Dn.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=r}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,r=this._order){return this._x=e,this._y=t,this._z=i,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){const r=e.elements,s=r[0],a=r[4],o=r[8],l=r[1],c=r[5],u=r[9],h=r[2],d=r[6],f=r[10];switch(t){case"XYZ":this._y=Math.asin(Pt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-u,f),this._z=Math.atan2(-a,s)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Pt(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-h,s),this._z=0);break;case"ZXY":this._x=Math.asin(Pt(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-h,f),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-Pt(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(Pt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-h,s)):(this._x=0,this._y=Math.atan2(o,f));break;case"XZY":this._z=Math.asin(-Pt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,s)):(this._x=Math.atan2(-u,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return Bh.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Bh,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return kh.setFromEuler(this),this.setFromQuaternion(kh,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Dn.DEFAULT_ORDER="XYZ";class Nu{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let I_=0;const zh=new P,xr=new Zt,Yn=new ge,Aa=new P,gs=new P,D_=new P,U_=new Zt,Vh=new P(1,0,0),Hh=new P(0,1,0),Gh=new P(0,0,1),Wh={type:"added"},N_={type:"removed"},vr={type:"childadded",child:null},El={type:"childremoved",child:null};class pt extends kn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:I_++}),this.uuid=Pn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=pt.DEFAULT_UP.clone();const e=new P,t=new Dn,i=new Zt,r=new P(1,1,1);function s(){i.setFromEuler(t,!1)}function a(){t.setFromQuaternion(i,void 0,!1)}t._onChange(s),i._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new ge},normalMatrix:{value:new Ne}}),this.matrix=new ge,this.matrixWorld=new ge,this.matrixAutoUpdate=pt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=pt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Nu,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return xr.setFromAxisAngle(e,t),this.quaternion.multiply(xr),this}rotateOnWorldAxis(e,t){return xr.setFromAxisAngle(e,t),this.quaternion.premultiply(xr),this}rotateX(e){return this.rotateOnAxis(Vh,e)}rotateY(e){return this.rotateOnAxis(Hh,e)}rotateZ(e){return this.rotateOnAxis(Gh,e)}translateOnAxis(e,t){return zh.copy(e).applyQuaternion(this.quaternion),this.position.add(zh.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Vh,e)}translateY(e){return this.translateOnAxis(Hh,e)}translateZ(e){return this.translateOnAxis(Gh,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Yn.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?Aa.copy(e):Aa.set(e,t,i);const r=this.parent;this.updateWorldMatrix(!0,!1),gs.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Yn.lookAt(gs,Aa,this.up):Yn.lookAt(Aa,gs,this.up),this.quaternion.setFromRotationMatrix(Yn),r&&(Yn.extractRotation(r.matrixWorld),xr.setFromRotationMatrix(Yn),this.quaternion.premultiply(xr.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Wh),vr.child=e,this.dispatchEvent(vr),vr.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(N_),El.child=e,this.dispatchEvent(El),El.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Yn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Yn.multiply(e.parent.matrixWorld)),e.applyMatrix4(Yn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Wh),vr.child=e,this.dispatchEvent(vr),vr.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,r=this.children.length;i<r;i++){const a=this.children[i].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);const r=this.children;for(let s=0,a=r.length;s<a;s++)r[s].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(gs,e,D_),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(gs,U_,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t){const i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const r=this.children;for(let s=0,a=r.length;s<a;s++)r[s].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.visibility=this._visibility,r.active=this._active,r.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.geometryCount=this._geometryCount,r.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere={center:r.boundingSphere.center.toArray(),radius:r.boundingSphere.radius}),this.boundingBox!==null&&(r.boundingBox={min:r.boundingBox.min.toArray(),max:r.boundingBox.max.toArray()}));function s(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){const h=l[c];s(e.shapes,h)}else s(e.shapes,l)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(s(e.materials,this.material[l]));r.material=o}else r.material=s(e.materials,this.material);if(this.children.length>0){r.children=[];for(let o=0;o<this.children.length;o++)r.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];r.animations.push(s(e.animations,l))}}if(t){const o=a(e.geometries),l=a(e.materials),c=a(e.textures),u=a(e.images),h=a(e.shapes),d=a(e.skeletons),f=a(e.animations),m=a(e.nodes);o.length>0&&(i.geometries=o),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),u.length>0&&(i.images=u),h.length>0&&(i.shapes=h),d.length>0&&(i.skeletons=d),f.length>0&&(i.animations=f),m.length>0&&(i.nodes=m)}return i.object=r,i;function a(o){const l=[];for(const c in o){const u=o[c];delete u.metadata,l.push(u)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){const r=e.children[i];this.add(r.clone())}return this}}pt.DEFAULT_UP=new P(0,1,0);pt.DEFAULT_MATRIX_AUTO_UPDATE=!0;pt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Sn=new P,$n=new P,bl=new P,Kn=new P,yr=new P,Mr=new P,Xh=new P,Al=new P,wl=new P,Rl=new P,Cl=new qe,Pl=new qe,Ll=new qe;class on{constructor(e=new P,t=new P,i=new P){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,r){r.subVectors(i,t),Sn.subVectors(e,t),r.cross(Sn);const s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(e,t,i,r,s){Sn.subVectors(r,t),$n.subVectors(i,t),bl.subVectors(e,t);const a=Sn.dot(Sn),o=Sn.dot($n),l=Sn.dot(bl),c=$n.dot($n),u=$n.dot(bl),h=a*c-o*o;if(h===0)return s.set(0,0,0),null;const d=1/h,f=(c*l-o*u)*d,m=(a*u-o*l)*d;return s.set(1-f-m,m,f)}static containsPoint(e,t,i,r){return this.getBarycoord(e,t,i,r,Kn)===null?!1:Kn.x>=0&&Kn.y>=0&&Kn.x+Kn.y<=1}static getInterpolation(e,t,i,r,s,a,o,l){return this.getBarycoord(e,t,i,r,Kn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,Kn.x),l.addScaledVector(a,Kn.y),l.addScaledVector(o,Kn.z),l)}static getInterpolatedAttribute(e,t,i,r,s,a){return Cl.setScalar(0),Pl.setScalar(0),Ll.setScalar(0),Cl.fromBufferAttribute(e,t),Pl.fromBufferAttribute(e,i),Ll.fromBufferAttribute(e,r),a.setScalar(0),a.addScaledVector(Cl,s.x),a.addScaledVector(Pl,s.y),a.addScaledVector(Ll,s.z),a}static isFrontFacing(e,t,i,r){return Sn.subVectors(i,t),$n.subVectors(e,t),Sn.cross($n).dot(r)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,r){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,i,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Sn.subVectors(this.c,this.b),$n.subVectors(this.a,this.b),Sn.cross($n).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return on.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return on.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,r,s){return on.getInterpolation(e,this.a,this.b,this.c,t,i,r,s)}containsPoint(e){return on.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return on.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const i=this.a,r=this.b,s=this.c;let a,o;yr.subVectors(r,i),Mr.subVectors(s,i),Al.subVectors(e,i);const l=yr.dot(Al),c=Mr.dot(Al);if(l<=0&&c<=0)return t.copy(i);wl.subVectors(e,r);const u=yr.dot(wl),h=Mr.dot(wl);if(u>=0&&h<=u)return t.copy(r);const d=l*h-u*c;if(d<=0&&l>=0&&u<=0)return a=l/(l-u),t.copy(i).addScaledVector(yr,a);Rl.subVectors(e,s);const f=yr.dot(Rl),m=Mr.dot(Rl);if(m>=0&&f<=m)return t.copy(s);const _=f*c-l*m;if(_<=0&&c>=0&&m<=0)return o=c/(c-m),t.copy(i).addScaledVector(Mr,o);const g=u*m-f*h;if(g<=0&&h-u>=0&&f-m>=0)return Xh.subVectors(s,r),o=(h-u)/(h-u+(f-m)),t.copy(r).addScaledVector(Xh,o);const p=1/(g+_+d);return a=_*p,o=d*p,t.copy(i).addScaledVector(yr,a).addScaledVector(Mr,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const Hp={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Mi={h:0,s:0,l:0},wa={h:0,s:0,l:0};function Il(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*6*(2/3-t):n}class we{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){const r=e;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=gt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Xe.toWorkingColorSpace(this,t),this}setRGB(e,t,i,r=Xe.workingColorSpace){return this.r=e,this.g=t,this.b=i,Xe.toWorkingColorSpace(this,r),this}setHSL(e,t,i,r=Xe.workingColorSpace){if(e=Uu(e,1),t=Pt(t,0,1),i=Pt(i,0,1),t===0)this.r=this.g=this.b=i;else{const s=i<=.5?i*(1+t):i+t-i*t,a=2*i-s;this.r=Il(a,s,e+1/3),this.g=Il(a,s,e),this.b=Il(a,s,e-1/3)}return Xe.toWorkingColorSpace(this,r),this}setStyle(e,t=gt){function i(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let s;const a=r[1],o=r[2];switch(a){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,t);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,t);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){const s=r[1],a=s.length;if(a===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(s,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=gt){const i=Hp[e.toLowerCase()];return i!==void 0?this.setHex(i,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=hi(e.r),this.g=hi(e.g),this.b=hi(e.b),this}copyLinearToSRGB(e){return this.r=Hr(e.r),this.g=Hr(e.g),this.b=Hr(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=gt){return Xe.fromWorkingColorSpace(Dt.copy(this),e),Math.round(Pt(Dt.r*255,0,255))*65536+Math.round(Pt(Dt.g*255,0,255))*256+Math.round(Pt(Dt.b*255,0,255))}getHexString(e=gt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Xe.workingColorSpace){Xe.fromWorkingColorSpace(Dt.copy(this),t);const i=Dt.r,r=Dt.g,s=Dt.b,a=Math.max(i,r,s),o=Math.min(i,r,s);let l,c;const u=(o+a)/2;if(o===a)l=0,c=0;else{const h=a-o;switch(c=u<=.5?h/(a+o):h/(2-a-o),a){case i:l=(r-s)/h+(r<s?6:0);break;case r:l=(s-i)/h+2;break;case s:l=(i-r)/h+4;break}l/=6}return e.h=l,e.s=c,e.l=u,e}getRGB(e,t=Xe.workingColorSpace){return Xe.fromWorkingColorSpace(Dt.copy(this),t),e.r=Dt.r,e.g=Dt.g,e.b=Dt.b,e}getStyle(e=gt){Xe.fromWorkingColorSpace(Dt.copy(this),e);const t=Dt.r,i=Dt.g,r=Dt.b;return e!==gt?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(r*255)})`}offsetHSL(e,t,i){return this.getHSL(Mi),this.setHSL(Mi.h+e,Mi.s+t,Mi.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(Mi),e.getHSL(wa);const i=Xs(Mi.h,wa.h,t),r=Xs(Mi.s,wa.s,t),s=Xs(Mi.l,wa.l,t);return this.setHSL(i,r,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,i=this.g,r=this.b,s=e.elements;return this.r=s[0]*t+s[3]*i+s[6]*r,this.g=s[1]*t+s[4]*i+s[7]*r,this.b=s[2]*t+s[5]*i+s[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Dt=new we;we.NAMES=Hp;let F_=0;class zn extends kn{static get type(){return"Material"}get type(){return this.constructor.type}set type(e){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:F_++}),this.uuid=Pn(),this.name="",this.blending=nr,this.side=di,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=bc,this.blendDst=Ac,this.blendEquation=Ji,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new we(0,0,0),this.blendAlpha=0,this.depthFunc=qr,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Rh,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=dr,this.stencilZFail=dr,this.stencilZPass=dr,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const i=e[t];if(i===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const r=this[t];if(r===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(i):r&&r.isVector3&&i&&i.isVector3?r.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==nr&&(i.blending=this.blending),this.side!==di&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==bc&&(i.blendSrc=this.blendSrc),this.blendDst!==Ac&&(i.blendDst=this.blendDst),this.blendEquation!==Ji&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==qr&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Rh&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==dr&&(i.stencilFail=this.stencilFail),this.stencilZFail!==dr&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==dr&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function r(s){const a=[];for(const o in s){const l=s[o];delete l.metadata,a.push(l)}return a}if(t){const s=r(e.textures),a=r(e.images);s.length>0&&(i.textures=s),a.length>0&&(i.images=a)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let i=null;if(t!==null){const r=t.length;i=new Array(r);for(let s=0;s!==r;++s)i[s]=t[s].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class ln extends zn{static get type(){return"MeshBasicMaterial"}constructor(e){super(),this.isMeshBasicMaterial=!0,this.color=new we(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Dn,this.combine=bp,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Tt=new P,Ra=new fe;class je{constructor(e,t,i=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=lu,this.updateRanges=[],this.gpuType=wn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[e+r]=t.array[i+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)Ra.fromBufferAttribute(this,t),Ra.applyMatrix3(e),this.setXY(t,Ra.x,Ra.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)Tt.fromBufferAttribute(this,t),Tt.applyMatrix3(e),this.setXYZ(t,Tt.x,Tt.y,Tt.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)Tt.fromBufferAttribute(this,t),Tt.applyMatrix4(e),this.setXYZ(t,Tt.x,Tt.y,Tt.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)Tt.fromBufferAttribute(this,t),Tt.applyNormalMatrix(e),this.setXYZ(t,Tt.x,Tt.y,Tt.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)Tt.fromBufferAttribute(this,t),Tt.transformDirection(e),this.setXYZ(t,Tt.x,Tt.y,Tt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=An(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=rt(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=An(t,this.array)),t}setX(e,t){return this.normalized&&(t=rt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=An(t,this.array)),t}setY(e,t){return this.normalized&&(t=rt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=An(t,this.array)),t}setZ(e,t){return this.normalized&&(t=rt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=An(t,this.array)),t}setW(e,t){return this.normalized&&(t=rt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=rt(t,this.array),i=rt(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,r){return e*=this.itemSize,this.normalized&&(t=rt(t,this.array),i=rt(i,this.array),r=rt(r,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=r,this}setXYZW(e,t,i,r,s){return e*=this.itemSize,this.normalized&&(t=rt(t,this.array),i=rt(i,this.array),r=rt(r,this.array),s=rt(s,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=r,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==lu&&(e.usage=this.usage),e}}class Gp extends je{constructor(e,t,i){super(new Uint16Array(e),t,i)}}class Wp extends je{constructor(e,t,i){super(new Uint32Array(e),t,i)}}class at extends je{constructor(e,t,i){super(new Float32Array(e),t,i)}}let O_=0;const fn=new ge,Dl=new pt,Tr=new P,sn=new cn,_s=new cn,wt=new P;class _t extends kn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:O_++}),this.uuid=Pn(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(kp(e)?Wp:Gp)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const s=new Ne().getNormalMatrix(e);i.applyNormalMatrix(s),i.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return fn.makeRotationFromQuaternion(e),this.applyMatrix4(fn),this}rotateX(e){return fn.makeRotationX(e),this.applyMatrix4(fn),this}rotateY(e){return fn.makeRotationY(e),this.applyMatrix4(fn),this}rotateZ(e){return fn.makeRotationZ(e),this.applyMatrix4(fn),this}translate(e,t,i){return fn.makeTranslation(e,t,i),this.applyMatrix4(fn),this}scale(e,t,i){return fn.makeScale(e,t,i),this.applyMatrix4(fn),this}lookAt(e){return Dl.lookAt(e),Dl.updateMatrix(),this.applyMatrix4(Dl.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Tr).negate(),this.translate(Tr.x,Tr.y,Tr.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const i=[];for(let r=0,s=e.length;r<s;r++){const a=e[r];i.push(a.x,a.y,a.z||0)}this.setAttribute("position",new at(i,3))}else{for(let i=0,r=t.count;i<r;i++){const s=e[i];t.setXYZ(i,s.x,s.y,s.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new cn);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new P(-1/0,-1/0,-1/0),new P(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,r=t.length;i<r;i++){const s=t[i];sn.setFromBufferAttribute(s),this.morphTargetsRelative?(wt.addVectors(this.boundingBox.min,sn.min),this.boundingBox.expandByPoint(wt),wt.addVectors(this.boundingBox.max,sn.max),this.boundingBox.expandByPoint(wt)):(this.boundingBox.expandByPoint(sn.min),this.boundingBox.expandByPoint(sn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new un);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new P,1/0);return}if(e){const i=this.boundingSphere.center;if(sn.setFromBufferAttribute(e),t)for(let s=0,a=t.length;s<a;s++){const o=t[s];_s.setFromBufferAttribute(o),this.morphTargetsRelative?(wt.addVectors(sn.min,_s.min),sn.expandByPoint(wt),wt.addVectors(sn.max,_s.max),sn.expandByPoint(wt)):(sn.expandByPoint(_s.min),sn.expandByPoint(_s.max))}sn.getCenter(i);let r=0;for(let s=0,a=e.count;s<a;s++)wt.fromBufferAttribute(e,s),r=Math.max(r,i.distanceToSquared(wt));if(t)for(let s=0,a=t.length;s<a;s++){const o=t[s],l=this.morphTargetsRelative;for(let c=0,u=o.count;c<u;c++)wt.fromBufferAttribute(o,c),l&&(Tr.fromBufferAttribute(e,c),wt.add(Tr)),r=Math.max(r,i.distanceToSquared(wt))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=t.position,r=t.normal,s=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new je(new Float32Array(4*i.count),4));const a=this.getAttribute("tangent"),o=[],l=[];for(let R=0;R<i.count;R++)o[R]=new P,l[R]=new P;const c=new P,u=new P,h=new P,d=new fe,f=new fe,m=new fe,_=new P,g=new P;function p(R,T,M){c.fromBufferAttribute(i,R),u.fromBufferAttribute(i,T),h.fromBufferAttribute(i,M),d.fromBufferAttribute(s,R),f.fromBufferAttribute(s,T),m.fromBufferAttribute(s,M),u.sub(c),h.sub(c),f.sub(d),m.sub(d);const L=1/(f.x*m.y-m.x*f.y);isFinite(L)&&(_.copy(u).multiplyScalar(m.y).addScaledVector(h,-f.y).multiplyScalar(L),g.copy(h).multiplyScalar(f.x).addScaledVector(u,-m.x).multiplyScalar(L),o[R].add(_),o[T].add(_),o[M].add(_),l[R].add(g),l[T].add(g),l[M].add(g))}let y=this.groups;y.length===0&&(y=[{start:0,count:e.count}]);for(let R=0,T=y.length;R<T;++R){const M=y[R],L=M.start,z=M.count;for(let I=L,q=L+z;I<q;I+=3)p(e.getX(I+0),e.getX(I+1),e.getX(I+2))}const x=new P,v=new P,w=new P,b=new P;function A(R){w.fromBufferAttribute(r,R),b.copy(w);const T=o[R];x.copy(T),x.sub(w.multiplyScalar(w.dot(T))).normalize(),v.crossVectors(b,T);const L=v.dot(l[R])<0?-1:1;a.setXYZW(R,x.x,x.y,x.z,L)}for(let R=0,T=y.length;R<T;++R){const M=y[R],L=M.start,z=M.count;for(let I=L,q=L+z;I<q;I+=3)A(e.getX(I+0)),A(e.getX(I+1)),A(e.getX(I+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new je(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let d=0,f=i.count;d<f;d++)i.setXYZ(d,0,0,0);const r=new P,s=new P,a=new P,o=new P,l=new P,c=new P,u=new P,h=new P;if(e)for(let d=0,f=e.count;d<f;d+=3){const m=e.getX(d+0),_=e.getX(d+1),g=e.getX(d+2);r.fromBufferAttribute(t,m),s.fromBufferAttribute(t,_),a.fromBufferAttribute(t,g),u.subVectors(a,s),h.subVectors(r,s),u.cross(h),o.fromBufferAttribute(i,m),l.fromBufferAttribute(i,_),c.fromBufferAttribute(i,g),o.add(u),l.add(u),c.add(u),i.setXYZ(m,o.x,o.y,o.z),i.setXYZ(_,l.x,l.y,l.z),i.setXYZ(g,c.x,c.y,c.z)}else for(let d=0,f=t.count;d<f;d+=3)r.fromBufferAttribute(t,d+0),s.fromBufferAttribute(t,d+1),a.fromBufferAttribute(t,d+2),u.subVectors(a,s),h.subVectors(r,s),u.cross(h),i.setXYZ(d+0,u.x,u.y,u.z),i.setXYZ(d+1,u.x,u.y,u.z),i.setXYZ(d+2,u.x,u.y,u.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)wt.fromBufferAttribute(e,t),wt.normalize(),e.setXYZ(t,wt.x,wt.y,wt.z)}toNonIndexed(){function e(o,l){const c=o.array,u=o.itemSize,h=o.normalized,d=new c.constructor(l.length*u);let f=0,m=0;for(let _=0,g=l.length;_<g;_++){o.isInterleavedBufferAttribute?f=l[_]*o.data.stride+o.offset:f=l[_]*u;for(let p=0;p<u;p++)d[m++]=c[f++]}return new je(d,u,h)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new _t,i=this.index.array,r=this.attributes;for(const o in r){const l=r[o],c=e(l,i);t.setAttribute(o,c)}const s=this.morphAttributes;for(const o in s){const l=[],c=s[o];for(let u=0,h=c.length;u<h;u++){const d=c[u],f=e(d,i);l.push(f)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const i=this.attributes;for(const l in i){const c=i[l];e.data.attributes[l]=c.toJSON(e.data)}const r={};let s=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],u=[];for(let h=0,d=c.length;h<d;h++){const f=c[h];u.push(f.toJSON(e.data))}u.length>0&&(r[l]=u,s=!0)}s&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone(t));const r=e.attributes;for(const c in r){const u=r[c];this.setAttribute(c,u.clone(t))}const s=e.morphAttributes;for(const c in s){const u=[],h=s[c];for(let d=0,f=h.length;d<f;d++)u.push(h[d].clone(t));this.morphAttributes[c]=u}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let c=0,u=a.length;c<u;c++){const h=a[c];this.addGroup(h.start,h.count,h.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const qh=new ge,Hi=new Bi,Ca=new un,jh=new P,Pa=new P,La=new P,Ia=new P,Ul=new P,Da=new P,Yh=new P,Ua=new P;class He extends pt{constructor(e=new _t,t=new ln){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const r=t[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=r.length;s<a;s++){const o=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}getVertexPosition(e,t){const i=this.geometry,r=i.attributes.position,s=i.morphAttributes.position,a=i.morphTargetsRelative;t.fromBufferAttribute(r,e);const o=this.morphTargetInfluences;if(s&&o){Da.set(0,0,0);for(let l=0,c=s.length;l<c;l++){const u=o[l],h=s[l];u!==0&&(Ul.fromBufferAttribute(h,e),a?Da.addScaledVector(Ul,u):Da.addScaledVector(Ul.sub(t),u))}t.add(Da)}return t}raycast(e,t){const i=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Ca.copy(i.boundingSphere),Ca.applyMatrix4(s),Hi.copy(e.ray).recast(e.near),!(Ca.containsPoint(Hi.origin)===!1&&(Hi.intersectSphere(Ca,jh)===null||Hi.origin.distanceToSquared(jh)>(e.far-e.near)**2))&&(qh.copy(s).invert(),Hi.copy(e.ray).applyMatrix4(qh),!(i.boundingBox!==null&&Hi.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,Hi)))}_computeIntersections(e,t,i){let r;const s=this.geometry,a=this.material,o=s.index,l=s.attributes.position,c=s.attributes.uv,u=s.attributes.uv1,h=s.attributes.normal,d=s.groups,f=s.drawRange;if(o!==null)if(Array.isArray(a))for(let m=0,_=d.length;m<_;m++){const g=d[m],p=a[g.materialIndex],y=Math.max(g.start,f.start),x=Math.min(o.count,Math.min(g.start+g.count,f.start+f.count));for(let v=y,w=x;v<w;v+=3){const b=o.getX(v),A=o.getX(v+1),R=o.getX(v+2);r=Na(this,p,e,i,c,u,h,b,A,R),r&&(r.faceIndex=Math.floor(v/3),r.face.materialIndex=g.materialIndex,t.push(r))}}else{const m=Math.max(0,f.start),_=Math.min(o.count,f.start+f.count);for(let g=m,p=_;g<p;g+=3){const y=o.getX(g),x=o.getX(g+1),v=o.getX(g+2);r=Na(this,a,e,i,c,u,h,y,x,v),r&&(r.faceIndex=Math.floor(g/3),t.push(r))}}else if(l!==void 0)if(Array.isArray(a))for(let m=0,_=d.length;m<_;m++){const g=d[m],p=a[g.materialIndex],y=Math.max(g.start,f.start),x=Math.min(l.count,Math.min(g.start+g.count,f.start+f.count));for(let v=y,w=x;v<w;v+=3){const b=v,A=v+1,R=v+2;r=Na(this,p,e,i,c,u,h,b,A,R),r&&(r.faceIndex=Math.floor(v/3),r.face.materialIndex=g.materialIndex,t.push(r))}}else{const m=Math.max(0,f.start),_=Math.min(l.count,f.start+f.count);for(let g=m,p=_;g<p;g+=3){const y=g,x=g+1,v=g+2;r=Na(this,a,e,i,c,u,h,y,x,v),r&&(r.faceIndex=Math.floor(g/3),t.push(r))}}}}function B_(n,e,t,i,r,s,a,o){let l;if(e.side===$t?l=i.intersectTriangle(a,s,r,!0,o):l=i.intersectTriangle(r,s,a,e.side===di,o),l===null)return null;Ua.copy(o),Ua.applyMatrix4(n.matrixWorld);const c=t.ray.origin.distanceTo(Ua);return c<t.near||c>t.far?null:{distance:c,point:Ua.clone(),object:n}}function Na(n,e,t,i,r,s,a,o,l,c){n.getVertexPosition(o,Pa),n.getVertexPosition(l,La),n.getVertexPosition(c,Ia);const u=B_(n,e,t,i,Pa,La,Ia,Yh);if(u){const h=new P;on.getBarycoord(Yh,Pa,La,Ia,h),r&&(u.uv=on.getInterpolatedAttribute(r,o,l,c,h,new fe)),s&&(u.uv1=on.getInterpolatedAttribute(s,o,l,c,h,new fe)),a&&(u.normal=on.getInterpolatedAttribute(a,o,l,c,h,new P),u.normal.dot(i.direction)>0&&u.normal.multiplyScalar(-1));const d={a:o,b:l,c,normal:new P,materialIndex:0};on.getNormal(Pa,La,Ia,d.normal),u.face=d,u.barycoord=h}return u}class gn extends _t{constructor(e=1,t=1,i=1,r=1,s=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:r,heightSegments:s,depthSegments:a};const o=this;r=Math.floor(r),s=Math.floor(s),a=Math.floor(a);const l=[],c=[],u=[],h=[];let d=0,f=0;m("z","y","x",-1,-1,i,t,e,a,s,0),m("z","y","x",1,-1,i,t,-e,a,s,1),m("x","z","y",1,1,e,i,t,r,a,2),m("x","z","y",1,-1,e,i,-t,r,a,3),m("x","y","z",1,-1,e,t,i,r,s,4),m("x","y","z",-1,-1,e,t,-i,r,s,5),this.setIndex(l),this.setAttribute("position",new at(c,3)),this.setAttribute("normal",new at(u,3)),this.setAttribute("uv",new at(h,2));function m(_,g,p,y,x,v,w,b,A,R,T){const M=v/A,L=w/R,z=v/2,I=w/2,q=b/2,k=A+1,O=R+1;let j=0,B=0;const G=new P;for(let Q=0;Q<O;Q++){const ie=Q*L-I;for(let me=0;me<k;me++){const xe=me*M-z;G[_]=xe*y,G[g]=ie*x,G[p]=q,c.push(G.x,G.y,G.z),G[_]=0,G[g]=0,G[p]=b>0?1:-1,u.push(G.x,G.y,G.z),h.push(me/A),h.push(1-Q/R),j+=1}}for(let Q=0;Q<R;Q++)for(let ie=0;ie<A;ie++){const me=d+ie+k*Q,xe=d+ie+k*(Q+1),H=d+(ie+1)+k*(Q+1),K=d+(ie+1)+k*Q;l.push(me,xe,K),l.push(xe,H,K),B+=6}o.addGroup(f,B,T),f+=B,d+=j}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new gn(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function Qr(n){const e={};for(const t in n){e[t]={};for(const i in n[t]){const r=n[t][i];r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)?r.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=r.clone():Array.isArray(r)?e[t][i]=r.slice():e[t][i]=r}}return e}function Xt(n){const e={};for(let t=0;t<n.length;t++){const i=Qr(n[t]);for(const r in i)e[r]=i[r]}return e}function k_(n){const e=[];for(let t=0;t<n.length;t++)e.push(n[t].clone());return e}function Xp(n){const e=n.getRenderTarget();return e===null?n.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Xe.workingColorSpace}const z_={clone:Qr,merge:Xt};var V_=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,H_=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Vn extends zn{static get type(){return"ShaderMaterial"}constructor(e){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=V_,this.fragmentShader=H_,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Qr(e.uniforms),this.uniformsGroups=k_(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const r in this.uniforms){const a=this.uniforms[r].value;a&&a.isTexture?t.uniforms[r]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[r]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[r]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[r]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[r]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[r]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[r]={type:"m4",value:a.toArray()}:t.uniforms[r]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const i={};for(const r in this.extensions)this.extensions[r]===!0&&(i[r]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}}class qp extends pt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ge,this.projectionMatrix=new ge,this.projectionMatrixInverse=new ge,this.coordinateSystem=li}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Ti=new P,$h=new fe,Kh=new fe;class Ot extends qp{constructor(e=50,t=1,i=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Jr*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Ws*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Jr*2*Math.atan(Math.tan(Ws*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){Ti.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Ti.x,Ti.y).multiplyScalar(-e/Ti.z),Ti.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(Ti.x,Ti.y).multiplyScalar(-e/Ti.z)}getViewSize(e,t){return this.getViewBounds(e,$h,Kh),t.subVectors(Kh,$h)}setViewOffset(e,t,i,r,s,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Ws*.5*this.fov)/this.zoom,i=2*t,r=this.aspect*i,s=-.5*r;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;s+=a.offsetX*r/l,t-=a.offsetY*i/c,r*=a.width/l,i*=a.height/c}const o=this.filmOffset;o!==0&&(s+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,t,t-i,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const Sr=-90,Er=1;class G_ extends pt{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const r=new Ot(Sr,Er,e,t);r.layers=this.layers,this.add(r);const s=new Ot(Sr,Er,e,t);s.layers=this.layers,this.add(s);const a=new Ot(Sr,Er,e,t);a.layers=this.layers,this.add(a);const o=new Ot(Sr,Er,e,t);o.layers=this.layers,this.add(o);const l=new Ot(Sr,Er,e,t);l.layers=this.layers,this.add(l);const c=new Ot(Sr,Er,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[i,r,s,a,o,l]=t;for(const c of t)this.remove(c);if(e===li)i.up.set(0,1,0),i.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Lo)i.up.set(0,-1,0),i.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[s,a,o,l,c,u]=this.children,h=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),m=e.xr.enabled;e.xr.enabled=!1;const _=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,e.setRenderTarget(i,0,r),e.render(t,s),e.setRenderTarget(i,1,r),e.render(t,a),e.setRenderTarget(i,2,r),e.render(t,o),e.setRenderTarget(i,3,r),e.render(t,l),e.setRenderTarget(i,4,r),e.render(t,c),i.texture.generateMipmaps=_,e.setRenderTarget(i,5,r),e.render(t,u),e.setRenderTarget(h,d,f),e.xr.enabled=m,i.texture.needsPMREMUpdate=!0}}class jp extends St{constructor(e,t,i,r,s,a,o,l,c,u){e=e!==void 0?e:[],t=t!==void 0?t:jr,super(e,t,i,r,s,a,o,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class W_ extends fi{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},r=[i,i,i,i,i,i];this.texture=new jp(r,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:Yt}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new gn(5,5,5),s=new Vn({name:"CubemapFromEquirect",uniforms:Qr(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:$t,blending:Fi});s.uniforms.tEquirect.value=t;const a=new He(r,s),o=t.minFilter;return t.minFilter===oi&&(t.minFilter=Yt),new G_(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t,i,r){const s=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,i,r);e.setRenderTarget(s)}}const Nl=new P,X_=new P,q_=new Ne;class Ri{constructor(e=new P(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,r){return this.normal.set(e,t,i),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){const r=Nl.subVectors(i,t).cross(X_.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const i=e.delta(Nl),r=this.normal.dot(i);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const s=-(e.start.dot(this.normal)+this.constant)/r;return s<0||s>1?null:t.copy(e.start).addScaledVector(i,s)}intersectsLine(e){const t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const i=t||q_.getNormalMatrix(e),r=this.coplanarPoint(Nl).applyMatrix4(e),s=this.normal.applyMatrix3(i).normalize();return this.constant=-r.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Gi=new un,Fa=new P;class al{constructor(e=new Ri,t=new Ri,i=new Ri,r=new Ri,s=new Ri,a=new Ri){this.planes=[e,t,i,r,s,a]}set(e,t,i,r,s,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(i),o[3].copy(r),o[4].copy(s),o[5].copy(a),this}copy(e){const t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=li){const i=this.planes,r=e.elements,s=r[0],a=r[1],o=r[2],l=r[3],c=r[4],u=r[5],h=r[6],d=r[7],f=r[8],m=r[9],_=r[10],g=r[11],p=r[12],y=r[13],x=r[14],v=r[15];if(i[0].setComponents(l-s,d-c,g-f,v-p).normalize(),i[1].setComponents(l+s,d+c,g+f,v+p).normalize(),i[2].setComponents(l+a,d+u,g+m,v+y).normalize(),i[3].setComponents(l-a,d-u,g-m,v-y).normalize(),i[4].setComponents(l-o,d-h,g-_,v-x).normalize(),t===li)i[5].setComponents(l+o,d+h,g+_,v+x).normalize();else if(t===Lo)i[5].setComponents(o,h,_,x).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Gi.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Gi.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Gi)}intersectsSprite(e){return Gi.center.set(0,0,0),Gi.radius=.7071067811865476,Gi.applyMatrix4(e.matrixWorld),this.intersectsSphere(Gi)}intersectsSphere(e){const t=this.planes,i=e.center,r=-e.radius;for(let s=0;s<6;s++)if(t[s].distanceToPoint(i)<r)return!1;return!0}intersectsBox(e){const t=this.planes;for(let i=0;i<6;i++){const r=t[i];if(Fa.x=r.normal.x>0?e.max.x:e.min.x,Fa.y=r.normal.y>0?e.max.y:e.min.y,Fa.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(Fa)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function Yp(){let n=null,e=!1,t=null,i=null;function r(s,a){t(s,a),i=n.requestAnimationFrame(r)}return{start:function(){e!==!0&&t!==null&&(i=n.requestAnimationFrame(r),e=!0)},stop:function(){n.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(s){t=s},setContext:function(s){n=s}}}function j_(n){const e=new WeakMap;function t(o,l){const c=o.array,u=o.usage,h=c.byteLength,d=n.createBuffer();n.bindBuffer(l,d),n.bufferData(l,c,u),o.onUploadCallback();let f;if(c instanceof Float32Array)f=n.FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?f=n.HALF_FLOAT:f=n.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=n.SHORT;else if(c instanceof Uint32Array)f=n.UNSIGNED_INT;else if(c instanceof Int32Array)f=n.INT;else if(c instanceof Int8Array)f=n.BYTE;else if(c instanceof Uint8Array)f=n.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:h}}function i(o,l,c){const u=l.array,h=l.updateRanges;if(n.bindBuffer(c,o),h.length===0)n.bufferSubData(c,0,u);else{h.sort((f,m)=>f.start-m.start);let d=0;for(let f=1;f<h.length;f++){const m=h[d],_=h[f];_.start<=m.start+m.count+1?m.count=Math.max(m.count,_.start+_.count-m.start):(++d,h[d]=_)}h.length=d+1;for(let f=0,m=h.length;f<m;f++){const _=h[f];n.bufferSubData(c,_.start*u.BYTES_PER_ELEMENT,u,_.start,_.count)}l.clearUpdateRanges()}l.onUploadCallback()}function r(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function s(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=e.get(o);l&&(n.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const u=e.get(o);(!u||u.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,o,l),c.version=o.version}}return{get:r,remove:s,update:a}}class es extends _t{constructor(e=1,t=1,i=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:r};const s=e/2,a=t/2,o=Math.floor(i),l=Math.floor(r),c=o+1,u=l+1,h=e/o,d=t/l,f=[],m=[],_=[],g=[];for(let p=0;p<u;p++){const y=p*d-a;for(let x=0;x<c;x++){const v=x*h-s;m.push(v,-y,0),_.push(0,0,1),g.push(x/o),g.push(1-p/l)}}for(let p=0;p<l;p++)for(let y=0;y<o;y++){const x=y+c*p,v=y+c*(p+1),w=y+1+c*(p+1),b=y+1+c*p;f.push(x,v,b),f.push(v,w,b)}this.setIndex(f),this.setAttribute("position",new at(m,3)),this.setAttribute("normal",new at(_,3)),this.setAttribute("uv",new at(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new es(e.width,e.height,e.widthSegments,e.heightSegments)}}var Y_=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,$_=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,K_=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Z_=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,J_=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Q_=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,e0=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,t0=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,n0=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,i0=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,r0=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,s0=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,a0=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,o0=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,l0=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,c0=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,u0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,h0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,d0=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,f0=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,p0=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,m0=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,g0=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,_0=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,x0=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,v0=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,y0=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,M0=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,T0=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,S0=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,E0="gl_FragColor = linearToOutputTexel( gl_FragColor );",b0=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,A0=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,w0=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,R0=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,C0=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,P0=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,L0=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,I0=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,D0=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,U0=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,N0=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,F0=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,O0=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,B0=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,k0=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,z0=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,V0=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,H0=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,G0=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,W0=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,X0=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,q0=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,j0=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Y0=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,$0=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,K0=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Z0=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,J0=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Q0=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,ex=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,tx=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,nx=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,ix=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,rx=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,sx=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,ax=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,ox=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,lx=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,cx=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,ux=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,hx=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,dx=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,fx=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,px=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,mx=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,gx=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,_x=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,xx=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,vx=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,yx=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Mx=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Tx=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,Sx=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Ex=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,bx=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Ax=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,wx=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Rx=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Cx=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,Px=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Lx=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Ix=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Dx=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Ux=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Nx=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Fx=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Ox=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Bx=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,kx=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,zx=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Vx=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Hx=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
		
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
		
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		
		#else
		
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Gx=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Wx=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Xx=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,qx=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const jx=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Yx=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,$x=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Kx=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Zx=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Jx=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Qx=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,ev=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,tv=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,nv=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,iv=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,rv=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,sv=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,av=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,ov=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,lv=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,cv=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,uv=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,hv=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,dv=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,fv=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,pv=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,mv=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,gv=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,_v=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,xv=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,vv=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,yv=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Mv=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,Tv=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Sv=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Ev=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,bv=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Av=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Ve={alphahash_fragment:Y_,alphahash_pars_fragment:$_,alphamap_fragment:K_,alphamap_pars_fragment:Z_,alphatest_fragment:J_,alphatest_pars_fragment:Q_,aomap_fragment:e0,aomap_pars_fragment:t0,batching_pars_vertex:n0,batching_vertex:i0,begin_vertex:r0,beginnormal_vertex:s0,bsdfs:a0,iridescence_fragment:o0,bumpmap_pars_fragment:l0,clipping_planes_fragment:c0,clipping_planes_pars_fragment:u0,clipping_planes_pars_vertex:h0,clipping_planes_vertex:d0,color_fragment:f0,color_pars_fragment:p0,color_pars_vertex:m0,color_vertex:g0,common:_0,cube_uv_reflection_fragment:x0,defaultnormal_vertex:v0,displacementmap_pars_vertex:y0,displacementmap_vertex:M0,emissivemap_fragment:T0,emissivemap_pars_fragment:S0,colorspace_fragment:E0,colorspace_pars_fragment:b0,envmap_fragment:A0,envmap_common_pars_fragment:w0,envmap_pars_fragment:R0,envmap_pars_vertex:C0,envmap_physical_pars_fragment:z0,envmap_vertex:P0,fog_vertex:L0,fog_pars_vertex:I0,fog_fragment:D0,fog_pars_fragment:U0,gradientmap_pars_fragment:N0,lightmap_pars_fragment:F0,lights_lambert_fragment:O0,lights_lambert_pars_fragment:B0,lights_pars_begin:k0,lights_toon_fragment:V0,lights_toon_pars_fragment:H0,lights_phong_fragment:G0,lights_phong_pars_fragment:W0,lights_physical_fragment:X0,lights_physical_pars_fragment:q0,lights_fragment_begin:j0,lights_fragment_maps:Y0,lights_fragment_end:$0,logdepthbuf_fragment:K0,logdepthbuf_pars_fragment:Z0,logdepthbuf_pars_vertex:J0,logdepthbuf_vertex:Q0,map_fragment:ex,map_pars_fragment:tx,map_particle_fragment:nx,map_particle_pars_fragment:ix,metalnessmap_fragment:rx,metalnessmap_pars_fragment:sx,morphinstance_vertex:ax,morphcolor_vertex:ox,morphnormal_vertex:lx,morphtarget_pars_vertex:cx,morphtarget_vertex:ux,normal_fragment_begin:hx,normal_fragment_maps:dx,normal_pars_fragment:fx,normal_pars_vertex:px,normal_vertex:mx,normalmap_pars_fragment:gx,clearcoat_normal_fragment_begin:_x,clearcoat_normal_fragment_maps:xx,clearcoat_pars_fragment:vx,iridescence_pars_fragment:yx,opaque_fragment:Mx,packing:Tx,premultiplied_alpha_fragment:Sx,project_vertex:Ex,dithering_fragment:bx,dithering_pars_fragment:Ax,roughnessmap_fragment:wx,roughnessmap_pars_fragment:Rx,shadowmap_pars_fragment:Cx,shadowmap_pars_vertex:Px,shadowmap_vertex:Lx,shadowmask_pars_fragment:Ix,skinbase_vertex:Dx,skinning_pars_vertex:Ux,skinning_vertex:Nx,skinnormal_vertex:Fx,specularmap_fragment:Ox,specularmap_pars_fragment:Bx,tonemapping_fragment:kx,tonemapping_pars_fragment:zx,transmission_fragment:Vx,transmission_pars_fragment:Hx,uv_pars_fragment:Gx,uv_pars_vertex:Wx,uv_vertex:Xx,worldpos_vertex:qx,background_vert:jx,background_frag:Yx,backgroundCube_vert:$x,backgroundCube_frag:Kx,cube_vert:Zx,cube_frag:Jx,depth_vert:Qx,depth_frag:ev,distanceRGBA_vert:tv,distanceRGBA_frag:nv,equirect_vert:iv,equirect_frag:rv,linedashed_vert:sv,linedashed_frag:av,meshbasic_vert:ov,meshbasic_frag:lv,meshlambert_vert:cv,meshlambert_frag:uv,meshmatcap_vert:hv,meshmatcap_frag:dv,meshnormal_vert:fv,meshnormal_frag:pv,meshphong_vert:mv,meshphong_frag:gv,meshphysical_vert:_v,meshphysical_frag:xv,meshtoon_vert:vv,meshtoon_frag:yv,points_vert:Mv,points_frag:Tv,shadow_vert:Sv,shadow_frag:Ev,sprite_vert:bv,sprite_frag:Av},se={common:{diffuse:{value:new we(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ne},alphaMap:{value:null},alphaMapTransform:{value:new Ne},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ne}},envmap:{envMap:{value:null},envMapRotation:{value:new Ne},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ne}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ne}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ne},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ne},normalScale:{value:new fe(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ne},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ne}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ne}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ne}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new we(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new we(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ne},alphaTest:{value:0},uvTransform:{value:new Ne}},sprite:{diffuse:{value:new we(16777215)},opacity:{value:1},center:{value:new fe(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ne},alphaMap:{value:null},alphaMapTransform:{value:new Ne},alphaTest:{value:0}}},On={basic:{uniforms:Xt([se.common,se.specularmap,se.envmap,se.aomap,se.lightmap,se.fog]),vertexShader:Ve.meshbasic_vert,fragmentShader:Ve.meshbasic_frag},lambert:{uniforms:Xt([se.common,se.specularmap,se.envmap,se.aomap,se.lightmap,se.emissivemap,se.bumpmap,se.normalmap,se.displacementmap,se.fog,se.lights,{emissive:{value:new we(0)}}]),vertexShader:Ve.meshlambert_vert,fragmentShader:Ve.meshlambert_frag},phong:{uniforms:Xt([se.common,se.specularmap,se.envmap,se.aomap,se.lightmap,se.emissivemap,se.bumpmap,se.normalmap,se.displacementmap,se.fog,se.lights,{emissive:{value:new we(0)},specular:{value:new we(1118481)},shininess:{value:30}}]),vertexShader:Ve.meshphong_vert,fragmentShader:Ve.meshphong_frag},standard:{uniforms:Xt([se.common,se.envmap,se.aomap,se.lightmap,se.emissivemap,se.bumpmap,se.normalmap,se.displacementmap,se.roughnessmap,se.metalnessmap,se.fog,se.lights,{emissive:{value:new we(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ve.meshphysical_vert,fragmentShader:Ve.meshphysical_frag},toon:{uniforms:Xt([se.common,se.aomap,se.lightmap,se.emissivemap,se.bumpmap,se.normalmap,se.displacementmap,se.gradientmap,se.fog,se.lights,{emissive:{value:new we(0)}}]),vertexShader:Ve.meshtoon_vert,fragmentShader:Ve.meshtoon_frag},matcap:{uniforms:Xt([se.common,se.bumpmap,se.normalmap,se.displacementmap,se.fog,{matcap:{value:null}}]),vertexShader:Ve.meshmatcap_vert,fragmentShader:Ve.meshmatcap_frag},points:{uniforms:Xt([se.points,se.fog]),vertexShader:Ve.points_vert,fragmentShader:Ve.points_frag},dashed:{uniforms:Xt([se.common,se.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ve.linedashed_vert,fragmentShader:Ve.linedashed_frag},depth:{uniforms:Xt([se.common,se.displacementmap]),vertexShader:Ve.depth_vert,fragmentShader:Ve.depth_frag},normal:{uniforms:Xt([se.common,se.bumpmap,se.normalmap,se.displacementmap,{opacity:{value:1}}]),vertexShader:Ve.meshnormal_vert,fragmentShader:Ve.meshnormal_frag},sprite:{uniforms:Xt([se.sprite,se.fog]),vertexShader:Ve.sprite_vert,fragmentShader:Ve.sprite_frag},background:{uniforms:{uvTransform:{value:new Ne},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ve.background_vert,fragmentShader:Ve.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ne}},vertexShader:Ve.backgroundCube_vert,fragmentShader:Ve.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ve.cube_vert,fragmentShader:Ve.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ve.equirect_vert,fragmentShader:Ve.equirect_frag},distanceRGBA:{uniforms:Xt([se.common,se.displacementmap,{referencePosition:{value:new P},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ve.distanceRGBA_vert,fragmentShader:Ve.distanceRGBA_frag},shadow:{uniforms:Xt([se.lights,se.fog,{color:{value:new we(0)},opacity:{value:1}}]),vertexShader:Ve.shadow_vert,fragmentShader:Ve.shadow_frag}};On.physical={uniforms:Xt([On.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ne},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ne},clearcoatNormalScale:{value:new fe(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ne},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ne},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ne},sheen:{value:0},sheenColor:{value:new we(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ne},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ne},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ne},transmissionSamplerSize:{value:new fe},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ne},attenuationDistance:{value:0},attenuationColor:{value:new we(0)},specularColor:{value:new we(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ne},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ne},anisotropyVector:{value:new fe},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ne}}]),vertexShader:Ve.meshphysical_vert,fragmentShader:Ve.meshphysical_frag};const Oa={r:0,b:0,g:0},Wi=new Dn,wv=new ge;function Rv(n,e,t,i,r,s,a){const o=new we(0);let l=s===!0?0:1,c,u,h=null,d=0,f=null;function m(y){let x=y.isScene===!0?y.background:null;return x&&x.isTexture&&(x=(y.backgroundBlurriness>0?t:e).get(x)),x}function _(y){let x=!1;const v=m(y);v===null?p(o,l):v&&v.isColor&&(p(v,1),x=!0);const w=n.xr.getEnvironmentBlendMode();w==="additive"?i.buffers.color.setClear(0,0,0,1,a):w==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,a),(n.autoClear||x)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function g(y,x){const v=m(x);v&&(v.isCubeTexture||v.mapping===il)?(u===void 0&&(u=new He(new gn(1,1,1),new Vn({name:"BackgroundCubeMaterial",uniforms:Qr(On.backgroundCube.uniforms),vertexShader:On.backgroundCube.vertexShader,fragmentShader:On.backgroundCube.fragmentShader,side:$t,depthTest:!1,depthWrite:!1,fog:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(w,b,A){this.matrixWorld.copyPosition(A.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(u)),Wi.copy(x.backgroundRotation),Wi.x*=-1,Wi.y*=-1,Wi.z*=-1,v.isCubeTexture&&v.isRenderTargetTexture===!1&&(Wi.y*=-1,Wi.z*=-1),u.material.uniforms.envMap.value=v,u.material.uniforms.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=x.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(wv.makeRotationFromEuler(Wi)),u.material.toneMapped=Xe.getTransfer(v.colorSpace)!==ot,(h!==v||d!==v.version||f!==n.toneMapping)&&(u.material.needsUpdate=!0,h=v,d=v.version,f=n.toneMapping),u.layers.enableAll(),y.unshift(u,u.geometry,u.material,0,0,null)):v&&v.isTexture&&(c===void 0&&(c=new He(new es(2,2),new Vn({name:"BackgroundMaterial",uniforms:Qr(On.background.uniforms),vertexShader:On.background.vertexShader,fragmentShader:On.background.fragmentShader,side:di,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(c)),c.material.uniforms.t2D.value=v,c.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,c.material.toneMapped=Xe.getTransfer(v.colorSpace)!==ot,v.matrixAutoUpdate===!0&&v.updateMatrix(),c.material.uniforms.uvTransform.value.copy(v.matrix),(h!==v||d!==v.version||f!==n.toneMapping)&&(c.material.needsUpdate=!0,h=v,d=v.version,f=n.toneMapping),c.layers.enableAll(),y.unshift(c,c.geometry,c.material,0,0,null))}function p(y,x){y.getRGB(Oa,Xp(n)),i.buffers.color.setClear(Oa.r,Oa.g,Oa.b,x,a)}return{getClearColor:function(){return o},setClearColor:function(y,x=1){o.set(y),l=x,p(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(y){l=y,p(o,l)},render:_,addToRenderList:g}}function Cv(n,e){const t=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},r=d(null);let s=r,a=!1;function o(M,L,z,I,q){let k=!1;const O=h(I,z,L);s!==O&&(s=O,c(s.object)),k=f(M,I,z,q),k&&m(M,I,z,q),q!==null&&e.update(q,n.ELEMENT_ARRAY_BUFFER),(k||a)&&(a=!1,v(M,L,z,I),q!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get(q).buffer))}function l(){return n.createVertexArray()}function c(M){return n.bindVertexArray(M)}function u(M){return n.deleteVertexArray(M)}function h(M,L,z){const I=z.wireframe===!0;let q=i[M.id];q===void 0&&(q={},i[M.id]=q);let k=q[L.id];k===void 0&&(k={},q[L.id]=k);let O=k[I];return O===void 0&&(O=d(l()),k[I]=O),O}function d(M){const L=[],z=[],I=[];for(let q=0;q<t;q++)L[q]=0,z[q]=0,I[q]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:L,enabledAttributes:z,attributeDivisors:I,object:M,attributes:{},index:null}}function f(M,L,z,I){const q=s.attributes,k=L.attributes;let O=0;const j=z.getAttributes();for(const B in j)if(j[B].location>=0){const Q=q[B];let ie=k[B];if(ie===void 0&&(B==="instanceMatrix"&&M.instanceMatrix&&(ie=M.instanceMatrix),B==="instanceColor"&&M.instanceColor&&(ie=M.instanceColor)),Q===void 0||Q.attribute!==ie||ie&&Q.data!==ie.data)return!0;O++}return s.attributesNum!==O||s.index!==I}function m(M,L,z,I){const q={},k=L.attributes;let O=0;const j=z.getAttributes();for(const B in j)if(j[B].location>=0){let Q=k[B];Q===void 0&&(B==="instanceMatrix"&&M.instanceMatrix&&(Q=M.instanceMatrix),B==="instanceColor"&&M.instanceColor&&(Q=M.instanceColor));const ie={};ie.attribute=Q,Q&&Q.data&&(ie.data=Q.data),q[B]=ie,O++}s.attributes=q,s.attributesNum=O,s.index=I}function _(){const M=s.newAttributes;for(let L=0,z=M.length;L<z;L++)M[L]=0}function g(M){p(M,0)}function p(M,L){const z=s.newAttributes,I=s.enabledAttributes,q=s.attributeDivisors;z[M]=1,I[M]===0&&(n.enableVertexAttribArray(M),I[M]=1),q[M]!==L&&(n.vertexAttribDivisor(M,L),q[M]=L)}function y(){const M=s.newAttributes,L=s.enabledAttributes;for(let z=0,I=L.length;z<I;z++)L[z]!==M[z]&&(n.disableVertexAttribArray(z),L[z]=0)}function x(M,L,z,I,q,k,O){O===!0?n.vertexAttribIPointer(M,L,z,q,k):n.vertexAttribPointer(M,L,z,I,q,k)}function v(M,L,z,I){_();const q=I.attributes,k=z.getAttributes(),O=L.defaultAttributeValues;for(const j in k){const B=k[j];if(B.location>=0){let G=q[j];if(G===void 0&&(j==="instanceMatrix"&&M.instanceMatrix&&(G=M.instanceMatrix),j==="instanceColor"&&M.instanceColor&&(G=M.instanceColor)),G!==void 0){const Q=G.normalized,ie=G.itemSize,me=e.get(G);if(me===void 0)continue;const xe=me.buffer,H=me.type,K=me.bytesPerElement,oe=H===n.INT||H===n.UNSIGNED_INT||G.gpuType===wu;if(G.isInterleavedBufferAttribute){const re=G.data,Ae=re.stride,Ce=G.offset;if(re.isInstancedInterleavedBuffer){for(let ke=0;ke<B.locationSize;ke++)p(B.location+ke,re.meshPerAttribute);M.isInstancedMesh!==!0&&I._maxInstanceCount===void 0&&(I._maxInstanceCount=re.meshPerAttribute*re.count)}else for(let ke=0;ke<B.locationSize;ke++)g(B.location+ke);n.bindBuffer(n.ARRAY_BUFFER,xe);for(let ke=0;ke<B.locationSize;ke++)x(B.location+ke,ie/B.locationSize,H,Q,Ae*K,(Ce+ie/B.locationSize*ke)*K,oe)}else{if(G.isInstancedBufferAttribute){for(let re=0;re<B.locationSize;re++)p(B.location+re,G.meshPerAttribute);M.isInstancedMesh!==!0&&I._maxInstanceCount===void 0&&(I._maxInstanceCount=G.meshPerAttribute*G.count)}else for(let re=0;re<B.locationSize;re++)g(B.location+re);n.bindBuffer(n.ARRAY_BUFFER,xe);for(let re=0;re<B.locationSize;re++)x(B.location+re,ie/B.locationSize,H,Q,ie*K,ie/B.locationSize*re*K,oe)}}else if(O!==void 0){const Q=O[j];if(Q!==void 0)switch(Q.length){case 2:n.vertexAttrib2fv(B.location,Q);break;case 3:n.vertexAttrib3fv(B.location,Q);break;case 4:n.vertexAttrib4fv(B.location,Q);break;default:n.vertexAttrib1fv(B.location,Q)}}}}y()}function w(){R();for(const M in i){const L=i[M];for(const z in L){const I=L[z];for(const q in I)u(I[q].object),delete I[q];delete L[z]}delete i[M]}}function b(M){if(i[M.id]===void 0)return;const L=i[M.id];for(const z in L){const I=L[z];for(const q in I)u(I[q].object),delete I[q];delete L[z]}delete i[M.id]}function A(M){for(const L in i){const z=i[L];if(z[M.id]===void 0)continue;const I=z[M.id];for(const q in I)u(I[q].object),delete I[q];delete z[M.id]}}function R(){T(),a=!0,s!==r&&(s=r,c(s.object))}function T(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:o,reset:R,resetDefaultState:T,dispose:w,releaseStatesOfGeometry:b,releaseStatesOfProgram:A,initAttributes:_,enableAttribute:g,disableUnusedAttributes:y}}function Pv(n,e,t){let i;function r(c){i=c}function s(c,u){n.drawArrays(i,c,u),t.update(u,i,1)}function a(c,u,h){h!==0&&(n.drawArraysInstanced(i,c,u,h),t.update(u,i,h))}function o(c,u,h){if(h===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,c,0,u,0,h);let f=0;for(let m=0;m<h;m++)f+=u[m];t.update(f,i,1)}function l(c,u,h,d){if(h===0)return;const f=e.get("WEBGL_multi_draw");if(f===null)for(let m=0;m<c.length;m++)a(c[m],u[m],d[m]);else{f.multiDrawArraysInstancedWEBGL(i,c,0,u,0,d,0,h);let m=0;for(let _=0;_<h;_++)m+=u[_]*d[_];t.update(m,i,1)}}this.setMode=r,this.render=s,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=l}function Lv(n,e,t,i){let r;function s(){if(r!==void 0)return r;if(e.has("EXT_texture_filter_anisotropic")===!0){const A=e.get("EXT_texture_filter_anisotropic");r=n.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function a(A){return!(A!==_n&&i.convert(A)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(A){const R=A===ha&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(A!==In&&i.convert(A)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&A!==wn&&!R)}function l(A){if(A==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const u=l(c);u!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);const h=t.logarithmicDepthBuffer===!0,d=t.reverseDepthBuffer===!0&&e.has("EXT_clip_control"),f=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),m=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=n.getParameter(n.MAX_TEXTURE_SIZE),g=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),p=n.getParameter(n.MAX_VERTEX_ATTRIBS),y=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),x=n.getParameter(n.MAX_VARYING_VECTORS),v=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),w=m>0,b=n.getParameter(n.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:h,reverseDepthBuffer:d,maxTextures:f,maxVertexTextures:m,maxTextureSize:_,maxCubemapSize:g,maxAttributes:p,maxVertexUniforms:y,maxVaryings:x,maxFragmentUniforms:v,vertexTextures:w,maxSamples:b}}function Iv(n){const e=this;let t=null,i=0,r=!1,s=!1;const a=new Ri,o=new Ne,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(h,d){const f=h.length!==0||d||i!==0||r;return r=d,i=h.length,f},this.beginShadows=function(){s=!0,u(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(h,d){t=u(h,d,0)},this.setState=function(h,d,f){const m=h.clippingPlanes,_=h.clipIntersection,g=h.clipShadows,p=n.get(h);if(!r||m===null||m.length===0||s&&!g)s?u(null):c();else{const y=s?0:i,x=y*4;let v=p.clippingState||null;l.value=v,v=u(m,d,x,f);for(let w=0;w!==x;++w)v[w]=t[w];p.clippingState=v,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=y}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function u(h,d,f,m){const _=h!==null?h.length:0;let g=null;if(_!==0){if(g=l.value,m!==!0||g===null){const p=f+_*4,y=d.matrixWorldInverse;o.getNormalMatrix(y),(g===null||g.length<p)&&(g=new Float32Array(p));for(let x=0,v=f;x!==_;++x,v+=4)a.copy(h[x]).applyMatrix4(y,o),a.normal.toArray(g,v),g[v+3]=a.constant}l.value=g,l.needsUpdate=!0}return e.numPlanes=_,e.numIntersection=0,g}}function Dv(n){let e=new WeakMap;function t(a,o){return o===Co?a.mapping=jr:o===Uc&&(a.mapping=Yr),a}function i(a){if(a&&a.isTexture){const o=a.mapping;if(o===Co||o===Uc)if(e.has(a)){const l=e.get(a).texture;return t(l,a.mapping)}else{const l=a.image;if(l&&l.height>0){const c=new W_(l.height);return c.fromEquirectangularTexture(n,a),e.set(a,c),a.addEventListener("dispose",r),t(c.texture,a.mapping)}else return null}}return a}function r(a){const o=a.target;o.removeEventListener("dispose",r);const l=e.get(o);l!==void 0&&(e.delete(o),l.dispose())}function s(){e=new WeakMap}return{get:i,dispose:s}}class ol extends qp{constructor(e=-1,t=1,i=1,r=-1,s=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=r,this.near=s,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,r,s,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let s=i-e,a=i+e,o=r+t,l=r-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,a=s+c*this.view.width,o-=u*this.view.offsetY,l=o-u*this.view.height}this.projectionMatrix.makeOrthographic(s,a,o,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}const kr=4,Zh=[.125,.215,.35,.446,.526,.582],Qi=20,Fl=new ol,Jh=new we;let Ol=null,Bl=0,kl=0,zl=!1;const Zi=(1+Math.sqrt(5))/2,br=1/Zi,Qh=[new P(-Zi,br,0),new P(Zi,br,0),new P(-br,0,Zi),new P(br,0,Zi),new P(0,Zi,-br),new P(0,Zi,br),new P(-1,1,-1),new P(1,1,-1),new P(-1,1,1),new P(1,1,1)];class ed{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,i=.1,r=100){Ol=this._renderer.getRenderTarget(),Bl=this._renderer.getActiveCubeFace(),kl=this._renderer.getActiveMipmapLevel(),zl=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(e,i,r,s),t>0&&this._blur(s,0,0,t),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=id(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=nd(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Ol,Bl,kl),this._renderer.xr.enabled=zl,e.scissorTest=!1,Ba(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===jr||e.mapping===Yr?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Ol=this._renderer.getRenderTarget(),Bl=this._renderer.getActiveCubeFace(),kl=this._renderer.getActiveMipmapLevel(),zl=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:Yt,minFilter:Yt,generateMipmaps:!1,type:ha,format:_n,colorSpace:zt,depthBuffer:!1},r=td(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=td(e,t,i);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Uv(s)),this._blurMaterial=Nv(s,e,t)}return r}_compileMaterial(e){const t=new He(this._lodPlanes[0],e);this._renderer.compile(t,Fl)}_sceneToCubeUV(e,t,i,r){const o=new Ot(90,1,t,i),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],u=this._renderer,h=u.autoClear,d=u.toneMapping;u.getClearColor(Jh),u.toneMapping=Oi,u.autoClear=!1;const f=new ln({name:"PMREM.Background",side:$t,depthWrite:!1,depthTest:!1}),m=new He(new gn,f);let _=!1;const g=e.background;g?g.isColor&&(f.color.copy(g),e.background=null,_=!0):(f.color.copy(Jh),_=!0);for(let p=0;p<6;p++){const y=p%3;y===0?(o.up.set(0,l[p],0),o.lookAt(c[p],0,0)):y===1?(o.up.set(0,0,l[p]),o.lookAt(0,c[p],0)):(o.up.set(0,l[p],0),o.lookAt(0,0,c[p]));const x=this._cubeSize;Ba(r,y*x,p>2?x:0,x,x),u.setRenderTarget(r),_&&u.render(m,o),u.render(e,o)}m.geometry.dispose(),m.material.dispose(),u.toneMapping=d,u.autoClear=h,e.background=g}_textureToCubeUV(e,t){const i=this._renderer,r=e.mapping===jr||e.mapping===Yr;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=id()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=nd());const s=r?this._cubemapMaterial:this._equirectMaterial,a=new He(this._lodPlanes[0],s),o=s.uniforms;o.envMap.value=e;const l=this._cubeSize;Ba(t,0,0,3*l,2*l),i.setRenderTarget(t),i.render(a,Fl)}_applyPMREM(e){const t=this._renderer,i=t.autoClear;t.autoClear=!1;const r=this._lodPlanes.length;for(let s=1;s<r;s++){const a=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),o=Qh[(r-s-1)%Qh.length];this._blur(e,s-1,s,a,o)}t.autoClear=i}_blur(e,t,i,r,s){const a=this._pingPongRenderTarget;this._halfBlur(e,a,t,i,r,"latitudinal",s),this._halfBlur(a,e,i,i,r,"longitudinal",s)}_halfBlur(e,t,i,r,s,a,o){const l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const u=3,h=new He(this._lodPlanes[r],c),d=c.uniforms,f=this._sizeLods[i]-1,m=isFinite(s)?Math.PI/(2*f):2*Math.PI/(2*Qi-1),_=s/m,g=isFinite(s)?1+Math.floor(u*_):Qi;g>Qi&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${Qi}`);const p=[];let y=0;for(let A=0;A<Qi;++A){const R=A/_,T=Math.exp(-R*R/2);p.push(T),A===0?y+=T:A<g&&(y+=2*T)}for(let A=0;A<p.length;A++)p[A]=p[A]/y;d.envMap.value=e.texture,d.samples.value=g,d.weights.value=p,d.latitudinal.value=a==="latitudinal",o&&(d.poleAxis.value=o);const{_lodMax:x}=this;d.dTheta.value=m,d.mipInt.value=x-i;const v=this._sizeLods[r],w=3*v*(r>x-kr?r-x+kr:0),b=4*(this._cubeSize-v);Ba(t,w,b,3*v,2*v),l.setRenderTarget(t),l.render(h,Fl)}}function Uv(n){const e=[],t=[],i=[];let r=n;const s=n-kr+1+Zh.length;for(let a=0;a<s;a++){const o=Math.pow(2,r);t.push(o);let l=1/o;a>n-kr?l=Zh[a-n+kr-1]:a===0&&(l=0),i.push(l);const c=1/(o-2),u=-c,h=1+c,d=[u,u,h,u,h,h,u,u,h,h,u,h],f=6,m=6,_=3,g=2,p=1,y=new Float32Array(_*m*f),x=new Float32Array(g*m*f),v=new Float32Array(p*m*f);for(let b=0;b<f;b++){const A=b%3*2/3-1,R=b>2?0:-1,T=[A,R,0,A+2/3,R,0,A+2/3,R+1,0,A,R,0,A+2/3,R+1,0,A,R+1,0];y.set(T,_*m*b),x.set(d,g*m*b);const M=[b,b,b,b,b,b];v.set(M,p*m*b)}const w=new _t;w.setAttribute("position",new je(y,_)),w.setAttribute("uv",new je(x,g)),w.setAttribute("faceIndex",new je(v,p)),e.push(w),r>kr&&r--}return{lodPlanes:e,sizeLods:t,sigmas:i}}function td(n,e,t){const i=new fi(n,e,t);return i.texture.mapping=il,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Ba(n,e,t,i,r){n.viewport.set(e,t,i,r),n.scissor.set(e,t,i,r)}function Nv(n,e,t){const i=new Float32Array(Qi),r=new P(0,1,0);return new Vn({name:"SphericalGaussianBlur",defines:{n:Qi,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:Fu(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Fi,depthTest:!1,depthWrite:!1})}function nd(){return new Vn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Fu(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Fi,depthTest:!1,depthWrite:!1})}function id(){return new Vn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Fu(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Fi,depthTest:!1,depthWrite:!1})}function Fu(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function Fv(n){let e=new WeakMap,t=null;function i(o){if(o&&o.isTexture){const l=o.mapping,c=l===Co||l===Uc,u=l===jr||l===Yr;if(c||u){let h=e.get(o);const d=h!==void 0?h.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==d)return t===null&&(t=new ed(n)),h=c?t.fromEquirectangular(o,h):t.fromCubemap(o,h),h.texture.pmremVersion=o.pmremVersion,e.set(o,h),h.texture;if(h!==void 0)return h.texture;{const f=o.image;return c&&f&&f.height>0||u&&f&&r(f)?(t===null&&(t=new ed(n)),h=c?t.fromEquirectangular(o):t.fromCubemap(o),h.texture.pmremVersion=o.pmremVersion,e.set(o,h),o.addEventListener("dispose",s),h.texture):null}}}return o}function r(o){let l=0;const c=6;for(let u=0;u<c;u++)o[u]!==void 0&&l++;return l===c}function s(o){const l=o.target;l.removeEventListener("dispose",s);const c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function a(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:i,dispose:a}}function Ov(n){const e={};function t(i){if(e[i]!==void 0)return e[i];let r;switch(i){case"WEBGL_depth_texture":r=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":r=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":r=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":r=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:r=n.getExtension(i)}return e[i]=r,r}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){const r=t(i);return r===null&&Fs("THREE.WebGLRenderer: "+i+" extension not supported."),r}}}function Bv(n,e,t,i){const r={},s=new WeakMap;function a(h){const d=h.target;d.index!==null&&e.remove(d.index);for(const m in d.attributes)e.remove(d.attributes[m]);for(const m in d.morphAttributes){const _=d.morphAttributes[m];for(let g=0,p=_.length;g<p;g++)e.remove(_[g])}d.removeEventListener("dispose",a),delete r[d.id];const f=s.get(d);f&&(e.remove(f),s.delete(d)),i.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,t.memory.geometries--}function o(h,d){return r[d.id]===!0||(d.addEventListener("dispose",a),r[d.id]=!0,t.memory.geometries++),d}function l(h){const d=h.attributes;for(const m in d)e.update(d[m],n.ARRAY_BUFFER);const f=h.morphAttributes;for(const m in f){const _=f[m];for(let g=0,p=_.length;g<p;g++)e.update(_[g],n.ARRAY_BUFFER)}}function c(h){const d=[],f=h.index,m=h.attributes.position;let _=0;if(f!==null){const y=f.array;_=f.version;for(let x=0,v=y.length;x<v;x+=3){const w=y[x+0],b=y[x+1],A=y[x+2];d.push(w,b,b,A,A,w)}}else if(m!==void 0){const y=m.array;_=m.version;for(let x=0,v=y.length/3-1;x<v;x+=3){const w=x+0,b=x+1,A=x+2;d.push(w,b,b,A,A,w)}}else return;const g=new(kp(d)?Wp:Gp)(d,1);g.version=_;const p=s.get(h);p&&e.remove(p),s.set(h,g)}function u(h){const d=s.get(h);if(d){const f=h.index;f!==null&&d.version<f.version&&c(h)}else c(h);return s.get(h)}return{get:o,update:l,getWireframeAttribute:u}}function kv(n,e,t){let i;function r(d){i=d}let s,a;function o(d){s=d.type,a=d.bytesPerElement}function l(d,f){n.drawElements(i,f,s,d*a),t.update(f,i,1)}function c(d,f,m){m!==0&&(n.drawElementsInstanced(i,f,s,d*a,m),t.update(f,i,m))}function u(d,f,m){if(m===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,f,0,s,d,0,m);let g=0;for(let p=0;p<m;p++)g+=f[p];t.update(g,i,1)}function h(d,f,m,_){if(m===0)return;const g=e.get("WEBGL_multi_draw");if(g===null)for(let p=0;p<d.length;p++)c(d[p]/a,f[p],_[p]);else{g.multiDrawElementsInstancedWEBGL(i,f,0,s,d,0,_,0,m);let p=0;for(let y=0;y<m;y++)p+=f[y]*_[y];t.update(p,i,1)}}this.setMode=r,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=u,this.renderMultiDrawInstances=h}function zv(n){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(s,a,o){switch(t.calls++,a){case n.TRIANGLES:t.triangles+=o*(s/3);break;case n.LINES:t.lines+=o*(s/2);break;case n.LINE_STRIP:t.lines+=o*(s-1);break;case n.LINE_LOOP:t.lines+=o*s;break;case n.POINTS:t.points+=o*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function r(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:r,update:i}}function Vv(n,e,t){const i=new WeakMap,r=new qe;function s(a,o,l){const c=a.morphTargetInfluences,u=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,h=u!==void 0?u.length:0;let d=i.get(o);if(d===void 0||d.count!==h){let M=function(){R.dispose(),i.delete(o),o.removeEventListener("dispose",M)};var f=M;d!==void 0&&d.texture.dispose();const m=o.morphAttributes.position!==void 0,_=o.morphAttributes.normal!==void 0,g=o.morphAttributes.color!==void 0,p=o.morphAttributes.position||[],y=o.morphAttributes.normal||[],x=o.morphAttributes.color||[];let v=0;m===!0&&(v=1),_===!0&&(v=2),g===!0&&(v=3);let w=o.attributes.position.count*v,b=1;w>e.maxTextureSize&&(b=Math.ceil(w/e.maxTextureSize),w=e.maxTextureSize);const A=new Float32Array(w*b*4*h),R=new Vp(A,w,b,h);R.type=wn,R.needsUpdate=!0;const T=v*4;for(let L=0;L<h;L++){const z=p[L],I=y[L],q=x[L],k=w*b*4*L;for(let O=0;O<z.count;O++){const j=O*T;m===!0&&(r.fromBufferAttribute(z,O),A[k+j+0]=r.x,A[k+j+1]=r.y,A[k+j+2]=r.z,A[k+j+3]=0),_===!0&&(r.fromBufferAttribute(I,O),A[k+j+4]=r.x,A[k+j+5]=r.y,A[k+j+6]=r.z,A[k+j+7]=0),g===!0&&(r.fromBufferAttribute(q,O),A[k+j+8]=r.x,A[k+j+9]=r.y,A[k+j+10]=r.z,A[k+j+11]=q.itemSize===4?r.w:1)}}d={count:h,texture:R,size:new fe(w,b)},i.set(o,d),o.addEventListener("dispose",M)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(n,"morphTexture",a.morphTexture,t);else{let m=0;for(let g=0;g<c.length;g++)m+=c[g];const _=o.morphTargetsRelative?1:1-m;l.getUniforms().setValue(n,"morphTargetBaseInfluence",_),l.getUniforms().setValue(n,"morphTargetInfluences",c)}l.getUniforms().setValue(n,"morphTargetsTexture",d.texture,t),l.getUniforms().setValue(n,"morphTargetsTextureSize",d.size)}return{update:s}}function Hv(n,e,t,i){let r=new WeakMap;function s(l){const c=i.render.frame,u=l.geometry,h=e.get(l,u);if(r.get(h)!==c&&(e.update(h),r.set(h,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),r.get(l)!==c&&(t.update(l.instanceMatrix,n.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,n.ARRAY_BUFFER),r.set(l,c))),l.isSkinnedMesh){const d=l.skeleton;r.get(d)!==c&&(d.update(),r.set(d,c))}return h}function a(){r=new WeakMap}function o(l){const c=l.target;c.removeEventListener("dispose",o),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:s,dispose:a}}class $p extends St{constructor(e,t,i,r,s,a,o,l,c,u=Vr){if(u!==Vr&&u!==Zr)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&u===Vr&&(i=ar),i===void 0&&u===Zr&&(i=Kr),super(null,r,s,a,o,l,u,i,c),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=o!==void 0?o:Kt,this.minFilter=l!==void 0?l:Kt,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}const Kp=new St,rd=new $p(1,1),Zp=new Vp,Jp=new R_,Qp=new jp,sd=[],ad=[],od=new Float32Array(16),ld=new Float32Array(9),cd=new Float32Array(4);function os(n,e,t){const i=n[0];if(i<=0||i>0)return n;const r=e*t;let s=sd[r];if(s===void 0&&(s=new Float32Array(r),sd[r]=s),e!==0){i.toArray(s,0);for(let a=1,o=0;a!==e;++a)o+=t,n[a].toArray(s,o)}return s}function bt(n,e){if(n.length!==e.length)return!1;for(let t=0,i=n.length;t<i;t++)if(n[t]!==e[t])return!1;return!0}function At(n,e){for(let t=0,i=e.length;t<i;t++)n[t]=e[t]}function ll(n,e){let t=ad[e];t===void 0&&(t=new Int32Array(e),ad[e]=t);for(let i=0;i!==e;++i)t[i]=n.allocateTextureUnit();return t}function Gv(n,e){const t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}function Wv(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(bt(t,e))return;n.uniform2fv(this.addr,e),At(t,e)}}function Xv(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(bt(t,e))return;n.uniform3fv(this.addr,e),At(t,e)}}function qv(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(bt(t,e))return;n.uniform4fv(this.addr,e),At(t,e)}}function jv(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(bt(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),At(t,e)}else{if(bt(t,i))return;cd.set(i),n.uniformMatrix2fv(this.addr,!1,cd),At(t,i)}}function Yv(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(bt(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),At(t,e)}else{if(bt(t,i))return;ld.set(i),n.uniformMatrix3fv(this.addr,!1,ld),At(t,i)}}function $v(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(bt(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),At(t,e)}else{if(bt(t,i))return;od.set(i),n.uniformMatrix4fv(this.addr,!1,od),At(t,i)}}function Kv(n,e){const t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}function Zv(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(bt(t,e))return;n.uniform2iv(this.addr,e),At(t,e)}}function Jv(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(bt(t,e))return;n.uniform3iv(this.addr,e),At(t,e)}}function Qv(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(bt(t,e))return;n.uniform4iv(this.addr,e),At(t,e)}}function ey(n,e){const t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}function ty(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(bt(t,e))return;n.uniform2uiv(this.addr,e),At(t,e)}}function ny(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(bt(t,e))return;n.uniform3uiv(this.addr,e),At(t,e)}}function iy(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(bt(t,e))return;n.uniform4uiv(this.addr,e),At(t,e)}}function ry(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r);let s;this.type===n.SAMPLER_2D_SHADOW?(rd.compareFunction=Bp,s=rd):s=Kp,t.setTexture2D(e||s,r)}function sy(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTexture3D(e||Jp,r)}function ay(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTextureCube(e||Qp,r)}function oy(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTexture2DArray(e||Zp,r)}function ly(n){switch(n){case 5126:return Gv;case 35664:return Wv;case 35665:return Xv;case 35666:return qv;case 35674:return jv;case 35675:return Yv;case 35676:return $v;case 5124:case 35670:return Kv;case 35667:case 35671:return Zv;case 35668:case 35672:return Jv;case 35669:case 35673:return Qv;case 5125:return ey;case 36294:return ty;case 36295:return ny;case 36296:return iy;case 35678:case 36198:case 36298:case 36306:case 35682:return ry;case 35679:case 36299:case 36307:return sy;case 35680:case 36300:case 36308:case 36293:return ay;case 36289:case 36303:case 36311:case 36292:return oy}}function cy(n,e){n.uniform1fv(this.addr,e)}function uy(n,e){const t=os(e,this.size,2);n.uniform2fv(this.addr,t)}function hy(n,e){const t=os(e,this.size,3);n.uniform3fv(this.addr,t)}function dy(n,e){const t=os(e,this.size,4);n.uniform4fv(this.addr,t)}function fy(n,e){const t=os(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}function py(n,e){const t=os(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}function my(n,e){const t=os(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}function gy(n,e){n.uniform1iv(this.addr,e)}function _y(n,e){n.uniform2iv(this.addr,e)}function xy(n,e){n.uniform3iv(this.addr,e)}function vy(n,e){n.uniform4iv(this.addr,e)}function yy(n,e){n.uniform1uiv(this.addr,e)}function My(n,e){n.uniform2uiv(this.addr,e)}function Ty(n,e){n.uniform3uiv(this.addr,e)}function Sy(n,e){n.uniform4uiv(this.addr,e)}function Ey(n,e,t){const i=this.cache,r=e.length,s=ll(t,r);bt(i,s)||(n.uniform1iv(this.addr,s),At(i,s));for(let a=0;a!==r;++a)t.setTexture2D(e[a]||Kp,s[a])}function by(n,e,t){const i=this.cache,r=e.length,s=ll(t,r);bt(i,s)||(n.uniform1iv(this.addr,s),At(i,s));for(let a=0;a!==r;++a)t.setTexture3D(e[a]||Jp,s[a])}function Ay(n,e,t){const i=this.cache,r=e.length,s=ll(t,r);bt(i,s)||(n.uniform1iv(this.addr,s),At(i,s));for(let a=0;a!==r;++a)t.setTextureCube(e[a]||Qp,s[a])}function wy(n,e,t){const i=this.cache,r=e.length,s=ll(t,r);bt(i,s)||(n.uniform1iv(this.addr,s),At(i,s));for(let a=0;a!==r;++a)t.setTexture2DArray(e[a]||Zp,s[a])}function Ry(n){switch(n){case 5126:return cy;case 35664:return uy;case 35665:return hy;case 35666:return dy;case 35674:return fy;case 35675:return py;case 35676:return my;case 5124:case 35670:return gy;case 35667:case 35671:return _y;case 35668:case 35672:return xy;case 35669:case 35673:return vy;case 5125:return yy;case 36294:return My;case 36295:return Ty;case 36296:return Sy;case 35678:case 36198:case 36298:case 36306:case 35682:return Ey;case 35679:case 36299:case 36307:return by;case 35680:case 36300:case 36308:case 36293:return Ay;case 36289:case 36303:case 36311:case 36292:return wy}}class Cy{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=ly(t.type)}}class Py{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Ry(t.type)}}class Ly{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){const r=this.seq;for(let s=0,a=r.length;s!==a;++s){const o=r[s];o.setValue(e,t[o.id],i)}}}const Vl=/(\w+)(\])?(\[|\.)?/g;function ud(n,e){n.seq.push(e),n.map[e.id]=e}function Iy(n,e,t){const i=n.name,r=i.length;for(Vl.lastIndex=0;;){const s=Vl.exec(i),a=Vl.lastIndex;let o=s[1];const l=s[2]==="]",c=s[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===r){ud(t,c===void 0?new Cy(o,n,e):new Py(o,n,e));break}else{let h=t.map[o];h===void 0&&(h=new Ly(o),ud(t,h)),t=h}}}class _o{constructor(e,t){this.seq=[],this.map={};const i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<i;++r){const s=e.getActiveUniform(t,r),a=e.getUniformLocation(t,s.name);Iy(s,a,this)}}setValue(e,t,i,r){const s=this.map[t];s!==void 0&&s.setValue(e,i,r)}setOptional(e,t,i){const r=t[i];r!==void 0&&this.setValue(e,i,r)}static upload(e,t,i,r){for(let s=0,a=t.length;s!==a;++s){const o=t[s],l=i[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,r)}}static seqWithValue(e,t){const i=[];for(let r=0,s=e.length;r!==s;++r){const a=e[r];a.id in t&&i.push(a)}return i}}function hd(n,e,t){const i=n.createShader(e);return n.shaderSource(i,t),n.compileShader(i),i}const Dy=37297;let Uy=0;function Ny(n,e){const t=n.split(`
`),i=[],r=Math.max(e-6,0),s=Math.min(e+6,t.length);for(let a=r;a<s;a++){const o=a+1;i.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return i.join(`
`)}const dd=new Ne;function Fy(n){Xe._getMatrix(dd,Xe.workingColorSpace,n);const e=`mat3( ${dd.elements.map(t=>t.toFixed(4))} )`;switch(Xe.getTransfer(n)){case sl:return[e,"LinearTransferOETF"];case ot:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",n),[e,"LinearTransferOETF"]}}function fd(n,e,t){const i=n.getShaderParameter(e,n.COMPILE_STATUS),r=n.getShaderInfoLog(e).trim();if(i&&r==="")return"";const s=/ERROR: 0:(\d+)/.exec(r);if(s){const a=parseInt(s[1]);return t.toUpperCase()+`

`+r+`

`+Ny(n.getShaderSource(e),a)}else return r}function Oy(n,e){const t=Fy(e);return[`vec4 ${n}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function By(n,e){let t;switch(e){case Og:t="Linear";break;case Bg:t="Reinhard";break;case kg:t="Cineon";break;case zg:t="ACESFilmic";break;case Hg:t="AgX";break;case Gg:t="Neutral";break;case Vg:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const ka=new P;function ky(){Xe.getLuminanceCoefficients(ka);const n=ka.x.toFixed(4),e=ka.y.toFixed(4),t=ka.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function zy(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Os).join(`
`)}function Vy(n){const e=[];for(const t in n){const i=n[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function Hy(n,e){const t={},i=n.getProgramParameter(e,n.ACTIVE_ATTRIBUTES);for(let r=0;r<i;r++){const s=n.getActiveAttrib(e,r),a=s.name;let o=1;s.type===n.FLOAT_MAT2&&(o=2),s.type===n.FLOAT_MAT3&&(o=3),s.type===n.FLOAT_MAT4&&(o=4),t[a]={type:s.type,location:n.getAttribLocation(e,a),locationSize:o}}return t}function Os(n){return n!==""}function pd(n,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function md(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const Gy=/^[ \t]*#include +<([\w\d./]+)>/gm;function cu(n){return n.replace(Gy,Xy)}const Wy=new Map;function Xy(n,e){let t=Ve[e];if(t===void 0){const i=Wy.get(e);if(i!==void 0)t=Ve[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return cu(t)}const qy=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function gd(n){return n.replace(qy,jy)}function jy(n,e,t,i){let r="";for(let s=parseInt(e);s<parseInt(t);s++)r+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function _d(n){let e=`precision ${n.precision} float;
	precision ${n.precision} int;
	precision ${n.precision} sampler2D;
	precision ${n.precision} samplerCube;
	precision ${n.precision} sampler3D;
	precision ${n.precision} sampler2DArray;
	precision ${n.precision} sampler2DShadow;
	precision ${n.precision} samplerCubeShadow;
	precision ${n.precision} sampler2DArrayShadow;
	precision ${n.precision} isampler2D;
	precision ${n.precision} isampler3D;
	precision ${n.precision} isamplerCube;
	precision ${n.precision} isampler2DArray;
	precision ${n.precision} usampler2D;
	precision ${n.precision} usampler3D;
	precision ${n.precision} usamplerCube;
	precision ${n.precision} usampler2DArray;
	`;return n.precision==="highp"?e+=`
#define HIGH_PRECISION`:n.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:n.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function Yy(n){let e="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===Mp?e="SHADOWMAP_TYPE_PCF":n.shadowMapType===vg?e="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===ti&&(e="SHADOWMAP_TYPE_VSM"),e}function $y(n){let e="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case jr:case Yr:e="ENVMAP_TYPE_CUBE";break;case il:e="ENVMAP_TYPE_CUBE_UV";break}return e}function Ky(n){let e="ENVMAP_MODE_REFLECTION";if(n.envMap)switch(n.envMapMode){case Yr:e="ENVMAP_MODE_REFRACTION";break}return e}function Zy(n){let e="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case bp:e="ENVMAP_BLENDING_MULTIPLY";break;case Ng:e="ENVMAP_BLENDING_MIX";break;case Fg:e="ENVMAP_BLENDING_ADD";break}return e}function Jy(n){const e=n.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:i,maxMip:t}}function Qy(n,e,t,i){const r=n.getContext(),s=t.defines;let a=t.vertexShader,o=t.fragmentShader;const l=Yy(t),c=$y(t),u=Ky(t),h=Zy(t),d=Jy(t),f=zy(t),m=Vy(s),_=r.createProgram();let g,p,y=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(g=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m].filter(Os).join(`
`),g.length>0&&(g+=`
`),p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m].filter(Os).join(`
`),p.length>0&&(p+=`
`)):(g=[_d(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Os).join(`
`),p=[_d(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+u:"",t.envMap?"#define "+h:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Oi?"#define TONE_MAPPING":"",t.toneMapping!==Oi?Ve.tonemapping_pars_fragment:"",t.toneMapping!==Oi?By("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Ve.colorspace_pars_fragment,Oy("linearToOutputTexel",t.outputColorSpace),ky(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Os).join(`
`)),a=cu(a),a=pd(a,t),a=md(a,t),o=cu(o),o=pd(o,t),o=md(o,t),a=gd(a),o=gd(o),t.isRawShaderMaterial!==!0&&(y=`#version 300 es
`,g=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,p=["#define varying in",t.glslVersion===Ch?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Ch?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const x=y+g+a,v=y+p+o,w=hd(r,r.VERTEX_SHADER,x),b=hd(r,r.FRAGMENT_SHADER,v);r.attachShader(_,w),r.attachShader(_,b),t.index0AttributeName!==void 0?r.bindAttribLocation(_,0,t.index0AttributeName):t.morphTargets===!0&&r.bindAttribLocation(_,0,"position"),r.linkProgram(_);function A(L){if(n.debug.checkShaderErrors){const z=r.getProgramInfoLog(_).trim(),I=r.getShaderInfoLog(w).trim(),q=r.getShaderInfoLog(b).trim();let k=!0,O=!0;if(r.getProgramParameter(_,r.LINK_STATUS)===!1)if(k=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(r,_,w,b);else{const j=fd(r,w,"vertex"),B=fd(r,b,"fragment");console.error("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(_,r.VALIDATE_STATUS)+`

Material Name: `+L.name+`
Material Type: `+L.type+`

Program Info Log: `+z+`
`+j+`
`+B)}else z!==""?console.warn("THREE.WebGLProgram: Program Info Log:",z):(I===""||q==="")&&(O=!1);O&&(L.diagnostics={runnable:k,programLog:z,vertexShader:{log:I,prefix:g},fragmentShader:{log:q,prefix:p}})}r.deleteShader(w),r.deleteShader(b),R=new _o(r,_),T=Hy(r,_)}let R;this.getUniforms=function(){return R===void 0&&A(this),R};let T;this.getAttributes=function(){return T===void 0&&A(this),T};let M=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return M===!1&&(M=r.getProgramParameter(_,Dy)),M},this.destroy=function(){i.releaseStatesOfProgram(this),r.deleteProgram(_),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Uy++,this.cacheKey=e,this.usedTimes=1,this.program=_,this.vertexShader=w,this.fragmentShader=b,this}let eM=0;class tM{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,i=e.fragmentShader,r=this._getShaderStage(t),s=this._getShaderStage(i),a=this._getShaderCacheForMaterial(e);return a.has(r)===!1&&(a.add(r),r.usedTimes++),a.has(s)===!1&&(a.add(s),s.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){const t=this.shaderCache;let i=t.get(e);return i===void 0&&(i=new nM(e),t.set(e,i)),i}}class nM{constructor(e){this.id=eM++,this.code=e,this.usedTimes=0}}function iM(n,e,t,i,r,s,a){const o=new Nu,l=new tM,c=new Set,u=[],h=r.logarithmicDepthBuffer,d=r.vertexTextures;let f=r.precision;const m={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(T){return c.add(T),T===0?"uv":`uv${T}`}function g(T,M,L,z,I){const q=z.fog,k=I.geometry,O=T.isMeshStandardMaterial?z.environment:null,j=(T.isMeshStandardMaterial?t:e).get(T.envMap||O),B=j&&j.mapping===il?j.image.height:null,G=m[T.type];T.precision!==null&&(f=r.getMaxPrecision(T.precision),f!==T.precision&&console.warn("THREE.WebGLProgram.getParameters:",T.precision,"not supported, using",f,"instead."));const Q=k.morphAttributes.position||k.morphAttributes.normal||k.morphAttributes.color,ie=Q!==void 0?Q.length:0;let me=0;k.morphAttributes.position!==void 0&&(me=1),k.morphAttributes.normal!==void 0&&(me=2),k.morphAttributes.color!==void 0&&(me=3);let xe,H,K,oe;if(G){const it=On[G];xe=it.vertexShader,H=it.fragmentShader}else xe=T.vertexShader,H=T.fragmentShader,l.update(T),K=l.getVertexShaderID(T),oe=l.getFragmentShaderID(T);const re=n.getRenderTarget(),Ae=n.state.buffers.depth.getReversed(),Ce=I.isInstancedMesh===!0,ke=I.isBatchedMesh===!0,lt=!!T.map,We=!!T.matcap,yt=!!j,F=!!T.aoMap,hn=!!T.lightMap,Ye=!!T.bumpMap,$e=!!T.normalMap,Pe=!!T.displacementMap,ht=!!T.emissiveMap,Re=!!T.metalnessMap,C=!!T.roughnessMap,S=T.anisotropy>0,V=T.clearcoat>0,Z=T.dispersion>0,ee=T.iridescence>0,$=T.sheen>0,Ee=T.transmission>0,ce=S&&!!T.anisotropyMap,_e=V&&!!T.clearcoatMap,Ze=V&&!!T.clearcoatNormalMap,te=V&&!!T.clearcoatRoughnessMap,ve=ee&&!!T.iridescenceMap,Le=ee&&!!T.iridescenceThicknessMap,De=$&&!!T.sheenColorMap,ye=$&&!!T.sheenRoughnessMap,Ke=!!T.specularMap,ze=!!T.specularColorMap,ct=!!T.specularIntensityMap,D=Ee&&!!T.transmissionMap,le=Ee&&!!T.thicknessMap,Y=!!T.gradientMap,J=!!T.alphaMap,de=T.alphaTest>0,ue=!!T.alphaHash,Fe=!!T.extensions;let xt=Oi;T.toneMapped&&(re===null||re.isXRRenderTarget===!0)&&(xt=n.toneMapping);const Lt={shaderID:G,shaderType:T.type,shaderName:T.name,vertexShader:xe,fragmentShader:H,defines:T.defines,customVertexShaderID:K,customFragmentShaderID:oe,isRawShaderMaterial:T.isRawShaderMaterial===!0,glslVersion:T.glslVersion,precision:f,batching:ke,batchingColor:ke&&I._colorsTexture!==null,instancing:Ce,instancingColor:Ce&&I.instanceColor!==null,instancingMorph:Ce&&I.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:re===null?n.outputColorSpace:re.isXRRenderTarget===!0?re.texture.colorSpace:zt,alphaToCoverage:!!T.alphaToCoverage,map:lt,matcap:We,envMap:yt,envMapMode:yt&&j.mapping,envMapCubeUVHeight:B,aoMap:F,lightMap:hn,bumpMap:Ye,normalMap:$e,displacementMap:d&&Pe,emissiveMap:ht,normalMapObjectSpace:$e&&T.normalMapType===Kg,normalMapTangentSpace:$e&&T.normalMapType===Op,metalnessMap:Re,roughnessMap:C,anisotropy:S,anisotropyMap:ce,clearcoat:V,clearcoatMap:_e,clearcoatNormalMap:Ze,clearcoatRoughnessMap:te,dispersion:Z,iridescence:ee,iridescenceMap:ve,iridescenceThicknessMap:Le,sheen:$,sheenColorMap:De,sheenRoughnessMap:ye,specularMap:Ke,specularColorMap:ze,specularIntensityMap:ct,transmission:Ee,transmissionMap:D,thicknessMap:le,gradientMap:Y,opaque:T.transparent===!1&&T.blending===nr&&T.alphaToCoverage===!1,alphaMap:J,alphaTest:de,alphaHash:ue,combine:T.combine,mapUv:lt&&_(T.map.channel),aoMapUv:F&&_(T.aoMap.channel),lightMapUv:hn&&_(T.lightMap.channel),bumpMapUv:Ye&&_(T.bumpMap.channel),normalMapUv:$e&&_(T.normalMap.channel),displacementMapUv:Pe&&_(T.displacementMap.channel),emissiveMapUv:ht&&_(T.emissiveMap.channel),metalnessMapUv:Re&&_(T.metalnessMap.channel),roughnessMapUv:C&&_(T.roughnessMap.channel),anisotropyMapUv:ce&&_(T.anisotropyMap.channel),clearcoatMapUv:_e&&_(T.clearcoatMap.channel),clearcoatNormalMapUv:Ze&&_(T.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:te&&_(T.clearcoatRoughnessMap.channel),iridescenceMapUv:ve&&_(T.iridescenceMap.channel),iridescenceThicknessMapUv:Le&&_(T.iridescenceThicknessMap.channel),sheenColorMapUv:De&&_(T.sheenColorMap.channel),sheenRoughnessMapUv:ye&&_(T.sheenRoughnessMap.channel),specularMapUv:Ke&&_(T.specularMap.channel),specularColorMapUv:ze&&_(T.specularColorMap.channel),specularIntensityMapUv:ct&&_(T.specularIntensityMap.channel),transmissionMapUv:D&&_(T.transmissionMap.channel),thicknessMapUv:le&&_(T.thicknessMap.channel),alphaMapUv:J&&_(T.alphaMap.channel),vertexTangents:!!k.attributes.tangent&&($e||S),vertexColors:T.vertexColors,vertexAlphas:T.vertexColors===!0&&!!k.attributes.color&&k.attributes.color.itemSize===4,pointsUvs:I.isPoints===!0&&!!k.attributes.uv&&(lt||J),fog:!!q,useFog:T.fog===!0,fogExp2:!!q&&q.isFogExp2,flatShading:T.flatShading===!0,sizeAttenuation:T.sizeAttenuation===!0,logarithmicDepthBuffer:h,reverseDepthBuffer:Ae,skinning:I.isSkinnedMesh===!0,morphTargets:k.morphAttributes.position!==void 0,morphNormals:k.morphAttributes.normal!==void 0,morphColors:k.morphAttributes.color!==void 0,morphTargetsCount:ie,morphTextureStride:me,numDirLights:M.directional.length,numPointLights:M.point.length,numSpotLights:M.spot.length,numSpotLightMaps:M.spotLightMap.length,numRectAreaLights:M.rectArea.length,numHemiLights:M.hemi.length,numDirLightShadows:M.directionalShadowMap.length,numPointLightShadows:M.pointShadowMap.length,numSpotLightShadows:M.spotShadowMap.length,numSpotLightShadowsWithMaps:M.numSpotLightShadowsWithMaps,numLightProbes:M.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:T.dithering,shadowMapEnabled:n.shadowMap.enabled&&L.length>0,shadowMapType:n.shadowMap.type,toneMapping:xt,decodeVideoTexture:lt&&T.map.isVideoTexture===!0&&Xe.getTransfer(T.map.colorSpace)===ot,decodeVideoTextureEmissive:ht&&T.emissiveMap.isVideoTexture===!0&&Xe.getTransfer(T.emissiveMap.colorSpace)===ot,premultipliedAlpha:T.premultipliedAlpha,doubleSided:T.side===bn,flipSided:T.side===$t,useDepthPacking:T.depthPacking>=0,depthPacking:T.depthPacking||0,index0AttributeName:T.index0AttributeName,extensionClipCullDistance:Fe&&T.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Fe&&T.extensions.multiDraw===!0||ke)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:T.customProgramCacheKey()};return Lt.vertexUv1s=c.has(1),Lt.vertexUv2s=c.has(2),Lt.vertexUv3s=c.has(3),c.clear(),Lt}function p(T){const M=[];if(T.shaderID?M.push(T.shaderID):(M.push(T.customVertexShaderID),M.push(T.customFragmentShaderID)),T.defines!==void 0)for(const L in T.defines)M.push(L),M.push(T.defines[L]);return T.isRawShaderMaterial===!1&&(y(M,T),x(M,T),M.push(n.outputColorSpace)),M.push(T.customProgramCacheKey),M.join()}function y(T,M){T.push(M.precision),T.push(M.outputColorSpace),T.push(M.envMapMode),T.push(M.envMapCubeUVHeight),T.push(M.mapUv),T.push(M.alphaMapUv),T.push(M.lightMapUv),T.push(M.aoMapUv),T.push(M.bumpMapUv),T.push(M.normalMapUv),T.push(M.displacementMapUv),T.push(M.emissiveMapUv),T.push(M.metalnessMapUv),T.push(M.roughnessMapUv),T.push(M.anisotropyMapUv),T.push(M.clearcoatMapUv),T.push(M.clearcoatNormalMapUv),T.push(M.clearcoatRoughnessMapUv),T.push(M.iridescenceMapUv),T.push(M.iridescenceThicknessMapUv),T.push(M.sheenColorMapUv),T.push(M.sheenRoughnessMapUv),T.push(M.specularMapUv),T.push(M.specularColorMapUv),T.push(M.specularIntensityMapUv),T.push(M.transmissionMapUv),T.push(M.thicknessMapUv),T.push(M.combine),T.push(M.fogExp2),T.push(M.sizeAttenuation),T.push(M.morphTargetsCount),T.push(M.morphAttributeCount),T.push(M.numDirLights),T.push(M.numPointLights),T.push(M.numSpotLights),T.push(M.numSpotLightMaps),T.push(M.numHemiLights),T.push(M.numRectAreaLights),T.push(M.numDirLightShadows),T.push(M.numPointLightShadows),T.push(M.numSpotLightShadows),T.push(M.numSpotLightShadowsWithMaps),T.push(M.numLightProbes),T.push(M.shadowMapType),T.push(M.toneMapping),T.push(M.numClippingPlanes),T.push(M.numClipIntersection),T.push(M.depthPacking)}function x(T,M){o.disableAll(),M.supportsVertexTextures&&o.enable(0),M.instancing&&o.enable(1),M.instancingColor&&o.enable(2),M.instancingMorph&&o.enable(3),M.matcap&&o.enable(4),M.envMap&&o.enable(5),M.normalMapObjectSpace&&o.enable(6),M.normalMapTangentSpace&&o.enable(7),M.clearcoat&&o.enable(8),M.iridescence&&o.enable(9),M.alphaTest&&o.enable(10),M.vertexColors&&o.enable(11),M.vertexAlphas&&o.enable(12),M.vertexUv1s&&o.enable(13),M.vertexUv2s&&o.enable(14),M.vertexUv3s&&o.enable(15),M.vertexTangents&&o.enable(16),M.anisotropy&&o.enable(17),M.alphaHash&&o.enable(18),M.batching&&o.enable(19),M.dispersion&&o.enable(20),M.batchingColor&&o.enable(21),T.push(o.mask),o.disableAll(),M.fog&&o.enable(0),M.useFog&&o.enable(1),M.flatShading&&o.enable(2),M.logarithmicDepthBuffer&&o.enable(3),M.reverseDepthBuffer&&o.enable(4),M.skinning&&o.enable(5),M.morphTargets&&o.enable(6),M.morphNormals&&o.enable(7),M.morphColors&&o.enable(8),M.premultipliedAlpha&&o.enable(9),M.shadowMapEnabled&&o.enable(10),M.doubleSided&&o.enable(11),M.flipSided&&o.enable(12),M.useDepthPacking&&o.enable(13),M.dithering&&o.enable(14),M.transmission&&o.enable(15),M.sheen&&o.enable(16),M.opaque&&o.enable(17),M.pointsUvs&&o.enable(18),M.decodeVideoTexture&&o.enable(19),M.decodeVideoTextureEmissive&&o.enable(20),M.alphaToCoverage&&o.enable(21),T.push(o.mask)}function v(T){const M=m[T.type];let L;if(M){const z=On[M];L=z_.clone(z.uniforms)}else L=T.uniforms;return L}function w(T,M){let L;for(let z=0,I=u.length;z<I;z++){const q=u[z];if(q.cacheKey===M){L=q,++L.usedTimes;break}}return L===void 0&&(L=new Qy(n,M,T,s),u.push(L)),L}function b(T){if(--T.usedTimes===0){const M=u.indexOf(T);u[M]=u[u.length-1],u.pop(),T.destroy()}}function A(T){l.remove(T)}function R(){l.dispose()}return{getParameters:g,getProgramCacheKey:p,getUniforms:v,acquireProgram:w,releaseProgram:b,releaseShaderCache:A,programs:u,dispose:R}}function rM(){let n=new WeakMap;function e(a){return n.has(a)}function t(a){let o=n.get(a);return o===void 0&&(o={},n.set(a,o)),o}function i(a){n.delete(a)}function r(a,o,l){n.get(a)[o]=l}function s(){n=new WeakMap}return{has:e,get:t,remove:i,update:r,dispose:s}}function sM(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.z!==e.z?n.z-e.z:n.id-e.id}function xd(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}function vd(){const n=[];let e=0;const t=[],i=[],r=[];function s(){e=0,t.length=0,i.length=0,r.length=0}function a(h,d,f,m,_,g){let p=n[e];return p===void 0?(p={id:h.id,object:h,geometry:d,material:f,groupOrder:m,renderOrder:h.renderOrder,z:_,group:g},n[e]=p):(p.id=h.id,p.object=h,p.geometry=d,p.material=f,p.groupOrder=m,p.renderOrder=h.renderOrder,p.z=_,p.group=g),e++,p}function o(h,d,f,m,_,g){const p=a(h,d,f,m,_,g);f.transmission>0?i.push(p):f.transparent===!0?r.push(p):t.push(p)}function l(h,d,f,m,_,g){const p=a(h,d,f,m,_,g);f.transmission>0?i.unshift(p):f.transparent===!0?r.unshift(p):t.unshift(p)}function c(h,d){t.length>1&&t.sort(h||sM),i.length>1&&i.sort(d||xd),r.length>1&&r.sort(d||xd)}function u(){for(let h=e,d=n.length;h<d;h++){const f=n[h];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:t,transmissive:i,transparent:r,init:s,push:o,unshift:l,finish:u,sort:c}}function aM(){let n=new WeakMap;function e(i,r){const s=n.get(i);let a;return s===void 0?(a=new vd,n.set(i,[a])):r>=s.length?(a=new vd,s.push(a)):a=s[r],a}function t(){n=new WeakMap}return{get:e,dispose:t}}function oM(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new P,color:new we};break;case"SpotLight":t={position:new P,direction:new P,color:new we,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new P,color:new we,distance:0,decay:0};break;case"HemisphereLight":t={direction:new P,skyColor:new we,groundColor:new we};break;case"RectAreaLight":t={color:new we,position:new P,halfWidth:new P,halfHeight:new P};break}return n[e.id]=t,t}}}function lM(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new fe};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new fe};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new fe,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[e.id]=t,t}}}let cM=0;function uM(n,e){return(e.castShadow?2:0)-(n.castShadow?2:0)+(e.map?1:0)-(n.map?1:0)}function hM(n){const e=new oM,t=lM(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new P);const r=new P,s=new ge,a=new ge;function o(c){let u=0,h=0,d=0;for(let T=0;T<9;T++)i.probe[T].set(0,0,0);let f=0,m=0,_=0,g=0,p=0,y=0,x=0,v=0,w=0,b=0,A=0;c.sort(uM);for(let T=0,M=c.length;T<M;T++){const L=c[T],z=L.color,I=L.intensity,q=L.distance,k=L.shadow&&L.shadow.map?L.shadow.map.texture:null;if(L.isAmbientLight)u+=z.r*I,h+=z.g*I,d+=z.b*I;else if(L.isLightProbe){for(let O=0;O<9;O++)i.probe[O].addScaledVector(L.sh.coefficients[O],I);A++}else if(L.isDirectionalLight){const O=e.get(L);if(O.color.copy(L.color).multiplyScalar(L.intensity),L.castShadow){const j=L.shadow,B=t.get(L);B.shadowIntensity=j.intensity,B.shadowBias=j.bias,B.shadowNormalBias=j.normalBias,B.shadowRadius=j.radius,B.shadowMapSize=j.mapSize,i.directionalShadow[f]=B,i.directionalShadowMap[f]=k,i.directionalShadowMatrix[f]=L.shadow.matrix,y++}i.directional[f]=O,f++}else if(L.isSpotLight){const O=e.get(L);O.position.setFromMatrixPosition(L.matrixWorld),O.color.copy(z).multiplyScalar(I),O.distance=q,O.coneCos=Math.cos(L.angle),O.penumbraCos=Math.cos(L.angle*(1-L.penumbra)),O.decay=L.decay,i.spot[_]=O;const j=L.shadow;if(L.map&&(i.spotLightMap[w]=L.map,w++,j.updateMatrices(L),L.castShadow&&b++),i.spotLightMatrix[_]=j.matrix,L.castShadow){const B=t.get(L);B.shadowIntensity=j.intensity,B.shadowBias=j.bias,B.shadowNormalBias=j.normalBias,B.shadowRadius=j.radius,B.shadowMapSize=j.mapSize,i.spotShadow[_]=B,i.spotShadowMap[_]=k,v++}_++}else if(L.isRectAreaLight){const O=e.get(L);O.color.copy(z).multiplyScalar(I),O.halfWidth.set(L.width*.5,0,0),O.halfHeight.set(0,L.height*.5,0),i.rectArea[g]=O,g++}else if(L.isPointLight){const O=e.get(L);if(O.color.copy(L.color).multiplyScalar(L.intensity),O.distance=L.distance,O.decay=L.decay,L.castShadow){const j=L.shadow,B=t.get(L);B.shadowIntensity=j.intensity,B.shadowBias=j.bias,B.shadowNormalBias=j.normalBias,B.shadowRadius=j.radius,B.shadowMapSize=j.mapSize,B.shadowCameraNear=j.camera.near,B.shadowCameraFar=j.camera.far,i.pointShadow[m]=B,i.pointShadowMap[m]=k,i.pointShadowMatrix[m]=L.shadow.matrix,x++}i.point[m]=O,m++}else if(L.isHemisphereLight){const O=e.get(L);O.skyColor.copy(L.color).multiplyScalar(I),O.groundColor.copy(L.groundColor).multiplyScalar(I),i.hemi[p]=O,p++}}g>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=se.LTC_FLOAT_1,i.rectAreaLTC2=se.LTC_FLOAT_2):(i.rectAreaLTC1=se.LTC_HALF_1,i.rectAreaLTC2=se.LTC_HALF_2)),i.ambient[0]=u,i.ambient[1]=h,i.ambient[2]=d;const R=i.hash;(R.directionalLength!==f||R.pointLength!==m||R.spotLength!==_||R.rectAreaLength!==g||R.hemiLength!==p||R.numDirectionalShadows!==y||R.numPointShadows!==x||R.numSpotShadows!==v||R.numSpotMaps!==w||R.numLightProbes!==A)&&(i.directional.length=f,i.spot.length=_,i.rectArea.length=g,i.point.length=m,i.hemi.length=p,i.directionalShadow.length=y,i.directionalShadowMap.length=y,i.pointShadow.length=x,i.pointShadowMap.length=x,i.spotShadow.length=v,i.spotShadowMap.length=v,i.directionalShadowMatrix.length=y,i.pointShadowMatrix.length=x,i.spotLightMatrix.length=v+w-b,i.spotLightMap.length=w,i.numSpotLightShadowsWithMaps=b,i.numLightProbes=A,R.directionalLength=f,R.pointLength=m,R.spotLength=_,R.rectAreaLength=g,R.hemiLength=p,R.numDirectionalShadows=y,R.numPointShadows=x,R.numSpotShadows=v,R.numSpotMaps=w,R.numLightProbes=A,i.version=cM++)}function l(c,u){let h=0,d=0,f=0,m=0,_=0;const g=u.matrixWorldInverse;for(let p=0,y=c.length;p<y;p++){const x=c[p];if(x.isDirectionalLight){const v=i.directional[h];v.direction.setFromMatrixPosition(x.matrixWorld),r.setFromMatrixPosition(x.target.matrixWorld),v.direction.sub(r),v.direction.transformDirection(g),h++}else if(x.isSpotLight){const v=i.spot[f];v.position.setFromMatrixPosition(x.matrixWorld),v.position.applyMatrix4(g),v.direction.setFromMatrixPosition(x.matrixWorld),r.setFromMatrixPosition(x.target.matrixWorld),v.direction.sub(r),v.direction.transformDirection(g),f++}else if(x.isRectAreaLight){const v=i.rectArea[m];v.position.setFromMatrixPosition(x.matrixWorld),v.position.applyMatrix4(g),a.identity(),s.copy(x.matrixWorld),s.premultiply(g),a.extractRotation(s),v.halfWidth.set(x.width*.5,0,0),v.halfHeight.set(0,x.height*.5,0),v.halfWidth.applyMatrix4(a),v.halfHeight.applyMatrix4(a),m++}else if(x.isPointLight){const v=i.point[d];v.position.setFromMatrixPosition(x.matrixWorld),v.position.applyMatrix4(g),d++}else if(x.isHemisphereLight){const v=i.hemi[_];v.direction.setFromMatrixPosition(x.matrixWorld),v.direction.transformDirection(g),_++}}}return{setup:o,setupView:l,state:i}}function yd(n){const e=new hM(n),t=[],i=[];function r(u){c.camera=u,t.length=0,i.length=0}function s(u){t.push(u)}function a(u){i.push(u)}function o(){e.setup(t)}function l(u){e.setupView(t,u)}const c={lightsArray:t,shadowsArray:i,camera:null,lights:e,transmissionRenderTarget:{}};return{init:r,state:c,setupLights:o,setupLightsView:l,pushLight:s,pushShadow:a}}function dM(n){let e=new WeakMap;function t(r,s=0){const a=e.get(r);let o;return a===void 0?(o=new yd(n),e.set(r,[o])):s>=a.length?(o=new yd(n),a.push(o)):o=a[s],o}function i(){e=new WeakMap}return{get:t,dispose:i}}class fM extends zn{static get type(){return"MeshDepthMaterial"}constructor(e){super(),this.isMeshDepthMaterial=!0,this.depthPacking=Yg,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class pM extends zn{static get type(){return"MeshDistanceMaterial"}constructor(e){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const mM=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,gM=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function _M(n,e,t){let i=new al;const r=new fe,s=new fe,a=new qe,o=new fM({depthPacking:$g}),l=new pM,c={},u=t.maxTextureSize,h={[di]:$t,[$t]:di,[bn]:bn},d=new Vn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new fe},radius:{value:4}},vertexShader:mM,fragmentShader:gM}),f=d.clone();f.defines.HORIZONTAL_PASS=1;const m=new _t;m.setAttribute("position",new je(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new He(m,d),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Mp;let p=this.type;this.render=function(b,A,R){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||b.length===0)return;const T=n.getRenderTarget(),M=n.getActiveCubeFace(),L=n.getActiveMipmapLevel(),z=n.state;z.setBlending(Fi),z.buffers.color.setClear(1,1,1,1),z.buffers.depth.setTest(!0),z.setScissorTest(!1);const I=p!==ti&&this.type===ti,q=p===ti&&this.type!==ti;for(let k=0,O=b.length;k<O;k++){const j=b[k],B=j.shadow;if(B===void 0){console.warn("THREE.WebGLShadowMap:",j,"has no shadow.");continue}if(B.autoUpdate===!1&&B.needsUpdate===!1)continue;r.copy(B.mapSize);const G=B.getFrameExtents();if(r.multiply(G),s.copy(B.mapSize),(r.x>u||r.y>u)&&(r.x>u&&(s.x=Math.floor(u/G.x),r.x=s.x*G.x,B.mapSize.x=s.x),r.y>u&&(s.y=Math.floor(u/G.y),r.y=s.y*G.y,B.mapSize.y=s.y)),B.map===null||I===!0||q===!0){const ie=this.type!==ti?{minFilter:Kt,magFilter:Kt}:{};B.map!==null&&B.map.dispose(),B.map=new fi(r.x,r.y,ie),B.map.texture.name=j.name+".shadowMap",B.camera.updateProjectionMatrix()}n.setRenderTarget(B.map),n.clear();const Q=B.getViewportCount();for(let ie=0;ie<Q;ie++){const me=B.getViewport(ie);a.set(s.x*me.x,s.y*me.y,s.x*me.z,s.y*me.w),z.viewport(a),B.updateMatrices(j,ie),i=B.getFrustum(),v(A,R,B.camera,j,this.type)}B.isPointLightShadow!==!0&&this.type===ti&&y(B,R),B.needsUpdate=!1}p=this.type,g.needsUpdate=!1,n.setRenderTarget(T,M,L)};function y(b,A){const R=e.update(_);d.defines.VSM_SAMPLES!==b.blurSamples&&(d.defines.VSM_SAMPLES=b.blurSamples,f.defines.VSM_SAMPLES=b.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),b.mapPass===null&&(b.mapPass=new fi(r.x,r.y)),d.uniforms.shadow_pass.value=b.map.texture,d.uniforms.resolution.value=b.mapSize,d.uniforms.radius.value=b.radius,n.setRenderTarget(b.mapPass),n.clear(),n.renderBufferDirect(A,null,R,d,_,null),f.uniforms.shadow_pass.value=b.mapPass.texture,f.uniforms.resolution.value=b.mapSize,f.uniforms.radius.value=b.radius,n.setRenderTarget(b.map),n.clear(),n.renderBufferDirect(A,null,R,f,_,null)}function x(b,A,R,T){let M=null;const L=R.isPointLight===!0?b.customDistanceMaterial:b.customDepthMaterial;if(L!==void 0)M=L;else if(M=R.isPointLight===!0?l:o,n.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0){const z=M.uuid,I=A.uuid;let q=c[z];q===void 0&&(q={},c[z]=q);let k=q[I];k===void 0&&(k=M.clone(),q[I]=k,A.addEventListener("dispose",w)),M=k}if(M.visible=A.visible,M.wireframe=A.wireframe,T===ti?M.side=A.shadowSide!==null?A.shadowSide:A.side:M.side=A.shadowSide!==null?A.shadowSide:h[A.side],M.alphaMap=A.alphaMap,M.alphaTest=A.alphaTest,M.map=A.map,M.clipShadows=A.clipShadows,M.clippingPlanes=A.clippingPlanes,M.clipIntersection=A.clipIntersection,M.displacementMap=A.displacementMap,M.displacementScale=A.displacementScale,M.displacementBias=A.displacementBias,M.wireframeLinewidth=A.wireframeLinewidth,M.linewidth=A.linewidth,R.isPointLight===!0&&M.isMeshDistanceMaterial===!0){const z=n.properties.get(M);z.light=R}return M}function v(b,A,R,T,M){if(b.visible===!1)return;if(b.layers.test(A.layers)&&(b.isMesh||b.isLine||b.isPoints)&&(b.castShadow||b.receiveShadow&&M===ti)&&(!b.frustumCulled||i.intersectsObject(b))){b.modelViewMatrix.multiplyMatrices(R.matrixWorldInverse,b.matrixWorld);const I=e.update(b),q=b.material;if(Array.isArray(q)){const k=I.groups;for(let O=0,j=k.length;O<j;O++){const B=k[O],G=q[B.materialIndex];if(G&&G.visible){const Q=x(b,G,T,M);b.onBeforeShadow(n,b,A,R,I,Q,B),n.renderBufferDirect(R,null,I,Q,b,B),b.onAfterShadow(n,b,A,R,I,Q,B)}}}else if(q.visible){const k=x(b,q,T,M);b.onBeforeShadow(n,b,A,R,I,k,null),n.renderBufferDirect(R,null,I,k,b,null),b.onAfterShadow(n,b,A,R,I,k,null)}}const z=b.children;for(let I=0,q=z.length;I<q;I++)v(z[I],A,R,T,M)}function w(b){b.target.removeEventListener("dispose",w);for(const R in c){const T=c[R],M=b.target.uuid;M in T&&(T[M].dispose(),delete T[M])}}}const xM={[wc]:Rc,[Cc]:Ic,[Pc]:Dc,[qr]:Lc,[Rc]:wc,[Ic]:Cc,[Dc]:Pc,[Lc]:qr};function vM(n,e){function t(){let D=!1;const le=new qe;let Y=null;const J=new qe(0,0,0,0);return{setMask:function(de){Y!==de&&!D&&(n.colorMask(de,de,de,de),Y=de)},setLocked:function(de){D=de},setClear:function(de,ue,Fe,xt,Lt){Lt===!0&&(de*=xt,ue*=xt,Fe*=xt),le.set(de,ue,Fe,xt),J.equals(le)===!1&&(n.clearColor(de,ue,Fe,xt),J.copy(le))},reset:function(){D=!1,Y=null,J.set(-1,0,0,0)}}}function i(){let D=!1,le=!1,Y=null,J=null,de=null;return{setReversed:function(ue){if(le!==ue){const Fe=e.get("EXT_clip_control");le?Fe.clipControlEXT(Fe.LOWER_LEFT_EXT,Fe.ZERO_TO_ONE_EXT):Fe.clipControlEXT(Fe.LOWER_LEFT_EXT,Fe.NEGATIVE_ONE_TO_ONE_EXT);const xt=de;de=null,this.setClear(xt)}le=ue},getReversed:function(){return le},setTest:function(ue){ue?re(n.DEPTH_TEST):Ae(n.DEPTH_TEST)},setMask:function(ue){Y!==ue&&!D&&(n.depthMask(ue),Y=ue)},setFunc:function(ue){if(le&&(ue=xM[ue]),J!==ue){switch(ue){case wc:n.depthFunc(n.NEVER);break;case Rc:n.depthFunc(n.ALWAYS);break;case Cc:n.depthFunc(n.LESS);break;case qr:n.depthFunc(n.LEQUAL);break;case Pc:n.depthFunc(n.EQUAL);break;case Lc:n.depthFunc(n.GEQUAL);break;case Ic:n.depthFunc(n.GREATER);break;case Dc:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}J=ue}},setLocked:function(ue){D=ue},setClear:function(ue){de!==ue&&(le&&(ue=1-ue),n.clearDepth(ue),de=ue)},reset:function(){D=!1,Y=null,J=null,de=null,le=!1}}}function r(){let D=!1,le=null,Y=null,J=null,de=null,ue=null,Fe=null,xt=null,Lt=null;return{setTest:function(it){D||(it?re(n.STENCIL_TEST):Ae(n.STENCIL_TEST))},setMask:function(it){le!==it&&!D&&(n.stencilMask(it),le=it)},setFunc:function(it,vn,Wn){(Y!==it||J!==vn||de!==Wn)&&(n.stencilFunc(it,vn,Wn),Y=it,J=vn,de=Wn)},setOp:function(it,vn,Wn){(ue!==it||Fe!==vn||xt!==Wn)&&(n.stencilOp(it,vn,Wn),ue=it,Fe=vn,xt=Wn)},setLocked:function(it){D=it},setClear:function(it){Lt!==it&&(n.clearStencil(it),Lt=it)},reset:function(){D=!1,le=null,Y=null,J=null,de=null,ue=null,Fe=null,xt=null,Lt=null}}}const s=new t,a=new i,o=new r,l=new WeakMap,c=new WeakMap;let u={},h={},d=new WeakMap,f=[],m=null,_=!1,g=null,p=null,y=null,x=null,v=null,w=null,b=null,A=new we(0,0,0),R=0,T=!1,M=null,L=null,z=null,I=null,q=null;const k=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let O=!1,j=0;const B=n.getParameter(n.VERSION);B.indexOf("WebGL")!==-1?(j=parseFloat(/^WebGL (\d)/.exec(B)[1]),O=j>=1):B.indexOf("OpenGL ES")!==-1&&(j=parseFloat(/^OpenGL ES (\d)/.exec(B)[1]),O=j>=2);let G=null,Q={};const ie=n.getParameter(n.SCISSOR_BOX),me=n.getParameter(n.VIEWPORT),xe=new qe().fromArray(ie),H=new qe().fromArray(me);function K(D,le,Y,J){const de=new Uint8Array(4),ue=n.createTexture();n.bindTexture(D,ue),n.texParameteri(D,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(D,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let Fe=0;Fe<Y;Fe++)D===n.TEXTURE_3D||D===n.TEXTURE_2D_ARRAY?n.texImage3D(le,0,n.RGBA,1,1,J,0,n.RGBA,n.UNSIGNED_BYTE,de):n.texImage2D(le+Fe,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,de);return ue}const oe={};oe[n.TEXTURE_2D]=K(n.TEXTURE_2D,n.TEXTURE_2D,1),oe[n.TEXTURE_CUBE_MAP]=K(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),oe[n.TEXTURE_2D_ARRAY]=K(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),oe[n.TEXTURE_3D]=K(n.TEXTURE_3D,n.TEXTURE_3D,1,1),s.setClear(0,0,0,1),a.setClear(1),o.setClear(0),re(n.DEPTH_TEST),a.setFunc(qr),Ye(!1),$e(Mh),re(n.CULL_FACE),F(Fi);function re(D){u[D]!==!0&&(n.enable(D),u[D]=!0)}function Ae(D){u[D]!==!1&&(n.disable(D),u[D]=!1)}function Ce(D,le){return h[D]!==le?(n.bindFramebuffer(D,le),h[D]=le,D===n.DRAW_FRAMEBUFFER&&(h[n.FRAMEBUFFER]=le),D===n.FRAMEBUFFER&&(h[n.DRAW_FRAMEBUFFER]=le),!0):!1}function ke(D,le){let Y=f,J=!1;if(D){Y=d.get(le),Y===void 0&&(Y=[],d.set(le,Y));const de=D.textures;if(Y.length!==de.length||Y[0]!==n.COLOR_ATTACHMENT0){for(let ue=0,Fe=de.length;ue<Fe;ue++)Y[ue]=n.COLOR_ATTACHMENT0+ue;Y.length=de.length,J=!0}}else Y[0]!==n.BACK&&(Y[0]=n.BACK,J=!0);J&&n.drawBuffers(Y)}function lt(D){return m!==D?(n.useProgram(D),m=D,!0):!1}const We={[Ji]:n.FUNC_ADD,[yg]:n.FUNC_SUBTRACT,[Mg]:n.FUNC_REVERSE_SUBTRACT};We[Tg]=n.MIN,We[Sg]=n.MAX;const yt={[Sp]:n.ZERO,[Ep]:n.ONE,[Eg]:n.SRC_COLOR,[bc]:n.SRC_ALPHA,[Pg]:n.SRC_ALPHA_SATURATE,[Rg]:n.DST_COLOR,[Ag]:n.DST_ALPHA,[bg]:n.ONE_MINUS_SRC_COLOR,[Ac]:n.ONE_MINUS_SRC_ALPHA,[Cg]:n.ONE_MINUS_DST_COLOR,[wg]:n.ONE_MINUS_DST_ALPHA,[Lg]:n.CONSTANT_COLOR,[Ig]:n.ONE_MINUS_CONSTANT_COLOR,[Dg]:n.CONSTANT_ALPHA,[Ug]:n.ONE_MINUS_CONSTANT_ALPHA};function F(D,le,Y,J,de,ue,Fe,xt,Lt,it){if(D===Fi){_===!0&&(Ae(n.BLEND),_=!1);return}if(_===!1&&(re(n.BLEND),_=!0),D!==Tp){if(D!==g||it!==T){if((p!==Ji||v!==Ji)&&(n.blendEquation(n.FUNC_ADD),p=Ji,v=Ji),it)switch(D){case nr:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Ec:n.blendFunc(n.ONE,n.ONE);break;case Th:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Sh:n.blendFuncSeparate(n.ZERO,n.SRC_COLOR,n.ZERO,n.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",D);break}else switch(D){case nr:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Ec:n.blendFunc(n.SRC_ALPHA,n.ONE);break;case Th:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Sh:n.blendFunc(n.ZERO,n.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",D);break}y=null,x=null,w=null,b=null,A.set(0,0,0),R=0,g=D,T=it}return}de=de||le,ue=ue||Y,Fe=Fe||J,(le!==p||de!==v)&&(n.blendEquationSeparate(We[le],We[de]),p=le,v=de),(Y!==y||J!==x||ue!==w||Fe!==b)&&(n.blendFuncSeparate(yt[Y],yt[J],yt[ue],yt[Fe]),y=Y,x=J,w=ue,b=Fe),(xt.equals(A)===!1||Lt!==R)&&(n.blendColor(xt.r,xt.g,xt.b,Lt),A.copy(xt),R=Lt),g=D,T=!1}function hn(D,le){D.side===bn?Ae(n.CULL_FACE):re(n.CULL_FACE);let Y=D.side===$t;le&&(Y=!Y),Ye(Y),D.blending===nr&&D.transparent===!1?F(Fi):F(D.blending,D.blendEquation,D.blendSrc,D.blendDst,D.blendEquationAlpha,D.blendSrcAlpha,D.blendDstAlpha,D.blendColor,D.blendAlpha,D.premultipliedAlpha),a.setFunc(D.depthFunc),a.setTest(D.depthTest),a.setMask(D.depthWrite),s.setMask(D.colorWrite);const J=D.stencilWrite;o.setTest(J),J&&(o.setMask(D.stencilWriteMask),o.setFunc(D.stencilFunc,D.stencilRef,D.stencilFuncMask),o.setOp(D.stencilFail,D.stencilZFail,D.stencilZPass)),ht(D.polygonOffset,D.polygonOffsetFactor,D.polygonOffsetUnits),D.alphaToCoverage===!0?re(n.SAMPLE_ALPHA_TO_COVERAGE):Ae(n.SAMPLE_ALPHA_TO_COVERAGE)}function Ye(D){M!==D&&(D?n.frontFace(n.CW):n.frontFace(n.CCW),M=D)}function $e(D){D!==_g?(re(n.CULL_FACE),D!==L&&(D===Mh?n.cullFace(n.BACK):D===xg?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):Ae(n.CULL_FACE),L=D}function Pe(D){D!==z&&(O&&n.lineWidth(D),z=D)}function ht(D,le,Y){D?(re(n.POLYGON_OFFSET_FILL),(I!==le||q!==Y)&&(n.polygonOffset(le,Y),I=le,q=Y)):Ae(n.POLYGON_OFFSET_FILL)}function Re(D){D?re(n.SCISSOR_TEST):Ae(n.SCISSOR_TEST)}function C(D){D===void 0&&(D=n.TEXTURE0+k-1),G!==D&&(n.activeTexture(D),G=D)}function S(D,le,Y){Y===void 0&&(G===null?Y=n.TEXTURE0+k-1:Y=G);let J=Q[Y];J===void 0&&(J={type:void 0,texture:void 0},Q[Y]=J),(J.type!==D||J.texture!==le)&&(G!==Y&&(n.activeTexture(Y),G=Y),n.bindTexture(D,le||oe[D]),J.type=D,J.texture=le)}function V(){const D=Q[G];D!==void 0&&D.type!==void 0&&(n.bindTexture(D.type,null),D.type=void 0,D.texture=void 0)}function Z(){try{n.compressedTexImage2D.apply(n,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function ee(){try{n.compressedTexImage3D.apply(n,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function $(){try{n.texSubImage2D.apply(n,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Ee(){try{n.texSubImage3D.apply(n,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function ce(){try{n.compressedTexSubImage2D.apply(n,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function _e(){try{n.compressedTexSubImage3D.apply(n,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Ze(){try{n.texStorage2D.apply(n,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function te(){try{n.texStorage3D.apply(n,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function ve(){try{n.texImage2D.apply(n,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Le(){try{n.texImage3D.apply(n,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function De(D){xe.equals(D)===!1&&(n.scissor(D.x,D.y,D.z,D.w),xe.copy(D))}function ye(D){H.equals(D)===!1&&(n.viewport(D.x,D.y,D.z,D.w),H.copy(D))}function Ke(D,le){let Y=c.get(le);Y===void 0&&(Y=new WeakMap,c.set(le,Y));let J=Y.get(D);J===void 0&&(J=n.getUniformBlockIndex(le,D.name),Y.set(D,J))}function ze(D,le){const J=c.get(le).get(D);l.get(le)!==J&&(n.uniformBlockBinding(le,J,D.__bindingPointIndex),l.set(le,J))}function ct(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),a.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),u={},G=null,Q={},h={},d=new WeakMap,f=[],m=null,_=!1,g=null,p=null,y=null,x=null,v=null,w=null,b=null,A=new we(0,0,0),R=0,T=!1,M=null,L=null,z=null,I=null,q=null,xe.set(0,0,n.canvas.width,n.canvas.height),H.set(0,0,n.canvas.width,n.canvas.height),s.reset(),a.reset(),o.reset()}return{buffers:{color:s,depth:a,stencil:o},enable:re,disable:Ae,bindFramebuffer:Ce,drawBuffers:ke,useProgram:lt,setBlending:F,setMaterial:hn,setFlipSided:Ye,setCullFace:$e,setLineWidth:Pe,setPolygonOffset:ht,setScissorTest:Re,activeTexture:C,bindTexture:S,unbindTexture:V,compressedTexImage2D:Z,compressedTexImage3D:ee,texImage2D:ve,texImage3D:Le,updateUBOMapping:Ke,uniformBlockBinding:ze,texStorage2D:Ze,texStorage3D:te,texSubImage2D:$,texSubImage3D:Ee,compressedTexSubImage2D:ce,compressedTexSubImage3D:_e,scissor:De,viewport:ye,reset:ct}}function yM(n,e){const t=n.image&&n.image.width?n.image.width/n.image.height:1;return t>e?(n.repeat.x=1,n.repeat.y=t/e,n.offset.x=0,n.offset.y=(1-n.repeat.y)/2):(n.repeat.x=e/t,n.repeat.y=1,n.offset.x=(1-n.repeat.x)/2,n.offset.y=0),n}function MM(n,e){const t=n.image&&n.image.width?n.image.width/n.image.height:1;return t>e?(n.repeat.x=e/t,n.repeat.y=1,n.offset.x=(1-n.repeat.x)/2,n.offset.y=0):(n.repeat.x=1,n.repeat.y=t/e,n.offset.x=0,n.offset.y=(1-n.repeat.y)/2),n}function TM(n){return n.repeat.x=1,n.repeat.y=1,n.offset.x=0,n.offset.y=0,n}function uu(n,e,t,i){const r=SM(i);switch(t){case Lp:return n*e;case Dp:return n*e;case Up:return n*e*2;case Pu:return n*e/r.components*r.byteLength;case Lu:return n*e/r.components*r.byteLength;case rl:return n*e*2/r.components*r.byteLength;case Iu:return n*e*2/r.components*r.byteLength;case Ip:return n*e*3/r.components*r.byteLength;case _n:return n*e*4/r.components*r.byteLength;case Du:return n*e*4/r.components*r.byteLength;case ho:case fo:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case po:case mo:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Fc:case Bc:return Math.max(n,16)*Math.max(e,8)/4;case Nc:case Oc:return Math.max(n,8)*Math.max(e,8)/2;case kc:case zc:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case Vc:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Hc:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Gc:return Math.floor((n+4)/5)*Math.floor((e+3)/4)*16;case Wc:return Math.floor((n+4)/5)*Math.floor((e+4)/5)*16;case Xc:return Math.floor((n+5)/6)*Math.floor((e+4)/5)*16;case qc:return Math.floor((n+5)/6)*Math.floor((e+5)/6)*16;case jc:return Math.floor((n+7)/8)*Math.floor((e+4)/5)*16;case Yc:return Math.floor((n+7)/8)*Math.floor((e+5)/6)*16;case $c:return Math.floor((n+7)/8)*Math.floor((e+7)/8)*16;case Kc:return Math.floor((n+9)/10)*Math.floor((e+4)/5)*16;case Zc:return Math.floor((n+9)/10)*Math.floor((e+5)/6)*16;case Jc:return Math.floor((n+9)/10)*Math.floor((e+7)/8)*16;case Qc:return Math.floor((n+9)/10)*Math.floor((e+9)/10)*16;case eu:return Math.floor((n+11)/12)*Math.floor((e+9)/10)*16;case tu:return Math.floor((n+11)/12)*Math.floor((e+11)/12)*16;case go:case nu:case iu:return Math.ceil(n/4)*Math.ceil(e/4)*16;case Np:case ru:return Math.ceil(n/4)*Math.ceil(e/4)*8;case su:case au:return Math.ceil(n/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function SM(n){switch(n){case In:case Rp:return{byteLength:1,components:1};case Js:case Cp:case ha:return{byteLength:2,components:1};case Ru:case Cu:return{byteLength:2,components:4};case ar:case wu:case wn:return{byteLength:4,components:1};case Pp:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}const em={contain:yM,cover:MM,fill:TM,getByteLength:uu};function EM(n,e,t,i,r,s,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new fe,u=new WeakMap;let h;const d=new WeakMap;let f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function m(C,S){return f?new OffscreenCanvas(C,S):ta("canvas")}function _(C,S,V){let Z=1;const ee=Re(C);if((ee.width>V||ee.height>V)&&(Z=V/Math.max(ee.width,ee.height)),Z<1)if(typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&C instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&C instanceof ImageBitmap||typeof VideoFrame<"u"&&C instanceof VideoFrame){const $=Math.floor(Z*ee.width),Ee=Math.floor(Z*ee.height);h===void 0&&(h=m($,Ee));const ce=S?m($,Ee):h;return ce.width=$,ce.height=Ee,ce.getContext("2d").drawImage(C,0,0,$,Ee),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+ee.width+"x"+ee.height+") to ("+$+"x"+Ee+")."),ce}else return"data"in C&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+ee.width+"x"+ee.height+")."),C;return C}function g(C){return C.generateMipmaps}function p(C){n.generateMipmap(C)}function y(C){return C.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:C.isWebGL3DRenderTarget?n.TEXTURE_3D:C.isWebGLArrayRenderTarget||C.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function x(C,S,V,Z,ee=!1){if(C!==null){if(n[C]!==void 0)return n[C];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+C+"'")}let $=S;if(S===n.RED&&(V===n.FLOAT&&($=n.R32F),V===n.HALF_FLOAT&&($=n.R16F),V===n.UNSIGNED_BYTE&&($=n.R8)),S===n.RED_INTEGER&&(V===n.UNSIGNED_BYTE&&($=n.R8UI),V===n.UNSIGNED_SHORT&&($=n.R16UI),V===n.UNSIGNED_INT&&($=n.R32UI),V===n.BYTE&&($=n.R8I),V===n.SHORT&&($=n.R16I),V===n.INT&&($=n.R32I)),S===n.RG&&(V===n.FLOAT&&($=n.RG32F),V===n.HALF_FLOAT&&($=n.RG16F),V===n.UNSIGNED_BYTE&&($=n.RG8)),S===n.RG_INTEGER&&(V===n.UNSIGNED_BYTE&&($=n.RG8UI),V===n.UNSIGNED_SHORT&&($=n.RG16UI),V===n.UNSIGNED_INT&&($=n.RG32UI),V===n.BYTE&&($=n.RG8I),V===n.SHORT&&($=n.RG16I),V===n.INT&&($=n.RG32I)),S===n.RGB_INTEGER&&(V===n.UNSIGNED_BYTE&&($=n.RGB8UI),V===n.UNSIGNED_SHORT&&($=n.RGB16UI),V===n.UNSIGNED_INT&&($=n.RGB32UI),V===n.BYTE&&($=n.RGB8I),V===n.SHORT&&($=n.RGB16I),V===n.INT&&($=n.RGB32I)),S===n.RGBA_INTEGER&&(V===n.UNSIGNED_BYTE&&($=n.RGBA8UI),V===n.UNSIGNED_SHORT&&($=n.RGBA16UI),V===n.UNSIGNED_INT&&($=n.RGBA32UI),V===n.BYTE&&($=n.RGBA8I),V===n.SHORT&&($=n.RGBA16I),V===n.INT&&($=n.RGBA32I)),S===n.RGB&&V===n.UNSIGNED_INT_5_9_9_9_REV&&($=n.RGB9_E5),S===n.RGBA){const Ee=ee?sl:Xe.getTransfer(Z);V===n.FLOAT&&($=n.RGBA32F),V===n.HALF_FLOAT&&($=n.RGBA16F),V===n.UNSIGNED_BYTE&&($=Ee===ot?n.SRGB8_ALPHA8:n.RGBA8),V===n.UNSIGNED_SHORT_4_4_4_4&&($=n.RGBA4),V===n.UNSIGNED_SHORT_5_5_5_1&&($=n.RGB5_A1)}return($===n.R16F||$===n.R32F||$===n.RG16F||$===n.RG32F||$===n.RGBA16F||$===n.RGBA32F)&&e.get("EXT_color_buffer_float"),$}function v(C,S){let V;return C?S===null||S===ar||S===Kr?V=n.DEPTH24_STENCIL8:S===wn?V=n.DEPTH32F_STENCIL8:S===Js&&(V=n.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):S===null||S===ar||S===Kr?V=n.DEPTH_COMPONENT24:S===wn?V=n.DEPTH_COMPONENT32F:S===Js&&(V=n.DEPTH_COMPONENT16),V}function w(C,S){return g(C)===!0||C.isFramebufferTexture&&C.minFilter!==Kt&&C.minFilter!==Yt?Math.log2(Math.max(S.width,S.height))+1:C.mipmaps!==void 0&&C.mipmaps.length>0?C.mipmaps.length:C.isCompressedTexture&&Array.isArray(C.image)?S.mipmaps.length:1}function b(C){const S=C.target;S.removeEventListener("dispose",b),R(S),S.isVideoTexture&&u.delete(S)}function A(C){const S=C.target;S.removeEventListener("dispose",A),M(S)}function R(C){const S=i.get(C);if(S.__webglInit===void 0)return;const V=C.source,Z=d.get(V);if(Z){const ee=Z[S.__cacheKey];ee.usedTimes--,ee.usedTimes===0&&T(C),Object.keys(Z).length===0&&d.delete(V)}i.remove(C)}function T(C){const S=i.get(C);n.deleteTexture(S.__webglTexture);const V=C.source,Z=d.get(V);delete Z[S.__cacheKey],a.memory.textures--}function M(C){const S=i.get(C);if(C.depthTexture&&(C.depthTexture.dispose(),i.remove(C.depthTexture)),C.isWebGLCubeRenderTarget)for(let Z=0;Z<6;Z++){if(Array.isArray(S.__webglFramebuffer[Z]))for(let ee=0;ee<S.__webglFramebuffer[Z].length;ee++)n.deleteFramebuffer(S.__webglFramebuffer[Z][ee]);else n.deleteFramebuffer(S.__webglFramebuffer[Z]);S.__webglDepthbuffer&&n.deleteRenderbuffer(S.__webglDepthbuffer[Z])}else{if(Array.isArray(S.__webglFramebuffer))for(let Z=0;Z<S.__webglFramebuffer.length;Z++)n.deleteFramebuffer(S.__webglFramebuffer[Z]);else n.deleteFramebuffer(S.__webglFramebuffer);if(S.__webglDepthbuffer&&n.deleteRenderbuffer(S.__webglDepthbuffer),S.__webglMultisampledFramebuffer&&n.deleteFramebuffer(S.__webglMultisampledFramebuffer),S.__webglColorRenderbuffer)for(let Z=0;Z<S.__webglColorRenderbuffer.length;Z++)S.__webglColorRenderbuffer[Z]&&n.deleteRenderbuffer(S.__webglColorRenderbuffer[Z]);S.__webglDepthRenderbuffer&&n.deleteRenderbuffer(S.__webglDepthRenderbuffer)}const V=C.textures;for(let Z=0,ee=V.length;Z<ee;Z++){const $=i.get(V[Z]);$.__webglTexture&&(n.deleteTexture($.__webglTexture),a.memory.textures--),i.remove(V[Z])}i.remove(C)}let L=0;function z(){L=0}function I(){const C=L;return C>=r.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+C+" texture units while this GPU supports only "+r.maxTextures),L+=1,C}function q(C){const S=[];return S.push(C.wrapS),S.push(C.wrapT),S.push(C.wrapR||0),S.push(C.magFilter),S.push(C.minFilter),S.push(C.anisotropy),S.push(C.internalFormat),S.push(C.format),S.push(C.type),S.push(C.generateMipmaps),S.push(C.premultiplyAlpha),S.push(C.flipY),S.push(C.unpackAlignment),S.push(C.colorSpace),S.join()}function k(C,S){const V=i.get(C);if(C.isVideoTexture&&Pe(C),C.isRenderTargetTexture===!1&&C.version>0&&V.__version!==C.version){const Z=C.image;if(Z===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(Z.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{H(V,C,S);return}}t.bindTexture(n.TEXTURE_2D,V.__webglTexture,n.TEXTURE0+S)}function O(C,S){const V=i.get(C);if(C.version>0&&V.__version!==C.version){H(V,C,S);return}t.bindTexture(n.TEXTURE_2D_ARRAY,V.__webglTexture,n.TEXTURE0+S)}function j(C,S){const V=i.get(C);if(C.version>0&&V.__version!==C.version){H(V,C,S);return}t.bindTexture(n.TEXTURE_3D,V.__webglTexture,n.TEXTURE0+S)}function B(C,S){const V=i.get(C);if(C.version>0&&V.__version!==C.version){K(V,C,S);return}t.bindTexture(n.TEXTURE_CUBE_MAP,V.__webglTexture,n.TEXTURE0+S)}const G={[$r]:n.REPEAT,[Ii]:n.CLAMP_TO_EDGE,[Po]:n.MIRRORED_REPEAT},Q={[Kt]:n.NEAREST,[wp]:n.NEAREST_MIPMAP_NEAREST,[Ns]:n.NEAREST_MIPMAP_LINEAR,[Yt]:n.LINEAR,[uo]:n.LINEAR_MIPMAP_NEAREST,[oi]:n.LINEAR_MIPMAP_LINEAR},ie={[Zg]:n.NEVER,[i_]:n.ALWAYS,[Jg]:n.LESS,[Bp]:n.LEQUAL,[Qg]:n.EQUAL,[n_]:n.GEQUAL,[e_]:n.GREATER,[t_]:n.NOTEQUAL};function me(C,S){if(S.type===wn&&e.has("OES_texture_float_linear")===!1&&(S.magFilter===Yt||S.magFilter===uo||S.magFilter===Ns||S.magFilter===oi||S.minFilter===Yt||S.minFilter===uo||S.minFilter===Ns||S.minFilter===oi)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(C,n.TEXTURE_WRAP_S,G[S.wrapS]),n.texParameteri(C,n.TEXTURE_WRAP_T,G[S.wrapT]),(C===n.TEXTURE_3D||C===n.TEXTURE_2D_ARRAY)&&n.texParameteri(C,n.TEXTURE_WRAP_R,G[S.wrapR]),n.texParameteri(C,n.TEXTURE_MAG_FILTER,Q[S.magFilter]),n.texParameteri(C,n.TEXTURE_MIN_FILTER,Q[S.minFilter]),S.compareFunction&&(n.texParameteri(C,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(C,n.TEXTURE_COMPARE_FUNC,ie[S.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(S.magFilter===Kt||S.minFilter!==Ns&&S.minFilter!==oi||S.type===wn&&e.has("OES_texture_float_linear")===!1)return;if(S.anisotropy>1||i.get(S).__currentAnisotropy){const V=e.get("EXT_texture_filter_anisotropic");n.texParameterf(C,V.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(S.anisotropy,r.getMaxAnisotropy())),i.get(S).__currentAnisotropy=S.anisotropy}}}function xe(C,S){let V=!1;C.__webglInit===void 0&&(C.__webglInit=!0,S.addEventListener("dispose",b));const Z=S.source;let ee=d.get(Z);ee===void 0&&(ee={},d.set(Z,ee));const $=q(S);if($!==C.__cacheKey){ee[$]===void 0&&(ee[$]={texture:n.createTexture(),usedTimes:0},a.memory.textures++,V=!0),ee[$].usedTimes++;const Ee=ee[C.__cacheKey];Ee!==void 0&&(ee[C.__cacheKey].usedTimes--,Ee.usedTimes===0&&T(S)),C.__cacheKey=$,C.__webglTexture=ee[$].texture}return V}function H(C,S,V){let Z=n.TEXTURE_2D;(S.isDataArrayTexture||S.isCompressedArrayTexture)&&(Z=n.TEXTURE_2D_ARRAY),S.isData3DTexture&&(Z=n.TEXTURE_3D);const ee=xe(C,S),$=S.source;t.bindTexture(Z,C.__webglTexture,n.TEXTURE0+V);const Ee=i.get($);if($.version!==Ee.__version||ee===!0){t.activeTexture(n.TEXTURE0+V);const ce=Xe.getPrimaries(Xe.workingColorSpace),_e=S.colorSpace===Pi?null:Xe.getPrimaries(S.colorSpace),Ze=S.colorSpace===Pi||ce===_e?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,S.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,S.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ze);let te=_(S.image,!1,r.maxTextureSize);te=ht(S,te);const ve=s.convert(S.format,S.colorSpace),Le=s.convert(S.type);let De=x(S.internalFormat,ve,Le,S.colorSpace,S.isVideoTexture);me(Z,S);let ye;const Ke=S.mipmaps,ze=S.isVideoTexture!==!0,ct=Ee.__version===void 0||ee===!0,D=$.dataReady,le=w(S,te);if(S.isDepthTexture)De=v(S.format===Zr,S.type),ct&&(ze?t.texStorage2D(n.TEXTURE_2D,1,De,te.width,te.height):t.texImage2D(n.TEXTURE_2D,0,De,te.width,te.height,0,ve,Le,null));else if(S.isDataTexture)if(Ke.length>0){ze&&ct&&t.texStorage2D(n.TEXTURE_2D,le,De,Ke[0].width,Ke[0].height);for(let Y=0,J=Ke.length;Y<J;Y++)ye=Ke[Y],ze?D&&t.texSubImage2D(n.TEXTURE_2D,Y,0,0,ye.width,ye.height,ve,Le,ye.data):t.texImage2D(n.TEXTURE_2D,Y,De,ye.width,ye.height,0,ve,Le,ye.data);S.generateMipmaps=!1}else ze?(ct&&t.texStorage2D(n.TEXTURE_2D,le,De,te.width,te.height),D&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,te.width,te.height,ve,Le,te.data)):t.texImage2D(n.TEXTURE_2D,0,De,te.width,te.height,0,ve,Le,te.data);else if(S.isCompressedTexture)if(S.isCompressedArrayTexture){ze&&ct&&t.texStorage3D(n.TEXTURE_2D_ARRAY,le,De,Ke[0].width,Ke[0].height,te.depth);for(let Y=0,J=Ke.length;Y<J;Y++)if(ye=Ke[Y],S.format!==_n)if(ve!==null)if(ze){if(D)if(S.layerUpdates.size>0){const de=uu(ye.width,ye.height,S.format,S.type);for(const ue of S.layerUpdates){const Fe=ye.data.subarray(ue*de/ye.data.BYTES_PER_ELEMENT,(ue+1)*de/ye.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,Y,0,0,ue,ye.width,ye.height,1,ve,Fe)}S.clearLayerUpdates()}else t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,Y,0,0,0,ye.width,ye.height,te.depth,ve,ye.data)}else t.compressedTexImage3D(n.TEXTURE_2D_ARRAY,Y,De,ye.width,ye.height,te.depth,0,ye.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else ze?D&&t.texSubImage3D(n.TEXTURE_2D_ARRAY,Y,0,0,0,ye.width,ye.height,te.depth,ve,Le,ye.data):t.texImage3D(n.TEXTURE_2D_ARRAY,Y,De,ye.width,ye.height,te.depth,0,ve,Le,ye.data)}else{ze&&ct&&t.texStorage2D(n.TEXTURE_2D,le,De,Ke[0].width,Ke[0].height);for(let Y=0,J=Ke.length;Y<J;Y++)ye=Ke[Y],S.format!==_n?ve!==null?ze?D&&t.compressedTexSubImage2D(n.TEXTURE_2D,Y,0,0,ye.width,ye.height,ve,ye.data):t.compressedTexImage2D(n.TEXTURE_2D,Y,De,ye.width,ye.height,0,ye.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):ze?D&&t.texSubImage2D(n.TEXTURE_2D,Y,0,0,ye.width,ye.height,ve,Le,ye.data):t.texImage2D(n.TEXTURE_2D,Y,De,ye.width,ye.height,0,ve,Le,ye.data)}else if(S.isDataArrayTexture)if(ze){if(ct&&t.texStorage3D(n.TEXTURE_2D_ARRAY,le,De,te.width,te.height,te.depth),D)if(S.layerUpdates.size>0){const Y=uu(te.width,te.height,S.format,S.type);for(const J of S.layerUpdates){const de=te.data.subarray(J*Y/te.data.BYTES_PER_ELEMENT,(J+1)*Y/te.data.BYTES_PER_ELEMENT);t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,J,te.width,te.height,1,ve,Le,de)}S.clearLayerUpdates()}else t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,te.width,te.height,te.depth,ve,Le,te.data)}else t.texImage3D(n.TEXTURE_2D_ARRAY,0,De,te.width,te.height,te.depth,0,ve,Le,te.data);else if(S.isData3DTexture)ze?(ct&&t.texStorage3D(n.TEXTURE_3D,le,De,te.width,te.height,te.depth),D&&t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,te.width,te.height,te.depth,ve,Le,te.data)):t.texImage3D(n.TEXTURE_3D,0,De,te.width,te.height,te.depth,0,ve,Le,te.data);else if(S.isFramebufferTexture){if(ct)if(ze)t.texStorage2D(n.TEXTURE_2D,le,De,te.width,te.height);else{let Y=te.width,J=te.height;for(let de=0;de<le;de++)t.texImage2D(n.TEXTURE_2D,de,De,Y,J,0,ve,Le,null),Y>>=1,J>>=1}}else if(Ke.length>0){if(ze&&ct){const Y=Re(Ke[0]);t.texStorage2D(n.TEXTURE_2D,le,De,Y.width,Y.height)}for(let Y=0,J=Ke.length;Y<J;Y++)ye=Ke[Y],ze?D&&t.texSubImage2D(n.TEXTURE_2D,Y,0,0,ve,Le,ye):t.texImage2D(n.TEXTURE_2D,Y,De,ve,Le,ye);S.generateMipmaps=!1}else if(ze){if(ct){const Y=Re(te);t.texStorage2D(n.TEXTURE_2D,le,De,Y.width,Y.height)}D&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,ve,Le,te)}else t.texImage2D(n.TEXTURE_2D,0,De,ve,Le,te);g(S)&&p(Z),Ee.__version=$.version,S.onUpdate&&S.onUpdate(S)}C.__version=S.version}function K(C,S,V){if(S.image.length!==6)return;const Z=xe(C,S),ee=S.source;t.bindTexture(n.TEXTURE_CUBE_MAP,C.__webglTexture,n.TEXTURE0+V);const $=i.get(ee);if(ee.version!==$.__version||Z===!0){t.activeTexture(n.TEXTURE0+V);const Ee=Xe.getPrimaries(Xe.workingColorSpace),ce=S.colorSpace===Pi?null:Xe.getPrimaries(S.colorSpace),_e=S.colorSpace===Pi||Ee===ce?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,S.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,S.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,_e);const Ze=S.isCompressedTexture||S.image[0].isCompressedTexture,te=S.image[0]&&S.image[0].isDataTexture,ve=[];for(let J=0;J<6;J++)!Ze&&!te?ve[J]=_(S.image[J],!0,r.maxCubemapSize):ve[J]=te?S.image[J].image:S.image[J],ve[J]=ht(S,ve[J]);const Le=ve[0],De=s.convert(S.format,S.colorSpace),ye=s.convert(S.type),Ke=x(S.internalFormat,De,ye,S.colorSpace),ze=S.isVideoTexture!==!0,ct=$.__version===void 0||Z===!0,D=ee.dataReady;let le=w(S,Le);me(n.TEXTURE_CUBE_MAP,S);let Y;if(Ze){ze&&ct&&t.texStorage2D(n.TEXTURE_CUBE_MAP,le,Ke,Le.width,Le.height);for(let J=0;J<6;J++){Y=ve[J].mipmaps;for(let de=0;de<Y.length;de++){const ue=Y[de];S.format!==_n?De!==null?ze?D&&t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,de,0,0,ue.width,ue.height,De,ue.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,de,Ke,ue.width,ue.height,0,ue.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):ze?D&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,de,0,0,ue.width,ue.height,De,ye,ue.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,de,Ke,ue.width,ue.height,0,De,ye,ue.data)}}}else{if(Y=S.mipmaps,ze&&ct){Y.length>0&&le++;const J=Re(ve[0]);t.texStorage2D(n.TEXTURE_CUBE_MAP,le,Ke,J.width,J.height)}for(let J=0;J<6;J++)if(te){ze?D&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,0,0,ve[J].width,ve[J].height,De,ye,ve[J].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,Ke,ve[J].width,ve[J].height,0,De,ye,ve[J].data);for(let de=0;de<Y.length;de++){const Fe=Y[de].image[J].image;ze?D&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,de+1,0,0,Fe.width,Fe.height,De,ye,Fe.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,de+1,Ke,Fe.width,Fe.height,0,De,ye,Fe.data)}}else{ze?D&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,0,0,De,ye,ve[J]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,Ke,De,ye,ve[J]);for(let de=0;de<Y.length;de++){const ue=Y[de];ze?D&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,de+1,0,0,De,ye,ue.image[J]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,de+1,Ke,De,ye,ue.image[J])}}}g(S)&&p(n.TEXTURE_CUBE_MAP),$.__version=ee.version,S.onUpdate&&S.onUpdate(S)}C.__version=S.version}function oe(C,S,V,Z,ee,$){const Ee=s.convert(V.format,V.colorSpace),ce=s.convert(V.type),_e=x(V.internalFormat,Ee,ce,V.colorSpace),Ze=i.get(S),te=i.get(V);if(te.__renderTarget=S,!Ze.__hasExternalTextures){const ve=Math.max(1,S.width>>$),Le=Math.max(1,S.height>>$);ee===n.TEXTURE_3D||ee===n.TEXTURE_2D_ARRAY?t.texImage3D(ee,$,_e,ve,Le,S.depth,0,Ee,ce,null):t.texImage2D(ee,$,_e,ve,Le,0,Ee,ce,null)}t.bindFramebuffer(n.FRAMEBUFFER,C),$e(S)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,Z,ee,te.__webglTexture,0,Ye(S)):(ee===n.TEXTURE_2D||ee>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&ee<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,Z,ee,te.__webglTexture,$),t.bindFramebuffer(n.FRAMEBUFFER,null)}function re(C,S,V){if(n.bindRenderbuffer(n.RENDERBUFFER,C),S.depthBuffer){const Z=S.depthTexture,ee=Z&&Z.isDepthTexture?Z.type:null,$=v(S.stencilBuffer,ee),Ee=S.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ce=Ye(S);$e(S)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,ce,$,S.width,S.height):V?n.renderbufferStorageMultisample(n.RENDERBUFFER,ce,$,S.width,S.height):n.renderbufferStorage(n.RENDERBUFFER,$,S.width,S.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,Ee,n.RENDERBUFFER,C)}else{const Z=S.textures;for(let ee=0;ee<Z.length;ee++){const $=Z[ee],Ee=s.convert($.format,$.colorSpace),ce=s.convert($.type),_e=x($.internalFormat,Ee,ce,$.colorSpace),Ze=Ye(S);V&&$e(S)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,Ze,_e,S.width,S.height):$e(S)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Ze,_e,S.width,S.height):n.renderbufferStorage(n.RENDERBUFFER,_e,S.width,S.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function Ae(C,S){if(S&&S.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(n.FRAMEBUFFER,C),!(S.depthTexture&&S.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const Z=i.get(S.depthTexture);Z.__renderTarget=S,(!Z.__webglTexture||S.depthTexture.image.width!==S.width||S.depthTexture.image.height!==S.height)&&(S.depthTexture.image.width=S.width,S.depthTexture.image.height=S.height,S.depthTexture.needsUpdate=!0),k(S.depthTexture,0);const ee=Z.__webglTexture,$=Ye(S);if(S.depthTexture.format===Vr)$e(S)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,ee,0,$):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,ee,0);else if(S.depthTexture.format===Zr)$e(S)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,ee,0,$):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,ee,0);else throw new Error("Unknown depthTexture format")}function Ce(C){const S=i.get(C),V=C.isWebGLCubeRenderTarget===!0;if(S.__boundDepthTexture!==C.depthTexture){const Z=C.depthTexture;if(S.__depthDisposeCallback&&S.__depthDisposeCallback(),Z){const ee=()=>{delete S.__boundDepthTexture,delete S.__depthDisposeCallback,Z.removeEventListener("dispose",ee)};Z.addEventListener("dispose",ee),S.__depthDisposeCallback=ee}S.__boundDepthTexture=Z}if(C.depthTexture&&!S.__autoAllocateDepthBuffer){if(V)throw new Error("target.depthTexture not supported in Cube render targets");Ae(S.__webglFramebuffer,C)}else if(V){S.__webglDepthbuffer=[];for(let Z=0;Z<6;Z++)if(t.bindFramebuffer(n.FRAMEBUFFER,S.__webglFramebuffer[Z]),S.__webglDepthbuffer[Z]===void 0)S.__webglDepthbuffer[Z]=n.createRenderbuffer(),re(S.__webglDepthbuffer[Z],C,!1);else{const ee=C.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,$=S.__webglDepthbuffer[Z];n.bindRenderbuffer(n.RENDERBUFFER,$),n.framebufferRenderbuffer(n.FRAMEBUFFER,ee,n.RENDERBUFFER,$)}}else if(t.bindFramebuffer(n.FRAMEBUFFER,S.__webglFramebuffer),S.__webglDepthbuffer===void 0)S.__webglDepthbuffer=n.createRenderbuffer(),re(S.__webglDepthbuffer,C,!1);else{const Z=C.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ee=S.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,ee),n.framebufferRenderbuffer(n.FRAMEBUFFER,Z,n.RENDERBUFFER,ee)}t.bindFramebuffer(n.FRAMEBUFFER,null)}function ke(C,S,V){const Z=i.get(C);S!==void 0&&oe(Z.__webglFramebuffer,C,C.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),V!==void 0&&Ce(C)}function lt(C){const S=C.texture,V=i.get(C),Z=i.get(S);C.addEventListener("dispose",A);const ee=C.textures,$=C.isWebGLCubeRenderTarget===!0,Ee=ee.length>1;if(Ee||(Z.__webglTexture===void 0&&(Z.__webglTexture=n.createTexture()),Z.__version=S.version,a.memory.textures++),$){V.__webglFramebuffer=[];for(let ce=0;ce<6;ce++)if(S.mipmaps&&S.mipmaps.length>0){V.__webglFramebuffer[ce]=[];for(let _e=0;_e<S.mipmaps.length;_e++)V.__webglFramebuffer[ce][_e]=n.createFramebuffer()}else V.__webglFramebuffer[ce]=n.createFramebuffer()}else{if(S.mipmaps&&S.mipmaps.length>0){V.__webglFramebuffer=[];for(let ce=0;ce<S.mipmaps.length;ce++)V.__webglFramebuffer[ce]=n.createFramebuffer()}else V.__webglFramebuffer=n.createFramebuffer();if(Ee)for(let ce=0,_e=ee.length;ce<_e;ce++){const Ze=i.get(ee[ce]);Ze.__webglTexture===void 0&&(Ze.__webglTexture=n.createTexture(),a.memory.textures++)}if(C.samples>0&&$e(C)===!1){V.__webglMultisampledFramebuffer=n.createFramebuffer(),V.__webglColorRenderbuffer=[],t.bindFramebuffer(n.FRAMEBUFFER,V.__webglMultisampledFramebuffer);for(let ce=0;ce<ee.length;ce++){const _e=ee[ce];V.__webglColorRenderbuffer[ce]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,V.__webglColorRenderbuffer[ce]);const Ze=s.convert(_e.format,_e.colorSpace),te=s.convert(_e.type),ve=x(_e.internalFormat,Ze,te,_e.colorSpace,C.isXRRenderTarget===!0),Le=Ye(C);n.renderbufferStorageMultisample(n.RENDERBUFFER,Le,ve,C.width,C.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+ce,n.RENDERBUFFER,V.__webglColorRenderbuffer[ce])}n.bindRenderbuffer(n.RENDERBUFFER,null),C.depthBuffer&&(V.__webglDepthRenderbuffer=n.createRenderbuffer(),re(V.__webglDepthRenderbuffer,C,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}}if($){t.bindTexture(n.TEXTURE_CUBE_MAP,Z.__webglTexture),me(n.TEXTURE_CUBE_MAP,S);for(let ce=0;ce<6;ce++)if(S.mipmaps&&S.mipmaps.length>0)for(let _e=0;_e<S.mipmaps.length;_e++)oe(V.__webglFramebuffer[ce][_e],C,S,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+ce,_e);else oe(V.__webglFramebuffer[ce],C,S,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+ce,0);g(S)&&p(n.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Ee){for(let ce=0,_e=ee.length;ce<_e;ce++){const Ze=ee[ce],te=i.get(Ze);t.bindTexture(n.TEXTURE_2D,te.__webglTexture),me(n.TEXTURE_2D,Ze),oe(V.__webglFramebuffer,C,Ze,n.COLOR_ATTACHMENT0+ce,n.TEXTURE_2D,0),g(Ze)&&p(n.TEXTURE_2D)}t.unbindTexture()}else{let ce=n.TEXTURE_2D;if((C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(ce=C.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(ce,Z.__webglTexture),me(ce,S),S.mipmaps&&S.mipmaps.length>0)for(let _e=0;_e<S.mipmaps.length;_e++)oe(V.__webglFramebuffer[_e],C,S,n.COLOR_ATTACHMENT0,ce,_e);else oe(V.__webglFramebuffer,C,S,n.COLOR_ATTACHMENT0,ce,0);g(S)&&p(ce),t.unbindTexture()}C.depthBuffer&&Ce(C)}function We(C){const S=C.textures;for(let V=0,Z=S.length;V<Z;V++){const ee=S[V];if(g(ee)){const $=y(C),Ee=i.get(ee).__webglTexture;t.bindTexture($,Ee),p($),t.unbindTexture()}}}const yt=[],F=[];function hn(C){if(C.samples>0){if($e(C)===!1){const S=C.textures,V=C.width,Z=C.height;let ee=n.COLOR_BUFFER_BIT;const $=C.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Ee=i.get(C),ce=S.length>1;if(ce)for(let _e=0;_e<S.length;_e++)t.bindFramebuffer(n.FRAMEBUFFER,Ee.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+_e,n.RENDERBUFFER,null),t.bindFramebuffer(n.FRAMEBUFFER,Ee.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+_e,n.TEXTURE_2D,null,0);t.bindFramebuffer(n.READ_FRAMEBUFFER,Ee.__webglMultisampledFramebuffer),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,Ee.__webglFramebuffer);for(let _e=0;_e<S.length;_e++){if(C.resolveDepthBuffer&&(C.depthBuffer&&(ee|=n.DEPTH_BUFFER_BIT),C.stencilBuffer&&C.resolveStencilBuffer&&(ee|=n.STENCIL_BUFFER_BIT)),ce){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,Ee.__webglColorRenderbuffer[_e]);const Ze=i.get(S[_e]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,Ze,0)}n.blitFramebuffer(0,0,V,Z,0,0,V,Z,ee,n.NEAREST),l===!0&&(yt.length=0,F.length=0,yt.push(n.COLOR_ATTACHMENT0+_e),C.depthBuffer&&C.resolveDepthBuffer===!1&&(yt.push($),F.push($),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,F)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,yt))}if(t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),ce)for(let _e=0;_e<S.length;_e++){t.bindFramebuffer(n.FRAMEBUFFER,Ee.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+_e,n.RENDERBUFFER,Ee.__webglColorRenderbuffer[_e]);const Ze=i.get(S[_e]).__webglTexture;t.bindFramebuffer(n.FRAMEBUFFER,Ee.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+_e,n.TEXTURE_2D,Ze,0)}t.bindFramebuffer(n.DRAW_FRAMEBUFFER,Ee.__webglMultisampledFramebuffer)}else if(C.depthBuffer&&C.resolveDepthBuffer===!1&&l){const S=C.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[S])}}}function Ye(C){return Math.min(r.maxSamples,C.samples)}function $e(C){const S=i.get(C);return C.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&S.__useRenderToTexture!==!1}function Pe(C){const S=a.render.frame;u.get(C)!==S&&(u.set(C,S),C.update())}function ht(C,S){const V=C.colorSpace,Z=C.format,ee=C.type;return C.isCompressedTexture===!0||C.isVideoTexture===!0||V!==zt&&V!==Pi&&(Xe.getTransfer(V)===ot?(Z!==_n||ee!==In)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",V)),S}function Re(C){return typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement?(c.width=C.naturalWidth||C.width,c.height=C.naturalHeight||C.height):typeof VideoFrame<"u"&&C instanceof VideoFrame?(c.width=C.displayWidth,c.height=C.displayHeight):(c.width=C.width,c.height=C.height),c}this.allocateTextureUnit=I,this.resetTextureUnits=z,this.setTexture2D=k,this.setTexture2DArray=O,this.setTexture3D=j,this.setTextureCube=B,this.rebindTextures=ke,this.setupRenderTarget=lt,this.updateRenderTargetMipmap=We,this.updateMultisampleRenderTarget=hn,this.setupDepthRenderbuffer=Ce,this.setupFrameBufferTexture=oe,this.useMultisampledRTT=$e}function bM(n,e){function t(i,r=Pi){let s;const a=Xe.getTransfer(r);if(i===In)return n.UNSIGNED_BYTE;if(i===Ru)return n.UNSIGNED_SHORT_4_4_4_4;if(i===Cu)return n.UNSIGNED_SHORT_5_5_5_1;if(i===Pp)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===Rp)return n.BYTE;if(i===Cp)return n.SHORT;if(i===Js)return n.UNSIGNED_SHORT;if(i===wu)return n.INT;if(i===ar)return n.UNSIGNED_INT;if(i===wn)return n.FLOAT;if(i===ha)return n.HALF_FLOAT;if(i===Lp)return n.ALPHA;if(i===Ip)return n.RGB;if(i===_n)return n.RGBA;if(i===Dp)return n.LUMINANCE;if(i===Up)return n.LUMINANCE_ALPHA;if(i===Vr)return n.DEPTH_COMPONENT;if(i===Zr)return n.DEPTH_STENCIL;if(i===Pu)return n.RED;if(i===Lu)return n.RED_INTEGER;if(i===rl)return n.RG;if(i===Iu)return n.RG_INTEGER;if(i===Du)return n.RGBA_INTEGER;if(i===ho||i===fo||i===po||i===mo)if(a===ot)if(s=e.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(i===ho)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===fo)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===po)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===mo)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=e.get("WEBGL_compressed_texture_s3tc"),s!==null){if(i===ho)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===fo)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===po)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===mo)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===Nc||i===Fc||i===Oc||i===Bc)if(s=e.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(i===Nc)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===Fc)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===Oc)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===Bc)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===kc||i===zc||i===Vc)if(s=e.get("WEBGL_compressed_texture_etc"),s!==null){if(i===kc||i===zc)return a===ot?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(i===Vc)return a===ot?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===Hc||i===Gc||i===Wc||i===Xc||i===qc||i===jc||i===Yc||i===$c||i===Kc||i===Zc||i===Jc||i===Qc||i===eu||i===tu)if(s=e.get("WEBGL_compressed_texture_astc"),s!==null){if(i===Hc)return a===ot?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Gc)return a===ot?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Wc)return a===ot?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Xc)return a===ot?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===qc)return a===ot?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===jc)return a===ot?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Yc)return a===ot?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===$c)return a===ot?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Kc)return a===ot?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Zc)return a===ot?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Jc)return a===ot?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Qc)return a===ot?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===eu)return a===ot?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===tu)return a===ot?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===go||i===nu||i===iu)if(s=e.get("EXT_texture_compression_bptc"),s!==null){if(i===go)return a===ot?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===nu)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===iu)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Np||i===ru||i===su||i===au)if(s=e.get("EXT_texture_compression_rgtc"),s!==null){if(i===go)return s.COMPRESSED_RED_RGTC1_EXT;if(i===ru)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===su)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===au)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Kr?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:t}}class AM extends Ot{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class kt extends pt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const wM={type:"move"};class Hl{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new kt,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new kt,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new P,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new P),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new kt,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new P,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new P),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let r=null,s=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(const _ of e.hand.values()){const g=t.getJointPose(_,i),p=this._getHandJoint(c,_);g!==null&&(p.matrix.fromArray(g.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=g.radius),p.visible=g!==null}const u=c.joints["index-finger-tip"],h=c.joints["thumb-tip"],d=u.position.distanceTo(h.position),f=.02,m=.005;c.inputState.pinching&&d>f+m?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&d<=f-m&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(s=t.getPose(e.gripSpace,i),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(r=t.getPose(e.targetRaySpace,i),r===null&&s!==null&&(r=s),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(wM)))}return o!==null&&(o.visible=r!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const i=new kt;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}}const RM=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,CM=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class PM{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,i){if(this.texture===null){const r=new St,s=e.properties.get(r);s.__webglTexture=t.texture,(t.depthNear!=i.depthNear||t.depthFar!=i.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=r}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,i=new Vn({vertexShader:RM,fragmentShader:CM,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new He(new es(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class LM extends kn{constructor(e,t){super();const i=this;let r=null,s=1,a=null,o="local-floor",l=1,c=null,u=null,h=null,d=null,f=null,m=null;const _=new PM,g=t.getContextAttributes();let p=null,y=null;const x=[],v=[],w=new fe;let b=null;const A=new Ot;A.viewport=new qe;const R=new Ot;R.viewport=new qe;const T=[A,R],M=new AM;let L=null,z=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(H){let K=x[H];return K===void 0&&(K=new Hl,x[H]=K),K.getTargetRaySpace()},this.getControllerGrip=function(H){let K=x[H];return K===void 0&&(K=new Hl,x[H]=K),K.getGripSpace()},this.getHand=function(H){let K=x[H];return K===void 0&&(K=new Hl,x[H]=K),K.getHandSpace()};function I(H){const K=v.indexOf(H.inputSource);if(K===-1)return;const oe=x[K];oe!==void 0&&(oe.update(H.inputSource,H.frame,c||a),oe.dispatchEvent({type:H.type,data:H.inputSource}))}function q(){r.removeEventListener("select",I),r.removeEventListener("selectstart",I),r.removeEventListener("selectend",I),r.removeEventListener("squeeze",I),r.removeEventListener("squeezestart",I),r.removeEventListener("squeezeend",I),r.removeEventListener("end",q),r.removeEventListener("inputsourceschange",k);for(let H=0;H<x.length;H++){const K=v[H];K!==null&&(v[H]=null,x[H].disconnect(K))}L=null,z=null,_.reset(),e.setRenderTarget(p),f=null,d=null,h=null,r=null,y=null,xe.stop(),i.isPresenting=!1,e.setPixelRatio(b),e.setSize(w.width,w.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(H){s=H,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(H){o=H,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(H){c=H},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return h},this.getFrame=function(){return m},this.getSession=function(){return r},this.setSession=async function(H){if(r=H,r!==null){if(p=e.getRenderTarget(),r.addEventListener("select",I),r.addEventListener("selectstart",I),r.addEventListener("selectend",I),r.addEventListener("squeeze",I),r.addEventListener("squeezestart",I),r.addEventListener("squeezeend",I),r.addEventListener("end",q),r.addEventListener("inputsourceschange",k),g.xrCompatible!==!0&&await t.makeXRCompatible(),b=e.getPixelRatio(),e.getSize(w),r.renderState.layers===void 0){const K={antialias:g.antialias,alpha:!0,depth:g.depth,stencil:g.stencil,framebufferScaleFactor:s};f=new XRWebGLLayer(r,t,K),r.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),y=new fi(f.framebufferWidth,f.framebufferHeight,{format:_n,type:In,colorSpace:e.outputColorSpace,stencilBuffer:g.stencil})}else{let K=null,oe=null,re=null;g.depth&&(re=g.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,K=g.stencil?Zr:Vr,oe=g.stencil?Kr:ar);const Ae={colorFormat:t.RGBA8,depthFormat:re,scaleFactor:s};h=new XRWebGLBinding(r,t),d=h.createProjectionLayer(Ae),r.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),y=new fi(d.textureWidth,d.textureHeight,{format:_n,type:In,depthTexture:new $p(d.textureWidth,d.textureHeight,oe,void 0,void 0,void 0,void 0,void 0,void 0,K),stencilBuffer:g.stencil,colorSpace:e.outputColorSpace,samples:g.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await r.requestReferenceSpace(o),xe.setContext(r),xe.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return _.getDepthTexture()};function k(H){for(let K=0;K<H.removed.length;K++){const oe=H.removed[K],re=v.indexOf(oe);re>=0&&(v[re]=null,x[re].disconnect(oe))}for(let K=0;K<H.added.length;K++){const oe=H.added[K];let re=v.indexOf(oe);if(re===-1){for(let Ce=0;Ce<x.length;Ce++)if(Ce>=v.length){v.push(oe),re=Ce;break}else if(v[Ce]===null){v[Ce]=oe,re=Ce;break}if(re===-1)break}const Ae=x[re];Ae&&Ae.connect(oe)}}const O=new P,j=new P;function B(H,K,oe){O.setFromMatrixPosition(K.matrixWorld),j.setFromMatrixPosition(oe.matrixWorld);const re=O.distanceTo(j),Ae=K.projectionMatrix.elements,Ce=oe.projectionMatrix.elements,ke=Ae[14]/(Ae[10]-1),lt=Ae[14]/(Ae[10]+1),We=(Ae[9]+1)/Ae[5],yt=(Ae[9]-1)/Ae[5],F=(Ae[8]-1)/Ae[0],hn=(Ce[8]+1)/Ce[0],Ye=ke*F,$e=ke*hn,Pe=re/(-F+hn),ht=Pe*-F;if(K.matrixWorld.decompose(H.position,H.quaternion,H.scale),H.translateX(ht),H.translateZ(Pe),H.matrixWorld.compose(H.position,H.quaternion,H.scale),H.matrixWorldInverse.copy(H.matrixWorld).invert(),Ae[10]===-1)H.projectionMatrix.copy(K.projectionMatrix),H.projectionMatrixInverse.copy(K.projectionMatrixInverse);else{const Re=ke+Pe,C=lt+Pe,S=Ye-ht,V=$e+(re-ht),Z=We*lt/C*Re,ee=yt*lt/C*Re;H.projectionMatrix.makePerspective(S,V,Z,ee,Re,C),H.projectionMatrixInverse.copy(H.projectionMatrix).invert()}}function G(H,K){K===null?H.matrixWorld.copy(H.matrix):H.matrixWorld.multiplyMatrices(K.matrixWorld,H.matrix),H.matrixWorldInverse.copy(H.matrixWorld).invert()}this.updateCamera=function(H){if(r===null)return;let K=H.near,oe=H.far;_.texture!==null&&(_.depthNear>0&&(K=_.depthNear),_.depthFar>0&&(oe=_.depthFar)),M.near=R.near=A.near=K,M.far=R.far=A.far=oe,(L!==M.near||z!==M.far)&&(r.updateRenderState({depthNear:M.near,depthFar:M.far}),L=M.near,z=M.far),A.layers.mask=H.layers.mask|2,R.layers.mask=H.layers.mask|4,M.layers.mask=A.layers.mask|R.layers.mask;const re=H.parent,Ae=M.cameras;G(M,re);for(let Ce=0;Ce<Ae.length;Ce++)G(Ae[Ce],re);Ae.length===2?B(M,A,R):M.projectionMatrix.copy(A.projectionMatrix),Q(H,M,re)};function Q(H,K,oe){oe===null?H.matrix.copy(K.matrixWorld):(H.matrix.copy(oe.matrixWorld),H.matrix.invert(),H.matrix.multiply(K.matrixWorld)),H.matrix.decompose(H.position,H.quaternion,H.scale),H.updateMatrixWorld(!0),H.projectionMatrix.copy(K.projectionMatrix),H.projectionMatrixInverse.copy(K.projectionMatrixInverse),H.isPerspectiveCamera&&(H.fov=Jr*2*Math.atan(1/H.projectionMatrix.elements[5]),H.zoom=1)}this.getCamera=function(){return M},this.getFoveation=function(){if(!(d===null&&f===null))return l},this.setFoveation=function(H){l=H,d!==null&&(d.fixedFoveation=H),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=H)},this.hasDepthSensing=function(){return _.texture!==null},this.getDepthSensingMesh=function(){return _.getMesh(M)};let ie=null;function me(H,K){if(u=K.getViewerPose(c||a),m=K,u!==null){const oe=u.views;f!==null&&(e.setRenderTargetFramebuffer(y,f.framebuffer),e.setRenderTarget(y));let re=!1;oe.length!==M.cameras.length&&(M.cameras.length=0,re=!0);for(let Ce=0;Ce<oe.length;Ce++){const ke=oe[Ce];let lt=null;if(f!==null)lt=f.getViewport(ke);else{const yt=h.getViewSubImage(d,ke);lt=yt.viewport,Ce===0&&(e.setRenderTargetTextures(y,yt.colorTexture,d.ignoreDepthValues?void 0:yt.depthStencilTexture),e.setRenderTarget(y))}let We=T[Ce];We===void 0&&(We=new Ot,We.layers.enable(Ce),We.viewport=new qe,T[Ce]=We),We.matrix.fromArray(ke.transform.matrix),We.matrix.decompose(We.position,We.quaternion,We.scale),We.projectionMatrix.fromArray(ke.projectionMatrix),We.projectionMatrixInverse.copy(We.projectionMatrix).invert(),We.viewport.set(lt.x,lt.y,lt.width,lt.height),Ce===0&&(M.matrix.copy(We.matrix),M.matrix.decompose(M.position,M.quaternion,M.scale)),re===!0&&M.cameras.push(We)}const Ae=r.enabledFeatures;if(Ae&&Ae.includes("depth-sensing")){const Ce=h.getDepthInformation(oe[0]);Ce&&Ce.isValid&&Ce.texture&&_.init(e,Ce,r.renderState)}}for(let oe=0;oe<x.length;oe++){const re=v[oe],Ae=x[oe];re!==null&&Ae!==void 0&&Ae.update(re,K,c||a)}ie&&ie(H,K),K.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:K}),m=null}const xe=new Yp;xe.setAnimationLoop(me),this.setAnimationLoop=function(H){ie=H},this.dispose=function(){}}}const Xi=new Dn,IM=new ge;function DM(n,e){function t(g,p){g.matrixAutoUpdate===!0&&g.updateMatrix(),p.value.copy(g.matrix)}function i(g,p){p.color.getRGB(g.fogColor.value,Xp(n)),p.isFog?(g.fogNear.value=p.near,g.fogFar.value=p.far):p.isFogExp2&&(g.fogDensity.value=p.density)}function r(g,p,y,x,v){p.isMeshBasicMaterial||p.isMeshLambertMaterial?s(g,p):p.isMeshToonMaterial?(s(g,p),h(g,p)):p.isMeshPhongMaterial?(s(g,p),u(g,p)):p.isMeshStandardMaterial?(s(g,p),d(g,p),p.isMeshPhysicalMaterial&&f(g,p,v)):p.isMeshMatcapMaterial?(s(g,p),m(g,p)):p.isMeshDepthMaterial?s(g,p):p.isMeshDistanceMaterial?(s(g,p),_(g,p)):p.isMeshNormalMaterial?s(g,p):p.isLineBasicMaterial?(a(g,p),p.isLineDashedMaterial&&o(g,p)):p.isPointsMaterial?l(g,p,y,x):p.isSpriteMaterial?c(g,p):p.isShadowMaterial?(g.color.value.copy(p.color),g.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function s(g,p){g.opacity.value=p.opacity,p.color&&g.diffuse.value.copy(p.color),p.emissive&&g.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(g.map.value=p.map,t(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,t(p.alphaMap,g.alphaMapTransform)),p.bumpMap&&(g.bumpMap.value=p.bumpMap,t(p.bumpMap,g.bumpMapTransform),g.bumpScale.value=p.bumpScale,p.side===$t&&(g.bumpScale.value*=-1)),p.normalMap&&(g.normalMap.value=p.normalMap,t(p.normalMap,g.normalMapTransform),g.normalScale.value.copy(p.normalScale),p.side===$t&&g.normalScale.value.negate()),p.displacementMap&&(g.displacementMap.value=p.displacementMap,t(p.displacementMap,g.displacementMapTransform),g.displacementScale.value=p.displacementScale,g.displacementBias.value=p.displacementBias),p.emissiveMap&&(g.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,g.emissiveMapTransform)),p.specularMap&&(g.specularMap.value=p.specularMap,t(p.specularMap,g.specularMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest);const y=e.get(p),x=y.envMap,v=y.envMapRotation;x&&(g.envMap.value=x,Xi.copy(v),Xi.x*=-1,Xi.y*=-1,Xi.z*=-1,x.isCubeTexture&&x.isRenderTargetTexture===!1&&(Xi.y*=-1,Xi.z*=-1),g.envMapRotation.value.setFromMatrix4(IM.makeRotationFromEuler(Xi)),g.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,g.reflectivity.value=p.reflectivity,g.ior.value=p.ior,g.refractionRatio.value=p.refractionRatio),p.lightMap&&(g.lightMap.value=p.lightMap,g.lightMapIntensity.value=p.lightMapIntensity,t(p.lightMap,g.lightMapTransform)),p.aoMap&&(g.aoMap.value=p.aoMap,g.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,g.aoMapTransform))}function a(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,p.map&&(g.map.value=p.map,t(p.map,g.mapTransform))}function o(g,p){g.dashSize.value=p.dashSize,g.totalSize.value=p.dashSize+p.gapSize,g.scale.value=p.scale}function l(g,p,y,x){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.size.value=p.size*y,g.scale.value=x*.5,p.map&&(g.map.value=p.map,t(p.map,g.uvTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,t(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function c(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.rotation.value=p.rotation,p.map&&(g.map.value=p.map,t(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,t(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function u(g,p){g.specular.value.copy(p.specular),g.shininess.value=Math.max(p.shininess,1e-4)}function h(g,p){p.gradientMap&&(g.gradientMap.value=p.gradientMap)}function d(g,p){g.metalness.value=p.metalness,p.metalnessMap&&(g.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,g.metalnessMapTransform)),g.roughness.value=p.roughness,p.roughnessMap&&(g.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,g.roughnessMapTransform)),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)}function f(g,p,y){g.ior.value=p.ior,p.sheen>0&&(g.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),g.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(g.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,g.sheenColorMapTransform)),p.sheenRoughnessMap&&(g.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,g.sheenRoughnessMapTransform))),p.clearcoat>0&&(g.clearcoat.value=p.clearcoat,g.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(g.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,g.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(g.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===$t&&g.clearcoatNormalScale.value.negate())),p.dispersion>0&&(g.dispersion.value=p.dispersion),p.iridescence>0&&(g.iridescence.value=p.iridescence,g.iridescenceIOR.value=p.iridescenceIOR,g.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(g.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,g.iridescenceMapTransform)),p.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),p.transmission>0&&(g.transmission.value=p.transmission,g.transmissionSamplerMap.value=y.texture,g.transmissionSamplerSize.value.set(y.width,y.height),p.transmissionMap&&(g.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,g.transmissionMapTransform)),g.thickness.value=p.thickness,p.thicknessMap&&(g.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=p.attenuationDistance,g.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(g.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(g.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=p.specularIntensity,g.specularColor.value.copy(p.specularColor),p.specularColorMap&&(g.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,g.specularColorMapTransform)),p.specularIntensityMap&&(g.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,g.specularIntensityMapTransform))}function m(g,p){p.matcap&&(g.matcap.value=p.matcap)}function _(g,p){const y=e.get(p).light;g.referencePosition.value.setFromMatrixPosition(y.matrixWorld),g.nearDistance.value=y.shadow.camera.near,g.farDistance.value=y.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:r}}function UM(n,e,t,i){let r={},s={},a=[];const o=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function l(y,x){const v=x.program;i.uniformBlockBinding(y,v)}function c(y,x){let v=r[y.id];v===void 0&&(m(y),v=u(y),r[y.id]=v,y.addEventListener("dispose",g));const w=x.program;i.updateUBOMapping(y,w);const b=e.render.frame;s[y.id]!==b&&(d(y),s[y.id]=b)}function u(y){const x=h();y.__bindingPointIndex=x;const v=n.createBuffer(),w=y.__size,b=y.usage;return n.bindBuffer(n.UNIFORM_BUFFER,v),n.bufferData(n.UNIFORM_BUFFER,w,b),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,x,v),v}function h(){for(let y=0;y<o;y++)if(a.indexOf(y)===-1)return a.push(y),y;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(y){const x=r[y.id],v=y.uniforms,w=y.__cache;n.bindBuffer(n.UNIFORM_BUFFER,x);for(let b=0,A=v.length;b<A;b++){const R=Array.isArray(v[b])?v[b]:[v[b]];for(let T=0,M=R.length;T<M;T++){const L=R[T];if(f(L,b,T,w)===!0){const z=L.__offset,I=Array.isArray(L.value)?L.value:[L.value];let q=0;for(let k=0;k<I.length;k++){const O=I[k],j=_(O);typeof O=="number"||typeof O=="boolean"?(L.__data[0]=O,n.bufferSubData(n.UNIFORM_BUFFER,z+q,L.__data)):O.isMatrix3?(L.__data[0]=O.elements[0],L.__data[1]=O.elements[1],L.__data[2]=O.elements[2],L.__data[3]=0,L.__data[4]=O.elements[3],L.__data[5]=O.elements[4],L.__data[6]=O.elements[5],L.__data[7]=0,L.__data[8]=O.elements[6],L.__data[9]=O.elements[7],L.__data[10]=O.elements[8],L.__data[11]=0):(O.toArray(L.__data,q),q+=j.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,z,L.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function f(y,x,v,w){const b=y.value,A=x+"_"+v;if(w[A]===void 0)return typeof b=="number"||typeof b=="boolean"?w[A]=b:w[A]=b.clone(),!0;{const R=w[A];if(typeof b=="number"||typeof b=="boolean"){if(R!==b)return w[A]=b,!0}else if(R.equals(b)===!1)return R.copy(b),!0}return!1}function m(y){const x=y.uniforms;let v=0;const w=16;for(let A=0,R=x.length;A<R;A++){const T=Array.isArray(x[A])?x[A]:[x[A]];for(let M=0,L=T.length;M<L;M++){const z=T[M],I=Array.isArray(z.value)?z.value:[z.value];for(let q=0,k=I.length;q<k;q++){const O=I[q],j=_(O),B=v%w,G=B%j.boundary,Q=B+G;v+=G,Q!==0&&w-Q<j.storage&&(v+=w-Q),z.__data=new Float32Array(j.storage/Float32Array.BYTES_PER_ELEMENT),z.__offset=v,v+=j.storage}}}const b=v%w;return b>0&&(v+=w-b),y.__size=v,y.__cache={},this}function _(y){const x={boundary:0,storage:0};return typeof y=="number"||typeof y=="boolean"?(x.boundary=4,x.storage=4):y.isVector2?(x.boundary=8,x.storage=8):y.isVector3||y.isColor?(x.boundary=16,x.storage=12):y.isVector4?(x.boundary=16,x.storage=16):y.isMatrix3?(x.boundary=48,x.storage=48):y.isMatrix4?(x.boundary=64,x.storage=64):y.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",y),x}function g(y){const x=y.target;x.removeEventListener("dispose",g);const v=a.indexOf(x.__bindingPointIndex);a.splice(v,1),n.deleteBuffer(r[x.id]),delete r[x.id],delete s[x.id]}function p(){for(const y in r)n.deleteBuffer(r[y]);a=[],r={},s={}}return{bind:l,update:c,dispose:p}}class Ou{constructor(e={}){const{canvas:t=y_(),context:i=null,depth:r=!0,stencil:s=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:h=!1,reverseDepthBuffer:d=!1}=e;this.isWebGLRenderer=!0;let f;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");f=i.getContextAttributes().alpha}else f=a;const m=new Uint32Array(4),_=new Int32Array(4);let g=null,p=null;const y=[],x=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=gt,this.toneMapping=Oi,this.toneMappingExposure=1;const v=this;let w=!1,b=0,A=0,R=null,T=-1,M=null;const L=new qe,z=new qe;let I=null;const q=new we(0);let k=0,O=t.width,j=t.height,B=1,G=null,Q=null;const ie=new qe(0,0,O,j),me=new qe(0,0,O,j);let xe=!1;const H=new al;let K=!1,oe=!1;const re=new ge,Ae=new ge,Ce=new P,ke=new qe,lt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let We=!1;function yt(){return R===null?B:1}let F=i;function hn(E,U){return t.getContext(E,U)}try{const E={alpha:!0,depth:r,stencil:s,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:h};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Au}`),t.addEventListener("webglcontextlost",J,!1),t.addEventListener("webglcontextrestored",de,!1),t.addEventListener("webglcontextcreationerror",ue,!1),F===null){const U="webgl2";if(F=hn(U,E),F===null)throw hn(U)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(E){throw console.error("THREE.WebGLRenderer: "+E.message),E}let Ye,$e,Pe,ht,Re,C,S,V,Z,ee,$,Ee,ce,_e,Ze,te,ve,Le,De,ye,Ke,ze,ct,D;function le(){Ye=new Ov(F),Ye.init(),ze=new bM(F,Ye),$e=new Lv(F,Ye,e,ze),Pe=new vM(F,Ye),$e.reverseDepthBuffer&&d&&Pe.buffers.depth.setReversed(!0),ht=new zv(F),Re=new rM,C=new EM(F,Ye,Pe,Re,$e,ze,ht),S=new Dv(v),V=new Fv(v),Z=new j_(F),ct=new Cv(F,Z),ee=new Bv(F,Z,ht,ct),$=new Hv(F,ee,Z,ht),De=new Vv(F,$e,C),te=new Iv(Re),Ee=new iM(v,S,V,Ye,$e,ct,te),ce=new DM(v,Re),_e=new aM,Ze=new dM(Ye),Le=new Rv(v,S,V,Pe,$,f,l),ve=new _M(v,$,$e),D=new UM(F,ht,$e,Pe),ye=new Pv(F,Ye,ht),Ke=new kv(F,Ye,ht),ht.programs=Ee.programs,v.capabilities=$e,v.extensions=Ye,v.properties=Re,v.renderLists=_e,v.shadowMap=ve,v.state=Pe,v.info=ht}le();const Y=new LM(v,F);this.xr=Y,this.getContext=function(){return F},this.getContextAttributes=function(){return F.getContextAttributes()},this.forceContextLoss=function(){const E=Ye.get("WEBGL_lose_context");E&&E.loseContext()},this.forceContextRestore=function(){const E=Ye.get("WEBGL_lose_context");E&&E.restoreContext()},this.getPixelRatio=function(){return B},this.setPixelRatio=function(E){E!==void 0&&(B=E,this.setSize(O,j,!1))},this.getSize=function(E){return E.set(O,j)},this.setSize=function(E,U,W=!0){if(Y.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}O=E,j=U,t.width=Math.floor(E*B),t.height=Math.floor(U*B),W===!0&&(t.style.width=E+"px",t.style.height=U+"px"),this.setViewport(0,0,E,U)},this.getDrawingBufferSize=function(E){return E.set(O*B,j*B).floor()},this.setDrawingBufferSize=function(E,U,W){O=E,j=U,B=W,t.width=Math.floor(E*W),t.height=Math.floor(U*W),this.setViewport(0,0,E,U)},this.getCurrentViewport=function(E){return E.copy(L)},this.getViewport=function(E){return E.copy(ie)},this.setViewport=function(E,U,W,X){E.isVector4?ie.set(E.x,E.y,E.z,E.w):ie.set(E,U,W,X),Pe.viewport(L.copy(ie).multiplyScalar(B).round())},this.getScissor=function(E){return E.copy(me)},this.setScissor=function(E,U,W,X){E.isVector4?me.set(E.x,E.y,E.z,E.w):me.set(E,U,W,X),Pe.scissor(z.copy(me).multiplyScalar(B).round())},this.getScissorTest=function(){return xe},this.setScissorTest=function(E){Pe.setScissorTest(xe=E)},this.setOpaqueSort=function(E){G=E},this.setTransparentSort=function(E){Q=E},this.getClearColor=function(E){return E.copy(Le.getClearColor())},this.setClearColor=function(){Le.setClearColor.apply(Le,arguments)},this.getClearAlpha=function(){return Le.getClearAlpha()},this.setClearAlpha=function(){Le.setClearAlpha.apply(Le,arguments)},this.clear=function(E=!0,U=!0,W=!0){let X=0;if(E){let N=!1;if(R!==null){const ne=R.texture.format;N=ne===Du||ne===Iu||ne===Lu}if(N){const ne=R.texture.type,he=ne===In||ne===ar||ne===Js||ne===Kr||ne===Ru||ne===Cu,Me=Le.getClearColor(),Te=Le.getClearAlpha(),Ue=Me.r,Oe=Me.g,Se=Me.b;he?(m[0]=Ue,m[1]=Oe,m[2]=Se,m[3]=Te,F.clearBufferuiv(F.COLOR,0,m)):(_[0]=Ue,_[1]=Oe,_[2]=Se,_[3]=Te,F.clearBufferiv(F.COLOR,0,_))}else X|=F.COLOR_BUFFER_BIT}U&&(X|=F.DEPTH_BUFFER_BIT),W&&(X|=F.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),F.clear(X)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",J,!1),t.removeEventListener("webglcontextrestored",de,!1),t.removeEventListener("webglcontextcreationerror",ue,!1),_e.dispose(),Ze.dispose(),Re.dispose(),S.dispose(),V.dispose(),$.dispose(),ct.dispose(),D.dispose(),Ee.dispose(),Y.dispose(),Y.removeEventListener("sessionstart",lh),Y.removeEventListener("sessionend",ch),ki.stop()};function J(E){E.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),w=!0}function de(){console.log("THREE.WebGLRenderer: Context Restored."),w=!1;const E=ht.autoReset,U=ve.enabled,W=ve.autoUpdate,X=ve.needsUpdate,N=ve.type;le(),ht.autoReset=E,ve.enabled=U,ve.autoUpdate=W,ve.needsUpdate=X,ve.type=N}function ue(E){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",E.statusMessage)}function Fe(E){const U=E.target;U.removeEventListener("dispose",Fe),xt(U)}function xt(E){Lt(E),Re.remove(E)}function Lt(E){const U=Re.get(E).programs;U!==void 0&&(U.forEach(function(W){Ee.releaseProgram(W)}),E.isShaderMaterial&&Ee.releaseShaderCache(E))}this.renderBufferDirect=function(E,U,W,X,N,ne){U===null&&(U=lt);const he=N.isMesh&&N.matrixWorld.determinant()<0,Me=$m(E,U,W,X,N);Pe.setMaterial(X,he);let Te=W.index,Ue=1;if(X.wireframe===!0){if(Te=ee.getWireframeAttribute(W),Te===void 0)return;Ue=2}const Oe=W.drawRange,Se=W.attributes.position;let Je=Oe.start*Ue,ut=(Oe.start+Oe.count)*Ue;ne!==null&&(Je=Math.max(Je,ne.start*Ue),ut=Math.min(ut,(ne.start+ne.count)*Ue)),Te!==null?(Je=Math.max(Je,0),ut=Math.min(ut,Te.count)):Se!=null&&(Je=Math.max(Je,0),ut=Math.min(ut,Se.count));const dt=ut-Je;if(dt<0||dt===1/0)return;ct.setup(N,X,Me,W,Te);let Jt,et=ye;if(Te!==null&&(Jt=Z.get(Te),et=Ke,et.setIndex(Jt)),N.isMesh)X.wireframe===!0?(Pe.setLineWidth(X.wireframeLinewidth*yt()),et.setMode(F.LINES)):et.setMode(F.TRIANGLES);else if(N.isLine){let be=X.linewidth;be===void 0&&(be=1),Pe.setLineWidth(be*yt()),N.isLineSegments?et.setMode(F.LINES):N.isLineLoop?et.setMode(F.LINE_LOOP):et.setMode(F.LINE_STRIP)}else N.isPoints?et.setMode(F.POINTS):N.isSprite&&et.setMode(F.TRIANGLES);if(N.isBatchedMesh)if(N._multiDrawInstances!==null)et.renderMultiDrawInstances(N._multiDrawStarts,N._multiDrawCounts,N._multiDrawCount,N._multiDrawInstances);else if(Ye.get("WEBGL_multi_draw"))et.renderMultiDraw(N._multiDrawStarts,N._multiDrawCounts,N._multiDrawCount);else{const be=N._multiDrawStarts,Xn=N._multiDrawCounts,tt=N._multiDrawCount,yn=Te?Z.get(Te).bytesPerElement:1,hr=Re.get(X).currentProgram.getUniforms();for(let nn=0;nn<tt;nn++)hr.setValue(F,"_gl_DrawID",nn),et.render(be[nn]/yn,Xn[nn])}else if(N.isInstancedMesh)et.renderInstances(Je,dt,N.count);else if(W.isInstancedBufferGeometry){const be=W._maxInstanceCount!==void 0?W._maxInstanceCount:1/0,Xn=Math.min(W.instanceCount,be);et.renderInstances(Je,dt,Xn)}else et.render(Je,dt)};function it(E,U,W){E.transparent===!0&&E.side===bn&&E.forceSinglePass===!1?(E.side=$t,E.needsUpdate=!0,xa(E,U,W),E.side=di,E.needsUpdate=!0,xa(E,U,W),E.side=bn):xa(E,U,W)}this.compile=function(E,U,W=null){W===null&&(W=E),p=Ze.get(W),p.init(U),x.push(p),W.traverseVisible(function(N){N.isLight&&N.layers.test(U.layers)&&(p.pushLight(N),N.castShadow&&p.pushShadow(N))}),E!==W&&E.traverseVisible(function(N){N.isLight&&N.layers.test(U.layers)&&(p.pushLight(N),N.castShadow&&p.pushShadow(N))}),p.setupLights();const X=new Set;return E.traverse(function(N){if(!(N.isMesh||N.isPoints||N.isLine||N.isSprite))return;const ne=N.material;if(ne)if(Array.isArray(ne))for(let he=0;he<ne.length;he++){const Me=ne[he];it(Me,W,N),X.add(Me)}else it(ne,W,N),X.add(ne)}),x.pop(),p=null,X},this.compileAsync=function(E,U,W=null){const X=this.compile(E,U,W);return new Promise(N=>{function ne(){if(X.forEach(function(he){Re.get(he).currentProgram.isReady()&&X.delete(he)}),X.size===0){N(E);return}setTimeout(ne,10)}Ye.get("KHR_parallel_shader_compile")!==null?ne():setTimeout(ne,10)})};let vn=null;function Wn(E){vn&&vn(E)}function lh(){ki.stop()}function ch(){ki.start()}const ki=new Yp;ki.setAnimationLoop(Wn),typeof self<"u"&&ki.setContext(self),this.setAnimationLoop=function(E){vn=E,Y.setAnimationLoop(E),E===null?ki.stop():ki.start()},Y.addEventListener("sessionstart",lh),Y.addEventListener("sessionend",ch),this.render=function(E,U){if(U!==void 0&&U.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(w===!0)return;if(E.matrixWorldAutoUpdate===!0&&E.updateMatrixWorld(),U.parent===null&&U.matrixWorldAutoUpdate===!0&&U.updateMatrixWorld(),Y.enabled===!0&&Y.isPresenting===!0&&(Y.cameraAutoUpdate===!0&&Y.updateCamera(U),U=Y.getCamera()),E.isScene===!0&&E.onBeforeRender(v,E,U,R),p=Ze.get(E,x.length),p.init(U),x.push(p),Ae.multiplyMatrices(U.projectionMatrix,U.matrixWorldInverse),H.setFromProjectionMatrix(Ae),oe=this.localClippingEnabled,K=te.init(this.clippingPlanes,oe),g=_e.get(E,y.length),g.init(),y.push(g),Y.enabled===!0&&Y.isPresenting===!0){const ne=v.xr.getDepthSensingMesh();ne!==null&&fl(ne,U,-1/0,v.sortObjects)}fl(E,U,0,v.sortObjects),g.finish(),v.sortObjects===!0&&g.sort(G,Q),We=Y.enabled===!1||Y.isPresenting===!1||Y.hasDepthSensing()===!1,We&&Le.addToRenderList(g,E),this.info.render.frame++,K===!0&&te.beginShadows();const W=p.state.shadowsArray;ve.render(W,E,U),K===!0&&te.endShadows(),this.info.autoReset===!0&&this.info.reset();const X=g.opaque,N=g.transmissive;if(p.setupLights(),U.isArrayCamera){const ne=U.cameras;if(N.length>0)for(let he=0,Me=ne.length;he<Me;he++){const Te=ne[he];hh(X,N,E,Te)}We&&Le.render(E);for(let he=0,Me=ne.length;he<Me;he++){const Te=ne[he];uh(g,E,Te,Te.viewport)}}else N.length>0&&hh(X,N,E,U),We&&Le.render(E),uh(g,E,U);R!==null&&(C.updateMultisampleRenderTarget(R),C.updateRenderTargetMipmap(R)),E.isScene===!0&&E.onAfterRender(v,E,U),ct.resetDefaultState(),T=-1,M=null,x.pop(),x.length>0?(p=x[x.length-1],K===!0&&te.setGlobalState(v.clippingPlanes,p.state.camera)):p=null,y.pop(),y.length>0?g=y[y.length-1]:g=null};function fl(E,U,W,X){if(E.visible===!1)return;if(E.layers.test(U.layers)){if(E.isGroup)W=E.renderOrder;else if(E.isLOD)E.autoUpdate===!0&&E.update(U);else if(E.isLight)p.pushLight(E),E.castShadow&&p.pushShadow(E);else if(E.isSprite){if(!E.frustumCulled||H.intersectsSprite(E)){X&&ke.setFromMatrixPosition(E.matrixWorld).applyMatrix4(Ae);const he=$.update(E),Me=E.material;Me.visible&&g.push(E,he,Me,W,ke.z,null)}}else if((E.isMesh||E.isLine||E.isPoints)&&(!E.frustumCulled||H.intersectsObject(E))){const he=$.update(E),Me=E.material;if(X&&(E.boundingSphere!==void 0?(E.boundingSphere===null&&E.computeBoundingSphere(),ke.copy(E.boundingSphere.center)):(he.boundingSphere===null&&he.computeBoundingSphere(),ke.copy(he.boundingSphere.center)),ke.applyMatrix4(E.matrixWorld).applyMatrix4(Ae)),Array.isArray(Me)){const Te=he.groups;for(let Ue=0,Oe=Te.length;Ue<Oe;Ue++){const Se=Te[Ue],Je=Me[Se.materialIndex];Je&&Je.visible&&g.push(E,he,Je,W,ke.z,Se)}}else Me.visible&&g.push(E,he,Me,W,ke.z,null)}}const ne=E.children;for(let he=0,Me=ne.length;he<Me;he++)fl(ne[he],U,W,X)}function uh(E,U,W,X){const N=E.opaque,ne=E.transmissive,he=E.transparent;p.setupLightsView(W),K===!0&&te.setGlobalState(v.clippingPlanes,W),X&&Pe.viewport(L.copy(X)),N.length>0&&_a(N,U,W),ne.length>0&&_a(ne,U,W),he.length>0&&_a(he,U,W),Pe.buffers.depth.setTest(!0),Pe.buffers.depth.setMask(!0),Pe.buffers.color.setMask(!0),Pe.setPolygonOffset(!1)}function hh(E,U,W,X){if((W.isScene===!0?W.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[X.id]===void 0&&(p.state.transmissionRenderTarget[X.id]=new fi(1,1,{generateMipmaps:!0,type:Ye.has("EXT_color_buffer_half_float")||Ye.has("EXT_color_buffer_float")?ha:In,minFilter:oi,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Xe.workingColorSpace}));const ne=p.state.transmissionRenderTarget[X.id],he=X.viewport||L;ne.setSize(he.z,he.w);const Me=v.getRenderTarget();v.setRenderTarget(ne),v.getClearColor(q),k=v.getClearAlpha(),k<1&&v.setClearColor(16777215,.5),v.clear(),We&&Le.render(W);const Te=v.toneMapping;v.toneMapping=Oi;const Ue=X.viewport;if(X.viewport!==void 0&&(X.viewport=void 0),p.setupLightsView(X),K===!0&&te.setGlobalState(v.clippingPlanes,X),_a(E,W,X),C.updateMultisampleRenderTarget(ne),C.updateRenderTargetMipmap(ne),Ye.has("WEBGL_multisampled_render_to_texture")===!1){let Oe=!1;for(let Se=0,Je=U.length;Se<Je;Se++){const ut=U[Se],dt=ut.object,Jt=ut.geometry,et=ut.material,be=ut.group;if(et.side===bn&&dt.layers.test(X.layers)){const Xn=et.side;et.side=$t,et.needsUpdate=!0,dh(dt,W,X,Jt,et,be),et.side=Xn,et.needsUpdate=!0,Oe=!0}}Oe===!0&&(C.updateMultisampleRenderTarget(ne),C.updateRenderTargetMipmap(ne))}v.setRenderTarget(Me),v.setClearColor(q,k),Ue!==void 0&&(X.viewport=Ue),v.toneMapping=Te}function _a(E,U,W){const X=U.isScene===!0?U.overrideMaterial:null;for(let N=0,ne=E.length;N<ne;N++){const he=E[N],Me=he.object,Te=he.geometry,Ue=X===null?he.material:X,Oe=he.group;Me.layers.test(W.layers)&&dh(Me,U,W,Te,Ue,Oe)}}function dh(E,U,W,X,N,ne){E.onBeforeRender(v,U,W,X,N,ne),E.modelViewMatrix.multiplyMatrices(W.matrixWorldInverse,E.matrixWorld),E.normalMatrix.getNormalMatrix(E.modelViewMatrix),N.onBeforeRender(v,U,W,X,E,ne),N.transparent===!0&&N.side===bn&&N.forceSinglePass===!1?(N.side=$t,N.needsUpdate=!0,v.renderBufferDirect(W,U,X,N,E,ne),N.side=di,N.needsUpdate=!0,v.renderBufferDirect(W,U,X,N,E,ne),N.side=bn):v.renderBufferDirect(W,U,X,N,E,ne),E.onAfterRender(v,U,W,X,N,ne)}function xa(E,U,W){U.isScene!==!0&&(U=lt);const X=Re.get(E),N=p.state.lights,ne=p.state.shadowsArray,he=N.state.version,Me=Ee.getParameters(E,N.state,ne,U,W),Te=Ee.getProgramCacheKey(Me);let Ue=X.programs;X.environment=E.isMeshStandardMaterial?U.environment:null,X.fog=U.fog,X.envMap=(E.isMeshStandardMaterial?V:S).get(E.envMap||X.environment),X.envMapRotation=X.environment!==null&&E.envMap===null?U.environmentRotation:E.envMapRotation,Ue===void 0&&(E.addEventListener("dispose",Fe),Ue=new Map,X.programs=Ue);let Oe=Ue.get(Te);if(Oe!==void 0){if(X.currentProgram===Oe&&X.lightsStateVersion===he)return ph(E,Me),Oe}else Me.uniforms=Ee.getUniforms(E),E.onBeforeCompile(Me,v),Oe=Ee.acquireProgram(Me,Te),Ue.set(Te,Oe),X.uniforms=Me.uniforms;const Se=X.uniforms;return(!E.isShaderMaterial&&!E.isRawShaderMaterial||E.clipping===!0)&&(Se.clippingPlanes=te.uniform),ph(E,Me),X.needsLights=Zm(E),X.lightsStateVersion=he,X.needsLights&&(Se.ambientLightColor.value=N.state.ambient,Se.lightProbe.value=N.state.probe,Se.directionalLights.value=N.state.directional,Se.directionalLightShadows.value=N.state.directionalShadow,Se.spotLights.value=N.state.spot,Se.spotLightShadows.value=N.state.spotShadow,Se.rectAreaLights.value=N.state.rectArea,Se.ltc_1.value=N.state.rectAreaLTC1,Se.ltc_2.value=N.state.rectAreaLTC2,Se.pointLights.value=N.state.point,Se.pointLightShadows.value=N.state.pointShadow,Se.hemisphereLights.value=N.state.hemi,Se.directionalShadowMap.value=N.state.directionalShadowMap,Se.directionalShadowMatrix.value=N.state.directionalShadowMatrix,Se.spotShadowMap.value=N.state.spotShadowMap,Se.spotLightMatrix.value=N.state.spotLightMatrix,Se.spotLightMap.value=N.state.spotLightMap,Se.pointShadowMap.value=N.state.pointShadowMap,Se.pointShadowMatrix.value=N.state.pointShadowMatrix),X.currentProgram=Oe,X.uniformsList=null,Oe}function fh(E){if(E.uniformsList===null){const U=E.currentProgram.getUniforms();E.uniformsList=_o.seqWithValue(U.seq,E.uniforms)}return E.uniformsList}function ph(E,U){const W=Re.get(E);W.outputColorSpace=U.outputColorSpace,W.batching=U.batching,W.batchingColor=U.batchingColor,W.instancing=U.instancing,W.instancingColor=U.instancingColor,W.instancingMorph=U.instancingMorph,W.skinning=U.skinning,W.morphTargets=U.morphTargets,W.morphNormals=U.morphNormals,W.morphColors=U.morphColors,W.morphTargetsCount=U.morphTargetsCount,W.numClippingPlanes=U.numClippingPlanes,W.numIntersection=U.numClipIntersection,W.vertexAlphas=U.vertexAlphas,W.vertexTangents=U.vertexTangents,W.toneMapping=U.toneMapping}function $m(E,U,W,X,N){U.isScene!==!0&&(U=lt),C.resetTextureUnits();const ne=U.fog,he=X.isMeshStandardMaterial?U.environment:null,Me=R===null?v.outputColorSpace:R.isXRRenderTarget===!0?R.texture.colorSpace:zt,Te=(X.isMeshStandardMaterial?V:S).get(X.envMap||he),Ue=X.vertexColors===!0&&!!W.attributes.color&&W.attributes.color.itemSize===4,Oe=!!W.attributes.tangent&&(!!X.normalMap||X.anisotropy>0),Se=!!W.morphAttributes.position,Je=!!W.morphAttributes.normal,ut=!!W.morphAttributes.color;let dt=Oi;X.toneMapped&&(R===null||R.isXRRenderTarget===!0)&&(dt=v.toneMapping);const Jt=W.morphAttributes.position||W.morphAttributes.normal||W.morphAttributes.color,et=Jt!==void 0?Jt.length:0,be=Re.get(X),Xn=p.state.lights;if(K===!0&&(oe===!0||E!==M)){const dn=E===M&&X.id===T;te.setState(X,E,dn)}let tt=!1;X.version===be.__version?(be.needsLights&&be.lightsStateVersion!==Xn.state.version||be.outputColorSpace!==Me||N.isBatchedMesh&&be.batching===!1||!N.isBatchedMesh&&be.batching===!0||N.isBatchedMesh&&be.batchingColor===!0&&N.colorTexture===null||N.isBatchedMesh&&be.batchingColor===!1&&N.colorTexture!==null||N.isInstancedMesh&&be.instancing===!1||!N.isInstancedMesh&&be.instancing===!0||N.isSkinnedMesh&&be.skinning===!1||!N.isSkinnedMesh&&be.skinning===!0||N.isInstancedMesh&&be.instancingColor===!0&&N.instanceColor===null||N.isInstancedMesh&&be.instancingColor===!1&&N.instanceColor!==null||N.isInstancedMesh&&be.instancingMorph===!0&&N.morphTexture===null||N.isInstancedMesh&&be.instancingMorph===!1&&N.morphTexture!==null||be.envMap!==Te||X.fog===!0&&be.fog!==ne||be.numClippingPlanes!==void 0&&(be.numClippingPlanes!==te.numPlanes||be.numIntersection!==te.numIntersection)||be.vertexAlphas!==Ue||be.vertexTangents!==Oe||be.morphTargets!==Se||be.morphNormals!==Je||be.morphColors!==ut||be.toneMapping!==dt||be.morphTargetsCount!==et)&&(tt=!0):(tt=!0,be.__version=X.version);let yn=be.currentProgram;tt===!0&&(yn=xa(X,U,N));let hr=!1,nn=!1,ds=!1;const ft=yn.getUniforms(),Un=be.uniforms;if(Pe.useProgram(yn.program)&&(hr=!0,nn=!0,ds=!0),X.id!==T&&(T=X.id,nn=!0),hr||M!==E){Pe.buffers.depth.getReversed()?(re.copy(E.projectionMatrix),T_(re),S_(re),ft.setValue(F,"projectionMatrix",re)):ft.setValue(F,"projectionMatrix",E.projectionMatrix),ft.setValue(F,"viewMatrix",E.matrixWorldInverse);const pi=ft.map.cameraPosition;pi!==void 0&&pi.setValue(F,Ce.setFromMatrixPosition(E.matrixWorld)),$e.logarithmicDepthBuffer&&ft.setValue(F,"logDepthBufFC",2/(Math.log(E.far+1)/Math.LN2)),(X.isMeshPhongMaterial||X.isMeshToonMaterial||X.isMeshLambertMaterial||X.isMeshBasicMaterial||X.isMeshStandardMaterial||X.isShaderMaterial)&&ft.setValue(F,"isOrthographic",E.isOrthographicCamera===!0),M!==E&&(M=E,nn=!0,ds=!0)}if(N.isSkinnedMesh){ft.setOptional(F,N,"bindMatrix"),ft.setOptional(F,N,"bindMatrixInverse");const dn=N.skeleton;dn&&(dn.boneTexture===null&&dn.computeBoneTexture(),ft.setValue(F,"boneTexture",dn.boneTexture,C))}N.isBatchedMesh&&(ft.setOptional(F,N,"batchingTexture"),ft.setValue(F,"batchingTexture",N._matricesTexture,C),ft.setOptional(F,N,"batchingIdTexture"),ft.setValue(F,"batchingIdTexture",N._indirectTexture,C),ft.setOptional(F,N,"batchingColorTexture"),N._colorsTexture!==null&&ft.setValue(F,"batchingColorTexture",N._colorsTexture,C));const fs=W.morphAttributes;if((fs.position!==void 0||fs.normal!==void 0||fs.color!==void 0)&&De.update(N,W,yn),(nn||be.receiveShadow!==N.receiveShadow)&&(be.receiveShadow=N.receiveShadow,ft.setValue(F,"receiveShadow",N.receiveShadow)),X.isMeshGouraudMaterial&&X.envMap!==null&&(Un.envMap.value=Te,Un.flipEnvMap.value=Te.isCubeTexture&&Te.isRenderTargetTexture===!1?-1:1),X.isMeshStandardMaterial&&X.envMap===null&&U.environment!==null&&(Un.envMapIntensity.value=U.environmentIntensity),nn&&(ft.setValue(F,"toneMappingExposure",v.toneMappingExposure),be.needsLights&&Km(Un,ds),ne&&X.fog===!0&&ce.refreshFogUniforms(Un,ne),ce.refreshMaterialUniforms(Un,X,B,j,p.state.transmissionRenderTarget[E.id]),_o.upload(F,fh(be),Un,C)),X.isShaderMaterial&&X.uniformsNeedUpdate===!0&&(_o.upload(F,fh(be),Un,C),X.uniformsNeedUpdate=!1),X.isSpriteMaterial&&ft.setValue(F,"center",N.center),ft.setValue(F,"modelViewMatrix",N.modelViewMatrix),ft.setValue(F,"normalMatrix",N.normalMatrix),ft.setValue(F,"modelMatrix",N.matrixWorld),X.isShaderMaterial||X.isRawShaderMaterial){const dn=X.uniformsGroups;for(let pi=0,mi=dn.length;pi<mi;pi++){const mh=dn[pi];D.update(mh,yn),D.bind(mh,yn)}}return yn}function Km(E,U){E.ambientLightColor.needsUpdate=U,E.lightProbe.needsUpdate=U,E.directionalLights.needsUpdate=U,E.directionalLightShadows.needsUpdate=U,E.pointLights.needsUpdate=U,E.pointLightShadows.needsUpdate=U,E.spotLights.needsUpdate=U,E.spotLightShadows.needsUpdate=U,E.rectAreaLights.needsUpdate=U,E.hemisphereLights.needsUpdate=U}function Zm(E){return E.isMeshLambertMaterial||E.isMeshToonMaterial||E.isMeshPhongMaterial||E.isMeshStandardMaterial||E.isShadowMaterial||E.isShaderMaterial&&E.lights===!0}this.getActiveCubeFace=function(){return b},this.getActiveMipmapLevel=function(){return A},this.getRenderTarget=function(){return R},this.setRenderTargetTextures=function(E,U,W){Re.get(E.texture).__webglTexture=U,Re.get(E.depthTexture).__webglTexture=W;const X=Re.get(E);X.__hasExternalTextures=!0,X.__autoAllocateDepthBuffer=W===void 0,X.__autoAllocateDepthBuffer||Ye.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),X.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(E,U){const W=Re.get(E);W.__webglFramebuffer=U,W.__useDefaultFramebuffer=U===void 0},this.setRenderTarget=function(E,U=0,W=0){R=E,b=U,A=W;let X=!0,N=null,ne=!1,he=!1;if(E){const Te=Re.get(E);if(Te.__useDefaultFramebuffer!==void 0)Pe.bindFramebuffer(F.FRAMEBUFFER,null),X=!1;else if(Te.__webglFramebuffer===void 0)C.setupRenderTarget(E);else if(Te.__hasExternalTextures)C.rebindTextures(E,Re.get(E.texture).__webglTexture,Re.get(E.depthTexture).__webglTexture);else if(E.depthBuffer){const Se=E.depthTexture;if(Te.__boundDepthTexture!==Se){if(Se!==null&&Re.has(Se)&&(E.width!==Se.image.width||E.height!==Se.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");C.setupDepthRenderbuffer(E)}}const Ue=E.texture;(Ue.isData3DTexture||Ue.isDataArrayTexture||Ue.isCompressedArrayTexture)&&(he=!0);const Oe=Re.get(E).__webglFramebuffer;E.isWebGLCubeRenderTarget?(Array.isArray(Oe[U])?N=Oe[U][W]:N=Oe[U],ne=!0):E.samples>0&&C.useMultisampledRTT(E)===!1?N=Re.get(E).__webglMultisampledFramebuffer:Array.isArray(Oe)?N=Oe[W]:N=Oe,L.copy(E.viewport),z.copy(E.scissor),I=E.scissorTest}else L.copy(ie).multiplyScalar(B).floor(),z.copy(me).multiplyScalar(B).floor(),I=xe;if(Pe.bindFramebuffer(F.FRAMEBUFFER,N)&&X&&Pe.drawBuffers(E,N),Pe.viewport(L),Pe.scissor(z),Pe.setScissorTest(I),ne){const Te=Re.get(E.texture);F.framebufferTexture2D(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_CUBE_MAP_POSITIVE_X+U,Te.__webglTexture,W)}else if(he){const Te=Re.get(E.texture),Ue=U||0;F.framebufferTextureLayer(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,Te.__webglTexture,W||0,Ue)}T=-1},this.readRenderTargetPixels=function(E,U,W,X,N,ne,he){if(!(E&&E.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Me=Re.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&he!==void 0&&(Me=Me[he]),Me){Pe.bindFramebuffer(F.FRAMEBUFFER,Me);try{const Te=E.texture,Ue=Te.format,Oe=Te.type;if(!$e.textureFormatReadable(Ue)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!$e.textureTypeReadable(Oe)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}U>=0&&U<=E.width-X&&W>=0&&W<=E.height-N&&F.readPixels(U,W,X,N,ze.convert(Ue),ze.convert(Oe),ne)}finally{const Te=R!==null?Re.get(R).__webglFramebuffer:null;Pe.bindFramebuffer(F.FRAMEBUFFER,Te)}}},this.readRenderTargetPixelsAsync=async function(E,U,W,X,N,ne,he){if(!(E&&E.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Me=Re.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&he!==void 0&&(Me=Me[he]),Me){const Te=E.texture,Ue=Te.format,Oe=Te.type;if(!$e.textureFormatReadable(Ue))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!$e.textureTypeReadable(Oe))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(U>=0&&U<=E.width-X&&W>=0&&W<=E.height-N){Pe.bindFramebuffer(F.FRAMEBUFFER,Me);const Se=F.createBuffer();F.bindBuffer(F.PIXEL_PACK_BUFFER,Se),F.bufferData(F.PIXEL_PACK_BUFFER,ne.byteLength,F.STREAM_READ),F.readPixels(U,W,X,N,ze.convert(Ue),ze.convert(Oe),0);const Je=R!==null?Re.get(R).__webglFramebuffer:null;Pe.bindFramebuffer(F.FRAMEBUFFER,Je);const ut=F.fenceSync(F.SYNC_GPU_COMMANDS_COMPLETE,0);return F.flush(),await M_(F,ut,4),F.bindBuffer(F.PIXEL_PACK_BUFFER,Se),F.getBufferSubData(F.PIXEL_PACK_BUFFER,0,ne),F.deleteBuffer(Se),F.deleteSync(ut),ne}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(E,U=null,W=0){E.isTexture!==!0&&(Fs("WebGLRenderer: copyFramebufferToTexture function signature has changed."),U=arguments[0]||null,E=arguments[1]);const X=Math.pow(2,-W),N=Math.floor(E.image.width*X),ne=Math.floor(E.image.height*X),he=U!==null?U.x:0,Me=U!==null?U.y:0;C.setTexture2D(E,0),F.copyTexSubImage2D(F.TEXTURE_2D,W,0,0,he,Me,N,ne),Pe.unbindTexture()},this.copyTextureToTexture=function(E,U,W=null,X=null,N=0){E.isTexture!==!0&&(Fs("WebGLRenderer: copyTextureToTexture function signature has changed."),X=arguments[0]||null,E=arguments[1],U=arguments[2],N=arguments[3]||0,W=null);let ne,he,Me,Te,Ue,Oe,Se,Je,ut;const dt=E.isCompressedTexture?E.mipmaps[N]:E.image;W!==null?(ne=W.max.x-W.min.x,he=W.max.y-W.min.y,Me=W.isBox3?W.max.z-W.min.z:1,Te=W.min.x,Ue=W.min.y,Oe=W.isBox3?W.min.z:0):(ne=dt.width,he=dt.height,Me=dt.depth||1,Te=0,Ue=0,Oe=0),X!==null?(Se=X.x,Je=X.y,ut=X.z):(Se=0,Je=0,ut=0);const Jt=ze.convert(U.format),et=ze.convert(U.type);let be;U.isData3DTexture?(C.setTexture3D(U,0),be=F.TEXTURE_3D):U.isDataArrayTexture||U.isCompressedArrayTexture?(C.setTexture2DArray(U,0),be=F.TEXTURE_2D_ARRAY):(C.setTexture2D(U,0),be=F.TEXTURE_2D),F.pixelStorei(F.UNPACK_FLIP_Y_WEBGL,U.flipY),F.pixelStorei(F.UNPACK_PREMULTIPLY_ALPHA_WEBGL,U.premultiplyAlpha),F.pixelStorei(F.UNPACK_ALIGNMENT,U.unpackAlignment);const Xn=F.getParameter(F.UNPACK_ROW_LENGTH),tt=F.getParameter(F.UNPACK_IMAGE_HEIGHT),yn=F.getParameter(F.UNPACK_SKIP_PIXELS),hr=F.getParameter(F.UNPACK_SKIP_ROWS),nn=F.getParameter(F.UNPACK_SKIP_IMAGES);F.pixelStorei(F.UNPACK_ROW_LENGTH,dt.width),F.pixelStorei(F.UNPACK_IMAGE_HEIGHT,dt.height),F.pixelStorei(F.UNPACK_SKIP_PIXELS,Te),F.pixelStorei(F.UNPACK_SKIP_ROWS,Ue),F.pixelStorei(F.UNPACK_SKIP_IMAGES,Oe);const ds=E.isDataArrayTexture||E.isData3DTexture,ft=U.isDataArrayTexture||U.isData3DTexture;if(E.isRenderTargetTexture||E.isDepthTexture){const Un=Re.get(E),fs=Re.get(U),dn=Re.get(Un.__renderTarget),pi=Re.get(fs.__renderTarget);Pe.bindFramebuffer(F.READ_FRAMEBUFFER,dn.__webglFramebuffer),Pe.bindFramebuffer(F.DRAW_FRAMEBUFFER,pi.__webglFramebuffer);for(let mi=0;mi<Me;mi++)ds&&F.framebufferTextureLayer(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,Re.get(E).__webglTexture,N,Oe+mi),E.isDepthTexture?(ft&&F.framebufferTextureLayer(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,Re.get(U).__webglTexture,N,ut+mi),F.blitFramebuffer(Te,Ue,ne,he,Se,Je,ne,he,F.DEPTH_BUFFER_BIT,F.NEAREST)):ft?F.copyTexSubImage3D(be,N,Se,Je,ut+mi,Te,Ue,ne,he):F.copyTexSubImage2D(be,N,Se,Je,ut+mi,Te,Ue,ne,he);Pe.bindFramebuffer(F.READ_FRAMEBUFFER,null),Pe.bindFramebuffer(F.DRAW_FRAMEBUFFER,null)}else ft?E.isDataTexture||E.isData3DTexture?F.texSubImage3D(be,N,Se,Je,ut,ne,he,Me,Jt,et,dt.data):U.isCompressedArrayTexture?F.compressedTexSubImage3D(be,N,Se,Je,ut,ne,he,Me,Jt,dt.data):F.texSubImage3D(be,N,Se,Je,ut,ne,he,Me,Jt,et,dt):E.isDataTexture?F.texSubImage2D(F.TEXTURE_2D,N,Se,Je,ne,he,Jt,et,dt.data):E.isCompressedTexture?F.compressedTexSubImage2D(F.TEXTURE_2D,N,Se,Je,dt.width,dt.height,Jt,dt.data):F.texSubImage2D(F.TEXTURE_2D,N,Se,Je,ne,he,Jt,et,dt);F.pixelStorei(F.UNPACK_ROW_LENGTH,Xn),F.pixelStorei(F.UNPACK_IMAGE_HEIGHT,tt),F.pixelStorei(F.UNPACK_SKIP_PIXELS,yn),F.pixelStorei(F.UNPACK_SKIP_ROWS,hr),F.pixelStorei(F.UNPACK_SKIP_IMAGES,nn),N===0&&U.generateMipmaps&&F.generateMipmap(be),Pe.unbindTexture()},this.copyTextureToTexture3D=function(E,U,W=null,X=null,N=0){return E.isTexture!==!0&&(Fs("WebGLRenderer: copyTextureToTexture3D function signature has changed."),W=arguments[0]||null,X=arguments[1]||null,E=arguments[2],U=arguments[3],N=arguments[4]||0),Fs('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(E,U,W,X,N)},this.initRenderTarget=function(E){Re.get(E).__webglFramebuffer===void 0&&C.setupRenderTarget(E)},this.initTexture=function(E){E.isCubeTexture?C.setTextureCube(E,0):E.isData3DTexture?C.setTexture3D(E,0):E.isDataArrayTexture||E.isCompressedArrayTexture?C.setTexture2DArray(E,0):C.setTexture2D(E,0),Pe.unbindTexture()},this.resetState=function(){b=0,A=0,R=null,Pe.reset(),ct.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return li}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorspace=Xe._getDrawingBufferColorSpace(e),t.unpackColorSpace=Xe._getUnpackColorSpace()}}class Bu{constructor(e,t=25e-5){this.isFogExp2=!0,this.name="",this.color=new we(e),this.density=t}clone(){return new Bu(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}}class tm extends pt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Dn,this.environmentIntensity=1,this.environmentRotation=new Dn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class NM{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=lu,this.updateRanges=[],this.version=0,this.uuid=Pn()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,i){e*=this.stride,i*=t.stride;for(let r=0,s=this.stride;r<s;r++)this.array[e+r]=t.array[i+r];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Pn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),i=new this.constructor(t,this.stride);return i.setUsage(this.usage),i}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Pn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const Vt=new P;class ku{constructor(e,t,i,r=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=i,this.normalized=r}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,i=this.data.count;t<i;t++)Vt.fromBufferAttribute(this,t),Vt.applyMatrix4(e),this.setXYZ(t,Vt.x,Vt.y,Vt.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)Vt.fromBufferAttribute(this,t),Vt.applyNormalMatrix(e),this.setXYZ(t,Vt.x,Vt.y,Vt.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)Vt.fromBufferAttribute(this,t),Vt.transformDirection(e),this.setXYZ(t,Vt.x,Vt.y,Vt.z);return this}getComponent(e,t){let i=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(i=An(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=rt(i,this.array)),this.data.array[e*this.data.stride+this.offset+t]=i,this}setX(e,t){return this.normalized&&(t=rt(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=rt(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=rt(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=rt(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=An(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=An(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=An(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=An(t,this.array)),t}setXY(e,t,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=rt(t,this.array),i=rt(i,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this}setXYZ(e,t,i,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=rt(t,this.array),i=rt(i,this.array),r=rt(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this.data.array[e+2]=r,this}setXYZW(e,t,i,r,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=rt(t,this.array),i=rt(i,this.array),r=rt(r,this.array),s=rt(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this.data.array[e+2]=r,this.data.array[e+3]=s,this}clone(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let i=0;i<this.count;i++){const r=i*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)t.push(this.data.array[r+s])}return new je(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new ku(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let i=0;i<this.count;i++){const r=i*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)t.push(this.data.array[r+s])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}const Md=new P,Td=new qe,Sd=new qe,FM=new P,Ed=new ge,za=new P,Gl=new un,bd=new ge,Wl=new Bi;class OM extends He{constructor(e,t){super(e,t),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=Eh,this.bindMatrix=new ge,this.bindMatrixInverse=new ge,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){const e=this.geometry;this.boundingBox===null&&(this.boundingBox=new cn),this.boundingBox.makeEmpty();const t=e.getAttribute("position");for(let i=0;i<t.count;i++)this.getVertexPosition(i,za),this.boundingBox.expandByPoint(za)}computeBoundingSphere(){const e=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new un),this.boundingSphere.makeEmpty();const t=e.getAttribute("position");for(let i=0;i<t.count;i++)this.getVertexPosition(i,za),this.boundingSphere.expandByPoint(za)}copy(e,t){return super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}raycast(e,t){const i=this.material,r=this.matrixWorld;i!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Gl.copy(this.boundingSphere),Gl.applyMatrix4(r),e.ray.intersectsSphere(Gl)!==!1&&(bd.copy(r).invert(),Wl.copy(e.ray).applyMatrix4(bd),!(this.boundingBox!==null&&Wl.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(e,t,Wl)))}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){const e=new qe,t=this.geometry.attributes.skinWeight;for(let i=0,r=t.count;i<r;i++){e.fromBufferAttribute(t,i);const s=1/e.manhattanLength();s!==1/0?e.multiplyScalar(s):e.set(1,0,0,0),t.setXYZW(i,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===Eh?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===Wg?this.bindMatrixInverse.copy(this.bindMatrix).invert():console.warn("THREE.SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(e,t){const i=this.skeleton,r=this.geometry;Td.fromBufferAttribute(r.attributes.skinIndex,e),Sd.fromBufferAttribute(r.attributes.skinWeight,e),Md.copy(t).applyMatrix4(this.bindMatrix),t.set(0,0,0);for(let s=0;s<4;s++){const a=Sd.getComponent(s);if(a!==0){const o=Td.getComponent(s);Ed.multiplyMatrices(i.bones[o].matrixWorld,i.boneInverses[o]),t.addScaledVector(FM.copy(Md).applyMatrix4(Ed),a)}}return t.applyMatrix4(this.bindMatrixInverse)}}class nm extends pt{constructor(){super(),this.isBone=!0,this.type="Bone"}}class da extends St{constructor(e=null,t=1,i=1,r,s,a,o,l,c=Kt,u=Kt,h,d){super(null,a,o,l,c,u,r,s,h,d),this.isDataTexture=!0,this.image={data:e,width:t,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const Ad=new ge,BM=new ge;class zu{constructor(e=[],t=[]){this.uuid=Pn(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){const e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),t.length===0)this.calculateInverses();else if(e.length!==t.length){console.warn("THREE.Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let i=0,r=this.bones.length;i<r;i++)this.boneInverses.push(new ge)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){const i=new ge;this.bones[e]&&i.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(i)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){const i=this.bones[e];i&&i.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){const i=this.bones[e];i&&(i.parent&&i.parent.isBone?(i.matrix.copy(i.parent.matrixWorld).invert(),i.matrix.multiply(i.matrixWorld)):i.matrix.copy(i.matrixWorld),i.matrix.decompose(i.position,i.quaternion,i.scale))}}update(){const e=this.bones,t=this.boneInverses,i=this.boneMatrices,r=this.boneTexture;for(let s=0,a=e.length;s<a;s++){const o=e[s]?e[s].matrixWorld:BM;Ad.multiplyMatrices(o,t[s]),Ad.toArray(i,s*16)}r!==null&&(r.needsUpdate=!0)}clone(){return new zu(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);const t=new Float32Array(e*e*4);t.set(this.boneMatrices);const i=new da(t,e,e,_n,wn);return i.needsUpdate=!0,this.boneMatrices=t,this.boneTexture=i,this}getBoneByName(e){for(let t=0,i=this.bones.length;t<i;t++){const r=this.bones[t];if(r.name===e)return r}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(e,t){this.uuid=e.uuid;for(let i=0,r=e.bones.length;i<r;i++){const s=e.bones[i];let a=t[s];a===void 0&&(console.warn("THREE.Skeleton: No bone found with UUID:",s),a=new nm),this.bones.push(a),this.boneInverses.push(new ge().fromArray(e.boneInverses[i]))}return this.init(),this}toJSON(){const e={metadata:{version:4.6,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};e.uuid=this.uuid;const t=this.bones,i=this.boneInverses;for(let r=0,s=t.length;r<s;r++){const a=t[r];e.bones.push(a.uuid);const o=i[r];e.boneInverses.push(o.toArray())}return e}}class hu extends je{constructor(e,t,i,r=1){super(e,t,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=r}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const Ar=new ge,wd=new ge,Va=[],Rd=new cn,kM=new ge,xs=new He,vs=new un;class im extends He{constructor(e,t,i){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new hu(new Float32Array(i*16),16),this.instanceColor=null,this.morphTexture=null,this.count=i,this.boundingBox=null,this.boundingSphere=null;for(let r=0;r<i;r++)this.setMatrixAt(r,kM)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new cn),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,Ar),Rd.copy(e.boundingBox).applyMatrix4(Ar),this.boundingBox.union(Rd)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new un),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,Ar),vs.copy(e.boundingSphere).applyMatrix4(Ar),this.boundingSphere.union(vs)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){const i=t.morphTargetInfluences,r=this.morphTexture.source.data.data,s=i.length+1,a=e*s+1;for(let o=0;o<i.length;o++)i[o]=r[a+o]}raycast(e,t){const i=this.matrixWorld,r=this.count;if(xs.geometry=this.geometry,xs.material=this.material,xs.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),vs.copy(this.boundingSphere),vs.applyMatrix4(i),e.ray.intersectsSphere(vs)!==!1))for(let s=0;s<r;s++){this.getMatrixAt(s,Ar),wd.multiplyMatrices(i,Ar),xs.matrixWorld=wd,xs.raycast(e,Va);for(let a=0,o=Va.length;a<o;a++){const l=Va[a];l.instanceId=s,l.object=this,t.push(l)}Va.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new hu(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,t){const i=t.morphTargetInfluences,r=i.length+1;this.morphTexture===null&&(this.morphTexture=new da(new Float32Array(r*this.count),r,this.count,Pu,wn));const s=this.morphTexture.source.data.data;let a=0;for(let c=0;c<i.length;c++)a+=i[c];const o=this.geometry.morphTargetsRelative?1:1-a,l=r*e;s[l]=o,s.set(i,l+1)}updateMorphTargets(){}dispose(){return this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null),this}}class rm extends zn{static get type(){return"LineBasicMaterial"}constructor(e){super(),this.isLineBasicMaterial=!0,this.color=new we(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const Io=new P,Do=new P,Cd=new ge,ys=new Bi,Ha=new un,Xl=new P,Pd=new P;class Vu extends pt{constructor(e=new _t,t=new rm){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,i=[0];for(let r=1,s=t.count;r<s;r++)Io.fromBufferAttribute(t,r-1),Do.fromBufferAttribute(t,r),i[r]=i[r-1],i[r]+=Io.distanceTo(Do);e.setAttribute("lineDistance",new at(i,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const i=this.geometry,r=this.matrixWorld,s=e.params.Line.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Ha.copy(i.boundingSphere),Ha.applyMatrix4(r),Ha.radius+=s,e.ray.intersectsSphere(Ha)===!1)return;Cd.copy(r).invert(),ys.copy(e.ray).applyMatrix4(Cd);const o=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=this.isLineSegments?2:1,u=i.index,d=i.attributes.position;if(u!==null){const f=Math.max(0,a.start),m=Math.min(u.count,a.start+a.count);for(let _=f,g=m-1;_<g;_+=c){const p=u.getX(_),y=u.getX(_+1),x=Ga(this,e,ys,l,p,y);x&&t.push(x)}if(this.isLineLoop){const _=u.getX(m-1),g=u.getX(f),p=Ga(this,e,ys,l,_,g);p&&t.push(p)}}else{const f=Math.max(0,a.start),m=Math.min(d.count,a.start+a.count);for(let _=f,g=m-1;_<g;_+=c){const p=Ga(this,e,ys,l,_,_+1);p&&t.push(p)}if(this.isLineLoop){const _=Ga(this,e,ys,l,m-1,f);_&&t.push(_)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const r=t[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=r.length;s<a;s++){const o=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}}function Ga(n,e,t,i,r,s){const a=n.geometry.attributes.position;if(Io.fromBufferAttribute(a,r),Do.fromBufferAttribute(a,s),t.distanceSqToSegment(Io,Do,Xl,Pd)>i)return;Xl.applyMatrix4(n.matrixWorld);const l=e.ray.origin.distanceTo(Xl);if(!(l<e.near||l>e.far))return{distance:l,point:Pd.clone().applyMatrix4(n.matrixWorld),index:r,face:null,faceIndex:null,barycoord:null,object:n}}const Ld=new P,Id=new P;class zM extends Vu{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,i=[];for(let r=0,s=t.count;r<s;r+=2)Ld.fromBufferAttribute(t,r),Id.fromBufferAttribute(t,r+1),i[r]=r===0?0:i[r-1],i[r+1]=i[r]+Ld.distanceTo(Id);e.setAttribute("lineDistance",new at(i,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class VM extends Vu{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type="LineLoop"}}class na extends zn{static get type(){return"PointsMaterial"}constructor(e){super(),this.isPointsMaterial=!0,this.color=new we(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const Dd=new ge,du=new Bi,Wa=new un,Xa=new P;class Uo extends pt{constructor(e=new _t,t=new na){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){const i=this.geometry,r=this.matrixWorld,s=e.params.Points.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Wa.copy(i.boundingSphere),Wa.applyMatrix4(r),Wa.radius+=s,e.ray.intersectsSphere(Wa)===!1)return;Dd.copy(r).invert(),du.copy(e.ray).applyMatrix4(Dd);const o=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=i.index,h=i.attributes.position;if(c!==null){const d=Math.max(0,a.start),f=Math.min(c.count,a.start+a.count);for(let m=d,_=f;m<_;m++){const g=c.getX(m);Xa.fromBufferAttribute(h,g),Ud(Xa,g,l,r,e,t,this)}}else{const d=Math.max(0,a.start),f=Math.min(h.count,a.start+a.count);for(let m=d,_=f;m<_;m++)Xa.fromBufferAttribute(h,m),Ud(Xa,m,l,r,e,t,this)}}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const r=t[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=r.length;s<a;s++){const o=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}}function Ud(n,e,t,i,r,s,a){const o=du.distanceSqToPoint(n);if(o<t){const l=new P;du.closestPointToPoint(n,l),l.applyMatrix4(i);const c=r.ray.origin.distanceTo(l);if(c<r.near||c>r.far)return;s.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:a})}}class HM extends St{constructor(e,t,i,r,s,a,o,l,c){super(e,t,i,r,s,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Hu extends _t{constructor(e=[new fe(0,-.5),new fe(.5,0),new fe(0,.5)],t=12,i=0,r=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:e,segments:t,phiStart:i,phiLength:r},t=Math.floor(t),r=Pt(r,0,Math.PI*2);const s=[],a=[],o=[],l=[],c=[],u=1/t,h=new P,d=new fe,f=new P,m=new P,_=new P;let g=0,p=0;for(let y=0;y<=e.length-1;y++)switch(y){case 0:g=e[y+1].x-e[y].x,p=e[y+1].y-e[y].y,f.x=p*1,f.y=-g,f.z=p*0,_.copy(f),f.normalize(),l.push(f.x,f.y,f.z);break;case e.length-1:l.push(_.x,_.y,_.z);break;default:g=e[y+1].x-e[y].x,p=e[y+1].y-e[y].y,f.x=p*1,f.y=-g,f.z=p*0,m.copy(f),f.x+=_.x,f.y+=_.y,f.z+=_.z,f.normalize(),l.push(f.x,f.y,f.z),_.copy(m)}for(let y=0;y<=t;y++){const x=i+y*u*r,v=Math.sin(x),w=Math.cos(x);for(let b=0;b<=e.length-1;b++){h.x=e[b].x*v,h.y=e[b].y,h.z=e[b].x*w,a.push(h.x,h.y,h.z),d.x=y/t,d.y=b/(e.length-1),o.push(d.x,d.y);const A=l[3*b+0]*v,R=l[3*b+1],T=l[3*b+0]*w;c.push(A,R,T)}}for(let y=0;y<t;y++)for(let x=0;x<e.length-1;x++){const v=x+y*e.length,w=v,b=v+e.length,A=v+e.length+1,R=v+1;s.push(w,b,R),s.push(A,R,b)}this.setIndex(s),this.setAttribute("position",new at(a,3)),this.setAttribute("uv",new at(o,2)),this.setAttribute("normal",new at(c,3))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Hu(e.points,e.segments,e.phiStart,e.phiLength)}}class Gu extends _t{constructor(e=1,t=32,i=0,r=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:i,thetaLength:r},t=Math.max(3,t);const s=[],a=[],o=[],l=[],c=new P,u=new fe;a.push(0,0,0),o.push(0,0,1),l.push(.5,.5);for(let h=0,d=3;h<=t;h++,d+=3){const f=i+h/t*r;c.x=e*Math.cos(f),c.y=e*Math.sin(f),a.push(c.x,c.y,c.z),o.push(0,0,1),u.x=(a[d]/e+1)/2,u.y=(a[d+1]/e+1)/2,l.push(u.x,u.y)}for(let h=1;h<=t;h++)s.push(h,h+1,0);this.setIndex(s),this.setAttribute("position",new at(a,3)),this.setAttribute("normal",new at(o,3)),this.setAttribute("uv",new at(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Gu(e.radius,e.segments,e.thetaStart,e.thetaLength)}}class Di extends _t{constructor(e=1,t=1,i=1,r=32,s=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:i,radialSegments:r,heightSegments:s,openEnded:a,thetaStart:o,thetaLength:l};const c=this;r=Math.floor(r),s=Math.floor(s);const u=[],h=[],d=[],f=[];let m=0;const _=[],g=i/2;let p=0;y(),a===!1&&(e>0&&x(!0),t>0&&x(!1)),this.setIndex(u),this.setAttribute("position",new at(h,3)),this.setAttribute("normal",new at(d,3)),this.setAttribute("uv",new at(f,2));function y(){const v=new P,w=new P;let b=0;const A=(t-e)/i;for(let R=0;R<=s;R++){const T=[],M=R/s,L=M*(t-e)+e;for(let z=0;z<=r;z++){const I=z/r,q=I*l+o,k=Math.sin(q),O=Math.cos(q);w.x=L*k,w.y=-M*i+g,w.z=L*O,h.push(w.x,w.y,w.z),v.set(k,A,O).normalize(),d.push(v.x,v.y,v.z),f.push(I,1-M),T.push(m++)}_.push(T)}for(let R=0;R<r;R++)for(let T=0;T<s;T++){const M=_[T][R],L=_[T+1][R],z=_[T+1][R+1],I=_[T][R+1];(e>0||T!==0)&&(u.push(M,L,I),b+=3),(t>0||T!==s-1)&&(u.push(L,z,I),b+=3)}c.addGroup(p,b,0),p+=b}function x(v){const w=m,b=new fe,A=new P;let R=0;const T=v===!0?e:t,M=v===!0?1:-1;for(let z=1;z<=r;z++)h.push(0,g*M,0),d.push(0,M,0),f.push(.5,.5),m++;const L=m;for(let z=0;z<=r;z++){const q=z/r*l+o,k=Math.cos(q),O=Math.sin(q);A.x=T*O,A.y=g*M,A.z=T*k,h.push(A.x,A.y,A.z),d.push(0,M,0),b.x=k*.5+.5,b.y=O*.5*M+.5,f.push(b.x,b.y),m++}for(let z=0;z<r;z++){const I=w+z,q=L+z;v===!0?u.push(q,q+1,I):u.push(q+1,q,I),R+=3}c.addGroup(p,R,v===!0?1:2),p+=R}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Di(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Wu extends Di{constructor(e=1,t=1,i=32,r=1,s=!1,a=0,o=Math.PI*2){super(0,e,t,i,r,s,a,o),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:i,heightSegments:r,openEnded:s,thetaStart:a,thetaLength:o}}static fromJSON(e){return new Wu(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class cl extends _t{constructor(e=1,t=32,i=16,r=0,s=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:i,phiStart:r,phiLength:s,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),i=Math.max(2,Math.floor(i));const l=Math.min(a+o,Math.PI);let c=0;const u=[],h=new P,d=new P,f=[],m=[],_=[],g=[];for(let p=0;p<=i;p++){const y=[],x=p/i;let v=0;p===0&&a===0?v=.5/t:p===i&&l===Math.PI&&(v=-.5/t);for(let w=0;w<=t;w++){const b=w/t;h.x=-e*Math.cos(r+b*s)*Math.sin(a+x*o),h.y=e*Math.cos(a+x*o),h.z=e*Math.sin(r+b*s)*Math.sin(a+x*o),m.push(h.x,h.y,h.z),d.copy(h).normalize(),_.push(d.x,d.y,d.z),g.push(b+v,1-x),y.push(c++)}u.push(y)}for(let p=0;p<i;p++)for(let y=0;y<t;y++){const x=u[p][y+1],v=u[p][y],w=u[p+1][y],b=u[p+1][y+1];(p!==0||a>0)&&f.push(x,v,b),(p!==i-1||l<Math.PI)&&f.push(v,w,b)}this.setIndex(f),this.setAttribute("position",new at(m,3)),this.setAttribute("normal",new at(_,3)),this.setAttribute("uv",new at(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new cl(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class Xu extends _t{constructor(e=1,t=.4,i=12,r=48,s=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:i,tubularSegments:r,arc:s},i=Math.floor(i),r=Math.floor(r);const a=[],o=[],l=[],c=[],u=new P,h=new P,d=new P;for(let f=0;f<=i;f++)for(let m=0;m<=r;m++){const _=m/r*s,g=f/i*Math.PI*2;h.x=(e+t*Math.cos(g))*Math.cos(_),h.y=(e+t*Math.cos(g))*Math.sin(_),h.z=t*Math.sin(g),o.push(h.x,h.y,h.z),u.x=e*Math.cos(_),u.y=e*Math.sin(_),d.subVectors(h,u).normalize(),l.push(d.x,d.y,d.z),c.push(m/r),c.push(f/i)}for(let f=1;f<=i;f++)for(let m=1;m<=r;m++){const _=(r+1)*f+m-1,g=(r+1)*(f-1)+m-1,p=(r+1)*(f-1)+m,y=(r+1)*f+m;a.push(_,g,y),a.push(g,p,y)}this.setIndex(a),this.setAttribute("position",new at(o,3)),this.setAttribute("normal",new at(l,3)),this.setAttribute("uv",new at(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Xu(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}}class si extends zn{static get type(){return"MeshStandardMaterial"}constructor(e){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.color=new we(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new we(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Op,this.normalScale=new fe(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Dn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Hn extends si{static get type(){return"MeshPhysicalMaterial"}constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new fe(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return Pt(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new we(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new we(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new we(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}}function qa(n,e,t){return!n||!t&&n.constructor===e?n:typeof e.BYTES_PER_ELEMENT=="number"?new e(n):Array.prototype.slice.call(n)}function GM(n){return ArrayBuffer.isView(n)&&!(n instanceof DataView)}function WM(n){function e(r,s){return n[r]-n[s]}const t=n.length,i=new Array(t);for(let r=0;r!==t;++r)i[r]=r;return i.sort(e),i}function Nd(n,e,t){const i=n.length,r=new n.constructor(i);for(let s=0,a=0;a!==i;++s){const o=t[s]*e;for(let l=0;l!==e;++l)r[a++]=n[o+l]}return r}function sm(n,e,t,i){let r=1,s=n[0];for(;s!==void 0&&s[i]===void 0;)s=n[r++];if(s===void 0)return;let a=s[i];if(a!==void 0)if(Array.isArray(a))do a=s[i],a!==void 0&&(e.push(s.time),t.push.apply(t,a)),s=n[r++];while(s!==void 0);else if(a.toArray!==void 0)do a=s[i],a!==void 0&&(e.push(s.time),a.toArray(t,t.length)),s=n[r++];while(s!==void 0);else do a=s[i],a!==void 0&&(e.push(s.time),t.push(a)),s=n[r++];while(s!==void 0)}class fa{constructor(e,t,i,r){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=r!==void 0?r:new t.constructor(i),this.sampleValues=t,this.valueSize=i,this.settings=null,this.DefaultSettings_={}}evaluate(e){const t=this.parameterPositions;let i=this._cachedIndex,r=t[i],s=t[i-1];n:{e:{let a;t:{i:if(!(e<r)){for(let o=i+2;;){if(r===void 0){if(e<s)break i;return i=t.length,this._cachedIndex=i,this.copySampleValue_(i-1)}if(i===o)break;if(s=r,r=t[++i],e<r)break e}a=t.length;break t}if(!(e>=s)){const o=t[1];e<o&&(i=2,s=o);for(let l=i-2;;){if(s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===l)break;if(r=s,s=t[--i-1],e>=s)break e}a=i,i=0;break t}break n}for(;i<a;){const o=i+a>>>1;e<t[o]?a=o:i=o+1}if(r=t[i],s=t[i-1],s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(r===void 0)return i=t.length,this._cachedIndex=i,this.copySampleValue_(i-1)}this._cachedIndex=i,this.intervalChanged_(i,s,r)}return this.interpolate_(i,s,e,r)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){const t=this.resultBuffer,i=this.sampleValues,r=this.valueSize,s=e*r;for(let a=0;a!==r;++a)t[a]=i[s+a];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}}class XM extends fa{constructor(e,t,i,r){super(e,t,i,r),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:bh,endingEnd:bh}}intervalChanged_(e,t,i){const r=this.parameterPositions;let s=e-2,a=e+1,o=r[s],l=r[a];if(o===void 0)switch(this.getSettings_().endingStart){case Ah:s=e,o=2*t-i;break;case wh:s=r.length-2,o=t+r[s]-r[s+1];break;default:s=e,o=i}if(l===void 0)switch(this.getSettings_().endingEnd){case Ah:a=e,l=2*i-t;break;case wh:a=1,l=i+r[1]-r[0];break;default:a=e-1,l=t}const c=(i-t)*.5,u=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(l-i),this._offsetPrev=s*u,this._offsetNext=a*u}interpolate_(e,t,i,r){const s=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,u=this._offsetPrev,h=this._offsetNext,d=this._weightPrev,f=this._weightNext,m=(i-t)/(r-t),_=m*m,g=_*m,p=-d*g+2*d*_-d*m,y=(1+d)*g+(-1.5-2*d)*_+(-.5+d)*m+1,x=(-1-f)*g+(1.5+f)*_+.5*m,v=f*g-f*_;for(let w=0;w!==o;++w)s[w]=p*a[u+w]+y*a[c+w]+x*a[l+w]+v*a[h+w];return s}}class qM extends fa{constructor(e,t,i,r){super(e,t,i,r)}interpolate_(e,t,i,r){const s=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,u=(i-t)/(r-t),h=1-u;for(let d=0;d!==o;++d)s[d]=a[c+d]*h+a[l+d]*u;return s}}class jM extends fa{constructor(e,t,i,r){super(e,t,i,r)}interpolate_(e){return this.copySampleValue_(e-1)}}class Gn{constructor(e,t,i,r){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=qa(t,this.TimeBufferType),this.values=qa(i,this.ValueBufferType),this.setInterpolation(r||this.DefaultInterpolation)}static toJSON(e){const t=e.constructor;let i;if(t.toJSON!==this.toJSON)i=t.toJSON(e);else{i={name:e.name,times:qa(e.times,Array),values:qa(e.values,Array)};const r=e.getInterpolation();r!==e.DefaultInterpolation&&(i.interpolation=r)}return i.type=e.ValueTypeName,i}InterpolantFactoryMethodDiscrete(e){return new jM(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new qM(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new XM(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let t;switch(e){case Qs:t=this.InterpolantFactoryMethodDiscrete;break;case ea:t=this.InterpolantFactoryMethodLinear;break;case ml:t=this.InterpolantFactoryMethodSmooth;break}if(t===void 0){const i="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(i);return console.warn("THREE.KeyframeTrack:",i),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Qs;case this.InterpolantFactoryMethodLinear:return ea;case this.InterpolantFactoryMethodSmooth:return ml}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){const t=this.times;for(let i=0,r=t.length;i!==r;++i)t[i]+=e}return this}scale(e){if(e!==1){const t=this.times;for(let i=0,r=t.length;i!==r;++i)t[i]*=e}return this}trim(e,t){const i=this.times,r=i.length;let s=0,a=r-1;for(;s!==r&&i[s]<e;)++s;for(;a!==-1&&i[a]>t;)--a;if(++a,s!==0||a!==r){s>=a&&(a=Math.max(a,1),s=a-1);const o=this.getValueSize();this.times=i.slice(s,a),this.values=this.values.slice(s*o,a*o)}return this}validate(){let e=!0;const t=this.getValueSize();t-Math.floor(t)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),e=!1);const i=this.times,r=this.values,s=i.length;s===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),e=!1);let a=null;for(let o=0;o!==s;o++){const l=i[o];if(typeof l=="number"&&isNaN(l)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,o,l),e=!1;break}if(a!==null&&a>l){console.error("THREE.KeyframeTrack: Out of order keys.",this,o,l,a),e=!1;break}a=l}if(r!==void 0&&GM(r))for(let o=0,l=r.length;o!==l;++o){const c=r[o];if(isNaN(c)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,o,c),e=!1;break}}return e}optimize(){const e=this.times.slice(),t=this.values.slice(),i=this.getValueSize(),r=this.getInterpolation()===ml,s=e.length-1;let a=1;for(let o=1;o<s;++o){let l=!1;const c=e[o],u=e[o+1];if(c!==u&&(o!==1||c!==e[0]))if(r)l=!0;else{const h=o*i,d=h-i,f=h+i;for(let m=0;m!==i;++m){const _=t[h+m];if(_!==t[d+m]||_!==t[f+m]){l=!0;break}}}if(l){if(o!==a){e[a]=e[o];const h=o*i,d=a*i;for(let f=0;f!==i;++f)t[d+f]=t[h+f]}++a}}if(s>0){e[a]=e[s];for(let o=s*i,l=a*i,c=0;c!==i;++c)t[l+c]=t[o+c];++a}return a!==e.length?(this.times=e.slice(0,a),this.values=t.slice(0,a*i)):(this.times=e,this.values=t),this}clone(){const e=this.times.slice(),t=this.values.slice(),i=this.constructor,r=new i(this.name,e,t);return r.createInterpolant=this.createInterpolant,r}}Gn.prototype.TimeBufferType=Float32Array;Gn.prototype.ValueBufferType=Float32Array;Gn.prototype.DefaultInterpolation=ea;class ls extends Gn{constructor(e,t,i){super(e,t,i)}}ls.prototype.ValueTypeName="bool";ls.prototype.ValueBufferType=Array;ls.prototype.DefaultInterpolation=Qs;ls.prototype.InterpolantFactoryMethodLinear=void 0;ls.prototype.InterpolantFactoryMethodSmooth=void 0;class am extends Gn{}am.prototype.ValueTypeName="color";class ts extends Gn{}ts.prototype.ValueTypeName="number";class YM extends fa{constructor(e,t,i,r){super(e,t,i,r)}interpolate_(e,t,i,r){const s=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=(i-t)/(r-t);let c=e*o;for(let u=c+o;c!==u;c+=4)Zt.slerpFlat(s,0,a,c-o,a,c,l);return s}}class ns extends Gn{InterpolantFactoryMethodLinear(e){return new YM(this.times,this.values,this.getValueSize(),e)}}ns.prototype.ValueTypeName="quaternion";ns.prototype.InterpolantFactoryMethodSmooth=void 0;class cs extends Gn{constructor(e,t,i){super(e,t,i)}}cs.prototype.ValueTypeName="string";cs.prototype.ValueBufferType=Array;cs.prototype.DefaultInterpolation=Qs;cs.prototype.InterpolantFactoryMethodLinear=void 0;cs.prototype.InterpolantFactoryMethodSmooth=void 0;class is extends Gn{}is.prototype.ValueTypeName="vector";class $M{constructor(e="",t=-1,i=[],r=qg){this.name=e,this.tracks=i,this.duration=t,this.blendMode=r,this.uuid=Pn(),this.duration<0&&this.resetDuration()}static parse(e){const t=[],i=e.tracks,r=1/(e.fps||1);for(let a=0,o=i.length;a!==o;++a)t.push(ZM(i[a]).scale(r));const s=new this(e.name,e.duration,t,e.blendMode);return s.uuid=e.uuid,s}static toJSON(e){const t=[],i=e.tracks,r={name:e.name,duration:e.duration,tracks:t,uuid:e.uuid,blendMode:e.blendMode};for(let s=0,a=i.length;s!==a;++s)t.push(Gn.toJSON(i[s]));return r}static CreateFromMorphTargetSequence(e,t,i,r){const s=t.length,a=[];for(let o=0;o<s;o++){let l=[],c=[];l.push((o+s-1)%s,o,(o+1)%s),c.push(0,1,0);const u=WM(l);l=Nd(l,1,u),c=Nd(c,1,u),!r&&l[0]===0&&(l.push(s),c.push(c[0])),a.push(new ts(".morphTargetInfluences["+t[o].name+"]",l,c).scale(1/i))}return new this(e,-1,a)}static findByName(e,t){let i=e;if(!Array.isArray(e)){const r=e;i=r.geometry&&r.geometry.animations||r.animations}for(let r=0;r<i.length;r++)if(i[r].name===t)return i[r];return null}static CreateClipsFromMorphTargetSequences(e,t,i){const r={},s=/^([\w-]*?)([\d]+)$/;for(let o=0,l=e.length;o<l;o++){const c=e[o],u=c.name.match(s);if(u&&u.length>1){const h=u[1];let d=r[h];d||(r[h]=d=[]),d.push(c)}}const a=[];for(const o in r)a.push(this.CreateFromMorphTargetSequence(o,r[o],t,i));return a}static parseAnimation(e,t){if(!e)return console.error("THREE.AnimationClip: No animation in JSONLoader data."),null;const i=function(h,d,f,m,_){if(f.length!==0){const g=[],p=[];sm(f,g,p,m),g.length!==0&&_.push(new h(d,g,p))}},r=[],s=e.name||"default",a=e.fps||30,o=e.blendMode;let l=e.length||-1;const c=e.hierarchy||[];for(let h=0;h<c.length;h++){const d=c[h].keys;if(!(!d||d.length===0))if(d[0].morphTargets){const f={};let m;for(m=0;m<d.length;m++)if(d[m].morphTargets)for(let _=0;_<d[m].morphTargets.length;_++)f[d[m].morphTargets[_]]=-1;for(const _ in f){const g=[],p=[];for(let y=0;y!==d[m].morphTargets.length;++y){const x=d[m];g.push(x.time),p.push(x.morphTarget===_?1:0)}r.push(new ts(".morphTargetInfluence["+_+"]",g,p))}l=f.length*a}else{const f=".bones["+t[h].name+"]";i(is,f+".position",d,"pos",r),i(ns,f+".quaternion",d,"rot",r),i(is,f+".scale",d,"scl",r)}}return r.length===0?null:new this(s,l,r,o)}resetDuration(){const e=this.tracks;let t=0;for(let i=0,r=e.length;i!==r;++i){const s=this.tracks[i];t=Math.max(t,s.times[s.times.length-1])}return this.duration=t,this}trim(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].trim(0,this.duration);return this}validate(){let e=!0;for(let t=0;t<this.tracks.length;t++)e=e&&this.tracks[t].validate();return e}optimize(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].optimize();return this}clone(){const e=[];for(let t=0;t<this.tracks.length;t++)e.push(this.tracks[t].clone());return new this.constructor(this.name,this.duration,e,this.blendMode)}toJSON(){return this.constructor.toJSON(this)}}function KM(n){switch(n.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return ts;case"vector":case"vector2":case"vector3":case"vector4":return is;case"color":return am;case"quaternion":return ns;case"bool":case"boolean":return ls;case"string":return cs}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+n)}function ZM(n){if(n.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");const e=KM(n.type);if(n.times===void 0){const t=[],i=[];sm(n.keys,t,i,"value"),n.times=t,n.values=i}return e.parse!==void 0?e.parse(n):new e(n.name,n.times,n.values,n.interpolation)}const Ui={enabled:!1,files:{},add:function(n,e){this.enabled!==!1&&(this.files[n]=e)},get:function(n){if(this.enabled!==!1)return this.files[n]},remove:function(n){delete this.files[n]},clear:function(){this.files={}}};class om{constructor(e,t,i){const r=this;let s=!1,a=0,o=0,l;const c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=i,this.itemStart=function(u){o++,s===!1&&r.onStart!==void 0&&r.onStart(u,a,o),s=!0},this.itemEnd=function(u){a++,r.onProgress!==void 0&&r.onProgress(u,a,o),a===o&&(s=!1,r.onLoad!==void 0&&r.onLoad())},this.itemError=function(u){r.onError!==void 0&&r.onError(u)},this.resolveURL=function(u){return l?l(u):u},this.setURLModifier=function(u){return l=u,this},this.addHandler=function(u,h){return c.push(u,h),this},this.removeHandler=function(u){const h=c.indexOf(u);return h!==-1&&c.splice(h,2),this},this.getHandler=function(u){for(let h=0,d=c.length;h<d;h+=2){const f=c[h],m=c[h+1];if(f.global&&(f.lastIndex=0),f.test(u))return m}return null}}}const us=new om;class cr{constructor(e){this.manager=e!==void 0?e:us,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){const i=this;return new Promise(function(r,s){i.load(e,r,t,s)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}}cr.DEFAULT_MATERIAL_NAME="__DEFAULT";const Zn={};class JM extends Error{constructor(e,t){super(e),this.response=t}}class ia extends cr{constructor(e){super(e)}load(e,t,i,r){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const s=Ui.get(e);if(s!==void 0)return this.manager.itemStart(e),setTimeout(()=>{t&&t(s),this.manager.itemEnd(e)},0),s;if(Zn[e]!==void 0){Zn[e].push({onLoad:t,onProgress:i,onError:r});return}Zn[e]=[],Zn[e].push({onLoad:t,onProgress:i,onError:r});const a=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin"}),o=this.mimeType,l=this.responseType;fetch(a).then(c=>{if(c.status===200||c.status===0){if(c.status===0&&console.warn("THREE.FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||c.body===void 0||c.body.getReader===void 0)return c;const u=Zn[e],h=c.body.getReader(),d=c.headers.get("X-File-Size")||c.headers.get("Content-Length"),f=d?parseInt(d):0,m=f!==0;let _=0;const g=new ReadableStream({start(p){y();function y(){h.read().then(({done:x,value:v})=>{if(x)p.close();else{_+=v.byteLength;const w=new ProgressEvent("progress",{lengthComputable:m,loaded:_,total:f});for(let b=0,A=u.length;b<A;b++){const R=u[b];R.onProgress&&R.onProgress(w)}p.enqueue(v),y()}},x=>{p.error(x)})}}});return new Response(g)}else throw new JM(`fetch for "${c.url}" responded with ${c.status}: ${c.statusText}`,c)}).then(c=>{switch(l){case"arraybuffer":return c.arrayBuffer();case"blob":return c.blob();case"document":return c.text().then(u=>new DOMParser().parseFromString(u,o));case"json":return c.json();default:if(o===void 0)return c.text();{const h=/charset="?([^;"\s]*)"?/i.exec(o),d=h&&h[1]?h[1].toLowerCase():void 0,f=new TextDecoder(d);return c.arrayBuffer().then(m=>f.decode(m))}}}).then(c=>{Ui.add(e,c);const u=Zn[e];delete Zn[e];for(let h=0,d=u.length;h<d;h++){const f=u[h];f.onLoad&&f.onLoad(c)}}).catch(c=>{const u=Zn[e];if(u===void 0)throw this.manager.itemError(e),c;delete Zn[e];for(let h=0,d=u.length;h<d;h++){const f=u[h];f.onError&&f.onError(c)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}}class QM extends cr{constructor(e){super(e)}load(e,t,i,r){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const s=this,a=Ui.get(e);if(a!==void 0)return s.manager.itemStart(e),setTimeout(function(){t&&t(a),s.manager.itemEnd(e)},0),a;const o=ta("img");function l(){u(),Ui.add(e,this),t&&t(this),s.manager.itemEnd(e)}function c(h){u(),r&&r(h),s.manager.itemError(e),s.manager.itemEnd(e)}function u(){o.removeEventListener("load",l,!1),o.removeEventListener("error",c,!1)}return o.addEventListener("load",l,!1),o.addEventListener("error",c,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),s.manager.itemStart(e),o.src=e,o}}class lm extends cr{constructor(e){super(e)}load(e,t,i,r){const s=new St,a=new QM(this.manager);return a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(e,function(o){s.image=o,s.needsUpdate=!0,t!==void 0&&t(s)},i,r),s}}class ul extends pt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new we(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}}class cm extends ul{constructor(e,t,i){super(e,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(pt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new we(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}}const ql=new ge,Fd=new P,Od=new P;class qu{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new fe(512,512),this.map=null,this.mapPass=null,this.matrix=new ge,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new al,this._frameExtents=new fe(1,1),this._viewportCount=1,this._viewports=[new qe(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,i=this.matrix;Fd.setFromMatrixPosition(e.matrixWorld),t.position.copy(Fd),Od.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Od),t.updateMatrixWorld(),ql.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(ql),i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(ql)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}class eT extends qu{constructor(){super(new Ot(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1}updateMatrices(e){const t=this.camera,i=Jr*2*e.angle*this.focus,r=this.mapSize.width/this.mapSize.height,s=e.distance||t.far;(i!==t.fov||r!==t.aspect||s!==t.far)&&(t.fov=i,t.aspect=r,t.far=s,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this}}class tT extends ul{constructor(e,t,i=0,r=Math.PI/3,s=0,a=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(pt.DEFAULT_UP),this.updateMatrix(),this.target=new pt,this.distance=i,this.angle=r,this.penumbra=s,this.decay=a,this.map=null,this.shadow=new eT}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}const Bd=new ge,Ms=new P,jl=new P;class nT extends qu{constructor(){super(new Ot(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new fe(4,2),this._viewportCount=6,this._viewports=[new qe(2,1,1,1),new qe(0,1,1,1),new qe(3,1,1,1),new qe(1,1,1,1),new qe(3,0,1,1),new qe(1,0,1,1)],this._cubeDirections=[new P(1,0,0),new P(-1,0,0),new P(0,0,1),new P(0,0,-1),new P(0,1,0),new P(0,-1,0)],this._cubeUps=[new P(0,1,0),new P(0,1,0),new P(0,1,0),new P(0,1,0),new P(0,0,1),new P(0,0,-1)]}updateMatrices(e,t=0){const i=this.camera,r=this.matrix,s=e.distance||i.far;s!==i.far&&(i.far=s,i.updateProjectionMatrix()),Ms.setFromMatrixPosition(e.matrixWorld),i.position.copy(Ms),jl.copy(i.position),jl.add(this._cubeDirections[t]),i.up.copy(this._cubeUps[t]),i.lookAt(jl),i.updateMatrixWorld(),r.makeTranslation(-Ms.x,-Ms.y,-Ms.z),Bd.multiplyMatrices(i.projectionMatrix,i.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Bd)}}class um extends ul{constructor(e,t,i=0,r=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=i,this.decay=r,this.shadow=new nT}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}}class iT extends qu{constructor(){super(new ol(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class No extends ul{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(pt.DEFAULT_UP),this.updateMatrix(),this.target=new pt,this.shadow=new iT}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class qs{static decodeText(e){if(console.warn("THREE.LoaderUtils: decodeText() has been deprecated with r165 and will be removed with r175. Use TextDecoder instead."),typeof TextDecoder<"u")return new TextDecoder().decode(e);let t="";for(let i=0,r=e.length;i<r;i++)t+=String.fromCharCode(e[i]);try{return decodeURIComponent(escape(t))}catch{return t}}static extractUrlBase(e){const t=e.lastIndexOf("/");return t===-1?"./":e.slice(0,t+1)}static resolveURL(e,t){return typeof e!="string"||e===""?"":(/^https?:\/\//i.test(t)&&/^\//.test(e)&&(t=t.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(e)||/^data:.*,.*$/i.test(e)||/^blob:.*$/i.test(e)?e:t+e)}}class rT extends cr{constructor(e){super(e),this.isImageBitmapLoader=!0,typeof createImageBitmap>"u"&&console.warn("THREE.ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&console.warn("THREE.ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"}}setOptions(e){return this.options=e,this}load(e,t,i,r){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const s=this,a=Ui.get(e);if(a!==void 0){if(s.manager.itemStart(e),a.then){a.then(c=>{t&&t(c),s.manager.itemEnd(e)}).catch(c=>{r&&r(c)});return}return setTimeout(function(){t&&t(a),s.manager.itemEnd(e)},0),a}const o={};o.credentials=this.crossOrigin==="anonymous"?"same-origin":"include",o.headers=this.requestHeader;const l=fetch(e,o).then(function(c){return c.blob()}).then(function(c){return createImageBitmap(c,Object.assign(s.options,{colorSpaceConversion:"none"}))}).then(function(c){return Ui.add(e,c),t&&t(c),s.manager.itemEnd(e),c}).catch(function(c){r&&r(c),Ui.remove(e),s.manager.itemError(e),s.manager.itemEnd(e)});Ui.add(e,l),s.manager.itemStart(e)}}class sT{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=kd(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const t=kd();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}}function kd(){return performance.now()}const ju="\\[\\]\\.:\\/",aT=new RegExp("["+ju+"]","g"),Yu="[^"+ju+"]",oT="[^"+ju.replace("\\.","")+"]",lT=/((?:WC+[\/:])*)/.source.replace("WC",Yu),cT=/(WCOD+)?/.source.replace("WCOD",oT),uT=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Yu),hT=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Yu),dT=new RegExp("^"+lT+cT+uT+hT+"$"),fT=["material","materials","bones","map"];class pT{constructor(e,t,i){const r=i||st.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,r)}getValue(e,t){this.bind();const i=this._targetGroup.nCachedObjects_,r=this._bindings[i];r!==void 0&&r.getValue(e,t)}setValue(e,t){const i=this._bindings;for(let r=this._targetGroup.nCachedObjects_,s=i.length;r!==s;++r)i[r].setValue(e,t)}bind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,i=e.length;t!==i;++t)e[t].bind()}unbind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,i=e.length;t!==i;++t)e[t].unbind()}}class st{constructor(e,t,i){this.path=t,this.parsedPath=i||st.parseTrackName(t),this.node=st.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,i){return e&&e.isAnimationObjectGroup?new st.Composite(e,t,i):new st(e,t,i)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(aT,"")}static parseTrackName(e){const t=dT.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);const i={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},r=i.nodeName&&i.nodeName.lastIndexOf(".");if(r!==void 0&&r!==-1){const s=i.nodeName.substring(r+1);fT.indexOf(s)!==-1&&(i.nodeName=i.nodeName.substring(0,r),i.objectName=s)}if(i.propertyName===null||i.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return i}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){const i=e.skeleton.getBoneByName(t);if(i!==void 0)return i}if(e.children){const i=function(s){for(let a=0;a<s.length;a++){const o=s[a];if(o.name===t||o.uuid===t)return o;const l=i(o.children);if(l)return l}return null},r=i(e.children);if(r)return r}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){const i=this.resolvedProperty;for(let r=0,s=i.length;r!==s;++r)e[t++]=i[r]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){const i=this.resolvedProperty;for(let r=0,s=i.length;r!==s;++r)i[r]=e[t++]}_setValue_array_setNeedsUpdate(e,t){const i=this.resolvedProperty;for(let r=0,s=i.length;r!==s;++r)i[r]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){const i=this.resolvedProperty;for(let r=0,s=i.length;r!==s;++r)i[r]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node;const t=this.parsedPath,i=t.objectName,r=t.propertyName;let s=t.propertyIndex;if(e||(e=st.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(i){let c=t.objectIndex;switch(i){case"materials":if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let u=0;u<e.length;u++)if(e[u].name===c){c=u;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[i]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[i]}if(c!==void 0){if(e[c]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}const a=e[r];if(a===void 0){const c=t.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+c+"."+r+" but it wasn't found.",e);return}let o=this.Versioning.None;this.targetObject=e,e.needsUpdate!==void 0?o=this.Versioning.NeedsUpdate:e.matrixWorldNeedsUpdate!==void 0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(s!==void 0){if(r==="morphTargetInfluences"){if(!e.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[s]!==void 0&&(s=e.morphTargetDictionary[s])}l=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=s}else a.fromArray!==void 0&&a.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(l=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=r;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}}st.Composite=pT;st.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};st.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};st.prototype.GetterByBindingType=[st.prototype._getValue_direct,st.prototype._getValue_array,st.prototype._getValue_arrayElement,st.prototype._getValue_toArray];st.prototype.SetterByBindingTypeAndVersioning=[[st.prototype._setValue_direct,st.prototype._setValue_direct_setNeedsUpdate,st.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[st.prototype._setValue_array,st.prototype._setValue_array_setNeedsUpdate,st.prototype._setValue_array_setMatrixWorldNeedsUpdate],[st.prototype._setValue_arrayElement,st.prototype._setValue_arrayElement_setNeedsUpdate,st.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[st.prototype._setValue_fromArray,st.prototype._setValue_fromArray_setNeedsUpdate,st.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];const zd=new ge;class mT{constructor(e,t,i=0,r=1/0){this.ray=new Bi(e,t),this.near=i,this.far=r,this.camera=null,this.layers=new Nu,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return zd.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(zd),this}intersectObject(e,t=!0,i=[]){return fu(e,this,i,t),i.sort(Vd),i}intersectObjects(e,t=!0,i=[]){for(let r=0,s=e.length;r<s;r++)fu(e[r],this,i,t);return i.sort(Vd),i}}function Vd(n,e){return n.distance-e.distance}function fu(n,e,t,i){let r=!0;if(n.layers.test(e.layers)&&n.raycast(e,t)===!1&&(r=!1),r===!0&&i===!0){const s=n.children;for(let a=0,o=s.length;a<o;a++)fu(s[a],e,t,!0)}}class gT{constructor(e=1,t=0,i=0){return this.radius=e,this.phi=t,this.theta=i,this}set(e,t,i){return this.radius=e,this.phi=t,this.theta=i,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=Math.max(1e-6,Math.min(Math.PI-1e-6,this.phi)),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,i){return this.radius=Math.sqrt(e*e+t*t+i*i),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,i),this.phi=Math.acos(Pt(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}class $u{constructor(e,t,i,r){$u.prototype.isMatrix2=!0,this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,i,r)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let i=0;i<4;i++)this.elements[i]=e[i+t];return this}set(e,t,i,r){const s=this.elements;return s[0]=e,s[2]=t,s[1]=i,s[3]=r,this}}const Hd=new fe;class _T{constructor(e=new fe(1/0,1/0),t=new fe(-1/0,-1/0)){this.isBox2=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const i=Hd.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=1/0,this.max.x=this.max.y=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y}getCenter(e){return this.isEmpty()?e.set(0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Hd).distanceTo(e)}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Au}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Au);function xT(n){let e=0;for(const i in n.attributes){const r=n.getAttribute(i);e+=r.count*r.itemSize*r.array.BYTES_PER_ELEMENT}const t=n.getIndex();return e+=t?t.count*t.itemSize*t.array.BYTES_PER_ELEMENT:0,e}function Gd(n,e){if(e===jg)return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."),n;if(e===ou||e===Fp){let t=n.getIndex();if(t===null){const a=[],o=n.getAttribute("position");if(o!==void 0){for(let l=0;l<o.count;l++)a.push(l);n.setIndex(a),t=n.getIndex()}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."),n}const i=t.count-2,r=[];if(e===ou)for(let a=1;a<=i;a++)r.push(t.getX(0)),r.push(t.getX(a)),r.push(t.getX(a+1));else for(let a=0;a<i;a++)a%2===0?(r.push(t.getX(a)),r.push(t.getX(a+1)),r.push(t.getX(a+2))):(r.push(t.getX(a+2)),r.push(t.getX(a+1)),r.push(t.getX(a)));r.length/3!==i&&console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.");const s=n.clone();return s.setIndex(r),s.clearGroups(),s}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:",e),n}class hs extends cr{constructor(e){super(e),this.dracoLoader=null,this.ktx2Loader=null,this.meshoptDecoder=null,this.pluginCallbacks=[],this.register(function(t){return new ST(t)}),this.register(function(t){return new ET(t)}),this.register(function(t){return new DT(t)}),this.register(function(t){return new UT(t)}),this.register(function(t){return new NT(t)}),this.register(function(t){return new AT(t)}),this.register(function(t){return new wT(t)}),this.register(function(t){return new RT(t)}),this.register(function(t){return new CT(t)}),this.register(function(t){return new TT(t)}),this.register(function(t){return new PT(t)}),this.register(function(t){return new bT(t)}),this.register(function(t){return new IT(t)}),this.register(function(t){return new LT(t)}),this.register(function(t){return new yT(t)}),this.register(function(t){return new FT(t)}),this.register(function(t){return new OT(t)})}load(e,t,i,r){const s=this;let a;if(this.resourcePath!=="")a=this.resourcePath;else if(this.path!==""){const c=qs.extractUrlBase(e);a=qs.resolveURL(c,this.path)}else a=qs.extractUrlBase(e);this.manager.itemStart(e);const o=function(c){r?r(c):console.error(c),s.manager.itemError(e),s.manager.itemEnd(e)},l=new ia(this.manager);l.setPath(this.path),l.setResponseType("arraybuffer"),l.setRequestHeader(this.requestHeader),l.setWithCredentials(this.withCredentials),l.load(e,function(c){try{s.parse(c,a,function(u){t(u),s.manager.itemEnd(e)},o)}catch(u){o(u)}},i,o)}setDRACOLoader(e){return this.dracoLoader=e,this}setKTX2Loader(e){return this.ktx2Loader=e,this}setMeshoptDecoder(e){return this.meshoptDecoder=e,this}register(e){return this.pluginCallbacks.indexOf(e)===-1&&this.pluginCallbacks.push(e),this}unregister(e){return this.pluginCallbacks.indexOf(e)!==-1&&this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e),1),this}parse(e,t,i,r){let s;const a={},o={},l=new TextDecoder;if(typeof e=="string")s=JSON.parse(e);else if(e instanceof ArrayBuffer)if(l.decode(new Uint8Array(e,0,4))===hm){try{a[Ge.KHR_BINARY_GLTF]=new BT(e)}catch(h){r&&r(h);return}s=JSON.parse(a[Ge.KHR_BINARY_GLTF].content)}else s=JSON.parse(l.decode(e));else s=e;if(s.asset===void 0||s.asset.version[0]<2){r&&r(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));return}const c=new ZT(s,{path:t||this.resourcePath||"",crossOrigin:this.crossOrigin,requestHeader:this.requestHeader,manager:this.manager,ktx2Loader:this.ktx2Loader,meshoptDecoder:this.meshoptDecoder});c.fileLoader.setRequestHeader(this.requestHeader);for(let u=0;u<this.pluginCallbacks.length;u++){const h=this.pluginCallbacks[u](c);h.name||console.error("THREE.GLTFLoader: Invalid plugin found: missing name"),o[h.name]=h,a[h.name]=!0}if(s.extensionsUsed)for(let u=0;u<s.extensionsUsed.length;++u){const h=s.extensionsUsed[u],d=s.extensionsRequired||[];switch(h){case Ge.KHR_MATERIALS_UNLIT:a[h]=new MT;break;case Ge.KHR_DRACO_MESH_COMPRESSION:a[h]=new kT(s,this.dracoLoader);break;case Ge.KHR_TEXTURE_TRANSFORM:a[h]=new zT;break;case Ge.KHR_MESH_QUANTIZATION:a[h]=new VT;break;default:d.indexOf(h)>=0&&o[h]===void 0&&console.warn('THREE.GLTFLoader: Unknown extension "'+h+'".')}}c.setExtensions(a),c.setPlugins(o),c.parse(i,r)}parseAsync(e,t){const i=this;return new Promise(function(r,s){i.parse(e,t,r,s)})}}function vT(){let n={};return{get:function(e){return n[e]},add:function(e,t){n[e]=t},remove:function(e){delete n[e]},removeAll:function(){n={}}}}const Ge={KHR_BINARY_GLTF:"KHR_binary_glTF",KHR_DRACO_MESH_COMPRESSION:"KHR_draco_mesh_compression",KHR_LIGHTS_PUNCTUAL:"KHR_lights_punctual",KHR_MATERIALS_CLEARCOAT:"KHR_materials_clearcoat",KHR_MATERIALS_DISPERSION:"KHR_materials_dispersion",KHR_MATERIALS_IOR:"KHR_materials_ior",KHR_MATERIALS_SHEEN:"KHR_materials_sheen",KHR_MATERIALS_SPECULAR:"KHR_materials_specular",KHR_MATERIALS_TRANSMISSION:"KHR_materials_transmission",KHR_MATERIALS_IRIDESCENCE:"KHR_materials_iridescence",KHR_MATERIALS_ANISOTROPY:"KHR_materials_anisotropy",KHR_MATERIALS_UNLIT:"KHR_materials_unlit",KHR_MATERIALS_VOLUME:"KHR_materials_volume",KHR_TEXTURE_BASISU:"KHR_texture_basisu",KHR_TEXTURE_TRANSFORM:"KHR_texture_transform",KHR_MESH_QUANTIZATION:"KHR_mesh_quantization",KHR_MATERIALS_EMISSIVE_STRENGTH:"KHR_materials_emissive_strength",EXT_MATERIALS_BUMP:"EXT_materials_bump",EXT_TEXTURE_WEBP:"EXT_texture_webp",EXT_TEXTURE_AVIF:"EXT_texture_avif",EXT_MESHOPT_COMPRESSION:"EXT_meshopt_compression",EXT_MESH_GPU_INSTANCING:"EXT_mesh_gpu_instancing"};class yT{constructor(e){this.parser=e,this.name=Ge.KHR_LIGHTS_PUNCTUAL,this.cache={refs:{},uses:{}}}_markDefs(){const e=this.parser,t=this.parser.json.nodes||[];for(let i=0,r=t.length;i<r;i++){const s=t[i];s.extensions&&s.extensions[this.name]&&s.extensions[this.name].light!==void 0&&e._addNodeRef(this.cache,s.extensions[this.name].light)}}_loadLight(e){const t=this.parser,i="light:"+e;let r=t.cache.get(i);if(r)return r;const s=t.json,l=((s.extensions&&s.extensions[this.name]||{}).lights||[])[e];let c;const u=new we(16777215);l.color!==void 0&&u.setRGB(l.color[0],l.color[1],l.color[2],zt);const h=l.range!==void 0?l.range:0;switch(l.type){case"directional":c=new No(u),c.target.position.set(0,0,-1),c.add(c.target);break;case"point":c=new um(u),c.distance=h;break;case"spot":c=new tT(u),c.distance=h,l.spot=l.spot||{},l.spot.innerConeAngle=l.spot.innerConeAngle!==void 0?l.spot.innerConeAngle:0,l.spot.outerConeAngle=l.spot.outerConeAngle!==void 0?l.spot.outerConeAngle:Math.PI/4,c.angle=l.spot.outerConeAngle,c.penumbra=1-l.spot.innerConeAngle/l.spot.outerConeAngle,c.target.position.set(0,0,-1),c.add(c.target);break;default:throw new Error("THREE.GLTFLoader: Unexpected light type: "+l.type)}return c.position.set(0,0,0),c.decay=2,ni(c,l),l.intensity!==void 0&&(c.intensity=l.intensity),c.name=t.createUniqueName(l.name||"light_"+e),r=Promise.resolve(c),t.cache.add(i,r),r}getDependency(e,t){if(e==="light")return this._loadLight(t)}createNodeAttachment(e){const t=this,i=this.parser,s=i.json.nodes[e],o=(s.extensions&&s.extensions[this.name]||{}).light;return o===void 0?null:this._loadLight(o).then(function(l){return i._getNodeRef(t.cache,o,l)})}}class MT{constructor(){this.name=Ge.KHR_MATERIALS_UNLIT}getMaterialType(){return ln}extendParams(e,t,i){const r=[];e.color=new we(1,1,1),e.opacity=1;const s=t.pbrMetallicRoughness;if(s){if(Array.isArray(s.baseColorFactor)){const a=s.baseColorFactor;e.color.setRGB(a[0],a[1],a[2],zt),e.opacity=a[3]}s.baseColorTexture!==void 0&&r.push(i.assignTexture(e,"map",s.baseColorTexture,gt))}return Promise.all(r)}}class TT{constructor(e){this.parser=e,this.name=Ge.KHR_MATERIALS_EMISSIVE_STRENGTH}extendMaterialParams(e,t){const r=this.parser.json.materials[e];if(!r.extensions||!r.extensions[this.name])return Promise.resolve();const s=r.extensions[this.name].emissiveStrength;return s!==void 0&&(t.emissiveIntensity=s),Promise.resolve()}}class ST{constructor(e){this.parser=e,this.name=Ge.KHR_MATERIALS_CLEARCOAT}getMaterialType(e){const i=this.parser.json.materials[e];return!i.extensions||!i.extensions[this.name]?null:Hn}extendMaterialParams(e,t){const i=this.parser,r=i.json.materials[e];if(!r.extensions||!r.extensions[this.name])return Promise.resolve();const s=[],a=r.extensions[this.name];if(a.clearcoatFactor!==void 0&&(t.clearcoat=a.clearcoatFactor),a.clearcoatTexture!==void 0&&s.push(i.assignTexture(t,"clearcoatMap",a.clearcoatTexture)),a.clearcoatRoughnessFactor!==void 0&&(t.clearcoatRoughness=a.clearcoatRoughnessFactor),a.clearcoatRoughnessTexture!==void 0&&s.push(i.assignTexture(t,"clearcoatRoughnessMap",a.clearcoatRoughnessTexture)),a.clearcoatNormalTexture!==void 0&&(s.push(i.assignTexture(t,"clearcoatNormalMap",a.clearcoatNormalTexture)),a.clearcoatNormalTexture.scale!==void 0)){const o=a.clearcoatNormalTexture.scale;t.clearcoatNormalScale=new fe(o,o)}return Promise.all(s)}}class ET{constructor(e){this.parser=e,this.name=Ge.KHR_MATERIALS_DISPERSION}getMaterialType(e){const i=this.parser.json.materials[e];return!i.extensions||!i.extensions[this.name]?null:Hn}extendMaterialParams(e,t){const r=this.parser.json.materials[e];if(!r.extensions||!r.extensions[this.name])return Promise.resolve();const s=r.extensions[this.name];return t.dispersion=s.dispersion!==void 0?s.dispersion:0,Promise.resolve()}}class bT{constructor(e){this.parser=e,this.name=Ge.KHR_MATERIALS_IRIDESCENCE}getMaterialType(e){const i=this.parser.json.materials[e];return!i.extensions||!i.extensions[this.name]?null:Hn}extendMaterialParams(e,t){const i=this.parser,r=i.json.materials[e];if(!r.extensions||!r.extensions[this.name])return Promise.resolve();const s=[],a=r.extensions[this.name];return a.iridescenceFactor!==void 0&&(t.iridescence=a.iridescenceFactor),a.iridescenceTexture!==void 0&&s.push(i.assignTexture(t,"iridescenceMap",a.iridescenceTexture)),a.iridescenceIor!==void 0&&(t.iridescenceIOR=a.iridescenceIor),t.iridescenceThicknessRange===void 0&&(t.iridescenceThicknessRange=[100,400]),a.iridescenceThicknessMinimum!==void 0&&(t.iridescenceThicknessRange[0]=a.iridescenceThicknessMinimum),a.iridescenceThicknessMaximum!==void 0&&(t.iridescenceThicknessRange[1]=a.iridescenceThicknessMaximum),a.iridescenceThicknessTexture!==void 0&&s.push(i.assignTexture(t,"iridescenceThicknessMap",a.iridescenceThicknessTexture)),Promise.all(s)}}class AT{constructor(e){this.parser=e,this.name=Ge.KHR_MATERIALS_SHEEN}getMaterialType(e){const i=this.parser.json.materials[e];return!i.extensions||!i.extensions[this.name]?null:Hn}extendMaterialParams(e,t){const i=this.parser,r=i.json.materials[e];if(!r.extensions||!r.extensions[this.name])return Promise.resolve();const s=[];t.sheenColor=new we(0,0,0),t.sheenRoughness=0,t.sheen=1;const a=r.extensions[this.name];if(a.sheenColorFactor!==void 0){const o=a.sheenColorFactor;t.sheenColor.setRGB(o[0],o[1],o[2],zt)}return a.sheenRoughnessFactor!==void 0&&(t.sheenRoughness=a.sheenRoughnessFactor),a.sheenColorTexture!==void 0&&s.push(i.assignTexture(t,"sheenColorMap",a.sheenColorTexture,gt)),a.sheenRoughnessTexture!==void 0&&s.push(i.assignTexture(t,"sheenRoughnessMap",a.sheenRoughnessTexture)),Promise.all(s)}}class wT{constructor(e){this.parser=e,this.name=Ge.KHR_MATERIALS_TRANSMISSION}getMaterialType(e){const i=this.parser.json.materials[e];return!i.extensions||!i.extensions[this.name]?null:Hn}extendMaterialParams(e,t){const i=this.parser,r=i.json.materials[e];if(!r.extensions||!r.extensions[this.name])return Promise.resolve();const s=[],a=r.extensions[this.name];return a.transmissionFactor!==void 0&&(t.transmission=a.transmissionFactor),a.transmissionTexture!==void 0&&s.push(i.assignTexture(t,"transmissionMap",a.transmissionTexture)),Promise.all(s)}}class RT{constructor(e){this.parser=e,this.name=Ge.KHR_MATERIALS_VOLUME}getMaterialType(e){const i=this.parser.json.materials[e];return!i.extensions||!i.extensions[this.name]?null:Hn}extendMaterialParams(e,t){const i=this.parser,r=i.json.materials[e];if(!r.extensions||!r.extensions[this.name])return Promise.resolve();const s=[],a=r.extensions[this.name];t.thickness=a.thicknessFactor!==void 0?a.thicknessFactor:0,a.thicknessTexture!==void 0&&s.push(i.assignTexture(t,"thicknessMap",a.thicknessTexture)),t.attenuationDistance=a.attenuationDistance||1/0;const o=a.attenuationColor||[1,1,1];return t.attenuationColor=new we().setRGB(o[0],o[1],o[2],zt),Promise.all(s)}}class CT{constructor(e){this.parser=e,this.name=Ge.KHR_MATERIALS_IOR}getMaterialType(e){const i=this.parser.json.materials[e];return!i.extensions||!i.extensions[this.name]?null:Hn}extendMaterialParams(e,t){const r=this.parser.json.materials[e];if(!r.extensions||!r.extensions[this.name])return Promise.resolve();const s=r.extensions[this.name];return t.ior=s.ior!==void 0?s.ior:1.5,Promise.resolve()}}class PT{constructor(e){this.parser=e,this.name=Ge.KHR_MATERIALS_SPECULAR}getMaterialType(e){const i=this.parser.json.materials[e];return!i.extensions||!i.extensions[this.name]?null:Hn}extendMaterialParams(e,t){const i=this.parser,r=i.json.materials[e];if(!r.extensions||!r.extensions[this.name])return Promise.resolve();const s=[],a=r.extensions[this.name];t.specularIntensity=a.specularFactor!==void 0?a.specularFactor:1,a.specularTexture!==void 0&&s.push(i.assignTexture(t,"specularIntensityMap",a.specularTexture));const o=a.specularColorFactor||[1,1,1];return t.specularColor=new we().setRGB(o[0],o[1],o[2],zt),a.specularColorTexture!==void 0&&s.push(i.assignTexture(t,"specularColorMap",a.specularColorTexture,gt)),Promise.all(s)}}class LT{constructor(e){this.parser=e,this.name=Ge.EXT_MATERIALS_BUMP}getMaterialType(e){const i=this.parser.json.materials[e];return!i.extensions||!i.extensions[this.name]?null:Hn}extendMaterialParams(e,t){const i=this.parser,r=i.json.materials[e];if(!r.extensions||!r.extensions[this.name])return Promise.resolve();const s=[],a=r.extensions[this.name];return t.bumpScale=a.bumpFactor!==void 0?a.bumpFactor:1,a.bumpTexture!==void 0&&s.push(i.assignTexture(t,"bumpMap",a.bumpTexture)),Promise.all(s)}}class IT{constructor(e){this.parser=e,this.name=Ge.KHR_MATERIALS_ANISOTROPY}getMaterialType(e){const i=this.parser.json.materials[e];return!i.extensions||!i.extensions[this.name]?null:Hn}extendMaterialParams(e,t){const i=this.parser,r=i.json.materials[e];if(!r.extensions||!r.extensions[this.name])return Promise.resolve();const s=[],a=r.extensions[this.name];return a.anisotropyStrength!==void 0&&(t.anisotropy=a.anisotropyStrength),a.anisotropyRotation!==void 0&&(t.anisotropyRotation=a.anisotropyRotation),a.anisotropyTexture!==void 0&&s.push(i.assignTexture(t,"anisotropyMap",a.anisotropyTexture)),Promise.all(s)}}class DT{constructor(e){this.parser=e,this.name=Ge.KHR_TEXTURE_BASISU}loadTexture(e){const t=this.parser,i=t.json,r=i.textures[e];if(!r.extensions||!r.extensions[this.name])return null;const s=r.extensions[this.name],a=t.options.ktx2Loader;if(!a){if(i.extensionsRequired&&i.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");return null}return t.loadTextureImage(e,s.source,a)}}class UT{constructor(e){this.parser=e,this.name=Ge.EXT_TEXTURE_WEBP,this.isSupported=null}loadTexture(e){const t=this.name,i=this.parser,r=i.json,s=r.textures[e];if(!s.extensions||!s.extensions[t])return null;const a=s.extensions[t],o=r.images[a.source];let l=i.textureLoader;if(o.uri){const c=i.options.manager.getHandler(o.uri);c!==null&&(l=c)}return this.detectSupport().then(function(c){if(c)return i.loadTextureImage(e,a.source,l);if(r.extensionsRequired&&r.extensionsRequired.indexOf(t)>=0)throw new Error("THREE.GLTFLoader: WebP required by asset but unsupported.");return i.loadTexture(e)})}detectSupport(){return this.isSupported||(this.isSupported=new Promise(function(e){const t=new Image;t.src="data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA",t.onload=t.onerror=function(){e(t.height===1)}})),this.isSupported}}class NT{constructor(e){this.parser=e,this.name=Ge.EXT_TEXTURE_AVIF,this.isSupported=null}loadTexture(e){const t=this.name,i=this.parser,r=i.json,s=r.textures[e];if(!s.extensions||!s.extensions[t])return null;const a=s.extensions[t],o=r.images[a.source];let l=i.textureLoader;if(o.uri){const c=i.options.manager.getHandler(o.uri);c!==null&&(l=c)}return this.detectSupport().then(function(c){if(c)return i.loadTextureImage(e,a.source,l);if(r.extensionsRequired&&r.extensionsRequired.indexOf(t)>=0)throw new Error("THREE.GLTFLoader: AVIF required by asset but unsupported.");return i.loadTexture(e)})}detectSupport(){return this.isSupported||(this.isSupported=new Promise(function(e){const t=new Image;t.src="data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAABcAAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAEAAAABAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQAMAAAAABNjb2xybmNseAACAAIABoAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAAB9tZGF0EgAKCBgABogQEDQgMgkQAAAAB8dSLfI=",t.onload=t.onerror=function(){e(t.height===1)}})),this.isSupported}}class FT{constructor(e){this.name=Ge.EXT_MESHOPT_COMPRESSION,this.parser=e}loadBufferView(e){const t=this.parser.json,i=t.bufferViews[e];if(i.extensions&&i.extensions[this.name]){const r=i.extensions[this.name],s=this.parser.getDependency("buffer",r.buffer),a=this.parser.options.meshoptDecoder;if(!a||!a.supported){if(t.extensionsRequired&&t.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");return null}return s.then(function(o){const l=r.byteOffset||0,c=r.byteLength||0,u=r.count,h=r.byteStride,d=new Uint8Array(o,l,c);return a.decodeGltfBufferAsync?a.decodeGltfBufferAsync(u,h,d,r.mode,r.filter).then(function(f){return f.buffer}):a.ready.then(function(){const f=new ArrayBuffer(u*h);return a.decodeGltfBuffer(new Uint8Array(f),u,h,d,r.mode,r.filter),f})})}else return null}}class OT{constructor(e){this.name=Ge.EXT_MESH_GPU_INSTANCING,this.parser=e}createNodeMesh(e){const t=this.parser.json,i=t.nodes[e];if(!i.extensions||!i.extensions[this.name]||i.mesh===void 0)return null;const r=t.meshes[i.mesh];for(const c of r.primitives)if(c.mode!==mn.TRIANGLES&&c.mode!==mn.TRIANGLE_STRIP&&c.mode!==mn.TRIANGLE_FAN&&c.mode!==void 0)return null;const a=i.extensions[this.name].attributes,o=[],l={};for(const c in a)o.push(this.parser.getDependency("accessor",a[c]).then(u=>(l[c]=u,l[c])));return o.length<1?null:(o.push(this.parser.createNodeMesh(e)),Promise.all(o).then(c=>{const u=c.pop(),h=u.isGroup?u.children:[u],d=c[0].count,f=[];for(const m of h){const _=new ge,g=new P,p=new Zt,y=new P(1,1,1),x=new im(m.geometry,m.material,d);for(let v=0;v<d;v++)l.TRANSLATION&&g.fromBufferAttribute(l.TRANSLATION,v),l.ROTATION&&p.fromBufferAttribute(l.ROTATION,v),l.SCALE&&y.fromBufferAttribute(l.SCALE,v),x.setMatrixAt(v,_.compose(g,p,y));for(const v in l)if(v==="_COLOR_0"){const w=l[v];x.instanceColor=new hu(w.array,w.itemSize,w.normalized)}else v!=="TRANSLATION"&&v!=="ROTATION"&&v!=="SCALE"&&m.geometry.setAttribute(v,l[v]);pt.prototype.copy.call(x,m),this.parser.assignFinalMaterial(x),f.push(x)}return u.isGroup?(u.clear(),u.add(...f),u):f[0]}))}}const hm="glTF",Ts=12,Wd={JSON:1313821514,BIN:5130562};class BT{constructor(e){this.name=Ge.KHR_BINARY_GLTF,this.content=null,this.body=null;const t=new DataView(e,0,Ts),i=new TextDecoder;if(this.header={magic:i.decode(new Uint8Array(e.slice(0,4))),version:t.getUint32(4,!0),length:t.getUint32(8,!0)},this.header.magic!==hm)throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");if(this.header.version<2)throw new Error("THREE.GLTFLoader: Legacy binary file detected.");const r=this.header.length-Ts,s=new DataView(e,Ts);let a=0;for(;a<r;){const o=s.getUint32(a,!0);a+=4;const l=s.getUint32(a,!0);if(a+=4,l===Wd.JSON){const c=new Uint8Array(e,Ts+a,o);this.content=i.decode(c)}else if(l===Wd.BIN){const c=Ts+a;this.body=e.slice(c,c+o)}a+=o}if(this.content===null)throw new Error("THREE.GLTFLoader: JSON content not found.")}}class kT{constructor(e,t){if(!t)throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");this.name=Ge.KHR_DRACO_MESH_COMPRESSION,this.json=e,this.dracoLoader=t,this.dracoLoader.preload()}decodePrimitive(e,t){const i=this.json,r=this.dracoLoader,s=e.extensions[this.name].bufferView,a=e.extensions[this.name].attributes,o={},l={},c={};for(const u in a){const h=pu[u]||u.toLowerCase();o[h]=a[u]}for(const u in e.attributes){const h=pu[u]||u.toLowerCase();if(a[u]!==void 0){const d=i.accessors[e.attributes[u]],f=Gr[d.componentType];c[h]=f.name,l[h]=d.normalized===!0}}return t.getDependency("bufferView",s).then(function(u){return new Promise(function(h,d){r.decodeDracoFile(u,function(f){for(const m in f.attributes){const _=f.attributes[m],g=l[m];g!==void 0&&(_.normalized=g)}h(f)},o,c,zt,d)})})}}class zT{constructor(){this.name=Ge.KHR_TEXTURE_TRANSFORM}extendTexture(e,t){return(t.texCoord===void 0||t.texCoord===e.channel)&&t.offset===void 0&&t.rotation===void 0&&t.scale===void 0||(e=e.clone(),t.texCoord!==void 0&&(e.channel=t.texCoord),t.offset!==void 0&&e.offset.fromArray(t.offset),t.rotation!==void 0&&(e.rotation=t.rotation),t.scale!==void 0&&e.repeat.fromArray(t.scale),e.needsUpdate=!0),e}}class VT{constructor(){this.name=Ge.KHR_MESH_QUANTIZATION}}class dm extends fa{constructor(e,t,i,r){super(e,t,i,r)}copySampleValue_(e){const t=this.resultBuffer,i=this.sampleValues,r=this.valueSize,s=e*r*3+r;for(let a=0;a!==r;a++)t[a]=i[s+a];return t}interpolate_(e,t,i,r){const s=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=o*2,c=o*3,u=r-t,h=(i-t)/u,d=h*h,f=d*h,m=e*c,_=m-c,g=-2*f+3*d,p=f-d,y=1-g,x=p-d+h;for(let v=0;v!==o;v++){const w=a[_+v+o],b=a[_+v+l]*u,A=a[m+v+o],R=a[m+v]*u;s[v]=y*w+x*b+g*A+p*R}return s}}const HT=new Zt;class GT extends dm{interpolate_(e,t,i,r){const s=super.interpolate_(e,t,i,r);return HT.fromArray(s).normalize().toArray(s),s}}const mn={POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6},Gr={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array},Xd={9728:Kt,9729:Yt,9984:wp,9985:uo,9986:Ns,9987:oi},qd={33071:Ii,33648:Po,10497:$r},Yl={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},pu={POSITION:"position",NORMAL:"normal",TANGENT:"tangent",TEXCOORD_0:"uv",TEXCOORD_1:"uv1",TEXCOORD_2:"uv2",TEXCOORD_3:"uv3",COLOR_0:"color",WEIGHTS_0:"skinWeight",JOINTS_0:"skinIndex"},Si={scale:"scale",translation:"position",rotation:"quaternion",weights:"morphTargetInfluences"},WT={CUBICSPLINE:void 0,LINEAR:ea,STEP:Qs},$l={OPAQUE:"OPAQUE",MASK:"MASK",BLEND:"BLEND"};function XT(n){return n.DefaultMaterial===void 0&&(n.DefaultMaterial=new si({color:16777215,emissive:0,metalness:1,roughness:1,transparent:!1,depthTest:!0,side:di})),n.DefaultMaterial}function qi(n,e,t){for(const i in t.extensions)n[i]===void 0&&(e.userData.gltfExtensions=e.userData.gltfExtensions||{},e.userData.gltfExtensions[i]=t.extensions[i])}function ni(n,e){e.extras!==void 0&&(typeof e.extras=="object"?Object.assign(n.userData,e.extras):console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, "+e.extras))}function qT(n,e,t){let i=!1,r=!1,s=!1;for(let c=0,u=e.length;c<u;c++){const h=e[c];if(h.POSITION!==void 0&&(i=!0),h.NORMAL!==void 0&&(r=!0),h.COLOR_0!==void 0&&(s=!0),i&&r&&s)break}if(!i&&!r&&!s)return Promise.resolve(n);const a=[],o=[],l=[];for(let c=0,u=e.length;c<u;c++){const h=e[c];if(i){const d=h.POSITION!==void 0?t.getDependency("accessor",h.POSITION):n.attributes.position;a.push(d)}if(r){const d=h.NORMAL!==void 0?t.getDependency("accessor",h.NORMAL):n.attributes.normal;o.push(d)}if(s){const d=h.COLOR_0!==void 0?t.getDependency("accessor",h.COLOR_0):n.attributes.color;l.push(d)}}return Promise.all([Promise.all(a),Promise.all(o),Promise.all(l)]).then(function(c){const u=c[0],h=c[1],d=c[2];return i&&(n.morphAttributes.position=u),r&&(n.morphAttributes.normal=h),s&&(n.morphAttributes.color=d),n.morphTargetsRelative=!0,n})}function jT(n,e){if(n.updateMorphTargets(),e.weights!==void 0)for(let t=0,i=e.weights.length;t<i;t++)n.morphTargetInfluences[t]=e.weights[t];if(e.extras&&Array.isArray(e.extras.targetNames)){const t=e.extras.targetNames;if(n.morphTargetInfluences.length===t.length){n.morphTargetDictionary={};for(let i=0,r=t.length;i<r;i++)n.morphTargetDictionary[t[i]]=i}else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.")}}function YT(n){let e;const t=n.extensions&&n.extensions[Ge.KHR_DRACO_MESH_COMPRESSION];if(t?e="draco:"+t.bufferView+":"+t.indices+":"+Kl(t.attributes):e=n.indices+":"+Kl(n.attributes)+":"+n.mode,n.targets!==void 0)for(let i=0,r=n.targets.length;i<r;i++)e+=":"+Kl(n.targets[i]);return e}function Kl(n){let e="";const t=Object.keys(n).sort();for(let i=0,r=t.length;i<r;i++)e+=t[i]+":"+n[t[i]]+";";return e}function mu(n){switch(n){case Int8Array:return 1/127;case Uint8Array:return 1/255;case Int16Array:return 1/32767;case Uint16Array:return 1/65535;default:throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.")}}function $T(n){return n.search(/\.jpe?g($|\?)/i)>0||n.search(/^data\:image\/jpeg/)===0?"image/jpeg":n.search(/\.webp($|\?)/i)>0||n.search(/^data\:image\/webp/)===0?"image/webp":n.search(/\.ktx2($|\?)/i)>0||n.search(/^data\:image\/ktx2/)===0?"image/ktx2":"image/png"}const KT=new ge;class ZT{constructor(e={},t={}){this.json=e,this.extensions={},this.plugins={},this.options=t,this.cache=new vT,this.associations=new Map,this.primitiveCache={},this.nodeCache={},this.meshCache={refs:{},uses:{}},this.cameraCache={refs:{},uses:{}},this.lightCache={refs:{},uses:{}},this.sourceCache={},this.textureCache={},this.nodeNamesUsed={};let i=!1,r=-1,s=!1,a=-1;if(typeof navigator<"u"){const o=navigator.userAgent;i=/^((?!chrome|android).)*safari/i.test(o)===!0;const l=o.match(/Version\/(\d+)/);r=i&&l?parseInt(l[1],10):-1,s=o.indexOf("Firefox")>-1,a=s?o.match(/Firefox\/([0-9]+)\./)[1]:-1}typeof createImageBitmap>"u"||i&&r<17||s&&a<98?this.textureLoader=new lm(this.options.manager):this.textureLoader=new rT(this.options.manager),this.textureLoader.setCrossOrigin(this.options.crossOrigin),this.textureLoader.setRequestHeader(this.options.requestHeader),this.fileLoader=new ia(this.options.manager),this.fileLoader.setResponseType("arraybuffer"),this.options.crossOrigin==="use-credentials"&&this.fileLoader.setWithCredentials(!0)}setExtensions(e){this.extensions=e}setPlugins(e){this.plugins=e}parse(e,t){const i=this,r=this.json,s=this.extensions;this.cache.removeAll(),this.nodeCache={},this._invokeAll(function(a){return a._markDefs&&a._markDefs()}),Promise.all(this._invokeAll(function(a){return a.beforeRoot&&a.beforeRoot()})).then(function(){return Promise.all([i.getDependencies("scene"),i.getDependencies("animation"),i.getDependencies("camera")])}).then(function(a){const o={scene:a[0][r.scene||0],scenes:a[0],animations:a[1],cameras:a[2],asset:r.asset,parser:i,userData:{}};return qi(s,o,r),ni(o,r),Promise.all(i._invokeAll(function(l){return l.afterRoot&&l.afterRoot(o)})).then(function(){for(const l of o.scenes)l.updateMatrixWorld();e(o)})}).catch(t)}_markDefs(){const e=this.json.nodes||[],t=this.json.skins||[],i=this.json.meshes||[];for(let r=0,s=t.length;r<s;r++){const a=t[r].joints;for(let o=0,l=a.length;o<l;o++)e[a[o]].isBone=!0}for(let r=0,s=e.length;r<s;r++){const a=e[r];a.mesh!==void 0&&(this._addNodeRef(this.meshCache,a.mesh),a.skin!==void 0&&(i[a.mesh].isSkinnedMesh=!0)),a.camera!==void 0&&this._addNodeRef(this.cameraCache,a.camera)}}_addNodeRef(e,t){t!==void 0&&(e.refs[t]===void 0&&(e.refs[t]=e.uses[t]=0),e.refs[t]++)}_getNodeRef(e,t,i){if(e.refs[t]<=1)return i;const r=i.clone(),s=(a,o)=>{const l=this.associations.get(a);l!=null&&this.associations.set(o,l);for(const[c,u]of a.children.entries())s(u,o.children[c])};return s(i,r),r.name+="_instance_"+e.uses[t]++,r}_invokeOne(e){const t=Object.values(this.plugins);t.push(this);for(let i=0;i<t.length;i++){const r=e(t[i]);if(r)return r}return null}_invokeAll(e){const t=Object.values(this.plugins);t.unshift(this);const i=[];for(let r=0;r<t.length;r++){const s=e(t[r]);s&&i.push(s)}return i}getDependency(e,t){const i=e+":"+t;let r=this.cache.get(i);if(!r){switch(e){case"scene":r=this.loadScene(t);break;case"node":r=this._invokeOne(function(s){return s.loadNode&&s.loadNode(t)});break;case"mesh":r=this._invokeOne(function(s){return s.loadMesh&&s.loadMesh(t)});break;case"accessor":r=this.loadAccessor(t);break;case"bufferView":r=this._invokeOne(function(s){return s.loadBufferView&&s.loadBufferView(t)});break;case"buffer":r=this.loadBuffer(t);break;case"material":r=this._invokeOne(function(s){return s.loadMaterial&&s.loadMaterial(t)});break;case"texture":r=this._invokeOne(function(s){return s.loadTexture&&s.loadTexture(t)});break;case"skin":r=this.loadSkin(t);break;case"animation":r=this._invokeOne(function(s){return s.loadAnimation&&s.loadAnimation(t)});break;case"camera":r=this.loadCamera(t);break;default:if(r=this._invokeOne(function(s){return s!=this&&s.getDependency&&s.getDependency(e,t)}),!r)throw new Error("Unknown type: "+e);break}this.cache.add(i,r)}return r}getDependencies(e){let t=this.cache.get(e);if(!t){const i=this,r=this.json[e+(e==="mesh"?"es":"s")]||[];t=Promise.all(r.map(function(s,a){return i.getDependency(e,a)})),this.cache.add(e,t)}return t}loadBuffer(e){const t=this.json.buffers[e],i=this.fileLoader;if(t.type&&t.type!=="arraybuffer")throw new Error("THREE.GLTFLoader: "+t.type+" buffer type is not supported.");if(t.uri===void 0&&e===0)return Promise.resolve(this.extensions[Ge.KHR_BINARY_GLTF].body);const r=this.options;return new Promise(function(s,a){i.load(qs.resolveURL(t.uri,r.path),s,void 0,function(){a(new Error('THREE.GLTFLoader: Failed to load buffer "'+t.uri+'".'))})})}loadBufferView(e){const t=this.json.bufferViews[e];return this.getDependency("buffer",t.buffer).then(function(i){const r=t.byteLength||0,s=t.byteOffset||0;return i.slice(s,s+r)})}loadAccessor(e){const t=this,i=this.json,r=this.json.accessors[e];if(r.bufferView===void 0&&r.sparse===void 0){const a=Yl[r.type],o=Gr[r.componentType],l=r.normalized===!0,c=new o(r.count*a);return Promise.resolve(new je(c,a,l))}const s=[];return r.bufferView!==void 0?s.push(this.getDependency("bufferView",r.bufferView)):s.push(null),r.sparse!==void 0&&(s.push(this.getDependency("bufferView",r.sparse.indices.bufferView)),s.push(this.getDependency("bufferView",r.sparse.values.bufferView))),Promise.all(s).then(function(a){const o=a[0],l=Yl[r.type],c=Gr[r.componentType],u=c.BYTES_PER_ELEMENT,h=u*l,d=r.byteOffset||0,f=r.bufferView!==void 0?i.bufferViews[r.bufferView].byteStride:void 0,m=r.normalized===!0;let _,g;if(f&&f!==h){const p=Math.floor(d/f),y="InterleavedBuffer:"+r.bufferView+":"+r.componentType+":"+p+":"+r.count;let x=t.cache.get(y);x||(_=new c(o,p*f,r.count*f/u),x=new NM(_,f/u),t.cache.add(y,x)),g=new ku(x,l,d%f/u,m)}else o===null?_=new c(r.count*l):_=new c(o,d,r.count*l),g=new je(_,l,m);if(r.sparse!==void 0){const p=Yl.SCALAR,y=Gr[r.sparse.indices.componentType],x=r.sparse.indices.byteOffset||0,v=r.sparse.values.byteOffset||0,w=new y(a[1],x,r.sparse.count*p),b=new c(a[2],v,r.sparse.count*l);o!==null&&(g=new je(g.array.slice(),g.itemSize,g.normalized)),g.normalized=!1;for(let A=0,R=w.length;A<R;A++){const T=w[A];if(g.setX(T,b[A*l]),l>=2&&g.setY(T,b[A*l+1]),l>=3&&g.setZ(T,b[A*l+2]),l>=4&&g.setW(T,b[A*l+3]),l>=5)throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.")}g.normalized=m}return g})}loadTexture(e){const t=this.json,i=this.options,s=t.textures[e].source,a=t.images[s];let o=this.textureLoader;if(a.uri){const l=i.manager.getHandler(a.uri);l!==null&&(o=l)}return this.loadTextureImage(e,s,o)}loadTextureImage(e,t,i){const r=this,s=this.json,a=s.textures[e],o=s.images[t],l=(o.uri||o.bufferView)+":"+a.sampler;if(this.textureCache[l])return this.textureCache[l];const c=this.loadImageSource(t,i).then(function(u){u.flipY=!1,u.name=a.name||o.name||"",u.name===""&&typeof o.uri=="string"&&o.uri.startsWith("data:image/")===!1&&(u.name=o.uri);const d=(s.samplers||{})[a.sampler]||{};return u.magFilter=Xd[d.magFilter]||Yt,u.minFilter=Xd[d.minFilter]||oi,u.wrapS=qd[d.wrapS]||$r,u.wrapT=qd[d.wrapT]||$r,u.generateMipmaps=!u.isCompressedTexture&&u.minFilter!==Kt&&u.minFilter!==Yt,r.associations.set(u,{textures:e}),u}).catch(function(){return null});return this.textureCache[l]=c,c}loadImageSource(e,t){const i=this,r=this.json,s=this.options;if(this.sourceCache[e]!==void 0)return this.sourceCache[e].then(h=>h.clone());const a=r.images[e],o=self.URL||self.webkitURL;let l=a.uri||"",c=!1;if(a.bufferView!==void 0)l=i.getDependency("bufferView",a.bufferView).then(function(h){c=!0;const d=new Blob([h],{type:a.mimeType});return l=o.createObjectURL(d),l});else if(a.uri===void 0)throw new Error("THREE.GLTFLoader: Image "+e+" is missing URI and bufferView");const u=Promise.resolve(l).then(function(h){return new Promise(function(d,f){let m=d;t.isImageBitmapLoader===!0&&(m=function(_){const g=new St(_);g.needsUpdate=!0,d(g)}),t.load(qs.resolveURL(h,s.path),m,void 0,f)})}).then(function(h){return c===!0&&o.revokeObjectURL(l),ni(h,a),h.userData.mimeType=a.mimeType||$T(a.uri),h}).catch(function(h){throw console.error("THREE.GLTFLoader: Couldn't load texture",l),h});return this.sourceCache[e]=u,u}assignTexture(e,t,i,r){const s=this;return this.getDependency("texture",i.index).then(function(a){if(!a)return null;if(i.texCoord!==void 0&&i.texCoord>0&&(a=a.clone(),a.channel=i.texCoord),s.extensions[Ge.KHR_TEXTURE_TRANSFORM]){const o=i.extensions!==void 0?i.extensions[Ge.KHR_TEXTURE_TRANSFORM]:void 0;if(o){const l=s.associations.get(a);a=s.extensions[Ge.KHR_TEXTURE_TRANSFORM].extendTexture(a,o),s.associations.set(a,l)}}return r!==void 0&&(a.colorSpace=r),e[t]=a,a})}assignFinalMaterial(e){const t=e.geometry;let i=e.material;const r=t.attributes.tangent===void 0,s=t.attributes.color!==void 0,a=t.attributes.normal===void 0;if(e.isPoints){const o="PointsMaterial:"+i.uuid;let l=this.cache.get(o);l||(l=new na,zn.prototype.copy.call(l,i),l.color.copy(i.color),l.map=i.map,l.sizeAttenuation=!1,this.cache.add(o,l)),i=l}else if(e.isLine){const o="LineBasicMaterial:"+i.uuid;let l=this.cache.get(o);l||(l=new rm,zn.prototype.copy.call(l,i),l.color.copy(i.color),l.map=i.map,this.cache.add(o,l)),i=l}if(r||s||a){let o="ClonedMaterial:"+i.uuid+":";r&&(o+="derivative-tangents:"),s&&(o+="vertex-colors:"),a&&(o+="flat-shading:");let l=this.cache.get(o);l||(l=i.clone(),s&&(l.vertexColors=!0),a&&(l.flatShading=!0),r&&(l.normalScale&&(l.normalScale.y*=-1),l.clearcoatNormalScale&&(l.clearcoatNormalScale.y*=-1)),this.cache.add(o,l),this.associations.set(l,this.associations.get(i))),i=l}e.material=i}getMaterialType(){return si}loadMaterial(e){const t=this,i=this.json,r=this.extensions,s=i.materials[e];let a;const o={},l=s.extensions||{},c=[];if(l[Ge.KHR_MATERIALS_UNLIT]){const h=r[Ge.KHR_MATERIALS_UNLIT];a=h.getMaterialType(),c.push(h.extendParams(o,s,t))}else{const h=s.pbrMetallicRoughness||{};if(o.color=new we(1,1,1),o.opacity=1,Array.isArray(h.baseColorFactor)){const d=h.baseColorFactor;o.color.setRGB(d[0],d[1],d[2],zt),o.opacity=d[3]}h.baseColorTexture!==void 0&&c.push(t.assignTexture(o,"map",h.baseColorTexture,gt)),o.metalness=h.metallicFactor!==void 0?h.metallicFactor:1,o.roughness=h.roughnessFactor!==void 0?h.roughnessFactor:1,h.metallicRoughnessTexture!==void 0&&(c.push(t.assignTexture(o,"metalnessMap",h.metallicRoughnessTexture)),c.push(t.assignTexture(o,"roughnessMap",h.metallicRoughnessTexture))),a=this._invokeOne(function(d){return d.getMaterialType&&d.getMaterialType(e)}),c.push(Promise.all(this._invokeAll(function(d){return d.extendMaterialParams&&d.extendMaterialParams(e,o)})))}s.doubleSided===!0&&(o.side=bn);const u=s.alphaMode||$l.OPAQUE;if(u===$l.BLEND?(o.transparent=!0,o.depthWrite=!1):(o.transparent=!1,u===$l.MASK&&(o.alphaTest=s.alphaCutoff!==void 0?s.alphaCutoff:.5)),s.normalTexture!==void 0&&a!==ln&&(c.push(t.assignTexture(o,"normalMap",s.normalTexture)),o.normalScale=new fe(1,1),s.normalTexture.scale!==void 0)){const h=s.normalTexture.scale;o.normalScale.set(h,h)}if(s.occlusionTexture!==void 0&&a!==ln&&(c.push(t.assignTexture(o,"aoMap",s.occlusionTexture)),s.occlusionTexture.strength!==void 0&&(o.aoMapIntensity=s.occlusionTexture.strength)),s.emissiveFactor!==void 0&&a!==ln){const h=s.emissiveFactor;o.emissive=new we().setRGB(h[0],h[1],h[2],zt)}return s.emissiveTexture!==void 0&&a!==ln&&c.push(t.assignTexture(o,"emissiveMap",s.emissiveTexture,gt)),Promise.all(c).then(function(){const h=new a(o);return s.name&&(h.name=s.name),ni(h,s),t.associations.set(h,{materials:e}),s.extensions&&qi(r,h,s),h})}createUniqueName(e){const t=st.sanitizeNodeName(e||"");return t in this.nodeNamesUsed?t+"_"+ ++this.nodeNamesUsed[t]:(this.nodeNamesUsed[t]=0,t)}loadGeometries(e){const t=this,i=this.extensions,r=this.primitiveCache;function s(o){return i[Ge.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(o,t).then(function(l){return jd(l,o,t)})}const a=[];for(let o=0,l=e.length;o<l;o++){const c=e[o],u=YT(c),h=r[u];if(h)a.push(h.promise);else{let d;c.extensions&&c.extensions[Ge.KHR_DRACO_MESH_COMPRESSION]?d=s(c):d=jd(new _t,c,t),r[u]={primitive:c,promise:d},a.push(d)}}return Promise.all(a)}loadMesh(e){const t=this,i=this.json,r=this.extensions,s=i.meshes[e],a=s.primitives,o=[];for(let l=0,c=a.length;l<c;l++){const u=a[l].material===void 0?XT(this.cache):this.getDependency("material",a[l].material);o.push(u)}return o.push(t.loadGeometries(a)),Promise.all(o).then(function(l){const c=l.slice(0,l.length-1),u=l[l.length-1],h=[];for(let f=0,m=u.length;f<m;f++){const _=u[f],g=a[f];let p;const y=c[f];if(g.mode===mn.TRIANGLES||g.mode===mn.TRIANGLE_STRIP||g.mode===mn.TRIANGLE_FAN||g.mode===void 0)p=s.isSkinnedMesh===!0?new OM(_,y):new He(_,y),p.isSkinnedMesh===!0&&p.normalizeSkinWeights(),g.mode===mn.TRIANGLE_STRIP?p.geometry=Gd(p.geometry,Fp):g.mode===mn.TRIANGLE_FAN&&(p.geometry=Gd(p.geometry,ou));else if(g.mode===mn.LINES)p=new zM(_,y);else if(g.mode===mn.LINE_STRIP)p=new Vu(_,y);else if(g.mode===mn.LINE_LOOP)p=new VM(_,y);else if(g.mode===mn.POINTS)p=new Uo(_,y);else throw new Error("THREE.GLTFLoader: Primitive mode unsupported: "+g.mode);Object.keys(p.geometry.morphAttributes).length>0&&jT(p,s),p.name=t.createUniqueName(s.name||"mesh_"+e),ni(p,s),g.extensions&&qi(r,p,g),t.assignFinalMaterial(p),h.push(p)}for(let f=0,m=h.length;f<m;f++)t.associations.set(h[f],{meshes:e,primitives:f});if(h.length===1)return s.extensions&&qi(r,h[0],s),h[0];const d=new kt;s.extensions&&qi(r,d,s),t.associations.set(d,{meshes:e});for(let f=0,m=h.length;f<m;f++)d.add(h[f]);return d})}loadCamera(e){let t;const i=this.json.cameras[e],r=i[i.type];if(!r){console.warn("THREE.GLTFLoader: Missing camera parameters.");return}return i.type==="perspective"?t=new Ot(ae.radToDeg(r.yfov),r.aspectRatio||1,r.znear||1,r.zfar||2e6):i.type==="orthographic"&&(t=new ol(-r.xmag,r.xmag,r.ymag,-r.ymag,r.znear,r.zfar)),i.name&&(t.name=this.createUniqueName(i.name)),ni(t,i),Promise.resolve(t)}loadSkin(e){const t=this.json.skins[e],i=[];for(let r=0,s=t.joints.length;r<s;r++)i.push(this._loadNodeShallow(t.joints[r]));return t.inverseBindMatrices!==void 0?i.push(this.getDependency("accessor",t.inverseBindMatrices)):i.push(null),Promise.all(i).then(function(r){const s=r.pop(),a=r,o=[],l=[];for(let c=0,u=a.length;c<u;c++){const h=a[c];if(h){o.push(h);const d=new ge;s!==null&&d.fromArray(s.array,c*16),l.push(d)}else console.warn('THREE.GLTFLoader: Joint "%s" could not be found.',t.joints[c])}return new zu(o,l)})}loadAnimation(e){const t=this.json,i=this,r=t.animations[e],s=r.name?r.name:"animation_"+e,a=[],o=[],l=[],c=[],u=[];for(let h=0,d=r.channels.length;h<d;h++){const f=r.channels[h],m=r.samplers[f.sampler],_=f.target,g=_.node,p=r.parameters!==void 0?r.parameters[m.input]:m.input,y=r.parameters!==void 0?r.parameters[m.output]:m.output;_.node!==void 0&&(a.push(this.getDependency("node",g)),o.push(this.getDependency("accessor",p)),l.push(this.getDependency("accessor",y)),c.push(m),u.push(_))}return Promise.all([Promise.all(a),Promise.all(o),Promise.all(l),Promise.all(c),Promise.all(u)]).then(function(h){const d=h[0],f=h[1],m=h[2],_=h[3],g=h[4],p=[];for(let y=0,x=d.length;y<x;y++){const v=d[y],w=f[y],b=m[y],A=_[y],R=g[y];if(v===void 0)continue;v.updateMatrix&&v.updateMatrix();const T=i._createAnimationTracks(v,w,b,A,R);if(T)for(let M=0;M<T.length;M++)p.push(T[M])}return new $M(s,void 0,p)})}createNodeMesh(e){const t=this.json,i=this,r=t.nodes[e];return r.mesh===void 0?null:i.getDependency("mesh",r.mesh).then(function(s){const a=i._getNodeRef(i.meshCache,r.mesh,s);return r.weights!==void 0&&a.traverse(function(o){if(o.isMesh)for(let l=0,c=r.weights.length;l<c;l++)o.morphTargetInfluences[l]=r.weights[l]}),a})}loadNode(e){const t=this.json,i=this,r=t.nodes[e],s=i._loadNodeShallow(e),a=[],o=r.children||[];for(let c=0,u=o.length;c<u;c++)a.push(i.getDependency("node",o[c]));const l=r.skin===void 0?Promise.resolve(null):i.getDependency("skin",r.skin);return Promise.all([s,Promise.all(a),l]).then(function(c){const u=c[0],h=c[1],d=c[2];d!==null&&u.traverse(function(f){f.isSkinnedMesh&&f.bind(d,KT)});for(let f=0,m=h.length;f<m;f++)u.add(h[f]);return u})}_loadNodeShallow(e){const t=this.json,i=this.extensions,r=this;if(this.nodeCache[e]!==void 0)return this.nodeCache[e];const s=t.nodes[e],a=s.name?r.createUniqueName(s.name):"",o=[],l=r._invokeOne(function(c){return c.createNodeMesh&&c.createNodeMesh(e)});return l&&o.push(l),s.camera!==void 0&&o.push(r.getDependency("camera",s.camera).then(function(c){return r._getNodeRef(r.cameraCache,s.camera,c)})),r._invokeAll(function(c){return c.createNodeAttachment&&c.createNodeAttachment(e)}).forEach(function(c){o.push(c)}),this.nodeCache[e]=Promise.all(o).then(function(c){let u;if(s.isBone===!0?u=new nm:c.length>1?u=new kt:c.length===1?u=c[0]:u=new pt,u!==c[0])for(let h=0,d=c.length;h<d;h++)u.add(c[h]);if(s.name&&(u.userData.name=s.name,u.name=a),ni(u,s),s.extensions&&qi(i,u,s),s.matrix!==void 0){const h=new ge;h.fromArray(s.matrix),u.applyMatrix4(h)}else s.translation!==void 0&&u.position.fromArray(s.translation),s.rotation!==void 0&&u.quaternion.fromArray(s.rotation),s.scale!==void 0&&u.scale.fromArray(s.scale);return r.associations.has(u)||r.associations.set(u,{}),r.associations.get(u).nodes=e,u}),this.nodeCache[e]}loadScene(e){const t=this.extensions,i=this.json.scenes[e],r=this,s=new kt;i.name&&(s.name=r.createUniqueName(i.name)),ni(s,i),i.extensions&&qi(t,s,i);const a=i.nodes||[],o=[];for(let l=0,c=a.length;l<c;l++)o.push(r.getDependency("node",a[l]));return Promise.all(o).then(function(l){for(let u=0,h=l.length;u<h;u++)s.add(l[u]);const c=u=>{const h=new Map;for(const[d,f]of r.associations)(d instanceof zn||d instanceof St)&&h.set(d,f);return u.traverse(d=>{const f=r.associations.get(d);f!=null&&h.set(d,f)}),h};return r.associations=c(s),s})}_createAnimationTracks(e,t,i,r,s){const a=[],o=e.name?e.name:e.uuid,l=[];Si[s.path]===Si.weights?e.traverse(function(d){d.morphTargetInfluences&&l.push(d.name?d.name:d.uuid)}):l.push(o);let c;switch(Si[s.path]){case Si.weights:c=ts;break;case Si.rotation:c=ns;break;case Si.position:case Si.scale:c=is;break;default:switch(i.itemSize){case 1:c=ts;break;case 2:case 3:default:c=is;break}break}const u=r.interpolation!==void 0?WT[r.interpolation]:ea,h=this._getArrayFromAccessor(i);for(let d=0,f=l.length;d<f;d++){const m=new c(l[d]+"."+Si[s.path],t.array,h,u);r.interpolation==="CUBICSPLINE"&&this._createCubicSplineTrackInterpolant(m),a.push(m)}return a}_getArrayFromAccessor(e){let t=e.array;if(e.normalized){const i=mu(t.constructor),r=new Float32Array(t.length);for(let s=0,a=t.length;s<a;s++)r[s]=t[s]*i;t=r}return t}_createCubicSplineTrackInterpolant(e){e.createInterpolant=function(i){const r=this instanceof ns?GT:dm;return new r(this.times,this.values,this.getValueSize()/3,i)},e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline=!0}}function JT(n,e,t){const i=e.attributes,r=new cn;if(i.POSITION!==void 0){const o=t.json.accessors[i.POSITION],l=o.min,c=o.max;if(l!==void 0&&c!==void 0){if(r.set(new P(l[0],l[1],l[2]),new P(c[0],c[1],c[2])),o.normalized){const u=mu(Gr[o.componentType]);r.min.multiplyScalar(u),r.max.multiplyScalar(u)}}else{console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");return}}else return;const s=e.targets;if(s!==void 0){const o=new P,l=new P;for(let c=0,u=s.length;c<u;c++){const h=s[c];if(h.POSITION!==void 0){const d=t.json.accessors[h.POSITION],f=d.min,m=d.max;if(f!==void 0&&m!==void 0){if(l.setX(Math.max(Math.abs(f[0]),Math.abs(m[0]))),l.setY(Math.max(Math.abs(f[1]),Math.abs(m[1]))),l.setZ(Math.max(Math.abs(f[2]),Math.abs(m[2]))),d.normalized){const _=mu(Gr[d.componentType]);l.multiplyScalar(_)}o.max(l)}else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.")}}r.expandByVector(o)}n.boundingBox=r;const a=new un;r.getCenter(a.center),a.radius=r.min.distanceTo(r.max)/2,n.boundingSphere=a}function jd(n,e,t){const i=e.attributes,r=[];function s(a,o){return t.getDependency("accessor",a).then(function(l){n.setAttribute(o,l)})}for(const a in i){const o=pu[a]||a.toLowerCase();o in n.attributes||r.push(s(i[a],o))}if(e.indices!==void 0&&!n.index){const a=t.getDependency("accessor",e.indices).then(function(o){n.setIndex(o)});r.push(a)}return Xe.workingColorSpace!==zt&&"COLOR_0"in i&&console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${Xe.workingColorSpace}" not supported.`),ni(n,e),JT(n,e,t),Promise.all(r).then(function(){return e.targets!==void 0?qT(n,e.targets,t):n})}var fm=class extends fg{constructor(n=us){super(),this.manager=n,this.adjustmentTransform=new ge}parse(n){let e=super.parse(n),t=e.glbBytes.slice().buffer;return new Promise((i,r)=>{let s=this.manager,a=this.fetchOptions,o=s.getHandler("path.gltf")||new hs(s);a.credentials==="include"&&a.mode==="cors"&&o.setCrossOrigin("use-credentials"),"credentials"in a&&o.setWithCredentials(a.credentials==="include"),a.headers&&o.setRequestHeader(a.headers);let l=this.workingPath;!/[\\/]$/.test(l)&&l.length&&(l+="/");let c=this.adjustmentTransform;o.parse(t,l,u=>{let{batchTable:h,featureTable:d}=e,{scene:f}=u,m=d.getData("RTC_CENTER",1,"FLOAT","VEC3");m&&(f.position.x+=m[0],f.position.y+=m[1],f.position.z+=m[2]),u.scene.updateMatrix(),u.scene.matrix.multiply(c),u.scene.matrix.decompose(u.scene.position,u.scene.quaternion,u.scene.scale),u.batchTable=h,u.featureTable=d,f.batchTable=h,f.featureTable=d,i(u)},r)})}};function QT(n){let e=n>>11,t=n>>5&63,i=n&31;return[Math.round(e/31*255),Math.round(t/63*255),Math.round(i/31*255)]}var Ss=new fe;function eS(n,e,t=new P){Ss.set(n,e).divideScalar(256).multiplyScalar(2).subScalar(1),t.set(Ss.x,Ss.y,1-Math.abs(Ss.x)-Math.abs(Ss.y));let i=ae.clamp(-t.z,0,1);return t.x>=0?t.setX(t.x-i):t.setX(t.x+i),t.y>=0?t.setY(t.y-i):t.setY(t.y+i),t.normalize(),t}var Yd={RGB:"color",POSITION:"position"},pm=class extends mg{constructor(n=us){super(),this.manager=n}parse(n){return super.parse(n).then(async e=>{let{featureTable:t,batchTable:i}=e,r=new na,s=t.header.extensions,a=new P,o;if(s&&s["3DTILES_draco_point_compression"]){let{byteOffset:u,byteLength:h,properties:d}=s["3DTILES_draco_point_compression"],f=this.manager.getHandler("draco.drc");if(f==null)throw Error("PNTSLoader: dracoLoader not available.");let m={};for(let p in d)if(p in Yd&&p in d){let y=Yd[p];m[y]=d[p]}let _={attributeIDs:m,attributeTypes:{position:"Float32Array",color:"Uint8Array"},useUniqueIDs:!0},g=t.getBuffer(u,h);o=await f.decodeGeometry(g,_),o.attributes.color&&(r.vertexColors=!0)}else{let u=t.getData("POINTS_LENGTH"),h=t.getData("POSITION",u,"FLOAT","VEC3"),d=t.getData("NORMAL",u,"FLOAT","VEC3"),f=t.getData("NORMAL",u,"UNSIGNED_BYTE","VEC2"),m=t.getData("RGB",u,"UNSIGNED_BYTE","VEC3"),_=t.getData("RGBA",u,"UNSIGNED_BYTE","VEC4"),g=t.getData("RGB565",u,"UNSIGNED_SHORT","SCALAR"),p=t.getData("CONSTANT_RGBA",u,"UNSIGNED_BYTE","VEC4"),y=t.getData("POSITION_QUANTIZED",u,"UNSIGNED_SHORT","VEC3"),x=t.getData("QUANTIZED_VOLUME_SCALE",u,"FLOAT","VEC3"),v=t.getData("QUANTIZED_VOLUME_OFFSET",u,"FLOAT","VEC3");if(o=new _t,y){let w=new Float32Array(u*3);for(let b=0;b<u;b++)for(let A=0;A<3;A++){let R=3*b+A;w[R]=y[R]/65535*x[A]}a.x=v[0],a.y=v[1],a.z=v[2],o.setAttribute("position",new je(w,3,!1))}else o.setAttribute("position",new je(h,3,!1));if(d!==null)o.setAttribute("normal",new je(d,3,!1));else if(f!==null){let w=new Float32Array(u*3),b=new P;for(let A=0;A<u;A++){let R=f[A*2],T=f[A*2+1],M=eS(R,T,b);w[A*3]=M.x,w[A*3+1]=M.y,w[A*3+2]=M.z}o.setAttribute("normal",new je(w,3,!1))}if(_!==null)o.setAttribute("color",new je(_,4,!0)),r.vertexColors=!0,r.transparent=!0,r.depthWrite=!1;else if(m!==null)o.setAttribute("color",new je(m,3,!0)),r.vertexColors=!0;else if(g!==null){let w=new Uint8Array(u*3);for(let b=0;b<u;b++){let A=QT(g[b]);for(let R=0;R<3;R++){let T=3*b+R;w[T]=A[R]}}o.setAttribute("color",new je(w,3,!0)),r.vertexColors=!0}else if(p!==null){r.color=new we(p[0],p[1],p[2]);let w=p[3]/255;w<1&&(r.opacity=w,r.transparent=!0,r.depthWrite=!1)}}let l=new Uo(o,r);l.position.copy(a),e.scene=l,e.scene.featureTable=t,e.scene.batchTable=i;let c=t.getData("RTC_CENTER",1,"FLOAT","VEC3");return c&&(e.scene.position.x+=c[0],e.scene.position.y+=c[1],e.scene.position.z+=c[2]),e})}};function tS(n){let{x:e,y:t,z:i}=n;n.x=i,n.y=e,n.z=t}function nS(n){return-n+Math.PI/2}var $d=new gT,Ei=new P,Ht=new P,Zl=new P,pn=new ge,Nn=new ge,Jl=new un,Qt=new Dn,Kd=new P,Zd=new P,Jd=new P,Es=new P,ja=new Bi,iS=1e-12,rS=.1,sS=1,hl=class{constructor(e=1,t=1,i=1){this.name="",this.radius=new P(e,t,i)}intersectRay(e,t){return pn.makeScale(...this.radius).invert(),Jl.center.set(0,0,0),Jl.radius=1,ja.copy(e).applyMatrix4(pn),ja.intersectSphere(Jl,t)?(pn.makeScale(...this.radius),t.applyMatrix4(pn),t):null}getEastNorthUpFrame(e,t,i,r){return i.isMatrix4&&(r=i,i=0,console.warn('Ellipsoid: The signature for "getEastNorthUpFrame" has changed.')),this.getEastNorthUpAxes(e,t,Kd,Zd,Jd),this.getCartographicToPosition(e,t,i,Es),r.makeBasis(Kd,Zd,Jd).setPosition(Es)}getOrientedEastNorthUpFrame(e,t,i,r,s,a,o){return this.getObjectFrame(e,t,i,r,s,a,o,0)}getObjectFrame(e,t,i,r,s,a,o,l=2){return this.getEastNorthUpFrame(e,t,i,pn),Qt.set(s,a,-r,"ZXY"),o.makeRotationFromEuler(Qt).premultiply(pn),l===1?(Qt.set(Math.PI/2,0,0,"XYZ"),Nn.makeRotationFromEuler(Qt),o.multiply(Nn)):l===2&&(Qt.set(-Math.PI/2,0,Math.PI,"XYZ"),Nn.makeRotationFromEuler(Qt),o.multiply(Nn)),o}getCartographicFromObjectFrame(e,t,i=2){return i===1?(Qt.set(-Math.PI/2,0,0,"XYZ"),Nn.makeRotationFromEuler(Qt).premultiply(e)):i===2?(Qt.set(-Math.PI/2,0,Math.PI,"XYZ"),Nn.makeRotationFromEuler(Qt).premultiply(e)):Nn.copy(e),Es.setFromMatrixPosition(Nn),this.getPositionToCartographic(Es,t),this.getEastNorthUpFrame(t.lat,t.lon,0,pn).invert(),Nn.premultiply(pn),Qt.setFromRotationMatrix(Nn,"ZXY"),t.azimuth=-Qt.z,t.elevation=Qt.x,t.roll=Qt.y,t}getEastNorthUpAxes(e,t,i,r,s,a=Es){this.getCartographicToPosition(e,t,0,a),this.getCartographicToNormal(e,t,s),i.set(-a.y,a.x,0).normalize(),r.crossVectors(s,i).normalize()}getCartographicToPosition(e,t,i,r){this.getCartographicToNormal(e,t,Ei);let s=this.radius;Ht.copy(Ei),Ht.x*=s.x**2,Ht.y*=s.y**2,Ht.z*=s.z**2;let a=Math.sqrt(Ei.dot(Ht));return Ht.divideScalar(a),r.copy(Ht).addScaledVector(Ei,i)}getPositionToCartographic(e,t){this.getPositionToSurfacePoint(e,Ht),this.getPositionToNormal(Ht,Ei);let i=Zl.subVectors(e,Ht);return t.lon=Math.atan2(Ei.y,Ei.x),t.lat=Math.asin(Ei.z),t.height=Math.sign(i.dot(e))*i.length(),t}getCartographicToNormal(e,t,i){return $d.set(1,nS(e),t),i.setFromSpherical($d).normalize(),tS(i),i}getPositionToNormal(e,t){let i=this.radius;return t.copy(e),t.x/=i.x**2,t.y/=i.y**2,t.z/=i.z**2,t.normalize(),t}getPositionToSurfacePoint(e,t){let i=this.radius,r=1/i.x**2,s=1/i.y**2,a=1/i.z**2,o=e.x*e.x*r,l=e.y*e.y*s,c=e.z*e.z*a,u=o+l+c,h=Math.sqrt(1/u),d=Ht.copy(e).multiplyScalar(h);if(u<rS)return isFinite(h)?t.copy(d):null;let f=Zl.set(d.x*r*2,d.y*s*2,d.z*a*2),m=(1-h)*e.length()/(.5*f.length()),_=0,g,p,y,x,v,w,b,A,R,T,M;do{m-=_,y=1/(1+m*r),x=1/(1+m*s),v=1/(1+m*a),w=y*y,b=x*x,A=v*v,R=w*y,T=b*x,M=A*v,g=o*w+l*b+c*A-1,p=o*R*r+l*T*s+c*M*a;let L=-2*p;_=g/L}while(Math.abs(g)>iS);return t.set(e.x*y,e.y*x,e.z*v)}calculateHorizonDistance(e,t){let i=this.calculateEffectiveRadius(e);return Math.sqrt(2*i*t+t**2)}calculateEffectiveRadius(e){let t=this.radius.x,i=1-this.radius.z**2/t**2,r=e*ae.DEG2RAD,s=Math.sin(r)**2;return t/Math.sqrt(1-i*s)}getPositionElevation(e){this.getPositionToSurfacePoint(e,Ht);let t=Zl.subVectors(e,Ht);return Math.sign(t.dot(e))*t.length()}closestPointToRayEstimate(e,t){return this.intersectRay(e,t)?t:(pn.makeScale(...this.radius).invert(),ja.copy(e).applyMatrix4(pn),Ht.set(0,0,0),ja.closestPointToPoint(Ht,t).normalize(),pn.makeScale(...this.radius),t.applyMatrix4(pn))}copy(e){return this.radius.copy(e.radius),this}clone(){return new this.constructor().copy(this)}},or=new hl(xh,xh,ig);or.name="WGS84 Earth";var Ya=new P,wr=new P,Rr=new P,Ql=new P,$a=new Zt,Ka=new P,Cr=new ge,Qd=new ge,ef=new P,tf=new ge,ec=new Zt,tc={};function nf(n,e,t,i){if(n=n/t*2-1,e=e/t*2-1,i.x=n,i.y=e,i.z=1-Math.abs(n)-Math.abs(e),i.z<0){let r=i.x;i.x=(1-Math.abs(i.y))*(r>=0?1:-1),i.y=(1-Math.abs(r))*(i.y>=0?1:-1)}return i.normalize(),i}var mm=class extends pg{constructor(n=us){super(),this.manager=n,this.adjustmentTransform=new ge,this.ellipsoid=or.clone()}resolveExternalURL(n){return this.manager.resolveURL(super.resolveExternalURL(n))}parse(n){return super.parse(n).then(e=>{let{featureTable:t,batchTable:i}=e,r=e.glbBytes.slice().buffer;return new Promise((s,a)=>{let o=this.fetchOptions,l=this.manager,c=l.getHandler("path.gltf")||new hs(l);o.credentials==="include"&&o.mode==="cors"&&c.setCrossOrigin("use-credentials"),"credentials"in o&&c.setWithCredentials(o.credentials==="include"),o.headers&&c.setRequestHeader(o.headers);let u=e.gltfWorkingPath??this.workingPath;/[\\/]$/.test(u)||(u+="/");let h=this.adjustmentTransform;c.parse(r,u,d=>{let f=t.getData("INSTANCES_LENGTH"),m=t.getData("POSITION",f,"FLOAT","VEC3"),_=t.getData("POSITION_QUANTIZED",f,"UNSIGNED_SHORT","VEC3"),g=t.getData("QUANTIZED_VOLUME_OFFSET",1,"FLOAT","VEC3"),p=t.getData("QUANTIZED_VOLUME_SCALE",1,"FLOAT","VEC3"),y=t.getData("NORMAL_UP",f,"FLOAT","VEC3"),x=t.getData("NORMAL_RIGHT",f,"FLOAT","VEC3"),v=t.getData("NORMAL_UP_OCT32P",f,"UNSIGNED_SHORT","VEC2"),w=t.getData("NORMAL_RIGHT_OCT32P",f,"UNSIGNED_SHORT","VEC2"),b=t.getData("SCALE_NON_UNIFORM",f,"FLOAT","VEC3"),A=t.getData("SCALE",f,"FLOAT","SCALAR"),R=t.getData("RTC_CENTER",1,"FLOAT","VEC3"),T=t.getData("EAST_NORTH_UP");if(!m&&_){m=new Float32Array(f*3);for(let I=0;I<f;I++)m[I*3+0]=g[0]+_[I*3+0]/65535*p[0],m[I*3+1]=g[1]+_[I*3+1]/65535*p[1],m[I*3+2]=g[2]+_[I*3+2]/65535*p[2]}let M=new P;for(let I=0;I<f;I++)M.x+=m[I*3+0]/f,M.y+=m[I*3+1]/f,M.z+=m[I*3+2]/f;let L=[],z=[];d.scene.updateMatrixWorld(),d.scene.traverse(I=>{if(I.isMesh){z.push(I);let{geometry:q,material:k}=I,O=new im(q,k,f);O.position.copy(M),R&&(O.position.x+=R[0],O.position.y+=R[1],O.position.z+=R[2]),L.push(O)}});for(let I=0;I<f;I++){Ql.set(m[I*3+0]-M.x,m[I*3+1]-M.y,m[I*3+2]-M.z),$a.identity(),y&&x?(wr.set(y[I*3+0],y[I*3+1],y[I*3+2]),Rr.set(x[I*3+0],x[I*3+1],x[I*3+2]),Ya.crossVectors(Rr,wr).normalize(),Cr.makeBasis(Rr,wr,Ya),$a.setFromRotationMatrix(Cr)):v&&w&&(nf(v[I*2+0],v[I*2+1],65535,wr),nf(w[I*2+0],w[I*2+1],65535,Rr),Ya.crossVectors(Rr,wr).normalize(),Cr.makeBasis(Rr,wr,Ya),$a.setFromRotationMatrix(Cr)),Ka.set(1,1,1),b&&Ka.set(b[I*3+0],b[I*3+1],b[I*3+2]),A&&Ka.multiplyScalar(A[I]);for(let q=0,k=L.length;q<k;q++){let O=L[q];ec.copy($a),T&&(O.updateMatrixWorld(),ef.copy(Ql).applyMatrix4(O.matrixWorld),this.ellipsoid.getPositionToCartographic(ef,tc),this.ellipsoid.getEastNorthUpFrame(tc.lat,tc.lon,tf),ec.setFromRotationMatrix(tf)),Cr.compose(Ql,ec,Ka).multiply(h);let j=z[q];Qd.multiplyMatrices(Cr,j.matrixWorld),O.setMatrixAt(I,Qd)}}d.scene.clear(),d.scene.add(...L),d.batchTable=i,d.featureTable=t,d.scene.batchTable=i,d.scene.featureTable=t,s(d)},a)})})}},aS=class extends gg{constructor(n=us){super(),this.manager=n,this.adjustmentTransform=new ge,this.ellipsoid=or.clone()}parse(n){let e=super.parse(n),{manager:t,ellipsoid:i,adjustmentTransform:r}=this,s=[];for(let a in e.tiles){let{type:o,buffer:l}=e.tiles[a];switch(o){case"b3dm":{let c=l.slice(),u=new fm(t);u.workingPath=this.workingPath,u.fetchOptions=this.fetchOptions,u.adjustmentTransform.copy(r);let h=u.parse(c.buffer);s.push(h);break}case"pnts":{let c=l.slice(),u=new pm(t);u.workingPath=this.workingPath,u.fetchOptions=this.fetchOptions;let h=u.parse(c.buffer);s.push(h);break}case"i3dm":{let c=l.slice(),u=new mm(t);u.workingPath=this.workingPath,u.fetchOptions=this.fetchOptions,u.ellipsoid.copy(i),u.adjustmentTransform.copy(r);let h=u.parse(c.buffer);s.push(h);break}}}return Promise.all(s).then(a=>{let o=new kt;return a.forEach(l=>{o.add(l.scene)}),{tiles:a,scene:o}})}},bs=new ge,oS=class extends kt{constructor(n){super(),this.isTilesGroup=!0,this.name="TilesRenderer.TilesGroup",this.tilesRenderer=n,this.matrixWorldInverse=new ge}raycast(n,e){return this.tilesRenderer.raycast(n,e),!1}updateMatrixWorld(n){if(this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldNeedsUpdate||n){this.parent===null?bs.copy(this.matrix):bs.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1;let e=bs.elements,t=this.matrixWorld.elements,i=!1;for(let r=0;r<16;r++){let s=e[r],a=t[r];if(Math.abs(s-a)>2**-52){i=!0;break}}if(i){this.matrixWorld.copy(bs),this.matrixWorldInverse.copy(bs).invert();let r=this.children;for(let l=0,c=r.length;l<c;l++)r[l].updateMatrixWorld();let{tilesRenderer:s}=this,{activeTiles:a,visibleTiles:o}=s;a.forEach(l=>{o.has(l)||l.engineData.scene.updateMatrixWorld(!0)})}}}updateWorldMatrix(n,e){this.parent&&n&&this.parent.updateWorldMatrix(n,!1),this.updateMatrixWorld(!0)}},lS=new Bi;function cS(n,e,t,i){let{scene:r}=n.engineData;t.invokeOnePlugin(s=>s.raycastTile&&s.raycastTile(n,r,e,i))||e.intersectObject(r,!0,i)}function uS(n){return"traversal"in n}function gm(n,e,t,i,r=null){if(!uS(e))return;let{group:s,activeTiles:a}=n,{boundingVolume:o}=e.engineData;if(r===null&&(r=lS,r.copy(t.ray).applyMatrix4(s.matrixWorldInverse)),!e.traversal.used||!o.intersectsRay(r))return;a.has(e)&&cS(e,t,n,i);let l=e.children;for(let c=0,u=l.length;c<u;c++)gm(n,l[c],t,i,r)}var Za=new P,Ja=new P,en=new P,Qa=new Bi,rf=class{constructor(e=new cn,t=new ge){this.box=e.clone(),this.transform=t.clone(),this.inverseTransform=new ge,this.points=Array(8).fill().map(()=>new P),this.planes=[,,,,,,].fill().map(()=>new Ri)}copy(e){return this.box.copy(e.box),this.transform.copy(e.transform),this.update(),this}clone(){return new this.constructor().copy(this)}clampPoint(e,t){return t.copy(e).applyMatrix4(this.inverseTransform).clamp(this.box.min,this.box.max).applyMatrix4(this.transform)}distanceToPoint(e){return this.clampPoint(e,en).distanceTo(e)}containsPoint(e){return en.copy(e).applyMatrix4(this.inverseTransform),this.box.containsPoint(en)}intersectsRay(e){return Qa.copy(e).applyMatrix4(this.inverseTransform),Qa.intersectsBox(this.box)}intersectRay(e,t){return Qa.copy(e).applyMatrix4(this.inverseTransform),Qa.intersectBox(this.box,t)?(t.applyMatrix4(this.transform),t):null}update(){let{points:e,inverseTransform:t,transform:i,box:r}=this;t.copy(i).invert();let{min:s,max:a}=r,o=0;for(let l=-1;l<=1;l+=2)for(let c=-1;c<=1;c+=2)for(let u=-1;u<=1;u+=2)e[o].set(l<0?s.x:a.x,c<0?s.y:a.y,u<0?s.z:a.z).applyMatrix4(i),o++;this.updatePlanes()}updatePlanes(){Za.copy(this.box.min).applyMatrix4(this.transform),Ja.copy(this.box.max).applyMatrix4(this.transform),en.set(0,0,1).transformDirection(this.transform),this.planes[0].setFromNormalAndCoplanarPoint(en,Za),this.planes[1].setFromNormalAndCoplanarPoint(en,Ja).negate(),en.set(0,1,0).transformDirection(this.transform),this.planes[2].setFromNormalAndCoplanarPoint(en,Za),this.planes[3].setFromNormalAndCoplanarPoint(en,Ja).negate(),en.set(1,0,0).transformDirection(this.transform),this.planes[4].setFromNormalAndCoplanarPoint(en,Za),this.planes[5].setFromNormalAndCoplanarPoint(en,Ja).negate()}intersectsSphere(e){return this.clampPoint(e.center,en),en.distanceToSquared(e.center)<=e.radius*e.radius}intersectsFrustum(e){return this._intersectsPlaneShape(e.planes,e.points)}intersectsOBB(e){return this._intersectsPlaneShape(e.planes,e.points)}_intersectsPlaneShape(e,t){let i=this.points,r=this.planes;for(let s=0;s<6;s++){let a=e[s],o=-1/0;for(let l=0;l<8;l++){let c=i[l],u=a.distanceToPoint(c);o=o<u?u:o}if(o<0)return!1}for(let s=0;s<6;s++){let a=r[s],o=-1/0;for(let l=0;l<8;l++){let c=t[l],u=a.distanceToPoint(c);o=o<u?u:o}if(o<0)return!1}return!0}},Bs=Math.PI,nc=Bs/2,As=new P,ji=new P,En=new P,Ie=new P,Gt=new ge,hS=new cn,sf=new ge;function bi(n,e){e.radius=Math.max(e.radius,n.distanceToSquared(e.center))}function af(n){return n.x!==n.y}var dS=class extends hl{constructor(n=1,e=1,t=1,i=-nc,r=nc,s=0,a=2*Bs,o=0,l=0){super(n,e,t),this.latStart=i,this.latEnd=r,this.lonStart=s,this.lonEnd=a,this.heightStart=o,this.heightEnd=l}getBoundingBox(n,e){af(this.radius)&&console.warn("EllipsoidRegion: Triaxial ellipsoids are not supported.");let{latStart:t,latEnd:i,lonStart:r,lonEnd:s,heightStart:a,heightEnd:o}=this,l=(t+i)*.5,c=(r+s)*.5,u=t>0,h=i<0,d;d=u?t:h?i:0;let{min:f,max:m}=n;f.setScalar(1/0),m.setScalar(-1/0),s-r<=Bs?(this.getCartographicToNormal(l,c,En),ji.set(0,0,1),As.crossVectors(ji,En).normalize(),ji.crossVectors(En,As).normalize(),e.makeBasis(As,ji,En),Gt.copy(e).invert(),this.getCartographicToPosition(d,r,o,Ie).applyMatrix4(Gt),m.x=Math.abs(Ie.x),f.x=-m.x,this.getCartographicToPosition(i,r,o,Ie).applyMatrix4(Gt),m.y=Ie.y,this.getCartographicToPosition(i,c,o,Ie).applyMatrix4(Gt),m.y=Math.max(Ie.y,m.y),this.getCartographicToPosition(t,r,o,Ie).applyMatrix4(Gt),f.y=Ie.y,this.getCartographicToPosition(t,c,o,Ie).applyMatrix4(Gt),f.y=Math.min(Ie.y,f.y),this.getCartographicToPosition(l,c,o,Ie).applyMatrix4(Gt),m.z=Ie.z,this.getCartographicToPosition(t,r,a,Ie).applyMatrix4(Gt),f.z=Ie.z,this.getCartographicToPosition(i,r,a,Ie).applyMatrix4(Gt),f.z=Math.min(Ie.z,f.z)):(this.getCartographicToPosition(d,c,o,En),En.z=0,En.length()<1e-10?En.set(1,0,0):En.normalize(),ji.set(0,0,1),As.crossVectors(En,ji).normalize(),e.makeBasis(As,ji,En),Gt.copy(e).invert(),this.getCartographicToPosition(d,c+nc,o,Ie).applyMatrix4(Gt),m.x=Math.abs(Ie.x),f.x=-m.x,this.getCartographicToPosition(i,0,h?a:o,Ie).applyMatrix4(Gt),m.y=Ie.y,this.getCartographicToPosition(t,0,u?a:o,Ie).applyMatrix4(Gt),f.y=Ie.y,this.getCartographicToPosition(d,c,o,Ie).applyMatrix4(Gt),m.z=Ie.z,this.getCartographicToPosition(d,s,o,Ie).applyMatrix4(Gt),f.z=Ie.z),n.getCenter(Ie),n.min.sub(Ie).multiplyScalar(1.0000000000001),n.max.sub(Ie).multiplyScalar(1.0000000000001),Ie.applyMatrix4(e),e.setPosition(Ie)}getBoundingSphere(n){af(this.radius)&&console.warn("EllipsoidRegion: Triaxial ellipsoids are not supported."),this.getBoundingBox(hS,sf),n.center.setFromMatrixPosition(sf),n.radius=0;let{latStart:e,latEnd:t,lonStart:i,lonEnd:r,heightStart:s,heightEnd:a}=this,o=(e+t)*.5,l=(i+r)*.5,c=e>0,u=t<0,h;h=c?e:u?t:0,this.getCartographicToPosition(h,i,a,Ie),bi(Ie,n),this.getCartographicToPosition(t,i,a,Ie),bi(Ie,n),this.getCartographicToPosition(t,l,a,Ie),bi(Ie,n),this.getCartographicToPosition(e,i,a,Ie),bi(Ie,n),this.getCartographicToPosition(e,l,a,Ie),bi(Ie,n),this.getCartographicToPosition(o,l,a,Ie),bi(Ie,n),this.getCartographicToPosition(e,i,s,Ie),bi(Ie,n),r-i>Bs&&(this.getCartographicToPosition(h,l+Bs,a,Ie),bi(Ie,n)),n.radius=Math.sqrt(n.radius)*1.0000000000001}},Jn=new P,Qn=new P,ei=new P,of=new P,lf=new P,fS=class{constructor(){this.sphere=null,this.obb=null,this.region=null,this.regionObb=null}intersectsRay(n){let e=this.sphere,t=this.obb||this.regionObb;return!(e&&!n.intersectsSphere(e)||t&&!t.intersectsRay(n))}intersectRay(n,e=null){let t=this.sphere,i=this.obb||this.regionObb,r=-1/0,s=-1/0;t&&n.intersectSphere(t,of)&&(r=t.containsPoint(n.origin)?0:n.origin.distanceToSquared(of)),i&&i.intersectRay(n,lf)&&(s=i.containsPoint(n.origin)?0:n.origin.distanceToSquared(lf));let a=Math.max(r,s);return a===-1/0?null:(n.at(Math.sqrt(a),e),e)}distanceToPoint(n){let e=this.sphere,t=this.obb||this.regionObb,i=-1/0,r=-1/0;return e&&(i=Math.max(e.distanceToPoint(n),0)),t&&(r=t.distanceToPoint(n)),i>r?i:r}intersectsFrustum(n){let e=this.obb||this.regionObb,t=this.sphere;return t&&!n.intersectsSphere(t)||e&&!e.intersectsFrustum(n)?!1:!!(t||e)}intersectsSphere(n){let e=this.obb||this.regionObb,t=this.sphere;return t&&!t.intersectsSphere(n)||e&&!e.intersectsSphere(n)?!1:!!(t||e)}intersectsOBB(n){let e=this.obb||this.regionObb,t=this.sphere;return t&&!n.intersectsSphere(t)||e&&!e.intersectsOBB(n)?!1:!!(t||e)}getOBB(n,e){let t=this.obb||this.regionObb;t?(n.copy(t.box),e.copy(t.transform)):(this.getAABB(n),e.identity())}getAABB(n){if(this.sphere)this.sphere.getBoundingBox(n);else{let e=this.obb||this.regionObb;n.copy(e.box).applyMatrix4(e.transform)}}getSphere(n){if(this.sphere)n.copy(this.sphere);else if(this.region)this.region.getBoundingSphere(n);else{let e=this.obb||this.regionObb;e.box.getBoundingSphere(n),n.applyMatrix4(e.transform)}}setObbData(n,e){let t=new rf;Jn.set(n[3],n[4],n[5]),Qn.set(n[6],n[7],n[8]),ei.set(n[9],n[10],n[11]);let i=Jn.length(),r=Qn.length(),s=ei.length();Jn.normalize(),Qn.normalize(),ei.normalize(),i===0&&Jn.crossVectors(Qn,ei),r===0&&Qn.crossVectors(Jn,ei),s===0&&ei.crossVectors(Jn,Qn),t.transform.set(Jn.x,Qn.x,ei.x,n[0],Jn.y,Qn.y,ei.y,n[1],Jn.z,Qn.z,ei.z,n[2],0,0,0,1).premultiply(e),t.box.min.set(-i,-r,-s),t.box.max.set(i,r,s),t.update(),this.obb=t}setSphereData(n,e,t,i,r){let s=new un;s.center.set(n,e,t),s.radius=i,s.applyMatrix4(r),this.sphere=s}setRegionData(n,e,t,i,r,s,a){let o=new dS(...n.radius,t,r,e,i,s,a),l=new rf;o.getBoundingBox(l.box,l.transform),l.update(),this.region=o,this.regionObb=l}},pS=new Ne;function mS(n,e,t,i){let r=pS.set(n.normal.x,n.normal.y,n.normal.z,e.normal.x,e.normal.y,e.normal.z,t.normal.x,t.normal.y,t.normal.z);return i.set(-n.constant,-e.constant,-t.constant),i.applyMatrix3(r.invert()),i}var gS=class extends al{constructor(){super(),this.points=Array(8).fill().map(()=>new P)}setFromProjectionMatrix(...n){return super.setFromProjectionMatrix(...n),this.calculateFrustumPoints(),this}calculateFrustumPoints(){let{planes:n,points:e}=this;[[n[0],n[3],n[4]],[n[1],n[3],n[4]],[n[0],n[2],n[4]],[n[1],n[2],n[4]],[n[0],n[3],n[5]],[n[1],n[3],n[5]],[n[0],n[2],n[5]],[n[1],n[2],n[5]]].forEach((t,i)=>{mS(t[0],t[1],t[2],e[i])})}},gu=0;function cf(n,e,t,i){try{return em.getByteLength(n,e,t,i)}catch{return gu}}function _S(n){var a,o;if(!n)return 0;if(n.isExternalTexture)return((a=n.userData)==null?void 0:a.byteLength)??gu;let{format:e,type:t,image:i,mipmaps:r}=n;if(n.isCompressedTexture&&Array.isArray(r)&&r.length>0){let l=0;for(let c of r)(o=c==null?void 0:c.data)!=null&&o.byteLength?l+=c.data.byteLength:l+=cf(c.width,c.height,e,t);return l}if(!i)return gu;let s=cf(i.width,i.height,e,t);return s*=n.generateMipmaps?4/3:1,s}function xS(n){let e=new Set,t=0;return n.traverse(i=>{if(i.geometry&&!e.has(i.geometry)&&(t+=xT(i.geometry),e.add(i.geometry)),i.material){let r=i.material;for(let s in r){let a=r[s];a&&a.isTexture&&!e.has(a)&&(t+=_S(a),e.add(a))}}}),t}var _m=Symbol("INITIAL_FRUSTUM_CULLED"),eo=new ge,ws=new P,ic=new fe,vS=new P(1,0,0),yS=new P(0,1,0),MS=()=>null;function uf(n,e){n.traverse(t=>{t.frustumCulled=t[_m]&&e})}var TS=class extends ug{get autoDisableRendererCulling(){return this._autoDisableRendererCulling}set autoDisableRendererCulling(n){this._autoDisableRendererCulling!==n&&(super._autoDisableRendererCulling=n,this.forEachLoadedModel(e=>{uf(e,!n)}))}constructor(...n){super(...n),this.accelerateRaycast=!0,this.group=new oS(this),this.ellipsoid=or.clone(),this.cameras=[],this.cameraMap=new Map,this.cameraInfo=[],this._upRotationMatrix=new ge,this._bytesUsed=new WeakMap,this._autoDisableRendererCulling=!0,this.manager=new om,this._listeners={}}addEventListener(n,e){kn.prototype.addEventListener.call(this,n,e)}hasEventListener(n,e){return kn.prototype.hasEventListener.call(this,n,e)}removeEventListener(n,e){kn.prototype.removeEventListener.call(this,n,e)}dispatchEvent(n){kn.prototype.dispatchEvent.call(this,n)}getBoundingBox(n){if(!this.root)return!1;let e=this.root.engineData.boundingVolume;return e?(e.getAABB(n),!0):!1}getOrientedBoundingBox(n,e){if(!this.root)return!1;let t=this.root.engineData.boundingVolume;return t?(t.getOBB(n,e),!0):!1}getBoundingSphere(n){if(!this.root)return!1;let e=this.root.engineData.boundingVolume;return e?(e.getSphere(n),!0):!1}forEachLoadedModel(n){this.traverse(e=>{let t=e.engineData&&e.engineData.scene;t&&n(t,e)},null,!1)}raycast(n,e){if(this.root)if(this.accelerateRaycast)gm(this,this.root,n,e);else{let t=n.firstHitOnly?[]:e;for(let i of this.activeTiles){let{scene:r}=i.engineData;this.invokeOnePlugin(s=>s.raycastTile&&s.raycastTile(i,r,n,t))||n.intersectObject(r,!0,t)}n.firstHitOnly&&t.length>0&&(t.sort((i,r)=>i.distance-r.distance),e.push(t[0]))}}hasCamera(n){return this.cameraMap.has(n)}setCamera(n){let e=this.cameras,t=this.cameraMap;return t.has(n)?!1:(t.set(n,new fe),e.push(n),this.dispatchEvent({type:"add-camera",camera:n}),!0)}setResolution(n,e,t){let i=this.cameraMap;if(!i.has(n))return!1;let r=e.isVector2?e.x:e,s=e.isVector2?e.y:t,a=i.get(n);return(a.width!==r||a.height!==s)&&(a.set(r,s),this.dispatchEvent({type:"camera-resolution-change"})),!0}getResolution(n,e){let t=this.cameraMap.get(n);return t?e.copy(t):null}setResolutionFromRenderer(n,e){return e.getSize(ic),this.setResolution(n,ic.x,ic.y)}deleteCamera(n){let e=this.cameras,t=this.cameraMap;if(t.has(n)){let i=e.indexOf(n);return e.splice(i,1),t.delete(n),this.dispatchEvent({type:"delete-camera",camera:n}),!0}return!1}loadRootTileset(...n){return super.loadRootTileset(...n).then(e=>{let{asset:t,extensions:i={}}=e;switch((t&&t.gltfUpAxis||"y").toLowerCase()){case"x":this._upRotationMatrix.makeRotationAxis(yS,-Math.PI/2);break;case"y":this._upRotationMatrix.makeRotationAxis(vS,Math.PI/2);break}if("3DTILES_ellipsoid"in i){let r=i["3DTILES_ellipsoid"],{ellipsoid:s}=this;s.name=r.body,r.radii?s.radius.set(...r.radii):s.radius.set(1,1,1)}return e})}prepareForTraversal(){let n=this.group,e=this.cameras,t=this.cameraMap,i=this.cameraInfo;for(;i.length>e.length;)i.pop();for(;i.length<e.length;)i.push({frustum:new gS,isOrthographic:!1,sseDenominator:-1,position:new P,invScale:-1,pixelSize:0});ws.setFromMatrixScale(n.matrixWorldInverse),Math.abs(Math.max(ws.x-ws.y,ws.x-ws.z))>1e-6&&console.warn("ThreeTilesRenderer : Non uniform scale used for tile which may cause issues when calculating screen space error.");for(let r=0,s=i.length;r<s;r++){let a=e[r],o=i[r],l=o.frustum,c=o.position,u=t.get(a);(u.width===0||u.height===0)&&console.warn("TilesRenderer: resolution for camera error calculation is not set.");let h=a.projectionMatrix.elements;if(o.isOrthographic=h[15]===1,o.isOrthographic){let d=2/h[0],f=2/h[5];o.pixelSize=Math.max(f/u.height,d/u.width)}else o.sseDenominator=2/h[5]/u.height;eo.copy(n.matrixWorld),eo.premultiply(a.matrixWorldInverse),eo.premultiply(a.projectionMatrix),l.setFromProjectionMatrix(eo,a.coordinateSystem,a.reversedDepth),c.set(0,0,0),c.applyMatrix4(a.matrixWorld),c.applyMatrix4(n.matrixWorldInverse)}}update(){if(super.update(),this.cameras.length===0&&this.root){let n=!1;this.invokeAllPlugins(e=>n||(n=!!(e!==this&&e.calculateTileViewError))),n===!1&&console.warn("TilesRenderer: no cameras defined. Cannot update 3d tiles.")}}preprocessNode(n,e,t=null){super.preprocessNode(n,e,t);let i=new ge;if(n.transform){let a=n.transform;for(let o=0;o<16;o++)i.elements[o]=a[o]}t&&i.premultiply(t.engineData.transform);let r=new ge().copy(i).invert(),s=new fS;"sphere"in n.boundingVolume&&s.setSphereData(...n.boundingVolume.sphere,i),"box"in n.boundingVolume&&s.setObbData(n.boundingVolume.box,i),"region"in n.boundingVolume&&s.setRegionData(this.ellipsoid,...n.boundingVolume.region),n.engineData.transform=i,n.engineData.transformInverse=r,n.engineData.boundingVolume=s,n.engineData.geometry=null,n.engineData.materials=null,n.engineData.textures=null,n.toJSON=MS}async parseTile(n,e,t,i,r){let s=e.engineData,a=Eu(i),o=this.fetchOptions,l=this.manager,c=null,u=s.transform,h=this._upRotationMatrix,d=(Xr(n)||t).toLowerCase();switch(d){case"b3dm":{let x=new fm(l);x.workingPath=a,x.fetchOptions=o,x.adjustmentTransform.copy(h),c=x.parse(n);break}case"pnts":{let x=new pm(l);x.workingPath=a,x.fetchOptions=o,c=x.parse(n);break}case"i3dm":{let x=new mm(l);x.workingPath=a,x.fetchOptions=o,x.adjustmentTransform.copy(h),x.ellipsoid.copy(this.ellipsoid),c=x.parse(n);break}case"cmpt":{let x=new aS(l);x.workingPath=a,x.fetchOptions=o,x.adjustmentTransform.copy(h),x.ellipsoid.copy(this.ellipsoid),c=x.parse(n).then(v=>v.scene);break}case"gltf":case"glb":{let x=l.getHandler("path.gltf")||l.getHandler("path.glb")||new hs(l);x.setWithCredentials(o.credentials==="include"),x.setRequestHeader(o.headers||{}),o.credentials==="include"&&o.mode==="cors"&&x.setCrossOrigin("use-credentials");let v=x.resourcePath||x.path||a;!/[\\/]$/.test(v)&&v.length&&(v+="/"),c=x.parseAsync(n,v).then(w=>{w.scene=w.scene||new kt;let{scene:b}=w;return b.updateMatrix(),b.matrix.multiply(h).decompose(b.position,b.quaternion,b.scale),w});break}default:c=this.invokeOnePlugin(x=>x.parseToMesh&&x.parseToMesh(n,e,t,i,r));break}let f=await c;if(f===null)throw Error(`TilesRenderer: Content type "${d}" not supported.`);let m,_;f.isObject3D?(m=f,_=null):(m=f.scene,_=f),m.updateMatrix(),m.matrix.premultiply(u),m.matrix.decompose(m.position,m.quaternion,m.scale),await this.invokeAllPlugins(x=>x.processTileModel&&x.processTileModel(m,e)),m.traverse(x=>{x[_m]=x.frustumCulled,x.userData.tile=e}),uf(m,!this.autoDisableRendererCulling);let g=[],p=[],y=[];if(m.traverse(x=>{if(x.geometry&&p.push(x.geometry),x.material){let v=x.material;g.push(x.material);for(let w in v){let b=v[w];b&&b.isTexture&&y.push(b)}}}),r.aborted){for(let x=0,v=y.length;x<v;x++){let w=y[x];w.image instanceof ImageBitmap&&w.image.close(),w.dispose()}return}s.materials=g,s.geometry=p,s.textures=y,s.scene=m,s.metadata=_}disposeTile(n){super.disposeTile(n);let e=n.engineData;if(e.scene){let t=e.materials,i=e.geometry,r=e.textures,s=e.scene.parent;e.scene.traverse(a=>{a.userData.meshFeatures&&a.userData.meshFeatures.dispose(),a.userData.structuralMetadata&&a.userData.structuralMetadata.dispose()});for(let a=0,o=i.length;a<o;a++)i[a].dispose();for(let a=0,o=t.length;a<o;a++)t[a].dispose();for(let a=0,o=r.length;a<o;a++){let l=r[a];l.image instanceof ImageBitmap&&l.image.close(),l.dispose()}s&&s.remove(e.scene),e.scene=null,e.materials=null,e.textures=null,e.geometry=null,e.metadata=null}}setTileActive(n,e){super.setTileActive(n,e);let t=n.engineData.scene;t&&(e?(t.parent=this.group,t.updateMatrixWorld(!0)):t.parent=null)}setTileVisible(n,e){let t=n.engineData.scene,{activeTiles:i,group:r}=this;t&&(e?r.add(t):(r.remove(t),i.has(n)&&(t.parent=r))),super.setTileVisible(n,e)}calculateBytesUsed(n,e){let t=this._bytesUsed;return!t.has(n)&&e&&t.set(n,xS(e)),t.get(n)??null}calculateTileViewError(n,e){let t=n.engineData,i=this.cameras,r=this.cameraInfo,s=t.boundingVolume,a=!1,o=0,l=1/0,c=0,u=1/0;for(let h=0,d=i.length;h<d;h++){let f=r[h],m,_;if(f.isOrthographic){let p=f.pixelSize;m=n.geometricError/p,_=1/0}else{let p=f.sseDenominator;_=s.distanceToPoint(f.position),m=_===0?1/0:n.geometricError/(_*p)}let g=r[h].frustum;s.intersectsFrustum(g)&&(a=!0,o=Math.max(o,m),l=Math.min(l,_)),c=Math.max(c,m),u=Math.min(u,_)}a?(e.inView=!0,e.error=o,e.distanceFromCamera=l):(e.inView=!1,e.error=c,e.distanceFromCamera=u)}dispose(){super.dispose(),this.group.removeFromParent()}},SS=class{constructor(n={}){let{apiToken:e,autoRefreshToken:t=!1}=n;this.apiToken=e,this.autoRefreshToken=t,this.authURL=null,this._tokenRefreshPromise=null,this._bearerToken=null,this._bearerHostname=null}async fetch(n,e){await this._tokenRefreshPromise;let t={...e},i=this._bearerHostname!==null&&new URL(n).host===this._bearerHostname;i&&(t.headers={...t.headers,Authorization:this._bearerToken});let r=await fetch(n,t);return i&&r.status>=400&&r.status<=499&&this.autoRefreshToken?(await this.refreshToken(e),t.headers.Authorization=this._bearerToken,fetch(n,t)):r}refreshToken(n){if(this._tokenRefreshPromise===null){let e=new URL(this.authURL);e.searchParams.set("access_token",this.apiToken),this._tokenRefreshPromise=fetch(e,n).then(t=>{if(!t.ok)throw Error(`CesiumIonAuthPlugin: Failed to load data with error code ${t.status}`);return t.json()}).then(t=>(t.accessToken&&t.url&&(this._bearerToken=`Bearer ${t.accessToken}`,this._bearerHostname=new URL(t.url).host),this._tokenRefreshPromise=null,t))}return this._tokenRefreshPromise}},hf="https://tile.googleapis.com/v1/createSession",ES=class{get isMapTilesSession(){return this.authURL===hf}constructor(n={}){let{apiToken:e,sessionOptions:t=null,autoRefreshToken:i=!1}=n;this.apiToken=e,this.autoRefreshToken=i,this.authURL=hf,this.sessionToken=null,this.sessionOptions=t,this._tokenRefreshPromise=null,this._authHostname=null}async fetch(n,e){this.sessionToken===null&&this.isMapTilesSession&&this.refreshToken(e),await this._tokenRefreshPromise,this._authHostname===null&&(this._authHostname=new URL(this.authURL).host);let t=new URL(n),i=t.host===this._authHostname;i&&(t.searchParams.set("key",this.apiToken),this.sessionToken&&t.searchParams.set("session",this.sessionToken));let r=await fetch(t,e);return i&&r.status>=400&&r.status<=499&&this.autoRefreshToken&&(await this.refreshToken(e),this.sessionToken&&t.searchParams.set("session",this.sessionToken),r=await fetch(t,e)),this.sessionToken===null&&!this.isMapTilesSession?r.json().then(s=>(this.sessionToken=df(s),s)):r}refreshToken(n){if(this._tokenRefreshPromise===null){let e=new URL(this.authURL);e.searchParams.set("key",this.apiToken);let t={...n};this.isMapTilesSession&&(t.method="POST",t.body=JSON.stringify(this.sessionOptions),t.headers=t.headers||{},t.headers={...t.headers,"Content-Type":"application/json"}),this._tokenRefreshPromise=fetch(e,t).then(i=>{if(!i.ok)throw Error(`GoogleCloudAuth: Failed to load data with error code ${i.status}`);return i.json()}).then(i=>(this.sessionToken=df(i),this._tokenRefreshPromise=null,i))}return this._tokenRefreshPromise}};function df(n){if("session"in n)return n.session;{let e=null,t=n.root;return _p(t,i=>{if(i.content&&i.content.uri){let[,r]=i.content.uri.split("?");return e=new URLSearchParams(r).get("session"),!0}return!1}),e}}var bS=class{constructor(){this.creditsCount={}}_adjustAttributions(n,e){let t=this.creditsCount,i=n.split(/;/g);for(let r=0,s=i.length;r<s;r++){let a=i[r];a in t||(t[a]=0),t[a]+=e?1:-1,t[a]<=0&&delete t[a]}}addAttributions(n){this._adjustAttributions(n,!0)}removeAttributions(n){this._adjustAttributions(n,!1)}toString(){return Object.entries(this.creditsCount).sort((n,e)=>{let t=n[1];return e[1]-t}).map(n=>n[0]).join("; ")}},AS="https://tile.googleapis.com/v1/3dtiles/root.json",wS=class{constructor({apiToken:n,sessionOptions:e=null,autoRefreshToken:t=!1,logoUrl:i=null,useRecommendedSettings:r=!0}){this.name="GOOGLE_CLOUD_AUTH_PLUGIN",this.apiToken=n,this.useRecommendedSettings=r,this.logoUrl=i,this.auth=new ES({apiToken:n,autoRefreshToken:t,sessionOptions:e}),this.tiles=null,this._visibilityChangeCallback=null,this._attributionsManager=new bS,this._logoAttribution={value:"",type:"image",collapsible:!1},this._attribution={value:"",type:"string",collapsible:!0}}init(n){let{useRecommendedSettings:e,auth:t}=this;n.resetFailedTiles(),n.rootURL??(n.rootURL=AS),t.sessionOptions||(t.authURL=n.rootURL),e&&!t.isMapTilesSession&&(n.errorTarget=20),this.tiles=n,this._visibilityChangeCallback=({tile:i,visible:r})=>{var a,o;let s=((o=(a=i.engineData.metadata)==null?void 0:a.asset)==null?void 0:o.copyright)||"";r?this._attributionsManager.addAttributions(s):this._attributionsManager.removeAttributions(s)},n.addEventListener("tile-visibility-change",this._visibilityChangeCallback)}getAttributions(n){this.tiles.visibleTiles.size>0&&(this.logoUrl&&(this._logoAttribution.value=this.logoUrl,n.push(this._logoAttribution)),this._attribution.value=this._attributionsManager.toString(),n.push(this._attribution))}dispose(){this.tiles.removeEventListener("tile-visibility-change",this._visibilityChangeCallback)}async fetchData(n,e){return this.auth.fetch(n,e)}},RS=class{get apiToken(){return this.auth.apiToken}set apiToken(n){this.auth.apiToken=n}get autoRefreshToken(){return this.auth.autoRefreshToken}set autoRefreshToken(n){this.auth.autoRefreshToken=n}constructor(n={}){let{apiToken:e,assetId:t=null,autoRefreshToken:i=!1,useRecommendedSettings:r=!0,assetTypeHandler:s=(a,o,l)=>{console.warn(`CesiumIonAuthPlugin: Cesium Ion asset type "${a}" unhandled.`)}}=n;this.name="CESIUM_ION_AUTH_PLUGIN",this.auth=new SS({apiToken:e,autoRefreshToken:i}),this.assetId=t,this.autoRefreshToken=i,this.useRecommendedSettings=r,this.assetTypeHandler=s,this.tiles=null,this._tileSetVersion=-1,this._attributions=[]}init(n){this.assetId!==null&&(n.rootURL=`https://api.cesium.com/v1/assets/${this.assetId}/endpoint`),this.tiles=n,this.auth.authURL=n.rootURL,n.resetFailedTiles()}loadRootTileset(){return this.auth.refreshToken().then(n=>(this._initializeFromAsset(n),this.tiles.invokeOnePlugin(e=>e!==this&&e.loadRootTileset&&e.loadRootTileset()))).catch(n=>{this.tiles.dispatchEvent({type:"load-error",tile:null,error:n,url:this.auth.authURL})})}preprocessURL(n){return n=new URL(n),/^http/.test(n.protocol)&&this._tileSetVersion!=-1&&n.searchParams.set("v",this._tileSetVersion),n.toString()}fetchData(n,e){return this.tiles.getPluginByName("GOOGLE_CLOUD_AUTH_PLUGIN")===null?this.auth.fetch(n,e):null}getAttributions(n){this.tiles.visibleTiles.size>0&&n.push(...this._attributions)}_initializeFromAsset(n){let e=this.tiles;if("externalType"in n){let t=new URL(n.options.url);e.rootURL=n.options.url,e.registerPlugin(new wS({apiToken:t.searchParams.get("key"),autoRefreshToken:this.autoRefreshToken,useRecommendedSettings:this.useRecommendedSettings}))}else{n.type!=="3DTILES"&&this.assetTypeHandler(n.type,e,n),e.rootURL=n.url;let t=new URL(n.url);t.searchParams.has("v")&&this._tileSetVersion===-1&&(this._tileSetVersion=t.searchParams.get("v")),n.attributions&&(this._attributions=n.attributions.map(i=>({value:i.html,type:"html",collapsible:i.collapsible})))}}};function rc(n){return n>>1^-(n&1)}var CS=class extends ua{constructor(...n){super(...n),this.fetchOptions.header={Accept:"application/vnd.quantized-mesh,application/octet-stream;q=0.9"}}loadAsync(...n){let{fetchOptions:e}=this;return e.header=e.header||{},e.header.Accept="application/vnd.quantized-mesh,application/octet-stream;q=0.9",e.header.Accept+=";extensions=octvertexnormals-watermask-metadata",super.loadAsync(...n)}parse(n){let e=0,t=new DataView(n),i=()=>{let G=t.getFloat64(e,!0);return e+=8,G},r=()=>{let G=t.getFloat32(e,!0);return e+=4,G},s=()=>{let G=t.getUint32(e,!0);return e+=4,G},a=()=>{let G=t.getUint8(e);return e+=1,G},o=(G,Q)=>{let ie=new Q(n,e,G);return e+=G*Q.BYTES_PER_ELEMENT,ie},l={center:[i(),i(),i()],minHeight:r(),maxHeight:r(),sphereCenter:[i(),i(),i()],sphereRadius:i(),horizonOcclusionPoint:[i(),i(),i()]},c=s(),u=o(c,Uint16Array),h=o(c,Uint16Array),d=o(c,Uint16Array),f=new Float32Array(c),m=new Float32Array(c),_=new Float32Array(c),g=0,p=0,y=0,x=32767;for(let G=0;G<c;++G)g+=rc(u[G]),p+=rc(h[G]),y+=rc(d[G]),f[G]=g/x,m[G]=p/x,_[G]=y/x;let v=c>65536,w=v?Uint32Array:Uint16Array;e=v?Math.ceil(e/4)*4:Math.ceil(e/2)*2;let b=o(s()*3,w),A=0;for(var R=0;R<b.length;++R){let G=b[R];b[R]=A-G,G===0&&++A}let T=(G,Q)=>m[Q]-m[G],M=(G,Q)=>-T(G,Q),L=(G,Q)=>f[G]-f[Q],z=(G,Q)=>-L(G,Q),I=o(s(),w);I.sort(T);let q=o(s(),w);q.sort(L);let k=o(s(),w);k.sort(M);let O=o(s(),w);O.sort(z);let j={westIndices:I,southIndices:q,eastIndices:k,northIndices:O},B={};for(;e<t.byteLength;){let G=a(),Q=s();if(G===1){let ie=o(c*2,Uint8Array),me=new Float32Array(c*3);for(let xe=0;xe<c;xe++){let H=ie[2*xe+0]/255*2-1,K=ie[2*xe+1]/255*2-1,oe=1-(Math.abs(H)+Math.abs(K));if(oe<0){let Ae=H;H=(1-Math.abs(K))*ff(Ae),K=(1-Math.abs(Ae))*ff(K)}let re=Math.sqrt(H*H+K*K+oe*oe);me[3*xe+0]=H/re,me[3*xe+1]=K/re,me[3*xe+2]=oe/re}B.octvertexnormals={extensionId:G,normals:me}}else if(G===2){let ie=Q===1?1:256;B.watermask={extensionId:G,mask:o(ie*ie,Uint8Array),size:ie}}else if(G===4){let ie=o(s(),Uint8Array),me=new TextDecoder().decode(ie);B.metadata={extensionId:G,json:JSON.parse(me)}}}return{header:l,indices:b,vertexData:{u:f,v:m,height:_},edgeIndices:j,extensions:B}}};function ff(n){return n<0?-1:1}const PS=new ol(-1,1,1,-1,0,1);class LS extends _t{constructor(){super(),this.setAttribute("position",new at([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new at([0,2,0,0,2,0],2))}}const IS=new LS;class xm{constructor(e){this._mesh=new He(IS,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,PS)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}}var sc=new P,to=new P;function DS(n,e,t){let i=1e-5,r=t+i,s=e+i;Math.abs(s)>Math.PI/2&&(s-=i),n.getCartographicToPosition(e,t,0,sc),n.getCartographicToPosition(s,t,0,to);let a=sc.distanceTo(to)/i;return n.getCartographicToPosition(e,r,0,to),[sc.distanceTo(to)/i,a]}var ra=class{get isMercator(){return this.scheme==="EPSG:3857"}get isCartographic(){return this.scheme!=="none"}constructor(n="EPSG:4326"){this.scheme=n,this.tileCountX=1,this.tileCountY=1,this.setScheme(n)}setScheme(n){switch(this.scheme=n,n){case"CRS:84":case"EPSG:4326":this.tileCountX=2,this.tileCountY=1;break;case"EPSG:3857":this.tileCountX=1,this.tileCountY=1;break;case"none":this.tileCountX=1,this.tileCountY=1;break;default:throw Error(`ProjectionScheme: Unknown projection scheme "${n}"`)}}convertNormalizedToLatitude(n){if(this.scheme==="none")return n;if(this.isMercator){let e=ae.mapLinear(n,0,1,-1,1);return 2*Math.atan(Math.exp(e*Math.PI))-Math.PI/2}else return ae.mapLinear(n,0,1,-Math.PI/2,Math.PI/2)}convertNormalizedToLongitude(n){return this.scheme==="none"?n:ae.mapLinear(n,0,1,-Math.PI,Math.PI)}convertLatitudeToNormalized(n){return this.scheme==="none"?n:this.isMercator?1/2+1*Math.log(Math.tan(Math.PI/4+n/2))/(2*Math.PI):ae.mapLinear(n,-Math.PI/2,Math.PI/2,0,1)}convertLongitudeToNormalized(n){return this.scheme==="none"?n:(n+Math.PI)/(2*Math.PI)}getLongitudeDerivativeAtNormalized(n){return this.scheme==="none"?1:2*Math.PI}getLatitudeDerivativeAtNormalized(n){if(this.scheme==="none")return 1;{let e=1e-5,t=n-e;return t<0&&(t=n+e),this.isMercator?Math.abs(this.convertNormalizedToLatitude(n)-this.convertNormalizedToLatitude(t))/e:Math.PI}}getBounds(){return this.scheme==="none"?[0,0,1,1]:[this.convertNormalizedToLongitude(0),this.convertNormalizedToLatitude(0),this.convertNormalizedToLongitude(1),this.convertNormalizedToLatitude(1)]}toNormalizedPoint(n,e){let t=[n,e];return t[0]=this.convertLongitudeToNormalized(t[0]),t[1]=this.convertLatitudeToNormalized(t[1]),t}toNormalizedRange(n){return[...this.toNormalizedPoint(n[0],n[1]),...this.toNormalizedPoint(n[2],n[3])]}toCartographicPoint(n,e){let t=[n,e];return t[0]=this.convertNormalizedToLongitude(t[0]),t[1]=this.convertNormalizedToLatitude(t[1]),t}toCartographicRange(n){return[...this.toCartographicPoint(n[0],n[1]),...this.toCartographicPoint(n[2],n[3])]}clampToBounds(n,e=!1){let t=[...n],i;i=e?[0,0,1,1]:this.getBounds();let[r,s,a,o]=i;return t[0]=ae.clamp(t[0],r,a),t[2]=ae.clamp(t[2],r,a),t[1]=ae.clamp(t[1],s,o),t[3]=ae.clamp(t[3],s,o),t}};function pf(n,e){let[t,i,r,s]=n,[a,o,l,c]=e;return!(t>=l||r<=a||i>=c||s<=o)}var Ku=class{get levelCount(){return this._levels.length}get maxLevel(){return this.levelCount-1}get minLevel(){let n=this._levels;for(let e=0;e<n.length;e++)if(n[e]!==null)return e;return-1}get contentBounds(){return this._contentBounds??this.projection.getBounds()}get aspectRatio(){let{pixelWidth:n,pixelHeight:e}=this.getLevel(this.maxLevel);return n/e}constructor(){this.flipY=!1,this.pixelOverlap=0,this._contentBounds=null,this.projection=new ra("none"),this._levels=[]}setLevel(n,e={}){let t=this._levels;for(;t.length<n;)t.push(null);let{tileSplitX:i=2,tileSplitY:r=2}=e,{tilePixelWidth:s=256,tilePixelHeight:a=256,tileCountX:o=i**n,tileCountY:l=r**n,tileBounds:c=null}=e,{pixelWidth:u=s*o,pixelHeight:h=a*l}=e;t[n]={tilePixelWidth:s,tilePixelHeight:a,pixelWidth:u,pixelHeight:h,tileCountX:o,tileCountY:l,tileSplitX:i,tileSplitY:r,tileBounds:c}}generateLevels(n,e,t,i={}){let{minLevel:r=0,tilePixelWidth:s=256,tilePixelHeight:a=256}=i,o=n-1,{pixelWidth:l=s*e*2**o,pixelHeight:c=a*t*2**o}=i;for(let u=r;u<n;u++){let h=n-u-1,d=Math.ceil(l*2**-h),f=Math.ceil(c*2**-h),m=Math.ceil(d/s),_=Math.ceil(f/a);this.setLevel(u,{tilePixelWidth:s,tilePixelHeight:a,pixelWidth:d,pixelHeight:f,tileCountX:m,tileCountY:_})}}getLevel(n){return this._levels[n]}setContentBounds(n,e,t,i){this._contentBounds=[n,e,t,i]}setProjection(n){this.projection=n}getTileAtPoint(n,e,t,i=!1){let{flipY:r}=this,{tileCountY:s,tileBounds:a,pixelHeight:o,pixelWidth:l,tilePixelHeight:c,tilePixelWidth:u}=this.getLevel(t),h=u/l,d=c/o;if(i||([n,e]=this.toNormalizedPoint(n,e)),a){let _=this.toNormalizedRange(a);n=ae.mapLinear(n,_[0],_[2],0,1),e=ae.mapLinear(e,_[1],_[3],0,1)}let f=Math.floor(n/h),m=Math.floor(e/d);return r&&(m=s-1-m),[f,m]}getTilesInRange(n,e,t,i,r,s=!1){let a=[n,e,t,i],o=this.getContentBounds(s),l=this.getLevel(r).tileBounds;if(!pf(a,o)||l&&(s&&(l=this.toNormalizedRange(l)),!pf(a,o)))return[0,0,-1,-1];let[c,u,h,d]=this.clampToContentBounds(a,s),f=this.getTileAtPoint(c,u,r,s),m=this.getTileAtPoint(h,d,r,s);this.flipY&&([f[1],m[1]]=[m[1],f[1]]);let{tileCountX:_,tileCountY:g}=this.getLevel(r),[p,y]=f,[x,v]=m;return x<0||v<0||p>=_||y>=g?[0,0,-1,-1]:[ae.clamp(p,0,_-1),ae.clamp(y,0,g-1),ae.clamp(x,0,_-1),ae.clamp(v,0,g-1)]}getTileExists(n,e,t){let[i,r,s,a]=this.contentBounds,[o,l,c,u]=this.getTileBounds(n,e,t);return!(o>=c||l>=u)&&o<=s&&l<=a&&c>=i&&u>=r}getContentBounds(n=!1){let{projection:e}=this,t=[...this.contentBounds];return n&&(t[0]=e.convertLongitudeToNormalized(t[0]),t[1]=e.convertLatitudeToNormalized(t[1]),t[2]=e.convertLongitudeToNormalized(t[2]),t[3]=e.convertLatitudeToNormalized(t[3])),t}getTileContentUVBounds(n,e,t){let[i,r,s,a]=this.getTileBounds(n,e,t,!0,!0),[o,l,c,u]=this.getTileBounds(n,e,t,!0,!1);return[ae.mapLinear(i,o,c,0,1),ae.mapLinear(r,l,u,0,1),ae.mapLinear(s,o,c,0,1),ae.mapLinear(a,l,u,0,1)]}getTileBounds(n,e,t,i=!1,r=!0){let{flipY:s,pixelOverlap:a,projection:o}=this,{tilePixelWidth:l,tilePixelHeight:c,pixelWidth:u,pixelHeight:h,tileBounds:d}=this.getLevel(t),f=l*n-a,m=c*e-a,_=f+l+a*2,g=m+c+a*2;if(f=Math.max(f,0),m=Math.max(m,0),_=Math.min(_,u),g=Math.min(g,h),f/=u,_/=u,m/=h,g/=h,s){let y=(g-m)/2,x=1-(m+g)/2;m=x-y,g=x+y}let p=[f,m,_,g];if(d){let y=this.toNormalizedRange(d);p[0]=ae.mapLinear(p[0],0,1,y[0],y[2]),p[2]=ae.mapLinear(p[2],0,1,y[0],y[2]),p[1]=ae.mapLinear(p[1],0,1,y[1],y[3]),p[3]=ae.mapLinear(p[3],0,1,y[1],y[3])}return r&&(p=this.clampToBounds(p,!0)),i||(p[0]=o.convertNormalizedToLongitude(p[0]),p[1]=o.convertNormalizedToLatitude(p[1]),p[2]=o.convertNormalizedToLongitude(p[2]),p[3]=o.convertNormalizedToLatitude(p[3])),p}toNormalizedPoint(n,e){return this.projection.toNormalizedPoint(n,e)}toNormalizedRange(n){return this.projection.toNormalizedRange(n)}toCartographicPoint(n,e){return this.projection.toCartographicPoint(n,e)}toCartographicRange(n){return this.projection.toCartographicRange(n)}clampToContentBounds(n,e=!1){let t=[...n],[i,r,s,a]=this.getContentBounds(e);return t[0]=ae.clamp(t[0],i,s),t[1]=ae.clamp(t[1],r,a),t[2]=ae.clamp(t[2],i,s),t[3]=ae.clamp(t[3],r,a),t}clampToBounds(n,e=!1){return this.projection.clampToBounds(n,e)}},Pr=Symbol("TILE_X"),Lr=Symbol("TILE_Y"),Yi=Symbol("TILE_LEVEL"),US=30,NS=15,mf=20,no=Symbol("OVERLAY_RANGE"),io=Symbol("OVERLAY_LEVEL"),Rs=new P,Cs=new P,ac=new un,FS=class{constructor(n={}){let{overlay:e=null,shape:t="ellipsoid",endCaps:i=!0,center:r=!0,useRecommendedSettings:s=!0,applyOverlayTexture:a=!1}=n;this.priority=-10,this.tiles=null,this.overlay=e,this.shape=t,this.endCaps=i,this.center=r,this.useRecommendedSettings=s,this.applyOverlayTexture=a,this._tiling=null}init(n){this.useRecommendedSettings&&(n.errorTarget=1),this.tiles=n}async loadRootTileset(){let{overlay:n}=this;return n?(await n.init(),this._tiling=n.tiling||this._createDefaultTiling()):this._tiling=this._createDefaultTiling(),this.getTileset()}async parseToMesh(n,e,t,i,r){if(t!=="generated_surface")return null;let s;s=this._useEllipsoid()?this._createEllipsoidMesh(e):this._createPlanarMesh(e);let{overlay:a,applyOverlayTexture:o}=this;if(a&&o){let l=e[Pr],c=e[Lr],u=e[Yi],h=this._tiling.getTileBounds(l,c,u,!0,!1);if(a.hasContent(h,u)){try{await a.lockTexture(h,u)}catch(f){if(f.name!=="AbortError")throw f;return null}let d=a.getTexture(h,u);if(e[no]=h,e[io]=u,r.aborted)return a.releaseTexture(h,u),delete e[no],delete e[io],null;s.material.map=d,s.material.needsUpdate=!0}}return s}preprocessNode(n){let e=this._tiling.maxLevel;n[Yi]<e&&n.parent!==null&&this.expandChildren(n)}disposeTile(n){let e=n[no];this.overlay&&e&&(this.overlay.releaseTexture(e,n[io]),delete n[no],delete n[io])}dispose(){this.tiles.forEachLoadedModel((n,e)=>{this.disposeTile(e)})}getCartographicFromPosition(n,e={}){let{_tiling:t}=this,{projection:i}=t;if(!i.isCartographic)throw Error("GeneratedSurfacePlugin: getCartographicFromPosition requires a cartographic projection.");if(this._useEllipsoid())return this.tiles.ellipsoid.getPositionToCartographic(n,e);let{center:r}=this,s=n.x/t.aspectRatio+(r?.5:0),a=n.y+(r?.5:0);return e.lat=i.convertNormalizedToLatitude(a),e.lon=i.convertNormalizedToLongitude(s),e}getPositionFromCartographic(n,e,t=new P){let{_tiling:i}=this,{projection:r}=i;if(!r.isCartographic)throw Error("GeneratedSurfacePlugin: getPositionFromCartographic requires a cartographic projection.");if(this._useEllipsoid())return this.tiles.ellipsoid.getCartographicToPosition(n,e,0,t);let{center:s}=this,a=r.convertLongitudeToNormalized(e),o=r.convertLatitudeToNormalized(n);return t.x=(a-(s?.5:0))*i.aspectRatio,t.y=o-(s?.5:0),t.z=0,t}_useEllipsoid(){return this._tiling.projection.isCartographic&&this.shape==="ellipsoid"}_createPlanarMesh(n){let e=n[Pr],t=n[Lr],i=n[Yi],r=n.boundingVolume.box,s=1,a=1,o=0,l=0,c=0;r&&([o,l,c]=r,s=r[3],a=r[7]);let u=new es(2*s,2*a),h=new He(u,new ln);h.position.set(o,l,c);let d=this._tiling.getTileContentUVBounds(e,t,i),{uv:f}=u.attributes;for(let m=0;m<f.count;m++)f.setXY(m,ae.mapLinear(f.getX(m),0,1,d[0],d[2]),ae.mapLinear(f.getY(m),0,1,d[1],d[3]));return h}_createEllipsoidMesh(n){let{tiles:e,endCaps:t,_tiling:i}=this,{projection:r}=i,s=n[Yi],a=n[Pr],o=n[Lr],[l,c,u,h]=n.boundingVolume.region,d=Math.max(NS,Math.ceil((h-c)*ae.RAD2DEG*.25)),f=Math.max(US,Math.ceil((u-l)*ae.RAD2DEG*.25)),m=f+3,_=d+3,g=new es(1,1,f+2,d+2),[p,y,x,v]=i.getTileBounds(a,o,s,!0,!0),w=i.getTileContentUVBounds(a,o,s),{position:b,normal:A,uv:R}=g.attributes,T=b.count;n.engineData.boundingVolume.getSphere(ac);for(let L=0;L<T;L++){let z=L%m,I=Math.floor(L/m),q=z===0||z===m-1||I===0||I===_-1,k=Math.max(1,Math.min(m-2,z)),O=Math.max(1,Math.min(_-2,I)),j=(k-1)/f,B=1-(O-1)/d,G=r.convertNormalizedToLongitude(ae.mapLinear(j,0,1,p,x)),Q=r.convertNormalizedToLatitude(ae.mapLinear(B,0,1,y,v));if(r.isMercator&&t&&(v===1&&B===1&&(Q=Math.PI/2),y===0&&B===0&&(Q=-Math.PI/2)),r.isMercator&&B!==0&&B!==1){let xe=r.convertNormalizedToLatitude(1),H=1/d,K=ae.mapLinear(B-H,0,1,c,h),oe=ae.mapLinear(B+H,0,1,c,h);Q>xe&&K<xe&&(Q=xe),Q<-xe&&oe>-xe&&(Q=-xe)}e.ellipsoid.getCartographicToPosition(Q,G,0,Rs).sub(ac.center),e.ellipsoid.getCartographicToNormal(Q,G,Cs),q&&Rs.addScaledVector(Cs,-n.geometricError);let ie=ae.mapLinear(r.convertLongitudeToNormalized(G),p,x,w[0],w[2]),me=ae.mapLinear(r.convertLatitudeToNormalized(Q),y,v,w[1],w[3]);b.setXYZ(L,Rs.x,Rs.y,Rs.z),A.setXYZ(L,Cs.x,Cs.y,Cs.z),R.setXY(L,ie,me)}let M=new He(g,new ln);return M.position.copy(ac.center),M}getTileset(){let{tiles:n,_tiling:e}=this,t=e.minLevel,{tileCountX:i,tileCountY:r}=e.getLevel(t),s=[];for(let o=0;o<i;o++)for(let l=0;l<r;l++){let c=this.createChild(o,l,t);c!==null&&s.push(c)}let a={asset:{version:"1.1"},geometricError:1/0,root:{refine:"REPLACE",geometricError:1/0,boundingVolume:this.createBoundingVolume(0,0,-1),children:s,[Yi]:-1,[Pr]:0,[Lr]:0}};return n.preprocessTileset(a,""),a}getUrl(){return"tile.generated_surface"}fetchData(n){if(/generated_surface/.test(n))return new ArrayBuffer}createBoundingVolume(n,e,t,i=0){let{_tiling:r}=this,s=t===-1;if(this._useEllipsoid()){let{endCaps:a}=this,o,l;return s?(o=r.getContentBounds(!0),l=r.getContentBounds()):(o=r.getTileBounds(n,e,t,!0,!0),l=r.getTileBounds(n,e,t,!1,!0)),a&&(o[3]===1&&(l[3]=Math.PI/2),o[1]===0&&(l[1]=-Math.PI/2)),{region:[...l,-i,1]}}else{let{center:a}=this,o;o=s?r.getContentBounds(!0):r.getTileBounds(n,e,t,!0);let[l,c,u,h]=o,d=(u-l)/2,f=(h-c)/2,m=l+d,_=c+f;return a&&(m-=.5,_-=.5),m*=r.aspectRatio,d*=r.aspectRatio,{box:[m,_,0,d,0,0,0,f,0,0,0,0]}}}createChild(n,e,t){let{_tiling:i}=this,{projection:r}=i;if(!i.getTileExists(n,e,t))return null;let s,a=this._useEllipsoid();if(a){let[o,l,c,u]=i.getTileBounds(n,e,t,!0),{tilePixelWidth:h,tilePixelHeight:d}=i.getLevel(t),f=(c-o)/h,m=(u-l)/d,[,_,g,p]=i.getTileBounds(n,e,t),y=_>0==p>0?Math.min(Math.abs(_),Math.abs(p)):0,x=r.convertLatitudeToNormalized(y),v=r.getLongitudeDerivativeAtNormalized(o),w=r.getLatitudeDerivativeAtNormalized(x),[b,A]=DS(this.tiles.ellipsoid,y,g);s=Math.max(f*v*b,m*w*A)}else{let{pixelWidth:o,pixelHeight:l}=i.getLevel(t);s=Math.max(i.aspectRatio/o,1/l)}return{refine:"REPLACE",geometricError:s,boundingVolume:this.createBoundingVolume(n,e,t,a?s:0),content:{uri:this.getUrl(n,e,t)},children:[],[Pr]:n,[Lr]:e,[Yi]:t}}expandChildren(n){let e=n[Yi],t=n[Pr],i=n[Lr],{tileSplitX:r,tileSplitY:s}=this._tiling.getLevel(e);for(let a=0;a<r;a++)for(let o=0;o<s;o++){let l=this.createChild(r*t+a,s*i+o,e+1);l&&n.children.push(l)}}_createDefaultTiling(){let n=new Ku;if(this.shape==="ellipsoid"){let e=new ra("EPSG:3857");n.setProjection(e),n.generateLevels(mf,e.tileCountX,e.tileCountY)}else{let e=new ra("none");n.setProjection(e),n.generateLevels(mf,1,1)}return n}},gf=class extends DOMException{constructor(){super("DataCache: Item removed","AbortError")}};function Ps(...n){return n.join("_")}var vm=class{constructor(){this.cache={},this.count=0,this.cachedBytes=0,this.active=0}fetchItem(n,e){}disposeItem(n,e){}getMemoryUsage(n){return 0}setData(...n){let{cache:e}=this,t=n.pop(),i=Ps(...n);if(i in e)throw Error(`DataCache: "${i}" is already present.`);return this.cache[i]={abortController:new AbortController,result:t,count:1,bytes:this.getMemoryUsage(t)},this.count++,this.cachedBytes+=this.cache[i].bytes,t}lock(...n){let{cache:e}=this,t=Ps(...n);if(t in e)e[t].count++;else{let i=new AbortController,r={abortController:i,result:null,count:1,bytes:0,args:n};this.active++,r.result=this.fetchItem(n,i.signal),r.result instanceof Promise?r.result=r.result.then(s=>(i.signal.throwIfAborted(),r.result=s,r.bytes=this.getMemoryUsage(s),this.cachedBytes+=r.bytes,s)).finally(()=>{this.active--}):(this.active--,r.bytes=this.getMemoryUsage(r.result),this.cachedBytes+=r.bytes),this.cache[t]=r,this.count++}return e[t].result}release(...n){let e=Ps(...n);this.releaseViaFullKey(e)}get(...n){let{cache:e}=this,t=Ps(...n);return t in e&&e[t].count>0?e[t].result:null}has(...n){let{cache:e}=this;return Ps(...n)in e}forEachItem(n){let{cache:e}=this;for(let t in e){let i=e[t];i.result instanceof Promise||n(i.result,i.args)}}dispose(){let{cache:n}=this;for(let e in n){let{abortController:t}=n[e];t.abort(new gf),this.releaseViaFullKey(e,!0)}this.cache={}}releaseViaFullKey(n,e=!1){let{cache:t}=this;if(n in t&&t[n].count>0){let i=t[n];if(i.count--,i.count===0||e){let r=()=>{if(t[n]!==i)return;let{result:s,abortController:a}=i;a.abort(new gf),s instanceof Promise?s.then(o=>{this.disposeItem(o,i.args)}).catch(()=>{this.disposeItem(null,i.args)}).finally(()=>{this.count--,this.cachedBytes-=i.bytes}):(this.disposeItem(s,i.args),this.count--,this.cachedBytes-=i.bytes),delete t[n]};e?r():queueMicrotask(()=>{i.count===0&&r()})}return!0}throw Error("DataCache: Attempting to release key that does not exist")}},OS=class extends vm{constructor(n={}){super();let{fetchOptions:e={}}=n;this.tiling=new Ku,this.fetchOptions=e,this.fetchData=(...t)=>fetch(...t)}init(){}async processBufferToTexture(n){let e=new Blob([n]),t=new St(await createImageBitmap(e,{premultiplyAlpha:"none",colorSpaceConversion:"none",imageOrientation:"flipY"}));return t.generateMipmaps=!1,t.colorSpace=gt,t.needsUpdate=!0,t}getMemoryUsage(n){let{format:e,type:t,image:i,generateMipmaps:r}=n,{width:s,height:a}=i,o=em.getByteLength(s,a,e,t);return r?o*4/3:o}fetchItem(n,e){let t={...this.fetchOptions,signal:e},i=this.getUrl(...n);return this.fetchData(i,t).then(r=>r.arrayBuffer()).then(r=>this.processBufferToTexture(r))}disposeItem(n){n&&(n.dispose(),n.image instanceof ImageBitmap&&n.image.close())}getUrl(...n){}},BS=class extends OS{constructor(n={}){let{url:e=null,...t}=n;super(t),this.tileSets=null,this.extension=null,this.url=e}getUrl(n,e,t){let{url:i,extension:r,tileSets:s,tiling:a}=this;return new URL(`${parseInt(s[t-a.minLevel].href)}/${n}/${e}.${r}`,i).toString()}init(){let{url:n}=this;return this.fetchData(new URL("tilemapresource.xml",n),this.fetchOptions).then(e=>e.text()).then(e=>{let{tiling:t}=this,i=new DOMParser().parseFromString(e,"text/xml"),r=i.querySelector("BoundingBox"),s=i.querySelector("TileFormat"),a=[...i.querySelector("TileSets").querySelectorAll("TileSet")].map(_=>({href:parseInt(_.getAttribute("href")),unitsPerPixel:parseFloat(_.getAttribute("units-per-pixel")),order:parseInt(_.getAttribute("order"))})).sort((_,g)=>_.order-g.order),o=parseFloat(r.getAttribute("minx"))*ae.DEG2RAD,l=parseFloat(r.getAttribute("maxx"))*ae.DEG2RAD,c=parseFloat(r.getAttribute("miny"))*ae.DEG2RAD,u=parseFloat(r.getAttribute("maxy"))*ae.DEG2RAD,h=parseInt(s.getAttribute("width")),d=parseInt(s.getAttribute("height")),f=s.getAttribute("extension"),m=i.querySelector("SRS").textContent;this.extension=f,this.url=n,this.tileSets=a,t.setProjection(new ra(m)),t.setContentBounds(o,c,l,u),a.forEach(({order:_})=>{t.setLevel(_,{tileCountX:t.projection.tileCountX*2**_,tilePixelWidth:h,tilePixelHeight:d})})})}};function ro(n,e,t,i){let[r,s,a,o]=n;s+=1e-8,r+=1e-8,o-=1e-8,a-=1e-8;let l=Math.max(Math.min(e,t.maxLevel),t.minLevel),[c,u,h,d]=t.getTilesInRange(r,s,a,o,l,!0);for(let f=c;f<=h;f++)for(let m=u;m<=d;m++)i(f,m,l)}var Et=0,Li=["a","b","c"],nt=new qe,_f=new qe,xf=new qe,vf=new qe,kS=class{constructor(){this.attributeList=null,this.splitOperations=[],this.trianglePool=new zS}forEachSplitPermutation(n){let{splitOperations:e}=this,t=(i=0)=>{if(i>=e.length){n();return}e[i].keepPositive=!0,t(i+1),e[i].keepPositive=!1,t(i+1)};t()}addSplitOperation(n,e=!0){this.splitOperations.push({callback:n,keepPositive:e})}clearSplitOperations(){this.splitOperations.length=0}clipObject(n){let e=n.clone(),t=[];return e.traverse(i=>{i.isMesh&&(i.geometry=this.clip(i).geometry,(i.geometry.index?i.geometry.index.count/3:i.attributes.position.count/3)==0&&t.push(i))}),t.forEach(i=>{i.removeFromParent()}),e}clip(n,e=null){let t=this.getClippedData(n,e);return this.constructMesh(t.attributes,t.index,n)}getClippedData(n,e=null,t={}){let{trianglePool:i,splitOperations:r,attributeList:s}=this,a=n.geometry,o=a.attributes.position,l=a.index,c=0,u={};t.index=t.index||[],t.vertexIsClipped=t.vertexIsClipped||[],t.attributes=t.attributes||{};for(let m in a.attributes)s!==null&&(s instanceof Function&&!s(m)||Array.isArray(s)&&!s.includes(m))||(t.attributes[m]=[]);let h=0,d=l?l.count:o.count;e!==null&&(h=e.start,d=e.count);for(let m=h,_=h+d;m<_;m+=3){let g=m+0,p=m+1,y=m+2;l&&(g=l.getX(g),p=l.getX(p),y=l.getX(y));let x=i.get();x.initFromIndices(g,p,y);let v=[x];for(let w=0;w<r.length;w++){let{keepPositive:b,callback:A}=r[w],R=[];for(let T=0;T<v.length;T++){let M=v[T],{indices:L,barycoord:z}=M;M.clipValues.a=A(a,L.a,L.b,L.c,z.a,n.matrixWorld),M.clipValues.b=A(a,L.a,L.b,L.c,z.b,n.matrixWorld),M.clipValues.c=A(a,L.a,L.b,L.c,z.c,n.matrixWorld),this.splitTriangle(M,!b,R)}v=R}for(let w=0,b=v.length;w<b;w++){let A=v[w];f(A,a)}i.reset()}return t;function f(m,_){for(let g=0;g<3;g++){let p=m.getVertexHash(g,_);p in u||(u[p]=c,c++,m.getVertexData(g,_,t.attributes),t.vertexIsClipped.push(m.clipValues[Li[g]]===Et));let y=u[p];t.index.push(y)}}}constructMesh(n,e,t){let i=t.geometry,r=new _t,s=n.position.length/3>65535?new Uint32Array(e):new Uint16Array(e);r.setIndex(new je(s,1,!1));for(let o in n){let l=i.getAttribute(o),c=new je(new l.array.constructor(n[o]),l.itemSize,l.normalized);c.gpuType=l.gpuType,r.setAttribute(o,c)}let a=new He(r,t.material.clone());return a.position.copy(t.position),a.quaternion.copy(t.quaternion),a.scale.copy(t.scale),a}splitTriangle(n,e,t){let{trianglePool:i}=this,r=[],s=[],a=[];for(let o=0;o<3;o++){let l=Li[o],c=Li[(o+1)%3],u=n.clipValues[l],h=n.clipValues[c];(u<Et!=h<Et||u===Et)&&(r.push(o),s.push([l,c]),u===h?a.push(0):a.push(ae.mapLinear(Et,u,h,0,1)))}if(r.length!==2)Math.min(n.clipValues.a,n.clipValues.b,n.clipValues.c)<Et===e&&t.push(n);else if(r.length===2){let o=i.get().initFromTriangle(n),l=i.get().initFromTriangle(n),c=i.get().initFromTriangle(n);(r[0]+1)%3===r[1]?(o.lerpVertexFromEdge(n,s[0][0],s[0][1],a[0],"a"),o.copyVertex(n,s[0][1],"b"),o.lerpVertexFromEdge(n,s[1][0],s[1][1],a[1],"c"),o.clipValues.a=Et,o.clipValues.c=Et,l.lerpVertexFromEdge(n,s[0][0],s[0][1],a[0],"a"),l.copyVertex(n,s[1][1],"b"),l.copyVertex(n,s[0][0],"c"),l.clipValues.a=Et,c.lerpVertexFromEdge(n,s[0][0],s[0][1],a[0],"a"),c.lerpVertexFromEdge(n,s[1][0],s[1][1],a[1],"b"),c.copyVertex(n,s[1][1],"c"),c.clipValues.a=Et,c.clipValues.b=Et):(o.lerpVertexFromEdge(n,s[0][0],s[0][1],a[0],"a"),o.lerpVertexFromEdge(n,s[1][0],s[1][1],a[1],"b"),o.copyVertex(n,s[0][0],"c"),o.clipValues.a=Et,o.clipValues.b=Et,l.lerpVertexFromEdge(n,s[0][0],s[0][1],a[0],"a"),l.copyVertex(n,s[0][1],"b"),l.lerpVertexFromEdge(n,s[1][0],s[1][1],a[1],"c"),l.clipValues.a=Et,l.clipValues.c=Et,c.copyVertex(n,s[0][1],"a"),c.copyVertex(n,s[1][0],"b"),c.lerpVertexFromEdge(n,s[1][0],s[1][1],a[1],"c"),c.clipValues.c=Et);let u,h;u=Math.min(o.clipValues.a,o.clipValues.b,o.clipValues.c),h=u<Et,h===e&&t.push(o),u=Math.min(l.clipValues.a,l.clipValues.b,l.clipValues.c),h=u<Et,h===e&&t.push(l),u=Math.min(c.clipValues.a,c.clipValues.b,c.clipValues.c),h=u<Et,h===e&&t.push(c)}}},zS=class{constructor(){this.pool=[],this.index=0}get(){if(this.index>=this.pool.length){let e=new VS;this.pool.push(e)}let n=this.pool[this.index];return this.index++,n}reset(){this.index=0}},VS=class{constructor(){this.indices={a:-1,b:-1,c:-1},this.clipValues={a:-1,b:-1,c:-1},this.barycoord=new on}getVertexHash(n,e){let{barycoord:t,indices:i}=this,r=t[Li[n]];if(r.x===1)return i[Li[0]];if(r.y===1)return i[Li[1]];if(r.z===1)return i[Li[2]];{let{attributes:s}=e,a="";for(let o in s){let l=s[o];switch(yf(l,i.a,i.b,i.c,r,nt),(o==="normal"||o==="tangent"||o==="bitangent")&&nt.normalize(),l.itemSize){case 4:a+=ks(nt.x,nt.y,nt.z,nt.w);break;case 3:a+=ks(nt.x,nt.y,nt.z);break;case 2:a+=ks(nt.x,nt.y);break;case 1:a+=ks(nt.x);break}a+="|"}return a}}getVertexData(n,e,t){let{barycoord:i,indices:r}=this,s=i[Li[n]],{attributes:a}=e;for(let o in a){if(!t[o])continue;let l=a[o],c=t[o];switch(yf(l,r.a,r.b,r.c,s,nt),(o==="normal"||o==="tangent"||o==="bitangent")&&nt.normalize(),l.itemSize){case 4:c.push(nt.x,nt.y,nt.z,nt.w);break;case 3:c.push(nt.x,nt.y,nt.z);break;case 2:c.push(nt.x,nt.y);break;case 1:c.push(nt.x);break}}}initFromTriangle(n){return this.initFromIndices(n.indices.a,n.indices.b,n.indices.c)}initFromIndices(n,e,t){return this.indices.a=n,this.indices.b=e,this.indices.c=t,this.clipValues.a=-1,this.clipValues.b=-1,this.clipValues.c=-1,this.barycoord.a.set(1,0,0),this.barycoord.b.set(0,1,0),this.barycoord.c.set(0,0,1),this}lerpVertexFromEdge(n,e,t,i,r){this.clipValues[r]=ae.lerp(n.clipValues[e],n.clipValues[t],i),this.barycoord[r].lerpVectors(n.barycoord[e],n.barycoord[t],i)}copyVertex(n,e,t){this.clipValues[t]=n.clipValues[e],this.barycoord[t].copy(n.barycoord[e])}};function yf(n,e,t,i,r,s){switch(_f.fromBufferAttribute(n,e),xf.fromBufferAttribute(n,t),vf.fromBufferAttribute(n,i),s.set(0,0,0,0).addScaledVector(_f,r.x).addScaledVector(xf,r.y).addScaledVector(vf,r.z),n.itemSize){case 3:nt.w=0;break;case 2:nt.w=0,nt.z=0;break;case 1:nt.w=0,nt.z=0,nt.y=0;break}return s}function ks(...n){let e="";for(let t=0,i=n.length;t<i;t++)e+=~~(n[t]*1e5+.5),t!==i-1&&(e+="_");return e}var HS=class{constructor(){this.canvas=null,this.context=null,this.range=[0,0,1,1]}setTarget(n,e){this.canvas=n.image,this.context=n.image.getContext("2d"),this.range=[...e]}draw(n,e){let{canvas:t,range:i,context:r}=this,{width:s,height:a}=t,{image:o}=n,l=Math.round(ae.mapLinear(e[0],i[0],i[2],0,s)),c=Math.round(ae.mapLinear(e[1],i[1],i[3],0,a)),u=Math.round(ae.mapLinear(e[2],i[0],i[2],0,s)),h=Math.round(ae.mapLinear(e[3],i[1],i[3],0,a)),d=u-l,f=h-c;o instanceof ImageBitmap?(r.save(),r.translate(l,a-c),r.scale(1,-1),r.drawImage(o,0,0,d,f),r.restore()):r.drawImage(o,l,a-c,d,-f)}clear(){let{context:n,canvas:e}=this;n.clearRect(0,0,e.width,e.height)}},GS=1e-10;function WS(n,e,t=0){if(n.length!==e.length)return!1;for(let i=0,r=n.length;i<r;i++)if(Math.abs(n[i]-e[i])>t)return!1;return!0}var XS=class extends vm{hasContent(...n){return!0}},qS=class extends XS{constructor(n){super(),this.tiledImageSource=n,this.tileComposer=new HS,this.resolution=256}hasContent(n,e,t,i,r){let s=this.tiledImageSource.tiling,a=0;return ro([n,e,t,i],r,s,()=>{a++}),a!==0}async fetchItem([n,e,t,i,r],s){let{tiledImageSource:a,tileComposer:o}=this,l=[n,e,t,i],c=a.tiling;await this._markImages(l,r,!1),s==null||s.throwIfAborted();let u=null;if(ro(l,r,c,(f,m,_)=>{WS(c.getTileBounds(f,m,_,!0,!1),l,GS)&&(u=[f,m,_])}),u!==null){let[f,m,_]=u;return a.get(f,m,_).clone()}let h=document.createElement("canvas");h.width=this.resolution,h.height=this.resolution;let d=new HM(h);return d.colorSpace=gt,d.generateMipmaps=!1,o.setTarget(d,l),o.clear(16777215,0),ro(l,r,c,(f,m,_)=>{let g=c.getTileBounds(f,m,_,!0,!1),p=a.get(f,m,_);o.draw(p,g)}),d}disposeItem(n,[e,t,i,r,s]){n&&n.dispose(),this._markImages([e,t,i,r],s,!0)}dispose(){super.dispose(),this.tiledImageSource.dispose()}_markImages(n,e,t=!1){let i=this.tiledImageSource,r=i.tiling,s=[];ro(n,e,r,(o,l,c)=>{t?i.release(o,l,c):s.push(i.lock(o,l,c))});let a=s.filter(o=>o instanceof Promise);return a.length===0?null:Promise.all(a)}},Mf=new as;Mf.maxJobs=10,Mf.priorityCallback=(n,e)=>{let t=n.tile,i=e.tile,r=t.internal.renderer,s=i.internal.renderer,a=r.visibleTiles.has(t);return a===s.visibleTiles.has(i)?tl(t,i):a?1:-1};var jS=class{get isPlanarProjection(){return!!this.frame}get downloadQueue(){return this._downloadQueue}set downloadQueue(n){if(n instanceof as){console.warn('ImageOverlay: "downloadQueue" is no longer valid as a PriorityQueue. Use a DownloadPriorityQueue, instead.');return}this._downloadQueue=n}constructor(n={}){let{opacity:e=1,color:t=16777215,frame:i=null,preprocessURL:r=null,alphaMask:s=!1,alphaInvert:a=!1}=n;this.preprocessURL=r,this.opacity=e,this.color=new we(t),this.frame=i===null?null:i.clone(),this.alphaMask=s,this.alphaInvert=a,this.downloadQueue=Ro,this._whenReady=null,this.isReady=!1,this.isInitialized=!1,this._visibleRegionCounts=new Map}init(){return this.isInitialized||(this.isInitialized=!0,this._whenReady=this._init().then(()=>this.isReady=!0)),this._whenReady}whenReady(){return this._whenReady}_init(){return Promise.resolve()}fetch(n,e={}){this.preprocessURL&&(n=this.preprocessURL(n));let t={priority:-performance.now()};return this.downloadQueue.add(n,t,()=>fetch(n,e),e.signal)}getAttributions(n){}hasContent(n,e=null){return!1}async getTexture(n,e=null){return null}async lockTexture(n,e=null){return null}lockTextureSafe(n){let e=this.lockTexture(n);return e instanceof Promise&&e.catch(t=>{if(t.name!=="AbortError")throw t}),e}releaseTexture(n,e=null){}shouldSplit(n,e=null){return!1}setResolution(n){}setRegionVisible(n,e){let{_visibleRegionCounts:t}=this,i=n.join("_"),r=t.get(i);if(r||(r={range:[...n],count:0},t.set(i,r)),r.count+=e?1:-1,r.count<0)throw Error();r.count===0&&t.delete(i)}},YS=class extends jS{get tiling(){return this.imageSource.tiling}get projection(){return this.tiling.projection}get aspectRatio(){return this.tiling&&this.isReady?this.tiling.aspectRatio:1}get fetchOptions(){return this.imageSource.fetchOptions}set fetchOptions(n){this.imageSource.fetchOptions=n}constructor(n={}){let{imageSource:e=null,...t}=n;super(t),this.imageSource=e,this.regionImageSource=null}_init(){return this._initImageSource().then(()=>{this.imageSource.fetchData=(...n)=>this.fetch(...n),this.regionImageSource=new qS(this.imageSource)})}_initImageSource(){return this.imageSource.init()}calculateLevel(n,e=null){let[t,i,r,s]=n,a=r-t,o=s-i;e===null&&(e=this.regionImageSource.resolution);let l=0,c=this.tiling.maxLevel;for(;l<c;l++){let u=e/a,h=e/o,d=this.tiling.getLevel(l);if(d==null)continue;let{pixelWidth:f,pixelHeight:m}=d;if(f>=u||m>=h)break}return l}hasContent(n,e=this.calculateLevel(n)){return this.regionImageSource.hasContent(...n,e)}getTexture(n,e=this.calculateLevel(n)){return this.regionImageSource.get(...n,e)}lockTexture(n,e=this.calculateLevel(n)){return this.regionImageSource.lock(...n,e)}releaseTexture(n,e=this.calculateLevel(n)){this.regionImageSource.release(...n,e)}shouldSplit(n,e=this.calculateLevel(n)){return this.tiling.maxLevel>e}setResolution(n){this.regionImageSource.resolution=n}},$S=class extends YS{constructor(n={}){super(n),this.imageSource=new BS(n)}},Tf=new P,so=new on,mt=new P,Ai=new P,KS=class extends CS{constructor(n=us){super(),this.manager=n,this.ellipsoid=new hl,this.skirtLength=1e3,this.smoothSkirtNormals=!0,this.generateNormals=!0,this.solid=!1,this.minLat=-Math.PI/2,this.maxLat=Math.PI/2,this.minLon=-Math.PI,this.maxLon=Math.PI}parse(n){let{ellipsoid:e,solid:t,skirtLength:i,smoothSkirtNormals:r,generateNormals:s,minLat:a,maxLat:o,minLon:l,maxLon:c}=this,{header:u,indices:h,vertexData:d,edgeIndices:f,extensions:m}=super.parse(n),_=new _t,g=new si,p=new He(_,g);p.position.set(...u.center);let y="octvertexnormals"in m,x=y||s,v=d.u.length,w=[],b=[],A=[],R=[],T=0,M=0;for(let k=0;k<v;k++)z(k,mt),I(mt.x,mt.y,mt.z,Ai),b.push(mt.x,mt.y),w.push(...Ai);for(let k=0,O=h.length;k<O;k++)A.push(h[k]);if(x)if(y){let k=m.octvertexnormals.normals;for(let O=0,j=k.length;O<j;O++)R.push(k[O])}else{let k=new _t,O=h.length>21845?new Uint32Array(h):new Uint16Array(h);k.setIndex(new je(O,1,!1)),k.setAttribute("position",new je(new Float32Array(w),3,!1)),k.computeVertexNormals();let j=k.getAttribute("normal").array;m.octvertexnormals={normals:j};for(let B=0,G=j.length;B<G;B++)R.push(j[B])}if(_.addGroup(T,h.length,M),T+=h.length,M++,t){let k=w.length/3;for(let O=0;O<v;O++)z(O,mt),I(mt.x,mt.y,mt.z,Ai,-i),b.push(mt.x,mt.y),w.push(...Ai);for(let O=h.length-1;O>=0;O--)A.push(h[O]+k);if(x){let O=m.octvertexnormals.normals;for(let j=0,B=O.length;j<B;j++)R.push(-O[j])}_.addGroup(T,h.length,M),T+=h.length,M++}if(i>0){let{westIndices:k,eastIndices:O,southIndices:j,northIndices:B}=f,G,Q=q(k);G=w.length/3,b.push(...Q.uv),w.push(...Q.positions);for(let H=0,K=Q.indices.length;H<K;H++)A.push(Q.indices[H]+G);let ie=q(O);G=w.length/3,b.push(...ie.uv),w.push(...ie.positions);for(let H=0,K=ie.indices.length;H<K;H++)A.push(ie.indices[H]+G);let me=q(j);G=w.length/3,b.push(...me.uv),w.push(...me.positions);for(let H=0,K=me.indices.length;H<K;H++)A.push(me.indices[H]+G);let xe=q(B);G=w.length/3,b.push(...xe.uv),w.push(...xe.positions);for(let H=0,K=xe.indices.length;H<K;H++)A.push(xe.indices[H]+G);x&&(R.push(...Q.normals),R.push(...ie.normals),R.push(...me.normals),R.push(...xe.normals)),_.addGroup(T,h.length,M),T+=h.length,M++}for(let k=0,O=w.length;k<O;k+=3)w[k+0]-=u.center[0],w[k+1]-=u.center[1],w[k+2]-=u.center[2];let L=w.length/3>65535?new Uint32Array(A):new Uint16Array(A);if(_.setIndex(new je(L,1,!1)),_.setAttribute("position",new je(new Float32Array(w),3,!1)),_.setAttribute("uv",new je(new Float32Array(b),2,!1)),x&&_.setAttribute("normal",new je(new Float32Array(R),3,!1)),"watermask"in m){let{mask:k,size:O}=m.watermask,j=new Uint8Array(2*O*O);for(let G=0,Q=k.length;G<Q;G++){let ie=k[G]===255?0:255;j[2*G+0]=ie,j[2*G+1]=ie}let B=new da(j,O,O,rl,In);B.flipY=!0,B.minFilter=Xg,B.magFilter=Yt,B.needsUpdate=!0,g.roughnessMap=B}return p.userData.minHeight=u.minHeight,p.userData.maxHeight=u.maxHeight,"metadata"in m&&(p.userData.metadata=m.metadata.json),p;function z(k,O){return O.x=d.u[k],O.y=d.v[k],O.z=d.height[k],O}function I(k,O,j,B,G=0){let Q=ae.lerp(u.minHeight,u.maxHeight,j),ie=ae.lerp(l,c,k),me=ae.lerp(a,o,O);return e.getCartographicToPosition(me,ie,Q+G,B),B}function q(k){let O=[],j=[],B=[],G=[],Q=[];for(let xe=0,H=k.length;xe<H;xe++)z(k[xe],mt),O.push(mt.x,mt.y),B.push(mt.x,mt.y),I(mt.x,mt.y,mt.z,Ai),j.push(...Ai),I(mt.x,mt.y,mt.z,Ai,-i),G.push(...Ai);let ie=k.length-1;for(let xe=0;xe<ie;xe++){let H=xe,K=xe+1,oe=xe+k.length,re=xe+k.length+1;Q.push(H,oe,K),Q.push(K,oe,re)}let me=null;if(x){let xe=(j.length+G.length)/3;if(r){me=Array(xe*3);let H=m.octvertexnormals.normals,K=me.length/2;for(let oe=0,re=xe/2;oe<re;oe++){let Ae=k[oe],Ce=3*oe,ke=H[3*Ae+0],lt=H[3*Ae+1],We=H[3*Ae+2];me[Ce+0]=ke,me[Ce+1]=lt,me[Ce+2]=We,me[K+Ce+0]=ke,me[K+Ce+1]=lt,me[K+Ce+2]=We}}else{me=[],so.a.fromArray(j,0),so.b.fromArray(G,0),so.c.fromArray(j,3),so.getNormal(Tf);for(let H=0;H<xe;H++)me.push(...Tf)}}return{uv:[...O,...B],positions:[...j,...G],indices:Q,normals:me}}}},Sf={},ZS=new P,oc=new P,lc=new P,JS=new P,QS=new P,Wt=new P,Ir=new P,Ut=new fe,Ci=new fe,Ef=new fe,eE=class extends kS{constructor(){super(),this.ellipsoid=new hl,this.skirtLength=1e3,this.smoothSkirtNormals=!0,this.solid=!1,this.minLat=-Math.PI/2,this.maxLat=Math.PI/2,this.minLon=-Math.PI,this.maxLon=Math.PI,this.attributeList=["position","normal","uv"]}clipToQuadrant(n,e,t){let{solid:i,skirtLength:r,ellipsoid:s,smoothSkirtNormals:a}=this;this.clearSplitOperations(),this.addSplitOperation(bf("x"),!e),this.addSplitOperation(bf("y"),!t);let o,l,c=n.geometry.groups[0],u=this.getClippedData(n,c);if(this.adjustVertices(u,n.position,0),i){o={index:u.index.slice().reverse(),attributes:{}};for(let v in u.attributes)o.attributes[v]=u.attributes[v].slice();let x=o.attributes.normal;if(x)for(let v=0;v<x.length;v+=3)x[v+0]*=-1,x[v+1]*=-1,x[v+2]*=-1;this.adjustVertices(o,n.position,-r)}if(r>0){l={index:[],attributes:{position:[],normal:[],uv:[]}};let x=0,v={},w=(L,z,I)=>{let q=ks(...L,...I,...z);q in v||(v[q]=x,x++,l.attributes.position.push(...L),l.attributes.normal.push(...I),l.attributes.uv.push(...z)),l.index.push(v[q])},b=u.index,A=u.attributes.uv,R=u.attributes.position,T=u.attributes.normal,M=u.index.length/3;for(let L=0;L<M;L++){let z=3*L;for(let I=0;I<3;I++){let q=(I+1)%3,k=b[z+I],O=b[z+q];if(Ut.fromArray(A,k*2),Ci.fromArray(A,O*2),Ut.x===Ci.x&&(Ut.x===0||Ut.x===.5||Ut.x===1)||Ut.y===Ci.y&&(Ut.y===0||Ut.y===.5||Ut.y===1)){oc.fromArray(R,k*3),lc.fromArray(R,O*3);let j=oc,B=lc,G=JS.copy(oc),Q=QS.copy(lc);Wt.copy(G).add(n.position),s.getPositionToNormal(Wt,Wt),G.addScaledVector(Wt,-r),Wt.copy(Q).add(n.position),s.getPositionToNormal(Wt,Wt),Q.addScaledVector(Wt,-r),a&&T?(Wt.fromArray(T,k*3),Ir.fromArray(T,O*3)):(Wt.subVectors(j,B),Ir.subVectors(j,G).cross(Wt).normalize(),Wt.copy(Ir)),w(B,Ci,Ir),w(j,Ut,Wt),w(G,Ut,Wt),w(B,Ci,Ir),w(G,Ut,Wt),w(Q,Ci,Ir)}}}}let h=u.index.length,d=u;if(o){let{index:x,attributes:v}=o,w=d.attributes.position.length/3;for(let b=0,A=x.length;b<A;b++)d.index.push(x[b]+w);for(let b in u.attributes)d.attributes[b].push(...v[b])}if(l){let{index:x,attributes:v}=l,w=d.attributes.position.length/3;for(let b=0,A=x.length;b<A;b++)d.index.push(x[b]+w);for(let b in u.attributes)d.attributes[b].push(...v[b])}let f=e?0:-.5,m=t?0:-.5,_=d.attributes.uv;for(let x=0,v=_.length;x<v;x+=2)_[x]=(_[x]+f)*2,_[x+1]=(_[x+1]+m)*2;let g=this.constructMesh(d.attributes,d.index,n);g.userData.minHeight=n.userData.minHeight,g.userData.maxHeight=n.userData.maxHeight;let p=0,y=0;return g.geometry.addGroup(y,h,p),y+=h,p++,o&&(g.geometry.addGroup(y,o.index.length,p),y+=o.index.length,p++),l&&(g.geometry.addGroup(y,l.index.length,p),y+=l.index.length,p++),g}adjustVertices(n,e,t){let{ellipsoid:i,minLat:r,maxLat:s,minLon:a,maxLon:o}=this,{attributes:l,vertexIsClipped:c}=n,u=l.position,h=l.uv,d=u.length/3;for(let f=0;f<d;f++){let m=Ut.fromArray(h,f*2);c&&c[f]&&(Math.abs(m.x-.5)<1e-10&&(m.x=.5),Math.abs(m.y-.5)<1e-10&&(m.y=.5),Ut.toArray(h,f*2));let _=ae.lerp(r,s,m.y),g=ae.lerp(a,o,m.x),p=ZS.fromArray(u,f*3).add(e);i.getPositionToCartographic(p,Sf),i.getCartographicToPosition(_,g,Sf.height+t,p),p.sub(e),p.toArray(u,f*3)}}};function bf(n){return(e,t,i,r,s)=>{let a=e.attributes.uv;return Ut.fromBufferAttribute(a,t),Ci.fromBufferAttribute(a,i),Ef.fromBufferAttribute(a,r),Ut[n]*s.x+Ci[n]*s.y+Ef[n]*s.z-.5}}var Af=Symbol("TILE_X"),wf=Symbol("TILE_Y"),zs=Symbol("TILE_LEVEL"),$i=Symbol("TILE_AVAILABLE"),cc=Symbol("TILE_SPLIT_SOURCE_SCENE"),Rf=1e4,Cf=new P;function tE(n,e,t,i){if(n&&e<n.length){let r=n[e];for(let s=0,a=r.length;s<a;s++){let{startX:o,startY:l,endX:c,endY:u}=r[s];if(t>=o&&t<=c&&i>=l&&i<=u)return!0}}return!1}function ym(n){let{available:e=null,maxzoom:t=null}=n;return t===null?e.length-1:t}function nE(n){let{metadataAvailability:e=-1}=n;return e}function uc(n,e){let t=n[zs],i=nE(e);return t<ym(e)&&i!==-1&&t%i===0}function iE(n,e,t,i,r){return r.tiles[0].replace(/{\s*z\s*}/g,t).replace(/{\s*x\s*}/g,n).replace(/{\s*y\s*}/g,e).replace(/{\s*version\s*}/g,i)}var rE=class{constructor(n={}){let{useRecommendedSettings:e=!0,skirtLength:t=null,smoothSkirtNormals:i=!0,generateNormals:r=!0,solid:s=!1}=n;this.name="QUANTIZED_MESH_PLUGIN",this.priority=-1e3,this.tiles=null,this.layer=null,this.useRecommendedSettings=e,this.skirtLength=t,this.smoothSkirtNormals=i,this.solid=s,this.generateNormals=r,this.attribution=null,this.tiling=new Ku,this.projection=new ra}init(n){n.fetchOptions.headers=n.fetchOptions.headers||{},n.fetchOptions.headers.Accept="application/vnd.quantized-mesh,application/octet-stream;q=0.9",this.useRecommendedSettings&&(n.errorTarget=2),this.tiles=n}loadRootTileset(){let{tiles:n}=this,e=new URL("layer.json",new URL(n.rootURL,location.href));return n.invokeAllPlugins(t=>e=t.preprocessURL?t.preprocessURL(e,null):e),n.invokeOnePlugin(t=>t.fetchData&&t.fetchData(e,this.tiles.fetchOptions)).then(t=>t.json()).then(t=>{this.layer=t;let{projection:i="EPSG:4326",extensions:r=[],attribution:s="",available:a=null}=t,{tiling:o,tiles:l,projection:c}=this;s&&(this.attribution={value:s,type:"string",collapsible:!0}),r.length>0&&(l.fetchOptions.headers.Accept+=`;extensions=${r.join("-")}`),c.setScheme(i);let{tileCountX:u,tileCountY:h}=c;o.setProjection(c),o.generateLevels(ym(t)+1,u,h);let d=[];for(let _=0;_<u;_++){let g=this.createChild(0,_,0,a);g&&d.push(g)}let f={asset:{version:"1.1"},geometricError:1/0,root:{refine:"REPLACE",geometricError:1/0,boundingVolume:{region:[...this.tiling.getContentBounds(),-1e4,Rf]},children:d,[$i]:a,[zs]:-1}},m=l.rootURL;return l.invokeAllPlugins(_=>m=_.preprocessURL?_.preprocessURL(m,null):m),l.preprocessTileset(f,m),f})}parseToMesh(n,e,t,i){let{skirtLength:r,solid:s,smoothSkirtNormals:a,generateNormals:o,tiles:l}=this,c=l.ellipsoid,u;if(t==="quantized_tile_split"){let m=new URL(i).searchParams,_=m.get("left")==="true",g=m.get("bottom")==="true",p=new eE;p.ellipsoid.copy(c),p.solid=s,p.smoothSkirtNormals=a,p.skirtLength=r===null?e.geometricError:r;let[y,x,v,w]=e.parent.boundingVolume.region;p.minLat=x,p.maxLat=w,p.minLon=y,p.maxLon=v;let b=e.parent.engineData.scene||e.parent[cc];u=p.clipToQuadrant(b,_,g)}else if(t==="terrain"){let m=new KS(l.manager);m.ellipsoid.copy(c),m.solid=s,m.smoothSkirtNormals=a,m.generateNormals=o,m.skirtLength=r===null?e.geometricError:r;let[_,g,p,y]=e.boundingVolume.region;m.minLat=g,m.maxLat=y,m.minLon=_,m.maxLon=p,u=m.parse(n)}else return;let{minHeight:h,maxHeight:d,metadata:f}=u.userData;return e.boundingVolume.region[4]=h,e.boundingVolume.region[5]=d,e.engineData.boundingVolume.setRegionData(c,...e.boundingVolume.region),f&&("geometricerror"in f&&(e.geometricError=f.geometricerror),uc(e,this.layer)&&"available"in f&&e.children.length===0&&(e[$i]=[...Array(e[zs]+1).fill(null),...f.available])),e[cc]=u,this.expandChildren(e),u}getAttributions(n){this.attribution&&n.push(this.attribution)}createChild(n,e,t,i){let{tiles:r,layer:s,tiling:a,projection:o}=this,l=r.ellipsoid,c=i===null&&n===0||tE(i,n,e,t),u=iE(e,t,n,1,s),h=[...a.getTileBounds(e,t,n),-1e4,Rf],[,d,,f,,m]=h,_=d>0==f>0?Math.min(Math.abs(d),Math.abs(f)):0;l.getCartographicToPosition(_,0,m,Cf),Cf.z=0;let g=o.tileCountX,p=Math.max(...l.radius)*2*Math.PI*.25/(65*g)/2**n,y={[$i]:null,[zs]:n,[Af]:e,[wf]:t,refine:"REPLACE",geometricError:p,boundingVolume:{region:h},content:c?{uri:u}:null,children:[]};return uc(y,s)||(y[$i]=i),y}expandChildren(n){let e=n[zs],t=n[Af],i=n[wf],r=n[$i];if(e>=this.tiling.maxLevel)return;let s=!1;for(let a=0;a<2;a++)for(let o=0;o<2;o++){let l=this.createChild(e+1,2*t+a,2*i+o,r);l.content===null?(l.content={uri:`tile.quantized_tile_split?bottom=${o===0}&left=${a===0}`},l.internal={isVirtual:!0},n.internal.virtualChildCount++,n.children.push(l)):(n.children.push(l),s=!0)}s||(n.children.length-=n.internal.virtualChildCount,n.internal.virtualChildCount=0)}fetchData(n,e){if(/quantized_tile_split/.test(n))return new ArrayBuffer}disposeTile(n){let{tiles:e,layer:t}=this;if(delete n[cc],uc(n,t)&&(n[$i]=null),$i in n){let{virtualChildCount:i}=n.internal,r=n.children.length,s=r-i;for(let a=s;a<r;a++)e.processNodeQueue.remove(n.children[a]);n.children.length=0,n.internal.virtualChildCount=0}}},sE=class extends RS{constructor(n={}){super({assetTypeHandler:(e,t,i)=>{if(e==="TERRAIN"&&t.getPluginByName("QUANTIZED_MESH_PLUGIN")===null)t.registerPlugin(new rE({useRecommendedSettings:this.useRecommendedSettings}));else if(e==="IMAGERY"&&t.getPluginByName("GENERATED_SURFACE_PLUGIN")===null){let r=new $S({url:t.rootURL});t.registerPlugin(new FS({shape:"ellipsoid",overlay:r}))}else console.warn(`CesiumIonAuthPlugin: Cesium Ion asset type "${e}" unhandled.`)},...n})}},hc=new ge,aE=class{constructor(){this.name="UPDATE_ON_CHANGE_PLUGIN",this.tiles=null,this.needsUpdate=!1,this.cameraMatrices=new Map}init(n){this.tiles=n,this._needsUpdateCallback=()=>{this.needsUpdate=!0},this._onCameraAdd=({camera:e})=>{this.needsUpdate=!0,this.cameraMatrices.set(e,new ge)},this._onCameraDelete=({camera:e})=>{this.needsUpdate=!0,this.cameraMatrices.delete(e)},n.addEventListener("needs-update",this._needsUpdateCallback),n.addEventListener("add-camera",this._onCameraAdd),n.addEventListener("delete-camera",this._onCameraDelete),n.addEventListener("camera-resolution-change",this._needsUpdateCallback),n.cameras.forEach(e=>{this._onCameraAdd({camera:e})})}doTilesNeedUpdate(){let n=this.tiles,e=!1;this.cameraMatrices.forEach((i,r)=>{hc.copy(n.group.matrixWorld).premultiply(r.matrixWorldInverse).premultiply(r.projectionMatrixInverse),e||(e=!hc.equals(i)),i.copy(hc)});let t=this.needsUpdate;return this.needsUpdate=!1,t||e}preprocessNode(){this.needsUpdate=!0}dispose(){let n=this.tiles;n.removeEventListener("camera-resolution-change",this._needsUpdateCallback),n.removeEventListener("needs-update",this._needsUpdateCallback),n.removeEventListener("add-camera",this._onCameraAdd),n.removeEventListener("delete-camera",this._onCameraDelete)}},Pf=new P;function Ls(n,e){if(n.isInterleavedBufferAttribute||n.array instanceof e)return n;let t=e===Int8Array||e===Int16Array||e===Int32Array?-1:0,i=new je(new e(n.count*n.itemSize),n.itemSize,!0),r=n.itemSize,s=n.count;for(let a=0;a<s;a++)for(let o=0;o<r;o++){let l=ae.clamp(n.getComponent(a,o),t,1);i.setComponent(a,o,l)}return i}function oE(n,e=Int16Array){let t=n.geometry,i=t.attributes,r=i.position;if(r.isInterleavedBufferAttribute||r.array instanceof e)return r;let s=new je(new e(r.count*r.itemSize),r.itemSize,!1),a=r.itemSize,o=r.count;t.computeBoundingBox();let l=t.boundingBox,{min:c,max:u}=l,h=2**(8*e.BYTES_PER_ELEMENT-1)-1,d=-h;for(let f=0;f<o;f++)for(let m=0;m<a;m++){let _=m===0?"x":m===1?"y":"z",g=c[_],p=u[_],y=ae.mapLinear(r.getComponent(f,m),g,p,d,h);s.setComponent(f,m,y)}l.getCenter(Pf).multiply(n.scale).applyQuaternion(n.quaternion),n.position.add(Pf),n.scale.x*=.5*(u.x-c.x)/h,n.scale.y*=.5*(u.y-c.y)/h,n.scale.z*=.5*(u.z-c.z)/h,i.position=s,n.geometry.boundingBox=null,n.geometry.boundingSphere=null,n.updateMatrixWorld()}var lE=class{constructor(n){this._options={generateNormals:!1,disableMipmaps:!0,compressIndex:!0,compressNormals:!1,compressUvs:!1,compressPosition:!1,uvType:Int8Array,normalType:Int8Array,positionType:Int16Array,...n},this.name="TILES_COMPRESSION_PLUGIN",this.priority=-100}processTileModel(n,e){let{generateNormals:t,disableMipmaps:i,compressIndex:r,compressUvs:s,compressNormals:a,compressPosition:o,uvType:l,normalType:c,positionType:u}=this._options;n.traverse(h=>{if(h.material&&i){let d=h.material;for(let f in d){let m=d[f];m&&m.isTexture&&m.generateMipmaps&&(m.generateMipmaps=!1,m.minFilter=Yt)}}if(h.geometry){let d=h.geometry,f=d.attributes;if(s){let{uv:m,uv1:_,uv2:g,uv3:p}=f;m&&(f.uv=Ls(m,l)),_&&(f.uv1=Ls(_,l)),g&&(f.uv2=Ls(g,l)),p&&(f.uv3=Ls(p,l))}if(t&&!f.normals&&d.computeVertexNormals(),a&&f.normals&&(f.normals=Ls(f.normals,c)),o&&oE(h,u),r&&d.index){let m=f.position.count,_=d.index,g=m>65535?Uint32Array:m>255?Uint16Array:Uint8Array;if(!(_.array instanceof g)){let p=new g(d.index.count);p.set(_.array);let y=new je(p,1);d.setIndex(y)}}}})}};function Rt(n,e,t){return n&&e in n?n[e]:t}function Mm(n){return n!=="BOOLEAN"&&n!=="STRING"&&n!=="ENUM"}function cE(n){return/^FLOAT/.test(n)}function pa(n){return/^VEC/.test(n)}function ma(n){return/^MAT/.test(n)}function Tm(n,e,t,i=null){return ma(t)||pa(t)?i.fromArray(n,e):n[e]}function _u(n){let{type:e,componentType:t}=n;switch(e){case"SCALAR":return t==="INT64"?0n:0;case"VEC2":return new fe;case"VEC3":return new P;case"VEC4":return new qe;case"MAT2":return new $u;case"MAT3":return new Ne;case"MAT4":return new ge;case"BOOLEAN":return!1;case"STRING":return"";case"ENUM":return 0}}function Lf(n,e){if(e==null)return!1;switch(n){case"SCALAR":return typeof e=="number"||typeof e=="bigint";case"VEC2":return e.isVector2;case"VEC3":return e.isVector3;case"VEC4":return e.isVector4;case"MAT2":return e.isMatrix2;case"MAT3":return e.isMatrix3;case"MAT4":return e.isMatrix4;case"BOOLEAN":return typeof e=="boolean";case"STRING":return typeof e=="string";case"ENUM":return typeof e=="number"||typeof e=="bigint"}throw Error("ClassProperty: invalid type.")}function sa(n,e=null){switch(n){case"INT8":return Int8Array;case"INT16":return Int16Array;case"INT32":return Int32Array;case"INT64":return BigInt64Array;case"UINT8":return Uint8Array;case"UINT16":return Uint16Array;case"UINT32":return Uint32Array;case"UINT64":return BigUint64Array;case"FLOAT32":return Float32Array;case"FLOAT64":return Float64Array}switch(e){case"BOOLEAN":return Uint8Array;case"STRING":return Uint8Array}throw Error("ClassProperty: invalid type.")}function uE(n,e=null){if(n.array){e=e&&Array.isArray(e)?e:[],e.length=n.count;for(let t=0,i=e.length;t<i;t++)e[t]=Fo(n,e[t])}else e=Fo(n,e);return e}function Fo(n,e=null){let t=n.default,i=n.type;if(e||(e=_u(n)),t===null){switch(i){case"SCALAR":return 0;case"VEC2":return e.set(0,0);case"VEC3":return e.set(0,0,0);case"VEC4":return e.set(0,0,0,0);case"MAT2":return e.identity();case"MAT3":return e.identity();case"MAT4":return e.identity();case"BOOLEAN":return!1;case"STRING":return"";case"ENUM":return""}throw Error("ClassProperty: invalid type.")}else if(ma(i))e.fromArray(t);else if(pa(i))e.fromArray(t);else return t}function hE(n,e){if(n.noData===null)return e;let t=n.noData,i=n.type;if(Array.isArray(e))for(let a=0,o=e.length;a<o;a++)e[a]=r(e[a]);else e=r(e);return e;function r(a){return s(a)&&(a=Fo(n,a)),a}function s(a){if(ma(i)){let o=a.elements;for(let l=0,c=t.length;l<c;l++)if(t[l]!==o[l])return!1;return!0}else if(pa(i)){for(let o=0,l=t.length;o<l;o++)if(t[o]!==a.getComponent(o))return!1;return!0}else return t===a}}function dE(n,e){switch(n){case"INT8":return Math.max(e/127,-1);case"INT16":return Math.max(e,32767,-1);case"INT32":return Math.max(e/2147483647,-1);case"INT64":return Math.max(Number(e)/9223372036854776e3,-1);case"UINT8":return e/255;case"UINT16":return e/65535;case"UINT32":return e/4294967295;case"UINT64":return Number(e)/18446744073709552e3}}function fE(n,e){let{type:t,componentType:i,scale:r,offset:s,normalized:a}=n;if(Array.isArray(e))for(let h=0,d=e.length;h<d;h++)e[h]=o(e[h]);else e=o(e);return e;function o(h){return h=ma(t)?c(h):pa(t)?l(h):u(h),h}function l(h){return h.x=u(h.x),h.y=u(h.y),"z"in h&&(h.z=u(h.z)),"w"in h&&(h.w=u(h.w)),h}function c(h){let d=h.elements;for(let f=0,m=d.length;f<m;f++)d[f]=u(d[f]);return h}function u(h){return a&&(h=dE(i,h)),(a||cE(i))&&(h=h*r+s),h}}function Zu(n,e,t=null){if(n.array){Array.isArray(e)||(e=Array(n.count||0)),e.length=t===null?n.count:t;for(let i=0,r=e.length;i<r;i++)Lf(n.type,e[i])||(e[i]=_u(n))}else Lf(n.type,e)||(e=_u(n));return e}function Oo(n,e){for(let t in e)t in n||delete e[t];for(let t in n){let i=n[t];e[t]=Zu(i,e[t])}}function pE(n){switch(n){case"ENUM":return 1;case"SCALAR":return 1;case"VEC2":return 2;case"VEC3":return 3;case"VEC4":return 4;case"MAT2":return 4;case"MAT3":return 9;case"MAT4":return 16;case"BOOLEAN":return-1;case"STRING":return-1;default:return-1}}var dl=class{constructor(n,e,t=null){this.name=e.name||null,this.description=e.description||null,this.type=e.type,this.componentType=e.componentType||null,this.enumType=e.enumType||null,this.array=e.array||!1,this.count=e.count||0,this.normalized=e.normalized||!1,this.offset=e.offset||0,this.scale=Rt(e,"scale",1),this.max=Rt(e,"max",1/0),this.min=Rt(e,"min",-1/0),this.required=e.required||!1,this.noData=Rt(e,"noData",null),this.default=Rt(e,"default",null),this.semantic=Rt(e,"semantic",null),this.enumSet=null,this.accessorProperty=t,t&&(this.offset=Rt(t,"offset",this.offset),this.scale=Rt(t,"scale",this.scale),this.max=Rt(t,"max",this.max),this.min=Rt(t,"min",this.min)),e.type==="ENUM"&&(this.enumSet=n[this.enumType],this.componentType===null&&(this.componentType=Rt(this.enumSet,"valueType","UINT16")))}shapeToProperty(n,e=null){return Zu(this,n,e)}resolveDefaultElement(n){return Fo(this,n)}resolveDefault(n){return uE(this,n)}resolveNoData(n){return hE(this,n)}resolveEnumsToStrings(n){let e=this.enumSet;if(this.type==="ENUM")if(Array.isArray(n))for(let i=0,r=n.length;i<r;i++)n[i]=t(n[i]);else n=t(n);return n;function t(i){let r=e.values.find(s=>s.value===i);return r===null?"":r.name}}adjustValueScaleOffset(n){return Mm(this.type)?fE(this,n):n}},Ju=class{constructor(n,e={},t={},i=null){this.definition=n,this.class=e[n.class],this.className=n.class,this.enums=t,this.data=i,this.name="name"in n?n.name:null,this.properties=null}getPropertyNames(){return Object.keys(this.class.properties)}includesData(n){return!!this.definition.properties[n]}dispose(){}_initProperties(n=dl){let e={};for(let t in this.class.properties)e[t]=new n(this.enums,this.class.properties[t],this.definition.properties[t]);this.properties=e}},mE=class extends dl{constructor(n,e,t=null){super(n,e,t),this.attribute=(t==null?void 0:t.attribute)??null}},gE=class extends Ju{constructor(...n){super(...n),this.isPropertyAttributeAccessor=!0,this._initProperties(mE)}getData(n,e,t={}){let i=this.properties;Oo(i,t);for(let r in i)t[r]=this.getPropertyValue(r,n,e,t[r]);return t}getPropertyValue(n,e,t,i=null){if(e>=this.count)throw Error("PropertyAttributeAccessor: Requested index is outside the range of the buffer.");let r=this.properties[n],s=r.type;if(!r)throw Error("PropertyAttributeAccessor: Requested class property does not exist.");if(!this.definition.properties[n])return r.resolveDefault(i);i=r.shapeToProperty(i);let a=t.getAttribute(r.attribute.toLowerCase());if(ma(s)){let o=i.elements;for(let l=o.length;0<l;)o[0]=a.getComponent(e,0)}else if(pa(s))i.fromBufferAttribute(a,e);else if(s==="SCALAR"||s==="ENUM")i=a.getX(e);else throw Error("StructuredMetadata.PropertyAttributeAccessor: BOOLEAN and STRING types are not supported by property attributes.");return i=r.adjustValueScaleOffset(i),i=r.resolveEnumsToStrings(i),i=r.resolveNoData(i),i}},_E=class extends dl{constructor(n,e,t=null){super(n,e,t),this.values=(t==null?void 0:t.values)??null,this.valueLength=pE(this.type),this.arrayOffsets=Rt(t,"arrayOffsets",null),this.stringOffsets=Rt(t,"stringOffsets",null),this.arrayOffsetType=Rt(t,"arrayOffsetType","UINT32"),this.stringOffsetType=Rt(t,"stringOffsetType","UINT32")}getArrayLengthFromId(n,e){let t=this.count;if(this.arrayOffsets!==null){let{arrayOffsets:i,arrayOffsetType:r}=this,s=new(sa(r))(n[i]);t=s[e+1]-s[e]}return t}getIndexOffsetFromId(n,e){let t=e;if(this.arrayOffsets){let{arrayOffsets:i,arrayOffsetType:r}=this;t=new(sa(r))(n[i])[t]}else this.array&&(t*=this.count);return t}},xE=class extends Ju{constructor(...n){super(...n),this.isPropertyTableAccessor=!0,this.count=this.definition.count,this._initProperties(_E)}getData(n,e={}){let t=this.properties;Oo(t,e);for(let i in t)e[i]=this.getPropertyValue(i,n,e[i]);return e}_readValueAtIndex(n,e,t,i=null){let r=this.properties[n],{componentType:s,type:a}=r,o=this.data,l=o[r.values],c=new(sa(s,a))(l),u=r.getIndexOffsetFromId(o,e);if(Mm(a)||a==="ENUM")return Tm(c,(u+t)*r.valueLength,a,i);if(a==="STRING"){let h=u+t,d=0;if(r.stringOffsets!==null){let{stringOffsets:m,stringOffsetType:_}=r,g=new(sa(_))(o[m]);d=g[h+1]-g[h],h=g[h]}let f=new Uint8Array(c.buffer,h,d);i=new TextDecoder().decode(f)}else if(a==="BOOLEAN"){let h=u+t,d=Math.floor(h/8),f=h%8;i=(c[d]>>f&1)==1}return i}getPropertyValue(n,e,t=null){if(e>=this.count)throw Error("PropertyTableAccessor: Requested index is outside the range of the table.");let i=this.properties[n];if(!i)throw Error("PropertyTableAccessor: Requested property does not exist.");if(!this.definition.properties[n])return i.resolveDefault(t);let r=i.array,s=this.data,a=i.getArrayLengthFromId(s,e);if(t=i.shapeToProperty(t,a),r)for(let o=0,l=t.length;o<l;o++)t[o]=this._readValueAtIndex(n,e,o,t[o]);else t=this._readValueAtIndex(n,e,0,t);return t=i.adjustValueScaleOffset(t),t=i.resolveEnumsToStrings(t),t=i.resolveNoData(t),t}},Is=new _T,If=class{constructor(){this._renderer=new Ou,this._target=new fi(1,1),this._texTarget=new fi,this._quad=new xm(new Vn({blending:Tp,blendDst:Sp,blendSrc:Ep,uniforms:{map:{value:null},pixel:{value:new fe}},vertexShader:`
				void main() {

					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}
			`,fragmentShader:`
				uniform sampler2D map;
				uniform ivec2 pixel;

				void main() {

					gl_FragColor = texelFetch( map, pixel, 0 );

				}
			`}))}increaseSizeTo(n){this._target.setSize(Math.max(this._target.width,n),1)}readDataAsync(n){let{_renderer:e,_target:t}=this;return e.readRenderTargetPixelsAsync(t,0,0,n.length/4,1,n)}readData(n){let{_renderer:e,_target:t}=this;e.readRenderTargetPixels(t,0,0,n.length/4,1,n)}renderPixelToTarget(n,e,t){let{_renderer:i,_target:r}=this;Is.min.copy(e),Is.max.copy(e),Is.max.x+=1,Is.max.y+=1,i.initRenderTarget(r),i.copyTextureToTexture(n,r.texture,Is,t,0)}},Ni=new class{constructor(){let n=null;Object.getOwnPropertyNames(If.prototype).forEach(e=>{e!=="constructor"&&(this[e]=(...t)=>(n||(n=new If),n[e](...t)))})}},Df=new fe,Uf=new fe,Nf=new fe;function vE(n,e){return e===0?n.getAttribute("uv"):n.getAttribute(`uv${e}`)}function Sm(n,e,t=[,,,]){let i=3*e,r=3*e+1,s=3*e+2;return n.index&&(i=n.index.getX(i),r=n.index.getX(r),s=n.index.getX(s)),t[0]=i,t[1]=r,t[2]=s,t}function Em(n,e,t,i,r){let[s,a,o]=i,l=vE(n,e);Df.fromBufferAttribute(l,s),Uf.fromBufferAttribute(l,a),Nf.fromBufferAttribute(l,o),r.set(0,0,0).addScaledVector(Df,t.x).addScaledVector(Uf,t.y).addScaledVector(Nf,t.z)}function bm(n,e,t,i){let r=n.x-Math.floor(n.x),s=n.y-Math.floor(n.y),a=Math.floor(r*e%e),o=Math.floor(s*t%t);return i.set(a,o),i}var Ff=new fe,Of=new fe,Bf=new fe,yE=class extends dl{constructor(n,e,t=null){super(n,e,t),this.channels=Rt(t,"channels",[0]),this.index=Rt(t,"index",null),this.texCoord=Rt(t,"texCoord",null),this.valueLength=parseInt(this.type.replace(/[^0-9]/g,""))||1}readDataFromBuffer(n,e,t=null){let i=this.type;if(i==="BOOLEAN"||i==="STRING")throw Error("PropertyTextureAccessor: BOOLEAN and STRING types not supported.");return Tm(n,e*this.valueLength,i,t)}},ME=class extends Ju{constructor(...n){super(...n),this.isPropertyTextureAccessor=!0,this._asyncRead=!1,this._initProperties(yE)}getData(n,e,t,i={}){let r=this.properties;Oo(r,i);let s=Object.keys(r),a=s.map(o=>i[o]);return this.getPropertyValuesAtTexel(s,n,e,t,a),s.forEach((o,l)=>i[o]=a[l]),i}async getDataAsync(n,e,t,i={}){let r=this.properties;Oo(r,i);let s=Object.keys(r),a=s.map(o=>i[o]);return await this.getPropertyValuesAtTexelAsync(s,n,e,t,a),s.forEach((o,l)=>i[o]=a[l]),i}getPropertyValuesAtTexelAsync(...n){this._asyncRead=!0;let e=this.getPropertyValuesAtTexel(...n);return this._asyncRead=!1,e}getPropertyValuesAtTexel(n,e,t,i,r=[]){for(;r.length<n.length;)r.push(null);r.length=n.length,Ni.increaseSizeTo(r.length);let s=this.data,a=this.definition.properties,o=this.properties,l=Sm(i,e);for(let h=0,d=n.length;h<d;h++){let f=n[h];if(!a[f])continue;let m=o[f],_=s[m.index];Em(i,m.texCoord,t,l,Ff),bm(Ff,_.image.width,_.image.height,Of),Bf.set(h,0),Ni.renderPixelToTarget(_,Of,Bf)}let c=new Uint8Array(n.length*4);if(this._asyncRead)return Ni.readDataAsync(c).then(()=>(u.call(this),r));return Ni.readData(c),u.call(this),r;function u(){for(let h=0,d=n.length;h<d;h++){let f=n[h],m=o[f],_=m.type;if(r[h]=Zu(m,r[h]),!m)throw Error("PropertyTextureAccessor: Requested property does not exist.");if(!a[f]){r[h]=m.resolveDefault(r);continue}let g=m.valueLength*(m.count||1),p=m.channels.map(v=>c[4*h+v]),y=m.componentType,x=new(sa(y,_))(g);if(new Uint8Array(x.buffer).set(p),m.array){let v=r[h];for(let w=0,b=v.length;w<b;w++)v[w]=m.readDataFromBuffer(x,w,v[w])}else r[h]=m.readDataFromBuffer(x,0,r[h]);r[h]=m.adjustValueScaleOffset(r[h]),r[h]=m.resolveEnumsToStrings(r[h]),r[h]=m.resolveNoData(r[h])}}}dispose(){this.data.forEach(n=>{n&&(n.dispose(),n.image instanceof ImageBitmap&&n.image.close())})}},kf=class{constructor(n,e,t,i=null,r=null){let{schema:s,propertyTables:a=[],propertyTextures:o=[],propertyAttributes:l=[]}=n,{enums:c,classes:u}=s,h=a.map(m=>new xE(m,u,c,t)),d=[],f=[];i&&(i.propertyTextures&&(d=i.propertyTextures.map(m=>new ME(o[m],u,c,e))),i.propertyAttributes&&(f=i.propertyAttributes.map(m=>new gE(l[m],u,c)))),this.schema=s,this.tableAccessors=h,this.textureAccessors=d,this.attributeAccessors=f,this.object=r,this.textures=e,this.nodeMetadata=i}getPropertyTableData(n,e,t=null){if(!Array.isArray(n))t||(t={}),t=this.tableAccessors[n].getData(e,t);else{t||(t=[]);let i=Math.min(n.length,e.length);t.length=i;for(let r=0;r<i;r++){let s=this.tableAccessors[n[r]];t[r]=s.getData(e[r],t[r])}}if(Array.isArray(n)!==Array.isArray(t)||Array.isArray(n)!==Array.isArray(e))throw Error("StructuralMetadata: Scalar and array inputs cannot be mixed.");return t}getPropertyTableInfo(n=null){if(n===null&&(n=this.tableAccessors.map((e,t)=>t)),Array.isArray(n))return n.map(e=>{let t=this.tableAccessors[e];return{name:t.name,className:t.definition.class}});{let e=this.tableAccessors[n];return{name:e.name,className:e.definition.class}}}getPropertyTextureData(n,e,t=[]){let i=this.textureAccessors;t.length=i.length;for(let r=0;r<i.length;r++)t[r]=i[r].getData(n,e,this.object.geometry,t[r]);return t}async getPropertyTextureDataAsync(n,e,t=[]){let i=this.textureAccessors;t.length=i.length;let r=[];for(let s=0;s<i.length;s++){let a=i[s].getDataAsync(n,e,this.object.geometry,t[s]).then(o=>{t[s]=o});r.push(a)}return await Promise.all(r),t}getPropertyTextureInfo(){return this.textureAccessors}getPropertyAttributeData(n,e=[]){let t=this.attributeAccessors;e.length=t.length;for(let i=0;i<t.length;i++)e[i]=t[i].getData(n,this.object.geometry,e[i]);return e}getPropertyAttributeInfo(){return this.attributeAccessors.map(n=>({name:n.name,className:n.definition.class}))}dispose(){this.textureAccessors.forEach(n=>n.dispose()),this.tableAccessors.forEach(n=>n.dispose()),this.attributeAccessors.forEach(n=>n.dispose())}},Ds="EXT_structural_metadata";function TE(n,e=[]){var r;let t=((r=n.json.textures)==null?void 0:r.length)||0,i=Array(t).fill(null);return e.forEach(({properties:s})=>{for(let a in s){let{index:o}=s[a];i[o]===null&&(i[o]=n.loadTexture(o))}}),Promise.all(i)}function SE(n,e=[]){var r;let t=((r=n.json.bufferViews)==null?void 0:r.length)||0,i=Array(t).fill(null);return e.forEach(({properties:s})=>{for(let a in s){let{values:o,arrayOffsets:l,stringOffsets:c}=s[a];i[o]===null&&(i[o]=n.getDependency("bufferView",o)),i[l]===null&&(i[l]=n.getDependency("bufferView",l)),i[c]===null&&(i[c]=n.getDependency("bufferView",c))}}),Promise.all(i)}var EE=class{constructor(n){this.parser=n,this.name=Ds}async afterRoot({scene:n,parser:e}){let t=e.json.extensionsUsed;if(!t||!t.includes(Ds))return;let i=null,r=e.json.extensions[Ds];if(r.schemaUri){let{manager:l,path:c,requestHeader:u,crossOrigin:h}=e.options,d=new URL(r.schemaUri,c).toString(),f=new ia(l);f.setCrossOrigin(h),f.setResponseType("json"),f.setRequestHeader(u),i=f.loadAsync(d).then(m=>{r={...r,schema:m}})}let[s,a]=await Promise.all([TE(e,r.propertyTextures),SE(e,r.propertyTables),i]),o=new kf(r,s,a);n.userData.structuralMetadata=o,n.traverse(l=>{var c;if(e.associations.has(l)){let{meshes:u,primitives:h}=e.associations.get(l),d=(c=e.json.meshes[u])==null?void 0:c.primitives[h];if(d&&d.extensions&&d.extensions[Ds]){let f=d.extensions[Ds];l.userData.structuralMetadata=new kf(r,s,a,f,l)}else l.userData.structuralMetadata=o}})}},zf=new fe,Vf=new fe,Hf=new fe;function bE(n){return n.x>n.y&&n.x>n.z?0:n.y>n.z?1:2}var AE=class{constructor(n,e,t){this.geometry=n,this.textures=e,this.data=t,this._asyncRead=!1,this.featureIds=t.featureIds.map(i=>{let{texture:r,...s}=i,a={label:null,propertyTable:null,nullFeatureId:null,...s};return r&&(a.texture={texCoord:0,channels:[0],...r}),a})}getTextures(){return this.textures}getFeatureInfo(){return this.featureIds}getFeaturesAsync(...n){this._asyncRead=!0;let e=this.getFeatures(...n);return this._asyncRead=!1,e}getFeatures(n,e){let{geometry:t,textures:i,featureIds:r}=this,s=Array(r.length).fill(null),a=r.length;Ni.increaseSizeTo(a);let o=Sm(t,n),l=o[bE(e)];for(let h=0,d=r.length;h<d;h++){let f=r[h],m="nullFeatureId"in f?f.nullFeatureId:null;if("texture"in f){let _=i[f.texture.index];Em(t,f.texture.texCoord,e,o,zf),bm(zf,_.image.width,_.image.height,Vf),Hf.set(h,0),Ni.renderPixelToTarget(i[f.texture.index],Vf,Hf)}else if("attribute"in f){let _=t.getAttribute(`_feature_id_${f.attribute}`).getX(l);_!==m&&(s[h]=_)}else{let _=l;_!==m&&(s[h]=_)}}let c=new Uint8Array(a*4);if(this._asyncRead)return Ni.readDataAsync(c).then(()=>(u(),s));return Ni.readData(c),u(),s;function u(){let h=new Uint32Array(1);for(let d=0,f=r.length;d<f;d++){let m=r[d],_="nullFeatureId"in m?m.nullFeatureId:null;if("texture"in m){let{channels:g}=m.texture,p=g.map(x=>c[4*d+x]);new Uint8Array(h.buffer).set(p);let y=h[0];y!==_&&(s[d]=y)}}}}dispose(){this.textures.forEach(n=>{n&&(n.dispose(),n.image instanceof ImageBitmap&&n.image.close())})}},Bo="EXT_mesh_features";function Gf(n,e,t){n.traverse(i=>{var r;if(e.associations.has(i)){let{meshes:s,primitives:a}=e.associations.get(i),o=(r=e.json.meshes[s])==null?void 0:r.primitives[a];o&&o.extensions&&o.extensions[Bo]&&t(i,o.extensions[Bo])}})}var wE=class{constructor(n){this.parser=n,this.name=Bo}async afterRoot({scene:n,parser:e}){var a;let t=e.json.extensionsUsed;if(!t||!t.includes(Bo))return;let i=((a=e.json.textures)==null?void 0:a.length)||0,r=Array(i).fill(null);Gf(n,e,(o,{featureIds:l})=>{l.forEach(c=>{if(c.texture&&r[c.texture.index]===null){let u=c.texture.index;r[u]=e.loadTexture(u)}})});let s=await Promise.all(r);Gf(n,e,(o,l)=>{o.userData.meshFeatures=new AE(o.geometry,s,l)})}},RE=class{constructor(){this.name="CESIUM_RTC"}afterRoot(n){if(n.parser.json.extensions&&n.parser.json.extensions.CESIUM_RTC){let{center:e}=n.parser.json.extensions.CESIUM_RTC;e&&(n.scene.position.x+=e[0],n.scene.position.y+=e[1],n.scene.position.z+=e[2])}}},CE=class{constructor(n){n={metadata:!0,rtc:!0,plugins:[],dracoLoader:null,ktxLoader:null,meshoptDecoder:null,autoDispose:!0,...n},this.tiles=null,this.metadata=n.metadata,this.rtc=n.rtc,this.plugins=n.plugins,this.dracoLoader=n.dracoLoader,this.ktxLoader=n.ktxLoader,this.meshoptDecoder=n.meshoptDecoder,this._gltfRegex=/\.(gltf|glb)$/g,this._dracoRegex=/\.drc$/g,this._loader=null}init(n){let e=new hs(n.manager);this.dracoLoader&&(e.setDRACOLoader(this.dracoLoader),n.manager.addHandler(this._dracoRegex,this.dracoLoader)),this.ktxLoader&&e.setKTX2Loader(this.ktxLoader),this.meshoptDecoder&&e.setMeshoptDecoder(this.meshoptDecoder),this.rtc&&e.register(()=>new RE),this.metadata&&(e.register(()=>new EE),e.register(()=>new wE)),this.plugins.forEach(t=>e.register(t)),n.manager.addHandler(this._gltfRegex,e),this.tiles=n,this._loader=e}dispose(){this.tiles.manager.removeHandler(this._gltfRegex),this.tiles.manager.removeHandler(this._dracoRegex),this.autoDispose&&(this.ktxLoader.dispose(),this.dracoLoader.dispose())}},PE=class{set delay(n){this.deferCallbacks.delay=n}get delay(){return this.deferCallbacks.delay}set bytesTarget(n){this.lruCache.minBytesSize=n}get bytesTarget(){return this.lruCache.minBytesSize}get estimatedGpuBytes(){return this.lruCache.cachedBytes}constructor(n={}){let{delay:e=0,bytesTarget:t=0}=n;this.name="UNLOAD_TILES_PLUGIN",this.tiles=null,this.lruCache=new up,this.deferCallbacks=new LE,this.delay=e,this.bytesTarget=t}init(n){this.tiles=n;let{lruCache:e,deferCallbacks:t}=this,i=r=>{let s=r.engineData.scene;n.visibleTiles.has(r)||n.invokeOnePlugin(a=>a.unloadTileFromGPU&&a.unloadTileFromGPU(s,r))};this._onUpdateBefore=()=>{e.unloadPriorityCallback=n.lruCache.unloadPriorityCallback,e.minSize=1/0,e.maxSize=1/0,e.maxBytesSize=1/0,e.unloadPercent=1,e.autoMarkUnused=!1},this._onVisibilityChangeCallback=({tile:r,scene:s,visible:a})=>{a?(e.add(r,i),e.setMemoryUsage(r,n.calculateBytesUsed(r,s)||1),n.markTileUsed(r),t.cancel(r)):t.run(r)},this._onDisposeModel=({tile:r})=>{e.remove(r),t.cancel(r)},t.callback=r=>{e.markUnused(r),e.scheduleUnload()},n.forEachLoadedModel((r,s)=>{let a=n.visibleTiles.has(s);this._onVisibilityChangeCallback({tile:s,visible:a})}),n.addEventListener("tile-visibility-change",this._onVisibilityChangeCallback),n.addEventListener("update-before",this._onUpdateBefore),n.addEventListener("dispose-model",this._onDisposeModel)}unloadTileFromGPU(n,e){n&&n.traverse(t=>{if(t.material){let i=t.material;i.dispose();for(let r in i){let s=i[r];s&&s.isTexture&&s.dispose()}}t.geometry&&t.geometry.dispose()})}dispose(){let{lruCache:n,tiles:e,deferCallbacks:t}=this;e.removeEventListener("tile-visibility-change",this._onVisibilityChangeCallback),e.removeEventListener("update-before",this._onUpdateBefore),e.removeEventListener("dispose-model",this._onDisposeModel),t.cancelAll(),n.minBytesSize=0,n.minSize=0,n.maxSize=0,n.markAllUnused(),n.scheduleUnload()}},LE=class{constructor(n=()=>{}){this.map=new Map,this.callback=n,this.delay=0}run(n){let{map:e,delay:t}=this;if(e.has(n))throw Error("DeferCallbackManager: Callback already initialized.");t===0?this.callback(n):e.set(n,setTimeout(()=>{this.callback(n),e.delete(n)},t))}cancel(n){let{map:e}=this;e.has(n)&&(clearTimeout(e.get(n)),e.delete(n))}cancelAll(){this.map.forEach((n,e)=>{this.cancel(e)})}},{clamp:dc}=ae,IE=class{constructor(){this.duration=250,this.fadeCount=0,this._lastTick=-1,this._fadeState=new Map,this.onFadeComplete=null,this.onFadeStart=null,this.onFadeSetComplete=null,this.onFadeSetStart=null}deleteObject(n){n&&this.completeFade(n)}guaranteeState(n){let e=this._fadeState;return e.has(n)?!1:(e.set(n,{fadeInTarget:0,fadeOutTarget:0,fadeIn:0,fadeOut:0}),!0)}completeFade(n){let e=this._fadeState;if(!e.has(n))return;let t=e.get(n).fadeOutTarget===0;e.delete(n),this.fadeCount--,this.onFadeComplete&&this.onFadeComplete(n,t),this.fadeCount===0&&this.onFadeSetComplete&&this.onFadeSetComplete()}completeAllFades(){this._fadeState.forEach((n,e)=>{this.completeFade(e)})}forEachObject(n){this._fadeState.forEach((e,t)=>{n(t,e)})}fadeIn(n){let e=this.guaranteeState(n),t=this._fadeState.get(n);t.fadeInTarget=1,t.fadeOutTarget=0,t.fadeOut=0,e&&(this.fadeCount++,this.fadeCount===1&&this.onFadeSetStart&&this.onFadeSetStart(),this.onFadeStart&&this.onFadeStart(n))}fadeOut(n){let e=this.guaranteeState(n),t=this._fadeState.get(n);t.fadeOutTarget=1,e&&(t.fadeInTarget=1,t.fadeIn=1,this.fadeCount++,this.fadeCount===1&&this.onFadeSetStart&&this.onFadeSetStart(),this.onFadeStart&&this.onFadeStart(n))}isFading(n){return this._fadeState.has(n)}isFadingOut(n){let e=this._fadeState.get(n);return e&&e.fadeOutTarget===1}update(){let n=window.performance.now();this._lastTick===-1&&(this._lastTick=n);let e=dc((n-this._lastTick)/this.duration,0,1);this._lastTick=n,this._fadeState.forEach((t,i)=>{let{fadeOutTarget:r,fadeInTarget:s}=t,{fadeOut:a,fadeIn:o}=t,l=Math.sign(s-o);o=dc(o+l*e,0,1);let c=Math.sign(r-a);a=dc(a+c*e,0,1),t.fadeIn=o,t.fadeOut=a,((a===1||a===0)&&(o===1||o===0)||a>=o)&&this.completeFade(i)})}},fc=Symbol("FADE_PARAMS");function Am(n,e){if(n[fc])return n[fc];let t={fadeIn:{value:0},fadeOut:{value:0},fadeTexture:{value:null}};return n[fc]=t,n.defines={...n.defines||{},FEATURE_FADE:0},n.onBeforeCompile=i=>{e&&e(i),i.uniforms={...i.uniforms,...t},i.vertexShader=i.vertexShader.replace(/void\s+main\(\)\s+{/,r=>`
					#ifdef USE_BATCHING_FRAG

					varying float vBatchId;

					#endif

					${r}

						#ifdef USE_BATCHING_FRAG

						// add 0.5 to the value to avoid floating error that may cause flickering
						vBatchId = getIndirectIndex( gl_DrawID ) + 0.5;

						#endif
				`),i.fragmentShader=i.fragmentShader.replace(/void main\(/,r=>`
				#if FEATURE_FADE

				// adapted from https://www.shadertoy.com/view/Mlt3z8
				float bayerDither2x2( vec2 v ) {

					return mod( 3.0 * v.y + 2.0 * v.x, 4.0 );

				}

				float bayerDither4x4( vec2 v ) {

					vec2 P1 = mod( v, 2.0 );
					vec2 P2 = floor( 0.5 * mod( v, 4.0 ) );
					return 4.0 * bayerDither2x2( P1 ) + bayerDither2x2( P2 );

				}

				// the USE_BATCHING define is not available in fragment shaders
				#ifdef USE_BATCHING_FRAG

				// functions for reading the fade state of a given batch id
				uniform sampler2D fadeTexture;
				varying float vBatchId;
				vec2 getFadeValues( const in float i ) {

					int size = textureSize( fadeTexture, 0 ).x;
					int j = int( i );
					int x = j % size;
					int y = j / size;
					return texelFetch( fadeTexture, ivec2( x, y ), 0 ).rg;

				}

				#else

				uniform float fadeIn;
				uniform float fadeOut;

				#endif

				#endif

				${r}
			`).replace(/#include <dithering_fragment>/,r=>`

				${r}

				#if FEATURE_FADE

				#ifdef USE_BATCHING_FRAG

				vec2 fadeValues = getFadeValues( vBatchId );
				float fadeIn = fadeValues.r;
				float fadeOut = fadeValues.g;

				#endif

				float bayerValue = bayerDither4x4( floor( mod( gl_FragCoord.xy, 4.0 ) ) );
				float bayerBins = 16.0;
				float dither = ( 0.5 + bayerValue ) / bayerBins;
				if ( dither >= fadeIn ) {

					discard;

				}

				if ( dither < fadeOut ) {

					discard;

				}

				#endif

			`)},t}var DE=class{constructor(){this._fadeParams=new WeakMap,this.fading=0}setFade(n,e,t){if(!n)return;let i=this._fadeParams;n.traverse(r=>{let s=r.material;if(s&&i.has(s)){let a=i.get(s);a.fadeIn.value=e,a.fadeOut.value=t;let o=+(!(e===0||e===1)||!(t===0||t===1));s.defines.FEATURE_FADE!==o&&(this.fading+=o===1?1:-1,s.defines.FEATURE_FADE=o,s.needsUpdate=!0)}})}prepareScene(n){n.traverse(e=>{e.material&&this.prepareMaterial(e.material)})}deleteScene(n){if(!n)return;this.setFade(n,1,0);let e=this._fadeParams;n.traverse(t=>{let i=t.material;i&&e.delete(i)})}prepareMaterial(n){let e=this._fadeParams;e.has(n)||e.set(n,Am(n,n.onBeforeCompile))}},UE=class{constructor(n,e=new ln){this.other=n,this.material=e,this.visible=!0,this.parent=null,this._instanceInfo=[],this._visibilityChanged=!0;let t=new Proxy(this,{get(i,r){if(r in i)return i[r];{let s=n[r];return s instanceof Function?(...a)=>(i.syncInstances(),s.call(t,...a)):n[r]}},set(i,r,s){return r in i?i[r]=s:n[r]=s,!0},deleteProperty(i,r){return r in i?delete i[r]:delete n[r]}});return t}syncInstances(){let n=this._instanceInfo,e=this.other._instanceInfo;for(;e.length>n.length;){let t=n.length;n.push(new Proxy({visible:!1},{get(i,r){return r in i?i[r]:e[t][r]},set(i,r,s){return r in i?i[r]=s:e[t][r]=s,!0}}))}}},NE=class extends UE{constructor(...n){super(...n);let e=this.material,t=Am(e,e.onBeforeCompile);e.defines.FEATURE_FADE=1,e.defines.USE_BATCHING_FRAG=1,e.needsUpdate=!0,this.fadeTexture=null,this._fadeParams=t}setFadeAt(n,e,t){this._initFadeTexture(),this.fadeTexture.setValueAt(n,e*255,t*255)}_initFadeTexture(){let n=Math.sqrt(this._maxInstanceCount);n=Math.ceil(n);let e=n*n*2,t=this.fadeTexture;if(!t||t.image.data.length!==e){let i=new FE(new Uint8Array(e),n,n,rl,In);if(t){t.dispose();let r=t.image.data,s=this.fadeTexture.image.data,a=Math.min(r.length,s.length);s.set(new r.constructor(r.buffer,0,a))}this.fadeTexture=i,this._fadeParams.fadeTexture.value=i,i.needsUpdate=!0}}dispose(){this.fadeTexture&&this.fadeTexture.dispose()}},FE=class extends da{setValueAt(n,...e){let{data:t,width:i,height:r}=this.image,s=Math.floor(t.length/(i*r)),a=!1;for(let o=0;o<s;o++){let l=n*s+o,c=t[l],u=e[o]||0;c!==u&&(t[l]=u,a=!0)}a&&(this.needsUpdate=!0)}},Wf=Symbol("HAS_POPPED_IN");function OE(n){let e=n;for(;e;){if(e.traversal.wasSetActive)return e.traversal.wasInFrustum;e=e.parent}return!1}var Xf=new P,qf=new P,jf=new Zt,Yf=new Zt,$f=new P;function BE(){let n=this._fadeManager,e=this._fadeMaterialManager,t=this._fadingBefore,i=this._prevCameraTransforms,{tiles:r,maximumFadeOutTiles:s,batchedMesh:a}=this,{cameras:o}=r;n.update();let l=n.fadeCount;if(t!==0&&l!==0&&(r.dispatchEvent({type:"fade-change"}),r.dispatchEvent({type:"needs-render"})),s<this._fadingOutCount){let c=!0;o.forEach(u=>{if(!i.has(u))return;let h=u.matrixWorld,d=i.get(u);h.decompose(qf,Yf,$f),d.decompose(Xf,jf,$f);let f=Yf.angleTo(jf),m=qf.distanceTo(Xf);c&&(c=f>.25||m>.1)}),c&&n.completeAllFades()}if(o.forEach(c=>{i.get(c).copy(c.matrixWorld)}),n.forEachObject((c,{fadeIn:u,fadeOut:h})=>{let d=c.engineData.scene;r.markTileUsed(c),d&&e.setFade(d,u,h),this.forEachBatchIds(c,(f,m,_)=>{m.setFadeAt(f,u,h),m.setVisibleAt(f,!0),_.batchedMesh.setVisibleAt(f,!1)})}),a){let c=r.getPluginByName("BATCHED_TILES_PLUGIN").batchedMesh.material;a.material.map=c.map}}var kE=class{get fadeDuration(){return this._fadeManager.duration}set fadeDuration(n){this._fadeManager.duration=Number(n)}get fadingTiles(){return this._fadeManager.fadeCount}constructor(n){n={maximumFadeOutTiles:50,fadeRootTiles:!1,fadeDuration:250,...n},this.name="FADE_TILES_PLUGIN",this.priority=-2,this.tiles=null,this.batchedMesh=null,this._quickFadeTiles=new Set,this._fadeManager=new IE,this._fadeMaterialManager=new DE,this._prevCameraTransforms=null,this._fadingOutCount=0,this.maximumFadeOutTiles=n.maximumFadeOutTiles,this.fadeRootTiles=n.fadeRootTiles,this.fadeDuration=n.fadeDuration}init(n){this._onLoadModel=({scene:i})=>{this._fadeMaterialManager.prepareScene(i)},this._onDisposeModel=({tile:i,scene:r})=>{this.tiles.visibleTiles.has(i)&&this._quickFadeTiles.add(i.parent),this._fadeManager.deleteObject(i),this._fadeMaterialManager.deleteScene(r)},this._onAddCamera=({camera:i})=>{this._prevCameraTransforms.set(i,new ge)},this._onDeleteCamera=({camera:i})=>{this._prevCameraTransforms.delete(i)},this._onTileVisibilityChange=({tile:i})=>{this.forEachBatchIds(i,(r,s,a)=>{s.setFadeAt(r,0,0),s.setVisibleAt(r,!1),a.batchedMesh.setVisibleAt(r,!1)})},this._onUpdateBefore=()=>{this._fadingBefore=this._fadeManager.fadeCount},this._onUpdateAfter=()=>{BE.call(this)},n.addEventListener("load-model",this._onLoadModel),n.addEventListener("dispose-model",this._onDisposeModel),n.addEventListener("add-camera",this._onAddCamera),n.addEventListener("delete-camera",this._onDeleteCamera),n.addEventListener("update-before",this._onUpdateBefore),n.addEventListener("update-after",this._onUpdateAfter),n.addEventListener("tile-visibility-change",this._onTileVisibilityChange);let e=this._fadeManager;e.onFadeSetStart=()=>{n.dispatchEvent({type:"fade-start"}),n.dispatchEvent({type:"needs-render"})},e.onFadeSetComplete=()=>{n.dispatchEvent({type:"fade-end"}),n.dispatchEvent({type:"needs-render"})},e.onFadeComplete=(i,r)=>{this._fadeMaterialManager.setFade(i.engineData.scene,0,0),this.forEachBatchIds(i,(s,a,o)=>{a.setFadeAt(s,0,0),a.setVisibleAt(s,!1),o.batchedMesh.setVisibleAt(s,r)}),r||(n.invokeOnePlugin(s=>s!==this&&s.setTileVisible&&s.setTileVisible(i,!1)),this._fadingOutCount--)};let t=new Map;n.cameras.forEach(i=>{t.set(i,new ge)}),n.forEachLoadedModel((i,r)=>{this._onLoadModel({scene:i})}),this.tiles=n,this._fadeManager=e,this._prevCameraTransforms=t}initBatchedMesh(){var e;let n=(e=this.tiles.getPluginByName("BATCHED_TILES_PLUGIN"))==null?void 0:e.batchedMesh;if(n){if(this.batchedMesh===null){this._onBatchedMeshDispose=()=>{this.batchedMesh.dispose(),this.batchedMesh.removeFromParent(),this.batchedMesh=null,n.removeEventListener("dispose",this._onBatchedMeshDispose)};let t=n.material.clone();t.onBeforeCompile=n.material.onBeforeCompile,this.batchedMesh=new NE(n,t),this.tiles.group.add(this.batchedMesh)}}else this.batchedMesh!==null&&(this._onBatchedMeshDispose(),this._onBatchedMeshDispose=null)}setTileVisible(n,e){let t=this._fadeManager,i=t.isFading(n);if(!OE(n))return i&&t.completeFade(n),!1;if(t.isFadingOut(n)&&this._fadingOutCount--,e?n.internal.depthFromRenderedParent===1?((n[Wf]||this.fadeRootTiles)&&this._fadeManager.fadeIn(n),n[Wf]=!0):this._fadeManager.fadeIn(n):(this._fadingOutCount++,t.fadeOut(n)),this._quickFadeTiles.has(n)&&(this._fadeManager.completeFade(n),this._quickFadeTiles.delete(n)),i)return!0;let r=this._fadeManager.isFading(n);return!!(!e&&r)}dispose(){let n=this.tiles;this._fadeManager.completeAllFades(),this.batchedMesh!==null&&this._onBatchedMeshDispose(),n.removeEventListener("load-model",this._onLoadModel),n.removeEventListener("dispose-model",this._onDisposeModel),n.removeEventListener("add-camera",this._onAddCamera),n.removeEventListener("delete-camera",this._onDeleteCamera),n.removeEventListener("update-before",this._onUpdateBefore),n.removeEventListener("update-after",this._onUpdateAfter),n.removeEventListener("tile-visibility-change",this._onTileVisibilityChange),n.forEachLoadedModel((e,t)=>{this._fadeManager.deleteObject(t)})}forEachBatchIds(n,e){if(this.initBatchedMesh(),this.batchedMesh){let t=this.tiles.getPluginByName("BATCHED_TILES_PLUGIN"),i=t.getTileBatchIds(n);i&&i.forEach(r=>{e(r,this.batchedMesh,t)})}}};new xm(new ln);var zE=new da(new Uint8Array([255,255,255,255]),1,1);zE.needsUpdate=!0;const pc=new WeakMap;class VE extends cr{constructor(e){super(e),this.decoderPath="",this.decoderConfig={},this.decoderBinary=null,this.decoderPending=null,this.workerLimit=4,this.workerPool=[],this.workerNextTaskID=1,this.workerSourceURL="",this.defaultAttributeIDs={position:"POSITION",normal:"NORMAL",color:"COLOR",uv:"TEX_COORD"},this.defaultAttributeTypes={position:"Float32Array",normal:"Float32Array",color:"Float32Array",uv:"Float32Array"}}setDecoderPath(e){return this.decoderPath=e,this}setDecoderConfig(e){return this.decoderConfig=e,this}setWorkerLimit(e){return this.workerLimit=e,this}load(e,t,i,r){const s=new ia(this.manager);s.setPath(this.path),s.setResponseType("arraybuffer"),s.setRequestHeader(this.requestHeader),s.setWithCredentials(this.withCredentials),s.load(e,a=>{this.parse(a,t,r)},i,r)}parse(e,t,i=()=>{}){this.decodeDracoFile(e,t,null,null,gt,i).catch(i)}decodeDracoFile(e,t,i,r,s=zt,a=()=>{}){const o={attributeIDs:i||this.defaultAttributeIDs,attributeTypes:r||this.defaultAttributeTypes,useUniqueIDs:!!i,vertexColorSpace:s};return this.decodeGeometry(e,o).then(t).catch(a)}decodeGeometry(e,t){const i=JSON.stringify(t);if(pc.has(e)){const l=pc.get(e);if(l.key===i)return l.promise;if(e.byteLength===0)throw new Error("THREE.DRACOLoader: Unable to re-decode a buffer with different settings. Buffer has already been transferred.")}let r;const s=this.workerNextTaskID++,a=e.byteLength,o=this._getWorker(s,a).then(l=>(r=l,new Promise((c,u)=>{r._callbacks[s]={resolve:c,reject:u},r.postMessage({type:"decode",id:s,taskConfig:t,buffer:e},[e])}))).then(l=>this._createGeometry(l.geometry));return o.catch(()=>!0).then(()=>{r&&s&&this._releaseTask(r,s)}),pc.set(e,{key:i,promise:o}),o}_createGeometry(e){const t=new _t;e.index&&t.setIndex(new je(e.index.array,1));for(let i=0;i<e.attributes.length;i++){const r=e.attributes[i],s=r.name,a=r.array,o=r.itemSize,l=new je(a,o);s==="color"&&(this._assignVertexColorSpace(l,r.vertexColorSpace),l.normalized=!(a instanceof Float32Array)),t.setAttribute(s,l)}return t}_assignVertexColorSpace(e,t){if(t!==gt)return;const i=new we;for(let r=0,s=e.count;r<s;r++)i.fromBufferAttribute(e,r),Xe.toWorkingColorSpace(i,gt),e.setXYZ(r,i.r,i.g,i.b)}_loadLibrary(e,t){const i=new ia(this.manager);return i.setPath(this.decoderPath),i.setResponseType(t),i.setWithCredentials(this.withCredentials),new Promise((r,s)=>{i.load(e,r,void 0,s)})}preload(){return this._initDecoder(),this}_initDecoder(){if(this.decoderPending)return this.decoderPending;const e=typeof WebAssembly!="object"||this.decoderConfig.type==="js",t=[];return e?t.push(this._loadLibrary("draco_decoder.js","text")):(t.push(this._loadLibrary("draco_wasm_wrapper.js","text")),t.push(this._loadLibrary("draco_decoder.wasm","arraybuffer"))),this.decoderPending=Promise.all(t).then(i=>{const r=i[0];e||(this.decoderConfig.wasmBinary=i[1]);const s=HE.toString(),a=["/* draco decoder */",r,"","/* worker */",s.substring(s.indexOf("{")+1,s.lastIndexOf("}"))].join(`
`);this.workerSourceURL=URL.createObjectURL(new Blob([a]))}),this.decoderPending}_getWorker(e,t){return this._initDecoder().then(()=>{if(this.workerPool.length<this.workerLimit){const r=new Worker(this.workerSourceURL);r._callbacks={},r._taskCosts={},r._taskLoad=0,r.postMessage({type:"init",decoderConfig:this.decoderConfig}),r.onmessage=function(s){const a=s.data;switch(a.type){case"decode":r._callbacks[a.id].resolve(a);break;case"error":r._callbacks[a.id].reject(a);break;default:console.error('THREE.DRACOLoader: Unexpected message, "'+a.type+'"')}},this.workerPool.push(r)}else this.workerPool.sort(function(r,s){return r._taskLoad>s._taskLoad?-1:1});const i=this.workerPool[this.workerPool.length-1];return i._taskCosts[e]=t,i._taskLoad+=t,i})}_releaseTask(e,t){e._taskLoad-=e._taskCosts[t],delete e._callbacks[t],delete e._taskCosts[t]}debug(){console.log("Task load: ",this.workerPool.map(e=>e._taskLoad))}dispose(){for(let e=0;e<this.workerPool.length;++e)this.workerPool[e].terminate();return this.workerPool.length=0,this.workerSourceURL!==""&&URL.revokeObjectURL(this.workerSourceURL),this}}function HE(){let n,e;onmessage=function(a){const o=a.data;switch(o.type){case"init":n=o.decoderConfig,e=new Promise(function(u){n.onModuleLoaded=function(h){u({draco:h})},DracoDecoderModule(n)});break;case"decode":const l=o.buffer,c=o.taskConfig;e.then(u=>{const h=u.draco,d=new h.Decoder;try{const f=t(h,d,new Int8Array(l),c),m=f.attributes.map(_=>_.array.buffer);f.index&&m.push(f.index.array.buffer),self.postMessage({type:"decode",id:o.id,geometry:f},m)}catch(f){console.error(f),self.postMessage({type:"error",id:o.id,error:f.message})}finally{h.destroy(d)}});break}};function t(a,o,l,c){const u=c.attributeIDs,h=c.attributeTypes;let d,f;const m=o.GetEncodedGeometryType(l);if(m===a.TRIANGULAR_MESH)d=new a.Mesh,f=o.DecodeArrayToMesh(l,l.byteLength,d);else if(m===a.POINT_CLOUD)d=new a.PointCloud,f=o.DecodeArrayToPointCloud(l,l.byteLength,d);else throw new Error("THREE.DRACOLoader: Unexpected geometry type.");if(!f.ok()||d.ptr===0)throw new Error("THREE.DRACOLoader: Decoding failed: "+f.error_msg());const _={index:null,attributes:[]};for(const g in u){const p=self[h[g]];let y,x;if(c.useUniqueIDs)x=u[g],y=o.GetAttributeByUniqueId(d,x);else{if(x=o.GetAttributeId(d,a[u[g]]),x===-1)continue;y=o.GetAttribute(d,x)}const v=r(a,o,d,g,p,y);g==="color"&&(v.vertexColorSpace=c.vertexColorSpace),_.attributes.push(v)}return m===a.TRIANGULAR_MESH&&(_.index=i(a,o,d)),a.destroy(d),_}function i(a,o,l){const u=l.num_faces()*3,h=u*4,d=a._malloc(h);o.GetTrianglesUInt32Array(l,h,d);const f=new Uint32Array(a.HEAPF32.buffer,d,u).slice();return a._free(d),{array:f,itemSize:1}}function r(a,o,l,c,u,h){const d=h.num_components(),m=l.num_points()*d,_=m*u.BYTES_PER_ELEMENT,g=s(a,u),p=a._malloc(_);o.GetAttributeDataArrayForAllPoints(l,h,g,_,p);const y=new u(a.HEAPF32.buffer,p,m).slice();return a._free(p),{name:c,array:y,itemSize:d}}function s(a,o){switch(o){case Float32Array:return a.DT_FLOAT32;case Int8Array:return a.DT_INT8;case Int16Array:return a.DT_INT16;case Int32Array:return a.DT_INT32;case Uint8Array:return a.DT_UINT8;case Uint16Array:return a.DT_UINT16;case Uint32Array:return a.DT_UINT32}}}function wm(n,e){const t=document.getElementById("loader-text"),i=document.getElementById("loader-bar");t&&(t.textContent=n),i&&(i.style.width=`${Math.round(e*100)}%`)}function GE(){const n=document.getElementById("loader");n&&(n.classList.add("hidden"),n.style.display="none")}const Kf=6378137;function WE(){const n=new kt,e=new si({color:15789542,roughness:.45,metalness:.2,flatShading:!0}),t=new si({color:12728878,roughness:.45,metalness:.2,flatShading:!0}),i=new si({color:2237995,roughness:.7,flatShading:!0}),r=new si({color:1450542,roughness:.08,metalness:.85}),s=[new fe(.02,0),new fe(.3,.15),new fe(.44,.55),new fe(.5,1.2),new fe(.48,2.1),new fe(.36,3.2),new fe(.2,4.3),new fe(.12,5.2),new fe(.03,5.9)],a=new He(new Hu(s,12),e);a.rotation.x=Math.PI/2,a.position.z=-3.3,n.add(a);const o=new He(new gn(.72,.36,1.5),r);o.position.set(0,.38,-1.15),n.add(o);const l=new gn(4.7,.09,1.45),c=new gn(.5,.1,1.4);for(const A of[-1,1]){const R=new kt,T=new He(l,e);T.position.x=A*2.35;const M=new He(c,t);M.position.x=A*4.8,R.add(T,M),R.position.set(0,.52,-.85),R.rotation.z=A*-.06,n.add(R);const L=new He(new Di(.03,.03,1.6,6),e);L.position.set(A*1.15,.05,-.75),L.rotation.z=A*1.1,n.add(L)}const u=new He(new gn(2.4,.07,.85),e);u.position.set(0,.12,2.55);const h=new He(new gn(.08,1.05,.95),t);h.position.set(0,.6,2.6),h.rotation.x=-.15,n.add(u,h);const d=new He(new Di(.4,.34,.5,12),t);d.rotation.x=Math.PI/2,d.position.z=-3.15,n.add(d);const f=new kt,m=new He(new Wu(.13,.4,10),i);m.rotation.x=-Math.PI/2,m.position.z=-.2;const _=new gn(.16,1.15,.04),g=new He(_,i),p=new He(_,i);p.rotation.z=Math.PI/2;const y=new He(new Gu(1.15,24),new si({color:3356736,transparent:!0,opacity:.14,side:bn,depthWrite:!1}));f.add(m,g,p,y),f.position.z=-3.55,n.add(f),n.userData.prop=f,n.userData.blades=[g,p];const x=new cl(.17,8,6),v=new gn(.2,.28,.62);for(const A of[-1,1]){const R=new He(new Di(.035,.035,.55,6),i);R.position.set(A*.55,-.55,-1);const T=new He(v,t);T.position.set(A*.55,-.85,-1);const M=new He(x,i);M.position.set(A*.55,-.85,-1.28),n.add(R,T,M)}const w=new He(new Di(.03,.03,.45,6),i);w.position.set(0,-.5,-2.6);const b=new He(v,t);return b.position.set(0,-.75,-2.6),n.add(w,b),n}class XE{constructor(e,t,i,r,s={}){this.lat=e*ae.DEG2RAD,this.lon=t*ae.DEG2RAD,this.height=i,this.heading=r*ae.DEG2RAD,this.pitch=0,this.roll=0,this.cruise=s.cruise??48,this.boost=s.boost??85,this.brake=s.brake??30,this.speed=this.cruise,this.crashed=!1}update(e,t){const i=-t.roll*.9,r=t.pitch*.4;this.roll+=(i-this.roll)*Math.min(1,6*e),this.pitch+=(r-this.pitch)*Math.min(1,4*e);const s=t.throttle>0?this.boost:t.throttle<0?this.brake:this.cruise;this.speed+=(s-this.speed)*Math.min(1,.8*e),this.heading+=-Math.sin(this.roll)*(this.speed/55)*e*.85;const a=this.brake+4,o=this.speed<a?(a-this.speed)*1.1:0,l=Math.sin(this.pitch)*this.speed-o,c=Math.cos(this.pitch)*this.speed,u=Math.cos(this.heading)*c,h=Math.sin(this.heading)*c;this.lat+=u*e/Kf,this.lon+=h*e/(Kf*Math.cos(this.lat)),this.height+=l*e}get latDeg(){return this.lat*ae.RAD2DEG}get lonDeg(){return this.lon*ae.RAD2DEG}get headingDeg(){return(this.heading*ae.RAD2DEG%360+360)%360}get kmh(){return this.speed*3.6}}function qE(n,e){const t=new Ou({canvas:n,antialias:!0,alpha:!0});t.setPixelRatio(Math.min(devicePixelRatio,2)),t.setClearColor(0,0);const i=new tm;i.add(new cm(13623536,5926984,1.25));const r=new No(16773853,2.4);r.position.set(3,5,4),i.add(r);const s=new No(10470655,.9);s.position.set(-4,2,-3),i.add(s);const a=new Ot(30,2,.1,300),o=new hs,l=new Map;let c=null,u=null,h=e[0].key;function d(){const p=n.clientWidth||640,y=n.clientHeight||340;t.setSize(p,y,!1),a.aspect=p/y,a.updateProjectionMatrix(),c&&f(c.wingspan)}function f(p){a.position.set(0,p*.42,p*1.75),a.lookAt(0,0,0)}function m(p,y=0){h=p;const x=l.get(p);x&&(c&&i.remove(c.group),c={group:x.group,wingspan:x.wingspan,slideX:y*x.wingspan*1.4},u=p,i.add(x.group),f(x.wingspan))}for(const p of e)o.load(p.file,y=>{const x=y.scene;p.prepare&&p.prepare(x);const v=new cn().setFromObject(x),w=v.getSize(new P);x.scale.setScalar(p.wingspan/Math.max(w.x,w.y,w.z)),v.setFromObject(x),x.position.sub(v.getCenter(new P)),x.traverse(A=>{A.isMesh&&A.material&&(A.material.metalness=.15,A.material.roughness=.65)});const b=new kt;b.add(x),l.set(p.key,{group:b,wingspan:p.wingspan}),p.key===h&&u!==h&&m(p.key)});let _=!0;function g(){if(requestAnimationFrame(g),!_||!c)return;const p=performance.now()*.001;c.slideX*=.86,c.group.position.x=c.slideX,c.group.rotation.y=p*.45,c.group.rotation.z=Math.sin(p*.6)*.05,t.render(i,a)}return g(),d(),window.addEventListener("resize",d),{show:m,get currentKey(){return u},setActive(p){_=p}}}const Rm=new P(-.52,.62,.26).normalize();function jE(n){const e={uZenith:{value:new we(2778040)},uMid:{value:new we(8238050)},uHorizon:{value:new we(n)},uSunDir:{value:Rm},uSunColor:{value:new we(16773853)},uTime:{value:0}},t=new Vn({uniforms:e,side:$t,depthWrite:!1,fog:!1,vertexShader:`
      varying vec3 vDir;
      void main() {
        vDir = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,fragmentShader:`
      varying vec3 vDir;
      uniform vec3 uZenith;
      uniform vec3 uMid;
      uniform vec3 uHorizon;
      uniform vec3 uSunDir;
      uniform vec3 uSunColor;
      uniform float uTime;

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }
      float vnoise(vec2 p) {
        vec2 i = floor(p), f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(
          mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
          mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
          u.y
        );
      }
      float fbm(vec2 p) {
        float v = 0.0, a = 0.5;
        for (int i = 0; i < 5; i++) {
          v += a * vnoise(p);
          p = p * 2.03 + 17.1;
          a *= 0.5;
        }
        return v;
      }

      void main() {
        vec3 d = normalize(vDir);
        float h = d.y;

        // gradient nieba — bardzo łagodny przy horyzoncie, żeby nie było pasma
        float t = clamp(h, 0.0, 1.0);
        vec3 col = mix(uHorizon, uMid, smoothstep(0.0, 0.12, t));
        col = mix(col, uZenith, smoothstep(0.12, 0.65, t));
        if (h < 0.0) col = uHorizon; // pod horyzontem czysta mgła

        // słońce: tarcza + poświata
        float s = max(dot(d, uSunDir), 0.0);
        col += uSunColor * (pow(s, 1400.0) * 8.0 + pow(s, 48.0) * 0.25 + pow(s, 6.0) * 0.05);

        // chmury — rzut kierunku na płaszczyznę, dryf w czasie
        if (h > 0.005) {
          vec2 cuv = d.xz / (h + 0.12) * 0.55;
          cuv += uTime * 0.006;
          float warp = fbm(cuv * 1.7 + 3.1);
          float f = fbm(cuv * 1.15 + warp * 0.9);
          float cov = smoothstep(0.50, 0.74, f);
          float fade = smoothstep(0.02, 0.16, h) * (1.0 - smoothstep(0.75, 1.0, h) * 0.35);
          float shade = fbm(cuv * 2.6 + 8.7);
          vec3 cloud = mix(vec3(0.60, 0.64, 0.70), vec3(1.18, 1.14, 1.07), smoothstep(0.3, 0.9, shade));
          cloud += uSunColor * pow(s, 4.0) * 0.22;
          col = mix(col, cloud, cov * fade * 0.85);
        }

        gl_FragColor = vec4(col, 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }
    `}),i=new He(new cl(5e6,48,24),t);return i.frustumCulled=!1,i.renderOrder=-100,{mesh:i,uniforms:e}}const xu=Math.PI*2,ko="#d8a24a",tr="#f3ead6";function Cm(n){const e=Math.min(devicePixelRatio,2),t=n.clientWidth,i=n.clientHeight;(n.width!==Math.round(t*e)||n.height!==Math.round(i*e))&&(n.width=Math.round(t*e),n.height=Math.round(i*e));const r=n.getContext("2d");return r.setTransform(e,0,0,e,0,0),r.clearRect(0,0,t,i),{ctx:r,w:t,h:i}}function Pm(n,e,t,i){n.beginPath(),n.arc(e,t,i,0,xu),n.fillStyle="rgba(14, 12, 9, 0.72)",n.fill(),n.lineWidth=1.5,n.strokeStyle="rgba(243, 234, 214, 0.35)",n.stroke(),n.beginPath(),n.arc(e,t,i-3.5,0,xu),n.lineWidth=1,n.strokeStyle="rgba(243, 234, 214, 0.12)",n.stroke()}function YE(n,e,t,i,r){n.save(),n.translate(e,t),n.rotate(i),n.beginPath(),n.moveTo(0,9),n.lineTo(2.4,0),n.lineTo(0,-r),n.lineTo(-2.4,0),n.closePath(),n.fillStyle=ko,n.fill(),n.restore(),n.beginPath(),n.arc(e,t,3.6,0,xu),n.fillStyle=ko,n.fill()}function Lm(n,e,t,i,r,s){const{ctx:a,w:o,h:l}=Cm(n),c=o/2,u=l/2,h=Math.min(o,l)/2-2;Pm(a,c,u,h);const d=Math.PI*2/3,f=Math.PI*4/3;a.save(),a.translate(c,u);for(let y=0;y<=t+1e-9;y+=s){const x=d+y/t*f,v=Math.abs(y/r-Math.round(y/r))<1e-6,w=h-(v?13:8),b=h-4.5;a.beginPath(),a.moveTo(Math.sin(x)*b,-Math.cos(x)*b),a.lineTo(Math.sin(x)*w,-Math.cos(x)*w),a.lineWidth=v?2:1,a.strokeStyle=v?tr:"rgba(243, 234, 214, 0.5)",a.stroke(),v&&(a.save(),a.rotate(x),a.fillStyle=tr,a.font="600 9px Georgia, serif",a.textAlign="center",a.textBaseline="middle",a.fillText(String(y),0,-(h-22)),a.restore())}a.restore();const m=Math.max(0,Math.min(t,e));YE(a,c,u,d+m/t*f,h-30);const _=String(Math.round(e));a.font="600 15px Georgia, serif";const g=Math.max(a.measureText(_).width+18,52),p=u+h*.55;a.beginPath(),a.roundRect(c-g/2,p-16,g,34,6),a.fillStyle="rgba(10, 8, 6, 0.94)",a.fill(),a.lineWidth=1,a.strokeStyle="rgba(243, 234, 214, 0.3)",a.stroke(),a.fillStyle=tr,a.textAlign="center",a.textBaseline="middle",a.fillText(_,c,p-6),a.fillStyle="rgba(243, 234, 214, 0.55)",a.font="7px Georgia, serif",a.fillText(i,c,p+9)}function $E(n,e,t=400){Lm(n,e,t,"KM/H",t/4,t/20)}function KE(n,e){Lm(n,e,1e3,"METRY",200,100)}function ZE(n,e){const{ctx:t,w:i,h:r}=Cm(n),s=i/2,a=r/2,o=Math.min(i,r)/2-2;Pm(t,s,a,o),t.save(),t.translate(s,a),t.rotate(-e*Math.PI/180);for(let d=0;d<360;d+=10){const f=d*Math.PI/180,m=d%90===0,_=d%30===0,g=o-(_?11:6),p=o-4.5;t.beginPath(),t.moveTo(Math.sin(f)*p,-Math.cos(f)*p),t.lineTo(Math.sin(f)*g,-Math.cos(f)*g),t.lineWidth=_?2:1,t.strokeStyle=_?tr:"rgba(243, 234, 214, 0.5)",t.stroke(),m?(t.save(),t.rotate(f),t.fillStyle=d===0?ko:tr,t.font="700 13px Georgia, serif",t.textAlign="center",t.textBaseline="middle",t.fillText({0:"N",90:"E",180:"S",270:"W"}[d],0,-(o-22)),t.restore()):_&&(t.save(),t.rotate(f),t.fillStyle="rgba(243, 234, 214, 0.75)",t.font="600 8px Georgia, serif",t.textAlign="center",t.textBaseline="middle",t.fillText(String(d/10),0,-(o-21)),t.restore())}t.restore(),t.beginPath(),t.moveTo(s,a-o+3),t.lineTo(s-5,a-o+12),t.lineTo(s+5,a-o+12),t.closePath(),t.fillStyle=ko,t.fill(),t.save(),t.translate(s,a-6),t.beginPath(),t.moveTo(0,-7),t.lineTo(2,2),t.lineTo(9,6),t.lineTo(9,8),t.lineTo(2,6),t.lineTo(2,12),t.lineTo(5,14),t.lineTo(5,15.5),t.lineTo(0,14),t.lineTo(-5,15.5),t.lineTo(-5,14),t.lineTo(-2,12),t.lineTo(-2,6),t.lineTo(-9,8),t.lineTo(-9,6),t.lineTo(-2,2),t.closePath(),t.fillStyle=tr,t.fill(),t.restore();const l=(Math.round(e)%360+360)%360,c=`${String(l).padStart(3,"0")}°`;t.font="600 13px Georgia, serif";const u=t.measureText(c).width+16,h=a+o*.32;t.beginPath(),t.roundRect(s-u/2,h-11,u,22,6),t.fillStyle="rgba(10, 8, 6, 0.94)",t.fill(),t.lineWidth=1,t.strokeStyle="rgba(243, 234, 214, 0.3)",t.stroke(),t.fillStyle=tr,t.textAlign="center",t.textBaseline="middle",t.fillText(c,s,h)}const Bn=n=>`./${String(n).replace(/^\//,"")}`;function JE(n,e){const t=[],r=new _t,s=new Float32Array(720),a=new Float32Array(720),o=new Float32Array(720);for(let x=0;x<240;x++){s[x*3]=e.x,s[x*3+1]=e.y,s[x*3+2]=e.z;const v=Math.random()*Math.PI*2,w=Math.acos(2*Math.random()-1),b=12+Math.random()*42;o[x*3]=Math.sin(w)*Math.cos(v)*b,o[x*3+1]=Math.abs(Math.cos(w))*b*.9+6,o[x*3+2]=Math.sin(w)*Math.sin(v)*b;const A=Math.random();a[x*3]=1,a[x*3+1]=.75-A*.55,a[x*3+2]=.35-A*.3}r.setAttribute("position",new at(s,3)),r.setAttribute("color",new at(a,3));const l=new na({size:4.2,vertexColors:!0,blending:Ec,depthWrite:!1,transparent:!0,opacity:1}),c=new Uo(r,l);c.frustumCulled=!1,n.add(c),t.push(c);const u=90,h=new _t,d=new Float32Array(u*3),f=new Float32Array(u*3);for(let x=0;x<u;x++){d[x*3]=e.x,d[x*3+1]=e.y,d[x*3+2]=e.z;const v=Math.random()*Math.PI*2,w=3+Math.random()*12;f[x*3]=Math.cos(v)*w,f[x*3+1]=8+Math.random()*14,f[x*3+2]=Math.sin(v)*w}h.setAttribute("position",new at(d,3));const m=new na({size:9,color:2762276,blending:nr,depthWrite:!1,transparent:!0,opacity:.55}),_=new Uo(h,m);_.frustumCulled=!1,n.add(_),t.push(_);const g=new um(16752704,4e3,600,1.6);g.position.copy(e),n.add(g),t.push(g);let p=0;const y=2.6;return{update(x){var b,A;p+=x;const v=c.geometry.attributes.position.array;for(let R=0;R<240;R++){o[R*3+1]-=14*x;const T=1-Math.min(.9,1.6*x);o[R*3]*=T,o[R*3+1]*=T,o[R*3+2]*=T,v[R*3]+=o[R*3]*x,v[R*3+1]+=o[R*3+1]*x,v[R*3+2]+=o[R*3+2]*x}c.geometry.attributes.position.needsUpdate=!0,l.opacity=Math.max(0,1-p/1.3),l.size=4.2+p*6;const w=_.geometry.attributes.position.array;for(let R=0;R<u*3;R++)w[R]+=f[R]*x;if(_.geometry.attributes.position.needsUpdate=!0,m.opacity=Math.max(0,.55*(1-p/y)),m.size=9+p*10,g.intensity=Math.max(0,4e3*(1-p/.45)),p>=y){for(const R of t)n.remove(R),(b=R.geometry)==null||b.dispose(),(A=R.material)==null||A.dispose();return!1}return!0}}}let qt=null;function Qu(){qt??(qt=new(window.AudioContext||window.webkitAudioContext)),qt.state==="suspended"&&qt.resume()}function eh(){return qt}function QE(){Qu();const n=qt.currentTime,e=1.3,t=qt.createBuffer(1,qt.sampleRate*e,qt.sampleRate),i=t.getChannelData(0);for(let c=0;c<i.length;c++)i[c]=(Math.random()*2-1)*Math.pow(1-c/i.length,2);const r=qt.createBufferSource();r.buffer=t;const s=qt.createBiquadFilter();s.type="lowpass",s.frequency.setValueAtTime(3200,n),s.frequency.exponentialRampToValueAtTime(110,n+e);const a=qt.createGain();a.gain.setValueAtTime(.85,n),a.gain.exponentialRampToValueAtTime(.001,n+e),r.connect(s).connect(a).connect(qt.destination),r.start(n);const o=qt.createOscillator();o.type="sine",o.frequency.setValueAtTime(130,n),o.frequency.exponentialRampToValueAtTime(28,n+.9);const l=qt.createGain();l.gain.setValueAtTime(.9,n),l.gain.exponentialRampToValueAtTime(.001,n+1),o.connect(l).connect(qt.destination),o.start(n),o.stop(n+1)}let th=!1,ri,wi,Vs,xo,vo,Dr,Ur,yo,Nr,Fr,Or;function eb(n){th=!0,ri=n.createGain(),ri.gain.value=0,ri.connect(n.destination),wi=n.createBiquadFilter(),wi.type="lowpass",wi.frequency.value=400,wi.Q.value=1.1,Vs=n.createGain(),Vs.gain.value=.6,wi.connect(Vs).connect(ri),Nr=n.createOscillator(),Nr.type="sawtooth",Nr.frequency.value=70,Fr=n.createOscillator(),Fr.type="sawtooth",Fr.frequency.value=71;const e=n.createGain();e.gain.value=.5;const t=n.createGain();t.gain.value=.35,Nr.connect(e).connect(wi),Fr.connect(t).connect(wi),Nr.start(),Fr.start(),Ur=n.createOscillator(),Ur.type="sine",Ur.frequency.value=140,yo=n.createGain(),yo.gain.value=.16,Ur.connect(yo).connect(Vs.gain),Ur.start(),Or=n.createOscillator(),Or.type="sine",Or.frequency.value=35,xo=n.createGain(),xo.gain.value=.4,Or.connect(xo).connect(ri),Or.start();const i=n.sampleRate*2,r=n.createBuffer(1,i,n.sampleRate),s=r.getChannelData(0);for(let o=0;o<i;o++)s[o]=Math.random()*2-1;const a=n.createBufferSource();a.buffer=r,a.loop=!0,Dr=n.createBiquadFilter(),Dr.type="bandpass",Dr.frequency.value=500,Dr.Q.value=.6,vo=n.createGain(),vo.gain.value=0,a.connect(Dr).connect(vo).connect(ri),a.start()}const Zf={plane:{fBase:46,fRange:64,subDiv:2,am:.16,lpBase:240,lpRange:640,exG:.5,exR:.5,subG:.32,subR:.3,noiseMul:1},jet:{fBase:480,fRange:1150,subDiv:4,am:0,lpBase:1500,lpRange:2600,exG:.1,exR:.14,subG:.1,subR:.12,noiseMul:2.3},rocket:{fBase:26,fRange:40,subDiv:1,am:0,lpBase:130,lpRange:380,exG:.85,exR:.55,subG:.5,subR:.35,noiseMul:3.1},wind:{fBase:46,fRange:64,subDiv:2,am:0,lpBase:240,lpRange:640,exG:0,exR:0,subG:0,subR:0,noiseMul:1.5}};function tb(n,e,t,i="plane"){const r=eh();if(!r)return;th||eb(r);const s=r.currentTime;if(ri.gain.setTargetAtTime(n?.14:0,s,n?.3:.06),!n)return;const a=Zf[i]||Zf.plane,o=Math.max(.12,Math.min(1,e)),l=a.fBase+o*a.fRange;Nr.frequency.setTargetAtTime(l,s,.1),Fr.frequency.setTargetAtTime(l*1.006+.6,s,.1),Or.frequency.setTargetAtTime(l/a.subDiv,s,.1),Ur.frequency.setTargetAtTime(l*2,s,.1),yo.gain.setTargetAtTime(a.am,s,.1),wi.frequency.setTargetAtTime(a.lpBase+o*a.lpRange,s,.15),Vs.gain.setTargetAtTime(a.exG+o*a.exR,s,.1),xo.gain.setTargetAtTime(a.subG+o*a.subR,s,.1);const c=Math.max(0,Math.min(1,t));vo.gain.setTargetAtTime(c*c*.5*a.noiseMul,s,.25),Dr.frequency.setTargetAtTime(380+c*720,s,.25)}function nb(){const n=eh();return{ctxState:n?n.state:null,built:th,masterGain:ri?Math.round(ri.gain.value*1e3)/1e3:null}}const ib=.22;let jt=null,ir=null,Jf=!1;function Im(){const n=eh();if(!n)return null;if(jt||(jt=new Audio(Bn("music/theme.mp3")),jt.loop=!0,jt.preload="auto",jt.crossOrigin="anonymous"),!Jf)try{const e=n.createMediaElementSource(jt);ir=n.createGain(),ir.gain.value=0,e.connect(ir).connect(n.destination),Jf=!0}catch{}return n}function rb(n){const e=Im();if(!e||!jt||!ir)return;const t=e.currentTime;ir.gain.setTargetAtTime(n?ib:0,t,n?1.2:.35),jt.paused&&jt.play().catch(()=>{})}function sb(){Qu(),Im()&&jt&&jt.play().catch(()=>{})}function ab(){return{paused:jt?jt.paused:null,time:jt?Math.round(jt.currentTime*10)/10:null,gain:ir?Math.round(ir.gain.value*1e3)/1e3:null}}const vu=6378137;function nh(n,e,t,i){const r=n*ae.DEG2RAD,s=t*ae.DEG2RAD,a=(t-n)*ae.DEG2RAD,o=(i-e)*ae.DEG2RAD,l=Math.sin(a/2)**2+Math.cos(r)*Math.cos(s)*Math.sin(o/2)**2;return 2*vu*Math.asin(Math.sqrt(l))}function ob(n,e,t){const i=Math.random()*2*Math.PI,r=Math.cos(i)*t*1e3,s=Math.sin(i)*t*1e3;return{lat:n+r/vu*ae.RAD2DEG,lon:e+s/(vu*Math.cos(n*ae.DEG2RAD))*ae.RAD2DEG}}function lb(){const n=new kt,e=new He(new Di(90,90,1400,24,1,!0),new ln({color:16763213,transparent:!0,opacity:.34,depthWrite:!1}));e.position.y=700;const t=new He(new Xu(100,5,12,48),new ln({color:16758062,transparent:!0,opacity:.95,depthWrite:!1}));return t.rotation.x=Math.PI/2,t.position.y=30,n.add(e,t),n.userData.ring=t,n}let mc=null;async function cb(){return mc||(mc=await(await fetch(Bn("geo/poland.json"))).json()),mc}function*Dm(n){if(n.type==="Polygon")yield n.coordinates;else if(n.type==="MultiPolygon")for(const e of n.coordinates)yield e}function ub(n,e,t){let i=!1;for(let r=0,s=t.length-1;r<t.length;s=r++){const a=t[r][0],o=t[r][1],l=t[s][0],c=t[s][1];o>e!=c>e&&n<(l-a)*(e-o)/(c-o)+a&&(i=!i)}return i}function ih(n,e,t){for(const i of t.features)for(const r of Dm(i.geometry))if(r.length&&ub(n,e,r[0]))return!0;return!1}function hb(n){for(let e=0;e<500;e++){const t=14.3+Math.random()*9.649999999999999,i=49.15+Math.random()*(54.6-49.15);if(ih(t,i,n))return{lat:i,lon:t}}return{lat:52.1,lon:19.4}}let gc=null;async function db(){return gc||(gc=await(await fetch(Bn("geo/world-land.json"))).json()),gc}function fb(n){for(let e=0;e<2e3;e++){const t=-180+Math.random()*360,i=Math.asin(2*Math.random()-1)*ae.RAD2DEG;if(!(i<-58||i>78)&&ih(t,i,n))return{lat:i,lon:t}}return{lat:52.1,lon:19.4}}let _c=null;async function pb(){return _c||(_c=await(await fetch(Bn("geo/europe.json"))).json()),_c}const rs=-25,yu=45,zo=34,aa=72;function mb(n){for(let e=0;e<2e3;e++){const t=rs+Math.random()*(yu-rs),i=zo+Math.random()*(aa-zo);if(ih(t,i,n))return{lat:i,lon:t}}return{lat:52.1,lon:19.4}}const Vo=-180,Qf=180,ep=-60,Ho=85;function Um(n,e,t){const i=(n-2*t)/(Qf-Vo),r=(e-2*t)/(Ho-ep),s=Math.min(i,r),a=(Qf-Vo)*s,o=(Ho-ep)*s;return{s,ox:(n-a)/2,oy:(e-o)/2}}function gb(n,e,t,i,r=10){const s=Um(t,i,r);return[s.ox+(n-Vo)*s.s,s.oy+(Ho-e)*s.s]}function _b(n,e,t,i,r=10){const s=Um(t,i,r);return{lon:Vo+(n-s.ox)/s.s,lat:Ho-(e-s.oy)/s.s}}const Go=14.12127,tp=24.153276,np=49.00613,Wo=54.835693,Xo=Math.cos(52*ae.DEG2RAD);function Nm(n,e,t){const i=(n-2*t)/((tp-Go)*Xo),r=(e-2*t)/(Wo-np),s=Math.min(i,r),a=(tp-Go)*Xo*s,o=(Wo-np)*s;return{s,ox:(n-a)/2,oy:(e-o)/2}}function xb(n,e,t,i,r=10){const s=Nm(t,i,r);return[s.ox+(n-Go)*Xo*s.s,s.oy+(Wo-e)*s.s]}function vb(n,e,t,i,r=10){const s=Nm(t,i,r);return{lon:Go+(n-s.ox)/(Xo*s.s),lat:Wo-(e-s.oy)/s.s}}const qo=Math.cos(53*ae.DEG2RAD);function Fm(n,e,t){const i=(n-2*t)/((yu-rs)*qo),r=(e-2*t)/(aa-zo),s=Math.min(i,r),a=(yu-rs)*qo*s,o=(aa-zo)*s;return{s,ox:(n-a)/2,oy:(e-o)/2}}function yb(n,e,t,i,r=10){const s=Fm(t,i,r);return[s.ox+(n-rs)*qo*s.s,s.oy+(aa-e)*s.s]}function Mb(n,e,t,i,r=10){const s=Fm(t,i,r);return{lon:rs+(n-s.ox)/(qo*s.s),lat:aa-(e-s.oy)/s.s}}function rh(n,e,t,i){const r=Math.min(devicePixelRatio,2),s=n.clientWidth,a=n.clientHeight;n.width=s*r,n.height=a*r;const o=n.getContext("2d");o.scale(r,r),o.fillStyle="rgba(18, 24, 18, 0.9)",o.fillRect(0,0,s,a);for(const l of e.features)for(const c of Dm(l.geometry))for(const u of c)o.beginPath(),u.forEach(([h,d],f)=>{const[m,_]=i(h,d,s,a);f===0?o.moveTo(m,_):o.lineTo(m,_)}),o.closePath(),o.fillStyle="rgba(216, 162, 74, 0.07)",o.fill(),o.strokeStyle="rgba(243, 234, 214, 0.45)",o.lineWidth=1,o.stroke();for(const l of t){const[c,u]=i(l.lon,l.lat,s,a);o.beginPath(),o.arc(c,u,7,0,Math.PI*2),o.fillStyle=l.color,o.fill(),o.strokeStyle="#0a0e0a",o.lineWidth=2,o.stroke(),l.label&&(o.font="600 13px Georgia, serif",o.fillStyle=l.color,o.fillText(l.label,c+12,u+4))}if(t.length===2){const[l,c]=i(t[0].lon,t[0].lat,s,a),[u,h]=i(t[1].lon,t[1].lat,s,a);o.beginPath(),o.moveTo(l,c),o.lineTo(u,h),o.setLineDash([5,5]),o.strokeStyle="rgba(243, 234, 214, 0.6)",o.lineWidth=1.5,o.stroke(),o.setLineDash([])}}function Tb(n,e,t=[]){rh(n,e,t,xb)}function Sb(n,e,t=[]){rh(n,e,t,yb)}function Eb(n,e,t=[]){rh(n,e,t,gb)}function bb(n){return n.rotation.x=-Math.PI/2,n}function Ab(n){return n.rotation.y=Math.PI,n}const ga={pl:{load:cb,random:hb,draw:Tb,unproject:vb,sub:"Kliknij punkt na mapie Polski",status:"Losuję punkt w Polsce…"},eu:{load:pb,random:mb,draw:Sb,unproject:Mb,sub:"Kliknij punkt na mapie Europy",status:"Losuję punkt w Europie…"},world:{load:db,random:fb,draw:Eb,unproject:_b,sub:"Kliknij punkt na mapie świata",status:"Losuję punkt na świecie…"}},wb="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6ImdjcDBTZklXYnlGdFRENzIiLCJqdGkiOiI0MzUzYzg1OS00ZjdmLTRmMGItYWM1OS0zOTcxOThkNTA4ZGEiLCJpZCI6NDc5NzkxLCJzdWIiOiJwaGV0b24iLCJpc3MiOiJodHRwczovL2FwaS5jZXNpdW0uY29tIiwiYXVkIjoiVW50aXRsZWQiLCJpYXQiOjE3ODg0MjgyNTd9.-bN3Yy2iQwCcBFB4iHnu14FO-cr32ngrT6rQQKISXbI",jo=120,Rb="2275207",Ln={pa28:{file:Bn("models/pa28.glb"),wingspan:11,cruise:48,boost:85,brake:30,cam:[0,5.5,15],name:"Piper PA-28",desc:"Lekki śmigłowiec — zwinny · przelot ~170 km/h",sound:"plane"},q400:{file:Bn("models/q400.glb"),wingspan:28,cruise:75,boost:115,brake:45,cam:[0,9,32],name:"Dash 8 Q400",desc:"Turbośmigłowy pasażerski · przelot ~270 km/h",sound:"plane"},citation:{file:Bn("models/citation.glb"),wingspan:16,cruise:92,boost:150,brake:55,cam:[0,7,24],name:"Cessna Citation",desc:"Odrzutowiec biznesowy — szybki · przelot ~330 km/h",sound:"jet"},jet:{file:Bn("models/jet.glb"),wingspan:10,cruise:150,boost:260,brake:80,cam:[0,6,19],name:"Myśliwiec",desc:"Odrzutowiec bojowy — bardzo szybki · przelot ~540 km/h",sound:"jet",prepare:Ab},rocket:{file:Bn("models/rocket.glb"),wingspan:12,cruise:220,boost:380,brake:120,cam:[0,6,20],name:"Rakieta",desc:"Rakieta kosmiczna — ekstremalna · przelot ~790 km/h",sound:"rocket",prepare:bb}},Mo=["pa28","q400","citation","jet","rocket"],Om=600,Bm=60,Cb=600;let vt,Ct,Ft,Qe,Nt,js,Mt,Be,Rn,To=jo,Wr=!1,zr=!1,Ys=!1,Yo=null,Ki=0,Cn="pa28",ss=!0,oa=!1,Hs=!1,$o=52.38871,Ko=16.60069,Br=Ln.pa28.cam,Bt="free",an=null,ci=0,xn=!1,lr=!1,Zo=!1,ur="pl",ui=!1,$s=0,So=null,Eo=0,la=null,km=!1;const Gs=[];let er=0;const Fn={roll:0,pitch:0,throttle:0},tn=new Set,rr=new mT;rr.firstHitOnly=!0;const ip=new sT,pe={gSpeed:document.getElementById("g-speed"),gAlt:document.getElementById("g-alt"),gHdg:document.getElementById("g-hdg"),banner:document.getElementById("f-banner"),menu:document.getElementById("menu"),city:document.getElementById("city-input"),start:document.getElementById("start-btn"),menuError:document.getElementById("menu-error"),modeDesc:document.getElementById("mode-desc"),pause:document.getElementById("pause"),resume:document.getElementById("btn-resume"),restart:document.getElementById("btn-restart"),carCanvas:document.getElementById("carousel-canvas"),carPrev:document.getElementById("car-prev"),carNext:document.getElementById("car-next"),carName:document.getElementById("car-name"),carDesc:document.getElementById("car-desc"),timerBox:document.getElementById("f-timer-box"),timer:document.getElementById("f-timer"),distBox:document.getElementById("f-dist-box"),dist:document.getElementById("f-dist"),guessmap:document.getElementById("guessmap"),gmCanvas:document.getElementById("gm-canvas"),gmResult:document.getElementById("gm-result"),gmClose:document.getElementById("gm-close"),gmRetry:document.getElementById("gm-retry"),gmSub:document.getElementById("gm-sub"),guessScope:document.getElementById("guess-scope")},sh=qE(pe.carCanvas,Mo.map(n=>({key:n,file:Ln[n].file,wingspan:Ln[n].wingspan,prepare:Ln[n].prepare})));let Jo=0;function zm(n,e){Jo=(n+Mo.length)%Mo.length,Cn=Mo[Jo],sh.show(Cn,e),pe.carName.textContent=Ln[Cn].name,pe.carDesc.textContent=Ln[Cn].desc}pe.carPrev.addEventListener("click",()=>zm(Jo-1,-1));pe.carNext.addEventListener("click",()=>zm(Jo+1,1));const Pb={free:"Miasto startowe… np. Niepruszewo",home:"Twój adres… np. Jarzębinowa 5, Niepruszewo",guess:""},Lb={free:"Wpisz miasto startowe i zacznij latać bez limitu czasu.",home:"Wyrzucimy Cię ~30 km od domu i masz 10 minut, żeby odszukać drogę i dolecieć z powrotem.",guess:"Masz minutę lotu, aby rozeznać się w terenie i zaznaczyć na mapie, gdzie jesteś."};function Vm(n){Bt=n,document.querySelectorAll(".mode-card").forEach(e=>e.classList.toggle("selected",e.dataset.mode===n)),pe.modeDesc.textContent=Lb[n],pe.city.placeholder=Pb[n],pe.city.style.display=n==="guess"?"none":"",pe.guessScope.style.display=n==="guess"?"":"none",pe.menuError.textContent=""}document.querySelectorAll(".mode-card").forEach(n=>{n.addEventListener("click",()=>Vm(n.dataset.mode))});document.querySelectorAll(".scope-btn").forEach(n=>{n.addEventListener("click",()=>{ur=n.dataset.scope,document.querySelectorAll(".scope-btn").forEach(e=>e.classList.toggle("selected",e===n))})});Vm("guess");function Ib(){wm("Ładuję fotorealistyczną Polskę…",.15),Ct=new tm,Ct.background=new we(9357544),Ct.fog=new Bu(10342634,7e-5),Ft=new Ou({antialias:!0}),Ft.setClearColor(9357544),Ft.setPixelRatio(Math.min(devicePixelRatio,2)),Ft.setSize(innerWidth,innerHeight),Ft.toneMapping=4,Ft.toneMappingExposure=1.1,Ft.shadowMap.enabled=!0,Ft.shadowMap.type=2,Ft.domElement.id="game-canvas",document.body.appendChild(Ft.domElement),Ct.add(new cm(12572910,5926984,1.15)),Nt=new No(16773853,2),Nt.castShadow=!0,Nt.shadow.mapSize.set(2048,2048),Nt.shadow.camera.near=1,Nt.shadow.camera.far=2500,Nt.shadow.camera.left=-450,Nt.shadow.camera.right=450,Nt.shadow.camera.top=450,Nt.shadow.camera.bottom=-450,Nt.shadow.bias=-4e-4,Nt.shadow.normalBias=2,Ct.add(Nt),Ct.add(Nt.target),vt=new Ot(70,innerWidth/innerHeight,.5,1e8),Qe=new TS,Qe.registerPlugin(new sE({apiToken:wb,assetId:Rb,autoRefreshToken:!0})),Qe.registerPlugin(new lE),Qe.registerPlugin(new aE),Qe.registerPlugin(new PE),Qe.registerPlugin(new kE),Qe.registerPlugin(new CE({dracoLoader:new VE})),Qe.group.rotation.x=-Math.PI/2,Ct.add(Qe.group),Qe.setResolutionFromRenderer(vt,Ft),Qe.setCamera(vt),Qe.errorTarget=10,Qe.lruCache.maxSize=3e3,Qe.lruCache.maxBytesSize=15e8,Qe.addEventListener("load-error",()=>{Ys||(Yo="Cesium ion nie odpowiada — sprawdź token VITE_CESIUM_ION_KEY")}),setTimeout(()=>{!Ys&&Qe.group.children.length===0&&(Yo="Mapa nie dochodzi… sprawdź token VITE_CESIUM_ION_KEY")},2e4),js=jE(10342634),Ct.add(js.mesh),new lm().load(Bn("textures/sky_day.jpg"),n=>{n.mapping=Co,n.colorSpace=gt,Ct.environment=n}),Rn=lb(),Rn.visible=!1,Ct.add(Rn),Hm(Cn),Ks($o,Ko),window.addEventListener("resize",Db),Ft.domElement.addEventListener("webglcontextlost",n=>{n.preventDefault(),window.__ctxLost=!0}),window.__game={get planeMesh(){return Mt},get plane(){return Be},get camera(){return vt}},window.__scene=Ct}function Hm(n){const e=Ln[n];Br=e.cam,Mt&&Ct.remove(Mt),Mt=WE(),Mt.userData.key=n,Ct.add(Mt),new hs().load(e.file,t=>{const i=t.scene;e.prepare&&e.prepare(i);const r=new cn().setFromObject(i),s=r.getSize(new P);i.scale.setScalar(e.wingspan/Math.max(s.x,s.y,s.z)),r.setFromObject(i),i.position.sub(r.getCenter(new P)),i.traverse(o=>{o.isMesh&&o.material&&(o.material.metalness=.15,o.material.roughness=.65,o.castShadow=!0)});const a=new kt;a.add(i),a.userData.prop=null,a.userData.key=n,Ct.remove(Mt),Mt=a,Ct.add(Mt)})}function Ks(n,e){const t=Ln[Cn];$o=n,Ko=e;const i=Bt==="guess"?ur==="pl"?3e3:9500:6e3;Be=new XE(n,e,i,0,t),To=jo,Hs=!0,So=null,Eo=0,Wr=!1,zr=!1,er=0,Fn.roll=0,Fn.pitch=0,Tu=!1,Mt&&(Mt.visible=!0),Gb()}function Db(){vt.aspect=innerWidth/innerHeight,vt.updateProjectionMatrix(),Ft.setSize(innerWidth,innerHeight),Ft.setPixelRatio(devicePixelRatio)}function bo(n,e,t,i,r,s){const a=new ge;return or.getObjectFrame(n,e,t,i,r,s,a,sS),a.premultiply(Qe.group.matrixWorld),a}function Gm(n,e,t){const i=new P;or.getCartographicToPosition(n,e,t+100,i),i.applyMatrix4(Qe.group.matrixWorld);const r=i.clone().normalize().negate();rr.set(i,r),rr.far=t+1200;const s=rr.intersectObject(Qe.group,!0);if(s.length>0){const a={},o=s[0].point.clone();return o.applyMatrix4(Qe.group.matrixWorld.clone().invert()),or.getPositionToCartographic(o,a),a.height}return null}const rp=new P,xc=new P;function Ub(n,e){xc.copy(n).normalize().negate(),rp.copy(n).addScaledVector(xc,-600),rr.set(rp,xc),rr.far=1200;const t=rr.intersectObject(Qe.group,!0);return t.length?t[0].distance-600<e:!1}const sp=new P,ap=new P;function Nb(){const n=Ln[Cn].wingspan*.45;sp.set(1,0,0).applyQuaternion(Mu);for(const e of[-1,1])if(ap.copy(ii).addScaledVector(sp,e*n),Ub(ap,1.5))return!0;return!1}function Fb(){Wr=!0,xn=!1,Gs.push(JE(Ct,ii.clone())),QE(),er=1,Mt.visible=!1,setTimeout(()=>Su("ROZBIŁEŚ SIĘ","R — jeszcze raz"),900)}async function op(n){const e="https://nominatim.openstreetmap.org/search?format=json&limit=1&q="+encodeURIComponent(n),t=await fetch(e,{headers:{"Accept-Language":"pl"}});if(!t.ok)throw new Error("http "+t.status);const i=await t.json();return i.length?{lat:parseFloat(i[0].lat),lon:parseFloat(i[0].lon)}:null}function ah(n,e){const t=Gm(n*(Math.PI/180),e*(Math.PI/180),jo+200),i=t!==null?t:jo;km=t!==null,bo(n*(Math.PI/180),e*(Math.PI/180),i,0,0,0).decompose(Rn.position,Rn.quaternion,Rn.scale),Rn.visible=!0}async function Wm(){pe.start.disabled=!0,pe.menuError.textContent="";try{if(Bt==="free"){const n=pe.city.value.trim()||"Niepruszewo";pe.menuError.textContent=`Szukam: ${n}…`;const e=await op(n);if(!e)return ao(`Nie znaleziono miejscowości „${n}"`);vc(e.lat,e.lon)}else if(Bt==="home"){const n=pe.city.value.trim();if(!n)return ao("Wpisz swój adres");pe.menuError.textContent="Szukam adresu…";const e=await op(n);if(!e)return ao("Nie znaleziono takiego adresu");an=e;const t=ob(e.lat,e.lon,20+Math.random()*10);ci=Om,xn=!1,vc(t.lat,t.lon),ah(e.lat,e.lon)}else{const n=ga[ur];pe.menuError.textContent=n.status,la=await n.load();const e=n.random(la);ci=Bm,xn=!1,vc(e.lat,e.lon)}}catch{ao("Błąd — sprawdź sieć i spróbuj ponownie")}}function ao(n){pe.menuError.textContent=n,pe.start.disabled=!1}function vc(n,e){var t;pe.menuError.textContent="",Cn!==((t=Mt==null?void 0:Mt.userData)==null?void 0:t.key)&&Hm(Cn),Ks(n,e),pe.timerBox.classList.toggle("show",Bt!=="free"),pe.distBox.classList.toggle("show",Bt==="home"),ui=!0,$s=performance.now(),pe.menuError.textContent="Ładowanie terenu…"}function lp(){ss=!1,lr=!1,Zo=!1,pe.menu.classList.add("hidden"),pe.guessmap.classList.remove("show"),pe.menuError.textContent="",sh.setActive(!1),xn=Bt!=="free"}pe.start.addEventListener("click",()=>{Qu(),sb(),Wm()});pe.city.addEventListener("keydown",n=>{n.key==="Enter"&&Wm()});function oh(n){oa=n,tn.clear(),pe.pause.classList.toggle("show",n)}pe.resume.addEventListener("click",()=>oh(!1));pe.restart.addEventListener("click",()=>{oh(!1),Xm()});function Xm(){ss=!0,xn=!1,lr=!1,ui=!1,Rn.visible=!1,pe.guessmap.classList.remove("show"),pe.start.disabled=!1,pe.menuError.textContent="",pe.menu.classList.remove("hidden"),sh.setActive(!0)}function qm(n=[]){ga[ur].draw(pe.gmCanvas,la,n)}function Ob(){lr=!0,Zo=!1,tn.clear(),pe.gmResult.textContent="",pe.gmClose.style.display="none",pe.gmRetry.style.display="none",pe.gmSub.textContent=ga[ur].sub,pe.guessmap.classList.add("show"),requestAnimationFrame(()=>qm())}pe.gmCanvas.addEventListener("click",n=>{if(Zo)return;const e=pe.gmCanvas.getBoundingClientRect(),{lon:t,lat:i}=ga[ur].unproject(n.clientX-e.left,n.clientY-e.top,e.width,e.height),r=nh(i,t,Be.latDeg,Be.lonDeg)/1e3;Zo=!0,qm([{lat:Be.latDeg,lon:Be.lonDeg,color:"#d8a24a",label:"Tu byłeś"},{lat:i,lon:t,color:"#f3ead6",label:"Twój strzał"}]),pe.gmResult.textContent=`Różnica: ${Math.round(r)} km`,pe.gmClose.style.display="",pe.gmRetry.style.display=""});pe.gmClose.addEventListener("click",()=>{pe.guessmap.classList.remove("show"),Xm()});pe.gmRetry.addEventListener("click",()=>{pe.gmResult.textContent="Losuję nowy punkt…",pe.gmRetry.style.display="none",pe.gmClose.style.display="none",jm()});window.addEventListener("keydown",n=>{if(n.key==="Escape"){!ss&&!lr&&oh(!oa);return}if(n.target&&n.target.tagName==="INPUT"||ss||oa||lr)return;const e=n.key.toLowerCase();tn.add(e),e==="r"&&(Wr||zr)&&jm()});window.addEventListener("keyup",n=>tn.delete(n.key.toLowerCase()));function jm(){if(Bt==="home"&&an)ci=Om,xn=!1,ui=!0,$s=performance.now(),Ks($o,Ko),ah(an.lat,an.lon);else if(Bt==="guess"&&la){const n=ga[ur].random(la);ci=Bm,xn=!1,ui=!0,$s=performance.now(),Ks(n.lat,n.lon)}else ui=!0,$s=performance.now(),Ks($o,Ko)}const oo=new P,cp=new P,ii=new P,Mu=new Zt,Us=new P,Bb=new P,lo=new Zt,kb=new P,yc=new Zt,zb=new P,Vb=new P;let Tu=!1;Ib();Ym();function Ym(){var u;if(requestAnimationFrame(Ym),!Qe||!Be)return;const n=Math.min(ip.getDelta(),.05);Ki+=1,Ct.updateMatrixWorld();const e=!ss&&!oa&&!lr&&!Wr&&!zr,t=(tn.has("d")||tn.has("arrowright")?1:0)-(tn.has("a")||tn.has("arrowleft")?1:0),i=(tn.has("w")||tn.has("arrowup")?1:0)-(tn.has("s")||tn.has("arrowdown")?1:0);Fn.roll+=(t-Fn.roll)*Math.min(1,6*n),Fn.pitch+=(i-Fn.pitch)*Math.min(1,6*n),Fn.throttle=tn.has("shift")?1:tn.has("control")?-1:0,e&&Be.update(n,Fn);const r=Be.speed/Be.boost,s=Math.min(1,Math.max(.15,.3+r*.5+(Fn.throttle>0?.3:Fn.throttle<0?-.18:0)));if(tb(e,s,r,Ln[Cn].sound),rb(e),bo(Be.lat,Be.lon,Be.height,Be.heading,Be.pitch,-Be.roll).decompose(ii,Mu,Mt.scale),Mt.position.copy(ii),Mt.quaternion.copy(Mu),Mt.userData.prop&&(Mt.userData.prop.rotation.z+=Be.speed*n*1.6),bo(Be.lat,Be.lon,Be.height,Be.heading,0,0).decompose(Bb,lo,kb),Us.set(Br[0],Br[1],Br[2]).applyQuaternion(lo).add(ii),Tu?oo.lerp(Us,1-Math.exp(-14*n)):(oo.copy(Us),Tu=!0),vt.position.copy(oo),er>0){er=Math.max(0,er-n*1.3);const h=er*er*7;vt.position.x+=(Math.random()-.5)*h,vt.position.y+=(Math.random()-.5)*h,vt.position.z+=(Math.random()-.5)*h}cp.set(0,.5,-Br[2]*1.6).applyQuaternion(lo).add(ii),vt.up.set(0,1,0).applyQuaternion(lo),vt.lookAt(cp),bo(Be.lat,Be.lon,Be.height,0,0,0).decompose(zb,yc,Vb),js.mesh.position.copy(oo),js.mesh.quaternion.copy(yc),js.uniforms.uTime.value=ip.elapsedTime,Us.copy(Rm).applyQuaternion(yc),Nt.position.copy(Us).multiplyScalar(700).add(ii),Nt.target.position.copy(ii),Nt.target.updateMatrixWorld(),Ki%15===0&&Qe.group.traverse(h=>{h.isMesh&&!h.castShadow&&(h.castShadow=!0,h.receiveShadow=!0)});const l=Be.speed>Be.cruise*1.2?78:70;if(Math.abs(vt.fov-l)>.05&&(vt.fov+=(l-vt.fov)*Math.min(1,3*n),vt.updateProjectionMatrix()),Ki%8===0){const h=Gm(Be.lat,Be.lon,Be.height);h!==null&&(To=h,Hs&&(Be.height=h+(Bt==="guess"?350:320),So!==null&&Math.abs(h-So)<25&&!Qe.isLoading?Eo+=1:Eo=0,So=h,Eo>=2&&(Hs=!1,ui&&(ui=!1,lp()))))}ui&&performance.now()-$s>15e3&&(ui=!1,Hs=!1,lp());const c=Be.height-To;e&&!Hs&&(c<4||Ki%4===0&&Nb())&&Fb();for(let h=Gs.length-1;h>=0;h--)Gs[h].update(n)||Gs.splice(h,1);Rn.visible&&(Rn.userData.ring.rotation.z+=n*.8,!km&&Ki%60===0&&an&&ah(an.lat,an.lon)),xn&&!ss&&!oa&&!lr&&!Wr&&!zr&&(ci-=n,ci<=0&&(ci=0,xn=!1,Bt==="home"?(zr=!0,Su("CZAS MINĄŁ","R — spróbuj ponownie")):Bt==="guess"&&Ob())),Bt==="home"&&an&&e&&nh(Be.latDeg,Be.lonDeg,an.lat,an.lon)<Cb&&(zr=!0,xn=!1,Rn.visible=!1,Su("DOTARŁEŚ DO DOMU!","R — leć jeszcze raz")),Ki%2===0&&Hb(c),Qe.setResolutionFromRenderer(vt,Ft),Qe.setCamera(vt),vt.updateMatrixWorld(),Qe.update(),!Ys&&Qe.group.children.length>0&&(Ys=!0,GE()),Ys||wm(Yo??"Ładuję fotorealistyczną Polskę…",Yo?.05:Math.min(.9,.15+Qe.group.children.length*.02)),Ft.render(Ct,vt),window.__dbg={frame:Ki,children:Qe.group.children.length,speed:Be.speed,height:Be.height,groundAlt:To,lat:Be.latDeg,lon:Be.lonDeg,mode:Bt,timeLeft:ci,ctxLost:!!window.__ctxLost,loading:Qe.isLoading,visibleTiles:((u=Qe.visibleTiles)==null?void 0:u.size)??-1,explosions:Gs.length,crashed:Wr,audio:nb(),music:ab(),camDist:vt.position.distanceTo(ii),camOffset:Br},window.__cam=vt,window.__planeMesh=Mt}function Hb(n){const e=Math.ceil(Ln[Cn].boost*3.6/200)*200;if(pe.gSpeed&&$E(pe.gSpeed,Be.kmh,e),pe.gAlt&&KE(pe.gAlt,Math.max(0,n)),pe.gHdg&&ZE(pe.gHdg,Be.headingDeg),xn||Bt!=="free"){const t=Math.max(0,Math.ceil(ci)),i=Math.floor(t/60),r=String(t%60).padStart(2,"0");pe.timer.textContent=`${i}:${r}`,pe.timer.classList.toggle("low",t<=30&&xn)}if(Bt==="home"&&an){const t=nh(Be.latDeg,Be.lonDeg,an.lat,an.lon);pe.dist.textContent=`${(t/1e3).toFixed(1)} km`}}function Su(n,e){pe.banner&&(pe.banner.querySelector(".b-title").textContent=n,pe.banner.querySelector(".b-sub").textContent=e,pe.banner.classList.add("show"))}function Gb(){pe.banner&&pe.banner.classList.remove("show")}
