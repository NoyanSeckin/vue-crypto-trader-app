<template>
  <v-container>
    <v-row v-if="getUser" class="mx-auto d-block">
      <v-col lg="9" class="mx-auto">
        <h1 class="white--text">My Wallet</h1>
        <h5 class="white--text">Total cash: {{ getUser.usd.toFixed(2) }}$</h5>
      </v-col>
      <PieChart :chartArray="calculateShare" />
      <v-col v-if="getUser.cryptoAssets" class="mx-auto" lg="9">
        <v-simple-table dark>
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">Name</th>
                <th class="text-center">Value</th>
                <th class="text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(amount, name) in getUser.cryptoAssets" :key="amount">
                <td class="text-left">{{ name }}</td>
                <td class="text-center">
                  {{ (getPrices[name] * amount).toFixed(2) }}$
                </td>
                <td class="text-right">{{ amount.toFixed(4) }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
    </v-row>
    <h3 class="red--text mt-5" v-else>
      * Login or sign up to access your wallet!
    </h3>
  </v-container>
</template>

<script>
const calc = null;
import PieChart from "./PieChart.vue";
export default {
  name: "UserWallet",
  components: { PieChart },
  data() {
    return {};
  },
  methods: {},
  computed: {
    getUser() {
      return this.$store.state.user;
    },
    getPrices() {
      return this.$store.state.prices;
    },
    //Her bir pay nasil hesaplanir?
    calculateShare() {
      const currentBalance = this.$store.state.sum;
      const chartArray = [];
      const cryptoAssets = this.getUser.cryptoAssets;
      const pricesObject = this.getPrices;
      let coinTotalShare = 0;
      for (const coin in cryptoAssets) {
        let coinAmount = cryptoAssets[coin];
        let coinPrice = pricesObject[coin];
        let share = ((coinPrice * coinAmount) / currentBalance) * 100;
        //coinTotalShare holds the total share of all cryptoAssets, therefore, when we substract it from 100, we will ultimately find the remaining share of dollars in
        coinTotalShare += share;
        //push the name of the coin and the share of it
        chartArray.push({
          name: coin,
          share: share,
        });
      }
      //Finally, adding the share of dollars in cash, to find it, subtracting coinTotalShare from 100 because that is the remaining dollars in cash.
      chartArray.push({
        name: "Total Cash",
        share: 100 - coinTotalShare,
      });
      return chartArray;
    },
  },
};
</script>
