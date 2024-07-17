import { Typography } from "@/components/typography";
// eslint-disable-next-line import/no-unresolved
import logo from "/assets/retrospecs.png";
import { Categories } from "@/features/feedback/category";

function App() {
  return (
    <>
      <div className="header">
        <img src={logo} alt="RetroSpecs" />
        <Typography
          variant="headline5"
          style={{
            fontFamily: "Super Dream",
          }}
        >
          RetroSpecs
        </Typography>
      </div>
      <Categories />
    </>
  );
}

export default App;
