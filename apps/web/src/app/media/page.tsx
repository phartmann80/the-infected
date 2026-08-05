import type { Metadata } from 'next';
import MediaClient from './MediaClient';

export const metadata: Metadata = {
  title: 'Media | The Infected',
  description: 'Explore the media in The Infected, a cinematic 3D zombie-survival Android game.',
};

export default function MediaPage() {
  return <MediaClient />;
}