<template>
  <div>
    <h1 class="my-3 text-center grey--text text--lighten-1">
      Real-time Crypto Trading
    </h1>
    <!-- <v-col class="d-flex justify-center mx-auto" lg="12">
      <v-card v-for="crypto in mainList" :key="crypto.id" outlined class="mx-2">
        <v-list-item three-line>
          <v-list-item-avatar class="d-flex flex-column" tile size="30">
            <img :src="crypto.image" alt="" />
          </v-list-item-avatar>
          <v-list-item-content>
            <div class="text-overline">{{ crypto.symbol }}</div>
            <v-list-item-title class="text-h5 mb-1">
              {{ crypto.name }}:
              <span>${{ crypto.current_price }} </span>
            </v-list-item-title>
            <v-list-item-subtitle></v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-card>
    </v-col> -->
    <!-- Main table with dynamic socket data -->

    <v-col lg="9" class="mx-auto">
      <v-card dark>
        <v-card-title>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search for coins"
            single-line
            hide-details
          ></v-text-field>
        </v-card-title>
        <!-- @click:row="handleRowClick" -->
        <!-- vue-tour is included in the data table -->
        <v-data-table
          class="hover-effect"
          :headers="headers"
          :items="dataObject"
          :search="search"
        >
          <!-- Bu sekilde goruntu olarak sorun yok ama handlerowclick calismiyor  -->
          <template v-slot:item="{ item }">
            <tr
              @click="emitEvent(item.coinName, item.coinPrice, item.coinImage)"
              data-v-step="1"
            >
              <td class="d-flex align-center">
                <img
                  :src="item.coinImage"
                  style="width: 30px; height: 30px"
                  class="mr-3"
                />
                {{ item.coinName }}
              </td>
              <td class="text-center">
                {{
                  item.coinPrice == "Updating"
                    ? item.coinPrice
                    : `$${item.coinPrice} `
                }}
              </td>
              <td class="text-end">
                {{ item.priceChange24h }}
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-card>
    </v-col>
    <BuyCrypto />
    {{ getUserCoinTotal }}
    <v-alert
      origin="center"
      dismissible
      type="success"
      max-width="50%"
      class="mx-auto absolute-position"
      :value="getIsSuccessAlert"
      transition="fade-transition"
    >
      Success! Transaction is complete.
    </v-alert>
  </div>
</template>

<script>
import BuyCrypto from "../components/BuyCrypto.vue";
import axios from "axios";
import { eventBus } from "../main";
const coingeckoURL =
  "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false";
let sockettest = new WebSocket("wss://stream.binance.com:9443/ws/!ticker@arr");

export default {
  name: "Home",
  components: { BuyCrypto },
  data() {
    return {
      isSuccessAlert: false,
      coingeckoData: [],
      binanceData: [],
      vuexObj: {},
      postList: [],
      mainList: [],
      search: "",
      cryptoObj: {
        name: null,
        image: null,
        currentPrice: null,
        change24hr: null,
      },
      headers: [
        {
          text: "Crypto name",
          align: "start",
          filterable: true,
          value: "coinName",
        },
        {
          text: "Current price",
          value: "coinPrice",
          align: "center",
        },
        {
          text: "Price Change in 24h",
          value: "priceChange24h",
          align: "end",
        },
      ],
    };
  },
  methods: {
    emitEvent(coinName, coinPrice, coinImage) {
      if (coinPrice != "Updating") {
        const crypto = { coinName, coinPrice, coinImage };
        eventBus.$emit("crypto", crypto);
        eventBus.$emit("dialogActive", true);
        this.$store.commit("getClickedCrypto", crypto);
      }
    },
    // handleRowClick(crypto) {
    //   console.log(crypto);
    //   if (crypto.coinPrice != "Updating") {
    //     eventBus.$emit("crypto", crypto);
    //     eventBus.$emit("dialogActive", true);
    //     this.$store.commit("getClickedCrypto", crypto);
    //   }
    // },
  },
  created() {
    axios.get(coingeckoURL).then((response) => {
      this.coingeckoData = response.data;
      // console.log(response.data);

      this.mainList = response.data.filter((val) => {
        return (
          val.id === "bitcoin" || val.id === "ethereum" || val.id === "ripple"
        );
      });
    });
    sockettest.onmessage = (event) => {
      let socket = JSON.parse(event.data);
      this.binanceData = socket;
      //Setting the three main crypto values. Aka Bitcoin, Ethereum and Xrp
    };
  },

  computed: {
    dataObject() {
      // The array, which will be returned to the data table.
      let holderArray = [];
      //These are unavailable coins
      let unavailableCoins = [
        "hbtc",
        "omi",
        "ohm",
        "kda",
        "kcs",
        "ht",
        "usdt",
        "cro",
        "wbtc",
        "dai",
        "okb",
        "steth",
        "mim",
        "ceth",
        "leo",
        "cdai",
        "miota",
        "cusdc",
        "osmo",
        "xrd",
        "frax",
        "bsmv",
        "time",
        "tfuel",
        "ar",
      ];
      //Posts are the static data from coingecko
      let posts = this.coingeckoData.filter(
        (coinData) => !unavailableCoins.includes(coinData.symbol)
      );
      //This method transforms the holderarray into an array of objects, which consist of coinName and coinPrice
      posts?.forEach((coinData) => {
        let priceChange24h = coinData.price_change_percentage_24h;
        let coinName = coinData.name;
        let coinSymbol = coinData?.symbol;
        let coinImage = coinData.image;
        let searchName = coinSymbol.toUpperCase() + "USDT";
        // console.log(searchName);
        // console.log(coinData.id);
        let coinArray = this.binanceData?.filter((coin) => {
          return coin?.s.includes(searchName);
        });
        let coinPrice = coinArray[0]?.c
          ? parseFloat(coinArray[0]?.c)
          : "Updating";
        holderArray.push({ coinName, coinPrice, priceChange24h, coinImage });
      });
      return holderArray;
    },
    getUserCoinTotal() {
      //Getting the crypto assets of the user from store.
      let cryptoAssets = this.$store.state.user?.cryptoAssets;
      let balance = null;
      let coinsAndPrices = {};
      //Then looping through this assets object to get existing coin's prices from coingecko data.
      for (const property in cryptoAssets) {
        this.coingeckoData.forEach((coinData) => {
          if (coinData.name == property) {
            // console.log(
            //   `Price: ${coinData.current_price} Amount: ${cryptoAssets[property]}`
            // );
            let coinToUsd = coinData.current_price * cryptoAssets[property];
            // console.log(coinToUsd);
            balance += coinToUsd;
            // getting prices
            coinsAndPrices[property] = coinData.current_price;
          }
        });
      }
      //finally we add the usd of user and commit the data to the store
      balance += this.$store.state.user?.usd;
      this.$store.commit("getBalance", balance);
      // console.log(coinsAndPrices);
      this.$store.commit("getPrices", coinsAndPrices);
    },
    getUser() {
      return this.$store.state.user;
    },
    getIsSuccessAlert() {
      return this.$store.state.isSuccessAlert;
    },
  },
};
</script>
<style scoped>
.hover-effect:hover {
  cursor: pointer;
}
.absolute-position {
  position: absolute;
  top: 1%;
  right: 0%;
}
</style>
