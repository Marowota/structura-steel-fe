const API_DOMAIN = "http://localhost:8000";

const API_BASE_URL = {
  authService: API_DOMAIN + "/api/auth",
  productService: API_DOMAIN + "/api/v1/products",
  orderService: API_DOMAIN + "/api/v1/core/sale",
  importService: API_DOMAIN + "/api/v1/core/purchase",
  deliveryService: API_DOMAIN + "/api/v1/core/delivery",
  payService: API_DOMAIN + "/api/v1/core/payments",
  partnerService: API_DOMAIN + "/api/v1/partners",
  userService: API_DOMAIN + "/api/v1/core/users",
  reportService: API_DOMAIN + "/api/v1/core/reports",
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
    restore: (id: string) => `${API_BASE_URL.productService}/restore/${id}`,
  },
  orderService: {
    index: API_BASE_URL.orderService,
    detail: (id: string) => `${API_BASE_URL.orderService}/${id}`,
    cancel: (id: string) => `${API_BASE_URL.orderService}/${id}/cancel`,
    orderProduct: (id: string) => `${API_BASE_URL.orderService}/${id}/details`,
    orderProductBatch: (id: string) =>
      `${API_BASE_URL.orderService}/${id}/details/batch`,
    debt: (id: string) => `${API_BASE_URL.orderService}/${id}/debts`,
    debtDetail: (id: string, idDebt: string) =>
      `${API_BASE_URL.orderService}/${id}/debts/${idDebt}`,
    debtDetailBatch: (id: string) =>
      `${API_BASE_URL.orderService}/${id}/debts/batch`,
  },
  importService: {
    index: API_BASE_URL.importService,
    detail: (id: string) => `${API_BASE_URL.importService}/${id}`,
    cancel: (id: string) => `${API_BASE_URL.importService}/${id}/cancel`,
    importProduct: (id: string) =>
      `${API_BASE_URL.importService}/${id}/details`,
    importProductBatch: (id: string) =>
      `${API_BASE_URL.importService}/${id}/details/batch`,
    debt: (id: string) => `${API_BASE_URL.importService}/${id}/debts`,
    debtDetail: (id: string, idDebt: string) =>
      `${API_BASE_URL.importService}/${id}/debts/${idDebt}`,
    debtDetailBatch: (id: string) =>
      `${API_BASE_URL.importService}/${id}/debts/batch`,
  },
  deliveryService: {
    index: API_BASE_URL.deliveryService,
    detail: (id: string) => `${API_BASE_URL.deliveryService}/${id}`,
    cancel: (id: string) => `${API_BASE_URL.deliveryService}/${id}/cancel`,
    deliveryProduct: (id: string) =>
      `${API_BASE_URL.deliveryService}/${id}/details`,
    deliveryProductBatch: (id: string) =>
      `${API_BASE_URL.deliveryService}/${id}/details/batch`,
    debt: (id: string) => `${API_BASE_URL.deliveryService}/${id}/debts`,
    debtDetail: (id: string, idDebt: string) =>
      `${API_BASE_URL.deliveryService}/${id}/debts/${idDebt}`,
    debtDetailBatch: (id: string) =>
      `${API_BASE_URL.deliveryService}/${id}/debts/batch`,
  },
  payService: {
    index: API_BASE_URL.payService,
  },
  reportService: {
    receivables: API_BASE_URL.reportService + "/receivables",
    payables: API_BASE_URL.reportService + "/payables",
    profitLoss: API_BASE_URL.reportService + "/profit-loss",
    daily: API_BASE_URL.reportService + "/daily-activity",
  },
  partnerService: {
    index: API_BASE_URL.partnerService,
    detail: (id: string) => `${API_BASE_URL.partnerService}/${id}`,
    partnerSoftDelete: (id: string) =>
      `${API_BASE_URL.partnerService}/soft-delete/${id}`,
    partnerRestore: (id: string) =>
      `${API_BASE_URL.partnerService}/restore/${id}`,
    projectIndex: (idPartner: string) =>
      `${API_BASE_URL.partnerService}/${idPartner}/projects`,
    projectDetail: (idPartner: string, idProject: string) =>
      `${API_BASE_URL.partnerService}/${idPartner}/projects/${idProject}`,
    projectSoftDelete: (idPartner: string, idProject: string) =>
      `${API_BASE_URL.partnerService}/${idPartner}/projects/soft-delete/${idProject}`,
    projectRestore: (idPartner: string, idProject: string) =>
      `${API_BASE_URL.partnerService}/${idPartner}/projects/restore/${idProject}`,
    vehicleIndex: (idPartner: string) =>
      `${API_BASE_URL.partnerService}/${idPartner}/vehicles`,
    vehicleDetail: (idPartner: string, idProject: string) =>
      `${API_BASE_URL.partnerService}/${idPartner}/vehicles/${idProject}`,
    vehicleSoftDelete: (idPartner: string, idProject: string) =>
      `${API_BASE_URL.partnerService}/${idPartner}/vehicles/soft-delete/${idProject}`,
    vehicleRestore: (idPartner: string, idProject: string) =>
      `${API_BASE_URL.partnerService}/${idPartner}/vehicles/restore/${idProject}`,
    warehouseIndex: (idPartner: string) =>
      `${API_BASE_URL.partnerService}/${idPartner}/warehouses`,
    warehouseDetail: (idPartner: string, idProject: string) =>
      `${API_BASE_URL.partnerService}/${idPartner}/warehouses/${idProject}`,
    warehouseSoftDelete: (idPartner: string, idProject: string) =>
      `${API_BASE_URL.partnerService}/${idPartner}/warehouses/soft-delete/${idProject}`,
    warehouseRestore: (idPartner: string, idProject: string) =>
      `${API_BASE_URL.partnerService}/${idPartner}/warehouses/restore/${idProject}`,
  },
  userService: {
    index: API_BASE_URL.userService,
    detail: (id: string) => `${API_BASE_URL.userService}/${id}`,
    signUp: API_BASE_URL.userService + "/sign-up",
    softDelete: (id: string) => `${API_BASE_URL.userService}/soft-delete/${id}`,
    changePasswordFirstTime:
      API_BASE_URL.userService + "/first-time-password-change",
  },
};
