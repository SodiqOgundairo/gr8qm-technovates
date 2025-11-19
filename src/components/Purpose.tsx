import Card from "./Card";
import Container from "./common/Container";

const Purpose = () => {
  return (
      <Container
        maxWidth="2xl"
        padding="py-12 md:py-36"
        className="flex flex-col items-center"
      >
        <h2 className="text-header-3 text-center">
          Built on Purpose, Driven by Faith
        </h2>
        <p className="text-body-md text-center mt-4">
          We don't just build technology. We create solutions that reflect
          kingdom values and transform communities.
        </p>
        <div className="grid md:grid-cols-3 gap-8 mt-12">
        <Card variant="iceblue">
          <div className="flex items-center">
            <div className="bg-white rounded-lg p-4">
              <img src="/assets/innovation.svg" alt="AI Innovation" />
            </div>
            <h3 className="text-body-lg-bold ml-4">AI Innovation</h3>
          </div>
          <p className="text-body-sm mt-4">
            Advancing AI research with integrity and purpose
          </p>
        </Card>
        <Card variant="iceblue">
          <div className="flex items-center">
            <div className="bg-white rounded-lg p-4">
              <img src="/assets/kingdom.svg" alt="Kingdom Values" />
            </div>
            <h3 className="text-body-lg-bold ml-4">Kingdom Values</h3>
          </div>
          <p className="text-body-sm mt-4">
            Building solutions rooted in faith and excellence
          </p>
        </Card>
        <Card variant="iceblue">
          <div className="flex items-center">
            <div className="bg-white rounded-lg p-4">
              <img src="/assets/transformation.svg" alt="Transformation" />
            </div>
            <h3 className="text-body-lg-bold ml-4">Transformation</h3>
          </div>
          <p className="text-body-sm mt-4">
            Creating impact that uplifts communities
          </p>
        </Card>
        </div>
      </Container>
  );
};

export default Purpose;
