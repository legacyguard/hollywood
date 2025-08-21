import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Scene3KeyProps {
  initialTrustedName?: string;
  onBack: () => void;
  onNext: (trustedName: string) => void;
}

export default function Scene3Key({ initialTrustedName = "", onBack, onNext }: Scene3KeyProps) {
  const [name, setName] = useState(initialTrustedName);

  useEffect(() => setName(initialTrustedName), [initialTrustedName]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle className="text-2xl font-heading">The Key of Trust</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Who is the one person you would entrust with the key to this box? Enter only the name of someone you trust completely.
          </p>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Martina"
            className="mb-4"
          />
          {/* Placeholder: key engraving updates with the entered name */}
          <div className="h-32 mb-6 rounded-lg border border-card-border bg-card/50 flex items-center justify-center text-sm text-muted-foreground">
            Engraved key preview: {name ? `For ${name}` : "For —"}
          </div>
          <div className="flex gap-3 justify-between">
            <Button variant="outline" onClick={onBack}>Back</Button>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setName("")}>Clear</Button>
              <Button onClick={() => onNext(name)} disabled={!name.trim()}>Continue</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

