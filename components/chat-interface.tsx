'use client';

import { useState } from 'react';
import { UserCircle, Smile } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

type Message = {
  id: string;
  content: string;
  sender: string;
  timestamp: Date;
  stamp?: string;
};

const quickReplies = [
  '急用',
  '〜〜〜したい',
  '今の気持ち>聞いてほしい',
  '体調・気分悪い',
];

const stamps = [
  { emoji: '😊', name: '笑顔' },
  { emoji: '😂', name: '爆笑' },
  { emoji: '😍', name: '目がハート' },
  { emoji: '🤔', name: '考え中' },
  { emoji: '😎', name: 'クール' },
  { emoji: '🥳', name: 'パーティー' },
  { emoji: '👍', name: 'いいね' },
  { emoji: '🙏', name: 'お願い' },
  { emoji: '💪', name: '頑張る' },
];

export function ChatInterface({ userId }: { userId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedStamp, setSelectedStamp] = useState<string | null>(null);

  const handleSend = () => {
    if (!inputValue.trim() && !selectedStamp) return;

    const newMessage = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'self',
      timestamp: new Date(),
      stamp: selectedStamp || undefined,
    };

    setMessages([...messages, newMessage]);
    setInputValue('');
    setSelectedStamp(null);
  };

  const handleStampSelect = (stamp: string) => {
    if (!inputValue) {
      // スタンプのみのメッセージを送信
      const newMessage = {
        id: Date.now().toString(),
        content: '',
        sender: 'self',
        timestamp: new Date(),
        stamp: stamp,
      };
      setMessages([...messages, newMessage]);
    } else {
      // 入力中のテキストとスタンプを組み合わせる
      setSelectedStamp(stamp);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg">
        {/* チャットヘッダー */}
        <div className="border-b p-4 flex items-center space-x-4">
          <UserCircle className="h-10 w-10 text-gray-400" />
          <div>
            <h2 className="font-medium">Name＜相手＞</h2>
          </div>
        </div>

        {/* メッセージエリア */}
        <div className="h-[500px] overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'self' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  message.sender === 'self'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100'
                }`}
              >
                {message.stamp && (
                  <span className="text-2xl block mb-1">{message.stamp}</span>
                )}
                {message.content}
              </div>
            </div>
          ))}
        </div>

        {/* 入力エリア */}
        <div className="border-t p-4 space-y-4">
          <div className="flex flex-wrap gap-2">
            {quickReplies.map((reply) => (
              <Button
                key={reply}
                variant="outline"
                size="sm"
                onClick={() => setInputValue(reply)}
              >
                {reply}
              </Button>
            ))}
          </div>
          <div className="flex space-x-2">
            <div className="flex-grow space-y-2">
              <Textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="メッセージを入力..."
                className="min-h-[80px]"
              />
              <div className="flex items-center space-x-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Smile className="h-4 w-4 mr-2" />
                      スタンプ
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64">
                    <div className="grid grid-cols-3 gap-2">
                      {stamps.map((stamp) => (
                        <Button
                          key={stamp.emoji}
                          variant="ghost"
                          className="text-2xl"
                          onClick={() => handleStampSelect(stamp.emoji)}
                        >
                          {stamp.emoji}
                        </Button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
                {selectedStamp && (
                  <span className="text-sm text-gray-500">
                    選択中のスタンプ: {selectedStamp}
                  </span>
                )}
              </div>
            </div>
            <Button
              className="self-end"
              onClick={handleSend}
              disabled={!inputValue.trim() && !selectedStamp}
            >
              送信する
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
