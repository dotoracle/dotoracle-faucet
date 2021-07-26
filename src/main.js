import Vue from 'vue'
import App from './App.vue'
import { BootstrapVue } from 'bootstrap-vue'

let Web3 = require('web3')
let VueWeb3 = require('vue-web3')

Vue.config.productionTip = false
Vue.use(BootstrapVue)
if (window.web3) {
  Vue.use(VueWeb3, { web3: new Web3(window.web3.currentProvider) })
}
import '@/assets/app.scss'
new Vue({
  render: function (h) { return h(App) }
}).$mount('#app')
