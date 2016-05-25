<template>
  <div id="json_chart">
    <h1>{{ djson }}</h1>
    <div class="audience_chart">
      <div id="audience_genre">
      <h2>Genre</h2>
      </div>
      <div id="audience_origine">
      <h2>Origine</h2>
      </div>
      <div id="audience_age">
      <h2>Âge</h2>
      </div>
    </div>
  </div>
</template>

<script>
var d3 = require('d3')
export default {
  data () {
    return {
      djson: 'Audience globale'
    }
  }
}

process.nextTick(function () {
  var width = 300
  var height = 300
  var radius = Math.min(width, height) / 2

  var color = d3.scale.ordinal()
  .range(['#98abc5', '#8a89a6', '#7b6888', '#6b486b', '#a05d56', '#d0743c', '#ff8c00'])

  var arc = d3.svg.arc()
  .outerRadius(radius - 10)
  .innerRadius(radius - 70)

  var pie = d3.layout.pie()
    .sort(null)
    .value(function (d) {
      return d.genrenb
    })

  var svg = d3.select('#audience_genre').append('svg')
  .attr('width', width)
  .attr('height', height)
  .append('g')
  .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')

  var data = [
    {'genre': 'F', 'genrenb': 3704659},
    {'genre': 'M', 'genrenb': 4499890}
  ]

  var g = svg.selectAll('.arc')
  .data(pie(data))
  .enter().append('g')
  .attr('class', 'arc')

  g.append('path')
    .attr('d', arc)
    .style('fill', function (d) {
      return color(d.data.genre)
    })

  g.append('text')
    .attr('transform', function (d) {
      return 'translate(' + arc.centroid(d) + ')'
    })
    .attr('dy', '.35em')
    .text(function (d) {
      return d.data.genre
    })

  function type (d) {
    d.genrenb = +d.genrenb
    return d
  }
  type()
}
)

process.nextTick(function () {
  var width = 300
  var height = 300
  var radius = Math.min(width, height) / 2

  var color = d3.scale.ordinal()
  .range(['#98abc5', '#8a89a6', '#7b6888', '#6b486b', '#a05d56', '#d0743c', '#ff8c00'])

  var arc = d3.svg.arc()
  .outerRadius(radius - 10)
  .innerRadius(radius - 70)

  var pie = d3.layout.pie()
    .sort(null)
    .value(function (d) {
      return d.originepays
    })

  var svg = d3.select('#audience_origine').append('svg')
  .attr('width', width)
  .attr('height', height)
  .append('g')
  .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')

  var data = [
    {'pays': 'FR', 'originepays': 9704659},
    {'pays': 'EN', 'originepays': 4499890},
    {'pays': 'NL', 'originepays': 2159981},
    {'pays': 'DE', 'originepays': 3853788},
    {'pays': 'EU', 'originepays': 1410654}
  ]

  var g = svg.selectAll('.arc')
  .data(pie(data))
  .enter().append('g')
  .attr('class', 'arc')

  g.append('path')
    .attr('d', arc)
    .style('fill', function (d) {
      return color(d.data.pays)
    })

  g.append('text')
    .attr('transform', function (d) {
      return 'translate(' + arc.centroid(d) + ')'
    })
    .attr('dy', '.35em')
    .text(function (d) {
      return d.data.pays
    })

  function type (d) {
    d.originepays = +d.originepays
    return d
  }
  type()
}
)

process.nextTick(function () {
  var width = 300
  var height = 300
  var radius = Math.min(width, height) / 2

  var color = d3.scale.ordinal()
  .range(['#98abc5', '#8a89a6', '#7b6888', '#6b486b', '#a05d56', '#d0743c', '#ff8c00'])

  var arc = d3.svg.arc()
  .outerRadius(radius - 10)
  .innerRadius(radius - 70)

  var pie = d3.layout.pie()
    .sort(null)
    .value(function (d) {
      return d.population
    })

  var svg = d3.select('#audience_age').append('svg')
  .attr('width', width)
  .attr('height', height)
  .append('g')
  .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')

  var data = [
    {'age': '<5', 'population': 2704659},
    {'age': '5-13', 'population': 4499890},
    {'age': '14-17', 'population': 2159981},
    {'age': '18-24', 'population': 3853788},
    {'age': '25-44', 'population': 14106543},
    {'age': '45-64', 'population': 8819342},
    {'age': '≥65', 'population': 6124630}
  ]

  var g = svg.selectAll('.arc')
  .data(pie(data))
  .enter().append('g')
  .attr('class', 'arc')

  g.append('path')
    .attr('d', arc)
    .style('fill', function (d) {
      return color(d.data.age)
    })

  g.append('text')
    .attr('transform', function (d) {
      return 'translate(' + arc.centroid(d) + ')'
    })
    .attr('dy', '.35em')
    .text(function (d) {
      return d.data.age
    })

  function type (d) {
    d.population = +d.population
    return d
  }
  type()
}
)
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped>
h1 {
  color: #ccc;
}

.audience_chart {
  display: block;
  width: 100%;
  height: auto;
}

.audience_chart div{
  display: inline-block;
  height: auto;
}
</style>
