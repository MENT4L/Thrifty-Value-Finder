export const fileToBase64 = (file: File): Promise<{ base64: string, mimeType: string }> => {
  return new Promise((resolve, reject) => {
    if (file.type.startsWith('video/')) {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.src = URL.createObjectURL(file);
      
      video.onloadeddata = () => {
        // Seek to 1 second to get a representative frame
        video.currentTime = 1;
      };

      video.onseeked = () => {
        URL.revokeObjectURL(video.src); // Clean up object URL
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('Could not get canvas context'));
        }
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        const base64 = dataUrl.split(',')[1];
        resolve({ base64, mimeType: 'image/jpeg' });
      };

      video.onerror = (e) => {
        reject(new Error('Failed to load video frame.'));
      };
    } else if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        resolve({ base64, mimeType: file.type });
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    } else {
        reject(new Error('Unsupported file type'));
    }
  });
};
