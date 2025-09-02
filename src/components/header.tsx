"use client";

import { Logo } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Play, Save, Upload } from "lucide-react";

type HeaderProps = {
  onCompile: () => void;
  onRun: () => void;
  onSave: () => void;
  onUpload: () => void;
};

export function Header({ onCompile, onRun, onSave, onUpload }: HeaderProps) {
    return (
        <header className="flex h-16 shrink-0 items-center border-b bg-card px-4">
            <div className="flex items-center gap-3">
                <Logo className="h-7 w-7 text-primary" />
                <h1 className="text-xl font-semibold tracking-tight">Thread Weaver</h1>
            </div>
            <div className="ml-auto flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={onCompile}>
                    <Play className="mr-2 h-4 w-4" />
                    Compile
                </Button>
                <Button variant="outline" size="sm" onClick={onRun}>
                    <Play className="mr-2 h-4 w-4" />
                    Run
                </Button>
                <Button variant="outline" size="sm" onClick={onUpload}>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload
                </Button>
                <Button variant="default" size="sm" onClick={onSave}>
                    <Save className="mr-2 h-4 w-4" />
                    Save
                </Button>
            </div>
        </header>
    );
}
