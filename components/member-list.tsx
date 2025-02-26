'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  UserCircle,
  Check,
  X,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/use-toast';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { Supabase, Profile, UserStatus } from '@/types/supabase';

interface Member {
  id: string | undefined;
  username: string;
  status?: string;
  inviteId?: number;
  isPending?: boolean;
  isReceived?: boolean;
  isRejected?: boolean;
}

export function MemberList() {
  const [sentInvites, setSentInvites] = useState<Member[]>([]);
  const [receivedInvites, setReceivedInvites] = useState<Member[]>([]);
  const [rejectedInvites, setRejectedInvites] = useState<Member[]>([]);
  const [approvedMembers, setApprovedMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRejected, setShowRejected] = useState(false);
  const { session } = useAuth();
  const supabase = createClient();

  const fetchMembers = async () => {
    if (!session?.user) return;

    try {
      setLoading(true);

      // 承認済みメンバーを取得
      const { data: approvedData, error: approvedError } = await supabase
        .from('usermembers')
        .select(
          `
          member_id,
          profiles!member_id (
            id,
            username,
            profilestatus (
              status_id,
              userstatus (
                name
              )
            )
          )
        `
        )
        .eq('user_id', session.user.id);

      if (approvedError) throw approvedError;

      // 送信した招待を取得
      const { data: sentData, error: sentError } = await supabase
        .from('memberinvites')
        .select(
          `
          id,
          invitee_id,
          status,
          profiles!invitee_id (
            id,
            username
          )
        `
        )
        .eq('inviter_id', session.user.id)
        .in('status', ['pending', 'rejected']);

      if (sentError) throw sentError;

      // 受信した招待を取得
      const { data: receivedData, error: receivedError } = await supabase
        .from('memberinvites')
        .select(
          `
          id,
          inviter_id,
          status,
          profiles!inviter_id (
            id,
            username
          )
        `
        )
        .eq('invitee_id', session.user.id)
        .in('status', ['pending', 'rejected']);

      if (receivedError) throw receivedError;

      // 型アサーション（assertionで型を指定）
      const profiles = approvedData as unknown as Supabase.UserMembersJoin[];

      // データを整形
      const approved = profiles.map(
        (item): Member => ({
          id: item.member_id,
          username: item.profiles.username,
          status: item.profiles.profilestatus?.userstatus?.name || '対応可能',
        })
      );

      const allInvites = [
        ...sentData,
        ...receivedData,
      ] as unknown as Supabase.MemberInviteResult[];

      const sent = (sentData as any[])
        .filter((item) => item.status === 'pending')
        .map((item) => ({
          id: item.invitee_id,
          username: item.profiles.username,
          inviteId: item.id,
          isPending: true,
        }));

      // 拒否された送信招待
      const rejected = (sentData as any[])
        .filter((item) => item.status === 'rejected')
        .map((item) => ({
          id: item.invitee_id,
          username: item.profiles.username,
          inviteId: item.id,
          isRejected: true,
        }));

      // 受信した招待
      const received = (receivedData as any[])
        .filter((item) => item.status === 'pending')
        .map((item) => ({
          id: item.inviter_id,
          username: item.profiles.username,
          inviteId: item.id,
          isReceived: true,
        }));

      // 拒否した受信招待
      const receivedRejected = (receivedData as any[])
        .filter((item) => item.status === 'rejected')
        .map((item) => ({
          id: item.inviter_id,
          username: item.profiles.username,
          inviteId: item.id,
          isReceived: true,
          isRejected: true,
        }));

      setApprovedMembers(approved);
      setSentInvites(sent);
      setReceivedInvites(received);
      setRejectedInvites([...rejected, ...receivedRejected]);
    } catch (error) {
      console.error('メンバー取得エラー:', error);
      toast({
        title: 'エラー',
        description: 'メンバー情報の取得に失敗しました',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.id) {
      fetchMembers();
    }
  }, [session?.user?.id]);

  const handleApprove = async (inviteId: number) => {
    if (!session?.user) return;

    try {
      const { data, error } = await supabase.rpc('accept_member_invite', {
        invite_id: inviteId,
        current_user_id: session.user.id,
      });

      if (error) throw error;
      if (!data) throw new Error('招待の承認に失敗しました');

      // UIを更新
      const approvedInvite = receivedInvites.find(
        (member) => member.inviteId === inviteId
      );

      if (approvedInvite) {
        // 受信リストから削除
        setReceivedInvites(
          receivedInvites.filter((member) => member.inviteId !== inviteId)
        );

        // 承認済みリストに追加
        setApprovedMembers([
          ...approvedMembers,
          {
            id: approvedInvite.id,
            username: approvedInvite.username,
            status: '対応可能',
          },
        ]);
      }

      toast({
        title: '承認しました',
        description: 'メンバーを承認しました',
      });
    } catch (error) {
      console.error('承認エラー:', error);
      toast({
        title: 'エラー',
        description: '承認処理に失敗しました',
        variant: 'destructive',
      });
    }
  };

  const handleReject = async (inviteId: number) => {
    try {
      const { error } = await supabase
        .from('memberinvites')
        .update({ status: 'rejected' })
        .eq('id', inviteId);

      if (error) throw error;

      // 拒否した招待を取得
      const rejectedInvite = receivedInvites.find(
        (member) => member.inviteId === inviteId
      );

      if (rejectedInvite) {
        // 受信リストから削除
        setReceivedInvites(
          receivedInvites.filter((member) => member.inviteId !== inviteId)
        );

        // 拒否リストに追加
        setRejectedInvites([
          ...rejectedInvites,
          {
            ...rejectedInvite,
            isRejected: true,
          },
        ]);
      }

      toast({
        title: '拒否しました',
        description: '招待を拒否しました',
      });
    } catch (error) {
      console.error('拒否エラー:', error);
      toast({
        title: 'エラー',
        description: '拒否処理に失敗しました',
        variant: 'destructive',
      });
    }
  };

  const handleCancel = async (inviteId: number) => {
    try {
      const { error } = await supabase
        .from('memberinvites')
        .delete()
        .eq('id', inviteId);

      if (error) throw error;

      // UIを更新
      setSentInvites(
        sentInvites.filter((member) => member.inviteId !== inviteId)
      );

      toast({
        title: 'キャンセルしました',
        description: '招待をキャンセルしました',
      });
    } catch (error) {
      console.error('キャンセルエラー:', error);
      toast({
        title: 'エラー',
        description: 'キャンセル処理に失敗しました',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return <div className="text-center py-8">読み込み中...</div>;
  }

  return (
    <div className="space-y-8">
      <Tabs defaultValue="received" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="received">
            受信 ({receivedInvites.length})
          </TabsTrigger>
          <TabsTrigger value="sent">送信済 ({sentInvites.length})</TabsTrigger>
          <TabsTrigger value="approved">
            承認済 ({approvedMembers.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="received" className="space-y-4">
          {receivedInvites.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              受信した招待はありません
            </div>
          ) : (
            receivedInvites.map((member) => (
              <div
                key={`received-${member.inviteId}`}
                className="flex items-center justify-between p-4 bg-white rounded-lg shadow"
              >
                <div className="flex items-center space-x-4">
                  <UserCircle className="h-10 w-10 text-gray-400" />
                  <div>
                    <p className="font-medium">{member.username}</p>
                    <p className="text-sm text-gray-500">招待を受信しました</p>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-green-600 border-green-600 hover:bg-green-50"
                    onClick={() => handleApprove(member.inviteId!)}
                  >
                    <Check className="h-4 w-4 mr-1" />
                    承認
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600 border-red-600 hover:bg-red-50"
                    onClick={() => handleReject(member.inviteId!)}
                  >
                    <X className="h-4 w-4 mr-1" />
                    拒否
                  </Button>
                </div>
              </div>
            ))
          )}
        </TabsContent>

        <TabsContent value="sent" className="space-y-4">
          {sentInvites.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              送信した招待はありません
            </div>
          ) : (
            sentInvites.map((member) => (
              <div
                key={`sent-${member.inviteId}`}
                className="flex items-center justify-between p-4 bg-white rounded-lg shadow"
              >
                <div className="flex items-center space-x-4">
                  <UserCircle className="h-10 w-10 text-gray-400" />
                  <div>
                    <p className="font-medium">{member.username}</p>
                    <p className="text-sm text-gray-500">招待を送信済み</p>
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  className="text-gray-600"
                  onClick={() => handleCancel(member.inviteId!)}
                >
                  キャンセル
                </Button>
              </div>
            ))
          )}
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          {approvedMembers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              承認済みのメンバーはいません
            </div>
          ) : (
            approvedMembers.map((member) => (
              <div
                key={`approved-${member.id}`}
                className="flex items-center justify-between p-4 bg-white rounded-lg shadow"
              >
                <div className="flex items-center space-x-4">
                  <UserCircle className="h-10 w-10 text-gray-400" />
                  <div>
                    <p className="font-medium">{member.username}</p>
                    <p
                      className={`text-sm ${
                        member.status === '対応可能'
                          ? 'text-green-600'
                          : 'text-gray-500'
                      }`}
                    >
                      {member.status}
                    </p>
                  </div>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 border-red-600 hover:bg-red-50"
                      >
                        <AlertCircle className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>非承認にする</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            ))
          )}
        </TabsContent>
      </Tabs>

      {/* 非承認リスト - タブの外に独立して配置 */}
      {rejectedInvites.length > 0 && (
        <div className="mt-8 border-t pt-6">
          <Button
            variant="ghost"
            className="w-full flex items-center justify-center text-gray-500 mb-4"
            onClick={() => setShowRejected(!showRejected)}
          >
            {showRejected ? (
              <>
                <ChevronUp className="h-4 w-4 mr-2" />
                非承認リストを隠す
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-2" />
                非承認リストを表示 ({rejectedInvites.length})
              </>
            )}
          </Button>

          {showRejected && (
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                非承認リスト
              </h3>
              {rejectedInvites.map((member) => (
                <div
                  key={`rejected-${member.inviteId}`}
                  className="flex items-center justify-between p-4 bg-white rounded-lg shadow border border-red-100"
                >
                  <div className="flex items-center space-x-4">
                    <UserCircle className="h-10 w-10 text-gray-400" />
                    <div>
                      <p className="font-medium">{member.username}</p>
                      <p className="text-sm text-red-500">
                        {member.isReceived
                          ? '招待を拒否しました'
                          : '招待が拒否されました'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
