"use client";

import { useState } from "react";
import Image from "next/image";

export default function Home() {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [modalImage, setModalImage] = useState<string | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setSelectedImage(dataUrl);
        setUploadedImages((prev) => [...prev, dataUrl]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = (imageUrl: string) => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = "downloaded-image.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFullScreen = (imageUrl: string) => {
    setModalImage(imageUrl);
  };

  const closeModal = () => {
    setModalImage(null);
  };

  return (
    <div className="flex min-h-screen p-8">
      <div className="w-1/2 pr-4">
        <h1 className="text-2xl font-bold mb-4">Image Uploader</h1>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="mb-4"
        />
        {selectedImage && (
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Selected Image</h2>
            <div className="relative h-40 w-40">
              <Image
                src={selectedImage}
                alt="Selected image"
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </div>
          </div>
        )}
        <p className="text-sm text-gray-600 mt-2">
          Upload your photo to see it displayed on the right.
        </p>
      </div>
      <div className="w-1/2 pl-4 border-l">
        <h2 className="text-xl font-semibold mb-4">Uploaded Photos</h2>
        <div className="grid grid-cols-2 gap-4">
          {uploadedImages.map((image, index) => (
            <div key={index} className="space-y-2">
              <div className="relative h-40">
                <Image
                  src={image}
                  alt={`Uploaded image ${index + 1}`}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                />
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleDownload(image)}
                  className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
                >
                  Download
                </button>
                <button
                  onClick={() => handleFullScreen(image)}
                  className="bg-green-500 text-white px-2 py-1 rounded text-sm"
                >
                  Full Screen
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {modalImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div className="max-w-4xl max-h-4xl">
            <Image
              src={modalImage}
              alt="Full screen image"
              layout="responsive"
              width={800}
              height={600}
              objectFit="contain"
              className="rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}
