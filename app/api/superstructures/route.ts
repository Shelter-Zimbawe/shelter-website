import { NextResponse } from "next/server";
import db from "@/lib/db";

function roundMoney(value: number) {
  return Math.round(value * 100) / 100;
}

function calculateDeposit20(priceUsd: number) {
  return roundMoney(priceUsd * 0.2);
}

function isChipukutuProject(project: string) {
  return project.trim().toLowerCase().includes("chipukutu");
}

function calculateDepositForProject(project: string, priceUsd: number) {
  return isChipukutuProject(project) ? roundMoney(priceUsd * 0.4) : calculateDeposit20(priceUsd);
}

function serializeOption(item: any) {
  return {
    id: item.id,
    size: item.size,
    priceUsd: Number(item.price_usd) || 0,
    deposit20: Number(item.deposit_20) || 0,
    installment24: Number(item.installment_24) || 0,
    installment36: Number(item.installment_36) || 0,
  };
}

type MediaType = "image" | "video";
type VideoProvider = "youtube" | "tiktok" | "facebook";

function toYouTubeEmbedUrl(url: URL) {
  const host = url.hostname.toLowerCase();
  let videoId = "";
  if (host.includes("youtu.be")) {
    videoId = url.pathname.replace("/", "").split("/")[0] || "";
  } else if (host.includes("youtube.com")) {
    if (url.pathname.startsWith("/watch")) {
      videoId = url.searchParams.get("v") || "";
    } else if (url.pathname.startsWith("/shorts/")) {
      videoId = url.pathname.split("/")[2] || "";
    } else if (url.pathname.startsWith("/embed/")) {
      videoId = url.pathname.split("/")[2] || "";
    }
  }
  return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
}

function toTikTokEmbedUrl(url: URL) {
  const match = url.pathname.match(/\/video\/(\d+)/i);
  return match?.[1] ? `https://www.tiktok.com/embed/v2/${match[1]}` : "";
}

function toFacebookEmbedUrl(url: URL) {
  return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url.toString())}&show_text=false&width=560`;
}

function normalizeVideo(inputUrl: string) {
  try {
    const url = new URL(inputUrl);
    const host = url.hostname.toLowerCase();
    if (host.includes("youtube.com") || host.includes("youtu.be")) {
      const embedUrl = toYouTubeEmbedUrl(url);
      if (!embedUrl) return null;
      return { provider: "youtube" as VideoProvider, sourceUrl: url.toString(), embedUrl };
    }
    if (host.includes("tiktok.com")) {
      const embedUrl = toTikTokEmbedUrl(url);
      if (!embedUrl) return null;
      return { provider: "tiktok" as VideoProvider, sourceUrl: url.toString(), embedUrl };
    }
    if (host.includes("facebook.com") || host.includes("fb.watch")) {
      return { provider: "facebook" as VideoProvider, sourceUrl: url.toString(), embedUrl: toFacebookEmbedUrl(url) };
    }
    return null;
  } catch {
    return null;
  }
}

function normalizeMedia(input: unknown, fallbackMainImage: string) {
  const raw = Array.isArray(input) ? input : [];
  const normalized = raw
    .map((item, index) => {
      const sortOrder = Number((item as any)?.sortOrder ?? index + 1) || index + 1;
      if (typeof item === "string") {
        const image = item.trim();
        if (!image) return null;
        return { mediaType: "image" as MediaType, image, sourceUrl: image, embedUrl: "", provider: "", isMain: false, sortOrder };
      }
      const declaredType = String((item as any)?.mediaType || "").toLowerCase();
      if (declaredType === "video") {
        const url = String((item as any)?.sourceUrl || (item as any)?.url || "").trim();
        const video = normalizeVideo(url);
        if (!video) return null;
        return {
          mediaType: "video" as MediaType,
          image: "",
          sourceUrl: video.sourceUrl,
          embedUrl: video.embedUrl,
          provider: video.provider,
          isMain: false,
          sortOrder,
        };
      }
      const image = String((item as any)?.image || (item as any)?.url || "").trim();
      if (!image) return null;
      return {
        mediaType: "image" as MediaType,
        image,
        sourceUrl: image,
        embedUrl: "",
        provider: "",
        isMain: Boolean((item as any)?.isMain),
        sortOrder,
      };
    })
    .filter(Boolean) as Array<{
      mediaType: MediaType;
      image: string;
      sourceUrl: string;
      embedUrl: string;
      provider: string;
      isMain: boolean;
      sortOrder: number;
    }>;

  const images = normalized.filter((item) => item.mediaType === "image");
  if (images.length === 0 && fallbackMainImage) {
    normalized.unshift({
      mediaType: "image",
      image: fallbackMainImage,
      sourceUrl: fallbackMainImage,
      embedUrl: "",
      provider: "",
      isMain: true,
      sortOrder: 0,
    });
  }

  if (!normalized.some((item) => item.isMain && item.mediaType === "image")) {
    const firstImage = normalized.find((item) => item.mediaType === "image");
    if (firstImage) firstImage.isMain = true;
  }

  return normalized;
}

function buildGroupedSuperstructures(rows: any[], mediaRows: any[]) {
  const mediaByGroupCode = new Map<string, any[]>();
  for (const media of mediaRows) {
    const key = media.group_code || "";
    if (!mediaByGroupCode.has(key)) mediaByGroupCode.set(key, []);
    mediaByGroupCode.get(key)?.push(media);
  }

  const grouped = new Map<string, any>();

  for (const row of rows) {
    const groupCode = row.group_code || `ss-${row.id}`;
    const existing = grouped.get(groupCode);

    if (!existing) {
      const media = (mediaByGroupCode.get(groupCode) || [])
        .map((item) => ({
          id: item.id,
          image: item.image,
          mediaType: item.media_type || "image",
          sourceUrl: item.source_url || item.image || "",
          embedUrl: item.embed_url || "",
          provider: item.provider || "",
          isMain: Boolean(item.is_main),
          sortOrder: Number(item.sort_order) || 0,
        }))
        .sort((a, b) => a.sortOrder - b.sortOrder);
      const mainMedia = media.find((item) => item.isMain && item.mediaType === "image") || media.find((item) => item.mediaType === "image");
      grouped.set(groupCode, {
        id: groupCode,
        project: row.project || "",
        image: mainMedia?.image || row.image || "",
        mainImage: mainMedia?.image || row.image || "",
        media,
        description: row.description || "",
        options: [serializeOption(row)],
      });
      continue;
    }

    existing.options.push(serializeOption(row));
  }

  return Array.from(grouped.values()).map((item) => ({
    ...item,
    options: item.options.sort((a: any, b: any) => a.priceUsd - b.priceUsd),
    startingPrice: Math.min(...item.options.map((option: any) => option.priceUsd)),
  }));
}

export async function GET() {
  try {
    const rows = db
      .prepare(
        `
        SELECT *
        FROM superstructure_projects
        ORDER BY id ASC
      `
      )
      .all();
    const mediaRows = db
      .prepare(
        `
        SELECT *
        FROM superstructure_media
        ORDER BY group_code ASC, sort_order ASC, id ASC
      `
      )
      .all();

    return NextResponse.json(buildGroupedSuperstructures(rows, mediaRows));
  } catch (error) {
    console.error("Error fetching superstructures:", error);
    return NextResponse.json({ error: "Failed to fetch superstructures" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const project = String(body.project || "").trim();
    const image = String(body.mainImage || body.image || "").trim();
    const description = String(body.description || "").trim();
    const options = Array.isArray(body.options) ? body.options : [
      {
        size: body.size,
        priceUsd: body.priceUsd,
        installment24: body.installment24,
        installment36: body.installment36,
      },
    ];

    if (!project || !description || options.length === 0) {
      return NextResponse.json({ error: "Invalid superstructure payload" }, { status: 400 });
    }

    const normalizedOptions = options
      .map((option: any) => ({
        size: String(option.size || "").trim(),
        priceUsd: Number(option.priceUsd),
        installment24: isChipukutuProject(project) ? 0 : Number(option.installment24) || 0,
        installment36: Number(option.installment36) || 0,
      }))
      .filter((option: any) => option.size && Number.isFinite(option.priceUsd) && option.priceUsd > 0);

    if (normalizedOptions.length === 0) {
      return NextResponse.json({ error: "At least one valid pricing option is required" }, { status: 400 });
    }

    const groupCode = `ss-${Date.now()}-${Math.round(Math.random() * 100000)}`;
    const insertStmt = db.prepare(
      `
      INSERT INTO superstructure_projects (
        group_code, project, size, price_usd, deposit_20, installment_24, installment_36, image, description
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `
    );

    for (const option of normalizedOptions) {
      const deposit20 = calculateDepositForProject(project, option.priceUsd);
      insertStmt.run(
        groupCode,
        project,
        option.size,
        option.priceUsd,
        deposit20,
        option.installment24,
        option.installment36,
        image,
        description
      );
    }

    const normalizedMedia = normalizeMedia(body.media, image);
    const insertMediaStmt = db.prepare(`
      INSERT INTO superstructure_media (group_code, image, media_type, source_url, embed_url, provider, is_main, sort_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const media of normalizedMedia) {
      insertMediaStmt.run(
        groupCode,
        media.image,
        media.mediaType,
        media.sourceUrl,
        media.embedUrl,
        media.provider,
        media.isMain ? 1 : 0,
        media.sortOrder
      );
    }

    const insertedRows = db
      .prepare("SELECT * FROM superstructure_projects WHERE group_code = ? ORDER BY id ASC")
      .all(groupCode);
    const insertedMediaRows = db
      .prepare("SELECT * FROM superstructure_media WHERE group_code = ? ORDER BY sort_order ASC, id ASC")
      .all(groupCode);

    return NextResponse.json(buildGroupedSuperstructures(insertedRows, insertedMediaRows)[0], { status: 201 });
  } catch (error) {
    console.error("Error creating superstructure:", error);
    return NextResponse.json({ error: "Failed to create superstructure" }, { status: 500 });
  }
}
