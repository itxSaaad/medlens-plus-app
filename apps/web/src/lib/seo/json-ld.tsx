export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}

export function JsonLdGroup({ items }: { items: Record<string, unknown>[] }) {
  return (
    <>
      {items.map((item, index) => (
        <JsonLd key={index} data={item} />
      ))}
    </>
  );
}

export type JsonLdProps = { data: Record<string, unknown> };
