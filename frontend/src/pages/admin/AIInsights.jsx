import { Sparkles } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const AIInsights = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
          AI Insights
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          AI-powered insights to help you understand your business and projects.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Sparkles className="h-5 w-5" />
            </div>

            <div>
              <CardTitle>AI Business Insights</CardTitle>

              <CardDescription>
                AI analysis and recommendations will appear here.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="rounded-xl border border-dashed p-8 text-center">
            <Sparkles className="mx-auto h-8 w-8 text-muted-foreground" />

            <h3 className="mt-3 text-sm font-semibold">
              AI Engine Coming Next
            </h3>

            <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
              Risk prediction, delay prediction, completion probability,
              business health, and AI recommendations will be connected here.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIInsights;
