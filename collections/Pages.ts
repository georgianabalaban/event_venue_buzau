import { CollectionConfig } from 'payload'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
  },
  access: {
  	read: () => true,
    create: () => true,
    update: () => true,
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
          name: 'secondaryHeading',
          type: 'text',
          label: 'Titlu Secundar',
          defaultValue: 'prind viață',
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
        {
          name: 'image',
          type: 'relationship',
          relationTo: 'gallery',
          label: 'Imagine Despre noi'
        }
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
      name: 'story',
      type: 'group',
      label: 'Povestea noastră',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Titlu secțiune',
        },
        {
          name: 'content',
          type: 'richText',
          label: 'Conținut (poți folosi bold/italic/listă)',
        },
        {
          name: 'highlight',
          type: 'textarea',
          label: 'Text evidențiat (apare în chenar separat)'
        },
        {
          name: 'missionTitle',
          type: 'text',
          label: 'Titlu misiune'
        },
        {
          name: 'missionText',
          type: 'textarea',
          label: 'Text misiune'
        },
        {
          name: 'points',
          type: 'array',
          label: 'Puncte evidențiate',
          labels: { singular: 'Punct', plural: 'Puncte' },
          fields: [
            { name: 'title', type: 'text', label: 'Titlu' },
            { name: 'text', type: 'textarea', label: 'Text' },
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
    {
      name: 'header',
      type: 'group',
      label: 'Header Navigație',
      fields: [
        {
          name: 'siteName',
          type: 'text',
          label: 'Nume/logo site (stânga header)'
        },
        {
          name: 'nav',
          type: 'array',
          label: 'Linkuri meniu',
          fields: [
            { name: 'label', type: 'text', label: 'Text Buton/Link' },
            { name: 'href', type: 'text', label: 'Href (ex: #about, /contact)' },
            { name: 'cta', type: 'checkbox', label: 'Buton CTA?' }
          ]
        }
      ]
    }
  ],
}

