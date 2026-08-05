import type { Metadata } from 'next';
import GearClient from './GearClient';

export const metadata: Metadata = {
  title: 'Gear | The Infected',
  description: 'Explore the gear in The Infected, a cinematic 3D zombie-survival Android game.',
};

export default function GearPage() {
  return <GearClient />;
}