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
    softDelete: (id: string) =>
      `${API_BASE_URL.productService}/soft-delete/${id}`,
  },
  orderService: {
    index: API_BASE_URL.orderService,
    detail: (id: string) => `${API_BASE_URL.orderService}/${id}`,
    orderProduct: (id: string) => `${API_BASE_URL.orderService}/${id}/details`,
    orderProductBatch: (id: string) =>
      `${API_BASE_URL.orderService}/${id}/details/batch`,
  },
  partnerService: {
    index: API_BASE_URL.partnerService,
    detail: (id: string) => `${API_BASE_URL.partnerService}/${id}`,
    projectIndex: (idPartner: string) =>
      `${API_BASE_URL.partnerService}/${idPartner}/projects`,
    projectDetail: (idPartner: string, idProject: string) =>
      `${API_BASE_URL.partnerService}/${idPartner}/projects/${idProject}`,
    projectSoftDelete: (idPartner: string, idProject: string) =>
      `${API_BASE_URL.partnerService}/${idPartner}/projects/soft-delete/${idProject}`,
    vehicleIndex: (idPartner: string) =>
      `${API_BASE_URL.partnerService}/${idPartner}/vehicles`,
    vehicleDetail: (idPartner: string, idProject: string) =>
      `${API_BASE_URL.partnerService}/${idPartner}/vehicles/${idProject}`,
    vehicleSoftDelete: (idPartner: string, idProject: string) =>
      `${API_BASE_URL.partnerService}/${idPartner}/vehicles/soft-delete/${idProject}`,
  },
};
