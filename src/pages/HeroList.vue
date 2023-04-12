<template>
  <q-page>
    <q-table
      :columns="columns"
      :rows="this.$store.state.data.heroes"
      row-key="id"
      dense
    >
      <template v-slot:top>
        <q-toolbar>
          <q-toolbar-title>Heroes</q-toolbar-title>
          <q-space></q-space>
          <q-btn color="primary" label="Add Hero" @click="dialog = true"></q-btn>
        </q-toolbar>
      </template>

      <template v-slot:body-cell-actions="{ row }">
        <q-td auto-width>
          <q-btn label="Details" @click="goTo(row)"></q-btn>
        </q-td>
      </template>

    </q-table>

    <q-dialog v-model="dialog">
      <q-card>
        <q-card-section>
          <div class="text-h6">Add Hero</div>
        </q-card-section>

        <q-card-section>
          <q-input v-model="editedItem.publicName" label="Public Name" />
          <q-input v-model="editedItem.realName" label="Real Name" />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" @click="close"></q-btn>
          <q-btn :disable="!(editedItem.publicName.trim() && editedItem.realName.trim())" label="Save" @click="save"></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "HeroList",
  data: () => ({
    dialog: false,
    columns: [
      { name: "_id", label: "ID", field: "_id", required: true, align: "left"},
      { name: "publicName", label: "Name", field: "publicName", sortable: true, align: "left" },
      { name: "actions", label: "Actions", slot: "actions" },
    ],
    editedItem: {
      publicName: '',
      realName: ''
    },
    defaultItem: {
      publicName: '',
      realName: ''
    }
  }),
  watch: {
    dialog (val) {
      val || this.close()
    },
  },
  methods: {
    ...mapActions('data', ['getHeroesFromAPI', 'createHeroFromAPI']),
    goTo(item) {
      this.$router.push("/hero/" + item.id);
    },
    close () {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
      })
    },
    async save () {
      await this.createHeroFromAPI(this.editedItem)
      await this.getHeroesFromAPI()
      this.close()
    }
  },
  async mounted() {
    await this.getHeroesFromAPI();
  }
}
</script>

<style scoped>

</style>
