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
    unitCount: number; // số bộ phận
    configuredItems: number;
    totalItems: number;
    progress: number;
    status: "done" | "partial" | "pending";
    path: string;
}

const DashboardPage = () => {
    // 1 công ty - 1 phòng ban - 4 bộ phận
    // Phòng ban có 6 mục cần cấu hình

    const configured = 4;
    const total = 6;
    const progress = Math.round((configured / total) * 100);

    const departments: Department[] = [
        {
            key: "hr",
            name: "Phòng Hành chính - Nhân sự",
            unitCount: 4,
            configuredItems: configured,
            totalItems: total,
            progress: progress,
            status:
                progress === 100
                    ? "done"
                    : progress === 0
                        ? "pending"
                        : "partial",
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
            title: "Tiến độ cấu hình",
            dataIndex: "progress",
            width: 300,
            render: (_: any, record: Department) => (
                <div>
                    <Progress
                        percent={record.progress}
                        size="small"
                        status={
                            record.progress === 100
                                ? "success"
                                : record.progress === 0
                                    ? "exception"
                                    : "active"
                        }
                    />
                    <div style={{ fontSize: 12, marginTop: 4 }}>
                        {record.configuredItems}/{record.totalItems} mục đã cấu hình
                    </div>
                </div>
            ),
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            width: 160,
            render: (status: string) =>
                status === "done" ? (
                    <Tag color="success">Đã hoàn tất</Tag>
                ) : status === "partial" ? (
                    <Tag color="processing">Đang cấu hình</Tag>
                ) : (
                    <Tag>Chưa cấu hình</Tag>
                ),
        },
        {
            title: "",
            key: "action",
            width: 120,
            render: (_: any, record: Department) => (
                <Link to={record.path}>
                    <Button type="link">Cấu hình</Button>
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
                    Tổng quan cấu trúc tổ chức và trạng thái cấu hình phòng ban
                </Text>
            </div>

            {/* KPI */}
            <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
                <Col xs={24} sm={8}>
                    <Card bordered={false}>
                        <BankOutlined style={{ fontSize: 26 }} />
                        <div style={{ marginTop: 12 }}>
                            <Text type="secondary">Công ty</Text>
                            <Title level={3} style={{ margin: 0 }}>
                                1
                            </Title>
                        </div>
                    </Card>
                </Col>

                <Col xs={24} sm={8}>
                    <Card bordered={false}>
                        <ApartmentOutlined style={{ fontSize: 26 }} />
                        <div style={{ marginTop: 12 }}>
                            <Text type="secondary">Phòng ban</Text>
                            <Title level={3} style={{ margin: 0 }}>
                                1
                            </Title>
                        </div>
                    </Card>
                </Col>

                <Col xs={24} sm={8}>
                    <Card bordered={false}>
                        <TeamOutlined style={{ fontSize: 26 }} />
                        <div style={{ marginTop: 12 }}>
                            <Text type="secondary">Bộ phận</Text>
                            <Title level={3} style={{ margin: 0 }}>
                                4
                            </Title>
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* Tổng tiến độ */}
            <Card bordered={false} style={{ marginBottom: 32 }}>
                <Row align="middle" justify="space-between">
                    <Col>
                        <Title level={4} style={{ marginBottom: 4 }}>
                            Tỷ lệ hoàn tất cấu hình
                        </Title>
                        <Text type="secondary">
                            Dựa trên 6 mục cấu hình bắt buộc
                        </Text>
                    </Col>
                    <Col>
                        <Progress
                            type="circle"
                            percent={progress}
                            width={120}
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