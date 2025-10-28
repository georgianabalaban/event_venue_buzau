import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, phone, eventDate, eventType, guestCount, message } = body

    // Validate required fields
    if (!name || !email || !phone || !eventDate || !eventType) {
      return NextResponse.json(
        { error: 'Toate câmpurile obligatorii trebuie completate' },
        { status: 400 }
      )
    }

    // Save booking to Payload CMS
    const bookingResponse = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        phone,
        eventDate,
        eventType,
        guestCount,
        message,
        status: 'new',
      }),
    })

    if (!bookingResponse.ok) {
      throw new Error('Failed to save booking')
    }

    const booking = await bookingResponse.json()

    // Send email to customer
    const customerEmailData = {
      from: 'Event Venue Buzău <onboarding@resend.dev>',
      to: email,
      subject: 'Confirmare cerere rezervare - Event Venue Buzău',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Mulțumim pentru cererea de rezervare!</h2>
          <p>Bună ${name},</p>
          <p>Am primit cererea ta de rezervare și te vom contacta în cel mai scurt timp pentru a confirma disponibilitatea.</p>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Detalii rezervare:</h3>
            <p><strong>Data eveniment:</strong> ${new Date(eventDate).toLocaleDateString('ro-RO', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}</p>
            <p><strong>Tip eveniment:</strong> ${getEventTypeLabel(eventType)}</p>
            <p><strong>Număr invitați:</strong> ${guestCount || 'Nu a fost specificat'}</p>
            ${message ? `<p><strong>Mesaj:</strong> ${message}</p>` : ''}
          </div>
          
          <p>Pentru orice întrebări, ne poți contacta la:</p>
          <p>📧 ${process.env.BUSINESS_EMAIL}</p>
          
          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
            Cu stimă,<br/>
            Echipa Event Venue Buzău
          </p>
        </div>
      `,
    }

    // Send email to business owner
    const businessEmailData = {
      from: 'Event Venue Buzău <onboarding@resend.dev>',
      to: process.env.BUSINESS_EMAIL || '',
      subject: `Cerere nouă de rezervare - ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Cerere nouă de rezervare!</h2>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Detalii client:</h3>
            <p><strong>Nume:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Telefon:</strong> ${phone}</p>
            
            <h3>Detalii eveniment:</h3>
            <p><strong>Data:</strong> ${new Date(eventDate).toLocaleDateString('ro-RO', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}</p>
            <p><strong>Tip eveniment:</strong> ${getEventTypeLabel(eventType)}</p>
            <p><strong>Număr invitați:</strong> ${guestCount || 'Nu a fost specificat'}</p>
            ${message ? `<p><strong>Mesaj:</strong> ${message}</p>` : ''}
          </div>
          
          <p><a href="${process.env.NEXT_PUBLIC_SERVER_URL}/admin/collections/bookings/${booking.doc.id}" 
             style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Vezi în Admin Panel
          </a></p>
        </div>
      `,
    }

    // Send both emails
    try {
      await Promise.all([
        resend.emails.send(customerEmailData),
        resend.emails.send(businessEmailData),
      ])
    } catch (emailError) {
      console.error('Email error:', emailError)
      // Continue even if email fails - booking is still saved
    }

    return NextResponse.json({
      success: true,
      message: 'Rezervarea a fost trimisă cu succes!',
      booking: booking.doc,
    })
  } catch (error) {
    console.error('Booking error:', error)
    return NextResponse.json(
      { error: 'A apărut o eroare. Te rugăm să încerci din nou.' },
      { status: 500 }
    )
  }
}

function getEventTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    corporate: 'Corporate',
    party: 'Petrecere',
    wedding: 'Nuntă',
    birthday: 'Aniversare',
    other: 'Altele',
  }
  return labels[type] || type
}

