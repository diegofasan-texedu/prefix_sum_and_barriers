"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Terminal, LoaderCircle } from "lucide-react";

type SidePanelProps = {
    output: string;
    aiSuggestion: string;
    isAiLoading: boolean;
    selectedCode: string;
    onGenerate: () => void;
};

export function SidePanel({ output, aiSuggestion, isAiLoading, selectedCode, onGenerate }: SidePanelProps) {
    return (
        <Tabs defaultValue="output" className="flex h-full flex-col">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="output"><Terminal className="mr-2 h-4 w-4" />Output</TabsTrigger>
                <TabsTrigger value="ai"><Bot className="mr-2 h-4 w-4" />AI Suggestion</TabsTrigger>
            </TabsList>
            <TabsContent value="output" className="mt-4 flex-1 overflow-y-auto rounded-lg border">
                <Card className="flex h-full flex-col border-0 shadow-none">
                    <CardHeader>
                        <CardTitle>Program Output</CardTitle>
                        <CardDescription>Simulated output from compilation and execution.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-y-auto pt-0">
                        <pre className="font-code text-sm whitespace-pre-wrap">
                            {output || "No output yet. Compile and run your code."}
                        </pre>
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="ai" className="mt-4 flex-1 overflow-y-auto rounded-lg border">
                <Card className="flex h-full flex-col border-0 shadow-none">
                    <CardHeader>
                        <CardTitle>Pthread Generation</CardTitle>
                        <CardDescription>Select code in the editor to get AI suggestions.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-1 flex-col gap-4 pt-0">
                        <Button onClick={onGenerate} disabled={!selectedCode || isAiLoading}>
                            {isAiLoading ? (
                                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Bot className="mr-2 h-4 w-4" />
                            )}
                            Generate with AI
                        </Button>
                        <div className="flex-1 rounded-lg border bg-muted/50 p-4">
                            <ScrollArea className="h-full">
                                <pre className="font-code text-sm whitespace-pre-wrap">
                                    {isAiLoading ? "Generating suggestion..." : aiSuggestion || "Your AI suggestion will appear here."}
                                </pre>
                            </ScrollArea>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    );
}
