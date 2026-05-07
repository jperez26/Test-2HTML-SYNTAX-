import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@components/ui/card';
import { Badge } from '@components/ui/badge';
import { Skeleton } from '@components/ui/skeleton';
import { PeaksBoard } from '@api/BoardSDK.js';
import { Target, Mountain, Trophy } from 'lucide-react';

const GOAL_META = {
  aconcagua: {
    icon: Mountain,
    tagline: 'First real test at high altitude. South America.',
    image: 'https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?w=800&q=75',
  },
  '7000': {
    icon: Target,
    tagline: 'The next step up. Unforgiving altitude.',
    image: 'https://images.unsplash.com/photo-1580311016955-b42e0083ed94?w=800&q=75',
  },
  k2: {
    icon: Trophy,
    tagline: 'The Savage Mountain. 8,611m. The goal.',
    image: 'https://images.unsplash.com/photo-1614094082869-cd4e4b2905c7?w=800&q=75',
  },
};

function getGoalMeta(name) {
  const lower = (name || '').toLowerCase();
  if (lower.includes('k2')) return GOAL_META.k2;
  if (lower.includes('7000') || lower.includes('7,000')) return GOAL_META['7000'];
  if (lower.includes('aconcagua')) return GOAL_META.aconcagua;
  return { icon: Mountain, tagline: '', image: '' };
}

export default function BigThreeGoals() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGoals() {
      try {
        const peaksBoard = new PeaksBoard();
        const result = await peaksBoard.items()
          .withColumns(['stage', 'elevationM', 'region'])
          .where({ stage: 'Dream Goal' })
          .withPagination({ limit: 10 })
          .execute();
        setGoals(result.items || []);
      } catch (err) {
        console.error('Failed to fetch goals:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchGoals();
  }, []);

  return (
    <section className="py-16 px-4 bg-secondary/30">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl sm:text-5xl tracking-wide text-foreground mb-2">
          The Big Three.
        </h2>
        <p className="text-muted-foreground mb-10">
          Long-term objectives. Everything else is preparation for these.
        </p>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-64 rounded-lg" />)}
          </div>
        ) : goals.length === 0 ? (
          <p className="text-muted-foreground">Dream goals coming soon.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {goals.map((goal) => (
              <GoalCard key={goal.id} goal={goal} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function GoalCard({ goal }) {
  const meta = getGoalMeta(goal.name);
  const Icon = meta.icon;
  return (
    <Card className="border-border bg-card overflow-hidden group cursor-pointer hover:border-primary/40 hover:shadow-md transition-all duration-200 relative">
      {meta.image && (
        <div className="w-full h-36 overflow-hidden relative">
          <img
            src={meta.image}
            alt={goal.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute bottom-3 left-3">
            <Icon className="size-6 text-primary" />
          </div>
        </div>
      )}
      <CardContent className="p-5 space-y-2">
        <h3 className="text-2xl tracking-wide text-foreground">{goal.name}</h3>
        {goal.elevationM && (
          <Badge variant="secondary" className="text-xs">{goal.elevationM}m</Badge>
        )}
        <p className="text-sm text-muted-foreground">{meta.tagline}</p>
      </CardContent>
    </Card>
  );
}
