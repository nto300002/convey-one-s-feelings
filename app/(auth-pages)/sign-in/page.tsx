import { SignInForm } from '@/components/auth/sign-in-form';
import { FormMessage, Message } from '@/components/form-message';

export default async function Login(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-[600px] mx-auto px-4">
        <SignInForm />
        <FormMessage message={searchParams} />
      </div>
    </main>
  );
}
