"use client";
import { Button } from "@/components/elements";
import { Modal } from "@/components/elements/modal";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function ProductDetailPage() {
  const params = useParams();
  const { id } = params as { id: string };

  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      {id}
      <Button onClick={() => setIsOpen(true)} />
      <Modal isOpen={isOpen} setIsOpen={setIsOpen}></Modal>
    </div>
  );
}
