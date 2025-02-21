import { MemberList } from '@/components/member-list';
import Header from '@/components/ui/header';

export default function MembersPage() {
  return (
    <main className="flex flex-col w-full max-w-full mx-auto mb-[100vh]">
      <Header />
      <div className="container px-4 pt-5 pr-10 pl-10 pb-6 space-y-6 items-start">
        <h1 className="text-2xl font-bold mb-6">おはなしメンバー一覧</h1>
        <MemberList />
      </div>
    </main>
  );
}
