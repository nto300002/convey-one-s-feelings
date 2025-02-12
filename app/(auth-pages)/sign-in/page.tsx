import { SignInForm } from '@/components/auth/sign-in-form';
import { FormMessage, Message } from '@/components/form-message';

export default async function Login(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;
  return (
    <div className="space-y-6 mt-20 items-center">
      <SignInForm />
      <FormMessage message={searchParams} />
    </div>
  );
}
