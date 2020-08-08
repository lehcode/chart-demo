<template>
  <div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link to="/single-chart">Single dynamic chart</router-link>
    <router-link to="/multiple-charts">Multiple dynamic charts</router-link>
  </div>
</template>

<script lang="ts">
import Component from "@/lib/ClassComponentsHooks";
import { Model, Prop, Vue } from "vue-property-decorator";

@Component
export default class Nav extends Vue {
  name = "nav";
}
</script>

<style scoped lang="scss">
#nav {
  padding: 3rem;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>