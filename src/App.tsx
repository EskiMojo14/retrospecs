import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import logo from "./assets/retrospecs.png";
import { FloatingButton } from "./components/floating-button";
import { Categories } from "./features/feedback/category";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

function App() {
  return (
    <>
      <div className="header">
        <img src={logo} alt="RetroSpecs" />
        <h1>RetroSpecs</h1>
      </div>
      <Categories />
      <FloatingButton label="Add feedback">
        <FontAwesomeIcon icon={faPlus} />
      </FloatingButton>
    </>
  );
}

export default App;
