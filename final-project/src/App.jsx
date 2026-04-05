 import "./App.css";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import AuthCard from "./components/AuthCard";

function App() {
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

export default App;