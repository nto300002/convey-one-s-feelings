import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
/**
 * Redirects to a specified path with an encoded message as a query parameter.
 * @param {('error' | 'success')} type - The type of message, either 'error' or 'success'.
 * @param {string} path - The path to redirect to.
 * @param {string} message - The message to be encoded and added as a query parameter.
 * @returns {never} This function doesn't return as it triggers a redirect.
 */
export function encodedRedirect(
  type: 'error' | 'success',
  path: string,
  message: string
) {
  return redirect(`${path}?${type}=${encodeURIComponent(message)}`);
}

/**
 * flashRedirect
 * @param type - フラッシュメッセージのタイプ（'success' | 'error' | 'message'）
 * @param url - リダイレクト先URL
 * @param message - 表示するメッセージ
 */
export async function flashRedirect(
  type: 'success' | 'error' | 'message',
  url: string,
  message: string
): Promise<never> {
  const cookieStore = await cookies();
  cookieStore.set('flashMessage', JSON.stringify({ type, message }), {
    path: '/',
  });
  redirect(url);
  throw new Error('Redirected'); // 実際には、この行には到達しません
}
