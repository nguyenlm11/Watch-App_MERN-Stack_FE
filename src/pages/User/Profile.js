import React, { useEffect, useState } from 'react';
import { Form, Input, Button, message, Spin } from 'antd';
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
        <div className="container mx-auto my-16">
            <h2 className="text-2xl font-semibold mb-6">Update Profile</h2>
            <Form form={form} layout="vertical">
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
                    rules={[{ required: true, message: 'Please input your year of birth!' }]}
                >
                    <Input type="number" />
                </Form.Item>
                <Form.Item style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        style={{ marginRight: '10px' }}
                        type="primary"
                        onClick={handleSave}
                        loading={updateLoading}
                    >
                        Update Profile
                    </Button>
                    <Button
                        type="default"
                        onClick={() => setPasswordModalVisible(true)}
                        className="ml-2"
                    >
                        Change Password
                    </Button>
                </Form.Item>
            </Form>

            <ModalChangePassword
                visible={passwordModalVisible}
                onClose={() => setPasswordModalVisible(false)}
            />
        </div>
    );
};

export default Profile;
