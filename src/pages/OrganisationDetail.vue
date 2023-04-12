<template>
  <q-page>
    <div v-if="!(this.$store.state.errors.isError) && this.$store.state.data.currentOrg!==null">
      <p>Id : {{this.$store.state.data.currentOrg._id}}</p>
      <p>Name : {{this.$store.state.data.currentOrg.name}}</p>
      <p> Password : {{this.$store.state.data.currentOrg.secret}}</p>
      <q-table
        :columns="headersTeams"
        :rows="this.$store.state.data.currentOrg.teams"
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
              @click="teamDialog = true"
            ></q-btn>
          </q-toolbar>
        </template>
        <template v-slot:body-cell-actions="{ row }">
          <q-td auto-width>
            <q-btn label="Select" @click="goToTeam(row)"></q-btn>
            <q-btn icon="delete" @click="deleteTeam(row)"></q-btn>
          </q-td>
        </template>
      </q-table>
    </div>
    <q-dialog v-model="teamDialog" persistent max-width="500px">
      <q-card>
        <q-card-section>
          <div class="text-h6">Add Team</div>
        </q-card-section>
        <q-card-section>
          <q-select
            :options="availableTeams"
            option-label="name"
            option-value="_id"
            label="Select a team"
            v-model="selectedTeam"
          ></q-select>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" @click="closeTeamDialog"></q-btn>
          <q-btn
            color="primary"
            label="Validate"
            :disable="selectedTeam === ''"
            @click="addTeam"
          ></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="dialogVisible" persistent max-width="500px">
      <q-card>
        <q-card-section>
          <div class="text-h6">Nothing to show</div>
        </q-card-section>
        <q-card-section>
          Verify you have the good id and password.
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Ok" @click="redirectToOrgs()"></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { mapActions, mapMutations } from "vuex";

export default {
  name: "OrganisationDetail",
  data: () => ({
    dialogVisible: false,
    teamDialog: false,
    availableTeams: [],
    selectedTeam: "",
    headersTeams: [
      { name: "_id", label: "ID", field: "_id", required: true, align: "left" },
      { name: "name", label: "Name", field: "name", sortable: true, align: "left" },
      { name: "nbMembers", label: "Members", field: row => row.members.length, sortable: true, align: "left" },
      { name: "actions", label: "Actions", align: "left", slot: "actions" },
    ],
  }),
  methods: {
    ...mapActions("data", ["getCurrentOrgFromAPI", "removeTeamFromCurrentOrgToAPI", "addTeamToCurrentOrgToAPI", "getTeamsFromAPI"]),
    ...mapMutations("data", ["setCurrentOrg"]),
    ...mapMutations("errors", ["pushError", "popError"]),
    goToTeam(item) {
      this.$router.push("/team/" + item._id);
    },
    async redirectToOrgs() {
      this.popError();
      await this.$router.push("/orgs");
    },
    async deleteTeam(item) {
      if (confirm("Are you sure you want to delete this team ?")) {
        await this.removeTeamFromCurrentOrgToAPI({ idTeam: item._id });
        await this.getCurrentOrgFromAPI(this.$route.params.id);
        await this.loadAvailableTeams();
      }
    },
    async loadAvailableTeams() {
      await this.getTeamsFromAPI();
      if (this.$store.state.data.currentOrg !== null) {
        this.availableTeams = this.$store.state.data.teams.filter(team => {
          return !this.$store.state.data.currentOrg.teams.some(teamOrg => teamOrg._id === team._id);
        });
      }
    },
    async addTeam() {
      await this.addTeamToCurrentOrgToAPI({ idTeam: this.selectedTeam });
      await this.getCurrentOrgFromAPI(this.$route.params.id);
      await this.loadAvailableTeams();
      this.closeTeamDialog();
    },
    closeTeamDialog() {
      this.teamDialog = false;
      this.selectedTeam = "";
    },
  },
  async mounted() {
    try {
      await this.getCurrentOrgFromAPI(this.$route.params.id);
      await this.loadAvailableTeams();
    } catch (e) {
      this.dialogVisible = true;
      this.setCurrentOrg(null);
      this.pushError(e);
    }
  },
};
</script>

<style scoped>
</style>
