import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAllChangelogs } from "@/lib/changelogs";
import Link from "next/link";

export default function Changelog() {
  const posts = getAllChangelogs();
  return (
    <div className="min-h-screen w-full relative">
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(125% 125% at 50% 90%, #000000 40%, #072607 100%)",
        }}
      />
      <div className="container mx-auto p-4 max-w-6xl prose pt-[10rem] relative z-10">
        <h1 className="text-4xl md:text-5xl text-white font-bold mb-8">
          Changelogs
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {posts?.map(({ slug, data }) => (
            <Card
              className="group bg-black/40 backdrop-blur-sm border-[#BBFE17]/30 hover:border-[#BBFE17] transition-all duration-300 hover:shadow-lg hover:shadow-[#BBFE17]/20"
              key={slug}
            >
              <CardHeader>
                <CardTitle className="text-white">{data.title}</CardTitle>
                <CardDescription className="text-gray-300">
                  {data.date}
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button
                  asChild
                  className=" bg-primary-green mt-4 hover:bg-primary-green/75 text-black font-semibold py-3 rounded-lg transition-all duration-300"
                >
                  <Link className="no-underline" href={`/changelogs/${slug}`}>
                    Read More
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
