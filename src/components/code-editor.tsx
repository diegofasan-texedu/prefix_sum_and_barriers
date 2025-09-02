"use client";

import type React from 'react';
import { Textarea } from "@/components/ui/textarea";

type CodeEditorProps = {
  code: string;
  setCode: (code: string) => void;
  onSelect: (event: React.SyntheticEvent<HTMLTextAreaElement>) => void;
};

export function CodeEditor({ code, setCode, onSelect }: CodeEditorProps) {
  return (
    <div className="relative h-full w-full">
      <Textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        onSelect={onSelect}
        placeholder="Write your C code here..."
        className="h-full w-full resize-none rounded-lg border bg-card p-4 font-code text-[14px] leading-6 shadow-inner"
        spellCheck="false"
      />
    </div>
  );
}
