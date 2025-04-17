import { Button } from "@/components/elements";
import Image from "next/image";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-white-200 flex h-screen w-full">
      <div className="group flex w-20 flex-col items-center bg-white px-3 py-2 shadow-xl transition-all duration-300 hover:w-72">
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
      </div>
      {children}
    </div>
  );
}
