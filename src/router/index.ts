import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import ChartsContainer from "@/components/ChartsContainer.vue";
import Home from "@/views/Home.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Select demo chart",
    component: Home
  },
  {
    path: "/single-chart",
    name: "Single",
    component: ChartsContainer
  },
  {
    path: "/multiple-charts",
    name: "Multiple",
    component: ChartsContainer
  }
];

const router = new VueRouter({
  routes
});

export default router;
