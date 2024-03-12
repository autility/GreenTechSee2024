'use client';
import React, { useState } from "react";

export default function Home() {
  const [imageSrc, setImageSrc] = useState("");

  const displayImage = (event: any) => {
    const file = event.target.files[0];
    const reader: FileReader = new FileReader();

    reader.onload = function () {
      if (reader.result) {
        setImageSrc(reader.result as any);
      }
    };

    reader.readAsDataURL(file);
  };

  const handleImageClick = (event: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    const coordinates = [event.clientX, event.clientY];
    fetch('http://127.0.0.1:5000/coordinates', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ coordinates }),
  });
  };

  return (
    <>
      <head>
        <title>Hello OpenCV.js</title>
      </head>
      <body>
        <main className="flex min-h-screen flex-col">
          <h2>Img uploader</h2>
          <input type="file" onChange={displayImage} />
          {imageSrc && <img src={imageSrc} onClick={handleImageClick} />}
        </main>
      </body>
    </>
  );
}