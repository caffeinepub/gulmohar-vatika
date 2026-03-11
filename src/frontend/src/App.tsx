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
  Droplets,
  Flower2,
  Leaf,
  MapPin,
  Menu,
  Minus,
  Plus,
  ShoppingCart,
  Sun,
  Wind,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { PlantCategory } from "./backend.d";
import { useGetPlants, useInitializePlants } from "./hooks/useQueries";

const queryClient = new QueryClient();

// WhatsApp SVG logo
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-label="WhatsApp"
      role="img"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

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

type PlantInfo = {
  description: string;
  water: string;
  sunlight: string;
  placement: string;
  envEffect: string;
};

const PLANT_INFO: Record<string, PlantInfo> = {
  "Coleus Wizard Mix": {
    description:
      "Coleus Wizard Mix is a stunning foliage plant with vibrant, multi-colored leaves in shades of red, green, yellow and purple. Perfect for adding color without flowers.",
    water: "Moderate – water when top 1 inch of soil is dry",
    sunlight: "Partial shade to bright indirect light",
    placement: "Balcony, window sill, or shaded garden corner",
    envEffect: "Improves air quality, reduces indoor stress",
  },
  Rudbeckia: {
    description:
      "Rudbeckia, also called Black-Eyed Susan, produces cheerful yellow daisy-like flowers with dark centers. Extremely drought-tolerant and long-blooming.",
    water: "Low to moderate – drought tolerant once established",
    sunlight: "Full sun (6+ hours daily)",
    placement: "Open garden beds, borders, sunny balcony",
    envEffect: "Attracts butterflies and bees, boosts pollination",
  },
  "Chrysanthemum Mix": {
    description:
      "Chrysanthemum Mix offers a riot of colors — white, yellow, pink and red. A classic festive flower beloved across India for its beauty and longevity.",
    water: "Regular – keep soil moist but not waterlogged",
    sunlight: "Full sun to partial shade",
    placement: "Front garden, pots, festive décor",
    envEffect: "Known to filter benzene and formaldehyde from air",
  },
  Gaillardia: {
    description:
      "Gaillardia (Blanket Flower) blooms in fiery red, orange and yellow. Heat-loving and incredibly hardy, it blooms almost all year in warm climates.",
    water: "Low – very drought tolerant",
    sunlight: "Full sun (6–8 hours daily)",
    placement: "Sunny garden, rock garden, pots on terrace",
    envEffect: "Increases oxygen, attracts pollinators",
  },
  Dahlia: {
    description:
      "Dahlias are showstopper flowers with large, full blooms in countless colors. They bring elegance to any garden and make stunning cut flowers.",
    water: "Regular – water deeply 2–3 times a week",
    sunlight: "Full sun (6–8 hours daily)",
    placement: "Garden beds, large pots, decorative displays",
    envEffect: "Improves mood, enhances oxygen levels",
  },
  "Zinnia Double Mix": {
    description:
      "Zinnia Double Mix features large, fully-double blooms in vivid mixed colors. Heat-tolerant and fast-growing, perfect for Indian summers.",
    water: "Moderate – water at base, avoid wetting leaves",
    sunlight: "Full sun",
    placement: "Garden borders, pots, cut flower garden",
    envEffect: "Attracts butterflies, increases oxygen",
  },
  "Zinnia Lilliput Mix": {
    description:
      "Zinnia Lilliput Mix produces compact, pompom-style flowers in cheerful mixed shades. Ideal for small spaces and container gardening.",
    water: "Moderate – allow top soil to dry between watering",
    sunlight: "Full sun",
    placement: "Small pots, window boxes, balcony gardens",
    envEffect: "Brightens space, attracts bees and butterflies",
  },
  "Sunflower Sungold": {
    description:
      "Sunflower Sungold is a bushy, multi-stemmed variety with golden double blooms. Unlike tall sunflowers, it stays compact and pot-friendly.",
    water: "Moderate – water regularly but avoid soggy soil",
    sunlight: "Full sun (6+ hours)",
    placement: "Sunny balcony, terrace, garden",
    envEffect: "Excellent oxygen producer, lifts spirits",
  },
  Marigold: {
    description:
      "Marigold is India's most beloved garden flower. Bright orange and yellow blooms ward off pests naturally and fill the garden with fragrance.",
    water: "Low to moderate – drought tolerant",
    sunlight: "Full sun",
    placement: "Garden borders, pots, near vegetables to repel pests",
    envEffect: "Natural pest repellent, produces oxygen, used in rituals",
  },
  "Celosia Icecream Mix": {
    description:
      "Celosia Icecream Mix has unique feathery plume-like blooms resembling ice cream in pink, red, orange and yellow. Eye-catching and heat-loving.",
    water: "Moderate – water regularly in hot weather",
    sunlight: "Full sun to partial shade",
    placement: "Garden beds, pots, decorative containers",
    envEffect: "Adds oxygen, vibrant color therapy",
  },
  "Gazania Mix": {
    description:
      "Gazania Mix produces large, daisy-like flowers in striking orange, yellow and pink. They open in sunlight and close at night — nature's clock.",
    water: "Low – very drought tolerant",
    sunlight: "Full sun (must have direct sunlight to open)",
    placement: "Sunny pots, rock gardens, terrace",
    envEffect: "Increases oxygen, thrives in hot dry conditions",
  },
  "Vinca Titan Mix": {
    description:
      "Vinca Titan Mix is a fast-growing, disease-resistant annual with glossy leaves and bright five-petaled flowers. Blooms non-stop through summer.",
    water: "Low to moderate – quite drought tolerant",
    sunlight: "Full sun to partial shade",
    placement: "Pots, borders, hanging baskets",
    envEffect: "Heat-resistant oxygen producer, long blooming season",
  },
  "Salvia Vista Mix": {
    description:
      "Salvia Vista Mix produces tall spikes of brilliant red, blue, purple and white flowers. Loved by hummingbirds and butterflies.",
    water: "Moderate – regular watering, well-drained soil",
    sunlight: "Full sun to partial shade",
    placement: "Back of garden borders, pots, balcony",
    envEffect: "Attracts pollinators, natural air freshener",
  },
  "Petunia Daddy Mix": {
    description:
      "Petunia Daddy Mix offers large, ruffled blooms with striking veined patterns in pink, purple and white. Excellent for hanging baskets and containers.",
    water: "Regular – moist soil, water at base",
    sunlight: "Full sun (5–6 hours daily)",
    placement: "Hanging pots, window boxes, balcony",
    envEffect: "Improves air freshness, cascading beauty",
  },
  "Verbena Quartz Mix": {
    description:
      "Verbena Quartz Mix produces dense clusters of tiny flowers in mixed colors. Compact, bushy and perfect for ground cover or containers.",
    water: "Moderate – allow soil to dry slightly between watering",
    sunlight: "Full sun",
    placement: "Ground cover, pots, hanging baskets",
    envEffect: "Attracts butterflies, natural ground cooler",
  },
};

const DEFAULT_PLANT_INFO: PlantInfo = {
  description: "A beautiful seasonal plant perfect for home gardens and pots.",
  water: "Moderate – water regularly",
  sunlight: "Full sun to partial shade",
  placement: "Garden, balcony, or pots",
  envEffect: "Increases oxygen, improves ambiance",
};

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
const FLOWERING_PRICE = 159;
const FOLIAGE_PRICE = 199;
const DISCOUNT_FLOWERING = Math.round(((MRP - FLOWERING_PRICE) / MRP) * 100);
const DISCOUNT_FOLIAGE = Math.round(((MRP - FOLIAGE_PRICE) / MRP) * 100);

function getPlantPrice(category: PlantCategory): number {
  return category === PlantCategory.foliage ? FOLIAGE_PRICE : FLOWERING_PRICE;
}
function getDiscount(category: PlantCategory): number {
  return category === PlantCategory.foliage
    ? DISCOUNT_FOLIAGE
    : DISCOUNT_FLOWERING;
}

type PotType = "No Pot" | "4 Inch Pot" | "Hanging Pot";
const POT_OPTIONS: {
  type: PotType;
  price: number;
  icon: string;
  image?: string;
}[] = [
  { type: "No Pot", price: 0, icon: "🚫" },
  {
    type: "4 Inch Pot",
    price: 45,
    icon: "🪴",
    image: "/assets/generated/pot-4inch-transparent.dim_200x200.png",
  },
  {
    type: "Hanging Pot",
    price: 75,
    icon: "🌿",
    image: "/assets/generated/pot-hanging-transparent.dim_200x200.png",
  },
];

export type CartItem = {
  plantName: string;
  category: PlantCategory;
  plantPrice: number;
  potType: PotType;
  potPrice: number;
  quantity: number;
};

function PlantDetailDialog({
  plant,
  open,
  onClose,
  onAddToCart,
}: {
  plant: { name: string; category: PlantCategory } | null;
  open: boolean;
  onClose: () => void;
  onAddToCart: (item: CartItem) => void;
}) {
  const [selectedPot, setSelectedPot] = useState<PotType | null>(null);
  const [qty, setQty] = useState(1);

  // Reset selections whenever a new plant is opened
  useEffect(() => {
    if (open) {
      setSelectedPot(null);
      setQty(1);
    }
  }, [open]);

  const cat = plant
    ? (CATEGORY_COLORS[plant.category] ??
      CATEGORY_COLORS[PlantCategory.flowering])
    : null;

  const plantImg = plant
    ? (PLANT_IMAGES[plant.name] ??
      "/assets/generated/plant-marigold.dim_400x400.jpg")
    : "";

  const plantPrice = plant ? getPlantPrice(plant.category) : FLOWERING_PRICE;
  const discount = plant ? getDiscount(plant.category) : DISCOUNT_FLOWERING;
  const potPrice =
    selectedPot !== null
      ? (POT_OPTIONS.find((p) => p.type === selectedPot)?.price ?? 0)
      : 0;
  const itemTotal = (plantPrice + potPrice) * qty;

  const info = plant
    ? (PLANT_INFO[plant.name] ?? DEFAULT_PLANT_INFO)
    : DEFAULT_PLANT_INFO;

  function handleAddToCart() {
    if (!plant) return;
    onAddToCart({
      plantName: plant.name,
      category: plant.category,
      plantPrice,
      potType: selectedPot ?? "No Pot",
      potPrice,
      quantity: qty,
    });
    onClose();
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) {
          onClose();
        }
      }}
    >
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
                  className="w-16 h-16 rounded-xl object-cover border border-border"
                />
                <div>
                  <DialogTitle className="font-display text-lg font-bold text-foreground">
                    {plant.name}
                  </DialogTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-garden-green font-bold text-base">
                      ₹{plantPrice}
                    </span>
                    <span className="text-muted-foreground line-through text-sm">
                      ₹{MRP}
                    </span>
                    <Badge className="bg-red-100 text-red-700 border-0 text-xs font-semibold px-2">
                      {discount}% OFF
                    </Badge>
                  </div>
                </div>
              </div>
            </DialogHeader>

            {/* Plant Info Card */}
            <div className="px-4 pb-2">
              <div className="bg-green-50 border border-green-100 rounded-xl p-4 flex flex-col gap-3">
                <p className="text-sm text-gray-700 leading-relaxed">
                  {info.description}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-start gap-2">
                    <span className="mt-0.5 text-green-600">
                      <Leaf className="w-4 h-4" />
                    </span>
                    <div>
                      <p className="text-xs font-semibold text-gray-500">
                        Height
                      </p>
                      <p className="text-xs text-gray-700">10–12 inch</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="mt-0.5 text-blue-500">
                      <Droplets className="w-4 h-4" />
                    </span>
                    <div>
                      <p className="text-xs font-semibold text-gray-500">
                        Water
                      </p>
                      <p className="text-xs text-gray-700">{info.water}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="mt-0.5 text-yellow-500">
                      <Sun className="w-4 h-4" />
                    </span>
                    <div>
                      <p className="text-xs font-semibold text-gray-500">
                        Sunlight
                      </p>
                      <p className="text-xs text-gray-700">{info.sunlight}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="mt-0.5 text-orange-500">
                      <MapPin className="w-4 h-4" />
                    </span>
                    <div>
                      <p className="text-xs font-semibold text-gray-500">
                        Best Placement
                      </p>
                      <p className="text-xs text-gray-700">{info.placement}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-2 bg-white rounded-lg px-3 py-2 border border-green-100">
                  <span className="mt-0.5 text-teal-600">
                    <Wind className="w-4 h-4" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-gray-500">
                      Environment Effect
                    </p>
                    <p className="text-xs text-gray-700">{info.envEffect}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Pot type selection */}
            <div className="px-5 pt-2 pb-3">
              <p className="text-sm font-semibold text-foreground mb-2">
                Select Pot Type:
              </p>
              <div className="flex gap-2">
                {POT_OPTIONS.map((pot) => {
                  const isSelected = selectedPot === pot.type;
                  return (
                    <button
                      key={pot.type}
                      type="button"
                      data-ocid={`plant.pot.${pot.type === "No Pot" ? "0" : pot.type === "4 Inch Pot" ? "1" : "2"}`}
                      onClick={() => setSelectedPot(pot.type)}
                      className={`flex-1 flex flex-col items-center gap-1 py-2 px-2 rounded-xl border-2 text-sm font-medium transition-all ${
                        isSelected
                          ? "border-green-400 bg-green-50 text-garden-green"
                          : "border-border bg-card text-muted-foreground hover:border-green-200"
                      }`}
                    >
                      {pot.image ? (
                        <img
                          src={pot.image}
                          alt={pot.type}
                          className="w-10 h-10 object-contain"
                        />
                      ) : (
                        <span className="text-xl">{pot.icon}</span>
                      )}
                      <span className="text-xs font-semibold leading-tight text-center">
                        {pot.type}
                      </span>
                      <span
                        className="text-xs font-bold"
                        style={{ color: pot.price === 0 ? "#888" : "#e07b00" }}
                      >
                        {pot.price === 0 ? "Free" : `+₹${pot.price}`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity + Add to Cart */}
            <div className="px-5 pb-5">
              <div className="flex items-center justify-between bg-secondary/60 rounded-xl p-3 mb-3">
                <span className="text-sm font-medium text-foreground">
                  Total: ₹{itemTotal}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    data-ocid="plant.qty.decrease.button"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="w-8 h-8 rounded-full border border-border bg-card flex items-center justify-center hover:bg-secondary transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center font-bold text-foreground text-sm">
                    {qty}
                  </span>
                  <button
                    type="button"
                    data-ocid="plant.qty.increase.button"
                    onClick={() => setQty((q) => q + 1)}
                    className="w-8 h-8 rounded-full border border-border bg-card flex items-center justify-center hover:bg-secondary transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <button
                type="button"
                data-ocid="plant.addtocart.button"
                onClick={handleAddToCart}
                className="flex items-center justify-center gap-2 w-full font-semibold py-3 rounded-xl transition-opacity text-sm shadow hover:opacity-90"
                style={{ backgroundColor: "#fef9c3", color: "#111" }}
              >
                <ShoppingCart className="w-4 h-4" />
                Add to Cart
              </button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function CartDialog({
  open,
  onClose,
  cart,
  onUpdateQty,
  onRemove,
}: {
  open: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQty: (idx: number, qty: number) => void;
  onRemove: (idx: number) => void;
}) {
  const totalAmount = cart.reduce(
    (sum, item) => sum + (item.plantPrice + item.potPrice) * item.quantity,
    0,
  );

  function generateWhatsAppMessage() {
    let msg = "Hello Gulmohar Vatika! 🌸\n\nI would like to order:\n\n";
    cart.forEach((item, i) => {
      const itemTotal = (item.plantPrice + item.potPrice) * item.quantity;
      msg += `${i + 1}. ${item.plantName}\n`;
      msg += `   Pot: ${item.potType}${item.potPrice > 0 ? ` (+₹${item.potPrice})` : ""}\n`;
      msg += `   Plant ₹${item.plantPrice} × ${item.quantity} = ₹${item.plantPrice * item.quantity}\n`;
      if (item.potPrice > 0) {
        msg += `   Pot ₹${item.potPrice} × ${item.quantity} = ₹${item.potPrice * item.quantity}\n`;
      }
      msg += `   Subtotal: ₹${itemTotal}\n\n`;
    });
    msg += `💰 Grand Total: ₹${totalAmount}\n\nPlease confirm my order. Thank you! 🙏`;
    return msg;
  }

  const whatsappUrl = `https://wa.me/918955381614?text=${encodeURIComponent(generateWhatsAppMessage())}`;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        data-ocid="cart.dialog"
        className="max-w-lg p-0 overflow-hidden rounded-2xl"
      >
        <DialogHeader className="px-5 pt-5 pb-3 border-b border-border">
          <DialogTitle className="font-display text-lg font-bold text-foreground flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-garden-green" />
            Your Cart ({cart.length} items)
          </DialogTitle>
        </DialogHeader>

        {cart.length === 0 ? (
          <div
            data-ocid="cart.empty_state"
            className="py-12 text-center text-muted-foreground"
          >
            <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>Cart is empty</p>
          </div>
        ) : (
          <>
            <div
              className="overflow-y-auto max-h-64 px-5 py-3 flex flex-col gap-3"
              style={{ scrollbarWidth: "thin" }}
            >
              {cart.map((item, idx) => (
                <div
                  key={`${item.plantName}-${item.potType}-${idx}`}
                  data-ocid={`cart.item.${idx + 1}`}
                  className="flex items-center gap-3 bg-secondary/40 rounded-xl p-3"
                >
                  <img
                    src={
                      PLANT_IMAGES[item.plantName] ??
                      "/assets/generated/plant-marigold.dim_400x400.jpg"
                    }
                    alt={item.plantName}
                    className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate">
                      {item.plantName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.potType}
                      {item.potPrice > 0 ? ` (+₹${item.potPrice})` : ""}
                    </p>
                    <p className="text-xs font-bold text-garden-green">
                      ₹{(item.plantPrice + item.potPrice) * item.quantity}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      data-ocid={`cart.decrease.button.${idx + 1}`}
                      onClick={() =>
                        item.quantity > 1
                          ? onUpdateQty(idx, item.quantity - 1)
                          : onRemove(idx)
                      }
                      className="w-7 h-7 rounded-full border border-border bg-card flex items-center justify-center text-sm hover:bg-secondary"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-6 text-center text-sm font-bold">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      data-ocid={`cart.increase.button.${idx + 1}`}
                      onClick={() => onUpdateQty(idx, item.quantity + 1)}
                      className="w-7 h-7 rounded-full border border-border bg-card flex items-center justify-center text-sm hover:bg-secondary"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      data-ocid={`cart.remove.button.${idx + 1}`}
                      onClick={() => onRemove(idx)}
                      className="w-7 h-7 rounded-full bg-red-50 text-red-400 flex items-center justify-center ml-1 hover:bg-red-100"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="px-5 pb-5 pt-3 border-t border-border">
              <div className="flex justify-between items-center mb-3 bg-garden-green/10 rounded-xl px-4 py-2.5">
                <span className="font-semibold text-foreground text-sm">
                  Grand Total
                </span>
                <span className="font-bold text-garden-green text-lg">
                  ₹{totalAmount}
                </span>
              </div>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-ocid="cart.whatsapp.order.button"
                className="flex items-center justify-center gap-2 w-full text-white font-semibold py-3.5 rounded-xl transition-opacity text-base shadow hover:opacity-90"
                style={{ backgroundColor: "#25D366" }}
              >
                <WhatsAppIcon className="w-5 h-5" />
                Order on WhatsApp
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
  const price = getPlantPrice(plant.category);
  const discount = getDiscount(plant.category);

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
            {discount}% OFF
          </Badge>
        </div>
      </div>

      <div className="p-3 flex flex-col gap-2">
        <h3 className="font-display font-semibold text-foreground text-xs leading-snug line-clamp-2">
          {plant.name}
        </h3>
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-garden-green text-sm">₹{price}</span>
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
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
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

  function addToCart(item: CartItem) {
    setCart((prev) => {
      const idx = prev.findIndex(
        (c) => c.plantName === item.plantName && c.potType === item.potType,
      );
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = {
          ...updated[idx],
          quantity: updated[idx].quantity + item.quantity,
        };
        return updated;
      }
      return [...prev, item];
    });
  }

  function updateCartQty(idx: number, qty: number) {
    setCart((prev) => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], quantity: qty };
      return updated;
    });
  }

  function removeFromCart(idx: number) {
    setCart((prev) => prev.filter((_, i) => i !== idx));
  }

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const whatsappUrl = `https://wa.me/918955381614?text=${encodeURIComponent("Hello! I would like to know more about your plants.")}`;

  const googleMapsUrl =
    "https://maps.google.com/?q=Chansda+Bus+Stand+Udaipur+Rajasthan+313015";

  return (
    <div
      className="min-h-screen font-body"
      style={{ backgroundColor: "oklch(0.97 0.015 10)" }}
    >
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
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-ocid="nav.whatsapp.button"
              className="flex items-center gap-1.5 text-sm font-semibold text-white px-4 py-1.5 rounded-full hover:opacity-90 transition-opacity"
              style={{ backgroundColor: "#25D366" }}
            >
              <WhatsAppIcon className="w-4 h-4" />
              WhatsApp
            </a>
          </nav>

          <div className="flex items-center gap-2">
            {/* Cart button */}
            <button
              type="button"
              data-ocid="cart.open_modal_button"
              onClick={() => setCartOpen(true)}
              className="relative p-2 rounded-lg hover:bg-secondary transition-colors"
              aria-label="Open cart"
            >
              <ShoppingCart className="w-5 h-5 text-garden-green" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

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
        </div>

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
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-ocid="nav.whatsapp.button"
                  className="flex items-center gap-2 py-2 text-sm font-semibold"
                  style={{ color: "#25D366" }}
                >
                  <WhatsAppIcon className="w-4 h-4" />
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
                "url('/assets/generated/nursery-hero-hd.dim_1600x600.jpg')",
            }}
          >
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
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-ocid="hero.whatsapp.button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2 text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:opacity-90 transition-opacity text-sm"
                    style={{ backgroundColor: "#25D366" }}
                  >
                    <WhatsAppIcon className="w-4 h-4" />
                    Order on WhatsApp
                  </motion.a>
                </div>
              </motion.div>
            </div>
          </div>

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
                    <a
                      href={googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-ocid="contact.address.link"
                      className="text-muted-foreground mt-1 leading-relaxed hover:text-garden-green transition-colors underline underline-offset-2 block"
                    >
                      Chansda Bus Stand,
                      <br />
                      Udaipur — 313015,
                      <br />
                      Rajasthan, India
                    </a>
                  </div>
                </div>

                <div className="h-px bg-border" />

                {/* WhatsApp only */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <WhatsAppIcon className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-base">
                      WhatsApp
                    </p>
                    <a
                      href={whatsappUrl}
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
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 px-4" style={{ backgroundColor: "#2d5a27" }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            {/* Left: Logo + Name */}
            <div className="flex items-center gap-3">
              <img
                src="/assets/generated/gulmohar-logo-transparent.dim_300x300.png"
                alt="Gulmohar Vatika Logo"
                className="w-12 h-12 object-contain"
              />
              <div>
                <p
                  className="font-display font-bold text-lg"
                  style={{ color: "#7ec86b" }}
                >
                  Gulmohar Vatika
                </p>
                <p className="text-sm" style={{ color: "#a8d9a0" }}>
                  प्रकृति की खूबसूरती, आपके द्वार
                </p>
              </div>
            </div>

            {/* Center: Flower emoji */}
            <div className="flex justify-center">
              <span className="text-3xl" aria-hidden="true">
                🌸
              </span>
            </div>

            {/* Right: Details */}
            <div className="flex flex-col gap-1 text-sm md:text-right">
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-ocid="footer.address.link"
                className="hover:underline transition-colors"
                style={{ color: "#a8d9a0" }}
              >
                Chansda Bus Stand, Udaipur — 313015
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline transition-colors"
                style={{ color: "#a8d9a0" }}
              >
                +91 89553 81614
              </a>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 text-center">
            <p className="text-xs" style={{ color: "#7ec86b" }}>
              © {new Date().getFullYear()} Gulmohar Vatika | Udaipur, Rajasthan
            </p>
            <p
              className="text-xs mt-1"
              style={{ color: "rgba(126,200,107,0.6)" }}
            >
              Built with ❤️ using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:opacity-80 transition-colors"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>

      {/* Plant Detail Dialog */}
      <PlantDetailDialog
        plant={selectedPlant}
        open={selectedPlant !== null}
        onClose={() => setSelectedPlant(null)}
        onAddToCart={addToCart}
      />

      {/* Cart Dialog */}
      <CartDialog
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        onUpdateQty={updateCartQty}
        onRemove={removeFromCart}
      />

      {/* Floating WhatsApp button — bottom right */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        data-ocid="whatsapp.floating.button"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 text-white font-semibold px-4 py-3 rounded-full shadow-xl hover:opacity-90 transition-all hover:scale-105"
        style={{ backgroundColor: "#25D366" }}
        aria-label="Contact on WhatsApp"
      >
        <WhatsAppIcon className="w-5 h-5" />
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
