import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";

const carouselItems = [
  {
    id: 1,
    image: "/blue-bl2.jpeg",
    title: "Hunt For Items",
    subtext: "The harder they are, the more they are worth.",
    alt: "Blue from Borderlands 2",
  },
  {
    id: 2,
    image: "/overlay-example-2.webp",
    title: "Help The Kids",
    subtext:
      "Stream your progress and raise Funds with your community to help St. Jude.",
    alt: "Shows an example of the stream overlay featuring gameplay from Borderlands 3, the stream overlay and facecam.",
  },
  {
    id: 3,
    image: "/mordecai-bl2.jpeg",
    title: "Upload Your Clips",
    subtext:
      "Simply paste your clip's URL in your profile to register your points.",
    alt: "Shows Mordecai in Borderlands 2",
  },
  {
    id: 4,
    image: "/bandit-technical-bl2.jpeg",
    title: "Make The Difference",
    subtext:
      "Join hundreds of hunters raising funds to help St Jude on Xbox, Playstation and PC.",
    alt: "Shows a bandit technical from Borderlands 2",
  },
];

const Carousels = () => {
  return (
    <section className="container max-w-3xl mx-auto pt-[5rem] relative flex flex-row justify-center items-center z-10">
      <section className="w-full py-12 md:py-24 lg:py-32 bg-dark-background text-white">
        <div className="container flex flex-col justify-center mx-auto px-4 md:px-6">
          <Carousel
            opts={{ align: "start" }}
            className="w-full max-w-[600px] mx-auto"
          >
            <CarouselContent className="-ml-4">
              {carouselItems.map((item, index) => (
                <CarouselItem key={index} className="pl-4">
                  <div className="p-1">
                    <div className="flex flex-col items-center text-center">
                      <div className="relative w-[392px] h-[221px] mb-6 rounded-lg overflow-hidden border-2 border-[#BBFE17] shadow-lg shadow-[#BBFE17]/50">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          width={392}
                          height={221}
                          alt={item.title}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <h3 className="font-bold text-primary-green text-[1.75rem] mb-2 tracking-wider">
                        {item.title}
                      </h3>
                      <p className="text-[16px]">{item.subtext}</p>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute hidden left-[-70px] top-1/2 text-primary-green -translate-y-1/2 bg-gray-800  border-0 rounded-full w-12 h-12 md:flex items-center justify-center shadow-lg hover:bg-[#BBFE17] hover:text-black transition-colors duration-200" />
            <CarouselNext className="absolute hidden right-[-70px] top-1/2  -translate-y-1/2 bg-gray-800 text-primary-green border-0 rounded-full w-12 h-12 md:flex items-center justify-center shadow-lg hover:bg-[#BBFE17] hover:text-black transition-colors duration-200" />
          </Carousel>
        </div>
      </section>
    </section>
  );
};

export default Carousels;
