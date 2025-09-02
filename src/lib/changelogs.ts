/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from "fs";
import matter from "gray-matter";
import path from "path";

const postsDirectory = path.join(process.cwd(), "/src/changelog");

export function getChangelogSlugs(): string[] {
  return fs
    .readdirSync(postsDirectory)
    .filter((file) => file.endsWith(".md"))
    .map((file) => file.replace(/\.md$/, ""));
}

export function getChangelogsBySlugs(slug: string): {
  slug: string;
  content: string;
  data: any;
} {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  const contents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(contents);

  return { slug, content, data };
}

export function getAllChangelogs(): {
  slug: string;
  content: string;
  data: any;
}[] {
  const slugs = getChangelogSlugs();
  return slugs.map((slug) => getChangelogsBySlugs(slug));
}
