import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import sharp from "sharp";

const S3 = new S3Client();
const DEST_BUCKET = process.env.DEST_BUCKET; // Destination bucket for processed images
const THUMBNAIL_WIDTH = 200; // Resize width in pixels
const SUPPORTED_FORMATS = {
  jpg: true,
  jpeg: true,
  png: true,
};

export const handler = async (event) => {
  const { eventTime, s3 } = event.Records[0];
  const srcBucket = s3.bucket.name;

  // Object key may have spaces or unicode non-ASCII characters
  const srcKey = decodeURIComponent(s3.object.key.replace(/\+/g, " "));
  const ext = srcKey.replace(/^.*\./, "").toLowerCase();

  console.log(`${eventTime} - Processing ${srcBucket}/${srcKey}`);

  if (!SUPPORTED_FORMATS[ext]) {
    console.log(`ERROR: Unsupported file type (${ext})`);
    return { statusCode: 400, body: "Unsupported file type" };
  }

  try {
    // Get the image from the source bucket
    const { Body, ContentType } = await S3.send(
      new GetObjectCommand({
        Bucket: srcBucket,
        Key: srcKey,
      })
    );
    const image = await Body.transformToByteArray();

    // Resize the image
    const outputBuffer = await sharp(image).resize(THUMBNAIL_WIDTH).toBuffer();

    // Define the key for the processed image
    const destKey = `processed-${srcKey}`;

    // Store new image in the destination bucket
    await S3.send(
      new PutObjectCommand({
        Bucket: DEST_BUCKET,
        Key: destKey,
        Body: outputBuffer,
        ContentType,
        ACL: "public-read", // Ensure the object is publicly accessible
      })
    );

    const message = `Successfully resized ${srcBucket}/${srcKey} and uploaded to ${DEST_BUCKET}/${destKey}`;
    console.log(message);

    return {
      statusCode: 200,
      body: JSON.stringify({
        processedKey: destKey, // Return the processed image key
      }),
    };
  } catch (error) {
    console.log(error);
    return { statusCode: 500, body: "Internal server error" };
  }
};
