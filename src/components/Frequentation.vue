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
      <div id="freq">
      </div>
      <div id="legend-line" style="margin-top: 20px;">
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
      djson: 'Fréquentation du camping'
    }
  }
}

process.nextTick(function () {
  var dataset
  var teststart = '2016-05-01'
  var testend = '2016-07-31'
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

    var margin = {top: 20, right: 4, bottom: 20, left: 40}
    var width = 980 - margin.left - margin.right
    var height = 300 - margin.top - margin.bottom
    var min = d3.min(nestedData, function (datum) {
      return d3.min(datum.values, function (d) { return d.values.length })
    })
    var max = d3.max(nestedData, function (datum) {
      return d3.max(datum.values, function (d) { return d.values.length })
    })

    var startDate = '2016-05-01'
    var endDate = '2016-06-30'

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
      .ticks(d3.time.week, 1)
      .tickFormat(d3.time.format('%d-%b'))
      .tickSize(height + 6, height + 6, 0)

    var yAxis = d3.svg.axis()
      .scale(y)
      .orient('left')
      .ticks(max)
      .tickValues(d3.range(0, max, 10))
      .tickSubdivide(true)
      .tickFormat(d3.format('d'))
      .tickSize(6 - width, width + 6, 0.5)

    // define hover tooltip
    var div = d3.select('#freq').append('div')
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
      .interpolate('linear') // linear, cardinal or monotone
      .x(function (d) { return x(dateFormat.parse(d.key)) })
      .y(function (d) { return y(d.values.length) })

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
      .attr('id', function (d) { return d.key })
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
        return y(d.values.length)
      })
      .on('mouseover', function (d, i) {
        div.transition()
          .duration(200)
          .style('opacity', 0.9)
        div.html('Freq :' + d.values.length + '<br/>') // + 'Lieu :' + d.values[i].activity
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
      var dateFormat = d3.time.format('%Y-%m-%d')
      // initialize new date
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