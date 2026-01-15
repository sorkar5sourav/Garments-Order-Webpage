import React from "react";
import Section from "../../Components/ui/Section";

const Terms = () => {
  return (
    <Section
      id="terms-page"
      title="Terms of Use"
      subtitle="Guidelines for using the Garments Order & Production Tracker system."
    >
      <div className="space-y-4 max-w-3xl mx-auto text-base-content/80 text-sm md:text-base">
        <p>
          By using this system, you agree to operate within the roles assigned
          to your account—Buyer, Manager, or Admin. Actions such as adding
          products, approving orders, or updating tracking information must be
          done responsibly and accurately.
        </p>
        <p>
          This project is built for learning and demonstration, but it follows
          patterns used in production applications: secure authentication,
          protected routes, and validated inputs. Misuse of privileged accounts
          can affect reporting, dashboards, and order data integrity.
        </p>
      </div>
    </Section>
  );
};

export default Terms;

