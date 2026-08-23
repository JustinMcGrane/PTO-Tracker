import { requireActiveSubscription } from "@/lib/auth";
import { getDefaultBucket, getPrimaryPolicy, listTransactions } from "@/lib/pto/queries";
import { minutesToHours } from "@/lib/pto/calculations";
import { formatDate } from "@/lib/pto/format";
import { Card } from "@/components/ui/Card";
import { TransactionForm } from "@/components/dashboard/TransactionForm";

const TYPE_LABELS: Record<string, string> = {
  EARNED: "Earned",
  USED: "Used",
  ADJUSTMENT: "Adjustment",
};

export default async function ActivityPage() {
  const user = await requireActiveSubscription();
  const policy = await getPrimaryPolicy(user.id);
  const bucket = getDefaultBucket(policy);

  const transactions = bucket ? await listTransactions(bucket.id, 200) : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl">PTO activity</h1>
          <p className="mt-1 text-ink-600">Record PTO earned, used, or adjusted, with a note.</p>
        </div>
        <a href="/api/export/transactions" className="text-sm font-medium text-brand-700 hover:text-brand-800">
          Export CSV
        </a>
      </div>

      <Card>
        <h2 className="mb-4 text-lg text-ink-900">Add an entry</h2>
        <TransactionForm />
      </Card>

      <Card>
        <h2 className="mb-4 text-lg text-ink-900">History</h2>
        {transactions.length === 0 ? (
          <p className="text-sm text-ink-500">No activity recorded yet.</p>
        ) : (
          <div className="overflow-hidden rounded-lg border border-ink-200">
            {transactions.map((t, i) => (
              <div
                key={t.id}
                className={`flex items-center justify-between px-4 py-3 text-sm ${i > 0 ? "border-t border-ink-200" : ""}`}
              >
                <div>
                  <p className="font-medium text-ink-900">
                    {TYPE_LABELS[t.type]} · {formatDate(t.occurredOn)}
                  </p>
                  {t.note && <p className="text-ink-500">{t.note}</p>}
                </div>
                <p className={`font-medium ${t.amountMinutes < 0 ? "text-red-600" : "text-brand-700"}`}>
                  {t.amountMinutes >= 0 ? "+" : ""}
                  {minutesToHours(t.amountMinutes).toFixed(2)} hrs
                </p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
