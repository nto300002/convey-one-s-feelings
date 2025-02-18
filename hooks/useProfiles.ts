'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { User } from '@/types/database.types';

export function useProfiles() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const supabase = createClient();

        // 現在のログインユーザーを取得
        const {
          data: { session },
        } = await supabase.auth.getSession();
        const currentUserId = session?.user?.id;

        const { data, error } = await supabase.from('profiles').select(`
            id,
            username,
            created_at,
            updated_at
          `);

        if (error) throw error;

        // 現在のユーザーを除外してマッピング
        const usersWithStatus = data
          .filter((profile) => profile.id !== currentUserId)
          .map((profile, index) => ({
            id: profile.id,
            profile: profile,
            status: ['たて込み中', '仕事中', '対応可能'][index % 3],
          }));

        setUsers(usersWithStatus);
      } catch (e) {
        setError(
          e instanceof Error ? e.message : '予期せぬエラーが発生しました'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  return { users, loading, error };
}
