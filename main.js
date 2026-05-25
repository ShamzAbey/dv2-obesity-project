const embedOpts = {
	renderer: 'svg',
	actions: true,
	defaultStyle: true,
	tooltip: true
};

vegaEmbed("#obesity-map", "vega/obesity_choropleth.vg.json", embedOpts).catch(console.error);
vegaEmbed("#interactive-health-map", "vega/interactive_health_map.vg.json", embedOpts).catch(console.error);
vegaEmbed("#kpi-highest-obesity", "vega/kpi_highest_obesity.vg.json", embedOpts).catch(console.error);
vegaEmbed("#kpi-lowest-obesity", "vega/kpi_lowest_obesity.vg.json", embedOpts).catch(console.error);
vegaEmbed("#kpi-highest-overweight", "vega/kpi_highest_overweight.vg.json", embedOpts).catch(console.error);
vegaEmbed("#kpi-soft-drinks", "vega/kpi_soft_drinks.vg.json", embedOpts).catch(console.error);
vegaEmbed("#food-overview-detail", "vega/food_overview_detail.vg.json", embedOpts).catch(console.error);
vegaEmbed("#obesity-age", "vega/obesity_age_annotated.vg.json", embedOpts).catch(console.error);
vegaEmbed("#activity-obesity", "vega/activity_obesity_scatter.vg.json", embedOpts).catch(console.error);
vegaEmbed("#gender-facets", "vega/gender_age_facets.vg.json", embedOpts).catch(console.error);
vegaEmbed("#food-stacked", "vega/food_category_stacked_area.vg.json", embedOpts).catch(console.error);
