import "./Logo.less";
import { Link } from "react-router-dom";
import { animateScroll as scroll } from "react-scroll";

function Logo() {
    const scrollUp = () => {
        scroll.scrollToTop();
    };

    return (
        <Link to="/" onClick={scrollUp}>
            <div className="logoContainer">
                <img className="logoImg" src={require("../../images/film.png").default} alt="" />
            </div>
        </Link>
    );
}

export default Logo;
