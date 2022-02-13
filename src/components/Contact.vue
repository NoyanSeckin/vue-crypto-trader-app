<template>
  <v-container>
    <h1 class="text-center yellow--text text--darken-3 mb-3 mb-lg-8">
      Contact Page
    </h1>
    <v-row>
      <v-col cols="lg-6">
        <v-img
          src="https://www.crenw.net/blog-image/backend-nedir-ve-backend-developer-ne-is-yapar.png"
          alt=""
          width="80%"
          class="mx-auto"
          id="img-width"
        />
      </v-col>
      <v-col class="" cols="lg-6 md-6 d-flex">
        <v-card max-width="80%" class="mx-auto pb-5 align-self-xl-center" dark>
          <v-card-title class="yellow--text text--darken-2"
            >Developer of the Project</v-card-title
          >
          <v-card-subtitle>Egemen Noyan Seçkin</v-card-subtitle>
          <v-card-text
            >Hey there! I am glad you are using my app. I hope you are having
            lots of fun. To develop the Crypto Trader app, I used Javascript
            language, the Vue.js framework technology, Vuetify material design
            library and a number of other respectful libraries. This was a
            challenging yet pleasurable experience for me. Please, feel free to
            contact me if you have any issues and you can leave your comments in
            the rating section, in the about page. <br />
            <br />
            Thanks!
          </v-card-text>
          <v-divider class="mb-3"></v-divider>
          <v-card-actions>
            <a @click="copyURL('egemennoyan@yahoo.com')" class="ml-4">
              <v-icon> mdi-email </v-icon>
            </a>
            <a
              href="https://www.linkedin.com/in/egemen-noyan-se%C3%A7kin-7a4933158/"
              target="__blank"
              class="mx-2"
            >
              <v-icon> mdi-linkedin </v-icon>
            </a>
            <a href="https://github.com/NoyanSeckin" target="__blank">
              <v-icon> mdi-github </v-icon>
            </a>
          </v-card-actions>
          <h5 v-if="infoAlert" class="white--text mt-2 ml-4">
            {{ infoAlert }}
          </h5>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  name: "Contact",
  data() {
    return {
      infoAlert: null,
    };
  },
  methods: {
    async copyURL(mytext) {
      try {
        await navigator.clipboard.writeText(mytext);
        this.infoAlert = "Copied!";
      } catch ($e) {
        this.infoAlert =
          "Couldn't copy! The contact mail is egemennoyan@yahoo.com";
      }
      setTimeout(() => {
        this.infoAlert = null;
      }, 1500);
    },
  },
};
</script>
<style scoped>
@media only screen and (min-width: 1265px) {
  #img-width {
    width: 90% !important;
  }
}
a {
  text-decoration: none;
}
</style>
