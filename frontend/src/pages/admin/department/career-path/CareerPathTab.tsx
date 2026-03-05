import { useState } from "react";
import {
    Space,
    Tag,
    Collapse,
    Skeleton,
    Card,
    Typography,
    Button,
    Modal,
    message,
} from "antd";
import {
    EditOutlined,
    EyeOutlined,
    DownOutlined,
    ReloadOutlined,
    DeleteOutlined,
    FilterOutlined,
    AppstoreOutlined,
    ApartmentOutlined,
} from "@ant-design/icons";
import type { ProColumns } from "@ant-design/pro-components";
import { useParams, useSearchParams } from "react-router-dom";

import PageContainer from "@/components/common/data-table/PageContainer";
import DataTable from "@/components/common/data-table";
import SearchFilter from "@/components/common/filter/SearchFilter";

import {
    useCareerPathsByDepartmentQuery,
    useCareerPathsGroupedByBandQuery,
} from "@/hooks/useCareerPaths";
import type { ICareerPath, IResCareerPathBandGroup } from "@/types/backend";

import ModalCareerPath from "./ModalCareerPath";
import ViewCareerPath from "./ViewCareerPath";

const { Text } = Typography;

type ViewMode = "department" | "band";

const parseBandNumber = (band: string): number => {
    const match = band?.match(/\d+/);
    return match ? parseInt(match[0], 10) : 999;
};

const parseLevelNumber = (code?: string | null): number => {
    if (!code) return 999;
    const match = code.match(/\d+/);
    return match ? parseInt(match[0], 10) : 999;
};

const C = {
    pink: "#e91e8c",
    white: "#ffffff",
    gray50: "#f9fafb",
    gray100: "#f3f4f6",
    gray200: "#e5e7eb",
    gray400: "#9ca3af",
    gray500: "#6b7280",
    gray600: "#4b5563",
    gray700: "#374151",
    gray800: "#1f2937",
};

// ── Pill Tab Switcher ──────────────────────────────────────────────
const ViewModeSwitcher = ({
    value,
    onChange,
}: {
    value: ViewMode;
    onChange: (v: ViewMode) => void;
}) => {
    const tabs: { value: ViewMode; label: string; icon: React.ReactNode }[] = [
        { value: "department", label: "Theo Phòng ban", icon: <AppstoreOutlined /> },
        { value: "band", label: "Theo Cấp bậc (Band)", icon: <ApartmentOutlined /> },
    ];

    return (
        <div
            style={{
                display: "inline-flex",
                background: C.gray100,
                borderRadius: 999,
                padding: 4,
                gap: 2,
            }}
        >
            {tabs.map((tab) => {
                const isActive = value === tab.value;
                return (
                    <button
                        key={tab.value}
                        onClick={() => onChange(tab.value)}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 7,
                            padding: "7px 18px",
                            borderRadius: 999,
                            border: "none",
                            cursor: "pointer",
                            fontWeight: isActive ? 600 : 400,
                            fontSize: 14,
                            transition: "all 0.2s ease",
                            background: isActive ? C.white : "transparent",
                            color: isActive ? C.gray800 : C.gray400,
                            boxShadow: isActive ? "0 1px 4px rgba(0,0,0,0.10)" : "none",
                            transform: isActive ? "scale(1.01)" : "scale(1)",
                        }}
                    >
                        <span style={{ fontSize: 14, color: isActive ? C.gray700 : C.gray400 }}>
                            {tab.icon}
                        </span>
                        {tab.label}
                    </button>
                );
            })}
        </div>
    );
};

const CareerPathTab = () => {
    const { departmentId } = useParams();
    const [searchParams] = useSearchParams();
    const departmentName = searchParams.get("departmentName") || "Không xác định";

    const [openModal, setOpenModal] = useState(false);
    const [openViewDetail, setOpenViewDetail] = useState(false);
    const [dataInit, setDataInit] = useState<ICareerPath | null>(null);

    const [searchValue, setSearchValue] = useState("");
    const [viewMode, setViewMode] = useState<ViewMode>("department");
    const [showViewMode, setShowViewMode] = useState(false);

    const deptQuery = useCareerPathsByDepartmentQuery(
        viewMode === "department" ? Number(departmentId) : undefined
    );
    const bandQuery = useCareerPathsGroupedByBandQuery(
        viewMode === "band" ? Number(departmentId) : undefined
    );

    const isFetching = deptQuery.isFetching || bandQuery.isFetching;

    // Sort theo positionLevelCode trực tiếp — không dùng bandOrder/levelNumber từ API
    const sortCareerPaths = (paths: ICareerPath[]) =>
        [...paths].sort((a, b) => {
            const prefixA = (a.positionLevelCode ?? "").replace(/\d+/g, "").toUpperCase();
            const prefixB = (b.positionLevelCode ?? "").replace(/\d+/g, "").toUpperCase();
            if (prefixA !== prefixB) return prefixA.localeCompare(prefixB);
            // S1 = cao nhất → số nhỏ lên đầu
            return parseLevelNumber(a.positionLevelCode) - parseLevelNumber(b.positionLevelCode);
        });

    const sortBandGroups = (groups: IResCareerPathBandGroup[]): IResCareerPathBandGroup[] =>
        [...groups].sort((a, b) => {
            const prefixA = a.band?.replace(/\d+/g, "").toUpperCase() ?? "";
            const prefixB = b.band?.replace(/\d+/g, "").toUpperCase() ?? "";
            if (prefixA !== prefixB) return prefixA.localeCompare(prefixB);
            return parseBandNumber(a.band) - parseBandNumber(b.band);
        });

    const filterPaths = (paths: ICareerPath[]) =>
        paths.filter((item) =>
            !searchValue ||
            item.jobTitleName?.toLowerCase().includes(searchValue.toLowerCase())
        );

    let filteredData: ICareerPath[] = [];
    let groupedData: IResCareerPathBandGroup[] = [];

    if (viewMode === "department") {
        filteredData = sortCareerPaths(filterPaths(deptQuery.data ?? []));
    } else {
        const rawGroups = (bandQuery.data ?? []).map((group) => ({
            ...group,
            positions: sortCareerPaths(filterPaths(group.positions ?? [])),
        }));
        groupedData = sortBandGroups(rawGroups);
    }

    const handleReset = () => {
        setSearchValue("");
        deptQuery.refetch();
        bandQuery.refetch();
    };

    const handleDelete = (record: ICareerPath) => {
        Modal.confirm({
            title: "Xác nhận xóa",
            content: `Bạn có chắc chắn muốn xóa lộ trình "${record.jobTitleName}" không?`,
            okText: "Xóa",
            okType: "danger",
            cancelText: "Hủy",
            onOk: () => {
                message.success("Xóa lộ trình thành công!");
                deptQuery.refetch();
                bandQuery.refetch();
            },
        });
    };

    const columns: ProColumns<ICareerPath>[] = [
        {
            title: "STT",
            width: 60,
            align: "center",
            render: (_: React.ReactNode, __: ICareerPath, index: number) => index + 1,
        },
        {
            title: "Chức danh",
            dataIndex: "jobTitleName",
            render: (_: React.ReactNode, record: ICareerPath) => record.jobTitleName || "—",
        },
        {
            title: "Cấp bậc",
            dataIndex: "positionLevelCode",
            render: (_: React.ReactNode, record: ICareerPath) => (
                <Tag
                    style={{
                        color: C.gray700,
                        background: C.gray100,
                        borderColor: C.gray200,
                        fontWeight: 600,
                        borderRadius: 999,
                        padding: "2px 12px",
                    }}
                >
                    {record.positionLevelCode ?? "—"}
                </Tag>
            ),
        },
        {
            title: "Hành động",
            width: 140,
            align: "center",
            render: (_: React.ReactNode, row: ICareerPath) => (
                <Space size="small">
                    <Button
                        type="text"
                        icon={<EyeOutlined />}
                        onClick={() => { setDataInit(row); setOpenViewDetail(true); }}
                        style={{ color: C.gray500 }}
                    />
                    <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => { setDataInit(row); setOpenModal(true); }}
                        style={{ color: C.gray500 }}
                    />
                    <Button
                        type="text"
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(row)}
                        danger
                    />
                </Space>
            ),
        },
    ];

    const modeTitle =
        viewMode === "department"
            ? `Lộ trình thăng tiến theo Phòng ban — ${departmentName}`
            : `Lộ trình thăng tiến theo Cấp bậc (Band) — ${departmentName}`;

    const renderContent = () => {
        if (isFetching) return <Skeleton active paragraph={{ rows: 8 }} />;

        if (viewMode !== "band") {
            return (
                <Card
                    style={{ borderColor: C.gray200, borderRadius: 14 }}
                    bodyStyle={{ padding: 0 }}
                    className="shadow-sm"
                >
                    <DataTable<ICareerPath>
                        rowKey="id"
                        loading={isFetching}
                        columns={columns}
                        dataSource={filteredData}
                        toolBarRender={false}
                        options={false}
                        search={false}
                        pagination={false}
                    />
                </Card>
            );
        }

        if (groupedData.length === 0) {
            return (
                <Card
                    style={{ background: C.gray50, borderColor: C.gray200, borderRadius: 14 }}
                    className="text-center py-12"
                >
                    <Text style={{ color: C.gray400, fontSize: 15 }}>
                        Không có dữ liệu lộ trình theo band
                    </Text>
                </Card>
            );
        }

        return (
            <Collapse
                accordion
                expandIconPosition="end"
                style={{ background: "transparent", border: "none" }}
                expandIcon={({ isActive }) => (
                    <DownOutlined
                        style={{
                            fontSize: 13,
                            color: C.gray400,
                            transform: isActive ? "rotate(180deg)" : "rotate(0deg)",
                            transition: "transform 0.25s ease",
                        }}
                    />
                )}
            >
                {groupedData.map((group: IResCareerPathBandGroup) => (
                    <Collapse.Panel
                        key={group.band}
                        header={
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <span
                                    style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        padding: "3px 14px",
                                        borderRadius: 999,
                                        background: C.pink,
                                        color: C.white,
                                        fontWeight: 700,
                                        fontSize: 13,
                                        letterSpacing: 0.5,
                                    }}
                                >
                                    {group.band}
                                </span>
                                <Text style={{ color: C.gray400, fontSize: 13 }}>
                                    Thứ tự {group.bandOrder}
                                </Text>
                            </div>
                        }
                        style={{
                            marginBottom: 10,
                            background: C.white,
                            borderRadius: 12,
                            border: `1px solid ${C.gray200}`,
                            overflow: "hidden",
                            boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                        }}
                    >
                        <DataTable<ICareerPath>
                            rowKey="id"
                            loading={isFetching}
                            columns={columns}
                            dataSource={group.positions}
                            pagination={false}
                            toolBarRender={false}
                        />
                    </Collapse.Panel>
                ))}
            </Collapse>
        );
    };

    return (
        <div>
            <PageContainer
                title={modeTitle}
                extra={
                    <Button
                        icon={<ReloadOutlined />}
                        onClick={handleReset}
                        style={{
                            borderColor: C.gray200,
                            color: C.gray700,
                            borderRadius: 8,
                            fontWeight: 500,
                        }}
                    >
                        Làm mới
                    </Button>
                }
            >
                <div
                    style={{
                        background: C.white,
                        border: `1px solid ${C.gray200}`,
                        borderRadius: 14,
                        padding: "20px 24px",
                        marginBottom: 18,
                        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                    }}
                >
                    <SearchFilter
                        searchPlaceholder="Tìm theo chức danh hoặc cấp bậc…"
                        addLabel="Thêm lộ trình mới"
                        showFilterButton={false}
                        onSearch={setSearchValue}
                        onReset={handleReset}
                        onAddClick={() => { setDataInit(null); setOpenModal(true); }}
                    />

                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            marginTop: 14,
                        }}
                    >
                        <Button
                            icon={<FilterOutlined />}
                            onClick={() => setShowViewMode(!showViewMode)}
                            style={{
                                borderColor: showViewMode ? C.gray400 : C.gray200,
                                color: C.gray700,
                                background: showViewMode ? C.gray100 : C.white,
                                borderRadius: 8,
                                fontWeight: showViewMode ? 600 : 400,
                            }}
                        >
                            {showViewMode ? "Ẩn tùy chọn xem" : "Tùy chọn xem"}
                        </Button>
                    </div>

                    {showViewMode && (
                        <div
                            style={{
                                marginTop: 14,
                                padding: "14px 16px",
                                background: C.gray50,
                                borderRadius: 10,
                                border: `1px solid ${C.gray200}`,
                            }}
                        >
                            <Text
                                style={{
                                    display: "block",
                                    fontSize: 12,
                                    fontWeight: 600,
                                    color: C.gray400,
                                    textTransform: "uppercase",
                                    letterSpacing: 0.6,
                                    marginBottom: 10,
                                }}
                            >
                                Chế độ xem
                            </Text>
                            <ViewModeSwitcher value={viewMode} onChange={(v) => setViewMode(v)} />
                        </div>
                    )}
                </div>

                {renderContent()}

                <ModalCareerPath
                    openModal={openModal}
                    setOpenModal={setOpenModal}
                    dataInit={dataInit}
                    setDataInit={setDataInit}
                />

                <ViewCareerPath
                    open={openViewDetail}
                    onClose={() => setOpenViewDetail(false)}
                    dataInit={dataInit}
                    setDataInit={setDataInit}
                />
            </PageContainer>
        </div>
    );
};

export default CareerPathTab;