import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@components/ui/card';
import { Badge } from '@components/ui/badge';
import { Skeleton } from '@components/ui/skeleton';
import { GearAndTrainingBoard } from '@api/BoardSDK.js';
import { Dumbbell, Wrench, ThumbsUp, ThumbsDown, FlaskConical } from 'lucide-react';

const VERDICT_ICONS = {
  Recommended: ThumbsUp,
  Failed: ThumbsDown,
  Testing: FlaskConical,
};

export default function GearTraining() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGear() {
      try {
        const board = new GearAndTrainingBoard();
        const result = await board.items()
          .withColumns(['entryType', 'verdict', 'brand', 'featured', 'reviewedOn'])
          .where({ featured: true })
          .withPagination({ limit: 20 })
          .execute();
        setItems(result.items || []);
      } catch (err) {
        console.error('Failed to fetch gear/training:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchGear();
  }, []);

  const gear = items.filter(i => i.entryType === 'Gear');
  const training = items.filter(i => i.entryType === 'Training');

  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl sm:text-5xl tracking-wide text-foreground mb-2">
          Gear & Training.
        </h2>
        <p className="text-muted-foreground mb-10">
          Honest reviews and training notes. No sponsorships, no bias.
        </p>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-lg" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Wrench className="size-5 text-primary" />
                <h3 className="text-2xl tracking-wide text-foreground">Gear</h3>
              </div>
              {gear.length === 0 ? (
                <p className="text-sm text-muted-foreground">No gear reviews yet.</p>
              ) : gear.map(item => <GearCard key={item.id} item={item} />)}
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Dumbbell className="size-5 text-primary" />
                <h3 className="text-2xl tracking-wide text-foreground">Training</h3>
              </div>
              {training.length === 0 ? (
                <p className="text-sm text-muted-foreground">No training logs yet.</p>
              ) : training.map(item => <GearCard key={item.id} item={item} />)}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function GearCard({ item }) {
  const VerdictIcon = VERDICT_ICONS[item.verdict] || FlaskConical;
  return (
    <Card className="border-border bg-card hover:border-primary/30 transition-all duration-200">
      <CardContent className="p-4 flex items-start gap-4">
        <div className="size-10 rounded-md bg-muted flex items-center justify-center shrink-0">
          <VerdictIcon className="size-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-foreground truncate">{item.name}</h4>
          {item.brand && <p className="text-xs text-muted-foreground">{item.brand}</p>}
          <div className="flex items-center gap-2 mt-2">
            {item.verdict && (
              <Badge variant={item.verdict === 'Recommended' ? 'default' : 'secondary'} className="text-[10px]">
                {item.verdict}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
