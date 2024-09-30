import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import sharp from "sharp";

const S3 = new S3Client();
const DEST_BUCKET = process.env.DEST_BUCKET;
const THUMBNAIL_WIDTH = 200; // px
const SUPPORTED_FORMATS = {
  jpg: true,
  jpeg: true,
  png: true,
};

export const handler = async (event, context) => {
  const { eventTime, s3 } = event.Records[0];
  const srcBucket = s3.bucket.name;
  const srcKey = decodeURIComponent(s3.object.key.replace(/\+/g, " "));
  const ext = srcKey.replace(/^.*\./, "").toLowerCase();

  console.log(`${eventTime} - ${srcBucket}/${srcKey}`);

  if (!SUPPORTED_FORMATS[ext]) {
    console.log(`ERROR: Unsupported file type (${ext})`);
    return;
  }

  const action = event.Records[0].eventName || 'resize';  // Default action is 'resize'

  // Get the image from the source bucket
  try {
    const { Body, ContentType } = await S3.send(
      new GetObjectCommand({
        Bucket: srcBucket,
        Key: srcKey,
      })
    );
    const image = await Body.transformToByteArray();

    // Apply transformation based on action
    let outputBuffer;
    if (action === 'resize') {
      outputBuffer = await sharp(image).resize(THUMBNAIL_WIDTH).toBuffer();
    } else if (action === 'greyscale') {
      outputBuffer = await sharp(image).greyscale().toBuffer();
    } else if (action === 'blur') {
      outputBuffer = await sharp(image).blur(10).toBuffer();  // Gaussian blur with strength 10
    } else {
      console.log(`ERROR: Unsupported action (${action})`);
      return;
    }

    // Store new image in the destination bucket
    await S3.send(
      new PutObjectCommand({
        Bucket: DEST_BUCKET,
        Key: srcKey,
        Body: outputBuffer,
        ContentType,
      })
    );

    const message = `Successfully processed ${srcBucket}/${srcKey} with action ${action} and uploaded to ${DEST_BUCKET}/${srcKey}`;
    console.log(message);
    return {
      statusCode: 200,
      body: message,
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error processing image', error: error.message }),
    };
  }
};
