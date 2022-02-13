import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
export const eventBus = new Vue();
import { store } from "./store";
import VueChatScroll from "vue-chat-scroll";
import VueTour from "vue-tour";

require("vue-tour/dist/vue-tour.css");
Vue.config.productionTip = false;
Vue.use(VueChatScroll);
Vue.use(VueTour);
new Vue({
  router,
  vuetify,
  store,
  render: (h) => h(App),
}).$mount("#app");
