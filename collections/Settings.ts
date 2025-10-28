import { GlobalConfig } from 'payload'

export const Settings: GlobalConfig = {
  slug: 'settings',
  label: 'Setări Generale',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'siteName',
      type: 'text',
      label: 'Nume Site',
      defaultValue: 'Event Venue Buzău',
    },
    {
      name: 'tagline',
      type: 'text',
      label: 'Tagline',
      defaultValue: 'Spațiul tău pentru evenimente perfecte',
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'gallery',
      label: 'Logo',
    },
    {
      name: 'socialMedia',
      type: 'group',
      label: 'Social Media',
      fields: [
        {
          name: 'facebook',
          type: 'text',
          label: 'Facebook URL',
          placeholder: 'https://facebook.com/pagina-ta',
        },
        {
          name: 'instagram',
          type: 'text',
          label: 'Instagram URL',
          placeholder: 'https://instagram.com/username',
        },
        {
          name: 'whatsapp',
          type: 'text',
          label: 'WhatsApp (număr telefon cu prefix)',
          placeholder: '40723456789 (fără +)',
        },
        {
          name: 'tiktok',
          type: 'text',
          label: 'TikTok URL',
          placeholder: 'https://tiktok.com/@username',
        },
      ],
    },
    {
      name: 'contact',
      type: 'group',
      label: 'Informații Contact',
      fields: [
        {
          name: 'email',
          type: 'email',
          label: 'Email',
        },
        {
          name: 'phone',
          type: 'text',
          label: 'Telefon',
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

