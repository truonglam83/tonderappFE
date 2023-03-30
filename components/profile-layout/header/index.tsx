import { MenuFoldOutlined } from "@ant-design/icons";
import { Button, Modal, Space } from "antd";
import { Dispatch, SetStateAction } from "react";
import profileStyle from "../../../pages/profile/profile.module.scss";

interface IProfileHeader {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    handleLogout: () => void;
}

const ProfileHeader = ({ open, setOpen, handleLogout }: IProfileHeader) => {
    return (
        <div className={profileStyle["profile__container--header"]}>
            <span>Tài khoản</span>

            <Button danger onClick={() => setOpen(!open)} icon={<MenuFoldOutlined />} />

            <Modal
                title="Đăng xuất khỏi tài khoản của bạn"
                centered
                open={open}
                onCancel={() => setOpen(false)}
                footer={null}
                closable={true}
                width={"75%"}
            >
                <Space>
                    <Button onClick={handleLogout} type="primary" block danger>
                        Đăng xuất
                    </Button>
                    <Button onClick={() => setOpen(false)}>Hủy</Button>
                </Space>
            </Modal>
        </div>
    );
};

export default ProfileHeader;
