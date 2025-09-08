import { Label, Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { type ReactElement } from 'react';

import { CheckIcon, ChevronIcon } from './icons';

export interface LanguageOption {
  value: string;
  label: string;
}

export interface LanguageSelectorProps {
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
  languages?: LanguageOption[];
  label?: string;
  helperText?: string;
  className?: string;
}

const DEFAULT_LANGUAGES: LanguageOption[] = [
  { value: 'English', label: 'English' },
  { value: 'French', label: 'Français' },
  { value: 'Spanish', label: 'Español' },
];

export function LanguageSelector({
  selectedLanguage,
  onLanguageChange,
  languages = DEFAULT_LANGUAGES,
  label = 'Output Language',
  className,
}: LanguageSelectorProps): ReactElement {
  const selectedLang = languages.find(lang => lang.value === selectedLanguage) ?? languages[0]!;

  return (
    <div className={`space-y-2 ${className || ''}`}>
      <Listbox value={selectedLang} onChange={(lang) => onLanguageChange(lang.value)}>
        <Label className="block text-sm font-medium text-gray-700">
          {label}
        </Label>
        <div className="relative mt-2">
          <ListboxButton className="grid w-full cursor-default grid-cols-1 rounded-md bg-white py-1.5 pr-2 pl-3 text-left text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-pink sm:text-sm">
            <span className="col-start-1 row-start-1 truncate pr-6">{selectedLang.label}</span>
            <span
              aria-hidden="true"
              className="col-start-1 row-start-1 size-5 self-center justify-self-end text-gray-500 sm:size-4"
            >
              <ChevronIcon />
            </span>
          </ListboxButton>

          <ListboxOptions
            transition
            className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg outline-1 outline-black/5 data-leave:transition data-leave:duration-100 data-leave:ease-in data-closed:data-leave:opacity-0 sm:text-sm"
          >
            {languages.map((lang) => (
              <ListboxOption
                key={lang.value}
                value={lang}
                className="group relative cursor-default py-2 pr-9 pl-3 text-gray-900 select-none data-focus:bg-brand-pink data-focus:text-white data-focus:outline-hidden"
              >
                <span className="block truncate font-normal group-data-selected:font-semibold">{lang.label}</span>

                <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-brand-pink group-not-data-selected:hidden group-data-focus:text-white">
                  <span aria-hidden="true" className="size-5">
                    <CheckIcon />
                  </span>
                </span>
              </ListboxOption>
            ))}
          </ListboxOptions>
        </div>
      </Listbox>
    </div>
  );
}
