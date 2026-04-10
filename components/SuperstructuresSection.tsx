"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface SuperstructureItem {
  id: string;
  project: string;
  image: string;
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
}

const fallbackStructures: SuperstructureItem[] = [
  {
    id: "ss-fallback",
    project: "Contemporary Executive Villa",
    image:
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=80",
    mainImage:
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=80",
    media: [
      {
        id: 1,
        image:
          "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=80",
        isMain: true,
        sortOrder: 0,
      },
      {
        id: 2,
        image:
          "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
        isMain: false,
        sortOrder: 1,
      },
    ],
    description: "Modern double-storey design with premium finishes.",
    startingPrice: 142000,
    options: [
      { id: 1, size: "3 Bed", priceUsd: 142000, deposit20: 28400, installment24: 7100, installment36: 4733.33 },
      { id: 2, size: "4 Bed", priceUsd: 168000, deposit20: 33600, installment24: 8400, installment36: 5600 },
    ],
  },
];

function IconBed() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 11V7a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v4" />
      <path d="M3 11h18v5H3z" />
      <path d="M15 7h4a2 2 0 0 1 2 2v2h-6V7z" />
      <path d="M4 16v3M20 16v3" />
    </svg>
  );
}

function IconArrow() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14" strokeLinecap="round" />
      <path d="M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function isChipukutuProject(project: string) {
  return project.trim().toLowerCase().includes("chipukutu");
}

function isRoseGardensProject(project: string) {
  return project.trim().toLowerCase().includes("rose gardens");
}

export default function SuperstructuresSection() {
  const [structures, setStructures] = useState<SuperstructureItem[]>(fallbackStructures);
  const [activeId, setActiveId] = useState("ss-fallback");
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeMediaValue, setActiveMediaValue] = useState("");
  const [hydratedFromStorage, setHydratedFromStorage] = useState(false);

  useEffect(() => {
    try {
      const savedActiveId = window.sessionStorage.getItem("superstructures-active-id");
      const savedMediaImage = window.sessionStorage.getItem("superstructures-active-media");
      if (savedActiveId) setActiveId(savedActiveId);
      if (savedMediaImage) setActiveMediaValue(savedMediaImage);
    } catch (error) {
      console.error("Failed to restore superstructures view state:", error);
    } finally {
      setHydratedFromStorage(true);
    }
  }, []);

  useEffect(() => {
    const fetchSuperstructures = async () => {
      try {
        const response = await fetch("/api/superstructures");
        if (!response.ok) {
          throw new Error("Failed to fetch superstructures");
        }

        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setStructures(data);
          setActiveId((prev) => {
            const exists = data.some((item: SuperstructureItem) => item.id === prev);
            return exists ? prev : data[0].id;
          });
        }
      } catch (error) {
        console.error("Error fetching superstructures:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSuperstructures();
  }, []);

  const active = useMemo(
    () => structures.find((item) => item.id === activeId) ?? structures[0],
    [activeId, structures]
  );

  const formatMoney = (value: number) =>
    `$${value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;

  useEffect(() => {
    if (!hydratedFromStorage) return;
    try {
      window.sessionStorage.setItem("superstructures-active-id", activeId);
    } catch (error) {
      console.error("Failed to persist active superstructure id:", error);
    }
  }, [activeId, hydratedFromStorage]);

  const mediaItems =
    active.media && active.media.length > 0
      ? [...active.media].sort((a, b) => a.sortOrder - b.sortOrder)
      : [{ id: 0, image: active.mainImage || active.image, isMain: true, sortOrder: 0 }];

  const getMediaValue = (media: (typeof mediaItems)[number]) =>
    (media.mediaType || "image") === "video" ? media.embedUrl || media.sourceUrl || "" : media.image;

  const activeMedia =
    mediaItems.find((media) => getMediaValue(media) === activeMediaValue) ||
    mediaItems.find((media) => media.isMain) ||
    mediaItems[0];
  const isActiveVideo = (activeMedia?.mediaType || "image") === "video";
  const chipukutuProject = isChipukutuProject(active.project);
  const roseGardensProject = isRoseGardensProject(active.project);

  useEffect(() => {
    const mediaValues = new Set(mediaItems.map((item) => getMediaValue(item)).filter(Boolean));
    if (activeMediaValue && mediaValues.has(activeMediaValue)) return;
    setActiveMediaValue(getMediaValue(mediaItems.find((item) => item.isMain) || mediaItems[0]));
  }, [active, activeMediaValue, mediaItems]);

  useEffect(() => {
    if (!hydratedFromStorage || !activeMediaValue) return;
    try {
      window.sessionStorage.setItem("superstructures-active-media", activeMediaValue);
    } catch (error) {
      console.error("Failed to persist active superstructure media:", error);
    }
  }, [activeMediaValue, hydratedFromStorage]);

  return (
    <section id="superstructures" className="relative overflow-hidden bg-[#f5f8ff] px-4 py-16 sm:px-6 lg:px-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(96,165,250,0.18),transparent_42%),radial-gradient(circle_at_bottom,_rgba(59,130,246,0.10),transparent_45%)]" />
      <div className="absolute left-0 right-0 top-0 h-40 bg-gradient-to-b from-white/70 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#eaf2ff] to-transparent" />

      <div className="relative mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <h2 className="text-5xl font-bold tracking-tight sm:text-6xl">
            <span className="text-black">Super </span>
            <span className="text-[#4d78d8]">Structures</span>
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-lg text-slate-700 sm:text-[1.45rem]">
            Beyond land, we design and build modern superstructures that transform your vision into a complete home.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.45fr_0.55fr] lg:items-start">
          <div className="relative rounded-[26px] border border-white/80 bg-white/25 p-3 shadow-[0_20px_60px_rgba(58,91,160,0.14)] backdrop-blur-sm">
            <div className="relative overflow-hidden rounded-[22px]">
              <AnimatePresence mode="wait">
                {(activeMedia?.mediaType || "image") === "video" ? (
                  <motion.div
                    key={`${active.id}-${getMediaValue(activeMedia)}`}
                    className="h-[620px] w-full bg-black"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <iframe
                      src={activeMedia.embedUrl || activeMedia.sourceUrl}
                      title={`${active.project} video`}
                      className="h-full w-full"
                      allow="autoplay; encrypted-media; picture-in-picture; fullscreen; clipboard-write; web-share"
                      allowFullScreen
                    />
                  </motion.div>
                ) : (
                  <motion.img
                    key={`${active.id}-${getMediaValue(activeMedia)}`}
                    src={activeMedia?.image || active.mainImage || active.image}
                    alt={active.project}
                    className="h-[620px] w-full object-cover"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                  />
                )}
              </AnimatePresence>

              {!isActiveVideo && <div className="absolute inset-0 z-10 bg-gradient-to-t from-slate-950/35 via-slate-900/10 to-transparent" />}
              {!isActiveVideo && <div className="absolute inset-0 z-10 bg-gradient-to-t from-slate-950/78 via-slate-900/18 to-transparent" />}
              <div className="pointer-events-none absolute inset-0 rounded-[22px] ring-1 ring-white/30" />

              <div className={`absolute inset-0 z-20 flex flex-col p-4 sm:p-6 md:p-8 ${isActiveVideo ? "justify-start" : "justify-end"}`}>
                <div className="z-30 w-full max-w-[380px] rounded-2xl bg-slate-950/35 p-4 text-left text-white backdrop-blur-[1px] md:absolute md:bottom-8 md:left-8">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-white/80">
                    Project gallery
                  </p>
                  <div className="flex gap-3 overflow-x-auto pb-1">
                    {mediaItems.map((media) => {
                      const mediaType = media.mediaType || "image";
                      const mediaValue = getMediaValue(media);
                      const isSelected = activeMediaValue === mediaValue;
                      return (
                        <button
                          key={`${active.id}-media-${media.id}`}
                          type="button"
                          onClick={() => setActiveMediaValue(mediaValue)}
                          className={`overflow-hidden rounded-xl border transition ${
                            isSelected ? "border-white ring-2 ring-white/40" : "border-white/40"
                          }`}
                        >
                          {mediaType === "video" ? (
                            <div className="flex h-16 w-24 items-center justify-center bg-slate-900 text-xs font-semibold uppercase tracking-[0.1em] text-white sm:h-20 sm:w-32">
                              Video
                            </div>
                          ) : (
                            <img src={media.image} alt={`${active.project} gallery`} className="h-16 w-24 object-cover sm:h-20 sm:w-32" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {!isActiveVideo && (
                  <div className="z-30 mt-4 ml-auto w-full max-w-[450px] rounded-2xl bg-slate-950/38 px-4 py-3 text-left text-white backdrop-blur-[1px] sm:px-5 sm:py-4 md:absolute md:bottom-8 md:right-8 md:mt-0 md:w-[calc(100%-500px)]">
                    <h3 className="text-2xl font-bold leading-[1.02] tracking-tight drop-shadow-sm sm:text-[2rem]">
                      {active.project}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/90 sm:text-base">
                      {active.description}
                    </p>
                  </div>
                )}

                {!isActiveVideo && (
                  <button
                    type="button"
                    onClick={() => setModalOpen(true)}
                    className="absolute left-4 top-4 z-30 inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-[#1f74e7] to-[#44c5e8] px-6 py-3 text-base font-semibold text-white shadow-[0_12px_30px_rgba(41,110,223,0.35)] transition hover:scale-[1.02] sm:left-6 sm:top-6 md:left-8 md:top-8 sm:px-8 sm:py-4 sm:text-xl"
                  >
                    Explore Structure
                    <IconArrow />
                  </button>
                )}

              </div>
            </div>
          </div>

          <div className="rounded-[24px] border border-white/80 bg-white/35 p-3 shadow-[0_18px_50px_rgba(58,91,160,0.12)] backdrop-blur-sm">
            <div className="max-h-[620px] space-y-4 overflow-y-auto pr-1">
              {loading && (
                <div className="rounded-2xl border border-white/60 bg-white/65 p-4 text-sm text-slate-600">
                  Loading superstructures...
                </div>
              )}
              {structures.map((item) => {
                const isActive = item.id === active.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveId(item.id)}
                    className={`grid w-full grid-cols-[138px_1fr] gap-4 rounded-[20px] border p-3 text-left transition ${
                      isActive
                        ? "border-[#d7e8ff] bg-white/80 shadow-[0_10px_25px_rgba(58,91,160,0.14)]"
                        : "border-white/60 bg-white/45 hover:bg-white/65"
                    }`}
                  >
                    <img src={item.mainImage || item.image} alt={item.project} className="h-[118px] w-full rounded-[14px] object-cover" />

                    <div className="flex min-w-0 flex-col justify-center">
                      <h4 className="line-clamp-2 text-[1.08rem] font-semibold leading-6 text-slate-900 sm:text-[1.1rem]">
                        {item.project}
                      </h4>
                      <p className="mt-2 inline-flex items-center gap-2 text-[0.98rem] text-slate-700">
                        <IconBed />
                        Superstructure
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4" onClick={() => setModalOpen(false)}>
          <div
            className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl sm:p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">{active.project}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base">{active.description}</p>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Close
              </button>
            </div>

            {(activeMedia?.mediaType || "image") === "video" ? (
              <iframe
                src={activeMedia?.embedUrl || activeMedia?.sourceUrl}
                title={`${active.project} video modal`}
                className="mb-4 h-[280px] w-full rounded-2xl bg-black sm:h-[360px]"
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen; clipboard-write; web-share"
                allowFullScreen
              />
            ) : (
              <img
                src={activeMedia?.image || active.mainImage || active.image}
                alt={active.project}
                className="mb-4 h-[280px] w-full rounded-2xl object-cover sm:h-[360px]"
              />
            )}

            <div className="mb-6">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">Scrollable Media</p>
              <div className="flex gap-3 overflow-x-auto pb-1">
                {mediaItems.map((media) => (
                  <button
                    key={media.id}
                    type="button"
                    onClick={() => setActiveMediaValue(getMediaValue(media))}
                    className={`overflow-hidden rounded-xl border transition ${
                      activeMediaValue === getMediaValue(media)
                        ? "border-[#2652a2] ring-2 ring-[#2652a2]/20"
                        : "border-slate-200"
                    }`}
                  >
                    {(media.mediaType || "image") === "video" ? (
                      <div className="flex h-24 w-36 items-center justify-center bg-slate-900 text-xs font-semibold uppercase tracking-[0.1em] text-white">
                        Video
                      </div>
                    ) : (
                      <img src={media.image} alt={`${active.project} media`} className="h-24 w-36 object-cover" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="mb-2 text-sm font-semibold uppercase tracking-[0.08em] text-slate-700">Payment Terms</p>
                <p className="text-sm text-slate-700">Option 1 - Cash</p>
                <p className="mt-2 text-sm text-slate-700">
                  Option 2 - {roseGardensProject ? "20% deposit with installments over 24 and 36 months" : "40% deposit with installments over 36 months"}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="mb-2 text-sm font-semibold uppercase tracking-[0.08em] text-slate-700">Important Notes</p>
                <p className="text-sm text-slate-700">1. Prices are inclusive of VAT.</p>
                <p className="mt-2 text-sm text-slate-700">2. An administration charge of 12.5% is applied on the balance per annum.</p>
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full min-w-[640px] text-left">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-sm font-semibold text-slate-700">Project</th>
                    <th className="px-4 py-3 text-sm font-semibold text-slate-700">Size</th>
                    <th className="px-4 py-3 text-sm font-semibold text-slate-700">Price (USD)</th>
                    <th className="px-4 py-3 text-sm font-semibold text-slate-700">{chipukutuProject ? "40% Deposit" : "20% Deposit"}</th>
                    {!chipukutuProject && <th className="px-4 py-3 text-sm font-semibold text-slate-700">24 Months</th>}
                    <th className="px-4 py-3 text-sm font-semibold text-slate-700">36 Months</th>
                  </tr>
                </thead>
                <tbody>
                  {active.options.map((option) => (
                    <tr key={option.id} className="border-t border-slate-200">
                      <td className="px-4 py-3 text-sm text-slate-800">{active.project}</td>
                      <td className="px-4 py-3 text-sm text-slate-800">{option.size}</td>
                      <td className="px-4 py-3 text-sm text-slate-800">{formatMoney(option.priceUsd)}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-[#2652a2]">{formatMoney(option.deposit20)}</td>
                      {!chipukutuProject && <td className="px-4 py-3 text-sm text-slate-800">{formatMoney(option.installment24)}</td>}
                      <td className="px-4 py-3 text-sm text-slate-800">{formatMoney(option.installment36)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
