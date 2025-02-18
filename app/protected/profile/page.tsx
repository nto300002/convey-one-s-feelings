'use client';

import { StatusUpdateForm } from '@/components/status-update-form';
import { Button } from '@/components/ui/button';
import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';

export default function ProfilePage() {
  const [email, setEmail] = useState<string>('');
  const [accountId, setAccountId] = useState<string>('');

  useEffect(() => {
    const fetchUserData = async () => {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        setEmail(session.user.email || '');
        setAccountId(session.user.id);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="container bg-white mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">アカウント</h1>

      <StatusUpdateForm />

      <div className="bg-white space-y-4">
        <Button
          variant="ghost"
          className="w-full justify-start text-left font-normal h-auto py-4"
        >
          マイチャット
        </Button>

        <Button
          variant="ghost"
          className="w-full justify-start text-left font-normal h-auto py-4"
        >
          設定
        </Button>

        <Button
          variant="ghost"
          className="w-full justify-start text-left font-normal h-auto py-4"
        >
          アカウント設定
        </Button>

        <div className="pt-4 border-t">
          <Button
            variant="ghost"
            className="w-full justify-start text-left font-normal h-auto py-4"
          >
            利用規約
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start text-left font-normal h-auto py-4"
          >
            ヘルプ
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start text-left font-normal h-auto py-4"
          >
            ご意見・ご要望
          </Button>
        </div>

        <div className="space-y-2 pt-4 border-t">
          <div className="flex justify-between items-center py-2">
            <span className="text-sm text-gray-500">
              ログインメールアドレス
            </span>
            <Button variant="outline" size="sm">
              コピー
            </Button>
          </div>
          <p className="text-sm text-gray-600">{email}</p>

          <div className="flex justify-between items-center py-2">
            <span className="text-sm text-gray-500">アカウントID</span>
            <Button variant="outline" size="sm">
              コピー
            </Button>
          </div>
          <p className="text-sm text-gray-600">{accountId}</p>

          <div className="flex justify-between items-center py-2">
            <span className="text-sm text-gray-500">バージョン</span>
          </div>
          <p className="text-sm text-gray-600">1.0.0</p>
        </div>
      </div>
    </div>
  );
}
