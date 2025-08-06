<template>
  <router-link
    :to="to"
    class="nav-link text-white d-flex align-items-center px-3 py-2"
    :class="[active ? 'active-item' : '']"
    :title="text"
  >
    <i :class="['fas', icon]"></i>
    <span class="ml-2">{{ text }}</span>
  </router-link>
</template>

<script setup>
defineProps({
  icon: String,
  text: String,
  to: String,
  active: Boolean,
});
</script>

<style scoped>
.nav-link {
  transition: all 0.2s ease;
  border-radius: 5px;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.1);
}

/* Mục đang active */
.active-item {
  background: rgba(255, 255, 255, 0.2);
  font-weight: bold;
}
</style>
