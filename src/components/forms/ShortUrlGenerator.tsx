import React, { useState, useEffect } from "react";
import { supabase } from "../../utils/supabase";
import Button from "../common/Button";
import { HiRefresh } from "react-icons/hi";

interface ShortUrlGeneratorProps {
  formId: string;
  currentShortCode?: string;
  onShortCodeUpdate: (code: string) => void;
}

const ShortUrlGenerator: React.FC<ShortUrlGeneratorProps> = ({
  formId,
  currentShortCode,
  onShortCodeUpdate,
}) => {
  const [shortCode, setShortCode] = useState(currentShortCode || "");
  const [loading, setLoading] = useState(false);
  const [available, setAvailable] = useState<boolean | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (currentShortCode) {
      setShortCode(currentShortCode);
      setAvailable(true);
    }
  }, [currentShortCode]);

  const generateRandomCode = () => {
    const chars =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setShortCode(result);
    setAvailable(null); // Reset availability check
  };

  const checkAvailability = async () => {
    if (!shortCode) return;
    setLoading(true);
    setError("");

    try {
      // Check if code exists in short_urls
      const { data: existing } = await supabase
        .from("short_urls")
        .select("id")
        .eq("short_code", shortCode)
        .neq("form_id", formId) // Ignore if it's this form's own code
        .maybeSingle();

      if (existing) {
        setAvailable(false);
        setError("This code is already taken");
      } else {
        setAvailable(true);
      }
    } catch (err) {
      console.error("Error checking availability:", err);
      setError("Failed to check availability");
    } finally {
      setLoading(false);
    }
  };

  const saveShortUrl = async () => {
    if (!available || !shortCode) return;
    setLoading(true);

    try {
      // Upsert into short_urls
      const { error: upsertError } = await supabase.from("short_urls").upsert(
        {
          form_id: formId,
          short_code: shortCode,
          original_url: `${window.location.origin}/forms/${formId}`,
        },
        { onConflict: "form_id" }
      );

      if (upsertError) throw upsertError;

      // Also update forms table for legacy support/easy access
      await supabase
        .from("forms")
        .update({ short_code: shortCode })
        .eq("id", formId);

      onShortCodeUpdate(shortCode);
      alert("Short URL saved!");
    } catch (err) {
      console.error("Error saving short URL:", err);
      setError("Failed to save short URL");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <label className="block text-sm font-medium text-gray-700">
        Custom Short Link
      </label>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">gr8qm.com/f/</span>
          </div>
          <input
            type="text"
            value={shortCode}
            onChange={(e) => {
              setShortCode(e.target.value.replace(/[^a-zA-Z0-9]/g, ""));
              setAvailable(null);
            }}
            className={`pl-28 block w-full rounded-md border-gray-300 focus:ring-skyblue focus:border-skyblue sm:text-sm py-2 border ${
              available === true
                ? "border-green-500"
                : available === false
                ? "border-red-500"
                : ""
            }`}
            placeholder="my-form"
          />
        </div>
        <Button
          variant="sec"
          onClick={generateRandomCode}
          title="Generate Random Code"
          className="px-3"
        >
          <HiRefresh className="h-5 w-5" />
        </Button>
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}
      {available === true && (
        <p className="text-xs text-green-600">Code is available!</p>
      )}

      <div className="flex justify-end gap-2">
        <Button
          variant="sec"
          onClick={checkAvailability}
          disabled={loading || !shortCode || available === true}
          className="text-sm"
        >
          Check Availability
        </Button>
        <Button
          variant="pry"
          onClick={saveShortUrl}
          disabled={loading || !available}
          className="text-sm"
        >
          Save Short Link
        </Button>
      </div>
    </div>
  );
};

export default ShortUrlGenerator;
