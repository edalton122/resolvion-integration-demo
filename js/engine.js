/* Stage engine: stepper, paths, deep links, guided taps, keyboard, presenter notes. */
(function () {
  const D = window.PC, A = window.Acts, C = window.Console, S = window.Screens;
  const B = D.brand, P = D.pages;
  const ALL = A.steps;
  const chapterById = Object.fromEntries(A.chapters.map((c) => [c.id, c]));
  const esc = C.esc;
  const NOTES = window.NOTES || null;
  /* A note is a string, or { say, clicks: [..], care } */
  const noteHtml = (n) => {
    if (!n) return `<div class="tk-say"></div>`;
    if (typeof n === "string") n = { say: n };
    const clicks = n.clicks ? `<span class="nt-clicks"><b>Clicks</b>${n.clicks.map((c, i) => `<span><i>${i + 1}</i>${esc(c)}</span>`).join("")}</span>` : "";
    const care = n.care ? `<span class="nt-care"><b>Careful</b>${esc(n.care)}</span>` : "";
    return `<div class="tk-say"><span class="nt-say">${esc(n.say || "")}</span>${clicks || care ? `<span class="nt-row">${clicks}${care}</span>` : ""}</div>`;
  };

  const state = { path: "short", i: 0, pending: null, done: false };
  /* Per-step short flag: each step declares if it's on the short path. */
  const inPath = (s) => state.path === "full" || !!s.short;

  const app = document.getElementById("app");
  app.innerHTML = `
    <header class="top">
      <a class="top-logo" data-go="hero" title="Back to start"><img src="${B.logo}" alt="${esc(B.name)}"/></a>
      <div class="top-title"><b>${esc(B.topTitle)}</b><span>${esc(B.topSub)}</span></div>
      <nav class="stepper" id="stepper"></nav>
    </header>
    <section class="talk" id="talk"></section>
    <main class="stage" id="stage">
      <section class="left" id="left"></section>
      <section class="right" id="right"></section>
      <div class="vignette" id="vignette" hidden></div>
    </main>
    <main class="page" id="page" hidden></main>
    <footer class="foot"><span>${esc(D.meta.disclaimer)}</span><span class="foot-tag">${esc(B.tagline)}</span><span class="foot-keys">\u2190 \u2192 step \u00b7 1\u20138 jump \u00b7 R reset${NOTES ? " \u00b7 N notes" : ""}</span></footer>`;

  const $ = (id) => document.getElementById(id);
  const left = $("left"), talk = $("talk"), stage = $("stage"), page = $("page");
  C.init($("right"));
  if (/[?&]exec\b/.test(location.search)) { const d = document.querySelector('.cx-depth [data-depth="exec"]'); if (d) d.click(); }

  /* ------------------------------------------------------------ stepper */
  /* Only numbered chapters 1-8 appear in the stepper. */
  const stepperChapters = A.chapters.filter((c) => c.n);

  function renderStepper() {
    const cur = ALL[state.i];
    $("stepper").innerHTML = stepperChapters
      .map((c) => {
        const on = c.id === cur.act;
        const stepsInChapter = ALL.filter((s) => s.act === c.id);
        const off = stepsInChapter.length && !stepsInChapter.some((s) => inPath(s));
        return `<button class="st ${on ? "on" : ""} ${off ? "off" : ""}" data-act="${c.id}" title="${esc(c.question || c.title)}"><i>${c.n}</i>${esc(c.title)}</button>`;
      })
      .join("");
  }

  /* Story clock, persona ownership and labels all come from customer.js. */
  const CLOCKS = D.story.clocks;
  const CHAPTER_PERSONA = D.story.chapterPersona;
  const STEP_PERSONA = D.story.stepPersona;
  const stepPersona = (s) => STEP_PERSONA[s.id] || CHAPTER_PERSONA[s.act];
  const PERSONA_LABELS = Object.fromEntries(D.personas.map((p) => [p.id, p.chip || p.name]));
  const PERSONA_COLORS = Object.fromEntries(D.personas.map((p) => [p.id, p.color]));

  function renderTalk() {
    const s = ALL[state.i];
    const ch = chapterById[s.act];
    const seq = ALL.filter((x) => inPath(x) || x === s);
    const pos = seq.indexOf(s) + 1;
    const persona = stepPersona(s);
    const clock = CLOCKS[s.id] || "";
    const q = ch && ch.question ? ch.question : "";
    const chLabel = ch && ch.n ? `Chapter ${ch.n} \u00b7 ${ch.title}` : ch ? ch.title : "";
    const notShort = !inPath(s) && s.act !== "hero" && s.act !== "today" && s.act !== "arch" && s.act !== "wrap" && s.act !== "close";

    talk.innerHTML = `
      <div class="tk-l">
        <div class="tk-act">
          ${chLabel ? `<span class="tk-ch">${esc(chLabel)}</span>` : ""}
          ${q ? `<span class="tk-q">${esc(q)}</span>` : ""}
          ${notShort ? '<span class="tk-off">Full run only</span>' : ""}
        </div>
        <div class="tk-title">${/^\d/.test(s.id) ? `<span class="tk-id">${s.id}</span>` : ""}${esc(s.title)}</div>
        ${NOTES ? noteHtml(NOTES[s.id]) : ""}
      </div>
      <div class="tk-r">
        <div class="tk-chips">
          ${persona ? `<span class="chip-persona" style="--pc:${PERSONA_COLORS[persona]}">${esc(PERSONA_LABELS[persona])}</span>` : ""}
          ${clock ? `<span class="chip-clock">\u23f1 ${esc(clock)}</span>` : ""}
          ${(s.powered || []).map((p) => `<span class="chip">${esc(p)}</span>`).join("")}
        </div>
        <div class="tk-nav">
          <div class="seg"><button data-path="short" class="${state.path === "short" ? "on" : ""}">Short path</button><button data-path="full" class="${state.path === "full" ? "on" : ""}">Full run</button></div>
          ${NOTES ? `<button class="ghost ${document.body.classList.contains("notes-off") ? "" : "on"}" id="btnNotes" title="Show or hide presenter notes (N)">Notes</button>` : ""}
          <button class="ghost" id="btnReset" title="Replay this step (R)">Reset</button>
          <span class="tk-sep"></span>
          <button class="ghost" id="btnPrev" ${state.i === 0 ? "disabled" : ""}>\u2190 Back</button>
          <span class="tk-pos">${pos} / ${seq.length}</span>
          <button class="primary" id="btnNext" ${nextIndex() < 0 ? "disabled" : ""}>Next \u2192</button>
        </div>
      </div>`;
    $("btnPrev").onclick = prev;
    $("btnNext").onclick = next;
    $("btnReset").onclick = () => go(state.i, { replay: true });
    if (NOTES) $("btnNotes").onclick = () => { document.body.classList.toggle("notes-off"); $("btnNotes").classList.toggle("on"); };
  }

  function nextIndex() {
    for (let j = state.i + 1; j < ALL.length; j++) {
      const s = ALL[j];
      if (inPath(s)) return j;
    }
    return -1;
  }
  function prevIndex() {
    for (let j = state.i - 1; j >= 0; j--) {
      const s = ALL[j];
      if (inPath(s)) return j;
    }
    return -1;
  }

  /* ------------------------------------------------------------ persona vignettes */
  /* Shown on each chapter entry and persona handoff; the step waits until the presenter dismisses it. */
  let lastKey = null;
  let vig = null;

  /* The upcoming in-path steps that share this step's chapter and persona. */
  function segment(i) {
    const s0 = ALL[i], p0 = stepPersona(s0), out = [];
    for (let j = i; j < ALL.length; j++) {
      const s = ALL[j];
      if (s.act !== s0.act) break;
      if (j > i && !inPath(s)) continue;
      if (stepPersona(s) !== p0) break;
      out.push(s);
    }
    return out;
  }

  function vignette(s, t, handoff) {
    const ch = chapterById[s.act];
    const pid = stepPersona(s);
    const p = D.personas.find((x) => x.id === pid);
    const v = (D.vignettes || {})[`${s.act}:${pid}`];
    if (!ch || !p || !v) return Promise.resolve();
    const clock = CLOCKS[s.id] || "";
    const who = p.name.split(" ")[0];
    const el = $("vignette");
    el.innerHTML = `
      <div class="vg-card" style="--pc:${p.color}">
        <div class="vg-who">
          <div class="vg-photo">${p.img ? `<img src="${p.img}" alt="${esc(p.name)}"/>` : esc(p.initials)}</div>
          <div class="vg-name">${esc(p.name)}</div>
          <div class="vg-role">${esc(p.role)}</div>
          <div class="vg-org">${esc(p.org)}</div>
        </div>
        <div class="vg-body">
          <div class="vg-eyebrow">${handoff ? "Handoff \u00b7 " : ""}Chapter ${esc(ch.n)} \u00b7 ${esc(ch.title)}${clock ? ` \u00b7 ${esc(clock)}` : ""}</div>
          <div class="vg-qlbl">The question this chapter answers</div>
          <div class="vg-q">${esc(v.q || ch.question)}</div>
          <div class="vg-cols">
            <div>
              <div class="vg-h">What this means for ${esc(who)}</div>
              <ul class="vg-matters">${v.matters.map((m) => `<li>${esc(m)}</li>`).join("")}</ul>
            </div>
            <div>
              <div class="vg-h">What you\u2019ll see</div>
              <ul class="vg-see">${segment(state.i).map((x) => `<li><span class="vg-id">${esc(x.id)}</span><span>${esc(x.title)}</span>${x.short ? '<span class="vg-star" title="Short path stop">\u2605</span>' : ""}</li>`).join("")}</ul>
            </div>
          </div>
        </div>
        <div class="vg-foot">
          <div class="vg-dots">${stepperChapters.map((c) => `<span class="vg-dot${c.id === ch.id ? " on" : ""}${+c.n < +ch.n ? " past" : ""}">${esc(c.n)}</span>`).join("")}</div>
          <div class="vg-hint">Click anywhere to continue</div>
        </div>
      </div>`;
    el.hidden = false;
    requestAnimationFrame(() => el.classList.add("show"));
    document.body.dataset.vignette = "1";
    return new Promise((resolve, reject) => {
      vig = { t, resolve, reject };
      if (AUTO) setTimeout(() => { if (vig && vig.t === t) closeVignette(true); }, 1200);
    });
  }

  function closeVignette(ok) {
    if (!vig) return;
    const v = vig;
    vig = null;
    const el = $("vignette");
    el.classList.remove("show");
    delete document.body.dataset.vignette;
    setTimeout(() => { if (!vig) { el.hidden = true; el.innerHTML = ""; } }, 300);
    if (ok) v.resolve(); else v.reject(new Run.Cancelled());
  }

  $("vignette").addEventListener("click", (e) => { e.stopPropagation(); closeVignette(true); });

  /* ------------------------------------------------------------ guided taps */
  function applyPulse() {
    left.querySelectorAll(".pulse").forEach((e) => e.classList.remove("pulse"));
    if (!state.pending) return;
    state.pending.names.forEach((n) => left.querySelectorAll(`[data-tap="${n}"]`).forEach((e) => e.classList.add("pulse")));
    const first = left.querySelector(".pulse");
    if (!first) return;
    revealTarget(first, "smooth");
    /* Smooth scrolling can be cut short by a re-render; settle it so the target is never left under the card. */
    setTimeout(() => { if (first.isConnected && first.classList.contains("pulse")) revealTarget(first, "auto"); }, 650);
  }

  /* Scrolls inner app screens, then the pane, so the target clears the sticky "What's happening" card. */
  function revealTarget(el, behavior) {
    const desc = left.querySelector(".left-desc");
    const lr = left.getBoundingClientRect();
    const floor = (desc ? desc.getBoundingClientRect().top : lr.bottom) - 14;
    const paneRoom = left.scrollHeight - left.clientHeight - left.scrollTop;
    for (let a = el.parentElement; a && a !== left; a = a.parentElement) {
      if (!/auto|scroll/.test(getComputedStyle(a).overflowY) || a.scrollHeight <= a.clientHeight + 1) continue;
      const ar = a.getBoundingClientRect(), r = el.getBoundingClientRect();
      const limit = Math.min(ar.bottom - 6, floor + paneRoom);
      let d = r.bottom > limit ? r.bottom - limit : 0;
      if (r.top - d < ar.top + 6) d = r.top - ar.top - 6;
      if (Math.abs(d) > 1) a.scrollTop += d;
    }
    const { top, bottom } = el.getBoundingClientRect();
    let dy = bottom > floor ? bottom - floor : 0;
    if (top - dy < lr.top + 8) dy = top - lr.top - 8;
    if (Math.abs(dy) > 1) left.scrollTo({ top: left.scrollTop + dy, behavior });
  }

  const AUTO = /[?&]auto\b/.test(location.search);

  function tap(names, t) {
    names = [].concat(names);
    const early = state.early;
    state.early = null;
    if (early && early.t === t && names.includes(early.name)) return Promise.resolve(early.name);
    return new Promise((resolve, reject) => {
      state.pending = { names, t, resolve: (n) => { state.pending = null; applyPulse(); resolve(n); }, reject };
      applyPulse();
      if (AUTO) setTimeout(() => { if (state.pending && state.pending.t === t) state.pending.resolve(names[0]); }, 900);
    });
  }

  function cancelPending() {
    if (state.pending) {
      const p = state.pending;
      state.pending = null;
      p.reject(new Run.Cancelled());
    }
  }

  left.addEventListener("click", (e) => {
    const el = e.target.closest("[data-tap]");
    if (!el) return;
    if (!state.pending) {
      /* Clicked before the step asked for it (e.g. while the console is still typing): hold it for the next tap. */
      state.early = { name: el.dataset.tap, t: Run.token };
      el.classList.add("tapped");
      return;
    }
    if (state.pending.names.includes(el.dataset.tap)) state.pending.resolve(el.dataset.tap);
  });

  /* ------------------------------------------------------------ run a step */
  async function go(i, opt = {}) {
    cancelPending();
    state.early = null;
    closeVignette(false);
    const t = Run.next();
    state.i = Math.max(0, Math.min(ALL.length - 1, i));
    state.done = false;
    delete document.body.dataset.done;
    const s = ALL[state.i];
    if (!opt.noHash) history.replaceState(null, "", `#${state.path}/${s.id}`);
    document.body.dataset.step = s.id;
    renderStepper();
    renderTalk();

    if (s.layout === "full") {
      lastKey = `page:${s.id}`;
      stage.hidden = true;
      page.hidden = false;
      page.innerHTML = PAGES[s.page]();
      page.scrollTop = 0;
      bindPage(s.page);
      state.done = true;
      document.body.dataset.done = "1";
      return;
    }

    const key = `${s.act}:${stepPersona(s)}`;
    const handoff = !!lastKey && lastKey.split(":")[0] === s.act;
    const showVignette = key !== lastKey && opt.dir !== "back" && !opt.replay;
    lastKey = key;

    stage.hidden = false;
    page.hidden = true;
    C.reset();
    left.innerHTML = "";
    try {
      if (showVignette) await vignette(s, t, handoff);
      if (!Run.alive(t)) return;
      left.innerHTML = `<div class="left-ui" id="leftUI"></div>${s.desc ? `<div class="left-desc"><div class="ld-h"><span class="ld-k">What\u2019s happening</span><span class="ld-s">Step ${esc(s.id)}</span></div><div class="ld-b"><p class="ld-m">${esc(s.desc)}</p>${s.why ? `<p class="ld-w"><b>Why it matters</b> ${esc(s.why)}</p>` : ""}</div></div>` : ""}`;
      const leftUI = $("leftUI");
      const ctx = {
        t,
        C,
        left(html) { if (Run.alive(t)) { leftUI.innerHTML = html; applyPulse(); } },
        tap: (names) => tap(names, t),
        sleep: (ms) => Run.sleep(ms, t),
        reveal(sel) {
          const el = Run.alive(t) && leftUI.querySelector(sel);
          if (!el) return;
          revealTarget(el, "smooth");
          /* Runs after applyPulse's own settle pass so the tap-target scroll doesn't undo this one. */
          setTimeout(() => { if (el.isConnected && Run.alive(t)) revealTarget(el, "auto"); }, 700);
        },
      };
      await s.run(ctx);
      if (Run.alive(t)) {
        state.done = true;
        document.body.dataset.done = "1";
        const nb = $("btnNext");
        if (nb) nb.classList.add("ready");
      }
    } catch (err) {
      if (!(err instanceof Run.Cancelled)) console.error(err);
    }
  }

  function next() { const j = nextIndex(); if (j >= 0) go(j); }
  function prev() { const j = prevIndex(); if (j >= 0) go(j, { dir: "back" }); }
  function goAct(actId) {
    let j = ALL.findIndex((s) => s.act === actId && inPath(s));
    if (j < 0) j = ALL.findIndex((s) => s.act === actId);
    if (j < 0) j = ALL.findIndex((s) => s.id === actId);
    if (j >= 0) go(j);
  }

  /* ------------------------------------------------------------ controls */
  document.addEventListener("click", (e) => {
    const st = e.target.closest("[data-act]");
    if (st) return goAct(st.dataset.act);
    const p = e.target.closest("[data-path]");
    if (p) {
      state.path = p.dataset.path;
      const cur = ALL[state.i];
      if (cur.act === "hero" || cur.act === "today") return goAct("1");
      /* If the current stop is not on the new path (e.g. 1.3 while switching
         to Short path), snap to the nearest in-path stop so Next/Back and the
         counter match what the toggle says. Prefer the previous stop. */
      if (!inPath(cur)) {
        let j = prevIndex();
        if (j < 0) j = nextIndex();
        if (j < 0) j = state.i;
        return go(j, { replay: true });
      }
      return go(state.i, { replay: true });
    }
    const g = e.target.closest("[data-go]");
    if (g) return goAct(g.dataset.go);
  });

  document.addEventListener("keydown", (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.target.matches("input, textarea")) return;
    if (vig) {
      /* Presentation clickers send arrow, space or page keys. */
      if (["ArrowRight", " ", "Enter", "PageDown"].includes(e.key)) { e.preventDefault(); return closeVignette(true); }
      if (e.key === "ArrowLeft" || e.key === "PageUp") { e.preventDefault(); return prev(); }
    }
    if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") {
      e.preventDefault();
      if (state.pending) state.pending.resolve(state.pending.names[0]);
      else if (state.done) next();
    } else if (e.key === "ArrowLeft" || e.key === "PageUp") { e.preventDefault(); prev(); }
    else if (/^[1-8]$/.test(e.key)) goAct(e.key);
    else if (e.key === "0") goAct("hero");
    else if (e.key === "r" || e.key === "R") go(state.i, { replay: true });
    else if ((e.key === "n" || e.key === "N") && NOTES) $("btnNotes").click();
    else if (e.key === "e" || e.key === "E") { const d = document.querySelector(`.cx-depth button:not(.on)`); if (d) d.click(); }
    else if (e.key === "t" || e.key === "T") goAct("today");
    else if (e.key === "a" || e.key === "A") goAct("arch");
  });

  function fromHash() {
    const m = location.hash.replace(/^#/, "").match(/^(short|full)?\/?(?:act-)?(.*)$/);
    if (!m) return go(0, { noHash: true });
    if (m[1]) state.path = m[1];
    const id = m[2];
    let j = ALL.findIndex((s) => s.id === id);
    if (j < 0 && id) j = ALL.findIndex((s) => s.act === id);
    go(j < 0 ? 0 : j, { noHash: !location.hash });
  }
  window.addEventListener("hashchange", () => {
    const want = location.hash.replace(/^#(short|full)\//, "").replace(/^act-/, "");
    if (ALL[state.i].id !== want) fromHash();
  });

  /* ------------------------------------------------------------ full-width pages */
  const ARCH_BLOCKS = P.arch;
  const ANSWERS = P.answers;
  const WRAP_PROOF = P.wrapProof;
  const WRAP_OUTCOME = P.wrapOutcome;
  const WRAP_CHALLENGE = P.wrapChallenge;
  const WRAP_TECH = B.techLine;
  const WRAP_ROADMAP = P.roadmap;

  const PAGES = {
    hero: () => {
      /* The 8 numbered story chapters. */
      const CHAPTERS = A.chapters.filter((c) => c.n);
      const BEATS = P.beats;

      const headRow = `<div class="jmap-head">
        <div class="jmh-corner"></div>
        ${CHAPTERS.map((c) => {
          const time = CLOCKS[c.n + ".1"] || "";
          return `<div class="jmh-ch" data-go="${c.id}" title="${esc(c.question)}">
            <div class="jmh-n">${c.n}</div>
            <div class="jmh-t">${esc(c.title)}</div>
            ${time ? `<div class="jmh-time">${esc(time)}</div>` : ""}
          </div>`;
        }).join("")}
      </div>`;

      const personaRows = D.personas.map((p) => {
        const beats = BEATS[p.id] || {};
        const cells = CHAPTERS.map((c) => {
          const b = beats[c.id];
          const mine = ALL.filter((s) => s.act === c.id && stepPersona(s) === p.id);
          const target = (mine.find(inPath) || mine[0] || { id: c.id }).id;
          if (b) return `<div class="jmap-cell">
            <div class="jmap-box${b.s ? " jmap-box-s" : ""}" style="--pc:${p.color}" data-go="${target}">
              ${b.s ? '<span class="jmb-star">\u2605</span>' : ""}
              <div class="jmb-a">${b.a}</div>
              <div class="jmb-b">${b.b}</div>
            </div>
          </div>`;
          return `<div class="jmap-cell jmap-cell-empty"></div>`;
        }).join("");
        return `<div class="jmap-row" style="--pc:${p.color}">
          <div class="jmap-who">
            <div class="jmw-av" style="--pc:${p.color}">
              ${p.img ? `<img src="${p.img}" alt="${esc(p.name)}"/>` : `<span style="background:${p.color};color:#fff;font-size:9px;font-weight:700;display:flex;align-items:center;justify-content:center;width:100%;height:100%;border-radius:50%">${esc(p.initials)}</span>`}
            </div>
            <div class="jmw-inf">
              <div class="jmw-nm">${esc(p.name)}</div>
              <div class="jmw-rl">${esc(p.role)}</div>
              <div class="jmw-og">${esc(p.org)}</div>
            </div>
          </div>
          ${cells}
        </div>`;
      }).join("");

      const castCards = D.personas.map((p) => `
        <div class="cast-card" style="--pc:${p.color}" data-go="${p.chapters[0]}">
          <div class="cast-av" style="--pc:${p.color}">
            ${p.img ? `<img src="${p.img}" alt="${esc(p.name)}"/>` : `<span class="cast-av-initials" style="background:${p.color}">${esc(p.initials)}</span>`}
          </div>
          <div class="cast-inf">
            <div class="cast-nm">${esc(p.name)}</div>
            <div class="cast-rl">${esc(p.role)}</div>
            <div class="cast-og">${esc(p.org)}</div>
            <div class="cast-q"><span class="cast-qlbl">The question</span>${esc(p.question)}</div>
          </div>
        </div>`).join("");

      return `<div class="hero hv2">
        <div class="hv2-band">
          <div class="hv2-brand">
            <img src="${B.logoWhite}" alt="${esc(B.name)}" class="hv2-logo"/>
            <div>
              <div class="hv2-ey">${esc(B.eyebrow)}</div>
              <h1 class="hv2-h1">${esc(D.meta.title)}</h1>
              <p class="hv2-subt">${esc(D.meta.subtitle)}</p>
            </div>
          </div>
          <div class="hv2-btns">
            <button class="primary hv2-btn" data-path="short">\u2605 Short path <span class="hv2-sub">${esc(B.shortLabel)}</span></button>
            <button class="ghost-light hv2-btn" data-path="full">Full run <span class="hv2-sub">${esc(B.fullLabel)}</span></button>
          </div>
        </div>

        <div class="hv2-stats">${D.meta.stats.map((s) => `<div class="hv2-stat"><b>${esc(s.v)}</b><span>${esc(s.l)}</span></div>`).join("")}</div>

        <div class="hv2-cast-wrap">
          <div class="hv2-cast-h">Meet the people in the story</div>
          <div class="hv2-cast">${castCards}</div>
        </div>

        <div class="hv2-legend">${esc(B.legend)}</div>

        <div class="hv2-journey">
          <div class="hv2-jh">
            <span class="hv2-jlbl">The demo journey \u00b7 one assignment, ${esc(D.assignment.id)}</span>
            <span class="hv2-jdate">${esc(B.journeyDate)}</span>
          </div>
          ${headRow}
          ${personaRows}
          <div class="jmap-bts">
            <div class="jmbt-lbl">Behind the scenes</div>
            <div class="jmbt-body">${esc(B.techLine)}</div>
          </div>
        </div>

        <div class="hv2-foot">
          <div>
            <button class="ghost hv2-flink" data-go="today">Today vs. with Salesforce \u2192</button>
            <button class="ghost hv2-flink" data-go="arch">Architecture \u2192</button>
          </div>
          <p class="hero-fine">${esc(D.meta.preparedFor)} \u00b7 Presented by ${esc(D.meta.presenter)}<br/><span class="tag">${esc(B.tagline)}</span></p>
        </div>
      </div>`;
    },

    today: () => {
      const T = P.today;
      return `
      <div class="today-page">
        <h2>${esc(T.title)}</h2>
        <p class="lede">${esc(T.lede)}</p>
        <div class="today-cols">
          <div class="today-col today-left">
            <div class="today-h">Today</div>
            ${T.rows.map(([k, v]) => `<div class="td-row"><div class="td-k">${esc(k)}</div><div class="td-v dim">${esc(v)}</div></div>`).join("")}
          </div>
          <div class="today-col today-right">
            <div class="today-h">${esc(T.rightHead)}</div>
            ${T.rows.map(([k, , v]) => `<div class="td-row"><div class="td-k">${esc(k)}</div><div class="td-v ok">${esc(v)}</div></div>`).join("")}
          </div>
        </div>
        <div class="today-scale">
          <div class="ts-h">What changes as you scale</div>
          ${T.scale.map((r) => `<div class="ts-row"><div class="ts-l">${esc(r.l)}</div><div class="ts-bar"><span${r.surge ? ' class="surge"' : ""} style="width:${r.w}%"></span></div><div class="ts-v">${esc(r.v)}</div></div>`).join("")}
          <div class="ts-note">${esc(T.scaleNote)}</div>
        </div>
        <div class="today-nav">
          <button class="ghost" data-go="hero">\u2190 Back to start</button>
          <button class="primary" data-path="${state.path}" data-go="1">Begin the story \u2192</button>
        </div>
      </div>`;
    },

    arch: () => `
      <div class="arch">
        <h2>How it fits together</h2>
        <p class="lede">Tap any block for what it does.</p>
        <div class="arch-grid">
          ${ARCH_BLOCKS.map((c, ci) => `<div class="arch-col c${ci}"><div class="arch-h">${c.col}</div>${c.blocks.map((b) => `<button class="ab" data-ab="${b.id}"><b>${b.t}</b><small>${b.s}</small></button>`).join("")}</div>${ci < ARCH_BLOCKS.length - 1 ? '<div class="arch-arrow">\u2192</div>' : ""}`).join("")}
        </div>
        <div class="arch-detail" id="archDetail"><b>Tap a block</b><p>Every block here appears in the demo. The right-hand console shows each one working.</p></div>
        <div class="arch-phase"><span class="arch-phase-k">Phase 1</span>${esc(P.archNote)}</div>
        <div class="arch-out"><div class="arch-h">Next, on the same foundation</div>${D.scope.out.map(([k, v]) => `<div><b>${esc(k)}</b><small>${esc(v)}</small></div>`).join("")}</div>
      </div>`,

    wrap: () => {
      const full = state.path === "full";
      const CHAPTERS = A.chapters.filter((c) => c.n);
      const moments = ALL.filter((s) => inPath(s) && /^\d/.test(s.id)).length;

      const chapterCards = CHAPTERS.map((c) => {
        const steps = ALL.filter((s) => s.act === c.id && inPath(s) && WRAP_PROOF[s.id]);
        const pid = CHAPTER_PERSONA[c.id];
        const col = PERSONA_COLORS[pid] || "#0176D3";
        const lines = steps.map((s) => `<li>${esc(WRAP_PROOF[s.id])}</li>`).join("");
        const chal = WRAP_CHALLENGE[c.id] || "";
        return `<div class="wrap-ch" style="--pc:${col}">
          <div class="wrap-ch-h"><span class="wrap-ch-n">${esc(c.n)}</span>${esc(c.title)}</div>
          ${chal ? `<div class="wrap-ch-chal"><span class="wrap-ch-lbl chal">The challenge</span>${esc(chal)}</div>` : ""}
          <div class="wrap-ch-now"><span class="wrap-ch-lbl now">What changed</span>
            <ul class="wrap-ch-pts">${lines}</ul>
          </div>
        </div>`;
      }).join("");

      const outcomeCards = D.personas.map((p) => {
        const o = WRAP_OUTCOME[p.id] || {};
        const who = p.name.split(" ")[0];
        return `<div class="wrap-out" style="--pc:${p.color}">
          <div class="wrap-out-av" style="--pc:${p.color}">
            ${p.img ? `<img src="${p.img}" alt="${esc(p.name)}"/>` : `<span>${esc(p.initials)}</span>`}
          </div>
          <div class="wrap-out-inf">
            <div class="wrap-out-nm">${esc(who)}</div>
            <div class="wrap-out-rl">${esc(p.role)}</div>
            <div class="wrap-out-txt">${esc(full ? (o.full || o.short || "") : (o.short || ""))}</div>
          </div>
        </div>`;
      }).join("");

      const roadmap = full ? `<div class="wrap-road">
        <div class="wrap-road-h">Where this goes next</div>
        <div class="wrap-road-rows">${WRAP_ROADMAP.map(([s, d, t]) => `<div class="wrap-road-row"><b>${esc(s)}</b><span>${esc(d)}</span><em>${esc(t)}</em></div>`).join("")}</div>
      </div>` : "";

      return `<div class="wrap-page${full ? " is-full" : ""}">
        <div class="wrap-head">
          <div>
            <span class="wrap-badge">${full ? "Full run recap" : "Short path recap"} \u00b7 ${moments} moments</span>
            <h2>${full ? "One assignment, every system, one governed foundation." : "One assignment, from lender to close."}</h2>
            <p class="lede">${full ? "From the lender\u2019s placement to the agent\u2019s scorecard, with the roadmap that builds on it." : `${esc(D.assignment.id)}, from Lakeshore Auto Finance\u2019s placement on Tuesday to Coastal Recovery\u2019s scorecard on Monday.`}</p>
          </div>
        </div>
        <div class="wrap-grid">${chapterCards}</div>
        <div class="wrap-outs-h">What changed for each person</div>
        <div class="wrap-outs">${outcomeCards}</div>
        ${roadmap}
        <div class="wrap-tech"><span class="wrap-tech-lbl">Behind the scenes</span>${esc(WRAP_TECH)}</div>
      </div>`;
    },

    close: () => `
      <div class="close">
        <h2>Your questions, answered.</h2>
        <p class="lede">Every chapter answered one question Resolvion would ask before saying yes.</p>
        <div class="close-answers">
          ${ANSWERS.map((a, i) => `<div class="ca-row"><div class="ca-n">${i + 1}</div><div class="ca-q">\u201c${esc(a.q)}\u201d</div><div class="ca-a">${esc(a.a)}</div></div>`).join("")}
        </div>
        <div class="close-row">
          <div class="waves"><div class="arch-h">Roadmap \u00b7 cost control first</div>
            ${WRAP_ROADMAP.map(([s, d, t]) => `<div class="wv"><span>${esc(s)}</span><b>${esc(d)}</b><small>${esc(t)}</small></div>`).join("")}
          </div>
          <div class="nexts"><div class="arch-h">Suggested next steps</div><ol>
            ${P.nextSteps.map((x) => `<li>${esc(x)}</li>`).join("")}</ol>
            <a class="primary close-cta" href="mailto:?subject=${encodeURIComponent(B.ctaSubject)}">Start the conversation \u2192</a></div>
          <div class="presenter"><img src="${B.logo}" alt="${esc(B.name)}"/><b>${esc(D.meta.presenter.split(",")[0])}</b><small>${esc(D.meta.presenter.split(",")[1] ? D.meta.presenter.split(",")[1].trim() : "Solutions Engineer")} \u00b7 Salesforce</small><button class="ghost" data-go="hero">Back to start</button></div>
        </div>
      </div>`,
  };

  function bindPage(name) {
    if (name === "arch") {
      const all = Object.fromEntries(ARCH_BLOCKS.flatMap((c) => c.blocks).map((b) => [b.id, b]));
      page.querySelectorAll(".ab").forEach((b) =>
        b.addEventListener("click", () => {
          page.querySelectorAll(".ab").forEach((x) => x.classList.toggle("on", x === b));
          const x = all[b.dataset.ab];
          $("archDetail").innerHTML = `<b>${x.t}</b><small>${x.s}</small><p>${x.d}</p>`;
        })
      );
    }
    /* today page uses the document-level [data-path] and [data-go] handlers */
  }

  fromHash();
})();
