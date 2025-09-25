import { FaGavel, FaFileContract, FaExclamationTriangle, FaHandshake, FaUserCheck, FaBan } from 'react-icons/fa';

export default function TermsPage() {
  return (
    <div className="terms-page">
      {/* Hero Section */}
      <section className="terms-hero-section">
        <div className="container">
          <div className="terms-hero-content">
            <h1 className="terms-hero-title">
              Terms of Service
            </h1>
            <p className="terms-hero-description">
              Please read these terms carefully before using our services. By accessing or using Jazz Melodic, you agree to be bound by these terms.
            </p>
            <div className="terms-last-updated">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="terms-content-section">
        <div className="container">
          <div className="terms-content">
            
            {/* Agreement */}
            <div className="terms-section">
              <h2 className="section-title">
                <FaFileContract className="section-icon" />
                Agreement to Terms
              </h2>
              <p>
                These Terms of Service ("Terms") constitute a legally binding agreement between you and Jazz Melodic 
                ("Company," "we," "our," or "us") regarding your use of our website, services, and applications 
                (collectively, the "Service").
              </p>
              <p>
                By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any 
                part of these terms, then you may not access the Service.
              </p>
            </div>

            {/* Acceptance of Terms */}
            <div className="terms-section">
              <h2 className="section-title">
                <FaUserCheck className="section-icon" />
                Acceptance of Terms
              </h2>
              <p>You may not access or use the Service for any purpose other than that for which we make the Service available. The Service may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us.</p>
              <p>As a user of the Service, you agree not to:</p>
              <ul>
                <li>Systematically retrieve data or other content from the Service to create or compile a collection, compilation, database, or directory</li>
                <li>Trick, defraud, or mislead us and other users</li>
                <li>Circumvent, disable, or otherwise interfere with security-related features of the Service</li>
                <li>Disparage, tarnish, or otherwise harm us or the Service</li>
                <li>Use any information obtained from the Service to harass, abuse, or harm another person</li>
                <li>Use the Service in a manner inconsistent with any applicable laws or regulations</li>
              </ul>
            </div>

            {/* User Accounts */}
            <div className="terms-section">
              <h2 className="section-title">User Accounts</h2>
              <p>
                When you create an account with us, you must provide information that is accurate, complete, and 
                current at all times. You are responsible for safeguarding the password and for all activities 
                that occur under your account.
              </p>
              <p>
                You may not use as a username the name of another person or entity or that is not lawfully available 
                for use, a name or trademark that is subject to any rights of another person or entity other than 
                you without appropriate authorization, or a name that is otherwise offensive, vulgar, or obscene.
              </p>
            </div>

            {/* Content and Intellectual Property */}
            <div className="terms-section">
              <h2 className="section-title">Content and Intellectual Property</h2>
              
              <h3>Our Content</h3>
              <p>
                The Service and its original content, features, and functionality are and will remain the exclusive 
                property of Jazz Melodic and its licensors. The Service is protected by copyright, trademark, and 
                other laws. Our trademarks and trade dress may not be used in connection with any product or service 
                without our prior written consent.
              </p>

              <h3>User-Generated Content</h3>
              <p>
                Our Service may allow you to post, link, store, share and otherwise make available certain information, 
                text, graphics, videos, or other material ("Content"). You are responsible for the Content that you 
                post to the Service, including its legality, reliability, and appropriateness.
              </p>
              <p>
                By posting Content to the Service, you grant us the right and license to use, modify, publicly perform, 
                publicly display, reproduce, and distribute such Content on and through the Service.
              </p>

              <h3>Prohibited Content</h3>
              <p>You may not post Content that:</p>
              <ul>
                <li>Is unlawful, threatening, defamatory, obscene, or otherwise objectionable</li>
                <li>Violates any party's intellectual property rights</li>
                <li>Contains software viruses or any other computer code designed to interrupt, destroy, or limit the functionality of any computer software or hardware</li>
                <li>Is spam, commercial solicitation, or promotional material</li>
                <li>Impersonates any person or entity or misrepresents your affiliation with a person or entity</li>
              </ul>
            </div>

            {/* Payment Terms */}
            <div className="terms-section">
              <h2 className="section-title">Payment Terms</h2>
              <p>
                Some aspects of the Service are provided for a fee. You will be charged the applicable fees in advance 
                on a recurring basis. All fees are non-refundable except as required by law.
              </p>
              <p>
                We may change our fees at any time. We will give you advance notice of any fee changes that will affect 
                your subscription. If you do not agree to the fee changes, you may cancel your subscription before the 
                changes take effect.
              </p>
              <p>
                You are responsible for all applicable taxes, and we will charge tax when required to do so.
              </p>
            </div>

            {/* Refund Policy */}
            <div className="terms-section">
              <h2 className="section-title">Refund Policy</h2>
              <p>
                We offer a 30-day money-back guarantee for all paid courses and subscriptions. If you are not satisfied 
                with your purchase within 30 days, you may request a full refund.
              </p>
              <p>
                To request a refund, please contact our support team with your order details. Refunds will be processed 
                to the original payment method within 5-10 business days.
              </p>
              <p>
                Refunds are not available for:
              </p>
              <ul>
                <li>Courses that have been completed more than 50%</li>
                <li>Certificates or credentials already issued</li>
                <li>Downloadable content that has been accessed</li>
                <li>Services that have been fully utilized</li>
              </ul>
            </div>

            {/* Prohibited Uses */}
            <div className="terms-section">
              <h2 className="section-title">
                <FaBan className="section-icon" />
                Prohibited Uses
              </h2>
              <p>You may use our Service only for lawful purposes and in accordance with these Terms. You agree not to use the Service:</p>
              <ul>
                <li>In any way that violates any applicable federal, state, local, or international law or regulation</li>
                <li>To engage in any conduct that restricts or inhibits anyone's use or enjoyment of the Service</li>
                <li>To impersonate or attempt to impersonate the Company, a Company employee, another user, or any other person or entity</li>
                <li>To engage in any other conduct that we deem inappropriate or harmful to the Service or its users</li>
                <li>To attempt to gain unauthorized access to any portion of the Service or any other systems or networks</li>
                <li>To use any robot, spider, or other automatic device to access the Service for any purpose</li>
                <li>To interfere with or disrupt the Service or servers or networks connected to the Service</li>
              </ul>
            </div>

            {/* Disclaimer of Warranties */}
            <div className="terms-section">
              <h2 className="section-title">
                <FaExclamationTriangle className="section-icon" />
                Disclaimer of Warranties
              </h2>
              <p>
                The information on this Service is provided on an "as is" basis. To the fullest extent permitted by law, 
                this Company:
              </p>
              <ul>
                <li>Excludes all representations and warranties relating to this Service and its contents</li>
                <li>Does not warrant that the Service will be constantly available or available at all</li>
                <li>Does not warrant that the information on this Service is complete, true, accurate, or non-misleading</li>
                <li>Does not warrant that the Service will be free from errors, viruses, or other harmful components</li>
              </ul>
            </div>

            {/* Limitation of Liability */}
            <div className="terms-section">
              <h2 className="section-title">Limitation of Liability</h2>
              <p>
                In no event shall Jazz Melodic, nor its directors, employees, partners, agents, suppliers, or affiliates, 
                be liable for any indirect, incidental, special, consequential, or punitive damages, including without 
                limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use 
                of the Service.
              </p>
              <p>
                Our total liability to you for all damages shall not exceed the amount you paid us for the Service in 
                the 12 months preceding the claim.
              </p>
            </div>

            {/* Termination */}
            <div className="terms-section">
              <h2 className="section-title">Termination</h2>
              <p>
                We may terminate or suspend your account and bar access to the Service immediately, without prior notice 
                or liability, under our sole discretion, for any reason whatsoever and without limitation, including but 
                not limited to a breach of the Terms.
              </p>
              <p>
                If you wish to terminate your account, you may simply discontinue using the Service or contact us to 
                request account deletion.
              </p>
              <p>
                Upon termination, your right to use the Service will cease immediately. All provisions of the Terms 
                which by their nature should survive termination shall survive termination.
              </p>
            </div>

            {/* Governing Law */}
            <div className="terms-section">
              <h2 className="section-title">
                <FaGavel className="section-icon" />
                Governing Law
              </h2>
              <p>
                These Terms shall be interpreted and governed by the laws of the State of California, without regard 
                to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will 
                not be considered a waiver of those rights.
              </p>
              <p>
                If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining 
                provisions of these Terms will remain in effect.
              </p>
            </div>

            {/* Changes to Terms */}
            <div className="terms-section">
              <h2 className="section-title">Changes to Terms</h2>
              <p>
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a 
                revision is material, we will provide at least 30 days notice prior to any new terms taking effect.
              </p>
              <p>
                By continuing to access or use our Service after those revisions become effective, you agree to be 
                bound by the revised terms.
              </p>
            </div>

            {/* Contact Information */}
            <div className="terms-section">
              <h2 className="section-title">
                <FaHandshake className="section-icon" />
                Contact Information
              </h2>
              <p>If you have any questions about these Terms of Service, please contact us:</p>
              <div className="contact-info">
                <p><strong>Email:</strong> legal@jazzmelodic.com</p>
                <p><strong>Address:</strong> Jazz Melodic, 123 Music Street, Jazz City, JC 12345</p>
                <p><strong>Phone:</strong> +1 (555) 123-4567</p>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
