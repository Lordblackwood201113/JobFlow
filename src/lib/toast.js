import toast from 'react-hot-toast';

/**
 * Wrapper autour de react-hot-toast avec des styles personnalisés
 */

const defaultOptions = {
  duration: 4000,
  style: {
    borderRadius: '12px',
    padding: '12px 16px',
  },
};

export const showToast = {
  success: (message) => {
    toast.success(message, {
      ...defaultOptions,
      iconTheme: {
        primary: '#10B981',
        secondary: '#fff',
      },
    });
  },

  error: (message) => {
    toast.error(message, {
      ...defaultOptions,
      iconTheme: {
        primary: '#EF4444',
        secondary: '#fff',
      },
    });
  },

  loading: (message) => {
    return toast.loading(message, defaultOptions);
  },

  promise: (promise, messages) => {
    return toast.promise(
      promise,
      {
        loading: messages.loading || 'Chargement...',
        success: messages.success || 'Succès !',
        error: messages.error || 'Une erreur est survenue',
      },
      defaultOptions
    );
  },

  dismiss: (toastId) => {
    toast.dismiss(toastId);
  },
};

export default showToast;
