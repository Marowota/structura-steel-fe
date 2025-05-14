import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

export const useLinkParams = <T extends object>(paramsDefault: T) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const params: T = {
    ...paramsDefault,
    ...Object.fromEntries(searchParams.entries()),
  };

  const setNewParams = (newParams: T) => {
    const stringParams = Object.entries(newParams)
      .filter(([key, value]) => paramsDefault[key as keyof T] !== value)
      .map(([key, value]) => "" + key + "=" + value)
      .join("&");
    router.push(pathname + "?" + stringParams);
  };

  return { params, setNewParams };
};
