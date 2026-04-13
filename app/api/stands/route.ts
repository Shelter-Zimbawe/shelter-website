import { NextResponse } from 'next/server';
import db from '@/lib/db';
import fs from 'fs';
import path from 'path';

function parseCurrency(value: string) {
  const numeric = Number(value.replace(/[^\d]/g, ''));
  return Number.isFinite(numeric) ? numeric : 0;
}

function formatFromPrice(value: number) {
  return value > 0 ? `From $${value.toLocaleString()}` : 'Custom Quote';
}

function roundMoney(value: number) {
  return Math.round(value * 100) / 100;
}

function calculatePlotFinancials(price: number) {
  const deposit30 = roundMoney(price * 0.3);

  return {
    deposit30,
  };
}

const canonicalImageFilenames: Record<string, string> = {
  "rockview.webp": "Rockview.webp",
  "adeladepark.webp": "AdeladePark.webp",
  "lendypark.webp": "LendyPark.webp",
  "chipukutu1.webp": "Chipukutu1.webp",
  "chipukutu2.jpg": "Chipukutu2.jpg",
  "chipukutumain.webp": "Chipukutumain.webp",
  "rosegardens.webp": "Rosegardens.webp",
  "rosegardens1.webp": "Rosegardens1.webp",
  "rosegardens2.webp": "Rosegardens2.webp",
  "rosegardens3.webp": "Rosegardens3.webp",
};

function normalizePublicImagePath(image: string) {
  const raw = String(image || "").trim();
  if (!raw.startsWith("/images/")) {
    return raw;
  }

  const [pathOnly, query = ""] = raw.split("?");
  const fileName = pathOnly.split("/").pop()?.toLowerCase();
  if (!fileName) {
    return raw;
  }

  const canonical = canonicalImageFilenames[fileName];
  if (!canonical) {
    return raw;
  }

  return `/images/${canonical}${query ? `?${query}` : ""}`;
}

function serializeStand(stand: any, plots: any[]) {
  return {
    ...stand,
    image: normalizePublicImagePath(stand.image),
    features: JSON.parse(stand.features || '[]'),
    available: Boolean(stand.available),
    direction: stand.direction || '',
    completionStatus: stand.completion_status || 'Ready',
    minimumPrice: stand.minimum_price || parseCurrency(stand.price || ''),
    plots: plots.map((plot) => ({
      id: plot.id,
      size: plot.size,
      price: plot.price,
      deposit30: plot.deposit_30,
      installment24: plot.installment_24,
      installment36: plot.installment_36,
      isGatedCommunity: Boolean(plot.is_gated_community),
    })),
  };
}

export async function GET() {
  try {
    // #region agent log
    const missingChunkPath = path.join(process.cwd(), '.next', 'server', '276.js');
    const missingVendorChunkPath = path.join(process.cwd(), '.next', 'server', 'vendor-chunks', 'motion-utils.js');
    fetch('http://127.0.0.1:7420/ingest/a49cfe46-a957-4a61-885f-5cafee1c01cf',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'150281'},body:JSON.stringify({sessionId:'150281',runId:'initial',hypothesisId:'H1-H4',location:'app/api/stands/route.ts:GET:entry',message:'stands GET runtime snapshot',data:{pid:process.pid,cwd:process.cwd(),nodeEnv:process.env.NODE_ENV,exists276:fs.existsSync(missingChunkPath),existsMotionUtils:fs.existsSync(missingVendorChunkPath)},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
    const stands = db.prepare('SELECT * FROM stands ORDER BY id ASC').all() as any[];
    const plotOptions = db
      .prepare('SELECT * FROM stand_plot_options ORDER BY stand_id ASC, price ASC')
      .all() as any[];

    const plotsByStandId = plotOptions.reduce<Record<number, any[]>>((acc, plot) => {
      if (!acc[plot.stand_id]) {
        acc[plot.stand_id] = [];
      }
      acc[plot.stand_id].push(plot);
      return acc;
    }, {});

    return NextResponse.json(
      stands.map((stand) => serializeStand(stand, plotsByStandId[stand.id] || []))
    );
  } catch (error) {
    // #region agent log
    fetch('http://127.0.0.1:7420/ingest/a49cfe46-a957-4a61-885f-5cafee1c01cf',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'150281'},body:JSON.stringify({sessionId:'150281',runId:'initial',hypothesisId:'H1-H4',location:'app/api/stands/route.ts:GET:catch',message:'stands GET error',data:{error: error instanceof Error ? error.message : String(error)},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
    console.error('Error fetching stands:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stands' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const minimumPrice = body.minimumPrice || parseCurrency(body.price || '');
    const normalizedImage = normalizePublicImagePath(body.image);
    const plots = Array.isArray(body.plots) ? body.plots : [];

    const stmt = db.prepare(`
      INSERT INTO stands (
        name, category, price, image, description, features, available, location, size, direction, completion_status, minimum_price
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      body.name,
      body.category,
      body.price || formatFromPrice(minimumPrice),
      normalizedImage,
      body.description,
      JSON.stringify(body.features || []),
      body.available !== undefined ? (body.available ? 1 : 0) : 1,
      body.location || '',
      body.size || '',
      body.direction || '',
      body.completionStatus || 'Ready',
      minimumPrice
    );

    if (plots.length > 0) {
      const insertPlot = db.prepare(`
        INSERT INTO stand_plot_options (stand_id, size, price, deposit_30, installment_24, installment_36, is_gated_community)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);

      for (const plot of plots) {
        const financials = calculatePlotFinancials(Number(plot.price));
        insertPlot.run(
          result.lastInsertRowid,
          plot.size,
          plot.price,
          financials.deposit30,
          Number(plot.installment24) || 0,
          Number(plot.installment36) || 0,
          plot.isGatedCommunity ? 1 : 0
        );
      }
    }

    const newStand = db.prepare('SELECT * FROM stands WHERE id = ?').get(result.lastInsertRowid) as any;
    const newStandPlots = db
      .prepare('SELECT * FROM stand_plot_options WHERE stand_id = ? ORDER BY price ASC')
      .all(result.lastInsertRowid) as any[];

    return NextResponse.json(serializeStand(newStand, newStandPlots), { status: 201 });
  } catch (error) {
    console.error('Error creating stand:', error);
    return NextResponse.json(
      { error: 'Failed to create stand' },
      { status: 500 }
    );
  }
}
