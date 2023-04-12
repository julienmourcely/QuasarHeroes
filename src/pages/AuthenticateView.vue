<template>
  <q-page>
    <q-card class="q-pa-md">
      <q-input v-model="password" type="password" label="Mot de passe"></q-input>

      <q-btn class="q-mt-md" @click="updatePassword(password)" label="Confirmer le mot de passe"></q-btn>

      <p>Mot de passe actuel : {{ currentPassword }}</p>
    </q-card>
  </q-page>
</template>

<script>
import { mapActions } from "vuex";

export default  {
  name: "AuthenticateView",
  data: () => ({
    password: "",
  }),
  computed: {
    currentPassword() {
      return this.$store.state.authenticate.currentPassword;
    },
  },
  methods: {
    ...mapActions("authenticate", ["updatePassword"]),
  },
};
</script>

<style scoped></style>
