<template>
  <div id="app">
    <q-layout view="hHh Lpr lFf">
      <q-header elevated>
        <q-toolbar>
          <q-btn flat dense round @click="drawer = !drawer" icon="menu" />
          <q-toolbar-title>
            Organisations App
          </q-toolbar-title>
          <q-btn color="red" @click="goToAuthenticate()">
            Authenticate
          </q-btn>
        </q-toolbar>
      </q-header>
      <q-drawer v-model="drawer" show-if-above>
        <q-list>
          <q-item v-for="(link, index) in titles" :key="index" clickable @click="navigateTo(link.path)">
            <q-item-section>
              <q-item-label>
                <slot name="link-to" :link="link">{{ link.text }}</slot>
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-drawer>
      <q-page-container>
        <router-view></router-view>
      </q-page-container>
    </q-layout>
  </div>
</template>

<script>
export default {
  name: 'App',
  props: {
    titles: Array,
  },
  data() {
    return {
      drawer: false,
    };
  },
  methods: {
    goToAuthenticate() {
      this.$router.push('/authenticate');
      this.drawer = false;
    },
    navigateTo(path) {
      const resolvedPath = typeof path === 'function' ? path() : path;
      this.$router.push(resolvedPath);
    },
  },
};
</script>

<style scoped>
</style>





