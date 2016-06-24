<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h3>{{ camping }}</h3>
    <p>Bienvenue sur votre tableau de bord. <br/> Ci-après vous retrouverez les chiffres clés du jour !</p>
  </div>
  <div id="recap_home">
      <div>
      <h5>Fréquentation</h5>
	      <div id="freq_global">
	      </div>
      </div>
      <div>
      <h5>Chiffre d'affaire</h5>
	      <div id="flux_global">
	      </div>
      </div>
      <div>
      <h5>Audience</h5>
	      <div id="audience_global">
	      </div>
      </div>
  </div>
</template>

<script>
var d3 = require('d3')
export default {
  data () {
    return {
      msg: 'WELCOME !',
      camping: 'Les Reflets du Quercy ****'
    }
  },

  created () {
    var dataFreq
    var dataFlux
    var todaystart = '2016-06-24'
    var todayend = '2016-06-25'
    var url = 'http://api.dektis.trade/dashboard/flows?start=' + todaystart + '&end=' + todayend + ''
    // frequentation
    process.nextTick(function () {
      d3.json(url, function (error, json) {
        if (error) return console.warn(error)
        else dataFreq = json

        // format
        var dateFormat = d3.time.format('%Y-%m-%d')
        // grouping datas
        var nestedFreq = d3.nest()
          .key(function (d) { return d.activity })
          .key(function (d) { return dateFormat(new Date(d.time)) }).sortKeys(d3.ascending)
          .entries(dataFreq)

        // define hover tooltip
        var p = d3.select('#freq_global').append('p')
          .data(nestedFreq)

        p.transition()
          .duration(200)
          .style('opacity', 1)
        p.html(function (d) {
          return (d.key.length)
        })
          .style('font-weight', 'bold')
          .style('font-size', 30 + 'px')
          .style('margin', 0)
      })
    }
    )
    // flux monétaire
    process.nextTick(function () {
      d3.json(url, function (error, json) {
        if (error) return console.warn(error)
        else dataFlux = json

        // format
        var dateFormat = d3.time.format('%Y-%m-%d')
        // grouping datas
        var nestedFlux = d3.nest()
          .key(function (d) { return d.activity }) // by activity
          .rollup(function (v) { return d3.sum(v, function (d) { return d.amount }) }) // sum of amount
          .key(function (d) { return dateFormat(new Date(d.time)) }).sortKeys(d3.ascending) // by date and sort ascending
          .entries(dataFlux)

        // define hover tooltip
        var p = d3.select('#flux_global').append('p')
          .data(nestedFlux)

        p.transition()
          .duration(200)
          .style('opacity', 1)
        p.html(function (d, i) {
          return (d.values[i].values + ' €')
        })
          .style('font-weight', 'bold')
          .style('font-size', 30 + 'px')
          .style('margin', 0)
      })
    }
    )
    // audience
    process.nextTick(function () {
      var data = [
        { key: '2016-06-24', value: 1289 }
      ]

      // define hover tooltip
      var p = d3.select('#audience_global').append('p')
        .data(data)

      p.transition()
        .duration(200)
        .style('opacity', 1)
      p.html(function (data) {
        return (data.value)
      })
        .style('font-weight', 'bold')
        .style('font-size', 30 + 'px')
        .style('margin', 0)
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1 {
  color: #87C83D;
  font-size: 40px;
}

h5 {
	text-transform: uppercase;
	margin-bottom: 12px;
}

.hello {
	display: block;
	margin: 0 auto;
	margin-top: 100px;
	width: 960px;
	text-align: center;
}

div#recap_home {
	width: 100%;
	margin-top: 45px;
	position: relative;
	text-align: center;
}

div#recap_home div {
	display: inline-block;
	width: 33%;
}

div#recap_home div > div{
  width: 180px;
  background: rgb(255, 255, 255) none repeat scroll 0% 0%;
  height: 50px;
  border-radius: 2px;
  display: block;
  margin: 0px auto;
  box-shadow: 0px 0px 4px #D8D8D8;
  padding-top: 15px;
}

div#recap_home div > div p {
  text-align: center;
  font-weight: bold;
  }
</style>
