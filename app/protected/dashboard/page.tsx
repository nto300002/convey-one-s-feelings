import ChatList from '@/components/chat-list';
import StatusUpdateForm from '@/components/status-update-form';
import React from 'react';

export default function ProtectedDashboardPage() {
  return (
    <div className="container mx-auto px-4 pt-2 pb-6 space-y-6 bg-white items-start">
      <StatusUpdateForm />
      <main className="">
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">チャット</h2>
          <ChatList />
        </section>
      </main>
    </div>
  );
}
