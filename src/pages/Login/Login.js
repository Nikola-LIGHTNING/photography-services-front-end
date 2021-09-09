import "./Login.less";
import { Form, Input, Button, Checkbox } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import Logo from "../../components/Logo/Logo";
import { Link } from "react-router-dom";

function Login() {
	const formRules = {
		username: {
			required: true,
			message: "Моля, въведе потребителско име!",
		},
		password: {
			required: true,
			message: "Моля, въведете парола!",
		},
	};

	const onFinish = (values) => {
		console.log("Received values of form: ", values);
	};

	return (
		<div className="loginContainer">
			<div className="loginBackgroundContainer">
				<img className="loginBackgroundImage" src={require("../../images/ogosta_3.jpg").default} alt="" />
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
				>
					<Form.Item name="username" rules={[formRules.username]}>
						<Input prefix={<UserOutlined />} placeholder="Потребителско име" />
					</Form.Item>
					<Form.Item name="password" rules={[formRules.password]}>
						<Input prefix={<LockOutlined />} type="password" placeholder="Парола" />
					</Form.Item>
					<Form.Item>
						<Form.Item name="rememberMe" valuePropName="checked" noStyle>
							<Checkbox>Запомни ме</Checkbox>
						</Form.Item>

						<a className="loginFormForgotPassword" href="">
							Забравих паролата си
						</a>
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
