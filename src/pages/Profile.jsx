import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Key, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import profileService from '../services/profileService';
import useConfirm from '../hooks/useConfirm';
import Button from '../components/atoms/Button';
import Input from '../components/atoms/Input';
import Textarea from '../components/atoms/Textarea';
import Card from '../components/ui/Card';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import AvatarUpload from '../components/molecules/AvatarUpload';
import showToast from '../lib/toast';

const Profile = () => {
  const navigate = useNavigate();
  const { user, profile, refreshProfile, signOut } = useAuth();
  const { confirm, confirmState, handleConfirm, handleCancel } = useConfirm();

  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    current_position: '',
    location: '',
    bio: '',
  });

  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showPasswordSection, setShowPasswordSection] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        current_position: profile.current_position || '',
        location: profile.location || '',
        bio: profile.bio || '',
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const { error } = await profileService.updateProfile(user.id, formData);

      if (error) {
        showToast.error('Erreur lors de la sauvegarde');
      } else {
        showToast.success('Profil mis à jour');
        await refreshProfile();
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword.length < 6) {
      showToast.error('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast.error('Les mots de passe ne correspondent pas');
      return;
    }

    setIsChangingPassword(true);

    try {
      const { error } = await profileService.updatePassword(passwordData.newPassword);

      if (error) {
        showToast.error(error.message || 'Erreur lors du changement de mot de passe');
      } else {
        showToast.success('Mot de passe modifié avec succès');
        setPasswordData({ newPassword: '', confirmPassword: '' });
        setShowPasswordSection(false);
      }
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleAvatarUpdated = async (updatedProfile) => {
    await refreshProfile();
  };

  const handleSignOut = async () => {
    const confirmed = await confirm({
      title: 'Déconnexion',
      message: 'Êtes-vous sûr de vouloir vous déconnecter ?',
      confirmText: 'Se déconnecter',
      cancelText: 'Annuler',
      variant: 'danger',
    });

    if (confirmed) {
      await signOut();
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-[#DBEAFE]">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Retour au tableau de bord
          </Button>

          <h1 className="text-3xl font-bold text-gray-900">Mon Profil</h1>
          <p className="text-gray-700 mt-1">
            Gérez vos informations personnelles et vos paramètres
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Colonne latérale - Avatar */}
          <div className="lg:col-span-1">
            <Card className="text-center">
              <AvatarUpload
                currentAvatar={profile?.avatar_url}
                userId={user?.id}
                onAvatarUpdated={handleAvatarUpdated}
              />

              <div className="mt-4 pt-4 border-t">
                <p className="text-sm font-medium text-gray-900">
                  {profile?.full_name || 'Nom non renseigné'}
                </p>
                <p className="text-sm text-gray-500 mt-1">{user?.email}</p>
              </div>
            </Card>
          </div>

          {/* Colonne principale - Formulaires */}
          <div className="lg:col-span-2 space-y-6">
            {/* Informations personnelles */}
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Informations personnelles
              </h2>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <Input
                  label="Nom complet"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="Jean Dupont"
                />

                <Input
                  label="Téléphone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+33 6 12 34 56 78"
                />

                <Input
                  label="Poste actuel"
                  name="current_position"
                  value={formData.current_position}
                  onChange={handleChange}
                  placeholder="Développeur Full Stack"
                />

                <Input
                  label="Localisation"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Paris, France"
                />

                <Textarea
                  label="Biographie"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Parlez-nous de vous, de votre parcours et de vos objectifs professionnels..."
                />

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isSaving}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
                  </Button>
                </div>
              </form>
            </Card>

            {/* Sécurité */}
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Sécurité
              </h2>

              {!showPasswordSection ? (
                <div>
                  <p className="text-gray-600 mb-4">
                    Gérez votre mot de passe et la sécurité de votre compte
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setShowPasswordSection(true)}
                  >
                    <Key className="h-4 w-4 mr-2" />
                    Changer le mot de passe
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <Input
                    label="Nouveau mot de passe"
                    name="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="••••••••"
                    helperText="Au moins 6 caractères"
                    required
                  />

                  <Input
                    label="Confirmer le mot de passe"
                    name="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="••••••••"
                    required
                  />

                  <div className="flex items-center gap-2">
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={isChangingPassword}
                    >
                      {isChangingPassword
                        ? 'Modification...'
                        : 'Modifier le mot de passe'}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        setShowPasswordSection(false);
                        setPasswordData({ newPassword: '', confirmPassword: '' });
                      }}
                      disabled={isChangingPassword}
                    >
                      Annuler
                    </Button>
                  </div>
                </form>
              )}
            </Card>

            {/* Informations du compte */}
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Informations du compte
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Email</span>
                  <span className="font-medium text-gray-900">{user?.email}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">ID Utilisateur</span>
                  <span className="font-mono text-xs text-gray-900">{user?.id}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Membre depuis</span>
                  <span className="font-medium text-gray-900">
                    {new Date(profile?.created_at).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            </Card>

            {/* Déconnexion */}
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Déconnexion
              </h2>

              <p className="text-gray-600 mb-4">
                Déconnectez-vous de votre compte JobFlow
              </p>

              <Button
                variant="outline"
                onClick={handleSignOut}
                className="text-red-600 border-red-600 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Se déconnecter
              </Button>
            </Card>
          </div>
        </div>

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
    </div>
  );
};

export default Profile;
