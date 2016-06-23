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
    <div class="sejours_chart">
      <div class="header_sejours">
        <div class="title_chart">
          <h2>Séjours</h2>          
        </div>
        <div class="sejours_short">
          <!-- <button id="sort" onclick="sortBars()">Trier</button>
          <button id="reset" onclick="reset()">Default</button> -->
          <ul>
            <li id="">Cette semaine</li>
            <li id="">Ce mois</li>
            <li id="sort" onclick="sortBars()">Cette année</li>
            <li id="reset" style="border-radius: 0px 4px 4px 0px;" onclick="reset()">Global</li>
          </ul>
        </div>
      </div>
      <div id="sejours">
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
  },

  created () {
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

    process.nextTick(function () {
      var data = [
        { key: '2016-01-04', value: 1289 },
        { key: '2016-01-18', value: 574 },
        { key: '2016-02-13', value: 925 },
        { key: '2016-02-25', value: 1241 },
        { key: '2016-03-01', value: 1195 },
        { key: '2016-03-12', value: 549 },
        { key: '2016-04-06', value: 756 },
        { key: '2016-04-25', value: 1389 },
        { key: '2016-05-15', value: 1277 },
        { key: '2016-06-02', value: 1249 }
      ]

      // Date parsing.
      var formatDate = d3.time.format('%Y-%m-%d')
      var key = data.forEach(function (d) {
        d.key = formatDate.parse(d.key)
        return d.key
      })

      // width and height
      var width = 980
      var height = 200

      // scales, data
      var xScale = d3.scale.ordinal()
        .domain(d3.range(data.length))
        .rangeRoundBands([0, width], 0.1)

      var yScale = d3.scale.linear()
        .domain([0, d3.max(data, function (d) { return d.value })])
        .range([0, height])

      // Create SVG element
      var svg = d3.select('#sejours')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')

      // Create bars
      svg.selectAll('rect')
        .data(data, key)
        .enter()
        .append('rect')
        .attr('x', function (d, i) {
          return xScale(i)
        })
        .attr('y', function (d) {
          return height - yScale(d.value)
        })
        .attr('width', xScale.rangeBand())
        .attr('height', function (d) {
          return yScale(d.value)
        })
        .attr('fill', function (d) {
          return 'rgb(135, 200, ' + (d.value - 1100) + ')'
        })

      // Create labels
      svg.selectAll('text')
        .data(data, key)
        .enter()
        .append('text')
        .text(function (d) {
          return d.value
        })
        .attr('text-anchor', 'middle')
        .attr('x', function (d, i) {
          return xScale(i) + xScale.rangeBand() / 2
        })
        .attr('y', function (d) {
          return height - yScale(d.value) + 14
        })
        .attr('font-family', 'sans-serif')
        .attr('font-size', '11px')
        .attr('fill', 'white')

      // Short Function
      var sortOrder = false
      var sortBars = function () {
        sortOrder = !sortOrder

        var sortItems = function (a, b) {
          if (sortOrder) {
            return a.value - b.value
          }
          return b.value - a.value
        }

        svg.selectAll('rect')
          .sort(sortItems)
          .transition()
          .delay(function (d, i) {
            return i * 50
          })
          .duration(1000)
          .attr('x', function (d, i) {
            return xScale(i)
          })

        svg.selectAll('text')
          .sort(sortItems)
          .transition()
          .delay(function (d, i) {
            return i * 50
          })
            .duration(1000)
            .text(function (d) {
              return d.value
            })
            .attr('text-anchor', 'middle')
            .attr('x', function (d, i) {
              return xScale(i) + xScale.rangeBand() / 2
            })
            .attr('y', function (d) {
              return height - yScale(d.value) + 14
            })
      }

      // Add the onclick callback to the button
      d3.select('#sort').on('click', sortBars)
      d3.select('#reset').on('click', reset)

      function reset () {
        svg.selectAll('rect')
          .sort(function (a, b) {
            return a.key - b.key
          })
          .transition()
            .delay(function (d, i) {
              return i * 50
            })
            .duration(1000)
            .attr('x', function (d, i) {
              return xScale(i)
            })

        svg.selectAll('text')
        .sort(function (a, b) {
          return a.key - b.key
        })
        .transition()
        .delay(function (d, i) {
          return i * 50
        })
        .duration(1000)
        .text(function (d) {
          return d.value
        })
        .attr('text-anchor', 'middle')
        .attr('x', function (d, i) {
          return xScale(i) + xScale.rangeBand() / 2
        })
        .attr('y', function (d) {
          return height - yScale(d.value) + 14
        })
      }
    }
    )
  }
}
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

.audience_chart h2{
  text-align: center;
}

.sejours_chart, .freq_chart {
  display: block;
  width: 100%;
  height: auto;
}

.sejours_chart .header_sejours, .freq_chart .header_freq {
  display: block;
  width: 100%;
  height: auto;
  margin-top: 20px;
  margin-bottom: 20px;
}

.title_chart{
  display: inline-block;
  height: auto;
  width: 53%;
  color: #87C83D;
}

.freq_chart .header_freq .freq_short{
  display: inline-block;
  height: auto;
  width: 46%;
  margin-left: -85px;
}

.sejours_chart .header_sejours .sejours_short {
  display: inline-block;
  height: auto;
  width: 36%;
}

.title_chart h2{
  text-align: left;
  text-transform: uppercase;
}

.sejours_chart .header_sejours div button{
  float: right;
  margin-right: 5px;
}

.sejours_chart .axis path,
.sejours_chart .axis line {
  fill: none;
  stroke: black;
  shape-rendering: crispEdges;
}

.sejours_chart .axis text {
  font-family: sans-serif;
  font-size: 11px;
}

.sejours_chart svg > rect {
  -moz-transition: all 0.3s;
  -webkit-transition: all 0.3s;
  -o-transition: all 0.3s;
  transition: all 0.3s;
}

.sejours_chart svg > rect:hover{
  fill: orange; /* #202E3D */
}

.sejours_short ul{
  width: auto;
  height: auto;
  display: block;
  border-radius: 4px;
  box-shadow: 0px 0px 4px #D8D8D8;
  background-color: #fff;
  padding: 0px;
}

.sejours_short ul li{
  display: inline-block;
  text-align: center;
  background-color: #fff;
  width: auto;
  padding: 12px 10px 12px 10px;
  color: #87C83D;
  font-weight: bold;
  font-size: 14px;
  cursor: pointer;
  -moz-transition: background-color .2s ease-in;
  -o-transition: background-color .2s ease-in;
  -webkit-transition: background-color .2s ease-in;
  transition: background-color .2s ease-in;
}

.sejours_short ul li:hover{
  background-color: rgb(135, 200, 61);
  color: #fff;
}
</style>
