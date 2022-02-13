<template>
  <v-container>
    <h1 class="grey--text text--lighten-2 mb-5 text-center">
      Real-time Public Chat
    </h1>
    <v-row class="justify-center">
      <v-col cols="lg-6" max-width="700px">
        <v-list
          height="500px"
          max-height="65%"
          dark
          class="overflow-scroll"
          rounded
          v-chat-scroll
        >
          <v-list-item v-for="chatDoc in chatArray" :key="chatDoc.uid">
            <v-col cols="lg-12 ">
              <h3 class="align-self-center yellow--text text--darken-2">
                {{ chatDoc.name }}
              </h3>

              <h4>{{ chatDoc.message }}</h4>
              <h5 class="grey--text text--lighten-1">{{ chatDoc.time }}</h5>
              <v-divider></v-divider>
            </v-col>
          </v-list-item>
        </v-list>
        <v-textarea
          dark
          filled
          name="input-7-4"
          label="Start Chatting"
          rows="3"
          placeholder="Type your message here"
          v-model="userMessage"
          @keypress.enter="sendMessage()"
        ></v-textarea>
        <v-btn class="yellow darken-3" block @click="sendMessage()"
          >Send Message</v-btn
        >
        <h4 class="red--text" v-if="isErrorMessage">
          Login or sign up to join the chat.
        </h4>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import moment from "moment";
import app from "../firebase/init";
import {
  doc,
  onSnapshot,
  getFirestore,
  arrayUnion,
  updateDoc,
} from "firebase/firestore";
const db = getFirestore();
const chatDoc = doc(db, "PublicChat", "publicChat");
export default {
  name: "Chat",
  data() {
    return {
      chatArray: [],
      userMessage: null,
      isErrorMessage: false,
    };
  },
  created() {
    onSnapshot(chatDoc, (doc) => {
      this.chatArray = doc.data().chatArray;
    });
  },
  methods: {
    sendMessage() {
      const user = this.$store.state.user;
      if (this.userMessage && user) {
        this.isErrorMessage = false;
        const newDate = new Date();
        updateDoc(chatDoc, {
          chatArray: arrayUnion({
            name: user.name,
            message: this.userMessage,
            time: moment(newDate).format("LLLL"),
            id: user.uid,
          }),
        });
        this.userMessage = null;
      } else {
        this.isErrorMessage = true;
      }
    },
  },
};
</script>
