import { ChatInterface } from '@/components/chat-interface';
import Header from '@/components/ui/header';

export default function ChatPage({ params }: { params: { userId: string } }) {
  return (
    <main className="flex flex-col w-full max-w-full mx-auto mb-[100vh]">
      <Header />
      <div className="container pt-24 pb-24 mx-auto px-4 py-6 bg-white">
        <ChatInterface userId={params.userId} />
      </div>
    </main>
  );
}
