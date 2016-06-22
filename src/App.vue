<template>
</template>

<script>
import Menu from './components/Menu'
import Accueil from './components/Accueil'

export default {
  components: {
    Menu,
    Accueil
  }
}
</script>

<style>
html {
  height: 100%;
}

body {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-family: Arial, Helvetica, sans-serif;
  margin: 0px;
  padding: 0px;
}

#app {
  color: #2c3e50;
  margin-left: 230px;
  text-align: center;
  display: block;
}

#app a {
  color: #42b983;
  text-decoration: none;
}

#datachart{
  display: block;
  margin: 0 auto;
  min-height: 300px;
  width: 100%;
}

.arc text {
  font: 12px sans-serif;
  text-anchor: middle;
  font-weight: bold;
  color: #fff !important;
}

.arc path {
  stroke: #fff;
}
</style>
