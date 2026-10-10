(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))i(n);new MutationObserver(n=>{for(const o of n)if(o.type==="childList")for(const d of o.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&i(d)}).observe(document,{childList:!0,subtree:!0});function s(n){const o={};return n.integrity&&(o.integrity=n.integrity),n.referrerPolicy&&(o.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?o.credentials="include":n.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function i(n){if(n.ep)return;n.ep=!0;const o=s(n);fetch(n.href,o)}})();/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const V=(e,t,s=[])=>{const i=document.createElementNS("http://www.w3.org/2000/svg",e);return Object.keys(t).forEach(n=>{i.setAttribute(n,String(t[n]))}),s.length&&s.forEach(n=>{const o=V(...n);i.appendChild(o)}),i};var te=([e,t,s])=>V(e,t,s);/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const se=e=>Array.from(e.attributes).reduce((t,s)=>(t[s.name]=s.value,t),{}),ne=e=>typeof e=="string"?e:!e||!e.class?"":e.class&&typeof e.class=="string"?e.class.split(" "):e.class&&Array.isArray(e.class)?e.class:"",ae=e=>e.flatMap(ne).map(s=>s.trim()).filter(Boolean).filter((s,i,n)=>n.indexOf(s)===i).join(" "),ie=e=>e.replace(/(\w)(\w*)(_|-|\s*)/g,(t,s,i)=>s.toUpperCase()+i.toLowerCase()),D=(e,{nameAttr:t,icons:s,attrs:i})=>{var y;const n=e.getAttribute(t);if(n==null)return;const o=ie(n),d=s[o];if(!d)return console.warn(`${e.outerHTML} icon name was not found in the provided icons object.`);const g=se(e),[c,b,a]=d,l={...b,"data-lucide":n,...i,...g},p=ae(["lucide",`lucide-${n}`,g,i]);p&&Object.assign(l,{class:p});const L=te([c,l,a]);return(y=e.parentNode)==null?void 0:y.replaceChild(L,e)};/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const v={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"};/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const oe=["svg",v,[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4"}],["path",{d:"M10 9H8"}],["path",{d:"M16 13H8"}],["path",{d:"M16 17H8"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ce=["svg",v,[["path",{d:"M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"}],["path",{d:"M9 18c-4.51 2-5-2-7-2"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const re=["svg",v,[["polygon",{points:"6 3 20 12 6 21 6 3"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const le=["svg",v,[["path",{d:"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"}],["path",{d:"M3 3v5h5"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const de=["svg",v,[["path",{d:"M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"}],["path",{d:"M20 3v4"}],["path",{d:"M22 5h-4"}],["path",{d:"M4 17v2"}],["path",{d:"M5 18H3"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const pe=["svg",v,[["circle",{cx:"12",cy:"12",r:"10"}],["circle",{cx:"12",cy:"12",r:"6"}],["circle",{cx:"12",cy:"12",r:"2"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ue=["svg",v,[["path",{d:"M3 6h18"}],["path",{d:"M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"}],["path",{d:"M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"}],["line",{x1:"10",x2:"10",y1:"11",y2:"17"}],["line",{x1:"14",x2:"14",y1:"11",y2:"17"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const he=["svg",v,[["path",{d:"m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72"}],["path",{d:"m14 7 3 3"}],["path",{d:"M5 6v4"}],["path",{d:"M19 14v4"}],["path",{d:"M10 2v2"}],["path",{d:"M7 8H3"}],["path",{d:"M21 16h-4"}],["path",{d:"M11 3H9"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const me=({icons:e={},nameAttr:t="data-lucide",attrs:s={}}={})=>{if(!Object.values(e).length)throw new Error(`Please provide an icons object.
If you want to use all the icons you can import it like:
 \`import { createIcons, icons } from 'lucide';
lucide.createIcons({icons});\``);if(typeof document>"u")throw new Error("`createIcons()` only works in a browser environment.");const i=document.querySelectorAll(`[${t}]`);if(Array.from(i).forEach(n=>D(n,{nameAttr:t,icons:e,attrs:s})),t==="data-lucide"){const n=document.querySelectorAll("[icon-name]");n.length>0&&(console.warn("[Lucide] Some icons were found with the now deprecated icon-name attribute. These will still be replaced for backwards compatibility, but will no longer be supported in v1.0 and you should switch to data-lucide"),Array.from(n).forEach(o=>D(o,{nameAttr:"icon-name",icons:e,attrs:s})))}},O=[{title:"Agent 方案",eyebrow:"故意留有逻辑缺口",text:`我们计划上线一个多智能体客服系统。这个方案能够显著提升效率，帮助团队实现降本增效，因此值得马上推广。

系统会把问题分给多个 Agent，再由主 Agent 汇总答案。由于使用了先进的模型，用户体验会明显变好，整个流程也会更加智能。

我们已经验证了这个方向是可行的。测试结果很好，说明产品具备大规模上线的条件。不过目前没有记录具体的测试样本、失败案例和人工复核标准。

另外，客服团队需要先学习新的工作方式。这意味着项目上线后大家会更高效。它可以解决历史遗留问题，也能进一步赋能业务增长。`},{title:"产品复盘",eyebrow:"适合检查复盘结论",text:`本次活动整体表现不错，用户反馈也比较积极。我们因此认为新的推荐策略是有效的。

活动期间新增注册用户 12,400 人，较上期增长 18%。转化率从 3.1% 升到 3.8%，但样本只覆盖周末两天，且没有拆分自然流量与投放流量。

下一步应该继续扩大投放规模。这个结论还需要补充成本、留存和不同渠道的对照数据，否则很难判断增长来自策略还是流量结构变化。`},{title:"技术文档",eyebrow:"适合检查步骤与因果",text:`为了让服务更稳定，我们将缓存时间调整为五分钟。部署完成后错误率下降了，因此这个改动解决了稳定性问题。

当缓存失效时，请求会直接访问数据库。这里需要注意，数据库连接池必须保持在合理范围内，否则会出现新的瓶颈。

如果发现接口变慢，可以适当增加缓存。这样能够保证系统始终稳定，并且可以全面提升所有用户的访问体验。`}],ve=new Set("我们 你们 他们 这个 那个 以及 但是 因为 所以 如果 可以 需要 进行 实现 通过 对于 其中 相关 一个 一种 已经 将会 目前 项目 系统 用户 产品 方案".split(" ")),ge=["显著","明显","积极","先进","智能","高效","全面","充分","极大","持续","进一步","赋能","降本增效","比较不错","大规模","体验变好","始终稳定"],fe=["能够","可以","值得","证明","说明","表明","有效","可行","解决","提升","改善","保证","意味着","因此","所以","导致","结论"],be=["测试","结果","数据","样本","日志","指标","用户","反馈","实验","对照","记录","覆盖","%","人","次","ms","秒"],E=["因为","由于","因此","所以","从而","导致","说明","表明","意味着","换言之","也就是说"],ye=["这","它","其","该","上述","这一"],we=O[0],K=document.querySelector("#app");if(!K)throw new Error("App root not found");K.innerHTML=`
  <div class="app-shell">
    <header class="topbar">
      <a class="brand" href="./" aria-label="LogicLint 首页">
        <span class="brand-mark" aria-hidden="true"><span></span><span></span><span></span></span>
        <span>LOGIC<span class="brand-accent">LINT</span></span>
      </a>
      <div class="topbar-meta">
        <span class="release-tag">v0.1 playground</span>
        <span class="topbar-divider" aria-hidden="true"></span>
        <a href="https://github.com/LKRCharon/logiclint" target="_blank" rel="noreferrer" class="icon-link" aria-label="在 GitHub 查看 LogicLint" data-tooltip="GitHub"><i data-lucide="github"></i></a>
      </div>
    </header>

    <main>
      <section class="intro-band" aria-labelledby="page-title">
        <div class="intro-copy">
          <div class="kicker"><span class="status-dot"></span> BROWSER-ONLY · NO API KEY</div>
          <h1 id="page-title">给 AI 输出<br /><em>跑一次逻辑单测。</em></h1>
          <p>LogicLint 把段落、观点、依据和推理桥接拆开检查。先找出哪里没说清楚，再决定怎么改。</p>
        </div>
        <div class="intro-note">
          <span class="note-label">本次检查</span>
          <strong>启发式提示</strong>
          <span>结果用于定位风险，不能替代人工判断。</span>
        </div>
      </section>

      <section class="workbench" aria-label="LogicLint 工作台">
        <section class="panel editor-panel" aria-labelledby="editor-title">
          <div class="panel-head">
            <div>
              <div class="eyebrow">01 / INPUT</div>
              <h2 id="editor-title">放入一段文字</h2>
            </div>
            <div class="editor-actions">
              <label class="select-wrap" for="example-select">
                <span class="sr-only">选择示例</span>
                <select id="example-select" aria-label="选择示例"></select>
              </label>
              <button class="text-button" id="clear-button" type="button"><i data-lucide="trash-2"></i> 清空</button>
            </div>
          </div>
          <div class="editor-frame">
            <div class="editor-gutter" id="editor-gutter" aria-hidden="true"></div>
            <textarea id="text-input" spellcheck="false" aria-label="待检查的文本"></textarea>
          </div>
          <div class="editor-foot">
            <span id="char-count">0 字</span>
            <span class="keyboard-hint"><kbd>⌘</kbd><span>↵</span> 检查</span>
          </div>
          <button class="run-button" id="run-button" type="button"><i data-lucide="play"></i><span>检查逻辑</span><kbd>⌘ ↵</kbd></button>
          <div class="sample-strip">
            <i data-lucide="sparkles"></i>
            <span>不知道从哪里开始？载入一个带问题的示例，看看它是怎么被拆开的。</span>
          </div>
        </section>

        <section class="panel results-panel" aria-labelledby="results-title">
          <div class="panel-head results-head">
            <div>
              <div class="eyebrow">02 / REPORT</div>
              <h2 id="results-title">逻辑报告</h2>
            </div>
            <span class="run-state" id="run-state"><span class="state-dot"></span> 已检查</span>
          </div>
          <div class="score-row">
            <div class="score-number"><span id="score-value">--</span><small>/ 100</small></div>
            <div class="score-copy"><strong id="score-label">等待文本</strong><span id="score-description">载入一段文字后开始检查</span></div>
          </div>
          <div class="score-track" aria-hidden="true"><span id="score-track-fill"></span></div>
          <div class="metric-grid" aria-label="检查指标">
            <div class="metric"><span>段落</span><strong id="paragraph-count">0</strong></div>
            <div class="metric"><span>观点</span><strong id="claim-count">0</strong></div>
            <div class="metric"><span>依据</span><strong id="evidence-count">0</strong></div>
            <div class="metric"><span>桥接词</span><strong id="bridge-count">0</strong></div>
          </div>
          <div class="section-rule"></div>
          <div class="issues-heading"><h3>需要回看的地方</h3><span id="issue-count">0 个提示</span></div>
          <div class="issues-list" id="issues-list" aria-live="polite"></div>
          <div class="empty-results" id="empty-results" hidden>
            <i data-lucide="target"></i>
            <strong>还没有检查结果</strong>
            <span>把文本放进左侧，报告会在这里出现。</span>
          </div>
        </section>
      </section>

      <section class="lower-grid">
        <section class="panel source-panel" aria-labelledby="source-title">
          <div class="panel-head compact-head">
            <div><div class="eyebrow">03 / TRACE</div><h2 id="source-title">逐段定位</h2></div>
            <span class="panel-meta">点击提示可跳到这里</span>
          </div>
          <div class="source-preview" id="source-preview"></div>
        </section>
        <section class="panel map-panel" aria-labelledby="map-title">
          <div class="panel-head compact-head">
            <div><div class="eyebrow">04 / MAP</div><h2 id="map-title">论证关系</h2></div>
            <span class="panel-meta">claim → evidence → bridge</span>
          </div>
          <div class="argument-map" id="argument-map"></div>
          <div class="map-legend"><span><i class="legend-dot claim-dot"></i>观点</span><span><i class="legend-dot evidence-dot"></i>依据</span><span><i class="legend-dot bridge-dot"></i>桥接</span></div>
        </section>
      </section>
    </main>

    <footer class="footer">
      <span>LogicLint 是一个公开的早期实验项目。</span>
      <a href="https://github.com/LKRCharon/logiclint" target="_blank" rel="noreferrer">在 GitHub 参与迭代 <i data-lucide="github"></i></a>
    </footer>
  </div>
`;me({icons:{FileText:oe,Github:ce,Play:re,RotateCcw:le,Sparkles:de,Target:pe,Trash2:ue,WandSparkles:he}});function r(e){const t=document.querySelector(e);if(!t)throw new Error(`Missing UI element: ${e}`);return t}const u=r("#text-input"),M=r("#example-select"),Le=r("#run-button"),xe=r("#clear-button"),Ee=r("#char-count"),U=r("#editor-gutter"),T=r("#issues-list"),Me=r("#empty-results"),H=r("#source-preview"),_=r("#argument-map"),Se=r("#score-value"),$e=r("#score-label"),Ce=r("#score-description"),G=r("#score-track-fill"),ke=r("#issue-count"),Ae=r("#paragraph-count"),Ne=r("#claim-count"),Te=r("#evidence-count"),He=r("#bridge-count"),Oe=r("#run-state");O.forEach((e,t)=>{const s=document.createElement("option");s.value=String(t),s.textContent=`${e.title} · ${e.eyebrow}`,M.append(s)});function Ie(e){return e.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}function x(e){return(e.match(/[\u4e00-\u9fff]{2,}|[A-Za-z]{3,}|\d+(?:\.\d+)?%?/g)??[]).map(t=>t.toLowerCase()).filter(t=>!ve.has(t))}function m(e,t){return t.some(s=>e.includes(s))}function z(e){return e.replace(/\r\n?/g,`
`).split(/\n\s*\n/).map(t=>t.trim()).filter(Boolean)}function Pe(e){return e.split(new RegExp("(?<=[。！？!?；;])")).map(t=>t.trim()).filter(Boolean)}function W(e){return[...new Set(e)]}function F(e){const t=z(e),s=[],i=[],n=new Map;t.forEach((a,l)=>{const p=Pe(a),L=p[0]??a,y=m(a,fe)||/[。！？]$/.test(a),S=m(a,be)||/\d/.test(a),$=m(a,E),Q=x(a).length>=4,X=S&&$?"mixed":S?"evidence":y&&$?"bridge":"claim",C=[],f=(h,A,w,q,N,ee)=>{const B={id:`${h}-${l}-${C.length}`,paragraphIndex:l,kind:h,severity:A,label:w,title:q,detail:N,suggestion:ee};C.push(B),s.push(B)};y&&!S&&(p.length===1||m(a,["因此","所以","说明","表明","值得","有效","可行"]))&&f("evidence","high","依据缺口","结论先到了，依据还没出现","这段用了“因此 / 有效 / 可行”一类结论词，但读者找不到可以核验的样本、指标或观察对象。","补一个具体对象：测了什么、和谁比、结果是多少？"),$&&!m(a,["因为","由于","基于","根据","实验","数据","结果","样本","日志","对照"])&&f("causal","high","推理跳步","桥接词把两件事直接连上了","“因此 / 所以 / 说明”后面给出了结论，但中间少了能解释关系的事实或条件。","把中间那一步写出来：这个事实为什么足以支持后面的判断？");const R=W(ge.filter(h=>a.includes(h)));R.length>0&&f("vague","medium","空泛表达",`“${R.slice(0,2).join("、")}”需要落地`,"这些词表达了方向，却没有说明范围、指标或限制条件。","替换成可观察的动作或数字，必要时补充边界。");const j=W(ye.filter(h=>new RegExp(`(^|[。！？!?；;])\\s*${Ie(h)}`).test(a)));if(j.length>0&&l===0&&f("pronoun","low","指代不明",`“${j[0]}”没有明确指向`,"段首直接使用代词，读者还没有足够上下文判断它指的是哪个对象。","把代词换成名词，或把它放到已经出现过的对象之后。"),p.length>=3){const h=new Set(x(L)),A=p.slice(1).map(w=>x(w).filter(N=>h.has(N)).length);Q&&A.filter(w=>w===0).length>=2&&f("drift","medium","主题漂移","这段里混了两个以上的主题","前后句没有共享足够的关键名词，读者需要自己猜它们为什么放在同一段。","拆成两个段落，或在转折处补一句主题关系。")}const k=x(L).slice(0,6).join("|");if(k.length>8){const h=n.get(k);h!==void 0?f("duplicate","low","结论重复","前面已经说过相近的结论",`这段的开头和第 ${h+1} 段使用了相近的关键词，但没有增加新的依据。`,"保留一次结论，把新增信息改成证据、限制或下一步。"):n.set(k,l)}i.push({index:l,text:a,sentences:p,role:X,issues:C})});const o=i.filter(a=>a.role==="claim"||a.role==="bridge"||a.role==="mixed").length,d=i.filter(a=>a.role==="evidence"||a.role==="mixed").length,g=i.filter(a=>a.role==="bridge"||a.role==="mixed"||m(a.text,E)).length,c=s.reduce((a,l)=>a+(l.severity==="high"?13:l.severity==="medium"?8:4),0),b=t.length===0?0:Math.max(38,Math.min(98,100-c));return{paragraphs:i,issues:s,score:b,claims:o,evidence:d,bridges:g}}function I(){const e=Math.max(1,u.value.split(`
`).length);U.innerHTML=Array.from({length:e},(t,s)=>`<span>${String(s+1).padStart(2,"0")}</span>`).join(""),Ee.textContent=`${u.value.replace(/\s/g,"").length.toLocaleString("zh-CN")} 字`}function Re(e){return e==="evidence"?"依据":e==="bridge"?"桥接":e==="mixed"?"混合":"观点"}function je(e){if(T.innerHTML="",ke.textContent=`${e.issues.length} 个提示`,Me.hidden=e.issues.length>0,e.issues.length===0){const t=document.createElement("div");t.className="all-clear",t.innerHTML='<span class="all-clear-icon">✓</span><strong>暂时没有明显缺口</strong><span>仍建议人工通读，启发式检查只负责提醒。</span>',T.append(t);return}e.issues.forEach(t=>{var i;const s=document.createElement("article");s.className=`issue-item severity-${t.severity}`,s.innerHTML=`<div class="issue-topline"><span class="issue-label"><i class="issue-icon"></i>${t.label}</span><span class="issue-location">P${t.paragraphIndex+1}</span></div><h4>${t.title}</h4><p>${t.detail}</p><div class="issue-suggestion"><span>建议</span>${t.suggestion}</div><button class="locate-button" type="button" data-paragraph="${t.paragraphIndex}">定位原文 <span aria-hidden="true">↗</span></button>`,(i=s.querySelector(".locate-button"))==null||i.addEventListener("click",()=>Z(t.paragraphIndex)),T.append(s)})}function qe(e){if(H.innerHTML="",e.paragraphs.length===0){H.innerHTML='<div class="source-empty">检查结果会按段落显示在这里。</div>';return}e.paragraphs.forEach(t=>{const s=document.createElement("article");s.className=`source-item ${t.issues.length>0?"has-issues":""}`,s.id=`paragraph-${t.index}`;const i=t.issues.length>0?`<span class="source-issues">${t.issues.length} 个提示</span>`:'<span class="source-ok">结构清楚</span>';s.innerHTML=`<div class="source-index">P${String(t.index+1).padStart(2,"0")}</div><div class="source-body"><div class="source-meta"><span class="role-pill role-${t.role}">${Re(t.role)}</span>${i}</div><p></p></div>`,s.querySelector("p").textContent=t.text,H.append(s)})}function Be(e){var d,g;_.innerHTML="";const t=e.paragraphs.find(c=>c.role==="claim"||c.role==="bridge"||c.role==="mixed"),s=e.paragraphs.find(c=>c.role==="evidence"||c.role==="mixed"),i=e.paragraphs.find(c=>c.role==="bridge"||c.role==="mixed"||m(c.text,E)),n=[{type:"claim",label:"观点",text:t?`P${t.index+1} · ${((d=t.sentences[0])==null?void 0:d.slice(0,32))??""}`:"等待观点"},{type:"evidence",label:"依据",text:s?`P${s.index+1} · ${((g=s.sentences[0])==null?void 0:g.slice(0,32))??""}`:"还没有具体依据"},{type:"bridge",label:"桥接",text:i?`P${i.index+1} · ${m(i.text,E)?"发现因果或结论连接词":"需要补充推理步骤"}`:"等待推理关系"}],o=document.createElement("div");o.className="map-flow",n.forEach((c,b)=>{const a=document.createElement("button");a.className=`map-node map-${c.type}`,a.type="button",a.innerHTML=`<span class="map-node-label">${c.label}</span><strong></strong>`,a.querySelector("strong").textContent=c.text;const l=c.type==="claim"?t:c.type==="evidence"?s:i;if(l&&a.addEventListener("click",()=>Z(l.index)),o.append(a),b<n.length-1){const p=document.createElement("span");p.className="map-arrow",p.setAttribute("aria-hidden","true"),p.textContent="→",o.append(p)}}),_.append(o)}function Y(e){Se.textContent=e.score===0?"--":String(e.score),G.style.width=`${e.score}%`,G.dataset.score=String(e.score),$e.textContent=e.score>=85?"结构基本稳":e.score>=65?"有几处要补":"建议重看推理",Ce.textContent=e.issues.length===0?"没有发现明显的结构缺口":`${e.issues.length} 个位置值得回看`,Ae.textContent=String(e.paragraphs.length),Ne.textContent=String(e.claims),Te.textContent=String(e.evidence),He.textContent=String(e.bridges),Oe.innerHTML='<span class="state-dot"></span> 已检查',je(e),qe(e),Be(e)}function Z(e){var n;const t=document.querySelector(`#paragraph-${e}`);t==null||t.scrollIntoView({behavior:"smooth",block:"center"}),t==null||t.classList.remove("flash"),window.setTimeout(()=>t==null?void 0:t.classList.add("flash"),20);const s=z(u.value),i=s.slice(0,e).reduce((o,d)=>o+d.length+2,0);u.focus(),u.setSelectionRange(i,i+(((n=s[e])==null?void 0:n.length)??0))}function P(){const e=F(u.value);Y(e)}function J(e){const t=O[e]??we;u.value=t.text,M.value=String(e),I(),P()}u.addEventListener("input",I);u.addEventListener("scroll",()=>{U.scrollTop=u.scrollTop});M.addEventListener("change",()=>J(Number(M.value)));Le.addEventListener("click",P);xe.addEventListener("click",()=>{u.value="",I(),Y(F("")),u.focus()});u.addEventListener("keydown",e=>{(e.metaKey||e.ctrlKey)&&e.key==="Enter"&&(e.preventDefault(),P())});J(0);
