import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Radio, DatePicker, Upload, Spin, message, InputNumber } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useAuth } from '../../AuthContext';
import memberApi from '../../api/memberApi';
import ModalChangePassword from './ModalChangePassword';

const Profile = () => {
    const { user, login } = useAuth();
    const [loading, setLoading] = useState(true);
    const [form] = Form.useForm();
    const [passwordModalVisible, setPasswordModalVisible] = useState(false);
    const [updateLoading, setUpdateLoading] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await memberApi.getProfile();
                form.setFieldsValue(response?.data);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch profile:", error);
                setLoading(false);
            }
        };

        fetchProfile();
    }, [form]);

    const handleSave = async () => {
        try {
            const values = await form.validateFields();
            setUpdateLoading(true);

            const updatedUser = {
                ...user,
                name: values.name,
                YOB: values.YOB,
            };

            const response = await memberApi.updateProfile(updatedUser);
            if (response.status === 200) {
                login(updatedUser);
                localStorage.setItem("user", JSON.stringify(updatedUser));
                message.success("Profile updated successfully!");
            } else {
                message.error("Failed to update profile.");
            }
        } catch (error) {
            console.error("Failed to update profile:", error);
            message.error("Failed to update profile. Please try again.");
        } finally {
            setUpdateLoading(false);
        }
    };

    if (loading) {
        return <Spin />;
    }

    return (
        <div style={{ margin: '40px auto', padding: '20px', border: '1px solid #d9d9d9', borderRadius: '10px', backgroundColor: '#fff' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '24px' }}>My profile</h2>
            <p>Manage profile information for account security</p>
            <Form form={form} layout="vertical" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ width: '60%' }}>
                        <Form.Item
                            label="Member Name"
                            name="membername"
                            rules={[{ required: true, message: 'Please input your member name!' }]}
                        >
                            <Input disabled />
                        </Form.Item>
                        <Form.Item
                            label="Name"
                            name="name"
                            rules={[{ required: true, message: 'Please input your name!' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Year of Birth"
                            name="YOB"
                            rules={[{ required: true, type: 'number', min: 1975.0, message: 'Please input your year of birth!' }]}
                        >
                            <InputNumber type="number" min={1975.0} style={{ width: '100%' }} />
                        </Form.Item>
                        <Form.Item
                            label="Email"
                            // name="email"
                            rules={[{ required: true, message: 'Please input your email!' }]}
                        >
                            <Input defaultValue="nguyenlmsa170196@fpt.edu.vn" />
                        </Form.Item>
                        <Form.Item
                            label="Phone number"
                            // name="phone"
                            rules={[{ required: true, message: 'Please input your phone number!' }]}
                        >
                            <Input defaultValue="0123456789" />
                        </Form.Item>
                        <Form.Item
                            label="Gender"
                            // name="gender"
                            rules={[{ required: true, message: 'Please select your gender!' }]}
                        >
                            <Radio.Group defaultValue="male">
                                <Radio value="male">Male</Radio>
                                <Radio value="female">Female</Radio>
                                <Radio value="other">Other</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button
                                type="primary"
                                onClick={handleSave}
                                loading={updateLoading}
                                style={{ marginRight: '10px' }}
                            >
                                Update
                            </Button>
                            <Button
                                type="default"
                                onClick={() => setPasswordModalVisible(true)}
                            >
                                Change Password
                            </Button>
                        </Form.Item>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: '12%' }}>
                        <div style={{ overflow: "hidden", width: '100px', height: '100px', marginBottom: '10px' }}>
                            <img src="https://th.bing.com/th/id/OIP.47Gn1kqUa4taPN-n8QbweQAAAA?rs=1&pid=ImgDetMain"
                                alt="Avatar"
                                style={{ borderRadius: '50%', width: "100%", height: '100%', objectFit: 'cover' }}
                            />
                        </div>
                        <Upload>
                            <Button icon={<UploadOutlined />}>Select Photo</Button>
                        </Upload>
                        <p>Maximum file size 1 MB</p>
                        <p>Type: .JPEG, .PNG</p>
                    </div>

                </div>
            </Form>

            <ModalChangePassword
                visible={passwordModalVisible}
                onClose={() => setPasswordModalVisible(false)}
            />
        </div>
    );
};

export default Profile;
