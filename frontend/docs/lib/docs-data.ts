export type DocPage = {
  slug: string;
  title: string;
  section: string;
  description?: string;
};

export const docsNav: { label: string; collapsible?: boolean; items: DocPage[] }[] = [
  {
    label: "Get started",
    collapsible: true,
    items: [
      { slug: "introduction", title: "Introduction", section: "Get started" },
      { slug: "installation", title: "Installation", section: "Get started" },
      { slug: "quick-start", title: "Quick Start", section: "Get started" },
    ],
  },
  {
    label: "Concepts",
    collapsible: true,
    items: [
      { slug: "plans-features", title: "Plans & Features", section: "Concepts" },
      { slug: "customers", title: "Customers", section: "Concepts" },
      { slug: "subscriptions", title: "Subscriptions", section: "Concepts" },
      { slug: "scheduling", title: "Scheduling (Cron)", section: "Concepts" },
      { slug: "entitlements", title: "Entitlements", section: "Concepts" },
      { slug: "webhooks", title: "Webhooks", section: "Concepts" },
    ],
  },
  {
    label: "Reference",
    items: [
      { slug: "database", title: "Database & Migrations", section: "Reference" },
      { slug: "payment-providers", title: "Payment Providers", section: "Reference" },
      { slug: "plugins", title: "Plugins", section: "Reference" },
      { slug: "client-sdk", title: "Client SDK", section: "Reference" },
      { slug: "cli", title: "CLI Reference", section: "Reference" },
    ],
  },
];

export const allDocs: DocPage[] = docsNav.flatMap((g) => g.items);

export function findDoc(slug: string) {
  return allDocs.find((d) => d.slug === slug);
}

export function getAdjacent(slug: string) {
  const i = allDocs.findIndex((d) => d.slug === slug);
  return { prev: i > 0 ? allDocs[i - 1] : null, next: i < allDocs.length - 1 ? allDocs[i + 1] : null };
}
