import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import useInView from "@/hooks/use-in-view";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(57,39,32,0.22),_transparent_60%)]" />
      <div className="absolute -top-40 right-[-10%] h-[480px] w-[480px] rounded-full bg-[#392720]/10 blur-3xl" />
      <div className="absolute -bottom-40 left-[-15%] h-[520px] w-[520px] rounded-full bg-[#9b897e]/20 blur-3xl" />

      <div className="relative px-6 lg:px-12 py-16">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
          <div className="space-y-6">
            <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
              Curated home essentials
            </p>
            <h1 className="text-5xl md:text-6xl font-serif leading-[1.05]">
              Quiet luxury for spaces that breathe.
            </h1>
            <p className="text-base text-muted-foreground max-w-xl">
              Thoughtful pieces for kitchen, bath, and living. Crafted to feel
              timeless, designed to live beautifully.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild className="bg-[#392720] px-10 py-6 rounded-none">
                <Link to="/shop">Shop collection</Link>
              </Button>
              <Button
                variant="outline"
                asChild
                className="px-10 py-6 rounded-none"
              >
                <Link to="/category/living-room">Explore living</Link>
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-6 pt-6 text-xs uppercase tracking-[0.3em] text-muted-foreground">
              <span>Small batch</span>
              <span>Modern craft</span>
              <span>Soft neutrals</span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 border border-border" />
            <div className="relative bg-card p-4">
              <div
                className="aspect-[4/5] bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1628592102751-ba83b0314276?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTN8fG1vZGVybiUyMGludGVyaW9yfGVufDB8fDB8fHwwfit=crop')",
                }}
              />
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="uppercase tracking-[0.2em] text-muted-foreground">
                  New season
                </span>
                <Link to="/shop" className="hover:underline">
                  View lookbook
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const DiscoverSection = () => {
  const { ref, isInView } = useInView();

  return (
    <section className="py-20 px-6">
      <div
        ref={ref}
        className={`max-w-6xl mx-auto transition-all duration-700 ease-out delay-200 ${
          isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="space-y-5">
          <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
            Discover
          </p>
          <h2 className="text-4xl md:text-5xl font-serif">
            Crafted for the discerning, built for every day.
          </h2>
          <p className="text-sm text-muted-foreground max-w-xl">
            From sculptural storage to elevated tabletop pieces, explore a calm
            palette designed to keep your spaces feeling intentional.
          </p>
          <Button
            asChild
            className="bg-[#392720] px-12 py-6 rounded-none"
          >
            <Link to="/shop">Discover</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};


const CategorySection = () => {
  return (
    <section className="py-20 px-6 lg:px-12 bg-[#231a16] text-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between flex-wrap gap-6 mb-12">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-[#b3aeaa]">
              Shop by space
            </p>
            <h2 className="text-4xl md:text-5xl font-serif mt-4">
              Build a home that feels collected.
            </h2>
          </div>
          <Button variant="outline" asChild className="px-8 py-5 bg-transparent text-white border-white/40">
            <Link to="/shop">View all categories</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {[
            {
              title: "Living Room",
              description: "Soft layers, sculptural accents, and calm palettes.",
              image:
                "https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bGl2aW5nJTIwcm9vbXxlbnwwfHwwfHx8MA%3D%3Dfit=crop",
              link: "/category/living-room",
            },
            {
              title: "Bathroom",
              description: "Spa-grade textures for a clean ritual.",
              image:
                "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8YmF0aHJvb218ZW58MHx8MHx8fDA%3Dfit=crop",
              link: "/category/bathroom",
            },
            {
              title: "Kitchen",
              description: "Tools and textures made for everyday cooking.",
              image:
                "https://images.unsplash.com/photo-1632583824020-937ae9564495?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGtpdGNoZW58ZW58MHx8MHx8fDA%3Dfit=crop",
              link: "/category/kitchen",
            },
            {
              title: "Outdoor",
              description: "Relaxed moments with elevated patio pieces.",
              image:
                "https://images.unsplash.com/photo-1602860739945-9a61573cd62d?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cGF0aW98ZW58MHx8MHx8fDA%3Dfit=crop",
              link: "/category/outdoor",
            },
          ].map((item) => (
            <div key={item.title} className="group border border-white/10 bg-[#2f2420] rounded-2xl overflow-hidden">
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6 md:p-8 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-serif">{item.title}</h3>
                </div>
                <p className="text-sm text-[#b3aeaa]">{item.description}</p>
                <Button
                  variant="outline"
                  asChild
                  className="px-6 py-4 bg-transparent text-white border-white/40"
                >
                  <Link to={item.link}>Explore</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export { HeroSection, DiscoverSection, CategorySection };