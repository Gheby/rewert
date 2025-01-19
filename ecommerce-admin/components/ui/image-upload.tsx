"use client";

import React, { useEffect, useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { Button } from "./button";
import { ImagePlus, Trash } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (value: string) => void; // Change here: Updates full array
  onRemove: (value: string) => void;
  value: string[]; // List of image URLs
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  disabled,
  onChange,
  onRemove,
  value,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // Avoid rendering during SSR
  }

  const onUpload = (result: any) => {
    const uploadedUrl = result.info.secure_url; // Get secure URL from Cloudinary
    // onChange([uploadedUrl]); // Add new image URL to the list
    onChange(uploadedUrl); // Add new image URL to the list
  };

  return (
    <div>
      <div className="mb-4 flex items-center gap-4">
        {value.map((url) => (
          <div
            key={url}
            className="relative w-[200px] h-[200px] rounded-md overflow-hidden"
          >
            <div className="z-10 absolute top-2 right-2">
              <Button
                type="button"
                onClick={() => onRemove(url)}
                variant="destructive"
                size="icon"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
            <Image
              fill
              className="object-cover"
              alt="Uploaded image"
              src={url} // Dynamically pass uploaded image URL
            />
          </div>
        ))}
      </div>
      <CldUploadWidget
        onSuccess={onUpload} // Pass handler to handle uploaded image
        uploadPreset="rewert" // Replace with your Cloudinary preset
      >
        {({ open }) => (
          <Button
            type="button"
            disabled={disabled}
            variant="secondary"
            onClick={() => open()} // Open the upload widget
          >
            <ImagePlus className="h-4 w-4 mr-2" />
            Upload an Image
          </Button>
        )}
      </CldUploadWidget>
    </div>
  );
};

export default ImageUpload;
