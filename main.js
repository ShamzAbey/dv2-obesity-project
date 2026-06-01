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
	["#obesity-map", "vega/obesity_choropleth.vg.json", embedOpts],
	["#kpi-tiles", "vega/kpi_tiles.vg.json", kpiEmbedOpts],
	["#state-obesity-ranking", "vega/state_obesity_ranked_bar.vg.json", embedOpts],
	["#state-symbol-map", "vega/state_symbol_map.vg.json", embedOpts],
	["#activity-dot-map", "vega/activity_dot_map.vg.json", embedOpts],
	["#food-overview-detail", "vega/food_overview_detail.vg.json", embedOpts],
	["#latest-food-category", "vega/latest_food_category_donut.vg.json", embedOpts],
	["#latest-food-ranking", "vega/latest_food_category_ranked_bar.vg.json", embedOpts],
	["#food-treemap", "vega/food_treemap.vg.json", embedOpts],
	["#obesity-age", "vega/obesity_age_annotated.vg.json", embedOpts],
	["#activity-obesity", "vega/activity_obesity_scatter.vg.json", embedOpts],
	["#activity-ranking", "vega/activity_ranked_bar.vg.json", embedOpts],
	["#state-sankey", "vega/state_sankey_alluvial.vg.json", embedOpts],
	["#gender-dumbbell", "vega/gender_age_dumbbell.vg.json", embedOpts],
	["#gender-age-facets", "vega/gender_age_facets.vg.json", embedOpts],
	["#gender-obesity-boxplot", "vega/gender_obesity_boxplot.vg.json", embedOpts],
	["#gender-age-line", "vega/gender_age_line_chart.vg.json", embedOpts],
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
