"use client";

import { ElementRef, useRef } from "react";
import { MoreHorizontal, X } from "lucide-react";
import { List } from "@prisma/client";
import { toast } from "sonner";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverClose,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { FormSubmit } from "@/components/form/form-submit";
import { Separator } from "@/components/ui/separator";
import { useAction } from "@/hooks/useAction";
import { deleteList } from "@/actions/delete-list";
import { copyList } from "@/actions/copy-list";

interface ListOptionProps {
  data: List;
  onAddCard: () => void;
}

export default function ListOption({ data, onAddCard }: ListOptionProps) {
  const closeRef = useRef<ElementRef<"button">>(null);

  const { execute: executeDelete } = useAction(deleteList, {
    onSuccess: (data) => {
      toast.success(`List "${data.title}" deleted`);
      closeRef.current?.click();
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const { execute: executeCopy } = useAction(copyList, {
    onSuccess: (data) => {
      toast.success(`List "${data.title}" copied`);
      closeRef.current?.click();
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const handleDeleteList = (formData: FormData) => {
    const id = formData.get("id") as string;
    const boardId = formData.get("boardId") as string;

    executeDelete({ id, boardId });
  };

  const handleCopyList = (formData: FormData) => {
    const id = formData.get("id") as string;
    const boardId = formData.get("boardId") as string;

    executeCopy({ id, boardId });
  };
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className='h-auto w-auto p-2' variant='ghost'>
          <MoreHorizontal className='h-4 w-4' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='px-0 py-3' side='bottom' align='start'>
        <div className='text-sm font-medium text-center text-neutral-600 pb-4'>
          List actions
        </div>
        <PopoverClose ref={closeRef} asChild>
          <Button
            className='h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600'
            variant='ghost'
          >
            <X className='h-4 w-4' />
          </Button>
        </PopoverClose>
        <Button
          onClick={onAddCard}
          className='rounded-none w-full p-2 px-5 justify-start font-normal text-sm'
          variant='ghost'
        >
          Add card
        </Button>
        <form action={handleCopyList}>
          <input type='hidden' name='id' id='id' value={data.id} />
          <input
            type='hidden'
            name='boardId'
            id='boardId'
            value={data.boardId}
          />
          <FormSubmit
            className='rounded-none w-full p-2 px-5 justify-start font-normal text-sm'
            variant='ghost'
          >
            Copy list
          </FormSubmit>
        </form>
        <Separator />
        <form action={handleDeleteList}>
          <input type='hidden' name='id' id='id' value={data.id} />
          <input
            type='hidden'
            name='boardId'
            id='boardId'
            value={data.boardId}
          />
          <FormSubmit
            className='rounded-none w-full p-2 px-5 justify-start font-normal text-sm'
            variant='ghost'
          >
            Delete list
          </FormSubmit>
        </form>
      </PopoverContent>
    </Popover>
  );
}
