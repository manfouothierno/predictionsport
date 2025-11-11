"use client";

import { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@nextui-org/react";
import { useNewsletterGeolocation } from "@/hooks/useNewsletterGeolocation";
import { supabase } from "@/lib/supabase";
import { NewsletterFormData } from "@/types/database";

interface NewsletterModalProps {
  dictionary: {
    newsletter: {
      modalTitle: string;
      modalDescription: string;
      namePlaceholder: string;
      emailPlaceholder: string;
      subscribeButton: string;
      closeButton: string;
      successMessage: string;
      errorMessage: string;
      alreadySubscribed: string;
    };
  };
  locale: string;
}

const NEWSLETTER_STORAGE_KEY = "newsletter_status";
const MODAL_DELAY_MS = 15000; // 15 seconds

export default function NewsletterModal({
  dictionary,
  locale,
}: NewsletterModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<NewsletterFormData>({
    name: "",
    email: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const { data: geoData, loading: geoLoading } = useNewsletterGeolocation();

  // Check localStorage and show modal after delay
  useEffect(() => {
    const checkAndShowModal = () => {
      const status = localStorage.getItem(NEWSLETTER_STORAGE_KEY);

      // Don't show if user already subscribed or dismissed
      if (status === "subscribed" || status === "dismissed") {
        return;
      }

      // Show modal after delay
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, MODAL_DELAY_MS);

      return () => clearTimeout(timer);
    };

    checkAndShowModal();
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    // Mark as dismissed in localStorage
    localStorage.setItem(NEWSLETTER_STORAGE_KEY, "dismissed");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (!supabase) {
        throw new Error("Supabase client not initialized");
      }

      // Get browser language
      const browserLanguage = navigator.language || "en";

      // Prepare subscription data
      const subscriptionData = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        country_code: geoData?.country_code || null,
        country_name: geoData?.country_name || null,
        city: geoData?.city || null,
        timezone: geoData?.timezone || null,
        browser_language: browserLanguage,
        page_locale: locale,
        source: "website_modal",
      };

      // Insert into Supabase
      const { error: insertError } = await supabase
        .from("newsletter_subscriptions")
        .insert(subscriptionData);

      if (insertError) {
        // Check if it's a duplicate email error
        if (insertError.code === "23505") {
          setError(dictionary.newsletter.alreadySubscribed);
        } else {
          throw insertError;
        }
        return;
      }

      // Success!
      setSuccess(true);
      localStorage.setItem(NEWSLETTER_STORAGE_KEY, "subscribed");

      // Close modal after 2 seconds
      setTimeout(() => {
        setIsOpen(false);
      }, 2000);
    } catch (err) {
      console.error("Newsletter subscription error:", err);
      setError(dictionary.newsletter.errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    field: keyof NewsletterFormData,
    value: string,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear errors when user starts typing
    if (error) setError(null);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      placement="center"
      backdrop="blur"
      size="lg"
      classNames={{
        backdrop:
          "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
        base: "bg-white dark:bg-gray-900",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 px-6 pt-6 pb-2">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {dictionary.newsletter.modalTitle}
                  </h2>
                </div>
              </div>
            </ModalHeader>
            <ModalBody className="px-6 py-4">
              {success ? (
                <div className="text-center py-8">
                  <div className="text-7xl mb-4 animate-bounce">🎉</div>
                  <p className="text-xl font-semibold text-green-600 dark:text-green-400 mb-2">
                    {dictionary.newsletter.successMessage}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Check your inbox soon!
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {dictionary.newsletter.modalDescription}
                  </p>
                  <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <Input
                      label={dictionary.newsletter.namePlaceholder}
                      labelPlacement="outside"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      required
                      variant="bordered"
                      disabled={isSubmitting || geoLoading}
                      size="lg"
                      classNames={{
                        label:
                          "font-medium text-gray-700 dark:text-gray-300 mb-1",
                        input: "text-gray-900 dark:text-white outline-none",
                        inputWrapper:
                          "border-gray-300 hover:border-gray-400 dark:border-gray-600 !outline-none focus-within:outline-none",
                      }}
                    />
                    <Input
                      type="email"
                      label={dictionary.newsletter.emailPlaceholder}
                      labelPlacement="outside"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      required
                      variant="bordered"
                      disabled={isSubmitting || geoLoading}
                      size="lg"
                      classNames={{
                        label:
                          "font-medium text-gray-700 dark:text-gray-300 mb-1",
                        input: "text-gray-900 dark:text-white outline-none",
                        inputWrapper:
                          "border-gray-300 hover:border-gray-400 dark:border-gray-600 !outline-none focus-within:outline-none",
                      }}
                    />
                    {error && (
                      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                        <p className="text-sm text-red-600 dark:text-red-400">
                          {error}
                        </p>
                      </div>
                    )}
                  </form>
                </>
              )}
            </ModalBody>
            {!success && (
              <ModalFooter className="px-6 pb-6 pt-2">
                <Button
                  color="default"
                  variant="flat"
                  onPress={onClose}
                  disabled={isSubmitting}
                  size="lg"
                  className="font-medium"
                >
                  {dictionary.newsletter.closeButton}
                </Button>
                <Button
                  color="primary"
                  onPress={() => handleSubmit(new Event("submit") as any)}
                  isLoading={isSubmitting || geoLoading}
                  disabled={!formData.email || !formData.name}
                  size="lg"
                  className="font-semibold bg-primary text-white"
                >
                  {dictionary.newsletter.subscribeButton}
                </Button>
              </ModalFooter>
            )}
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
