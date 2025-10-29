import { CollectionConfig } from 'payload'

export const Gallery: CollectionConfig = {
  slug: 'gallery',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'order',
      type: 'number',
      label: 'Ordine',
      admin: {
        position: 'sidebar',
        description: 'Folosită pentru ordonare manuală în galerie',
      },
      defaultValue: 0,
    },
    {
      name: 'title',
      type: 'text',
      label: 'Titlu',
    },
    {
      name: 'alt',
      type: 'text',
      label: 'Text alternativ',
      required: true,
    },
    {
      name: 'externalUrl',
      type: 'text',
      label: 'URL extern (opțional)',
      admin: {
        description: 'Dacă imaginea este găzduită extern, specifică URL-ul aici. Suprascrie fișierul uploadat.',
      },
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Interior', value: 'indoor' },
        { label: 'Exterior', value: 'outdoor' },
        { label: 'Piscină', value: 'pool' },
        { label: 'Evenimente', value: 'events' },
      ],
      label: 'Categorie',
    },
  ],
}

