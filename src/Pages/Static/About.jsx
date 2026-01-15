import React from "react";
import Section from "../../Components/ui/Section";

const About = () => {
  return (
    <Section
      id="about-page"
      title="About Garments Order & Production Tracker"
      subtitle="A production-focused platform built for small and medium garment factories."
    >
      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-4 text-base-content/80">
          <p>
            Garments Order & Production Tracker helps factory teams manage
            orders, track production milestones, and keep buyers informed in
            real time. The system is designed to be simple for operators while
            providing managers and admins with the visibility they need.
          </p>
          <p>
            From order approval and capacity planning to shipment tracking and
            payment status, every workflow is captured in a single, auditable
            system. This reduces manual spreadsheets, miscommunication, and
            delays across the production floor.
          </p>
        </div>
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-secondary">
            What this project demonstrates
          </h3>
          <ul className="list-disc list-inside text-base-content/80 space-y-1">
            <li>Role-based dashboards for Admin, Manager, and Buyer</li>
            <li>Real-time production and order tracking</li>
            <li>Secure authentication and payment workflows</li>
            <li>Responsive, production-ready UI for all devices</li>
          </ul>
        </div>
      </div>
    </Section>
  );
};

export default About;

