import React from "react";
import Section from "../../Components/ui/Section";

const Help = () => {
  return (
    <Section
      id="help-page"
      title="Help & Support"
      subtitle="Answers to common questions about using the Garments Order & Production Tracker."
    >
      <div className="space-y-6 max-w-3xl mx-auto text-base-content/80">
        <div>
          <h3 className="text-lg font-semibold text-secondary mb-1">
            How do buyers place an order?
          </h3>
          <p>
            Buyers can browse products, view detailed specifications, and then
            use the booking flow. The system enforces minimum order quantities
            and only allows active, approved buyer accounts to confirm orders.
          </p>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-secondary mb-1">
            What can managers and admins do?
          </h3>
          <p>
            Managers can add and manage products, approve orders, and update
            tracking information. Admins can manage users, roles, and account
            status to keep the system safe and production-ready.
          </p>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-secondary mb-1">
            Who should I contact for technical issues?
          </h3>
          <p>
            For deployment, configuration, or integration questions, use the
            contact information on the Contact page. For day-to-day order or
            production questions, your manager or admin should be the first
            point of contact.
          </p>
        </div>
      </div>
    </Section>
  );
};

export default Help;

