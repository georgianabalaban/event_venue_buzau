import { CollectionConfig } from 'payload'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Titlu',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
      },
      label: 'URL Slug',
    },
    {
      name: 'hero',
      type: 'group',
      label: 'Secțiune Hero',
      fields: [
        {
          name: 'heading',
          type: 'text',
          label: 'Titlu Principal',
        },
        {
          name: 'subheading',
          type: 'textarea',
          label: 'Subtitlu',
        },
        {
          name: 'ctaText',
          type: 'text',
          label: 'Text Buton',
        },
        {
          name: 'backgroundImage',
          type: 'upload',
          relationTo: 'gallery',
          label: 'Imagine de fundal',
        },
      ],
    },
    {
      name: 'about',
      type: 'group',
      label: 'Despre Noi',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Titlu',
        },
        {
          name: 'description',
          type: 'richText',
          label: 'Descriere',
        },
        {
          name: 'features',
          type: 'array',
          label: 'Facilități',
          fields: [
            {
              name: 'feature',
              type: 'text',
              label: 'Facilitate',
            },
          ],
        },
      ],
    },
    {
      name: 'services',
      type: 'group',
      label: 'Servicii',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Titlu',
        },
        {
          name: 'items',
          type: 'array',
          label: 'Servicii',
          fields: [
            {
              name: 'name',
              type: 'text',
              label: 'Nume serviciu',
            },
            {
              name: 'description',
              type: 'textarea',
              label: 'Descriere',
            },
            {
              name: 'icon',
              type: 'text',
              label: 'Icon (lucide-react name)',
            },
          ],
        },
      ],
    },
    {
      name: 'contact',
      type: 'group',
      label: 'Contact',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Titlu',
        },
        {
          name: 'phone',
          type: 'text',
          label: 'Telefon',
        },
        {
          name: 'email',
          type: 'email',
          label: 'Email',
        },
        {
          name: 'address',
          type: 'textarea',
          label: 'Adresă',
        },
      ],
    },
  ],
}

