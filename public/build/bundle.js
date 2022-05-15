var app=function(){"use strict";function t(){}function e(t){return t()}function n(){return Object.create(null)}function o(t){t.forEach(e)}function c(t){return"function"==typeof t}function l(t,e){return t!=t?e==e:t!==e||t&&"object"==typeof t||"function"==typeof t}function i(t,e){t.appendChild(e)}function r(t,e,n){t.insertBefore(e,n||null)}function u(t){t.parentNode.removeChild(t)}function s(t){return document.createElement(t)}function a(t){return document.createTextNode(t)}function f(){return a(" ")}function d(){return a("")}function p(t,e,n,o){return t.addEventListener(e,n,o),()=>t.removeEventListener(e,n,o)}function m(t,e,n){null==n?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function $(t,e){e=""+e,t.wholeText!==e&&(t.data=e)}function h(t,e){t.value=null==e?"":e}function x(t,e,n){t.classList[n?"add":"remove"](e)}let k;function g(t){k=t}function v(){const t=function(){if(!k)throw new Error("Function called outside component initialization");return k}();return(e,n)=>{const o=t.$$.callbacks[e];if(o){const c=function(t,e,n=!1){const o=document.createEvent("CustomEvent");return o.initCustomEvent(t,n,!1,e),o}(e,n);o.slice().forEach((e=>{e.call(t,c)}))}}}const b=[],y=[],T=[],w=[],_=Promise.resolve();let C=!1;function E(t){T.push(t)}function q(t){w.push(t)}const A=new Set;let j=0;function O(){const t=k;do{for(;j<b.length;){const t=b[j];j++,g(t),F(t.$$)}for(g(null),b.length=0,j=0;y.length;)y.pop()();for(let t=0;t<T.length;t+=1){const e=T[t];A.has(e)||(A.add(e),e())}T.length=0}while(b.length);for(;w.length;)w.pop()();C=!1,A.clear(),g(t)}function F(t){if(null!==t.fragment){t.update(),o(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(E)}}const N=new Set;let B;function L(){B={r:0,c:[],p:B}}function P(){B.r||o(B.c),B=B.p}function D(t,e){t&&t.i&&(N.delete(t),t.i(e))}function I(t,e,n,o){if(t&&t.o){if(N.has(t))return;N.add(t),B.c.push((()=>{N.delete(t),o&&(n&&t.d(1),o())})),t.o(e)}}function S(t,e,n){const o=t.$$.props[e];void 0!==o&&(t.$$.bound[o]=n,n(t.$$.ctx[o]))}function U(t){t&&t.c()}function z(t,n,l,i){const{fragment:r,on_mount:u,on_destroy:s,after_update:a}=t.$$;r&&r.m(n,l),i||E((()=>{const n=u.map(e).filter(c);s?s.push(...n):o(n),t.$$.on_mount=[]})),a.forEach(E)}function M(t,e){const n=t.$$;null!==n.fragment&&(o(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function G(t,e){-1===t.$$.dirty[0]&&(b.push(t),C||(C=!0,_.then(O)),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function H(e,c,l,i,r,s,a,f=[-1]){const d=k;g(e);const p=e.$$={fragment:null,ctx:null,props:s,update:t,not_equal:r,bound:n(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(c.context||(d?d.$$.context:[])),callbacks:n(),dirty:f,skip_bound:!1,root:c.target||d.$$.root};a&&a(p.root);let m=!1;if(p.ctx=l?l(e,c.props||{},((t,n,...o)=>{const c=o.length?o[0]:n;return p.ctx&&r(p.ctx[t],p.ctx[t]=c)&&(!p.skip_bound&&p.bound[t]&&p.bound[t](c),m&&G(e,t)),n})):[],p.update(),m=!0,o(p.before_update),p.fragment=!!i&&i(p.ctx),c.target){if(c.hydrate){const t=function(t){return Array.from(t.childNodes)}(c.target);p.fragment&&p.fragment.l(t),t.forEach(u)}else p.fragment&&p.fragment.c();c.intro&&D(e.$$.fragment),z(e,c.target,c.anchor,c.customElement),O()}g(d)}class J{$destroy(){M(this,1),this.$destroy=t}$on(t,e){const n=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return n.push(e),()=>{const t=n.indexOf(e);-1!==t&&n.splice(t,1)}}$set(t){var e;this.$$set&&(e=t,0!==Object.keys(e).length)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}function K(e){let n,o,c;return{c(){n=s("input"),m(n,"type","checkbox"),m(n,"id","checkbox"),m(n,"class","svelte-1nk90tq")},m(t,l){r(t,n,l),o||(c=p(n,"click",e[4]),o=!0)},p:t,d(t){t&&u(n),o=!1,c()}}}function Q(e){let n,o,c;return{c(){n=s("input"),m(n,"type","checkbox"),m(n,"id","checkbox"),n.checked=!0,m(n,"class","svelte-1nk90tq")},m(t,l){r(t,n,l),o||(c=p(n,"click",e[3]),o=!0)},p:t,d(t){t&&u(n),o=!1,c()}}}function R(e){let n,c,l,d,h,x,k,g,v,b,y,T;function w(t,e){return t[1]?Q:K}let _=w(e),C=_(e);return{c(){n=s("main"),c=s("div"),C.c(),l=f(),d=s("p"),h=a(e[0]),x=f(),k=s("div"),g=s("button"),g.textContent="Edit",v=f(),b=s("button"),b.textContent="Delete",m(d,"class","svelte-1nk90tq"),m(c,"class","task svelte-1nk90tq"),m(g,"id","edit"),m(g,"class","svelte-1nk90tq"),m(b,"id","delete"),m(b,"class","svelte-1nk90tq"),m(k,"class","action svelte-1nk90tq"),m(n,"class","svelte-1nk90tq")},m(t,o){r(t,n,o),i(n,c),C.m(c,null),i(c,l),i(c,d),i(d,h),i(n,x),i(n,k),i(k,g),i(k,v),i(k,b),y||(T=[p(g,"click",e[5]),p(b,"click",e[6])],y=!0)},p(t,[e]){_===(_=w(t))&&C?C.p(t,e):(C.d(1),C=_(t),C&&(C.c(),C.m(c,l))),1&e&&$(h,t[0])},i:t,o:t,d(t){t&&u(n),C.d(),y=!1,o(T)}}}function V(t,e,n){const o=v();let{taskText:c}=e,{complete:l}=e;return t.$$set=t=>{"taskText"in t&&n(0,c=t.taskText),"complete"in t&&n(1,l=t.complete)},[c,l,o,()=>o("check",{status:document.getElementById("checkbox").checked}),()=>o("check",{status:document.getElementById("checkbox").checked}),()=>o("edit"),()=>o("remove")]}class W extends J{constructor(t){super(),H(this,t,V,R,l,{taskText:0,complete:1})}}function X(e){let n,c,l,a,d,$;return{c(){n=s("main"),c=s("input"),l=f(),a=s("button"),a.textContent="Add task",m(c,"type","text"),m(c,"name","newTask"),m(c,"class","svelte-hcw3x6"),m(a,"class","svelte-hcw3x6"),m(n,"class","svelte-hcw3x6")},m(t,o){r(t,n,o),i(n,c),h(c,e[0]),i(n,l),i(n,a),d||($=[p(c,"input",e[2]),p(a,"click",e[3])],d=!0)},p(t,[e]){1&e&&c.value!==t[0]&&h(c,t[0])},i:t,o:t,d(t){t&&u(n),d=!1,o($)}}}function Y(t,e,n){const o=v();let{newTask:c=""}=e;return t.$$set=t=>{"newTask"in t&&n(0,c=t.newTask)},[c,o,function(){c=this.value,n(0,c)},()=>o("add")]}class Z extends J{constructor(t){super(),H(this,t,Y,X,l,{newTask:0})}}function tt(e){let n,c,l,a,d,$,h,k;return{c(){n=s("main"),c=s("button"),c.textContent="All",l=f(),a=s("button"),a.textContent="Pending",d=f(),$=s("button"),$.textContent="Completed",m(c,"id","btnFilterAll"),m(c,"class","svelte-1dupnja"),x(c,"active",e[0]),m(a,"id","btnFilterPending"),m(a,"class","svelte-1dupnja"),x(a,"active",e[1]),m($,"id","btnFilterComplete"),m($,"class","svelte-1dupnja"),x($,"active",e[2]),m(n,"class","svelte-1dupnja")},m(t,o){r(t,n,o),i(n,c),i(n,l),i(n,a),i(n,d),i(n,$),h||(k=[p(c,"click",e[4]),p(a,"click",e[5]),p($,"click",e[6])],h=!0)},p(t,[e]){1&e&&x(c,"active",t[0]),2&e&&x(a,"active",t[1]),4&e&&x($,"active",t[2])},i:t,o:t,d(t){t&&u(n),h=!1,o(k)}}}function et(t,e,n){const o=v();let c=!0,l=!1,i=!1;return[c,l,i,o,t=>{o("filter",{filterType:"all"}),n(0,c=c||!c),n(1,l=!1),n(2,i=!1)},t=>{o("filter",{filterType:"pending"}),n(1,l=l||!l),n(0,c=!1),n(2,i=!1)},t=>{o("filter",{filterType:"completed"}),n(2,i=i||!i),n(1,l=!1),n(0,c=!1)}]}class nt extends J{constructor(t){super(),H(this,t,et,tt,l,{})}}function ot(e){let n,c,l,a,d,$,h,x;return{c(){n=s("main"),c=s("button"),c.textContent="Complete all",l=f(),a=s("button"),a.textContent="Uncheck all",d=f(),$=s("button"),$.textContent="Delete completed",m(c,"class","svelte-1o92esm"),m(a,"id","btnUncheckAll"),m(a,"class","svelte-1o92esm"),m($,"id","btndelcomplete"),m($,"class","svelte-1o92esm"),m(n,"class","svelte-1o92esm")},m(t,o){r(t,n,o),i(n,c),i(n,l),i(n,a),i(n,d),i(n,$),h||(x=[p(c,"click",e[1]),p(a,"click",e[2]),p($,"click",e[3])],h=!0)},p:t,i:t,o:t,d(t){t&&u(n),h=!1,o(x)}}}function ct(t){const e=v();return[e,()=>e("completeAll"),()=>e("uncheckAll"),()=>e("delCompleted")]}class lt extends J{constructor(t){super(),H(this,t,ct,ot,l,{})}}function it(t,e,n){const o=t.slice();return o[33]=e[n],o[34]=e,o[35]=n,o}function rt(t){let e,n,o=t[33].complete&&at(t);return{c(){o&&o.c(),e=d()},m(t,c){o&&o.m(t,c),r(t,e,c),n=!0},p(t,n){t[33].complete?o?(o.p(t,n),4&n[0]&&D(o,1)):(o=at(t),o.c(),D(o,1),o.m(e.parentNode,e)):o&&(L(),I(o,1,1,(()=>{o=null})),P())},i(t){n||(D(o),n=!0)},o(t){I(o),n=!1},d(t){o&&o.d(t),t&&u(e)}}}function ut(t){let e,n,o=!t[33].complete&&ft(t);return{c(){o&&o.c(),e=d()},m(t,c){o&&o.m(t,c),r(t,e,c),n=!0},p(t,n){t[33].complete?o&&(L(),I(o,1,1,(()=>{o=null})),P()):o?(o.p(t,n),4&n[0]&&D(o,1)):(o=ft(t),o.c(),D(o,1),o.m(e.parentNode,e))},i(t){n||(D(o),n=!0)},o(t){I(o),n=!1},d(t){o&&o.d(t),t&&u(e)}}}function st(t){let e,n,o,c;function l(e){t[17](e,t[33])}function i(e){t[18](e,t[33])}let r={};return void 0!==t[33].text&&(r.taskText=t[33].text),void 0!==t[33].complete&&(r.complete=t[33].complete),e=new W({props:r}),y.push((()=>S(e,"taskText",l))),y.push((()=>S(e,"complete",i))),e.$on("remove",(function(){return t[19](t[33])})),e.$on("edit",(function(){return t[20](t[33])})),e.$on("check",(function(...e){return t[21](t[33],t[34],t[35],...e)})),{c(){U(e.$$.fragment)},m(t,n){z(e,t,n),c=!0},p(c,l){t=c;const i={};!n&&4&l[0]&&(n=!0,i.taskText=t[33].text,q((()=>n=!1))),!o&&4&l[0]&&(o=!0,i.complete=t[33].complete,q((()=>o=!1))),e.$set(i)},i(t){c||(D(e.$$.fragment,t),c=!0)},o(t){I(e.$$.fragment,t),c=!1},d(t){M(e,t)}}}function at(t){let e,n,o,c;function l(e){t[27](e,t[33])}function i(e){t[28](e,t[33])}let r={};return void 0!==t[33].text&&(r.taskText=t[33].text),void 0!==t[33].complete&&(r.complete=t[33].complete),e=new W({props:r}),y.push((()=>S(e,"taskText",l))),y.push((()=>S(e,"complete",i))),e.$on("remove",(function(){return t[29](t[33])})),e.$on("edit",(function(){return t[30](t[33])})),e.$on("check",(function(...e){return t[31](t[33],t[34],t[35],...e)})),{c(){U(e.$$.fragment)},m(t,n){z(e,t,n),c=!0},p(c,l){t=c;const i={};!n&&4&l[0]&&(n=!0,i.taskText=t[33].text,q((()=>n=!1))),!o&&4&l[0]&&(o=!0,i.complete=t[33].complete,q((()=>o=!1))),e.$set(i)},i(t){c||(D(e.$$.fragment,t),c=!0)},o(t){I(e.$$.fragment,t),c=!1},d(t){M(e,t)}}}function ft(t){let e,n,o,c;function l(e){t[22](e,t[33])}function i(e){t[23](e,t[33])}let r={};return void 0!==t[33].text&&(r.taskText=t[33].text),void 0!==t[33].complete&&(r.complete=t[33].complete),e=new W({props:r}),y.push((()=>S(e,"taskText",l))),y.push((()=>S(e,"complete",i))),e.$on("remove",(function(){return t[24](t[33])})),e.$on("edit",(function(){return t[25](t[33])})),e.$on("check",(function(...e){return t[26](t[33],t[34],t[35],...e)})),{c(){U(e.$$.fragment)},m(t,n){z(e,t,n),c=!0},p(c,l){t=c;const i={};!n&&4&l[0]&&(n=!0,i.taskText=t[33].text,q((()=>n=!1))),!o&&4&l[0]&&(o=!0,i.complete=t[33].complete,q((()=>o=!1))),e.$set(i)},i(t){c||(D(e.$$.fragment,t),c=!0)},o(t){I(e.$$.fragment,t),c=!1},d(t){M(e,t)}}}function dt(t){let e,n,o,c,l;const a=[st,ut,rt],d=[];function p(t,e){return"all"==t[3]?0:"pending"==t[3]?1:"completed"==t[3]?2:-1}return~(n=p(t))&&(o=d[n]=a[n](t)),{c(){e=s("li"),o&&o.c(),c=f()},m(t,o){r(t,e,o),~n&&d[n].m(e,null),i(e,c),l=!0},p(t,l){let i=n;n=p(t),n===i?~n&&d[n].p(t,l):(o&&(L(),I(d[i],1,1,(()=>{d[i]=null})),P()),~n?(o=d[n],o?o.p(t,l):(o=d[n]=a[n](t),o.c()),D(o,1),o.m(e,c)):o=null)},i(t){l||(D(o),l=!0)},o(t){I(o),l=!1},d(t){t&&u(e),~n&&d[n].d()}}}function pt(t){let e,n,o,c,l,d,p,h,x,k,g,v,b,T,w,_,C,E,A,j,O,F,N,B,G;function H(e){t[11](e)}let J={};void 0!==t[4]&&(J.newTask=t[4]),d=new Z({props:J}),y.push((()=>S(d,"newTask",H))),d.$on("add",t[12]),g=new nt({}),g.$on("filter",t[13]),w=new lt({}),w.$on("completeAll",t[14]),w.$on("uncheckAll",t[15]),w.$on("delCompleted",t[16]);let K=t[2],Q=[];for(let e=0;e<K.length;e+=1)Q[e]=dt(it(t,K,e));const R=t=>I(Q[t],1,1,(()=>{Q[t]=null}));return{c(){e=s("main"),n=s("div"),o=s("div"),c=s("h1"),c.textContent="Todo",l=f(),U(d.$$.fragment),h=f(),x=s("h2"),x.textContent="Filters",k=f(),U(g.$$.fragment),v=f(),b=s("h2"),b.textContent="Other Actions",T=f(),U(w.$$.fragment),_=f(),C=s("div"),E=s("h2"),A=a(t[1]),j=a(" of "),O=a(t[0]),F=a(" Tasks completed"),N=f(),B=s("ul");for(let t=0;t<Q.length;t+=1)Q[t].c();m(o,"class","leftpane svelte-1dk262r"),m(B,"class","svelte-1dk262r"),m(C,"class","rightpane svelte-1dk262r"),m(n,"class","container svelte-1dk262r"),m(e,"class","svelte-1dk262r")},m(t,u){r(t,e,u),i(e,n),i(n,o),i(o,c),i(o,l),z(d,o,null),i(o,h),i(o,x),i(o,k),z(g,o,null),i(o,v),i(o,b),i(o,T),z(w,o,null),i(n,_),i(n,C),i(C,E),i(E,A),i(E,j),i(E,O),i(E,F),i(C,N),i(C,B);for(let t=0;t<Q.length;t+=1)Q[t].m(B,null);G=!0},p(t,e){const n={};if(!p&&16&e[0]&&(p=!0,n.newTask=t[4],q((()=>p=!1))),d.$set(n),(!G||2&e[0])&&$(A,t[1]),(!G||1&e[0])&&$(O,t[0]),204&e[0]){let n;for(K=t[2],n=0;n<K.length;n+=1){const o=it(t,K,n);Q[n]?(Q[n].p(o,e),D(Q[n],1)):(Q[n]=dt(o),Q[n].c(),D(Q[n],1),Q[n].m(B,null))}for(L(),n=K.length;n<Q.length;n+=1)R(n);P()}},i(t){if(!G){D(d.$$.fragment,t),D(g.$$.fragment,t),D(w.$$.fragment,t);for(let t=0;t<K.length;t+=1)D(Q[t]);G=!0}},o(t){I(d.$$.fragment,t),I(g.$$.fragment,t),I(w.$$.fragment,t),Q=Q.filter(Boolean);for(let t=0;t<Q.length;t+=1)I(Q[t]);G=!1},d(t){t&&u(e),M(d),M(g),M(w),function(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}(Q,t)}}}function mt(t,e,n){let o=1,c=0,l=[{id:0,text:"This is a Todo",complete:!1}],i="all",r="";function u(t){r.length>0&&(l.push({id:o,text:r,complete:!1}),n(0,o+=1),n(2,l))}function s(t){null!=t&&(l.splice(l.indexOf(l.find((e=>e.id==t))),1),n(2,l),n(0,o-=1))}function a(t){if(null!=t){let e=prompt("Enter new text");null!=e&&n(2,l[l.indexOf(l.find((e=>e.id==t)))].text=e,l)}}function f(){l.forEach((t=>{t.complete=!0})),n(2,l)}function d(){l.forEach((t=>{t.complete=!1})),n(2,l)}function p(){for(let t=l.length-1;t>=0;t--)l[t].complete&&s(l[t].id);n(2,l)}return t.$$.update=()=>{var e;4&t.$$.dirty[0]&&(e=l,n(1,c=0),e.forEach((t=>{t.complete&&n(1,c+=1)}))),2&t.$$.dirty[0]&&n(1,c),1&t.$$.dirty[0]&&n(0,o)},[o,c,l,i,r,u,s,a,f,d,p,function(t){r=t,n(4,r)},()=>u(),t=>{n(3,i=t.detail.filterType),n(2,l)},()=>f(),()=>d(),()=>p(),function(e,o){t.$$.not_equal(o.text,e)&&(o.text=e,n(2,l))},function(e,o){t.$$.not_equal(o.complete,e)&&(o.complete=e,n(2,l))},t=>s(t.id),t=>a(t.id),(t,e,o,c)=>{n(2,e[o].complete=!t.complete,l)},function(e,o){t.$$.not_equal(o.text,e)&&(o.text=e,n(2,l))},function(e,o){t.$$.not_equal(o.complete,e)&&(o.complete=e,n(2,l))},t=>s(t.id),t=>a(t.id),(t,e,o,c)=>{n(2,e[o].complete=!t.complete,l)},function(e,o){t.$$.not_equal(o.text,e)&&(o.text=e,n(2,l))},function(e,o){t.$$.not_equal(o.complete,e)&&(o.complete=e,n(2,l))},t=>s(t.id),t=>a(t.id),(t,e,o,c)=>{n(2,e[o].complete=!t.complete,l)}]}return new class extends J{constructor(t){super(),H(this,t,mt,pt,l,{},null,[-1,-1])}}({target:document.body})}();
//# sourceMappingURL=bundle.js.map
