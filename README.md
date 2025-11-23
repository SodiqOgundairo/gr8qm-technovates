# gr8qm-technovates
The home to gr8qm Technovates website


how to use SEO.tsx
import { SEO } from "../components/common/SEO";

const NewPage = () => {
  return (
    <>
      <SEO 
        title="Page Title" 
        description="A compelling description of this page for Google and social media."
        image="/path/to/specific-image.jpg" // Optional: specific image for this page
      />
      <main>
        {/* Page content */}
      </main>
    </>
  );
};`