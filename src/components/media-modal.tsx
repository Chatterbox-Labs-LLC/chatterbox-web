'use client';

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { X, Download, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

interface MediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  type: string;
  fileName?: string;
}

export function MediaModal({ isOpen, onClose, url, type, fileName }: MediaModalProps) {
  const isVideo = type.startsWith('video/');
  const isImage = type.startsWith('image/');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 overflow-hidden bg-black/90 border-none shadow-2xl">
        <VisuallyHidden.Root>
          <DialogTitle>{fileName || 'Media Preview'}</DialogTitle>
          <DialogDescription>
            Preview of {isImage ? 'image' : isVideo ? 'video' : 'file'}: {fileName || 'unnamed'}
          </DialogDescription>
        </VisuallyHidden.Root>
        <div className="relative w-full h-full flex flex-col">
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/60 to-transparent">
            <div className="flex flex-col">
              <span className="text-white text-sm font-medium truncate max-w-[200px] md:max-w-md">
                {fileName || 'Media Preview'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={() => window.open(url, '_blank')}
              >
                <Download className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={onClose}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Media Content */}
          <div className="flex-1 flex items-center justify-center min-h-0 bg-black">
            {isImage && (
              <img
                src={url}
                alt={fileName || 'Preview'}
                className="max-w-full max-h-[85vh] object-contain"
              />
            )}
            {isVideo && (
              <video
                src={url}
                controls
                autoPlay
                className="max-w-full max-h-[85vh]"
              />
            )}
            {!isImage && !isVideo && (
              <div className="text-white text-center p-8">
                <p>Preview not available for this file type.</p>
                <Button 
                  variant="secondary" 
                  className="mt-4"
                  onClick={() => window.open(url, '_blank')}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open in New Tab
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
