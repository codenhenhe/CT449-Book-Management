<template>
  <div class="login-container d-flex align-items-center min-vh-100">
    <div class="login-content">
      <div class="row g-0 login-card">
        <!-- Cột trái: Ảnh -->
        <div class="col-md-6 p-0 d-none d-md-block image-side">
          <img
            src="@/assets/login-books.jpg"
            alt="Library Image"
            class="img-fluid h-100 w-100"
          />
        </div>

        <!-- Cột phải: Form đăng nhập -->
        <div class="col-md-6 form-side p-5 shadow-lg rounded-end bg-white">
          <h2 class="text-center mb-4 text-primary">Đăng nhập hệ thống</h2>
          <p class="text-center mb-4 text-muted">
            Vui lòng nhập thông tin để tiếp tục
          </p>
          <LoginForm />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import LoginForm from "@/components/LoginForm.vue";
</script>

<style scoped>
.login-container {
  flex-grow: 1;
  background-color: #f0f2f5;
}

.login-content {
  width: 100%;
  padding: 0 2rem;
}

.login-card {
  max-width: 1000px;
  margin: 0 auto;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.image-side {
  background-color: #343a40;
}

.image-side img {
  object-fit: cover;
  filter: brightness(0.8); /* Làm tối ảnh nhẹ để chữ nổi hơn nếu cần */
}

.form-side {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.form-side h2 {
  font-size: 2rem;
  font-weight: 700;
}

.form-side p {
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .login-content {
    padding: 0 1rem;
  }
  .image-side {
    display: none;
  }
  .form-side {
    padding: 2rem;
    width: 100%;
  }
  .login-card {
    max-width: 100%;
  }
  .form-side h2 {
    font-size: 1.5rem;
  }
  .form-side p {
    font-size: 1rem;
  }
}
</style>
