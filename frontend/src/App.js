import { useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import LiquidEther from "./components/LiquidEther";
import LiquidGlassDemo from "./components/LiquidGlassDemo";
import GradualBlur from "./components/GradualBlur";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Home = () => {
  const helloWorldApi = async () => {
    try {
      const response = await axios.get(`${API}/`);
      console.log(response.data.message);
    } catch (e) {
      console.error(e, `errored out requesting / api`);
    }
  };

  useEffect(() => {
    helloWorldApi();
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background LiquidEther */}
      <div className="absolute inset-0 z-0">
        <LiquidEther
          colors={['#5227FF', '#FF9FFC', '#B19EEF']}
          mouseForce={20}
          cursorSize={100}
          isViscous={false}
          viscous={30}
          iterationsViscous={32}
          iterationsPoisson={32}
          resolution={0.5}
          isBounce={false}
          autoDemo={true}
          autoSpeed={0.5}
          autoIntensity={2.2}
          takeoverDuration={0.25}
          autoResumeDelay={3000}
          autoRampDuration={0.6}
        />
      </div>
      
      {/* Content with Liquid Glass Theme */}
      <div className="relative z-10 min-h-screen flex items-center justify-center">
        <div 
          className="glass-card backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl"
          style={{ position: 'relative', overflow: 'hidden' }}
        >
          <header className="text-center relative z-20">
            <a
              className="inline-block transition-transform hover:scale-110 duration-300"
              href="https://emergent.sh"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img 
                className="rounded-full shadow-lg border-2 border-white/30" 
                src="https://avatars.githubusercontent.com/in/1201222?s=120&u=2686cf91179bbafbc7a71bfbc43004cf9ae1acea&v=4" 
                alt="Emergent"
              />
            </a>
            <h1 className="text-4xl font-bold text-white mt-6 mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Building something incredible
            </h1>
            <p className="text-white/80 text-lg">
              With Liquid Glass Magic ✨
            </p>
            
            {/* Interactive Elements */}
            <div className="mt-8 flex gap-4 justify-center">
              <button className="glass-button px-6 py-3 rounded-full border border-white/30 bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all duration-300 hover:scale-105">
                Explore
              </button>
              <button className="glass-button px-6 py-3 rounded-full border border-white/30 bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all duration-300 hover:scale-105">
                Learn More
              </button>
            </div>
          </header>
          
          {/* Gradual Blur Effects */}
          <GradualBlur
            target="parent"
            position="bottom"
            height="4rem"
            strength={3}
            divCount={6}
            curve="bezier"
            exponential={true}
            opacity={0.8}
            className="gradual-blur-glass"
          />
          <GradualBlur
            target="parent"
            position="top"
            height="3rem"
            strength={2}
            divCount={4}
            curve="ease-out"
            exponential={false}
            opacity={0.6}
            className="gradual-blur-glass"
          />
        </div>
      </div>
      
      {/* Liquid Glass Demo Section */}
      <LiquidGlassDemo />
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}>
            <Route index element={<Home />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
