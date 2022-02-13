<template>
  <v-container>
    <div class="text-center">
      <v-dialog v-model="loginDialog" width="500">
        <v-card>
          <v-card-title class="text-h5 grey lighten-2"> Login </v-card-title>
          <v-card-text>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-text-field
                validate-on-blur
                v-model="email"
                :rules="emailRules"
                label="E-mail"
                :error-messages="errorMessage"
                required
              ></v-text-field>
              <!-- Password -->
              <v-text-field
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :rules="[rules.required, rules.emailMatch]"
                :type="showPassword ? 'text' : 'password'"
                name="input-10-2"
                label="Password"
                hint="At least 8 characters"
                @click:append="showPassword = !showPassword"
                v-model="password"
                lazy
              ></v-text-field>
              <!--  -->
            </v-form>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="login()"> I accept </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </v-container>
</template>

<script>
import { eventBus } from "../main";
import app from "../firebase/init";
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
const auth = getAuth();
export default {
  name: "Login",

  data: () => ({
    testBus: "",
    loginDialog: false,
    showPassword: false,
    valid: true,
    errorMessage: null,
    email: "",
    emailMatch: "null",
    emailRules: [
      (v) => !!v || "E-mail is required",
      (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
    ],
    passwordShow: false,
    password: "",
    rules: {
      required: (value) => !!value || "Required.",
      min: (v) => v.length >= 8 || "Min 8 characters",
      emailMatch: () => `Email and password don't match`,
    },
  }),
  created() {
    eventBus.$on("loginDialog", (event) => {
      this.loginDialog = event;
    });
    //This data comes from BuyCrypto component. It directs users to login page.
    eventBus.$on("loginTrue", (event) => {
      this.loginDialog = event;
    });
  },
  methods: {
    login() {
      signInWithEmailAndPassword(auth, this.email, this.password)
        .then((cred) => {
          this.loginDialog = false;
        })
        .catch((err) => {
          console.log(err);
          // this.rules.emailMatch = err;
        });
    },
  },
};
</script>
