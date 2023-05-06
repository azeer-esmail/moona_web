import { Route } from 'react-router-dom/cjs/react-router-dom.min';
import './App.css';
import Homepage from "./Pages/Homepage";
import ControlPage from "./Pages/ControlPage";

function App() {
  return (
    <div className="App">
      <Route path="/" component={Homepage} exact />
      <Route path="/controls" component={ControlPage} exact />
    </div>
  );
}

export default App;
