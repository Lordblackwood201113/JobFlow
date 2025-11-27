import { useState, useRef } from 'react';
import { Camera, Trash2 } from 'lucide-react';
import Avatar from '../atoms/Avatar';
import Button from '../atoms/Button';
import ConfirmDialog from '../ui/ConfirmDialog';
import useConfirm from '../../hooks/useConfirm';
import profileService from '../../services/profileService';
import showToast from '../../lib/toast';

const AvatarUpload = ({ currentAvatar, userId, onAvatarUpdated }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const inputRef = useRef(null);
  const { confirm, confirmState, handleConfirm, handleCancel } = useConfirm();

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Créer une prévisualisation
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload
    setUploading(true);
    try {
      const { data, error } = await profileService.uploadAvatar(userId, file);

      if (error) {
        showToast.error(error.message || 'Erreur lors de l\'upload');
        setPreview(null);
      } else {
        showToast.success('Avatar mis à jour');
        if (onAvatarUpdated) {
          onAvatarUpdated(data);
        }
      }
    } catch {
      showToast.error('Erreur lors de l\'upload');
      setPreview(null);
    } finally {
      setUploading(false);
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  };

  const handleDelete = async () => {
    const confirmed = await confirm({
      title: 'Supprimer l\'avatar',
      message: 'Êtes-vous sûr de vouloir supprimer votre avatar ?',
      confirmText: 'Supprimer',
      cancelText: 'Annuler',
      variant: 'warning',
    });

    if (!confirmed) return;

    setUploading(true);
    try {
      const { error } = await profileService.deleteAvatar(userId);

      if (error) {
        showToast.error('Erreur lors de la suppression');
      } else {
        showToast.success('Avatar supprimé');
        setPreview(null);
        if (onAvatarUpdated) {
          onAvatarUpdated({ avatar_url: null });
        }
      }
    } catch {
      showToast.error('Erreur lors de la suppression');
    } finally {
      setUploading(false);
    }
  };

  const displayAvatar = preview || currentAvatar;

  return (
    <div className="flex flex-col items-center gap-4">
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileSelect}
        disabled={uploading}
      />

      <div className="relative">
        <Avatar src={displayAvatar} size="2xl" />

        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
            <div className="h-6 w-6 animate-spin rounded-full border-4 border-solid border-white border-r-transparent"></div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          <Camera className="h-4 w-4 mr-1" />
          {currentAvatar ? 'Changer' : 'Ajouter'}
        </Button>

        {currentAvatar && !uploading && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="text-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Supprimer
          </Button>
        )}
      </div>

      <p className="text-xs text-gray-500 text-center">
        JPG, PNG ou WEBP (max 2MB)
      </p>

      {/* Dialogue de confirmation */}
      <ConfirmDialog
        isOpen={confirmState.isOpen}
        onClose={handleCancel}
        onConfirm={handleConfirm}
        title={confirmState.title}
        message={confirmState.message}
        confirmText={confirmState.confirmText}
        cancelText={confirmState.cancelText}
        variant={confirmState.variant}
      />
    </div>
  );
};

export default AvatarUpload;
