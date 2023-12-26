"use client";

import { Copy, TrashIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "sonner";

import { CardWithList } from "@/type";
import { useAction } from "@/hooks/useAction";
import { copyCard } from "@/actions/copy-card";
import { deleteCard } from "@/actions/delete-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCardModal } from "@/hooks/useCardModal";

interface ActionsProps {
  data: CardWithList;
}

export const Actions = ({ data }: ActionsProps) => {
  const params = useParams();
  const cardModal = useCardModal();

  const { execute: executeCopyCard, isLoading: isLoadingCopyCard } = useAction(
    copyCard,
    {
      onSuccess: (data) => {
        toast.success(`Card "${data.title}" copied`);
        cardModal.onClose();
      },
      onError: (error) => {
        toast.error(error);
      },
    }
  );
  const { execute: executeDeleteCard, isLoading: isLoadingDeleteCard } =
    useAction(deleteCard, {
      onSuccess: (data) => {
        toast.success(`Card "${data.title}" deleted`);
        cardModal.onClose();
      },
      onError: (error) => {
        toast.error(error);
      },
    });

  const onCopy = () => {
    const boardId = params.boardId as string;

    executeCopyCard({
      id: data.id,
      boardId,
    });
  };
  const onDelete = () => {
    const boardId = params.boardId as string;

    executeDeleteCard({
      id: data.id,
      boardId,
    });
  };

  return (
    <div className='space-y-2 mt-2'>
      <p className='text-xs font-semibold'>Actions</p>
      <Button
        onClick={onCopy}
        disabled={isLoadingCopyCard}
        variant='gray'
        className='w-full justify-start'
        size='inline'
      >
        <Copy className='h-4 w-4 mr-2' />
        Copy
      </Button>
      <Button
        onClick={onDelete}
        disabled={isLoadingDeleteCard}
        variant='gray'
        className='w-full justify-start'
        size='inline'
      >
        <TrashIcon className='h-4 w-4 mr-2' />
        Delete
      </Button>
    </div>
  );
};

Actions.Skeleton = function ActionsSkeleton() {
  return (
    <div className='space-y-2 mt-2'>
      <Skeleton className='w-20 h-4 bg-neutral-200' />
      <Skeleton className='w-full h-8 bg-neutral-200' />
      <Skeleton className='w-full h-8 bg-neutral-200' />
    </div>
  );
};
