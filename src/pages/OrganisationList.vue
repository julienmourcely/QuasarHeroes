<template>
  <q-page>
    <q-table
      :title="'Organisations'"
      :rows="orgs"
      :columns="columnsOrg"
      row-key="_id"
      dense
    >
      <template v-slot:top>
        <q-toolbar>
          <q-toolbar-title>Organisations</q-toolbar-title>
          <q-space></q-space>
          <q-btn
            color="primary"
            label="Add Organisation"
            @click="dialog = true"
          ></q-btn>
        </q-toolbar>
      </template>

      <template v-slot:body-cell-actions="{ row }">
        <q-td auto-width>
          <q-btn label="Connect" @click="goTo(row)"></q-btn>
        </q-td>
      </template>
    </q-table>

    <q-dialog v-model="dialog" persistent max-width="500px">
      <q-card>
        <q-card-section>
          <div class="text-h6">Add Organisation</div>
        </q-card-section>
        <q-card-section>
          <q-form>
            <q-input v-model="editedItem.name" label="Name"></q-input>
            <q-input v-model="editedItem.secret" label="Password" type="password"></q-input>
          </q-form>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" @click="close"></q-btn>
          <q-btn color="primary" label="Save" :disable="!(editedItem.name.trim() && editedItem.secret.trim())" @click="save"></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "OrganisationList",
  data: () => ({
    dialog: false,
    columnsOrg: [
      { name: "_id", label: "ID", field: "_id", required: true, align: "left"},
      { name: "name", label: "Name", field: "name", sortable: true, align: "left" },
      { name: "actions", label: "Actions", slot: "actions" },
    ],
    editedItem: {
      name: "",
      secret: "",
    },
    defaultItem: {
      name: "",
      secret: "",
    },
  }),
  computed: {
    orgs() {
      return this.$store.state.data.orgs;
    },
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
  },
  methods: {
    ...mapActions("data", ["getOrgsFromAPI", "createOrgFromAPI"]),
    goTo(item) {
      this.$router.push("/org/" + item._id);
    },
    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
      });
    },

    async save() {
      await this.createOrgFromAPI(this.editedItem);
      await this.getOrgsFromAPI();
      this.close();
    },
  },
  async mounted() {
    await this.getOrgsFromAPI();
  },
};
</script>

<style scoped>
</style>
