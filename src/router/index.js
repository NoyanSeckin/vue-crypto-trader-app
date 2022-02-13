import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Signup from "../components/Signup.vue";
import Login from "../components/Login.vue";
import BuyCrypto from "../components/BuyCrypto.vue";
import UserWallet from "../components/UserWallet.vue";
import Chat from "../components/Chat.vue";
import Contact from "../components/Contact.vue";
Vue.use(VueRouter);

const routes = [
  {
    path: "/contact",
    name: "Contact",
    component: Contact,
  },
  {
    path: "/chat",
    name: "Chat",
    component: Chat,
  },

  {
    path: "/userwallet",
    name: "UserWallet",
    component: UserWallet,
  },

  {
    path: "/buycrypto",
    name: "BuyCrypto",
    component: BuyCrypto,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/signup",
    name: "Signup",
    component: Signup,
  },
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
];

const router = new VueRouter({
  routes,
  mode: "history",
});

export default router;
