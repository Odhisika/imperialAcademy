import Link from 'next/link'
import { pageMetadata, SCHOOL } from '@/lib/seo'
import SchoolNavbar from '@/components/SchoolNavbar'
import SchoolFooter from '@/components/SchoolFooter'

export const metadata = pageMetadata({
    title: 'Privacy Policy',
    description:
        'How Imperial Academy collects, uses and protects personal information submitted through this website, including admissions and contact enquiries.',
    path: '/privacy',
})

const LAST_UPDATED = '18 November 2026'

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-white text-zinc-900 font-sans">
            <SchoolNavbar />

            <main>
                <section className="relative flex items-center overflow-hidden bg-[#00236F] pt-36 pb-16 px-4">
                    <div className="relative z-10 max-w-4xl mx-auto w-full">
                        <p className="text-[#FEA619] font-bold tracking-[0.2em] uppercase text-xs mb-4">
                            Legal
                        </p>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                            Privacy Policy
                        </h1>
                        <p className="text-blue-100 text-lg font-light">
                            Last updated: {LAST_UPDATED}
                        </p>
                    </div>
                </section>

                <section className="py-16 px-4">
                    <div className="max-w-4xl mx-auto prose prose-zinc prose-lg prose-headings:text-[#00236F] prose-a:text-[#00236F]">
                        <p>
                            Imperial Academy respects your privacy. This policy explains what
                            information we collect through imperialacademy.edu.gh, why we collect it
                            and how we look after it.
                        </p>

                        <h2>Information we collect</h2>
                        <ul>
                            <li>
                                <strong>Enquiry details</strong> you submit through our contact or
                                admissions forms, such as your name, email address, telephone number
                                and message.
                            </li>
                            <li>
                                <strong>Application details</strong> submitted for admission,
                                including the prospective pupil&apos;s name, date of birth, class
                                applied for and guardian contact information.
                            </li>
                            <li>
                                <strong>Technical information</strong> such as pages visited and
                                general device or browser information, collected through our hosting
                                and analytics providers in an aggregated form.
                            </li>
                        </ul>

                        <h2>How we use your information</h2>
                        <p>
                            We use your information to respond to enquiries, process admission
                            applications, communicate about school activities and improve this
                            website. We do not sell personal information.
                        </p>

                        <h2>Cookies and local storage</h2>
                        <p>
                            The public website does not use advertising cookies. A secure cookie is
                            stored only when a member of staff signs in to the administration area,
                            and is used to keep that session active. Our analytics provider reports
                            aggregated, non-identifying usage data.
                        </p>

                        <h2>Third-party services</h2>
                        <p>
                            We may use trusted providers for hosting, email delivery and analytics.
                            These providers process data only on our instructions. Links to external
                            websites are governed by those websites&apos; own privacy policies.
                        </p>

                        <h2>Data retention and security</h2>
                        <p>
                            Information is kept only as long as necessary for the purpose it was
                            collected, or as required by law. Access to stored data is restricted to
                            authorised staff.
                        </p>

                        <h2>Your rights</h2>
                        <p>
                            You may request access to, correction of, or deletion of the personal
                            information we hold about you. Contact us using the details below and we
                            will respond within a reasonable period.
                        </p>

                        <h2>Contact us</h2>
                        <p>
                            {SCHOOL.name}
                            <br />
                            {SCHOOL.streetAddress}, Ghana
                            <br />
                            Email: <a href={`mailto:${SCHOOL.email}`}>{SCHOOL.email}</a>
                            <br />
                            Phone: <a href="tel:+233201188847">0201 188 847</a> /{' '}
                            <a href="tel:+233543974931">0543 974 931</a>
                        </p>

                        <p>
                            See also our <Link href="/terms">Terms of Service</Link>.
                        </p>
                    </div>
                </section>
            </main>

            <SchoolFooter />
        </div>
    )
}
