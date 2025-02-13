import { MemberList } from '@/components/member-list';

export default function MembersPage() {
  return (
    <div className="container mx-auto px-4 py-6 bg-white">
      <main className="">
        <h1 className="text-2xl font-bold mb-6">おはなしメンバー一覧</h1>
        <MemberList />
      </main>
    </div>
  );
}
