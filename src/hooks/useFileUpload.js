import { useState } from 'react';
import storageService from '../services/storageService';
import showToast from '../lib/toast';

export const useFileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadFile = async (userId, jobId, file, documentType = 'Autre') => {
    setUploading(true);
    setProgress(0);

    try {
      // Simuler la progression (Supabase ne fournit pas de progression native)
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const { data, error } = await storageService.uploadFile(
        userId,
        jobId,
        file,
        documentType
      );

      clearInterval(progressInterval);
      setProgress(100);

      if (error) {
        showToast.error(error.message || 'Erreur lors de l\'upload');
        return { data: null, error };
      }

      showToast.success('Fichier uploadé avec succès');
      return { data, error: null };
    } catch (error) {
      showToast.error('Erreur lors de l\'upload');
      return { data: null, error };
    } finally {
      setTimeout(() => {
        setUploading(false);
        setProgress(0);
      }, 500);
    }
  };

  return {
    uploadFile,
    uploading,
    progress,
  };
};

export default useFileUpload;
