'use client';

import { useRouter } from 'next/navigation';
import { UserCircle } from 'lucide-react';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';

interface Member {
  id: number;
  name: string;
  status: string;
  feeling: string;
  isApproved: boolean;
}

interface MemberCardProps {
  member: Member;
}

export function MemberCard({ member }: MemberCardProps) {
  const router = useRouter();

  const handleClick = () => {
    if (member.status === '対応可能') {
      router.push(`/chat/${member.id}`);
    }
  };

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div
          className={`
            flex items-center space-x-4 bg-white p-4 rounded-lg shadow
            ${member.status === '対応可能' ? 'hover:bg-gray-50 cursor-pointer' : ''}
          `}
          onClick={handleClick}
        >
          <UserCircle className="h-10 w-10 text-gray-400" />
          <div>
            <p className="font-medium">{member.name}</p>
            <p className="text-sm text-gray-500">{member.status}</p>
          </div>
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="space-y-2">
          <p className="text-sm font-medium">{member.name}</p>
          <div className="text-sm text-gray-500 space-y-1">
            <p>ステータス: {member.status}</p>
            <p>今の気持ち: {member.feeling}</p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
