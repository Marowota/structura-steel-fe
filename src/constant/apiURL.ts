const API_DOMAIN = "http://localhost:8000";

const API_BASE_URL = {
  authService: API_DOMAIN + "/api/auth",
  productService: API_DOMAIN + "/api/v1/products",
  orderService: API_DOMAIN + "/api/v1/core/sale",
};

export const API_URL = {
  AuthService: {
    login: API_BASE_URL.authService + "/structura/signin",
    loginAdmin: API_BASE_URL.authService + "/master/signin",
  },
  productService: {
    index: API_BASE_URL.productService,
    detail: (id: string) => `${API_BASE_URL.productService}/${id}`,
  },
  orderService: {
    index: API_BASE_URL.orderService,
    detail: (id: string) => `${API_BASE_URL.orderService}/${id}`,
  },
};
