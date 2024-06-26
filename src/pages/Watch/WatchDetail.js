import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Rate, Input, Form, message, Spin } from "antd";
import watchApi from "../../api/watchApi";
import { useAuth } from "../../AuthContext";

const DetailPage = () => {
    const { id } = useParams();
    const [watch, setWatch] = useState(null);
    const [comments, setComments] = useState([]);
    const [userCommented, setUserCommented] = useState(false);
    const [form] = Form.useForm();
    const { user } = useAuth();
    const navigation = useNavigate()

    useEffect(() => {
        const fetchWatchDetails = async () => {
            try {
                const response = await watchApi.getDetailWatch(id);
                setWatch(response?.data);
                setComments(response?.data?.comments || []);

                if (user) {
                    const userComment = response.data.comments.find(comment => comment.author._id === user._id);
                    setUserCommented(!!userComment);
                }
            } catch (error) {
                console.error("Failed to fetch watch details:", error);
            }
        };
        fetchWatchDetails();
    }, [id, user]);

    const handleCommentSubmit = async (values) => {
        if (!user) {
            message.error("You must be logged in to comment");
            return;
        }

        if (user.isAdmin) {
            message.error("Admin cannot comment");
            return;
        }

        try {
            const newComment = {
                rating: values.rating,
                content: values.content,
            };

            const response = await watchApi.addComment(id, newComment);

            setComments(response?.data?.comments);
            setUserCommented(true);

            form.resetFields();
            message.success("Comment added successfully!");
        } catch (error) {
            console.error("Failed to submit comment:", error);
            if (error.response && error.response.data) {
                message.error(error.response.data.error);
            } else {
                message.error("Failed to submit comment. Please try again.");
            }
        }
    };

    if (!watch) {
        return <Spin
            size="large"
            style={{ display: "flex", justifyContent: "center", height: "100vh", alignItems: "center" }}
        />;
    }

    return (
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
            <div style={{ display: "flex", marginBottom: "20px" }}>
                <div style={{ flex: "1", marginRight: "20px", width: '300px', height: '300px', overflow: "hidden" }}>
                    <img
                        src={watch.image}
                        alt={watch.watchName}
                        style={{ width: "100%", height: '100%', objectFit: 'cover' }}
                    />
                </div>
                <div style={{ flex: "2" }}>
                    <div style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "10px" }}>
                        {watch.watchName}
                    </div>
                    <div style={{ marginBottom: "10px" }}>
                        <span style={{ fontSize: "16px", fontWeight: "bold" }}>Brand: </span>
                        <span style={{ fontSize: "20px", fontWeight: "bold", letterSpacing: '3px' }}>{watch?.brand?.brandName || "No brand"}</span>
                    </div>
                    <div style={{ marginBottom: "10px" }}>
                        <span style={{ fontSize: "16px", fontWeight: "bold" }}>Price: </span>
                        <span style={{ fontSize: "20px", color: 'red', letterSpacing: '3px' }}>${watch.price}</span>
                    </div>
                    <div style={{ marginBottom: "20px" }}>
                        <span style={{ fontSize: "16px", fontWeight: "bold" }}>Description: </span>
                        <p>{watch.watchDescription}</p>
                    </div>
                    <div style={{ textAlign: "center", display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                            <Button type="default" style={{ width: "100px", marginRight: "10px" }}
                                onClick={() => message.success("Add to card successfully")}
                            >
                                Add to cart
                            </Button>
                            <Button type="primary" style={{ width: "100px" }}
                                onClick={() => message.success("Buy successfully")}
                            >
                                Buy now
                            </Button>
                        </div>
                        <Button type="default" style={{ width: "50px" }} danger onClick={() => navigation(-1)}>
                            Back
                        </Button>
                    </div>
                </div>
            </div>

            {/* Display all comments */}
            <div style={{ padding: "10px", border: "1px solid #e0e0e0", borderRadius: "5px" }}>
                <h2 style={{ fontSize: "20px", fontWeight: "bold", borderBottom: "1px solid #e0e0e0", paddingBottom: "10px" }}>
                    All comments
                </h2>
                {comments.map((comment, index) => (
                    <div key={index} style={{ marginTop: "10px", padding: "10px", backgroundColor: "#f0f0f0", borderRadius: "5px", display: "flex" }}>
                        <Avatar icon={<UserOutlined />} />
                        <div style={{ marginLeft: "10px" }}>
                            <div style={{ fontWeight: "bold" }}>{comment.author && comment.author.membername ? comment.author.membername : "Unknown User"}</div>
                            <Rate value={comment.rating} disabled />
                            <p>{comment.content}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Input comment */}
            {!user?.isAdmin && (
                <div style={{ marginTop: "20px", padding: "10px", border: "1px solid #e0e0e0", borderRadius: "5px" }}>
                    {userCommented ? (
                        <p style={{ textAlign: 'center', color: 'red' }}>You have already rated for this product</p>
                    ) : (
                        <>
                            <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "10px" }}>Add a Comment</h2>
                            <Form form={form} onFinish={handleCommentSubmit} layout="vertical">
                                <Form.Item name="rating" label="Rating" rules={[{ required: true, message: "Please provide a rating!" }]}>
                                    <Rate />
                                </Form.Item>
                                <Form.Item name="content" label="Comment" rules={[{ required: true, message: "Please input your comment!" }]}>
                                    <Input.TextArea rows={4} placeholder="Input your comment" />
                                </Form.Item>
                                <Form.Item style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <Button type="primary" htmlType="submit">
                                        Submit
                                    </Button>
                                </Form.Item>
                            </Form>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default DetailPage;
