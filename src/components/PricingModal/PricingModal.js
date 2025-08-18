import "./PricingModal.less";
import { Modal, Input, InputNumber, Select, Form, message } from 'antd';
import { useEffect, useState } from 'react';

const { TextArea } = Input;
const { Option } = Select;

// Extracted form rules like in Register.js
const pricingFormRules = {
    title: [
        {
            required: true,
            message: 'Моля въведете заглавие',
        },
        {
            max: 30,
            message: 'Заглавието не може да бъде повече от 30 символа',
        },
    ],
    description: [
        {
            required: true,
            message: 'Моля въведете описание',
        },
        {
            max: 250,
            message: 'Описанието не може да бъде повече от 250 символа',
        },
    ],
    startingPrice: [
        {
            required: true,
            message: 'Моля въведете цена',
        },
        {
            type: 'number',
            min: 0,
            message: 'Цената трябва да бъде положително число',
        },
    ],
    currency: [
        {
            required: true,
            message: 'Моля изберете валута',
        },
    ],
    startingPriceHours: [
        {
            required: true,
            message: 'Моля въведете брой часове',
        },
        {
            type: 'number',
            min: 1,
            message: 'Часовете трябва да са поне 1',
        },
    ],
    categoryId: [
        {
            required: true,
            message: 'Моля изберете категория',
        },
    ],
};

function PricingModal({ 
    visible,
    pricing = null,
    categories = [],
    onSave,
    onCancel
}) {
    const [form] = Form.useForm();
    const [isSaving, setIsSaving] = useState(false);

    // Initialize form with existing data for editing
    const initialValues = pricing ? {
        title: pricing.title,
        description: pricing.description,
        currency: pricing.currency,
        startingPrice: pricing.startingPrice,
        startingPriceHours: pricing.startingPriceHours,
        categoryId: pricing.categoryId
    } : {
        title: '',
        description: '',
        currency: 'BGN',
        startingPrice: null,
        startingPriceHours: null,
        categoryId: null
    };

    // Keep form values in sync when `pricing` changes while modal is open
    useEffect(() => {
        if (visible) {
            form.setFieldsValue(initialValues);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pricing, visible]);

    const handleSave = async () => {
        try {
            const values = await form.validateFields();
            setIsSaving(true);

            const pricingData = {
                ...values,
                ...(pricing && { pricingId: pricing.pricingId }) // Include pricingId for edit
            };

            await onSave(pricingData);
            setIsSaving(false);
            form.resetFields();
        } catch (error) {
            setIsSaving(false);

            if (error.fields) {
                // Form validation errors
                console.error('Form validation failed:', error);
            } else {
                // Backend/API errors
                console.error('Error saving pricing:', error);
                message.error('Възникна грешка при запазване на ценоразписа. Моля опитайте отново.');
            }
        }
    };

    const handleCancel = () => {
        form.resetFields();
        onCancel();
    };

    return (
        <Modal
            title={pricing ? "Редактиране на ценоразпис" : "Нов ценоразпис"}
            open={visible}
            onOk={handleSave}
            onCancel={handleCancel}
            okText={pricing ? "Запази промените" : "Създай ценоразпис"}
            cancelText="Отказ"
            confirmLoading={isSaving}
            width={600}
            className="pricingModal"
            destroyOnClose
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={initialValues}
                className="pricingModalForm"
            >
                <Form.Item
                    name="title"
                    label="Заглавие"
                    rules={pricingFormRules.title}
                >
                    <Input
                        placeholder="Напр. Сватбен пакет"
                        maxLength={30}
                        showCount
                    />
                </Form.Item>

                <Form.Item
                    name="description"
                    label="Описание"
                    rules={pricingFormRules.description}
                >
                    <TextArea
                        rows={4}
                        placeholder="Опишете какво включва този ценоразпис..."
                        maxLength={250}
                        showCount
                    />
                </Form.Item>

                <div className="pricingModalRow">
                    <Form.Item
                        name="startingPrice"
                        label="Начална цена"
                        rules={pricingFormRules.startingPrice}
                        className="pricingModalPrice"
                    >
                        <InputNumber
                            min={0}
                            step={10}
                            placeholder="300"
                            style={{ width: '100%' }}
                        />
                    </Form.Item>

                    <Form.Item
                        name="currency"
                        label="Валута"
                        rules={pricingFormRules.currency}
                        className="pricingModalCurrency"
                    >
                        <Select placeholder="BGN">
                            <Option value="BGN">BGN</Option>
                            <Option value="EUR">EUR</Option>
                            <Option value="USD">USD</Option>
                        </Select>
                    </Form.Item>
                </div>

                <Form.Item
                    name="startingPriceHours"
                    label="Включени часове"
                    rules={pricingFormRules.startingPriceHours}
                >
                    <InputNumber
                        min={1}
                        max={24}
                        placeholder="8"
                        style={{ width: '100%' }}
                        addonAfter="часа"
                    />
                </Form.Item>

                <Form.Item
                    name="categoryId"
                    label="Категория"
                    rules={pricingFormRules.categoryId}
                >
                    <Select placeholder="Изберете категория">
                        {Array.isArray(categories) && categories.map((category, index) => (
                            <Option key={index + 1} value={index + 1}>{category}</Option>
                        ))}
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default PricingModal;
