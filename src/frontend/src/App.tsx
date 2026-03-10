import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Flower2,
  Leaf,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { PlantCategory } from "./backend.d";
import { useGetPlants, useInitializePlants } from "./hooks/useQueries";

const queryClient = new QueryClient();

const FALLBACK_PLANTS = [
  { name: "Coleus Wizard Mix", category: PlantCategory.foliage },
  { name: "Rudbeckia", category: PlantCategory.flowering },
  { name: "Chrysanthemum Mix", category: PlantCategory.flowering },
  { name: "Gaillardia", category: PlantCategory.flowering },
  { name: "Dahlia", category: PlantCategory.flowering },
  { name: "Zinnia Double Mix", category: PlantCategory.flowering },
  { name: "Zinnia Lilliput Mix", category: PlantCategory.flowering },
  { name: "Sunflower Sungold", category: PlantCategory.flowering },
  { name: "Marigold", category: PlantCategory.flowering },
  { name: "Celosia Icecream Mix", category: PlantCategory.flowering },
  { name: "Gazania Mix", category: PlantCategory.flowering },
  { name: "Vinca Titan Mix", category: PlantCategory.flowering },
  { name: "Salvia Vista Mix", category: PlantCategory.flowering },
  { name: "Petunia Daddy Mix", category: PlantCategory.flowering },
  { name: "Verbena Quartz Mix", category: PlantCategory.flowering },
];

const PLANT_IMAGES: Record<string, string> = {
  "Coleus Wizard Mix": "/assets/generated/plant-coleus.dim_400x400.jpg",
  Rudbeckia: "/assets/generated/plant-rudbeckia.dim_400x400.jpg",
  "Chrysanthemum Mix": "/assets/generated/plant-chrysanthemum.dim_400x400.jpg",
  Gaillardia: "/assets/generated/plant-gaillardia.dim_400x400.jpg",
  Dahlia: "/assets/generated/plant-dahlia.dim_400x400.jpg",
  "Zinnia Double Mix": "/assets/generated/plant-zinnia-double.dim_400x400.jpg",
  "Zinnia Lilliput Mix":
    "/assets/generated/plant-zinnia-lilliput.dim_400x400.jpg",
  "Sunflower Sungold": "/assets/generated/plant-sunflower.dim_400x400.jpg",
  Marigold: "/assets/generated/plant-marigold.dim_400x400.jpg",
  "Celosia Icecream Mix": "/assets/generated/plant-celosia.dim_400x400.jpg",
  "Gazania Mix": "/assets/generated/plant-gazania.dim_400x400.jpg",
  "Vinca Titan Mix": "/assets/generated/plant-vinca.dim_400x400.jpg",
  "Salvia Vista Mix": "/assets/generated/plant-salvia.dim_400x400.jpg",
  "Petunia Daddy Mix": "/assets/generated/plant-petunia.dim_400x400.jpg",
  "Verbena Quartz Mix": "/assets/generated/plant-verbena.dim_400x400.jpg",
};

const PLACEMENT_TABS = [
  {
    label: "Garden",
    icon: "🌳",
    frameClass: "frame-garden",
    decoration: (
      <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-green-700/40 to-transparent rounded-b-xl" />
    ),
    badge: "bg-green-100 text-green-800",
  },
  {
    label: "Balcony",
    icon: "🏠",
    frameClass: "frame-balcony",
    decoration: (
      <div className="absolute bottom-0 left-0 right-0 h-8">
        <div className="w-full h-2 bg-orange-300/70 rounded" />
        <div className="flex gap-4 px-4 mt-1">
          {["a", "b", "c", "d", "e"].map((k) => (
            <div key={k} className="w-1 h-6 bg-orange-300/60 rounded-full" />
          ))}
        </div>
      </div>
    ),
    badge: "bg-orange-100 text-orange-800",
  },
  {
    label: "Pot",
    icon: "🪴",
    frameClass: "frame-pot",
    decoration: (
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
        <div className="w-20 h-4 bg-amber-700/60 rounded-t-full" />
        <div className="w-16 h-6 bg-amber-800/50 rounded-b-lg mx-auto" />
      </div>
    ),
    badge: "bg-amber-100 text-amber-800",
  },
  {
    label: "Hanging",
    icon: "🌿",
    frameClass: "frame-hanging",
    decoration: (
      <div className="absolute top-0 left-1/2 -translate-x-1/2 flex flex-col items-center">
        <div className="w-0.5 h-6 bg-purple-500/60" />
        <div className="w-4 h-1 bg-purple-400/50 rounded" />
      </div>
    ),
    badge: "bg-purple-100 text-purple-800",
  },
];

const CATEGORY_COLORS: Record<
  PlantCategory,
  { bg: string; text: string; label: string }
> = {
  [PlantCategory.flowering]: {
    bg: "bg-pink-100",
    text: "text-pink-700",
    label: "Flowering",
  },
  [PlantCategory.foliage]: {
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    label: "Foliage",
  },
  [PlantCategory.fruiting]: {
    bg: "bg-orange-100",
    text: "text-orange-700",
    label: "Fruiting",
  },
  [PlantCategory.succulent]: {
    bg: "bg-teal-100",
    text: "text-teal-700",
    label: "Succulent",
  },
};

const MRP = 349;
const PRICE = 159;
const DISCOUNT = Math.round(((MRP - PRICE) / MRP) * 100);

function PlantDetailDialog({
  plant,
  open,
  onClose,
}: {
  plant: { name: string; category: PlantCategory } | null;
  open: boolean;
  onClose: () => void;
}) {
  const [activeTab, setActiveTab] = useState(0);
  const cat = plant
    ? (CATEGORY_COLORS[plant.category] ??
      CATEGORY_COLORS[PlantCategory.flowering])
    : null;

  const plantImg = plant
    ? (PLANT_IMAGES[plant.name] ??
      "/assets/generated/plant-marigold.dim_400x400.jpg")
    : "";

  const whatsappUrl = plant
    ? `https://wa.me/918955381614?text=${encodeURIComponent(`नमस्ते! मुझे ${plant.name} का order करना है।`)}`
    : "#";

  const activeFrame = PLACEMENT_TABS[activeTab];

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        data-ocid="plant.detail.dialog"
        className="max-w-lg p-0 overflow-hidden rounded-2xl"
      >
        {plant && cat && (
          <>
            <DialogHeader className="px-5 pt-5 pb-3">
              <div className="flex items-center gap-3">
                <img
                  src={plantImg}
                  alt={plant.name}
                  className="w-14 h-14 rounded-xl object-cover border border-border"
                />
                <div>
                  <DialogTitle className="font-display text-lg font-bold text-foreground">
                    {plant.name}
                  </DialogTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-garden-green font-bold text-base">
                      ₹{PRICE}
                    </span>
                    <span className="text-muted-foreground line-through text-sm">
                      ₹{MRP}
                    </span>
                    <Badge className="bg-red-100 text-red-700 border-0 text-xs font-semibold px-2">
                      {DISCOUNT}% OFF
                    </Badge>
                  </div>
                </div>
              </div>
            </DialogHeader>

            {/* Placement tabs — English only */}
            <div className="flex border-b border-border px-2">
              {PLACEMENT_TABS.map((tab, i) => (
                <button
                  key={tab.label}
                  type="button"
                  data-ocid={`plant.detail.tab.${i + 1}`}
                  onClick={() => setActiveTab(i)}
                  className={`flex-1 py-2.5 text-xs font-medium transition-colors flex flex-col items-center gap-0.5 ${
                    activeTab === i
                      ? "border-b-2 border-garden-green text-garden-green"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span className="text-base">{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Plant image in styled context frame */}
            <div className="relative w-full aspect-video overflow-hidden p-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.25 }}
                  className={`relative w-full h-full rounded-xl overflow-hidden flex items-center justify-center ${activeFrame.frameClass}`}
                >
                  <img
                    src={plantImg}
                    alt={`${plant.name} in ${activeFrame.label}`}
                    className="w-full h-full object-cover"
                    style={
                      activeTab === 3
                        ? { transform: "rotate(-3deg) scale(1.05)" }
                        : {}
                    }
                  />
                  {activeFrame.decoration}
                  <div className="absolute top-2 right-2">
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${activeFrame.badge}`}
                    >
                      {activeFrame.icon} {activeFrame.label}
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* WhatsApp Order button */}
            <div className="px-5 py-4">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-ocid="plant.whatsapp.button"
                className="flex items-center justify-center gap-2 w-full bg-whatsapp hover:opacity-90 text-white font-semibold py-3 rounded-xl transition-opacity text-sm shadow"
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp पर Order करें
              </a>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function PlantCard({
  plant,
  index,
  onClick,
}: {
  plant: { name: string; category: PlantCategory };
  index: number;
  onClick: () => void;
}) {
  const cat =
    CATEGORY_COLORS[plant.category] ?? CATEGORY_COLORS[PlantCategory.flowering];
  const img = PLANT_IMAGES[plant.name];

  return (
    <motion.div
      data-ocid={`plants.item.${index + 1}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: (index % 6) * 0.06 }}
      whileHover={{ y: -4, scale: 1.02 }}
      onClick={onClick}
      className="bg-card rounded-2xl shadow-botanical overflow-hidden flex flex-col cursor-pointer border border-border hover:shadow-botanical-lg hover:border-garden-green/40 transition-all"
    >
      {/* Plant photo */}
      <div className="relative w-full aspect-square overflow-hidden">
        {img ? (
          <img
            src={img}
            alt={plant.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-garden-yellow/20 flex items-center justify-center text-4xl">
            🌿
          </div>
        )}
        <div className="absolute top-2 right-2">
          <Badge className="bg-red-500 text-white border-0 text-xs font-bold px-2 py-0.5 shadow">
            {DISCOUNT}% OFF
          </Badge>
        </div>
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col gap-2">
        <h3 className="font-display font-semibold text-foreground text-xs leading-snug line-clamp-2">
          {plant.name}
        </h3>
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-garden-green text-sm">₹{PRICE}</span>
          <span className="text-muted-foreground line-through text-xs">
            ₹{MRP}
          </span>
        </div>
        <Badge
          className={`${cat.bg} ${cat.text} border-0 text-xs font-medium px-2 py-0.5 self-start`}
        >
          {plant.category === PlantCategory.foliage ? (
            <Leaf className="w-3 h-3 mr-1" />
          ) : (
            <Flower2 className="w-3 h-3 mr-1" />
          )}
          {cat.label}
        </Badge>
      </div>
    </motion.div>
  );
}

function AppInner() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState<{
    name: string;
    category: PlantCategory;
  } | null>(null);
  const { data: plants, isLoading, isError } = useGetPlants();
  const initMutation = useInitializePlants();
  const initialized = useRef(false);
  const mutate = initMutation.mutate;

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      mutate();
    }
  }, [mutate]);

  const displayPlants = plants && plants.length > 0 ? plants : FALLBACK_PLANTS;

  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  }, []);

  const whatsappContactUrl = `https://wa.me/918955381614?text=${encodeURIComponent("नमस्ते! मुझे पौधे का order करना है।")}`;

  return (
    <div className="min-h-screen bg-background font-body">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border shadow-xs">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/assets/generated/gulmohar-logo-transparent.dim_300x300.png"
              alt="Gulmohar Vatika Logo"
              className="w-10 h-10 object-contain"
            />
            <span className="font-display font-bold text-xl text-garden-green tracking-tight">
              Gulmohar Vatika
            </span>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            <button
              type="button"
              data-ocid="nav.home.link"
              onClick={() => scrollTo("hero")}
              className="text-sm font-medium text-foreground hover:text-garden-green transition-colors"
            >
              Home
            </button>
            <button
              type="button"
              data-ocid="nav.plants.link"
              onClick={() => scrollTo("plants")}
              className="text-sm font-medium text-foreground hover:text-garden-green transition-colors"
            >
              Plants
            </button>
            <button
              type="button"
              data-ocid="nav.contact.link"
              onClick={() => scrollTo("contact")}
              className="text-sm font-medium bg-garden-green text-primary-foreground px-4 py-1.5 rounded-full hover:opacity-90 transition-opacity"
            >
              Contact
            </button>
            <a
              href={whatsappContactUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-ocid="nav.whatsapp.button"
              className="flex items-center gap-1.5 text-sm font-semibold bg-whatsapp text-white px-4 py-1.5 rounded-full hover:opacity-90 transition-opacity"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </a>
          </nav>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Mobile nav */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden bg-card border-t border-border"
            >
              <nav className="flex flex-col px-4 py-3 gap-2">
                <button
                  type="button"
                  data-ocid="nav.home.link"
                  onClick={() => scrollTo("hero")}
                  className="text-left py-2 text-sm font-medium hover:text-garden-green"
                >
                  Home
                </button>
                <button
                  type="button"
                  data-ocid="nav.plants.link"
                  onClick={() => scrollTo("plants")}
                  className="text-left py-2 text-sm font-medium hover:text-garden-green"
                >
                  Plants
                </button>
                <button
                  type="button"
                  data-ocid="nav.contact.link"
                  onClick={() => scrollTo("contact")}
                  className="text-left py-2 text-sm font-medium hover:text-garden-green"
                >
                  Contact
                </button>
                <a
                  href={whatsappContactUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-ocid="nav.whatsapp.button"
                  className="flex items-center gap-2 py-2 text-sm font-semibold text-whatsapp"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp Order
                </a>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main>
        {/* Hero Section */}
        <section id="hero" className="relative overflow-hidden">
          <div
            className="relative w-full h-[420px] md:h-[520px] bg-cover bg-center"
            style={{
              backgroundImage:
                "url('/assets/generated/nursery-hero-gulmohar.dim_1200x500.jpg')",
            }}
          >
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/65" />
            <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="flex flex-col items-center gap-4"
              >
                <span className="text-4xl md:text-5xl" aria-hidden="true">
                  🌸
                </span>
                <h1 className="font-display text-4xl md:text-6xl font-bold text-white drop-shadow-lg tracking-tight">
                  Gulmohar Vatika
                </h1>
                <p className="font-display text-xl md:text-2xl text-white/90 font-medium italic drop-shadow">
                  प्रकृति की खूबसूरती, आपके द्वार
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => scrollTo("plants")}
                    className="bg-garden-orange text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:opacity-90 transition-opacity text-sm"
                  >
                    Explore Plants 🌿
                  </motion.button>
                  <motion.a
                    href={whatsappContactUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-ocid="hero.whatsapp.button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2 bg-whatsapp text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:opacity-90 transition-opacity text-sm"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Order on WhatsApp
                  </motion.a>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Decorative wave — gulmohar light pink */}
          <div className="absolute bottom-0 left-0 right-0" aria-hidden="true">
            <svg
              viewBox="0 0 1440 60"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full"
              aria-label="decorative wave"
            >
              <title>decorative wave</title>
              <path
                d="M0 60V30C360 0 720 60 1080 30C1260 15 1350 7.5 1440 0V60H0Z"
                fill="oklch(0.97 0.015 10)"
              />
            </svg>
          </div>
        </section>

        {/* Plants Section */}
        <section
          id="plants"
          data-ocid="plants.section"
          className="py-16 px-4 max-w-6xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 bg-garden-green/10 text-garden-green px-4 py-1.5 rounded-full text-sm font-medium mb-4">
              <Leaf className="w-4 h-4" />
              Our Collection
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
              Beautiful Plants for Your Garden
            </h2>
            <p className="text-muted-foreground text-base max-w-xl mx-auto">
              Carefully grown seasonal flowers and foliage plants, perfect for
              gardens, balconies &amp; pots.
            </p>
          </motion.div>

          {/* Loading */}
          {isLoading && (
            <div
              data-ocid="plants.loading_state"
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
            >
              {[
                "s1",
                "s2",
                "s3",
                "s4",
                "s5",
                "s6",
                "s7",
                "s8",
                "s9",
                "s10",
              ].map((sk) => (
                <div key={sk} className="bg-card rounded-2xl overflow-hidden">
                  <Skeleton className="w-full aspect-square" />
                  <div className="p-3 flex flex-col gap-2">
                    <Skeleton className="w-full h-4 rounded" />
                    <Skeleton className="w-16 h-4 rounded" />
                    <Skeleton className="w-16 h-5 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error */}
          {isError && (
            <div
              data-ocid="plants.error_state"
              className="text-center py-8 text-muted-foreground"
            >
              <p>
                Could not load plants from server. Showing our collection below.
              </p>
            </div>
          )}

          {/* Plants grid */}
          {!isLoading && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {displayPlants.map((plant, i) => (
                <PlantCard
                  key={plant.name}
                  plant={plant}
                  index={i}
                  onClick={() => setSelectedPlant(plant)}
                />
              ))}
            </div>
          )}
        </section>

        {/* Contact Section */}
        <section
          id="contact"
          data-ocid="contact.section"
          className="py-16 px-4 bg-gradient-to-br from-garden-green/8 to-garden-orange/8"
        >
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-8"
            >
              <div className="inline-flex items-center gap-2 bg-garden-orange/15 text-garden-earth px-4 py-1.5 rounded-full text-sm font-medium mb-4">
                <MapPin className="w-4 h-4" />
                Find Us
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                Visit Our Nursery
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-card rounded-3xl shadow-botanical-lg p-8 border border-border"
            >
              <div className="flex flex-col gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-garden-orange/15 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-garden-orange" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-base">
                      Address
                    </p>
                    <p className="text-muted-foreground mt-1 leading-relaxed">
                      Chansda Bus Stand,
                      <br />
                      Udaipur — 313015,
                      <br />
                      Rajasthan, India
                    </p>
                  </div>
                </div>

                <div className="h-px bg-border" />

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-garden-green/15 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-garden-green" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-base">
                      Phone
                    </p>
                    <a
                      href="tel:8955381614"
                      className="text-garden-green font-semibold text-lg hover:underline mt-1 block"
                    >
                      +91 89553 81614
                    </a>
                  </div>
                </div>

                <div className="h-px bg-border" />

                {/* WhatsApp row */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-base">
                      WhatsApp
                    </p>
                    <a
                      href={whatsappContactUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 font-semibold text-lg hover:underline mt-1 block"
                    >
                      +91 89553 81614
                    </a>
                  </div>
                </div>

                <div className="h-px bg-border" />

                <div className="flex items-center gap-3 bg-garden-yellow/20 rounded-2xl p-4">
                  <span className="text-2xl" aria-hidden="true">
                    🕐
                  </span>
                  <div>
                    <p className="font-semibold text-foreground text-sm">
                      Open Hours
                    </p>
                    <p className="text-muted-foreground text-sm mt-0.5">
                      Daily: 8:00 AM – 8:00 PM
                    </p>
                  </div>
                </div>

                {/* WhatsApp CTA button */}
                <a
                  href={whatsappContactUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-ocid="contact.whatsapp.button"
                  className="flex items-center justify-center gap-2 w-full bg-whatsapp hover:opacity-90 text-white font-semibold py-3.5 rounded-xl transition-opacity text-base shadow"
                >
                  <MessageCircle className="w-5 h-5" />
                  WhatsApp पर संपर्क करें
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-garden-earth text-white py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xl" aria-hidden="true">
              🌸
            </span>
            <span className="font-display font-bold text-lg">
              Gulmohar Vatika
            </span>
          </div>
          <p className="text-white/70 text-sm text-center">
            © {new Date().getFullYear()} Gulmohar Vatika | Udaipur, Rajasthan
          </p>
          <p className="text-white/50 text-xs">
            Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-white/80 transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>

      {/* Plant Detail Dialog */}
      <PlantDetailDialog
        plant={selectedPlant}
        open={selectedPlant !== null}
        onClose={() => setSelectedPlant(null)}
      />

      {/* Floating WhatsApp button */}
      <a
        href={whatsappContactUrl}
        target="_blank"
        rel="noopener noreferrer"
        data-ocid="whatsapp.floating.button"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-whatsapp text-white font-semibold px-4 py-3 rounded-full shadow-xl hover:opacity-90 transition-all hover:scale-105"
        aria-label="WhatsApp पर संपर्क करें"
      >
        <MessageCircle className="w-5 h-5" />
        <span className="text-sm">WhatsApp</span>
      </a>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppInner />
    </QueryClientProvider>
  );
}
