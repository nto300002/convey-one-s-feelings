import { SignUpForm } from '@/components/auth/sign-up-form';
import { FormMessage, Message } from '@/components/form-message';
import { cookies } from 'next/headers';

export default async function Signup() {
  // リクエストのクッキーを取得
  const cookieStore = await cookies();
  const flashCookie = cookieStore.get('flashMessage');
  let flashMessage: Message | null = null;

  if (flashCookie) {
    try {
      flashMessage = JSON.parse(flashCookie.value);
    } catch (e) {
      // JSON パースに失敗した場合は無視
    }
    // フラッシュメッセージは一度表示したらクリアすることが一般的です。
    // 次のレスポンスで同じ cookie を空にするようセットするか、サーバーサイドのミドルウェアでクリアしてください。
  }

  return (
    <div className="space-y-6 mt-20 items-center">
      <SignUpForm />
      {flashMessage && <FormMessage message={flashMessage} />}
    </div>
  );
}
