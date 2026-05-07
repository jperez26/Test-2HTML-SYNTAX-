import React, { useState } from 'react';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Textarea } from '@components/ui/textarea';
import { Card, CardContent } from '@components/ui/card';
import { ContactsBoard } from '@api/BoardSDK.js';
import { Send, Mountain, CheckCircle } from 'lucide-react';

export default function FooterSection() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) return;
    setSending(true);
    try {
      const board = new ContactsBoard();
      await board.item().create({
        name: form.name,
        email: { email: form.email },
        topic: 'General',
        status: 'New',
        submittedOn: new Date(),
      }).execute();
      setSent(true);
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      console.error('Failed to submit contact:', err);
    } finally {
      setSending(false);
    }
  };

  return (
    <footer className="py-16 px-4 border-t border-border">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Personal touch */}
          <div className="flex flex-col justify-center gap-4">
            <div className="flex items-center gap-2">
              <Mountain className="size-6 text-primary" />
              <span className="text-2xl tracking-wide text-foreground font-[family-name:var(--font-heading)]">
                Summit Wizard
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
              Summit Wizard is a personal project documenting the progression from local peaks at 22 to high-altitude mountaineering. Every report, review, and log here is real.
            </p>
            <p className="text-xs text-muted-foreground">
              If you climb or want to start, reach out.
            </p>
          </div>

          {/* Contact form */}
          <Card className="border-border bg-card">
            <CardContent className="p-6">
              <h3 className="text-2xl tracking-wide text-foreground mb-4 font-[family-name:var(--font-heading)]">
                Reach Out
              </h3>
              {sent ? (
                <div className="flex flex-col items-center gap-3 py-8">
                  <CheckCircle className="size-10 text-primary" />
                  <p className="text-sm text-foreground">Message sent! I'll get back to you.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    placeholder="Your name"
                    value={form.name}
                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    className="bg-muted border-border"
                    required
                  />
                  <Input
                    type="email"
                    placeholder="Your email"
                    value={form.email}
                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                    className="bg-muted border-border"
                    required
                  />
                  <Textarea
                    placeholder="What's on your mind?"
                    value={form.message}
                    onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                    className="bg-muted border-border min-h-[80px]"
                  />
                  <Button type="submit" disabled={sending} className="w-full gap-2">
                    <Send className="size-4" />
                    {sending ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 pt-6 border-t border-border text-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Summit Wizard. All adventures are real.
          </p>
        </div>
      </div>
    </footer>
  );
}
