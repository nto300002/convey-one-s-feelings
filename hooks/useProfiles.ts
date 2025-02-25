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
        const {
          data: { session },
        } = await supabase.auth.getSession();
        const currentUserId = session?.user?.id;

        if (!currentUserId) {
          throw new Error('ユーザーが認証されていません');
        }

        // UserMembersテーブルを介して承認済みメンバーのプロフィールを取得
        const { data, error } = await supabase
          .from('usermembers')
          .select(
            `
              user_id,
              member_id,
              created_at,
              member_profile: profiles (
                id,
                username,
                created_at,
                updated_at,
                profilestatus (
                  profile_id,
                  status_id,
                  userstatus(
                    name,
                    hiragana
                  )
                )
              )
            `
          )
          .eq('user_id', currentUserId);

        if (error) throw error;

        const usersWithStatus: User[] = data.map((row: any) => {
          return {
            id: row.member_id,
            profile: {
              id: row.member_profile.id,
              username: row.member_profile.username,
              created_at: row.member_profile.created_at,
              updated_at: row.member_profile.updated_at,
            },
            status:
              row.member_profile.profilestatus?.userstatus?.name || '対応可能',
          };
        });
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
