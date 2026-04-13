import React from 'react';

export default function TermsAndConditions() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Terms and Conditions</h1>
      
      <div className="prose prose-lg">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
          <p>Welcome to TechKun. By accessing and using our website and services, you agree to be bound by these Terms and Conditions. If you disagree with any part of these terms, please do not use our services.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Services</h2>
          <p>TechKun provides technology consulting, web development, app development, UI/UX design, and digital marketing services. While we strive to ensure the highest quality of service, we cannot guarantee that our services will be uninterrupted or error-free.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Client Obligations</h2>
          <ul className="list-disc pl-6 mb-4">
            <li>Provide accurate and complete information necessary for service delivery</li>
            <li>Maintain confidentiality of any access credentials provided</li>
            <li>Use our services in compliance with applicable laws and regulations</li>
            <li>Pay agreed-upon fees according to the payment schedule</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Intellectual Property</h2>
          <p>Unless otherwise agreed in writing:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>We retain ownership of all intellectual property rights in our services</li>
            <li>Upon full payment, clients receive a license to use the deliverables</li>
            <li>Clients retain ownership of their pre-existing intellectual property</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Confidentiality</h2>
          <p>We maintain strict confidentiality of all client information and project details. Both parties agree not to disclose confidential information without prior written consent.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Limitation of Liability</h2>
          <p>TechKun's liability shall be limited to the amount paid for the services. We are not liable for indirect, consequential, or incidental damages.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Termination</h2>
          <p>Either party may terminate the service agreement with written notice as per the project contract. Upon termination, the client shall pay for services rendered up to the termination date.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Governing Law</h2>
          <p>These terms are governed by Indian law. Any disputes shall be subject to the exclusive jurisdiction of courts in India.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">9. Modifications</h2>
          <p>We reserve the right to modify these terms at any time. Changes will be effective upon posting to the website. Continued use of our services constitutes acceptance of modified terms.</p>
        </section>
      </div>
    </div>
  );
}