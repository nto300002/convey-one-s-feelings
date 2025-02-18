'use client';

import { UserCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useProfiles } from '@/hooks/useProfiles';
import { Skeleton } from '@/components/ui/skeleton';

export default function ChatList() {
  const router = useRouter();
  const { users, loading, error } = useProfiles();

  const handleUserClick = (userId: string, status: string) => {
    if (status === '対応可能') {
      router.push(`/chat/${userId}`);
    }
  };

  if (loading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow"
          >
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">エラーが発生しました: {error}</div>;
  }

  return (
    <div className="space-y-2">
      {users.map((user) => (
        <TooltipProvider key={user.id}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className={`flex items-center space-x-4 bg-white p-4 rounded-lg shadow 
                  ${user.status === '対応可能' ? 'hover:bg-gray-50 cursor-pointer' : 'opacity-75'}`}
                onClick={() => handleUserClick(user.id, user.status || '')}
              >
                <UserCircle className="h-10 w-10 text-gray-400" />
                <div>
                  <p className="font-medium">{user.profile.username}</p>
                  <p className="text-sm text-gray-500">{user.status}</p>
                </div>
              </div>
            </TooltipTrigger>
            {user.status !== '対応可能' && (
              <TooltipContent>
                <p>ただいま、{user.status}です</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );
}
