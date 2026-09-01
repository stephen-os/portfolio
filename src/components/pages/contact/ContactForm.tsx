'use client';

import { useState, useEffect, useRef, SyntheticEvent, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SendIcon, SpinnerIcon } from '@/components/ui/icons';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  // Honeypot — always empty for a real user. See the hidden field below.
  website: string;
}

const emptyForm: FormData = {
  name: '',
  email: '',
  subject: '',
  message: '',
  website: '',
};

type Status = 'idle' | 'loading' | 'success' | 'error';

// Shared styling for every input/select/textarea in the form.
const controlClass =
  'w-full px-4 py-2 rounded-lg outline-none transition-colors focus:ring-2 bg-bg-alt border border-border text-fg';

// Animated form row: staggered reveal, label wired to its control via htmlFor.
function FormField({
  id,
  label,
  required = false,
  delay,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  delay: number;
  children: ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <label htmlFor={id} className="block text-sm font-medium mb-2">
        {label} {required && <span className="text-error">*</span>}
      </label>
      {children}
    </motion.div>
  );
}

export function ContactForm() {
  const [formData, setFormData] = useState<FormData>(emptyForm);
  const [status, setStatus] = useState<Status>('idle');

  // How long the form has been on screen. Sent with the submission so the
  // server can reject instant posts. Measured client-side and sent as a
  // duration rather than a timestamp, so a skewed browser clock can't cause a
  // false positive. Stays 0 until mount, which errs toward letting people
  // through rather than blocking them.
  const mountedAt = useRef(0);
  useEffect(() => {
    mountedAt.current = Date.now();
  }, []);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          elapsedMs: Date.now() - mountedAt.current,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus('success');
      setFormData(emptyForm);
    } catch (err) {
      console.error('Contact submit failed:', err);
      setStatus('error');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="lg:col-span-2"
    >
      <form onSubmit={handleSubmit} className="card space-y-6 relative">
        <h2 className="text-xl font-semibold mb-4">Send me a message</h2>

        {/* Honeypot. Positioned off-screen rather than display:none, which
            some bots skip, and aria-hidden + tabIndex -1 so neither screen
            readers nor keyboard users ever reach it. Any value here means a
            bot, and the server silently discards the submission. */}
        <div
          aria-hidden="true"
          className="absolute left-[-9999px] top-0 w-px h-px overflow-hidden"
        >
          <label htmlFor="contact-website">Website</label>
          <input
            id="contact-website"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
          />
        </div>

        <AnimatePresence mode="wait">
          {status === 'success' && (
            <motion.div
              role="status"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 rounded-lg bg-success/20 border border-success/30 text-success"
            >
              Thank you! Your message has been sent successfully. I&apos;ll get back to you within 24-48 hours.
            </motion.div>
          )}

          {status === 'error' && (
            <motion.div
              role="alert"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 rounded-lg bg-error/20 border border-error/30 text-error"
            >
              Failed to send message. Please try again or contact me directly via email.
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField id="contact-name" label="Name" required delay={0.3}>
            <input
              id="contact-name"
              name="name"
              type="text"
              autoComplete="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Your full name"
              className={controlClass}
            />
          </FormField>
          <FormField id="contact-email" label="Email" required delay={0.35}>
            <input
              id="contact-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="you@example.com"
              className={controlClass}
            />
          </FormField>
        </div>

        <FormField id="contact-subject" label="Subject" delay={0.4}>
          <select
            id="contact-subject"
            name="subject"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            className={controlClass}
          >
            <option value="">Select a topic</option>
            <option value="Project Collaboration">Project Collaboration</option>
            <option value="Job Opportunity">Job Opportunity</option>
            <option value="Consulting Inquiry">Consulting Inquiry</option>
            <option value="Technical Question">Technical Question</option>
            <option value="General Inquiry">General Inquiry</option>
          </select>
        </FormField>

        <FormField id="contact-message" label="Message" required delay={0.45}>
          <textarea
            id="contact-message"
            name="message"
            required
            rows={6}
            minLength={10}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="Tell me about your project, question, or how I can help you..."
            className={`${controlClass} resize-vertical`}
          />
        </FormField>

        <motion.button
          type="submit"
          disabled={status === 'loading'}
          whileHover={{ scale: status === 'loading' ? 1 : 1.02 }}
          whileTap={{ scale: status === 'loading' ? 1 : 0.98 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="w-full py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-bg disabled:cursor-not-allowed bg-accent disabled:bg-muted"
        >
          {status === 'loading' ? (
            <>
              <SpinnerIcon />
              Sending...
            </>
          ) : (
            <>
              Send Message
              <SendIcon />
            </>
          )}
        </motion.button>
      </form>
    </motion.div>
  );
}
