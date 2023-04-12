<template>
  <q-page v-if="this.$store.state.data.currentTeam !== null && !(this.$store.state.errors.isError)">
    <div>
      <p>Id : {{this.$store.state.data.currentTeam._id}}</p>
      <p>Name : {{this.$store.state.data.currentTeam.name}}</p>
      <p>Members : </p>
      <q-table
        :columns="headersMembers"
        :rows="heroes"
        row-key="id"
        dense
      >
        <template v-slot:top>
          <q-toolbar>
            <q-toolbar-title>Members</q-toolbar-title>
            <q-space></q-space>
            <q-btn
              color="primary"
              label="Add Member"
              @click="addMemberDialog = true"
            ></q-btn>
          </q-toolbar>
        </template>
        <template v-slot:body-cell-actions="{ row }">
          <q-td auto-width>
            <q-btn label="Details" @click="goTo(row)"></q-btn>
            <q-btn icon="delete" flat @click="deleteItem(row)"></q-btn>
          </q-td>
        </template>
      </q-table>
    </div>
    <q-dialog v-model="addMemberDialog" persistent max-width="500px">
      <q-card>
        <q-card-section>
          <div class="text-h6">Add Member</div>
        </q-card-section>
        <q-card-section>
          <q-select
            :options="availableHeroes"
            option-label="publicName"
            option-value="_id"
            label="Select a hero"
            v-model="selectedHero"
          ></q-select>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" @click="closeAddMemberDialog"></q-btn>
          <q-btn
            color="primary"
            label="Validate"
            :disable="selectedHero === null"
            @click="addMember"
          ></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
  <q-page v-else>
    <q-dialog v-model="dialogVisible" persistent>
      <q-card>
        <q-card-section>
          <div class="text-h6">Nothing to show</div>
        </q-card-section>
        <q-card-section>
          Verify you have the good id and password, and that you are connected to an Organisation.
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Ok" @click="redirectToTeams()"></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>
<script>
import { mapActions, mapMutations } from "vuex";

export default {
  name: "TeamDetail",
  data: () => ({
    dialogVisible: false,
    headersMembers: [
      { name: "_id", label: "ID", field: "_id", required: true, align: "left" },
      { name: "publicName", label: "Public Name", field: "publicName", sortable: true, align: "left" },
      { name: "realName", label: "Real Name", field: "realName", sortable: true, align: "left" },
      { name: "nbPowers", label: "Powers", field: row => row.powers.length, sortable: true, align: "left" },
      { name: "actions", label: "Actions", field: "actions", align: "left" },
    ],
    heroes: [],
    addMemberDialog: false,
    selectedHero: null,
    availableHeroes: [],
  }),
  methods: {
    ...mapActions('data',[
      'getCurrentTeamFromAPI',
      'getHeroesFromAPI',
      'getCurrentHeroFromAPI',
      'removeHeroesFromCurrentTeamToAPI',
      'addHeroesToCurrentTeamToAPI',
    ]),
    ...mapMutations('data', ['setCurrentTeam']),
    ...mapMutations('errors', ['pushError','popError']),
    async goTo(item) {
      await this.$router.push("/hero/" + item._id);
    },

    async redirectToTeams() {
      await this.popError()
      await this.$router.push("/teams");
    },

    async deleteItem(item) {
      if (confirm("Are you sure you want to delete this member?")) {
        await this.removeHeroesFromCurrentTeamToAPI({ idHeroes: [item._id], idTeam: this.$store.state.data.currentTeam._id });
        await this.getCurrentTeamFromAPI(this.$route.params.id);
        await this.getHeroesInfos(this.$store.state.data.currentTeam)
        await this.getAvailableHeroes();
      }
    },
    async getHeroesInfos(team) {
      this.heroes = [];
      if (team === null) {
        return
      }
      if (team.members === undefined) return;
      for (let m of team.members) {
        await this.getCurrentHeroFromAPI(m);
        let hero = this.$store.state.data.currentHero;
        this.heroes.push(hero);
      }
    },
    closeAddMemberDialog() {
      this.selectedHero = null;
      this.addMemberDialog = false;

    },
    async addMember() {
      if (this.selectedHero) {
        await this.addHeroesToCurrentTeamToAPI({ idHeroes: [this.selectedHero], idTeam: this.$store.state.data.currentTeam._id });
        await this.getCurrentTeamFromAPI(this.$route.params.id);
        await this.getHeroesInfos(this.$store.state.data.currentTeam);
        await this.getAvailableHeroes();
        this.selectedHero = null;
      }
      this.closeAddMemberDialog();
    },
    async getAvailableHeroes() {
      await this.getHeroesFromAPI();
      const allHeroes = this.$store.state.data.heroes;
      this.availableHeroes = allHeroes.filter(
        (hero) =>
          !this.heroes.some((member) => {
            return member._id === hero._id})
      );
    },
  },
  async mounted() {
    try {
      await this.getCurrentTeamFromAPI(this.$route.params.id);
      await this.getHeroesInfos(this.$store.state.data.currentTeam);
      await this.getAvailableHeroes();
    } catch (e) {
      this.dialogVisible = true;
      this.setCurrentTeam(null)
      this.pushError(e);
    }
  },
}
</script>

<style scoped>

</style>
