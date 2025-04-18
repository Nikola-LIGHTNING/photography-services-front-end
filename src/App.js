import "./App.less";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ConfigProvider } from 'antd';
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Services from "./pages/Services/Services";
import Photographers from "./pages/Photographers/Photographers";
import Profile from "./pages/Profile/Profile";
import Pricing from "./pages/Pricing/Pricing";
import Albums from "./pages/Albums/Albums";
import Album from "./pages/Album/Album";
import Unavailable from "./pages/Unavailable/Unavailable";

/**
 * The main react component we are using in the html body.
 * The config provider wrapping the App component makes this a global config for all Ant Design. Read https://ant.design/docs/react/customize-theme to understand how themes are modifying the design.
 * Use the AntD tokens to customise the internal AntD style properties. Seed tokens are inherited by Map Tokens, which in turn are inherited by Alias tokens.
 * Customising the Ant Design happens through modifying tokens in a given theme. Handy theme editor https://ant.design/theme-editor for token fields.
 * @returns 
 */
function App() {
	const antDesignToken = {
		// Seed Tokens
		colorPrimary: '#52c41a',
		colorLink: '#52c41a',
		colorInfo: '#52c41a',
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
	};

	return (
		<ConfigProvider theme={{ token: antDesignToken }}>
			<Router>
				<Routes>
					{/* Home routes */}
					<Route path="/" element={<Home />} />
					<Route path="/home" element={<Home />} />
					
					{/* Authentication routes */}
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />
					
					{/* Main feature routes */}
					<Route path="/services" element={<Services />} />
					<Route path="/photographers" element={<Photographers />} />
					<Route path="/photographers/:photographerId" element={<Profile />} />
					<Route path="/photographers/:photographerId/pricing" element={<Pricing />} />
					<Route path="/photographers/:photographerId/albums" element={<Albums />} />
					<Route path="/photographers/:photographerId/albums/:albumId" element={<Album />} />
					
					{/* Error handling routes */}
					<Route path="/info/unknownerror" element={<Unavailable />} />
					<Route path="*" element={<Unavailable />} /> {/* 404 page */}
				</Routes>
			</Router>
		</ConfigProvider>
	);
}

export default App;
