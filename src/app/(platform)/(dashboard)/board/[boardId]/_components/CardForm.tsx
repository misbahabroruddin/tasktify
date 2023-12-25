"use client";

import { forwardRef, useRef, ElementRef, KeyboardEventHandler } from "react";
import { Plus, X } from "lucide-react";
import { useParams } from "next/navigation";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import { toast } from "sonner";

import { useAction } from "@/hooks/useAction";
import { createCard } from "@/actions/create-card";
import { Button } from "@/components/ui/button";
import { FormSubmit } from "@/components/form/form-submit";
import { FormTextArea } from "@/components/form/form-textarea";

interface CardFormProps {
  listId: string;
  isEditing: boolean;
  enableEditing: () => void;
  disableEditing: () => void;
}

const CardForm = forwardRef<HTMLTextAreaElement, CardFormProps>(
  ({ listId, isEditing, enableEditing, disableEditing }, ref) => {
    const params = useParams();
    const formRef = useRef<ElementRef<"form">>(null);

    const { execute, fieldErrors } = useAction(createCard, {
      onSuccess: (data) => {
        formRef.current?.reset();
        toast.success(`Card "${data.title}" created`);
      },
      onError: (error) => {
        toast.error(error);
      },
    });

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        disableEditing();
      }
    };

    useOnClickOutside(formRef, disableEditing);
    useEventListener("keydown", onKeyDown);

    const onTextAreaKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (
      e
    ) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        formRef.current?.requestSubmit();
      }
    };

    const onSubmit = (formData: FormData) => {
      const title = formData.get("title") as string;
      const listId = formData.get("listId") as string;
      const boardId = params.boardId as string;

      execute({ title, listId, boardId });
    };
    if (isEditing) {
      return (
        <form
          ref={formRef}
          action={onSubmit}
          className='m-1 py-0.5 px-1 sapce-y-4'
        >
          <FormTextArea
            id='title'
            onKeyDown={onTextAreaKeyDown}
            ref={ref}
            placeholder='Enter a title for this card'
            errors={fieldErrors}
          />
          <input type='hidden' name='listId' id='listId' value={listId} />
          <div className='flex items-center gap-x-1 mt-3'>
            <FormSubmit>Add card</FormSubmit>
            <Button onClick={disableEditing} size='sm' variant='ghost'>
              <X className='h-5 w-5' />
            </Button>
          </div>
        </form>
      );
    }
    return (
      <div className='pt-2 px-2'>
        <Button
          onClick={enableEditing}
          className='h-auto px-2 py-1.5 w-full justify-start text-muted-foreground text-sm'
          size='sm'
          variant='ghost'
        >
          <Plus className='h-4 w-4 mr-2' />
          Add a card
        </Button>
      </div>
    );
  }
);

CardForm.displayName = "CardForm";

export default CardForm;
