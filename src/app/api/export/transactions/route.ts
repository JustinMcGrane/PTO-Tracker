import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getPrimaryPolicy, getDefaultBucket, getSubscription } from "@/lib/pto/queries";
import { minutesToHours } from "@/lib/pto/calculations";
import { isPremium } from "@/lib/plan";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const subscription = await getSubscription(user.id);
  if (!isPremium(subscription)) {
    return NextResponse.json({ error: "PTO history export is a Premium feature." }, { status: 403 });
  }

  const policy = await getPrimaryPolicy(user.id);
  const bucket = getDefaultBucket(policy);
  if (!bucket) {
    return NextResponse.json({ error: "No PTO policy found." }, { status: 404 });
  }

  const transactions = await prisma.ptoTransaction.findMany({
    where: { bucketId: bucket.id },
    orderBy: { occurredOn: "desc" },
  });

  const header = "date,type,hours,note\n";
  const rows = transactions
    .map((t) =>
      [
        t.occurredOn.toISOString().slice(0, 10),
        t.type,
        minutesToHours(t.amountMinutes).toFixed(2),
        csvEscape(t.note ?? ""),
      ].join(",")
    )
    .join("\n");

  return new NextResponse(header + rows, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": 'attachment; filename="pto-history.csv"',
    },
  });
}

function csvEscape(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}
