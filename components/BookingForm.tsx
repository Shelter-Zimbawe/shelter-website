"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, User, Phone, Mail, MapPin, X, CheckCircle } from "lucide-react";

interface BookingFormProps {
  onClose?: () => void;
  standId?: number;
  standName?: string;
}

interface StandOption {
  id: number;
  name: string;
  available?: boolean;
}

const FIXED_PICKUP_TIME = "10:00 AM";
const FIXED_PICKUP_ADDRESS = "95 Five Avenue";

function isAllowedVisitDate(value: string) {
  if (!value) return false;
  const date = new Date(`${value}T12:00:00`);
  const day = date.getDay();
  return day === 2 || day === 4;
}

export default function BookingForm({ onClose, standId, standName }: BookingFormProps) {
  const [stands, setStands] = useState<StandOption[]>([]);
  const [loadingStands, setLoadingStands] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    preferredDate: "",
    preferredTime: FIXED_PICKUP_TIME,
    location: standName || "",
    message: "",
    standId: standId || null,
    standName: standName || "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [dateError, setDateError] = useState("");

  useEffect(() => {
    const fetchStands = async () => {
      try {
        const response = await fetch("/api/stands");
        if (!response.ok) {
          throw new Error("Failed to fetch stands");
        }

        const data = await response.json();
        const availableStands = Array.isArray(data)
          ? data.filter((stand) => stand.available !== false).map((stand) => ({
              id: stand.id,
              name: stand.name,
              available: stand.available,
            }))
          : [];

        setStands(availableStands);
      } catch (error) {
        console.error("Error fetching stands:", error);
        setSubmitError("Unable to load available stands right now.");
      } finally {
        setLoadingStands(false);
      }
    };

    fetchStands();
  }, []);

  useEffect(() => {
    if (!standName) return;

    setFormData((current) => ({
      ...current,
      location: standName,
      standName,
      standId: standId || current.standId,
      preferredTime: FIXED_PICKUP_TIME,
    }));
  }, [standId, standName]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === "location") {
      const selectedStand = stands.find((stand) => stand.name === value);
      setFormData({
        ...formData,
        location: value,
        standId: selectedStand?.id ?? null,
        standName: selectedStand?.name ?? value,
      });
      return;
    }

    if (name === "preferredDate") {
      setDateError(
        value && !isAllowedVisitDate(value)
          ? "Site visits are only available on Tuesdays and Thursdays."
          : ""
      );
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAllowedVisitDate(formData.preferredDate)) {
      setDateError("Site visits are only available on Tuesdays and Thursdays.");
      return;
    }

    const selectedStand = stands.find((stand) => stand.name === formData.location);
    if (!selectedStand) {
      setSubmitError("Please select a valid stand from the list.");
      return;
    }

    setSubmitting(true);
    setSubmitError("");
    setDateError("");

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          preferredDate: formData.preferredDate,
          preferredTime: FIXED_PICKUP_TIME,
          location: selectedStand.name,
          message: formData.message,
          standId: selectedStand.id,
          standName: selectedStand.name,
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        setTimeout(() => {
          if (onClose) onClose();
          setSubmitted(false);
          setFormData({
            name: "",
            email: "",
            phone: "",
            preferredDate: "",
            preferredTime: FIXED_PICKUP_TIME,
            location: standName || "",
            message: "",
            standId: standId || null,
            standName: standName || "",
          });
        }, 2000);
      } else {
        setSubmitError("Failed to submit booking. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting booking:", error);
      setSubmitError("Failed to submit booking. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-2xl bg-white p-6 text-center shadow-xl sm:p-8"
      >
        <CheckCircle className="w-16 h-16 mx-auto mb-4" style={{ color: '#2652a2' }} />
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Booking Submitted!</h3>
        <p className="text-gray-600">We'll contact you soon to confirm your site visit.</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-4 shadow-2xl sm:p-6 md:p-8"
    >
      {onClose && (
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-gray-100"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      )}

      <div className="mb-6">
        <h2 className="mb-2 text-2xl font-bold text-gray-900 sm:text-3xl">Book a Site Visit</h2>
        <p className="text-gray-600">Fill out the form below and we'll get back to you to schedule your visit.</p>
        {standName && (
          <div className="mt-3 px-4 py-2 rounded-lg" style={{ backgroundColor: 'rgba(38, 82, 162, 0.12)' }}>
            <p className="text-sm font-medium" style={{ color: '#2652a2' }}>
              Stand: {standName}
            </p>
          </div>
        )}
        <div className="mt-4 rounded-xl border border-[#2652a2]/15 bg-[#f8fbff] px-4 py-3 text-sm text-slate-700">
          <p className="font-semibold text-[#2652a2]">Site Visit Details</p>
          <p>Pickup time: {FIXED_PICKUP_TIME}</p>
          <p>Pickup point: Shelter office, {FIXED_PICKUP_ADDRESS}</p>
          <p className="mt-1">Available visit days: Tuesdays and Thursdays only.</p>
        </div>
      </div>

      {submitError && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {submitError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
              style={{ ["--tw-ring-color" as string]: "rgba(38, 82, 162, 0.25)" }}
              placeholder="John Doe"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                style={{ ["--tw-ring-color" as string]: "rgba(38, 82, 162, 0.25)" }}
                placeholder="john@example.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone *
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                style={{ ["--tw-ring-color" as string]: "rgba(38, 82, 162, 0.25)" }}
                placeholder="+263 77 123 4567"
              />
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
            Stand *
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              id="location"
              name="location"
              required
              value={formData.location}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent appearance-none"
              style={{ ["--tw-ring-color" as string]: "rgba(38, 82, 162, 0.25)" }}
              disabled={loadingStands}
            >
              <option value="">{loadingStands ? "Loading stands..." : "Select a stand"}</option>
              {stands.map((stand) => (
                <option key={stand.id} value={stand.name}>
                  {stand.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="preferredDate" className="block text-sm font-medium text-gray-700 mb-1">
            Visit Date *
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="date"
              id="preferredDate"
              name="preferredDate"
              required
              value={formData.preferredDate}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
              style={{ ["--tw-ring-color" as string]: "rgba(38, 82, 162, 0.25)" }}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          <p className="mt-2 text-xs text-gray-500">Only Tuesdays and Thursdays are available for site visits.</p>
          {dateError && <p className="mt-2 text-sm text-red-600">{dateError}</p>}
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            Additional Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            value={formData.message}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
            style={{ ["--tw-ring-color" as string]: "rgba(38, 82, 162, 0.25)" }}
            placeholder="Any specific questions or requirements..."
          />
        </div>

        <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:gap-4">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 px-6 py-3 rounded-lg font-semibold text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: 'linear-gradient(135deg, #2652a2, #00aeed, #29ddda)' }}
            onMouseEnter={(e) => !submitting && (e.currentTarget.style.background = 'linear-gradient(135deg, #1f468d, #2652a2, #00aeed)')}
            onMouseLeave={(e) => !submitting && (e.currentTarget.style.background = 'linear-gradient(135deg, #2652a2, #00aeed, #29ddda)')}
          >
            {submitting ? "Submitting..." : "Submit Booking"}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
