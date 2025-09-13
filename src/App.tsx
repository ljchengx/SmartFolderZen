import { useEffect } from "react";
import Settings from "./components/Settings";
import "./App.css";

function App() {
  useEffect(() => {
    console.log('Smart Folder Zen started');
  }, []);

  return <Settings />;
}

export default App;
