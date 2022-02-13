<template>
  <div class="text-center">
    <v-dialog max-width="600px" width="100%" v-model="dialog">
      <template>
        <v-card class="mx-auto">
          <v-list-item>
            <v-col cols="12">
              <v-list-item-content>
                <v-list-item-title class="text-h5">
                  <v-list-item-avatar size="30" tile class="">
                    <img :src="crypto.coinImage" alt="" />
                  </v-list-item-avatar>
                  {{ crypto.coinName }}
                </v-list-item-title>

                <v-list-item-action-text v-if="getUser">
                  <v-btn-toggle
                    mandatory
                    v-model="tradeToggle"
                    class="mb-5"
                    dense
                    dark
                  >
                    <v-btn
                      depressed
                      color="primary"
                      class="px-5"
                      :value="0"
                      :disabled="getUserMoney"
                      >Buy</v-btn
                    >
                    <v-btn
                      depressed
                      color="error"
                      class="px-5"
                      :value="1"
                      :disabled="!cryptoExists"
                      >Sell</v-btn
                    >
                  </v-btn-toggle>
                  <v-list-item-title class="mt-2 mb-4 font-weight-medium">
                    Price: {{ crypto.coinPrice }}$
                  </v-list-item-title>
                  <h3 class="red--text mb-1" v-if="isErrorMessage">
                    To proceed, please enter a value.
                  </h3>
                  <v-text-field
                    dense
                    v-model.number="tradeInput"
                    :label="tradeLabel"
                    outlined
                    prefix="$"
                    type="number"
                  ></v-text-field>
                  <h3>Total= {{ amount }} {{ crypto.coinName }}</h3>

                  <div>
                    <v-btn @click="changePercentage(0.25)">25%</v-btn>
                    <v-btn @click="changePercentage(0.5)">50%</v-btn>
                    <v-btn @click="changePercentage(0.75)">75%</v-btn>
                    <v-btn @click="changePercentage(1)">100%</v-btn>
                  </div>
                  <v-btn
                    block
                    :disabled="getUserMoney"
                    color="warning"
                    @click="proceed(crypto.coinName, crypto.coinPrice)"
                    >Proceed</v-btn
                  >
                </v-list-item-action-text>
                <div v-else>
                  <h5 class="mb-3 ml-2">
                    Welcome. Please login or sign up to begin trading.
                  </h5>
                  <v-btn @click="directUser('login')" class="mr-2">
                    Login
                  </v-btn>
                  <v-btn @click="directUser('signup')"> Sign Up </v-btn>
                </div>
              </v-list-item-content>
            </v-col>
          </v-list-item>

          <v-divider></v-divider>
        </v-card>
      </template>
    </v-dialog>
  </div>
</template>
<script>
import { eventBus } from "../main";
import { doc, updateDoc, getFirestore, onSnapshot } from "firebase/firestore";
const db = getFirestore();
export default {
  name: "BuyCrypto",
  data() {
    return {
      amount: 0,
      dialog: false,
      //I had to give this crypto object an initial random value to avoid null property error
      crypto: {
        coinName: "Not defined yet",
        coinImage: "Not defined yet",
      },
      tradeToggle: null,
      signedIn: false,
      tradeLabel: "Buy",
      tradeInput: 0,
      user: null,
      isErrorMessage: false,
    };
  },

  methods: {
    async sellUpdate(cryptoName, existingCryptoValue = 0) {
      // storing the new usd in new variable.
      let newUsd = this.getUser.usd + Number(this.tradeInput);
      const docRef = doc(db, "userInfo", this.getUser.uid);
      //Here we check whether the updated existingcryptovalue in the proceed function is greater than zero. If it is greater we update the value. Or else, we delete that coin from the user.cryptoAssets
      if (existingCryptoValue > 0) {
        updateDoc(docRef, {
          usd: newUsd,
          cryptoAssets: {
            ...this.getUser.cryptoAssets,
            [cryptoName]: existingCryptoValue,
          },
        });
      } else {
        let newAssets = { ...this.getUser.cryptoAssets };
        delete newAssets[cryptoName];
        updateDoc(docRef, {
          usd: newUsd,
          cryptoAssets: {
            ...newAssets,
          },
        });
      }
    },
    //This method updates user money and crypto coins in the following proceed method
    async buyUpdate(cryptoName, existingCryptoValue) {
      // storing the new usd and crpyto values in new variables
      let newUsd = this.getUser.usd - Number(this.tradeInput);
      let newCryptoAmount = Number(this.amount);
      const docRef = doc(db, "userInfo", this.getUser.uid);
      if (existingCryptoValue) {
        updateDoc(docRef, {
          usd: newUsd,
          cryptoAssets: {
            ...this.getUser.cryptoAssets,
            [cryptoName]: existingCryptoValue,
          },
        });
      } else {
        updateDoc(docRef, {
          usd: newUsd,
          cryptoAssets: {
            ...this.getUser.cryptoAssets,
            [cryptoName]: newCryptoAmount,
          },
        });
      }
    },
    //Main method which handles buy and sell transactions
    proceed(cryptoName) {
      if (this.tradeInput > 0) {
        //Checking if the user crypto assets include cryptoName parameter, in order to prevent duplicates.
        let theSameAsset = this.getUser.cryptoAssets[cryptoName];
        let theSameAssetValue = Number(theSameAsset);
        const amount = Number(this.amount);
        if (theSameAsset) {
          if (this.tradeLabel == "Buy") {
            let existingCryptoValue = theSameAssetValue + amount;

            this.buyUpdate(cryptoName, existingCryptoValue);
          } else if (this.tradeLabel == "Sell") {
            let existingCryptoValue = theSameAssetValue - amount;
            if (existingCryptoValue < 0) {
              existingCryptoValue = 0;
            }
            this.sellUpdate(cryptoName, existingCryptoValue);
          }
        } else {
          this.buyUpdate(cryptoName);
        }
        this.dialog = false;
        this.tradeToggle = 0;
        //Turning on the success alert in the home view
        this.$store.commit("isSuccessAlert", true);
        setTimeout(() => {
          this.$store.commit("isSuccessAlert", false);
        }, 2000);
      } else {
        this.isErrorMessage = true;
      }
    },
    changePercentage(percentage) {
      if (this.tradeLabel == "Buy") {
        this.tradeInput = parseInt(this.getUser.usd * percentage);
      } else if (this.tradeLabel == "Sell") {
        let chosenCoin = this.crypto.coinName;
        this.amount = this.getUser.cryptoAssets[chosenCoin] * percentage;
        this.tradeInput = (this.amount * this.crypto.coinPrice).toFixed(2);
      }
    },
    //If not signed in, we direct the user to the login or signup page
    directUser(direction) {
      this.dialog = false;

      if (direction == "login") {
        eventBus.$emit("loginTrue", true);
      } else if (direction == "signup") {
        this.$router.push({ name: "Signup" });
      }
    },
  },
  computed: {
    getUser() {
      return this.$store.state.user;
    },
    //This property disables proceed button if user doesnt have enough money.
    getUserMoney() {
      if (this.getUser.usd < 1 && this.tradeLabel == "Buy") {
        return true;
      }
    },
   
    cryptoExists() {
      return this.getUser.cryptoAssets[this.crypto.coinName];
    },
  },
  watch: {
    tradeToggle() {
      if (this.tradeToggle == 0) {
        this.tradeInput = null;
        this.tradeLabel = "Buy";
      } else {
        this.tradeInput = null;
        this.tradeLabel = "Sell";
      }
    },
    dialog() {
      if (this.dialog == false) {
        this.tradeInput = null;
        this.tradeToggle = 0;
        this.isErrorMessage = false;
      }
    },
    tradeInput() {
      this.amount = (this.tradeInput / this.crypto.coinPrice).toFixed(4);
      //Checking if user tries to complete a transaction, which exceeds his/her balance
      if (this.tradeLabel == "Buy" && this.tradeInput > this.getUser.usd) {
        this.tradeInput = this.getUser.usd;
      } else if (
        this.tradeLabel == "Sell" &&
        this.tradeInput >
          this.getUser.cryptoAssets[this.crypto.coinName] *
            this.crypto.coinPrice
      ) {
        this.tradeInput = (
          this.getUser.cryptoAssets[this.crypto.coinName] *
          this.crypto.coinPrice
        ).toFixed(2);
      }
      //Turns off the invalid input error message.
      if (this.tradeInput > 0) {
        this.isErrorMessage = false;
      }
    },
  },
  created() {
    //This data comes from the home component. This is the dynamic request made with axios to get crypto coin information.
    eventBus.$on("crypto", (crypto) => {
      this.crypto = crypto;
      this.dialog = true;
    });
  },
};
</script>
