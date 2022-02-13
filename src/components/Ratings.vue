<template>
  <v-container>
    <h1 class="grey--text text--lighten-2 text-center">Reviews from Users</h1>
    <v-row class="mt-7 justify-space-around">
      <v-col cols="lg-4">
        <h2 class="grey--text text-center mb-5">Comments and Ratings</h2>

        <v-list
          max-height="60%"
          dark
          class="overflow-scroll"
          rounded
          v-chat-scroll
        >
          <v-list-item v-for="rating in reviewsArray" :key="rating.uid">
            <v-row class="d-block mt-5">
              <v-col cols="lg-12 d-flex ">
                <h3 class="align-self-center">{{ rating.name }}</h3>
                <v-spacer></v-spacer>
                <v-rating
                  v-model="rating.rating"
                  color="yellow darken-3"
                  background-color="grey darken-1"
                  empty-icon="$ratingFull"
                  half-increments
                  small
                  readonly
                  class="justify-self-end"
                ></v-rating>
              </v-col>
              <v-col cols="lg-12">
                <h4>"{{ rating.comment }}"</h4>
              </v-col>
              <v-col cols="lg-12">
                <h5 class="grey--text text--lighten-1">{{ rating.time }}</h5>
              </v-col>
              <v-divider></v-divider>
            </v-row>
          </v-list-item>
        </v-list>
      </v-col>
      <v-col lg="4 d-flex flex-column grey--text text-center">
        <h2 class="mb-5">Rating Average</h2>
        <v-progress-circular
          :rotate="360"
          :size="250"
          :width="15"
          :value="calculateStarsAverage * 20"
          color="yellow"
          class="mx-auto my-5"
        >
          {{ calculateStarsAverage.toFixed(2) }}
        </v-progress-circular>
        <h4>Thanks!</h4>
        <v-dialog transition="dialog-bottom-transition" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              class="black--text mt-4"
              color="warning"
              v-bind="attrs"
              v-on="on"
              >Rate This App</v-btn
            >
          </template>
          <template v-slot:default="dialog">
            <v-card dark class="elevation-16 mx-auto">
              <v-card-title class="text-h5"> Rate This App </v-card-title>
              <v-card-text>
                If you enjoy using CryptoTrader, please take a few seconds to
                rate your experience with the app. It really helps!

                <div class="text-center mt-4">
                  <v-rating
                    v-model="userRating"
                    color="yellow darken-3"
                    background-color="grey darken-1"
                    empty-icon="$ratingFull"
                    half-increments
                    hover
                    large
                  ></v-rating>
                </div>
              </v-card-text>
              <h5 class="red--text ml-4 mb-1" v-if="isErrorMessage">
                Please fill the stars and the comment section to continue.
              </h5>
              <h5 class="red--text ml-4 mb-1" v-if="isNotSignedInMessage">
                Please login or sign up to rate this app.
              </h5>
              <v-textarea
                class="px-3"
                outlined
                label="Comment"
                placeholder="Your comment goes here."
                max-height="300px"
                rows="3"
                v-model="userComment"
              ></v-textarea>
              <v-divider></v-divider>
              <v-card-actions class="justify-space-between">
                <v-btn text @click="dialog.value = false"> No Thanks </v-btn>
                <v-btn color="primary" text @click="rateApp(dialog)">
                  Rate Now
                </v-btn>
              </v-card-actions>
            </v-card>
          </template>
        </v-dialog>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import moment from "moment";

import app from "../firebase/init.js";
import {
  getFirestore,
  doc,
  updateDoc,
  onSnapshot,
  arrayUnion,
} from "firebase/firestore";
const db = getFirestore();
const docRef = doc(db, "ReviewAndComments", "reviewAndComments");
export default {
  name: "Ratings",
  data() {
    return {
      ratings: null,
      userComment: null,
      userRating: null,
      isErrorMessage: false,
      reviewsArray: [],
      isNotSignedInMessage: false,
    };
  },
  methods: {
    async rateApp(dialog) {
      const user = this.$store.state.user;
      if (this.userRating && this.userComment && user) {
        this.isErrorMessage = false;
        const newDate = new Date();
        updateDoc(docRef, {
          reviewsArray: arrayUnion({
            name: user.name,
            rating: this.userRating,
            comment: this.userComment,
            time: moment(newDate).format("LLLL"),
            id: user.uid,
          }),
        });
        dialog.value = false;
        this.userComment = null;
        this.userRating = null;
      } else if (!user) {
        this.isNotSignedInMessage = true;
      } else {
        this.isErrorMessage = true;
      }
    },
  },
  computed: {
    reversedReviewsArray() {
      return this.reviewsArray.reverse();
    },
    calculateStarsAverage() {
      let totalReviews = 0;
      let ratingSum = 0;
      this.reviewsArray.forEach((review) => {
        totalReviews++;
        ratingSum += review.rating;
      });
      return ratingSum / totalReviews;
    },
  },
  created() {
    onSnapshot(docRef, (doc) => {
      this.reviewsArray = doc.data().reviewsArray;
    });
  },
};
</script>
<style scoped>
.justify-self-end {
  justify-self: end !important;
}
</style>
