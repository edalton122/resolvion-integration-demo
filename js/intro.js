/* Intro video: the full-screen top floor above the demo.
   Only buttons move between floors: the growing rail (or the video ending) pushes down, the top-bar Intro button pushes up.
   Nothing scrolls between them, so the wheel, touch and keys can never bring the intro back. */
(function () {
  const B = window.PC.brand;
  const V = "rsv009";
  const Q = location.search;
  const FORCE = /[?&]intro\b/.test(Q);
  const SKIP = /[?&](auto|fast)\b/.test(Q) || !!window.NOTES || !!location.hash;
  const SEEK = +((Q.match(/[?&]t=(\d+(?:\.\d+)?)/) || [])[1] || 0);
  const START_DELAY = 600;
  const LATE = 12;
  const PUSH_MS = 900;
  const EASE = "cubic-bezier(.7, 0, .2, 1)";
  const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)");
  const FALLBACK_CHAPTERS = [{ t: 0, label: "Why Salesforce" }, { t: 121.88, label: "How to use this site" }];

  const ICON = {
    play: '<svg viewBox="0 0 24 24"><path d="M8 5.5v13l10.5-6.5z" fill="currentColor"/></svg>',
    pause: '<svg viewBox="0 0 24 24"><path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" fill="currentColor"/></svg>',
    sound: '<svg viewBox="0 0 24 24"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    muted: '<svg viewBox="0 0 24 24"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor"/><path d="M16 9.5l5 5M21 9.5l-5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    cc: '<svg viewBox="0 0 24 24"><rect x="3" y="5.5" width="18" height="13" rx="2.5" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M10.5 10.2a2.2 2.2 0 1 0 0 3.6M17 10.2a2.2 2.2 0 1 0 0 3.6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    down: '<svg viewBox="0 0 24 24"><path d="M12 4v15M5.5 12.5L12 19l6.5-6.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  };
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const fmt = (t) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, "0")}`;

  const el = document.createElement("section");
  el.className = "ri";
  el.id = "intro";
  el.setAttribute("aria-label", "Intro video");
  el.innerHTML = `
    <div class="ri-ambient" aria-hidden="true"><canvas width="48" height="27"></canvas></div>
    <header class="ri-top">
      <span class="ri-logo"><img src="${B.logoWhite}" alt="${esc(B.name)}"/></span>
      <div class="ri-title"><b>${esc(B.topTitle)}</b><span>${esc(B.topSub)}</span></div>
    </header>
    <div class="ri-stage">
      <div class="ri-frame">
        <video class="ri-video" playsinline preload="${SKIP && !FORCE ? "none" : "auto"}" poster="assets/video/poster.jpg?v=${V}">
          <source src="assets/video/intro.mp4?v=${V}" type="video/mp4"/>
          <track kind="captions" srclang="en" label="English" src="assets/video/intro.en.vtt?v=${V}"/>
          <track kind="chapters" srclang="en" label="Chapters" src="assets/video/chapters.vtt?v=${V}"/>
        </video>
        <button class="ri-sound" type="button" hidden>${ICON.sound}<span>Tap for sound</span></button>
        <div class="ri-cap"><span></span></div>
      </div>
    </div>
    <div class="ri-bar">
      <div class="ri-ctl">
        <button class="ri-b" data-act="play" type="button" aria-label="Pause">${ICON.pause}</button>
        <button class="ri-b" data-act="mute" type="button" aria-label="Mute">${ICON.sound}</button>
        <button class="ri-b on" data-act="cc" type="button" aria-label="Captions" aria-pressed="true">${ICON.cc}</button>
      </div>
      <div class="ri-chapters"></div>
      <span class="ri-time">0:00 / 3:19</span>
    </div>
    <button class="ri-rail" type="button" aria-label="Skip to the demo">
      <span class="ri-fill"></span>
      <span class="ri-rail-v">Enter the demo</span>
      <span class="ri-rail-x"><small>Next</small><b>Start exploring</b><em>Choose the short path or the full run</em></span>
      <span class="ri-arrow">${ICON.down}</span>
    </button>`;
  document.body.appendChild(el);

  const app = document.getElementById("app");
  const q = (s) => el.querySelector(s);
  const video = q(".ri-video"), frame = q(".ri-frame"), cap = q(".ri-cap"), capText = q(".ri-cap span");
  const soundPill = q(".ri-sound"), rail = q(".ri-rail"), chapEl = q(".ri-chapters"), timeEl = q(".ri-time");
  const bPlay = q('[data-act="play"]'), bMute = q('[data-act="mute"]'), bCc = q('[data-act="cc"]');
  const ctx = q(".ri-ambient canvas").getContext("2d");

  let floor = "down", busy = false, userMuted = false, ccOn = true, resumeOnShow = false, endTimer = 0, idleTimer = 0, raf = 0, ambient = 0;
  let chapters = FALLBACK_CHAPTERS.slice();
  const dur = () => (isFinite(video.duration) && video.duration > 0 ? video.duration : 199.4);

  /* ------------------------------------------------------------ floors */
  function setFloor(f) {
    floor = f;
    document.body.dataset.floor = f;
    document.documentElement.classList.toggle("ri-up", f === "up");
    el.hidden = f === "down";
    el.inert = f === "down";
    app.inert = f === "up";
  }

  /* ------------------------------------------------------------ playback and sound */
  function setSoundUI() {
    const on = !video.muted;
    bMute.innerHTML = on ? ICON.sound : ICON.muted;
    bMute.setAttribute("aria-label", on ? "Mute" : "Unmute");
    soundPill.hidden = on || userMuted;
  }

  /* Browsers allow sound only after a click on the page; without one, play muted with captions and offer sound. */
  function play() {
    video.muted = userMuted;
    const p = video.play();
    return Promise.resolve(p).then(setSoundUI).catch(() => {
      video.muted = true;
      setSoundUI();
      return video.play().catch(() => {});
    });
  }

  function unmute() {
    userMuted = false;
    video.muted = false;
    video.volume = 1;
    if (video.currentTime < 10) video.currentTime = 0;
    if (video.paused) video.play().catch(() => {});
    setSoundUI();
  }

  function fadeVolume(to, ms) {
    const from = video.volume, t0 = performance.now();
    return new Promise((res) => {
      const step = (now) => {
        const k = Math.min(1, (now - t0) / ms);
        video.volume = Math.max(0, Math.min(1, from + (to - from) * k));
        k < 1 ? requestAnimationFrame(step) : res();
      };
      requestAnimationFrame(step);
    });
  }

  function togglePlay() {
    if (video.paused) video.play().catch(() => {});
    else video.pause();
  }

  /* ------------------------------------------------------------ captions and chapters */
  function showCue() {
    const tr = video.textTracks[0];
    const cue = tr && tr.activeCues && tr.activeCues[0];
    capText.innerHTML = cue ? esc(cue.text).replace(/\n/g, "<br>") : "";
    cap.classList.toggle("on", ccOn && !!cue);
  }

  function renderChapters() {
    const d = dur();
    chapEl.innerHTML = chapters.map((c, i) => {
      const end = i + 1 < chapters.length ? chapters[i + 1].t : d;
      return `<div class="ri-ch" style="flex:${Math.max(1, end - c.t)}" data-i="${i}">
        <button class="ri-ch-l" type="button" data-t="${c.t}">${esc(c.label)}</button>
        <div class="ri-ch-t"><i></i></div>
      </div>`;
    }).join("");
  }

  function loadChapters() {
    const tr = video.textTracks[1];
    if (!tr || !tr.cues || !tr.cues.length) return;
    chapters = [...tr.cues].map((c) => ({ t: c.startTime, label: c.text.trim() }));
    renderChapters();
  }

  /* ------------------------------------------------------------ progress, rail growth, ambient light */
  function tick() {
    const d = dur(), t = video.currentTime, p = Math.min(1, t / d);
    el.style.setProperty("--p", p.toFixed(4));
    el.classList.toggle("late", d - t <= LATE || video.ended);
    timeEl.textContent = `${fmt(t)} / ${fmt(d)}`;
    chapEl.querySelectorAll(".ri-ch").forEach((c, i) => {
      const s = chapters[i].t, e = i + 1 < chapters.length ? chapters[i + 1].t : d;
      const k = Math.max(0, Math.min(1, (t - s) / (e - s)));
      c.querySelector("i").style.width = `${k * 100}%`;
      c.classList.toggle("on", t >= s && t < e);
    });
    if (!video.paused && floor === "up") raf = requestAnimationFrame(tick);
  }

  function drawAmbient() {
    if (video.readyState >= 2) { try { ctx.drawImage(video, 0, 0, 48, 27); } catch (e) { /* not decodable yet */ } }
  }

  video.addEventListener("play", () => {
    bPlay.innerHTML = ICON.pause;
    bPlay.setAttribute("aria-label", "Pause");
    clearTimeout(endTimer);
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(tick);
    clearInterval(ambient);
    ambient = setInterval(drawAmbient, 250);
  });
  video.addEventListener("pause", () => {
    bPlay.innerHTML = ICON.play;
    bPlay.setAttribute("aria-label", "Play");
    clearInterval(ambient);
    tick();
  });
  video.addEventListener("seeked", () => { tick(); drawAmbient(); });
  video.addEventListener("loadeddata", drawAmbient);
  video.addEventListener("loadedmetadata", () => { renderChapters(); loadChapters(); tick(); });
  video.addEventListener("ended", () => {
    tick();
    clearTimeout(endTimer);
    endTimer = setTimeout(() => { if (floor === "up" && video.ended) down(); }, 1000);
  });
  video.addEventListener("volumechange", setSoundUI);

  const capTrack = video.textTracks[0], chapTrack = video.textTracks[1];
  if (capTrack) { capTrack.mode = "hidden"; capTrack.addEventListener("cuechange", showCue); }
  if (chapTrack) chapTrack.mode = "hidden";
  const chapTrackEl = video.querySelectorAll("track")[1];
  if (chapTrackEl) chapTrackEl.addEventListener("load", loadChapters);

  /* ------------------------------------------------------------ controls */
  bPlay.addEventListener("click", togglePlay);
  bMute.addEventListener("click", () => {
    if (video.muted) unmute();
    else { userMuted = true; video.muted = true; setSoundUI(); }
  });
  bCc.addEventListener("click", () => {
    ccOn = !ccOn;
    bCc.classList.toggle("on", ccOn);
    bCc.setAttribute("aria-pressed", String(ccOn));
    showCue();
  });
  soundPill.addEventListener("click", (e) => { e.stopPropagation(); unmute(); });
  video.addEventListener("click", () => (video.muted && !userMuted ? unmute() : togglePlay()));
  chapEl.addEventListener("click", (e) => {
    const lab = e.target.closest(".ri-ch-l");
    if (lab) { video.currentTime = +lab.dataset.t; if (video.paused) video.play().catch(() => {}); return; }
    const track = e.target.closest(".ri-ch-t");
    if (!track) return;
    const i = +track.parentElement.dataset.i, r = track.getBoundingClientRect();
    const s = chapters[i].t, end = i + 1 < chapters.length ? chapters[i + 1].t : dur();
    video.currentTime = s + ((e.clientX - r.left) / r.width) * (end - s);
  });
  rail.addEventListener("click", () => down());

  /* Controls rest out of the way until the pointer moves. */
  function wake() {
    el.classList.remove("idle");
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => { if (!video.paused) el.classList.add("idle"); }, 2200);
  }
  el.addEventListener("pointermove", wake);
  el.addEventListener("pointerdown", wake);

  /* While the intro is up, it owns the keyboard; no key ever moves between floors except Enter/ArrowDown going down. */
  window.addEventListener("keydown", (e) => {
    if (floor !== "up") return;
    if (e.target.closest && e.target.closest("button") && (e.key === " " || e.key === "Enter")) { e.stopPropagation(); return; }
    if (e.key === " " || e.key === "k" || e.key === "K") { e.preventDefault(); togglePlay(); }
    else if (e.key === "Enter" || e.key === "ArrowDown" || e.key === "PageDown") { e.preventDefault(); down(); }
    else if (e.key === "m" || e.key === "M") bMute.click();
    else if (e.key === "c" || e.key === "C") bCc.click();
    e.stopPropagation();
  }, true);

  document.addEventListener("visibilitychange", () => {
    if (floor !== "up") return;
    if (document.hidden) { resumeOnShow = !video.paused; video.pause(); }
    else if (resumeOnShow) { resumeOnShow = false; video.play().catch(() => {}); }
  });

  /* ------------------------------------------------------------ the pushes */
  function animateFloors(dir) {
    const goingDown = dir === "down";
    if (REDUCED.matches) {
      return el.animate(goingDown ? [{ opacity: 1 }, { opacity: 0 }] : [{ opacity: 0 }, { opacity: 1 }], { duration: 420, easing: "ease" }).finished;
    }
    const o = { duration: PUSH_MS, easing: EASE };
    const shift = ["translateY(0)", "translateY(-100%)"];
    const appShift = ["translateY(100vh)", "translateY(0)"];
    const drift = ["translateY(0)", "translateY(26vh)"];
    const kf = (a) => (goingDown ? a : a.slice().reverse()).map((transform) => ({ transform }));
    const anims = [el.animate(kf(shift), o), app.animate(kf(appShift), o), frame.animate(kf(drift), o)];
    return Promise.all(anims.map((a) => a.finished));
  }

  function down() {
    if (floor !== "up" || busy) return;
    busy = true;
    clearTimeout(endTimer);
    resumeOnShow = false;
    window.scrollTo(0, 0);
    app.inert = false;
    fadeVolume(0, 400).then(() => video.pause());
    animateFloors("down").then(() => {
      video.pause();
      setFloor("down");
      busy = false;
    });
  }

  function up() {
    if (floor === "up" || busy) return;
    busy = true;
    if (video.preload !== "auto") video.preload = "auto";
    if (video.ended || video.currentTime >= dur() - 0.5) video.currentTime = 0;
    setFloor("up");
    tick();
    video.volume = 0;
    /* Called inside the click so the browser allows sound. */
    play().then(() => fadeVolume(1, PUSH_MS));
    animateFloors("up").then(() => { busy = false; wake(); });
  }

  window.Intro = { up, down, get floor() { return floor; } };

  /* ------------------------------------------------------------ first load */
  renderChapters();
  setSoundUI();
  if (FORCE || !SKIP) {
    setFloor("up");
    requestAnimationFrame(() => el.classList.add("ri-in"));
    setTimeout(() => {
      if (floor !== "up") return;
      if (SEEK) video.currentTime = SEEK;
      play();
      wake();
    }, START_DELAY);
  } else {
    setFloor("down");
    el.classList.add("ri-in");
  }
  document.documentElement.classList.remove("ri-boot");
})();
