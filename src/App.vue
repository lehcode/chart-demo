<template>
  <div id="app">
    <navigation />
    <router-view />
  </div>
</template>

<script lang="ts">
import Component from "@/lib/ClassComponentsHooks";
import { Vue } from "vue-property-decorator";
import Nav from "@/components/Nav.vue";

Vue.component("navigation", Nav);

@Component
export default class App extends Vue {
  name = "App";
};
</script>

<style lang="scss">
$bgColor: #e5e5e5;
$baseColor: #caced1;

html {
  font-size: 10px;

  > body {
    background: $bgColor;
    margin: 0;
  }
}

#app {
  background: $bgColor;
  color: $baseColor;
  font-family: Roboto, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100vh;
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
}
</style>
