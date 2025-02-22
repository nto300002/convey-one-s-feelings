import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <h2 className="text-2xl mb-8">ページが見つかりませんでした</h2>
      <p className="text-gray-600 mb-8">
        お探しのページは存在しないか、移動した可能性があります。
      </p>
      <Link
        href="/protected/dashboard"
        className="text-pink-600 hover:text-pink-800 underline"
      >
        トップページに戻る
      </Link>
    </div>
  );
}
