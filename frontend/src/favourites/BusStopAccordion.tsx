import { Accordion } from '@/components/ui/accordion';
import { useState } from 'react';
import AccordionItemWithFetch from './AccordionItemWithFetch';
import type { FavouritedBusStop } from '@/types/bus';

type BusStopAccordionProps = {
  favourites: FavouritedBusStop[];
};

export default function BusStopAccordion({
  favourites,
}: BusStopAccordionProps) {
  const [openItems, setOpenItems] = useState<string[]>([]);

  return (
    <Accordion
      type='multiple'
      className='max-w-xl rounded-lg border'
      onValueChange={(values) => {
        setOpenItems(values);
      }}
    >
      {favourites.map((favourite) => (
        <AccordionItemWithFetch
          key={favourite.busStopCode}
          busStopCode={favourite.busStopCode}
          busStopName={favourite.busStopName}
          isOpen={openItems.includes(favourite.busStopCode)}
        />
      ))}
    </Accordion>
  );
}
