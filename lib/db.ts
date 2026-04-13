import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const configuredDbPath = process.env.DB_PATH?.trim();
const dbPath = configuredDbPath
  ? path.isAbsolute(configuredDbPath)
    ? configuredDbPath
    : path.join(process.cwd(), configuredDbPath)
  : path.join(process.cwd(), 'data', 'shelter.db');
const dbDir = path.dirname(dbPath);
const shouldSeedDatabase =
  process.env.SEED_DATABASE === "true" ||
  (process.env.SEED_DATABASE !== "false" && process.env.NODE_ENV !== "production");

// Ensure data directory exists
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Create database connection
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

type PlotSeed = {
  size: number;
  price: number;
  isGatedCommunity?: boolean;
};

type PlotFinancials = {
  deposit30: number;
};

type SuperstructureFinancials = {
  deposit20: number;
};

const defaultStandMetadata: Record<
  string,
  {
    direction: string;
    completionStatus: string;
    minimumPrice: number;
    plots: PlotSeed[];
  }
> = {
  Rockview: {
    direction: "South-east of Harare, along the Masvingo corridor",
    completionStatus: "Serviced",
    minimumPrice: 13500,
    plots: [
      { size: 200, price: 14350 },
      { size: 300, price: 13500 },
      { size: 500, price: 18000 },
    ],
  },
  "Adelaide Park": {
    direction: "East of Harare, close to Mutare Road growth zones",
    completionStatus: "Servicing",
    minimumPrice: 18000,
    plots: [
      { size: 300, price: 18000 },
      { size: 500, price: 24500 },
      { size: 800, price: 36000 },
    ],
  },
  "Residential Development": {
    direction: "West of Harare with quick access to key transport links",
    completionStatus: "Ready",
    minimumPrice: 12000,
    plots: [
      { size: 150, price: 12000 },
      { size: 200, price: 14250 },
      { size: 300, price: 17500 },
    ],
  },
  "Elite Estates": {
    direction: "Northern corridor of Harare in a premium residential zone",
    completionStatus: "Serviced",
    minimumPrice: 28000,
    plots: [
      { size: 500, price: 28000 },
      { size: 800, price: 42000 },
      { size: 1200, price: 65000 },
    ],
  },
  "Multiple Locations": {
    direction: "Available across selected developments around Harare",
    completionStatus: "Servicing",
    minimumPrice: 3500,
    plots: [
      { size: 100, price: 3500 },
      { size: 150, price: 5200 },
      { size: 200, price: 6900 },
    ],
  },
  Custom: {
    direction: "Available in growth corridors based on your preferred location",
    completionStatus: "Ready",
    minimumPrice: 15000,
    plots: [
      { size: 200, price: 15000 },
      { size: 300, price: 21000 },
      { size: 500, price: 32000 },
    ],
  },
};

function getTableColumns(table: string): string[] {
  return (db.prepare(`PRAGMA table_info(${table})`).all() as Array<{ name: string }>).map(
    (column) => column.name
  );
}

function ensureColumn(table: string, column: string, definition: string) {
  const columns = getTableColumns(table);
  if (!columns.includes(column)) {
    db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
  }
}

function parseCurrency(value: string) {
  const numeric = Number(value.replace(/[^\d]/g, ""));
  return Number.isFinite(numeric) ? numeric : 0;
}

function formatFromPrice(value: number) {
  return value > 0 ? `From $${value.toLocaleString()}` : "Custom Quote";
}

function roundMoney(value: number) {
  return Math.round(value * 100) / 100;
}

function calculatePlotFinancials(price: number): PlotFinancials {
  return {
    deposit30: roundMoney(price * 0.3),
  };
}

function calculateSuperstructureFinancials(price: number): SuperstructureFinancials {
  return {
    deposit20: roundMoney(price * 0.2),
  };
}

function getStandMetadata(location: string, price: string) {
  const metadata = defaultStandMetadata[location] ?? {
    direction: "In a growth corridor around Harare",
    completionStatus: "Ready",
    minimumPrice: parseCurrency(price),
    plots: [
      { size: 200, price: Math.max(parseCurrency(price), 12000) || 12000 },
      { size: 300, price: Math.max(parseCurrency(price) + 2500, 14500) || 14500 },
      { size: 500, price: Math.max(parseCurrency(price) + 6000, 18000) || 18000 },
    ],
  };

  return {
    direction: metadata.direction,
    completionStatus: metadata.completionStatus,
    minimumPrice: metadata.minimumPrice || parseCurrency(price),
    plots: metadata.plots,
  };
}

function isDefaultGatedPlot(location: string, plot: { size: number; price: number }) {
  return location === "Adelaide Park" && plot.size === 1000 && plot.price === 46800;
}

function syncStandMetadataAndPlots() {
  const stands = db
    .prepare(
      "SELECT id, price, location, direction, completion_status, minimum_price FROM stands ORDER BY id ASC"
    )
    .all() as Array<{
      id: number;
      price: string;
      location: string;
      direction: string;
      completion_status: string;
      minimum_price: number;
    }>;

  const updateStand = db.prepare(`
    UPDATE stands
    SET price = ?, direction = ?, completion_status = ?, minimum_price = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `);
  const plotCountStmt = db.prepare("SELECT COUNT(*) as count FROM stand_plot_options WHERE stand_id = ?");
  const insertPlot = db.prepare(`
    INSERT INTO stand_plot_options (stand_id, size, price, deposit_30, installment_24, installment_36, is_gated_community)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  const existingPlots = db
    .prepare(`
      SELECT stand_plot_options.id, stand_plot_options.price, stand_plot_options.size, stand_plot_options.is_gated_community, stands.location
      FROM stand_plot_options
      JOIN stands ON stands.id = stand_plot_options.stand_id
      ORDER BY stand_plot_options.id ASC
    `)
    .all() as Array<{
      id: number;
      price: number;
      size: number;
      is_gated_community: number;
      location: string;
    }>;
  const updatePlotFinancials = db.prepare(`
    UPDATE stand_plot_options
    SET deposit_30 = ?, is_gated_community = ?
    WHERE id = ?
  `);

  for (const stand of stands) {
    const metadata = getStandMetadata(stand.location, stand.price);
    const effectiveMinimumPrice = stand.minimum_price || metadata.minimumPrice;
    const currentPrice = stand.price?.trim() ? stand.price : formatFromPrice(effectiveMinimumPrice);

    updateStand.run(
      currentPrice,
      stand.direction || metadata.direction,
      stand.completion_status || metadata.completionStatus,
      effectiveMinimumPrice,
      stand.id
    );

    const plotCount = plotCountStmt.get(stand.id) as { count: number };
    if (plotCount.count === 0) {
      for (const plot of metadata.plots) {
        const financials = calculatePlotFinancials(plot.price);
        insertPlot.run(
          stand.id,
          plot.size,
          plot.price,
          financials.deposit30,
          0,
          0,
          plot.isGatedCommunity || isDefaultGatedPlot(stand.location, plot) ? 1 : 0
        );
      }
    }
  }

  for (const plot of existingPlots) {
    const financials = calculatePlotFinancials(plot.price);
    updatePlotFinancials.run(
      financials.deposit30,
      plot.is_gated_community || isDefaultGatedPlot(plot.location, plot) ? 1 : 0,
      plot.id
    );
  }
}

// Initialize database tables if they don't exist
export function initDatabase() {
  // Stands table
  db.exec(`
    CREATE TABLE IF NOT EXISTS stands (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      price TEXT NOT NULL,
      image TEXT NOT NULL,
      description TEXT NOT NULL,
      features TEXT DEFAULT '[]',
      available INTEGER DEFAULT 1,
      location TEXT DEFAULT '',
      size TEXT DEFAULT '',
      direction TEXT DEFAULT '',
      completion_status TEXT DEFAULT 'Ready',
      minimum_price INTEGER DEFAULT 0,
      is_gated_community INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  ensureColumn("stands", "direction", "TEXT DEFAULT ''");
  ensureColumn("stands", "completion_status", "TEXT DEFAULT 'Ready'");
  ensureColumn("stands", "minimum_price", "INTEGER DEFAULT 0");
  ensureColumn("stands", "is_gated_community", "INTEGER DEFAULT 0");

  db.exec(`
    CREATE TABLE IF NOT EXISTS stand_plot_options (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      stand_id INTEGER NOT NULL,
      size INTEGER NOT NULL,
      price INTEGER NOT NULL,
      deposit_30 REAL DEFAULT 0,
      installment_24 REAL DEFAULT 0,
      installment_36 REAL DEFAULT 0,
      is_gated_community INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (stand_id) REFERENCES stands(id) ON DELETE CASCADE
    )
  `);

  ensureColumn("stand_plot_options", "deposit_30", "REAL DEFAULT 0");
  ensureColumn("stand_plot_options", "installment_24", "REAL DEFAULT 0");
  ensureColumn("stand_plot_options", "installment_36", "REAL DEFAULT 0");
  ensureColumn("stand_plot_options", "is_gated_community", "INTEGER DEFAULT 0");

  db.exec("DROP TABLE IF EXISTS projects");

  db.exec(`
    CREATE TABLE IF NOT EXISTS superstructure_projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      group_code TEXT DEFAULT '',
      project TEXT NOT NULL,
      size TEXT NOT NULL,
      price_usd REAL NOT NULL,
      deposit_20 REAL DEFAULT 0,
      installment_24 REAL DEFAULT 0,
      installment_36 REAL DEFAULT 0,
      image TEXT NOT NULL,
      description TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  ensureColumn("superstructure_projects", "group_code", "TEXT DEFAULT ''");
  ensureColumn("superstructure_projects", "deposit_20", "REAL DEFAULT 0");
  ensureColumn("superstructure_projects", "installment_24", "REAL DEFAULT 0");
  ensureColumn("superstructure_projects", "installment_36", "REAL DEFAULT 0");
  ensureColumn("superstructure_projects", "image", "TEXT DEFAULT ''");
  ensureColumn("superstructure_projects", "description", "TEXT DEFAULT ''");
  db.exec(`
    UPDATE superstructure_projects
    SET group_code = 'ss-' || id
    WHERE group_code IS NULL OR TRIM(group_code) = ''
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS superstructure_media (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      group_code TEXT NOT NULL,
      image TEXT NOT NULL,
      media_type TEXT DEFAULT 'image',
      source_url TEXT DEFAULT '',
      embed_url TEXT DEFAULT '',
      provider TEXT DEFAULT '',
      is_main INTEGER DEFAULT 0,
      sort_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  ensureColumn("superstructure_media", "media_type", "TEXT DEFAULT 'image'");
  ensureColumn("superstructure_media", "source_url", "TEXT DEFAULT ''");
  ensureColumn("superstructure_media", "embed_url", "TEXT DEFAULT ''");
  ensureColumn("superstructure_media", "provider", "TEXT DEFAULT ''");
  ensureColumn("superstructure_media", "is_main", "INTEGER DEFAULT 0");
  ensureColumn("superstructure_media", "sort_order", "INTEGER DEFAULT 0");
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_superstructure_media_group_code
    ON superstructure_media(group_code)
  `);

  // Bookings table
  db.exec(`
    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      preferred_date DATE NOT NULL,
      preferred_time TEXT NOT NULL,
      location TEXT NOT NULL,
      message TEXT,
      stand_id INTEGER,
      stand_name TEXT,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (stand_id) REFERENCES stands(id) ON DELETE SET NULL
    )
  `);

  // Create indexes
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_stands_category ON stands(category);
    CREATE INDEX IF NOT EXISTS idx_stands_available ON stands(available);
    CREATE INDEX IF NOT EXISTS idx_superstructure_projects_project ON superstructure_projects(project);
    CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
    CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at DESC);
  `);

  if (shouldSeedDatabase) {
    // Insert sample data if tables are empty
    const standCount = db.prepare('SELECT COUNT(*) as count FROM stands').get() as { count: number };
    if (standCount.count === 0) {
      const insertStand = db.prepare(`
        INSERT INTO stands (
          name, category, price, image, description, features, available, location, size, direction, completion_status, minimum_price
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const stands = [
        {
          name: "Rockview Gardens",
          category: "Residential",
          image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop",
          description: "Well-positioned residential stands with flexible terms for families and investors.",
          features: ["Flexible payment terms", "Road access", "Growing residential community"],
          available: 1,
          location: "Rockview",
          size: "200 - 500 sqm",
        },
        {
          name: "Adelaide Park Estate",
          category: "Premium",
          image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&h=600&fit=crop",
          description: "Premium development with larger stand options in a fast-growing eastern corridor.",
          features: ["Large plots available", "Prime growth corridor", "Ideal for long-term value"],
          available: 1,
          location: "Adelaide Park",
          size: "300 - 800 sqm",
        },
        {
          name: "Cornerstone Residences",
          category: "Entry",
          image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop",
          description: "Affordable residential options with manageable plot sizes and strong access routes.",
          features: ["Affordable entry pricing", "Accessible location", "Ideal starter development"],
          available: 1,
          location: "Residential Development",
          size: "150 - 300 sqm",
        },
        {
          name: "Elite Estates",
          category: "Luxury",
          image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop",
          description: "High-end stands in a premium neighbourhood for larger family homes and luxury builds.",
          features: ["Premium address", "Larger plot options", "Upmarket lifestyle positioning"],
          available: 1,
          location: "Elite Estates",
          size: "500 - 1200 sqm",
        },
        {
          name: "Shelter FlexiPlots",
          category: "Flexible",
          image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&h=600&fit=crop",
          description: "Smaller flexible-payment stands available across selected developments around Harare.",
          features: ["Low entry point", "Multiple developments", "Flexible payment plans"],
          available: 1,
          location: "Multiple Locations",
          size: "100 - 200 sqm",
        },
        {
          name: "Custom Growth Corridor",
          category: "Custom",
          image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&h=600&fit=crop",
          description: "Tailored stand sourcing for buyers who want options in specific growth corridors.",
          features: ["Tailored sourcing", "Multiple location options", "Custom budget matching"],
          available: 1,
          location: "Custom",
          size: "200 - 500 sqm",
        },
      ];

      for (const stand of stands) {
        const metadata = getStandMetadata(stand.location, "");
        insertStand.run(
          stand.name,
          stand.category,
          formatFromPrice(metadata.minimumPrice),
          stand.image,
          stand.description,
          JSON.stringify(stand.features),
          stand.available,
          stand.location,
          stand.size,
          metadata.direction,
          metadata.completionStatus,
          metadata.minimumPrice
        );
      }
    }

    const superstructureCount = db
      .prepare("SELECT COUNT(*) as count FROM superstructure_projects")
      .get() as { count: number };
    if (superstructureCount.count === 0) {
      const insertSuperstructure = db.prepare(`
        INSERT INTO superstructure_projects (
          group_code, project, size, price_usd, deposit_20, installment_24, installment_36, image, description
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      const insertSuperstructureMedia = db.prepare(`
        INSERT INTO superstructure_media (group_code, image, media_type, source_url, embed_url, provider, is_main, sort_order)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const seededSuperstructures = [
        {
          groupCode: "ss-contemporary-villa",
          project: "Contemporary Executive Villa",
          size: "4 Bed",
          priceUsd: 168000,
          installment24: 8400,
          installment36: 5600,
          image:
            "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=80",
          description: "Modern double-storey design with premium finishes.",
        },
        {
          groupCode: "ss-contemporary-villa",
          project: "Contemporary Executive Villa",
          size: "3 Bed",
          priceUsd: 142000,
          installment24: 7100,
          installment36: 4733.33,
          image:
            "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=80",
          description: "Modern double-storey design with premium finishes.",
        },
        {
          groupCode: "ss-modern-duplex",
          project: "Modern Duplex Residence",
          size: "3 Bed",
          priceUsd: 132000,
          installment24: 6600,
          installment36: 4400,
          image:
            "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
          description:
            "A refined duplex concept with strong form, modern balance, and practical living spaces.",
        },
        {
          groupCode: "ss-elegant-family-home",
          project: "Elegant Family Home",
          size: "3 Bed",
          priceUsd: 118000,
          installment24: 5900,
          installment36: 3933.33,
          image:
            "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80",
          description:
            "A welcoming family home with elegant proportions, clean lines, and timeless appeal.",
        },
        {
          groupCode: "ss-premium-cluster-homes",
          project: "Premium Cluster Homes",
          size: "2 Bed",
          priceUsd: 96000,
          installment24: 4800,
          installment36: 3200,
          image:
            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
          description:
            "Premium cluster concepts designed for privacy, order, and a strong contemporary look.",
        },
      ];

      for (const item of seededSuperstructures) {
        const financials = calculateSuperstructureFinancials(item.priceUsd);
        insertSuperstructure.run(
          item.groupCode,
          item.project,
          item.size,
          item.priceUsd,
          financials.deposit20,
          item.installment24,
          item.installment36,
          item.image,
          item.description
        );
        insertSuperstructureMedia.run(item.groupCode, item.image, "image", item.image, "", "", 1, 0);
      }
    }

    const backfillMediaFromMain = db.prepare(`
      INSERT INTO superstructure_media (group_code, image, media_type, source_url, embed_url, provider, is_main, sort_order)
      SELECT p.group_code, p.image, 'image', p.image, '', '', 1, 0
      FROM superstructure_projects p
      WHERE p.group_code IS NOT NULL
        AND TRIM(p.group_code) <> ''
        AND p.image IS NOT NULL
        AND TRIM(p.image) <> ''
        AND NOT EXISTS (
          SELECT 1 FROM superstructure_media m
          WHERE m.group_code = p.group_code
        )
    `);
    backfillMediaFromMain.run();

    syncStandMetadataAndPlots();
  }
}

// Initialize on import
initDatabase();

export default db;

// Database types
export interface Stand {
  id: number;
  name: string;
  category: string;
  price: string;
  image: string;
  description: string;
  features: string;
  available: number;
  location: string;
  size: string;
  direction: string;
  completion_status: string;
  minimum_price: number;
  is_gated_community: number;
  created_at?: string;
  updated_at?: string;
}

export interface StandPlotOption {
  id: number;
  stand_id: number;
  size: number;
  price: number;
  deposit_30: number;
  installment_24: number;
  installment_36: number;
  is_gated_community: number;
  created_at?: string;
}

export interface SuperstructureProject {
  id: number;
  group_code: string;
  project: string;
  size: string;
  price_usd: number;
  deposit_20: number;
  installment_24: number;
  installment_36: number;
  image: string;
  description: string;
  created_at?: string;
  updated_at?: string;
}

export interface Booking {
  id: number;
  name: string;
  email: string;
  phone: string;
  preferred_date: string;
  preferred_time: string;
  location: string;
  message: string | null;
  stand_id: number | null;
  stand_name: string | null;
  status: string;
  created_at: string;
}
