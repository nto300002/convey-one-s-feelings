import React from 'react';
import { Button } from '../ui/button';
import { Icons } from '../ui/icons';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { SubmitButton } from '../submit-button';
import { signInAction } from '@/app/actions';
import Link from 'next/link';

export const SignInForm = () => {
  return (
    <div className="space-y-6 items-center">
      <Button variant="outline" className="w-full mb-6" type="button">
        <Icons.google className="mr-2 h-4 w-4" />
        Googleで続ける
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            または
          </span>
        </div>
      </div>

      <form className="space-y-4">
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
          <Label htmlFor="email">メールアドレス</Label>
          <Input name="email" placeholder="you@example.com" required />
          <Label htmlFor="password">パスワード</Label>
          <Input
            type="password"
            name="password"
            placeholder="Your password"
            minLength={6}
            required
          />
          <Link
            className="text-xs text-foreground underline"
            href="/forgot-password"
          >
            パスワードを忘れた場合
          </Link>
          <SubmitButton formAction={signInAction} pendingText="Signing up...">
            サインイン
          </SubmitButton>
        </div>
      </form>
      <div className="px-5 py-3 mt-6 border-l-2 border-gray-400 flex gap-4 w-[600px]">
        アカウントをお持ちでない場合{' '}
        <Link
          href="/sign-up"
          className="text-primary underline-offset-4 hover:underline"
        >
          サインアップ
        </Link>
      </div>
    </div>
  );
};
