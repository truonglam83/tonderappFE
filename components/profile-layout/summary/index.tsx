import { IUserImage } from "@/interface/user-interface";
import { UploadOutlined } from "@ant-design/icons";
import { Avatar, Button, DatePicker, Form, Input, Modal, Upload, message, Spin, Image } from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { IUser } from "../../../interface/user-interface";
import profileStyle from "../../../pages/profile/profile.module.scss";
import { AppDispatch } from "../../../redux/configStore";
import { updateInfoUser } from "../../../redux/reducers/userReducer";
import { IFormUpdateInfo } from "../../../types/profileType/index";
import FormItem from "./form-item";
import defaultAvatar from "@/public/images/profile/user-avatar/default-avatar.png";
dayjs.extend(customParseFormat);

type RangeValue = [Dayjs | null, Dayjs | null] | null;
interface ProfileSummaryProps {
    profile: IUser;
}

const ProfileSummary: React.FC<ProfileSummaryProps> = ({ profile }) => {
    const initialInfo: IFormUpdateInfo = {
        name: profile.name,
        age: profile.age,
        avatar: profile.avatar,
    };

    const [infoUser, setInfoUser] = useState<IFormUpdateInfo>(initialInfo);
    const [openForm, setOpenForm] = useState<boolean>(false);
    const [subTitle, setSubTitle] = useState<string | null>(profile.reason);
    const [dates, setDates] = useState<RangeValue>(null);
    const [messageApi, contextHolder] = message.useMessage();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const dispatch: AppDispatch = useDispatch();

    const handleUploadInfo = (values: IUserImage): void => {
        setIsLoading(true);
        if (!values.avatar.file) {
            messageApi.open({
                type: "warning",
                content: "Hãy điền đầy đủ thông tin để cập nhật ",
            });
            return;
        }

        const age: number = moment().diff(values.birthday.$d, "years");
        const infoPayload: IFormUpdateInfo = {
            avatar: values.avatar.file.thumbUrl,
            name: values.name,
            age: age,
        };
        try {
            dispatch(updateInfoUser(infoPayload));
            messageApi.open({
                type: "success",
                content: "Đã cập nhật thông tin thành công",
            });
        } catch (error) {
            messageApi.open({
                type: "error",
                content: "Cập nhật thông tin thất bại",
            });
        }
        setIsLoading(false);
        setInfoUser(infoPayload);
        setOpenForm(false);
    };

    const disabledDate = (current: Dayjs) => {
        if (!dates) {
            return false;
        }
        const today = moment();
        return current && current >= today;
    };

    const onOpenChange = (open: boolean) => {
        if (open) {
            setDates([null, null]);
        } else {
            setDates(null);
        }
    };

    const modalProps = {
        title: "Cập nhật hồ sơ",
        content: (
            <Form onFinish={handleUploadInfo}>
                {isLoading && (
                    <Spin tip="Loading">
                        <div className="content" />
                    </Spin>
                )}
                <FormItem
                    message="Hãy chọn ảnh đại diện!"
                    name="avatar"
                    initialValue={profile?.avatar}
                    label="Ảnh đại diện"
                >
                    <Upload accept=".jpg,.jpeg,.png" name="avatar" maxCount={1} listType="picture">
                        <Button icon={<UploadOutlined />}>Chỉnh sửa ảnh đại diện</Button>
                    </Upload>
                </FormItem>

                <FormItem message="Hãy nhập tên!" name="name" initialValue={profile?.name} label="Tên">
                    <Input placeholder="name" />
                </FormItem>

                <FormItem message="Hãy nhập ngày sinh!" name="birthday" label="Ngày sinh">
                    <DatePicker
                        style={{ width: "100%" }}
                        format={"DD/MM/YYYY"}
                        placeholder="Hãy chọn ngày tháng năm sinh của bạn"
                        disabledDate={disabledDate}
                        onOpenChange={onOpenChange}
                    />
                </FormItem>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Cập nhật
                    </Button>
                </Form.Item>
            </Form>
        ),
        open: openForm,
        onCancel: () => setOpenForm(false),
        footer: false,
    };

    useEffect(() => {
        switch (profile.reason) {
            case "dating":
                setSubTitle("Muốn hẹn hò");
                break;
            case "friends":
                setSubTitle("Muốn tâm sự");
                break;
            case "newRelationship":
                setSubTitle("Đang tìm một mối quan hệ mới");
                break;
            default:
                break;
        }
    }, [profile.reason]);

    return (
        <>
            {contextHolder}
            <div className={profileStyle["profile__container--summary"]}>
                <Avatar
                    style={{
                        boxShadow: " 0px 0px 5px 0px rgba(0,0,0,0.5)",
                    }}
                    size="large"
                    icon={
                        <Image
                            src={infoUser.avatar ? infoUser.avatar : defaultAvatar.src}
                            alt=""
                            style={{
                                objectFit: "cover",
                            }}
                        />
                    }
                />
                <div className={profileStyle["profile__container--info"]} onClick={() => setOpenForm(true)}>
                    <div className={profileStyle["profile__container--name"]}>
                        {infoUser.name}, {infoUser.age}t
                    </div>
                    <div className={profileStyle["profile__container--purpose"]}>
                        {profile.reason ? subTitle : `"Hãy cho biết lý do bạn ở đây"`}
                    </div>
                </div>
            </div>

            <Modal {...modalProps}>{modalProps.content}</Modal>
        </>
    );
};

export default ProfileSummary;
