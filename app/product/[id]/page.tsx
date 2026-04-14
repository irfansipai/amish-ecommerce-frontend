// frontend/app/product/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Phone, Heart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import { useSavedItems } from "@/context/SavedItemsContext"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: string;
  sku: string;
  stock: number;
  is_active: boolean;
  image_urls: string[];
  attributes?: Record<string, string[]>;
}

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { toggleSavedItem, isSaved } = useSavedItems();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  // Button loading states for instant visual feedback
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isTogglingSave, setIsTogglingSave] = useState(false);

  // Track multiple selections (e.g., Size, Color)
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});

  // Track accordion states dynamically
  const [openAccordions, setOpenAccordions] = useState<string[]>(["product-details"]);

  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Carousel tracking
  useEffect(() => {
    if (!carouselApi) return;
    setCurrentSlide(carouselApi.selectedScrollSnap());
    carouselApi.on("select", () => {
      setCurrentSlide(carouselApi.selectedScrollSnap());
    });
  }, [carouselApi]);

  // Fetch product and initialize attributes
  useEffect(() => {
    const productId = params?.id;
    if (!productId) {
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await api.get<Product>(`/api/v1/products/${productId}`);
        const data = response.data;

        setProduct({
          ...data,
          description: data.description || "No description available.",
          image_urls: data.image_urls?.length ? data.image_urls : ["/placeholder.svg?height=800&width=600"],
        });

        // Initialize default attribute selections and open the accordions
        if (data.attributes) {
          const defaults: Record<string, string> = {};
          const accordionsToOpen = ["product-details"];

          Object.entries(data.attributes).forEach(([key, values]) => {
            if (values.length > 0) {
              defaults[key] = values[0]; // Select first option by default
            }
            accordionsToOpen.push(`attr-${key}`); // Open this accordion by default
          });

          setSelectedAttributes(defaults);
          setOpenAccordions(accordionsToOpen);
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params]);

  const handleAttributeSelect = (attributeName: string, value: string) => {
    setSelectedAttributes(prev => ({
      ...prev,
      [attributeName]: value
    }));
  };

  const handleAddToCart = async () => {
    if (!user) {
      toast.error("Authentication Required", {
        description: "Please sign in or create an account to add items to your bag.",
      });
      router.push("/auth");
      return;
    }

    if (!product) return;

    setIsAddingToCart(true); // Trigger instant button feedback
    try {
      await addToCart({
      product_id: product.id,
      quantity: 1,
      attributes: selectedAttributes,
    });

    toast.success("Added to Bag", {
      description: `${product.name} has been added.`
    });
    } catch (error) {
      toast.error("Failed to add item", {
        description: "There was a problem adding this item to your bag."
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleToggleSaved = async () => {
    if (!product) return;
    
    // Check if it's currently saved before we await the toggle
    const currentlySaved = isSaved(product.id);
    
    setIsTogglingSave(true); // Trigger instant button feedback
    try {
      await toggleSavedItem(product.id);
      
      if (currentlySaved) {
        toast.success("Removed from Saved Items");
      } else {
        toast.success("Saved for Later");
      }
    } catch (error) {
      toast.error("Action Failed", {
        description: "We couldn't update your saved items."
      });
    } finally {
      setIsTogglingSave(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-sm tracking-widest uppercase text-muted-foreground animate-pulse">
          Loading details...
        </p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-sm tracking-wide text-muted-foreground">Product not found</p>
      </div>
    );
  }

  return (
    <div className="bg-background">
      <section className="w-full relative group">
        <Carousel setApi={setCarouselApi} opts={{ loop: true }} className="w-full">
          <CarouselContent className="ml-0">
            {product.image_urls.map((imgUrl, index) => (
              <CarouselItem key={index} className="pl-0 basis-full lg:basis-1/2 border-r border-white/10">
                <div className="relative w-full aspect-[3/4] md:h-[80vh] bg-neutral-100">
                  <Image
                    src={imgUrl}
                    alt={`${product.name} - View ${index + 1}`}
                    fill
                    className="object-cover"
                    priority={index === 0}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* Custom Minimalist Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10 mix-blend-difference">
          {product.image_urls.map((_, index) => (
            <div
              key={index}
              className={`h-[2px] transition-all duration-500 ease-in-out ${currentSlide === index ? "w-8 bg-white" : "w-4 bg-white/50"
                }`}
            />
          ))}
        </div>
      </section>

      {/* Information Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-20">

          {/* Left Column - The Narrative */}
          <div className="lg:col-span-3">
            <p className="text-[10px] tracking-[0.2em] text-muted-foreground mb-2">SEE NOW, BUY NOW</p>
            <h2 className="font-serif text-xl md:text-2xl font-light tracking-wide mb-3">{product.name}</h2>
            <p className="text-base font-light tracking-wide mb-8">₹ {product.price}</p>

            {/* SINGLE COMBINED ACCORDION */}
            <Accordion
              type="multiple"
              value={openAccordions}
              onValueChange={setOpenAccordions}
              className="border-t border-border/40 mb-8"
            >
              {/* 1. Dynamic Attributes (Size, Color, etc.) */}
              {product.attributes && Object.entries(product.attributes).map(([attrName, values]) => (
                <AccordionItem key={attrName} value={`attr-${attrName}`} className="border-border/40">
                  <AccordionTrigger className="text-sm font-light tracking-wide hover:no-underline py-4 uppercase">
                    {attrName}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-4 gap-2 pb-2">
                      {values.map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => handleAttributeSelect(attrName, val)}
                          className={`border py-3 text-sm transition-colors ${selectedAttributes[attrName] === val
                            ? "border-foreground bg-foreground text-background"
                            : "border-border/60 hover:border-foreground"
                            }`}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}

              {/* 2. Static Product Details (Markdown) */}
              <AccordionItem
                value="product-details"
                className="border-border/40"
              >
                <AccordionTrigger className="text-sm font-light tracking-wide hover:no-underline py-4 uppercase">
                  Product Details
                </AccordionTrigger>
                <AccordionContent>
                  <div className="text-sm font-light leading-relaxed text-foreground/90">
                    <p className="text-[11px] text-muted-foreground tracking-wide mb-6 uppercase">Style {product.sku}</p>

                    <ReactMarkdown
                      components={{
                        p: ({ node, ...props }) => <p className="mb-4" {...props} />,
                        ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-4 space-y-1.5" {...props} />,
                        ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mb-4 space-y-1.5" {...props} />,
                        li: ({ node, ...props }) => <li className="text-foreground/80" {...props} />,
                        strong: ({ node, ...props }) => <strong className="font-medium text-foreground" {...props} />,
                      }}
                    >
                      {product.description}
                    </ReactMarkdown>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* 3. Static Commitment */}
              <AccordionItem value="commitment" className="border-border/40">
                <AccordionTrigger className="text-sm font-light tracking-wide hover:no-underline py-4 uppercase">
                  Our Commitment
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm font-light leading-relaxed text-foreground/80 pb-2">
                    We are committed to providing the finest craftsmanship and
                    materials. Each piece is meticulously crafted by skilled
                    artisans using time-honored techniques passed down through
                    generations. Our dedication to sustainability ensures that
                    every product meets the highest ethical standards.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Right Column - The Buy Box */}
          <div className="lg:col-span-2">
            <div className="sticky top-8">
              <Link href="/catalog" className="inline-flex items-center gap-2 text-sm font-semibold uppercase text-foreground hover:underline transition-colors mb-6">
                <ChevronLeft className="w-4 h-4" /> Back to Catalog
              </Link>

              <p className="text-sm font-light text-muted-foreground mb-4">
                Select your preferences to see the expected delivery date.
              </p>

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isAddingToCart}
                className="w-full bg-foreground text-background py-4 text-sm tracking-[0.2em] font-medium hover:bg-foreground/90 transition-colors disabled:opacity-80"
              >
                {isAddingToCart ? "ADDING..." : "ADD TO BAG"}
              </button>

              <button
                type="button"
                onClick={handleToggleSaved}
                disabled={isTogglingSave}
                className="w-full border border-foreground text-foreground py-4 text-sm tracking-[0.2em] font-medium hover:bg-neutral-50 transition-colors flex items-center justify-center gap-3 mt-3 disabled:opacity-50"
              >
                <Heart
                  className={`w-4 h-4 transition-colors ${isSaved(product.id) ? "fill-foreground text-foreground" : "text-foreground"
                    } ${isTogglingSave ? "animate-pulse" : ""}`}
                  strokeWidth={1.5}
                />
                {isTogglingSave ? "SAVING..." : isSaved(product.id) ? "SAVED" : "SAVE FOR LATER"}
              </button>

              {/* Utility Links */}
              <div className="mt-8 space-y-5">
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                  <div>
                    <Link href="/contact" className="text-sm font-light underline underline-offset-2 hover:opacity-70 block">
                      Contact Us
                    </Link>
                    <p className="text-xs text-muted-foreground mt-1">
                      Our Client Advisors are available to help you.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}