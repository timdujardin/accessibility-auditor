export interface TechnologyOption {
  id: string;
  label: string;
  url: string;
}

export const TECHNOLOGY_OPTIONS: TechnologyOption[] = [
  { id: 'html', label: 'HTML', url: 'https://html.spec.whatwg.org/' },
  { id: 'css', label: 'CSS', url: 'https://www.w3.org/Style/CSS/' },
  { id: 'js', label: 'JavaScript', url: 'https://tc39.es/ecma262/' },
  { id: 'aria', label: 'WAI-ARIA', url: 'https://www.w3.org/WAI/ARIA/apg/' },
  { id: 'svg', label: 'SVG', url: 'https://www.w3.org/Graphics/SVG/' },
  { id: 'pdf', label: 'PDF', url: 'https://www.iso.org/standard/75839.html' },
];
