import React, { useState, ChangeEvent, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { commons } from "app/i18n/types";

interface Props {
  image?: string;
  onImageUpload: (files: File | null) => void;
}

const ImageUploader = (props: Props) => {
  const { image, onImageUpload: onImage } = props;

  const { t } = useTranslation();

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageExists, setImageExists] = useState<boolean>(false);

  useEffect(() => {
    setImagePreview(image ?? null);
    checkImageExists(image ?? "");
  }, [image]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setImageExists(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClick = () => {
    document.getElementById("fileInput")?.click();
  };

  const checkImageExists = (url: string) => {
    if (!url) {
      setImageExists(false);
      return;
    }
    fetch(url)
      .then((response) => {
        setImageExists(response.ok);
      })
      .catch(() => {
        setImageExists(false);
      });
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Typography variant="h6" gutterBottom>
        {t(commons.UPLOAD_IMAGE)}
      </Typography>

      <Box
        onClick={handleClick}
        sx={{
          width: 200,
          height: 200,
          border: "2px dashed #ccc",
          borderRadius: "8px",
          overflow: "hidden",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundImage: imagePreview ? `url(${imagePreview})` : "none",
        }}
      >
        {!imageExists && (
          <Typography variant="body2" color="textSecondary">
            {t(commons.CLIC_TO_UPLOAD_IMAGE)}
          </Typography>
        )}
      </Box>

      <input
        type="file"
        id="fileInput"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleImageChange}
      />
    </Box>
  );
};

export default ImageUploader;
