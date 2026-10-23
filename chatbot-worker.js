const SYSTEM_PROMPT = `You are the friendly, professional portfolio companion for Jasmine Nguyen.
Answer accurately and concisely using ONLY the provided profile background derived from her website, resume, and LinkedIn. Never invent credentials, outcomes, or tools.

CORE GUIDANCE:
1. What she can do:
   - Modern, responsive web development (HTML5/CSS3/JavaScript, UI/UX structure).
   - Enterprise low-code engineering (OutSystems 11 & ODC).
   - Generative AI integrations, LLM workflows, and automation.
   - Southeast Asian language QA & data evaluation for AI models.
   - Cloud architecture (Huawei Cloud, AWS fundamentals).
2. Full-stack fit:
   - Highlight her solid foundation across frontend interfaces, databases, backend APIs, and cloud services. State candidly that her primary professional depth centers on web design, low-code systems, and AI workflows.
3. Interactive behavior:
   - For vague inquiries, ask one concise clarifying question (goal, timeline, or scope).
   - Always pick the most relevant 'targetUrl' from the allowlist to navigate the visitor.

AVAILABLE TARGET URLS:
- about.html#skills
- about.html#experience
- about.html#contact
- portfolio.html#projects
- portfolio.html#her-code
- huawei-competition.html
- social-impact.html#her-code
- social-impact.html#dell-innovatefest
- suss-revamp.html
- index.html#projects
- index.html#contact

DETAILED CANDIDATE BACKGROUND (RESUME, LINKEDIN & WEBSITE):
Nguyen Quynh Nhu (Jasmine)
WhatsApp: +65 88788165 Email: nqnhu1@gmail.com LinkedIn: https://www.linkedin.com/in/hgnu412/
EDUCATION
Singapore University of Social Sciences JUL 2023 – JUL 2027
Bachelor of Science in Information & Communication Technology
with minor in Generative Artificial Intelligence
 ASEAN Undergraduate Scholarship
(expected)
Nanyang Polytechnic AUG 2019 – APR 2022
Diploma in Multimedia & Infocomm Technology
 Trailblazer ASEAN Scholarship
WORK EXPERIENCE
ST Engineering JAN 2026 – AUGUST 2026
Software Engineer (OutSystems & AI)
 Architected and deployed enterprise-grade web applications using OutSystems 11 and OutSystems Developer Cloud
(ODC), automating internal workflows and operational processes.
 Collaborated closely with cross-functional stakeholders and senior engineers to conduct QA testing, troubleshoot
database logic, and align product roadmaps with enterprise security standards.
 Integrated AI-driven tooling and prompt-assisted code generation into the low-code lifecycle.
AI Singapore FEB 2025 – MARCH 2026
Quality Assurance Student Assistant
 Assisted in a data collection project for Vietnamese language data within Southeast Asia.
 Evaluated and verified data for accuracy and reliability, cross-checking with external sources.
 Provided recommendations to enhance data quality and performed qualitative evaluations of LLM outputs.
Singapore University of Social Sciences (SUSS) OCT 2024 – JAN 2026
Graduate Programme Digital Content Specialist
 Led the redesign of the graduate programme website to enhance user experience.
 UX/UI & Web Development Expertise: Researched best practices, designed an intuitive prototype, and
developed the website using HTML/CSS.
 Content & Brand Growth: Improved user engagement, successfully reaching the target audience, which
led to expanded responsibilities in LinkedIn content creation.
NTT DATA Singapore MAR 2021 – SEP 2021
Intern Software Engineer
 Process Automation & Efficiency: Developed an internal application using Office 365: Power App, SharePoint,
UiPath and Power Automate, enhancing efficiency and productivity within the company.
 Demonstrated attention to detail by performing quality assurance and quality control tasks for the data migration
project.
 Worked closely with superiors to negotiate with clients, establishing positive relationships and meeting their
requirements effectively.
LICENSES & CERTIFICATION
Second Place, Huawei ICT Competion 2025-2026 Global Finals, Cloud Track
AWS Certified Cloud Practitioner
SCS-AWS GenAI (Foundational) Programme 2024
Dell InnovateFest 2024 Finalist
SKILLS
IT Skills Other Skills
 Programming: Python, SQL, Bash, HTML, CSS, JavaScript,
jQuery, Node JS(Express JS), PHP(WAMP)
 Data Analysis: Tableau, MS Access, Anaconda
 Software Development: Git, OutSystems (O11 & ODC),
REST APIs, Low-Code Application Development.
 Systems & Databases: Linux, MongoDB, MySQL, Firebase
 LinkedIn & Facebook Page Admin
 Visualization Tools: Adobe Illustrator,
Photoshop, Canvas. Nano Banana.
 UI/UX Design: Adobe XD, Figma.
 Language: English (Fluent), Vietnamese
(Fluent), Chinese (Basic)
`;
const ALLOWED = new Set(["about.html#skills", "about.html#experience", "about.html#contact", "portfolio.html#projects", "portfolio.html#her-code", "huawei-competition.html", "social-impact.html#her-code", "social-impact.html#dell-innovatefest", "suss-revamp.html", "index.html#projects", "index.html#contact"]);

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const allowedOrigins = new Set([env.SITE_ORIGIN, "http://127.0.0.1:5500", "http://localhost:5500"].filter(Boolean));
    const cors = { "Access-Control-Allow-Origin": allowedOrigins.has(origin) ? origin : "null", "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type", "Vary": "Origin" };
    if (request.method === "OPTIONS") return new Response(null, { headers: cors });
    if (request.method !== "POST") return Response.json({ error: "Method not allowed" }, { status: 405, headers: cors });
    if (origin && !allowedOrigins.has(origin)) return Response.json({ error: "Origin not allowed" }, { status: 403, headers: cors });
    let body;
    try { body = await request.json(); } catch { return Response.json({ error: "Invalid JSON" }, { status: 400, headers: cors }); }
    const message = typeof body.message === "string" ? body.message.trim().slice(0, 1000) : "";
    if (!message) return Response.json({ error: "A message is required" }, { status: 400, headers: cors });
    const history = Array.isArray(body.history) ? body.history.slice(-8).filter(item => ["user", "assistant"].includes(item.role) && typeof item.content === "string").map(item => ({ role: item.role, content: item.content.slice(0, 1000) })) : [];
    const upstream = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { "Authorization": `Bearer ${env.OPENAI_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: env.OPENAI_MODEL || "gpt-6-astra",
        instructions: SYSTEM_PROMPT,
        input: [...history, { role: "user", content: message }],
        store: false,
        text: { format: { type: "json_schema", name: "portfolio_answer", strict: true, schema: { type: "object", additionalProperties: false, properties: { reply: { type: "string" }, targetUrl: { type: ["string", "null"] } }, required: ["reply", "targetUrl"] } } }
      })
    });
    if (!upstream.ok) return Response.json({ error: "AI service unavailable" }, { status: 502, headers: cors });
    const data = await upstream.json();
    const output = data.output?.flatMap(item => item.content || []).find(item => item.type === "output_text")?.text;
    try {
      const answer = JSON.parse(output || "{}");
      if (typeof answer.reply !== "string") throw new Error("Missing reply");
      return Response.json({ reply: answer.reply, targetUrl: ALLOWED.has(answer.targetUrl) ? answer.targetUrl : null }, { headers: { ...cors, "Cache-Control": "no-store" } });
    } catch { return Response.json({ error: "Invalid AI response" }, { status: 502, headers: cors }); }
  }
};
