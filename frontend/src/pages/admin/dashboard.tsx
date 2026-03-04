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
    DollarOutlined,
    UsergroupAddOutlined,
    TrophyOutlined,
    UserOutlined,
} from "@ant-design/icons";
import CountUp from "react-countup";
import { Link } from "react-router-dom";

const { Title, Text } = Typography;

interface DeptItem {
    key: string;
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    configuredItems: number;
    totalItems: number;
    progress: number;
    status: "done" | "partial" | "pending";
    path: string;
}

const DashboardPage = () => {
    // Dữ liệu giả lập - sau này lấy từ API
    const departments: DeptItem[] = [
        {
            key: "hanh-chinh",
            title: "Hành chính",
            subtitle: "Quản lý văn phòng, hồ sơ, nội quy, tài sản...",
            icon: <ApartmentOutlined style={{ fontSize: 28, color: "#1890ff" }} />,
            configuredItems: 8,
            totalItems: 8,
            progress: 100,
            status: "done",
            path: "/admin/departments/admin",
        },
        {
            key: "c-b",
            title: "C&B",
            subtitle: "Lương thưởng, phúc lợi, BHXH, thuế TNCN...",
            icon: <DollarOutlined style={{ fontSize: 28, color: "#52c41a" }} />,
            configuredItems: 5,
            totalItems: 9,
            progress: 56,
            status: "partial",
            path: "/admin/departments/cb",
        },
        {
            key: "tuyen-dung",
            title: "Tuyển dụng",
            subtitle: "Nguồn ứng viên, quy trình tuyển, offer letter...",
            icon: <UsergroupAddOutlined style={{ fontSize: 28, color: "#fa8c16" }} />,
            configuredItems: 3,
            totalItems: 8,
            progress: 38,
            status: "partial",
            path: "/admin/departments/recruitment",
        },
        {
            key: "dao-tao",
            title: "Đào tạo & PTNL",
            subtitle: "Chương trình đào tạo, đánh giá năng lực, kế hoạch phát triển...",
            icon: <TrophyOutlined style={{ fontSize: 28, color: "#722ed1" }} />,
            configuredItems: 6,
            totalItems: 7,
            progress: 86,
            status: "partial",
            path: "/admin/departments/training",
        },
    ];

    const totalDepartments = departments.length;
    const completedDepts = departments.filter((d) => d.status === "done").length;
    const overallProgress = Math.round(
        departments.reduce((sum, d) => sum + d.progress, 0) / totalDepartments
    );

    const columns = [
        {
            title: "Bộ phận",
            dataIndex: "title",
            render: (_: any, record: DeptItem) => (
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    {record.icon}
                    <div>
                        <div style={{ fontWeight: 600, fontSize: 16 }}>{record.title}</div>
                        <Text type="secondary" style={{ fontSize: 13 }}>
                            {record.subtitle}
                        </Text>
                    </div>
                </div>
            ),
        },
        {
            title: "Tiến độ cấu hình",
            dataIndex: "progress",
            width: 240,
            render: (progress: number, record: DeptItem) => (
                <div>
                    <Progress
                        percent={progress}
                        size="small"
                        strokeColor={
                            progress === 100
                                ? "#52c41a"
                                : progress >= 50
                                    ? "#faad14"
                                    : "#ff4d4f"
                        }
                    />
                    <div style={{ fontSize: 12, marginTop: 4, color: "#6b7280" }}>
                        {record.configuredItems} / {record.totalItems} mục đã hoàn tất
                    </div>
                </div>
            ),
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            width: 140,
            render: (status: string) =>
                status === "done" ? (
                    <Tag color="success" style={{ borderRadius: 6, padding: "4px 12px" }}>
                        Hoàn tất
                    </Tag>
                ) : status === "partial" ? (
                    <Tag color="warning" style={{ borderRadius: 6, padding: "4px 12px" }}>
                        Đang thực hiện
                    </Tag>
                ) : (
                    <Tag color="default" style={{ borderRadius: 6, padding: "4px 12px" }}>
                        Chưa bắt đầu
                    </Tag>
                ),
        },
        {
            title: "",
            key: "action",
            width: 100,
            render: (_: any, record: DeptItem) => (
                <Link to={record.path}>
                    <Button type="link">Chi tiết</Button>
                </Link>
            ),
        },
    ];

    return (
        <div style={{ padding: "32px", background: "#f0f2f5", minHeight: "100vh" }}>
            <style>{`
        .custom-card {
          border-radius: 16px;
          border: 1px solid #e8f0fe;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
          transition: all 0.3s;
        }
        .custom-card:hover {
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          transform: translateY(-2px);
        }
        .section-title {
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 20px;
        }
      `}</style>

            {/* Header */}
            <div style={{ marginBottom: 32 }}>
                <Title level={2} style={{ color: "#111827", fontWeight: 700 }}>
                    Dashboard Tổng quan
                </Title>
                <Text type="secondary" style={{ fontSize: 15 }}>
                    Theo dõi số lượng công ty, phòng ban, bộ phận & trạng thái cấu hình các mục
                </Text>
            </div>

            {/* KPI Cards */}
            <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
                <Col xs={24} sm={12} lg={6}>
                    <Card className="custom-card">
                        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                            <div
                                style={{
                                    width: 56,
                                    height: 56,
                                    background: "#e6f7ff",
                                    borderRadius: 12,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <BankOutlined style={{ fontSize: 28, color: "#1890ff" }} />
                            </div>
                            <div>
                                <Text type="secondary" style={{ display: "block", fontSize: 14 }}>
                                    Công ty
                                </Text>
                                <Title level={3} style={{ margin: 0 }}>
                                    1
                                </Title>
                            </div>
                        </div>
                    </Card>
                </Col>

                <Col xs={24} sm={12} lg={6}>
                    <Card className="custom-card">
                        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                            <div
                                style={{
                                    width: 56,
                                    height: 56,
                                    background: "#f0fdf4",
                                    borderRadius: 12,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <ApartmentOutlined style={{ fontSize: 28, color: "#52c41a" }} />
                            </div>
                            <div>
                                <Text type="secondary" style={{ display: "block", fontSize: 14 }}>
                                    Phòng ban
                                </Text>
                                <Title level={3} style={{ margin: 0 }}>
                                    1
                                </Title>
                            </div>
                        </div>
                    </Card>
                </Col>

                <Col xs={24} sm={12} lg={6}>
                    <Card className="custom-card">
                        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                            <div
                                style={{
                                    width: 56,
                                    height: 56,
                                    background: "#fefce8",
                                    borderRadius: 12,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <TeamOutlined style={{ fontSize: 28, color: "#facc15" }} />
                            </div>
                            <div>
                                <Text type="secondary" style={{ display: "block", fontSize: 14 }}>
                                    Bộ phận
                                </Text>
                                <Title level={3} style={{ margin: 0 }}>
                                    {totalDepartments}
                                </Title>
                            </div>
                        </div>
                    </Card>
                </Col>

                <Col xs={24} sm={12} lg={6}>
                    <Card className="custom-card">
                        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                            <div
                                style={{
                                    width: 56,
                                    height: 56,
                                    background: "#ecfdf5",
                                    borderRadius: 12,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <UserOutlined style={{ fontSize: 28, color: "#10b981" }} />
                            </div>
                            <div>
                                <Text type="secondary" style={{ display: "block", fontSize: 14 }}>
                                    Tổng nhân sự
                                </Text>
                                <Title level={3} style={{ margin: 0 }}>
                                    <CountUp end={31} duration={1.8} />
                                </Title>
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* Overall Progress */}
            <Card className="custom-card" style={{ marginBottom: 32 }}>
                <Row gutter={32} align="middle">
                    <Col flex="1">
                        <Title level={4} className="section-title">
                            Tiến độ cấu hình các bộ phận
                        </Title>
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            {departments.map((dept) => (
                                <div
                                    key={dept.key}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 12,
                                        padding: "8px 0",
                                    }}
                                >
                                    <div
                                        style={{
                                            width: 10,
                                            height: 10,
                                            borderRadius: "50%",
                                            background:
                                                dept.status === "done"
                                                    ? "#52c41a"
                                                    : dept.status === "partial"
                                                        ? "#faad14"
                                                        : "#d1d5db",
                                        }}
                                    />
                                    <span
                                        style={{
                                            flex: 1,
                                            fontWeight: dept.status === "done" ? 600 : 400,
                                        }}
                                    >
                                        {dept.title}
                                    </span>
                                    <Tag
                                        color={
                                            dept.status === "done"
                                                ? "success"
                                                : dept.status === "partial"
                                                    ? "warning"
                                                    : "default"
                                        }
                                        style={{ borderRadius: 6 }}
                                    >
                                        {dept.progress}%
                                    </Tag>
                                </div>
                            ))}
                        </div>
                    </Col>

                    <Col>
                        <div style={{ textAlign: "center" }}>
                            <Progress
                                type="circle"
                                percent={overallProgress}
                                size={140}
                                strokeColor={{
                                    "0%": "#1890ff",
                                    "100%": "#52c41a",
                                }}
                                format={(percent) => (
                                    <div>
                                        <div
                                            style={{
                                                fontSize: 32,
                                                fontWeight: 700,
                                                color: "#111827",
                                            }}
                                        >
                                            {percent}%
                                        </div>
                                        <div style={{ fontSize: 14, color: "#6b7280" }}>
                                            hoàn tất
                                        </div>
                                    </div>
                                )}
                            />
                        </div>
                    </Col>
                </Row>
            </Card>

            {/* Departments Table */}
            <Card className="custom-card">
                <Title level={4} className="section-title">
                    Trạng thái cấu hình chi tiết từng bộ phận
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