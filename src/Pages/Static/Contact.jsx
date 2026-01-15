import React from "react";
import Section from "../../Components/ui/Section";

const Contact = () => {
  return (
    <Section
      id="contact-page"
      title="Contact Us"
      subtitle="Reach out to the team behind Garments Order & Production Tracker."
    >
      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-4 text-base-content/80">
          <p>
            For questions about the platform, feature suggestions, or technical
            support, you can use the contact details below. This project is
            structured like a real production system, so we treat support and
            communication as first-class concerns.
          </p>
          <ul className="space-y-2">
            <li>
              <span className="font-semibold">Support email:</span>{" "}
              <a
                href="mailto:support@garmentsorder.com"
                className="link link-primary"
              >
                support@garmentsorder.com
              </a>
            </li>
            <li>
              <span className="font-semibold">Sales email:</span>{" "}
              <a
                href="mailto:sales@garmentsorder.com"
                className="link link-primary"
              >
                sales@garmentsorder.com
              </a>
            </li>
          </ul>
        </div>
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-secondary">
            Production-ready contact expectations
          </h3>
          <ul className="list-disc list-inside text-base-content/80 space-y-1">
            <li>Clear contact channels for buyers and managers</li>
            <li>Documented escalation path for urgent production issues</li>
            <li>Tracking of support requests inside the dashboard (future)</li>
          </ul>
        </div>
      </div>
    </Section>
  );
};

export default Contact;

