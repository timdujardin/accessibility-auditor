'use client';

import type { FC } from 'react';

import { useCallback, useState } from 'react';

import type { ScreenshotUploaderProps } from './screenshot-uploader.types';

import Button from '@/components/atoms/button/Button';
import IconButton from '@/components/atoms/icon-button/IconButton';
import Icon from '@/components/atoms/icon/Icon';
import { ImageGallery, ImageGalleryItem, ImageGalleryItemBar } from '@/components/atoms/image-gallery/ImageGallery';
import Text from '@/components/atoms/text/Text';
import Wrapper from '@/components/atoms/wrapper/Wrapper';

import { handleDrop, handleFileSelect, handlePaste } from './screenshot-uploader.callbacks';

const ScreenshotUploader: FC<ScreenshotUploaderProps> = ({
  findingId: _findingId,
  existingScreenshots,
  onUpload,
  onDelete,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const onFileSelect = useCallback(
    (files: FileList | null) => handleFileSelect(files, setIsProcessing, onUpload),
    [onUpload],
  );

  const onDrop = useCallback((e: React.DragEvent) => handleDrop(e, onFileSelect), [onFileSelect]);

  const onPaste = useCallback((e: React.ClipboardEvent) => handlePaste(e, onFileSelect), [onFileSelect]);

  return (
    <Wrapper onPaste={onPaste}>
      {existingScreenshots.length > 0 && (
        <ImageGallery cols={3} rowHeight={120} gap={8} sx={{ marginBlockEnd: 1 }}>
          {existingScreenshots.map((ss) => (
            <ImageGalleryItem key={ss.id}>
              {/* eslint-disable-next-line @next/next/no-img-element -- data URL or external storage URL */}
              <img
                src={ss.storagePath}
                alt={ss.altText}
                loading="lazy"
                style={{ objectFit: 'cover', blockSize: '100%', inlineSize: '100%' }}
              />
              {onDelete ? (
                <ImageGalleryItemBar
                  position="top"
                  actionIcon={
                    <IconButton
                      size="small"
                      sx={{ color: 'white' }}
                      onClick={() => onDelete(ss.id)}
                      aria-label={`Delete screenshot ${ss.altText}`}
                    >
                      <Icon name="Delete" fontSize="small" />
                    </IconButton>
                  }
                  sx={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.4) 0%, transparent 100%)' }}
                />
              ) : null}
            </ImageGalleryItem>
          ))}
        </ImageGallery>
      )}

      <Wrapper
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
        sx={{
          border: '2px dashed',
          borderColor: 'divider',
          borderRadius: 1,
          padding: 2,
          textAlign: 'center',
          cursor: 'pointer',
          '&:hover': { borderColor: 'primary.main', backgroundColor: 'action.hover' },
        }}
      >
        <Icon name="CloudUpload" color="action" sx={{ fontSize: 32 }} />
        <Text variant="body2" color="text.secondary">
          Drag & drop, paste, or click to upload screenshots
        </Text>
        <Button component="label" size="small" sx={{ marginBlockStart: 1 }} disabled={isProcessing}>
          {isProcessing ? 'Processing...' : 'Browse Files'}
          <input type="file" hidden multiple accept="image/*" onChange={(e) => onFileSelect(e.target.files)} />
        </Button>
      </Wrapper>
    </Wrapper>
  );
};

export default ScreenshotUploader;
