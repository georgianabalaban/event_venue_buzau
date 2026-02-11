import { CollectionConfig } from 'payload'

export const Bookings: CollectionConfig = {
  slug: 'bookings',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'eventDate', 'status', 'createdAt'],
  },
  // Permitem crearea de booking-uri direct din site, fără autentificare în Payload
  // (citirea și modificarea lor rămân rezervate pentru admin)
  access: {
    read: () => false,
    create: () => true,
    update: () => false,
    delete: () => false,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Nume',
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      label: 'Email',
    },
    {
      name: 'phone',
      type: 'text',
      required: true,
      label: 'Telefon',
    },
    {
      name: 'eventDate',
      type: 'date',
      required: true,
      label: 'Data evenimentului',
    },
    {
      name: 'eventType',
      type: 'select',
      options: [
        { label: 'Corporate', value: 'corporate' },
        { label: 'Petrecere', value: 'party' },
        { label: 'Nuntă', value: 'wedding' },
        { label: 'Aniversare', value: 'birthday' },
        { label: 'Altele', value: 'other' },
      ],
      label: 'Tip eveniment',
    },
    {
      name: 'guestCount',
      type: 'number',
      label: 'Număr invitați',
    },
    {
      name: 'message',
      type: 'textarea',
      label: 'Mesaj',
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Nou', value: 'new' },
        { label: 'Confirmat', value: 'confirmed' },
        { label: 'Anulat', value: 'cancelled' },
      ],
      defaultValue: 'new',
      label: 'Status',
      admin: {
        position: 'sidebar',
      },
    },
  ],
}

