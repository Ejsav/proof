import { notFound } from "next/navigation";
import { Phone } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Checkbox } from "@/components/ui/Checkbox";
import { Input } from "@/components/ui/Input";
import { Section } from "@/components/ui/Section";
import { Select } from "@/components/ui/Select";
import { Skeleton } from "@/components/ui/Skeleton";
import { Textarea } from "@/components/ui/Textarea";

const neutrals = [
  ["neutral-50", "bg-neutral-50"],
  ["neutral-100", "bg-neutral-100"],
  ["neutral-200", "bg-neutral-200"],
  ["neutral-300", "bg-neutral-300"],
  ["neutral-400", "bg-neutral-400"],
  ["neutral-500", "bg-neutral-500"],
  ["neutral-600", "bg-neutral-600"],
  ["neutral-700", "bg-neutral-700"],
  ["neutral-800", "bg-neutral-800"],
  ["neutral-900", "bg-neutral-900"],
  ["neutral-950", "bg-neutral-950"],
] as const;

const accentsAndHero = [
  ["accent-50", "bg-accent-50"],
  ["accent-100", "bg-accent-100"],
  ["accent-600 · base", "bg-accent-600"],
  ["accent-700 · hover", "bg-accent-700"],
  ["accent-800", "bg-accent-800"],
  ["hero", "bg-hero"],
  ["hero-surface", "bg-hero-surface"],
  ["success", "bg-success"],
  ["error", "bg-error"],
] as const;

const typeScale = [
  ["display-xl", "text-display-xl", "Priced to move"],
  ["display", "text-display", "Priced to move"],
  ["h1", "text-h1", "Browse our inventory"],
  ["h2", "text-h2", "Recently arrived"],
  ["h3", "text-h3", "2021 Honda CR-V EX-L"],
] as const;

function SwatchGrid({ items }: { items: readonly (readonly [string, string])[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      {items.map(([name, cls]) => (
        <div key={name}>
          <div className={`h-16 rounded-sm border border-neutral-200 ${cls}`} />
          <p className="mt-2 text-caption text-ink-muted">{name}</p>
        </div>
      ))}
    </div>
  );
}

function Spec({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-16 first:mt-0">
      <h2 className="label-caps text-ink-muted">{title}</h2>
      <div className="mt-6">{children}</div>
    </div>
  );
}

export default function StylePage() {
  // Dev-only visual QA page — never ships to production
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <Section as="div">
      <h1 className="text-h1">Design system</h1>
      <p className="mt-2 text-body text-ink-muted">
        Dev-only QA page. Every token and component state in one place.
      </p>

      <div className="mt-16">
        <Spec title="Type scale — Clash Display">
          <div className="space-y-6">
            {typeScale.map(([name, cls, sample]) => (
              <div key={name} className="flex flex-col gap-1">
                <span className="text-caption text-ink-faint">{name}</span>
                <p className={`font-display font-semibold ${cls}`}>{sample}</p>
              </div>
            ))}
          </div>
        </Spec>

        <Spec title="Body — General Sans">
          <div className="max-w-xl space-y-4">
            <p className="text-body-lg">
              body-lg — Every vehicle is inspected, priced to the market, and ready
              for a test drive today.
            </p>
            <p className="text-body">
              body — Every vehicle is inspected, priced to the market, and ready for
              a test drive today. <em>Italic runs like this.</em>{" "}
              <strong>Bold runs like this.</strong>
            </p>
            <p className="text-small text-ink-muted">
              small — Prices exclude tax, title, registration and dealer fees.
            </p>
            <p className="label-caps text-ink-muted">caption caps — no impact to your credit</p>
          </div>
        </Spec>

        <Spec title="Neutrals — warm gray">
          <SwatchGrid items={neutrals} />
        </Spec>

        <Spec title="Accent, hero & feedback">
          <SwatchGrid items={accentsAndHero} />
        </Spec>

        <Spec title="Buttons">
          <div className="space-y-8">
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="primary">Get Pre-Qualified</Button>
              <Button variant="secondary">Value My Trade</Button>
              <Button variant="ghost">View details</Button>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="primary" size="lg">
                <Phone className="size-5" aria-hidden="true" />
                (203) 433-4212
              </Button>
              <Button variant="primary" size="sm">
                Small
              </Button>
              <Button variant="secondary" size="sm">
                Small
              </Button>
              <Button variant="primary" disabled>
                Disabled
              </Button>
              <Button variant="secondary" disabled>
                Disabled
              </Button>
            </div>
            <p className="text-small text-ink-muted">
              Hover: lift + shadow (spatial, never color-only). Focus: tab through to
              check rings. Active: presses back down.
            </p>
          </div>
        </Spec>

        <Spec title="Form controls">
          <div className="grid max-w-3xl gap-8 md:grid-cols-2">
            <Input label="First name" name="qa_first" placeholder="Sam" />
            <Input
              label="Email"
              name="qa_email"
              type="email"
              placeholder="you@example.com"
              hint="We only use this to send your offer."
            />
            <Input
              label="Phone"
              name="qa_phone"
              type="tel"
              defaultValue="203"
              error="Enter a full 10-digit phone number."
            />
            <Input label="Disabled" name="qa_disabled" disabled placeholder="Unavailable" />
            <Select label="Vehicle make" name="qa_make" defaultValue="">
              <option value="" disabled>
                Select a make
              </option>
              <option>Honda</option>
              <option>Toyota</option>
              <option>Ford</option>
            </Select>
            <Textarea
              label="Anything we should know?"
              name="qa_notes"
              placeholder="Timing, budget, the exact car you're after…"
              className="md:col-span-2"
            />
            <div className="space-y-4 md:col-span-2">
              <Checkbox
                name="qa_tcpa"
                label="I agree to receive calls and texts from AutoMax Branford about my inquiry. Message and data rates may apply. Consent is not a condition of purchase."
              />
              <Checkbox name="qa_checked" defaultChecked label="Starts checked" />
              <Checkbox name="qa_off" disabled label="Disabled" />
            </div>
          </div>
        </Spec>

        <Spec title="Badges">
          <div className="flex flex-wrap gap-3">
            <Badge>Neutral</Badge>
            <Badge variant="accent">Just arrived</Badge>
            <Badge variant="success">One owner</Badge>
            <Badge variant="outline">AWD</Badge>
          </div>
        </Spec>

        <Spec title="Card & skeleton">
          <div className="grid max-w-3xl gap-8 md:grid-cols-2">
            <Card interactive className="p-6">
              <p className="label-caps text-ink-muted">Interactive card</p>
              <h3 className="mt-2 text-h3">2021 Honda CR-V EX-L</h3>
              <p className="mt-1 text-small text-ink-muted">32,410 mi · AWD · Leather</p>
              <p className="mt-4 font-display text-h3 font-semibold text-accent-600">$26,900</p>
            </Card>
            <Card className="p-6">
              <Skeleton className="h-40 w-full" />
              <Skeleton className="mt-4 h-5 w-2/3" />
              <Skeleton className="mt-2 h-4 w-1/2" />
              <Skeleton className="mt-4 h-6 w-24" />
            </Card>
          </div>
        </Spec>

        <Spec title="Shadows & radius">
          <div className="flex flex-wrap gap-8">
            {(
              [
                ["shadow-xs", "shadow-xs"],
                ["shadow-sm", "shadow-sm"],
                ["shadow-md", "shadow-md"],
                ["shadow-lg", "shadow-lg"],
              ] as const
            ).map(([name, cls]) => (
              <div key={name}>
                <div className={`size-24 rounded-lg border border-neutral-200 bg-white ${cls}`} />
                <p className="mt-2 text-caption text-ink-muted">{name}</p>
              </div>
            ))}
          </div>
        </Spec>
      </div>
    </Section>
  );
}
