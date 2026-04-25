import {FaDiscord} from 'react-icons/fa6'
export default function SignUpServer() {
    return (
        <div 
        className='flex w-full h-full items-center justify-center flex-col gap-2 text-muted-foreground select-none'>
            <p className='font-bold text-lg'>Para crear una cuenta, por favor requierela en el server de Discord.</p>
            <FaDiscord size={60} />
        </div>
    )
}