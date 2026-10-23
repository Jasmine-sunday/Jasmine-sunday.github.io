(() => {
  const ENDPOINT = window.PORTFOLIO_CHAT_API_ENDPOINT || "https://portfolio-chatbot-worker.nqnhu1.workers.dev";
  const SYSTEM_PROMPT = `You are Jasmine Nguyen's portfolio assistant. Answer accurately and concisely using only the portfolio context below. Do not invent skills, outcomes, dates, or credentials. When useful, set targetUrl to one allowed destination: about.html#skills, about.html#experience, about.html#contact, portfolio.html#projects, portfolio.html#her-code, huawei-competition.html, social-impact.html#her-code, social-impact.html#dell-innovatefest, suss-revamp.html, index.html#projects, index.html#contact. For skills use about.html#skills; for work history use about.html#experience; for contact use about.html#contact; for project questions use the matching project page. Return JSON {"reply":"...","targetUrl":"..."}.

Context: Jasmine Nguyen is a SUSS Information & Communication Technology undergraduate (2023–2027), ASEAN Undergraduate Scholar, with a Generative AI minor and a Multimedia & Infocomm Technology diploma from Nanyang Polytechnic (GPA 3.76/4). She is a software engineer and AI integrator interested in human-centered technology and ASEAN digital impact. Experience: ST Engineering Software Engineer intern (OutSystems, workflow automation, MSS AI Workbench, DS&C AI Playground, AI agents; Jan–Aug 2026); AI Singapore QA Student Assistant (regional Southeast Asian language data creation and evaluation; Feb 2025–Mar 2026); SUSS Graduate Programme Digital Content Specialist (HTML/CSS website revamp/content; Oct 2024–Jan 2026); NTT DATA intern; Bizgram sales assistant. Jasmine can help with website creation and revamps (HTML/CSS, content structure, responsive UX), OutSystems low-code development, AI-agent and workflow automation integration, AI/data quality support for Southeast Asian languages, and video creation/editing and digital content. Do not overstate video production scope; invite visitors to share intended format and needs. Skills/projects include web development, UX, OutSystems, AI and cloud foundations, multilingual data QA, Huawei ICT Competition Global Final Second Prize (Cloud Track, June 2026), Her Code, Her Cause patient emotional-support app, Dell InnovateFest IM-FIT senior social/physical activity web app, and SUSS Graduate Studies website revamp. For full-stack readiness, explain that she has relevant front-end/web and software engineering experience plus automation/cloud/AI exposure; describe this as a credible foundation and note that production back-end depth should be assessed against the specific role. When a visitor's request is broad, ask one short follow-up about their goal, audience, platform, or deadline. Contact: nqnhu1@gmail.com, LinkedIn linkedin.com/in/hgnu412, GitHub github.com/Jasmine-sunday.`;

  const destinations = new Set([
    "about.html#skills", "about.html#experience", "about.html#contact",
    "portfolio.html#projects", "portfolio.html#her-code", "huawei-competition.html",
    "social-impact.html#her-code", "social-impact.html#dell-innovatefest",
    "suss-revamp.html", "index.html#projects", "index.html#contact",
    "https://www.linkedin.com/in/hgnu412/", "https://github.com/Jasmine-sunday"
  ]);

  const flower = '<span class="pc-jasmine" aria-hidden="true"><i class="pc-petal petal-top"></i><i class="pc-petal petal-right-top"></i><i class="pc-petal petal-right-bottom"></i><i class="pc-petal petal-left-bottom"></i><i class="pc-petal petal-left-top"></i><b class="pc-flower-face"></b><em class="pc-leaf"></em></span>';
  const styles = `<button class="pc-launch" type="button" aria-label="Open portfolio assistant" aria-expanded="false">${flower}<span class="pc-launch-label">Jasmine's AI Buddy</span></button><section class="pc-panel" role="dialog" aria-label="Jasmine's portfolio assistant" aria-modal="false" hidden><header class="pc-header"><div class="pc-heading">${flower.replace('pc-jasmine"', 'pc-jasmine pc-jasmine-small"')}<div><span class="pc-kicker">JASMINE’S AI BUDDY</span><h2>What can I help you find?</h2></div></div><button class="pc-close" type="button" aria-label="Close chat">×</button></header><div class="pc-messages" aria-live="polite" aria-relevant="additions"><div class="pc-message pc-bot">Hi! I can tell you what Jasmine can help with, share project details, or guide you around the portfolio. 🌼</div></div><div class="pc-quick"><button type="button">What can Jasmine help me build?</button><button type="button">Is Jasmine suitable for a full-stack role?</button></div><form class="pc-form"><label class="pc-sr-only" for="pc-input">Your question</label><input id="pc-input" name="message" maxlength="1000" placeholder="Ask your AI buddy…" autocomplete="off" required><button type="submit" aria-label="Send message">↑</button></form><p class="pc-footnote">Answers are based on Jasmine’s portfolio.</p></section>`;
  document.body.insertAdjacentHTML("beforeend", styles);

  const launch = document.querySelector(".pc-launch");
  const panel = document.querySelector(".pc-panel");
  const feed = document.querySelector(".pc-messages");
  const form = document.querySelector(".pc-form");
  const input = document.querySelector("#pc-input");
  const chatHistory = [];

  function openChat(open) {
    panel.hidden = !open;
    launch.setAttribute("aria-expanded", String(open));
    launch.setAttribute("aria-label", open ? "Close portfolio assistant" : "Open portfolio assistant");
    if (open) input.focus();
  }

  launch.addEventListener("click", () => openChat(panel.hidden));
  document.querySelector(".pc-close").addEventListener("click", () => openChat(false));
  document.querySelectorAll(".pc-quick button").forEach((button) => button.addEventListener("click", () => {
    input.value = button.textContent.includes("full-stack") ? "Is Jasmine suitable for a full-stack role?" : "What can Jasmine help me build?";
    form.requestSubmit();
  }));

  function addMessage(text, role, targetUrl) {
    const bubble = document.createElement("div");
    bubble.className = `pc-message ${role === "user" ? "pc-user" : "pc-bot"}`;
    bubble.textContent = text;
    if (targetUrl && destinations.has(targetUrl)) {
      const action = document.createElement("a");
      action.className = "pc-action";
      action.textContent = targetUrl.startsWith("https:") ? "Open link ↗" : "Go to this section →";
      action.href = targetUrl;
      if (targetUrl.startsWith("https:")) { 
        action.target = "_blank"; 
        action.rel = "noopener noreferrer"; 
      }
      action.addEventListener("click", (event) => {
        const [page, anchor] = targetUrl.split("#");
        const currentPage = location.pathname.split("/").pop() || "index.html";
        if (anchor && (page === currentPage || page === "")) {
          const section = document.getElementById(anchor);
          if (section) { 
            event.preventDefault(); 
            section.scrollIntoView({ behavior: "smooth" }); 
            window.history.pushState(null, "", `#${anchor}`); 
            openChat(false); 
          }
        }
      });
      bubble.append(action);
    }
    feed.append(bubble);
    feed.scrollTop = feed.scrollHeight;
  }

  function followCurrentPageTarget(targetUrl) {
    if (!targetUrl || targetUrl.startsWith("https:")) return;
    const [page, anchor] = targetUrl.split("#");
    const currentPage = location.pathname.split("/").pop() || "index.html";
    if (anchor && (page === currentPage || page === "")) {
      const section = document.getElementById(anchor);
      if (section) {
        setTimeout(() => section.scrollIntoView({ behavior: "smooth" }), 200);
        window.history.pushState(null, "", `#${anchor}`);
      }
    }
  }

  function localAnswer(question) {
    const q = question.toLowerCase();
    if (/what can|able to do|services|help me|build for me|capabilit|create/.test(q)) return { reply: "Jasmine can help with website creation and revamps, responsive UX and content structure, OutSystems low-code solutions, AI-agent and workflow automation integration, Southeast Asian language data quality, and video or digital-content creation/editing. What are you hoping to make, who is it for, and what platform or deadline do you have in mind?", targetUrl: "about.html#skills" };
    if (/full.?stack|backend|back-end|role|hire|suitable/.test(q)) return { reply: "Jasmine has a solid foundation for a full-stack role: she has built web experiences with HTML/CSS, studied software engineering, and worked with OutSystems, workflow automation, cloud architecture, and AI-agent solutions. Her portfolio shows stronger evidence in front-end delivery and integration; confirm the depth of back-end ownership needed for your role.", targetUrl: "about.html#skills" };
    if (/contact|email|linkedin|github/.test(q)) return { reply: "You can contact Jasmine by email or connect through LinkedIn and GitHub.", targetUrl: "about.html#contact" };
    if (/huawei|award|competition|cloud track/.test(q)) return { reply: "Jasmine’s team won Second Prize at the Huawei ICT Competition 2025–2026 Global Final in Shenzhen, competing in the Cloud Track.", targetUrl: "huawei-competition.html" };
    if (/her code|breast cancer|patient|women dev/.test(q)) return { reply: "At Her Code, Her Cause, Jasmine’s team created a supportive app concept for breast cancer patients, with emotional check-ins, encouragement, and resources.", targetUrl: "social-impact.html#her-code" };
    if (/dell|im-fit|senior|isolation/.test(q)) return { reply: "For Dell InnovateFest 2024, Jasmine’s team developed IM-FIT, a web application encouraging social and physical activities to help address isolation among seniors.", targetUrl: "social-impact.html#dell-innovatefest" };
    if (/suss|website|revamp|content specialist/.test(q)) return { reply: "Jasmine revamped and maintained the SUSS Graduate Studies website using HTML and CSS, working with faculty, the programme team, and in-house IT.", targetUrl: "suss-revamp.html" };
    if (/experience|work history|intern|st engineering|ai singapore/.test(q)) return { reply: "Jasmine’s experience includes software engineering and AI-agent work at ST Engineering, multilingual data quality work at AI Singapore, and a SUSS website and content role.", targetUrl: "about.html#experience" };
    if (/skill|technology|stack|outsystems|ai|cloud/.test(q)) return { reply: "Her focus spans web development and UX, OutSystems and workflow automation, AI-agent integration, cloud foundations, and Southeast Asian language data quality.", targetUrl: "about.html#skills" };
    if (/project|portfolio|work/.test(q)) return { reply: "Jasmine’s portfolio features the Huawei global competition, social-impact hackathon projects, and the SUSS Graduate Studies website revamp.", targetUrl: "portfolio.html#projects" };
    if (/education|school|study|degree|diploma/.test(q)) return { reply: "Jasmine studies Information & Communication Technology at SUSS, with a minor in Generative AI. She also holds a Multimedia & Infocomm Technology diploma from Nanyang Polytechnic.", targetUrl: "about.html#experience" };
    return { reply: "I can help with Jasmine’s skills, work experience, education, contact details, or projects such as Huawei, Her Code, Her Cause, Dell InnovateFest, and the SUSS website revamp. What would you like to know?", targetUrl: "portfolio.html#projects" };
  }

  async function getAnswer(message) {
    if (!ENDPOINT) return localAnswer(message);
    const response = await fetch(ENDPOINT, {
      method: "POST", 
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, history: chatHistory.slice(-8) })
    });
    if (!response.ok) throw new Error(`Assistant endpoint returned ${response.status}`);
    const data = await response.json();
    if (typeof data.reply !== "string") throw new Error("Invalid assistant response");
    return { reply: data.reply, targetUrl: destinations.has(data.targetUrl) ? data.targetUrl : null };
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const message = input.value.trim();
    if (!message) return;
    input.value = "";
    addMessage(message, "user");
    chatHistory.push({ role: "user", content: message });
    const submit = form.querySelector("button");
    submit.disabled = true;

    const pending = document.createElement("div");
    pending.className = "pc-message pc-bot pc-pending";
    pending.textContent = "Thinking…";
    feed.append(pending);

    try {
      const answer = await getAnswer(message);
      pending.remove();
      addMessage(answer.reply, "assistant", answer.targetUrl);
      followCurrentPageTarget(answer.targetUrl);
      chatHistory.push({ role: "assistant", content: answer.reply });
    } catch (error) {
      pending.remove();
      const answer = localAnswer(message);
      addMessage(`${answer.reply} (Using the portfolio guide while the AI service is unavailable.)`, "assistant", answer.targetUrl);
      followCurrentPageTarget(answer.targetUrl);
      chatHistory.push({ role: "assistant", content: answer.reply });
    } finally {
      submit.disabled = false;
      input.focus();
    }
  });
})();