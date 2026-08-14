import HeroCarousel from '../components/HeroCarousel.jsx';
import CategoryGrid from '../components/CategoryGrid.jsx';
import TreeBar from '../components/TreeBar.jsx';
import FeaturedProducts from '../components/FeaturedProducts.jsx';
import CategoryProducts from '../components/CategoryProducts.jsx';

export default function Home() {
  return (
    <main>
      <HeroCarousel />
      <CategoryGrid />
      <TreeBar />
      <FeaturedProducts />
      <CategoryProducts />
    </main>
  );
}