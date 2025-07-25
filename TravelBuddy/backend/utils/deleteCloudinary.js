
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const deleteFromCloudinaryByUrl = async (
  cloudinaryUrl,
  resourceType = "image"
) => {
  try {
    if (!cloudinaryUrl) {
      console.error("No Cloudinary URL provided");
      return { success: false, error: "No URL provided" };
    }

    // Extract public ID from Cloudinary URL
    const extractPublicIdFromUrl = (url) => {
      try {
        // Extract public ID from URL like: https://res.cloudinary.com/cloud_name/image/upload/v1234567890/uber/filename.jpg
        const urlParts = url.split("/");
        const uploadIndex = urlParts.indexOf("upload");

        if (uploadIndex === -1) {
          throw new Error("Invalid Cloudinary URL format");
        }

        // Get everything after 'upload' and version (if present)
        let publicIdParts = urlParts.slice(uploadIndex + 1);

        // Remove version if present (starts with 'v' followed by numbers)
        if (publicIdParts[0] && /^v\d+$/.test(publicIdParts[0])) {
          publicIdParts = publicIdParts.slice(1);
        }

        // Join the remaining parts and remove file extension
        const publicId = publicIdParts.join("/").replace(/\.[^/.]+$/, "");

        return publicId;
      } catch (error) {
        console.error("Error extracting public ID from URL:", error);
        return null;
      }
    };

    const publicId = extractPublicIdFromUrl(cloudinaryUrl);

    if (!publicId) {
      console.error("Could not extract public ID from URL:", cloudinaryUrl);
      return { success: false, error: "Invalid URL format" };
    }

    console.log("Attempting to delete file with public ID:", publicId);

    // Delete the file from Cloudinary
    const response = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });

    if (response.result === "ok") {
      console.log("File deleted successfully from Cloudinary:", publicId);
      return {
        success: true,
        result: response.result,
        publicId: publicId,
        url: cloudinaryUrl,
      };
    } else {
      console.log(
        "File deletion result:",
        response.result,
        "for public ID:",
        publicId
      );
      return {
        success: false,
        result: response.result,
        publicId: publicId,
        url: cloudinaryUrl,
      };
    }
  } catch (error) {
    console.error("Error deleting file from Cloudinary:", error);
    return {
      success: false,
      error: error.message,
      url: cloudinaryUrl,
    };
  }
};

export default deleteFromCloudinaryByUrl;
