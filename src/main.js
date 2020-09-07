import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import { Laue } from 'laue';

Vue.config.productionTip = false

new Vue({
  vuetify,
  Laue,
  render: h => h(App)
}).$mount('#app')
