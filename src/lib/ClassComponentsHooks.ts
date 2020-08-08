// @ts-check
/**
 * @author Anton Repin <lehcode@gmail.com>
 */
import { Component } from "vue-property-decorator";

Component.registerHooks([
  "beforeRouteEnter",
  "beforeRouteLeave",
  "beforeRouteUpdate"
]);

export default Component;
