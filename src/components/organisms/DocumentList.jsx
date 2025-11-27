import { FileText, Download, Trash2, FileCheck } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import Button from '../atoms/Button';
import Badge from '../atoms/Badge';
import ConfirmDialog from '../ui/ConfirmDialog';
import useConfirm from '../../hooks/useConfirm';
import storageService from '../../services/storageService';
import showToast from '../../lib/toast';

const DocumentList = ({ documents, onDocumentDeleted }) => {
  const { confirm, confirmState, handleConfirm, handleCancel } = useConfirm();
  const formatFileSize = (bytes) => {
    if (!bytes) return '0 KB';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'dd MMM yyyy à HH:mm', { locale: fr });
    } catch {
      return dateString;
    }
  };

  const getFileIcon = (mimeType) => {
    if (mimeType?.includes('pdf')) {
      return <FileText className="h-8 w-8 text-red-500" />;
    }
    return <FileCheck className="h-8 w-8 text-blue-500" />;
  };

  const handleDownload = async (document) => {
    try {
      const { data, error } = await storageService.downloadFile(document.file_path);

      if (error) {
        showToast.error('Erreur lors du téléchargement');
        return;
      }

      // Créer un lien de téléchargement
      const url = window.URL.createObjectURL(data);
      const a = window.document.createElement('a');
      a.href = url;
      a.download = document.name;
      window.document.body.appendChild(a);
      a.click();
      window.document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      showToast.success('Téléchargement réussi');
    } catch {
      showToast.error('Erreur lors du téléchargement');
    }
  };

  const handleDelete = async (document) => {
    const confirmed = await confirm({
      title: 'Supprimer le document',
      message: `Êtes-vous sûr de vouloir supprimer "${document.name}" ? Cette action est irréversible.`,
      confirmText: 'Supprimer',
      cancelText: 'Annuler',
      variant: 'danger',
    });

    if (!confirmed) return;

    try {
      const { error } = await storageService.deleteDocument(
        document.id,
        document.file_path
      );

      if (error) {
        showToast.error('Erreur lors de la suppression');
        return;
      }

      showToast.success('Document supprimé');
      onDocumentDeleted();
    } catch {
      showToast.error('Erreur lors de la suppression');
    }
  };

  if (!documents || documents.length === 0) {
    return (
      <div className="text-center py-8">
        <FileText className="mx-auto h-12 w-12 text-gray-300 mb-3" />
        <p className="text-gray-500 text-sm">Aucun document uploadé</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {documents.map((document) => (
        <div
          key={document.id}
          className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          {/* Icône */}
          <div className="flex-shrink-0">
            {getFileIcon(document.mime_type)}
          </div>

          {/* Informations */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h4 className="text-sm font-medium text-gray-900 truncate">
                {document.name}
              </h4>
              <Badge variant="default" size="sm">
                {document.type}
              </Badge>
            </div>

            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span>{formatFileSize(document.file_size)}</span>
              <span>•</span>
              <span>{formatDate(document.uploaded_at)}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDownload(document)}
              title="Télécharger"
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(document)}
              className="text-red-600 hover:bg-red-50"
              title="Supprimer"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}

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

export default DocumentList;
