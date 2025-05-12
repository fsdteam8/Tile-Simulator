// app/api/cloudinary-signature/route.ts
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

interface CloudinarySignatureResponse {
  signature: string;
  timestamp: number;
  apiKey: string | undefined;
  cloudName: string | undefined;
}

interface ErrorResponse {
  message: string;
}

export async function POST(): Promise<Response> {
  try {
    const timestamp: number = Math.round(Date.now() / 1000);
    const signature: string = cloudinary.utils.api_sign_request(
      {
        timestamp,
        folder: 'tile_designs',
      },
      process.env.CLOUDINARY_API_SECRET!
    );

    const responseBody: CloudinarySignatureResponse = {
      signature,
      timestamp,
      apiKey: process.env.CLOUDINARY_API_KEY,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    };

    return Response.json(responseBody);
  } catch (error: unknown) {
    console.error('Signature error:', error);
    const errorResponse: ErrorResponse = { message: 'Signature generation error' };
    return new Response(JSON.stringify(errorResponse), { status: 500 });
  }
}