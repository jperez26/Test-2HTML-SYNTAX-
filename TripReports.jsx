import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@components/ui/card';
import { Badge } from '@components/ui/badge';
import { Skeleton } from '@components/ui/skeleton';
import { TripReportsBoard } from '@api/BoardSDK.js';
import FilePreview from '@components/FilePreview';
import { CalendarDays, BookOpen } from 'lucide-react';

export default function TripReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReports() {
      try {
        const board = new TripReportsBoard();
        const result = await board.items()
          .withColumns(['publishStage', 'climbDate', 'storyType', 'heroImage', 'slug', 'featured'])
          .where({ publishStage: 'Published' })
          .withPagination({ limit: 10 })
          .execute();
        setReports(result.items || []);
      } catch (err) {
        console.error('Failed to fetch trip reports:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchReports();
  }, []);

  return (
    <section className="py-16 px-4 bg-secondary/30">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <BookOpen className="size-6 text-primary" />
          <h2 className="text-4xl sm:text-5xl tracking-wide text-foreground">
            The Dirt.
          </h2>
        </div>
        <p className="text-muted-foreground mb-10">
          Honest trip reports. What happened, what went wrong, what worked.
        </p>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map(i => <Skeleton key={i} className="h-72 rounded-lg" />)}
          </div>
        ) : reports.length === 0 ? (
          <p className="text-muted-foreground">No published reports yet. Check back soon.</p>
        ) : (
          <div className="columns-1 md:columns-2 gap-6 space-y-6">
            {reports.map(report => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function ReportCard({ report }) {
  const heroFile = report.heroImage?.[0];
  return (
    <Card className="break-inside-avoid overflow-hidden border-border bg-card hover:border-primary/40 hover:shadow-md transition-all duration-200 cursor-pointer group">
      {heroFile && (
        <div className="w-full h-48 overflow-hidden">
          <FilePreview file={heroFile} height="192px" objectFit="cover" />
        </div>
      )}
      <CardContent className="p-5 space-y-3">
        <div className="flex items-center gap-2">
          {report.storyType && (
            <Badge variant="secondary" className="text-[10px] uppercase tracking-wide">
              {report.storyType}
            </Badge>
          )}
        </div>
        <h3 className="text-xl font-[family-name:var(--font-heading)] tracking-wide text-foreground group-hover:text-primary transition-colors">
          {report.name}
        </h3>
        {report.climbDate && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <CalendarDays className="size-3.5" />
            <span>{report.climbDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
