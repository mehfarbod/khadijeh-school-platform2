"use client";

import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";

type Faq = { _id: string; question: string; answer: string };

export function FaqList({ items }: { items: Faq[] }) {
  return (
    <Accordion type="single" collapsible className="w-full">
      {items.map((f) => (
        <AccordionItem key={f._id} value={f._id}>
          <AccordionTrigger className="text-right text-[15px] font-medium leading-7 hover:no-underline">
            {f.question}
          </AccordionTrigger>
          <AccordionContent className="text-sm leading-7 text-muted-foreground">
            {f.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
