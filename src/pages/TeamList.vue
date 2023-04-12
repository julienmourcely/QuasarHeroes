<template>
  <div>
    <q-page>
      <q-table
        :columns="headersTeam"
        :rows="this.$store.state.data.teams"
        row-key="id"
        dense
      >
        <template v-slot:top>
          <q-toolbar>
            <q-toolbar-title>Teams</q-toolbar-title>
            <q-space></q-space>
            <q-btn
              color="primary"
              label="Add Team"
              @click="addTeamDialog = true"
            ></q-btn>
          </q-toolbar>
        </template>
        <template v-slot:body-cell-actions="{ row }">
          <q-td auto-width>
            <q-btn label="Select" @click="goTo(row)"></q-btn>
          </q-td>
        </template>
      </q-table>
      <q-dialog v-model="addTeamDialog" persistent max-width="500px">
        <q-card>
          <q-card-section>
            <div class="text-h6">Add Team</div>
          </q-card-section>
          <q-card-section>
            <q-input label="Team name" v-model="newTeamName"></q-input>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="Cancel" @click="closeAddTeamDialog"></q-btn>
            <q-btn
              color="primary"
              label="Add"
              :disable="!newTeamName.trim()"
              @click="createTeam"
            ></q-btn>
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-page>
  </div>
</template>
<script>
import { mapActions } from "vuex";

export default {
  name: "TeamList",
  data: () => ({
    addTeamDialog: false,
    newTeamName: "",
    headersTeam: [
      { name: "_id", label: "ID", field: "_id", required: true, align: "left" },
      { name: "name", label: "Name", field: "name", sortable: true, align: "left" },
      { name: "nbAffiliations", label: "Affiliations", field: "nbAffiliations", sortable: true, align: "left" },
      { name: "actions", label: "Actions", align: "left", slot: "actions" },
    ],
  }),
  methods: {
    ...mapActions("data", ["getTeamsFromAPI", "createTeamFromAPI"]),
    goTo(item) {
      this.$router.push("/team/" + item._id);
    },
    closeAddTeamDialog() {
      this.addTeamDialog = false;
      this.newTeamName = "";
    },
    async createTeam() {
      await this.createTeamFromAPI({ name: this.newTeamName });
      this.closeAddTeamDialog();
      await this.getTeamsFromAPI();
    },
  },
  async mounted() {
    await this.getTeamsFromAPI();
  },
};
</script>
<style scoped>
</style>
