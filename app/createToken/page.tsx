import CreateMint from "@/app/createToken/CreateMint";
import CreateTokenAccount from "@/app/createToken/CreateTokenAccount";

function Page() {
  return (
    <main className="container mx-auto flex flex-col gap-16">
      <CreateMint />
      <CreateTokenAccount />
    </main>
  );
}

export default Page;
