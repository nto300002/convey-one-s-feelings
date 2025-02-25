'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { createClient } from '@/utils/supabase/client';
import { useAuth } from '@/context/AuthContext';

export function AddMemberForm() {
  const [memberId, setMemberId] = useState('');
  const [loading, setLoading] = useState(false);
  const { session } = useAuth();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session?.user) {
      toast({
        title: 'エラー',
        description: 'ログインが必要です',
        variant: 'destructive',
      });
      return;
    }

    if (!memberId) {
      toast({
        title: 'エラー',
        description: 'メンバーIDを入力してください',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      // 入力されたIDのユーザーが存在するか確認
      const { data: memberData, error: memberError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', memberId)
        .single();

      if (memberError || !memberData) {
        throw new Error('指定されたIDのユーザーが見つかりません');
      }

      // 自分自身を招待していないか確認
      if (memberId === session.user.id) {
        throw new Error('自分自身を招待することはできません');
      }

      // 既に招待済みか確認
      const { data: existingInvite, error: inviteCheckError } = await supabase
        .from('memberinvites')
        .select('id, status')
        .match({ inviter_id: session.user.id, invitee_id: memberId })
        .maybeSingle();

      if (existingInvite) {
        if (existingInvite.status === 'pending') {
          throw new Error('このユーザーには既に招待を送信済みです');
        } else if (existingInvite.status === 'accepted') {
          throw new Error('このユーザーは既にメンバーです');
        }
      }
      // inviteCheckError のチェックを追加
      if (inviteCheckError) {
        console.error('招待チェックエラー:', inviteCheckError);
        throw new Error('招待状態の確認中にエラーが発生しました');
      }

      // 招待を作成
      const { error: createError } = await supabase
        .from('memberinvites')
        .insert({
          inviter_id: session.user.id,
          invitee_id: memberId,
          status: 'pending',
        });

      if (createError) throw createError;

      toast({
        title: '招待を送信しました',
        description: 'メンバー招待が正常に送信されました',
      });

      // フォームをリセット
      setMemberId('');
    } catch (error) {
      console.error('招待エラーの詳細:', error);
      toast({
        title: 'エラー',
        description:
          error instanceof Error ? error.message : '招待の送信に失敗しました',
        variant: 'destructive',
      });
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('予期せぬエラーが発生しました');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
      <div className="space-y-2">
        <Label htmlFor="memberId">メンバーID</Label>
        <Input
          id="memberId"
          value={memberId}
          onChange={(e) => setMemberId(e.target.value)}
          placeholder="招待するメンバーのIDを入力"
          required
        />
        <p className="text-sm text-gray-500">
          招待したいユーザーのIDを入力してください
        </p>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? '処理中...' : '招待を送信'}
      </Button>
    </form>
  );
}
