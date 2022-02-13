<template>
  <v-container dark class="about">
    <AboutInfo />
    <Ratings />
  </v-container>
</template>
<script>
import Ratings from "../components/Ratings";
import AboutInfo from "../components/AboutInfo";
export default {
  name: "About",
  components: { Ratings, AboutInfo },
};
</script>
