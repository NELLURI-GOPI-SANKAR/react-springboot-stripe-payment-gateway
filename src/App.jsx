import {Routes,Route} from "react-router-dom";
import Success from "./Success";
import Payment from "./Payment";
function App() {

  return(
    <>
    <Routes>
      <Route path="/" element={<Payment/>}/>
      <Route path="/success" element={<Success/>}/>
    </Routes>
    </>
  )
  
}

export default App;
