const embedOpts = {
	renderer: 'svg',
	actions: true,
	defaultStyle: true,
	tooltip: true
};

const kpiEmbedOpts = {
	renderer: 'svg',
	actions: false,
	defaultStyle: true,
	tooltip: true
};

document.documentElement.classList.add('js-enabled');

const updateScrollProgress = () => {
	const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
	const progress = scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;
	document.documentElement.style.setProperty('--scroll-progress', `${Math.min(progress, 100)}%`);
};

window.addEventListener('scroll', updateScrollProgress, {passive: true});
window.addEventListener('resize', updateScrollProgress);
updateScrollProgress();

const charts = [
	["#obesity-map", "vega/interactive_health_map.vg.json", embedOpts],
	["#kpi-tiles", "vega/kpi_tiles.vg.json", kpiEmbedOpts],
	["#state-obesity-ranking", "vega/state_obesity_ranked_bar.vg.json", embedOpts],
	["#state-symbol-map", "vega/state_symbol_map.vg.json", embedOpts],
	["#activity-dot-map", "vega/activity_dot_map.vg.json", embedOpts],
	["#state-cartogram", "vega/state_tile_cartogram.vg.json", embedOpts],
	["#state-obesity-boxplot", "vega/state_obesity_boxplot.vg.json", embedOpts],
	["#food-overview-detail", "vega/food_overview_detail.vg.json", embedOpts],
	["#food-treemap", "vega/food_treemap.vg.json", embedOpts],
	["#activity-obesity", "vega/activity_obesity_scatter.vg.json", embedOpts],
	["#activity-ranking", "vega/activity_ranked_bar.vg.json", embedOpts],
	["#activity-obesity-bin-map", "vega/activity_obesity_bin_map.vg.json", embedOpts],
	["#state-sankey", "vega/state_sankey_alluvial.vg.json", embedOpts],
	["#gender-dumbbell", "vega/gender_age_dumbbell.vg.json", embedOpts],
	["#gender-age-facets", "vega/gender_age_facets.vg.json", embedOpts],
	["#gender-age-dendrogram", "vega/demographic_dendrogram.vg.json", embedOpts],
	["#obesity-histogram", "vega/obesity_distribution_histogram.vg.json", embedOpts],
	["#food-stacked", "vega/food_category_stacked_area.vg.json", embedOpts]
];

charts.forEach(([selector, spec, options]) => {
	vegaEmbed(selector, spec, options)
		.then(() => {
			const container = document.querySelector(selector);
			if (container) {
				container.classList.add('chart-loaded');
			}
		})
		.catch(console.error);
});

const revealTargets = document.querySelectorAll('.story-section, .chart-card, .kpi-card');

if ('IntersectionObserver' in window) {
	const revealObserver = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				entry.target.classList.add('is-visible');
				revealObserver.unobserve(entry.target);
			}
		});
	}, {threshold: 0.12, rootMargin: '0px 0px -40px 0px'});

	revealTargets.forEach((target) => revealObserver.observe(target));
} else {
	revealTargets.forEach((target) => target.classList.add('is-visible'));
}
