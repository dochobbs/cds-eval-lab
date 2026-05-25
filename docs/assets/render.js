// CDS Eval Lab — render site from data.json
// All values are escaped before insertion. data.json is author-controlled,
// but escaping keeps the surface trivially safe if anyone forks this.

(async function () {
  const esc = s => String(s).replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[c]);

  const res = await fetch("assets/data.json");
  const data = await res.json();

  const setHTML = (id, html) => { document.getElementById(id).innerHTML = html; };

  setHTML("statgrid", data.lab.summary_stats.map(s => `
    <div class="stat">
      <div class="v">${esc(s.value)}</div>
      <div class="l">${esc(s.label)}</div>
    </div>
  `).join(""));

  setHTML("suite-list", data.suites.map(s => `
    <div class="suite-row">
      <div class="code">${esc(s.code)}</div>
      <div>
        <div class="name">${esc(s.name)}</div>
        <div class="purpose">${esc(s.purpose)}</div>
        <div class="scored">SCORED BY · ${esc(s.scored_by)}</div>
      </div>
      <div class="n">${esc(s.n)}<span class="lbl">queries</span></div>
    </div>
  `).join(""));

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
  const ceClass = ce => ce === 0 ? "good" : ce <= 5 ? "" : ce <= 10 ? "warn" : "bad";
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
      <td class="num ${ceClass(r.critical_errors)}">${esc(r.critical_errors)}</td>
      <td class="num">${esc(r.latency_s)}s</td>
      <td class="num">${esc(fmtCost(r.cost_per_q_usd))}</td>
    </tr>
  `).join(""));

  // Per-suite breakdown
  const headers = data.suite_scores.headers;
  const fmts = data.suite_scores.header_format;
  const rows = data.suite_scores.rows;
  const maxByCol = headers.map((_, i) => Math.max(...rows.map(r => r.scores[i])));
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
              const pct = (v / maxByCol[i]) * 100;
              const w = Math.max(8, pct * 0.6).toFixed(0);
              return `<td><span class="bar" style="width:${w}px"></span>${esc(v)}</td>`;
            }).join("")}
          </tr>
        `).join("")}
      </tbody>
    </table>
  `);

  setHTML("findings-grid", data.findings.map((f, i) => `
    <div class="finding">
      <div class="num">FINDING ${String(i + 1).padStart(2, "0")}</div>
      <h3>${esc(f.headline)}</h3>
      <p>${esc(f.body)}</p>
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
