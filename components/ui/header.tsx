'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { BellIcon, UserCircle, ChevronDownIcon } from 'lucide-react';
import { signOutAction } from '@/app/actions';
import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [session, setSession] = useState<Session | null>(null);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
    };
    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
      }
    );

    router.refresh();
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [supabase, router]);

  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          href="/protected/dashboard"
          className="flex items-center space-x-2"
        >
          <span className="text-red-500 text-xl">🗣️</span>
          <span className="font-medium">convey-one&apos;s-feelings</span>
        </Link>

        <div className="flex items-center space-x-4">
          {session ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <BellIcon className="h-5 w-5" />
                    <span className="sr-only">通知</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>新しい通知はありません</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center space-x-2"
                  >
                    <span>Menu</span>
                    <ChevronDownIcon className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Link href="/protected/dashboard">トップページ</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/protected/members">メンバー一覧</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/protected/profile">プロフィール</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/protected/add-member">メンバー追加</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={async () => await signOutAction()}>
                    ログアウト
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="ghost" size="icon">
                <UserCircle className="h-6 w-6" />
                <span className="sr-only">プロフィール</span>
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/sign-in">ログイン</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link href="/sign-up">サインアップ</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
