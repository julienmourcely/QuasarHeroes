<template>
  <div>
    <q-page v-if="this.$store.state.data.currentHero && !(this.$store.state.errors.isError)">
      <p>Id : {{this.$store.state.data.currentHero._id}}</p>
      <p>Public Name : {{this.$store.state.data.currentHero.publicName}}</p>
      <p>Real Name : {{this.$store.state.data.currentHero.realName}}</p>
      <q-btn color="primary" @click="editHero">
        Edit Names
      </q-btn>
      <q-dialog v-model="editNameDialog" persistent max-width="500px">
        <q-card>
          <q-card-section>
            <div class="text-h6">Edit Hero Name</div>
          </q-card-section>
          <q-card-section>
            <q-input label="Public Name" v-model="newPublicName"></q-input>
            <q-input label="Real Name" v-model="newRealName"></q-input>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="Cancel" @click="closeEditNameDialog"></q-btn>
            <q-btn
              color="primary"
              label="Save"
              :disable="!(newPublicName.trim() && newRealName.trim())"
              @click="saveHeroName"
            ></q-btn>
          </q-card-actions>
        </q-card>
      </q-dialog>

      <q-table
        :columns="headersPowers"
        :rows="this.$store.state.data.currentHero.powers"
        row-key="id"
        dense
      >
        <template v-slot:top>
          <q-toolbar>
            <q-toolbar-title>Powers</q-toolbar-title>
            <q-space></q-space>
            <q-btn color="primary" @click="powerDialog = true">
              Add Power
            </q-btn>
          </q-toolbar>
        </template>
        <template v-slot:body-cell-type="{ row }">
          <q-td>{{ getPowerType(row.type) }}</q-td>
        </template>
        <template v-slot:body-cell-actions="{ row }">
          <q-td auto-width>
            <q-btn icon="delete" @click="deletePower(row)"></q-btn>
          </q-td>
        </template>
      </q-table>

      <q-dialog v-model="powerDialog" persistent max-width="500px">
        <q-card>
          <q-card-section>
            <div class="text-h6">Add Power</div>
          </q-card-section>
          <q-card-section>
            <q-input
              label="Power Name"
              v-model="newPower.name"
            ></q-input>
            <q-select
              :options="powerTypes"
              label="Power Type"
              v-model="newPower.type"
            ></q-select>
            <q-input
              label="Power Level"
              type="number"
              min="0"
              max="100"
              v-model="newPower.level"
            ></q-input>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="Cancel" @click="closePowerDialog"></q-btn>
            <q-btn color="red" label="Test" @click="log"></q-btn>
            <q-btn
              color="primary"
              label="Validate"
              :disable="!(newPower.name.trim() && newPower.type!==null && newPower.level.trim() && newPower.level >= 0 && newPower.level <= 100)"
              @click="addPower"
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
            Verify you have the good id and a good password.
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="Ok" @click="redirectToHeroes()"></q-btn>
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-page>
  </div>
</template>
<script>
import { mapActions, mapMutations } from "vuex";
export default {
  name: "HeroDetail",
  data() {
    return {
      dialogVisible: false,
      headersPowers: [
        { name: "_id", label: "ID",align: "left", field: "_id" },
        { name: "name", label:"Name", align: "left", field: "name", sortable: true },
        { name: "type", label:"Type", align: "left", field: "type", sortable: true },
        { name: "level", label:"Level", align: "left", field: "level", sortable: true },
        { name: "actions", label:"Actions", align: "left", field: "actions", sortable: false },
      ],
      editNameDialog: false,
      newPublicName: "",
      newRealName: "",
      powerDialog: false,
      newPower: {
        name: "",
        type: null,
        level: "",
      },
      powerTypes: [
        { label: "Force", value: "force" },
        { label: "Vitesse", value: "vitesse" },
        { label: "Endurance", value: "endurance" },
        { label: "Magie", value: "magie" },
        { label: "Effrayant", value: "effrayant" },
        { label: "Furtivité", value: "furtivité" },
        { label: "Stupidité", value: "stupidité" },
      ],
    };
  },
  methods: {
    log() {
      console.log(this.newPower);
    },
    ...mapActions("data", [
      "getCurrentHeroFromAPI",
      "updateCurrentHeroToAPI",
    ]),
    ...mapMutations("data", ["setCurrentHero"]),
    ...mapMutations("errors", ["pushError", "popError"]),
    async editHero() {
      this.editNameDialog = true;
      this.newPublicName = this.$store.state.data.currentHero.publicName;
      this.newRealName = this.$store.state.data.currentHero.realName;
    },
    async redirectToHeroes() {
      this.popError();
      await this.$router.push("/heroes");
    },

    async saveHeroName() {
      const updatedHero = {
        ...this.$store.state.data.currentHero,
        publicName: this.newPublicName,
        realName: this.newRealName,
      };
      await this.updateCurrentHeroToAPI(updatedHero);
      await this.getCurrentHeroFromAPI(this.$route.params.id);
      this.editNameDialog = false;
    },
    closeEditNameDialog() {
      this.editNameDialog = false;
      this.newPublicName = "";
      this.newRealName = "";
    },
    async deletePower(power) {
      if (confirm("Are you sure you want to delete this power?")) {
        const updatedPowers = this.$store.state.data.currentHero.powers.filter(
          (p) => p !== power
        );
        const updatedHero = {
          ...this.$store.state.data.currentHero,
          powers: updatedPowers,
        };
        await this.updateCurrentHeroToAPI(updatedHero);
        await this.getCurrentHeroFromAPI(this.$route.params.id);
      }
    },
    getPowerType(type) {
      const powerTypes = [
        "force",
        "vitesse",
        "endurance",
        "magie",
        "effrayant",
        "furtivité",
        "stupidité",
      ];
      return powerTypes[type - 1];
    },

    closePowerDialog() {
      this.powerDialog = false;
      this.newPower = {
        name: "",
        type: null,
        level: "",
      };
    },

    powerTypeToNumber(typeName) {
      const typeMapping = {
        force: 1,
        vitesse: 2,
        endurance: 3,
        magie: 4,
        effrayant: 5,
        furtivité: 6,
        stupidité: 7,
      };
      return typeMapping[typeName];
    },

    async addPower() {
      const newPowerWithTypeNumber = {
        ...this.newPower,
        type: this.powerTypeToNumber(this.newPower.type.value),
      };
      const updatedPowers = [
        ...this.$store.state.data.currentHero.powers,
        newPowerWithTypeNumber,
      ];
      const updatedHero = {
        ...this.$store.state.data.currentHero,
        powers: updatedPowers,
      };
      await this.updateCurrentHeroToAPI(updatedHero);
      await this.getCurrentHeroFromAPI(this.$route.params.id);
      this.closePowerDialog();
    },},

  async mounted() {
    try {
      await this.getCurrentHeroFromAPI(this.$route.params.id);
    } catch (e) {
      this.dialogVisible = true;
      this.setCurrentHero(null);
      this.pushError(e);
    }
  },
};
</script>

<style scoped>
</style>
