const API_DOMAIN = "http://localhost:8000";

const API_BASE_URL = {
  authService: API_DOMAIN + "/api/auth",
  productService: API_DOMAIN + "/api/v1/products",
  orderService: API_DOMAIN + "/api/v1/core/sale",
  partnerService: API_DOMAIN + "/api/v1/partners",
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
    orderDetail: (id: string) => `${API_BASE_URL.orderService}/${id}/details`,
    orderDetailBatch: (id: string) =>
      `${API_BASE_URL.orderService}/${id}/details/batch`,
  },
  partnerService: {
    index: API_BASE_URL.partnerService,
    detail: (id: string) => `${API_BASE_URL.partnerService}/${id}`,
    projectIndex: (idPartner: string) =>
      `${API_BASE_URL.partnerService}/${idPartner}/projects`,
  },
};
