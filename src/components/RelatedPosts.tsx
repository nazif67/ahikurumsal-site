import Link from "next/link";

type RelatedItem = {
  title: string;
  slug: string;
  excerpt?: string;
  date?: string;
  category?: string;
  author?: string;
};

type RelatedPostsProps = {
  items: RelatedItem[];
  basePath: string;
  heading?: string;
};

export default function RelatedPosts({
  items,
  basePath,
  heading = "Bunları da İnceleyin",
}: RelatedPostsProps) {
  if (items.length === 0) return null;

  return (
    <section className="mt-16 pt-10 border-t border-gray-200">
      <h2 className="text-xl font-bold text-gray-900 mb-6">{heading}</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        {items.map((item) => (
          <Link
            key={item.slug}
            href={`${basePath}/${item.slug}`}
            className="group flex flex-col rounded-xl border border-gray-200 bg-white p-5 hover:shadow-md hover:border-blue-200 transition-all"
          >
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {item.date && <p className="text-xs text-gray-400">{item.date}</p>}
              {item.category && (
                <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                  {item.category}
                </span>
              )}
            </div>
            <h3 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors leading-snug line-clamp-2 flex-1">
              {item.title}
            </h3>
            {item.excerpt && (
              <p className="mt-2 text-sm text-gray-500 line-clamp-2">{item.excerpt}</p>
            )}
            <div className="mt-4 flex items-center justify-between">
              {item.author ? (
                <span className="text-xs text-gray-400">✍ {item.author}</span>
              ) : (
                <span />
              )}
              <span className="text-xs text-blue-600 font-medium group-hover:underline">
                Devamını oku →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
