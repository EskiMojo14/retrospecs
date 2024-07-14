import logo from "/assets/retrospecs.png";
import { FloatingButton } from "@/components/floating-button";
import { Categories } from "@/features/feedback/category";
import { Symbol } from "./components/symbol";

function App() {
  return (
    <>
      <div className="header">
        <img src={logo} alt="RetroSpecs" />
        <h1>RetroSpecs</h1>
      </div>
      <Categories />
      <FloatingButton label="Add feedback">
        <Symbol>add_comment</Symbol>
      </FloatingButton>
    </>
  );
}

export default App;
