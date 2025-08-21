import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Scene1PromiseProps {
  onNext: () => void;
}

export default function Scene1Promise({ onNext }: Scene1PromiseProps) {
  const subtitle = useMemo(
    () => "Every life is a story. Let’s ensure yours will be a source of strength and calm for your loved ones.",
    []
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-2xl text-center">
        <CardHeader>
          <CardTitle className="text-3xl font-heading">A Promise of Calm</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-8">{subtitle}</p>
          {/* Placeholder for gentle firefly animation over a calm night scene */}
          <div className="h-48 rounded-lg bg-gradient-to-br from-primary/10 to-background border border-card-border mb-8" />
          <Button size="lg" className="bg-primary hover:bg-primary-hover" onClick={onNext}>
            Start writing my story
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

