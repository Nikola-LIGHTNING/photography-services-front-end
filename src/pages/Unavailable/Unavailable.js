import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import './Unavailable.less';

function Unavailable() {
	const navigate = useNavigate();

	return (
		<div className="unavailableContainer">
			<div className="unavailableContent">
				<div className="unavailableMessage">Oops, something went wrong. Please, try again later!</div>
				<Button type="primary" onClick={() => navigate('/')}>
					Go to Home
				</Button>
			</div>
		</div>
	);
}

export default Unavailable;
