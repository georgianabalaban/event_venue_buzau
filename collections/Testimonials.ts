import { CollectionConfig } from 'payload'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'rating', 'createdAt'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Nume Client',
    },
    {
      name: 'text',
      type: 'textarea',
      required: true,
      label: 'Testimonial',
    },
    {
      name: 'rating',
      type: 'number',
      required: true,
      min: 1,
      max: 5,
      defaultValue: 5,
      label: 'Rating (1-5 stele)',
    },
    {
      name: 'eventType',
      type: 'select',
      options: [
        { label: 'Nuntă', value: 'wedding' },
        { label: 'Botez', value: 'baptism' },
        { label: 'Aniversare', value: 'birthday' },
        { label: 'Corporate', value: 'corporate' },
        { label: 'Petrecere', value: 'party' },
        { label: 'Altele', value: 'other' },
      ],
      label: 'Tip Eveniment',
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Afișare pe prima pagină',
      defaultValue: false,
    },
  ],
}







