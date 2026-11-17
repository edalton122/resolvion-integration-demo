/* Single source of demo data. Everything here is fictional or illustrative unless marked public
   (Resolvion's own published claims on resolvion.com). No real borrower, lender or agent data. */
window.PC = (function () {
  const meta = {
    title: "One assignment, from lender to close.",
    northStar: "One assignment, from lender to close, connected, governed and agent-ready.",
    subtitle:
      "How MuleSoft, Agent Fabric, Fin and Tableau connect Resolvion\u2019s new platform, legacy ERP, agent network and call center, without replacing what you\u2019ve built.",
    preparedFor: "Prepared for Resolvion \u00b7 November 2026",
    presenter: "Eric Dalton, Solutions Engineer",
    disclaimer: "Illustrative demo. Sample data, not Resolvion production data. Product and partner screens simulated.",
    tagline: "Better Results, Lower Risk.",
    /* Public claims from resolvion.com. */
    stats: [
      { v: "50,000+", l: "new assignments a month" },
      { v: "10,000+", l: "recoveries a month" },
      { v: "600+", l: "recovery agents \u00b7 99% of the US" },
      { v: "80+", l: "lender clients" },
      { v: "2 hrs", l: "agent acceptance standard" },
      { v: "4 hrs", l: "recovery notice + condition report" },
    ],
  };

  /* Device-frame badges on the left pane. */
  const roles = {
    dot: { label: "Priya \u00b7 Director of Technology", sub: "Resolvion \u00b7 Technology", color: "#007FC4", device: "laptop" },
    cto: { label: "Marcus \u00b7 Chief Technology Officer", sub: "Resolvion \u00b7 Executive", color: "#112337", device: "laptop" },
    data: { label: "Devon \u00b7 AVP, Senior Data Scientist", sub: "Resolvion \u00b7 Reporting + Analytics", color: "#6B4FBB", device: "laptop" },
    cs: { label: "Renee \u00b7 VP, Post-Repossession + Customer Service", sub: "Resolvion \u00b7 Customer Service", color: "#0E8A7E", device: "laptop" },
    ops: { label: "Assignment desk", sub: "Resolvion \u00b7 Operations \u00b7 New Platform (Azure)", color: "#007FC4", device: "laptop" },
    acct: { label: "Accounting", sub: "Resolvion \u00b7 Legacy ERP (SQL Server)", color: "#54698D", device: "laptop" },
    agent: { label: "Coastal Recovery Co.", sub: "Contracted recovery agent \u00b7 Oceanside, CA", color: "#D9741C", device: "phone" },
    agentDesk: { label: "Coastal Recovery Co.", sub: "Agent portal \u00b7 Oceanside, CA", color: "#D9741C", device: "laptop" },
    borrower: { label: "Borrower call", sub: "\u201cIf your car was repossessed\u201d line \u00b7 Fin", color: "#0E8A7E", device: "phone" },
    lender: { label: "Lakeshore Auto Finance", sub: "Lender client (fictional)", color: "#3B4A5A", device: "laptop" },
  };

  /* Five personas: fictional first names, real role titles. */
  const personas = [
    {
      id: "cto",
      name: "Marcus",
      chip: "Marcus \u00b7 CTO",
      role: "Chief Technology Officer",
      org: "Resolvion \u00b7 Executive",
      question: "Who\u2019s the traffic cop for our models and our spend, while making sure our data doesn\u2019t leave our hands?",
      need: "One governed layer across the orchestrator and agents we already run: routes every request to the right model, caps token spend per agent and enforces each lender\u2019s data rules.",
      chapters: ["6", "1", "7", "8"],
      color: "#112337",
      initials: "M",
    },
    {
      id: "dot",
      name: "Priya",
      chip: "Priya \u00b7 Director of Technology",
      role: "Director of Technology",
      org: "Resolvion \u00b7 Technology",
      question: "How do old and new stay in sync for accounting until MVP, without throwaway point-to-point code?",
      need: "Reusable, monitored APIs from the new Azure platform to the legacy ERP, with strict guardrails, error quarantine and reconciliation, built MCP-ready so our agents can use them securely.",
      chapters: ["1", "2", "3"],
      color: "#007FC4",
      initials: "P",
    },
    {
      id: "data",
      name: "Devon",
      chip: "Devon \u00b7 Reporting lead",
      role: "AVP, Senior Data Scientist",
      org: "Resolvion \u00b7 Reporting + Analytics",
      question: "How do I give execs views that are concise and easy to see, not a spreadsheet with red and green dots?",
      need: "Governed data arriving in Tableau automatically, exec views built by prompt instead of by one or two people on Desktop, and digests for the 90% who only view.",
      chapters: ["7", "4"],
      color: "#6B4FBB",
      initials: "D",
    },
    {
      id: "cs",
      name: "Renee",
      chip: "Renee \u00b7 VP, Customer Service",
      role: "VP, Post-Repossession + Customer Service",
      org: "Resolvion \u00b7 Customer Service",
      question: "How do I answer \u201cwhere\u2019s my car and my belongings?\u201d around the clock without adding headcount or compliance risk?",
      need: "An AI service agent that resolves routine borrower calls with live recovery data, follows scripted disclosures and ID checks, and escalates the rest.",
      chapters: ["5"],
      color: "#0E8A7E",
      initials: "R",
    },
    {
      id: "agent",
      name: "Coastal Recovery Co.",
      chip: "Coastal Recovery \u00b7 Agent",
      role: "Contracted recovery agent (owner)",
      org: "External partner \u00b7 Oceanside, CA",
      question: "How do I win more Resolvion assignments?",
      need: "A simple player card showing my strengths and weaknesses: acceptance time, update cadence, condition-report SLA, recovery rate and coverage, against anonymized peers.",
      chapters: ["3", "4", "8"],
      color: "#D9741C",
      initials: "CR",
    },
  ];

  /* Persona cards shown on each chapter entry and persona handoff, keyed "chapter:persona".
     q overrides the chapter question as the card's headline question. */
  const vignettes = {
    "1:dot": { matters: [
      "Every lender\u2019s format lands as one canonical assignment, without another custom parser",
      "Borrower PII in lender notes never leaves our own servers",
      "The same record reaches the new platform and the legacy ERP, so nothing is keyed twice",
    ] },
    "1:cto": { q: "Can we use AI on lender notes without sending borrower data out the door?", matters: [
      "Sensitive notes go to our on-site model, by policy, every time",
      "One routing rule, not a promise in every app",
      "An audit trail that shows where each request went",
    ] },
    "2:dot": { q: "How do old and new stay in sync until MVP?", matters: [
      "Accounting keeps running on the legacy ERP while the new platform goes live",
      "A bad record is held with a reason and retried, not silently dropped",
      "The bridge is reused when the legacy ERP retires, not thrown away",
    ] },
    "3:dot": { q: "Can a hold reach the truck before the hook goes on?", matters: [
      "Holds and closes delivered in seconds, not on the next sync",
      "Every hold is acknowledged and timestamped for compliance",
      "The best available agent is selected by scorecard and distance, automatically",
    ] },
    "3:agent": { q: "Will I know about a hold before I recover the vehicle?", matters: [
      "The hold shows up on my phone in seconds",
      "No calls back and forth to confirm",
      "A clean record that I stopped when I was told to",
    ] },
    "4:agent": { matters: [
      "Photos, condition report and inventory submitted once, from the lot",
      "Inside the 4-hour standard without chasing anyone",
      "My fees move to accounting automatically",
    ] },
    "4:data": { q: "Does recovery data reach reporting without anyone exporting it?", matters: [
      "Recovery, SLA and fee data lands in Tableau as it happens",
      "One definition per metric, so every dashboard agrees",
      "No week-long data pull before every exec review",
    ] },
    "5:cs": { matters: [
      "Routine \u201cwhere\u2019s my car?\u201d calls answered 24/7 with live recovery data",
      "ID checks and required disclosures, every call",
      "Complex or upset callers handed to a person with full context",
    ] },
    "6:cto": { matters: [
      "One traffic cop over the orchestrator and agents we already run; nothing replaced",
      "Token spend by agent and model, capped with a budget per agent",
      "Per-lender data rules enforced centrally, so our data doesn\u2019t leave our hands",
    ] },
    "7:data": { matters: [
      "Exec views that look like a player card, not a spreadsheet",
      "Built by prompt on governed data, not by one or two people on Desktop",
      "A digest for the 90% who only view",
    ] },
    "7:cto": { q: "Can exec views be concise and easy to see?", matters: [
      "Player-card style views for the exec team",
      "The same trusted numbers billing and ops use",
      "Insights that come to leaders, not the other way round",
    ] },
    "8:agent": { q: "Where are my strengths and weaknesses?", matters: [
      "See exactly how I rank against peers, anonymized",
      "Know which metric to improve to win more assignments",
      "Simple enough to read on a phone in the truck",
    ] },
    "8:cto": { q: "Can agents compete on performance, so the best work gets the work?", matters: [
      "A live player card for 600+ agents, each seeing only their own data",
      "Whoever does the best work gets forwarded the work: better results, lower risk",
      "Built on the same governed data, no separate reporting project",
    ] },
  };

  /* The sample assignment that runs through every chapter. */
  const lender = { id: "LAF-2207", name: "Lakeshore Auto Finance", type: "Captive / independent lender (fictional)", channel: "API", rules: "Notes may not leave Resolvion\u2019s environment" };
  const vehicle = { year: 2022, make: "Honda", model: "Accord EX", color: "Gray", vin: "1HGCV1F3XNA000000", vinMasked: "1HGCV1F3\u2022\u2022\u2022\u2022\u20220000", plate: "8\u2022\u2022\u2022\u2022\u202217" };
  const borrower = { name: "J. Doe", city: "Riverside, CA", phone: "(\u2022\u2022\u2022) \u2022\u2022\u2022-\u2022\u2022\u202241", dob: "\u2022\u2022/\u2022\u2022/19\u2022\u2022", ssn: "\u2022\u2022\u2022-\u2022\u2022-\u2022\u2022\u2022\u2022" };
  const agent = {
    id: "AG-0612", name: "Coastal Recovery Co.", city: "Oceanside, CA", lot: "Oceanside lot",
    distance: "11.4 mi", acceptance: "38 min", cadence: "2.6 / week", reportOnTime: "97%", recoveryRate: "41%", rating: 88,
  };
  const assignment = {
    id: "RSV-26-0481723",
    lenderRef: "ACCT 55-0193-882",
    type: "Involuntary repossession \u00b7 consumer auto",
    placed: "Tue, Nov 17 \u00b7 8:14 AM PT",
    /* Synthetic note (fully fictional), in the shape lenders send. */
    rawNote: [
      "ACCT 55-0193-882 / LAKESHORE AUTO FIN / ASSIGN TYPE: INVOL REPO",
      "2022 HONDA ACCORD EX VIN 1HGCV1F3XNA000000 CLR GRY",
      "BWR ADV VEH MAY BE AT EMPLOYER LOT - RIVERSIDE (LAST SEEN 11/12). CO-BWR",
      "NOT ON TITLE. PRIOR SKIP CONFIRMED NEW ADDR. **DO NOT CONTACT AT WORK PER",
      "BWR REQ 10/30** PP: CHILD SEAT REPORTED IN VEH. HOLD IF PMT POSTS - CK",
      "BEFORE PICKUP. CALL CR MGR B4 IMPOUND REL.",
    ].join("\n"),
    piiTerms: ["ACCT 55-0193-882", "EMPLOYER LOT - RIVERSIDE", "CONFIRMED NEW ADDR"],
    normalized: {
      vehicle: "2022 Honda Accord EX \u00b7 Gray \u00b7 VIN \u2022\u2022\u20220000",
      location_hints: "Employer lot, Riverside \u00b7 last seen 11/12",
      contact_restriction: "Do not contact at work (borrower request 10/30)",
      personal_property: "Child seat reported in vehicle",
      hold_condition: "Hold if payment posts; check before pickup",
      escalation: "Call lender credit manager before impound release",
    },
  };

  /* Canonical assignment lifecycle. `milestones` keeps the template's shape (label / field / value / sla). */
  const milestones = [
    { label: "Placed by lender", field: "placed", value: "8:14 AM" },
    { label: "Normalized + validated", field: "normalized", value: "8:14 AM" },
    { label: "Assigned to agent", field: "assigned", value: "8:16 AM" },
    { label: "Accepted by agent", field: "accepted", value: "8:54 AM", sla: true },
    { label: "Located (LPR / skip)", field: "located", value: "Wed 6:02 AM" },
    { label: "Hold", field: "hold", value: "Wed 10:42 AM", sla: true },
    { label: "Released", field: "released", value: "Thu 9:05 AM" },
    { label: "Recovered", field: "recovered", value: "Thu 11:20 PM" },
    { label: "Condition report + photos", field: "condition_report", value: "Fri 2:32 AM", sla: true },
    { label: "In storage", field: "in_storage", value: "Fri 2:32 AM" },
    { label: "Personal property pickup", field: "property_pickup", value: "" },
    { label: "Redeemed or remarketed", field: "closed", value: "" },
  ];

  /* How each source names the same status. Codes illustrative, not taken from vendor API docs. */
  const statusMap = [
    { canon: "ASSIGNED", lender: "PLACED", rdn: "New / Open", portal: "Submitted" },
    { canon: "ACCEPTED", lender: "ACK", rdn: "Accepted", portal: "In progress" },
    { canon: "HOLD", lender: "HLD", rdn: "On Hold", portal: "Hold" },
    { canon: "CLOSED", lender: "CLS", rdn: "Closed", portal: "Cancelled" },
    { canon: "RECOVERED", lender: "REPO", rdn: "Repossessed", portal: "Recovered" },
  ];

  const canonical = {
    assignment_id: "RSV-26-0481723", source: "LENDER_SYSTEM", lender_id: "LAF-2207", lender_ref: "tokenized",
    collateral: { type: "VEHICLE", year: 2022, make: "HONDA", model: "ACCORD EX", color: "GRAY", vin: "1HGCV1F3XNA000000" },
    borrower: { name: "masked", account: "tokenized", address: "tokenized" },
    status: "ASSIGNED", contact_restriction: "NO_CONTACT_WORK", hold_condition: "PAYMENT_POSTS",
    personal_property_flag: true, escalation: "CREDIT_MGR_BEFORE_RELEASE",
    placed_at: "2026-11-17T16:14:00Z",
  };

  const holdEvent = { received: "10:42:07", delivered: "10:42:11", seconds: 4, reason: "Payment posted with lender", ack: "10:42:19" };

  const personalProperty = [
    { item: "Child seat", loc: "Rear seat" },
    { item: "Phone charger", loc: "Center console" },
  ];
  const pickup = { window: "Thu 9\u201311 AM", lot: "Oceanside lot (fictional)", hours: "8 AM\u20135 PM" };

  /* First accounting objects over the bridge: fee lines roll up to the lender's client invoice in the legacy ERP.
     Agent billing already runs in RDN, so agent payables and GL posting are shown as later objects. */
  const invoice = { id: "INV-LAF-2611-0042", lender: "Lakeshore Auto Finance", period: "Nov 2026", next: ["Agent payables", "GL posting"] };

  /* Sample amounts only. */
  const feeLines = [
    { code: "REC-FEE", label: "Recovery fee", amt: "$000.00" },
    { code: "STOR-DAY", label: "Storage, per day", amt: "$00.00" },
    { code: "TRANS", label: "Transport", amt: "$00.00" },
    { code: "PP-HANDLE", label: "Personal-property handling", amt: "$00.00" },
  ];

  /* Agent Fabric: what it sits across (Resolvion's own orchestrator and agents), models, routing rules, spend.
     Generic agent names; GA features only (Model Proxy, Model Wallet, FinOps Dashboard, Policy Catalog). Fin is not registered here. */
  const fabric = {
    agents: [
      { id: "orch", name: "Resolvion orchestrator", where: "Existing", owner: "Technology" },
      { id: "case", name: "Case Evaluation Agent", where: "New platform (Azure)", owner: "Technology" },
      { id: "order", name: "Order Evaluation Agent", where: "New platform (Azure)", owner: "Technology" },
      { id: "notes", name: "Notes Normalizer (on-site)", where: "On-site model (GPU)", owner: "Technology" },
    ],
    models: [
      { id: "onprem", name: "On-site model", cost: "no marginal cost", rule: "Anything with borrower PII" },
      { id: "claude", name: "Claude", cost: "per token", rule: "Code and complex reasoning" },
      { id: "openai", name: "OpenAI (enterprise)", cost: "per token", rule: "General summarization, no PII" },
    ],
    spend: [
      { model: "On-site model", tokens: "41.2M", share: 58 },
      { model: "OpenAI", tokens: "19.6M", share: 28 },
      { model: "Claude", tokens: "9.8M", share: 14 },
    ],
    wallet: { agent: "Order Evaluation Agent", used: 86, rule: "Capped at 100% of today\u2019s Model Wallet budget" },
    policy: { id: "lender.LAF-2207.pii-on-site", rule: "Lakeshore (sample lender): borrower PII must stay on-site" },
  };

  /* Recovery agent scorecard (FIFA-style card) and anonymized peers. */
  const scorecard = {
    overall: 88,
    attrs: [
      { k: "ACC", l: "Acceptance time", v: 91, raw: "38 min median" },
      { k: "UPD", l: "Update cadence", v: 84, raw: "2.6 / week" },
      { k: "RPT", l: "Condition report on time", v: 95, raw: "97% inside 4 hrs" },
      { k: "REC", l: "Recovery rate", v: 82, raw: "41%" },
      { k: "COV", l: "Coverage + distance", v: 90, raw: "11.4 mi to target" },
    ],
    rank: { pos: 4, of: 37, region: "Southern California" },
    /* Anonymized peers in the same region: median and top-5 average per attribute. */
    peers: { ACC: [84, 95], UPD: [88, 94], RPT: [89, 96], REC: [77, 86], COV: [85, 93] },
    board: [{ n: "Agent A", v: 93 }, { n: "Agent B", v: 91 }, { n: "Agent C", v: 90 }, { n: "You", v: 88, me: true }, { n: "Agent E", v: 86 }],
    move: { attr: "UPD", peerTop: "4.1 / week", ask: "One status update per open assignment every two days", projected: 90, rank: 2 },
  };

  /* Exec scorecard (Tableau): headline numbers and the top agent per region. Agent names are fictional. */
  const execView = {
    bans: [
      { k: "Accepted inside 2 hrs", v: "94%", d: "\u25b2 2 pts vs last month", c: "good" },
      { k: "Condition report inside 4 hrs", v: "96%", d: "\u25b2 1 pt", c: "good" },
      { k: "Hold to truck (median)", v: "4 s", d: "every hold delivered", c: "good" },
      { k: "Regions below report SLA", v: "2", d: "Gulf Coast \u00b7 Mountain", c: "bad" },
    ],
    tops: [
      { region: "SoCal", name: "Mesa Ridge Recovery", v: 93, a: [["ACC", 95], ["RPT", 97], ["UPD", 92]] },
      { region: "NorCal", name: "Bayline Recovery", v: 90, a: [["ACC", 90], ["RPT", 95], ["UPD", 89]] },
      { region: "Texas", name: "Pecos Trail Recovery", v: 91, a: [["ACC", 93], ["RPT", 94], ["UPD", 90]] },
      { region: "Florida", name: "Sawgrass Recovery", v: 89, a: [["ACC", 88], ["RPT", 93], ["UPD", 91]] },
    ],
  };

  /* Scale: assignments a month (illustrative growth on Resolvion's public 50,000+ figure). */
  const scale = [
    { label: "Today", assignments: 50000, events: 1800000, replicas: 2 },
    { label: "Growth", assignments: 75000, events: 2700000, replicas: 2 },
    { label: "Peak month", assignments: 100000, events: 3600000, replicas: 4 },
  ];

  const outage = { system: "RDN", start: "2:14 PM", end: "2:31 PM", queued: 1284 };

  /* MuleSoft platform certifications (MuleSoft Trust Center). */
  const security = {
    certs: ["ISO 27001", "SOC 1", "SOC 2", "PCI DSS"],
    supports: ["HIPAA", "GDPR"],
    policies: ["Client ID Enforcement", "OAuth 2.0 Token Enforcement", "JSON Threat Protection", "PII masking for logs (Omni Gateway)", "Rate Limiting"],
    regs: ["CFPB", "FTC", "FDCPA", "GLBA", "UDAAP"],
  };

  const scope = {
    phase1: ["New Platform (Azure) \u2192 legacy ERP sync, accounting first", "Lender intake normalization", "APIs built MCP-ready"],
    out: [
      ["Agent Fabric", "Next: Model Proxy routing, Model Wallet budgets and per-lender policy over existing agents"],
      ["Fin", "Then: post-repossession line, low-risk call types first"],
      ["Tableau MCP + Embedded", "Then: exec scorecards (Studio with Tableau+) and the agent portal"],
      ["Informatica", "Not in this story"],
    ],
  };

  return {
    meta, roles, personas, vignettes, lender, vehicle, borrower, agent, assignment, milestones, statusMap, canonical,
    holdEvent, personalProperty, pickup, invoice, feeLines, fabric, scorecard, execView, scale, outage, security, scope,
  };
})();
