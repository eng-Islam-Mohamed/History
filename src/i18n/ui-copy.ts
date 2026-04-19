import { Locale } from '@/i18n/config';

const uiCopy = {
  en: {
    auth: {
      account: 'Account',
      closeDialog: 'Close dialog',
      continueToLibrary: 'Continue to your library',
      createAccount: 'Create account',
      email: 'Email address',
      emailVerifiedBadge: 'Verified',
      emailNotVerifiedBadge: 'Unverified',
      emailVerifiedSuccess: 'Your email has been verified successfully. You can now log in.',
      emailVerificationFailed:
        'This verification link is invalid or expired. Request a new verification email and try again.',
      verificationCode: 'Verification code',
      verificationCodePlaceholder: 'Enter the 6-digit code',
      verifyCodeTitle: 'Enter your verification code',
      verifyCodeDescription:
        'We sent a confirmation code to your email. Enter it here to verify your account, then log in manually.',
      verifyCodeSuccess: 'We sent a fresh verification code to your email address.',
      verifyCodeHelp:
        'Use the newest code in your inbox. If the code has expired, request another one below.',
      resendCode: 'Resend code',
      verifyCodeAction: 'Verify code',
      firstName: 'First name',
      firstNamePlaceholder: 'Ada',
      helper: 'Your saved dossiers will be linked to your account and available on any device.',
      lastName: 'Last name',
      lastNamePlaceholder: 'Lovelace',
      loginRequired: 'Please sign in to open your saved research library.',
      password: 'Password',
      signIn: 'Sign in',
      signInDescription: 'Access your personal archive and keep every dossier attached to your account.',
      signInTitle: 'Continue your research archive',
      signOut: 'Sign out',
      signUpDescription: 'Create an account to save searches, reopen dossiers, and keep your research organized.',
      signUpSuccess: 'Check your email to confirm your account before signing in.',
      resendVerification: 'Resend verification email',
      resendingVerification: 'Sending verification email...',
      resendVerificationSuccess: 'A fresh verification email has been sent to {email}.',
      resendVerificationSuccessFallback: 'A fresh verification email has been sent.',
      resendVerificationError: 'We could not resend the verification email right now.',
      verifyEmailRequired: 'Please verify your email address to unlock search and archive access.',
      verifyEmailDescription:
        'Open the verification message in your inbox, click the link, then log in again to continue.',
      openProfile: 'Open profile',
      submitSignIn: 'Open my archive',
      submitSignUp: 'Create my account',
    },
    profile: {
      title: 'Profile settings',
      description:
        'Manage your public identity in the archive, adjust your preferred language, and keep a recognizable portrait for your account.',
      avatarTitle: 'Profile photo',
      avatarDescription:
        'Upload a square portrait in PNG, JPEG, or WebP format.',
      uploadPhoto: 'Upload photo',
      uploadingPhoto: 'Uploading...',
      removePhoto: 'Remove photo',
      email: 'Account email',
      firstName: 'First name',
      firstNamePlaceholder: 'Your given name',
      lastName: 'Last name',
      lastNamePlaceholder: 'Your family name',
      displayName: 'Display name',
      displayNamePlaceholder: 'How your name should appear in the archive',
      preferredLocale: 'Preferred language',
      bio: 'Short bio',
      bioPlaceholder:
        'Tell readers what kind of history, regions, or periods you like to explore.',
      save: 'Save profile',
      saving: 'Saving...',
      saved: 'Profile saved successfully.',
      saveError: 'We could not save your profile right now.',
      uploadError: 'We could not upload your profile photo right now.',
      fileRequirements: 'PNG, JPEG, or WebP up to 2 MB.',
      signedInAs: 'Signed in as',
      openLibrary: 'Open library',
    },
    search: {
      authGateEyebrow: 'Search access',
      authGateTitle: 'Continue with ChronoLivre',
      authGateBody:
        'Create an account or log in to start exploring history with AI.',
      verifyGateEyebrow: 'Verification required',
      verifyGateTitle: 'Verify your email to continue',
      verifyGateBody:
        'Your account exists, but email confirmation is still required before search can continue.',
      saveError: 'This dossier could not be saved right now.',
      savedToLibrary: 'Saved to your library',
      savingToLibrary: 'Saving to your library...',
      signInToOpen: 'Sign in to preserve and open the full dossier',
      signInToSave: 'Sign in to save this dossier to your library',
    },
  },
  fr: {
    auth: {
      account: 'Compte',
      closeDialog: 'Fermer la fenetre',
      continueToLibrary: 'Continuer vers votre bibliotheque',
      createAccount: 'Creer un compte',
      email: 'Adresse email',
      emailVerifiedBadge: 'Verifie',
      emailNotVerifiedBadge: 'Non verifie',
      emailVerifiedSuccess: 'Votre email a ete verifie avec succes. Vous pouvez maintenant vous connecter.',
      emailVerificationFailed:
        'Ce lien de verification est invalide ou expire. Demandez un nouvel email de verification puis reessayez.',
      verificationCode: 'Code de verification',
      verificationCodePlaceholder: 'Entrez le code a 6 chiffres',
      verifyCodeTitle: 'Entrez votre code de verification',
      verifyCodeDescription:
        'Nous avons envoye un code de confirmation a votre email. Entrez-le ici pour verifier votre compte, puis connectez-vous manuellement.',
      verifyCodeSuccess: 'Un nouveau code de verification a ete envoye a votre adresse email.',
      verifyCodeHelp:
        'Utilisez le code le plus recent recu dans votre boite mail. S il a expire, demandez-en un autre ci-dessous.',
      resendCode: 'Renvoyer le code',
      verifyCodeAction: 'Verifier le code',
      firstName: 'Prenom',
      firstNamePlaceholder: 'Ada',
      helper: 'Vos dossiers enregistres seront lies a votre compte et disponibles sur tous vos appareils.',
      lastName: 'Nom',
      lastNamePlaceholder: 'Lovelace',
      loginRequired: 'Connectez-vous pour ouvrir votre bibliotheque de recherche.',
      password: 'Mot de passe',
      signIn: 'Connexion',
      signInDescription: 'Accedez a votre archive personnelle et conservez chaque dossier dans votre compte.',
      signInTitle: 'Retrouvez votre archive de recherche',
      signOut: 'Deconnexion',
      signUpDescription: 'Creez un compte pour sauvegarder vos recherches et rouvrir vos dossiers.',
      signUpSuccess: 'Verifiez votre email pour confirmer votre compte avant de vous connecter.',
      resendVerification: 'Renvoyer l email de verification',
      resendingVerification: 'Envoi de l email de verification...',
      resendVerificationSuccess: 'Un nouvel email de verification a ete envoye a {email}.',
      resendVerificationSuccessFallback: 'Un nouvel email de verification a ete envoye.',
      resendVerificationError: 'Impossible de renvoyer l email de verification pour le moment.',
      verifyEmailRequired: 'Verifiez votre email pour debloquer la recherche et l archive.',
      verifyEmailDescription:
        'Ouvrez le message de verification dans votre boite mail, cliquez sur le lien, puis reconnectez-vous pour continuer.',
      openProfile: 'Ouvrir le profil',
      submitSignIn: 'Ouvrir mon archive',
      submitSignUp: 'Creer mon compte',
    },
    profile: {
      title: 'Parametres du profil',
      description:
        'Modifiez votre identite dans l archive, ajustez votre langue preferee et ajoutez une photo reconnaissable pour votre compte.',
      avatarTitle: 'Photo de profil',
      avatarDescription:
        'Telechargez un portrait carre en PNG, JPEG ou WebP. L image reste privee dans votre espace Supabase.',
      uploadPhoto: 'Telecharger une photo',
      uploadingPhoto: 'Telechargement...',
      removePhoto: 'Supprimer la photo',
      email: 'Email du compte',
      firstName: 'Prenom',
      firstNamePlaceholder: 'Votre prenom',
      lastName: 'Nom',
      lastNamePlaceholder: 'Votre nom de famille',
      displayName: 'Nom affiche',
      displayNamePlaceholder: 'Le nom a afficher dans votre archive',
      preferredLocale: 'Langue preferee',
      bio: 'Courte bio',
      bioPlaceholder:
        'Indiquez les regions, epoques ou themes historiques que vous aimez explorer.',
      save: 'Enregistrer le profil',
      saving: 'Enregistrement...',
      saved: 'Profil enregistre avec succes.',
      saveError: 'Impossible d enregistrer votre profil pour le moment.',
      uploadError: 'Impossible de telecharger votre photo de profil pour le moment.',
      fileRequirements: 'PNG, JPEG ou WebP jusqu a 2 Mo.',
      signedInAs: 'Connecte en tant que',
      openLibrary: 'Ouvrir la bibliotheque',
    },
    search: {
      authGateEyebrow: 'Acces a la recherche',
      authGateTitle: 'Continuer avec ChronoLivre',
      authGateBody:
        'Creez un compte ou connectez-vous pour commencer a explorer l histoire avec l IA.',
      verifyGateEyebrow: 'Verification requise',
      verifyGateTitle: 'Verifiez votre email pour continuer',
      verifyGateBody:
        'Votre compte existe, mais la confirmation de l email reste necessaire avant d utiliser la recherche.',
      saveError: 'Ce dossier ne peut pas etre enregistre pour le moment.',
      savedToLibrary: 'Enregistre dans votre bibliotheque',
      savingToLibrary: 'Enregistrement dans votre bibliotheque...',
      signInToOpen: 'Connectez-vous pour conserver et ouvrir le dossier complet',
      signInToSave: 'Connectez-vous pour enregistrer ce dossier',
    },
  },
  ar: {
    auth: {
      account: '\u0627\u0644\u062d\u0633\u0627\u0628',
      closeDialog:
        '\u0625\u063a\u0644\u0627\u0642 \u0627\u0644\u0646\u0627\u0641\u0630\u0629',
      continueToLibrary:
        '\u0627\u0644\u0645\u062a\u0627\u0628\u0639\u0629 \u0625\u0644\u0649 \u0645\u0643\u062a\u0628\u062a\u0643',
      createAccount:
        '\u0625\u0646\u0634\u0627\u0621 \u062d\u0633\u0627\u0628',
      email:
        '\u0627\u0644\u0628\u0631\u064a\u062f \u0627\u0644\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a',
      emailVerifiedBadge:
        '\u0645\u0648\u062b\u0642',
      emailNotVerifiedBadge:
        '\u063a\u064a\u0631 \u0645\u0648\u062b\u0642',
      emailVerifiedSuccess:
        '\u062a\u0645 \u062a\u062d\u0642\u0642 \u0628\u0631\u064a\u062f\u0643 \u0628\u0646\u062c\u0627\u062d. \u064a\u0645\u0643\u0646\u0643 \u0627\u0644\u0622\u0646 \u062a\u0633\u062c\u064a\u0644 \u0627\u0644\u062f\u062e\u0648\u0644.',
      emailVerificationFailed:
        '\u0631\u0627\u0628\u0637 \u0627\u0644\u062a\u062d\u0642\u0642 \u063a\u064a\u0631 \u0635\u0627\u0644\u062d \u0623\u0648 \u0645\u0646\u062a\u0647\u064a. \u0627\u0637\u0644\u0628 \u0631\u0633\u0627\u0644\u0629 \u062a\u062d\u0642\u0642 \u062c\u062f\u064a\u062f\u0629 \u062b\u0645 \u062d\u0627\u0648\u0644 \u0645\u0631\u0629 \u0623\u062e\u0631\u0649.',
      verificationCode:
        '\u0631\u0645\u0632 \u0627\u0644\u062a\u062d\u0642\u0642',
      verificationCodePlaceholder:
        '\u0623\u062f\u062e\u0644 \u0627\u0644\u0631\u0645\u0632 \u0645\u0646 6 \u0623\u0631\u0642\u0627\u0645',
      verifyCodeTitle:
        '\u0623\u062f\u062e\u0644 \u0631\u0645\u0632 \u0627\u0644\u062a\u062d\u0642\u0642',
      verifyCodeDescription:
        '\u0623\u0631\u0633\u0644\u0646\u0627 \u0631\u0645\u0632 \u062a\u0623\u0643\u064a\u062f \u0625\u0644\u0649 \u0628\u0631\u064a\u062f\u0643. \u0623\u062f\u062e\u0644\u0647 \u0647\u0646\u0627 \u0644\u062a\u062d\u0642\u064a\u0642 \u062d\u0633\u0627\u0628\u0643 \u062b\u0645 \u0633\u062c\u0644 \u0627\u0644\u062f\u062e\u0648\u0644 \u064a\u062f\u0648\u064a\u0627.',
      verifyCodeSuccess:
        '\u062a\u0645 \u0625\u0631\u0633\u0627\u0644 \u0631\u0645\u0632 \u062a\u062d\u0642\u0642 \u062c\u062f\u064a\u062f \u0625\u0644\u0649 \u0628\u0631\u064a\u062f\u0643.',
      verifyCodeHelp:
        '\u0627\u0633\u062a\u062e\u062f\u0645 \u0622\u062e\u0631 \u0631\u0645\u0632 \u0648\u0635\u0644 \u0625\u0644\u0649 \u0628\u0631\u064a\u062f\u0643. \u0625\u0630\u0627 \u0627\u0646\u062a\u0647\u062a \u0635\u0644\u0627\u062d\u064a\u062a\u0647 \u0641\u0627\u0637\u0644\u0628 \u0631\u0645\u0632\u0627 \u062c\u062f\u064a\u062f\u0627 \u0623\u062f\u0646\u0627\u0647.',
      resendCode:
        '\u0625\u0639\u0627\u062f\u0629 \u0625\u0631\u0633\u0627\u0644 \u0627\u0644\u0631\u0645\u0632',
      verifyCodeAction:
        '\u062a\u062d\u0642\u0642 \u0645\u0646 \u0627\u0644\u0631\u0645\u0632',
      firstName:
        '\u0627\u0644\u0627\u0633\u0645',
      firstNamePlaceholder:
        '\u0622\u062f\u0627',
      helper:
        '\u0633\u062a\u0643\u0648\u0646 \u0645\u0644\u0641\u0627\u062a\u0643 \u0627\u0644\u0645\u062d\u0641\u0648\u0638\u0629 \u0645\u0631\u062a\u0628\u0637\u0629 \u0628\u062d\u0633\u0627\u0628\u0643 \u0648\u0645\u062a\u0627\u062d\u0629 \u0639\u0644\u0649 \u0623\u064a \u062c\u0647\u0627\u0632.',
      lastName:
        '\u0627\u0633\u0645 \u0627\u0644\u0639\u0627\u0626\u0644\u0629',
      lastNamePlaceholder:
        '\u0644\u0648\u0641\u0644\u0627\u0633',
      loginRequired:
        '\u0633\u062c\u0644 \u0627\u0644\u062f\u062e\u0648\u0644 \u0644\u0641\u062a\u062d \u0645\u0643\u062a\u0628\u0629 \u0623\u0628\u062d\u0627\u062b\u0643.',
      password:
        '\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631',
      signIn:
        '\u062a\u0633\u062c\u064a\u0644 \u0627\u0644\u062f\u062e\u0648\u0644',
      signInDescription:
        '\u0627\u062f\u062e\u0644 \u0625\u0644\u0649 \u0623\u0631\u0634\u064a\u0641\u0643 \u0627\u0644\u0634\u062e\u0635\u064a \u0648\u0627\u062d\u062a\u0641\u0638 \u0628\u0643\u0644 \u0645\u0644\u0641 \u062f\u0627\u062e\u0644 \u062d\u0633\u0627\u0628\u0643.',
      signInTitle:
        '\u0627\u0644\u0639\u0648\u062f\u0629 \u0625\u0644\u0649 \u0623\u0631\u0634\u064a\u0641 \u0628\u062d\u0648\u062b\u0643',
      signOut:
        '\u062a\u0633\u062c\u064a\u0644 \u0627\u0644\u062e\u0631\u0648\u062c',
      signUpDescription:
        '\u0623\u0646\u0634\u0626 \u062d\u0633\u0627\u0628\u0627 \u0644\u062d\u0641\u0638 \u0623\u0628\u062d\u0627\u062b\u0643 \u0648\u0625\u0639\u0627\u062f\u0629 \u0641\u062a\u062d \u0645\u0644\u0641\u0627\u062a\u0643.',
      signUpSuccess:
        '\u062a\u062d\u0642\u0642 \u0645\u0646 \u0628\u0631\u064a\u062f\u0643 \u0627\u0644\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a \u0644\u062a\u0623\u0643\u064a\u062f \u062d\u0633\u0627\u0628\u0643 \u0642\u0628\u0644 \u062a\u0633\u062c\u064a\u0644 \u0627\u0644\u062f\u062e\u0648\u0644.',
      resendVerification:
        '\u0625\u0639\u0627\u062f\u0629 \u0625\u0631\u0633\u0627\u0644 \u0631\u0633\u0627\u0644\u0629 \u0627\u0644\u062a\u062d\u0642\u0642',
      resendingVerification:
        '\u062c\u0627\u0631\u064d \u0625\u0631\u0633\u0627\u0644 \u0631\u0633\u0627\u0644\u0629 \u0627\u0644\u062a\u062d\u0642\u0642...',
      resendVerificationSuccess:
        '\u062a\u0645 \u0625\u0631\u0633\u0627\u0644 \u0631\u0633\u0627\u0644\u0629 \u062a\u062d\u0642\u0642 \u062c\u062f\u064a\u062f\u0629 \u0625\u0644\u0649 {email}.',
      resendVerificationSuccessFallback:
        '\u062a\u0645 \u0625\u0631\u0633\u0627\u0644 \u0631\u0633\u0627\u0644\u0629 \u062a\u062d\u0642\u0642 \u062c\u062f\u064a\u062f\u0629.',
      resendVerificationError:
        '\u062a\u0639\u0630\u0631 \u0625\u0639\u0627\u062f\u0629 \u0625\u0631\u0633\u0627\u0644 \u0631\u0633\u0627\u0644\u0629 \u0627\u0644\u062a\u062d\u0642\u0642 \u062d\u0627\u0644\u064a\u0627.',
      verifyEmailRequired:
        '\u064a\u0631\u062c\u0649 \u062a\u062d\u0642\u0642 \u0628\u0631\u064a\u062f\u0643 \u0627\u0644\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a \u0644\u0641\u062a\u062d \u0627\u0644\u0628\u062d\u062b \u0648\u0627\u0644\u0623\u0631\u0634\u064a\u0641.',
      verifyEmailDescription:
        '\u0627\u0641\u062a\u062d \u0631\u0633\u0627\u0644\u0629 \u0627\u0644\u062a\u062d\u0642\u0642 \u0641\u064a \u0628\u0631\u064a\u062f\u0643\u060c \u0627\u0636\u063a\u0637 \u0639\u0644\u0649 \u0627\u0644\u0631\u0627\u0628\u0637\u060c \u062b\u0645 \u0633\u062c\u0644 \u0627\u0644\u062f\u062e\u0648\u0644 \u0645\u0646 \u062c\u062f\u064a\u062f \u0644\u0644\u0645\u062a\u0627\u0628\u0639\u0629.',
      openProfile:
        '\u0627\u0641\u062a\u062d \u0627\u0644\u0645\u0644\u0641 \u0627\u0644\u0634\u062e\u0635\u064a',
      submitSignIn:
        '\u0627\u0641\u062a\u062d \u0623\u0631\u0634\u064a\u0641\u064a',
      submitSignUp:
        '\u0623\u0646\u0634\u0626 \u062d\u0633\u0627\u0628\u064a',
    },
    profile: {
      title:
        '\u0625\u0639\u062f\u0627\u062f\u0627\u062a \u0627\u0644\u0645\u0644\u0641 \u0627\u0644\u0634\u062e\u0635\u064a',
      description:
        '\u0627\u062f\u0631 \u0647\u0648\u064a\u062a\u0643 \u0641\u064a \u0627\u0644\u0623\u0631\u0634\u064a\u0641\u060c \u0648\u062d\u062f\u062f \u0644\u063a\u062a\u0643 \u0627\u0644\u0645\u0641\u0636\u0644\u0629\u060c \u0648\u0623\u0636\u0641 \u0635\u0648\u0631\u0629 \u062a\u0639\u0631\u0641 \u0628\u0647\u0627 \u062d\u0633\u0627\u0628\u0643.',
      avatarTitle:
        '\u0635\u0648\u0631\u0629 \u0627\u0644\u0645\u0644\u0641 \u0627\u0644\u0634\u062e\u0635\u064a',
      avatarDescription:
        '\u0627\u0631\u0641\u0639 \u0635\u0648\u0631\u0629 \u0645\u0631\u0628\u0639\u0629 \u0628\u0635\u064a\u063a\u0629 PNG \u0623\u0648 JPEG \u0623\u0648 WebP. \u0633\u062a\u0628\u0642\u0649 \u0627\u0644\u0635\u0648\u0631\u0629 \u062e\u0627\u0635\u0629 \u0641\u064a \u0645\u0633\u0627\u062d\u0629 Supabase \u0627\u0644\u062e\u0627\u0635\u0629 \u0628\u0643.',
      uploadPhoto:
        '\u0631\u0641\u0639 \u0635\u0648\u0631\u0629',
      uploadingPhoto:
        '\u062c\u0627\u0631\u064d \u0627\u0644\u0631\u0641\u0639...',
      removePhoto:
        '\u062d\u0630\u0641 \u0627\u0644\u0635\u0648\u0631\u0629',
      email:
        '\u0628\u0631\u064a\u062f \u0627\u0644\u062d\u0633\u0627\u0628',
      firstName:
        '\u0627\u0644\u0627\u0633\u0645',
      firstNamePlaceholder:
        '\u0627\u0643\u062a\u0628 \u0627\u0633\u0645\u0643',
      lastName:
        '\u0627\u0633\u0645 \u0627\u0644\u0639\u0627\u0626\u0644\u0629',
      lastNamePlaceholder:
        '\u0627\u0643\u062a\u0628 \u0627\u0633\u0645 \u0627\u0644\u0639\u0627\u0626\u0644\u0629',
      displayName:
        '\u0627\u0644\u0627\u0633\u0645 \u0627\u0644\u0645\u0639\u0631\u0648\u0636',
      displayNamePlaceholder:
        '\u0627\u0644\u0627\u0633\u0645 \u0627\u0644\u0630\u064a \u0633\u064a\u0638\u0647\u0631 \u0641\u064a \u0627\u0644\u0623\u0631\u0634\u064a\u0641',
      preferredLocale:
        '\u0627\u0644\u0644\u063a\u0629 \u0627\u0644\u0645\u0641\u0636\u0644\u0629',
      bio:
        '\u0646\u0628\u0630\u0629 \u0642\u0635\u064a\u0631\u0629',
      bioPlaceholder:
        '\u0627\u0643\u062a\u0628 \u0628\u0625\u064a\u062c\u0627\u0632 \u0627\u0644\u0645\u0646\u0627\u0637\u0642 \u0623\u0648 \u0627\u0644\u0639\u0635\u0648\u0631 \u0623\u0648 \u0627\u0644\u0645\u0648\u0636\u0648\u0639\u0627\u062a \u0627\u0644\u062a\u0627\u0631\u064a\u062e\u064a\u0629 \u0627\u0644\u062a\u064a \u062a\u0641\u0636\u0644 \u0627\u0633\u062a\u0643\u0634\u0627\u0641\u0647\u0627.',
      save:
        '\u062d\u0641\u0638 \u0627\u0644\u0645\u0644\u0641',
      saving:
        '\u062c\u0627\u0631\u064d \u0627\u0644\u062d\u0641\u0638...',
      saved:
        '\u062a\u0645 \u062d\u0641\u0638 \u0627\u0644\u0645\u0644\u0641 \u0628\u0646\u062c\u0627\u062d.',
      saveError:
        '\u062a\u0639\u0630\u0631 \u062d\u0641\u0638 \u0627\u0644\u0645\u0644\u0641 \u062d\u0627\u0644\u064a\u0627.',
      uploadError:
        '\u062a\u0639\u0630\u0631 \u0631\u0641\u0639 \u0635\u0648\u0631\u0629 \u0627\u0644\u0645\u0644\u0641 \u062d\u0627\u0644\u064a\u0627.',
      fileRequirements:
        'PNG\u060c JPEG\u060c \u0623\u0648 WebP \u0628\u062d\u062c\u0645 \u064a\u0635\u0644 \u0625\u0644\u0649 2 \u0645\u064a\u063a\u0627.',
      signedInAs:
        '\u0645\u0633\u062c\u0644 \u0627\u0644\u062f\u062e\u0648\u0644 \u0643\u0640',
      openLibrary:
        '\u0627\u0641\u062a\u062d \u0627\u0644\u0645\u0643\u062a\u0628\u0629',
    },
    search: {
      authGateEyebrow:
        '\u0627\u0644\u0648\u0635\u0648\u0644 \u0625\u0644\u0649 \u0627\u0644\u0628\u062d\u062b',
      authGateTitle:
        '\u0627\u0644\u0645\u062a\u0627\u0628\u0639\u0629 \u0645\u0639 ChronoLivre',
      authGateBody:
        '\u0623\u0646\u0634\u0626 \u062d\u0633\u0627\u0628\u0627 \u0623\u0648 \u0633\u062c\u0644 \u0627\u0644\u062f\u062e\u0648\u0644 \u0644\u0628\u062f\u0621 \u0627\u0633\u062a\u0643\u0634\u0627\u0641 \u0627\u0644\u062a\u0627\u0631\u064a\u062e \u0628\u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064a.',
      verifyGateEyebrow:
        '\u0627\u0644\u062a\u062d\u0642\u0642 \u0645\u0637\u0644\u0648\u0628',
      verifyGateTitle:
        '\u062d\u0642\u0642 \u0628\u0631\u064a\u062f\u0643 \u0644\u0644\u0645\u062a\u0627\u0628\u0639\u0629',
      verifyGateBody:
        '\u062d\u0633\u0627\u0628\u0643 \u0645\u0648\u062c\u0648\u062f\u060c \u0644\u0643\u0646 \u0644\u0627 \u064a\u0645\u0643\u0646 \u0645\u062a\u0627\u0628\u0639\u0629 \u0627\u0644\u0628\u062d\u062b \u0642\u0628\u0644 \u062a\u0623\u0643\u064a\u062f \u0627\u0644\u0628\u0631\u064a\u062f.',
      saveError:
        '\u0644\u0645 \u064a\u062a\u0645 \u062d\u0641\u0638 \u0647\u0630\u0627 \u0627\u0644\u0645\u0644\u0641 \u062d\u0627\u0644\u064a\u0627.',
      savedToLibrary:
        '\u062a\u0645 \u062d\u0641\u0638\u0647 \u0641\u064a \u0645\u0643\u062a\u0628\u062a\u0643',
      savingToLibrary:
        '\u062c\u0627\u0631\u064d \u062d\u0641\u0638\u0647 \u0641\u064a \u0645\u0643\u062a\u0628\u062a\u0643...',
      signInToOpen:
        '\u0633\u062c\u0644 \u0627\u0644\u062f\u062e\u0648\u0644 \u0644\u062d\u0641\u0638 \u0648\u0641\u062a\u062d \u0627\u0644\u0645\u0644\u0641 \u0627\u0644\u0643\u0627\u0645\u0644',
      signInToSave:
        '\u0633\u062c\u0644 \u0627\u0644\u062f\u062e\u0648\u0644 \u0644\u062d\u0641\u0638 \u0647\u0630\u0627 \u0627\u0644\u0645\u0644\u0641',
    },
  },
} as const;

export function getUiCopy(locale: Locale) {
  return uiCopy[locale];
}
