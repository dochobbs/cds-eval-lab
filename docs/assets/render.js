// CDS Eval Lab — render site from data.json. All values escaped before insertion.

(async function () {
  const esc = s => String(s).replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[c]);

  const res = await fetch("assets/data.json");
  const data = await res.json();
  const setHTML = (id, html) => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
  };
  const setText = (id, t) => {
    const el = document.getElementById(id);
    if (el) el.textContent = t;
  };

  // Hero stats
  setHTML("statgrid", data.lab.summary_stats.map(s => `
    <div class="stat">
      <div class="v">${esc(s.value)}</div>
      <div class="l">${esc(s.label)}</div>
    </div>
  `).join(""));

  // Scope callout (single)
  setText("scope-blurb", data.scope.blurb);

  // Suites — with provenance and turn tags
  const suiteTagClass = label => {
    const l = label.toLowerCase();
    if (l.includes("peds") || l.includes("pediat")) return "peds";
    if (l.includes("adapted") || l.includes("adversarial")) return "hot";
    return "";
  };
  setHTML("suite-list", data.suites.map(s => {
    const tags = [s.provenance, s.turn_mode, s.focus].filter(Boolean);
    return `
      <div class="suite-row">
        <div>
          <div class="code">${esc(s.code)}</div>
          <div class="tags">
            ${tags.map(t => `<span class="tag ${suiteTagClass(t)}">${esc(t)}</span>`).join("")}
          </div>
        </div>
        <div>
          <div class="name">${esc(s.name)}</div>
          <div class="purpose">${esc(s.purpose)}</div>
          <div class="scored">SCORED BY · ${esc(s.scored_by)}</div>
        </div>
        <div class="n">${esc(s.n)}<span class="lbl">queries</span></div>
      </div>
    `;
  }).join(""));

  // Example queries
  setHTML("query-grid", data.example_queries.map(q => `
    <div class="query-card">
      <div class="meta">
        <span class="domain">${esc(q.domain)}</span>
        <span class="sep">·</span>
        <span class="tag">${esc(q.tag)}</span>
        <span class="tag">${esc(q.difficulty)}</span>
      </div>
      <p class="desc">${esc(q.description)}</p>
      <div class="catches">${esc(q.what_it_catches)}</div>
    </div>
  `).join(""));

  // Leaderboard
  const sortedLb = [...data.leaderboard].sort((a, b) =>
    (b.accuracy + b.completeness + b.specificity) -
    (a.accuracy + a.completeness + a.specificity)
  );
  const fmtCost = c => c === 0 ? "$0.00" : "$" + c.toFixed(c < 0.1 ? 3 : 2);
  setHTML("lb-body", sortedLb.map(r => `
    <tr>
      <td>
        <div class="system">${esc(r.system)}</div>
        <span class="cat">${esc(r.category)}</span>
      </td>
      <td class="num">${esc(r.accuracy)}</td>
      <td class="num">${esc(r.completeness)}</td>
      <td class="num">${esc(r.specificity)}</td>
      <td class="num">${esc(r.citations)}</td>
      <td class="num">${esc(r.latency_s)}s</td>
      <td class="num">${esc(fmtCost(r.cost_per_q_usd))}</td>
    </tr>
  `).join(""));

  // Per-suite breakdown
  const headers = data.suite_scores.headers;
  const fmts = data.suite_scores.header_format;
  const rows = data.suite_scores.rows;
  const maxByCol = headers.map((_, i) => {
    const vals = rows.map(r => r.scores[i]).filter(v => v != null);
    return vals.length ? Math.max(...vals) : 1;
  });
  setHTML("suite-table", `
    <table>
      <thead>
        <tr>
          <th>System</th>
          ${headers.map((h, i) =>
            `<th>${esc(h)}<span class="fmt">${esc(fmts[i])}</span></th>`).join("")}
        </tr>
      </thead>
      <tbody>
        ${rows.map(r => `
          <tr>
            <td>${esc(r.system)}</td>
            ${r.scores.map((v, i) => {
              if (v == null) return `<td><span style="color:var(--text-faint)">—</span></td>`;
              const pct = (v / maxByCol[i]) * 100;
              const w = Math.max(8, pct * 0.6).toFixed(0);
              return `<td><span class="bar" style="width:${w}px"></span>${esc(v)}</td>`;
            }).join("")}
          </tr>
        `).join("")}
      </tbody>
    </table>
  `);

  // Timeline
  setHTML("timeline-list", data.timeline.map(t => `
    <div class="tl-item">
      <div class="date">${esc(t.date)}</div>
      <div class="phase">${esc(t.phase)}</div>
      <h3>${esc(t.title)}</h3>
      <p>${esc(t.body)}</p>
    </div>
  `).join(""));
  if (data.timeline_meta && data.timeline_meta.framing) {
    setHTML("timeline-framing", `
      <div class="framing">
        <span class="lbl">The four hinges</span>
        <p>${esc(data.timeline_meta.framing)}</p>
      </div>
    `);
  }

  // Methodology contributions
  if (data.methodology_contributions) {
    setHTML("contributions-list", data.methodology_contributions.map((c, i) => `
      <div class="contribution">
        <div class="num">PATTERN ${String(i + 1).padStart(2, "0")}</div>
        <div class="body">
          <h3>${esc(c.title)}</h3>
          <p>${esc(c.body)}</p>
        </div>
      </div>
    `).join(""));
  }

  // Economics
  if (data.economics) {
    setText("econ-intro", data.economics.intro);
    setHTML("econ-rows", data.economics.rows.map(r => `
      <div class="econ-row">
        <div>
          <div class="label">${esc(r.label)}</div>
          <p class="note">${esc(r.note)}</p>
        </div>
        <div class="share">${esc(r.share)}<span class="pct">%</span></div>
        <div class="meter"><div class="fill" style="width:${esc(r.share)}%"></div></div>
      </div>
    `).join(""));
    setText("econ-punchline", data.economics.punchline);
  }

  // Findings
  setHTML("findings-grid", data.findings.map((f, i) => `
    <div class="finding">
      <div class="num">FINDING ${String(i + 1).padStart(2, "0")}</div>
      <h3>${esc(f.headline)}</h3>
      <p>${esc(f.body)}</p>
    </div>
  `).join(""));

  // About
  document.getElementById("about-tagline").textContent = data.about.tagline;
  document.getElementById("about-bio").textContent = data.about.bio;
  const emailA = document.getElementById("contact-email");
  emailA.href = "mailto:" + data.about.contact.email;
  emailA.textContent = data.about.contact.email;
  document.getElementById("contact-linkedin").href = data.about.contact.linkedin;
  document.getElementById("contact-github").href = data.about.contact.github;
})();
