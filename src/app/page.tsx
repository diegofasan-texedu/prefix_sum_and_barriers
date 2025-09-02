"use client";

import { useState, useRef, useCallback } from "react";
import { getAiSuggestion } from "@/app/actions";
import { DEFAULT_C_CODE } from "@/lib/constants";
import { Header } from "@/components/header";
import { CodeEditor } from "@/components/code-editor";
import { SidePanel } from "@/components/side-panel";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  const [code, setCode] = useState<string>(DEFAULT_C_CODE);
  const [output, setOutput] = useState<string>("");
  const [selectedCode, setSelectedCode] = useState<string>("");
  const [aiSuggestion, setAiSuggestion] = useState<string>("");
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleCompile = () => {
    setOutput("Simulating compilation...\n> gcc -o main main.c -lpthread\nCompilation successful.\n\nNote: Actual code compilation is not supported in this web environment.");
    toast({
      title: "Code Compiled",
      description: "Ready to run.",
    });
  };

  const handleRun = () => {
    setOutput(prev => prev + "\n\nSimulating execution...\n> ./main\nStarting program...\nCreating thread 0\nCreating thread 1\nCreating thread 2\nCreating thread 3\nHello from thread #0!\nHello from thread #1!\nHello from thread #2!\nHello from thread #3!\nThread #0 finished.\nThread #1 finished.\nThread #2 finished.\nThread #3 finished.\nAll threads completed. Exiting program.\n\nNote: This is simulated output based on the default code.");
  };

  const handleSave = () => {
    try {
      const blob = new Blob([code], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "thread_weaver.c";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast({
        title: "File Saved",
        description: "Your code has been downloaded as thread_weaver.c",
      });
    } catch (error) {
      console.error("Failed to save file:", error);
      toast({
        variant: "destructive",
        title: "Save Failed",
        description: "Could not save the file.",
      });
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) { // 1MB limit
          toast({ variant: "destructive", title: "Upload Failed", description: "File is too large (max 1MB)." });
          return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setCode(text);
        toast({ title: "File Uploaded", description: `${file.name} loaded into the editor.` });
      };
      reader.onerror = () => {
          toast({ variant: "destructive", title: "Upload Failed", description: "Could not read the file." });
      }
      reader.readAsText(file);
    }
    if (event.target) {
        event.target.value = '';
    }
  };

  const handleSelect = (event: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const { selectionStart, selectionEnd, value } = event.currentTarget;
    setSelectedCode(value.substring(selectionStart, selectionEnd));
  };

  const handleGenerate = useCallback(async () => {
    if (!selectedCode) {
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: "Please select a piece of code first.",
      });
      return;
    }

    setIsAiLoading(true);
    setAiSuggestion("");
    const result = await getAiSuggestion({ selectedCode });
    setIsAiLoading(false);

    if (result.error) {
      toast({
        variant: "destructive",
        title: "AI Generation Failed",
        description: result.error,
      });
      setAiSuggestion("Error: " + result.error);
    } else {
      setAiSuggestion(result.data || "");
      toast({
        title: "AI Suggestion Ready",
        description: "The AI has generated a new code snippet.",
      });
    }
  }, [selectedCode, toast]);

  return (
    <div className="flex h-screen flex-col bg-background text-foreground">
      <Header
        onCompile={handleCompile}
        onRun={handleRun}
        onSave={handleSave}
        onUpload={handleUploadClick}
      />
      <main className="flex flex-1 overflow-hidden">
        <div className="flex-1 p-4 pl-4 pr-2">
          <CodeEditor code={code} setCode={setCode} onSelect={handleSelect} />
        </div>
        <Separator orientation="vertical" className="h-full" />
        <div className="w-[35%] max-w-[600px] p-4 pl-2 pr-4 lg:w-[40%] lg:max-w-[700px]">
          <SidePanel
            output={output}
            aiSuggestion={aiSuggestion}
            isAiLoading={isAiLoading}
            selectedCode={selectedCode}
            onGenerate={handleGenerate}
          />
        </div>
      </main>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".c,.h"
      />
    </div>
  );
}
