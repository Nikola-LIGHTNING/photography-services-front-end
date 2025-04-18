import "./Login.less";
import { Form, Input, message, Button, Checkbox } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Logo from "../../components/Logo/Logo";
import cover from '../../images/ogosta_3.jpg';
import { AuthenticationService } from "../../services/AuthenticationService";
import { hasValidResponseStatus } from "../../utils/ValidationUtils";
import { useAuth } from "../../utils/AuthContext";

const authenticationService = new AuthenticationService();

function Login() {
	const navigate = useNavigate();
	const { setIsAuthenticated } = useAuth(); // Access setIsAuthenticated from context
	const formRules = {
		username: {
			required: true,
			message: "Моля, въведете потребителско име(вашият E-mail)!",
		},
		password: {
			required: true,
			message: "Моля, въведете парола!",
		},
	};

	function onFinishFailed() {
		message.error("Неуспешен вход в системата!");
	}

	function onFinish(values) {
		try {
			const authenticationRequest = {
				email: values.username,
				password: values.password
			}

			authenticationService.generateAuthenticationToken(authenticationRequest)
				.then((response) => {
					console.log(response);
					if (hasValidResponseStatus(response, [200])) {
						sessionStorage.setItem('jwtToken', response.token);
						setIsAuthenticated(true); // Update global auth state
						message.success("Успешен вход!");
						navigate("/home");
					} else {
						// Log error using a logging service
						onFinishFailed();
					}
				});
		} catch (err) {
			// Log error using a logging service
			onFinishFailed();
		}
	};

	return (
		<div className="loginContainer">
			<div className="loginBackgroundContainer">
				<img className="loginBackgroundImage" src={cover} alt="" />
			</div>
			<div className="loginFormContainer">
				<div className="loginFormTitle">
					<Logo />
					<span className="loginFormTitleText">Вход</span>
				</div>
				<Form
					name="login"
					className="loginForm"
					initialValues={{
						remember: true,
					}}
					onFinish={onFinish}
					onFinishFailed={onFinishFailed}
				>
					<Form.Item name="username" hasFeedback rules={[formRules.username]}>
						<Input prefix={<UserOutlined />} placeholder="Потребителско име" />
					</Form.Item>
					<Form.Item name="password" hasFeedback rules={[formRules.password]}>
						<Input.Password prefix={<LockOutlined />} type="password" placeholder="Парола" />
					</Form.Item>
					<Form.Item>
						<Form.Item name="rememberMe" valuePropName="checked" noStyle>
							<Checkbox>Запомни ме</Checkbox>
						</Form.Item>

						<Link className="loginFormForgotPassword" to="/register/forgotten_password">
							Забравих паролата си
						</Link>
					</Form.Item>

					<Form.Item>
						<Button type="primary" htmlType="submit" className="loginFormBtn">
							Вход
						</Button>
						Или <Link to="/register">направете регистрация сега!</Link>
					</Form.Item>
				</Form>
			</div>
		</div>
	);
}

export default Login;
