export function StructuredData() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.refzone.com.au'

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'RefZone',
    url: siteUrl,
    logo: `${siteUrl}/placeholder-logo.png`,
    description: 'Advanced football referee training platform with quizzes, scenarios, and expert analysis.',
    sameAs: [
      // Add social media links when available
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Support',
      availableLanguage: 'English',
    },
  }

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'RefZone',
    url: siteUrl,
    description: 'Master the Laws of the Game with algorithm-driven scenarios, quizzes, and expert analysis.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/forum?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }

  const educationalOrganizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'RefZone',
    url: siteUrl,
    description: 'Professional referee training platform offering comprehensive education in football officiating.',
    educationalCredentialAwarded: 'Referee Training Certification',
    offers: {
      '@type': 'Offer',
      category: 'Education',
      itemOffered: {
        '@type': 'Course',
        name: 'Football Referee Training',
        description: 'Comprehensive training covering all 17 Laws of the Game',
        provider: {
          '@type': 'Organization',
          name: 'RefZone',
        },
      },
    },
  }

  const softwareApplicationSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'RefZone',
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Web',
    url: siteUrl,
    description: 'Football referee training platform with 500+ quiz questions, 100+ match scenarios, AI-powered decision analysis, and performance analytics. Free for Australian referees.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'AUD',
      description: 'Free referee training platform',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '120',
      bestRating: '5',
      worstRating: '1',
    },
    featureList: 'Laws of the Game quizzes, Match scenarios, AI Decision Lab, Performance analytics, Daily streaks, Weekly quiz',
    screenshot: `${siteUrl}/og-image.jpg`,
    author: {
      '@type': 'Organization',
      name: 'RefZone',
      url: siteUrl,
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(educationalOrganizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationSchema) }}
      />
    </>
  )
}
