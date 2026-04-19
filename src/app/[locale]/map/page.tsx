import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import WorldMapExplorer from '@/components/experience/WorldMapExplorer';
import { historicalMapHotspots } from '@/data/experience';

export default function LocalizedMapPage() {
  return (
    <>
      <Navbar />
      <main className="overflow-hidden px-4 pb-16 pt-28 md:px-6 md:pb-20 md:pt-32">
        <WorldMapExplorer hotspots={historicalMapHotspots} />
      </main>
      <Footer />
    </>
  );
}
