import React, { useState } from 'react';
import { 
    Modal, 
    Form, 
    Input, 
    Select, 
    Upload, 
    Button, 
    Radio, 
    Progress, 
    Alert, 
    message,
    Row,
    Col,
    Card 
} from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { AlbumService } from '../../services/AlbumService';
import './UploadAlbumModal.less';

const { Dragger } = Upload;
const { Option } = Select;

// ---------------- Form rules (static) ----------------
const TITLE_MAX = 50;
export const uploadAlbumFormRules = {
    title: [
        { max: TITLE_MAX, message: `Заглавието не може да надвишава ${TITLE_MAX} символа` }
    ],
    category: [
        { required: true, message: 'Моля изберете категория' }
    ]
};

function getTitleRules(isEditMode) {
    const base = [...uploadAlbumFormRules.title];
    if (!isEditMode) {
        base.unshift({ required: true, message: 'Моля въведете заглавие на албума' });
    }
    return base;
}

function getCategoryRules(isEditMode) {
    if (isEditMode) {
        return [];
    }
    return uploadAlbumFormRules.category;
}

/**
 * UploadAlbumModal component for creating/editing albums and uploading media files.
 * 
 * A focused modal for both creating and editing albums. It encapsulates:
 * 1) Form state (title, category),
 * 2) File selection and validation,
 * 3) Generating pre-signed upload links and uploading files,
 * 4) Creating media records on the backend,
 * 5) Cover image selection in two modes when editing: from existing media or from newly added files.
 * 
 * Edit mode specifics:
 * - Title is optional; files are optional.
 * - Cover can be left unchanged, set to an existing media, or set to one of the newly uploaded files.
 * 
 * All long sequences are split into small helpers for clarity and easier testing.
 */
const UploadAlbumModal = ({ 
    visible, 
    onCancel, 
    onSuccess, 
    categories = [],
    editMode = false,
    initialData = null
}) => {
    console.log("UploadAlbumModal - Received categories:", categories);
    console.log("UploadAlbumModal - Edit mode:", editMode, "Initial data:", initialData);
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);
    const [selectedCover, setSelectedCover] = useState(null); // index in new files list
    const [coverSource, setCoverSource] = useState('none'); // none | existing | new
    const [selectedExistingCoverId, setSelectedExistingCoverId] = useState(null); // UUID from existing media
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadStatus, setUploadStatus] = useState('');
    const [uploadErrors, setUploadErrors] = useState([]);
    
    const albumService = new AlbumService();

    // Initialize form with existing data when in edit mode
    React.useEffect(() => {
        if (editMode && initialData && visible) {
            form.setFieldsValue({
                title: initialData.title,
                category: initialData.category
            });
        } else if (!editMode && visible) {
            form.resetFields();
        }
    }, [editMode, initialData, visible, form]);

    // ---------- Handlers ----------
    // Filters only images and manages the 'new cover' selection index
    const handleFileChange = ({ fileList: newFileList }) => {
        const imageFiles = newFileList.filter(file => {
            const isImage = file.type?.startsWith('image/');
            if (!isImage && file.originFileObj) {
                message.warning(`${file.name} не е изображение и ще бъде игнориран.`);
            }
            return isImage;
        });

        setFileList(imageFiles);

        if (selectedCover !== null && selectedCover >= imageFiles.length) {
            setSelectedCover(null);
        }
        if (imageFiles.length > 0 && selectedCover === null) {
            setSelectedCover(0);
        }
    };

    // Custom upload handler to prevent automatic upload
    const handleBeforeUpload = () => false; // Prevent automatic upload

    // Handle cover photo selection
    const handleCoverSelection = (index) => {
        setSelectedCover(index);
        setCoverSource('new');
    };

    const handleExistingCoverSelection = (mediaId) => {
        setSelectedExistingCoverId(mediaId);
        setCoverSource('existing');
    };

    // Progress callback for upload process
    const handleUploadProgress = (fileIndex, status, error) => {
        switch (status) {
            case 'getting-urls':
                setUploadStatus('Getting upload URLs...');
                setUploadProgress(10);
                break;
            case 'uploading':
                setUploadStatus(`Uploading file ${fileIndex + 1} of ${fileList.length}...`);
                setUploadProgress(20 + (fileIndex / fileList.length) * 60);
                break;
            case 'uploaded':
                setUploadProgress(20 + ((fileIndex + 1) / fileList.length) * 60);
                break;
            case 'creating-records':
                setUploadStatus('Creating media records...');
                setUploadProgress(85);
                break;
            case 'completed':
                setUploadStatus('Upload completed successfully!');
                setUploadProgress(100);
                break;
            case 'failed':
                setUploadErrors(prev => [...prev, `${fileList[fileIndex]?.name}: ${error}`]);
                break;
            case 'error':
                setUploadStatus(`Upload failed: ${error}`);
                break;
        }
    };

    // ---------- Helpers ----------
    function shouldRequireFiles() {
        return !editMode && fileList.length === 0;
    }

    async function createOrUpdateAlbumTitle(values) {
        if (editMode) {
            const response = await albumService.updateAlbum(initialData.albumId, { title: values.title });
            return { albumId: initialData.albumId, response };
        }
        // create mode requires a cover selection
        if (selectedCover === null || !fileList[selectedCover]) {
            message.error('Изберете корица на албума преди да продължите.');
            return { error: true };
        }
        const preAllocatedCoverIdLocal = albumService.generateUUID();
        const response = await albumService.createAlbum({ title: values.title, coverMediaId: preAllocatedCoverIdLocal });
        return { albumId: response?.data?.albumId, response, preAllocatedCoverId: preAllocatedCoverIdLocal };
    }

    function buildMediaIdsForUpload(files, preAllocatedCoverIdLocal) {
        if (files.length === 0) {
            return [];
        }

        if (editMode) {
            const preCover = coverSource === 'new' && selectedCover !== null ? albumService.generateUUID() : null;
            if (preCover) preAllocatedCoverIdLocal.value = preCover; // pass by ref wrapper
            return files.map((_, idx) => (coverSource === 'new' && selectedCover === idx && preCover) ? preCover : albumService.generateUUID());
        }

        return files.map((_, idx) => idx === selectedCover ? preAllocatedCoverIdLocal.value : albumService.generateUUID());
    }

    async function uploadSelectedFiles(albumId, preAllocatedCoverIdLocal) {
        if (fileList.length === 0) {
            return { successful: [], failed: [], totalFiles: 0 };
        }

        const files = fileList.map(f => f.originFileObj);
        const ref = { value: preAllocatedCoverIdLocal ?? null };
        const mediaIds = buildMediaIdsForUpload(files, ref);
        
        const results = await albumService.uploadFiles(albumId, files, handleUploadProgress, mediaIds);

        return { results, preAllocatedCoverId: ref.value };
    }

    async function updateCoverIfNeeded(albumId, preAllocatedCoverIdLocal) {
        if (!editMode) 
            return;
        if (coverSource === 'existing' && selectedExistingCoverId) {
            await albumService.updateAlbum(albumId, { coverMediaId: selectedExistingCoverId });
        } else if (coverSource === 'new' && preAllocatedCoverIdLocal) {
            await albumService.updateAlbum(albumId, { coverMediaId: preAllocatedCoverIdLocal });
        }
    }

    function resetAndNotify(albumResponse, uploadResults, values) {
        const uploadedCount = uploadResults?.successful?.length || 0;
        const closeModalAndNotifyParent = () => {
            handleCancel();
            onSuccess({ album: albumResponse.data, uploadResults });
        };

        // Only show a short delay when uploads occurred, so users can see 100% on the progress bar
        if (uploadedCount > 0) {
            setTimeout(closeModalAndNotifyParent, 1000);
        } else {
            closeModalAndNotifyParent();
        }

        if (editMode) {
            message.success(`Албумът "${values.title}" беше обновен успешно!${uploadedCount > 0 ? ` ${uploadedCount} нови файла бяха добавени.` : ''}`);
        } else {
            message.success(`Албумът "${values.title}" беше създаден успешно! ${uploadedCount} файла бяха качени.`);
        }
        if (uploadResults?.failed?.length > 0) {
            message.warning(`${uploadResults.failed.length} файла не бяха качени успешно.`);
        }
    }

    // ---------- Submit ----------
    const handleSubmit = async () => {
        try {
            // Validate form
            const values = await form.validateFields();
            
            // In edit mode, file upload is optional
            if (shouldRequireFiles()) {
                message.error('Моля изберете поне един файл с изображение за качване.');
                return;
            }

            setUploading(true);
            setUploadProgress(0);
            setUploadStatus(editMode ? 'Updating album...' : 'Creating album...');
            setUploadErrors([]);

            const { albumId, response: albumResponse, preAllocatedCoverId } = await createOrUpdateAlbumTitle(values);
            if (!albumResponse || !albumResponse.data || !albumId) throw new Error(editMode ? 'Failed to update album' : 'Failed to create album');

            console.log(editMode ? "Updated albumId:" : "Created albumId:", albumId);
            setUploadProgress(editMode ? 20 : 5);

            // Step 2: Upload files (only if there are files to upload)
            let uploadResults = { successful: [], failed: [], totalFiles: 0 };
            const uploadOutcome = await uploadSelectedFiles(albumId, preAllocatedCoverId);
            uploadResults = uploadOutcome.results || uploadResults;
            const effectiveCoverId = uploadOutcome.preAllocatedCoverId ?? preAllocatedCoverId;

            // Step 3: If editing and a cover is selected, update the cover after uploads
            await updateCoverIfNeeded(albumId, effectiveCoverId);
            
            // Success!
            setUploadProgress(100);
            setUploadStatus(editMode ? 'Album updated successfully!' : 'Album created successfully!');
            resetAndNotify(albumResponse, uploadResults, values);

        } catch (error) {
            console.error(editMode ? 'Update failed:' : 'Upload failed:', error);
            setUploadStatus(editMode ? 'Update failed' : 'Upload failed');
            setUploadProgress(0);
            message.error(editMode ? 'Неуспешно обновяване на албум. Моля опитайте отново.' : 'Неуспешно създаване на албум. Моля опитайте отново.');
        } finally {
            setUploading(false);
        }
    };

    // Handle modal cancellation
    const handleCancel = () => {
        if (!uploading) {
            form.resetFields();
            setFileList([]);
            setSelectedCover(null);
            setUploadProgress(0);
            setUploadStatus('');
            setUploadErrors([]);
            onCancel();
        }
    };

    // ---------- Render helpers ----------
    const renderTitleField = () => (
        <Form.Item
            name="title"
            label="Заглавие на албума"
            rules={getTitleRules(editMode)}
        >
            <Input placeholder="Въведете заглавие на албума" />
        </Form.Item>
    );

    const renderCategoryField = () => (
        <Form.Item name="category" label="Категория" rules={getCategoryRules(editMode)}> 
            <Select placeholder="Изберете категория на албума">
                {Array.isArray(categories) && categories.map((category, index) => (
                    <Option key={index + 1} value={index + 1}>{category}</Option>
                ))}
            </Select>
        </Form.Item>
    );

    const renderUploader = () => (
        <Form.Item label={editMode ? 'Добави нови изображения (по избор)' : 'Качване на изображения'}>
            <Dragger name="files" multiple fileList={fileList} onChange={handleFileChange} beforeUpload={handleBeforeUpload} accept="image/*" disabled={uploading}>
                <p className="ant-upload-drag-icon"><InboxOutlined /></p>
                <p className="ant-upload-text">Кликнете или плъзнете изображения в тази зона за качване</p>
                <p className="ant-upload-hint">Поддържа множество файлове с изображения. Приемат се само файлове с изображения.</p>
            </Dragger>
        </Form.Item>
    );

    const renderCreateModeCoverPicker = () => (!editMode && fileList.length > 0 ? (
        <Form.Item label="Изберете корицa">
            <div className="cover-selection-container">
                <Row gutter={[16, 16]}>
                    {fileList.map((file, index) => (
                        <Col key={file.uid} xs={12} sm={8} md={6}>
                            <Card size="small" hoverable onClick={() => handleCoverSelection(index)} className={selectedCover === index ? 'selected-cover' : ''}
                                  cover={<div className="cover-image-container"><img src={file.originFileObj ? URL.createObjectURL(file.originFileObj) : ''} alt={file.name} className="cover-image-preview" /><Radio checked={selectedCover === index} className="cover-radio" /></div>}>
                                <Card.Meta title={file.name} />
                            </Card>
                        </Col>
                    ))}
                </Row>
            </div>
        </Form.Item>
    ) : null);

    const renderCoverModeOptions = () => (editMode ? (
        <Form.Item label="Корица на албума (по избор)">
            <Radio.Group onChange={(e) => setCoverSource(e.target.value)} value={coverSource}>
                <Radio value="none">Без промяна</Radio>
                <Radio value="existing">Съществуваща снимка</Radio>
                <Radio value="new" disabled={fileList.length === 0}>От новите снимки</Radio>
            </Radio.Group>
        </Form.Item>
    ) : null);

    const renderExistingCoverPicker = () => (editMode && coverSource === 'existing' && Array.isArray(initialData?.existingMedia) && initialData.existingMedia.length > 0 ? (
        <Form.Item label="Изберете съществуваща снимка за корица">
            <div className="cover-selection-container">
                <Row gutter={[16, 16]}>
                    {initialData.existingMedia.map((m) => (
                        <Col key={m.mediaId} xs={12} sm={8} md={6}>
                            <Card size="small" hoverable onClick={() => handleExistingCoverSelection(m.mediaId)} className={selectedExistingCoverId === m.mediaId ? 'selected-cover' : ''}
                                  cover={<div className="cover-image-container"><img src={m.coverImageSrc} alt={m.fileName || m.mediaId} className="cover-image-preview" /><Radio checked={selectedExistingCoverId === m.mediaId} className="cover-radio" /></div>}>
                                <Card.Meta title={m.fileName || m.mediaId} />
                            </Card>
                        </Col>
                    ))}
                </Row>
            </div>
        </Form.Item>
    ) : null);

    const renderNewCoverPicker = () => (editMode && coverSource === 'new' && fileList.length > 0 ? (
        <Form.Item label="Изберете нова снимка за корица">
            <div className="cover-selection-container">
                <Row gutter={[16, 16]}>
                    {fileList.map((file, index) => (
                        <Col key={file.uid} xs={12} sm={8} md={6}>
                            <Card size="small" hoverable onClick={() => handleCoverSelection(index)} className={selectedCover === index ? 'selected-cover' : ''}
                                  cover={<div className="cover-image-container"><img src={file.originFileObj ? URL.createObjectURL(file.originFileObj) : ''} alt={file.name} className="cover-image-preview" /><Radio checked={selectedCover === index} className="cover-radio" /></div>}>
                                <Card.Meta title={file.name} />
                            </Card>
                        </Col>
                    ))}
                </Row>
            </div>
        </Form.Item>
    ) : null);

    const renderUploadProgress = () => (uploading ? (
        <Form.Item>
            <Alert message="Качване на албум" type="info" showIcon description={<div><div>{uploadStatus}</div><Progress percent={Math.round(uploadProgress)} status={uploadProgress === 100 ? 'success' : 'active'} /></div>} />
        </Form.Item>
    ) : null);

    const renderUploadErrors = () => (uploadErrors.length > 0 ? (
        <Form.Item>
            <Alert message="Някои файлове не бяха качени успешно" type="warning" showIcon description={<ul>{uploadErrors.map((e, i) => (<li key={i}>{e}</li>))}</ul>} />
        </Form.Item>
    ) : null);

    // ---------- Render ----------
    return (
        <Modal
            title={editMode ? "Редактирай албум" : "Добави нов албум"}
            open={visible}
            onCancel={handleCancel}
            width={800}
            footer={[
                <Button key="cancel" onClick={handleCancel} disabled={uploading}>
                    Отказ
                </Button>,
                <Button
                    key="upload"
                    type="primary"
                    loading={uploading}
                    onClick={handleSubmit}
                    disabled={!editMode && fileList.length === 0}
                >
                    {editMode ? "Обнови албум" : "Създай албум"}
                </Button>
            ]}
        >
            <Form form={form} layout="vertical" disabled={uploading}>
                {renderTitleField()}
                {renderCategoryField()}
                {renderUploader()}
                {renderCreateModeCoverPicker()}
                {renderCoverModeOptions()}
                {renderExistingCoverPicker()}
                {renderNewCoverPicker()}
                {renderUploadProgress()}
                {renderUploadErrors()}
            </Form>
        </Modal>
    );
};

export default UploadAlbumModal;
