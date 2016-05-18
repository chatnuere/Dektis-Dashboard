<template>
  <div id="chart">
    <h1>{{ d3 }}</h1>
  </div>
</template>

<script>
var d3 = require('d3')
export default {
  data () {
    return {
      d3: 'Test affichage brut D3js'
    }
  }
}
// Define the data.
var datas = [
  [125, 50, 25, 100],
  [10, 20, 30, 40],
  [25, 40, 18, 75]
]
var m = 20
var r = 80
var z = d3.scale.category20()
// Insert an svg element (with margin) for each row in our dataset
process.nextTick(function () {
  var svg = d3.select('#chart').append('div').selectAll('svg')
    .data(datas)
    .enter().append('svg')
    .attr('width', (r + m) * 2)
    .attr('height', (r + m) * 2)
    .append('g')
    .attr('transform', 'translate(' + (r + m) + ',' + (r + m) + ')')
// The data for each svg element is a row of numbers (an array). We pass that to
// d3.layout.pie to compute the angles for each arc. These start and end angles
// are passed to d3.svg.arc to draw arcs! Note that the arc radius is specified
// on the arc, not the layout.
  svg.selectAll('path')
    .data(d3.layout.pie())
    .enter().append('path')
    .attr('d', d3.svg.arc()
    .innerRadius(r / 2)
    .outerRadius(r))
    .style('fill', function (d, i) { return z(i) })
}
)

</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped>
h1 {
  color: #ccc;
}
</style>
