import React from 'react';
import Image from 'next/image';
import { Card, CardContent, CardFooter } from '@/components/ui';
import { Button } from '@/components/ui';
import { MemeCardProps } from '@/types';
import { formatDate } from '@/lib/utils';

export const MemeCard: React.FC<MemeCardProps> = ({ meme, onEdit, onDelete }) => {
  return (
    <Card className="overflow-hidden hover:shadow-xl transition-shadow">
      <CardContent className="p-0">
        <div className="relative">
          <Image
            src={meme.image_url}
            alt="Meme"
            width={400}
            height={400}
            className="w-full h-auto object-cover"
            priority
          />
          {meme.top_text && (
            <div className="absolute top-2 left-2 right-2 text-center">
              <p className="text-white text-2xl font-bold drop-shadow-lg">
                {meme.top_text}
              </p>
            </div>
          )}
          {meme.bottom_text && (
            <div className="absolute bottom-2 left-2 right-2 text-center">
              <p className="text-white text-2xl font-bold drop-shadow-lg">
                {meme.bottom_text}
              </p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {formatDate(meme.created_at)}
        </div>
        <div className="flex gap-2">
          {onEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(meme)}
            >
              Edit
            </Button>
          )}
          {onDelete && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(meme.id)}
              className="text-red-600 hover:text-red-700"
            >
              Delete
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}; 