import { ChatInterface } from '@/components/chat-interface';

export default function ChatPage({ params }: { params: { userId: string } }) {
  return (
    <div className="container mx-auto px-4 py-6 bg-white">
      <main className="">
        <ChatInterface userId={params.userId} />
      </main>
    </div>
  );
}
