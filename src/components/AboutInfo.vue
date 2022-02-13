<template>
  <v-container dark class="about">
    <h1 class="white--text text-center">What is CryptoTrader?</h1>
    <v-row class="justify-space-around px-md-10 mx-md-10 mt-6">
      <v-col cols="lg-6 xl-5">
        <v-img
          src="https://toshitimes.com/wp-content/uploads/2020/01/UnicoinCryptocurrency1569309883726jpg.jpg"
        ></v-img>
      </v-col>
      <v-col cols="lg-6 xl-5" class="d-flex justify-end align-self-center">
        <v-row align="center">
          <v-item-group v-model="displayedWindow" class="shrink mr-6" mandatory>
            <v-item
              v-for="n in windowLength"
              :key="n"
              v-slot="{ active, toggle }"
            >
              <div>
                <v-btn dark :input-value="active" icon @click="toggle">
                  <v-icon>mdi-record</v-icon>
                </v-btn>
              </div>
            </v-item>
          </v-item-group>

          <v-col>
            <v-window
              dark
              v-model="displayedWindow"
              class="elevation-1"
              vertical
            >
              <v-window-item
                v-for="message in windowObject"
                :key="message.title"
              >
                <v-card flat>
                  <v-card-text>
                    <v-row class="mb-4" align="center">
                      <v-avatar color="grey" class="mr-4">
                        <v-icon> {{ message.icon }} </v-icon>
                      </v-avatar>
                      <strong class="text-h6"> {{ message.title }}</strong>
                      <v-spacer></v-spacer>
                    </v-row>

                    <p>{{ message.text }}</p>
                  </v-card-text>
                </v-card>
              </v-window-item>
            </v-window>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row class="justify-center mt-5">
      <v-col cols="auto"> </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  name: "AboutInfo",
  data: () => ({
    windowLength: 3,
    displayedWindow: 0,
    windowObject: {
      message1: {
        title: "Overview",
        text: " CryptoTrader is a web app, which enables you to buy and sell a selection of crypto currencies. These transactions do not involve real money of course. Each user is given 1000$ and users are expected to have fun and gain experience in crypto trading, so that they can do better in real life.",
        icon: "mdi-magnify",
      },
      message2: {
        title: "Origins",
        text: "It all started with an idea. I have seen inexperienced people jumping right into the crypto market, with the hopes of making money as soon as possible, but only to lose their savings in the end. With this app, one can learn a thing or two before starting to swim with the sharks in the vast oceans.",
        icon: "mdi-origin",
      },
      message3: {
        title: "Instructions",
        text: "In the home page, you can do your transactions. Click on a crypto coin listed in the data table, determine the amount of the transaction and then click to the proceed button. Switch the trade toggle according to your wish. However, the sell option will only be available if you have some amount of that target coin. In the wallet page, you can access to your detailed assets. Make sure to sign up, have fun!",
        icon: "mdi-information-outline",
      },
    },
  }),
};
</script>
