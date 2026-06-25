import { Check, X } from "lucide-react";
import type { ComparisonRow } from "@medlens/types";

interface ComparisonTableProps {
  title: string;
  rows: ComparisonRow[];
}

function CellValue({ value }: { value: boolean | string }) {
  if (value === true) return <Check className="mx-auto size-5 text-success" aria-label="Yes" />;
  if (value === false) return <X className="mx-auto size-5 text-muted" aria-label="No" />;
  return <span className="text-sm text-muted">{value}</span>;
}

export function ComparisonTable({ title, rows }: ComparisonTableProps) {
  return (
    <section aria-labelledby="comparison-heading" className="section-padding">
      <div className="container-marketing">
        <h2 id="comparison-heading" className="text-center">
          {title}
        </h2>
        <div className="mt-10 overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-surface">
                <th scope="col" className="p-4 font-semibold text-ink">
                  Feature
                </th>
                <th scope="col" className="p-4 font-semibold text-lens">
                  MedLens+
                </th>
                <th scope="col" className="p-4 font-semibold text-muted">
                  PDFs in a folder
                </th>
                <th scope="col" className="p-4 font-semibold text-muted">
                  Generic AI chat
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.feature} className="border-b border-border last:border-0">
                  <th scope="row" className="p-4 font-medium text-ink">
                    {row.feature}
                  </th>
                  <td className="p-4 text-center">
                    <CellValue value={row.medlens} />
                  </td>
                  <td className="p-4 text-center">
                    <CellValue value={row.pdfs} />
                  </td>
                  <td className="p-4 text-center">
                    <CellValue value={row.genericAi} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
