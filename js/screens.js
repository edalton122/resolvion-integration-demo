/* Left pane: what each person sees. Every function returns an HTML string.
   Shells: "admin" is an illustrative Resolvion console (not Resolvion's real UI), "tableau" is Tableau Cloud,
   "anypoint" is Anypoint Platform. All data is sample data from data.js. */
window.Screens = (function () {
  const D = window.PC, B = D.brand, A = D.assignment;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  const SVG = {
    search: '<svg viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" stroke-width="2.2"/><path d="M15.5 15.5l5 5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>',
    bell: '<svg viewBox="0 0 24 24"><path d="M12 3a6 6 0 0 0-6 6v4l-2 3h16l-2-3V9a6 6 0 0 0-6-6zm-2 15a2 2 0 0 0 4 0" fill="currentColor"/></svg>',
    gear: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3.2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    help: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .8-1 1.5V14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="17" r="1.2" fill="currentColor"/></svg>',
    check: '<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    back: '<svg viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>',
    car: '<svg viewBox="0 0 24 24"><path d="M5 11l1.6-4.2A2 2 0 0 1 8.5 5.5h7a2 2 0 0 1 1.9 1.3L19 11m-14 0h14a1 1 0 0 1 1 1v4h-2.2a2 2 0 0 1-3.6 0H9.8a2 2 0 0 1-3.6 0H4v-4a1 1 0 0 1 1-1z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
    doc: '<svg viewBox="0 0 24 24"><rect x="5" y="3" width="14" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8.5 8h7M8.5 12h7M8.5 16h4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    ledger: '<svg viewBox="0 0 24 24"><path d="M4 5h16v14H4zM4 9h16M9 9v10" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
    shield: '<svg viewBox="0 0 24 24"><path d="M12 3l7 3v5c0 4.5-3 8.3-7 10-4-1.7-7-5.5-7-10V6z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
  };
  const plus = (x, y, l, t, c) => `<rect x="${x - l / 2}" y="${y - t / 2}" width="${l}" height="${t}" fill="${c}"/><rect x="${x - t / 2}" y="${y - l / 2}" width="${t}" height="${l}" fill="${c}"/>`;
  const TLOGO = `<svg class="tv-logo" viewBox="0 0 24 24">${plus(12, 12, 9, 2.2, "#E8762D")}${plus(12, 3.4, 5, 1.5, "#C72037")}${plus(12, 20.6, 5, 1.5, "#5B879B")}${plus(3.4, 12, 5, 1.5, "#1F457E")}${plus(20.6, 12, 5, 1.5, "#EB912B")}${plus(5.8, 5.8, 3.4, 1.1, "#59879B")}${plus(18.2, 5.8, 3.4, 1.1, "#1F457E")}${plus(5.8, 18.2, 3.4, 1.1, "#C72037")}${plus(18.2, 18.2, 3.4, 1.1, "#59879B")}</svg>`;
  const APLOGO = `<svg class="ap-logo-ico" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="#FF4040"/><path d="M16 7l7 4.5v9L16 25l-7-4.5v-9z" fill="none" stroke="#fff" stroke-width="2.2" stroke-linejoin="round"/><circle cx="16" cy="16" r="3" fill="#fff"/></svg>`;

  /* ------------------------------------------------------------ device frame + role badge */
  function frame(roleKey, inner, opt = {}) {
    const r = D.roles[roleKey];
    const device = opt.device || r.device;
    const clock = opt.clock ? `<span class="dv-clock">${opt.clock}</span>` : "";
    return `
      <div class="badge-role" style="--rc:${r.color}">
        <span class="br-dot">${r.label.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}</span>
        <span><b>${esc(r.label)}</b><small>${esc(r.sub)}</small></span>
      </div>
      <div class="device ${device}" style="--rc:${r.color}">
        <div class="dv-bar">${clock}<span class="dv-cam"></span></div>
        <div class="dv-screen">${inner}</div>
      </div>`;
  }

  /* ------------------------------------------------------------ app shell */
  function lx(app, tabs, active, body, opt = {}) {
    const kind = opt.kind || "admin";
    const brand =
      kind === "tableau"
        ? `<span class="lx-brand">${TLOGO}<b>Tableau Cloud</b><em>${esc(B.name)}</em></span>`
        : kind === "anypoint"
        ? `<span class="lx-brand">${APLOGO}<b>Anypoint Platform</b><em>${esc(app)}</em></span>`
        : kind === "admin"
        ? `<span class="lx-brand"><img class="lx-logo" src="${B.logo}" alt="${esc(B.name)}"/><b>${esc(app)}</b>${opt.tag ? `<em>${esc(opt.tag)}</em>` : ""}</span>`
        : `<span class="lx-brand"><span class="vx-mark">${esc(app[0])}</span><b>${esc(app)}</b>${opt.tag ? `<em>${esc(opt.tag)}</em>` : ""}</span>`;
    const search = kind === "tableau" ? "Search views, metrics and data sources" : kind === "anypoint" ? "Search Anypoint Platform" : "Search assignments, VINs, agents\u2026";
    return `<div class="lx ${kind}${opt.skin ? " " + opt.skin : ""}">
      <div class="lx-gh">
        ${brand}
        <div class="lx-search">${SVG.search}<span>${search}</span></div>
        <span class="lx-illus">Illustrative UI</span>
        <div class="lx-ghi"><i>${SVG.help}</i>${kind === "tableau" || kind === "anypoint" ? "" : `<i>${SVG.gear}</i>`}<i class="bell ${opt.bell ? "on" : ""}">${SVG.bell}</i><span class="lx-av">${opt.avatar || "RS"}</span></div>
      </div>
      ${kind === "anypoint" ? `<div class="ap-env-bar"><span class="ap-env-sel">${esc(opt.env || "Production")} <i>\u25be</i></span>${(tabs || []).map((t) => `<span class="lx-tab ${t === active ? "on" : ""}">${esc(t)}</span>`).join("")}</div>` : `<div class="lx-nav">${(tabs || []).map((t) => `<span class="lx-tab ${t === active ? "on" : ""}">${esc(t)}</span>`).join("")}</div>`}
      <div class="lx-body">${opt.toast || ""}${body}</div>
    </div>`;
  }

  const toast = (kind, title, sub) =>
    `<div class="lx-toast ${kind}"><span class="lx-ti">${kind === "success" ? SVG.check : "!"}</span><div><b>${esc(title)}</b>${sub ? `<small>${esc(sub)}</small>` : ""}</div></div>`;

  const pageHead = (iconColor, iconSvg, obj, title, actions = "", sub = "") => `
    <div class="lx-ph">
      <span class="lx-oi" style="background:${iconColor}">${iconSvg}</span>
      <div class="lx-ph-t"><small>${esc(obj)}</small><b>${esc(title)}</b>${sub ? `<em>${sub}</em>` : ""}</div>
      <div class="lx-ph-a">${actions}</div>
    </div>`;

  const card = (title, body, opt = {}) => `
    <div class="lx-card ${opt.cls || ""}">
      ${title ? `<div class="lx-card-h">${opt.icon ? `<span class="lx-ci" style="background:${opt.icon}"></span>` : ""}<b>${title}</b>${opt.right ? `<span class="lx-card-r">${opt.right}</span>` : ""}</div>` : ""}
      <div class="lx-card-b">${body}</div>
    </div>`;

  const btn = (label, tap, kind = "neutral") => `<button class="sbtn ${kind}" ${tap ? `data-tap="${tap}"` : ""}>${esc(label)}</button>`;
  const kv = (rows, flash) => `<div class="lx-kfs">${rows.map(([k, v, f]) => `<div class="lx-kf ${f && f === flash ? "flash" : ""}"><small>${esc(k)}</small><span>${v}</span></div>`).join("")}</div>`;
  const pill = (txt, kind = "") => `<span class="rs-pill ${kind}">${esc(txt)}</span>`;
  const table = (head, rows, opt = {}) =>
    `<table class="lx-dt ${opt.cls || ""}"><thead><tr>${head.map((h) => `<th>${esc(h)}</th>`).join("")}</tr></thead><tbody>${rows
      .map((r) => `<tr class="${r.cls || ""}" ${r.tap ? `data-tap="${r.tap}"` : ""}>${r.cells.map((c) => `<td>${c}</td>`).join("")}</tr>`)
      .join("")}</tbody></table>`;

  function phone(roleKey, inner, clock) {
    return frame(roleKey, `<div class="ph">${inner}</div>`, { device: "phone", clock });
  }
  const mHead = (title) => `<div class="m-head"><i>${SVG.back}</i><b>${esc(title)}</b><i>${SVG.bell}</i></div>`;

  /* ------------------------------------------------------------ Resolvion Recovery Platform (new platform, Azure) */
  const PLAT_TABS = ["Queue", "Assignments", "Agents", "Billing", "Reconciliation"];
  const plat = (active, body, opt = {}) =>
    frame(opt.role || "ops", lx("Recovery Platform", PLAT_TABS, active, body, { kind: "admin", tag: "New platform \u00b7 Azure", avatar: opt.avatar || "AD", toast: opt.toast, bell: !!opt.toast }), { device: "laptop", clock: opt.clock });

  const vehicleLine = `${D.vehicle.year} ${D.vehicle.make} ${D.vehicle.model} \u00b7 ${D.vehicle.color}`;
  const markPII = (s) => A.piiTerms.reduce((t, p) => t.split(esc(p)).join(`<mark class="rs-pii">${esc(p)}</mark>`), esc(s));

  function lifecyclePath(upto) {
    const ms = D.milestones.slice(0, 8);
    const cur = ms.findIndex((m) => m.field === upto);
    return `<div class="rs-path">${ms
      .map((m, i) => `<span class="${i < cur ? "done" : i === cur ? "cur" : ""}">${i < cur ? SVG.check : ""}${esc(m.label)}</span>`)
      .join("")}</div>`;
  }

  /* o = { view, stage, tap } */
  function platform(o = {}) {
    const st = o.stage || 0, tap = o.tap;
    const V = VIEWS[o.view] || VIEWS.intake;
    return V(st, tap);
  }

  const VIEWS = {
    intake(st, tap) {
      const queue = table(
        ["Assignment", "Lender", "Collateral", "Received", "Status"],
        [
          { cells: [`<b>${A.id}</b>`, esc(D.lender.name), esc(vehicleLine), "8:14 AM", st >= 3 ? pill("Assigned", "ok") : pill("New", "new")], cls: st === 0 ? "rs-new" : "", tap: st === 0 ? tap : null },
          { cells: ["RSV-26-0481722", "Harbor Credit Union", "2020 Ford F-150 \u00b7 Blue", "8:13 AM", pill("Assigned", "ok")] },
          { cells: ["RSV-26-0481719", "Summit Auto Lending", "2019 Nissan Altima \u00b7 Gray", "8:11 AM", pill("Assigned", "ok")] },
          { cells: ["RSV-26-0481716", "Lakeshore Auto Finance", "2021 Toyota RAV4 \u00b7 White", "8:09 AM", pill("Hold", "warn")] },
        ]
      );
      if (st === 0)
        return plat("Queue", `${pageHead("var(--brand)", SVG.doc, "Intake queue", "New assignments", btn("Refresh"), "50,000+ assignments a month \u00b7 every lender format")}${card("Today", queue, { right: "4 of 1,612" })}`);
      const head = pageHead("var(--brand)", SVG.car, `Assignment \u00b7 ${D.lender.name}`, A.id, st === 1 ? btn("Normalize note", tap, "brand") : st === 2 ? btn("Create assignment", tap, "brand") : btn("Open case"), esc(vehicleLine));
      const raw = card("Lender note (raw)", `<p class="rs-note">${st === 1 ? markPII(A.rawNote) : esc(A.rawNote)}</p>${st === 1 ? `<div class="rs-hint">${SVG.shield} ${A.piiTerms.length} borrower identifiers detected. Policy routes this note to the on-site model only.</div>` : ""}`, { right: `${D.lender.id} \u00b7 system-to-system` });
      const N = A.normalized;
      const norm = card(
        "Normalized by the on-site model",
        kv([["Vehicle", N.vehicle], ["Location hints", N.location_hints], ["Contact restriction", `<b class="rs-warn">${esc(N.contact_restriction)}</b>`], ["Personal property", N.personal_property], ["Hold condition", N.hold_condition], ["Escalation", N.escalation]]) +
          `<div class="rs-chips">${pill("PII stayed on-site", "ok")}${pill("0 external calls", "ok")}${pill("812 tokens")}</div>`,
        { right: "notes-normalize-papi" }
      );
      const done = st >= 3 ? card("Written to", `<div class="rs-chips">${pill("New platform \u00b7 Azure \u2713", "ok")}${pill("Legacy ERP \u00b7 SQL Server \u2713", "ok")}</div>${lifecyclePath("assigned")}`) : "";
      return plat("Assignments", `${head}<div class="rs-grid2">${raw}${st >= 2 ? norm : ""}</div>${done}`, {
        toast: st >= 3 ? toast("success", `Assignment ${A.id} created`, "One canonical record \u00b7 new platform + legacy ERP \u00b7 1.9 s") : "",
      });
    },

    lifecycle(st, tap) {
      const cols = ["Canonical", "Lender (LAF-v3)", "Agent network", "Client portal"];
      const rows = D.statusMap.map((r, i) => ({
        cells: [`<b>${r.canon}</b>`, `<span class="${st >= 1 && i === 0 ? "rs-hl" : ""}">${esc(r.lender)}</span>`, `<span class="${st >= 2 && r.canon === "HOLD" ? "rs-hl" : ""}">${esc(r.rdn)}</span>`, esc(r.portal)],
        tap: st === 0 && i === 0 ? tap : st === 1 && r.canon === "HOLD" ? tap : null,
        cls: (st === 0 && i === 0) || (st === 1 && r.canon === "HOLD") ? "rs-new" : "",
      }));
      return plat("Assignments", `${pageHead("var(--brand)", SVG.doc, "Canonical lifecycle", "One status vocabulary", btn("Export mapping"), "Mapped once per source in DataWeave")}${card("Status mapping", table(cols, rows))}${card("Lifecycle", lifecyclePath(st >= 2 ? "hold" : "assigned"))}`);
    },

    billing(st, tap) {
      const lines = D.feeLines.map((f, i) => ({
        cells: [`<code>${f.code}</code>`, esc(f.label), esc(f.amt), i === 0 ? (st >= 2 ? pill("Synced", "ok") : st >= 1 ? pill("Posted", "new") : pill("Draft")) : pill(st >= 3 ? "Synced" : "Draft", st >= 3 ? "ok" : "")],
        cls: i === 0 && st <= 1 ? "rs-new" : "",
      }));
      const I = D.invoice;
      const erp = card(
        `Legacy ERP \u00b7 client invoice ${I.id}`,
        table(["Line", "Code", "Assignment", "Source"], st >= 2 ? [{ cells: ["14", "REC-FEE", "RSV-26-0479915", "MuleSoft \u00b7 2.3 s"], cls: "rs-in" }, { cells: ["13", "STOR-DAY", "RSV-26-0479811", "MuleSoft"] }] : [{ cells: ["13", "STOR-DAY", "RSV-26-0479811", "MuleSoft"] }]) +
          `<div class="rs-chips">${I.next.map((n) => `<span class="rs-pill next">${esc(n)} \u00b7 next</span>`).join("")}</div>`,
        { right: `${I.lender} \u00b7 SQL Server` }
      );
      const action = st === 0 ? btn("Post fee line", tap, "brand") : st === 1 ? btn("Sync to legacy ERP", tap, "brand") : tap ? btn("Continue", tap, "brand") : "";
      return plat("Billing", `${pageHead("var(--brand)", SVG.ledger, "Fee lines \u00b7 RSV-26-0479915", "Recovered overnight", action, "One way: new platform \u2192 legacy ERP \u00b7 amounts are sample values")}<div class="rs-grid2">${card("New platform \u00b7 fee lines", table(["Code", "Line", "Amount", "Status"], lines))}${erp}</div>`, {
        toast: st >= 2 ? toast("success", "Fee line added to the client invoice in the legacy ERP", `Azure \u2192 assignment-sync-papi \u2192 ${I.id} \u00b7 2.3 s`) : "",
      });
    },

    quarantine(st, tap) {
      const row = st === 0
        ? { cells: ["<code>REC-FEE</code>", "RSV-26-0480102", `<span class="rs-warn">missing</span>`, pill("Draft")], cls: "rs-new" }
        : st === 1
        ? { cells: ["<code>REC-FEE</code>", "RSV-26-0480102", `<span class="rs-hl">LAF-ACCT-55098120</span>`, pill("Quarantined \u00b7 DQ-021", "err")], cls: "rs-new" }
        : { cells: ["<code>REC-FEE</code>", "RSV-26-0480102", "LAF-ACCT-55098120", pill("Synced \u00b7 retried", "ok")] };
      const action = st === 0 ? btn("Post fee line", tap, "brand") : st === 1 ? btn("Retry", tap, "brand") : "";
      const reason = st === 1 ? card("Held by MuleSoft", `<div class="rs-hint err">${SVG.shield} DQ-021 \u00b7 lender_ref is required for accounting. Not posted to the legacy ERP. Owner: billing ops. Lender reference now filled in.</div>`) : "";
      return plat("Billing", `${pageHead("var(--brand)", SVG.ledger, "Fee lines", "Data quality", action)}${card("Fee lines", table(["Code", "Assignment", "Lender ref", "Status"], [row]))}${reason}`, {
        toast: st === 1 ? toast("error", "1 fee line quarantined", "DQ-021 missing lender_ref \u00b7 nothing posted half-finished") : st >= 2 ? toast("success", "Quarantined line retried and posted", "No record lost") : "",
      });
    },

    recon(st, tap) {
      const res = st >= 1
        ? card("Last night \u00b7 2:00 AM", table(["Check", "Azure", "Legacy ERP", "Result"], [{ cells: ["Fee lines", "18,204", "18,204", pill("Match", "ok")] }, { cells: ["Fee total (sample)", "1,904,220.50", "1,904,220.50", pill("Match", "ok")] }, { cells: ["Assignments open", "212,880", "212,880", pill("Match", "ok")] }]))
        : card("Reconciliation", `<p class="rs-muted">Runs nightly at 2:00 AM. Compares every fee line and assignment status between the new platform and the legacy ERP.</p>`);
      return plat("Reconciliation", `${pageHead("var(--brand)", SVG.ledger, "Azure \u2192 legacy ERP", "Nightly reconciliation", st === 0 ? btn("Run reconciliation", tap, "brand") : btn("View lineage"))}${res}`);
    },

    dispatch(st, tap) {
      const cands = [
        ["Coastal Recovery Co.", "11.4 mi", 88, true],
        ["Inland Empire Recovery", "8.9 mi", 74],
        ["Palm Valley Adjusters", "23.0 mi", 91],
        ["Harbor Point Recovery", "17.2 mi", 79],
      ];
      const rows = cands.map(([n, d, s, win]) => ({
        cells: [`<b>${esc(n)}</b>`, d, st >= 1 ? `<b>${s}</b>` : "\u2014", st >= 1 ? (win ? pill(st >= 2 ? "Assigned" : "Best match", "ok") : pill("")) : ""],
        cls: st >= 1 && win ? "rs-new" : "",
      }));
      const action = st === 0 ? btn("Select agent", tap, "brand") : st === 1 ? btn("Push to agent network", tap, "brand") : "";
      return plat("Agents", `${pageHead("var(--brand)", SVG.car, `Dispatch \u00b7 ${A.id}`, "Select a recovery agent", action, "Scorecard \u00d7 lot-to-target distance \u00b7 12 agents in range")}${card("Candidates", table(["Agent", "Distance", "Score", ""], rows))}`, {
        toast: st >= 2 ? toast("success", "Case pushed to Coastal Recovery Co.", "Agent network 201 Created \u00b7 2-hour acceptance clock started") : "",
      });
    },

    audit(st, tap) {
      const H = D.holdEvent;
      const rows = [
        { cells: ["Wed 10:42:07", "HOLD received from lender", "Lakeshore Auto Finance"] },
        { cells: ["Wed 10:42:11", "HOLD delivered to agent phone", "hold-close-papi"] },
        { cells: ["Wed 10:42:19", "Acknowledged by agent", "Coastal Recovery Co."] },
      ].concat(st >= 1 ? [{ cells: ["Thu 9:05:02", "RELEASE received from lender", "Lakeshore Auto Finance"], cls: "rs-in" }, { cells: ["Thu 9:05:14", "Release acknowledged", "Coastal Recovery Co."], cls: "rs-in" }] : []);
      return plat("Assignments", `${pageHead("var(--brand)", SVG.shield, `Audit trail \u00b7 ${A.id}`, st >= 1 ? "Released" : `On hold \u00b7 ${H.reason}`, st === 0 ? btn("Release", tap, "brand") : "")}${card("Hold, release and close events", table(["Time (PT)", "Event", "By"], rows))}`);
    },
  };

  /* ------------------------------------------------------------ interim screen for chapters still being skinned */
  const TAP_LABEL = { next: "Continue", hold: "Send HOLD", ack: "Acknowledge", open: "Open", post: "Post", retry: "Retry" };
  function stub(roleKey, o = {}) {
    const r = D.roles[roleKey];
    const action = o.tap ? btn(TAP_LABEL[o.tap] || "Continue", o.tap, "brand") : "";
    const lines = (o.lines || []).map((l, i) => `<li class="${i <= (o.step || 0) ? "on" : ""}">${esc(l)}</li>`).join("");
    if (r.device === "phone") {
      return phone(roleKey, `<div class="m-app">${mHead(o.app || "")}<div class="m-body">
        <div class="rs-mcard ${o.alert ? "alert" : ""}"><b>${esc(o.title || "")}</b><ul class="rs-lines">${lines}</ul></div>
        ${o.tap ? `<button class="sbtn brand block" data-tap="${o.tap}">${esc(TAP_LABEL[o.tap] || "Continue")}</button>` : ""}
      </div></div>`, o.clock);
    }
    const kind = /Tableau/.test(o.app || "") ? "tableau" : "admin";
    const body = `${pageHead(o.alert ? "var(--alert)" : "var(--brand)", SVG.doc, o.app || "", o.title || "", action)}${card("", `<ul class="rs-lines">${lines}</ul>`, { cls: o.alert ? "rs-alert" : "" })}`;
    return frame(roleKey, lx(o.app || "Resolvion", [], "", body, { kind, avatar: r.label[0] }), { device: "laptop", clock: o.clock });
  }

  return { frame, lx, phone, card, btn, toast, pageHead, table, pill, kv, platform, stub, TLOGO, APLOGO, SVG, esc };
})();
