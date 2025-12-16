import React, { useState } from "react";

const AboutUs = () => {
  const [activeSection, setActiveSection] = useState("story");

  const sections = {
    story: {
      title: "Our Story",
      content: [
        "Founded in 2020, our garments ordering platform began as a small initiative to revolutionize the textile industry. We recognized the challenges faced by both manufacturers and customers in the traditional supply chain process. Our founders, with decades of combined experience in fashion and technology, envisioned a seamless digital solution that would connect quality craftsmanship with modern convenience.",
        "What started as a simple idea quickly evolved into a comprehensive platform serving thousands of users worldwide. We invested heavily in cutting-edge technology and user experience design to create an intuitive system that simplifies the complex world of garment production and ordering. Our commitment to innovation has led us to integrate advanced tracking systems, secure payment gateways, and real-time communication tools.",
        "Today, we proudly serve a diverse community of fashion enthusiasts, boutique owners, and large-scale retailers. Our platform has facilitated millions of dollars in transactions and helped countless businesses streamline their operations. We continue to grow and adapt, always putting our users' needs at the forefront of every decision we make.",
        "The journey hasn't been without challenges, but each obstacle has strengthened our resolve and refined our approach. We've learned that true success comes from listening to our community, embracing feedback, and constantly striving for excellence in everything we do."
      ]
    },
    mission: {
      title: "Our Mission",
      content: [
        "Our mission is to democratize access to high-quality, custom garments while empowering artisans and manufacturers worldwide. We believe that everyone deserves access to personalized fashion that reflects their unique style and needs. By bridging the gap between skilled craftsmen and discerning customers, we create opportunities for economic growth and creative expression.",
        "We are committed to sustainability and ethical practices throughout our supply chain. Every garment produced through our platform meets strict quality standards and fair labor practices. We work closely with our manufacturing partners to ensure that every piece is crafted with care, using materials that are both beautiful and environmentally responsible.",
        "Innovation drives everything we do. We continuously invest in technology that makes the ordering process more efficient, transparent, and enjoyable. Our advanced tracking systems provide real-time updates, while our secure payment infrastructure ensures peace of mind for all transactions. We strive to set new industry standards for excellence and customer satisfaction.",
        "Ultimately, our mission extends beyond business success. We aim to foster a global community where creativity thrives, craftsmanship is valued, and fashion becomes a force for positive change in people's lives and communities around the world."
      ]
    },
    success: {
      title: "Our Success",
      content: [
        "In just a few years, we've achieved remarkable milestones that validate our vision and approach. Our platform now processes thousands of orders daily, connecting customers with skilled artisans across multiple continents. We've built a reputation for reliability and quality that has earned us the trust of both individual customers and large retail partners.",
        "Our success metrics speak volumes about the impact we've made. We've facilitated over $50 million in transactions, created thousands of jobs in the garment industry, and received countless testimonials from satisfied customers. Our customer retention rate exceeds 85%, demonstrating the loyalty we've built through consistent quality and exceptional service.",
        "Innovation has been key to our rapid growth. We've pioneered several industry-first features, including AI-powered design recommendations, blockchain-based supply chain tracking, and virtual fitting rooms. These technological advancements have not only improved user experience but also set new standards for the entire e-commerce sector.",
        "Recognition from industry leaders has further validated our achievements. We've been featured in major fashion publications, won multiple innovation awards, and been invited to speak at international conferences. These accolades motivate us to continue pushing boundaries and delivering excellence in everything we do."
      ]
    },
    team: {
      title: "Our Team",
      content: [
        "Our diverse team brings together expertise from fashion, technology, business, and design. Each member contributes unique perspectives and skills that drive our innovation and success. We believe that great companies are built by great people, and we've assembled a talented group of professionals who share our passion for revolutionizing the garment industry.",
        "Our leadership team combines decades of experience in fashion retail, software development, and operations management. They provide strategic direction while fostering a culture of creativity and collaboration. Every team member, from our developers to our customer service representatives, plays a crucial role in delivering the exceptional experience our users expect.",
        "We invest heavily in our team's growth and development. Regular training sessions, workshops, and conferences keep our skills sharp and our knowledge current. We encourage cross-functional collaboration and provide opportunities for professional advancement. Our commitment to employee satisfaction has resulted in low turnover and high morale across the organization.",
        "Beyond technical expertise, our team shares core values of integrity, innovation, and customer-centricity. We hire not just for skills, but for cultural fit, ensuring that every new member strengthens our collaborative and supportive work environment. Together, we're building something truly special that will shape the future of fashion commerce."
      ]
    },
    others: {
      title: "Our Values & Vision",
      content: [
        "At our core, we value integrity, transparency, and sustainability in everything we do. These principles guide our decisions and shape our interactions with customers, partners, and employees. We believe that ethical business practices are not just morally right but also essential for long-term success in today's conscious marketplace.",
        "Our vision is to become the world's most trusted and innovative garments ordering platform, setting new standards for quality, sustainability, and customer experience. We envision a future where custom fashion is accessible to everyone, where artisans are fairly compensated, and where technology enhances rather than complicates the creative process.",
        "We are committed to giving back to our communities and the environment. Through various initiatives, we support local artisans, promote sustainable manufacturing practices, and contribute to charitable causes. Our corporate social responsibility efforts reflect our belief that business success should benefit society as a whole.",
        "Looking ahead, we remain focused on continuous improvement and innovation. We listen to our users, adapt to changing market needs, and invest in technologies that will shape the future of fashion. Our journey is ongoing, and we invite you to be part of the story as we continue to evolve and grow."
      ]
    }
  };

  return (
    <div id="about-us" className="my-24 bg-base-100 py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-secondary mb-4">About Us</h2>
          <p className="text-lg text-base-CONTENT max-w-3xl mx-auto">
            Learn more about our journey, mission, and the team behind our garments ordering platform.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center mb-8 border-b border-gray-200">
          {Object.keys(sections).map((key) => (
            <button
              key={key}
              onClick={() => setActiveSection(key)}
              className={`px-6 py-3 text-lg font-medium transition-colors duration-200 ${
                activeSection === key
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                  : "text-base-CONTENT hover:text-blue-600 hover:bg-base-200"
              }`}
            >
              {sections[key].title}
            </button>
          ))}
        </div>

        {/* Content Section */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-base-200 rounded-lg p-8 shadow-sm">
            <h3 className="text-2xl font-bold text-secondary mb-6 text-center">
              {sections[activeSection].title}
            </h3>
            <div className="space-y-6">
              {sections[activeSection].content.map((paragraph, index) => (
                <p key={index} className="text-base-content leading-relaxed text-justify">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;