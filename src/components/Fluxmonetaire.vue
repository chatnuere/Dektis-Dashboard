<template>
  <div id="json_chart">
    <h1>{{ djson }}</h1>
    <div class="freq_chart">
      <div class="header_freq">
        <div class="title_chart">
          <h2>Flux monétaires</h2>        
        </div>
        <div class="freq_short">
          <ul>
            <li id="sortTime" style="border-radius: 4px 0px 0px 4px;">Cette heure</li>
            <li id="sortDay">Aujourd'hui</li>
            <li id="sortWeek">Cette semaine</li>
            <li id="sortMonth">Ce mois</li>
            <li id="sortYear" style="border-radius: 0px 4px 4px 0px;">Global</li>
          </ul>
        </div>
      </div>
      <div id="flux">
      </div>
      <div id="legend-line" style="margin-top: 20px;">
      </div>
    </div>
  </div>
</template>

<script>
var d3 = require('d3')
export default {
  data () {
    return {
      djson: 'Flux monétaire du camping'
    }
  }
}

process.nextTick(function () {
  var dataset
  var url = 'http://api.dektis.trade/dashboard/flows?start=2016-05-01&end=2016-07-31'

  d3.json(url, function (error, json) {
    if (error) return console.warn(error)
    else dataset = json

    // définit le format de la date
    var dateFormat = d3.time.format('%Y-%m-%d')

    // regroupe les datas
    var nestedData = d3.nest()
      .key(function (d) { return d.activity })
      .rollup(function (v) { return d3.sum(v, function (d) { return d.amount }) })
      .key(function (d) { return dateFormat(new Date(d.time)) }).sortKeys(d3.ascending)
      .entries(dataset)
    console.log(nestedData)

    var margin = {top: 20, right: 4, bottom: 20, left: 40}
    var width = 980 - margin.left - margin.right
    var height = 300 - margin.top - margin.bottom
    var min = d3.min(nestedData, function (datum) {
      return d3.min(datum.values, function (d) { return d.values })
    })
    var max = d3.max(nestedData, function (datum) {
      return d3.max(datum.values, function (d) { return d.values })
    })
    console.log(min)
    console.log(max)

    // initialize new date
    var today = new Date()
    var currentMonth = today.getMonth() + 1
    var startDate = dateFormat(new Date(today.getFullYear(), currentMonth - 1, 1))
    var endDate = dateFormat(new Date(today.getFullYear(), currentMonth, 0))

    var x = d3.time.scale()
      // .domain(d3.extent(dataset, function (d) { return d3.time.month.offset(new Date(d.time), 0) }))
      .domain([new Date(startDate), new Date(endDate)])
      .range([0, width])

    var y = d3.scale.linear()
      .domain([min, max])
      .range([height, 0])

    var xAxis = d3.svg.axis()
      .scale(x)
      .orient('bottom')
      .ticks(d3.time.day, 7)
      .tickFormat(d3.time.format('%d-%b'))
      .tickSize(height + 6, height + 6, 0)

    var yAxis = d3.svg.axis()
      .scale(y)
      .orient('left')
      .ticks(max)
      .tickValues(d3.range(0, max, 50))
      .tickSubdivide(true)
      .tickFormat(d3.format('d'))
      .tickSize(6 - width, width + 6, 0.5)

    // define hover tooltip
    var div = d3.select('#flux').append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0)

    // define the interactive line legend

    // define line color
    var color = d3.scale.category10()
    // define the svg space
    var svg = d3.select('#flux').append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

    // draw the line
    var line = d3.svg.line()
      .interpolate('linear') // linear, cardinal or monotone
      .x(function (d) { return x(dateFormat.parse(d.key)) })
      .y(function (d) { return y(d.values) })

    // create and draw xAxis
    svg.append('g')
      .attr('class', 'x grid')
      .attr('style', 'stroke: #858585')
      .call(xAxis)

    // create and draw yAxis
    svg.append('g')
      .attr('class', 'y grid')
      .attr('style', 'stroke: #858585')
      .call(yAxis)
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '.71em')
      .attr('style', 'font-size: 10 font-family: Helvetica, sans-serif')
      .style('text-anchor', 'end')
      .text('')

    var activityLine = svg.selectAll('.activity')
      .data(nestedData)
      .enter()
      .append('g')
      .attr('class', 'activity')
      .attr('id', function (d) {
        return d.key + '-line'
      })
      .style('stroke-width', 2.5)
      .on('mouseover', function (d) {
        var lineUnderMouse = this
        d3.selectAll('.activity').transition().style('opacity', function () {
          return (this === lineUnderMouse) ? 1.0 : 0
        })
      })
      .on('mouseout', function (d) {
        d3.selectAll('.activity').transition().style('opacity', function () {
          return 1
        })
      })

    activityLine.append('path')
      .attr('class', 'line')
      .attr('id', 'theline')
      .attr('d', function (d) { return line(d.values) })
      .style('stroke', function (d) { return color(d.key) })
      .attr('fill', 'none')
      .attr('stroke-width', 1)
      .transition().duration(500)
      .attr('stroke-opacity', 1)
      .attr('stroke-width', 3)

    // append the legend
    var legend = d3.select('#legend-line').selectAll('.legend')
      .data(nestedData)

    var legendEnter = legend
      .enter()
      .append('g')
      .attr('class', 'legend')
      .attr('id', function (d) { return d.values })
      .style('display', 'inline-block')
      .style('background-color', '#fff')
      .style('padding', 5 + 'px')
      .style('margin-right', 0 + 'px')
      .style('box-shadow', '0px 0px 4px #D8D8D8')
      .style('cursor', 'pointer')
      .style('opacity', 1)
      .style('border-top', function (d) {
        return '4px solid ' + color(d.key)
      })
      .on('click', function (d) {
        var thislegend = d3.select(this).attr('id')
        console.log(thislegend)
        if (d3.select(this).style('opacity') !== 0) {
          thislegend = thislegend + '-line'
          console.log(thislegend)
          d3.select('#' + thislegend + '')
            .transition()
            .duration(800)
            .style('opacity', 0)
            .style('display', 'none')
          d3.select(this)
            .attr('fakeclass', 'fakelegend')
          .transition()
            .duration(800)
            .style('opacity', 0.2)
        } else {
          thislegend = thislegend + '-line'
          console.log('dans le else')
          d3.select('#' + thislegend + '')
            .style('display', 'block')
            .transition()
            .duration(1000)
            .style('opacity', 1)
          d3.select(this)
            .attr('fakeclass', 'legend')
            .transition()
            .duration(1000)
            .style('opacity', 1)
        }
      })

    // add the legend text
    legendEnter.append('text')
      .attr('x', width / 1.5)
      .attr('y', 0)
      .text(function (d) {
        return d.key
      })

    // append circle
    activityLine.selectAll('circle')
      .data(function (d) {
        return (d.values)
      })
      .enter().append('circle')
      .style('stroke', function (d, i) {
        if (d.values[i]) {
          return color(d.values[i].activity)
        }
      })
      .attr('cx', function (d) {
        return x(dateFormat.parse(d.key))
      })
      .attr('cy', function (d) {
        return y(d.values)
      })
      .on('mouseover', function (d, i) {
        div.transition()
          .duration(200)
          .style('opacity', 0.9)
        div.html('Total :' + d.values + ' € <br/>') // + 'Lieu :' + d.values[i].activity
          .style('left', (d3.event.pageX) + 'px')
          .style('top', (d3.event.pageY) + 'px')
          // .style('color', color(d.values[i].activity))
          .style('font-weight', 'bold')
      })
      .on('mouseout', function (d) {
        div.transition()
          .duration(500)
          .style('opacity', 0)
      })
      .attr('stroke-width', 5)
      .attr('fill', 'white')
      .attr('r', 8)
      .attr('stroke-opacity', 0.001)
      .attr('fill-opacity', 0.001)
      .transition().delay(1000).duration(1000)
      .attr('stroke-opacity', 1)
      .attr('fill-opacity', 1)
      .attr('stroke-width', 2.8)
      .attr('r', 3.4)
      .style('cursor', 'pointer')
  })
}
)
</script>

<style scoped>
h1 {
  color: #ccc;
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

.sejours_chart .header_sejours div button, .freq_chart .header_freq div button{
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

.freq_short ul, .sejours_short ul{
  width: auto;
  height: auto;
  display: block;
  border-radius: 4px;
  box-shadow: 0px 0px 4px #D8D8D8;
  background-color: #fff;
  padding: 0px;
}

.freq_short ul li, .sejours_short ul li{
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

.freq_short ul li:hover, .sejours_short ul li:hover{
  background-color: rgb(135, 200, 61);
  color: #fff;
}

.grid .tick line {
    stroke: #4c4c4c;
    opacity: 0.8;
}

.focus circle {
  fill: none;
  stroke: steelblue;
}

.tooltip{
  display: block;
  margin: 0 auto;
  background: #fff;
  text-align: center;
}
</style>