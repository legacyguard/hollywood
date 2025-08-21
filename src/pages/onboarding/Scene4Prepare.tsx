import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface Scene4PrepareProps {
  onBack: () => void;
}

export default function Scene4Prepare({ onBack }: Scene4PrepareProps) {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      // After the subtle loading animation, redirect to the dashboard
      navigate("/");
    }, 1600);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-2xl text-center">
        <CardHeader>
          <CardTitle className="text-2xl font-heading">Preparing Your Path</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            Thank you. I understand what matters to you. I am preparing your personal space where you can safely keep these treasures.
          </p>
          {/* Placeholder for firefly drawing a light trail (logo-like) */}
          <div className="h-32 rounded-lg bg-gradient-to-br from-primary/10 to-background border border-card-border mb-6 animate-pulse" />
          <div className="flex gap-3 justify-between">
            <Button variant="outline" onClick={onBack}>Back</Button>
            <Button disabled>Redirecting…</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

