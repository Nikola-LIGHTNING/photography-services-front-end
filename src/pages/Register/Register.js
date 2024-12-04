import "./Register.less";
import Logo from "../../components/Logo/Logo";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Form, Input, Select, Checkbox, Button, message } from "antd";
import cover from '../../images/ogosta_2.jpg';
import { AuthenticationService } from "../../services/AuthenticationService";
import { hasValidResponseStatus } from "../../utils/ValidationUtils";
import { WorkCategoryService } from "../../services/WorkCategoryService";
import { ProvinceService } from "../../services/ProvinceService";

const { Option } = Select;

const passwordRegex = new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{6,40}$"); // From here https://ihateregex.io/expr/password/
const phoneRegex = new RegExp("^0[0-9]{9}$");

const formRules = {
	firstName: [		
		{
			required: true,
			message: "Моля, въведете вашето име!",
		},
	],
	lastName: [
		{
			required: true,
			message: "Моля, въведете вашата фамилия!",
		},
	],
	email: [
		{
			type: "email",
			message: "Моля, въведете валиден E-mail!",
		},
		{
			required: true,
			message: "Моля, въведете вашия E-mail!",
		},
	],
	password: [
		{
			required: true,
			message: "Моля, въведете парола!",
		},
		{
			pattern: passwordRegex,
			message: "Паролата трябва да съдържа поне 1 цифра, 1 главна и 1 малка латински букви, да е между 8 и 40 символа!",
		},
	],
	confirmPassword: [
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
	],
	phoneNumber: [
		{
			required: true,
			message: "Моля, въведете телефонен номер!",
		},
		{
			pattern: phoneRegex,
			message: "Моля, въведете номер започващ с 0, последван от 9 цифри!",
		},
	],
	gender: [
		{
			required: true,
			message: "Моля, изберете своя пол!",
		},
	],
	profession: [
		{
			required: true,
			message: "Моля, изберете своята професия!",
		},
	],
	workProvinces: [
		{
			required: true,
			message: "Моля, изберете области на работа!",
		},
	],
	workCategories: [
		{
			required: true,
			message: "Моля, изберете своите специализации!",
		},
	],
	acceptTermsOfService: [
		{
			validator: (_, value) =>
				value ? Promise.resolve() : Promise.reject(new Error("Не сте приели условията ни!")),
		},
	],
};

const registerFormItemLayout = {
	labelCol: { span: 10 },
	wrapperCol: { span: 13 },
};
const registerTailFormItemLayout = {
	wrapperCol: { span: 24, offset: 4 },
};

const authenticationService = new AuthenticationService();
const workCategoryService = new WorkCategoryService();
const provinceService = new ProvinceService();

/**
 * Sorts an array of strings according to the Bulgarian alphabet order.
 * @param {string[]} array - The array of strings to sort.
 * @returns {string[]} A new sorted array based on Bulgarian alphabet order.
 */
function sortBulgarianStrings(array) {
	const bgAlphabet = "АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЬЮЯ";
	return array.sort((a, b) => {
		for (let i = 0; i < Math.min(a.length, b.length); i++) {
			const aChar = a[i].toUpperCase();
			const bChar = b[i].toUpperCase();
			if (aChar !== bChar) {
				return bgAlphabet.indexOf(aChar) - bgAlphabet.indexOf(bChar);
			}
		}

		// If we've gone through all characters and they're the same, sort by length
		return a.length - b.length;
	});
}

function Register() {
	const navigate = useNavigate();
	const [form] = Form.useForm();
	const [professions, setProfessions] = useState([]);
	const [provinces, setProvinces] = useState([]);
	const [workCategoriesEnabled, setWorkCategoriesEnabled] = useState(false);
	const [workCategories, setWorkCategories] = useState([]);
	const selectedProfession = Form.useWatch('profession', form); // Used for following changes on the value of the profession field


	// Run only when component mounts to fetch required data
	useEffect(() => {
		Promise.all([
			provinceService.getProvinces(),
			workCategoryService.getProfessions()
		]).then((responses) => {
			responses.forEach((response) => validateResponseStatus(response, [200]));
			setProvinces(responses[0].data.provinces);
			setProfessions(responses[1].data.professions);
		});

	}, []);
	
	// Run only when selected profession changes, so that we have the correct work categories
	useEffect(() => {
		if (selectedProfession) {
		  setWorkCategoriesEnabled(true);
		  workCategoryService.getWorkCategoriesByProfession(selectedProfession)
			.then((response) => {
			  if(hasValidResponseStatus(response, [200])) {
				setWorkCategories(response.data.workCategories);
			  }
			});
		} else {
		  setWorkCategoriesEnabled(false);
		  setWorkCategories([]); // Clear work categories if conditions are not met
		}
	  }, [selectedProfession]);

	function validateResponseStatus(response, validStatusesList) {
		if (!hasValidResponseStatus(response, validStatusesList)) {
			navigate("/info/unknownerror");
		}
	}

	function onFinishFailed() {
		message.error("Неуспешена регистрация в системата!");
	}

	function onFinish(values) {
		try {
			const registrationRequest = {
				email: values.email,
				password: values.password,
				phoneNumber: values.phoneNumber,
				person: {
					firstName: values.firstName,
					lastName: values.lastName,
					gender: values.gender,
					profession: values.profession,
					workProvinces: values.workProvinces,
					workCategories: values.workCategories
				}
			}
			
			console.log(registrationRequest);
			authenticationService.register(registrationRequest)
				.then((response) => {
					console.log(response);
					if (hasValidResponseStatus(response, [200])) {
						message.success("Успешена регистрация и вход!");
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

	/**
     * Renders Select.Option components for each profession in the professions state.
     * @returns {JSX.Element[]|null} An array of option elements or null if professions array is empty.
     */
	function buildProfessionOptions() {
		return professions.map(profession =>
			<Option key={profession} value={profession}>{profession}</Option>
		);
	}

	/**
     * Renders Select.Option components for each work category in the workCategories state.
     * @returns {JSX.Element[]|null} An array of option elements or null if workCategories array is empty.
     */
	function buildWorkCategoryOptions() {
		return workCategories.map(workCategory =>
			<Option key={workCategory} value={workCategory}>{workCategory}</Option>
		);
	}

	/**
     * Renders Select.Option components for each province in the provinces state, sorted by Bulgarian alphabet.
     * @returns {JSX.Element[]|null} An array of option elements sorted by Bulgarian alphabet or null if provinces array is empty.
     */
	function buildProvinceOptions() {
		const sortedProvinces = sortBulgarianStrings([...provinces]);

		return sortedProvinces.map(province =>
			<Option key={province} value={province}>{province}</Option>
		);
	}

	return (
		<div className="registerContainer">
			<div className="registerBackgroundContainer">
				<img className="registerBackgroundImage" src={cover} alt="" />
			</div>
			<div className="registerFormContainer">
				<div className="registerFormTitle">
					<div className="registerFormLogo">
						<Logo />
					</div>
					<span className="registerFormTitleText">Регистрация</span>
				</div>
				<Form form={form} className="registerForm" {...registerFormItemLayout} name="register" onFinish={onFinish} onFinishFailed={onFinishFailed}>
					<Form.Item
						name="firstName"
						label="Име"
						rules={formRules.firstName}
					>
						<Input />
					</Form.Item>
					<Form.Item
						name="lastName"
						label="Фамилия"
						rules={formRules.lastName}
					>
						<Input />
					</Form.Item>
					<Form.Item
						name="email"
						label="E-mail"
						tooltip="Използва се за вход в системата."
						rules={formRules.email}
					>
						<Input />
					</Form.Item>
					<Form.Item
						name="password"
						label="Парола"
						tooltip="Използва се за вход в системата."
						hasFeedback
						rules={formRules.password}
					>
						<Input.Password />
					</Form.Item>
					<Form.Item
						name="confirmPassword"
						label="Повторете парола"
						dependencies={["password"]}
						hasFeedback
						rules={formRules.confirmPassword}
					>
						<Input.Password />
					</Form.Item>
					<Form.Item
						name="phoneNumber"
						label="Телефонене номер"
						rules={formRules.phoneNumber}
					>
						<Input />
					</Form.Item>
					<Form.Item
						name="gender"
						label="Пол"
						rules={formRules.gender}
					>
						<Select placeholder="Избери пол">
							<Option value="Мъж">Мъж</Option>
							<Option value="FEMALE">Жена</Option>
						</Select>
					</Form.Item>
					<Form.Item
						name="profession"
						label="Професия"
						rules={formRules.profession}
					>
						<Select placeholder="Избери професия">
							{professions.length ? buildProfessionOptions() : null}
						</Select>
					</Form.Item>
					<Form.Item
						name="workCategories"
						label="Специализации"
						rules={formRules.workCategories}
					>
						<Select mode="multiple" disabled={!workCategoriesEnabled} placeholder="Избери специализации">
							{workCategories.length ? buildWorkCategoryOptions() : null}
						</Select>
					</Form.Item>
					<Form.Item
						name="workProvinces"
						label="Области на работа"
						rules={formRules.workProvinces}
					>
						<Select mode="multiple" placeholder="Избери области на работа">
							{provinces.length ? buildProvinceOptions() : null}
						</Select>
					</Form.Item>
					<Form.Item
						name="acceptTermsOfService"
						className="registerTermsOfService"
						{...registerTailFormItemLayout}
						valuePropName="checked"
						rules={formRules.acceptTermsOfService}
					>
						<Checkbox>
							Прочетох <Link>условията </Link> и се съгласявам с тях {/* the link should be a Ant Modal */}
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
