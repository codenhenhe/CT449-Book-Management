<template>
  <div id="app" class="d-flex flex-column min-vh-100">
    <AppHeader />

    <div class="d-flex flex-grow-1 overflow-hidden">
      <Toolbar />
      <main class="flex-grow-1 overflow-auto p-3">
        <router-view />
      </main>
    </div>

    <AppFooter />
  </div>
</template>

<script>
import AppHeader from "@/components/AppHeader.vue";
import AppFooter from "@/components/AppFooter.vue";
import Toolbar from "@/components/Toolbar.vue";

export default {
  components: {
    AppHeader,
    AppFooter,
    Toolbar,
  },
};
</script>
