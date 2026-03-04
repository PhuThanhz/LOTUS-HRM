import React from "react";
import {
    Card,
    Col,
    Row,
    Progress,
    Typography,
    Tag,
    Button,
    Table,
    Space,
} from "antd";
import {
    BankOutlined,
    ApartmentOutlined,
    TeamOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Title, Text } = Typography;

interface Department {
    key: string;
    name: string;
    unitCount: number;
    configuredItems: number;
    totalConfigItems: number;
    completedProfiles: number;
    totalProfiles: number;
    path: string;
}

const DashboardPage = () => {
    // ===== DỮ LIỆU MẪU =====
    const totalConfigItems = 7;
    const configuredItems = 7; // hoàn tất cấu hình
    const totalProfiles = 5;
    const completedProfiles = 3;

    const configProgress = Math.round(
        (configuredItems / totalConfigItems) * 100
    );

    const profileProgress = Math.round(
        (completedProfiles / totalProfiles) * 100
    );

    const departments: Department[] = [
        {
            key: "hr",
            name: "Phòng Hành chính - Nhân sự",
            unitCount: 4,
            configuredItems,
            totalConfigItems,
            completedProfiles,
            totalProfiles,
            path: "/admin/departments/hr",
        },
    ];

    const columns = [
        {
            title: "Phòng ban",
            dataIndex: "name",
            render: (_: any, record: Department) => (
                <div>
                    <div style={{ fontWeight: 600, fontSize: 16 }}>
                        {record.name}
                    </div>
                    <Text type="secondary" style={{ fontSize: 13 }}>
                        {record.unitCount} bộ phận trực thuộc
                    </Text>
                </div>
            ),
        },
        {
            title: "Cấu hình hệ thống",
            width: 260,
            render: (_: any, record: Department) => {
                const percent = Math.round(
                    (record.configuredItems /
                        record.totalConfigItems) *
                    100
                );

                return (
                    <div>
                        <Progress
                            percent={percent}
                            size="small"
                            status={
                                percent === 100
                                    ? "success"
                                    : "active"
                            }
                        />
                        <div style={{ fontSize: 12, marginTop: 4 }}>
                            {record.configuredItems}/
                            {record.totalConfigItems} mục
                        </div>
                    </div>
                );
            },
        },
        {
            title: "Bộ hồ sơ",
            width: 260,
            render: (_: any, record: Department) => {
                const percent = Math.round(
                    (record.completedProfiles /
                        record.totalProfiles) *
                    100
                );

                return (
                    <div>
                        <Progress
                            percent={percent}
                            size="small"
                            strokeColor="#1677ff"
                        />
                        <div style={{ fontSize: 12, marginTop: 4 }}>
                            {record.completedProfiles}/
                            {record.totalProfiles} bộ hoàn thành
                        </div>
                    </div>
                );
            },
        },
        {
            title: "Trạng thái",
            width: 150,
            render: (_: any, record: Department) => {
                const percent = Math.round(
                    (record.configuredItems /
                        record.totalConfigItems) *
                    100
                );

                return percent === 100 ? (
                    <Tag color="success">Hoàn tất</Tag>
                ) : (
                    <Tag color="processing">
                        Đang cấu hình
                    </Tag>
                );
            },
        },
        {
            title: "",
            width: 120,
            render: (_: any, record: Department) => (
                <Link to={record.path}>
                    <Button type="link">Xem chi tiết</Button>
                </Link>
            ),
        },
    ];

    return (
        <div
            style={{
                padding: 32,
                background: "#f5f7fa",
                minHeight: "100vh",
            }}
        >
            {/* Header */}
            <div style={{ marginBottom: 32 }}>
                <Title level={2} style={{ marginBottom: 6 }}>
                    Dashboard
                </Title>
                <Text type="secondary">
                    Tổng quan cấu trúc và trạng thái phòng ban
                </Text>
            </div>

            {/* KPI */}
            <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
                <Col xs={24} sm={8}>
                    <Card bordered={false}>
                        <Space direction="vertical">
                            <BankOutlined style={{ fontSize: 26 }} />
                            <Text type="secondary">
                                Công ty
                            </Text>
                            <Title level={3} style={{ margin: 0 }}>
                                1
                            </Title>
                        </Space>
                    </Card>
                </Col>

                <Col xs={24} sm={8}>
                    <Card bordered={false}>
                        <Space direction="vertical">
                            <ApartmentOutlined
                                style={{ fontSize: 26 }}
                            />
                            <Text type="secondary">
                                Phòng ban
                            </Text>
                            <Title level={3} style={{ margin: 0 }}>
                                1
                            </Title>
                        </Space>
                    </Card>
                </Col>

                <Col xs={24} sm={8}>
                    <Card bordered={false}>
                        <Space direction="vertical">
                            <TeamOutlined
                                style={{ fontSize: 26 }}
                            />
                            <Text type="secondary">
                                Bộ phận
                            </Text>
                            <Title level={3} style={{ margin: 0 }}>
                                4
                            </Title>
                        </Space>
                    </Card>
                </Col>
            </Row>

            {/* Tổng tiến độ cấu hình */}
            <Card bordered={false} style={{ marginBottom: 32 }}>
                <Row align="middle" justify="space-between">
                    <Col>
                        <Title level={4} style={{ marginBottom: 4 }}>
                            Tiến độ cấu hình phòng ban
                        </Title>
                        <Text type="secondary">
                            7/7 mục đã cấu hình
                        </Text>
                    </Col>
                    <Col>
                        <Progress
                            type="circle"
                            percent={configProgress}
                            width={120}
                            status="success"
                        />
                    </Col>
                </Row>
            </Card>

            {/* Bảng phòng ban */}
            <Card bordered={false}>
                <Title level={4} style={{ marginBottom: 20 }}>
                    Danh sách phòng ban
                </Title>
                <Table
                    columns={columns}
                    dataSource={departments}
                    pagination={false}
                    rowKey="key"
                />
            </Card>
        </div>
    );
};

export default DashboardPage;