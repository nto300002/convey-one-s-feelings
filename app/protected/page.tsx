import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default async function ProtectedPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/sign-in');
  }

  // プロフィール情報を取得
  const { data: profile } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', user.id)
    .single();

  return (
    <div className="flex-1 w-full flex flex-col items-center p-4 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold">ようこそ {profile?.username}さん</h1>
        <h2 className="text-xl">convey-one&apos;s-feelingsへ</h2>
        <Image
          src="/cosf_logo_trans.png"
          alt="Logo"
          width={400}
          height={200}
          priority
        />
      </div>

      <div className="grid grid-cols-2 gap-4 max-w-2xl w-full">
        <Link
          href="/protected/dashboard"
          className="p-6 border rounded-lg hover:bg-gray-50 transition-colors"
        >
          <h3 className="text-lg font-medium mb-2">トップページ</h3>
          <span className="text-2xl">→</span>
        </Link>

        <Link
          href="/protected/profile"
          className="p-6 border rounded-lg hover:bg-gray-50 transition-colors"
        >
          <h3 className="text-lg font-medium mb-2">プロフィール</h3>
          <span className="text-2xl">→</span>
        </Link>

        <Link
          href="/protected/add-member"
          className="p-6 border rounded-lg hover:bg-gray-50 transition-colors"
        >
          <h3 className="text-lg font-medium mb-2">メンバー追加</h3>
          <span className="text-2xl">→</span>
        </Link>

        <Link
          href="/protected/members"
          className="p-6 border rounded-lg hover:bg-gray-50 transition-colors"
        >
          <h3 className="text-lg font-medium mb-2">メンバー一覧</h3>
          <span className="text-2xl">→</span>
        </Link>
      </div>
    </div>
  );
}
