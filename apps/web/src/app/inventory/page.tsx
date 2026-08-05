import type { Metadata } from 'next';
import InventoryClient from './InventoryClient';

export const metadata: Metadata = {
  title: 'Inventory | The Infected',
  description: 'Explore the inventory in The Infected, a cinematic 3D zombie-survival Android game.',
};

export default function InventoryPage() {
  return <InventoryClient />;
}