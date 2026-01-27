import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

// GET - Fetch all events
export async function GET() {
  try {
    const payload = await getPayload({ config })
    
    const events = await payload.find({
      collection: 'events',
      sort: 'date',
      limit: 100,
    })

    const formattedEvents = events.docs.map((event: any) => ({
      id: event.id,
      title: event.title,
      description: event.description,
      date: event.date,
      category: event.category,
      price: event.price,
      availableSpots: event.availableSpots,
    }))

    return NextResponse.json(formattedEvents)
  } catch (error) {
    console.error('Error fetching events:', error)
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    )
  }
}

// POST - Create new event
export async function POST(request: Request) {
  try {
    const payload = await getPayload({ config })
    const body = await request.json()

    const newEvent = await payload.create({
      collection: 'events',
      data: {
        title: body.title,
        description: body.description,
        date: body.date,
        category: body.category,
        price: body.price,
        availableSpots: body.availableSpots,
      },
    })

    return NextResponse.json({
      id: newEvent.id,
      title: newEvent.title,
      description: newEvent.description,
      date: newEvent.date,
      category: newEvent.category,
      price: newEvent.price,
      availableSpots: newEvent.availableSpots,
    })
  } catch (error) {
    console.error('Error creating event:', error)
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    )
  }
}

// PUT - Update event
export async function PUT(request: Request) {
  try {
    const payload = await getPayload({ config })
    const body = await request.json()
    const { id, ...data } = body

    const updatedEvent = await payload.update({
      collection: 'events',
      id,
      data,
    })

    return NextResponse.json({
      id: updatedEvent.id,
      title: updatedEvent.title,
      description: updatedEvent.description,
      date: updatedEvent.date,
      category: updatedEvent.category,
      price: updatedEvent.price,
      availableSpots: updatedEvent.availableSpots,
    })
  } catch (error) {
    console.error('Error updating event:', error)
    return NextResponse.json(
      { error: 'Failed to update event' },
      { status: 500 }
    )
  }
}

// DELETE - Delete event
export async function DELETE(request: Request) {
  try {
    const payload = await getPayload({ config })
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Event ID is required' },
        { status: 400 }
      )
    }

    await payload.delete({
      collection: 'events',
      id,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting event:', error)
    return NextResponse.json(
      { error: 'Failed to delete event' },
      { status: 500 }
    )
  }
}
