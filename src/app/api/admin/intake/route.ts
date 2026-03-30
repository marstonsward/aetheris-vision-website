import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { cookies } from 'next/headers';

function isAuthorized(): boolean {
  const cookieStore = cookies();
  const passphrase = cookieStore.get('admin_passphrase')?.value;
  return passphrase === process.env.ADMIN_PASSPHRASE;
}

export async function GET() {
  if (!isAuthorized()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const submissions = await sql`
      SELECT
        i.id,
        i.status,
        i.company_name,
        i.industry,
        i.location,
        i.revenue,
        i.contact_name,
        i.contact_title,
        i.contact_email,
        i.contact_phone,
        i.budget_range,
        i.timeline,
        i.objectives,
        i.special_requirements,
        i.questions_for_us,
        i.client_id,
        i.project_id,
        i.submitted_at
      FROM intake_submissions i
      ORDER BY i.submitted_at DESC
    `;
    return NextResponse.json({ submissions });
  } catch (error) {
    console.error('Failed to fetch intake submissions:', error);
    return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  if (!isAuthorized()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id, status } = await request.json();
    const validStatuses = ['new', 'in_review', 'sow_sent', 'won', 'lost'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    await sql`
      UPDATE intake_submissions SET status = ${status} WHERE id = ${id}
    `;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update intake status:', error);
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 });
  }
}
