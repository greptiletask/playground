import Image from "next/image";
import { APIPlayground } from "@/components/api-playground";
export default function Home() {
  return (
    <div className="flex h-screen bg-background">
      <APIPlayground />
    </div>
  );
}
