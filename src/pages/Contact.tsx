import Container from "../components/layout/Container";
import CloudinaryImage from "../utils/cloudinaryImage";
import Button from "../components/common/Button";
import { useState } from "react";
import { supabase } from "../utils/supabase";
import Input from "../components/common/Input";
import { motion } from "framer-motion";

import { SEO } from "../components/common/SEO";
import PageTransition from "../components/layout/PageTransition";
import ScrollReveal from "../components/common/ScrollReveal";

const ContactPage: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [hp, setHp] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (hp.trim()) {
      return; // honeypot triggered
    }
    const last = localStorage.getItem("contact_last_submit");
    if (last && Date.now() - Number(last) < 30000) {
      setError("Please wait a moment before submitting again.");
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const { error } = await supabase
        .from("messages")
        .insert([{ name, email, message }]);
      if (error) throw error;

      // Send email notification to hello@gr8qm.com
      try {
        const { emailTemplates } = await import("../utils/email");
        const emailTemplate = emailTemplates.contactMessage({
          name,
          email,
          message,
        });

        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

        await fetch(`${supabaseUrl}/functions/v1/send-receipt-email`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${supabaseKey}`,
          },
          body: JSON.stringify({
            to: "hello@gr8qm.com",
            subject: emailTemplate.subject,
            html: emailTemplate.html,
            replyTo: email,
          }),
        });
      } catch (emailError) {
        console.error("Failed to send email notification:", emailError);
        // Don't fail the whole submission if email fails
      }

      setSuccess(true);
      setName("");
      setEmail("");
      setMessage("");
      localStorage.setItem("contact_last_submit", String(Date.now()));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <SEO
        title="Contact Us"
        description="Get in touch with Gr8QM Technovates. We'd love to hear from you. Whether it's partnerships, services, or questions—send us a message."
      />
      <main className="flex flex-col">
        <div className="py-12 md:py-28 lg:py-36 xl:py-40 2xl:py-48 bg-linear-to-br from-skyblue/20 to-orange/20">
          <Container className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex flex-col gap-4 text-center md:text-left w-full md:w-1/2">
              <ScrollReveal>
                <div className="bg-iceblue/40 border border-skyblue rounded-full px-4 py-2 w-fit mx-auto md:mx-0">
                  <p className="text-sm text-oxford">Get in touch</p>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={0.2}>
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight">
                  <span className="text-oxford">Contact</span>{" "}
                  <span className="text-skyblue">Gr8QM</span>
                </h1>
              </ScrollReveal>
              <ScrollReveal delay={0.4}>
                <p className="text-dark md:text-sm lg:text-base max-w-[650px] mx-auto md:mx-0">
                  We'd love to hear from you. Whether it's partnerships,
                  services, or questions—send us a message and our team will
                  respond promptly.
                </p>
              </ScrollReveal>
              <div className="flex justify-start items-center gap-3"></div>
            </div>
            <div className="w-full md:w-1/2">
              <ScrollReveal delay={0.6}>
                <CloudinaryImage
                  imageKey="contactHero"
                  className="rounded-2xl w-full object-cover"
                  alt="Contact Hero"
                />
              </ScrollReveal>
            </div>
          </Container>
        </div>

        <div className="py-16 md:py-24 lg:py-32 bg-light">
          <Container className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
            <ScrollReveal>
              <div className="flex flex-col gap-4">
                <h2 className="text-2xl md:text-3xl font-bold text-oxford">
                  Send us a message
                </h2>
                {success && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-green-600 bg-green-50 p-3 rounded-md border border-green-200"
                  >
                    Message sent successfully!
                  </motion.p>
                )}
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-600 bg-red-50 p-3 rounded-md border border-red-200"
                  >
                    {error}
                  </motion.p>
                )}
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <input
                    type="text"
                    value={hp}
                    onChange={(e) => setHp(e.target.value)}
                    className="hidden"
                    aria-hidden="true"
                    tabIndex={-1}
                  />
                  <Input
                    showLabel
                    labelText="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                  <Input
                    showLabel
                    labelText="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <div className="flex flex-col gap-2 w-full">
                    <label className="text-sm font-medium text-gray-700">
                      Message
                    </label>
                    <motion.textarea
                      className="w-full rounded-md border outline-none transition-all duration-200 text-start border-gray-1 text-gray-1 focus:bg-iceblue focus:text-oxford focus:border-skyblue px-4 py-3 h-32"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      whileFocus={{ scale: 1.01 }}
                    />
                  </div>
                  <Button variant="pry" type="submit" loading={loading}>
                    Send Message
                  </Button>
                </form>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <div className="flex flex-col gap-4">
                <h2 className="text-2xl md:text-3xl font-bold text-oxford">
                  Contact details
                </h2>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <p className="text-gray-2 mb-2">
                    <span className="font-bold text-oxford">Email:</span>{" "}
                    <a
                      href="mailto:hello@gr8qm.com"
                      className="text-skyblue hover:underline"
                    >
                      hello@gr8qm.com
                    </a>
                  </p>
                  <p className="text-gray-2">
                    <span className="font-bold text-oxford">Phone:</span>{" "}
                    <a
                      href="tel:+2349013294248"
                      className="text-skyblue hover:underline"
                    >
                      +234 901 329 4248
                    </a>
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </Container>
        </div>
      </main>
    </PageTransition>
  );
};

export default ContactPage;
