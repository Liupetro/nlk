/**
 * ВСЕ тексты сайта (EN + RU) — единственный источник контента.
 *
 * Как пользоваться:
 * 1. Редактируйте объекты `en` и `ru` ниже
 * 2. Сайт подхватывает язык через LanguageProvider (кнопки EN / RU)
 * 3. SEO-метаданные: export `brand` внизу файла
 *
 * Структура каждой локали: brand, nav, header, hero, trustBar, about,
 * capabilities, industries, process, whyUs, estimator, products,
 * testimonials, insights, contact, footer
 */

export type Locale = "en" | "ru";

export type SiteContent = {
  brand: {
    name: string;
    legalName: string;
    tagline: string;
    subtitle: string;
    description: string;
  };
  nav: { label: string; href: string }[];
  header: {
    quoteCta: string;
    openMenu: string;
    closeMenu: string;
    /** Display phone in header */
    phone: string;
    /** tel: href, e.g. +78007772810 */
    phoneTel: string;
  };
  hero: {
    eyebrow: string;
    headline: string;
    headlineAccent: string;
    bullets: string[];
    primaryCta: { label: string; href: string };
    floatingStats: { value: string; unit: string; label: string }[];
  };
  trustBar: {
    eyebrow: string;
    stats: {
      value: number;
      suffix: string;
      label: string;
      description: string;
      decimals?: number;
    }[];
  };
  about: {
    eyebrow: string;
    number: string;
    title: string;
    accent: string;
    /** Optional short lead under the heading */
    description: string;
    /** Opening paragraphs */
    paragraphs: string[];
    listTitle: string;
    highlights: string[];
    closing: string;
  };
  capabilities: {
    eyebrow: string;
    number: string;
    title: string;
    accent: string;
    description: string;
    bottomNote: string;
    bottomCta: string;
    items: { title: string; description: string; icon: string }[];
    technical: {
      title: string;
      paramLabel: string;
      valueLabel: string;
      rows: { parameter: string; value: string }[];
      notes: string[];
    };
    equipment: {
      title: string;
      cards: {
        id: string;
        title: string;
        points: string[];
        image: string;
        imageAlt: string;
      }[];
    };
  };
  industries: {
    eyebrow: string;
    number: string;
    title: string;
    accent: string;
    description: string;
    featuredBadge: string;
    relatedCta: string;
    footerNote: string;
    items: {
      title: string;
      description: string;
      featured: boolean;
      tags: string[];
      /** Card poster image */
      image: string;
      /** Short muted loop for desktop hover (MP4 H.264) */
      videoMp4: string;
      /** Optional WebM source */
      videoWebm?: string;
    }[];
  };
  process: {
    eyebrow: string;
    number: string;
    title: string;
    accent: string;
    description: string;
    disclaimer: string;
    steps: {
      number: string;
      title: string;
      description: string;
      duration: string;
      image: string;
      imageAlt: string;
    }[];
  };
  whyUs: {
    eyebrow: string;
    number: string;
    title: string;
    accent: string;
    description: string;
    benefits: {
      title: string;
      description: string;
      image: string;
      imageAlt: string;
      /** Optional left/right labels overlaid on a comparison photo */
      imageCaptions?: { left: string; right: string };
    }[];
  };
  estimator: {
    eyebrow: string;
    number: string;
    title: string;
    accent: string;
    subtitle: string;
    materialsLabel: string;
    materialsPlaceholder: string;
    volumeLabel: string;
    scopeLabel: string;
    companyLabel: string;
    companyPlaceholder: string;
    phoneLabel: string;
    phonePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    fileLabel: string;
    fileDrop: string;
    fileBrowse: string;
    fileFormats: string;
    fileHint: string;
    fileRemove: string;
    fileErrorType: string;
    fileErrorSize: string;
    submitCta: string;
    submittingCta: string;
    privacyNote: string;
    successMessage: string;
    errorMessage: string;
    materials: { id: string; label: string }[];
    volumes: { id: string; label: string }[];
    scopes: { id: string; label: string }[];
  };
  products: {
    eyebrow: string;
    number: string;
    title: string;
    accent: string;
    description: string;
    discussCta: string;
    examplesNumber: string;
    examplesTitle: string;
    examplesDescription: string;
    examples: {
      title: string;
      image: string;
      imageAlt: string;
    }[];
  };
  testimonials: {
    eyebrow: string;
    number: string;
    title: string;
    accent: string;
    description: string;
    quotes: {
      quote: string;
      author: string;
      role: string;
      company: string;
    }[];
    logos: string[];
  };
  insights: {
    eyebrow: string;
    number: string;
    title: string;
    accent: string;
    viewAll: string;
    readMore: string;
    items: {
      date: string;
      category: string;
      title: string;
      excerpt: string;
    }[];
  };
  contact: {
    sectionLabel: string;
    headline: string;
    subheadline: string;
    email: string;
    phone: string;
    /** tel: href for click-to-call */
    phoneTel: string;
    address: string;
    hours: string;
    labels: {
      name: string;
      company: string;
      email: string;
      phone: string;
      material: string;
      message: string;
      file: string;
    };
    placeholders: {
      name: string;
      company: string;
      email: string;
      phone: string;
      message: string;
      material: string;
    };
    /** Prefer STEP for quoting */
    fileHint: string;
    fileDrop: string;
    fileBrowse: string;
    fileFormats: string;
    fileRemove: string;
    fileErrorType: string;
    fileErrorSize: string;
    materialOptions: { value: string; label: string }[];
    submitCta: string;
    submittingCta: string;
    orEmail: string;
    successMessage: string;
    errorMessage: string;
    contactLabels: {
      email: string;
      phone: string;
      hq: string;
    };
  };
  footer: {
    blurb: string;
    columns: {
      title: string;
      links: { label: string; href: string }[];
    }[];
    languages: Locale[];
    languagesTitle: string;
    languageHint: string;
    privacyLabel: string;
    privacyHref: string;
    copyright: string;
  };
};

// ─────────────────────────────────────────────
// ENGLISH
// ─────────────────────────────────────────────

const en: SiteContent = {
  brand: {
    name: "NLK",
    legalName: "Nevskaya Liteynaya Kompaniya",
    tagline: "Precision aluminum die casting.",
    subtitle:
      "Aluminum high-pressure die casting. Full cycle — from drawing to finished part.",
    description:
      "Nevskaya Liteynaya Kompaniya organizes production of precision aluminum parts by high-pressure die casting. Full cycle: tooling design and manufacture or work with your die, casting, machining, QC, and shipment. Series from 200 pcs.",
  },
  nav: [
    { label: "About", href: "/about" },
    { label: "Products", href: "/products" },
    { label: "Advantages", href: "/advantages" },
    { label: "Process", href: "/process" },
    { label: "Capabilities", href: "/capabilities" },
    { label: "Contact", href: "/contact" },
  ],
  header: {
    quoteCta: "Get a quote",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    phone: "8 800 777 28 10",
    phoneTel: "+78007772810",
  },
  hero: {
    eyebrow: "High-pressure die casting in Russia",
    headline: "Aluminum parts",
    headlineAccent: "with guaranteed precision",
    bullets: [
      "Series from 200 pcs",
      "We work with your tooling or manufacture new tooling",
      "Full cycle — from drawing to shipment",
      "We help relocate production and reduce unit cost",
    ],
    primaryCta: { label: "Calculate from drawing", href: "/contact" },
    floatingStats: [
      { value: "10+", unit: "", label: "years of experience" },
      { value: "700k", unit: "", label: "parts per year" },
      { value: "98%", unit: "", label: "on-time deliveries" },
    ],
  },
  trustBar: {
    eyebrow: "In numbers",
    stats: [
      {
        value: 10,
        suffix: "+",
        label: "years of experience",
        description: "In aluminum high-pressure die casting",
      },
      {
        value: 700,
        suffix: "k",
        label: "parts per year",
        description: "Produced annually",
      },
      {
        value: 98,
        suffix: "%",
        label: "on time",
        description: "Orders shipped on schedule",
      },
      {
        value: 4,
        suffix: "",
        label: "machines",
        description: "Casting cells in production",
      },
      {
        value: 1,
        suffix: "",
        label: "supplier",
        description: "Full cycle — from tooling to finished part",
      },
    ],
  },
  about: {
    eyebrow: "About the company",
    number: "01",
    title: "About",
    accent: "the company",
    description: "",
    paragraphs: [
      "Nevskaya Liteynaya Kompaniya is a Russian company specializing in high-pressure aluminum die casting.",
      "We help industrial enterprises and OEM customers launch series of aluminum parts without unnecessary risk: we take on tooling, casting, quality control, and shipment preparation.",
    ],
    listTitle: "Why it is calmer to work with us:",
    highlights: [
      "Series from 200 pcs",
      "Before launch — mandatory process setup and trial part inspection",
      "Quality control at every stage",
      "Target scrap rate in series — no more than 0.5%",
      "We work with both new tooling and your existing dies",
    ],
    closing:
      "What matters to us is not simply casting a part, but delivering a stable result from batch to batch.",
  },
  capabilities: {
    eyebrow: "Capabilities",
    number: "05",
    title: "Full cycle",
    accent: "",
    description:
      "Full production cycle under one roof — short lead times, quality control at every stage, and no unnecessary intermediaries.",
    bottomNote:
      "QC (OTK): visual inspection of every part, control measurements, and porosity checks. For quoting and launch, preferably send a 3D model in STEP format (.stp).",
    bottomCta: "Get a quote",
    items: [
      {
        title: "Drawing review and manufacturability",
        description:
          "We analyze the drawing or 3D model, assess DFM, and propose process improvements before production starts. Prefer STEP (.stp) for quoting and launch.",
        icon: "engineering",
      },
      {
        title: "Your tooling or new tooling",
        description:
          "We work with your existing die — diagnostics and maintenance — or design and manufacture new tooling turnkey.",
        icon: "tooling",
      },
      {
        title: "Aluminum high-pressure die casting",
        description:
          "Casting machines of 180, 300 and 400 tons. Process setup and porosity checks on trial batches before series launch.",
        icon: "aluminum",
      },
      {
        title: "Machining of cast parts",
        description:
          "Turning and milling of parts to the customer’s technical specification when required.",
        icon: "cnc",
      },
      {
        title: "Quality control (OTK) and shipment",
        description:
          "Visual inspection of every part, control measurements, and porosity checks before shipment.",
        icon: "quality",
      },
    ],
    technical: {
      title: "Technical capabilities",
      paramLabel: "Parameter",
      valueLabel: "Value",
      rows: [
        {
          parameter: "Maximum projected area",
          value: "up to 1000 cm²",
        },
        {
          parameter: "Maximum weight of one casting",
          value: "up to 2.5 kg",
        },
        {
          parameter: "Wall thickness",
          value: "from 0.8 mm (recommended up to 6 mm)",
        },
        {
          parameter: "Maximum die size",
          value: "up to 660 × 900 mm",
        },
      ],
      notes: [
        "Parts with wall thickness over 6 mm require additional design review.",
        "Exact manufacturability is determined after reviewing the drawing or 3D model.",
        "For quoting, preferably send a 3D model in STEP format (.stp).",
      ],
    },
    equipment: {
      title: "Equipment and tooling",
      cards: [
        {
          id: "machines",
          title: "Die-casting machines",
          points: [
            "Cells with locking forces of 180, 300 and 400 tons",
            "Suitable for complex-geometry parts",
            "Automatic casting process control",
          ],
          image: "/process/choices/final-1.jpg",
          imageAlt: "Automated high-pressure die-casting cell with robot ladle",
        },
        {
          id: "dies",
          title: "Dies",
          points: [
            "We work with your tooling",
            "Diagnostics and routine maintenance",
            "New tooling lead time — 60 to 160 days",
          ],
          image: "/process/step-02.jpg",
          imageAlt: "CNC machining of a die-cast mold cavity",
        },
      ],
    },
  },
  industries: {
    eyebrow: "Industries",
    number: "02.1",
    title: "Markets we serve",
    accent: "",
    description:
      "We understand the specifics of different markets and adapt technology to real customer requirements.",
    featuredBadge: "Core specialization",
    relatedCta: "View related products",
    footerNote:
      "We work with industrial OEMs, engineering companies, and manufacturers across Russia and the CIS.",
    items: [
      {
        title: "Industrial equipment",
        description: "Structural and load-bearing parts.",
        featured: false,
        tags: ["Housings", "Levers", "Mounts"],
        image: "/industries/industrial.jpg",
        videoMp4: "/industries/industrial.mp4",
      },
      {
        title: "Automotive and specialty vehicles",
        description:
          "Housings, brackets, mounting parts, and compact unit components (within weight up to 2.5 kg).",
        featured: false,
        tags: ["Brackets", "Housings", "Fasteners", "Unit parts"],
        image: "/industries/automotive.jpg",
        videoMp4: "/industries/automotive.mp4",
      },
      {
        title: "Electronics and instrumentation",
        description: "Enclosures, heat sinks, shields.",
        featured: false,
        tags: ["Enclosures", "Heat sinks", "Shields"],
        image: "/industries/electronics.jpg",
        videoMp4: "/industries/electronics.mp4",
      },
      {
        title: "Construction and structures",
        description:
          "Aluminum connectors, brackets, and fastening elements for structures.",
        featured: false,
        tags: ["Connectors", "Brackets", "Fasteners"],
        image: "/industries/construction-alu.jpg",
        videoMp4: "/industries/construction.mp4",
      },
      {
        title: "Window and door hardware",
        description: "Aluminum hardware elements on request.",
        featured: false,
        tags: ["Aluminum", "On request"],
        image: "/industries/window-door.jpg",
        videoMp4: "/industries/window-door.mp4",
      },
    ],
  },
  process: {
    eyebrow: "Order stages",
    number: "04",
    title: "From tooling order",
    accent: "to serial production",
    description:
      "Clear stages: inquiry and DFM, tooling manufacture, sample approval from the tooling maker, process setup and trial batch, serial production, then shipment and support.",
    disclaimer: "",
    steps: [
      {
        number: "01",
        title: "Inquiry and analysis",
        description:
          "You send a drawing or 3D model (preferably STEP / .stp). We review manufacturability (DFM), alloy and process route, and propose improvements before tooling starts.",
        duration: "1–2 business days",
        image: "/process/step-01.jpg",
        imageAlt: "Technical drawing and 3D model of a die-cast part",
      },
      {
        number: "02",
        title: "Tooling design and manufacture",
        description:
          "We design and manufacture the die in China on modern CNC equipment.",
        duration: "4–10 weeks (depending on complexity)",
        image: "/process/step-02.jpg",
        imageAlt: "CNC machine machining a die casting mold",
      },
      {
        number: "03",
        title: "Sample approval (new tooling)",
        description:
          "When new tooling is made, the tooling manufacturer sends trial parts for approval. After approval, the tooling is transferred to production.",
        duration: "After tooling completion",
        image: "/process/step-03.jpg",
        imageAlt: "Trial castings for tooling sample approval",
      },
      {
        number: "04",
        title: "Trial batch and process setup",
        description:
          "After the tooling is installed, we cast trial parts and tune the process. We check geometry and porosity in critical zones. If needed, we adjust casting parameters (this can take from a few attempts up to 2–3 shifts). Serial production starts only after quality is confirmed. If customer tooling is used, we first diagnose it and perform maintenance.",
        duration: "After tooling installation / on intake of customer tooling",
        image: "/process/step-04-trial-v2.jpg",
        imageAlt: "Finished aluminum part on a technical drawing with a caliper for geometry check",
      },
      {
        number: "05",
        title: "Serial production",
        description:
          "We produce the main batch from aluminum ingots. Machining and inspection are included as required.",
        duration: "From 2 weeks after process lock-in",
        image: "/process/step-04-serial.jpg",
        imageAlt:
          "Compact ~180 t cold-chamber die casting: robot ladles aluminum into the shot sleeve, closed mounted die",
      },
      {
        number: "06",
        title: "Shipment and support",
        description:
          "We ship the batch with documentation and support repeat orders on an agreed schedule.",
        duration: "Per agreed schedule",
        image: "/process/step-06-ship-v2.jpg",
        imageAlt:
          "Hand-carry cartons of aluminum die-cast parts on a pallet with packing list, ready for shipment",
      },
    ],
  },
  whyUs: {
    eyebrow: "Advantages",
    number: "03",
    title: "Our",
    accent: "advantages",
    description: "",
    benefits: [
      {
        title: "Quote within one day",
        description:
          "We quickly assess manufacturability, indicative lead times, and cost from a drawing or 3D model.",
        image: "/advantages/adv-01-quote.jpg",
        imageAlt: "Engineering desk with drawings, 3D model and aluminum casting sample for quoting",
      },
      {
        title: "All aluminum grades",
        description:
          "We use aluminum casting alloys per GOST 1583-93 — from common grades to special grades per custom specifications.",
        image: "/advantages/adv-02-ingots.jpg",
        imageAlt: "Stack of aluminum casting ingots — cold industrial metal pack",
      },
      {
        title: "Porosity in parts — to a minimum",
        description:
          "We reduce gas porosity in aluminum castings to a minimum through melt degassing, process setup, and inspection of trial parts before series.",
        image: "/advantages/adv-03-porosity.jpg",
        imageAlt:
          "Comparison: aluminum casting section with gas porosity versus the same part with a dense structure",
        imageCaptions: { left: "porosity", right: "dense structure" },
      },
      {
        title: "Trial sample setup",
        description:
          "Before series, we fine-tune the casting process and inspect trial parts. Production starts only after quality confirmation.",
        image: "/advantages/adv-04-trial.jpg",
        imageAlt: "Trial die-cast aluminum parts after process setup and inspection",
      },
      {
        title: "Machining",
        description:
          "When needed, we perform turning and milling per the customer's technical specification.",
        image: "/advantages/adv-05-machining.jpg",
        imageAlt: "CNC machining of aluminum die-cast part — turning and milling",
      },
      {
        title: "Repair of your tooling",
        description:
          "We accept an existing die, run diagnostics and current repair, then start casting.",
        image: "/advantages/adv-06-tooling.jpg",
        imageAlt: "High-pressure die casting mold tooling diagnostics and maintenance",
      },
    ],
  },
  estimator: {
    eyebrow: "Quote request",
    number: "04.1",
    title: "Quote",
    accent: "request",
    subtitle:
      "Send your task parameters — we will prepare a quote after reviewing the drawing.",
    materialsLabel: "Material",
    materialsPlaceholder: "Select alloy grade",
    volumeLabel: "Approximate annual volume",
    scopeLabel: "What you need",
    companyLabel: "Company / Name",
    companyPlaceholder: "Your company or name",
    phoneLabel: "Phone",
    phonePlaceholder: "+7 …",
    emailLabel: "Email",
    emailPlaceholder: "name@company.com",
    fileLabel: "Drawing / 3D model",
    fileDrop: "Drag and drop a file here",
    fileBrowse: "Attach drawing / 3D model",
    fileFormats: "PDF, STP, STEP, JPG, PNG · up to 15 MB",
    fileHint:
      "For an accurate quote, please attach a drawing or 3D model (STEP).",
    fileRemove: "Remove",
    fileErrorType: "Allowed formats: PDF, STP, STEP, JPG, PNG",
    fileErrorSize: "Maximum file size is 15 MB",
    submitCta: "Get a quote",
    submittingCta: "Sending…",
    privacyNote: "No spam. We will follow up with the next step.",
    successMessage:
      "Thank you{company}. We received your request and will get back to you shortly.",
    errorMessage: "Could not send the request. Please try again or email us.",
    materials: [
      { id: "ak5m2", label: "AK5M2" },
      { id: "ak7", label: "AK7" },
      { id: "ak7pch", label: "AK7pch" },
      { id: "ak8m", label: "AK8m" },
      { id: "ak8l", label: "AK8l" },
      { id: "ak8m3ch", label: "AK8M3ch" },
      { id: "ak9", label: "AK9" },
      { id: "ak9ch", label: "AK9ch" },
      { id: "ak9m2", label: "AK9M2" },
      { id: "ak12", label: "AK12" },
      { id: "ak12m2", label: "AK12M2" },
      { id: "ak45kd", label: "AM4.5Cd" },
      { id: "other", label: "Other grade / per specs" },
    ],
    volumes: [
      { id: "v1k", label: "Up to 1,000 pcs" },
      { id: "v10k", label: "1–10k pcs" },
      { id: "v50k", label: "10–50k pcs" },
      { id: "v50kplus", label: "Over 50k pcs" },
    ],
    scopes: [
      { id: "cast", label: "Casting only" },
      { id: "machined", label: "Casting + machining" },
      { id: "assembly", label: "Assembly-ready (with coating)" },
    ],
  },
  products: {
    eyebrow: "Products",
    number: "02",
    title: "Products",
    accent: "",
    description:
      "We manufacture aluminum high-pressure die castings for series from 200 pcs. Industrial, machinery, electronics, and other precision parts.",
    discussCta: "Discuss a similar part",
    examplesNumber: "02.2",
    examplesTitle: "Product examples",
    examplesDescription: "Aluminum castings for industrial applications",
    examples: [
      {
        title: "Electronics housing",
        image: "/products/part-01-enclosure.jpg",
        imageAlt: "Aluminum die-cast electronics enclosure and cover",
      },
      {
        title: "Cover",
        image: "/products/part-02-cover.jpg",
        imageAlt: "Aluminum die-cast dome cover",
      },
      {
        title: "Flange",
        image: "/products/part-03-flange.jpg",
        imageAlt: "Aluminum die-cast flange housing",
      },
      {
        title: "Mount",
        image: "/products/part-04-mount.jpg",
        imageAlt: "Aluminum die-cast mounting flange",
      },
      {
        title: "Housing",
        image: "/products/part-05-housing.jpg",
        imageAlt: "Aluminum die-cast finned cylindrical housing",
      },
      {
        title: "Bracket",
        image: "/products/part-06-bracket.jpg",
        imageAlt: "Aluminum die-cast mounting bracket",
      },
      {
        title: "Heat sink",
        image: "/products/part-07-heatsink-cover.jpg",
        imageAlt: "Aluminum die-cast finned cover heat sink",
      },
      {
        title: "Heat sink",
        image: "/products/part-08-heatsink-pins.jpg",
        imageAlt: "Aluminum die-cast pin-fin heat sink",
      },
      {
        title: "Housing",
        image: "/products/part-09-beam.jpg",
        imageAlt: "Aluminum die-cast structural housing beam",
      },
      {
        title: "Bracket",
        image: "/products/part-10-bracket.jpg",
        imageAlt: "Aluminum die-cast angle mounting bracket",
      },
      {
        title: "Housing",
        image: "/products/part-11-housing-ring.jpg",
        imageAlt: "Aluminum die-cast ring housing",
      },
      {
        title: "Housing",
        image: "/products/part-13-housing-cover.jpg",
        imageAlt: "Aluminum die-cast housing with cover",
      },
      {
        title: "Cover",
        image: "/products/part-14-cover-bowl.jpg",
        imageAlt: "Aluminum die-cast cover and bowl housing",
      },
      {
        title: "Housing",
        image: "/products/part-15-housing-complex.jpg",
        imageAlt: "Complex aluminum die-cast multi-level electronics housing",
      },
      {
        title: "Bracket",
        image: "/products/part-16-bracket-complex.jpg",
        imageAlt: "Complex aluminum die-cast structural mounting bracket",
      },
      {
        title: "Cover",
        image: "/products/part-17-cover-complex.jpg",
        imageAlt: "Complex aluminum die-cast end cover flange housing",
      },
    ],
  },
  testimonials: {
    eyebrow: "Trusted by",
    number: "08",
    title: "Partners who scale",
    accent: "with us",
    description: "Placeholder quotes — replace with real client feedback when ready.",
    quotes: [
      {
        quote:
          "Stable geometry on hardware batches and reliable on-time delivery helped us plan production without supply risk.",
        author: "[Client name]",
        role: "Procurement lead",
        company: "[Window systems OEM]",
      },
      {
        quote:
          "One supplier for tooling, casting, and assembly simplified our process and shortened launch timelines.",
        author: "[Client name]",
        role: "Engineering manager",
        company: "[Industrial equipment]",
      },
      {
        quote:
          "From pilot batch to serial volumes — clear communication and consistent quality control.",
        author: "[Client name]",
        role: "Supply chain director",
        company: "[Manufacturing partner]",
      },
    ],
    logos: [
      "Partner A",
      "Partner B",
      "Partner C",
      "Partner D",
      "Partner E",
      "Partner F",
    ],
  },
  insights: {
    eyebrow: "Insights",
    number: "09",
    title: "Engineering notes",
    accent: "& industry views",
    viewAll: "View all articles →",
    readMore: "Read more",
    items: [
      {
        date: "2026-03-12",
        category: "Engineering",
        title: "When aluminum HPDC is the right choice for your part",
        excerpt:
          "A practical guide to alloy and process selection based on strength, detail, finish, and cost targets.",
      },
      {
        date: "2026-02-04",
        category: "Quality",
        title: "How process control protects ±0.05 mm capability",
        excerpt:
          "Tooling, thermal balance, and secondary ops that keep window hardware within spec.",
      },
      {
        date: "2026-01-18",
        category: "Production",
        title: "From pilot run to serial supply without quality loss",
        excerpt:
          "How we structure tooling, sampling, and process lock-in for stable series.",
      },
    ],
  },
  contact: {
    sectionLabel: "Contact",
    headline: "Ready to discuss your project?",
    subheadline:
      "Send a drawing or 3D model — we will calculate tooling and part cost, propose the optimal technology, and confirm lead times.",
    email: "zakaz@aldetali.ru",
    phone: "8 800 777 28 10",
    phoneTel: "+78007772810",
    address: "6th Line of Vasilyevsky Island, 57, St. Petersburg",
    hours: "Mon–Fri, 9:00–18:00",
    labels: {
      name: "Name",
      company: "Company",
      email: "Email",
      phone: "Phone",
      material: "Alloy of interest",
      message: "Comment",
      file: "Attach file",
    },
    placeholders: {
      name: "Jane Smith",
      company: "Company name",
      email: "jane@company.com",
      phone: "+7 ...",
      message: "Part description, annual volume, drawings available, target timeline...",
      material: "Select alloy grade",
    },
    fileHint:
      "For quoting, preferably send a 3D model in STEP format (.stp)",
    fileDrop: "Drop a file here",
    fileBrowse: "Attach file",
    fileFormats: "PDF, STP, STEP, JPG, PNG",
    fileRemove: "Remove",
    fileErrorType: "Allowed formats: PDF, STP, STEP, JPG, PNG",
    fileErrorSize: "Maximum file size is 15 MB",
    materialOptions: [
      { value: "ak5m2", label: "AK5M2" },
      { value: "ak7", label: "AK7" },
      { value: "ak7pch", label: "AK7pch" },
      { value: "ak8m", label: "AK8m" },
      { value: "ak8l", label: "AK8l" },
      { value: "ak8m3ch", label: "AK8M3ch" },
      { value: "ak9", label: "AK9" },
      { value: "ak9ch", label: "AK9ch" },
      { value: "ak9m2", label: "AK9M2" },
      { value: "ak12", label: "AK12" },
      { value: "ak12m2", label: "AK12M2" },
      { value: "ak45kd", label: "AM4.5Cd" },
      { value: "other", label: "Other grade / per specs" },
    ],
    submitCta: "Get a quote within 1 business day",
    submittingCta: "Sending…",
    orEmail: "Or email us directly at",
    successMessage:
      "Thank you! Your request has been sent. We will get back to you shortly.",
    errorMessage:
      "Could not send the request. Please try again or email us directly.",
    contactLabels: {
      email: "Email",
      phone: "Phone",
      hq: "Address",
    },
  },
  footer: {
    blurb:
      "Nevskaya Liteynaya Kompaniya organizes production of precision aluminum parts by high-pressure die casting. Full cycle — from drawing to finished part. Series from 200 pcs.",
    columns: [
      {
        title: "Company",
        links: [
          { label: "About", href: "/about" },
          { label: "Products", href: "/products" },
          { label: "Advantages", href: "/advantages" },
          { label: "Contact", href: "/contact" },
        ],
      },
      {
        title: "Solutions",
        links: [
          { label: "Capabilities", href: "/capabilities" },
          { label: "Process", href: "/process" },
          { label: "Get a quote", href: "/contact" },
        ],
      },
    ],
    languages: ["en", "ru"],
    languagesTitle: "Languages",
    languageHint: "Switch language to view the full site in English or Russian.",
    privacyLabel: "Personal data processing policy",
    privacyHref: "/privacy",
    copyright: "© {year} {legalName}. All rights reserved.",
  },
};

// ─────────────────────────────────────────────
// RUSSIAN
// ─────────────────────────────────────────────

const ru: SiteContent = {
  brand: {
    name: "НЛК",
    legalName: "Невская Литейная Компания",
    tagline: "Точное алюминиевое литьё.",
    subtitle:
      "Алюминиевое литьё под давлением. Полный цикл — от чертежа до готовой детали.",
    description:
      "Невская Литейная Компания организует производство точных алюминиевых деталей методом литья под давлением. Полный цикл: проектирование и изготовление оснастки или работа с вашей, литьё, механообработка, контроль качества (ОТК) и отгрузка. Серии от 200 шт.",
  },
  nav: [
    { label: "О компании", href: "/about" },
    { label: "Продукция", href: "/products" },
    { label: "Преимущества", href: "/advantages" },
    { label: "Процесс", href: "/process" },
    { label: "Возможности", href: "/capabilities" },
    { label: "Контакты", href: "/contact" },
  ],
  header: {
    quoteCta: "Получить расчёт",
    openMenu: "Открыть меню",
    closeMenu: "Закрыть меню",
    phone: "8 800 777 28 10",
    phoneTel: "+78007772810",
  },
  hero: {
    eyebrow: "Литьё под давлением в России",
    headline: "Алюминиевые детали",
    headlineAccent: "с гарантией точности",
    bullets: [
      "Серии от 200 шт.",
      "Работаем с вашей оснасткой или изготовим новую",
      "Полный цикл — от чертежа до отгрузки",
      "Помогаем перенести производство и снизить себестоимость",
    ],
    primaryCta: { label: "Рассчитать по чертежу", href: "/contact" },
    floatingStats: [
      { value: "10+", unit: "", label: "лет опыта" },
      { value: "700 тыс.", unit: "", label: "деталей в год" },
      { value: "98 %", unit: "", label: "поставок в срок" },
    ],
  },
  trustBar: {
    eyebrow: "В цифрах",
    stats: [
      {
        value: 10,
        suffix: "+",
        label: "лет опыта",
        description: "В литье алюминия под давлением",
      },
      {
        value: 700,
        suffix: " тыс.",
        label: "деталей в год",
        description: "Производим ежегодно",
      },
      {
        value: 98,
        suffix: "%",
        label: "в срок",
        description: "Заказов отгружаем точно в срок",
      },
      {
        value: 4,
        suffix: "",
        label: "машины",
        description: "Литейные комплексы в работе",
      },
      {
        value: 1,
        suffix: "",
        label: "поставщик",
        description: "Полный цикл — от оснастки до готовой детали",
      },
    ],
  },
  about: {
    eyebrow: "О компании",
    number: "01",
    title: "О",
    accent: "компании",
    description: "",
    paragraphs: [
      "Невская Литейная Компания — российская компания, специализирующаяся на литье алюминия под давлением.",
      "Мы помогаем промышленным предприятиям и OEM-заказчикам запускать серии алюминиевых деталей без лишних рисков: берём на себя оснастку, литьё, контроль качества и подготовку к отгрузке.",
    ],
    listTitle: "Почему с нами спокойнее:",
    highlights: [
      "Серии от 200 шт.",
      "Перед запуском — обязательная наладка режима и проверка пробных деталей",
      "Контроль качества на каждом этапе",
      "Ориентир по браку в сериях — не выше 0,5 %",
      "Работаем как с новой оснасткой, так и с вашими пресс-формами",
    ],
    closing:
      "Нам важно не просто отлить деталь, а дать стабильный результат от партии к партии.",
  },
  capabilities: {
    eyebrow: "Возможности",
    number: "05",
    title: "Полный цикл",
    accent: "",
    description:
      "Полный производственный цикл под одной крышей — короткие сроки, контроль качества на каждом этапе и отсутствие лишних посредников.",
    bottomNote:
      "ОТК: визуальный осмотр каждой детали, контрольные замеры и проверка на пористость. Для расчёта и запуска предпочтительно присылать 3D-модель в формате STEP (.stp).",
    bottomCta: "Получить расчёт",
    items: [
      {
        title: "Анализ чертежа и технологичность",
        description:
          "Разбираем чертёж или 3D-модель, оцениваем технологичность и предлагаем улучшения до запуска производства. Для расчёта предпочтителен STEP (.stp).",
        icon: "engineering",
      },
      {
        title: "Работа с вашей оснасткой или изготовление новой",
        description:
          "Принимаем существующую пресс-форму — диагностика и ремонт — либо проектируем и изготавливаем новую оснастку «под ключ».",
        icon: "tooling",
      },
      {
        title: "Литьё алюминия под давлением",
        description:
          "Литейные машины усилием 180, 300 и 400 тонн. Наладка режима и проверка пробных партий на пористость перед серией.",
        icon: "aluminum",
      },
      {
        title: "Механическая обработка деталей",
        description:
          "Токарная и фрезерная обработка по техническому заданию заказчика.",
        icon: "cnc",
      },
      {
        title: "Контроль качества (ОТК) и отгрузка",
        description:
          "Визуальный осмотр каждой детали, контрольные замеры и проверка на пористость до отгрузки.",
        icon: "quality",
      },
    ],
    technical: {
      title: "Технические возможности",
      paramLabel: "Параметр",
      valueLabel: "Значение",
      rows: [
        {
          parameter: "Максимальная площадь проекции",
          value: "до 1000 см²",
        },
        {
          parameter: "Максимальный вес одной отливки",
          value: "до 2,5 кг",
        },
        {
          parameter: "Толщина стенок",
          value: "от 0,8 мм (рекомендуемо до 6 мм)",
        },
        {
          parameter: "Максимальный размер пресс-формы",
          value: "до 660 × 900 мм",
        },
      ],
      notes: [
        "При проектировании деталей с толщиной стенок более 6 мм требуется дополнительная проработка конструкции.",
        "Точные возможности изготовления определяются после анализа чертежа или 3D-модели.",
        "Для расчёта предпочтительно присылать 3D-модель в формате STEP (.stp).",
      ],
    },
    equipment: {
      title: "Оборудование и оснастка",
      cards: [
        {
          id: "machines",
          title: "Литейные машины",
          points: [
            "Комплексы усилием 180, 300 и 400 тонн",
            "Подходят для деталей сложной геометрии",
            "Автоматический контроль режима литья",
          ],
          image: "/process/choices/final-1.jpg",
          imageAlt: "Автоматизированный литейный комплекс с роботом-ковшом",
        },
        {
          id: "dies",
          title: "Пресс-формы",
          points: [
            "Работаем с вашей оснасткой",
            "Диагностика и текущий ремонт",
            "Изготовление новой оснастки — от 60 до 160 дней",
          ],
          image: "/process/step-02.jpg",
          imageAlt: "Изготовление пресс-формы на ЧПУ",
        },
      ],
    },
  },
  industries: {
    eyebrow: "Отрасли",
    number: "02.1",
    title: "Отрасли, которые",
    accent: "мы обслуживаем",
    description:
      "Мы понимаем специфику разных рынков и адаптируем технологию под реальные требования заказчика.",
    featuredBadge: "Главная специализация",
    relatedCta: "Смотреть связанную продукцию",
    footerNote:
      "Работаем с промышленными OEM, инженерными компаниями и производителями в России и СНГ.",
    items: [
      {
        title: "Промышленное оборудование",
        description: "Корпусные и силовые детали.",
        featured: false,
        tags: ["корпуса", "рычаги", "крепления"],
        image: "/industries/industrial.jpg",
        videoMp4: "/industries/industrial.mp4",
      },
      {
        title: "Автомобилестроение и спецтехника",
        description:
          "Корпуса, кронштейны, элементы крепления и компактные детали узлов (в рамках веса до 2,5 кг).",
        featured: false,
        tags: ["кронштейны", "корпуса", "крепёж", "элементы узлов"],
        image: "/industries/automotive.jpg",
        videoMp4: "/industries/automotive.mp4",
      },
      {
        title: "Электроника и приборостроение",
        description: "Корпуса, радиаторы, экраны.",
        featured: false,
        tags: ["корпуса", "радиаторы", "экраны"],
        image: "/industries/electronics.jpg",
        videoMp4: "/industries/electronics.mp4",
      },
      {
        title: "Строительство и конструкции",
        description:
          "Алюминиевые соединители, кронштейны и крепёжные элементы для конструкций.",
        featured: false,
        tags: ["соединители", "кронштейны", "крепёж"],
        image: "/industries/construction-alu.jpg",
        videoMp4: "/industries/construction.mp4",
      },
      {
        title: "Оконная и дверная фурнитура",
        description: "Элементы фурнитуры из алюминия по запросу.",
        featured: false,
        tags: ["алюминий", "по запросу"],
        image: "/industries/window-door.jpg",
        videoMp4: "/industries/window-door.mp4",
      },
    ],
  },
  process: {
    eyebrow: "Этапы выполнения заказа",
    number: "04",
    title: "От заказа оснастки",
    accent: "до серийного производства",
    description:
      "Понятные этапы: заявка и DFM, изготовление оснастки, согласование пробных деталей от изготовителя, наладка режима и пробная партия, серийное производство, отгрузка и сопровождение.",
    disclaimer: "",
    steps: [
      {
        number: "01",
        title: "Заявка и анализ",
        description:
          "Вы присылаете чертёж или 3D-модель (предпочтительно STEP / .stp). Мы анализируем технологичность (DFM), сплав и маршрут, предлагаем улучшения до запуска оснастки.",
        duration: "1–2 рабочих дня",
        image: "/process/step-01.jpg",
        imageAlt: "Чертёж и 3D-модель литой детали",
      },
      {
        number: "02",
        title: "Проектирование и изготовление оснастки",
        description:
          "Проектируем и изготавливаем пресс-форму в Китае на современном ЧПУ-оборудовании.",
        duration: "4–10 недель (в зависимости от сложности)",
        image: "/process/step-02.jpg",
        imageAlt: "ЧПУ-станок, обрабатывающий пресс-форму",
      },
      {
        number: "03",
        title: "Согласование пробных деталей (новая оснастка)",
        description:
          "При изготовлении новой оснастки изготовитель присылает пробные детали на согласование. После утверждения оснастка передаётся в производство.",
        duration: "после готовности оснастки",
        image: "/process/step-03.jpg",
        imageAlt: "Пробные отливки для согласования оснастки",
      },
      {
        number: "04",
        title: "Пробная партия и доводка режима",
        description:
          "После установки оснастки отливаем пробные детали и проводим наладку режима. Проверяем геометрию и пористость в критичных зонах. При необходимости корректируем параметры литья (может занять от нескольких попыток до 2–3 смен). Серийное производство запускаем только после подтверждения качества. Если используется оснастка заказчика — сначала проводим её диагностику и текущий ремонт.",
        duration: "после установки оснастки / при приёмке вашей",
        image: "/process/step-04-trial-v2.jpg",
        imageAlt: "Готовая алюминиевая деталь на техническом чертеже, штангенциркуль для проверки геометрии",
      },
      {
        number: "05",
        title: "Серийное производство",
        description:
          "Производим основную партию из алюминиевых чушек. Выполняем механообработку и контроль по необходимости.",
        duration: "от 2 недель после фиксации режима",
        image: "/process/step-04-serial.jpg",
        imageAlt:
          "Компактная cold chamber ~180 т: робот заливает алюминий в гильзу, закрытая смонтированная пресс-форма",
      },
      {
        number: "06",
        title: "Отгрузка и сопровождение",
        description:
          "Отгружаем партию с документацией и сопровождаем повторные заказы по согласованному графику.",
        duration: "по согласованному графику",
        image: "/process/step-06-ship-v2.jpg",
        imageAlt:
          "Короба с алюминиевыми отливками (~20 кг) на паллете с отгрузочными документами",
      },
    ],
  },
  whyUs: {
    eyebrow: "Преимущества",
    number: "03",
    title: "Наши",
    accent: "преимущества",
    description: "",
    benefits: [
      {
        title: "Оперативный расчёт в течение суток",
        description:
          "Быстро оцениваем возможность изготовления, ориентировочные сроки и стоимость по чертежу или 3D-модели.",
        image: "/advantages/adv-01-quote.jpg",
        imageAlt: "Инженерный стол: чертежи, 3D-модель и образец алюминиевого литья для расчёта",
      },
      {
        title: "Работаем со всеми марками алюминия",
        description:
          "Используем алюминиевые литейные сплавы по ГОСТ 1583-93 — от распространённых до специальных марок по индивидуальному ТУ.",
        image: "/advantages/adv-02-ingots.jpg",
        imageAlt: "Штабель алюминиевых чушек — холодный индустриальный металл",
      },
      {
        title: "Пористость в деталях — к минимуму",
        description:
          "Сводим газовую пористость в алюминиевых отливках к минимуму за счёт дегазации расплава, наладки режима и проверки пробных деталей до серии.",
        image: "/advantages/adv-03-porosity.jpg",
        imageAlt:
          "Сравнение: разрез алюминиевой отливки с газовой пористостью и та же деталь с плотной структурой",
        imageCaptions: { left: "пористость", right: "плотная структура" },
      },
      {
        title: "Наладка пробных образцов",
        description:
          "Перед серией доводим режим литья и проверяем пробные детали. Производство запускаем только после подтверждения качества.",
        image: "/advantages/adv-04-trial.jpg",
        imageAlt: "Пробные алюминиевые отливки после наладки режима литья",
      },
      {
        title: "Механическая обработка",
        description:
          "При необходимости выполняем токарную и фрезерную обработку по техническому заданию заказчика.",
        image: "/advantages/adv-05-machining.jpg",
        imageAlt: "Механическая обработка алюминиевой отливки — токарная и фрезерная",
      },
      {
        title: "Ремонт вашей оснастки",
        description:
          "Принимаем существующую пресс-форму, проводим диагностику и текущий ремонт, после чего запускаем литьё.",
        image: "/advantages/adv-06-tooling.jpg",
        imageAlt: "Диагностика и ремонт пресс-формы для литья под давлением",
      },
    ],
  },
  estimator: {
    eyebrow: "Заявка",
    number: "04.1",
    title: "Заявка",
    accent: "на расчёт",
    subtitle:
      "Пришлите параметры задачи — подготовим расчёт после анализа чертежа.",
    materialsLabel: "Материал",
    materialsPlaceholder: "Выберите марку сплава",
    volumeLabel: "Ориентировочный годовой объём",
    scopeLabel: "Что нужно получить",
    companyLabel: "Компания / Имя",
    companyPlaceholder: "Ваша компания или имя",
    phoneLabel: "Телефон",
    phonePlaceholder: "+7 …",
    emailLabel: "Email",
    emailPlaceholder: "name@company.com",
    fileLabel: "Чертёж / 3D-модель",
    fileDrop: "Перетащите файл сюда",
    fileBrowse: "Прикрепить чертёж / 3D-модель",
    fileFormats: "PDF, STP, STEP, JPG, PNG · до 15 МБ",
    fileHint:
      "Для точного расчёта предпочтительно прикрепить чертёж или 3D-модель (STEP).",
    fileRemove: "Удалить",
    fileErrorType: "Допустимые форматы: PDF, STP, STEP, JPG, PNG",
    fileErrorSize: "Максимальный размер файла — 15 МБ",
    submitCta: "Получить расчёт",
    submittingCta: "Отправляем…",
    privacyNote: "Без спама. Свяжемся с следующим шагом.",
    successMessage:
      "Спасибо{company}. Заявка отправлена — мы свяжемся с вами в ближайшее время.",
    errorMessage: "Не удалось отправить заявку. Попробуйте ещё раз или напишите нам.",
    materials: [
      { id: "ak5m2", label: "АК5М2" },
      { id: "ak7", label: "АК7" },
      { id: "ak7pch", label: "АК7пч" },
      { id: "ak8m", label: "АК8м" },
      { id: "ak8l", label: "АК8л" },
      { id: "ak8m3ch", label: "АК8М3ч (ВАЛ8)" },
      { id: "ak9", label: "АК9" },
      { id: "ak9ch", label: "АК9ч" },
      { id: "ak9m2", label: "АК9М2" },
      { id: "ak12", label: "АК12" },
      { id: "ak12m2", label: "АК12М2" },
      { id: "ak45kd", label: "АМ4,5Кд (ВАЛ10)" },
      { id: "other", label: "Другая марка / по ТУ" },
    ],
    volumes: [
      { id: "v1k", label: "До 1 000 шт." },
      { id: "v10k", label: "1–10 тыс. шт." },
      { id: "v50k", label: "10–50 тыс. шт." },
      { id: "v50kplus", label: "Более 50 тыс. шт." },
    ],
    scopes: [
      { id: "cast", label: "Только отливка" },
      { id: "machined", label: "Отливка + мехобработка" },
      { id: "assembly", label: "Готово к сборке (с покрытием)" },
    ],
  },
  products: {
    eyebrow: "Продукция",
    number: "02",
    title: "Продукция",
    accent: "",
    description:
      "Производим алюминиевые отливки под давлением для серий от 200 шт. Работаем с промышленными, машиностроительными, электронными и другими деталями.",
    discussCta: "Обсудить похожую деталь",
    examplesNumber: "02.2",
    examplesTitle: "Примеры продукции",
    examplesDescription: "Алюминиевые отливки для промышленных задач",
    examples: [
      {
        title: "Корпус электроники",
        image: "/products/part-01-enclosure.jpg",
        imageAlt: "Алюминиевый корпус и крышка электроники",
      },
      {
        title: "Крышка",
        image: "/products/part-02-cover.jpg",
        imageAlt: "Алюминиевая купольная крышка",
      },
      {
        title: "Фланец",
        image: "/products/part-03-flange.jpg",
        imageAlt: "Алюминиевый корпус-фланец",
      },
      {
        title: "Крепление",
        image: "/products/part-04-mount.jpg",
        imageAlt: "Алюминиевое крепление-фланец",
      },
      {
        title: "Корпус",
        image: "/products/part-05-housing.jpg",
        imageAlt: "Алюминиевый оребрённый цилиндрический корпус",
      },
      {
        title: "Кронштейн",
        image: "/products/part-06-bracket.jpg",
        imageAlt: "Алюминиевый монтажный кронштейн",
      },
      {
        title: "Радиатор",
        image: "/products/part-07-heatsink-cover.jpg",
        imageAlt: "Алюминиевая оребрённая крышка-радиатор",
      },
      {
        title: "Радиатор",
        image: "/products/part-08-heatsink-pins.jpg",
        imageAlt: "Алюминиевый радиатор с штырьковым оребрением",
      },
      {
        title: "Корпус",
        image: "/products/part-09-beam.jpg",
        imageAlt: "Алюминиевый конструкционный корпус-балка",
      },
      {
        title: "Кронштейн",
        image: "/products/part-10-bracket.jpg",
        imageAlt: "Алюминиевый угловой монтажный кронштейн",
      },
      {
        title: "Корпус",
        image: "/products/part-11-housing-ring.jpg",
        imageAlt: "Алюминиевый кольцевой корпус",
      },
      {
        title: "Корпус",
        image: "/products/part-13-housing-cover.jpg",
        imageAlt: "Алюминиевый корпус с крышкой",
      },
      {
        title: "Крышка",
        image: "/products/part-14-cover-bowl.jpg",
        imageAlt: "Алюминиевая крышка и корпус-чаша",
      },
      {
        title: "Корпус",
        image: "/products/part-15-housing-complex.jpg",
        imageAlt: "Сложный многоуровневый алюминиевый корпус электроники",
      },
      {
        title: "Кронштейн",
        image: "/products/part-16-bracket-complex.jpg",
        imageAlt: "Сложный конструкционный алюминиевый кронштейн",
      },
      {
        title: "Крышка",
        image: "/products/part-17-cover-complex.jpg",
        imageAlt: "Сложная алюминиевая торцевая крышка-фланец",
      },
    ],
  },
  testimonials: {
    eyebrow: "Нам доверяют",
    number: "08",
    title: "Партнёры, которые",
    accent: "работают с нами",
    description: "Плейсхолдеры отзывов — замените на реальные цитаты клиентов, когда будут готовы.",
    quotes: [
      {
        quote:
          "Стабильная геометрия партий фурнитуры и поставки в срок позволили планировать производство без риска срыва.",
        author: "[Имя клиента]",
        role: "Руководитель закупок",
        company: "[Производитель оконных систем]",
      },
      {
        quote:
          "Один поставщик по оснастке, литью и сборке упростил процесс и сократил сроки запуска.",
        author: "[Имя клиента]",
        role: "Технический директор",
        company: "[Промышленное оборудование]",
      },
      {
        quote:
          "От опытной партии до серии — понятная коммуникация и стабильный контроль качества.",
        author: "[Имя клиента]",
        role: "Директор по закупкам",
        company: "[Производственный партнёр]",
      },
    ],
    logos: [
      "Партнёр A",
      "Партнёр B",
      "Партнёр C",
      "Партнёр D",
      "Партнёр E",
      "Партнёр F",
    ],
  },
  insights: {
    eyebrow: "Материалы",
    number: "09",
    title: "Инженерные заметки",
    accent: "и обзоры",
    viewAll: "Все статьи →",
    readMore: "Читать далее",
    items: [
      {
        date: "2026-03-12",
        category: "Инжиниринг",
        title: "Когда алюминиевое литьё под давлением — оптимальный выбор",
        excerpt:
          "Практический гид по выбору процесса: прочность, детализация, отделка и себестоимость.",
      },
      {
        date: "2026-02-04",
        category: "Качество",
        title: "Как контроль процесса удерживает допуск ±0,05 мм",
        excerpt:
          "Оснастка, тепловой баланс и вторичные операции для оконной фурнитуры.",
      },
      {
        date: "2026-01-18",
        category: "Производство",
        title: "От опытной партии до серии без потери качества",
        excerpt:
          "Как мы выстраиваем оснастку, отборку и фиксацию процесса для стабильной серии.",
      },
    ],
  },
  contact: {
    sectionLabel: "Контакты",
    headline: "Готовы обсудить ваш проект?",
    subheadline:
      "Пришлите чертёж или 3D-модель — мы рассчитаем стоимость оснастки и детали, предложим оптимальную технологию и сроки.",
    email: "zakaz@aldetali.ru",
    phone: "8 800 777 28 10",
    phoneTel: "+78007772810",
    address: "6-я линия Васильевского острова, 57, Санкт-Петербург",
    hours: "Пн–Пт, 9:00–18:00",
    labels: {
      name: "Имя",
      company: "Компания",
      email: "Email",
      phone: "Телефон",
      material: "Интересующий материал",
      message: "Комментарий",
      file: "Прикрепить файл",
    },
    placeholders: {
      name: "Макар Чудра",
      company: "Название компании",
      email: "ivan@company.com",
      phone: "+7 ...",
      message: "Описание детали, годовой объём, наличие чертежей, целевые сроки...",
      material: "Выберите марку",
    },
    fileHint:
      "Для расчёта предпочтительно присылать 3D-модель в формате STEP (.stp)",
    fileDrop: "Перетащите файл сюда",
    fileBrowse: "Прикрепить файл",
    fileFormats: "PDF, STP, STEP, JPG, PNG",
    fileRemove: "Удалить",
    fileErrorType: "Допустимые форматы: PDF, STP, STEP, JPG, PNG",
    fileErrorSize: "Максимальный размер файла — 15 МБ",
    materialOptions: [
      { value: "ak5m2", label: "АК5М2" },
      { value: "ak7", label: "АК7" },
      { value: "ak7pch", label: "АК7пч" },
      { value: "ak8m", label: "АК8м" },
      { value: "ak8l", label: "АК8л" },
      { value: "ak8m3ch", label: "АК8М3ч (ВАЛ8)" },
      { value: "ak9", label: "АК9" },
      { value: "ak9ch", label: "АК9ч" },
      { value: "ak9m2", label: "АК9М2" },
      { value: "ak12", label: "АК12" },
      { value: "ak12m2", label: "АК12М2" },
      { value: "ak45kd", label: "АМ4,5Кд (ВАЛ10)" },
      { value: "other", label: "Другая марка / по ТУ" },
    ],
    submitCta: "Получить расчёт за 1 рабочий день",
    submittingCta: "Отправка…",
    orEmail: "Или напишите напрямую на",
    successMessage:
      "Спасибо! Заявка отправлена. Мы свяжемся с вами в ближайшее время.",
    errorMessage:
      "Не удалось отправить заявку. Попробуйте ещё раз или напишите нам напрямую.",
    contactLabels: {
      email: "E-mail",
      phone: "Телефон",
      hq: "Адрес",
    },
  },
  footer: {
    blurb:
      "Невская Литейная Компания организует производство точных алюминиевых деталей методом литья под давлением. Полный цикл — от чертежа до готовой детали. Серии от 200 шт.",
    columns: [
      {
        title: "Компания",
        links: [
          { label: "О компании", href: "/about" },
          { label: "Продукция", href: "/products" },
          { label: "Преимущества", href: "/advantages" },
          { label: "Контакты", href: "/contact" },
        ],
      },
      {
        title: "Решения",
        links: [
          { label: "Возможности", href: "/capabilities" },
          { label: "Процесс", href: "/process" },
          { label: "Получить расчёт", href: "/contact" },
        ],
      },
    ],
    languages: ["en", "ru"],
    languagesTitle: "Язык",
    languageHint: "Переключите язык, чтобы открыть весь сайт на английском или русском.",
    privacyLabel: "Политика обработки персональных данных",
    privacyHref: "/privacy",
    copyright: "© {year} {legalName}. Все права защищены.",
  },
};

// ─────────────────────────────────────────────
// i18n helpers
// ─────────────────────────────────────────────

export const dictionaries: Record<Locale, SiteContent> = { en, ru };

/** Default language for Russian manufacturing brand. */
export const defaultLocale: Locale = "ru";

export const locales: Locale[] = ["en", "ru"];

export const localeLabels: Record<Locale, string> = {
  en: "EN",
  ru: "RU",
};

export function isLocale(value: string | null | undefined): value is Locale {
  return value === "en" || value === "ru";
}

export function getDictionary(locale: Locale): SiteContent {
  return dictionaries[locale] ?? dictionaries.ru;
}

/** Default brand for SEO metadata (bilingual description). */
export const brand = {
  name: ru.brand.name,
  legalName: ru.brand.legalName,
  tagline: ru.brand.tagline,
  subtitle: ru.brand.subtitle,
  description: `${ru.brand.description} / ${en.brand.description}`,
};

export { en, ru };
