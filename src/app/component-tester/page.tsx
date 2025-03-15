"use client";
import { useRef, useState } from "react";
import ColorTester from "./tester/color-tester";
import FontTester from "./tester/font-tester";
import { Button } from "@/components/Elements";

export default function ComponentTesterBase() {
  const [tester, setTester] = useState(<></>);
  const testerList = useRef([ColorTester, FontTester]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="flex w-3/4 flex-col items-center rounded-md bg-white p-4 pt-0 shadow-md">
        <div className="sticky top-0 flex w-full flex-col items-center border-b bg-white pt-4">
          <div>
            Tester:{" "}
            {testerList.current.map((tester) => {
              return (
                <Button
                  className="ml-2"
                  onClick={() => {
                    setTester(tester);
                  }}
                  key={tester.name}
                >
                  {tester.name}
                </Button>
              );
            })}
          </div>
          <div className="text-2xl font-bold">Your component here</div>
        </div>
        <div className="min-h-96 w-full border border-t-0">{tester}</div>
      </div>
    </div>
  );
}
