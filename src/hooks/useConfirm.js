import { useState, useCallback } from 'react';

/**
 * Hook personnalisé pour gérer les dialogues de confirmation
 * Remplace window.confirm() avec un design cohérent
 */
export const useConfirm = () => {
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirmer',
    cancelText: 'Annuler',
    variant: 'danger',
    onConfirmCallback: null,
  });

  const confirm = useCallback(
    ({
      title = 'Confirmer l\'action',
      message = 'Êtes-vous sûr de vouloir continuer ?',
      confirmText = 'Confirmer',
      cancelText = 'Annuler',
      variant = 'danger',
    } = {}) => {
      return new Promise((resolve) => {
        setConfirmState({
          isOpen: true,
          title,
          message,
          confirmText,
          cancelText,
          variant,
          onConfirmCallback: resolve,
        });
      });
    },
    []
  );

  const handleConfirm = useCallback(() => {
    if (confirmState.onConfirmCallback) {
      confirmState.onConfirmCallback(true);
    }
    setConfirmState((prev) => ({ ...prev, isOpen: false }));
  }, [confirmState]);

  const handleCancel = useCallback(() => {
    if (confirmState.onConfirmCallback) {
      confirmState.onConfirmCallback(false);
    }
    setConfirmState((prev) => ({ ...prev, isOpen: false }));
  }, [confirmState]);

  return {
    confirm,
    confirmState,
    handleConfirm,
    handleCancel,
  };
};

export default useConfirm;
