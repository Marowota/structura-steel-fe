"use client";
import { ReactNode, useContext } from "react";
import { Button } from "@/components/elements";
import Image from "next/image";
import { UserContext } from "./AuthorizedLayout";
import { Barcode, CreditCard, Handshake, ReceiptText } from "lucide-react";
import { redirect, usePathname } from "next/navigation";

export function MainLayout({ children }: { children: ReactNode }) {
  const userInfo = useContext(UserContext);
  const pathname = usePathname();
  console.log("pathname", pathname);

  const Tabs = [
    {
      name: "Order",
      icon: <ReceiptText />,
      route: "/order",
    },
    { name: "Purchase", icon: <CreditCard />, route: "/purchase" },
    { name: "Partner", icon: <Handshake />, route: "/partner" },
    { name: "Product", icon: <Barcode />, route: "/product" },
  ];

  return (
    <div className="bg-white-200 flex h-screen w-full">
      <div className="group flex w-20 flex-col items-center overflow-hidden bg-white px-3 py-2 text-nowrap shadow-xl transition-all duration-300 select-none hover:w-72">
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
          <Button
            key={tab.name}
            variant={"navbar"}
            size="nav"
            className={`flex gap-2 ${pathname === tab.route ? "text-brand-600 bg-info-50 hover:bg-brand-50 active:bg-info-50" : "text-gray-900"}`}
            onClick={() => {
              redirect(tab.route);
            }}
          >
            <div className="flex h-6 w-6">{tab.icon}</div>
            <div className="w-0 overflow-hidden text-left text-inherit opacity-0 group-hover:w-full group-hover:opacity-100">
              {tab.name}
            </div>
          </Button>
        ))}
        <div className="mt-auto flex min-h-10 w-full items-center gap-4 border-t-[1px] border-gray-500 px-2 py-2">
          <div className="h-10 min-w-10 rounded-full bg-gray-500"></div>
          <div className="text-md-semibold flex w-full flex-col overflow-hidden">
            <div>{userInfo?.name}</div>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}
