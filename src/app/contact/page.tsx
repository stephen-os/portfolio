import type { Metadata } from 'next';
import { PageHeader } from '@/components/ui/PageHeader';
import { PageLayout } from '@/components/ui/PageLayout';
import { ContactInfo } from '@/components/pages/contact/ContactInfo';
import { ContactForm } from '@/components/pages/contact/ContactForm';

const description =
  'Get in touch with Stephen Watson about projects, collaboration, opportunities, or graphics programming.';

export const metadata: Metadata = {
  title: 'Contact',
  description,
  alternates: { canonical: '/contact' },
};

// Server component so the page can export metadata — a `"use client"` page
// cannot. The interactive parts live in ContactInfo and ContactForm.
export default function Contact() {
  return (
    <PageLayout>
      <PageHeader
        title="Get In Touch"
        subtitle={
          <>
            Ready to collaborate on something{' '}
            <span className="text-accent">amazing</span>?
          </>
        }
        description="Whether you want to discuss a project, collaborate on something creative, explore new opportunities, or just chat about graphics programming and development, I'd love to hear from you."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <ContactInfo />
        <ContactForm />
      </div>
    </PageLayout>
  );
}
