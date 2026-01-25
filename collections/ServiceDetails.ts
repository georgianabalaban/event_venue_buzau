import { CollectionConfig } from 'payload'

export const ServiceDetails: CollectionConfig = {
  slug: 'service-details',
  admin: {
    useAsTitle: 'serviceName',
    defaultColumns: ['serviceName', 'updatedAt'],
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
  },
  fields: [
    {
      name: 'serviceName',
      type: 'text',
      required: true,
      label: 'Nume Serviciu',
      admin: {
        description: 'Trebuie să corespundă exact cu numele serviciului (ex: Petreceri de copii)',
      },
    },
    {
      name: 'heroImage',
      type: 'relationship',
      relationTo: 'gallery',
      label: 'Imagine Hero (Principală)',
      admin: {
        description: 'Imaginea mare de la începutul modalului',
      },
    },
    {
      name: 'gallery',
      type: 'array',
      label: 'Galerie (4-5 imagini cu descrieri)',
      minRows: 1,
      maxRows: 5,
      fields: [
        {
          name: 'image',
          type: 'relationship',
          relationTo: 'gallery',
          required: true,
          label: 'Imagine',
        },
        {
          name: 'title',
          type: 'text',
          label: 'Titlu (opțional)',
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
          label: 'Descriere (2-3 propoziții)',
          admin: {
            rows: 3,
          },
        },
      ],
    },
    {
      name: 'ctaText',
      type: 'text',
      label: 'Text Buton CTA',
      defaultValue: 'Rezervă acum',
    },
    {
      name: 'ctaLink',
      type: 'text',
      label: 'Link Buton CTA',
      defaultValue: '#contact',
    },
  ],
}

