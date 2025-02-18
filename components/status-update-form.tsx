'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { UserCircle, ChevronDown, ChevronUp, Pencil } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { createClient } from '@/utils/supabase/client';
import { useUserStatuses } from '@/hooks/useUserStatuses';
import { toast } from '@/components/ui/use-toast';
import { VoiceInput } from '@/components/voice-input';

export function StatusUpdateForm() {
  const [status, setStatus] = useState('1');
  const { statuses, loading: statusesLoading } = useUserStatuses();
  const [feeling, setFeeling] = useState('今の気持ちは？');
  const [selectedStamp, setSelectedStamp] = useState('');
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        setUserId(session.user.id);

        // プロファイル情報を取得
        const { data: profile } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          setUsername(profile.username);
        }

        // プロファイルステータスを取得
        const { data: profileStatus } = await supabase
          .from('profilestatus')
          .select('status_id')
          .eq('profile_id', session.user.id)
          .single();

        if (profileStatus) {
          setStatus(profileStatus.status_id.toString());
        }

        // 最新の感情エントリーを取得
        const { data: latestEmotion } = await supabase
          .from('emotionentries')
          .select('stamp, description')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (latestEmotion) {
          setFeeling(latestEmotion.description || '今の気持ちは？');
          setSelectedStamp(latestEmotion.stamp || '');
        }
      }
    };

    fetchData();
  }, []);

  const handleUpdate = async () => {
    if (!userId) return;

    try {
      const supabase = createClient();

      // EmotionEntriesテーブルの更新
      if (selectedStamp || feeling) {
        // 最新のエントリーを取得
        const { data: existingEntry } = await supabase
          .from('emotionentries')
          .select('id')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (existingEntry) {
          // 既存のエントリーがある場合は更新
          const { error: emotionError } = await supabase
            .from('emotionentries')
            .update({
              stamp: selectedStamp,
              description: feeling,
              intensity: 1,
            })
            .eq('id', existingEntry.id);

          if (emotionError) throw emotionError;
        } else {
          // 新規エントリーの場合は挿入
          const { error: emotionError } = await supabase
            .from('emotionentries')
            .insert({
              user_id: userId,
              stamp: selectedStamp,
              description: feeling,
              intensity: 1,
            });

          if (emotionError) throw emotionError;
        }
      }

      // ProfileStatusテーブルの更新
      const { error: statusError } = await supabase
        .from('profilestatus')
        .upsert(
          {
            profile_id: userId,
            status_id: parseInt(status),
          },
          { onConflict: 'profile_id' }
        );

      if (statusError) throw statusError;

      setIsOpen(false);
      toast({
        title: '更新完了',
        description: 'ステータスと気持ちが更新されました',
      });
    } catch (error) {
      toast({
        title: 'エラー',
        description: 'データの更新に失敗しました',
        variant: 'destructive',
      });
      console.error('Update error:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-4">
      <div className="flex items-center space-x-4">
        <UserCircle className="h-12 w-12 text-gray-400" />
        <div className="space-y-1 flex-grow">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{selectedStamp}</span>
            <p className="font-medium">{username || 'Loading...'}</p>
          </div>
          <p className="text-sm text-gray-600">
            {statusesLoading
              ? 'ステータス読み込み中...'
              : statuses.find((s) => s.id.toString() === status)?.name}
          </p>
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="ml-auto flex items-center gap-2"
          >
            <Pencil className="h-4 w-4" />
            編集
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ステータスと気持ちを更新</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">ステータス</label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusesLoading ? (
                    <SelectItem value="loading">読み込み中...</SelectItem>
                  ) : (
                    statuses.map((status) => (
                      <SelectItem key={status.id} value={status.id.toString()}>
                        {status.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <VoiceInput
              onResult={(text) => setFeeling(text)}
              isListening={isListening}
              setIsListening={setIsListening}
            />

            <div className="space-y-2">
              <label className="text-sm font-medium">気持ち</label>
              <Textarea
                placeholder="今の気持ち"
                className="min-h-[100px]"
                value={feeling}
                onChange={(e) => setFeeling(e.target.value)}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                キャンセル
              </Button>
              <Button onClick={handleUpdate}>更新</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="mt-4 p-3 bg-gray-100 rounded-md">
        <h3 className="font-medium mb-2">今の気持ち</h3>
        {userId ? (
          <p className="text-gray-600">{feeling}</p>
        ) : (
          <p className="text-gray-600">ローディング中...</p>
        )}
      </div>
    </div>
  );
}
