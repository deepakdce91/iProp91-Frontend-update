import { S3Client } from '@aws-sdk/client-s3';
import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Creating the S3 client instance using Supabase's storage endpoint
const client = new S3Client({
  forcePathStyle: true, // Required for Supabase S3 compatibility
  region: 'us-east-1', 
  endpoint: process.env.REACT_APP_SUPABASE_ENDPOINT,
  credentials: {
    accessKeyId: process.env.REACT_APP_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_S3_SECRET_ACCESS_KEY, }
});

const uploadFileToCloud = async (myFile,userphone) => {
  // remove spaces from file name
  let filename = myFile.name.replace(/\s/g, '');

  const userNumber = userphone;
  const myPath = `propertyDocs/${userNumber}/${filename}`;
  try {
    const uploadParams = {
      Bucket: process.env.REACT_APP_PROPERTY_BUCKET,
      Key: myPath,
      Body: myFile, // The file content
      ContentType: myFile.type, // The MIME type of the file
    };
    // console.log("Uploading file:", myFile.name);
    const command = new PutObjectCommand(uploadParams);
    await client.send(command);
    return myPath; //  return the file path
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

const getSignedUrlForPrivateFile = async(path) => {
  try {
    const getParams = {
      Bucket: process.env.REACT_APP_PROPERTY_BUCKET, 
      Key: path, 
    };

    const command = new GetObjectCommand(getParams);
    const signedUrl = await getSignedUrl(client, command, { expiresIn: 3600 }); // URL valid for 1 hour

    console.log('Signed URL:', signedUrl);
    return signedUrl;
  } catch (error) {
    console.error('Error getting signed URL:', error);
    throw error;
  }
};


export { client, uploadFileToCloud, getSignedUrlForPrivateFile };

