'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { UserCircle, ChevronDown, ChevronUp } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

const stamps = [
  { emoji: '😊', name: '笑顔' },
  { emoji: '😂', name: '爆笑' },
  { emoji: '😍', name: '目がハート' },
  { emoji: '🤔', name: '考え中' },
  { emoji: '😎', name: 'クール' },
  { emoji: '🥳', name: 'パーティー' },
];

export default function StatusUpdateForm() {
  const [status, setStatus] = useState('available');
  const [feeling, setFeeling] = useState('');
  const [showFeeling, setShowFeeling] = useState(false);
  const [selectedStamp, setSelectedStamp] = useState('');

  const toggleFeeling = () => {
    if (status === 'available') {
      setShowFeeling(!showFeeling);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-4">
      <div className="flex items-center space-x-4">
        <UserCircle className="h-12 w-12 text-gray-400" />
        <div className="space-y-1 flex-grow">
          <p className="font-medium">Name</p>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="busy">たて込み中</SelectItem>
              <SelectItem value="working">仕事中</SelectItem>
              <SelectItem value="away">外出中</SelectItem>
              <SelectItem value="focus">集中モード</SelectItem>
              <SelectItem value="break">休憩中</SelectItem>
              <SelectItem value="sleep">お休み</SelectItem>
              <SelectItem value="available">対応可能</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleFeeling}
          disabled={status !== 'available'}
        >
          {showFeeling ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </div>

      {showFeeling && (
        <div className="space-y-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                スタンプを選択 {selectedStamp}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64">
              <div className="grid grid-cols-3 gap-2">
                {stamps.map((stamp) => (
                  <Button
                    key={stamp.emoji}
                    variant="ghost"
                    className="text-2xl"
                    onClick={() => setSelectedStamp(stamp.emoji)}
                  >
                    {stamp.emoji}
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
          <Textarea
            placeholder="今の気持ち"
            className="min-h-[100px]"
            value={feeling}
            onChange={(e) => setFeeling(e.target.value)}
          />
          <div className="flex justify-between">
            <Button variant="outline" size="sm">
              写真を選択
            </Button>
            <Button size="sm" onClick={() => setShowFeeling(false)}>
              更新
            </Button>
          </div>
        </div>
      )}

      <div className="mt-4 p-3 bg-gray-100 rounded-md">
        <h3 className="font-medium mb-2">今の気持ち</h3>
        <p className="text-gray-600">
          {selectedStamp} {feeling ? feeling : '今の気持ちを入力しよう'}
        </p>
      </div>
    </div>
  );
}
