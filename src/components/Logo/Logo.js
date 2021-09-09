import "./Logo.less";
import { Link } from "react-router-dom";
import { animateScroll as scroll } from "react-scroll";

function Logo() {
	const scrollUp = () => {
		scroll.scrollToTop();
	};

	return (
		<div className="logoContainer">
			<Link to="/" onClick={scrollUp}>
				<img className="logoImg" src={require("../../images/film.png").default} alt="" />
			</Link>
		</div>
	);
}

export default Logo;
