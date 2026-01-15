import React from "react";
import { layout } from "../../Theme/tokens";

const Section = ({ id, title, subtitle, children, className = "" }) => {
  return (
    <section id={id} className={`py-12 ${className}`}>
      <div className={layout.section}>
        {(title || subtitle) && (
          <div className="text-center mb-8 space-y-2">
            {title && (
              <h2 className="text-3xl md:text-4xl font-bold text-secondary">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-base-content/70 max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
};

export default Section;

