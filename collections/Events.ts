import { CollectionConfig } from 'payload'

export const Events: CollectionConfig = {
  slug: 'events',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'date', 'category'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Titlu eveniment',
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Descriere',
    },
    {
      name: 'date',
      type: 'date',
      required: true,
      label: 'Data evenimentului',
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Corporate', value: 'corporate' },
        { label: 'Petrecere', value: 'party' },
        { label: 'Nuntă', value: 'wedding' },
        { label: 'Aniversare', value: 'birthday' },
        { label: 'Altele', value: 'other' },
      ],
      label: 'Categorie',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'gallery',
      label: 'Imagine',
    },
    {
      name: 'price',
      type: 'number',
      label: 'Preț (lei)',
    },
    {
      name: 'availableSpots',
      type: 'number',
      label: 'Locuri disponibile',
    },
  ],
}

