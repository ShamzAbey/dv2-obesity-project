const embedOptions = {
    renderer: "svg",
    actions: false,
    tooltip: true,
    defaultStyle: true
};

const graphRegistry = [
    {selector: "#graph1-map", spec: "graphs/graph1_map.json"},
    {selector: "#graph2-bubble", spec: "graphs/graph2_bubble.json"},
    {selector: "#graph3-timeline", spec: "graphs/graph3_timeline.json"},
    {selector: "#graph4-smallmultiples", spec: "graphs/graph4_smallmultiples.json"},
    {selector: "#graph5-radar", spec: "graphs/graph5_radar.json"},
    {selector: "#graph6-parallel", spec: "graphs/graph6_parallel.json"},
    {selector: "#graph7-sankey", spec: "graphs/graph7_sankey.json"},
    {selector: "#graph8-heatmap", spec: "graphs/graph8_heatmap.json"},
    {selector: "#graph9-correlation", spec: "graphs/graph9_correlation.json"},
    {selector: "#graph10-dashboard", spec: "graphs/graph10_dashboard.json"}
];

const csvRows = (text) => {
    const [headerLine, ...lines] = text.trim().split(/\r?\n/);
    const headers = headerLine.split(",");

    return lines.map((line) => {
        const values = line.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g) || [];
        return headers.reduce((row, header, index) => {
            row[header] = (values[index] || "").replace(/^"|"$/g, "");
            return row;
        }, {});
    });
};

const updateScrollProgress = () => {
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;
    document.documentElement.style.setProperty("--scroll-progress", `${Math.min(progress, 100)}%`);
};

const renderKpis = async () => {
    const container = document.querySelector("#kpis");
    if (!container) return;

    const response = await fetch("data/datasets/kpi_summary.csv");
    const rows = csvRows(await response.text());

    container.innerHTML = rows.map((row) => `
        <article class="kpi-tile">
            <p class="kpi-label">${row.metric}</p>
            <p class="kpi-value">
                <span>${Number(row.value).toFixed(row.value.includes(".") ? 1 : 0)}</span>
                <span class="kpi-unit">${row.unit}</span>
            </p>
            <p class="kpi-detail">${row.detail}</p>
            <p class="kpi-context">${row.context}</p>
        </article>
    `).join("");
};

const renderGraphs = () => {
    graphRegistry.forEach(({selector, spec}) => {
        const target = document.querySelector(selector);
        if (!target) return;

        vegaEmbed(selector, spec, embedOptions)
            .then(() => target.classList.add("viz-loaded"))
            .catch((error) => {
                console.error(`Failed to load ${spec}`, error);
                target.innerHTML = `<p class="caption">This visualisation could not load. Check ${spec} and the linked data paths.</p>`;
            });
    });
};

const revealOnScroll = () => {
    const targets = document.querySelectorAll(".story-card, .section-heading, .graph-card");
    targets.forEach((target) => target.classList.add("reveal"));

    if (!("IntersectionObserver" in window)) {
        targets.forEach((target) => target.classList.add("is-visible"));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    }, {threshold: 0.12, rootMargin: "0px 0px -60px 0px"});

    targets.forEach((target) => observer.observe(target));
};

window.addEventListener("scroll", updateScrollProgress, {passive: true});
window.addEventListener("resize", updateScrollProgress);

document.addEventListener("DOMContentLoaded", () => {
    updateScrollProgress();
    revealOnScroll();
    renderKpis();
    renderGraphs();
});
