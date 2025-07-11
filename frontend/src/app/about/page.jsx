"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-16 text-center"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-primary dark:text-white">
          About Our Brand
        </h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Delivering quality fashion that combines style, comfort, and sustainability.
        </p>
      </motion.div>

      {/* Our Story Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="mb-20 flex flex-col md:flex-row items-center gap-12"
      >
        <div className="md:w-1/2 relative h-[400px] rounded-lg overflow-hidden">
          <Image 
            src="/images/about/our-story.jpg" 
            alt="Our Brand Story" 
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>
        <div className="md:w-1/2">
          <h2 className="text-3xl font-bold mb-6 text-primary dark:text-white">Our Story</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Founded in 2020, our brand was born from a passion to create clothing that not only looks good but feels good too. We started as a small team with big dreams, dedicated to crafting garments that stand the test of time.
          </p>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            What began as a modest collection has now grown into a comprehensive range of clothing and accessories for men, women, and children. Throughout our journey, our commitment to quality and customer satisfaction has remained unwavering.
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            Today, we continue to innovate and expand, but our core values remain the same: quality materials, ethical production, and designs that help you express your unique style.
          </p>
        </div>
      </motion.section>

      {/* Our Values Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
        className="mb-20"
      >
        <h2 className="text-3xl font-bold mb-10 text-center text-primary dark:text-white">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
            <div className="w-16 h-16 bg-secondary text-white rounded-full flex items-center justify-center mb-6 mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-4 text-center text-primary dark:text-white">Quality</h3>
            <p className="text-gray-600 dark:text-gray-300 text-center">
              We source the finest materials and work with skilled craftspeople to ensure every item meets our high standards.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
            <div className="w-16 h-16 bg-secondary text-white rounded-full flex items-center justify-center mb-6 mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-4 text-center text-primary dark:text-white">Sustainability</h3>
            <p className="text-gray-600 dark:text-gray-300 text-center">
              We're committed to reducing our environmental impact through responsible sourcing and production practices.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
            <div className="w-16 h-16 bg-secondary text-white rounded-full flex items-center justify-center mb-6 mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-4 text-center text-primary dark:text-white">Community</h3>
            <p className="text-gray-600 dark:text-gray-300 text-center">
              We believe in building relationships with our customers and giving back to the communities that support us.
            </p>
          </div>
        </div>
      </motion.section>

      {/* Team Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        viewport={{ once: true }}
        className="mb-20"
      >
        <h2 className="text-3xl font-bold mb-10 text-center text-primary dark:text-white">Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { name: "Sarah Johnson", role: "Founder & CEO", image: "/images/about/team-1.jpg" },
            { name: "Michael Chen", role: "Creative Director", image: "/images/about/team-2.jpg" },
            { name: "Aisha Patel", role: "Head of Design", image: "/images/about/team-3.jpg" },
            { name: "David Kim", role: "Operations Manager", image: "/images/about/team-4.jpg" }
          ].map((member, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md">
              <div className="relative h-64 w-full">
                <Image 
                  src={member.image} 
                  alt={member.name} 
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 25vw"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-1 text-primary dark:text-white">{member.name}</h3>
                <p className="text-gray-600 dark:text-gray-400">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        viewport={{ once: true }}
        className="bg-secondary text-white p-12 rounded-xl text-center"
      >
        <h2 className="text-3xl font-bold mb-6">Join Our Journey</h2>
        <p className="text-lg mb-8 max-w-2xl mx-auto">
          Discover our latest collections and be part of our story. Shop now to experience the quality and style that defines our brand.
        </p>
        <Link href="/products" className="inline-block bg-white text-secondary font-semibold py-3 px-8 rounded-md hover:bg-gray-100 transition-colors">
          Shop Now
        </Link>
      </motion.section>
    </div>
  );
}
