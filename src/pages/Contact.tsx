import Container from "../components/layout/Container";
import CloudinaryImage from "../utils/cloudinaryImage";
import Button from "../components/common/Button";
import { useState } from "react";
import { supabase } from "../utils/supabase";
import Input from "../components/common/Input";

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
      try {
        await supabase.functions.invoke("send-contact-email", {
          body: { name, email, message },
        });
      } catch {}
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
    <main className="flex flex-col">
      <div className="py-12 md:py-28 lg:py-36 xl:py-40 2xl:py-48 bg-gradient-to-br from-skyblue/20 to-orange/20">
        <Container className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col gap-4 text-center md:text-left w-full md:w-1/2">
            <div className="bg-iceblue/40 border border-skyblue rounded-full px-4 py-2 w-fit mx-auto md:mx-0">
              <p className="text-sm text-oxford">Get in touch</p>
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight">
              <span className="text-oxford">Contact</span>{" "}
              <span className="text-skyblue">Gr8QM</span>
            </h1>
            <p className="text-dark md:text-sm lg:text-base max-w-[650px] mx-auto md:mx-0">
              We'd love to hear from you. Whether it's partnerships, services,
              or questions—send us a message and our team will respond promptly.
            </p>
            <div className="flex justify-start items-center gap-3"></div>
          </div>
          <div className="w-full md:w-1/2">
            <CloudinaryImage
              imageKey="contactHero"
              className="rounded-2xl w-full object-cover"
              alt="Contact Hero"
            />
          </div>
        </Container>
      </div>

      <div className="py-16 md:py-24 lg:py-32 bg-light">
        <Container className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl md:text-3xl font-bold text-oxford">
              Send us a message
            </h2>
            {success && (
              <p className="text-green-600">Message sent successfully!</p>
            )}
            {error && <p className="text-red-600">{error}</p>}
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
                <textarea
                  className="w-full rounded-md border outline-none transition-all duration-200 text-start border-[var(--color-gray-1)] text-[var(--color-gray-1)] focus:bg-[var(--color-iceblue)] focus:text-[var(--color-oxford)] focus:border-none focus:outline-[var(--color-dark)] px-4 py-3 h-32"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </div>
              <Button variant="pry" type="submit" loading={loading}>
                Send Message
              </Button>
            </form>
          </div>
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl md:text-3xl font-bold text-oxford">
              Contact details
            </h2>
            <p className="text-gray-2">Email: hello@gr8qm.com</p>
            <p className="text-gray-2">Phone: +234 901 329 4248</p>
          </div>
        </Container>
      </div>
    </main>
  );
};

export default ContactPage;
