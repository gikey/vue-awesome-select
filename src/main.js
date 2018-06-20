import Vue from 'vue'
import App from './App'
import vSelect from  './vselect'

Vue.config.productionTip = false

Vue.use(vSelect)

new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})
