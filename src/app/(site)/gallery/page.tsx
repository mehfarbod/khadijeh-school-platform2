import type { Metadata } from "next";
import Image from "next/image";
import { api } from "@/convex/_generated/api";
import { getConvexServerClient } from "@/lib/server-convex";
import { PageHeader, EmptyState } from "@/components/site/primitives";
import { toFa } from "@/lib/format";

export const metadata: Metadata = { title: "گالری تصاویر" };
export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const client = getConvexServerClient();
  const albums = await client.query(api.public2.listAlbums, {});
  const withImages = await Promise.all(
    albums.map(async (a) => ({ album: a, images: await client.query(api.public2.listAlbumImages, { albumId: a._id }) })),
  );

  return (
    <>
      <PageHeader title="گالری تصاویر" subtitle="آلبوم‌های تصویری از برنامه‌ها و فعالیت‌های مدرسه." />
      <section className="container-page space-y-12 py-12">
        {withImages.length === 0 ? (
          <EmptyState title="هنوز آلبومی منتشر نشده است" />
        ) : (
          withImages.map(({ album, images }) => (
            <section key={album._id} aria-labelledby={`album-${album._id}`}>
              <div className="flex items-baseline justify-between gap-3">
                <h2 id={`album-${album._id}`} className="text-xl font-bold">{album.title}</h2>
                <span className="text-xs text-muted-foreground">{toFa(images.length)} تصویر</span>
              </div>
              {album.description ? <p className="mt-1 text-sm text-muted-foreground">{album.description}</p> : null}
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {images.map((img) => (
                  <div key={img._id} className="relative aspect-[4/3] overflow-hidden rounded-lg border">
                    <Image src={img.url} alt={img.title ?? album.title} fill className="object-cover transition-transform duration-300 hover:scale-[1.03]" sizes="(max-width: 640px) 50vw, 25vw" />
                  </div>
                ))}
              </div>
            </section>
          ))
        )}
      </section>
    </>
  );
}
