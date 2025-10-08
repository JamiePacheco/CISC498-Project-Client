import { BrowserRouter as Router, Routes, Route, href} from "react-router-dom";
import './App.css';
import Home from './Pages/HomePage'
import CreateLobby from './Pages/CreateLobby';
import logo from "./logo.svg"

function App() {

  return (
    <Router>
    <div className="App">
      <header className="App-header">
        <header className='Header'>
          <a href="/" className="link">
            <img src={logo} className="App-logo" alt="logo"/>
          </a>
        </header>
        <Routes>
          <Route path='/' element={<Home/>}></Route>
          <Route path='/make-lobby' element={<CreateLobby/>}></Route>
        </Routes>
      </header>
    </div>
    </Router>
  );
}

export default App;
