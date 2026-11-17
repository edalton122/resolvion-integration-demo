/* Storyboard steps. Eight chapters follow one assignment, RSV-26-0481723, from lender to close.
   Story clock: Tuesday, Nov 17 (Pacific) through the following Monday. short:true marks the short-path stops. */
window.Acts = (function () {
  const D = window.PC, S = window.Screens, C = window.Console;
  const A = D.assignment;

  const chapters = [
    { id: "hero",  n: "",  title: "Overview",        question: "",  tip: "Story overview and cast" },
    { id: "today", n: "",  title: "Today",           question: "",  tip: "Today vs. with Salesforce" },
    { id: "1",     n: "1", title: "Intake",          question: "Can every lender\u2019s assignment become one record, without borrower data leaving our hands?", tip: "Per-lender intake, on-site normalization, one canonical assignment in both platforms" },
    { id: "2",     n: "2", title: "MVP bridge",      question: "How do old and new stay in sync until MVP?", tip: "Azure \u2192 legacy ERP for accounting, quarantine and retry, nightly reconciliation" },
    { id: "3",     n: "3", title: "Holds",           question: "Will a hold reach the truck before the vehicle is recovered?", tip: "Scorecard + distance agent selection; holds delivered in seconds" },
    { id: "4",     n: "4", title: "Recovery",        question: "Does a recovery reach the lender, accounting and reporting inside 4 hours?", tip: "Photos, condition report and inventory submitted once; fees and status flow on" },
    { id: "5",     n: "5", title: "Borrower call",   question: "Can borrowers get answers 24/7 without adding headcount or compliance risk?", tip: "Fin calls governed MuleSoft APIs through data connectors, with disclosures and escalation" },
    { id: "6",     n: "6", title: "Traffic cop",     question: "Who\u2019s the traffic cop for our models and our spend?", tip: "Agent Fabric Model Proxy, Model Wallet and per-lender policy, alongside your orchestrator" },
    { id: "7",     n: "7", title: "Insights",        question: "Can exec views be concise and easy to see, not a spreadsheet?", tip: "Player-card exec views built by prompt: Tableau MCP, or Studio with Tableau+" },
    { id: "8",     n: "8", title: "Agent scorecard", question: "Can we show agents where their strengths and weaknesses are?", tip: "Tableau Embedded player cards with row-level security" },
    { id: "arch",  n: "",  title: "Architecture",    question: "",  tip: "End-to-end reference architecture" },
    { id: "wrap",  n: "",  title: "Recap",           question: "",  tip: "The whole story in one view" },
    { id: "close", n: "",  title: "Next Steps",      question: "",  tip: "Roadmap and answers to the eight questions" },
  ];

  /* Interim run body: one screen, the base graph, and a guided click per beat.
     beats: [{ tap, cap, path, tag: [nodeId, text, kind], eng, exec, err }]. */
  async function sketch(x, o) {
    const N = (a, b) => C.narrate(a, b, x.t);
    x.left(o.left(o.beats[0].tap));
    C.graph(C.baseGraph(o.graph || {})); C.tab("flow");
    if (o.clock) C.setClock(o.clock);
    if (o.ambient) C.ambient(x.t, o.ambient, { every: 700 });
    if (o.intro) await N(o.intro[0], o.intro[1]);
    for (let i = 0; i < o.beats.length; i++) {
      const b = o.beats[i];
      C.caption(b.cap);
      if (b.tap) await x.tap(b.tap);
      x.left(o.left(o.beats[i + 1] ? o.beats[i + 1].tap : null, i + 1));
      if (b.path) await C.packet(b.path, x.t, b.err ? { finalState: "err", edgeState: "err" } : {});
      if (b.tag) C.tag(b.tag[0], b.tag[1], b.tag[2] || "ok", { stay: !!b.stay });
      if (b.log) await C.log(b.log, x.t);
      await N(b.eng, b.exec);
    }
    if (o.clockStrip) C.clock(o.clockStrip);
    C.caption(o.done || o.beats[o.beats.length - 1].exec);
  }

  /* ================================================================ steps */
  const steps = [
    { id: "hero",  act: "hero",  layout: "full", short: true, title: "One assignment, from lender to close", page: "hero", powered: [] },
    { id: "today", act: "today", layout: "full", short: true, title: "Today vs. with Salesforce", page: "today", powered: [] },

    /* ---------- Chapter 1: Intake */
    {
      id: "1.1", act: "1", short: true, title: "A lender assignment becomes one canonical record",
      desc: `Lakeshore Auto Finance places assignment ${A.id} system-to-system, with a free-text note in its own shorthand. MuleSoft receives it, sends the note to Resolvion\u2019s on-site model to be deciphered and normalized, maps everything into one canonical assignment, writes it to the new platform and carries it into the legacy ERP.`,
      why: "Each lender\u2019s format is handled once, centrally. Borrower identifiers in the note never leave Resolvion\u2019s hands, and nobody keys the assignment twice.",
      powered: ["MuleSoft Anypoint", "DataWeave", "Agent Fabric policy"],
      async run(x) {
        await sketch(x, {
          clock: "16:14:02",
          left: (tap, i = 0) => S.platform({ view: "intake", stage: i, tap }),
          intro: ["client-intake-sapi \u00b7 POST /assignments \u00b7 lender LAF-2207 \u00b7 channel system-to-system", "A new assignment arrives from Lakeshore Auto Finance"],
          beats: [
            { tap: "open", cap: "A new assignment just landed in the intake queue. Click it to open the lender\u2019s raw note.", path: ["lender", "s-intake", "p-intake"], tag: ["s-intake", "202 Accepted \u00b7 41 ms"], eng: "client-intake-sapi \u00b7 202 Accepted \u00b7 lender format LAF-v3 (1 of dozens, illustrative) \u00b7 handed to notes-normalize-papi", exec: "MuleSoft accepts the assignment in the lender\u2019s own format" },
            { tap: "normalize", cap: "The note holds borrower identifiers. Click Normalize: policy sends it to the on-site model, never to a cloud model.", path: ["reg", "fabric", "onprem"], tag: ["onprem", "PII \u2192 on-site \u00b7 0 cloud calls", "new", true], eng: "agent-fabric \u00b7 policy pii.lender-notes \u00b7 route \u2192 on-site model \u00b7 tokens 812 \u00b7 6 fields extracted", exec: "The note is normalized on Resolvion\u2019s own hardware" },
            { tap: "write", cap: "Click Create assignment. One canonical record, in the new platform and the legacy ERP.", path: ["p-intake", "p-sync", "s-azure", "azure"], tag: ["azure", "INSERT \u00b7 1 assignment"], eng: "assignment-sync-papi \u00b7 canonical Assignment v1 \u00b7 azure-platform-sapi INSERT \u00b7 \u2192 legacy-erp-sapi", exec: "Written once, then carried into the legacy ERP" },
          ],
          clockStrip: [{ l: "Placed to record", v: "1.9 s", state: "ok" }, { l: "PII sent to cloud", v: "0", state: "ok" }, { l: "Systems updated", v: "2", s: "Azure \u2192 legacy ERP" }, { l: "Lender formats", v: "1 map each" }],
          done: "One canonical assignment, in both platforms, in under two seconds.",
        });
      },
    },
    {
      id: "1.2", act: "1", short: false, title: "Borrower PII stays on-site, by policy",
      desc: "The rule that sent the note to the on-site model isn\u2019t code in one app. It\u2019s an Agent Fabric policy that applies to every agent and model call, written once in the Policy Catalog, with an audit trail.",
      why: "Every client\u2019s rules are different and all of them must be honored. Strict guardrails first: the policy enforces them for every caller, not just the one someone remembered to update.",
      powered: ["Agent Fabric Policy Catalog", "Model Proxy", "Audit trail"],
      async run(x) {
        await sketch(x, {
          clock: "16:14:03",
          left: (tap, i = 0) => S.stub("cto", { app: "Agent Fabric", title: "Policy \u00b7 pii.lender-notes", lines: ["If the payload contains borrower identifiers \u2192 on-site model", D.fabric.policy.rule, "Every decision logged with caller, model and tokens"], tap, step: i }),
          beats: [
            { tap: "next", cap: "Click the policy to see what it matches.", path: ["reg", "fabric"], tag: ["fabric", "match: borrower PII"], eng: "agent-fabric \u00b7 policy pii.lender-notes \u00b7 detectors account, address, location \u00b7 3 matches", exec: "The policy spots borrower details in the note" },
            { tap: "next", cap: "Click the decision.", path: ["fabric", "onprem"], tag: ["onprem", "routed \u00b7 on-site"], eng: `agent-fabric \u00b7 decision ROUTE on-site model \u00b7 cloud models blocked \u00b7 ${D.fabric.policy.id}`, exec: "So it goes to the on-site model, every time" },
          ],
        });
      },
    },
    {
      id: "1.3", act: "1", short: false, title: "Every lender\u2019s format, one lifecycle",
      desc: "Lenders, the agent network and the portal each name the same status differently. MuleSoft maps them all to one canonical lifecycle, from Assigned to Recovered.",
      why: "Mapped once per source. Every report, agent and API downstream speaks one language.",
      powered: ["DataWeave", "Canonical model", "Anypoint Exchange"],
      async run(x) {
        await sketch(x, {
          clock: "16:15:00",
          left: (tap, i = 0) => S.platform({ view: "lifecycle", stage: i, tap }),
          beats: [
            { tap: "next", cap: "Click the lender\u2019s status code.", path: ["lender", "s-intake", "p-intake"], tag: ["s-intake", "PLACED \u2192 ASSIGNED"], eng: "client-intake-sapi \u00b7 lender status PLACED \u2192 canonical ASSIGNED", exec: "The lender\u2019s code becomes Resolvion\u2019s standard status" },
            { tap: "next", cap: "Now the agent network\u2019s status.", path: ["rdn", "s-rdn", "p-events"], tag: ["s-rdn", "On Hold \u2192 HOLD"], eng: "rdn-sapi \u00b7 status On Hold \u2192 canonical HOLD", exec: "Same status, same word, whatever the source" },
          ],
        });
      },
    },

    /* ---------- Chapter 2: MVP bridge */
    {
      id: "2.1", act: "2", short: true, title: "A fee line posted in Azure lands on the client invoice in the legacy ERP",
      desc: "A recovery fee is posted in the new Azure platform for an assignment recovered overnight. MuleSoft carries the transaction back to the legacy SQL Server ERP, in seconds, where it rolls up onto Lakeshore\u2019s client invoice, so billing keeps running on the system it runs on today.",
      why: "Accounting can\u2019t pause for the MVP. This bridge is built once and reused when the legacy ERP retires, not thrown away. Agent payables and GL posting can follow on the same APIs.",
      powered: ["MuleSoft (Azure \u2192 legacy ERP)", "assignment-sync-papi", "Anypoint Monitoring"],
      async run(x) {
        await sketch(x, {
          clock: "17:30:00",
          left: (tap, i = 0) => S.platform({ view: "billing", stage: i, tap }),
          beats: [
            { tap: "post", cap: "Click Post fee line in the new platform.", path: ["azure", "s-azure", "p-sync"], tag: ["s-azure", "fee_line.created"], eng: "azure-platform-sapi \u00b7 event fee_line.created \u00b7 REC-FEE \u00b7 assignment RSV-26-0479915", exec: "The new platform posts a recovery fee" },
            { tap: "sync", cap: "Click Sync to see it land on the client invoice in the legacy ERP.", path: ["p-sync", "s-legacy", "legacy"], tag: ["legacy", `invoice line \u00b7 ${D.invoice.id}`], eng: `assignment-sync-papi \u00b7 map FeeLine \u2192 client invoice line \u00b7 legacy-erp-sapi INSERT ${D.invoice.id} \u00b7 2.3 s end to end`, exec: "The same line appears on the client invoice in the legacy ERP" },
          ],
          clockStrip: [{ l: "Azure \u2192 ERP", v: "2.3 s", state: "ok" }, { l: "Lines synced today", n: 1842, v: "{n}", s: "illustrative" }, { l: "Direction", v: "Azure \u2192 legacy" }, { l: "Code to throw away", v: "none" }],
        });
      },
    },
    {
      id: "2.2", act: "2", short: true, title: "One bad record is quarantined and retried, not dropped",
      desc: "The next fee line arrives without the assignment\u2019s lender reference. Instead of failing silently or posting a half-record, MuleSoft holds it in quarantine with a reason code and retries it once the reference is filled in.",
      why: "Accounting never posts a half-record, and nothing goes missing. Every held record has a reason and an owner.",
      powered: ["MuleSoft error handling", "DQ quarantine", "Anypoint Monitoring"],
      async run(x) {
        await sketch(x, {
          clock: "17:31:10",
          left: (tap, i = 0) => S.platform({ view: "quarantine", stage: i, tap }),
          beats: [
            { tap: "post", cap: "Click Post on the next fee line.", path: ["azure", "s-azure", "p-sync"], err: true, tag: ["p-sync", "DQ-021 missing lender_ref", "err", true], eng: "assignment-sync-papi \u00b7 validation FAILED \u00b7 DQ-021 lender_ref required \u00b7 \u2192 quarantine (not posted)", exec: "Held back with a reason, not posted half-finished" },
            { tap: "retry", cap: "The lender reference is added. Click Retry.", path: ["p-sync", "s-legacy", "legacy"], tag: ["legacy", "retry \u2713 posted"], eng: "assignment-sync-papi \u00b7 quarantine replay \u00b7 DQ-021 resolved \u00b7 legacy-erp-sapi INSERT \u00b7 OK", exec: "Fixed once, retried automatically, posted" },
          ],
        });
      },
    },
    {
      id: "2.3", act: "2", short: false, title: "Nightly reconciliation and lineage, Azure to ERP",
      desc: "Every night MuleSoft reconciles the two systems line by line and reports any difference. Any fee line can be traced from the Azure record, through the API that moved it, to the legacy ERP row.",
      why: "Two systems of record only work if someone can prove they agree. This does it every night, without a spreadsheet.",
      powered: ["MuleSoft Scheduler", "Lineage", "Anypoint Exchange"],
      async run(x) {
        await sketch(x, {
          clock: "10:00:00",
          left: (tap, i = 0) => S.platform({ view: "recon", stage: i, tap }),
          beats: [
            { tap: "next", cap: "Click Run reconciliation.", path: ["azure", "s-azure", "p-sync", "s-legacy", "legacy"], tag: ["p-sync", "18,204 = 18,204 \u2713"], eng: "assignment-sync-papi \u00b7 nightly recon \u00b7 azure 18,204 lines \u00b7 legacy 18,204 lines \u00b7 0 differences", exec: "Both systems agree, line for line" },
          ],
        });
      },
    },

    /* ---------- Chapter 3: Dispatch and holds */
    {
      id: "3.1", act: "3", short: false, title: "The best agent is selected and the case is pushed",
      desc: "Resolvion\u2019s automated agent selection, now on governed APIs: every agent servicing the borrower\u2019s area is scored by scorecard and lot-to-target distance, and the winner gets the case pushed through the agent network.",
      why: "The rules stay Resolvion\u2019s. MuleSoft delivers the result to the agent network in one governed call, and logs it.",
      powered: ["dispatch-papi", "rdn-sapi", "API Manager policies"],
      async run(x) {
        await sketch(x, {
          clock: "16:16:00",
          left: (tap, i = 0) => S.platform({ view: "dispatch", stage: i, tap }),
          beats: [
            { tap: "select", cap: "Click Select agent.", path: ["p-sync", "p-events"], tag: ["p-events", "Coastal Recovery \u00b7 88"], eng: "dispatch-papi \u00b7 12 agents in range \u00b7 score \u00d7 distance \u00b7 winner AG-0612 Coastal Recovery Co. (11.4 mi, 88)", exec: "Coastal Recovery is the best match" },
            { tap: "push", cap: "Click Push to agent network.", path: ["p-events", "s-rdn", "rdn"], tag: ["rdn", "assigned \u00b7 201"], eng: "rdn-sapi \u00b7 POST /cases \u00b7 201 Created \u00b7 acceptance clock started (2 hrs)", exec: "The case is on the agent\u2019s board; the 2-hour clock starts" },
          ],
        });
      },
    },
    {
      id: "3.2", act: "3", short: true, title: "A lender hold reaches the truck in 4 seconds",
      desc: "Wednesday, 10:42 AM. The borrower pays Lakeshore, and the lender issues a HOLD. MuleSoft puts it on a persistent queue and pushes it straight to Coastal Recovery\u2019s phone: delivered 4 seconds after the lender sent it.",
      why: "A late hold is a wrongful repossession, a top CFPB concern. Seconds, not the next sync, and every step is timestamped for compliance.",
      powered: ["MuleSoft", "Anypoint MQ", "hold-close-papi", "API Manager policies"],
      async run(x) {
        await sketch(x, {
          clock: "18:42:07",
          left: (tap, i = 0) => S.stub("agent", { app: "Agent app", title: i >= 1 ? "HOLD \u2014 do not recover" : `Case ${A.id} \u00b7 located`, lines: i >= 1 ? ["Lakeshore Auto Finance \u00b7 payment posted", "Received 10:42:07 \u00b7 delivered 10:42:11", i >= 2 ? "Acknowledged 10:42:19 \u00b7 on record" : "Tap to acknowledge"] : ["2022 Honda Accord EX \u00b7 Gray", "Last LPR hit: Riverside, CA \u00b7 6:02 AM", "Do not contact at work"], tap, step: i, alert: i >= 1 }),
          beats: [
            { tap: "hold", cap: "The lender sends a HOLD. Click it to send it down the queue.", path: ["lender", "s-intake", "p-intake", "p-sync", "p-events", "e-agent", "agentapp"], tag: ["agentapp", "HOLD delivered \u00b7 4 s", "new", true], eng: "hold-close-papi \u00b7 lender HLD \u2192 HOLD \u00b7 anypoint-mq hold-events \u00b7 push agent AG-0612 \u00b7 10:42:07 \u2192 10:42:11", exec: "The hold reaches the agent\u2019s phone in 4 seconds" },
            { tap: "ack", cap: "Coastal Recovery acknowledges. Click Acknowledge.", path: ["agentapp", "e-agent", "p-events"], tag: ["p-events", "ACK 10:42:19 \u00b7 audited"], eng: "hold-close-papi \u00b7 ack AG-0612 10:42:19 \u00b7 audit hold.delivered + hold.acknowledged", exec: "Acknowledged and on the record: wrongful repossession prevented" },
          ],
          clockStrip: [{ l: "Lender to truck", v: "4 s", state: "ok" }, { l: "Acknowledged", v: "12 s" }, { l: "Holds lost", v: "0", state: "ok" }, { l: "Audit", v: "every step timestamped" }],
        });
      },
    },
    {
      id: "3.3", act: "3", short: false, title: "Release, acknowledged and audited",
      desc: "Thursday the lender releases the hold. The release follows the same governed path: to the agent, acknowledged, and reflected in the lender\u2019s status feed.",
      why: "Holds, releases and closes all ride one path with one audit trail.",
      powered: ["hold-close-papi", "client-status-eapi", "Anypoint MQ"],
      async run(x) {
        await sketch(x, {
          clock: "17:05:00",
          left: (tap, i = 0) => S.platform({ view: "audit", stage: i, tap }),
          beats: [
            { tap: "next", cap: "Click Release.", path: ["p-events", "p-sync", "e-status", "lenders"], tag: ["lenders", "RELEASED \u00b7 ack"], eng: "hold-close-papi \u00b7 RELEASE \u00b7 agent ack 9:05:14 \u00b7 client-status-eapi \u2192 LAF-2207", exec: "Released, acknowledged, and the lender sees it" },
          ],
        });
      },
    },

    /* ---------- Chapter 4: Recovery */
    {
      id: "4.1", act: "4", short: false, title: "Recovered: condition report inside 4 hours",
      desc: "Thursday night Coastal Recovery recovers the Accord. From the lot, the agent submits photos, the condition report and the personal-property inventory once. MuleSoft delivers it everywhere it\u2019s needed, well inside Resolvion\u2019s 4-hour standard.",
      why: "The agent enters it once. The lender, the platform, accounting and reporting all get it from the same event.",
      powered: ["recovery-event-papi", "rdn-sapi", "MuleSoft"],
      async run(x) {
        await sketch(x, {
          clock: "10:32:00",
          left: (tap, i = 0) => S.stub("agent", { app: "Agent app", title: "Recovered \u00b7 submit report", lines: ["12 photos \u00b7 condition report", "Personal property: child seat (flagged by the lender), phone charger", "Oceanside lot \u00b7 in storage"], tap, step: i }),
          beats: [
            { tap: "next", cap: "Click Submit.", path: ["rdn", "s-rdn", "p-events", "p-sync", "s-azure", "azure"], tag: ["azure", "RECOVERED \u00b7 3h 12m of 4h"], eng: "recovery-event-papi \u00b7 RECOVERED \u00b7 condition_report + 12 photos + 2 property items \u00b7 3h 12m after recovery", exec: "Recovery details arrive inside the 4-hour standard" },
          ],
        });
      },
    },
    {
      id: "4.2", act: "4", short: false, title: "Fees to accounting, status to the lender, metrics to Tableau",
      desc: "The same recovery event posts the fee lines to the legacy ERP over the bridge from chapter 2, updates Lakeshore\u2019s status feed and lands the SLA metrics in Tableau.",
      why: "Reuse: the accounting bridge, the lender status API and the governed data in Tableau were already built. Nothing new for this event.",
      powered: ["assignment-sync-papi", "client-status-eapi", "Tableau Cloud"],
      async run(x) {
        await sketch(x, {
          clock: "10:33:00",
          left: (tap, i = 0) => S.platform({ view: "billing", stage: 2 + i, tap }),
          beats: [
            { tap: "next", cap: "Click to follow the fee lines.", path: ["p-sync", "s-legacy", "legacy"], tag: ["legacy", "4 invoice lines"], eng: `assignment-sync-papi \u00b7 4 FeeLine \u2192 ${D.invoice.id} \u00b7 reused bridge`, exec: "Fees land on the client invoice, over the same bridge" },
            { tap: "next", cap: "And the metrics.", path: ["p-sync", "tab"], tag: ["tab", "SLA metrics updated"], eng: "tableau \u00b7 recovery_sla published \u00b7 report_on_time 3h12m \u2264 4h", exec: "Reporting has it without anyone exporting it" },
          ],
        });
      },
    },

    /* ---------- Chapter 5: Borrower call */
    {
      id: "5.1", act: "5", short: true, title: "\u201cWhere\u2019s my car, and my belongings?\u201d Fin answers",
      desc: "Friday morning the borrower calls the \u201cIf your car was repossessed\u201d line. Fin verifies identity, finds the vehicle\u2019s lot and hours, schedules pickup of the child seat and reads the required disclosure. It gets live recovery data by calling a MuleSoft Experience API through Fin data connectors, inside a Procedure.",
      why: "Routine calls are resolved around the clock, deferring headcount. Fin calls the same governed APIs as everything else, with no new point-to-point code: 76% average resolution rate across Fin customers.",
      powered: ["Fin (AI service agent)", "Fin data connectors", "borrower-service-eapi"],
      async run(x) {
        await sketch(x, {
          clock: "16:05:00",
          left: (tap, i = 0) => S.stub("borrower", { app: "Fin \u00b7 voice", title: "\u201cMy car was repossessed. Where is it?\u201d", lines: ["ID verified (last 4 + ZIP)", "Vehicle at Oceanside lot \u00b7 open 8 AM\u20135 PM", "Pickup scheduled: Thu 9\u201311 AM \u00b7 disclosure read"], tap, step: i }),
          beats: [
            { tap: "next", cap: "Click to let Fin look up the vehicle.", path: ["fin", "e-borrower", "p-sync", "s-azure", "azure"], tag: ["e-borrower", "GET /vehicle-status \u00b7 masked"], eng: "fin data connector get_vehicle_status \u2192 borrower-service-eapi \u00b7 GET /assignments/{id}/vehicle-status \u00b7 identity verified \u00b7 PII masked in logs", exec: "Fin gets live recovery data through a governed API" },
            { tap: "next", cap: "Click to schedule the personal-property pickup.", path: ["fin", "e-borrower", "p-sync"], tag: ["p-sync", "pickup booked"], eng: "fin data connector book_property_pickup \u2192 borrower-service-eapi \u00b7 POST /property-pickups \u00b7 child seat \u00b7 Thu 09:00\u201311:00 \u00b7 Oceanside lot", exec: "Pickup booked, disclosure read, call resolved" },
          ],
        });
      },
    },
    {
      id: "5.2", act: "5", short: false, title: "A complex call goes to a person, with full context",
      desc: "A second caller disputes the repossession. The Fin Procedure branches: disputes are out of scope, so Fin hands off to a person and passes the verified identity, assignment and conversation so far.",
      why: "Escalation rules come from compliance. The person picking up doesn\u2019t start from zero.",
      powered: ["Fin Procedures", "Escalation rules", "MuleSoft"],
      async run(x) {
        await sketch(x, {
          clock: "16:11:00",
          left: (tap, i = 0) => S.stub("borrower", { app: "Fin \u00b7 chat", title: "\u201cThis repossession is a mistake.\u201d", lines: ["Dispute detected \u2192 escalation rule CS-04", "Handed to a person with transcript + assignment", "Wait time: under 2 min"], tap, step: i }),
          beats: [
            { tap: "next", cap: "Click to escalate.", path: ["fin", "e-borrower", "p-sync"], tag: ["e-borrower", "handoff \u00b7 context attached"], eng: "fin \u00b7 escalation CS-04 dispute \u00b7 context: verified identity, assignment, transcript", exec: "A person picks up with everything Fin already knows" },
          ],
        });
      },
    },
    {
      id: "5.3", act: "5", short: false, title: "Disclosures, ID checks and masked logs on every call",
      desc: "Every call follows the scripted disclosures and ID checks, and borrower PII is masked in every MuleSoft log.",
      why: "Compliance by design: CFPB, FTC, FDCPA, GLBA and UDAAP rules, and your call monitoring program, are why masking, scripts and audit matter.",
      powered: ["Fin", "Omni Gateway PII masking for logs", "Audit trail"],
      async run(x) {
        await sketch(x, {
          clock: "16:12:00",
          left: (tap, i = 0) => S.stub("cs", { app: "Customer Service", title: "Call compliance", lines: ["Disclosure read: every call (illustrative script)", "ID verified before any vehicle detail", "PII masked in logs: account, address, phone"], tap, step: i }),
          beats: [
            { tap: "next", cap: "Click to view the log.", path: ["fin", "e-borrower"], tag: ["e-borrower", "account \u2022\u2022\u2022\u2022882"], eng: "omni-gateway \u00b7 pii-masking \u00b7 fields account, address, phone masked before logging", exec: "No borrower PII in the logs" },
          ],
        });
      },
    },

    /* ---------- Chapter 6: Traffic cop */
    {
      id: "6.1", act: "6", short: true, title: "One traffic cop: every request routed to the right model, by policy",
      desc: "Agent Fabric sits across the orchestrator, agents and models Resolvion already runs, rather than replacing them: the Case Evaluation and Order Evaluation agents, the Notes Normalizer on the on-site model, Claude and OpenAI. Model Proxy routes each request to the right model at the right cost.",
      why: "Works with your frameworks; nothing is replaced. PII goes on-site, code to Claude, general summarization to the cheapest capable model, and every decision is on the audit trail.",
      powered: ["Agent Fabric Model Proxy", "Policy Catalog", "AI Platform Scanners"],
      async run(x) {
        await sketch(x, {
          clock: "18:00:00",
          left: (tap, i = 0) => S.stub("cto", { app: "Agent Fabric", title: `Registry \u00b7 ${D.fabric.agents.length} agents \u00b7 ${D.fabric.models.length} models`, lines: ["Contains borrower PII \u2192 on-site model", "Code task \u2192 Claude", "General summarization, no PII \u2192 cheapest capable model"], tap, step: i }),
          beats: [
            { tap: "next", cap: "Click a request with borrower PII.", path: ["reg", "fabric", "onprem"], tag: ["onprem", "PII \u2192 on-site"], eng: "model-proxy \u00b7 case-evaluation-agent \u00b7 PII detected \u2192 on-site model", exec: "Sensitive work stays on-site" },
            { tap: "next", cap: "Click a general summarization request.", path: ["reg", "fabric", "ext"], tag: ["ext", "\u2192 cheapest capable"], eng: "model-proxy \u00b7 order-evaluation-agent summary \u00b7 no PII \u00b7 route \u2192 lowest-cost capable model", exec: "Everything else goes to the cheapest model that can do it" },
          ],
        });
      },
    },
    {
      id: "6.2", act: "6", short: true, title: "Token spend by agent and model, capped by a Model Wallet",
      desc: `The FinOps Dashboard shows token spend across every agent and model. Each agent draws from a Model Wallet budget: the ${D.fabric.wallet.agent} has used ${D.fabric.wallet.used}% of today\u2019s and is capped at 100%, not allowed to overrun.`,
      why: "Cost control first. Spend is visible per agent and per model every day, budgets are enforced rather than reviewed after the fact, and the on-site model carries most of the volume at no marginal cost.",
      powered: ["Agent Fabric FinOps Dashboard", "Model Wallet", "Model Proxy"],
      async run(x) {
        await sketch(x, {
          clock: "18:05:00",
          left: (tap, i = 0) => S.stub("cto", { app: "Agent Fabric", title: "FinOps \u00b7 token spend today (illustrative)", lines: ["On-site model 58% of tokens \u00b7 no marginal cost", "OpenAI 28% \u00b7 Claude 14%", `${D.fabric.wallet.agent}: ${D.fabric.wallet.used}% of Model Wallet budget \u00b7 capped at 100%`], tap, step: i, alert: i >= 2 }),
          beats: [
            { tap: "next", cap: "Click the spend view.", path: ["reg", "fabric"], tag: ["fabric", "70.6M tokens today"], eng: "finops \u00b7 spend by agent \u00d7 model \u00b7 70.6M tokens \u00b7 58% on-site", exec: "One spend view across every model" },
            { tap: "next", cap: "Click the Order Evaluation agent\u2019s wallet.", path: ["fabric", "ext"], tag: ["fabric", `wallet ${D.fabric.wallet.used}% \u00b7 cap 100%`, "warn", true], eng: `model-wallet \u00b7 order-evaluation-agent \u00b7 ${D.fabric.wallet.used}% of daily budget \u00b7 hard cap at 100%`, exec: "Budgets are enforced, not just reported" },
          ],
        });
      },
    },
    {
      id: "6.3", act: "6", short: false, title: "A lender\u2019s data rule blocks a cloud model call",
      desc: "An agent tries to send Lakeshore borrower data to a cloud model. The per-lender policy blocks it and reroutes the request to the on-site model.",
      why: "Every client\u2019s rules are different, and all must be honored. Written once in the Policy Catalog, enforced for every agent, with an audit trail.",
      powered: ["Agent Fabric Policy Catalog", "Omni Gateway", "Audit trail"],
      async run(x) {
        await sketch(x, {
          clock: "18:08:00",
          left: (tap, i = 0) => S.stub("cto", { app: "Agent Fabric", title: "Policy decision", lines: ["Caller: Case Evaluation Agent", D.fabric.policy.rule, "Decision: BLOCK cloud model \u00b7 reroute on-site"], tap, step: i, alert: i >= 1 }),
          beats: [
            { tap: "next", cap: "Click the request.", path: ["reg", "fabric", "ext"], err: true, tag: ["ext", "blocked \u00b7 lender rule", "err"], eng: `policy ${D.fabric.policy.id} \u00b7 DENY cloud model \u00b7 reroute \u2192 on-site model`, exec: "Lakeshore\u2019s rule holds, automatically" },
          ],
        });
      },
    },

    /* ---------- Chapter 7: Insights */
    {
      id: "7.1", act: "7", short: true, title: "A player-card exec scorecard, built by prompt",
      desc: "Devon asks for an exec view of agent SLAs and recovery performance. On governed data from the MuleSoft flows, a player-card style scorecard is drafted by prompt: concise and easy to see, instead of a flat grid of red and green dots.",
      why: "Exec views in hours instead of waiting on one or two Desktop builders, on the same numbers billing uses. Build it with Claude through the free Tableau MCP, or in Tableau Studio with Tableau Agent (requires Tableau+).",
      powered: ["Tableau Cloud", "Tableau MCP", "Tableau Studio (Tableau+)"],
      async run(x) {
        await sketch(x, {
          clock: "21:00:00",
          left: (tap, i = 0) => S.stub("data", { app: "Tableau Cloud", title: "Exec scorecard \u00b7 agent network", lines: ["Acceptance inside 2 hrs: 94%", "Condition report inside 4 hrs: 96%", "Recoveries this month: 10,400+ (illustrative)"], tap, step: i }),
          beats: [
            { tap: "next", cap: "Click to build the view by prompt.", path: ["p-sync", "tab"], tag: ["tab", "governed \u00b7 RLS"], eng: "tableau-mcp \u00b7 prompt \u2192 published data source agent_sla (certified) \u00b7 player-card layout", exec: "An exec scorecard drafted on governed data" },
          ],
        });
      },
    },
    {
      id: "7.2", act: "7", short: false, title: "Monday\u2019s digest comes to the leader",
      desc: "Leaders who only view get a Monday digest of what changed: the metrics that moved and why. Tableau Pulse is already part of your licensing and ready to turn on.",
      why: "About 90% of Tableau users only view, and execs want the data back concise. The insight comes to them.",
      powered: ["Tableau Pulse", "Tableau Cloud"],
      async run(x) {
        await sketch(x, {
          clock: "15:30:00",
          left: (tap, i = 0) => S.stub("cto", { app: "Tableau Pulse", title: "Monday digest", lines: ["Condition-report SLA up 3 pts week over week", "SoCal acceptance time down to 41 min", "Holds delivered: median 4 s"], tap, step: i }),
          beats: [
            { tap: "next", cap: "Click the digest.", path: ["p-sync", "tab"], tag: ["tab", "digest sent"], eng: "pulse \u00b7 3 metrics \u00b7 weekly digest \u00b7 7:30 AM", exec: "The numbers come to the leader" },
          ],
        });
      },
    },

    /* ---------- Chapter 8: Agent scorecard */
    {
      id: "8.1", act: "8", short: true, title: "Coastal Recovery\u2019s scorecard: rating 88, rank 4 of 37",
      desc: "Coastal Recovery Co. signs in to the agent portal and sees a FIFA-style player card: an overall rating dial plus acceptance time, update cadence, the 4-hour report SLA, recovery rate and coverage, with strengths and weaknesses ranked against anonymized peers.",
      why: "Whoever does the best work gets forwarded the work: better results, lower risk. Visual enough for every tow company, from a one-truck shop to a large operator.",
      powered: ["Tableau Embedded", "agent-portal-eapi", "MuleSoft"],
      async run(x) {
        await sketch(x, {
          clock: "17:00:00",
          left: (tap, i = 0) => S.stub("agentDesk", { app: "Agent portal", title: "Coastal Recovery Co. \u00b7 88", lines: ["ACC 91 \u00b7 UPD 84 \u00b7 RPT 95 \u00b7 REC 82 \u00b7 COV 90", "Rank 4 of 37 in Southern California", "Weakest: update cadence. Improve it to move up"], tap, step: i }),
          beats: [
            { tap: "next", cap: "Click the scorecard.", path: ["p-events", "e-agent", "agentapp"], tag: ["agentapp", "rating 88 \u00b7 #4"], eng: "agent-portal-eapi \u00b7 GET /agents/AG-0612/scorecard \u00b7 Tableau Embedded view", exec: "The agent sees how they rank" },
          ],
        });
      },
    },
    {
      id: "8.2", act: "8", short: false, title: "600+ agents, each seeing only their own data",
      desc: "The same embedded scorecard serves every agent, each with their own login. Row-level security shows each one only their own numbers plus anonymized peer benchmarks. Lender clients get no analytics access.",
      why: "One governed dashboard, not 600 exports.",
      powered: ["Tableau Embedded", "Row-level security"],
      async run(x) {
        await sketch(x, {
          clock: "17:02:00",
          left: (tap, i = 0) => S.stub("cto", { app: "Tableau Cloud", title: "Row-level security", lines: ["agent_id = USERNAME() entitlement", "Peers shown anonymized only", "Lenders: no analytics access"], tap, step: i }),
          beats: [
            { tap: "next", cap: "Click to view as another agent.", path: ["p-sync", "tab"], tag: ["tab", "RLS \u00b7 own data only"], eng: "tableau \u00b7 RLS agent_id = USERNAME() \u00b7 peers anonymized", exec: "Each agent sees only their own data" },
          ],
        });
      },
    },

    { id: "arch",  act: "arch",  layout: "full", short: true, page: "arch",  title: "How it fits together", powered: [] },
    { id: "wrap",  act: "wrap",  layout: "full", short: true, page: "wrap",  title: "One assignment, start to finish", powered: [] },
    { id: "close", act: "close", layout: "full", short: true, page: "close", title: "Your questions, answered.", powered: [] },
  ];

  return { chapters, acts: chapters, steps };
})();
