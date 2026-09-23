import WipReveal from '../content/WipReveal';
import { RotatingTitle } from '../content/PageTitle';
import ActionLink from './ActionLink';
import Carousel from './Carousel';
import CitationBox from './CitationBox';
import MediaPresence from './MediaPresence';
import Toc from './Toc';
import { FootnoteDefinition, FootnoteRef, Footnotes } from './Footnotes';
import { H2, H3, H4 } from './Headings';
import NavigatorGrid from './NavigatorGrid';
import MediaGrid from './MediaGrid';
import CodeSnippet from './CodeSnippet';
import CollapsibleSection from './CollapsibleSection';
import MdxLink from './MdxLink';
import MdxImg from './MdxImg';

export const mdxComponents = {
  ActionLink,
  Carousel,
  CollapsibleSection,
  CitationBox,
  MediaPresence,
  RotatingTitle,
  Toc,
  Footnotes,
  FootnoteRef,
  FootnoteDefinition,
  WipReveal,
  h2: H2,
  h3: H3,
  h4: H4,
  MediaGrid,
  NavigatorGrid,
  CodeSnippet,
  a: MdxLink,
  img: MdxImg,
};
