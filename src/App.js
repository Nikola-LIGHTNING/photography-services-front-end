import "antd/dist/antd.less";
import "./App.less";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Photographers from "./pages/Photographers/Photographers";

function App() {
	return (
		<Router>
			<Switch>
				<Route path={["/", "/home"]} component={Home} exact />
				<Route path="/login" component={Login} exact />
				<Route path="/register" component={Register} exact />
				<Route path="/photographers" component={Photographers} exact />
				{/* <Route component={NotFoundPage} /> */}
			</Switch>
		</Router>
	);
}

export default App;
