import { Modal, Table, Typography } from "antd";
import { mockJobTitles } from "./mock-data";

const { Title } = Typography;

interface PositionChartModalProps {
    open: boolean;
    onClose: () => void;
    departmentName: string;
}

const PositionChartModal: React.FC<PositionChartModalProps> = ({
    open,
    onClose,
    departmentName,
}) => {
    const columns = [
        { title: "Mã chức danh", dataIndex: "code", key: "code" },
        { title: "Tên chức danh", dataIndex: "name", key: "name" },
        { title: "Cấp bậc", dataIndex: "level", key: "level" },
        { title: "Báo cáo cho", dataIndex: "reportsTo", key: "reportsTo" },
        { title: "Số lượng", dataIndex: "headcount", key: "headcount" },
    ];

    return (
        <Modal
            title={`Bảng đồ chức danh - ${departmentName}`}
            open={open}
            onCancel={onClose}
            footer={null}
            width={1000}
        >
            <Title level={5}>Danh sách chức danh trong phòng ban</Title>
            <Table
                dataSource={mockJobTitles}
                columns={columns}
                rowKey="id"
                pagination={false}
            />
        </Modal>
    );
};

export default PositionChartModal;