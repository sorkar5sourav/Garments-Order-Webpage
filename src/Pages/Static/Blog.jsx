import React from "react";
import Section from "../../Components/ui/Section";

const Blog = () => {
  return (
    <Section
      id="blog-page"
      title="Production Insights & Updates"
      subtitle="Curated articles about garment production workflows, quality control, and buyer communication."
    >
      <div className="space-y-6 text-base-content/80 max-w-3xl mx-auto">
        <article className="space-y-2">
          <h3 className="text-xl font-semibold text-secondary">
            Reducing delays with real-time order tracking
          </h3>
          <p>
            When buyers can see production status at each stage, they raise
            fewer support tickets and make faster approvals. This project
            demonstrates how dashboards and role-based access can keep everyone
            aligned without endless email chains.
          </p>
        </article>
        <article className="space-y-2">
          <h3 className="text-xl font-semibold text-secondary">
            Standardizing product data for fewer mistakes
          </h3>
          <p>
            Consistent product information—minimum order, available quantity,
            price, and category—allows managers to prioritize orders and detect
            bottlenecks quickly. The product listing and details pages in this
            system are built around that principle.
          </p>
        </article>
      </div>
    </Section>
  );
};

export default Blog;

