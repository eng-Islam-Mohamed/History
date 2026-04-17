import { Locale } from '@/i18n/config';

const uiCopy = {
  en: {
    auth: {
      account: 'Account',
      continueToLibrary: 'Continue to your library',
      createAccount: 'Create account',
      email: 'Email address',
      helper: 'Your saved dossiers will be linked to your account and available on any device.',
      loginRequired: 'Please sign in to open your saved research library.',
      password: 'Password',
      signIn: 'Sign in',
      signInDescription: 'Access your personal archive and keep every dossier attached to your account.',
      signInTitle: 'Continue your research archive',
      signOut: 'Sign out',
      signUpDescription: 'Create an account to save searches, reopen dossiers, and keep your research organized.',
      signUpSuccess: 'Check your email to confirm your account before signing in.',
      submitSignIn: 'Open my archive',
      submitSignUp: 'Create my account',
    },
    search: {
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
      continueToLibrary: 'Continuer vers votre bibliotheque',
      createAccount: 'Creer un compte',
      email: 'Adresse email',
      helper: 'Vos dossiers enregistres seront lies a votre compte et disponibles sur tous vos appareils.',
      loginRequired: 'Connectez-vous pour ouvrir votre bibliotheque de recherche.',
      password: 'Mot de passe',
      signIn: 'Connexion',
      signInDescription: 'Accedez a votre archive personnelle et conservez chaque dossier dans votre compte.',
      signInTitle: 'Retrouvez votre archive de recherche',
      signOut: 'Deconnexion',
      signUpDescription: 'Creez un compte pour sauvegarder vos recherches et rouvrir vos dossiers.',
      signUpSuccess: 'Verifiez votre email pour confirmer votre compte avant de vous connecter.',
      submitSignIn: 'Ouvrir mon archive',
      submitSignUp: 'Creer mon compte',
    },
    search: {
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
      continueToLibrary:
        '\u0627\u0644\u0645\u062a\u0627\u0628\u0639\u0629 \u0625\u0644\u0649 \u0645\u0643\u062a\u0628\u062a\u0643',
      createAccount:
        '\u0625\u0646\u0634\u0627\u0621 \u062d\u0633\u0627\u0628',
      email:
        '\u0627\u0644\u0628\u0631\u064a\u062f \u0627\u0644\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a',
      helper:
        '\u0633\u062a\u0643\u0648\u0646 \u0645\u0644\u0641\u0627\u062a\u0643 \u0627\u0644\u0645\u062d\u0641\u0648\u0638\u0629 \u0645\u0631\u062a\u0628\u0637\u0629 \u0628\u062d\u0633\u0627\u0628\u0643 \u0648\u0645\u062a\u0627\u062d\u0629 \u0639\u0644\u0649 \u0623\u064a \u062c\u0647\u0627\u0632.',
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
      submitSignIn:
        '\u0627\u0641\u062a\u062d \u0623\u0631\u0634\u064a\u0641\u064a',
      submitSignUp:
        '\u0623\u0646\u0634\u0626 \u062d\u0633\u0627\u0628\u064a',
    },
    search: {
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
