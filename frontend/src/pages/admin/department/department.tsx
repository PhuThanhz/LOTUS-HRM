import { useEffect, useRef, useState } from "react";
import { Space, Badge, Popconfirm, Button, Dropdown, Modal, Table, Typography } from "antd";
import type { MenuProps } from "antd";
import {
    MoreOutlined,
    EyeOutlined,
    EditOutlined,
    DeleteOutlined,
    DollarOutlined,
    ApartmentOutlined,
    RiseOutlined,
    AimOutlined,
    LockOutlined,
    FileTextOutlined,
    TeamOutlined,
} from "@ant-design/icons";
import type { ProColumns, ActionType } from "@ant-design/pro-components";
import queryString from "query-string";
import { useNavigate } from "react-router-dom";
import PageContainer from "@/components/common/data-table/PageContainer";
import DataTable from "@/components/common/data-table";
import SearchFilter from "@/components/common/filter/SearchFilter";
import type { IDepartment } from "@/types/backend";
import { PAGINATION_CONFIG } from "@/config/pagination";
import {
    useDepartmentsQuery,
    useDeleteDepartmentMutation,
} from "@/hooks/useDepartments";
import ModalDepartment from "./modal.department";
import ViewDepartment from "./view.department";
import PermissionViewModal from "./permissions/ components/PermissionViewModal"; // giữ nguyên vì đã có thật

const { Title } = Typography;

const DepartmentPage = () => {
    const navigate = useNavigate();

    const [openModal, setOpenModal] = useState(false);
    const [openView, setOpenView] = useState(false);
    const [dataInit, setDataInit] = useState<IDepartment | null>(null);

    // Modal Phân quyền (thật)
    const [openPermissionModal, setOpenPermissionModal] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState<{
        id: number;
        name: string;
    } | null>(null);

    // Modal tạm thời cho Danh mục quy trình & Bảng đồ chức danh
    const [openProcessCategoryModal, setOpenProcessCategoryModal] = useState(false);
    const [openPositionChartModal, setOpenPositionChartModal] = useState(false);

    const [searchValue, setSearchValue] = useState("");
    const [query, setQuery] = useState(
        `page=${PAGINATION_CONFIG.DEFAULT_PAGE}&size=${PAGINATION_CONFIG.DEFAULT_PAGE_SIZE}&sort=createdAt,desc`
    );

    const tableRef = useRef<ActionType>(null);
    const { data, isFetching, refetch } = useDepartmentsQuery(query);
    const deleteMutation = useDeleteDepartmentMutation();

    const meta = data?.meta ?? {
        page: PAGINATION_CONFIG.DEFAULT_PAGE,
        pageSize: PAGINATION_CONFIG.DEFAULT_PAGE_SIZE,
        total: 0,
    };
    const departments = data?.result ?? [];

    const buildQuery = (params: any, sort: any) => {
        const q: any = {
            page: params.current,
            size: params.pageSize || PAGINATION_CONFIG.DEFAULT_PAGE_SIZE,
        };
        const filters: string[] = [];
        if (searchValue) filters.push(`(code~'${searchValue}' or name~'${searchValue}')`);
        if (filters.length > 0) q.filter = filters.join(" and ");

        let sortBy = "sort=createdAt,desc";
        if (sort?.code) sortBy = sort.code === "ascend" ? "sort=code,asc" : "sort=code,desc";
        else if (sort?.name) sortBy = sort.name === "ascend" ? "sort=name,asc" : "sort=name,desc";

        return `${queryString.stringify(q, { encode: false })}&${sortBy}`;
    };

    useEffect(() => {
        const q: any = {
            page: PAGINATION_CONFIG.DEFAULT_PAGE,
            size: PAGINATION_CONFIG.DEFAULT_PAGE_SIZE,
            sort: "createdAt,desc",
        };
        if (searchValue) q.filter = `(code~'${searchValue}' or name~'${searchValue}')`;
        setQuery(queryString.stringify(q, { encode: false }));
    }, [searchValue]);

    const handleDelete = async (id: number) => {
        try {
            await deleteMutation.mutateAsync(id);
            refetch();
        } catch { }
    };

    const columns: ProColumns<IDepartment>[] = [
        {
            title: "STT",
            width: 60,
            align: "center",
            render: (_, __, index) =>
                index + 1 + ((meta.page || 1) - 1) * (meta.pageSize || 10),
        },
        {
            title: "Mã phòng ban",
            dataIndex: "code",
            sorter: true,
        },
        {
            title: "Tên phòng ban",
            dataIndex: "name",
            sorter: true,
        },
        {
            title: "Công ty",
            render: (_, record) => record.company?.name || "--",
        },
        {
            title: "Trạng thái",
            align: "center",
            render: (_, record) =>
                record.status === 1 ? (
                    <Badge status="success" text="Hoạt động" />
                ) : (
                    <Badge status="error" text="Ngừng hoạt động" />
                ),
        },
        {
            title: "Hành động",
            align: "center",
            width: 180,
            fixed: "right",
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        type="text"
                        icon={<EyeOutlined style={{ color: "#1677ff", fontSize: 18 }} />}
                        onClick={() => {
                            setDataInit(record);
                            setOpenView(true);
                        }}
                    />
                    <Button
                        type="text"
                        icon={<EditOutlined style={{ color: "#fa8c16", fontSize: 18 }} />}
                        onClick={() => {
                            setDataInit(record);
                            setOpenModal(true);
                        }}
                    />

                    <Dropdown
                        menu={{
                            items: [
                                {
                                    key: "org-chart",
                                    icon: <ApartmentOutlined style={{ color: "#eb2f96" }} />,
                                    label: "Sơ đồ tổ chức",
                                    onClick: () =>
                                        navigate(
                                            `/admin/departments/${record.id}/org-chart?departmentName=${encodeURIComponent(record.name)}`
                                        ),
                                },
                                {
                                    key: "objectives-tasks",
                                    icon: <AimOutlined style={{ color: "#eb2f96" }} />,
                                    label: "Mục tiêu - Nhiệm vụ",
                                    onClick: () =>
                                        navigate(
                                            `/admin/departments/${record.id}/objectives-tasks?departmentName=${encodeURIComponent(record.name)}`
                                        ),
                                },
                                {
                                    key: "permissions",
                                    icon: <LockOutlined style={{ color: "#eb2f96" }} />,
                                    label: "Phân quyền",
                                    onClick: () => {
                                        setSelectedDepartment({ id: record.id!, name: record.name });
                                        setOpenPermissionModal(true);
                                    },
                                },
                                {
                                    key: "process-category",
                                    icon: <FileTextOutlined style={{ color: "#eb2f96" }} />,
                                    label: "Danh mục quy trình",
                                    onClick: () => {
                                        setSelectedDepartment({ id: record.id!, name: record.name });
                                        setOpenProcessCategoryModal(true);
                                    },
                                },
                                {
                                    key: "career-paths",
                                    icon: <RiseOutlined style={{ color: "#eb2f96" }} />,
                                    label: "Lộ trình thăng tiến",
                                    onClick: () =>
                                        navigate(
                                            `/admin/departments/${record.id}/career-paths?departmentName=${encodeURIComponent(record.name)}`
                                        ),
                                },
                                {
                                    key: "salary",
                                    icon: <DollarOutlined style={{ color: "#eb2f96" }} />,
                                    label: "Khung lương",
                                    onClick: () =>
                                        navigate(
                                            `/admin/salary-range/${record.id}?departmentName=${encodeURIComponent(record.name)}`
                                        ),
                                },
                                {
                                    key: "position-chart",
                                    icon: <TeamOutlined style={{ color: "#eb2f96" }} />,
                                    label: "Bảng đồ chức danh",
                                    onClick: () => {
                                        setSelectedDepartment({ id: record.id!, name: record.name });
                                        setOpenPositionChartModal(true);
                                    },
                                },
                                { type: "divider" },
                                {
                                    key: "delete",
                                    icon: <DeleteOutlined style={{ color: "#ff4d4f" }} />,
                                    label: (
                                        <Popconfirm
                                            title="Xác nhận xoá phòng ban này?"
                                            onConfirm={() => handleDelete(record.id!)}
                                            okText="Xoá"
                                            cancelText="Huỷ"
                                            placement="topRight"
                                        >
                                            <span>Xóa phòng ban</span>
                                        </Popconfirm>
                                    ),
                                    danger: true,
                                },
                            ],
                        }}
                        trigger={["click"]}
                        placement="bottomRight"
                    >
                        <Button
                            type="text"
                            icon={
                                <MoreOutlined
                                    style={{
                                        color: "#595959",
                                        fontSize: 18,
                                        transition: "color 0.3s",
                                    }}
                                />
                            }
                            style={{ transition: "background 0.3s, color 0.3s" }}
                            className="hover:bg-pink-50 hover:text-pink-600"
                        />
                    </Dropdown>
                </Space>
            ),
        },
    ];

    // Mock data tạm cho 2 modal
    const mockProcessCategories = [
        { key: "1", code: "QC001", name: "Quy trình tuyển dụng", status: "Hoạt động" },
        { key: "2", code: "QC002", name: "Quy trình nghỉ phép", status: "Hoạt động" },
        { key: "3", code: "QC003", name: "Quy trình đánh giá KPI", status: "Nháp" },
    ];

    const mockPositions = [
        { key: "1", code: "CD01", name: "Trưởng phòng", reportsTo: "Giám đốc", headcount: 1 },
        { key: "2", code: "CD02", name: "Nhân viên kinh doanh", reportsTo: "Trưởng phòng", headcount: 10 },
        { key: "3", code: "CD03", name: "Chuyên viên marketing", reportsTo: "Trưởng phòng", headcount: 5 },
    ];

    const processColumns = [
        { title: "Mã quy trình", dataIndex: "code", key: "code" },
        { title: "Tên quy trình", dataIndex: "name", key: "name" },
        { title: "Trạng thái", dataIndex: "status", key: "status" },
    ];

    const positionColumns = [
        { title: "Mã chức danh", dataIndex: "code", key: "code" },
        { title: "Tên chức danh", dataIndex: "name", key: "name" },
        { title: "Báo cáo cho", dataIndex: "reportsTo", key: "reportsTo" },
        { title: "Số lượng", dataIndex: "headcount", key: "headcount" },
    ];

    return (
        <PageContainer
            title="Quản lý phòng ban"
            filter={
                <SearchFilter
                    searchPlaceholder="Tìm theo mã hoặc tên..."
                    addLabel="Thêm phòng ban"
                    onSearch={setSearchValue}
                    onReset={() => {
                        setSearchValue("");
                        refetch();
                    }}
                    onAddClick={() => {
                        setDataInit(null);
                        setOpenModal(true);
                    }}
                />
            }
        >
            <DataTable<IDepartment>
                actionRef={tableRef}
                rowKey="id"
                loading={isFetching}
                columns={columns}
                dataSource={departments}
                request={async (params, sort) => {
                    const q = buildQuery(params, sort);
                    setQuery(q);
                    return {
                        data: departments,
                        success: true,
                        total: meta.total,
                    };
                }}
                pagination={{
                    defaultPageSize: PAGINATION_CONFIG.DEFAULT_PAGE_SIZE,
                    current: meta.page,
                    pageSize: meta.pageSize,
                    total: meta.total,
                }}
            />

            <ModalDepartment
                openModal={openModal}
                setOpenModal={setOpenModal}
                dataInit={dataInit}
                setDataInit={setDataInit}
            />

            <ViewDepartment
                open={openView}
                onClose={setOpenView}
                dataInit={dataInit}
                setDataInit={setDataInit}
            />

            {/* Modal Phân quyền thật */}
            {selectedDepartment && (
                <PermissionViewModal
                    open={openPermissionModal}
                    onClose={() => setOpenPermissionModal(false)}
                    departmentName={selectedDepartment.name}
                // departmentId={selectedDepartment.id} // nếu cần
                />
            )}

            {/* Modal tạm cho Danh mục quy trình */}
            <Modal
                title={`Danh mục quy trình - ${selectedDepartment?.name || ""}`}
                open={openProcessCategoryModal}
                onCancel={() => setOpenProcessCategoryModal(false)}
                footer={null}
                width={800}
            >
                <Title level={5}>Danh sách quy trình</Title>
                <Table columns={processColumns} dataSource={mockProcessCategories} pagination={false} />
            </Modal>

            {/* Modal tạm cho Bảng đồ chức danh */}
            <Modal
                title={`Bảng đồ chức danh - ${selectedDepartment?.name || ""}`}
                open={openPositionChartModal}
                onCancel={() => setOpenPositionChartModal(false)}
                footer={null}
                width={900}
            >
                <Title level={5}>Danh sách chức danh</Title>
                <Table columns={positionColumns} dataSource={mockPositions} pagination={false} />
            </Modal>
        </PageContainer>
    );
};

export default DepartmentPage;