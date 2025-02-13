'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';

export function AddMemberForm() {
  const [id, setId] = useState('');
  const [link, setLink] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ここでバックエンドAPIを呼び出す代わりに、モックの処理を行います
    console.log('送信されたデータ:', { id, link, phoneNumber });

    // 成功メッセージを表示
    toast({
      title: '承認申請が送信されました',
      description: 'メンバー追加の申請が正常に送信されました。',
    });

    // フォームをリセット
    setId('');
    setLink('');
    setPhoneNumber('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
      <div className="space-y-2">
        <Label htmlFor="id">ID</Label>
        <Input
          id="id"
          value={id}
          onChange={(e) => setId(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="link">リンク</Label>
        <Input
          id="link"
          type="url"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phoneNumber">電話番号</Label>
        <Input
          id="phoneNumber"
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />
      </div>
      <Button type="submit" className="w-full">
        承認申請を送信
      </Button>
    </form>
  );
}
