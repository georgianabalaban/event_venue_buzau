import { CollectionConfig } from 'payload'

export const FAQs: CollectionConfig = {
  slug: 'faqs',
  admin: {
    useAsTitle: 'question',
    defaultColumns: ['question', 'order'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'question',
      type: 'text',
      required: true,
      label: 'Întrebare',
    },
    {
      name: 'answer',
      type: 'textarea',
      required: true,
      label: 'Răspuns',
    },
    {
      name: 'order',
      type: 'number',
      label: 'Ordine',
      defaultValue: 0,
      admin: {
        description: 'Ordinea în care apare întrebarea (0 = primul)',
      },
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'General', value: 'general' },
        { label: 'Facilități', value: 'facilities' },
        { label: 'Rezervări', value: 'bookings' },
        { label: 'Prețuri', value: 'pricing' },
      ],
      label: 'Categorie',
      defaultValue: 'general',
    },
  ],
}




