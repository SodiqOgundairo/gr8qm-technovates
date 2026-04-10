import Container from "../components/layout/Container";
import CloudinaryImage from "../utils/cloudinaryImage";
import Button from "../components/common/Button";
import { useState } from "react";
import { supabase } from "../utils/supabase";
import Input from "../components/common/Input";
import { motion } from "framer-motion";
import { MailIcon, PhoneIcon, SendIcon } from "../components/icons";

import { SEO } from "../components/common/SEO";
import PageTransition from "../components/layout/PageTransition";
import ScrollReveal from "../components/common/ScrollReveal";
import Scene3D from "../components/animations/Scene3D";

const springTransition = { type: "spring" as const, stiffness: 300, damping: 20 };

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
            text: emailTemplate.text,
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
        <div className="relative py-12 md:py-28 lg:py-36 xl:py-40 2xl:py-48 bg-linear-to-br from-skyblue/20 to-orange/20">
          <Scene3D variant="minimal" className="opacity-30" />
          <Container className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex flex-col gap-4 text-center md:text-left w-full md:w-1/2">
              <ScrollReveal>
                <motion.div
                  className="bg-iceblue/40 border border-skyblue rounded-full px-4 py-2 w-fit mx-auto md:mx-0"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  transition={springTransition}
                >
                  <p className="text-sm text-oxford">Say hello</p>
                </motion.div>
              </ScrollReveal>
              <ScrollReveal delay={0.2}>
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight">
                  <span className="text-oxford">Let's build</span>{" "}
                  <span className="text-skyblue">something great.</span>
                </h1>
              </ScrollReveal>
              <ScrollReveal delay={0.4}>
                <p className="text-dark md:text-sm lg:text-base max-w-[650px] mx-auto md:mx-0">
                  Have a project in mind? Need a quote? Just want to say hi?
                  Drop us a line and we'll get back to you within 24 hours.
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
                  <motion.div whileFocus={{ scale: 1.01 }} transition={springTransition}>
                    <Input
                      showLabel
                      labelText="Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </motion.div>
                  <motion.div whileFocus={{ scale: 1.01 }} transition={springTransition}>
                    <Input
                      showLabel
                      labelText="Email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </motion.div>
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
                      transition={springTransition}
                    />
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={springTransition}
                  >
                    <Button variant="pry" type="submit" loading={loading}>
                      <motion.span
                        className="inline-flex"
                        whileHover={{ rotate: 15, scale: 1.2 }}
                        transition={springTransition}
                      >
                        <SendIcon size={18} />
                      </motion.span>{" "}
                      Send Message
                    </Button>
                  </motion.div>
                </form>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <div className="flex flex-col gap-4">
                <h2 className="text-2xl md:text-3xl font-bold text-oxford">
                  Contact details
                </h2>
                <motion.div
                  className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4"
                  whileHover={{ y: -2, boxShadow: "0 8px 30px rgba(0,0,0,0.08)" }}
                  transition={springTransition}
                >
                  <motion.a
                    href="mailto:hello@gr8qm.com"
                    className="flex items-center gap-3 group"
                    whileHover={{ x: 5 }}
                    transition={springTransition}
                  >
                    <motion.div
                      className="p-2 bg-iceblue/50 rounded-lg"
                      whileHover={{ rotate: 15, scale: 1.2 }}
                      transition={springTransition}
                    >
                      <MailIcon size={20} className="text-skyblue" />
                    </motion.div>
                    <div>
                      <p className="text-xs text-gray-2 font-medium">Email</p>
                      <span className="text-oxford font-semibold group-hover:text-skyblue transition-colors">
                        hello@gr8qm.com
                      </span>
                    </div>
                  </motion.a>
                  <motion.a
                    href="tel:+2349013294248"
                    className="flex items-center gap-3 group"
                    whileHover={{ x: 5 }}
                    transition={springTransition}
                  >
                    <motion.div
                      className="p-2 bg-iceblue/50 rounded-lg"
                      whileHover={{ rotate: 15, scale: 1.2 }}
                      transition={springTransition}
                    >
                      <PhoneIcon size={20} className="text-skyblue" />
                    </motion.div>
                    <div>
                      <p className="text-xs text-gray-2 font-medium">Phone</p>
                      <span className="text-oxford font-semibold group-hover:text-skyblue transition-colors">
                        +234 901 329 4248
                      </span>
                    </div>
                  </motion.a>
                </motion.div>
              </div>
            </ScrollReveal>
          </Container>
        </div>
      </main>
    </PageTransition>
  );
};

export default ContactPage;
