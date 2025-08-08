<template>
  <div id="app" class="d-flex flex-column min-vh-100">
    <AppHeader />

    <!-- Toolbar chuyển thành thanh ngang -->
    <Toolbar v-if="showToolbar" />

    <!-- Nội dung chính -->
    <main class="flex-grow-1 overflow-auto p-3">
      <router-view />
    </main>

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
  computed: {
    showToolbar() {
      const hiddenRoutesPatterns = [
        /^\/login$/,
        /^\/register$/,
        /^\/forgot-password$/,
        /^\/reset-password\/[^/]+$/,
      ];
      return !hiddenRoutesPatterns.some((pattern) =>
        pattern.test(this.$route.path)
      );
    },
  },
};
</script>
