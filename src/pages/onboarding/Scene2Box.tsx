import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface Scene2BoxProps {
  initialItems?: string;
  onBack: () => void;
  onNext: (items: string) => void;
}

export default function Scene2Box({ initialItems = "", onBack, onNext }: Scene2BoxProps) {
  const [items, setItems] = useState(initialItems);

  useEffect(() => setItems(initialItems), [initialItems]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle className="text-2xl font-heading">The Box of Certainty</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Imagine leaving a single box for your loved ones. What would you put inside so they know how much you cared?
          </p>
          <Textarea
            value={items}
            onChange={(e) => setItems(e.target.value)}
            className="mb-4"
            placeholder="Write anything: house keys, banking hint, letter for my daughter, grandpa’s watch..."
            rows={6}
          />
          {/* Placeholder: animate entered words into a visual box */}
          <div className="h-32 mb-6 rounded-lg border border-card-border bg-card/50 flex items-center justify-center text-sm text-muted-foreground">
            Subtle animation placeholder: words gently placed into a box
          </div>
          <div className="flex gap-3 justify-between">
            <Button variant="outline" onClick={onBack}>Back</Button>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setItems("")}>Clear</Button>
              <Button onClick={() => onNext(items)} disabled={!items.trim()}>Continue</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

