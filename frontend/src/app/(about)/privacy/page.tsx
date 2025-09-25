import { FaShieldAlt, FaLock, FaEye, FaUserShield, FaDatabase, FaCookie } from 'react-icons/fa';

export default function PrivacyPage() {
  return (
    <div className="privacy-page">
      {/* Hero Section */}
      <section className="privacy-hero-section">
        <div className="container">
          <div className="privacy-hero-content">
            <h1 className="privacy-hero-title">
              Privacy Policy
            </h1>
            <p className="privacy-hero-description">
              Your privacy is important to us. This policy explains how we collect, use, and protect your information.
            </p>
            <div className="privacy-last-updated">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="privacy-content-section">
        <div className="container">
          <div className="privacy-content">
            
            {/* Introduction */}
            <div className="privacy-section">
              <h2 className="section-title">Introduction</h2>
              <p>
                Jazz Melodic ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy 
                explains how we collect, use, disclose, and safeguard your information when you visit our website 
                and use our services.
              </p>
              <p>
                Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, 
                please do not access the site or use our services.
              </p>
            </div>

            {/* Information We Collect */}
            <div className="privacy-section">
              <h2 className="section-title">
                <FaDatabase className="section-icon" />
                Information We Collect
              </h2>
              
              <h3>Personal Information</h3>
              <p>We may collect personal information that you voluntarily provide to us when you:</p>
              <ul>
                <li>Register for an account</li>
                <li>Subscribe to our newsletter</li>
                <li>Purchase courses or services</li>
                <li>Contact us for support</li>
                <li>Participate in surveys or promotions</li>
              </ul>
              <p>This information may include:</p>
              <ul>
                <li>Name and email address</li>
                <li>Payment information (processed securely through third-party providers)</li>
                <li>Profile information and preferences</li>
                <li>Communication preferences</li>
              </ul>

              <h3>Usage Information</h3>
              <p>We automatically collect certain information when you use our services:</p>
              <ul>
                <li>Device information (IP address, browser type, operating system)</li>
                <li>Usage patterns and preferences</li>
                <li>Course progress and engagement metrics</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </div>

            {/* How We Use Information */}
            <div className="privacy-section">
              <h2 className="section-title">
                <FaEye className="section-icon" />
                How We Use Your Information
              </h2>
              <p>We use the information we collect to:</p>
              <ul>
                <li>Provide and maintain our services</li>
                <li>Process transactions and send related information</li>
                <li>Send you technical notices and support messages</li>
                <li>Respond to your comments and questions</li>
                <li>Improve our services and develop new features</li>
                <li>Personalize your learning experience</li>
                <li>Send you marketing communications (with your consent)</li>
                <li>Comply with legal obligations</li>
              </ul>
            </div>

            {/* Information Sharing */}
            <div className="privacy-section">
              <h2 className="section-title">
                <FaUserShield className="section-icon" />
                Information Sharing and Disclosure
              </h2>
              <p>We do not sell, trade, or otherwise transfer your personal information to third parties except:</p>
              <ul>
                <li><strong>Service Providers:</strong> We may share information with trusted third parties who assist us in operating our website and conducting our business</li>
                <li><strong>Legal Requirements:</strong> We may disclose information when required by law or to protect our rights</li>
                <li><strong>Business Transfers:</strong> In the event of a merger or acquisition, user information may be transferred</li>
                <li><strong>Consent:</strong> We may share information with your explicit consent</li>
              </ul>
            </div>

            {/* Data Security */}
            <div className="privacy-section">
              <h2 className="section-title">
                <FaLock className="section-icon" />
                Data Security
              </h2>
              <p>
                We implement appropriate technical and organizational security measures to protect your personal 
                information against unauthorized access, alteration, disclosure, or destruction. These measures include:
              </p>
              <ul>
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security assessments and updates</li>
                <li>Access controls and authentication</li>
                <li>Secure payment processing</li>
                <li>Employee training on data protection</li>
              </ul>
              <p>
                However, no method of transmission over the internet or electronic storage is 100% secure. 
                While we strive to protect your information, we cannot guarantee absolute security.
              </p>
            </div>

            {/* Cookies */}
            <div className="privacy-section">
              <h2 className="section-title">
                <FaCookie className="section-icon" />
                Cookies and Tracking Technologies
              </h2>
              <p>
                We use cookies and similar tracking technologies to enhance your experience on our website. 
                Cookies are small data files stored on your device that help us:
              </p>
              <ul>
                <li>Remember your preferences and settings</li>
                <li>Analyze website traffic and usage patterns</li>
                <li>Provide personalized content and recommendations</li>
                <li>Improve website functionality</li>
              </ul>
              <p>
                You can control cookie settings through your browser preferences. However, disabling cookies 
                may affect the functionality of our website.
              </p>
            </div>

            {/* Your Rights */}
            <div className="privacy-section">
              <h2 className="section-title">
                <FaShieldAlt className="section-icon" />
                Your Rights and Choices
              </h2>
              <p>Depending on your location, you may have the following rights regarding your personal information:</p>
              <ul>
                <li><strong>Access:</strong> Request access to your personal information</li>
                <li><strong>Correction:</strong> Request correction of inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                <li><strong>Portability:</strong> Request a copy of your data in a portable format</li>
                <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
                <li><strong>Restriction:</strong> Request restriction of processing</li>
              </ul>
              <p>
                To exercise these rights, please contact us using the information provided in the "Contact Us" section below.
              </p>
            </div>

            {/* Data Retention */}
            <div className="privacy-section">
              <h2 className="section-title">Data Retention</h2>
              <p>
                We retain your personal information for as long as necessary to fulfill the purposes outlined in this 
                privacy policy, unless a longer retention period is required or permitted by law. When we no longer 
                need your information, we will securely delete or anonymize it.
              </p>
            </div>

            {/* International Transfers */}
            <div className="privacy-section">
              <h2 className="section-title">International Data Transfers</h2>
              <p>
                Your information may be transferred to and processed in countries other than your own. We ensure 
                that such transfers comply with applicable data protection laws and implement appropriate safeguards 
                to protect your information.
              </p>
            </div>

            {/* Children's Privacy */}
            <div className="privacy-section">
              <h2 className="section-title">Children's Privacy</h2>
              <p>
                Our services are not intended for children under 13 years of age. We do not knowingly collect 
                personal information from children under 13. If you are a parent or guardian and believe your 
                child has provided us with personal information, please contact us.
              </p>
            </div>

            {/* Changes to Policy */}
            <div className="privacy-section">
              <h2 className="section-title">Changes to This Privacy Policy</h2>
              <p>
                We may update this privacy policy from time to time. We will notify you of any changes by posting 
                the new privacy policy on this page and updating the "Last updated" date. We encourage you to review 
                this privacy policy periodically for any changes.
              </p>
            </div>

            {/* Contact Information */}
            <div className="privacy-section">
              <h2 className="section-title">Contact Us</h2>
              <p>If you have any questions about this Privacy Policy, please contact us:</p>
              <div className="contact-info">
                <p><strong>Email:</strong> privacy@jazzmelodic.com</p>
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
