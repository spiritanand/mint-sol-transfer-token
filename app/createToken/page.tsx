import CreateMint from "@/app/createToken/CreateMint";
import CreateTokenAccount from "@/app/createToken/CreateTokenAccount";
import MintToken from "@/app/createToken/MintToken";

function Page() {
  return (
    <main className="container mx-auto flex flex-col gap-16">
      <CreateMint />
      <CreateTokenAccount />
      <MintToken />
    </main>
  );
}

export default Page;
