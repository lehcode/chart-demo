<template>
  <div class="home">
    <Greeting msg="Charts demo" />
  </div>
</template>

<script>
// @ is an alias to /src
import Greeting from "@/components/Greeting";
import Navigation from "@/components/Nav";

export default {
  name: "Home",
  components: {
    Navigation,
    Greeting
  }
};
</script>
