import "./Footer.less";
import React from "react";
import { Link } from "react-router-dom";
import { Layout } from "antd";
import Logo from "../Logo/Logo";

function Footer() {
	return (
		<Layout.Footer className="footerContainer">
			<div className="footerWrapper">
				<h1 className="footerLinkTitle"> За нас </h1>
				<div className="footerLinksContainer">
					<div className="footerLinksWrapper">
						<div className="footerLinkItems">
							<Link className="footerLink" to="/signin">
								Цел
							</Link>
							<Link className="footerLink" to="/signin">
								Често задавани въпроси
							</Link>
							<Link className="footerLink" to="/signin">
								Как работи?
							</Link>
						</div>
					</div>
				</div>
				<section className="socialMedia">
					<div className="socialMediaWrapper">
						<Logo />
						<small className="websiteRights">Copyright © {new Date().getFullYear()} Lenta</small>
					</div>
				</section>
			</div>
		</Layout.Footer>
	);
}

export default Footer;
