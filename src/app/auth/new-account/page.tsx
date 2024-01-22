import { titleFont } from '@/config/fonts';
import { RegisterForm } from './ui/RegisterForm';
import Link from 'next/link';

export default function NewAccount() {
  return (
    <div className="flex flex-col min-h-screen pt-32 sm:pt-52">

      <h1 className={`${titleFont.className} text-4xl mb-5`}>Nueva Cuenta</h1>

      <RegisterForm />
    </div>
  );
}

