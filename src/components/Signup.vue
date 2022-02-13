<template>
  <v-container>
    <v-row class="justify-center mt-15">
      <v-col lg="5">
        <v-card class="px-7 py-5" dark>
          <v-form ref="form" v-model="valid" lazy-validation dark>
            <h1 class="white--text mb-3">Sign Up</h1>

            <v-text-field
              v-model="name"
              :counter="25"
              :rules="nameRules"
              label="Name"
              required
              dark
            ></v-text-field>

            <v-text-field
              v-model="email"
              :rules="emailRules"
              label="E-mail"
              :error-messages="errorMessage"
              required
              dark
            ></v-text-field>
            <!-- Password -->
            <v-text-field
              v-model="password"
              :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
              :rules="[rules.required, rules.min]"
              :type="show1 ? 'text' : 'password'"
              name="input-10-1"
              label="Password"
              hint="At least 8 characters"
              counter
              @click:append="show1 = !show1"
              dark
            ></v-text-field>
            <!--  -->
            <!-- Terms & Usage -->
            <div class="">
              <v-dialog v-model="dialog" width="500">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn color="primary darken-2" dark v-bind="attrs" v-on="on">
                    Terms & Usage
                  </v-btn>
                </template>

                <v-card>
                  <v-card-title class="text-h5 grey lighten-2">
                    Terms of Usage
                  </v-card-title>

                  <v-card-text class="mt-2">
                    I fully understand and acknowledge that Crypto Trader web
                    application is for the purpose of entertainment only,
                    therefore it does not involve real money or real crypto
                    currencies. Regarding this web application, I accept that I
                    have no rights to demand anything from the developer of this
                    web application and I approve that the developer has no
                    liability, whatsoever, towards me or anyone else.
                  </v-card-text>

                  <v-divider></v-divider>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" text @click="acceptTerms()">
                      I accept
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </div>
            <!--  -->
            <v-checkbox
              v-model="checkbox"
              :rules="[(v) => !!v || 'You must agree to continue!']"
              label="Do you accept the terms?"
              required
              dark
            ></v-checkbox>

            <v-btn
              :disabled="!valid"
              color="success"
              class="mr-4"
              @click="validate"
            >
              Sign Up
            </v-btn>

            <v-btn color="error" class="mr-4" @click="reset"> Reset </v-btn>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import app from "../firebase/init";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import {
  doc,
  addDoc,
  collection,
  getFirestore,
  setDoc,
} from "firebase/firestore";
const db = getFirestore();
const colRef = collection(db, "userInfo");
const auth = getAuth();
import { eventBus } from "../main";
export default {
  name: "Signup",
  data: () => ({
    dialog: false,
    valid: true,
    name: "",
    errorMessage: null,
    nameRules: [
      (v) => !!v || "Name is required",
      (v) => (v && v.length <= 25) || "Name must be less than 25 characters",
    ],
    email: "",
    emailRules: [
      (v) => !!v || "E-mail is required",
      (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
    ],
    password: "",
    passwordRules: [
      (v) => !!v || "Password is required",
      (v) => /.+@.+\..+/.test(v) || "Password must be valid",
    ],
    select: null,
    items: ["Item 1", "Item 2", "Item 3", "Item 4"],
    checkbox: false,
    // Password begins
    show1: false,
    password: "",
    rules: {
      required: (value) => !!value || "Required.",
      min: (v) => v.length >= 8 || "Min 8 characters",
      // emailMatch: () => `The email and password you entered don't match`,
    },
  }),

  watch: {
    email() {
      if (this.errorMessage != null) {
        this.errorMessage = null;
      }
    },
  },
  methods: {
    async validate() {
      createUserWithEmailAndPassword(auth, this.email, this.password)
        .then((cred) => {
          const docRef = doc(db, "userInfo", cred.user.uid);
          setDoc(docRef, {
            usd: 1000,
            cryptoAssets: {},
            uid: cred.user.uid,
            name: this.name,
          });
          this.$router.push({ name: "Home" });
        })
        .catch((err) => {
          this.errorMessage = "Email is already in use";
        });
    },

    reset() {
      this.$refs.form.reset();
    },
    acceptTerms() {
      this.checkbox = true;
      this.dialog = false;
    },
  },
  //If a user is already signed in, this code blocks him from entering this sign up page
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (vm.$store.state.user) {
        vm.$router.push({ name: "Home" });
      }
    });
  },
};
</script>
