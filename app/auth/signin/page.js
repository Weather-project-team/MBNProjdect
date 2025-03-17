import LoginForm from './form';
import Link from "next/link";

export default function LoginPage() {
    return (
        <div>
            <h1>Welcome to Next.js 15 with NextAuth.js v5</h1>
            <br/>
            <LoginForm/>

            <br/>
            <br/>
            <br/>

            <Link href="/auth/signup">회원가입은 여기를 클릭</Link>
        </div>
    );

}