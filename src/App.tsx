import logo from "/assets/retrospecs.png";
import { FloatingButton } from "@/components/floating-button";
import { Categories } from "@/features/feedback/category";
import { Icon } from "./components/icon";

function App() {
  return (
    <>
      <div className="header">
        <img src={logo} alt="RetroSpecs" />
        <h1>RetroSpecs</h1>
      </div>
      <Categories />
      <FloatingButton label="Add feedback">
        <Icon>add_comment</Icon>
      </FloatingButton>
    </>
  );
}

export default App;
