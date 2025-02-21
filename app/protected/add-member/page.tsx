import { AddMemberForm } from '@/components/add-member-form';
import Header from '@/components/ui/header';

export default function AddMemberPage() {
  return (
    <main className="flex flex-col w-full max-w-full mx-auto mb-[100vh]">
      <Header />
      <div className="container bg-white h-[80vh] px-4 pt-5 pr-10 pl-10 pb-6 space-y-6 items-start">
        <h1 className="text-2xl font-bold mb-24">メンバー追加</h1>
        <AddMemberForm />
      </div>
    </main>
  );
}
