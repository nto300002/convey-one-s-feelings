// 方法2: 直接インターフェースをエクスポート
export interface Profile {
  id: string;
  username: string;
  created_at: string;
  updated_at: string;
}

export interface UserStatus {
  id: number;
  name: string;
  hiragana: string;
}

// 方法1: 名前空間(namespace)を使用
export namespace Supabase {
  export interface ProfileWithStatus {
    id: string;
    username: string;
    profilestatus: {
      status_id: number;
      userstatus: {
        name: string;
      };
    };
  }

  export interface MemberInvite {
    id: number;
    inviter_id: string;
    invitee_id: string;
    status: 'pending' | 'accepted' | 'rejected';
    created_at: string;
  }

  export interface UserMembersJoin {
    member_id: string;
    profiles: {
      id: string;
      username: string;
      profilestatus: {
        status_id: number;
        userstatus: {
          name: string;
        };
      };
    };
  }

  export interface MemberInviteJoin {
    id: number;
    inviter_id: string;
    invitee_id: string;
    status: string;
    profiles: {
      id: string;
      username: string;
    };
  }

  // 拒否されたInviteのための型定義
  export interface RejectedInviteJoin {
    id: number;
    inviter_id?: string; // 受信拒否の場合
    invitee_id?: string; // 送信拒否の場合
    status: 'rejected';
    profiles: {
      id: string;
      username: string;
    };
  }

  export type MemberInviteResult = MemberInviteJoin | RejectedInviteJoin;
}
