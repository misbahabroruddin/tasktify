"use client";

import { useEffect, useState } from "react";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { toast } from "sonner";

import { useAction } from "@/hooks/useAction";
import { updateListOrder } from "@/actions/update-list-order";
import { ListWithCards } from "@/type";
import ListForm from "./ListForm";
import ListItem from "./ListItem";
import { updateCardOrder } from "@/actions/update-card-order";

interface ListContainerProps {
  data: ListWithCards[];
  boardId: string;
}

function reOrder<T>(list: T[], startIndex: number, endIndex: number) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
}

export function ListContainer({ data, boardId }: ListContainerProps) {
  const [orderedData, setOrderedData] = useState(data);

  const { execute: executeUpdateListOrder } = useAction(updateListOrder, {
    onSuccess: () => {
      toast.success("List reordered");
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const { execute: executeUpdateCardOrder } = useAction(updateCardOrder, {
    onSuccess: () => {
      toast.success("Card reordered");
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  useEffect(() => {
    setOrderedData(data);
  }, [data]);

  const onDragEnd = (result: any) => {
    const { destination, source, type } = result;

    if (!destination) return;

    // if dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // user moves aa list
    if (type === "list") {
      const items = reOrder(orderedData, source.index, destination.index).map(
        (item, index) => ({ ...item, order: index })
      );
      setOrderedData(items);
      executeUpdateListOrder({ items, boardId });
    }

    // user moves a card
    if (type === "card") {
      let newOrderedData = [...orderedData];

      // source and destination list
      const sourceList = newOrderedData.find(
        (list) => list.id === source.droppableId
      );
      const destinationList = newOrderedData.find(
        (list) => list.id === destination.droppableId
      );

      if (!sourceList || !destinationList) return;

      // check if cards exists on the source list
      if (!sourceList.cards) {
        sourceList.cards = [];
      }

      // check if cards exists on the destination list
      if (!destinationList.cards) {
        destinationList.cards = [];
      }

      // moving the card in the same list
      if (source.droppableId === destination.droppableId) {
        const reorderCards = reOrder(
          sourceList.cards,
          source.index,
          destination.index
        );

        reorderCards.forEach((card, index) => {
          card.order = index;
        });

        sourceList.cards = reorderCards;
        setOrderedData(newOrderedData);

        // todo trigger server action
        executeUpdateCardOrder({ boardId, items: reorderCards });

        // user moves the card to another list
      } else {
        // remove card from the source list
        const [moveCard] = sourceList.cards.splice(source.index, 1);

        // assign new listid to the moved card
        moveCard.listId = destination.droppableId;

        // add card to the destination list
        destinationList.cards.splice(destination.index, 0, moveCard);

        sourceList.cards.forEach((card, index) => {
          card.order = index;
        });

        // update the order fo each card in the destination list
        destinationList.cards.forEach((card, index) => {
          card.order = index;
        });

        setOrderedData(newOrderedData);
        // todo trigger server action
        executeUpdateCardOrder({ boardId, items: destinationList.cards });
      }
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId='lists' type='list' direction='horizontal'>
        {(provided) => (
          <ol
            {...provided.droppableProps}
            ref={provided.innerRef}
            className='flex gap-x-3 h-full'
          >
            {orderedData.map((list, index) => (
              <ListItem key={list.id} index={index} data={list} />
            ))}
            {provided.placeholder}
            <ListForm />
            <div className='flex-shrink-0 w-1' />
          </ol>
        )}
      </Droppable>
    </DragDropContext>
  );
}
