"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { ENTITIES } from "@/lib/admin-entities";
import { EntityCRUD } from "@/components/admin/entity-crud";

export default function AdminEntityPage({ params }: { params: Promise<{ entity: string }> }) {
  const { entity: slug } = use(params);
  const config = ENTITIES.find((e) => e.slug === slug);
  if (!config) notFound();
  return <EntityCRUD entity={config} />;
}
