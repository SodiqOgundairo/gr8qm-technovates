import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import Button from "../components/common/Button";
import Container from "../components/layout/Container";

const NotFound: React.FC = () => {
  return (
    <div className="relative h-screen bg-cover bg-center">
      <div className="absolute inset-0 bg-linear-to-r from-light/50 to-skyblue/20"></div>

      <div className="absolute inset-0 flex items-center justify-center gap-8 text-center">
        <Container>
          <div>
            <DotLottieReact
              src="https://lottie.host/1b90af72-5f0c-4105-883a-df7d1185fa2a/ejfEvQOEe1.lottie"
              loop
              autoplay
              className="w-xl"
            />
            <h1 className="text-3xl md:6xl text-oxfordblue font-bold font-body leading-loose mb-7">
              Page not found
            </h1>

            <Button to="/" variant="pry">
              {" "}
              Let's get you back home
            </Button>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default NotFound;
