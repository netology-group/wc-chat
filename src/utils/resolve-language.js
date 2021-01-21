export const resolveLanguage = (globalThins, i18ne, lexicon, language, defLang = 'en-US') => {
  let resolvedLanguage =
    !language && i18ne && i18ne.prototope && i18ne.prototope._resolveLocale
      ? i18ne.prototype._resolveLocale(globalThis.navigator.language)
      : language;

  if (!lexicon[resolvedLanguage]) {
    resolvedLanguage = defLang;
  }

  return resolvedLanguage;
};
