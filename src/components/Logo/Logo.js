import "./Logo.less";
import { Link } from "react-router-dom";
import { animateScroll as scroll } from "react-scroll";
import logo from '../../images/film.png'

function Logo() {
	const scrollUp = () => {
		scroll.scrollToTop();
	};

	return (
		<div className="logoContainer">
			<Link to="/" onClick={scrollUp}>
				<img className="logoImg" src={logo} alt="" />
			</Link>
		</div>
	);
}

export default Logo;
