import { Accordion, AccordionItem } from "@heroui/accordion";

const Sider = () => {
  return (
    <div className="w-[240px] h-full border-r py-4 px-[10px] light:border-r-gray-200 dark:border-r-gray-600">
      <Accordion>
        <AccordionItem key="1" aria-label="Accordion 1" title="Accordion 1">
          1212
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default Sider;
