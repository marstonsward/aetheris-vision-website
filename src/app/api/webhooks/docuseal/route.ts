import { NextRequest, NextResponse } from 'next/server'
import { createHmac, timingSafeEqual } from 'crypto'
import { downloadSignedPdf } from '@/lib/docuseal'
import { sql } from '@/lib/db'

// Verify the request is genuinely from Docuseal
function verifySignature(payload: string, signature: string, secret: string): boolean {
  const expected = createHmac('sha256', secret)
    .update(payload)
    .digest('hex')
  try {
    return timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
  } catch {
    return false
  }
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text()
  const signature = request.headers.get('x-docuseal-signature') ?? ''
  const secret = process.env.DOCUSEAL_WEBHOOK_SECRET ?? ''

  // Reject requests that don't have a valid signature
  if (!secret || !verifySignature(rawBody, signature, secret)) {
    console.warn('Docuseal webhook: invalid signature — request rejected')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const payload = JSON.parse(rawBody)

  // Only handle fully completed submissions
  if (payload.event_type !== 'submission.completed') {
    return NextResponse.json({ received: true })
  }

  const { submission } = payload
  const submissionId = String(submission.id)

  try {
    // Download the signed PDF from Docuseal
    const pdfBuffer = await downloadSignedPdf(submissionId)
    const pdfBase64 = pdfBuffer.toString('base64')

    // Look up the project linked to this submission
    const rows = await sql`
      SELECT p.id as project_id, c.name as client_name
      FROM projects p
      JOIN clients c ON c.id = p.client_id
      WHERE p.docuseal_submission_id = ${submissionId}
    `

    if (rows.length > 0) {
      const { project_id, client_name } = rows[0]

      // Store signed PDF and mark project as signed
      await sql`
        UPDATE projects
        SET signed_pdf_base64 = ${pdfBase64},
            status = 'signed',
            signed_at = NOW()
        WHERE id = ${project_id}
      `

      console.log(`Signed PDF stored for project ${project_id} (${client_name})`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Docuseal webhook error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
