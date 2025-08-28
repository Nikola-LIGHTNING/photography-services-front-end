import Divider from "../Divider/Divider";
import "./TextSection.less";
import { useState, useRef, useEffect } from "react";
import { Button, Input } from "antd";
import { EditOutlined, SaveOutlined, CloseOutlined } from "@ant-design/icons";

const { TextArea } = Input;

/**
 * TextSection component displays a section with title and text content.
 * Supports inline editing for profile owners with auto-focus functionality.
 * 
 * @param {string} title - The section title to display
 * @param {string} text - The text content to display 
 * @param {boolean} isOwner - Whether the current user owns this content and can edit it
 * @param {function} onSave - Callback function called when saving edited text, receives newText as parameter
 */
function TextSection({ title, text, isOwner, onSave }) {
	const [isEditing, setIsEditing] = useState(false); // Controls whether the section is in edit mode
	const [editText, setEditText] = useState(""); // Temporary storage for text being edited
	const [isSaving, setIsSaving] = useState(false); // Loading state during save operation
	const textAreaRef = useRef(null); // Reference to the textarea for auto-focus

	// Auto-focus the textarea when entering edit mode
	useEffect(() => {
		if (isEditing && textAreaRef.current) {
			textAreaRef.current.focus();
		}
	}, [isEditing]);

	function handleEditClick() {
		setEditText(text || "");
		setIsEditing(true);
	}

	function handleCancelEdit() {
		setIsEditing(false);
		setEditText("");
	}

	async function handleSaveEdit() {
		if (!onSave) return;
		
		setIsSaving(true);
		try {
			await onSave(editText);
			setIsEditing(false);
			setEditText("");
		} catch (error) {
			console.error("Error saving text:", error);
		} finally {
			setIsSaving(false);
		}
	}

	return (
		<div className="textSectionContainer">
			<div className="textSectionHeader">
				<div className="textSectionTitle">{title}</div>
				{isOwner && !isEditing && (
					<Button 
						type="primary"
						icon={<EditOutlined />}
						onClick={handleEditClick}
						className="editButton"
					>
						Редактирай
					</Button>
				)}
				{isOwner && isEditing && (
					<div className="editButtonGroup">
						<Button 
							type="primary" 
							icon={<SaveOutlined />}
							onClick={handleSaveEdit}
							loading={isSaving}
						>
							Запази
						</Button>
						<Button 
							icon={<CloseOutlined />}
							onClick={handleCancelEdit}
							style={{ marginLeft: 8 }}
						>
							Отказ
						</Button>
					</div>
				)}
			</div>
			<Divider />
			{isEditing ? (
				<TextArea
					ref={textAreaRef}
					value={editText}
					onChange={(e) => setEditText(e.target.value)}
					rows={8}
					placeholder="Въведете информация за себе си..."
					className="textSectionTextArea"
				/>
			) : (
				<div className="textSectionText">{text}</div>
			)}
		</div>
	);
}

export default TextSection;
