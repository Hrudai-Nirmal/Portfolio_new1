import { PeacockBackground } from '../components/peacock-background';
import { SiteHeader } from '../components/site-header';

/** Compose the portfolio hero and its persistent primary navigation. */
export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main><PeacockBackground /></main>
    </>
  );
}
