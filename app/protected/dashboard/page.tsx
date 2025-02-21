import ChatList from '@/components/chat-list';
import { StatusUpdateForm } from '@/components/status-update-form';
import React from 'react';
import Header from '@/components/ui/header';
export default function ProtectedDashboardPage() {
  return (
    <main className="flex flex-col w-full max-w-full mx-auto mb-[100vh]">
      <Header />
      <div className="container px-4 pt-5 pr-10 pl-10 pb-6 space-y-6 items-start">
        <StatusUpdateForm />
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">チャット</h2>
          <ChatList />
        </section>
      </div>
    </main>
  );
}
