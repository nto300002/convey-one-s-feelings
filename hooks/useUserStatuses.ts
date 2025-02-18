'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

export interface UserStatus {
  id: number;
  name: string;
  hiragana: string;
}

export function useUserStatuses() {
  const [statuses, setStatuses] = useState<UserStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('userstatus')
          .select('*')
          .order('id');

        if (error) throw error;
        setStatuses(data);
      } catch (e) {
        setError(
          e instanceof Error ? e.message : '予期せぬエラーが発生しました'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStatuses();
  }, []);

  return { statuses, loading, error };
}
