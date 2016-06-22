<template>
  <div class="nav" id="nav">
      <div class="menu">
          <!-- <img src="../assets/logo.png" alt="logo Dektis"> -->
          <h3>DASHBOARD</h3>
          <div class="user"> 
            <div class="user_profil" style="">
            </div>
            <p>Welcome <b>#dektis_user</b></p>
          </div>
      </div>
      <div class="submenu" id="submenu">
          <a v-link="{ path: '/' }"><i class=""></i> Mon camping <i class="ion-chevron-down right" id="icon"></i></a>
      </div>
      <div class="submenu" id="submenu">
          <a v-link="{ path: '/frequentation' }" id="menu_freq"><i class=""></i> Fréquentation <i class="ion-chevron-down right " id="icon"></i></a>
      </div>
      <div class="submenu" id="submenu">
          <a v-link="{ path: '/fluxmonetaire' }" id="menu_flux"><i class=""></i> Flux monétaires <i class="ion-chevron-down right " id="icon"></i></a>
      </div>
      <div class="submenu" id="submenu">
          <a v-link="{ path: '/404' }"><i class=""></i> Résultats financiers <i class="ion-chevron-down right " id="icon"></i></a>
      </div>
      <div class="submenu" id="submenu">
          <a v-link="{ path: '/audience' }"><i class=""></i> Audience <i class="ion-chevron-down right " id="icon"></i></a>
      </div>
        <p style="text-align: center; position: absolute; color: #374d63; bottom: 0px; width: 230px;">Powered by <img src="../assets/logo.png" alt="logo dektis" style="width: 30%; vertical-align: middle;"></p>
  </div>
</template>

<script>
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped>
/*

NAV DESIGN

*/

.nav {
    position: fixed;
    top:0px;
    left:0;
    bottom:0px;
    width:230px;
    background:#202E3D;
    height: 100%;
}

.menu h3{
  text-align: center;
  color: #46627e; 
  text-shadow: 1px 1px 1px #2c3e50;
}

.nav .menu img{
  display: block;
  margin: 0 auto;
  padding: 5%;
  width: 45%;
}

.nav .menu .user{
  width: 100%;
  height: 120px;
  background-color: #87C83D ;
  padding-top: 10px;
}

.nav .menu .user .user_profil{
    border-radius: 50px;
    width: 80px;
    height: 80px;
    display: block;
    margin: 0 auto;
    overflow: hidden;
    background-color: rgba(0, 0, 0, 0.1);
    background-position: center;
    background-repeat: no-repeat;
    background-size: 100%;
}

.nav .menu .user p{
  color:  #fff;
  text-align: center;
}

.nav .menu a i, .nav .submenu a i{
    font-size:16px;
}
/*modif*/
.nav .menu a, .nav .submenu a{
    display:block;
    height:50px;
    line-height:50px;
    color:rgba(255, 255, 255, 0.8) !important;
    padding-left:30px;
    border-bottom: 1px solid #000;
    border-top:1px solid #32353e;
    font-size:14px;
    text-decoration: none;
    text-align: left;
    -moz-transition: padding-left .2s ease-in;
     -o-transition: padding-left  .2s ease-in;
     -webkit-transition: padding-left  .2s ease-in;
     transition: padding-left  .2s ease-in;
}

/*.nav .menu-text{
    position:absolute;
    top:0;
    right:0;
    left:0;
    height:40px;
    line-height:40px;
    padding-left:50px;
}*/
/*fin moddif*/
.nav .menu a:hover, .nav .submenu a:hover{
    background:#2a2c34;
    border-right:3px solid #87C83D;
    padding-left: 40px;
    font-weight: bold;
}
.submenu .right{float:right;padding-right:15px;}
.sub-content{
    background:#1a1c20;
}
.submenu .sub-content a{border:inherit;height:30px;line-height:30px;}
.submenu .sub-content a:hover{border:inherit;}
</style>
