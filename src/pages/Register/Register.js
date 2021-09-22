import "./Register.less";
import Logo from "../../components/Logo/Logo";
import { Form, Input, Select, Checkbox, Button } from "antd";

const { Option } = Select;

function Register() {
	const passwordRegex = new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{6,40}$"); // From herehttps://ihateregex.io/expr/password/
	const phoneRegex = new RegExp("^0[0-9]{9}$");

	const registerFormItemLayout = {
		labelCol: { span: 10 },
		wrapperCol: { span: 13 },
	};
	const registerTailFormItemLayout = {
		wrapperCol: { span: 24, offset: 4 },
	};

	const onFinish = (values) => {
		console.log("Received values of form: ", values);
	};

	return (
		<div className="registerContainer">
			<div className="registerBackgroundContainer">
				<img className="registerBackgroundImage" src={require("../../images/ogosta_2.jpg").default} alt="" />
			</div>
			<div className="registerFormContainer">
				<div className="registerFormTitle">
					<div className="registerFormLogo">
						<Logo />
					</div>
					<span className="registerFormTitleText">Регистрация</span>
				</div>
				<Form className="registerForm" {...registerFormItemLayout} name="register" onFinish={onFinish}>
					<Form.Item
						name="email"
						label="E-mail"
						tooltip="Използва се за вход в системата."
						rules={[
							{
								type: "email",
								message: "Въвели сте невалиден E-mail!",
							},
							{
								required: true,
								message: "Моля, въведете вашия E-mail!",
							},
						]}
					>
						<Input />
					</Form.Item>
					<Form.Item
						name="password"
						label="Парола"
						hasFeedback
						rules={[
							{
								required: true,
								message: "Моля, въведете парола!",
							},
							{
								pattern: passwordRegex,
								message:
									"Паролата трябва да съдържа поне 1 цифра, 1 главна и 1 малка латински букви, да е между 8 и 40 символа!",
							},
						]}
					>
						<Input.Password />
					</Form.Item>

					<Form.Item
						name="confirmPassword"
						label="Повторете парола"
						dependencies={["password"]}
						hasFeedback
						rules={[
							{
								required: true,
								message: "Моля, повторете паролата си!",
							},
							({ getFieldValue }) => ({
								validator(_, value) {
									if (!value || getFieldValue("password") === value) {
										return Promise.resolve();
									}

									return Promise.reject(new Error("Паролите, които сте въвели не съвпадат!"));
								},
							}),
						]}
					>
						<Input.Password />
					</Form.Item>
					<Form.Item
						name="phoneNumber"
						label="Телефонене номер"
						rules={[
							{
								required: true,
								message: "Моля, въведете телефонен номер!",
							},
							{
								pattern: phoneRegex,
								message: "Моля, въведете номер започващ с 0, последван от 9 цифри!",
							},
						]}
					>
						<Input />
					</Form.Item>
					<Form.Item
						name="gender"
						label="Пол"
						rules={[
							{
								required: true,
								message: "Моля, изберете своя пол!",
							},
						]}
					>
						<Select placeholder="Избери пол">
							<Option value="male">Мъж</Option>
							<Option value="female">Жена</Option>
						</Select>
					</Form.Item>

					<Form.Item
						name="acceptTermsOfService"
						className="registerTermsOfService"
						valuePropName="checked"
						rules={[
							{
								validator: (_, value) =>
									value ? Promise.resolve() : Promise.reject(new Error("Не сте приели условията ни!")),
							},
						]}
						{...registerTailFormItemLayout}
					>
						<Checkbox>
							Прочетох <a href="">условията </a> и се съгласявам с тях {/* the link should be a Ant Modal */}
						</Checkbox>
					</Form.Item>
					<Form.Item className="registerBtn">
						<Button type="primary" htmlType="submit">
							Регистрация
						</Button>
					</Form.Item>
				</Form>
			</div>
		</div>
	);
}

export default Register;
