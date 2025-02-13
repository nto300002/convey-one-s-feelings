import { AddMemberForm } from '@/components/add-member-form';

export default function AddMemberPage() {
  return (
    <div className="container mx-auto px-4 pt-2 pb-6 space-y-6 bg-white items-start">
      <main className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">メンバー追加</h1>
        <AddMemberForm />
      </main>
    </div>
  );
}
