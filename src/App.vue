<template>
  <v-app>
    <Navbar app />
    <!-- <AutoComplete /> -->
    <v-main class="bg-dark">
      <router-view />
    </v-main>
    <v-tour name="myTour" :steps="steps"> </v-tour>
  </v-app>
</template>

<script>
import Navbar from "./components/Navbar";
// import AutoComplete from "./components/AutoComplete.vue";

export default {
  name: "App",
  components: {
    Navbar,
    // AutoComplete,
  },
  mounted: function () {
    //Checking if user logged in, if not tour starts.
    const user = this.$store.state.user;
    setTimeout(() => {
      if (!user) {
        this.$tours["myTour"].start();
      }
    }, 500);
  },
  data: () => ({
    //
    steps: [
      {
        target: '[data-v-step="0"]', // We're using document.querySelector() under the hood
        header: {
          title: "Get Started",
        },
        content: `First login or sign up!`,
      },
      {
        target: '[data-v-step="1"]',
        content: `Then, click on a crypto coin to buy or sell`,
      },
    ],
    tour: {
      currentStep: 0,
    },
  }),
};
</script>
<style>
.bg-dark {
  background: #212121;
}
.overflow-scroll {
  overflow: scroll;
}
::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  background-color: #f5f5f5;
}

::-webkit-scrollbar {
  width: 12px;
  background-color: #f5f5f5;
}

::-webkit-scrollbar-thumb {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #616161;
}
</style>
