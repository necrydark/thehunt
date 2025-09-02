/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { getChangelogSlugs, getChangelogsBySlugs } from "@/lib/changelogs";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

export async function generateStaticParams() {
  const slugs = getChangelogSlugs();
  return slugs.map((slug: any) => ({
    slug: slug.replace(/\md$/, ""),
  }));
}

export default async function Post(props: any) {
  const params = await props.params;

  const { slug } = params;

  const post = getChangelogsBySlugs(slug);

  return (
    <div className="min-h-screen w-full relative">
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(125% 125% at 50% 90%, #000000 40%, #072607 100%)",
        }}
      />
      <article className="prose container max-w-[900px] flex flex-col items-center mx-auto relative z-10 p-4 pt-[10rem]">
        <div className="flex  gap-2">
          <Button
            variant={"outline"}
            size={"icon"}
            asChild
            className="bg-primary-green hover:bg-primary-green/75 border-black border-[2px]  hover:text-black  transition-all duration-250"
          >
            <Link href={"/changelogs"}>
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <div className="flex flex-col">
            <h1 className="text-2xl text-white mb-0">{post.data.title}</h1>
            <p className="text-gray-300 mt-0">{post.data.date}</p>
          </div>
        </div>

        <div className="!text-white prose prose-invert">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>
      </article>
    </div>
  );
}
