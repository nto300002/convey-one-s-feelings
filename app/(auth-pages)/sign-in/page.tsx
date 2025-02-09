import { SignInForm } from '@/components/auth/sign-in-form';
import { FormMessage, Message } from '@/components/form-message';

export default async function Login(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;
  return (
    <div>
      <SignInForm />
      <FormMessage message={searchParams} />
    </div>
  );
}
