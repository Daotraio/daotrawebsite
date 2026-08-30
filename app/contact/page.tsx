import type { Metadata } from "next";
import { Send, ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/layout/page-hero";
import { ContactForm } from "@/components/contact/contact-form";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the Daotra affiliate network on Telegram - publishers, advertisers, and general inquiries.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact Us"
        title="Let's talk about your traffic or your offers."
        description="Whether you're evaluating the network or already have an application in review, our team typically replies within hours. Fastest response: message us directly on Telegram."
        actions={
          <Button asChild size="lg">
            <a href="https://t.me/daotra" target="_blank" rel="noopener noreferrer">
              <Send className="h-4 w-4" /> Message us on Telegram
            </a>
          </Button>
        }
      />

      <section className="py-24">
        <div className="container grid gap-12 lg:grid-cols-[1fr_1.3fr]">
          <div className="space-y-6">
            <a
              href="https://t.me/daotra"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 rounded-xl border border-accent-silver/30 bg-gradient-to-br from-accent-silver/10 to-transparent p-5 transition-colors hover:border-accent-silver/60"
            >
              <Send className="h-6 w-6 shrink-0 text-accent-silver" />
              <div className="flex-1">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Telegram</p>
                <p className="mt-1 font-mono text-sm text-foreground">@Daotra</p>
              </div>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-accent-silver" />
            </a>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}

