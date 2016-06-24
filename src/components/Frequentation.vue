<template>
  <div id="json_chart">
    <h1>{{ djson }}</h1>
    <div class="freq_chart">
      <div class="header_freq">
        <div class="title_chart">
          <h2>Fréquentation</h2>        
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
      <div class="freq_value">
        <p id="freq_value">Fréquentation : </p>
      </div>
      <div id="freq">
      </div>
      <div id="legend-line" style="margin-top: 30px; float: right; margin-right: 100px;">
      </div>
    </div>
  </div>
</template>

<script>
var d3 = require('d3')
export default {
  data () {
    return {
      djson: ''
    }
  },

  created () {
    process.nextTick(function () {
      var dataset
      var teststart = '2016-06-01'
      var testend = '2016-07-21'
      var url = 'http://api.dektis.trade/dashboard/flows?start=' + teststart + '&end=' + testend + ''
      d3.json(url, function (error, json) {
        if (error) return console.warn(error)
        else dataset = json

        // définit le format de la date
        var dateFormat = d3.time.format('%Y-%m-%d')
        // regroupe les datas
        var nestedData = d3.nest()
          .key(function (d) { return d.activity })
          .key(function (d) { return dateFormat(new Date(d.time)) }).sortKeys(d3.ascending)
          .entries(dataset)

        var margin = {top: 20, right: 2, bottom: 40, left: 40}
        var width = 980 - margin.left - margin.right
        var height = 360 - margin.top - margin.bottom
        var min = d3.min(nestedData, function (datum) {
          return d3.min(datum.values, function (d) { return d.values.length })
        })
        var max = d3.max(nestedData, function (datum) {
          return d3.max(datum.values, function (d) { return d.values.length })
        })

        // initialize new date
        var today = new Date()
        var currentMonth = today.getMonth() + 1
        var startDate = dateFormat(new Date(today.getFullYear(), currentMonth - 1, 1))
        var endDate = dateFormat(new Date(today.getFullYear(), currentMonth, 0))

        var x = d3.time.scale()
          .domain([new Date(startDate), new Date(endDate)])
          .range([0, width])

        var y = d3.scale.linear()
          .domain([min, max])
          .range([height, 0])

        var xAxis = d3.svg.axis()
          .scale(x)
          .orient('bottom')
          .ticks(d3.time.day, 2)
          .tickFormat(d3.time.format('%d-%b'))
          .tickSize(height + 16, height + 16, 0)

        var yAxis = d3.svg.axis()
          .scale(y)
          .orient('left')
          .ticks(max)
          .tickValues(d3.range(0, max, 10))
          .tickSubdivide(true)
          .tickFormat(d3.format('d'))
          .tickSize(0 - width, width + 10, 0.5)

        // define hover tooltip
        var span = d3.select('#freq_value').append('span')
          .attr('class', 'tooltip')
          .style('opacity', 0)

        // define the interactive line legend

        // define line color
        var color = d3.scale.category10()

        // define the svg space
        var svg = d3.select('#freq').append('svg')
          .attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom)
          .append('g')
          .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

        // draw the line
        var line = d3.svg.line()
          .interpolate('linear') // we can choice: linear, cardinal or monotone
          .x(function (d) { return x(dateFormat.parse(d.key)) }) // the date
          .y(function (d) { return y(d.values.length) }) // the values (amount) by date

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

        var activityLine = svg.selectAll('.activity')
          .data(nestedData)
          .enter()
          .append('g')
          .attr('class', 'activity')
          .attr('id', function (d) {
            return d.key + '-line'
          })
          .style('stroke-width', 2.5)
          .style('opacity', 1)
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
          .attr('id', function (d) { return d.key })
          .style('display', 'inline-block')
          .style('background-color', '#fff')
          .style('padding', 8 + 'px')
          .style('margin-right', 0 + 'px')
          .style('box-shadow', '0px 0px 4px #D8D8D8')
          .style('cursor', 'pointer')
          .style('opacity', 1)
          .style('border-top', function (d) {
            return '4px solid ' + color(d.key)
          })
          .on('click', function () {
            var thislegend = '#' + d3.select(this).attr('id') + '-line'
            if (d3.select(thislegend).style('opacity') === d3.select(this).style('opacity')) {
              console.log('if')
              d3.select(thislegend)
                .transition()
                .duration(1000)
                .style('opacity', 0)
                .style('display', 'none')
              d3.select(this)
                .attr('fakeclass', 'fakelegend')
              .transition()
                .duration(1000)
                .style('opacity', 0.2)
            } else {
              console.log('else')
              d3.select(thislegend)
                .transition()
                .duration(1000)
                .style('opacity', 1)
                .style('display', 'block')
              d3.select(this)
                .attr('fakeclass', 'fakelegend')
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
            return y(d.values.length)
          })
          .on('mouseover', function (d, i) {
            span.transition()
              .duration(200)
              .style('opacity', 0.9)
            span.html(d.values.length) // + 'Lieu :' + d.values[i].activity
              .style('left', (d3.event.pageX) + 'px')
              .style('top', (d3.event.pageY) + 'px')
              .style('font-weight', 'bold')
          })
          .on('mouseout', function (d) {
            span.transition()
              .duration(500)
              .style('opacity', 0)
          })
          .attr('stroke-width', 5)
          .attr('fill', function (d, i) {
            if (d.values[i]) {
              return color(d.values[i].activity)
            }
          })
          .attr('r', 8)
          .attr('stroke-opacity', 0.001)
          .attr('fill-opacity', 0.001)
          .transition().delay(1000).duration(1000)
          .attr('stroke-opacity', 1)
          .attr('fill-opacity', 1)
          .attr('stroke-width', 2.8)
          .attr('r', 3.4)
          .style('cursor', 'pointer')

        d3.select('#sortMonth').on('click', function () {
          updateMonth()
        })
        d3.select('#sortWeek').on('click', function () {
          updateWeek()
        })
        d3.select('#sortDay').on('click', function () {
          updateDay()
        })
        d3.select('#sortTime').on('click', function () {
          updateHour()
        })

        var updateMonth = function (d, i) {
          var dateFormat = d3.time.format('%Y-%m-%d') // init the date format
          // initialize new date, the current day
          var today = new Date()
          var currentMonth = today.getMonth() + 1
          var firstdaycurrentmonth = dateFormat(new Date(today.getFullYear(), currentMonth - 1, 1))
          var lastdaycurrentmonth = dateFormat(new Date(today.getFullYear(), currentMonth, 0))

          nestedData = d3.nest()
          .key(function (d) { return d.activity })
          .key(function (d) { return dateFormat(new Date(d.time)) }).sortKeys(d3.ascending)
          .entries(dataset)

          // Select the section we want to apply our changes to
          svg = d3.select('#freq').transition()

          startDate = firstdaycurrentmonth
          endDate = lastdaycurrentmonth

          x.domain([new Date(startDate), new Date(endDate)])

          xAxis.ticks(d3.time.day, 2)
          xAxis.tickFormat(d3.time.format('%d-%b'))

          // Make the changes
          svg.selectAll('.line')   // change the line
            .duration(750)
            .attr('d', function (d) { return line(d.values) })
          svg.selectAll('circle')
            .duration(750)
            .attr('cx', function (d) {
              return x(dateFormat.parse(d.key))
            })
            .attr('cy', function (d) {
              return y(d.values.length)
            })
          svg.select('.x') // change the x axis
            .duration(750)
            .call(xAxis)
          svg.select('.y') // change the x axis
            .duration(750)
            .call(yAxis)
        }

        var updateWeek = function (d, i) {
          var dateFormat = d3.time.format('%Y-%m-%d')
          // initialize new date
          var today = new Date()
          var currentMonth = today.getMonth() + 1
          var currentweekfirst = today.getDate() - today.getDay() + 1
          var currentweeklast = today.getDate() - today.getDay() + 7
          var firstdaycurrentweek = dateFormat(new Date(today.getFullYear(), currentMonth - 1, currentweekfirst))
          var lastdaycurrentweek = dateFormat(new Date(today.getFullYear(), currentMonth - 1, currentweeklast))

          nestedData = d3.nest()
          .key(function (d) { return d.activity })
          .key(function (d) { return dateFormat(new Date(d.time)) }).sortKeys(d3.ascending)
          .entries(dataset)

          // Select the section we want to apply our changes to
          svg = d3.select('#freq').transition()

          startDate = firstdaycurrentweek
          endDate = lastdaycurrentweek

          x.domain([new Date(startDate), new Date(endDate)])

          xAxis.ticks(d3.time.day, 1)
          xAxis.tickFormat(d3.time.format('%d-%b'))

          // Make the changes
          svg.selectAll('.line')   // change the line
            .duration(750)
            .attr('d', function (d) { return line(d.values) })
          svg.selectAll('circle')   // change the line
            .duration(750)
            .attr('stroke', function (d, i) {
              if (d.values[i]) {
                return color(d.values[i].activity)
              }
            })
            .attr('cx', function (d) {
              return x(dateFormat.parse(d.key))
            })
            .attr('cy', function (d) {
              return y(d.values.length)
            })
          svg.select('.x') // change the x axis
            .duration(750)
            .call(xAxis)
          svg.select('.y') // change the x axis
            .duration(750)
            .call(yAxis)
        }

        var updateDay = function (d, i) {
          var dateFormat = d3.time.format('%Y-%m-%dT%H:%M')
          // initialize new date
          var today = new Date()
          var currentMonth = today.getMonth() + 1
          // var startday = today.getHours() - today.getHours()
          // var endday = today.getHours() - today.getHours() + 24
          var firstdaycurrenthour = dateFormat(new Date(today.getFullYear(), currentMonth - 1, today.getDay(), today.getHours()))
          var lastdaycurrenthour = dateFormat(new Date(today.getFullYear(), currentMonth - 1, today.getDay(), today.getHours() + 24))
          console.log(firstdaycurrenthour, lastdaycurrenthour)

          nestedData = d3.nest()
          .key(function (d) { return d.activity })
          .key(function (d) { return dateFormat(new Date(d.time)) }).sortKeys(d3.ascending)
          .entries(dataset)

          min = d3.min(nestedData, function (datum) {
            return d3.min(datum.values, function (d) { return d.values.length })
          })
          max = d3.max(nestedData, function (datum) {
            return d3.max(datum.values, function (d) { return d.values.length })
          })

          // Select the section we want to apply our changes to
          svg = d3.select('#freq').transition()

          startDate = firstdaycurrenthour
          endDate = lastdaycurrenthour

          x.domain([new Date(startDate), new Date(endDate)])

          xAxis.ticks(d3.time.minutes, 120)
          xAxis.tickFormat(d3.time.format('%Hh'))

          // Make the changes
          svg.selectAll('.line')   // change the line
            .duration(750)
            .attr('d', function (d) { return line(d.values) })
          svg.selectAll('circle')   // change the line
            .duration(750)
            .attr('stroke', function (d, i) {
              if (d.values[i]) {
                return color(d.values[i].activity)
              }
            })
            .attr('cx', function (d) {
              return x(dateFormat.parse(d.key))
            })
            .attr('cy', function (d) {
              return y(d.values.length)
            })
          svg.select('.x') // change the x axis
            .duration(750)
            .call(xAxis)
          svg.select('.y') // change the x axis
            .duration(750)
            .call(yAxis)
        }

        var updateHour = function (d, i) {
          var dateFormat = d3.time.format('%Y-%m-%dT%H:%M')
          // initialize new date
          var today = new Date()
          var currentMonth = today.getMonth() + 1
          var daycurrentthishour = dateFormat(new Date(today.getFullYear(), currentMonth - 1, today.getDay(), today.getHours()))
          var daycurrentlasthour = dateFormat(new Date(today.getFullYear(), currentMonth - 1, today.getDay(), today.getHours() + 1))

          nestedData = d3.nest()
          .key(function (d) { return d.activity })
          .key(function (d) { return dateFormat(new Date(d.time)) }).sortKeys(d3.ascending)
          .entries(dataset)

          // Select the section we want to apply our changes to
          svg = d3.select('#freq').transition()

          startDate = daycurrentthishour
          endDate = daycurrentlasthour

          x.domain([new Date(startDate), new Date(endDate)])

          xAxis.ticks(d3.time.minutes, 5)
          xAxis.tickFormat(d3.time.format('%H:%M'))

          // Make the changes
          svg.selectAll('.line')   // change the line
            .duration(750)
            .attr('d', function (d) { return line(d.values) })
          svg.selectAll('circle')   // change the line
            .duration(750)
            .attr('stroke', function (d, i) {
              if (d.values[i]) {
                return color(d.values[i].activity)
              }
            })
            .attr('cx', function (d) {
              return x(dateFormat.parse(d.key))
            })
            .attr('cy', function (d) {
              return y(d.values.length)
            })
          svg.select('.x') // change the x axis
            .duration(750)
            .call(xAxis)
          svg.select('.y') // change the x axis
            .duration(750)
            .call(yAxis)
        }
      })
    }
    )
  }
}
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

.freq_value{
  width: 200px;
  background: rgb(255, 255, 255) none repeat scroll 0% 0%;
  height: 40px;
  border-radius: 2px;
  display: block;
  margin: 0px auto;
  box-shadow: 0px 0px 4px #D8D8D8;
  padding-top: 5px;
}

.freq_value p {
  text-align: center;
  font-weight: bold;
  margin-top: 8px;
  }
</style>