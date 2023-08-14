import "./App.less";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ConfigProvider } from 'antd';
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Services from "./pages/Services/Services";
import Photographers from "./pages/Photographers/Photographers";
import Profile from "./pages/Profile/Profile";
import Unavailable from "./pages/Unavailable/Unavailable";

/**
 * The main react component we are using in the html body.
 * The config provider wrapping the App component makes this a global config for all Ant Design. Read https://ant.design/docs/react/customize-theme to understand how themes are modifying the design.
 * Use the AntD tokens to customise the intenral AntD style properties. Seed tokens are inherited by Map Tokens, which in turn are inherited by Alias tokens.
 * Customising the Ant Design happens through modifying tokens in a given theme. Handy theme editor https://ant.design/theme-editor for token fields.
 * @returns 
 */
function App() {
	const antDesignToken = {
		// Seed Tokens
		colorPrimary: '#52c41a',
		fontSize: 16,
		
		// Alias Tokens
		// colorBgContainer: '#f22ffed',

		// Component Tokens
		Menu: {
			itemHeight: 30,
			subMenuItemBg: "white",
			groupTitleLineHeight: 1.5,
			itemMarginBlock: 6,
		}
	}

	return (
		<ConfigProvider theme={{ token: antDesignToken }}>
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
		</ConfigProvider>
	);
}

export default App;
