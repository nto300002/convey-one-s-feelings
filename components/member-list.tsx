'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MemberCard } from '@/components/member-card';

// モックデータ
const MOCK_MEMBERS = {
  pending: [
    {
      id: 1,
      name: '山田太郎',
      status: '対応可能',
      feeling: '今日は元気です！😊',
      isApproved: false,
    },
    {
      id: 2,
      name: '佐藤花子',
      status: '仕事中',
      feeling: '集中してます',
      isApproved: false,
    },
  ],
  approved: [
    {
      id: 3,
      name: '田中一郎',
      status: '休憩中',
      feeling: 'コーヒーブレイク中☕',
      isApproved: true,
    },
    {
      id: 4,
      name: '鈴木めぐみ',
      status: '対応可能',
      feeling: '質問があればどうぞ！',
      isApproved: true,
    },
  ],
};

export function MemberList() {
  const [activeTab, setActiveTab] = useState('pending');

  return (
    <Tabs
      defaultValue="pending"
      className="w-full"
      onValueChange={setActiveTab}
    >
      <TabsList className="grid w-full grid-cols-2 mb-4">
        <TabsTrigger value="pending">未承認</TabsTrigger>
        <TabsTrigger value="approved">承認済</TabsTrigger>
      </TabsList>
      <TabsContent value="pending" className="space-y-4">
        {MOCK_MEMBERS.pending.map((member) => (
          <MemberCard key={member.id} member={member} />
        ))}
      </TabsContent>
      <TabsContent value="approved" className="space-y-4">
        {MOCK_MEMBERS.approved.map((member) => (
          <MemberCard key={member.id} member={member} />
        ))}
      </TabsContent>
    </Tabs>
  );
}
