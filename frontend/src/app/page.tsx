'use client';

import { useState } from 'react';
import { FaEnvelope, FaArrowRight, FaShieldAlt, FaPalette, FaMobile } from 'react-icons/fa';
import { Button } from "../components/ui";
import Link from 'next/link';

// Email interface styles data
const emailStyles = [
  {
    id: "gmail-classic",
    name: "Gmail Classic",
    description: "Traditional three-panel layout with familiar Gmail-style interface",
    icon: "📧",
    features: ["Labels", "Smart Categories", "Conversation View", "Search"],
    color: "#1a73e8"
  },
  {
    id: "outlook-advanced",
    name: "Outlook Advanced", 
    description: "Feature-rich interface with advanced organization and productivity tools",
    icon: "📊",
    features: ["Folders", "Rules", "Categories", "Calendar Integration"],
    color: "#0078d4"
  },
  {
    id: "apple-minimal",
    name: "Apple Minimal",
    description: "Clean, minimal design with focus on simplicity and elegance",
    icon: "🍎",
    features: ["Smart Mailboxes", "VIP", "Flagged", "Minimal Interface"],
    color: "#007aff"
  },
  {
    id: "proton-privacy",
    name: "Proton Privacy",
    description: "Privacy-focused interface with encryption and security features",
    icon: "🔒",
    features: ["End-to-End Encryption", "Secure Sharing", "Self-Destructing", "Privacy Controls"],
    color: "#6d4aff"
  }
];

export default function Home() {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="display-1 gradient-text">
                Your Perfect Email Interface
              </h1>
              <p className="hero-description">
                Choose from four beautifully designed email interfaces: Gmail Classic, Outlook Advanced, 
                Apple Minimal, or Proton Privacy. Customize your experience with light and dark themes.
              </p>
              <div className="hero-actions">
                <Link href="/email">
                  <Button variant="primary" size="lg" className="cta-button">
                    <FaEnvelope />
                    Try Email Interface
                    <FaArrowRight />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Why Choose Our Email Service?</h2>
            <p className="section-description">
              Experience the best of email with our customizable interface options
            </p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <FaPalette />
              </div>
              <h3>Multiple Interface Styles</h3>
              <p>Choose from Gmail Classic, Outlook Advanced, Apple Minimal, or Proton Privacy interfaces.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <FaShieldAlt />
              </div>
              <h3>Privacy & Security</h3>
              <p>End-to-end encryption and privacy controls to keep your emails secure and private.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <FaMobile />
              </div>
              <h3>Responsive Design</h3>
              <p>Seamlessly works across desktop, tablet, and mobile devices with adaptive layouts.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Interface Styles Section */}
      <section className="interfaces-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Choose Your Interface Style</h2>
            <p className="section-description">
              Each interface is designed with specific use cases and preferences in mind
            </p>
          </div>
          
          <div className="interfaces-grid">
            {emailStyles.map((style) => (
              <div key={style.id} className="interface-card">
                <div className="interface-preview" style={{ backgroundColor: style.color }}>
                  <span className="interface-icon">{style.icon}</span>
                </div>
                <div className="interface-content">
                  <h3 className="interface-name">{style.name}</h3>
                  <p className="interface-description">{style.description}</p>
                  <div className="interface-features">
                    {style.features.map((feature, index) => (
                      <span key={index} className="feature-tag">
                        {feature}
                      </span>
                    ))}
                  </div>
                  <Link href={`/email?style=${style.id}`}>
                    <Button variant="ghost" size="sm" className="interface-button">
                      Try {style.name}
                      <FaArrowRight />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Experience Better Email?</h2>
            <p className="cta-description">
              Start with any interface style and customize it to your preferences. 
              Switch between themes and layouts anytime.
            </p>
            <Link href="/email">
              <Button variant="primary" size="lg" className="cta-button">
                <FaEnvelope />
                Get Started Now
                <FaArrowRight />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
