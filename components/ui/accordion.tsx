"use client";

import * as React from "react";
import * as RadixAccordion from "@radix-ui/react-accordion";

export const Accordion = RadixAccordion.Root;
export const AccordionItem = RadixAccordion.Item;

export const AccordionTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof RadixAccordion.Trigger>
>(function AccordionTrigger({ children, ...props }, ref) {
  return (
    <RadixAccordion.Header>
      <RadixAccordion.Trigger ref={ref} {...props}>
        {children}
      </RadixAccordion.Trigger>
    </RadixAccordion.Header>
  );
});

export const AccordionContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof RadixAccordion.Content>
>(function AccordionContent({ children, ...props }, ref) {
  return (
    <RadixAccordion.Content ref={ref} {...props}>
      {children}
    </RadixAccordion.Content>
  );
});
