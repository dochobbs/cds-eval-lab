// CDS Eval Lab — render site from data.json
// All values escaped before insertion.

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

  // Suites
  setHTML("suite-list", data.suites.map(s => `
    <div class="suite-row">
      <div class="code">${esc(s.code)}</div>
      <div>
        <div class="name">${esc(s.name)}</div>
        <div class="purpose">${esc(s.purpose)}</div>
        <div class="scored">Scored by ${esc(s.scored_by)}</div>
      </div>
      <div class="n">${esc(s.n)}<span class="lbl">queries</span></div>
    </div>
  `).join(""));

  // Example queries as numbered editorial blocks
  setHTML("query-list", data.example_queries.map(q => `
    <div class="query-block">
      <div class="body">
        <div class="meta"><b>${esc(q.domain)}</b> &nbsp; ${esc(q.tag)} &nbsp; · &nbsp; ${esc(q.difficulty)}</div>
        <p>${esc(q.description)}</p>
      </div>
      <div class="aside">
        <span class="label">What it catches</span>
        ${esc(q.what_it_catches)}
      </div>
    </div>
  `).join(""));

  // Leaderboard
  const sortedLb = [...data.leaderboard].sort((a, b) =>
    (b.accuracy + b.completeness + b.specificity) -
    (a.accuracy + a.completeness + a.specificity)
  );
  const ceTone = ce => ce === 0 ? "good" : ce >= 10 ? "bad" : "";
  const fmtCost = c => c === 0 ? "—" : "$" + c.toFixed(c < 0.1 ? 3 : 2);
  setHTML("lb-body", sortedLb.map(r => `
    <tr>
      <td>
        <div class="system">${esc(r.system)}</div>
        <span class="cat">${esc(r.category)}</span>
      </td>
      <td>${esc(r.accuracy)}</td>
      <td>${esc(r.completeness)}</td>
      <td>${esc(r.specificity)}</td>
      <td>${esc(r.citations)}</td>
      <td><span class="${ceTone(r.critical_errors)}">${esc(r.critical_errors)}</span></td>
      <td>${esc(r.latency_s)}s</td>
      <td>${esc(fmtCost(r.cost_per_q_usd))}</td>
    </tr>
  `).join(""));

  // Per-suite breakdown
  const headers = data.suite_scores.headers;
  const fmts = data.suite_scores.header_format;
  const rows = data.suite_scores.rows;
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
            ${r.scores.map(v => `<td>${esc(v)}</td>`).join("")}
          </tr>
        `).join("")}
      </tbody>
    </table>
  `);

  setHTML("findings-grid", data.findings.map(f => `
    <div class="finding">
      <div>
        <h3>${esc(f.headline)}</h3>
        <p>${esc(f.body)}</p>
      </div>
    </div>
  `).join(""));

  setHTML("method-list", data.methodology.map(m => `
    <details class="method">
      <summary>${esc(m.title)}</summary>
      <div class="body">${esc(m.body)}</div>
    </details>
  `).join(""));

  document.getElementById("about-tagline").textContent = data.about.tagline;
  document.getElementById("about-bio").textContent = data.about.bio;
  const emailA = document.getElementById("contact-email");
  emailA.href = "mailto:" + data.about.contact.email;
  emailA.textContent = data.about.contact.email;
  document.getElementById("contact-linkedin").href = data.about.contact.linkedin;
  document.getElementById("contact-github").href = data.about.contact.github;
})();
