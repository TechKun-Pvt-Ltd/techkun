import {contactMailAddress} from "@/app/utils/constants";

export const LAST_UPDATED = "August 15, 2026";

export type LegalBlock =
    | { type: "heading"; level: 3 | 4 | 5; text: string; id?: string }
    | { type: "p"; text: string }
    | { type: "ul"; items: string[] }
    | { type: "dl"; items: { term: string; def: string }[] }
    | { type: "fields"; items: { label: string; value: string; email?: boolean }[] }
    | { type: "email"; address: string; label?: string };

export const TOC_ITEMS: { id: string; title: string }[] = [
    { id: "section-1", title: "Owner and Data Controller" },
    { id: "section-2", title: "Types of Data Collected" },
    { id: "section-3", title: "Mode and Place of Processing the Data" },
    { id: "section-4", title: "The Purpose of Processing" },
    { id: "section-5", title: "Detailed Information on the Processing of Personal Data" },
    { id: "section-6", title: "Cookie Policy" },
    { id: "section-7", title: "Further Information for Users" },
    { id: "section-8", title: "Further Information for Users in Brazil" },
    { id: "section-9", title: "Further Information for Users in the United States" },
    { id: "section-10", title: "Information for Users in India" },
    { id: "section-11", title: "Additional Information About Data Collection and Processing" }
];

export const SUMMARY_BLOCKS: LegalBlock[] = [
    { type: "p", text: "TechKun is an informational website. We do not collect personal information directly from visitors." },
    { type: "p", text: "We use cookies and analytics tools (such as Google Analytics) to understand website usage and improve performance." },
    { type: "p", text: "No data is sold by us." },
    { type: "p", text: "By using this Website, you consent to the use of cookies as described in our Privacy Policy." }
];

export const TRIMMED_BLOCKS: LegalBlock[] = [
    { type: "p", text: "TechKun is operated by TechKunEx Digital Solutions Pvt. Ltd., located at 28, Royal Market, Bhopal, MP, India – 462001." },
    { type: "email", address: contactMailAddress, label: `Contact: ${contactMailAddress}` },
    { type: "p", text: "This Website is a marketing and informational website only." },

    { type: "heading", level: 4, text: "What Data We Collect" },
    { type: "p", text: "We do not collect personal information such as names, phone numbers, or addresses." },
    { type: "p", text: "We may collect Usage Data automatically, including:" },
    { type: "ul", items: [
        "IP address (anonymized where applicable)",
        "Browser and device information",
        "Pages visited and interaction data",
        "Cookies and tracking data"
    ] },

    { type: "heading", level: 4, text: "How We Collect Data" },
    { type: "ul", items: [
        "Through analytics tools like Google Analytics",
        "Through cookies shown via our cookie consent banner",
        "Through technical infrastructure (hosting and servers)"
    ] },
    { type: "p", text: "No forms or user accounts exist on this Website." },

    { type: "heading", level: 4, text: "Why We Use This Data" },
    { type: "ul", items: [
        "To understand how visitors use the Website",
        "To improve content, performance, and security",
        "To maintain and operate the Website"
    ] },
    { type: "p", text: "We do not:" },
    { type: "ul", items: [
        "Sell personal data",
        "Run targeted advertising",
        "Perform automated decision-making"
    ] },

    { type: "heading", level: 4, text: "Third-Party Services" },
    { type: "p", text: "We use:" },
    { type: "ul", items: [
        "Google Analytics – traffic and usage analysis",
        "Vercel – server and deployment infrastructure",
        "GoDaddy – domain and hosting services"
    ] },
    { type: "p", text: "These providers may process data according to their own privacy policies." },

    { type: "heading", level: 4, text: "Cookies" },
    { type: "p", text: "Cookies are used for:" },
    { type: "ul", items: [
        "Essential website functionality",
        "Analytics (with user consent)"
    ] },
    { type: "p", text: "You can manage cookie preferences through your browser or our cookie banner." },

    { type: "heading", level: 4, text: "Your Rights" },
    { type: "p", text: "Depending on your location, you may have rights to:" },
    { type: "ul", items: [
        "Access or delete your data",
        "Withdraw consent",
        "Object to certain processing"
    ] },
    { type: "email", address: contactMailAddress, label: `Requests can be sent to ${contactMailAddress}` }
];

export const FULL_POLICY_BLOCKS: LegalBlock[] = [
    { type: "p", text: "This Privacy Policy explains how TechKun (operated by TechKunEx Digital Solutions Pvt. Ltd.) collects, uses, and protects information when Users visit this Website." },
    { type: "p", text: "This Website is a marketing and informational website only. No services are sold, no payments are processed, and no user accounts are created on this Website." },

    { type: "heading", level: 3, text: "1. Owner and Data Controller", id: "section-1" },
    { type: "fields", items: [
        { label: "Name", value: "TechKun" },
        { label: "Operated by", value: "TechKunEx Digital Solutions Pvt. Ltd." },
        { label: "Address", value: "28, Royal Market, Bhopal, Madhya Pradesh, India – 462001" }
    ] },
    { type: "email", address: contactMailAddress, label: `Email: ${contactMailAddress}` },
    { type: "p", text: "The Data Controller determines the purposes and means of processing Personal Data on this Website." },

    { type: "heading", level: 3, text: "2. Types of Data Collected", id: "section-2" },
    { type: "p", text: "This Website does not collect Personal Data directly from Users." },
    { type: "p", text: "However, the following data may be collected automatically through third-party services and technical infrastructure:" },
    { type: "ul", items: [
        "Usage Data",
        "Device and browser information",
        "IP address (processed in anonymized or truncated form where applicable)",
        "Cookie and Tracker data"
    ] },
    { type: "p", text: "No contact forms, user registrations, or direct data submission mechanisms exist on this Website." },
    { type: "p", text: "The “Contact” button redirects Users to their own email client (Gmail or similar), and any data shared via email is outside the scope of this Website." },

    { type: "heading", level: 3, text: "3. Mode and Place of Processing the Data", id: "section-3" },
    { type: "heading", level: 4, text: "A. Method of Processing" },
    { type: "p", text: "The Data Controller processes data using computers and IT-enabled tools, following organizational and technical security measures to prevent unauthorized access, disclosure, modification, or destruction of data." },
    { type: "heading", level: 4, text: "B. Place" },
    { type: "p", text: "Data is processed at the Data Controller’s operating offices and at the locations of third-party service providers, including:" },
    { type: "ul", items: [
        "Google LLC (United States and other regions)",
        "Vercel Inc.",
        "GoDaddy Operating Company, LLC"
    ] },
    { type: "heading", level: 4, text: "C. Retention Time" },
    { type: "p", text: "Personal Data is processed and retained only for as long as required for the purposes for which it was collected, or as required by applicable laws." },
    { type: "p", text: "Analytics data is retained according to the policies of the respective third-party providers." },

    { type: "heading", level: 3, text: "4. The Purpose of Processing", id: "section-4" },
    { type: "p", text: "Data is processed for the following purposes:" },
    { type: "ul", items: [
        "Monitoring and analyzing Website traffic and usage patterns",
        "Ensuring Website security, performance, and stability",
        "Understanding aggregated User behavior to improve content and services",
        "Legal compliance and protection against misuse"
    ] },
    { type: "p", text: "No profiling, automated decision-making, or targeted advertising is conducted by the Owner." },

    { type: "heading", level: 3, text: "5. Detailed Information on the Processing of Personal Data", id: "section-5" },
    { type: "heading", level: 4, text: "Analytics" },
    { type: "p", text: "The services in this section enable the Owner to monitor and analyze web traffic and understand User behavior in an aggregated manner." },
    { type: "heading", level: 5, text: "Google Analytics (Google LLC)" },
    { type: "p", text: "Google Analytics is a web analytics service provided by Google LLC that tracks and reports Website traffic. It uses cookies and other tracking technologies to collect Usage Data." },
    { type: "p", text: "Personal Data processed:" },
    { type: "ul", items: ["Usage Data", "Trackers"] },
    { type: "p", text: "Place of processing: United States and other Google data center locations – Privacy Policy." },
    { type: "p", text: "Category of Personal Information collected according to the CCPA: Internet or other electronic network activity information." },
    { type: "p", text: "This processing constitutes: Sharing under CPRA (California), but not a sale of Personal Information by the Owner." },
    { type: "heading", level: 4, text: "Hosting and Infrastructure" },
    { type: "heading", level: 5, text: "Vercel (Vercel Inc.)" },
    { type: "p", text: "Vercel provides server infrastructure and deployment services for this Website." },
    { type: "p", text: "Personal Data processed:" },
    { type: "ul", items: ["Usage Data", "System logs"] },
    { type: "heading", level: 5, text: "GoDaddy (GoDaddy Operating Company, LLC)" },
    { type: "p", text: "GoDaddy provides domain registration and hosting-related services." },
    { type: "p", text: "Personal Data processed:" },
    { type: "ul", items: ["Usage Data", "Technical and operational data"] },

    { type: "heading", level: 3, text: "6. Cookie Policy", id: "section-6" },
    { type: "heading", level: 4, text: "A. How This Website Uses Trackers" },
    { type: "p", text: "This Website uses Trackers to ensure proper functioning and to analyze aggregated traffic." },
    { type: "heading", level: 5, text: "i. Necessary Trackers" },
    { type: "p", text: "These Trackers are essential for the operation and security of the Website and cannot be disabled." },
    { type: "heading", level: 5, text: "ii. Analytics Trackers" },
    { type: "p", text: "Used to understand how Users interact with the Website. These are activated based on User consent via the cookie banner." },
    { type: "heading", level: 5, text: "iii. Definitions and Legal References" },
    { type: "dl", items: [
        { term: "Personal Data (or Data)", def: "Any information that allows the identification or identifiability of a natural person, directly or indirectly." },
        { term: "Usage Data", def: "Information collected automatically through this Website, including IP address, browser type, operating system, access times, pages visited, and navigation paths." },
        { term: "User", def: "The individual using this Website." },
        { term: "Data Subject", def: "The natural person to whom the Personal Data refers." },
        { term: "Data Processor (or Processor)", def: "An entity that processes Personal Data on behalf of the Controller." },
        { term: "Data Controller (or Owner)", def: "The entity determining the purposes and means of processing Personal Data." },
        { term: "This Website (or Application)", def: "The means by which Personal Data is collected and processed." },
        { term: "Service", def: "The service provided by this Website." },
        { term: "Cookie", def: "A small piece of data stored on the User’s device." },
        { term: "Tracker", def: "Any technology that enables tracking of Users, including cookies, beacons, scripts, and identifiers." }
    ] },
    { type: "heading", level: 5, text: "Legal Information" },
    { type: "p", text: "This privacy policy is based on multiple legal frameworks, including GDPR, CCPA/CPRA, LGPD, and Indian data protection laws." },

    { type: "heading", level: 3, text: "7. Further Information for Users", id: "section-7" },
    { type: "heading", level: 4, text: "A. Legal Basis of Processing" },
    { type: "p", text: "The Owner processes Personal Data on the following legal bases:" },
    { type: "ul", items: [
        "User consent (via cookie banner)",
        "Legitimate interests in maintaining and improving the Website",
        "Legal obligations"
    ] },
    { type: "heading", level: 4, text: "B. Further Information About Retention Time" },
    { type: "p", text: "Data is retained for the shortest period necessary to fulfill the purposes outlined in this document unless longer retention is required by law." },
    { type: "heading", level: 4, text: "C. The Rights of Users Under GDPR" },
    { type: "p", text: "Users may exercise the following rights:" },
    { type: "ul", items: [
        "Access their Personal Data",
        "Rectify inaccurate data",
        "Request erasure",
        "Restrict or object to processing",
        "Withdraw consent at any time",
        "Lodge a complaint with a supervisory authority"
    ] },

    { type: "heading", level: 3, text: "8. Further Information for Users in Brazil", id: "section-8" },
    { type: "heading", level: 4, text: "A. Grounds for Processing" },
    { type: "p", text: "Processing is based on consent, legitimate interests, and legal obligations under the LGPD." },
    { type: "heading", level: 4, text: "B. Categories of Personal Information Processed" },
    { type: "p", text: "Refer to the section “Detailed information on the processing of Personal Data.”" },
    { type: "heading", level: 4, text: "C. Why We Process Personal Information" },
    { type: "p", text: "Refer to “The purposes of processing” and “Detailed information on the processing of Personal Data.”" },
    { type: "heading", level: 4, text: "D. Brazilian Privacy Rights" },
    { type: "p", text: "Users may request confirmation, access, correction, anonymization, deletion, or portability of Personal Data by contacting the Owner." },
    { type: "heading", level: 4, text: "E. International Data Transfers" },
    { type: "p", text: "Personal Data may be transferred outside Brazil in compliance with LGPD safeguards." },

    { type: "heading", level: 3, text: "9. Further Information for Users in the United States", id: "section-9" },
    { type: "p", text: "The Owner does not sell Personal Information." },
    { type: "p", text: "Some third-party services may process data independently according to their own privacy policies. Users may exercise rights under applicable U.S. state privacy laws by contacting the Owner." },
    { type: "heading", level: 4, text: "A. Do Not Sell or Share My Personal Information" },
    { type: "p", text: "As described in Section 5, the Owner's use of Google Analytics constitutes “sharing” of Usage Data under the CPRA, though it is not a sale of Personal Information. California residents may opt out of this sharing at any time by:" },
    { type: "ul", items: [
        "Installing the Google Analytics Opt-out Browser Add-on",
        "Enabling a “Global Privacy Control” or “Do Not Track” signal in their browser (see Section 11.F)",
        `Emailing ${contactMailAddress} with an opt-out request, which the Owner will process manually`
    ] },
    { type: "p", text: "This Website does not currently have an automated cookie-consent tool that detects browser-level opt-out signals; opt-out requests submitted by email will be honored within a reasonable time." },

    { type: "heading", level: 3, text: "10. Information for Users in India", id: "section-10" },
    { type: "p", text: "This section applies to Users located in India and is provided in accordance with:" },
    { type: "ul", items: [
        "Information Technology Act, 2000",
        "Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011",
        "Digital Personal Data Protection Act, 2023 (DPDP Act)"
    ] },
    { type: "heading", level: 4, text: "A. Nature of Data Processed" },
    { type: "p", text: "TechKun does not knowingly collect Sensitive Personal Data or Personal Data as defined under Indian law." },
    { type: "p", text: "Any data processed is limited to:" },
    { type: "ul", items: [
        "Usage Data",
        "Technical and device-related information",
        "Cookie and analytics data"
    ] },
    { type: "heading", level: 4, text: "B. Purpose of Processing" },
    { type: "p", text: "Data is processed strictly for:" },
    { type: "ul", items: [
        "Website analytics and improvement",
        "Security and system maintenance",
        "Legal compliance"
    ] },
    { type: "heading", level: 4, text: "C. Consent" },
    { type: "p", text: "Consent is obtained through:" },
    { type: "ul", items: [
        "Cookie consent banner",
        "Continued use of the Website after being informed"
    ] },
    { type: "p", text: "Users may withdraw consent at any time by disabling cookies or contacting the Owner." },
    { type: "heading", level: 4, text: "D. Data Security" },
    { type: "p", text: "The Owner follows reasonable security practices, including:" },
    { type: "ul", items: [
        "Secure hosting infrastructure",
        "Access control and monitoring",
        "Use of reputable third-party service providers"
    ] },
    { type: "heading", level: 4, text: "E. User Rights Under Indian Law" },
    { type: "p", text: "Users have the right to:" },
    { type: "ul", items: [
        "Request access to their data",
        "Request correction or erasure",
        "Withdraw consent",
        "File a grievance"
    ] },
    { type: "fields", items: [
        { label: "Grievance Officer", value: "[Name — to be added before publishing]" },
        { label: "Designation", value: "[Designation — to be added before publishing]" }
    ] },
    { type: "email", address: contactMailAddress, label: `Grievances or requests can be sent to: ${contactMailAddress}` },
    { type: "heading", level: 4, text: "F. Data Retention" },
    { type: "p", text: "Data is retained only as long as necessary to fulfill the stated purposes or to comply with legal obligations." },

    { type: "heading", level: 3, text: "11. Additional Information About Data Collection and Processing", id: "section-11" },
    { type: "heading", level: 4, text: "A. Legal Action" },
    { type: "p", text: "Personal Data may be used for legal purposes or disclosed if required by law." },
    { type: "heading", level: 4, text: "B. Additional Information About User’s Personal Data" },
    { type: "p", text: "No Personal Data is collected beyond what is described in this document." },
    { type: "heading", level: 4, text: "C. System Logs and Maintenance" },
    { type: "p", text: "System logs may be collected for security and maintenance purposes." },
    { type: "heading", level: 4, text: "D. Children's Privacy" },
    { type: "p", text: `This Website is not directed at children under the age of 16, and the Owner does not knowingly collect Personal Data from children. If the Owner becomes aware that a child has provided Personal Data through this Website without verifiable parental or guardian consent, the Owner will take reasonable steps to remove that information. Parents or guardians who believe a child has provided data through this Website should contact the Owner at ${contactMailAddress}.` },
    { type: "heading", level: 4, text: "E. Data Breach Notification" },
    { type: "p", text: "In the event of a data breach affecting Personal Data processed through this Website, the Owner will assess the impact of the breach and, where required by applicable law, notify affected Users and the relevant supervisory authorities without undue delay." },
    { type: "heading", level: 4, text: "F. Do Not Track Signals" },
    { type: "p", text: "Some browsers offer a “Do Not Track” (DNT) or “Global Privacy Control” (GPC) signal. This Website does not currently respond automatically to DNT or GPC signals, as there is no industry-wide standard for interpreting them. Users in California can still exercise their CPRA opt-out rights as described in Section 9.A." },
    { type: "heading", level: 4, text: "G. Changes to This Privacy Policy" },
    { type: "p", text: "The Owner reserves the right to modify this Privacy Policy at any time." },
    { type: "heading", level: 4, text: "H. Definitions and Legal References" },
    { type: "p", text: "As defined throughout this document." }
];
