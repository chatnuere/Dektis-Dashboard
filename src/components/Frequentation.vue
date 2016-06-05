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
            <li id="" style="border-radius: 4px 0px 0px 4px;">Cette heure</li>
            <li id="">Aujourd'hui</li>
            <li id="">Cette semaine</li>
            <li id="">Ce mois</li>
            <li id="" style="border-radius: 0px 4px 4px 0px;">Global</li>
          </ul>
        </div>
      </div>
      <div id="freq">
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
  var dataset = [
    {id: 109, time: '2016-01-01', userName: 'simon', activity: 'accueil'},
    {id: 110, time: '2016-01-01', userName: 'pierre', activity: 'accueil'},
    {id: 111, time: '2016-01-02', userName: 'armand', activity: 'accueil'},
    {id: 109, time: '2016-01-02', userName: 'simon', activity: 'bar'},
    {id: 110, time: '2016-01-03', userName: 'pierre', activity: 'épicerie'},
    {id: 111, time: '2016-01-03', userName: 'armand', activity: 'accueil'},
    {id: 109, time: '2016-01-03', userName: 'simon', activity: 'accueil'},
    {id: 111, time: '2016-01-03', userName: 'armand', activity: 'accueil'},
    {id: 110, time: '2016-01-04', userName: 'pierre', activity: 'épicerie'},
    {id: 109, time: '2016-01-04', userName: 'simon', activity: 'accueil'},
    {id: 109, time: '2016-01-05', userName: 'simon', activity: 'accueil'},
    {id: 109, time: '2016-01-14', userName: 'simon', activity: 'accueil'},
    {id: 110, time: '2016-01-14', userName: 'pierre', activity: 'accueil'},
    {id: 111, time: '2016-01-14', userName: 'armand', activity: 'accueil'},
    {id: 109, time: '2016-01-14', userName: 'simon', activity: 'bar'},
    {id: 110, time: '2016-01-14', userName: 'pierre', activity: 'épicerie'},
    {id: 111, time: '2016-01-14', userName: 'armand', activity: 'accueil'},
    {id: 109, time: '2016-01-14', userName: 'simon', activity: 'accueil'},
    {id: 111, time: '2016-01-14', userName: 'armand', activity: 'accueil'},
    {id: 110, time: '2016-01-14', userName: 'pierre', activity: 'épicerie'},
    {id: 109, time: '2016-01-15', userName: 'simon', activity: 'accueil'},
    {id: 109, time: '2016-01-15', userName: 'simon', activity: 'accueil'},
    {id: 111, time: '2016-01-15', userName: 'armand', activity: 'bar'},
    {id: 109, time: '2016-01-15', userName: 'simon', activity: 'épicerie'},
    {id: 110, time: '2016-01-16', userName: 'pierre', activity: 'bar'},
    {id: 111, time: '2016-01-16', userName: 'armand', activity: 'bar'},
    {id: 109, time: '2016-01-16', userName: 'simon', activity: 'bar'},
    {id: 109, time: '2016-01-16', userName: 'simon', activity: 'bar'},
    {id: 110, time: '2016-01-17', userName: 'pierre', activity: 'épicerie'},
    {id: 110, time: '2016-01-17', userName: 'pierre', activity: 'bar'},
    {id: 111, time: '2016-01-17', userName: 'armand', activity: 'épicerie'},
    {id: 111, time: '2016-01-17', userName: 'armand', activity: 'bar'},
    {id: 109, time: '2016-01-17', userName: 'simon', activity: 'épicerie'},
    {id: 109, time: '2016-01-17', userName: 'simon', activity: 'accueil'},
    {id: 110, time: '2016-01-18', userName: 'pierre', activity: 'bar'},
    {id: 111, time: '2016-01-18', userName: 'armand', activity: 'accueil'},
    {id: 111, time: '2016-01-18', userName: 'armand', activity: 'épicerie'},
    {id: 109, time: '2016-01-18', userName: 'simon', activity: 'épicerie'},
    {id: 109, time: '2016-01-18', userName: 'simon', activity: 'bar'},
    {id: 111, time: '2016-01-18', userName: 'armand', activity: 'bar'},
    {id: 110, time: '2016-01-20', userName: 'pierre', activity: 'accueil'},
    {id: 111, time: '2016-01-20', userName: 'armand', activity: 'accueil'},
    {id: 111, time: '2016-01-20', userName: 'armand', activity: 'accueil'},
    {id: 109, time: '2016-01-20', userName: 'simon', activity: 'accueil'},
    {id: 109, time: '2016-01-20', userName: 'simon', activity: 'bar'},
    {id: 111, time: '2016-01-20', userName: 'armand', activity: 'bar'},
    {id: 105, time: '2016-01-25', userName: 'Manning', activity: 'accueil'},
    {id: 109, time: '2016-01-26', userName: 'simon', activity: 'accueil'},
    {id: 110, time: '2016-01-26', userName: 'pierre', activity: 'accueil'},
    {id: 111, time: '2016-01-26', userName: 'armand', activity: 'accueil'},
    {id: 109, time: '2016-01-27', userName: 'simon', activity: 'bar'},
    {id: 110, time: '2016-01-28', userName: 'pierre', activity: 'épicerie'},
    {id: 111, time: '2016-01-28', userName: 'armand', activity: 'accueil'},
    {id: 109, time: '2016-01-28', userName: 'simon', activity: 'accueil'},
    {id: 111, time: '2016-01-28', userName: 'armand', activity: 'accueil'},
    {id: 110, time: '2016-01-28', userName: 'pierre', activity: 'épicerie'},
    {id: 109, time: '2016-01-29', userName: 'simon', activity: 'accueil'},
    {id: 109, time: '2016-01-29', userName: 'simon', activity: 'accueil'},
    {id: 111, time: '2016-01-29', userName: 'armand', activity: 'bar'},
    {id: 150, time: '2016-01-21', userName: 'West', activity: 'accueil'},
    {id: 195, time: '2016-01-22', userName: 'Cristina', activity: 'accueil'},
    {id: 115, time: '2016-01-22', userName: 'Annette', activity: 'bar'},
    {id: 105, time: '2016-01-23', userName: 'Manning', activity: 'épicerie'},
    {id: 150, time: '2016-01-23', userName: 'West', activity: 'bar'},
    {id: 195, time: '2016-01-23', userName: 'Cristina', activity: 'bar'},
    {id: 115, time: '2016-01-23', userName: 'Annette', activity: 'épicerie'},
    {id: 105, time: '2016-01-24', userName: 'Manning', activity: 'bar'},
    {id: 150, time: '2016-01-24', userName: 'West', activity: 'bar'},
    {id: 195, time: '2016-01-24', userName: 'Cristina', activity: 'accueil'},
    {id: 115, time: '2016-01-24', userName: 'Annette', activity: 'bar'},
    {id: 105, time: '2016-01-24', userName: 'Manning', activity: 'épicerie'},
    {id: 150, time: '2016-01-25', userName: 'West', activity: 'bar'},
    {id: 195, time: '2016-01-25', userName: 'Cristina', activity: 'accueil'},
    {id: 115, time: '2016-01-25', userName: 'Annette', activity: 'bar'},
    {id: 109, time: '2016-01-30', userName: 'simon', activity: 'épicerie'},
    {id: 110, time: '2016-01-30', userName: 'pierre', activity: 'bar'},
    {id: 111, time: '2016-01-30', userName: 'armand', activity: 'bar'},
    {id: 109, time: '2016-01-30', userName: 'simon', activity: 'bar'},
    {id: 109, time: '2016-01-31', userName: 'simon', activity: 'bar'},
    {id: 110, time: '2016-01-31', userName: 'pierre', activity: 'épicerie'},
    {id: 110, time: '2016-01-31', userName: 'pierre', activity: 'bar'},
    {id: 111, time: '2016-01-31', userName: 'armand', activity: 'épicerie'},
    {id: 111, time: '2016-01-31', userName: 'armand', activity: 'bar'},
    {id: 109, time: '2016-02-01', userName: 'simon', activity: 'épicerie'},
    {id: 109, time: '2016-02-01', userName: 'simon', activity: 'accueil'},
    {id: 110, time: '2016-02-01', userName: 'pierre', activity: 'bar'},
    {id: 111, time: '2016-02-01', userName: 'armand', activity: 'accueil'},
    {id: 111, time: '2016-02-01', userName: 'armand', activity: 'épicerie'},
    {id: 115, time: '2016-02-04', userName: 'Annette', activity: 'bar'},
    {id: 105, time: '2016-02-04', userName: 'Manning', activity: 'épicerie'},
    {id: 150, time: '2016-02-04', userName: 'West', activity: 'bar'},
    {id: 195, time: '2016-02-04', userName: 'Cristina', activity: 'bar'},
    {id: 115, time: '2016-02-04', userName: 'Annette', activity: 'épicerie'},
    {id: 105, time: '2016-02-04', userName: 'Manning', activity: 'bar'},
    {id: 150, time: '2016-02-04', userName: 'West', activity: 'bar'},
    {id: 195, time: '2016-02-04', userName: 'Cristina', activity: 'accueil'},
    {id: 115, time: '2016-02-04', userName: 'Annette', activity: 'bar'},
    {id: 105, time: '2016-02-05', userName: 'Manning', activity: 'épicerie'},
    {id: 150, time: '2016-02-05', userName: 'West', activity: 'bar'},
    {id: 195, time: '2016-02-05', userName: 'Cristina', activity: 'accueil'},
    {id: 115, time: '2016-02-05', userName: 'Annette', activity: 'bar'},
    {id: 105, time: '2016-02-05', userName: 'Manning', activity: 'accueil'},
    {id: 109, time: '2016-02-02', userName: 'simon', activity: 'épicerie'},
    {id: 109, time: '2016-02-02', userName: 'simon', activity: 'bar'},
    {id: 111, time: '2016-02-02', userName: 'armand', activity: 'bar'},
    {id: 110, time: '2016-02-02', userName: 'pierre', activity: 'accueil'},
    {id: 111, time: '2016-02-02', userName: 'armand', activity: 'accueil'},
    {id: 111, time: '2016-02-02', userName: 'armand', activity: 'accueil'},
    {id: 109, time: '2016-02-03', userName: 'simon', activity: 'accueil'},
    {id: 109, time: '2016-02-03', userName: 'simon', activity: 'bar'},
    {id: 111, time: '2016-02-03', userName: 'armand', activity: 'bar'},
    {id: 150, time: '2016-02-04', userName: 'West', activity: 'accueil'},
    {id: 195, time: '2016-02-04', userName: 'Cristina', activity: 'accueil'}
  ]

  // définit le format de la date
  var dateFormat = d3.time.format('%Y-%m-%d')
  // regroupe les datas
  var nestedData = d3.nest()
    .key(function (d) { return d.activity })
    .key(function (d) { return dateFormat(new Date(d.time)) }).sortKeys(d3.ascending)
    .entries(dataset)

  var margin = {top: 20, right: 40, bottom: 20, left: 40}
  var width = 960 - margin.left - margin.right
  var height = 300 - margin.top - margin.bottom
  var min = d3.min(nestedData, function (datum) {
    return d3.min(datum.values, function (d) { return d.values.length })
  })
  var max = d3.max(nestedData, function (datum) {
    return d3.max(datum.values, function (d) { return d.values.length })
  })

  var x = d3.time.scale()
    // .domain(d3.extent(dataset, function (d) { return d3.time.month.offset(new Date(d.time), 0) }))
    .domain([new Date(2016, 0, 1), new Date(2016, 1, 0)])
    .range([0, width])

  var y = d3.scale.linear()
    .domain([min, max])
    .range([height, 0])

  var xAxis = d3.svg.axis()
    .scale(x)
    .orient('bottom')
    .ticks(d3.time.week, 1)
    .tickFormat(d3.time.format('%d-%b'))
    .tickSize(height + 6, 6, 0)

  var yAxis = d3.svg.axis()
    .scale(y)
    .orient('right')
    .ticks(max)
    .tickSubdivide(true)
    .tickFormat(d3.format('d'))
    .tickSize(width + 6, width + 6, 0)

  var color = d3.scale.category10()

  var svg = d3.select('#freq').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

  drawMainGraph()

  function drawMainGraph () {
    var line = d3.svg.line()
      .interpolate('linear') // linear, cardinal or monotone are good
      .x(function (d) { return x(dateFormat.parse(d.key)) })
      .y(function (d) { return y(d.values.length) })

    // append a rectangle which will be the charts background
    svg.append('svg:rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('height', height)
      .attr('width', width)
      .attr('fill', '#F7F7F7')

    // Add a title
    svg.append('svg:text')
      .attr('x', width / 4)
      .attr('y', 20)
      .attr('style', 'font-size: 12 font-family: Helvetica, sans-serif')
      .text('Activités par mois')

    svg.append('g')
      .attr('class', 'grid')
      .attr('style', 'stroke: lightgrey')
      .call(xAxis)

    svg.append('g')
      .attr('class', 'grid')
      .call(yAxis)
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '.71em')
      .attr('style', 'font-size: 10 font-family: Helvetica, sans-serif')
      .attr('style', 'stroke: lightgrey')
      .style('text-anchor', 'end')
      .text('')

    var activityLine = svg.selectAll('.activity')
      .data(nestedData)
      .enter()
      .append('g')
      .attr('class', 'activity')
      .attr('id', function (d) { return d.key })

    activityLine.append('path')
      .attr('class', 'line')
      .attr('d', function (d) { return line(d.values) })
      .style('stroke', function (d) { return color(d.key) })
      .attr('fill', 'none')
      .attr('stroke-width', 4.8)
      .attr('stroke-opacity', 0.0001)
      .transition().duration(2000)
      .attr('stroke-opacity', 1)
      .attr('stroke-width', 2.8)

    activityLine.selectAll('circle')
      .data(function (d) {
        console.log(d)
        return (d.values)
      })
      .enter().append('circle')
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
      .attr('stroke-width', 5)
      .attr('fill', 'white')
      .attr('r', 8)
      .attr('stroke-opacity', 0.001)
      .attr('fill-opacity', 0.001)
      .transition().delay(1000).duration(1500)
      .attr('stroke-opacity', 1)
      .attr('fill-opacity', 1)
      .attr('stroke-width', 2.8)
      .attr('r', 3.4)
  }
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
  var width = 920
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
/*
button{
  width: 80px;
  padding: 6px;
  color: rgb(44, 62, 80);
  background: rgb(255, 255, 255) none repeat scroll 0% 0%;
  border: 2px solid rgb(135, 200, 61);
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  -moz-transition: background-color .2s ease-in;
     -o-transition: background-color .2s ease-in;
     -webkit-transition: background-color .2s ease-in;
     transition: background-color .2s ease-in;
}

button:hover{
  background-color: rgb(135, 200, 61);
}
*/
.grid .tick line {
    stroke: lightgrey;
    opacity: 1;
}
</style>