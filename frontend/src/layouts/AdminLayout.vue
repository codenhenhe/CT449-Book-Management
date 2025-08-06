<template>
  <main class="content-area">
    <router-view />
  </main>
</template>

<style scoped>
.content-area {
  margin-left: 220px; /* Phải khớp với Sidebar width */
  padding: 1rem;
  min-height: calc(100vh - 120px); /* Trừ header + footer */
  transition: margin-left 0.3s ease;
}
</style>
