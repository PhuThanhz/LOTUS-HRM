import React from "react";
import {
    Card,
    Col,
    Row,
    Typography,
    Tag,
    Table,
    Progress,
    Space
} from "antd";
import {
    BankOutlined,
    ApartmentOutlined,
    TeamOutlined,
    FileTextOutlined
} from "@ant-design/icons";
import { Pie, Column } from "@ant-design/plots";

const { Title, Text } = Typography;

interface Company {
    id: string;
    name: string;
}

interface DepartmentSetup {
    organizationChart: boolean;
    objectives: boolean;
    permissions: boolean;
    careerPath: boolean;
    salaryFramework: boolean;
    jobMap: boolean;
}

interface Department {
    key: string;
    companyId: string;
    name: string;
    unitCount: number;
    totalJD: number;
    completedJD: number;
    setup: DepartmentSetup;
}

const DashboardPage = () => {

    /* =========================
       MOCK DATA
    ========================= */

    const companies: Company[] = [
        { id: "c1", name: "Lotus Holding" }
    ];

    const departments: Department[] = [
        {
            key: "d1",
            companyId: "c1",
            name: "Phòng Hành chính - Nhân sự",
            unitCount: 4,
            totalJD: 4,
            completedJD: 2,
            setup: {
                organizationChart: true,
                objectives: true,
                permissions: false,
                careerPath: true,
                salaryFramework: false,
                jobMap: true
            }
        }
    ];

    /* =========================
       KPI
    ========================= */

    const companyCount = companies.length;

    const departmentCount = departments.length;

    const unitCount = departments.reduce(
        (sum, d) => sum + d.unitCount,
        0
    );

    const totalJD = departments.reduce(
        (sum, d) => sum + d.totalJD,
        0
    );

    const completedJD = departments.reduce(
        (sum, d) => sum + d.completedJD,
        0
    );

    const missingJD = totalJD - completedJD;

    /* =========================
       SETUP LOGIC
    ========================= */

    const setupFields = {
        organizationChart: "Sơ đồ tổ chức",
        objectives: "Mục tiêu – Nhiệm vụ",
        permissions: "Phân quyền",
        careerPath: "Lộ trình thăng tiến",
        salaryFramework: "Khung lương",
        jobMap: "Bản đồ chức danh"
    };

    const totalSetupItems = Object.keys(setupFields).length;

    const getCompletedSetup = (setup: DepartmentSetup) =>
        Object.values(setup).filter(Boolean).length;

    const getMissingSetup = (setup: DepartmentSetup) => {
        const missing: string[] = [];

        Object.entries(setupFields).forEach(([key, label]) => {
            if (!setup[key as keyof DepartmentSetup]) {
                missing.push(label);
            }
        });

        return missing;
    };

    /* =========================
       CHART DATA
    ========================= */

    const jdChartData = [
        { type: "JD hoàn thành", value: completedJD },
        { type: "JD còn thiếu", value: missingJD }
    ];

    const pieConfig = {
        data: jdChartData,
        angleField: "value",
        colorField: "type",
        innerRadius: 0.6,
        height: 260,
        label: false,
        legend: { position: "bottom" as const }
    };

    const setupChartData = departments.map(d => ({
        department: d.name,
        value: getCompletedSetup(d.setup)
    }));

    const columnConfig = {
        data: setupChartData,
        xField: "department",
        yField: "value",
        height: 260,
        label: {
            position: "top"
        }
    };

    /* =========================
       TABLE
    ========================= */

    const columns = [
        {
            title: "Công ty",
            dataIndex: "companyId",
            render: (companyId: string) => {
                const company = companies.find(c => c.id === companyId);
                return company?.name;
            }
        },
        {
            title: "Phòng ban",
            dataIndex: "name",
            render: (_: any, record: Department) => (
                <div>
                    <div style={{ fontWeight: 600 }}>
                        {record.name}
                    </div>
                    <Text type="secondary">
                        {record.unitCount} bộ phận
                    </Text>
                </div>
            )
        },
        {
            title: "Thiết lập",
            width: 200,
            render: (_: any, record: Department) => {

                const completed = getCompletedSetup(record.setup);

                const percent = Math.round(
                    (completed / totalSetupItems) * 100
                );

                return (
                    <>
                        <Progress percent={percent} size="small" />
                        <Text type="secondary">
                            {completed}/{totalSetupItems}
                        </Text>
                    </>
                );
            }
        },
        {
            title: "JD",
            width: 160,
            render: (_: any, record: Department) => {

                const percent = Math.round(
                    (record.completedJD / record.totalJD) * 100
                );

                return (
                    <>
                        <Progress percent={percent} size="small" />
                        <Text type="secondary">
                            {record.completedJD}/{record.totalJD}
                        </Text>
                    </>
                );
            }
        },
        {
            title: "Thiếu cấu hình",
            render: (_: any, record: Department) => {

                const missing = getMissingSetup(record.setup);

                return (
                    <Space wrap>
                        {missing.length === 0
                            ? <Tag color="success">Đã hoàn tất</Tag>
                            : missing.map(item => (
                                <Tag color="warning" key={item}>
                                    {item}
                                </Tag>
                            ))}
                    </Space>
                );
            }
        }
    ];

    return (
        <div
            style={{
                padding: 32,
                background: "#f5f7fa",
                minHeight: "100vh"
            }}
        >

            <div style={{ marginBottom: 32 }}>
                <Title level={2}>Dashboard</Title>
                <Text type="secondary">
                    Theo dõi tiến độ thiết lập phòng ban và hồ sơ JD
                </Text>
            </div>

            {/* KPI CARDS */}

            <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>

                <Col flex="1">
                    <Card style={{ height: 120 }}>
                        <BankOutlined /> Công ty
                        <Title level={3}>{companyCount}</Title>
                    </Card>
                </Col>

                <Col flex="1">
                    <Card style={{ height: 120 }}>
                        <ApartmentOutlined /> Phòng ban
                        <Title level={3}>{departmentCount}</Title>
                    </Card>
                </Col>

                <Col flex="1">
                    <Card style={{ height: 120 }}>
                        <TeamOutlined /> Bộ phận
                        <Title level={3}>{unitCount}</Title>
                    </Card>
                </Col>

                <Col flex="1">
                    <Card style={{ height: 120 }}>
                        <FileTextOutlined /> JD hoàn thành
                        <Title level={3}>{completedJD}</Title>
                    </Card>
                </Col>

                <Col flex="1">
                    <Card style={{ height: 120 }}>
                        <FileTextOutlined /> JD còn thiếu
                        <Title level={3}>{missingJD}</Title>
                    </Card>
                </Col>

            </Row>

            {/* CHART */}

            <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>

                <Col xs={24} md={12}>
                    <Card title="Tình trạng hồ sơ JD">
                        <Pie {...pieConfig} />
                    </Card>
                </Col>

                <Col xs={24} md={12}>
                    <Card title="Tiến độ thiết lập cấu hình phòng ban">
                        <Column {...columnConfig} />
                    </Card>
                </Col>

            </Row>

            {/* TABLE */}

            <Card title="Chi tiết tiến độ phòng ban">

                <Table
                    columns={columns}
                    dataSource={departments}
                    rowKey="key"
                    pagination={false}
                />

            </Card>

        </div>
    );
};

export default DashboardPage;