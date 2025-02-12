'use client';

import { UserCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const MOCK_USERS = [
  { id: 1, name: 'Name', status: 'たて込み中' },
  { id: 2, name: 'Name', status: '仕事中' },
  { id: 3, name: 'NameName', status: '対応可能' },
];

export default function ChatList() {
  const router = useRouter();

  const handleUserClick = (userId: number, status: string) => {
    if (status === '対応可能') {
      router.push(`/chat/${userId}`);
    }
  };

  return (
    <div className="space-y-2">
      {MOCK_USERS.map((user) => (
        <TooltipProvider key={user.id}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className={`flex items-center space-x-4 bg-white p-4 rounded-lg shadow 
                  ${user.status === '対応可能' ? 'hover:bg-gray-50 cursor-pointer' : 'opacity-75'}`}
                onClick={() => handleUserClick(user.id, user.status)}
              >
                <UserCircle className="h-10 w-10 text-gray-400" />
                <div>
                  <p className="font-medium">{user.name}</p>
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
