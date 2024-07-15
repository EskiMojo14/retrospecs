import logo from "/assets/retrospecs.png";
import { Categories } from "@/features/feedback/category";

function App() {
  return (
    <>
      <div className="header">
        <img src={logo} alt="RetroSpecs" />
        <h1>RetroSpecs</h1>
      </div>
      <Categories />
    </>
  );
}

export default App;
