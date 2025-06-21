import { EUserRole } from "@/app/(main)/user/api/getUsers";

export const roleHomePage: Record<EUserRole, string> = {
  [EUserRole.ROLE_ADMIN]: "/order",
  [EUserRole.ROLE_IMPORTER]: "/import",
  [EUserRole.ROLE_SALER]: "/order",
  [EUserRole.ROLE_ACCOUNTANT]: "/debt",
  [EUserRole.ROLE_USER]: "/not-found",
};
