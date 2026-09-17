import type { Metadata } from "next";
import Image from "next/image";
import { listAlbumsWithImages } from "@/lib/queries";
import { PageHeader, EmptyState } from "@/components/site/primitives";
import { toFa } from "@/lib/format";

export const metadata: Metadata = { title: "گالری تصاویر" };
export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const albums = await listAlbumsWithImages();

  return (
    <>
      <PageHeader title="گالری تصاویر" subtitle="آلبوم‌های تصویری از برنامه‌ها و فعالیت‌های مدرسه." />
      <section className="container-page space-y-12 py-12">
        {albums.length === 0 ? (
          <EmptyState title="هنوز آلبومی منتشر نشده است" />
        ) : (
          albums.map((album) => (
            <section key={album.id} aria-labelledby={`album-${album.id}`}>
              <div className="flex items-baseline justify-between gap-3">
                <h2 id={`album-${album.id}`} className="text-xl font-bold">{album.title}</h2>
                <span className="text-xs text-muted-foreground">{toFa(album.images.length)} تصویر</span>
              </div>
              {album.description ? <p className="mt-1 text-sm text-muted-foreground">{album.description}</p> : null}
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {album.images.map((img) => (
                  <div key={img.id} className="relative aspect-[4/3] overflow-hidden rounded-lg border">
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
