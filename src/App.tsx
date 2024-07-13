import logo from "./assets/retrospecs.png";
import { Card } from "./features/card";

function App() {
  return (
    <>
      <div className="header">
        <img src={logo} alt="RetroSpecs" />
        <h1>RetroSpecs</h1>
      </div>
      <div className="card-demo">
        <div className="green-card">
          Good
          <Card>An example</Card>
          <Card>
            Something very long but very positive that goes on and on and on
          </Card>
        </div>
        <div className="red-card">Needs improvement</div>
        <div className="blue-card">Neutral</div>
        <div className="orange-card">Carry forward</div>
      </div>
    </>
  );
}

export default App;
