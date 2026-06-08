const embedOptions = {
    renderer: "svg",
    actions: false,
    tooltip: true,
    defaultStyle: true
};

const assetVersion = "hd-story-20260608";

const graphRegistry = [
    {selector: "#graph1-choropleth", spec: "graphs/graph1_choropleth_obesity_map.json"},
    {selector: "#graph2-symbol-map", spec: "graphs/graph2_proportional_symbol_fastfood_map.json"},
    {selector: "#graph3-time-map", spec: "graphs/graph3_time_slider_obesity_map.json"},
    {selector: "#graph4-bubble", spec: "graphs/graph4_bubble_fastfood_vs_obesity.json"},
    {selector: "#graph5-timeline", spec: "graphs/graph5_overview_detail_timeline.json"},
    {selector: "#graph6-smallmultiples", spec: "graphs/graph6_small_multiples_demographics.json"},
    {selector: "#graph7-parallel", spec: "graphs/graph7_parallel_coordinates_behaviour.json"},
    {selector: "#graph8-sankey", spec: "graphs/graph8_sankey_lifestyle_pathway.json"},
    {selector: "#graph9-heatmap", spec: "graphs/graph9_heatmap_age_behaviour.json"},
    {selector: "#graph10-correlation", spec: "graphs/graph10_correlation_matrix.json"},
    {selector: "#graph11-radar", spec: "graphs/graph11_radar_state_profile.json"},
    {selector: "#graph12-dashboard", spec: "graphs/graph12_coordinated_dashboard.json"}
];

const normalizeSpecUrls = (value) => {
    if (Array.isArray(value)) {
        return value.map(normalizeSpecUrls);
    }

    if (value && typeof value === "object") {
        return Object.fromEntries(
            Object.entries(value).map(([key, entry]) => {
                if (key === "url" && typeof entry === "string" && entry.startsWith("../data/")) {
                    return [key, entry.replace("../", "")];
                }

                return [key, normalizeSpecUrls(entry)];
            })
        );
    }

    return value;
};

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

    const response = await fetch(`data/datasets/kpi_summary.csv?v=${assetVersion}`);
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
    graphRegistry.forEach(async ({selector, spec}) => {
        const target = document.querySelector(selector);
        if (!target) return;

        try {
            const response = await fetch(`${spec}?v=${assetVersion}`);
            if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);

            const specJson = normalizeSpecUrls(await response.json());
            await vegaEmbed(selector, specJson, embedOptions);
            target.classList.add("viz-loaded");
        } catch (error) {
            console.error(`Failed to load ${spec}`, error);
            target.innerHTML = `<p class="caption">This visualisation could not load. ${error.message}</p>`;
        }
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
