import type { FC } from 'react';

import MuiAccordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';

import type { AccordionProps } from './accordion.types';

import Icon from '@/components/atoms/icon/Icon';

/**
 * Accordion component. Combines MUI Accordion, AccordionSummary, AccordionDetails.
 * @param {AccordionProps} props - Accordion configuration.
 * @returns {JSX.Element} A collapsible accordion panel.
 */
const Accordion: FC<AccordionProps> = ({ summary, children, defaultExpanded, expanded, onChange, sx }) => (
  <MuiAccordion defaultExpanded={defaultExpanded} expanded={expanded} onChange={onChange} sx={sx}>
    <AccordionSummary expandIcon={<Icon name="ExpandMore" />}>{summary}</AccordionSummary>
    <AccordionDetails>{children}</AccordionDetails>
  </MuiAccordion>
);

export default Accordion;
