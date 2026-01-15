import React from "react";
import Section from "../../Components/ui/Section";

const Privacy = () => {
  return (
    <Section
      id="privacy-page"
      title="Privacy Policy"
      subtitle="How the Garments Order & Production Tracker handles account and order data."
    >
      <div className="space-y-4 max-w-3xl mx-auto text-base-content/80 text-sm md:text-base">
        <p>
          This project stores user accounts, roles, and order activity to
          demonstrate a realistic production workflow. Data is used strictly for
          authentication, authorization, and rendering dashboards that reflect
          real application behavior.
        </p>
        <p>
          Authentication is powered by Firebase, and sensitive operations are
          protected by token verification on the backend. Order and payment
          information is kept in dedicated collections and is never exposed to
          users who do not have permission to see it.
        </p>
      </div>
    </Section>
  );
};

export default Privacy;

