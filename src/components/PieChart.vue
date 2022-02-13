<template>
  <v-container>
    <div class="pie-chart" ref="chartdiv"></div>
  </v-container>
</template>
<script>
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import am5themes_Dark from "@amcharts/amcharts5/themes/Dark";
export default {
  name: "PieChart",
  props: ["chartArray"],
  mounted() {
    //Piechart only, nothing else in the mounted
    let root = am5.Root.new(this.$refs.chartdiv);
    root.setThemes([am5themes_Animated.new(root), am5themes_Dark.new(root)]);
    let chart = root.container.children.push(
      am5percent.PieChart.new(root, {
        layout: root.verticalLayout,
      })
    );
    let series = chart.series.push(
      am5percent.PieSeries.new(root, {
        valueField: "share",
        categoryField: "name",
      })
    );
    // Set data
    // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Setting_data
    series.data.setAll(this.chartArray);
    series.appear(1000, 100);
    series.labels.template.setAll({
      fontSize: 18,
      // fill: am5.color(0xffffff),
    });

    //Piechart ticks
    series.ticks.template.setAll({
      strokeWidth: 3,
    });
  },
};
</script>
<style scoped>
.pie-chart {
  width: 100%;
  height: 500px;
  color: white !;
}
</style>
