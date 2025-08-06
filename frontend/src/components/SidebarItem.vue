<template>
  <router-link
    :to="to"
    class="nav-link text-white d-flex align-items-center my-1"
    :class="collapsed ? 'justify-content-center' : 'ps-3'"
    :title="collapsed ? text : ''"
  >
    <i :class="['fas', icon]"></i>
    <template v-if="!collapsed">
      <span class="ml-2">{{ text }}</span>
    </template>
  </router-link>
</template>

<script setup>
defineProps({
  icon: String,
  text: String,
  to: String,
  collapsed: Boolean,
});
</script>

<style scoped>
.nav-link {
  height: 40px;
  padding: 8px 16px;
  transition: all 0.2s ease;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 5px;
}

.nav-link .fas {
  font-size: 18px;
}
</style>
