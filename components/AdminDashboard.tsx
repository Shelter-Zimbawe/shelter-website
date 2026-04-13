"use client";

import { useEffect, useState } from "react";
import { Building2, Layers3, Users, Edit, Plus, Trash2 } from "lucide-react";

type Tab = "stands" | "superstructures" | "bookings";

interface Stand {
  id: number;
  name: string;
  category?: string;
  price: string;
  minimumPrice?: number;
  image?: string;
  description?: string;
  features?: string[];
  available?: boolean;
  location?: string;
  direction?: string;
  completionStatus?: string;
  size?: string;
  plots?: Array<{
    id?: number;
    size: number;
    price: number;
    installment24?: number;
    installment36?: number;
    isGatedCommunity?: boolean;
  }>;
}

interface StandFormState {
  name: string;
  category: string;
  price: string;
  image: string;
  description: string;
  featuresText: string;
  location: string;
  direction: string;
  completionStatus: string;
  size: string;
  plotOptionsText: string;
  available: boolean;
}

interface Superstructure {
  id: string;
  project: string;
  image: string;
  description: string;
  startingPrice: number;
  options: Array<{
    id: number;
    size: string;
    priceUsd: number;
    deposit20: number;
    installment24: number;
    installment36: number;
  }>;
  mainImage?: string;
  media?: Array<{
    id: number;
    image: string;
    mediaType?: "image" | "video";
    sourceUrl?: string;
    embedUrl?: string;
    provider?: string;
    isMain: boolean;
    sortOrder: number;
  }>;
}

interface Booking {
  id: number;
  name: string;
  email: string;
  status: string;
}

interface FormState {
  project: string;
  optionsText: string;
  mainImage: string;
  mediaText: string;
  videoText: string;
  description: string;
}

const createForm = (item?: Superstructure): FormState => ({
  project: item?.project || "",
  optionsText:
    item?.options
      ?.map((option) => `${option.size}, ${option.priceUsd}, ${option.installment24}, ${option.installment36}`)
      .join("\n") || "",
  mainImage: item?.mainImage || item?.image || "",
  mediaText:
    item?.media
      ?.filter((media) => (media.mediaType || "image") === "image" && !media.isMain)
      .map((media) => media.image)
      .join("\n") || "",
  videoText:
    item?.media
      ?.filter((media) => (media.mediaType || "image") === "video")
      .map((media) => media.sourceUrl || media.embedUrl || "")
      .filter(Boolean)
      .join("\n") || "",
  description: item?.description || "",
});

const formatPlotOptionsText = (plots: Stand["plots"] = []) =>
  plots
    .map(
      (plot) =>
        `${plot.size}, ${plot.price}, ${plot.installment24 ?? 0}, ${plot.installment36 ?? 0}${plot.isGatedCommunity ? ", gated" : ""}`
    )
    .join("\n");

function parsePlotOptionsText(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [sizeText = "", priceText = "", installment24Text = "", installment36Text = "", gatedText = ""] =
        line.split(",");
      const size = Number(sizeText.replace(/[^\d.]/g, ""));
      const price = Number(priceText.replace(/[^\d.]/g, ""));
      const installment24 = Number(installment24Text.replace(/[^\d.]/g, ""));
      const installment36 = Number(installment36Text.replace(/[^\d.]/g, ""));
      const isGatedCommunity = ["gated", "yes", "true", "1"].includes(gatedText.trim().toLowerCase());

      if (!Number.isFinite(size) || size <= 0 || !Number.isFinite(price) || price <= 0) return null;
      return {
        size,
        price,
        installment24: Number.isFinite(installment24) ? installment24 : 0,
        installment36: Number.isFinite(installment36) ? installment36 : 0,
        isGatedCommunity,
      };
    })
    .filter(Boolean);
}

function parseOptionsText(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [size = "", priceText = "", installment24Text = "", installment36Text = ""] = line
        .split(",")
        .map((part) => part.trim());

      return {
        size,
        priceUsd: Number(priceText),
        installment24: Number(installment24Text) || 0,
        installment36: Number(installment36Text) || 0,
      };
    })
    .filter((option) => option.size && Number.isFinite(option.priceUsd) && option.priceUsd > 0);
}

function isChipukutuProject(project: string) {
  const normalized = project.trim().toLowerCase();
  return normalized.includes("chipukutu");
}

function normalizeOptionsForProject(project: string, options: Array<{ size: string; priceUsd: number; installment24: number; installment36: number }>) {
  if (!isChipukutuProject(project)) return options;
  return options.map((option) => ({
    ...option,
    installment24: 0,
  }));
}

function parseMediaText(mainImage: string, value: string) {
  const others = value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const media = [];
  if (mainImage.trim()) {
    media.push({ mediaType: "image", image: mainImage.trim(), isMain: true, sortOrder: 0 });
  }

  others.forEach((image, index) => {
    media.push({ mediaType: "image", image, isMain: false, sortOrder: index + 1 });
  });

  return media;
}

function parseVideoText(value: string, startSortOrder: number) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((sourceUrl, index) => ({
      mediaType: "video",
      sourceUrl,
      isMain: false,
      sortOrder: startSortOrder + index,
    }));
}

export default function AdminDashboard() {
  const [tab, setTab] = useState<Tab>("stands");
  const [stands, setStands] = useState<Stand[]>([]);
  const [superstructures, setSuperstructures] = useState<Superstructure[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [editing, setEditing] = useState<Superstructure | null>(null);
  const [form, setForm] = useState<FormState | null>(null);
  const [editingStand, setEditingStand] = useState<Stand | null>(null);
  const [standForm, setStandForm] = useState<StandFormState | null>(null);

  const fetchJson = async <T,>(url: string, init?: RequestInit): Promise<T> => {
    const res = await fetch(url, init);
    if (!res.ok) {
      let message = `Request failed (${res.status})`;
      try {
        const body = await res.json();
        if (body?.error) {
          message = body.error;
        }
      } catch {
        // Keep fallback message if response body isn't JSON.
      }
      throw new Error(message);
    }
    return res.json();
  };

  const refresh = async () => {
    setLoading(true);
    setError(null);
    try {
      if (tab === "stands") {
        setStands(await fetchJson<Stand[]>("/api/stands"));
      } else if (tab === "superstructures") {
        setSuperstructures(await fetchJson<Superstructure[]>("/api/superstructures"));
      } else {
        setBookings(await fetchJson<Booking[]>("/api/bookings"));
      }
    } catch (err) {
      console.error("Dashboard refresh failed:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, [tab]);

  const deleteStand = async (id: number) => {
    if (!confirm("Delete this stand?")) return;
    await fetch(`/api/stands/${id}`, { method: "DELETE" });
    refresh();
  };

  const openEditStand = (stand: Stand) => {
    setEditingStand(stand);
    setStandForm({
      name: stand.name,
      category: stand.category || "",
      price: stand.price,
      image: stand.image || "",
      description: stand.description || "",
      featuresText: (stand.features || []).join("\n"),
      location: stand.location || "",
      direction: stand.direction || "",
      completionStatus: stand.completionStatus || "Ready",
      size: stand.size || "",
      plotOptionsText: formatPlotOptionsText(stand.plots),
      available: Boolean(stand.available),
    });
  };

  const closeEditStand = () => {
    setEditingStand(null);
    setStandForm(null);
  };

  const submitStand = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingStand || !standForm) return;

    const plots = parsePlotOptionsText(standForm.plotOptionsText);
    const minimumPrice = plots.length > 0 ? Math.min(...plots.map((plot: any) => plot.price)) : undefined;

    await fetch(`/api/stands/${editingStand.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: standForm.name,
        category: standForm.category,
        price: standForm.price,
        image: standForm.image,
        description: standForm.description,
        features: standForm.featuresText
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean),
        location: standForm.location,
        direction: standForm.direction,
        completionStatus: standForm.completionStatus,
        size: standForm.size,
        available: standForm.available,
        minimumPrice,
        plots,
      }),
    });

    closeEditStand();
    refresh();
  };

  const deleteSuperstructure = async (id: number | string) => {
    if (!confirm("Delete this superstructure?")) return;
    await fetch(`/api/superstructures/${id}`, { method: "DELETE" });
    refresh();
  };

  const updateBooking = async (id: number, status: string) => {
    await fetch(`/api/bookings/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    refresh();
  };

  const openCreate = () => {
    setModalMode("create");
    setEditing(null);
    setForm(createForm());
  };

  const openEdit = (item: Superstructure) => {
    setModalMode("edit");
    setEditing(item);
    setForm(createForm(item));
  };

  const closeModal = () => {
    setModalMode(null);
    setEditing(null);
    setForm(null);
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form || !modalMode) return;

    const parsedOptions = parseOptionsText(form.optionsText);
    const payload = {
      project: form.project,
      options: normalizeOptionsForProject(form.project, parsedOptions),
      mainImage: form.mainImage,
      media: [
        ...parseMediaText(form.mainImage, form.mediaText),
        ...parseVideoText(form.videoText, parseMediaText(form.mainImage, form.mediaText).length),
      ],
      description: form.description,
    };

    const url = modalMode === "create" ? "/api/superstructures" : `/api/superstructures/${editing?.id}`;
    const method = modalMode === "create" ? "POST" : "PUT";
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    closeModal();
    refresh();
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="mb-2 text-4xl font-bold text-gray-900">Admin Dashboard</h1>
        <div className="mb-8 flex items-center justify-between">
          <p className="text-gray-600">Manage stands, superstructures, and bookings</p>
          <button onClick={logout} className="rounded border px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
            Logout
          </button>
        </div>

        <div className="mb-6 flex gap-4 border-b border-gray-200">
          <button onClick={() => setTab("stands")} className={`border-b-2 px-6 py-3 font-semibold ${tab === "stands" ? "border-[#29ddda] text-[#29ddda]" : "border-transparent text-gray-600"}`}><Building2 className="mr-2 inline-block h-5 w-5" />Stands</button>
          <button onClick={() => setTab("superstructures")} className={`border-b-2 px-6 py-3 font-semibold ${tab === "superstructures" ? "border-[#29ddda] text-[#29ddda]" : "border-transparent text-gray-600"}`}><Layers3 className="mr-2 inline-block h-5 w-5" />Superstructures</button>
          <button onClick={() => setTab("bookings")} className={`border-b-2 px-6 py-3 font-semibold ${tab === "bookings" ? "border-[#29ddda] text-[#29ddda]" : "border-transparent text-gray-600"}`}><Users className="mr-2 inline-block h-5 w-5" />Bookings</button>
        </div>

        {error && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="py-16 text-center text-gray-600">Loading...</div>
        ) : (
          <div className="overflow-hidden rounded-lg bg-white shadow-lg">
            {tab === "stands" && (
              <div className="p-6">
                <h2 className="mb-6 text-2xl font-bold text-gray-900">Stands</h2>
                <table className="w-full">
                  <thead><tr className="border-b"><th className="px-4 py-3 text-left">Name</th><th className="px-4 py-3 text-left">Price</th><th className="px-4 py-3 text-left">Actions</th></tr></thead>
                  <tbody>
                    {stands.map((s) => (
                      <tr key={s.id} className="border-b">
                        <td className="px-4 py-3">{s.name}</td>
                        <td className="px-4 py-3">{s.minimumPrice ? `From $${s.minimumPrice.toLocaleString()}` : s.price}</td>
                        <td className="px-4 py-3">
                          <button onClick={() => openEditStand(s)} className="mr-2 rounded p-2 hover:bg-blue-50"><Edit className="h-4 w-4 text-blue-600" /></button>
                          <button onClick={() => deleteStand(s.id)} className="rounded p-2 hover:bg-red-50"><Trash2 className="h-4 w-4 text-red-600" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {tab === "superstructures" && (
              <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Superstructures</h2>
                  <button onClick={openCreate} className="inline-flex items-center gap-2 rounded-lg bg-[#29ddda] px-4 py-2 font-semibold text-white"><Plus className="h-4 w-4" />New Superstructure</button>
                </div>
                <table className="w-full">
                  <thead><tr className="border-b"><th className="px-4 py-3 text-left">Project</th><th className="px-4 py-3 text-left">Gallery Preview</th><th className="px-4 py-3 text-left">Size</th><th className="px-4 py-3 text-left">Price USD</th><th className="px-4 py-3 text-left">20% Deposit</th><th className="px-4 py-3 text-left">Actions</th></tr></thead>
                  <tbody>
                    {superstructures.map((item) => {
                      const chipukutu = isChipukutuProject(item.project);
                      return (
                      <tr key={item.id} className="border-b">
                        <td className="px-4 py-3">{item.project}</td>
                        <td className="px-4 py-3">
                          <div className="max-w-[320px]">
                            <img
                              src={item.mainImage || item.image}
                              alt={`${item.project} main`}
                              className="mb-2 h-16 w-28 rounded-lg object-cover"
                            />
                            <div className="flex gap-2 overflow-x-auto pb-1">
                              {(item.media && item.media.length > 0
                                ? [...item.media].sort((a, b) => a.sortOrder - b.sortOrder)
                                : [{ id: 0, image: item.mainImage || item.image, isMain: true, sortOrder: 0 }]
                              ).map((media) => {
                                const mediaType = media.mediaType || "image";
                                if (mediaType === "video") {
                                  return (
                                    <a
                                      key={`${item.id}-preview-${media.id}`}
                                      href={media.sourceUrl || media.embedUrl || "#"}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="flex h-12 w-16 flex-shrink-0 items-center justify-center rounded-md border border-slate-300 bg-slate-900 text-[10px] font-semibold uppercase tracking-[0.08em] text-white"
                                    >
                                      Video
                                    </a>
                                  );
                                }
                                return (
                                  <img
                                    key={`${item.id}-preview-${media.id}`}
                                    src={media.image}
                                    alt={`${item.project} preview`}
                                    className={`h-12 w-16 flex-shrink-0 rounded-md object-cover ${
                                      media.isMain ? "ring-2 ring-[#29ddda]/70" : ""
                                    }`}
                                  />
                                );
                              })}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">{item.options.length} options</td>
                        <td className="px-4 py-3">${item.startingPrice.toLocaleString()}</td>
                        <td className="px-4 py-3">{chipukutu ? "40% by option" : "20% by option"}</td>
                        <td className="px-4 py-3">
                          <button onClick={() => openEdit(item)} className="mr-2 rounded p-2 hover:bg-blue-50"><Edit className="h-4 w-4 text-blue-600" /></button>
                          <button onClick={() => deleteSuperstructure(item.id)} className="rounded p-2 hover:bg-red-50"><Trash2 className="h-4 w-4 text-red-600" /></button>
                        </td>
                      </tr>
                    )})}
                  </tbody>
                </table>
              </div>
            )}

            {tab === "bookings" && (
              <div className="p-6">
                <h2 className="mb-6 text-2xl font-bold text-gray-900">Bookings</h2>
                <table className="w-full">
                  <thead><tr className="border-b"><th className="px-4 py-3 text-left">Name</th><th className="px-4 py-3 text-left">Email</th><th className="px-4 py-3 text-left">Status</th><th className="px-4 py-3 text-left">Actions</th></tr></thead>
                  <tbody>
                    {bookings.map((b) => (
                      <tr key={b.id} className="border-b">
                        <td className="px-4 py-3">{b.name}</td>
                        <td className="px-4 py-3">{b.email}</td>
                        <td className="px-4 py-3">{b.status}</td>
                        <td className="px-4 py-3">
                          <select value={b.status} onChange={(e) => updateBooking(b.id, e.target.value)} className="rounded border px-2 py-1 text-xs">
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {modalMode && form && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <h2 className="text-2xl font-bold">{modalMode === "create" ? "Create Superstructure" : "Edit Superstructure"}</h2>
              <button onClick={closeModal} className="rounded border px-3 py-2 text-sm">Close</button>
            </div>
            <form onSubmit={submit} className="grid gap-4 p-6 md:grid-cols-2">
              <input value={form.project} onChange={(e) => setForm({ ...form, project: e.target.value })} className="rounded border px-3 py-2" placeholder="Project name" required />
              <textarea
                value={form.optionsText}
                onChange={(e) => setForm({ ...form, optionsText: e.target.value })}
                className="min-h-24 rounded border px-3 py-2 md:col-span-2"
                placeholder={"3 Bed, 142000, 7100, 4733.33\n4 Bed, 168000, 8400, 5600"}
                required
              />
              <input value={form.mainImage} onChange={(e) => setForm({ ...form, mainImage: e.target.value })} className="rounded border px-3 py-2 md:col-span-2" placeholder="Main image URL" required />
              <textarea
                value={form.mediaText}
                onChange={(e) => setForm({ ...form, mediaText: e.target.value })}
                className="min-h-24 rounded border px-3 py-2 md:col-span-2"
                placeholder={"Additional media URL 1\nAdditional media URL 2"}
              />
              <textarea
                value={form.videoText}
                onChange={(e) => setForm({ ...form, videoText: e.target.value })}
                className="min-h-20 rounded border px-3 py-2 md:col-span-2"
                placeholder={"YouTube / TikTok / Facebook video URL 1\nVideo URL 2"}
              />
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="min-h-24 rounded border px-3 py-2 md:col-span-2" placeholder="Description" required />
              <p className="text-xs text-gray-500 md:col-span-2">One option per line: size, priceUSD, installment24, installment36. For Chipukutu projects, deposit is automatically 40% and 24-month installment is ignored (36 months only). Add one image URL per line for scrollable media and optional YouTube/TikTok/Facebook video URLs.</p>
              <div className="sticky bottom-0 md:col-span-2 -mx-6 -mb-6 flex justify-end gap-3 border-t bg-white/95 px-6 py-4 backdrop-blur">
                <button type="button" onClick={closeModal} className="rounded border px-4 py-2">Cancel</button>
                <button type="submit" className="rounded bg-[#29ddda] px-4 py-2 font-semibold text-white">{modalMode === "create" ? "Create" : "Save"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingStand && standForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <h2 className="text-2xl font-bold">Edit Stand</h2>
              <button onClick={closeEditStand} className="rounded border px-3 py-2 text-sm">Close</button>
            </div>
            <form onSubmit={submitStand} className="grid gap-4 p-6 md:grid-cols-2">
              <input
                value={standForm.name}
                onChange={(e) => setStandForm({ ...standForm, name: e.target.value })}
                className="rounded border px-3 py-2"
                placeholder="Stand name"
                required
              />
              <input
                value={standForm.category}
                onChange={(e) => setStandForm({ ...standForm, category: e.target.value })}
                className="rounded border px-3 py-2"
                placeholder="Category"
                required
              />
              <input
                value={standForm.price}
                onChange={(e) => setStandForm({ ...standForm, price: e.target.value })}
                className="rounded border px-3 py-2"
                placeholder="Price text"
                required
              />
              <input
                value={standForm.size}
                onChange={(e) => setStandForm({ ...standForm, size: e.target.value })}
                className="rounded border px-3 py-2"
                placeholder="Size"
              />
              <input
                value={standForm.location}
                onChange={(e) => setStandForm({ ...standForm, location: e.target.value })}
                className="rounded border px-3 py-2 md:col-span-2"
                placeholder="Location"
              />
              <input
                value={standForm.direction}
                onChange={(e) => setStandForm({ ...standForm, direction: e.target.value })}
                className="rounded border px-3 py-2 md:col-span-2"
                placeholder="Direction"
              />
              <select
                value={standForm.completionStatus}
                onChange={(e) => setStandForm({ ...standForm, completionStatus: e.target.value })}
                className="rounded border px-3 py-2"
              >
                <option value="Ready">Ready</option>
                <option value="Serviced">Serviced</option>
                <option value="Servicing">Servicing</option>
              </select>
              <label className="flex items-center gap-2 rounded border px-3 py-2">
                <input
                  type="checkbox"
                  checked={standForm.available}
                  onChange={(e) => setStandForm({ ...standForm, available: e.target.checked })}
                />
                Available
              </label>
              <input
                value={standForm.image}
                onChange={(e) => setStandForm({ ...standForm, image: e.target.value })}
                className="rounded border px-3 py-2 md:col-span-2"
                placeholder="Image URL"
                required
              />
              <textarea
                value={standForm.description}
                onChange={(e) => setStandForm({ ...standForm, description: e.target.value })}
                className="min-h-24 rounded border px-3 py-2 md:col-span-2"
                placeholder="Description"
                required
              />
              <textarea
                value={standForm.featuresText}
                onChange={(e) => setStandForm({ ...standForm, featuresText: e.target.value })}
                className="min-h-24 rounded border px-3 py-2 md:col-span-2"
                placeholder="Features (one per line)"
              />
              <textarea
                value={standForm.plotOptionsText}
                onChange={(e) => setStandForm({ ...standForm, plotOptionsText: e.target.value })}
                className="min-h-24 rounded border px-3 py-2 md:col-span-2"
                placeholder={"200, 200000, 9000, 6500\n300, 300000, 13000, 9400"}
              />
              <div className="flex justify-end gap-3">
                <button type="button" onClick={closeEditStand} className="rounded border px-4 py-2">Cancel</button>
                <button type="submit" className="rounded bg-[#29ddda] px-4 py-2 font-semibold text-white">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
