import { FaDiscord } from 'react-icons/fa6'
export default function SignUpServer() {
    return (
        <div
            className='flex w-full h-full items-center justify-center flex-col gap-2 text-muted-foreground select-none'>
            <p className='font-bold text-lg'>Please request an account in Discord Server</p>
            <FaDiscord size={60} />
            <div>
                <a href="/login" className='text-blue-500 hover:underline'>
                    Login
                </a>
            </div>
        </div>
    )
}