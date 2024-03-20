import { DisplayBalance } from "@/components/DisplayBalance";
import SendTnx from "@/components/SendTnx";

export default function Home() {
  return (
    <main className="">
      <DisplayBalance />
      <SendTnx />
    </main>
  );
}
