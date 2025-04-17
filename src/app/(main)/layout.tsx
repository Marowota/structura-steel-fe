import { Button } from "@/components/elements";
import Image from "next/image";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
        <Button variant={"navbar"} size="nav" className="">
          Lorem ipsum
        </Button>
        <Button variant={"navbarSelected"} size="nav" className="">
          Lorem ipsum
        </Button>
        <div className="mt-auto flex min-h-10 w-full items-center gap-4 border-t-[1px] border-gray-500 px-2 py-2">
          <div className="h-10 min-w-10 rounded-full bg-gray-500"></div>
          <div className="text-md-semibold flex w-full flex-col overflow-hidden">
            <div>Jonny Adnrew</div>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}
