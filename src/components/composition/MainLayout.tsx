"use client";
import { ReactNode, useContext } from "react";
import { Button } from "@/components/elements";
import Image from "next/image";
import { UserContext } from "./AuthorizedLayout";
import {
  ArchiveRestore,
  Barcode,
  CreditCard,
  Handshake,
  LogOut,
  ReceiptText,
  User,
} from "lucide-react";
import { redirect, usePathname } from "next/navigation";
import { EToastType, toastNotification } from "@/lib/toastNotification";
import { nameToTwoText } from "@/mapper/nameToTwoText";
import { authSlice } from "@/lib";
import { useDispatch } from "react-redux";
import Link from "next/link";
import { useGetUserDetail } from "@/app/(main)/user/api/getUsersDetail";
import { EUserRole } from "@/app/(main)/user/api/getUsers";
import { ProtectedFeature } from "./ProtectedFeature";

export function MainLayout({ children }: { children: ReactNode }) {
  const userInfo = useContext(UserContext);
  const userDetail = useGetUserDetail({
    params: { username: userInfo?.preferred_username },
  });
  const displayName =
    (userDetail?.data?.firstName ?? "") +
    " " +
    (userDetail?.data?.lastName ?? "");
  const pathname = usePathname();
  const dispatch = useDispatch();

  const Tabs = [
    {
      name: "Order",
      icon: <ReceiptText />,
      route: "/order",
      header: "Order",
    },
    {
      name: "Import",
      icon: <CreditCard />,
      route: "/import",
      header: "Import",
    },
    {
      name: "Partner",
      icon: <Handshake />,
      route: "/partner",
      header: "Partner",
    },
    {
      name: "Product",
      icon: <Barcode />,
      route: "/product",
      header: "Product",
    },
    {
      name: "User",
      icon: <User />,
      route: "/user",
      header: "User",
      protected: [EUserRole.ROLE_ADMIN],
    },
    {
      name: "Restore",
      icon: <ArchiveRestore />,
      route: "/restore",
      header: "Restore",
    },
  ];

  const selectedTab = Tabs.find((tab) => tab.route === pathname);

  const handleLogout = () => {
    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("expires_in");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("refresh_expires_in");
    dispatch(authSlice.actions.logout());
    toastNotification("Logged out successfully", EToastType.SUCCESS);
    redirect("/login");
  };

  return (
    <div className="bg-white-200 flex h-screen w-screen">
      <div className="group flex w-20 min-w-20 flex-col items-center overflow-hidden bg-white px-3 py-2 text-nowrap shadow-xl transition-all duration-300 select-none hover:w-64 hover:min-w-64">
        <div className="flex min-h-28 w-full items-center justify-center">
          <Image
            src="/structura-steel-icon.png"
            alt="icon"
            width={200}
            height={200}
            className="w-20 transition-all duration-300 group-hover:w-40"
            draggable={false}
          />
        </div>
        {Tabs.map((tab) => (
          <ProtectedFeature key={tab.name} acceptedRoles={tab.protected}>
            <Button
              variant={"navbar"}
              size="nav"
              className={`flex gap-2 ${pathname.match(tab.route) ? "text-brand-600 bg-info-50 hover:bg-brand-50 active:bg-info-50" : "text-gray-900"}`}
              asChild
            >
              <Link href={tab.route}>
                <div className="flex h-6 w-6">{tab.icon}</div>
                <div className="w-0 overflow-hidden text-left text-inherit opacity-0 group-hover:w-full group-hover:opacity-100">
                  {tab.name}
                </div>
              </Link>
            </Button>
          </ProtectedFeature>
        ))}
        <div className="mt-auto flex min-h-10 w-full items-center gap-4 border-t-[1px] border-gray-500 px-2 py-2">
          <div className="flex h-10 min-w-10 items-center justify-center rounded-full bg-gray-500 text-white">
            {nameToTwoText(displayName)}
          </div>
          <div className="text-md-semibold flex w-full flex-col truncate">
            <div className="truncate">{displayName}</div>
          </div>
          <div
            className="ml-auto rounded-md p-2 hover:cursor-pointer hover:bg-gray-200 active:bg-gray-300"
            onClick={() => handleLogout()}
          >
            <LogOut />
          </div>
        </div>
      </div>
      <div className="mx-6 flex h-full flex-1 flex-col gap-1 overflow-x-auto bg-white p-6 shadow-md">
        <div className="text-headline-sm-semibold text-brand-800">
          {selectedTab?.header}
        </div>
        <div className="border-info-300 border" />
        <div className="min-h-0 w-full flex-1">{children}</div>
      </div>
    </div>
  );
}
