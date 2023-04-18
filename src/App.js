import "antd/dist/antd.less";
import "./App.less";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Services from "./pages/Services/Services";
import Photographers from "./pages/Photographers/Photographers";
import Profile from "./pages/Profile/Profile";
import Unavailable from "./pages/Unavailable/Unavailable";

function App() {
	return (
		<Router>
			<Switch>
				<Route path={["/", "/home"]} component={Home} exact />
				<Route path="/login" component={Login} exact />
				<Route path="/register" component={Register} exact />
				<Route path="/services" component={Services} exact />
				<Route path="/photographers" component={Photographers} exact />
				<Route path="/photographers/:photographerId" component={Profile} exact />
				<Route path="/info/unknownerror" component={Unavailable} exact />
				{/* <Route component={NotFoundPage} /> */}
			</Switch>
		</Router>
	);
}

export default App;
