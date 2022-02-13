<template>
  <nav>
    <v-app-bar class="px-2" app dark>
      <v-app-bar-nav-icon @click="drawer = !drawer"> </v-app-bar-nav-icon>
      <button @click="pushHome()">
        <img
          class="mt-3"
          src="../images/logo-edited.png"
          style="width: 40px"
          alt=""
        />
      </button>
      <div @click="pushHome()" class="cursor-pointer ml-1 mt-2">
        <span class="grey--text font-weight-medium">Crypto</span>
        <span class="font-weight-bold">Trader</span>
      </div>

      <v-spacer></v-spacer>

      <div v-if="signedIn" class="welcome-logout d-flex align-end">
        <h4 v-if="getBalance" class="font-weight-medium mr-lg-10 mx-3 mt-2">
          Balance: ${{ getBalance.toFixed(2) }}
        </h4>
        <v-btn @click="signUserOut()" color="grey">LOGOUT</v-btn>
      </div>
      <div data-v-step="0" v-else class="button-container">
        <v-btn class="secondary px-1 px-sm-2" @click="pushSignup()"
          >Sign up</v-btn
        >
        <v-btn color="blue-grey lighten-1 px-1 px-sm-2" @click="pushLogin()"
          >Login</v-btn
        >
      </div>
    </v-app-bar>
    <v-navigation-drawer dark app v-model="drawer" class="danger">
      <v-list-item
        v-for="link in drawerContent"
        :key="link.title"
        router
        :to="link.route"
      >
        <v-list-item-action>
          <v-icon>
            {{ link.icon }}
          </v-icon>
        </v-list-item-action>
        <v-list-item-title>
          {{ link.title }}
        </v-list-item-title>
      </v-list-item>
      <Login />
    </v-navigation-drawer>
    <!-- Dialog box -->
  </nav>
</template>

<script>
import app from "../firebase/init";
import { eventBus } from "../main.js";
import Login from "./Login.vue";

import { onAuthStateChanged, getAuth, signOut } from "firebase/auth";
import { getFirestore, getDoc, doc, onSnapshot } from "firebase/firestore";
const db = getFirestore();
const auth = getAuth();
export default {
  name: "Navbar",
  components: { Login },
  created() {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.signedIn = true;
        const docRef = doc(db, "userInfo", user.uid);
        onSnapshot(docRef, (doc) => {
          this.user = doc.data();
          this.$store.commit("getUser", doc.data());
          eventBus.$emit("user", this.user);
        });
      } else {
        this.signedIn = false;
      }
    });
    // getDoc(docRef).then((doc) => {
    //       this.user = doc.data();
    //       eventBus.$emit("user", this.user);
    //       this.$store.commit("getUser", doc.data());
    //     });
  },

  data() {
    return {
      balance: 0,
      snapshotData: null,
      signedIn: false,
      drawer: false,
      loginDialog: true,
      user: null,
      drawerContent: [
        { title: "Home", icon: "mdi-home", route: "/" },

        { title: "Wallet", icon: "mdi-wallet", route: "/userwallet" },
        { title: "Chat", icon: "mdi-chat", route: "/chat" },
        {
          title: "About",
          icon: "mdi-information-outline",
          route: "/about",
        },
        { title: "Contact", icon: "mdi-email", route: "/contact" },
      ],
    };
  },
  methods: {
    //Directs the user to the signup page
    pushSignup() {
      if (this.$route.name != "Signup") {
        this.$router.push({ name: "Signup" });
      }
    },
    //Pops open the login component, which is dialog page
    pushLogin() {
      eventBus.$emit("loginDialog", this.loginDialog);
    },
    //Directs the user to the main page
    pushHome() {
      if (this.$route.name != "Home") {
        this.$router.push({ name: "Home" });
      }
    },
    //Signs user out
    async signUserOut() {
      signOut(auth);
      this.$store.commit("getUser", null);
    },
  },
  computed: {
    getBalance() {
      return this.$store.state.sum;
    },
    getUser() {
      return this.$store.state.user;
    },
  },
  watch: {
    //BuyCrypto component recives  this emitted data. This informs the component about user status.
    signedIn() {
      eventBus.$emit("signedIn", this.signedIn);
    },
  },
};
</script>
<style scoped>
.cursor-pointer:hover {
  cursor: pointer;
}
</style>
