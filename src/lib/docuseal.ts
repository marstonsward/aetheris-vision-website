const DOCUSEAL_API_URL = 'https://api.docuseal.com'
const DOCUSEAL_API_KEY = process.env.DOCUSEAL_API_KEY!
const MARSTON_EMAIL = 'marston@aetherisvision.com'

// Build the HTML signature block with embedded DocuSeal field tags
export function buildSignatureBlock(isSelfSign: boolean, signerName: string): string {
  if (isSelfSign) {
    return `
      <div class="signature-block" style="margin-top:48px;padding-top:20px;border-top:2px solid #1e3a5f;">
        <div style="max-width:320px;">
          <p style="font-weight:700;margin-bottom:8px;">Aetheris Vision LLC</p>
          <signature-field name="signature" role="Signer" required="true" style="display:block;margin:8px 0;"></signature-field>
          <date-field name="date" role="Signer" style="display:block;margin:8px 0;"></date-field>
          <p style="font-size:9pt;color:#555;">Marston Ward, Principal</p>
        </div>
      </div>`
  }
  return `
    <div class="signature-block" style="margin-top:48px;padding-top:20px;border-top:2px solid #1e3a5f;display:grid;grid-template-columns:1fr 1fr;gap:40px;">
      <div>
        <p style="font-weight:700;margin-bottom:8px;">Client — ${signerName}</p>
        <signature-field name="signature" role="Signer" required="true" style="display:block;margin:8px 0;"></signature-field>
        <date-field name="date" role="Signer" style="display:block;margin:8px 0;"></date-field>
      </div>
      <div>
        <p style="font-weight:700;margin-bottom:8px;">Aetheris Vision LLC</p>
        <signature-field name="countersignature" role="Countersigner" required="true" style="display:block;margin:8px 0;"></signature-field>
        <date-field name="counterdate" role="Countersigner" style="display:block;margin:8px 0;"></date-field>
        <p style="font-size:9pt;color:#555;">Marston Ward, Principal</p>
      </div>
    </div>`
}

// Send an HTML document for signing via POST /submissions/html
// DocuSeal creates the template + submission in one shot from the raw HTML.
// Field tags (<signature-field>, <date-field>) are embedded directly in the HTML.
export async function sendForSigning({
  html,
  fileName,
  signerName,
  signerEmail,
  ccEmail,
}: {
  html: string        // full HTML document with embedded DocuSeal field tags
  fileName: string
  signerName: string
  signerEmail: string
  ccEmail?: string
}) {
  // If the client IS Marston, single-signer flow to avoid duplicate-email error
  const isSelfSign = signerEmail.toLowerCase() === MARSTON_EMAIL.toLowerCase()

  const submitters = isSelfSign
    ? [{ name: signerName, email: signerEmail, role: 'Signer', send_email: true }]
    : [
        { name: signerName, email: signerEmail, role: 'Signer', send_email: true },
        { name: 'Marston Ward', email: MARSTON_EMAIL, role: 'Countersigner', send_email: true },
      ]

  const response = await fetch(`${DOCUSEAL_API_URL}/submissions/html`, {
    method: 'POST',
    headers: {
      'X-Auth-Token': DOCUSEAL_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: fileName,
      send_email: true,
      documents: [{ name: fileName, html }],
      submitters,
      ...(ccEmail && { message: { subject: 'Please review and sign your Statement of Work', body: ccEmail } }),
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Docuseal API error: ${error}`)
  }

  return response.json()
}

// Get a completed submission (called from webhook)
export async function getSubmission(submissionId: string) {
  const response = await fetch(`${DOCUSEAL_API_URL}/submissions/${submissionId}`, {
    headers: { 'X-Auth-Token': DOCUSEAL_API_KEY },
  })

  if (!response.ok) throw new Error(`Failed to fetch submission ${submissionId}`)
  return response.json()
}

// Download the signed PDF as a buffer
export async function downloadSignedPdf(submissionId: string): Promise<Buffer> {
  const response = await fetch(
    `${DOCUSEAL_API_URL}/submissions/${submissionId}/download`,
    { headers: { 'X-Auth-Token': DOCUSEAL_API_KEY } }
  )

  if (!response.ok) throw new Error(`Failed to download signed PDF for ${submissionId}`)
  return Buffer.from(await response.arrayBuffer())
}
