import { UserButton } from "@clerk/nextjs";
import { auth} from "@clerk/nextjs/server";
import Link from "next/link";
import Image from 'next/image'

export default async function Header() {

    const { userId } = auth();

    return (
        <div className="animate-fade-in fixed left-0 top-0 z-50 w-full  border-b  backdrop-blur-md [--animation-delay:600ms]">
            <div className="container mx-auto flex items-center justify-between py-4">
                <img src="/logo.png" alt="logo" className="w-48" />
                <Link href='/'>Home</Link>
                <div>
                    {userId ? (<div className="flex gap-4 items-center">
                        <Link href='/dashboard'>Dashboard</Link>
                        <UserButton 
                        afterSignOutUrl='/' />
                    </div>) : ( 
                    <div className="flex gap-4 items-center">
                    <Link href='/sign-up'>Sign Up</Link>
                    <Link href='/sign-in'>Sign In</Link>
                </div>)}
                </div>
            </div>
        </div>
    )
}