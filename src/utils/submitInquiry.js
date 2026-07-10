export async function submitInquiry(inquiry) {
  const response = await fetch('/api/submit-inquiry', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(inquiry),
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.error || 'Could not submit inquiry. Please try again or contact us on WhatsApp.')
  }

  return data
}
