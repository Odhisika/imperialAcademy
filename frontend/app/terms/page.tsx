import Link from 'next/link'
import { pageMetadata, SCHOOL } from '@/lib/seo'
import SchoolNavbar from '@/components/SchoolNavbar'
import SchoolFooter from '@/components/SchoolFooter'
import { getSiteSettings, telHref } from '@/lib/siteSettings'

export const metadata = pageMetadata({
    title: 'Terms of Service',
    description:
        'The terms that govern the use of the Imperial Academy website, including content, admissions information and external links.',
    path: '/terms',
})

const LAST_UPDATED = '18 November 2026'

export default async function TermsPage() {
    const settings = await getSiteSettings()

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
                            Terms of Service
                        </h1>
                        <p className="text-blue-100 text-lg font-light">
                            Last updated: {LAST_UPDATED}
                        </p>
                    </div>
                </section>

                <section className="py-16 px-4">
                    <div className="max-w-4xl mx-auto prose prose-zinc prose-lg prose-headings:text-[#00236F] prose-a:text-[#00236F]">
                        <p>
                            By using imperialacademy.edu.gh you agree to these terms. If you do not
                            agree, please do not use the website.
                        </p>

                        <h2>About this website</h2>
                        <p>
                            This website provides general information about {SCHOOL.name}, its
                            programmes, admissions and activities. Content is published in good faith
                            and may be updated or changed without notice.
                        </p>

                        <h2>Admissions and school information</h2>
                        <p>
                            Information about programmes, fees, dates and admission requirements is
                            provided for guidance only. The school&apos;s official admission
                            documents and the decision of the admissions team prevail in the event of
                            any discrepancy.
                        </p>

                        <h2>Acceptable use</h2>
                        <ul>
                            <li>Do not attempt to gain unauthorised access to any part of the site.</li>
                            <li>Do not submit false, misleading or unlawful information.</li>
                            <li>Do not interfere with the availability or security of the website.</li>
                        </ul>

                        <h2>Intellectual property</h2>
                        <p>
                            The school name, logo, photographs and written content on this site
                            belong to {SCHOOL.name} unless otherwise stated. You may not reproduce
                            them for commercial purposes without permission.
                        </p>

                        <h2>External links</h2>
                        <p>
                            Links to third-party websites, including our school management portal, are
                            provided for convenience. We are not responsible for their content or
                            availability.
                        </p>

                        <h2>Limitation of liability</h2>
                        <p>
                            The website is provided &quot;as is&quot;. To the extent permitted by law,
                            {' '}{SCHOOL.name} is not liable for any loss arising from reliance on the
                            information published here.
                        </p>

                        <h2>Governing law</h2>
                        <p>These terms are governed by the laws of the Republic of Ghana.</p>

                        <h2>Contact</h2>
                        <p>
                            Questions about these terms can be sent to{' '}
                            <a href={`mailto:${settings.email}`}>{settings.email}</a> or by calling{' '}
                            <a href={telHref(settings.phone1)}>{settings.phone1}</a>.
                        </p>

                        <p>
                            See also our <Link href="/privacy">Privacy Policy</Link>.
                        </p>
                    </div>
                </section>
            </main>

            <SchoolFooter />
        </div>
    )
}
