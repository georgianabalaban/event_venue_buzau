import { CollectionConfig } from 'payload'

export const Gallery: CollectionConfig = {
  slug: 'gallery',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true,
  },
  upload: {
    staticDir: 'public/media',
    mimeTypes: ['image/*'],
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
      },
      {
        name: 'card',
        width: 768,
        height: 1024,
        position: 'centre',
      },
      {
        name: 'tablet',
        width: 1024,
        height: undefined,
        position: 'centre',
      },
    ],
    adminThumbnail: 'thumbnail',
  },
  fields: [
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

