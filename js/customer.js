/* Customer configuration: brand, console graph, story maps and full-page copy.
   Loaded after data.js; engine.js and console.js read everything customer-specific from here. */
(function (D) {
  D.brand = {
    name: "Resolvion",
    logo: "assets/brand/resolvion-logo-color.png",
    logoWhite: "assets/brand/resolvion-logo-white.png",
    mark: "assets/brand/icon-192.png",
    eyebrow: "Recovery Platform Integration \u00b7 Prepared for Resolvion",
    topTitle: "Recovery Platform Integration",
    topSub: "MuleSoft \u00b7 Agent Fabric \u00b7 Fin \u00b7 Tableau",
    tagline: "Better Results, Lower Risk.",
    shortLabel: "~15 min \u00b7 14 stops",
    fullLabel: "~30 min \u00b7 all stops",
    legend: "On each screen: left is what people see (Resolvion\u2019s platforms, the agent\u2019s phone, Fin, Tableau). Right is MuleSoft and Agent Fabric, doing the work underneath.",
    journeyDate: "Tuesday Nov 17 through the following Monday \u00b7 \u2605 = Short path",
    techLine: "MuleSoft Anypoint Platform \u00b7 DataWeave \u00b7 Anypoint MQ \u00b7 API Manager \u00b7 Anypoint Monitoring \u00b7 MuleSoft Agent Fabric \u00b7 Fin \u00b7 Tableau Cloud + Embedded",
    ctaSubject: "Resolvion integration demo: next steps",
  };

  /* ------------------------------------------------------------ console base graph */
  /* Absolute coordinates in a 1000-wide viewBox. T leaves headroom for the tags that float 26px above top-row nodes. */
  const T = 18;
  const n = (id, label, sub, x, y, w, h, kind) => ({ id, label, sub, x, y: y + T, w, h, kind });
  const C1 = [10, 128], C2 = [162, 140], C3 = [330, 206], C4 = [564, 154], C5 = [760, 212];
  D.graph = {
    w: 1000, h: 470,
    groups: [
      { label: "Lenders", x: 4, y: 6 + T, w: 140, h: 66 },
      { label: "Resolvion platforms", x: 4, y: 80 + T, w: 140, h: 118 },
      { label: "Agent network + data", x: 4, y: 206 + T, w: 140, h: 118 },
      { label: "Experiences", x: 740, y: 6 + T, w: 252, h: 236 },
      { label: "MuleSoft Agent Fabric \u00b7 control plane for every agent and model", x: 154, y: 340 + T, w: 838, h: 104 },
    ],
    lanes: [
      { label: "System APIs", kind: "sys", x: 154, y: 6 + T, w: 156, h: 318 },
      { label: "Process APIs", kind: "proc", x: 320, y: 6 + T, w: 226, h: 318 },
      { label: "Experience APIs \u00b7 MCP", kind: "exp", x: 556, y: 6 + T, w: 170, h: 236 },
    ],
    nodes: [
      n("lender", "Lender systems", "API \u00b7 SFTP \u00b7 portal", C1[0], 30, C1[1], 40, "src"),
      n("azure", "New Platform", "Azure SQL", C1[0], 104, C1[1], 40, "store"),
      n("legacy", "Legacy ERP", "SQL Server \u00b7 accounting", C1[0], 152, C1[1], 40, "store"),
      n("rdn", "Agent network", "RDN", C1[0], 228, C1[1], 40, "src"),
      n("data", "LPR + skip data", "DRN \u00b7 bureaus", C1[0], 276, C1[1], 40, "src"),
      n("s-intake", "client-intake-sapi", "per-lender formats", C2[0], 30, C2[1], 40, "sys"),
      n("s-azure", "azure-platform-sapi", "new platform", C2[0], 104, C2[1], 40, "sys"),
      n("s-legacy", "legacy-erp-sapi", "SQL Server", C2[0], 152, C2[1], 40, "sys"),
      n("s-rdn", "rdn-sapi", "push \u00b7 updates", C2[0], 228, C2[1], 40, "sys"),
      n("s-data", "lpr + skiptrace-sapi", "masked results", C2[0], 276, C2[1], 40, "sys"),
      n("p-intake", "notes-normalize-papi", "intake \u00b7 canonical", C3[0], 30, C3[1], 40, "proc"),
      n("p-sync", "assignment-sync-papi", "Azure \u2194 legacy \u00b7 accounting", C3[0], 110, C3[1], 76, "proc"),
      n("p-events", "dispatch + hold-close-papi", "recovery events", C3[0], 242, C3[1], 60, "proc"),
      n("e-status", "client-status-eapi", "lender updates", C4[0], 30, C4[1], 40, "exp"),
      n("e-agent", "agent-portal-eapi", "holds \u00b7 scorecards", C4[0], 82, C4[1], 40, "exp"),
      n("e-borrower", "borrower-service-eapi", "used by Fin", C4[0], 134, C4[1], 40, "exp"),
      n("e-mcp", "MCP server", "same APIs as agent tools", C4[0], 186, C4[1], 40, "exp"),
      n("tab", "Tableau Cloud", "governed data \u00b7 RLS", C4[0], 262, C4[1], 46, "viz"),
      n("lenders", "Lender clients", "status \u00b7 no analytics access", C5[0], 30, C5[1], 40, "src"),
      n("agentapp", "Agent app + portal", "phone \u00b7 RDN \u00b7 scorecard", C5[0], 82, C5[1], 40, "src"),
      n("fin", "Fin", "borrower voice + chat", C5[0], 134, C5[1], 40, "src"),
      n("agents", "Resolvion agents", "case + order evaluation", C5[0], 186, C5[1], 40, "src"),
      n("reg", "Agent registry", "case \u00b7 order \u00b7 notes \u00b7 Fin \u00b7 Tableau", C2[0], 374, C2[1], 46, "ops"),
      n("fabric", "Agent Fabric broker", "routing \u00b7 policy \u00b7 token spend", C3[0], 374, C3[1], 46, "ops"),
      n("onprem", "On-site LLM", "GPU \u00b7 PII stays on-site", C4[0], 374, C4[1], 46, "store"),
      n("ext", "Claude \u00b7 OpenAI", "external \u00b7 masked by policy", C5[0], 374, C5[1], 46, "src"),
    ],
    edges: [
      ["lender", "s-intake"], ["azure", "s-azure"], ["legacy", "s-legacy"], ["rdn", "s-rdn"], ["data", "s-data"],
      ["s-intake", "p-intake"], ["s-azure", "p-sync"], ["s-legacy", "p-sync"], ["s-rdn", "p-events"], ["s-data", "p-events"],
      ["p-intake", "p-sync", { down: true }], ["p-events", "p-sync", { up: true }],
      ["p-sync", "e-status"], ["p-events", "e-agent"], ["p-sync", "e-borrower"], ["p-sync", "e-mcp", { dashed: true }], ["p-sync", "tab"],
      ["e-status", "lenders"], ["e-agent", "agentapp"], ["e-borrower", "fin"], ["e-mcp", "agents"],
      ["reg", "fabric"], ["fabric", "onprem"], ["fabric", "ext"],
    ],
    legend: `<span class="lg sys"></span>System APIs connect each system <span class="lg proc"></span>Process APIs combine, clean and route <span class="lg exp"></span>Experience APIs serve people, Fin and agents <span class="lg ops"></span>Agent Fabric governs every model call`,
  };

  /* ------------------------------------------------------------ story maps */
  D.story = {
    clocks: {
      "1.1": "Tue 8:14 AM", "1.2": "Tue 8:14 AM", "1.3": "Tue 8:15 AM",
      "2.1": "Tue 9:30 AM", "2.2": "Tue 9:31 AM", "2.3": "Wed 2:00 AM",
      "3.1": "Tue 8:16 AM", "3.2": "Wed 10:42 AM", "3.3": "Thu 9:05 AM",
      "4.1": "Fri 2:32 AM", "4.2": "Fri 2:33 AM",
      "5.1": "Fri 8:05 AM", "5.2": "Fri 8:11 AM", "5.3": "Fri 8:12 AM",
      "6.1": "Fri 10:00 AM", "6.2": "Fri 10:05 AM", "6.3": "Fri 10:08 AM",
      "7.1": "Fri 1:00 PM", "7.2": "Mon 7:30 AM",
      "8.1": "Mon 9:00 AM", "8.2": "Mon 9:02 AM",
    },
    chapterPersona: { "1": "dot", "2": "dot", "3": "dot", "4": "agent", "5": "cs", "6": "cto", "7": "data", "8": "agent" },
    stepPersona: { "1.2": "cto", "3.2": "agent", "4.2": "data", "7.2": "cto", "8.2": "cto" },
  };

  /* ------------------------------------------------------------ full-page copy */
  D.pages = {
    /* Journey map cells: what each persona does in each chapter. s = on the short path. */
    beats: {
      dot: { "1": { a: "Lender assignment arrives", b: "One canonical record \u00b7 both systems", s: true },
             "2": { a: "Fee line Azure \u2192 legacy ERP", b: "Bad record quarantined + retried", s: true },
             "3": { a: "Agent auto-selected", b: "Scorecard + distance \u00b7 pushed to RDN", s: false } },
      cto: { "1": { a: "Lender notes with PII", b: "Routed to the on-site LLM", s: false },
             "6": { a: "Every model, one policy", b: "Token spend by agent \u00b7 budget alert", s: true },
             "7": { a: "Monday digest", b: "Insights come to leaders", s: false },
             "8": { a: "600+ agents, own data only", b: "Row-level security", s: false } },
      data: { "4": { a: "Recovery data lands", b: "Fees to ERP \u00b7 metrics to Tableau", s: false },
              "7": { a: "Player-card exec scorecard", b: "Built with Tableau Agent + MCP", s: true } },
      cs: { "5": { a: "\u201cWhere\u2019s my car?\u201d", b: "Fin resolves \u00b7 escalates with context", s: true } },
      agent: { "3": { a: "HOLD on the phone", b: "4 seconds \u00b7 wrongful repo prevented", s: true },
               "4": { a: "Recovered + photos", b: "Condition report inside 4 hrs", s: false },
               "8": { a: "FIFA-style scorecard", b: "Rank vs anonymized peers", s: true } },
    },

    today: {
      title: "Today vs. with Salesforce",
      lede: "Two systems of record, three model providers, 80+ lenders and 600+ agents. Why the next connection shouldn\u2019t be another custom project.",
      rightHead: "With MuleSoft, Agent Fabric, Fin + Tableau",
      rows: [
        ["Systems of record", "Legacy SQL ERP and the new Azure platform, kept in sync with scripts or by hand", "One governed bridge, Azure \u2194 legacy, reused when the legacy ERP retires"],
        ["Lender notes", "Every lender sends a different format; only the on-site LLM can safely read them", "Normalized on-site by policy, mapped once into one canonical assignment"],
        ["AI spend", "OpenAI, Claude and the on-site LLM with no single view or policy", "Agent Fabric routes every call, tracks tokens per agent and enforces per-lender rules"],
        ["Holds + closes", "Have to reach the truck in seconds, every time", "Delivered to the agent\u2019s phone in seconds, acknowledged and audited"],
        ["Borrower calls", "Volume grows with delinquencies", "Fin resolves routine calls 24/7 on live data, escalates the rest with context"],
        ["Exec dashboards", "Flat grids; one or two power users are the bottleneck", "Player-card exec views built with Tableau Agent on governed data"],
        ["Agent feedback", "PDFs and phone calls", "A live, embedded scorecard that rewards performance"],
      ],
      scale: [
        { l: "Today \u00b7 50,000+ assignments / month", w: 50, v: "\u2248 1.8M lifecycle events / month \u00b7 2 replicas" },
        { l: "Growth \u00b7 75,000 / month", w: 75, v: "\u2248 2.7M / month \u00b7 same 2 replicas" },
        { l: "Peak month \u00b7 100,000", w: 100, surge: true, v: "\u2248 3.6M / month \u00b7 autoscales to 4 \u00b7 0 dropped" },
      ],
      scaleNote: "Assignment volume is Resolvion\u2019s public figure; event counts and replicas illustrative. Holds stay in seconds at every size.",
    },

    arch: [
      { col: "Lender + industry systems", blocks: [
        { id: "lender", t: "Lender client systems", s: "API \u00b7 SFTP \u00b7 portal upload", d: "Banks, captives, independents and credit unions place assignments in their own formats. client-intake-sapi handles each channel, so no lender changes how they send work." },
        { id: "rdn", t: "Agent network (RDN)", s: "Push \u00b7 updates \u00b7 billing", d: "Assignments, holds and closes are pushed to the agent network; updates and recovery events come back. rdn-sapi is the only thing that speaks RDN. Shown generically, not RDN\u2019s interface." },
        { id: "data", t: "LPR + skip-trace data", s: "DRN \u00b7 Accurint \u00b7 TLO \u00b7 bureaus", d: "Plate-scan hits and skip-trace lookups feed location and dispatch. Results are masked before they reach any log or model." },
      ] },
      { col: "MuleSoft Anypoint \u00b7 API-led", blocks: [
        { id: "sapi", t: "System APIs", s: "One per system", d: "client-intake, azure-platform, legacy-erp, rdn, lpr, skiptrace and onprem-llm System APIs. Each one speaks a single system\u2019s format, so nothing downstream does." },
        { id: "papi", t: "Process APIs", s: "Built once, reused", d: "assignment-sync (Azure \u2194 legacy, accounting first), notes-normalize, dispatch, hold-close, recovery-event and agent-scorecard. The business logic lives here, not in point-to-point scripts." },
        { id: "eapi", t: "Experience APIs + MCP", s: "Lenders, agents, Fin, your agents", d: "client-status, agent-portal and borrower-service Experience APIs, plus MCP server endpoints that expose the same governed APIs as tools for Resolvion\u2019s production agents." },
        { id: "dw", t: "Canonical model", s: "Assignment \u00b7 Hold \u00b7 Recovery \u00b7 FeeLine", d: "One DataWeave model for Assignment, Vehicle, Recovery, ConditionReport, PersonalPropertyItem, Hold, FeeLine, Agent and AgentScore. Every lender and platform maps to it once." },
        { id: "dq", t: "Data quality + quarantine", s: "Held with a reason, retried", d: "Records that fail validation are held with a reason code and retried, not silently dropped, so accounting never posts a half-record." },
        { id: "mq", t: "Anypoint MQ", s: "Holds and closes", d: "Hold and close events ride a persistent queue straight to the agent, so they arrive in seconds and are never lost." },
        { id: "apim", t: "API Manager", s: "PII masking \u00b7 per-lender rules", d: "Policies applied without code: client ID and OAuth enforcement, threat protection, rate limiting and PII masking, plus per-lender data rules." },
        { id: "mon", t: "Monitoring + Exchange", s: "Alerts \u00b7 tracing \u00b7 catalog", d: "Every API is monitored and documented in Exchange, so the integration doesn\u2019t live in one person\u2019s head." },
      ] },
      { col: "Agent Fabric \u00b7 Resolvion platforms", blocks: [
        { id: "fabric", t: "MuleSoft Agent Fabric", s: "Registry \u00b7 broker \u00b7 governance \u00b7 spend", d: "Registers the agents and models Resolvion already runs, routes each task to the right model (on-site LLM, Claude or OpenAI) by policy, and tracks token spend per agent. Works with what you\u2019ve built; nothing is replaced." },
        { id: "azure", t: "New Platform (Azure)", s: "With embedded case + order agents", d: "The new build. MuleSoft keeps it in sync with the legacy ERP through MVP, and its agents use the same governed APIs through MCP." },
        { id: "legacy", t: "Legacy ERP (SQL Server)", s: "Accounting", d: "The ~20-year in-house system. It keeps accounting running until it retires; the bridge APIs are reused, not thrown away." },
        { id: "onprem", t: "On-site LLM", s: "PII stays on-site", d: "Normalizes inbound lender notes. Agent Fabric policy sends anything with borrower PII here, never to an external model." },
      ] },
      { col: "Experiences", blocks: [
        { id: "tab", t: "Tableau Cloud", s: "Exec scorecards \u00b7 Agent \u00b7 MCP \u00b7 digests", d: "Governed data from the MuleSoft flows, one definition per metric, row-level security. Player-card exec views built with Tableau Agent; digests for view-only users." },
        { id: "embed", t: "Tableau Embedded", s: "Agent scorecard portal", d: "Each recovery agent sees only their own scorecard plus anonymized peer benchmarks. Lender clients don\u2019t get analytics access." },
        { id: "fin", t: "Fin", s: "Borrower voice + chat", d: "Answers \u201cwhere\u2019s my car and my belongings?\u201d by calling borrower-service-eapi, with ID checks, scripted disclosures and escalation to a person. Runs alongside Agent Fabric, calling MuleSoft APIs." },
      ] },
    ],
    archNote: "Phase 1 scope: legacy ERP \u2194 New Platform (Azure) sync plus lender intake normalization, with every API built MCP-ready. Everything else is labelled Next.",

    answers: [
      { q: "Can every lender\u2019s assignment become one record, without borrower data leaving our walls?", a: "Yes. client-intake-sapi accepts every lender\u2019s channel, the on-site LLM normalizes the notes by policy, and DataWeave maps it once into a canonical assignment written to both platforms." },
      { q: "Can the new platform and the legacy ERP stay in sync for accounting through MVP?", a: "Yes. assignment-sync-papi moves fee lines both ways, holds bad records with a reason and retries them, and reconciles nightly. The same APIs are reused when the legacy ERP retires." },
      { q: "Will a hold reach the truck before the vehicle is recovered?", a: "Yes. The lender\u2019s hold rides Anypoint MQ to the agent\u2019s phone in seconds, is acknowledged, and every step is timestamped for compliance." },
      { q: "Does a recovery reach the lender, accounting and reporting inside 4 hours?", a: "Yes. The agent submits photos, the condition report and the inventory once; MuleSoft updates the lender, posts fees to the ERP and lands the metrics in Tableau." },
      { q: "Can borrowers get answers 24/7 without adding headcount or compliance risk?", a: "Yes. Fin resolves routine calls on live recovery data through a governed MuleSoft API, reads the required disclosures, and escalates the rest to a person with full context." },
      { q: "Can we control which model runs, what it costs, and where the data goes?", a: "Yes. Agent Fabric routes every task to the right model by policy, keeps PII on the on-site LLM, enforces each lender\u2019s rules and shows token spend per agent with budget alerts." },
      { q: "Will leadership actually open the dashboards?", a: "Yes. Player-card exec views built with Tableau Agent on governed data, and digests that bring the insight to the 90% who only view." },
      { q: "Can recovery agents compete on performance?", a: "Yes. A live, embedded scorecard shows each agent their rating and rank against anonymized peers, with row-level security so they see only their own data." },
    ],

    /* One proof line per step; the recap shows only the steps on the current path. */
    wrapProof: {
      "1.1": "A lender assignment became one canonical record in both platforms; the notes never left Resolvion",
      "1.2": "Agent Fabric policy routed borrower PII to the on-site LLM",
      "1.3": "Every lender\u2019s status codes mapped to one lifecycle",
      "2.1": "A fee line posted in the new platform appeared in the legacy ERP",
      "2.2": "A bad record was quarantined with a reason and retried, not dropped",
      "2.3": "Nightly reconciliation and lineage from Azure to the ERP",
      "3.1": "The best agent was selected by scorecard and distance, then pushed to RDN",
      "3.2": "A lender hold reached the agent\u2019s phone in 4 seconds",
      "3.3": "Release and close, acknowledged and audited",
      "4.1": "Photos, condition report and inventory inside the 4-hour standard",
      "4.2": "Fees to the ERP, status to the lender, metrics to Tableau",
      "5.1": "Fin answered \u201cwhere\u2019s my car?\u201d on live recovery data",
      "5.2": "A complex call escalated to a person with full context",
      "5.3": "Disclosures read, ID checked, PII masked in every log",
      "6.1": "Every task routed to the right model by policy",
      "6.2": "Token spend by agent and model, with a budget alert",
      "6.3": "A lender\u2019s data rule blocked an external model call",
      "7.1": "A player-card exec scorecard built with Tableau Agent",
      "7.2": "A digest brought the insight to view-only leaders",
      "8.1": "Coastal Recovery saw its rating and rank against peers",
      "8.2": "600+ agents, each seeing only their own data",
    },
    wrapChallenge: {
      "1": "Every lender sends a different format, and borrower PII can\u2019t leave Resolvion.",
      "2": "Two systems of record, kept in sync with scripts or by hand, while accounting can\u2019t stop.",
      "3": "A hold that arrives late is a wrongful repossession, a top CFPB concern.",
      "4": "Recovery details have to reach lenders, accounting and reporting inside 4 hours.",
      "5": "Call volume grows with delinquencies, and every call carries compliance risk.",
      "6": "Token spend across three model providers has no single view or policy.",
      "7": "Exec dashboards take a week and still look like spreadsheets.",
      "8": "Recovery agents get PDFs, not feedback they can act on.",
    },
    wrapOutcome: {
      cto: { short: "One policy and one spend view across every model.", full: "One policy, one spend view and per-lender rules across every model and agent, without replacing what was built." },
      dot: { short: "One governed bridge between old and new, reusable and MCP-ready.", full: "One governed bridge between the legacy ERP and the new platform, with quarantine, lineage and MCP-ready APIs." },
      data: { short: "Governed data with AI-assisted builds.", full: "Governed data arriving automatically, player-card exec views built with AI, and digests for the 90% who view." },
      cs: { short: "Routine calls resolved 24/7, with compliant escalation.", full: "Routine borrower calls resolved 24/7 on live data, with disclosures, ID checks and escalation with context." },
      agent: { short: "A live scorecard that rewards performance.", full: "Holds in seconds, one-time recovery submission and a live scorecard that rewards performance." },
    },
    roadmap: [
      ["Now \u2192 MVP", "MuleSoft bridge: Azure \u2194 legacy ERP (accounting) plus intake normalization, APIs built MCP-ready", "Phase 1"],
      ["Next", "Agent Fabric over existing agents and models: routing, spend, per-lender policy", "next"],
      ["Then", "Fin on the post-repossession line, starting with low-risk call types", "then"],
      ["Then", "Tableau Agent / MCP for exec views, and Tableau Embedded agent scorecards", "then"],
    ],
    nextSteps: [
      "60-minute technical deep-dive on the MVP bridge (Director of Technology + MuleSoft SE)",
      "Agent Fabric session with the CTO",
      "Tableau Agent / MCP workshop on one data set",
      "30-minute Fin voice session with Customer Service",
    ],
  };
})(window.PC);
