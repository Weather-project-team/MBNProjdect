import Link from "next/link";

export default function Home() {
  return (
<<<<<<< HEAD
    <div className="grid grid-rows-[20px_1fr_20px] items-center">
      <h1 className="text-4xl font-bold">Hello, world!</h1>
      <Link href="/games">게임 페이지</Link>
      <br />
      <Link href="/boss">보스 페이지</Link> 
=======
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-4xl font-bold">Hello, world!</h1>

      <Link href="/games">게임 페이지</Link>

      <Link href="/login">로긘</Link>
>>>>>>> main
    </div>
  );
}
