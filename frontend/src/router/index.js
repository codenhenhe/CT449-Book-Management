import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth.js";

// ===== Helper Functions =====
const requireAuth = (role) => ({ requiresAuth: true, role });

// ===== Routes =====
const routes = [
  {
    path: "/",
    name: "home",
    beforeEnter: (to, from, next) => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) return next({ name: "login" });

      const roleRoutes = {
        quantrivien: "quantrivien.profile",
        nhanvien: "nhanvien.profile",
        docgia: "docgia.profile",
      };

      const target = roleRoutes[user.vaiTro] || "login";
      return next({ name: target });
    },
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/LoginPage.vue"),
  },
  {
    path: "/register",
    name: "register",
    component: () => import("@/views/reader/ReaderRegisterPage.vue"),
  },

  // ===== Admin Layout & Pages =====
  {
    path: "/admin",
    meta: requireAuth("quantrivien"),
    children: [
      {
        path: "",
        name: "quantrivien",
        component: () => import("@/layouts/AdminLayout.vue"),
      },
      {
        path: "profile",
        name: "quantrivien.profile",
        component: () => import("@/views/admin/AdminProfile.vue"),
      },
      {
        path: "profile/edit",
        name: "quantrivien.edit",
        component: () => import("@/views/admin/AdminEditProfile.vue"),
      },
      {
        path: "users",
        name: "quantrivien.users",
        component: () => import("@/components/UserManagement.vue"),
        meta: requireAuth("quantrivien"),
      },
      {
        path: "users/add",
        name: "quantrivien.users.add",
        component: () => import("@/components/UserForm.vue"),
        meta: requireAuth("quantrivien"),
      },
      {
        path: "users/edit/:id",
        name: "quantrivien.users.edit",
        component: () => import("@/components/UserForm.vue"),
        meta: requireAuth("quantrivien"),
      },
    ],
  },

  // ===== Staff Layout & Pages =====
  {
    path: "/staff",
    meta: requireAuth("nhanvien"),
    children: [
      {
        path: "",
        name: "nhanvien",
        component: () => import("@/layouts/StaffLayout.vue"),
      },
      {
        path: "profile",
        name: "nhanvien.profile",
        component: () => import("@/views/staff/StaffProfile.vue"),
      },
      {
        path: "profile/edit",
        name: "nhanvien.edit",
        component: () => import("@/views/staff/StaffEditProfile.vue"),
      },
    ],
  },

  // ===== Reader Pages =====
  {
    path: "/reader",
    meta: requireAuth("docgia"),
    children: [
      {
        path: "profile",
        name: "docgia.profile",
        component: () => import("@/views/reader/ReaderProfile.vue"),
      },
      {
        path: "profile/edit",
        name: "docgia.edit",
        component: () => import("@/views/reader/ReaderEditProfile.vue"),
      },
    ],
  },

  // ===== Books =====
  {
    path: "/books",
    children: [
      {
        path: "",
        name: "books",
        component: () => import("@/views/BookList.vue"),
      },
      {
        path: "add",
        name: "books.add",
        component: () => import("@/views/AddBook.vue"),
        meta: requireAuth(["quantrivien", "nhanvien"]),
      },
      {
        path: "edit/:id",
        name: "books.edit",
        component: () => import("@/views/EditBook.vue"),
        props: true,
        meta: requireAuth(["quantrivien", "nhanvien"]),
      },
    ],
  },

  // ===== Categories =====
  {
    path: "/categories",
    children: [
      {
        path: "",
        name: "categories",
        component: () => import("@/views/categories/CategoryList.vue"),
        meta: requireAuth(["quantrivien", "nhanvien"]),
      },
    ],
  },

  {
    path: "/authors",
    children: [
      {
        path: "",
        name: "authors",
        component: () => import("@/views/author/AuthorList.vue"),
        meta: requireAuth(["quantrivien", "nhanvien"]),
      },
    ],
  },

  {
    path: "/publishers",
    children: [
      {
        path: "",
        name: "publishers",
        component: () => import("@/views/PublisherList.vue"),
        meta: requireAuth(["quantrivien", "nhanvien"]),
      },
    ],
  },

  {
    path: "/borrows",
    children: [
      {
        path: "",
        name: "borrows",
        component: () => import("@/views/reader/BorrowHistory.vue"),
        meta: requireAuth(["docgia"]),
      },
      {
        path: "manager",
        name: "borrows.manager",
        component: () => import("@/views/staff/BorrowManager.vue"),
        meta: requireAuth(["nhanvien"]),
      },
    ],
  },

  {
    path: "/change-password",
    name: "change-password",
    component: () => import("@/views/ChangePassword.vue"),
    meta: requireAuth(["docgia", "nhanvien", "quantrivien"]),
  },

  {
    path: "/reset-password/:token",
    name: "reset-password",
    component: () => import("@/views/ResetPassword.vue"),
  },
  {
    path: "/forgot-password",
    name: "forgot-password",
    component: () => import("@/views/ForgotPassword.vue"),
  },

  // ===== Not Found =====
  {
    path: "/:pathMatch(.*)*",
    name: "notfound",
    component: () => import("@/views/NotFound.vue"),
  },
];

// ===== Router Init =====
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// ===== Global Guard =====
router.beforeEach((to, from, next) => {
  const auth = useAuthStore();

  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    return next({ name: "login" });
  }

  if (to.meta.role) {
    const allowedRoles = Array.isArray(to.meta.role)
      ? to.meta.role
      : [to.meta.role];

    if (!allowedRoles.includes(auth.user?.vaiTro)) {
      return next({ name: auth.profileLink });
    }
  }

  next();
});

export default router;
