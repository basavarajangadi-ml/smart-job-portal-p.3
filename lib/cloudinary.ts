export async function uploadPdfToCloudinary(
  fileBuffer: Buffer,
  fileName: string
): Promise<{ secure_url: string; public_id: string }> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  // If Cloudinary credentials are configured, upload to Cloudinary
  if (cloudName && apiKey && apiSecret) {
    try {
      const crypto = await import('crypto');
      const timestamp = Math.round(new Date().getTime() / 1000);
      const folder = 'smarthire_resumes';
      const cleanFileName = fileName.replace(/[^a-zA-Z0-9_-]/g, '_');
      const publicId = `${folder}/${Date.now()}_${cleanFileName}`;

      const paramsToSign = `folder=${folder}&public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
      const signature = crypto.createHash('sha1').update(paramsToSign).digest('hex');

      const formData = new FormData();
      const blob = new Blob([new Uint8Array(fileBuffer)], { type: 'application/pdf' });
      formData.append('file', blob, fileName);
      formData.append('api_key', apiKey);
      formData.append('timestamp', timestamp.toString());
      formData.append('signature', signature);
      formData.append('folder', folder);
      formData.append('public_id', publicId);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`, {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        return {
          secure_url: data.secure_url,
          public_id: data.public_id,
        };
      } else {
        const errText = await res.text();
        console.warn('Cloudinary upload warning, falling back to data URI:', errText);
      }
    } catch (err: any) {
      console.warn('Cloudinary upload exception, using fallback:', err.message);
    }
  }

  // Graceful fallback for local dev or when Cloudinary is not yet configured:
  // Convert PDF buffer to Base64 Data URL so the resume can be viewed and downloaded directly in the browser!
  const base64Data = fileBuffer.toString('base64');
  const dataUri = `data:application/pdf;base64,${base64Data}`;
  return {
    secure_url: dataUri,
    public_id: `local_${Date.now()}`,
  };
}
