import { CodeBlock } from "../_components/code-block";
import { Callout, Step, CodeTabs } from "../_components/doc-primitives";
import type { TocItem } from "../_components/table-of-contents";

type DocContent = {
  title: string;
  description: string;
  toc: TocItem[];
  body: React.ReactNode;
  markdown?: string;
};


const introBody = (
  <>
    <p className="lead">
      Type-safe subscription management framework for local payment providers.
    </p>
    <hr className="my-8 border-border" />
    <p>
      <strong>BirrJS</strong> is a <strong>type-safe</strong> subscription management framework that sits between your application and payment providers. It gives you a unified API for subscriptions, entitlements, and billing — tailored for local providers like Chapa, ArifPay, Santim Pay, and more.
    </p>
    <CodeBlock>
      <span className="tok-key">import</span> {"{ "}<span className="tok-fn">createBirr</span>{" }"} <span className="tok-key">from</span> <span className="tok-str">"@birrjs/core"</span>;{"\n"}
      <span className="tok-key">import</span> {"{ "}<span className="tok-fn">chapa</span>{" }"} <span className="tok-key">from</span> <span className="tok-str">"@birrjs/chapa"</span>;{"\n\n"}
      <span className="tok-key">const</span> <span className="tok-var">birr</span> = <span className="tok-fn">createBirr</span>({"{"}{"\n"}
      {"  "}database: <span className="tok-var">process</span>.env.<span className="tok-var">DATABASE_URL</span>,{"\n"}
      {"  "}provider: <span className="tok-fn">chapa</span>({"{ "}apiKey: <span className="tok-var">process</span>.env.<span className="tok-var">CHAPA_API_KEY</span>{" }"}),{"\n"}
      {"  "}plans: [<span className="tok-var">starter</span>, <span className="tok-var">pro</span>],{"\n"}
      {"  "}identify: (<span className="tok-var">c</span>) =&gt; <span className="tok-var">c</span>.auth.userId,{"\n"}
      {"}"});{"\n\n"}
      <span className="tok-key">const</span> {"{ "}checkoutUrl{" }"} = <span className="tok-key">await</span> <span className="tok-var">birr</span>.<span className="tok-fn">subscribe</span>({"{ "}planId: <span className="tok-str">"pro"</span>{" }"});
    </CodeBlock>

    <h2 id="why-birrjs">Why BirrJS?</h2>
    <p>
      Building subscription billing on top of regional payment processors usually means writing fragile glue code, hand-rolling webhook handlers, and reinventing entitlement logic for every project. BirrJS gives you batteries-included primitives so you can focus on your product.
    </p>
    <ul>
      <li><strong>Type-safe by default</strong> — plans, features, and entitlements are fully inferred.</li>
      <li><strong>Provider agnostic</strong> — swap Chapa for ArifPay without rewriting your app.</li>
      <li><strong>First-class webhooks</strong> — signed, retried, and idempotent out of the box.</li>
    </ul>

    <h2 id="architecture">Architecture</h2>
    <p>
      BirrJS is split into a core runtime, provider adapters, and a thin client SDK. The runtime owns your database schema and exposes a small set of composable functions. Provider adapters translate a unified intent into provider-specific API calls. The client SDK gives you React hooks and framework helpers.
    </p>
    <CodeBlock>
      <span className="tok-com">// Three layers, one mental model</span>{"\n"}
      <span className="tok-var">app</span> → <span className="tok-fn">birr</span>() → <span className="tok-var">provider</span> → <span className="tok-var">database</span>
    </CodeBlock>

    <h2 id="server-client">Server / Client</h2>
    <p>
      The server runtime handles secrets, signing, and database writes. The client SDK is safe to ship to the browser — it only exposes read operations and entitlement checks. You decide where the boundary lives.
    </p>
    <h3 id="next-steps">Next steps</h3>
    <p>
      Continue with <a href="/docs/installation">Installation</a> to add BirrJS to your project, or jump straight to the <a href="/docs/quick-start">Quick Start</a>.
    </p>
  </>
);

const pkgCmd = (cmd: string) => {
  const [a, b] = cmd.split(" ");
  return (
    <>
      <span className="tok-fn">{a}</span> <span className="tok-key">{b}</span>{" "}
      <span className="tok-str">@birrjs/core</span> <span className="tok-str">@birrjs/chapa</span>
    </>
  );
};

const installBody = (
  <>
    <p className="lead">Install BirrJS, configure Chapa, and mount the route handler in your app.</p>
    <hr className="my-8 border-border" />

    <Callout>
      <p>
        <strong>Want to skip the manual setup?</strong> Run <code>npx @birrjs/cli init</code> to scaffold the full configuration with framework detection, route handler, and plan templates. See the <a href="/docs/cli">CLI reference</a>.
      </p>
    </Callout>

    <Step n={1} title="Install the core package and provider">
      <p>BirrJS ships as a monorepo with a core package and separate provider packages.</p>
      <CodeTabs
        tabs={[
          { label: "pnpm", code: pkgCmd("pnpm add"), copy: "pnpm add @birrjs/core @birrjs/chapa" },
          { label: "npm", code: pkgCmd("npm install"), copy: "npm install @birrjs/core @birrjs/chapa" },
          { label: "yarn", code: pkgCmd("yarn add"), copy: "yarn add @birrjs/core @birrjs/chapa" },
          { label: "bun", code: pkgCmd("bun add"), copy: "bun add @birrjs/core @birrjs/chapa" },
        ]}
      />
    </Step>

    <Step n={2} title="Create the BirrJS instance">
      <p>Create a file named <code>birrjs.ts</code> — usually in <code>src/lib/</code> or <code>src/server/</code>.</p>
      <CodeBlock>
        <span className="tok-key">import</span> {"{ "}<span className="tok-fn">createBirr</span>{" }"} <span className="tok-key">from</span> <span className="tok-str">"@birrjs/core"</span>;{"\n"}
        <span className="tok-key">import</span> {"{ "}<span className="tok-fn">chapa</span>{" }"} <span className="tok-key">from</span> <span className="tok-str">"@birrjs/chapa"</span>;{"\n\n"}
        <span className="tok-key">export const</span> <span className="tok-var">birr</span> = <span className="tok-fn">createBirr</span>({"{"}{"\n"}
        {"  "}provider: <span className="tok-fn">chapa</span>({"{ "}apiKey: <span className="tok-var">process</span>.env.<span className="tok-var">CHAPA_API_KEY</span>!{" }"}),{"\n"}
        {"  "}database: <span className="tok-var">process</span>.env.<span className="tok-var">DATABASE_URL</span>!,{"\n"}
        {"}"});
      </CodeBlock>
    </Step>

    <Step n={3} title="Configure provider">
      <p>Each provider accepts its own credentials. Chapa needs an API key from your dashboard.</p>
      <CodeBlock>CHAPA_API_KEY=<span className="tok-str">"CHASECK_TEST_..."</span></CodeBlock>
    </Step>

    <Step n={4} title="Configure database">
      <p>BirrJS works with Postgres, MySQL, and SQLite via a unified driver layer.</p>
      <CodeBlock>DATABASE_URL=<span className="tok-str">"postgres://user:pass@host:5432/db"</span></CodeBlock>
    </Step>

    <Step n={5} title="Configure identify">
      <p>Tell BirrJS how to map a request to your application user.</p>
      <CodeBlock>identify: (<span className="tok-var">c</span>) =&gt; <span className="tok-var">c</span>.auth.userId,</CodeBlock>
    </Step>

    <Step n={6} title="Mount the route handler">
      <p>Mount the BirrJS handler so checkout, webhooks, and entitlement checks have an endpoint.</p>
      <CodeBlock>
        <span className="tok-key">import</span> {"{ "}<span className="tok-fn">toHandler</span>{" }"} <span className="tok-key">from</span> <span className="tok-str">"@birrjs/core"</span>;{"\n"}
        <span className="tok-key">export const</span> <span className="tok-var">POST</span> = <span className="tok-fn">toHandler</span>(<span className="tok-var">birr</span>);
      </CodeBlock>
    </Step>

    <Step n={7} title="Create the client">
      <p>The browser-safe client gives you typed hooks and entitlement checks.</p>
      <CodeBlock>
        <span className="tok-key">import</span> {"{ "}<span className="tok-fn">createClient</span>{" }"} <span className="tok-key">from</span> <span className="tok-str">"@birrjs/client"</span>;{"\n"}
        <span className="tok-key">export const</span> <span className="tok-var">birrClient</span> = <span className="tok-fn">createClient</span>();
      </CodeBlock>
    </Step>

    <Step n={8} title="Define plans">
      <p>Plans are typed objects. Define once, reuse everywhere.</p>
      <CodeBlock>
        <span className="tok-key">export const</span> <span className="tok-var">pro</span> = <span className="tok-fn">definePlan</span>({"{ "}id: <span className="tok-str">"pro"</span>, price: <span className="tok-str">"299 ETB"</span>{" }"});
      </CodeBlock>
    </Step>

    <Step n={9} title="Sync to the database">
      <p>Push your plan and feature definitions to the database with a single command.</p>
      <CodeBlock>npx birr sync</CodeBlock>
    </Step>
  </>
);


const quickStartBody = (
  <>
    <p className="lead">Ship a working subscription flow in three steps.</p>
    <h2 id="define-plans">1. Define your plans</h2>
    <CodeBlock>
      <span className="tok-key">export const</span> <span className="tok-var">pro</span> = <span className="tok-fn">definePlan</span>({"{"}{"\n"}
      {"  "}id: <span className="tok-str">"pro"</span>,{"\n"}
      {"  "}price: {"{ amount: "}<span className="tok-str">"299"</span>{", currency: "}<span className="tok-str">"ETB"</span>{" }"},{"\n"}
      {"  "}features: [<span className="tok-str">"projects:unlimited"</span>],{"\n"}
      {"}"});
    </CodeBlock>
    <h2 id="checkout">2. Create a checkout</h2>
    <CodeBlock>
      <span className="tok-key">const</span> {"{ "}checkoutUrl{" }"} = <span className="tok-key">await</span> <span className="tok-var">birr</span>.<span className="tok-fn">subscribe</span>({"{ "}planId: <span className="tok-str">"pro"</span>{" }"});
    </CodeBlock>
    <h2 id="entitle">3. Check entitlements</h2>
    <CodeBlock>
      <span className="tok-key">if</span> (<span className="tok-key">await</span> <span className="tok-var">birr</span>.<span className="tok-fn">can</span>(<span className="tok-var">user</span>, <span className="tok-str">"projects:unlimited"</span>)) {"{"}{"\n"}
      {"  "}<span className="tok-com">// ship the feature</span>{"\n"}
      {"}"}
    </CodeBlock>
  </>
);

const stub = (title: string, summary: string) => (
  <>
    <p className="lead">{summary}</p>
    <h2 id="overview">Overview</h2>
    <p>
      The <strong>{title}</strong> module is part of the BirrJS core runtime. It is fully type-safe, framework-agnostic, and designed to work with every supported payment provider out of the box.
    </p>
    <CodeBlock>
      <span className="tok-com">// Coming soon — full reference</span>{"\n"}
      <span className="tok-key">import</span> {"{ "}<span className="tok-fn">{title.toLowerCase().replace(/[^a-z]/g, "")}</span>{" }"} <span className="tok-key">from</span> <span className="tok-str">"@birrjs/core"</span>;
    </CodeBlock>
    <h2 id="usage">Usage</h2>
    <p>Detailed usage examples and API reference are documented inline in the source. See the <a href="/docs/cli">CLI Reference</a> for tooling that scaffolds these primitives.</p>
  </>
);

export const docContent: Record<string, DocContent> = {
  introduction: {
    title: "Introduction",
    description: "Type-safe subscription management framework for local payment providers.",
    toc: [
      { id: "why-birrjs", label: "Why BirrJS?", level: 2 },
      { id: "architecture", label: "Architecture", level: 2 },
      { id: "server-client", label: "Server / Client", level: 2 },
      { id: "next-steps", label: "Next steps", level: 3 },
    ],
    body: introBody,
  },
  installation: {
    title: "Installation",
    description: "Install BirrJS, configure Chapa, and mount the route handler in your app.",
    toc: [
      { id: "install-the-core-package-and-provider", label: "Install the core package and provider", level: 2 },
      { id: "create-the-birrjs-instance", label: "Create the BirrJS instance", level: 2 },
      { id: "configure-provider", label: "Configure provider", level: 2 },
      { id: "configure-database", label: "Configure database", level: 2 },
      { id: "configure-identify", label: "Configure identify", level: 2 },
      { id: "mount-the-route-handler", label: "Mount the route handler", level: 2 },
      { id: "create-the-client", label: "Create the client", level: 2 },
      { id: "define-plans", label: "Define plans", level: 2 },
      { id: "sync-to-the-database", label: "Sync to the database", level: 2 },
    ],
    body: installBody,
  },
  "quick-start": {
    title: "Quick Start",
    description: "Ship a working subscription flow in three steps.",
    toc: [
      { id: "define-plans", label: "Define your plans", level: 2 },
      { id: "checkout", label: "Create a checkout", level: 2 },
      { id: "entitle", label: "Check entitlements", level: 2 },
    ],
    body: quickStartBody,
  },
  "plans-features": { title: "Plans & Features", description: "Model your pricing as code.", toc: [{ id: "overview", label: "Overview", level: 2 }, { id: "usage", label: "Usage", level: 2 }], body: stub("Plans & Features", "Model your pricing tiers and feature flags as type-safe code.") },
  customers: { title: "Customers", description: "Map your users to billing customers.", toc: [{ id: "overview", label: "Overview", level: 2 }, { id: "usage", label: "Usage", level: 2 }], body: stub("Customers", "Map your application users to billing customers across providers.") },
  subscriptions: { title: "Subscriptions", description: "Create, update, and cancel subscriptions.", toc: [{ id: "overview", label: "Overview", level: 2 }, { id: "usage", label: "Usage", level: 2 }], body: stub("Subscriptions", "Create, update, pause, and cancel subscriptions with a unified API.") },
  scheduling: { title: "Scheduling (Cron)", description: "Recurring billing jobs.", toc: [{ id: "overview", label: "Overview", level: 2 }, { id: "usage", label: "Usage", level: 2 }], body: stub("Scheduling", "Recurring billing jobs and retry logic, powered by your favorite scheduler.") },
  entitlements: { title: "Entitlements", description: "Decide what a user can do.", toc: [{ id: "overview", label: "Overview", level: 2 }, { id: "usage", label: "Usage", level: 2 }], body: stub("Entitlements", "Decide what a user can do based on their active plan and add-ons.") },
  webhooks: { title: "Webhooks", description: "Signed, retried, idempotent.", toc: [{ id: "overview", label: "Overview", level: 2 }, { id: "usage", label: "Usage", level: 2 }], body: stub("Webhooks", "Signed, retried, idempotent webhook handling — no boilerplate required.") },
  database: { title: "Database & Migrations", description: "Schema you own.", toc: [{ id: "overview", label: "Overview", level: 2 }, { id: "usage", label: "Usage", level: 2 }], body: stub("Database", "Schema lives in your database — you keep full control with first-party migrations.") },
  "payment-providers": { title: "Payment Providers", description: "Chapa, ArifPay, Santim Pay, and more.", toc: [{ id: "overview", label: "Overview", level: 2 }, { id: "usage", label: "Usage", level: 2 }], body: stub("Payment Providers", "Chapa, ArifPay, Santim Pay — drop-in adapters for local processors.") },
  plugins: { title: "Plugins", description: "Extend BirrJS.", toc: [{ id: "overview", label: "Overview", level: 2 }, { id: "usage", label: "Usage", level: 2 }], body: stub("Plugins", "Extend BirrJS with first-party and community plugins.") },
  "client-sdk": { title: "Client SDK", description: "React hooks & framework helpers.", toc: [{ id: "overview", label: "Overview", level: 2 }, { id: "usage", label: "Usage", level: 2 }], body: stub("Client SDK", "React hooks and framework helpers, safe to ship to the browser.") },
  cli: { title: "CLI Reference", description: "The birr command-line tool.", toc: [{ id: "overview", label: "Overview", level: 2 }, { id: "usage", label: "Usage", level: 2 }], body: stub("CLI", "The birr command-line tool for scaffolding, migrations, and tooling.") },
};
