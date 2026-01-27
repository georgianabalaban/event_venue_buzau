import { CollectionConfig } from 'payload'

export const Events: CollectionConfig = {
  slug: 'events',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'date', 'category', 'price', 'availableSpots'],
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Titlu',
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      label: 'Descriere',
    },
    {
      name: 'date',
      type: 'date',
      required: true,
      label: 'Dată eveniment',
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      label: 'Categorie',
      options: [
        { label: 'Corporate', value: 'corporate' },
        { label: 'Petrecere', value: 'party' },
        { label: 'Nuntă', value: 'wedding' },
        { label: 'Aniversare', value: 'birthday' },
        { label: 'Altele', value: 'other' },
      ],
      defaultValue: 'party',
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      label: 'Preț (RON)',
      min: 0,
    },
    {
      name: 'availableSpots',
      type: 'number',
      required: true,
      label: 'Locuri disponibile',
      min: 0,
    },
  ],
}
