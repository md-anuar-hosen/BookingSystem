import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import AuthCard from "../components/AuthCard";

function HomePage() {
  return (
    <>
      <Navbar />
      <div className="container">
        <Hero />
        <AuthCard />
      </div>
    </>
  );
}

export default HomePage;