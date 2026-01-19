"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormStatus {
  type: "idle" | "loading" | "success" | "error";
  message?: string;
}

export default function ContactForm() {
  const t = useTranslations("contact");
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<FormStatus>({ type: "idle" });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: "loading" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      setStatus({ type: "success", message: t("form.success") });
      setFormData({ name: "", email: "", subject: "", message: "" });

      // Reset success message after 5s
      setTimeout(() => setStatus({ type: "idle" }), 5000);
    } catch (error) {
      setStatus({
        type: "error",
        message: error instanceof Error ? error.message : t("form.error"),
      });
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="w-full max-w-2xl space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      {/* Name */}
      <div className="relative">
        <label
          htmlFor="name"
          className="block font-mono text-xs text-muted mb-2 tracking-wider"
        >
          {t("form.name")}
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full bg-transparent border border-foreground/20 px-4 py-3 focus:border-accent focus:outline-none transition-colors font-mono"
          disabled={status.type === "loading"}
        />
      </div>

      {/* Email */}
      <div className="relative">
        <label
          htmlFor="email"
          className="block font-mono text-xs text-muted mb-2 tracking-wider"
        >
          {t("form.email")}
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full bg-transparent border border-foreground/20 px-4 py-3 focus:border-accent focus:outline-none transition-colors font-mono"
          disabled={status.type === "loading"}
        />
      </div>

      {/* Subject */}
      <div className="relative">
        <label
          htmlFor="subject"
          className="block font-mono text-xs text-muted mb-2 tracking-wider"
        >
          {t("form.subject")}
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          required
          className="w-full bg-transparent border border-foreground/20 px-4 py-3 focus:border-accent focus:outline-none transition-colors font-mono"
          disabled={status.type === "loading"}
        />
      </div>

      {/* Message */}
      <div className="relative">
        <label
          htmlFor="message"
          className="block font-mono text-xs text-muted mb-2 tracking-wider"
        >
          {t("form.message")}
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={6}
          className="w-full bg-transparent border border-foreground/20 px-4 py-3 focus:border-accent focus:outline-none transition-colors resize-none font-mono"
          disabled={status.type === "loading"}
        />
      </div>

      {/* Status messages */}
      {status.message && (
        <motion.div
          className={`p-4 border font-mono text-sm ${
            status.type === "success"
              ? "border-accent/50 text-accent"
              : "border-red-500/50 text-red-500"
          }`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {status.message}
        </motion.div>
      )}

      {/* Submit button */}
      <motion.button
        type="submit"
        className="relative w-full border-2 border-accent px-8 py-4 font-mono text-sm tracking-wider overflow-hidden group"
        disabled={status.type === "loading"}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        data-cursor="hover"
      >
        <motion.div
          className="absolute inset-0 bg-accent"
          initial={{ x: "-100%" }}
          whileHover={{ x: 0 }}
          transition={{ duration: 0.3 }}
        />
        <span className="relative z-10 group-hover:text-background transition-colors">
          {status.type === "loading" ? t("form.sending") : t("form.submit")}
        </span>

        {/* Corner decorations */}
        <div className="absolute top-0 left-0 w-2 h-2 bg-accent" />
        <div className="absolute bottom-0 right-0 w-2 h-2 bg-accent" />
      </motion.button>
    </motion.form>
  );
}
