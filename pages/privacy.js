import Head from 'next/head';
import { ExternalLinkIcon } from '@heroicons/react/solid';

export default function Privacy() {
  return (
    <>
      <Head>
        <title>Privacy Policy – Mental Math Trainer</title>
        <meta
          name='description'
          content='How Mental Math Trainer collects and uses your information.'
        />
      </Head>
      <div className='mx-4 my-8 flex flex-col gap-5 sm:gap-8'>
        <div className='flex flex-col gap-1'>
          <h1 className='text-2xl font-semibold'>Privacy policy</h1>
          <p className='text-zinc-400'>Last updated: September 30, 2026</p>
        </div>
        <p>
          Mental Math Trainer (www.mathtrainer.xyz) is a web app for practicing
          mental math. This policy explains what information the site collects,
          how it is used, and the choices you have. You can use the trainer
          without an account. Signing in is only needed to save your times and
          track your progress.
        </p>
        <Section title='Information we collect'>
          <BulletList>
            <li>
              <strong className='font-semibold'>Account information.</strong>{' '}
              When you sign in with Google or GitHub, we receive your name,
              email address, and profile picture from that service, along with
              an account identifier and sign-in tokens. When you sign in with
              email, we receive your email address. We also store the display
              name that you choose.
            </li>
            <li>
              <strong className='font-semibold'>Practice data.</strong> When you
              are signed in, we store the problems that you solve (the numbers,
              your solve times, and when you solved them) and your personal
              records.
            </li>
            <li>
              <strong className='font-semibold'>Usage data.</strong> Cloudflare
              Web Analytics collects information about how the site is used,
              such as the pages visited, the referring website, country, and
              device and browser type. It does not use cookies or identify
              individual visitors. Our hosting provider also keeps standard
              server logs, which include IP addresses.
            </li>
          </BulletList>
        </Section>
        <Section title='How we use your information'>
          <p>We use your information to:</p>
          <BulletList>
            <li>sign you in and keep you signed in</li>
            <li>save your practice data and show your stats and records</li>
            <li>understand how the site is used and improve it</li>
          </BulletList>
          <p>
            We do not sell your personal information, and we do not send
            marketing emails. Information received from Google or GitHub sign-in
            is used only to sign you in, identify your account, and set your
            initial display name. Our use of information received from Google
            APIs adheres to the{' '}
            <a
              href='https://developers.google.com/terms/api-services-user-data-policy'
              target='_blank'
              rel='noreferrer'
              className='text-blue-400 underline'
            >
              Google API Services User Data Policy
            </a>
            <ExternalLinkIcon className='inline h-5 w-5 text-blue-400' />.
          </p>
          <p>
            We process account and practice data because it is necessary to
            provide the features you sign up for, and usage data based on our
            legitimate interest in understanding and improving the site.
          </p>
        </Section>
        <Section title='Who we share your information with'>
          <p>We share your information only with the following services:</p>
          <BulletList>
            <li>Vercel hosts the site.</li>
            <li>
              Supabase stores account and practice data in a database in the
              United States.
            </li>
            <li>Google and GitHub provide sign-in, if you choose them.</li>
            <li>Amazon Web Services sends sign-in emails.</li>
            <li>Cloudflare provides usage statistics.</li>
          </BulletList>
          <p>
            These services may process your information in countries other than
            your own, including the United States. Where required, these
            transfers are protected by safeguards such as standard contractual
            clauses.
          </p>
        </Section>
        <Section title='How long we store your information'>
          <p>
            Your account and practice data are kept until you delete them. On
            the Stats page, you can delete your practice data for one problem
            type or for all problem types. From the menu at the top left, you
            can delete your account. This permanently deletes all of your data.
            Deleted data may remain in database backups for up to 7 days before
            it is removed.
          </p>
          <p>
            Usage statistics are kept by Cloudflare for a limited time. Server
            logs are kept for a short time by our hosting provider.
          </p>
        </Section>
        <Section title='Cookies and browser storage'>
          <p>
            The site only uses cookies for signing in. They keep you signed in
            and are required for accounts to work. Your trainer settings are
            saved in your browser&apos;s local storage so that they are
            remembered between visits. They are not sent to our servers.
          </p>
        </Section>
        <Section title='Security'>
          <p>
            The site is served over HTTPS, so information is encrypted between
            your browser and our servers. Access to the database is restricted.
          </p>
        </Section>
        <Section title='Your rights'>
          <p>
            You can view your stats and records on the Stats page, change your
            display name from the menu at the top left, and delete your data as
            described above. To request a copy of your data, correct information
            that you cannot change yourself, or make any other privacy request,
            contact us using the email address below. Depending on where you
            live, you may also have the right to object to or restrict how your
            information is used, and to complain to your local data protection
            authority.
          </p>
        </Section>
        <Section title='Changes to this policy'>
          <p>
            If this policy changes, the date at the top of this page will be
            updated.
          </p>
        </Section>
        <Section title='Contact'>
          <p>
            For questions about this policy or your information, contact Mental
            Math Trainer at{' '}
            <a
              href='mailto:dev@mathtrainer.xyz'
              className='text-blue-400 underline'
            >
              dev@mathtrainer.xyz
            </a>
            .
          </p>
        </Section>
      </div>
    </>
  );
}

function Section({ title, children }) {
  return (
    <section className='flex flex-col gap-2'>
      <h2 className='text-xl font-medium'>{title}</h2>
      {children}
    </section>
  );
}

function BulletList({ children }) {
  return <ul className='flex list-disc flex-col gap-1 pl-6'>{children}</ul>;
}
