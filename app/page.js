import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center">
      <h1 className="text-4xl font-bold">Hello, world!</h1>
      <Link href="/games">게임 페이지</Link>
      <br />
      <Link href="/boss">보스 페이지</Link> 
    </div>
  );
}
